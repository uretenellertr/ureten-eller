"use client";
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Head from "next/head";
import { createClient } from "@supabase/supabase-js";

/* ---------------- ENV | SUPABASE ---------------- */
let _sb=null;
function sb(){
  if(_sb) return _sb;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if(!url||!key) return null;
  _sb = createClient(url,key);
  return _sb;
}

/* ---------------- UI HELPERS ---------------- */
const fmtDate = (s)=> s ? new Date(s).toLocaleString() : "";
const yesNo = (b)=> b ? "Evet" : "Hayır";

/* ---------------- ADMIN PAGE ---------------- */
export default function AdminPanel(){
  const supa = sb();
  const [me,setMe]=useState(null);
  const [role,setRole]=useState(null);
  const [loading,setLoading]=useState(true);
  const [active,setActive]=useState("inbox"); // inbox | pending | showcase | users | complaints | broadcast
  const [err,setErr]=useState("");
  const audioRef = useRef(null);

  // polling sayaçları (yeni içerikte ses çal)
  const [counts,setCounts]=useState({pending:0, inbox:0, complaints:0});
  const lastCounts = useRef(counts);

  // giriş kontrol
  useEffect(()=>{
    let alive=true;
    (async()=>{
      try{
        if(!supa) { setErr("Supabase yapılandırması eksik."); setLoading(false); return; }
        const { data:{ user } } = await supa.auth.getUser();
        if(!alive) return;
        if(!user){ setErr("Önce giriş yapın."); setLoading(false); return; }
        setMe(user);
        // rol çek
        const { data, error } = await supa.from("users").select("role").eq("auth_user_id", user.id).single();
        if(error){ setErr("Kullanıcı rolü okunamadı."); setLoading(false); return; }
        setRole(data?.role||null);
      }catch(e){
        setErr(e?.message||"Hata");
      }finally{
        if(alive) setLoading(false);
      }
    })();
    return ()=>{alive=false};
  },[supa]);

  const noAdmin = !loading && role!=="admin";

  return (
    <>
      <Head>
<link rel="stylesheet" href="/admin-dark.css?v=1" />
        <title>Admin – Üreten Eller</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <audio ref={audioRef} src="/notify.wav" preload="auto" />

      <div className="admin">
        <aside className="side">
          <div className="brand">
            <img src="/logo.png" width="28" height="28" alt="logo" />
            <b>Yönetim</b>
          </div>

          <nav className="menu">
            <button className={active==="inbox"?"on":""} onClick={()=>setActive("inbox")}><span>💬</span> Mesajlar</button>
            <button className={active==="pending"?"on":""} onClick={()=>setActive("pending")}><span>📝</span> İlan Onayı</button>
            <button className={active==="showcase"?"on":""} onClick={()=>setActive("showcase")}><span>✨</span> Vitrin / PRO</button>
            <button className={active==="users"?"on":""} onClick={()=>setActive("users")}><span>👥</span> Kullanıcılar</button>
            <button className={active==="complaints"?"on":""} onClick={()=>setActive("complaints")}><span>🚩</span> Şikayetler</button>
            <button className={active==="broadcast"?"on":""} onClick={()=>setActive("broadcast")}><span>📣</span> Bildiri Gönder</button>
          </nav>

          <div className="foot">
            {me ? <small>{me.email}</small> : null}
            <button className="logout" onClick={async()=>{ try{ await supa.auth.signOut(); }catch{}; window.location.href="/login"; }}>Çıkış</button>
          </div>
        </aside>

        <main className="main">
          {loading && <div className="card"><div className="muted">Yükleniyor…</div></div>}
          {noAdmin && <div className="card err">Bu sayfayı sadece admin görebilir.</div>}
          {!!err && !loading && !noAdmin && <div className="card err">{err}</div>}

          {!loading && role==="admin" && (
            <>
              {active==="inbox" && <Inbox supa={supa} audioRef={audioRef} counts={counts} setCounts={setCounts} lastCounts={lastCounts} />}
              {active==="pending" && <Pending supa={supa} audioRef={audioRef} counts={counts} setCounts={setCounts} lastCounts={lastCounts} />}
              {active==="showcase" && <ShowcasePro supa={supa} />}
              {active==="users" && <Users supa={supa} />}
              {active==="complaints" && <Complaints supa={supa} audioRef={audioRef} counts={counts} setCounts={setCounts} lastCounts={lastCounts} />}
              {active==="broadcast" && <Broadcast supa={supa} />}
            </>
          )}
        </main>
      </div>

      <style jsx>{`
  /* === KOYU TEMA + AÇIK KAHVERENGİ PARLAK ÇERÇEVE === */
  :root{
    --bg:#0b0b0b;          /* tam siyah arka plan */
    --ink:#f8fafc;         /* beyaz yazı */
    --muted:#cbd5e1;       /* soluk yazı */
    --line:#222;           /* ince ayırıcı */
    --accent:#d4a373;      /* açık kahverengi */
    --accent-soft: rgba(212,163,115,.35); /* parlama */
  }

  html,body,#__next{height:100%}
  body{margin:0;background:var(--bg);color:var(--ink);font-family:system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial,sans-serif}

  .admin{display:grid;grid-template-columns:280px 1fr;min-height:100vh}
  .side{background:#0e0e0e;color:var(--ink);display:flex;flex-direction:column;padding:14px;gap:14px;border-right:2px solid var(--accent);box-shadow:0 0 0 1px var(--accent) inset, 0 0 18px var(--accent-soft)}
  .brand{display:flex;align-items:center;gap:10px;font-size:18px}

  .menu{display:flex;flex-direction:column;gap:8px}
  .menu button{all:unset;display:flex;gap:10px;align-items:center;padding:10px 12px;border-radius:12px;cursor:pointer;color:var(--ink);border:2px solid var(--accent);background:linear-gradient(180deg, rgba(212,163,115,.08), rgba(212,163,115,.02));box-shadow:0 0 0 1px var(--accent) inset, 0 0 10px var(--accent-soft);transition:.2s}
  .menu button.on{background:var(--accent);color:#0b0b0b;font-weight:900}
  .menu button:hover{transform:translateX(2px);box-shadow:0 0 0 1px var(--accent) inset, 0 0 16px var(--accent-soft)}

  .foot{margin-top:auto;display:flex;justify-content:space-between;align-items:center;gap:8px}
  .logout{all:unset;border:2px solid var(--accent);background:transparent;color:var(--ink);padding:8px 12px;border-radius:12px;cursor:pointer;box-shadow:0 0 0 1px var(--accent) inset, 0 0 12px var(--accent-soft)}

  .main{padding:16px;display:grid;gap:16px;align-content:start}
  .card{border-radius:18px;padding:16px;border:2px solid var(--accent);box-shadow:0 0 0 1px var(--accent) inset, 0 0 18px var(--accent-soft);background:rgba(20,20,20,.92)}
  .muted{color:var(--muted)}
  .err{background:#2a0f0f;border-color:#ff9999;color:#ffd1d1}

  .row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}

  /* Form elemanları */
  .input, input[type="text"], input[type="number"], input[type="email"], input[type="password"], textarea, select{
    border:2px solid var(--accent);background:#0f0f0f;color:var(--ink);border-radius:12px;padding:10px 12px;outline:none;box-shadow:0 0 0 1px var(--accent) inset, 0 0 10px var(--accent-soft)
  }
  ::placeholder{color:#9aa4b2}
  select option{background:#fff;color:#111}

  /* Butonlar */
  .btn{border:2px solid var(--accent);background:transparent;color:var(--ink);padding:8px 12px;border-radius:12px;font-weight:800;cursor:pointer;box-shadow:0 0 0 1px var(--accent) inset, 0 0 12px var(--accent-soft);transition:.2s}
  .btn:hover{transform:translateY(-1px);box-shadow:0 0 0 1px var(--accent) inset, 0 0 16px var(--accent-soft)}
  .btn.primary{background:var(--accent);color:#0b0b0b}
  .ghost{border:2px solid var(--accent);background:transparent;color:var(--ink);padding:6px 10px;border-radius:10px;cursor:pointer}

  /* Tablo */
  table{width:100%;border-collapse:separate;border-spacing:0}
  thead th{text-align:left;font-weight:900;padding:10px 12px;background:#131313;color:var(--ink);border-bottom:2px solid var(--accent)}
  tbody td{padding:10px 12px;color:var(--ink);border-bottom:1px solid #1a1a1a}
  tbody tr{background:rgba(255,255,255,.02);border-left:2px solid var(--accent);border-right:2px solid var(--accent)}
  tbody tr:first-child{border-top:2px solid var(--accent)}
  tbody tr:last-child{border-bottom:2px solid var(--accent)}
  tbody tr:hover{background:rgba(212,163,115,.08);box-shadow:inset 0 0 12px var(--accent-soft)}

  @media (max-width:980px){ .admin{grid-template-columns:1fr} .side{position:sticky;top:0;z-index:40} .main{padding:10px} }
`}</style>
    </>
  );
}

/* ---------------- INBOX (Messages) ---------------- */
function Inbox({supa,audioRef,counts,setCounts,lastCounts}){
  const [convs,setConvs]=useState([]);
  const [sel,setSel]=useState(null);
  const [msgs,setMsgs]=useState([]);
  const [text,setText]=useState("");
  const [error,setError]=useState("");

  const load = useCallback(async(play=false)=>{
    try{
      const { data:c } = await supa
        .from("conversations")
        .select("id,buyer_auth_id,seller_auth_id,created_at")
        .order("id",{ascending:false})
        .limit(50);
      setConvs(c||[]);
      const newCount = { ...counts, inbox: (c||[]).length };
      setCounts(newCount);
      if(play && audioRef.current && newCount.inbox> (lastCounts.current.inbox||0)){
        audioRef.current.currentTime=0; audioRef.current.play().catch(()=>{});
      }
      lastCounts.current = newCount;
    }catch(e){ /* sessiz */ }
  },[supa,counts,setCounts,audioRef]);

  const loadMsgs = useCallback(async(id)=>{
    setSel(id);
    const { data:m } = await supa
      .from("messages")
      .select("id,conv_id,sender_auth_id,receiver_auth_id,body,created_at")
      .eq("conv_id", id)
      .order("created_at",{ascending:true})
      .limit(200);
    setMsgs(m||[]);
  },[supa]);

  useEffect(()=>{ load(false); },[load]);
  useEffect(()=>{ const t = setInterval(()=> load(true), 10000); return ()=> clearInterval(t); },[load]);

  async function send(){
    setError("");
    const body = text.trim();
    if(!sel || !body) return;
    try{
      const last = msgs[msgs.length-1];
      let receiver = last ? (last.sender_auth_id) : null;
      if(!receiver){ setError("Alıcı belirlenemedi."); return; }
      const { data:{ user } } = await supa.auth.getUser();
      const payload = { conv_id: sel, sender_auth_id: user.id, receiver_auth_id: receiver, body };
      const { error } = await supa.from("messages").insert(payload);
      if(error) throw error;
      setText("");
      await loadMsgs(sel);
    }catch(e){ setError(e?.message||"Gönderilemedi"); }
  }

  async function delHard(id){
    setError("");
    try{
      const { error } = await supa.rpc("admin_message_delete_hard", { p_msg_id:id });
      if(error) throw error;
      setMsgs((arr)=>arr.filter(x=>x.id!==id));
    }catch(e){ setError(e?.message||"Silinemedi"); }
  }

  return (
    <div className="card">
      <div className="row" style={{justifyContent:"space-between"}}>
        <h3>💬 Mesajlar</h3>
        <button className="ghost" onClick={()=>load(true)}>Yenile</button>
      </div>

      <div className="grid2">
        <div>
          <table className="table">
            <thead><tr><th>ID</th><th>Alıcı/Satıcı</th><th>Oluşturulma</th><th></th></tr></thead>
            <tbody>
              {(convs||[]).map(c=>(
                <tr key={c.id}>
                  <td>#{c.id}</td>
                  <td style={{fontSize:12}}>
                    <div>buyer: <code>{c.buyer_auth_id}</code></div>
                    <div>seller: <code>{c.seller_auth_id}</code></div>
                  </td>
                  <td>{fmtDate(c.created_at)}</td>
                  <td><button className="btn" onClick={()=>loadMsgs(c.id)}>Aç</button></td>
                </tr>
              ))}
              {!convs?.length && <tr><td colSpan={4} className="muted">Konuşma yok.</td></tr>}
            </tbody>
          </table>
        </div>

        <div>
          <div className="row" style={{justifyContent:"space-between"}}>
            <h4>Konuşma #{sel||"-"}</h4>
            <span className="muted">{msgs.length} mesaj</span>
          </div>
          <div style={{maxHeight:360,overflow:"auto",border:"2px solid var(--accent)",borderRadius:10,padding:10,boxShadow:"0 0 0 1px var(--accent) inset, 0 0 10px var(--accent-soft)"}}>
            {msgs.map(m=>(
              <div key={m.id} style={{borderBottom:"1px dashed #3a3a3a",padding:"6px 0"}}>
                <div style={{fontSize:12,color:"#aab4c0"}}>
                  #{m.id} • {fmtDate(m.created_at)}
                </div>
                <div style={{fontSize:12,margin:"4px 0"}}>
                  <b>from</b> <code>{m.sender_auth_id}</code> → <b>to</b> <code>{m.receiver_auth_id}</code>
                </div>
                <div>{m.body}</div>
                <div className="row" style={{marginTop:6}}>
                  <button className="ghost" onClick={()=>delHard(m.id)}>Kalıcı Sil</button>
                </div>
              </div>
            ))}
            {!msgs.length && <div className="muted">Mesaj yok.</div>}
          </div>

          <div className="row" style={{marginTop:10}}>
            <input className="input" style={{flex:1}} placeholder="Yanıt yaz…" value={text} onChange={e=>setText(e.target.value)} />
            <button className="btn" onClick={send}>Gönder</button>
          </div>
          {error && <div className="card" style={{marginTop:8,background:"#2a0f0f",borderColor:"#ff9999",color:"#ffd1d1"}}>{error}</div>}
        </div>
      </div>
    </div>
  );
}

/* ---------------- PENDING (Listings approval) ---------------- */
function Pending({supa,audioRef,counts,setCounts,lastCounts}){
  const [items,setItems]=useState([]);

  const load = useCallback(async(play=false)=>{
    const { data } = await supa
      .from("listings")
      .select("id,title,created_at,city,district,price,currency,status,expires_at,is_showcase")
      .in("status", ["pending"])
      .order("created_at",{ascending:false})
      .limit(100);
    setItems(data||[]);
    const newCount = { ...counts, pending: (data||[]).length };
    setCounts(newCount);
    if(play && audioRef.current && newCount.pending > (lastCounts.current.pending||0)){
      audioRef.current.currentTime=0; audioRef.current.play().catch(()=>{});
    }
    lastCounts.current=newCount;
  },[supa,counts,setCounts,audioRef]);

  useEffect(()=>{ load(false); },[load]);
  useEffect(()=>{ const t=setInterval(()=>load(true),10000); return ()=>clearInterval(t); },[load]);

  async function approve(id){
    const { error } = await supa.from("listings").update({status:"active"}).eq("id",id);
    if(!error) setItems(arr=>arr.filter(x=>x.id!==id));
  }
  async function reject(id){
    const { error } = await supa.from("listings").update({status:"rejected"}).eq("id",id);
    if(!error) setItems(arr=>arr.filter(x=>x.id!==id));
  }

  return (
    <div className="card">
      <div className="row" style={{justifyContent:"space-between"}}>
        <h3>📝 Onay Bekleyen İlanlar</h3>
        <button className="ghost" onClick={()=>load(true)}>Yenile</button>
      </div>

      <table className="table">
        <thead>
          <tr><th>ID</th><th>Başlık</th><th>Konum</th><th>Fiyat</th><th>Durum</th><th>İşlem</th></tr>
        </thead>
        <tbody>
          {(items||[]).map(it=>(
            <tr key={it.id}>
              <td>#{it.id}</td>
              <td>{it.title}</td>
              <td>{it.city} {it.district?`/ ${it.district}`:""}</td>
              <td>{it.price?`${it.price} ${it.currency||"TRY"}`:"-"}</td>
              <td><span>pending</span></td>
              <td className="row">
                <button className="btn" onClick={()=>approve(it.id)}>Onayla</button>
                <button className="ghost" onClick={()=>reject(it.id)}>Reddet</button>
              </td>
            </tr>
          ))}
          {!items?.length && <tr><td colSpan={6} className="muted">Bekleyen ilan yok.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------- SHOWCASE / PRO ---------------- */
function ShowcasePro({supa}){
  const [actives,setActives]=useState([]);
  const [info,setInfo]=useState("");

  const load = useCallback(async()=>{
    const { data } = await supa
      .from("listings")
      .select("id,title,is_showcase,created_at,price,currency,city,status")
      .eq("status","active")
      .order("created_at",{ascending:false})
      .limit(100);
    setActives(data||[]);
  },[supa]);

  useEffect(()=>{ load(); },[load]);

  async function toggleShowcase(it){
    setInfo("");
    const { error } = await supa
      .from("listings")
      .update({ is_showcase: !it.is_showcase })
      .eq("id", it.id);
    if(error){ setInfo(error.message); }
    else load();
  }

  return (
    <div className="card">
      <div className="row" style={{justifyContent:"space-between"}}>
        <h3>✨ Vitrin / PRO</h3>
        <button className="ghost" onClick={()=>load()}>Yenile</button>
      </div>
      {info && <div className="card" style={{marginBottom:8,background:"#2a0f0f",borderColor:"#ff9999",color:"#ffd1d1"}}>{info}</div>}

      <table className="table">
        <thead><tr><th>ID</th><th>Başlık</th><th>Fiyat</th><th>Konum</th><th>Vitrin</th><th></th></tr></thead>
        <tbody>
          {(actives||[]).map(it=>(
            <tr key={it.id}>
              <td>#{it.id}</td>
              <td>{it.title}</td>
              <td>{it.price?`${it.price} ${it.currency||"TRY"}`:"-"}</td>
              <td>{it.city||"-"}</td>
              <td>{yesNo(it.is_showcase)}</td>
              <td><button className="btn" onClick={()=>toggleShowcase(it)}>{it.is_showcase?"Vitrinden Çıkar":"Vitrine Ekle"}</button></td>
            </tr>
          ))}
          {!actives?.length && <tr><td colSpan={6} className="muted">Aktif ilan yok.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------- USERS (roles & PRO) ---------------- */
function Users({supa}){
  const [rows,setRows]=useState([]);
  const [months,setMonths]=useState(12);
  const [info,setInfo]=useState("");

  const load = useCallback(async()=>{
    const { data } = await supa
      .from("users")
      .select("auth_user_id, email, full_name, role, premium_until, created_at")
      .order("created_at",{ascending:false})
      .limit(200);
    setRows(data||[]);
  },[supa]);

  useEffect(()=>{ load(); },[load]);

  async function setRole(uid, newRole){
    setInfo("");
    const { error } = await supa
      .from("users")
      .update({ role:newRole })
      .eq("auth_user_id", uid);
    if(error) setInfo(error.message); else load();
  }

  async function grantPro(uid){
    setInfo("");
    const m = Number(months)||12;
    const tryRpc = await supa.rpc("admin_grant_pro", { p_user_id: uid, p_months:m });
    if(tryRpc.error){
      const { data:cur } = await supa.from("users").select("premium_until").eq("auth_user_id",uid).single();
      const now = new Date();
      const base = cur?.premium_until ? new Date(cur.premium_until) : now;
      const next = new Date(base>now?base:now); next.setMonth(next.getMonth()+m);
      const iso = next.toISOString();
      const { error } = await supa.from("users").update({ premium_until: iso }).eq("auth_user_id", uid);
      if(error){ setInfo(error.message); return; }
    }
    load();
  }

  return (
    <div className="card">
      <div className="row" style={{justifyContent:"space-between"}}>
        <h3>👥 Kullanıcılar</h3>
        <button className="ghost" onClick={()=>load()}>Yenile</button>
      </div>
      {info && <div className="card" style={{marginBottom:8,background:"#2a0f0f",borderColor:"#ff9999",color:"#ffd1d1"}}>{info}</div>}

      <div className="row" style={{marginBottom:8}}>
        <label>PRO ay (varsayılan 12):</label>
        <input className="input" style={{width:90}} type="number" min="1" max="36" value={months} onChange={e=>setMonths(e.target.value)} />
      </div>

      <table className="table">
        <thead><tr><th>E-posta</th><th>Ad</th><th>Rol</th><th>PRO Bitiş</th><th>Kayıt</th><th>İşlem</th></tr></thead>
        <tbody>
          {(rows||[]).map(u=>(
            <tr key={u.auth_user_id}>
              <td>{u.email||"-"}</td>
              <td>{u.full_name||"-"}</td>
              <td><b>{u.role||"user"}</b></td>
              <td>{u.premium_until?fmtDate(u.premium_until):"—"}</td>
              <td>{fmtDate(u.created_at)}</td>
              <td className="row">
                <button className="ghost" onClick={()=>setRole(u.auth_user_id,"user")}>user</button>
                <button className="ghost" onClick={()=>setRole(u.auth_user_id,"moderator")}>moderator</button>
                <button className="ghost" onClick={()=>setRole(u.auth_user_id,"admin")}>admin</button>
                <button className="btn" onClick={()=>grantPro(u.auth_user_id)}>PRO Ver (+{months} ay)</button>
              </td>
            </tr>
          ))}
          {!rows?.length && <tr><td colSpan={6} className="muted">Kayıt yok.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------- COMPLAINTS (optional table: reports) ---------------- */
function Complaints({supa,audioRef,counts,setCounts,lastCounts}){
  const [rows,setRows]=useState([]);
  const [info,setInfo]=useState("");

  const load = useCallback(async(play=false)=>{
    try{
      const { data, error } = await supa
        .from("reports")
        .select("id, created_at, type, ref_id, reporter_auth_id, note, status");
      if(error){ setRows([]); return; }
      setRows(data||[]);
      const newCount = { ...counts, complaints: (data||[]).length };
      setCounts(newCount);
      if(play && audioRef.current && newCount.complaints>(lastCounts.current.complaints||0)){
        audioRef.current.currentTime=0; audioRef.current.play().catch(()=>{});
      }
      lastCounts.current=newCount;
    }catch{ setRows([]); }
  },[supa,counts,setCounts,audioRef]);

  useEffect(()=>{ load(false); },[load]);
  useEffect(()=>{ const t=setInterval(()=>load(true),15000); return ()=>clearInterval(t); },[load]);

  async function mark(id, st){
    setInfo("");
    const { error } = await supa.from("reports").update({ status: st }).eq("id", id);
    if(error) setInfo(error.message); else load(false);
  }

  return (
    <div className="card">
      <div className="row" style={{justifyContent:"space-between"}}>
        <h3>🚩 Şikayetler</h3>
        <button className="ghost" onClick={()=>load(true)}>Yenile</button>
      </div>
      {info && <div className="card" style={{marginBottom:8,background:"#2a0f0f",borderColor:"#ff9999",color:"#ffd1d1"}}>{info}</div>}

      <table className="table">
        <thead><tr><th>ID</th><th>Tür</th><th>Referans</th><th>Rapor Eden</th><th>Not</th><th>Durum</th><th></th></tr></thead>
        <tbody>
          {(rows||[]).map(r=>(
            <tr key={r.id}>
              <td>#{r.id}</td>
              <td>{r.type||"-"}</td>
              <td>{r.ref_id||"-"}</td>
              <td><code>{r.reporter_auth_id}</code></td>
              <td>{r.note||"-"}</td>
              <td>{r.status||"open"}</td>
              <td className="row">
                <button className="ghost" onClick={()=>mark(r.id,"in_review")}>İncele</button>
                <button className="btn" onClick={()=>mark(r.id,"closed")}>Kapattım</button>
              </td>
            </tr>
          ))}
          {!rows?.length && <tr><td colSpan={7} className="muted">Şikayet yok (veya tablo yok).</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------- BROADCAST ---------------- */
function Broadcast({supa}){
  const [title,setTitle]=useState("");
  const [body,setBody]=useState("");
  const [info,setInfo]=useState("");

  async function send(){
    setInfo("");
    if(!title.trim()||!body.trim()){ setInfo("Başlık ve mesaj zorunlu."); return; }
    const { error } = await supa.from("broadcasts").insert({ title, body });
    if(error){ setInfo("Broadcast tablosu yoksa: admin kullanıcılarına e-posta veya push entegre edin."); return; }
    setTitle(""); setBody(""); setInfo("Gönderildi.");
  }

  return (
    <div className="card">
      <h3>📣 Bildiri Gönder</h3>
      <div className="row" style={{marginTop:8}}>
        <input className="input" style={{flex:1}} placeholder="Başlık" value={title} onChange={e=>setTitle(e.target.value)} />
      </div>
      <div className="row" style={{marginTop:8}}>
        <textarea className="input" rows={5} style={{width:"100%"}} placeholder="Mesaj içeriği" value={body} onChange={e=>setBody(e.target.value)} />
      </div>
      <div className="row" style={{marginTop:8}}>
        <button className="btn primary" onClick={send}>Gönder</button>
        {info && <div className="muted">{info}</div>}
      </div>
    </div>
  );
}
