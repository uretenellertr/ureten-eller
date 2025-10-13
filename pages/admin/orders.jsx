// pages/admin/orders.jsx
"use client";
import React from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection, query, limit, startAfter, getDocs
} from "firebase/firestore";

export default function AdminOrders(){
  React.useEffect(()=>{ try{
    const ok = localStorage.getItem("ue_admin_auth")==="ok" || document.cookie.includes("ue_admin=1");
    if(!ok) location.replace("/admin/login/");
  }catch{} },[]);
  React.useEffect(()=> onAuthStateChanged(auth, ()=>{}), []);

  const [rows, setRows] = React.useState([]);
  const [cursor, setCursor] = React.useState(null);
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState("");

  async function load(next=false){
    setBusy(true); setErr("");
    try{
      const base = query(collection(db,"orders"), limit(50));
      const q = next && cursor ? query(base, startAfter(cursor)) : base;
      const snap = await getDocs(q);
      setRows(next ? [...rows, ...snap.docs.map(d=>({id:d.id,...d.data()}))] : snap.docs.map(d=>({id:d.id,...d.data()})));
      setCursor(snap.docs.at(-1) || null);
    }catch(e){ setErr(e?.message||String(e)); }
    finally{ setBusy(false); }
  }
  React.useEffect(()=>{ load(false); },[]);

  return (
    <Shell active="orders">
      <h1>Siparişler</h1>
      <div className="toolbar">
        <div className="spacer" />
        <button className="btn" onClick={()=>load(false)} disabled={busy}>Yenile</button>
        <button className="btn" onClick={()=>load(true)} disabled={busy || !cursor}>Daha fazla</button>
      </div>
      {err && <div className="err">Hata: {err}</div>}
      <div className="tableWrap">
        <table className="tbl">
          <thead><tr><th>ID</th><th>Alıcı → Satıcı</th><th>Tutar</th><th>Durum</th><th>Tarih</th></tr></thead>
          <tbody>
            {rows.length===0 ? <tr><td colSpan={5} className="empty">Kayıt yok.</td></tr> : rows.map(o=>(
              <tr key={o.id}>
                <td className="mono">{o.id}</td>
                <td>{o.buyer_uid||"—"} → {o.seller_uid||"—"}</td>
                <td>{o.amount?`₺${o.amount}`:"—"}</td>
                <td>{o.status||"—"}</td>
                <td>{o.created_at||"—"}</td>
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
          <a className={"navBtn "+(active==="orders"?"on":"")} href="/admin/orders">Siparişler</a>
          <a className="navBtn" href="/admin/support">Destek</a>
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
    .spacer{flex:1}
    .btn{all:unset;cursor:pointer;padding:8px 12px;border-radius:10px;border:1px solid #374151;background:#111827}
    .tableWrap{overflow:auto;border:1px solid #1f2937;border-radius:12px}
    .tbl{width:100%;border-collapse:separate;border-spacing:0}
    .tbl th,.tbl td{padding:10px 12px;border-bottom:1px solid #1f2937;font-size:14px;vertical-align:middle}
    .tbl thead th{position:sticky;top:0;background:#0b0b0b}
    .mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px}
    .empty{color:#94a3b8;text-align:center}
  `}</style>);
}
