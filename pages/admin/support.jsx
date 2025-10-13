// pages/admin/support.jsx
"use client";
import React from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, limit, getDocs, doc, updateDoc } from "firebase/firestore";

export default function AdminSupport(){
  React.useEffect(()=>{ try{
    const ok = localStorage.getItem("ue_admin_auth")==="ok" || document.cookie.includes("ue_admin=1");
    if(!ok) location.replace("/admin/login/");
  }catch{} },[]);
  React.useEffect(()=> onAuthStateChanged(auth, ()=>{}), []);

  const [tickets, setTickets] = React.useState([]);
  const [qText, setQText] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState("");

  async function loadOpen(){
    setBusy(true); setErr("");
    try{
      const snap = await getDocs(query(collection(db,"conversations"), where("status","==","open"), limit(200)));
      setTickets(snap.docs.map(d=>({id:d.id, ...d.data()})));
    }catch(e){ setErr(e?.message||String(e)); }
    finally{ setBusy(false); }
  }
  React.useEffect(()=>{ loadOpen(); },[]);

  const list = React.useMemo(()=>{
    const q = qText.trim().toLowerCase();
    if(!q) return tickets;
    return tickets.filter(t=>{
      const s = [t.id, t.topic, Array.isArray(t.participants)?t.participants.join(", "):"", t.status].join(" ").toLowerCase();
      return s.includes(q);
    });
  },[tickets,qText]);

  async function closeTicket(t){
    try{ await updateDoc(doc(db,"conversations",t.id), { status:"closed" }); setTickets(x=>x.filter(r=>r.id!==t.id)); }
    catch(e){ alert("Kapanamadı: "+(e?.message||e)); }
  }

  return (
    <Shell active="support">
      <h1>Destek</h1>
      <div className="toolbar">
        <input className="search" placeholder="Konu/UID/katılımcı ara…" value={qText} onChange={e=>setQText(e.target.value)} />
        <div className="spacer" />
        <button className="btn" onClick={loadOpen} disabled={busy}>Yenile</button>
      </div>
      {err && <div className="err">Hata: {err}</div>}
      <div className="tableWrap">
        <table className="tbl">
          <thead><tr><th>ID</th><th>Konu</th><th>Katılımcılar</th><th>Durum</th><th>İşlem</th></tr></thead>
        <tbody>
          {list.length===0 ? <tr><td colSpan={5} className="empty">Açık talep yok.</td></tr> : list.map(t=>(
            <tr key={t.id}>
              <td className="mono">{t.id}</td>
              <td>{t.topic||"—"}</td>
              <td>{Array.isArray(t.participants)?t.participants.join(", "):"—"}</td>
              <td>{t.status||"—"}</td>
              <td className="actions">
                <button className="btn" onClick={()=>closeTicket(t)}>Kapat</button>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
      <Style />
    </Shell>
  );
}

function Shell({active, children}){
  return (
    <div className="wrap">
      <aside className="side">
        <div className="brand">R · Admin</div>
        <nav className="nav">
          <a className="navBtn" href="/admin/">Ön Panel</a>
          <a className="navBtn" href="/admin/listings">İlanlar</a>
          <a className="navBtn" href="/admin/orders">Siparişler</a>
          <a className={"navBtn "+(active==="support"?"on":"")} href="/admin/support">Destek</a>
          <a className="navBtn" href="/admin/moderation">Ödemeler</a>
          <a className="navBtn" href="/admin/users">Kullanıcılar</a>
        </nav>
        <button className="logout" onClick={()=>{
          try{ localStorage.removeItem("ue_admin_auth"); }catch{}
          document.cookie="ue_admin=; Max-Age=0; Path=/; SameSite=Lax; Secure";
          location.href="/admin/login/";}}>Çıkış</button>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}
function Style(){
  return (<style jsx>{`
    .wrap{display:grid;grid-template-columns:240px 1fr;min-height:100vh;background:#0b0b0b;color:#e5e7eb;font-family:system-ui}
    .side{border-right:1px solid #1f2937;padding:16px;display:flex;flex-direction:column;gap:12px;position:sticky;top:0;height:100vh}
    .brand{font-weight:800;color:#fff;margin-bottom:8px}
    .nav{display:flex;flex-direction:column;gap:6px}
    .navBtn{display:block;padding:10px 12px;border-radius:10px;border:1px solid #1f2937;background:#0f172a;text-decoration:none;color:#e5e7eb}
    .navBtn.on{background:#111827;border-color:#374151}
    .logout{margin-top:auto;all:unset;cursor:pointer;padding:10px 12px;border-radius:10px;border:1px solid #ef4444;color:#fff;background:#991b1b;text-align:center}
    .main{padding:20px}
    .toolbar{display:flex;gap:8px;margin:0 0 12px}
    .search{flex:0 0 360px;max-width:100%;background:#0f172a;border:1px solid #334155;border-radius:10px;padding:10px 12px;color:#e5e7eb}
    .spacer{flex:1}
    .btn{all:unset;cursor:pointer;padding:8px 12px;border-radius:10px;border:1px solid #374151;background:#111827}
    .tableWrap{overflow:auto;border:1px solid #1f2937;border-radius:12px}
    .tbl{width:100%;border-collapse:separate;border-spacing:0}
    .tbl th,.tbl td{padding:10px 12px;border-bottom:1px solid #1f2937;font-size:14px;vertical-align:middle}
    .tbl thead th{position:sticky;top:0;background:#0b0b0b}
    .mono{font-family:ui-monospace,Menlo,monospace;font-size:12px}
    .empty{color:#94a3b8;text-align:center}
    .actions{display:flex;gap:6px;flex-wrap:wrap}
  `}</style>);
}
