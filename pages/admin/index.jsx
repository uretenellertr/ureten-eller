"use client";
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
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

/* ---------------- HELPERS ---------------- */
const fmtDate = (s)=> s ? new Date(s).toLocaleString() : "";
const yesNo = (b)=> b ? "Evet" : "Hayır";

/* =================================================
   ADMIN PAGE
================================================= */
export default function AdminPanel(){
  const supa = sb();
  const [me,setMe]=useState(null);
  const [role,setRole]=useState(null);
  const [loading,setLoading]=useState(true);
  // support = Canlı Destek (admin taraflı konuşmalar)
  // usermsgs = Kullanıcı Mesajları (kullanıcı seç, mesaj kutusunu gör)
  // pending, showcase, users, complaints, broadcast
  const [active,setActive]=useState("support");
  const [err,setErr]=useState("");
  const audioRef = useRef(null);

  useEffect(()=>{
    let alive=true;
    (async()=>{
      try{
        if(!supa){ setErr("Supabase yapılandırması eksik."); setLoading(false); return; }
        const { data:{ user } } = await supa.auth.getUser();
        if(!alive) return;
        if(!user){ setErr("Önce giriş yapın."); setLoading(false); return; }
        setMe(user);
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
        <link rel="stylesheet" href="/admin-dark.css?v=2" />
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
            <button className={active==="support"?"on":""} onClick={()=>setActive("support")}><span>📞</span> Canlı Destek</button>
            <button className={active==="usermsgs"?"on":""} onClick={()=>setActive("usermsgs")}><span>💬</span> Kullanıcı Mesajları</button>
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
              {active==="support"   && <LiveSupport supa={supa} audioRef={audioRef} me={me} />}
              {active==="usermsgs"  && <UserMessages supa={supa} audioRef={audioRef} />}
              {active==="pending"   && <Pending supa={supa} />}
              {active==="showcase"  && <ShowcasePro supa={supa} />}
              {active==="users"     && <Users supa={supa} />}
              {active==="complaints"&& <Complaints supa={supa} audioRef={audioRef} />}
              {active==="broadcast" && <Broadcast supa={supa} />}
            </>
          )}
        </main>
      </div>
    </>
  );
}

/* =================================================
   📞 CANLI DESTEK (admin ile olan tüm konuşmalar)
   Kural: buyer_auth_id = admin.id  VEYA seller_auth_id = admin.id
================================================= */
function LiveSupport({supa,audioRef,me}){
  const [convs,setConvs]=useState([]);
  const [sel,setSel]=useState(null);
  const [msgs,setMsgs]=useState([]);
  const [text,setText]=useState("");
  const [error,setError]=useState("");
  const [check,setCheck]=useState({}); // id:true (toplu sil)

  const adminId = me?.id;

  const loadConvs = useCallback(async(play=false)=>{
    if(!adminId) return;
    const { data } = await supa
      .from("conversations")
      .select("id,buyer_auth_id,seller_auth_id,created_at")
      .or(`buyer_auth_id.eq.${adminId},seller_auth_id.eq.${adminId}`)
      .order("id",{ascending:false})
      .limit(200);
    setConvs(data||[]);
    if(play && audioRef.current){ try{ audioRef.current.currentTime=0; audioRef.current.play(); }catch{} }
  },[supa,adminId,audioRef]);

  const loadMsgs = useCallback(async(id)=>{
    setSel(id);
    const { data } = await supa
      .from("messages")
      .select("id,conv_id,sender_auth_id,receiver_auth_id,body,created_at")
      .eq("conv_id", id)
      .order("created_at",{ascending:true})
      .limit(500);
    setMsgs(data||[]);
    setCheck({});
  },[supa]);

  useEffect(()=>{ loadConvs(false); },[loadConvs]);
  useEffect(()=>{ const t=setInterval(()=>loadConvs(true), 9000); return ()=>clearInterval(t); },[loadConvs]);

  async function send(){
    setError("");
    const body = text.trim();
    if(!sel || !body) return;
    try{
      // Alıcı: son mesajın karşı tarafı
      const last = msgs[msgs.length-1];
      let receiver = last ? (last.sender_auth_id) : null;
      // Eğer hiç mesaj yoksa: admin karşı tarafı konudan tespit edemez → buyer/seller’den admin olmayanı seç.
      if(!receiver){
        const c = convs.find(x=>x.id===sel);
        if(!c){ setError("Konuşma bulunamadı."); return; }
        receiver = (c.buyer_auth_id===adminId) ? c.seller_auth_id : c.buyer_auth_id;
      }
      const payload = { conv_id: sel, sender_auth_id: adminId, receiver_auth_id: receiver, body };
      const { error } = await supa.from("messages").insert(payload);
      if(error) throw error;
      setText("");
      await loadMsgs(sel);
    }catch(e){ setError(e?.message||"Gönderilemedi"); }
  }

  async function delOne(id){
    const { error } = await supa.rpc("admin_message_delete_hard", { p_msg_id:id });
    if(!error) setMsgs(arr=>arr.filter(x=>x.id!==id));
  }
  async function delBulk(){
    const ids = Object.keys(check).filter(k=>check[k]).map(Number);
    for(const id of ids){
      // tek tek çağır (hata olsa bile devam)
      await supa.rpc("admin_message_delete_hard", { p_msg_id:id });
    }
    setMsgs(arr=>arr.filter(x=>!check[x.id]));
    setCheck({});
  }

  return (
    <div className="card">
      <div className="row" style={{justifyContent:"space-between"}}>
        <h3>📞 Canlı Destek Konuşmaları (admin taraflı)</h3>
        <button className="ghost" onClick={()=>loadConvs(true)}>Yenile</button>
      </div>

      <div className="grid2">
        <div>
          <table className="table">
            <thead><tr><th>ID</th><th>Buyer/Seller</th><th>Oluşturulma</th><th></th></tr></thead>
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
              {!convs?.length && <tr><td colSpan={4} className="muted">Kayıt yok.</td></tr>}
            </tbody>
          </table>
        </div>

        <div>
          <div className="row" style={{justifyContent:"space-between"}}>
            <h4>Konuşma #{sel||"-"}</h4>
            <div className="row">
              <button className="ghost" onClick={delBulk} disabled={!Object.values(check).some(v=>v)}>Seçili Mesajları Sil</button>
            </div>
          </div>

          <div style={{maxHeight:420,overflow:"auto",border:"2px solid var(--accent)",borderRadius:10,padding:10,boxShadow:"0 0 0 1px var(--accent) inset, 0 0 10px var(--accent-soft)"}}>
            {msgs.map(m=>(
              <div key={m.id} style={{borderBottom:"1px dashed #3a3a3a",padding:"6px 0"}}>
                <div className="row" style={{justifyContent:"space-between"}}>
                  <div style={{fontSize:12,color:"#aab4c0"}}>#{m.id} • {fmtDate(m.created_at)}</div>
                  <label style={{fontSize:12}}>
                    <input type="checkbox" checked={!!check[m.id]} onChange={(e)=>setCheck(x=>({...x,[m.id]:e.target.checked}))} /> seç
                  </label>
                </div>
                <div style={{fontSize:12,margin:"4px 0"}}>
                  <b>from</b> <code>{m.sender_auth_id}</code> → <b>to</b> <code>{m.receiver_auth_id}</code>
                </div>
                <div>{m.body}</div>
                <div className="row" style={{marginTop:6}}>
                  <button className="ghost" onClick={()=>delOne(m.id)}>Kalıcı Sil</button>
                </div>
              </div>
            ))}
            {!msgs.length && <div className="muted">Mesaj yok.</div>}
          </div>

          <div className="row" style={{marginTop:10}}>
            <input className="input" style={{flex:1}} placeholder="Yanıt yaz…" value={text} onChange={e=>setText(e.target.value)} />
            <button className="btn" onClick={send}>Gönder</button>
          </div>
          {error && <div className="err" style={{marginTop:8}}>{error}</div>}
        </div>
      </div>
    </div>
  );
}

/* =================================================
   💬 KULLANICI MESAJLARI
   - Kullanıcıyı ara (email / uuid)
   - Kullanıcının tüm konuşmaları
   - Mesajları gör / toplu sil
================================================= */
function UserMessages({supa,audioRef}){
  const [q,setQ]=useState("");
  const [user,setUser]=useState(null); // {auth_user_id,email,full_name}
  const [convs,setConvs]=useState([]);
  const [sel,setSel]=useState(null);
  const [msgs,setMsgs]=useState([]);
  const [check,setCheck]=useState({});
  const [info,setInfo]=useState("");

  async function findUser(){
    setInfo(""); setUser(null); setConvs([]); setMsgs([]); setSel(null); setCheck({});
    const query = q.trim();
    if(!query){ setInfo("Arama kutusuna e-posta veya UUID girin."); return; }
    let data = null;
    if(query.includes("@")){
      const r = await supa.from("users").select("auth_user_id,email,full_name").ilike("email", query);
      data = r.data && r.data[0];
    }else{
      const r = await supa.from("users").select("auth_user_id,email,full_name").eq("auth_user_id", query).single();
      data = r.data;
    }
    if(!data){ setInfo("Kullanıcı bulunamadı."); return; }
    setUser(data);
    // konuşmalarını çek
    const { data:cs } = await supa
      .from("conversations")
      .select("id,buyer_auth_id,seller_auth_id,created_at")
      .or(`buyer_auth_id.eq.${data.auth_user_id},seller_auth_id.eq.${data.auth_user_id}`)
      .order("id",{ascending:false});
    setConvs(cs||[]);
  }

  const loadMsgs = useCallback(async(id)=>{
    setSel(id);
    const { data:m } = await supa
      .from("messages")
      .select("id,conv_id,sender_auth_id,receiver_auth_id,body,created_at")
      .eq("conv_id", id)
      .order("created_at",{ascending:true})
      .limit(1000);
    setMsgs(m||[]);
    setCheck({});
  },[supa]);

  async function delOne(id){
    await supa.rpc("admin_message_delete_hard", { p_msg_id:id });
    setMsgs(arr=>arr.filter(x=>x.id!==id));
  }
  async function delBulk(){
    const ids = Object.keys(check).filter(k=>check[k]).map(Number);
    for(const id of ids){ await supa.rpc("admin_message_delete_hard", { p_msg_id:id }); }
    setMsgs(arr=>arr.filter(x=>!check[x.id]));
    setCheck({});
  }

  return (
    <div className="card">
      <h3>💬 Kullanıcı Mesajları</h3>

      <div className="row" style={{marginBottom:12}}>
        <input className="input" style={{flex:1}} placeholder="E-posta veya UUID ile ara (ör: ayse@... / 76fb...)" value={q} onChange={e=>setQ(e.target.value)} />
        <button className="btn" onClick={findUser}>Ara</button>
      </div>
      {info && <div className="muted" style={{marginBottom:8}}>{info}</div>}

      {user && (
        <div className="card" style={{marginBottom:12}}>
          <div><b>Kullanıcı:</b> {user.full_name||"-"} — {user.email||"-"}</div>
          <div style={{fontSize:12,opacity:.9}}>UUID: <code>{user.auth_user_id}</code></div>
        </div>
      )}

      <div className="grid2">
        <div>
          <table className="table">
            <thead><tr><th>ID</th><th>Buyer/Seller</th><th>Oluşturma</th><th></th></tr></thead>
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
            <button className="ghost" onClick={delBulk} disabled={!Object.values(check).some(v=>v)}>Seçili Mesajları Sil</button>
          </div>
          <div style={{maxHeight:420,overflow:"auto",border:"2px solid var(--accent)",borderRadius:10,padding:10,boxShadow:"0 0 0 1px var(--accent) inset, 0 0 10px var(--accent-soft)"}}>
            {msgs.map(m=>(
              <div key={m.id} style={{borderBottom:"1px dashed #3a3a3a",padding:"6px 0"}}>
                <div className="row" style={{justifyContent:"space-between"}}>
                  <div style={{fontSize:12,color:"#aab4c0"}}>#{m.id} • {fmtDate(m.created_at)}</div>
                  <label style={{fontSize:12}}>
                    <input type="checkbox" checked={!!check[m.id]} onChange={(e)=>setCheck(x=>({...x,[m.id]:e.target.checked}))} /> seç
                  </label>
                </div>
                <div style={{fontSize:12,margin:"4px 0"}}>
                  <b>from</b> <code>{m.sender_auth_id}</code> → <b>to</b> <code>{m.receiver_auth_id}</code>
                </div>
                <div>{m.body}</div>
                <div className="row" style={{marginTop:6}}>
                  <button className="ghost" onClick={()=>delOne(m.id)}>Kalıcı Sil</button>
                </div>
              </div>
            ))}
            {!msgs.length && <div className="muted">Mesaj yok.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =================================================
   📝 PENDING (İlan Onayı)
================================================= */
function Pending({supa}){
  const [items,setItems]=useState([]);
  const load = useCallback(async()=>{
    const { data } = await supa
      .from("listings")
      .select("id,title,created_at,city,district,price,currency,status,expires_at,is_showcase,seller_auth_id")
      .eq("status","pending")
      .order("created_at",{ascending:false})
      .limit(200);
    setItems(data||[]);
  },[supa]);
  useEffect(()=>{ load(); },[load]);

  async function approve(id){
    const { error } = await supa.from("listings").update({status:"active"}).eq("id",id);
    if(!error) setItems(arr=>arr.filter(x=>x.id!==id));
  }
  async function reject(id){
    const { error } = await supa.from("listings").update({status:"rejected"}).eq("id",id);
    if(!error) setItems(arr=>arr.filter(x=>x.id!==id));
  }
  async function remove(id){
    await supa.from("listings").delete().eq("id",id);
    setItems(arr=>arr.filter(x=>x.id!==id));
  }

  return (
    <div className="card">
      <div className="row" style={{justifyContent:"space-between"}}>
        <h3>📝 Onay Bekleyen İlanlar</h3>
        <button className="ghost" onClick={load}>Yenile</button>
      </div>
      <table className="table">
        <thead><tr><th>ID</th><th>Başlık</th><th>Satıcı</th><th>Konum</th><th>Fiyat</th><th></th></tr></thead>
        <tbody>
          {(items||[]).map(it=>(
            <tr key={it.id}>
              <td>#{it.id}</td>
              <td>{it.title}</td>
              <td><code>{it.seller_auth_id}</code></td>
              <td>{it.city} {it.district?`/ ${it.district}`:""}</td>
              <td>{it.price?`${it.price} ${it.currency||"TRY"}`:"-"}</td>
              <td className="row">
                <button className="btn" onClick={()=>approve(it.id)}>Onayla</button>
                <button className="ghost" onClick={()=>reject(it.id)}>Reddet</button>
                <button className="ghost" onClick={()=>remove(it.id)}>Sil</button>
              </td>
            </tr>
          ))}
          {!items?.length && <tr><td colSpan={6} className="muted">Bekleyen ilan yok.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

/* =================================================
   ✨ SHOWCASE / PRO
================================================= */
function ShowcasePro({supa}){
  const [actives,setActives]=useState([]);
  const [info,setInfo]=useState("");
  const load = useCallback(async()=>{
    const { data } = await supa
      .from("listings")
      .select("id,title,is_showcase,created_at,price,currency,city,status,seller_auth_id")
      .eq("status","active")
      .order("created_at",{ascending:false})
      .limit(200);
    setActives(data||[]);
  },[supa]);
  useEffect(()=>{ load(); },[load]);

  async function toggleShowcase(it){
    setInfo("");
    const { error } = await supa.from("listings").update({ is_showcase: !it.is_showcase }).eq("id", it.id);
    if(error){ setInfo(error.message); } else load();
  }
  async function remove(id){
    await supa.from("listings").delete().eq("id",id);
    setActives(arr=>arr.filter(x=>x.id!==id));
  }

  return (
    <div className="card">
      <div className="row" style={{justifyContent:"space-between"}}>
        <h3>✨ Vitrin / PRO</h3>
        <button className="ghost" onClick={load}>Yenile</button>
      </div>
      {info && <div className="err" style={{marginBottom:8}}>{info}</div>}
      <table className="table">
        <thead><tr><th>ID</th><th>Başlık</th><th>Satıcı</th><th>Fiyat</th><th>Konum</th><th>Vitrin</th><th></th></tr></thead>
        <tbody>
          {(actives||[]).map(it=>(
            <tr key={it.id}>
              <td>#{it.id}</td>
              <td>{it.title}</td>
              <td><code>{it.seller_auth_id}</code></td>
              <td>{it.price?`${it.price} ${it.currency||"TRY"}`:"-"}</td>
              <td>{it.city||"-"}</td>
              <td>{yesNo(it.is_showcase)}</td>
              <td className="row">
                <button className="btn" onClick={()=>toggleShowcase(it)}>{it.is_showcase?"Vitrinden Çıkar":"Vitrine Ekle"}</button>
                <button className="ghost" onClick={()=>remove(it.id)}>Sil</button>
              </td>
            </tr>
          ))}
          {!actives?.length && <tr><td colSpan={7} className="muted">Aktif ilan yok.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

/* =================================================
   👥 KULLANICILAR (Üreten El / Müşteri ayrımı görünüm)
   Basit sınıflandırma: en az 1 ilanı olan → “Üreten El”, yoksa “Müşteri”
================================================= */
function Users({supa}){
  const [rows,setRows]=useState([]);
  const [months,setMonths]=useState(12);
  const [info,setInfo]=useState("");
  const [filter,setFilter]=useState("all"); // all | maker | customer
  const [selUser,setSelUser]=useState(null);
  const [userListings,setUserListings]=useState([]);

  const load = useCallback(async()=>{
    const { data:users } = await supa
      .from("users")
      .select("auth_user_id,email,full_name,role,premium_until,created_at")
      .order("created_at",{ascending:false})
      .limit(300);

    // ilan sayıları (kabaca – N istek, küçük projede yeterli)
    const rows = await Promise.all((users||[]).map(async u=>{
      const { count } = await supa.from("listings").select("id", { count:"exact", head:true }).eq("seller_auth_id", u.auth_user_id);
      return { ...u, listing_count: count||0 };
    }));
    setRows(rows);
  },[supa]);

  useEffect(()=>{ load(); },[load]);

  function filtered(){
    if(filter==="maker") return rows.filter(r=>r.listing_count>0);
    if(filter==="customer") return rows.filter(r=>!r.listing_count);
    return rows;
  }

  async function setRole(uid, newRole){
    setInfo("");
    const { error } = await supa.from("users").update({ role:newRole }).eq("auth_user_id", uid);
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

  async function openProfile(u){
    setSelUser(u);
    const { data } = await supa
      .from("listings")
      .select("id,title,status,is_showcase,price,currency,city,created_at")
      .eq("seller_auth_id", u.auth_user_id)
      .order("created_at",{ascending:false})
      .limit(300);
    setUserListings(data||[]);
  }

  async function approveListing(id){
    await supa.from("listings").update({status:"active"}).eq("id",id);
    setUserListings(arr=>arr.map(x=>x.id===id?{...x,status:"active"}:x));
  }
  async function rejectListing(id){
    await supa.from("listings").update({status:"rejected"}).eq("id",id);
    setUserListings(arr=>arr.map(x=>x.id===id?{...x,status:"rejected"}:x));
  }
  async function delListing(id){
    await supa.from("listings").delete().eq("id",id);
    setUserListings(arr=>arr.filter(x=>x.id!==id));
  }

  return (
    <div className="card">
      <div className="row" style={{justifyContent:"space-between"}}>
        <h3>👥 Kullanıcılar</h3>
        <div className="row">
          <label style={{fontSize:12}}>Filtre:</label>
          <select className="input" value={filter} onChange={e=>setFilter(e.target.value)}>
            <option value="all">Hepsi</option>
            <option value="maker">Üreten El (ilanı olan)</option>
            <option value="customer">Müşteri (ilanı olmayan)</option>
          </select>
          <button className="ghost" onClick={load}>Yenile</button>
        </div>
      </div>
      {info && <div className="err" style={{marginBottom:8}}>{info}</div>}

      <div className="row" style={{marginBottom:8}}>
        <label>PRO ay:</label>
        <input className="input" style={{width:90}} type="number" min="1" max="36" value={months} onChange={e=>setMonths(e.target.value)} />
      </div>

      <table className="table">
        <thead><tr><th>E-posta</th><th>Ad</th><th>Rol</th><th>PRO Bitiş</th><th>İlan</th><th>Kayıt</th><th>İşlem</th></tr></thead>
        <tbody>
          {(filtered()||[]).map(u=>(
            <tr key={u.auth_user_id}>
              <td>{u.email||"-"}</td>
              <td>{u.full_name||"-"}</td>
              <td><b>{u.role||"user"}</b></td>
              <td>{u.premium_until?fmtDate(u.premium_until):"—"}</td>
              <td>{u.listing_count||0}</td>
              <td>{fmtDate(u.created_at)}</td>
              <td className="row">
                <button className="ghost" onClick={()=>setRole(u.auth_user_id,"user")}>user</button>
                <button className="ghost" onClick={()=>setRole(u.auth_user_id,"moderator")}>moderator</button>
                <button className="ghost" onClick={()=>setRole(u.auth_user_id,"admin")}>admin</button>
                <button className="btn" onClick={()=>grantPro(u.auth_user_id)}>PRO Ver (+{months})</button>
                <button className="btn" onClick={()=>openProfile(u)}>Profili Aç</button>
              </td>
            </tr>
          ))}
          {!filtered()?.length && <tr><td colSpan={7} className="muted">Kayıt yok.</td></tr>}
        </tbody>
      </table>

      {selUser && (
        <div className="card" style={{marginTop:14}}>
          <h4>👤 Profil • {selUser.full_name||"-"} — {selUser.email||"-"}</h4>
          <div style={{fontSize:12,opacity:.9,marginBottom:8}}>UUID: <code>{selUser.auth_user_id}</code></div>
          <table className="table">
            <thead><tr><th>ID</th><th>Başlık</th><th>Durum</th><th>Vitrin</th><th>Fiyat</th><th>Şehir</th><th></th></tr></thead>
            <tbody>
              {(userListings||[]).map(l=>(
                <tr key={l.id}>
                  <td>#{l.id}</td>
                  <td>{l.title}</td>
                  <td>{l.status}</td>
                  <td>{yesNo(l.is_showcase)}</td>
                  <td>{l.price?`${l.price} ${l.currency||"TRY"}`:"-"}</td>
                  <td>{l.city||"-"}</td>
                  <td className="row">
                    <button className="btn" onClick={()=>approveListing(l.id)}>Onayla</button>
                    <button className="ghost" onClick={()=>rejectListing(l.id)}>Reddet</button>
                    <button className="ghost" onClick={()=>delListing(l.id)}>Sil</button>
                  </td>
                </tr>
              ))}
              {!userListings?.length && <tr><td colSpan={7} className="muted">İlan yok.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* =================================================
   🚩 ŞİKAYETLER
================================================= */
function Complaints({supa,audioRef}){
  const [rows,setRows]=useState([]);
  const [info,setInfo]=useState("");
  const load = useCallback(async(play=false)=>{
    try{
      const { data, error } = await supa.from("reports").select("id, created_at, type, ref_id, reporter_auth_id, note, status");
      if(error){ setRows([]); return; }
      setRows(data||[]);
      if(play && audioRef.current){ try{ audioRef.current.currentTime=0; audioRef.current.play(); }catch{} }
    }catch{ setRows([]); }
  },[supa,audioRef]);
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
      {info && <div className="err" style={{marginBottom:8}}>{info}</div>}
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

/* =================================================
   📣 BİLDİRİ
================================================= */
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
        <button className="btn" onClick={send}>Gönder</button>
        {info && <div className="muted">{info}</div>}
      </div>
    </div>
  );
}
