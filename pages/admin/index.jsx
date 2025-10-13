// pages/admin/index.jsx
"use client";
import React from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection, query, where, limit, getCountFromServer, getDocs
} from "firebase/firestore";

export default function AdminHome(){
  // local guard
  React.useEffect(()=>{ try{
    const ok = localStorage.getItem("ue_admin_auth")==="ok" || document.cookie.includes("ue_admin=1");
    if(!ok) location.replace("/admin/login/");
  }catch{} },[]);

  // firebase session (gerçek veri için)
  const [fbUser, setFbUser] = React.useState(null);
  React.useEffect(()=> onAuthStateChanged(auth, u=>setFbUser(u)), []);

  // sayılar
  const [counts, setCounts] = React.useState({orders:"—", pending:"—", open:"—", payments:"—", users:"—"});
  // kısa listeler
  const [pendingListings, setPendingListings] = React.useState([]);
  const [openTickets, setOpenTickets] = React.useState([]);
  const [recentOrders, setRecentOrders] = React.useState([]);
  const [err, setErr] = React.useState("");

  React.useEffect(()=>{
    (async()=>{
      setErr("");
      try{
        // counts (rules izin verirse)
        try {
          const o = await getCountFromServer(collection(db,"orders"));
          const l = await getCountFromServer(query(collection(db,"listings"), where("status","==","pending")));
          const s = await getCountFromServer(query(collection(db,"conversations"), where("status","==","open")));
          const p = await getCountFromServer(query(collection(db,"payments"), where("status","==","pending_admin")));
          const u = await getCountFromServer(collection(db,"users"));
          setCounts({orders:o.data().count, pending:l.data().count, open:s.data().count, payments:p.data().count, users:u.data().count});
        } catch { /* izin yoksa sembol kalsın */ }

        // kısa listeler
        try{
          const L = await getDocs(query(collection(db,"listings"), where("status","==","pending"), limit(5)));
          setPendingListings(L.docs.map(d=>({id:d.id, ...d.data()})));
        }catch{}
        try{
          const C = await getDocs(query(collection(db,"conversations"), where("status","==","open"), limit(5)));
          setOpenTickets(C.docs.map(d=>({id:d.id, ...d.data()})));
        }catch{}
        try{
          const O = await getDocs(query(collection(db,"orders"), limit(10)));
          setRecentOrders(O.docs.map(d=>({id:d.id, ...d.data()})));
        }catch{}
      }catch(e){ setErr(e?.message||String(e)); }
    })();
  },[]);

  return (
    <div className="wrap">
      <aside className="side">
        <div className="brand">R · Admin</div>
        <nav className="nav">
          <a className="navBtn on" href="/admin/">Ön Panel</a>
          <a className="navBtn" href="/admin/listings">İlanlar</a>
          <a className="navBtn" href="/admin/orders">Siparişler</a>
          <a className="navBtn" href="/admin/support">Destek</a>
          <a className="navBtn" href="/admin/moderation">Ödemeler</a>
          <a className="navBtn" href="/admin/users">Kullanıcılar</a>
        </nav>
        <button
          className="logout"
          onClick={()=>{
            try{ localStorage.removeItem("ue_admin_auth"); }catch{}
            document.cookie="ue_admin=; Max-Age=0; Path=/; SameSite=Lax; Secure";
            location.href="/admin/login/";
          }}
        >Çıkış</button>
      </aside>

      <main className="main">
        {!fbUser && (
          <div className="warn">
            Gerçek veriyi görmek ve işlem yapmak için <a href="/login">/login</a> ile Firebase’e giriş yapın
            (users/{'{uid}'} → <b>role: "admin"</b> olmalı).
          </div>
        )}

        <h1 style={{fontWeight:800, margin:"0 0 12px"}}>Ön Panel</h1>

        <div className="cards">
          <Card title="Toplam Sipariş" value={counts.orders} href="/admin/orders" />
          <Card title="Onay Bekleyen İlan" value={counts.pending} href="/admin/listings" />
          <Card title="Açık Destek" value={counts.open} href="/admin/support" />
          <Card title="Bekleyen Ödeme" value={counts.payments} href="/admin/moderation" />
          <Card title="Toplam Kullanıcı" value={counts.users} href="/admin/users" />
        </div>

        {err && <div className="err">Hata: {err}</div>}

        <section className="block">
          <div className="blockHd">
            <h2>İlan Onay Kuyruğu</h2>
            <a className="link" href="/admin/listings">Tümünü gör</a>
          </div>
          <Table cols={["ID","Başlık","Satıcı","Fiyat","Oluşturma","İşlem"]}>
            {pendingListings.length===0
              ? <Empty colSpan={6} text="Kuyruk boş."/>
              : pendingListings.map((x)=>(
                <tr key={x.id}>
                  <td className="mono">{x.id}</td>
                  <td>{x.title||"—"}</td>
                  <td>{x.seller_uid||x.seller_id||"—"}</td>
                  <td>{x.price ? `₺${x.price}` : "—"}</td>
                  <td>{x.created_at||"—"}</td>
                  <td><a className="link" href="/admin/listings">İşlem</a></td>
                </tr>
              ))
            }
          </Table>
        </section>

        <section className="block">
          <div className="blockHd">
            <h2>Destek Talepleri</h2>
            <a className="link" href="/admin/support">Tümünü gör</a>
          </div>
          <Table cols={["ID","Konu","Kullanıcı","Son Mesaj","İşlem"]}>
            {openTickets.length===0
              ? <Empty colSpan={5} text="Açık talep yok."/>
              : openTickets.map((c)=>(
                <tr key={c.id}>
                  <td className="mono">{c.id}</td>
                  <td>{c.topic||"—"}</td>
                  <td>{Array.isArray(c.participants)?c.participants.join(", "):"—"}</td>
                  <td>{c.updated_at||"—"}</td>
                  <td><a className="link" href="/admin/support">Aç</a></td>
                </tr>
              ))
            }
          </Table>
        </section>

        <section className="block">
          <h2>Son Siparişler</h2>
          <Table cols={["ID","Alıcı → Satıcı","Tutar","Durum","Tarih","Detay"]}>
            {recentOrders.length===0
              ? <Empty colSpan={6} text="Kayıt yok."/>
              : recentOrders.map(o=>(
                <tr key={o.id}>
                  <td className="mono">{o.id}</td>
                  <td>{o.buyer_uid||"—"} → {o.seller_uid||"—"}</td>
                  <td>{o.amount ? `₺${o.amount}` : "—"}</td>
                  <td>{o.status||"—"}</td>
                  <td>{o.created_at||"—"}</td>
                  <td><a className="link" href="/admin/orders">Gör</a></td>
                </tr>
              ))
            }
          </Table>
        </section>
      </main>

      <Style />
    </div>
  );
}

function Card({title, value, href}) {
  return (
    <a className="card" href={href}>
      <div className="cardT">{title}</div>
      <div className="cardV">{value}</div>
    </a>
  );
}
function Table({cols, children}) {
  return (
    <div className="tableWrap">
      <table className="tbl">
        <thead><tr>{cols.map(c=><th key={c}>{c}</th>)}</tr></thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
function Empty({colSpan=1, text="—"}) {
  return <tr><td colSpan={colSpan} className="empty">{text}</td></tr>;
}
function Style(){
  return (
    <style jsx>{`
      .wrap{display:grid;grid-template-columns:240px 1fr;min-height:100vh;background:#0b0b0b;color:#e5e7eb;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial}
      .side{border-right:1px solid #1f2937;padding:16px;display:flex;flex-direction:column;gap:12px;position:sticky;top:0;height:100vh}
      .brand{font-weight:800;color:#fff;margin-bottom:8px}
      .nav{display:flex;flex-direction:column;gap:6px}
      .navBtn{display:block;padding:10px 12px;border-radius:10px;border:1px solid #1f2937;background:#0f172a;text-decoration:none;color:#e5e7eb}
      .navBtn.on{background:#111827;border-color:#374151}
      .navBtn:hover{background:#0f172a99}
      .logout{margin-top:auto;all:unset;cursor:pointer;padding:10px 12px;border-radius:10px;border:1px solid #ef4444;color:#fff;background:#991b1b;text-align:center}
      .logout:hover{background:#b91c1c}
      .main{padding:20px}
      .cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;margin:0 0 16px}
      .card{display:block;background:#111827;border:1px solid #374151;border-radius:12px;padding:12px;text-decoration:none;color:#e5e7eb}
      .cardT{font-size:12px;color:#94a3b8}
      .cardV{font-size:24px;font-weight:800}
      .block{margin:18px 0}
      .blockHd{display:flex;align-items:center;gap:10px}
      .blockHd h2{margin:0 0 8px;font-size:16px}
      .link{font-size:13px;color:#e5e7eb;text-decoration:none;border:1px solid #374151;padding:6px 10px;border-radius:8px;margin-left:auto}
      .warn{background:#0f172a;border:1px solid #374151;border-radius:12px;padding:12px;margin:0 0 12px}
      .tableWrap{overflow:auto;border:1px solid #1f2937;border-radius:12px}
      .tbl{width:100%;border-collapse:separate;border-spacing:0}
      .tbl th,.tbl td{padding:10px 12px;border-bottom:1px solid #1f2937;font-size:14px;vertical-align:middle}
      .tbl thead th{position:sticky;top:0;background:#0b0b0b}
      .mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px}
      .empty{color:#94a3b8;text-align:center}
      @media(max-width:900px){.wrap{grid-template-columns:1fr}.side{position:static;height:auto;flex-direction:row;flex-wrap:wrap}.logout{margin-top:0}}
    `}</style>
  );
}
