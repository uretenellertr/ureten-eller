// pages/admin/index.jsx
"use client";
import React from "react";
import { db } from "@/lib/firebase";
import {
  collection, query, where, orderBy, limit,
  getCountFromServer, getDocs
} from "firebase/firestore";

export default function AdminHome() {
  // Basit guard (login’de yazdığımız anahtar + cookie)
  React.useEffect(() => {
    try {
      const ok = localStorage.getItem("ue_admin_auth")==="ok" || document.cookie.includes("ue_admin=1");
      if (!ok) window.location.replace("/admin/login/");
    } catch {}
  }, []);

  // Sol menü
  const NAV = [
    {k:"home",     t:"Ön Panel"},
    {k:"listings", t:"İlanlar"},
    {k:"orders",   t:"Siparişler"},
    {k:"support",  t:"Destek"},
    {k:"payments", t:"Ödemeler"},
    {k:"users",    t:"Kullanıcılar"},
  ];
  const [tab, setTab] = React.useState("home");

  // Sayılar (gerçek veriye çalışır; yetki yoksa ‘—’ gösterir)
  const [stats, setStats] = React.useState({
    orders:"—", pendingListings:"—", openSupport:"—", pendingPayments:"—", users:"—",
  });

  // Kısa kuyruklar
  const [pendingList, setPendingList] = React.useState([]);  // listings.pending (ilk 5)
  const [openTickets, setOpenTickets] = React.useState([]);  // conversations.open (ilk 5)
  const [recentOrders, setRecentOrders] = React.useState([]);// orders (son 10)

  React.useEffect(() => {
    (async () => {
      try {
        // Sayımlar
        const o = await getCountFromServer(collection(db,"orders"));
        const l = await getCountFromServer(query(collection(db,"listings"), where("status","==","pending")));
        const s = await getCountFromServer(query(collection(db,"conversations"), where("status","==","open")));
        const p = await getCountFromServer(query(collection(db,"payments"), where("status","in",["pending","pending_admin"])));
        const u = await getCountFromServer(collection(db,"users"));
        setStats({
          orders:o.data().count, pendingListings:l.data().count,
          openSupport:s.data().count, pendingPayments:p.data().count, users:u.data().count
        });
      } catch { /* yetki yoksa sessizce ‘—’ kalır */ }

      try {
        // Bekleyen ilanlar (ilk 5)
        const q1 = query(collection(db,"listings"), where("status","==","pending"), orderBy("created_at","desc"), limit(5));
        const r1 = await getDocs(q1);
        setPendingList(r1.docs.map(d=>({id:d.id, ...d.data()})));
      } catch {}

      try {
        // Açık destek (ilk 5)
        const q2 = query(collection(db,"conversations"), where("status","==","open"), orderBy("updated_at","desc"), limit(5));
        const r2 = await getDocs(q2);
        setOpenTickets(r2.docs.map(d=>({id:d.id, ...d.data()})));
      } catch {}

      try {
        // Son siparişler (10)
        const q3 = query(collection(db,"orders"), orderBy("created_at","desc"), limit(10));
        const r3 = await getDocs(q3);
        setRecentOrders(r3.docs.map(d=>({id:d.id, ...d.data()})));
      } catch {}
    })();
  }, []);

  function logout() {
    try { localStorage.removeItem("ue_admin_auth"); } catch {}
    document.cookie = "ue_admin=; Max-Age=0; Path=/; SameSite=Lax; Secure";
    window.location.replace("/admin/login/");
  }

  return (
    <div className="wrap">
      <aside className="side">
        <div className="brand">R · Admin</div>
        <nav className="nav">
          {NAV.map(x=>(
            <button key={x.k} className={"navBtn"+(tab===x.k?" on":"")} onClick={()=>setTab(x.k)}>
              {x.t}
            </button>
          ))}
        </nav>
        <button className="logout" onClick={logout}>Çıkış</button>
      </aside>

      <main className="main">
        {tab==="home" && <HomeDash stats={stats} pendingList={pendingList} openTickets={openTickets} recentOrders={recentOrders} />}

        {tab==="listings" && (
          <Section title="İlanlar">
            <p className="muted">İlan onayı, vitrine alma / düşürme ve detay işlemleri için <a href="/admin/listings">/admin/listings</a>.</p>
          </Section>
        )}

        {tab==="orders" && (
          <Section title="Siparişler">
            <p className="muted">Tüm siparişler ve durum işlemleri için <a href="/admin/orders">/admin/orders</a>.</p>
          </Section>
        )}

        {tab==="support" && (
          <Section title="Destek">
            <p className="muted">Açık konuşmalar ve mesajlaşma için <a href="/admin/support">/admin/support</a>.</p>
          </Section>
        )}

        {tab==="payments" && (
          <Section title="Ödemeler">
            <p className="muted">Dekont onay/red ve premium/vitrin işlemleri için <a href="/admin/moderation">/admin/moderation</a>.</p>
          </Section>
        )}

        {tab==="users" && (
          <Section title="Kullanıcılar">
            <p className="muted">Tüm kullanıcı listesi, arama ve rol işlemleri için <a href="/admin/users">/admin/users</a>.</p>
          </Section>
        )}
      </main>

      <style jsx>{`
        .wrap{display:grid;grid-template-columns:240px 1fr;min-height:100vh;background:#0b0b0b;color:#e5e7eb;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial}
        .side{border-right:1px solid #1f2937;padding:16px;display:flex;flex-direction:column;gap:12px;position:sticky;top:0;height:100vh}
        .brand{font-weight:800;color:#fff;margin-bottom:8px}
        .nav{display:flex;flex-direction:column;gap:6px}
        .navBtn{all:unset;cursor:pointer;padding:10px 12px;border-radius:10px;border:1px solid #1f2937;background:#0f172a}
        .navBtn.on{background:#111827;border-color:#374151}
        .navBtn:hover{background:#0f172a99}
        .logout{margin-top:auto;all:unset;cursor:pointer;padding:10px 12px;border-radius:10px;border:1px solid #ef4444;color:#fff;background:#991b1b;text-align:center}
        .logout:hover{background:#b91c1c}
        .main{padding:20px}
        .cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;margin-bottom:16px}
        .card{background:#0f172a;border:1px solid #1f2937;border-radius:12px;padding:12px}
        .k{font-size:12px;color:#94a3b8}
        .v{font-size:26px;font-weight:800;color:#fff;margin-top:2px}
        .section{background:#0f172a;border:1px solid #1f2937;border-radius:12px;margin:16px 0}
        .hd{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1f2937;padding:12px 14px}
        .ttl{font-weight:700}
        .link{font-size:13px;color:#e5e7eb;text-decoration:none;border:1px solid #374151;padding:6px 10px;border-radius:8px}
        .tbl{width:100%;border-collapse:separate;border-spacing:0}
        .tbl th,.tbl td{padding:10px 12px;border-bottom:1px solid #1f2937;font-size:14px}
        .empty{padding:14px;color:#94a3b8}
        .muted{color:#94a3b8}
        @media(max-width:900px){.wrap{grid-template-columns:1fr}.side{position:static;height:auto;flex-direction:row;flex-wrap:wrap}.logout{margin-top:0}}
      `}</style>
    </div>
  );
}

function HomeDash({stats, pendingList, openTickets, recentOrders}) {
  return (
    <>
      <h1 style={{fontWeight:800, margin:"0 0 12px"}}>Ön Panel</h1>

      <div className="cards">
        <Card k="Toplam Sipariş" v={stats.orders}/>
        <Card k="Onay Bekleyen İlan" v={stats.pendingListings}/>
        <Card k="Açık Destek" v={stats.openSupport}/>
        <Card k="Bekleyen Ödeme" v={stats.pendingPayments}/>
        <Card k="Toplam Kullanıcı" v={stats.users}/>
      </div>

      <Section title="Bekleyen İşler">
        {/* İlan onay kuyruğu */}
        <Sub title="İlan Onay Kuyruğu" href="/admin/listings">
          {pendingList.length===0 ? (
            <div className="empty">Kuyruk boş.</div>
          ) : (
            <table className="tbl">
              <thead><tr>
                <th>ID</th><th>Başlık</th><th>Satıcı</th><th>Fiyat</th><th>Oluşturma</th><th>İşlem</th>
              </tr></thead>
              <tbody>
                {pendingList.map(it=>(
                  <tr key={it.id}>
                    <td>{it.id}</td>
                    <td>{it.title||"—"}</td>
                    <td>{it.seller_uid||it.seller_id||"—"}</td>
                    <td>{fmtTRY(it.price)}</td>
                    <td>{fmtDate(it.created_at)}</td>
                    <td>
                      <a className="link" href={`/admin/listings?id=${it.id}`}>Onay/Gör</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Sub>

        {/* Destek talepleri */}
        <Sub title="Destek Talepleri" href="/admin/support">
          {openTickets.length===0 ? (
            <div className="empty">Açık talep yok.</div>
          ) : (
            <table className="tbl">
              <thead><tr>
                <th>ID</th><th>Konu</th><th>Kullanıcı</th><th>Son Mesaj</th><th>İşlem</th>
              </tr></thead>
              <tbody>
                {openTickets.map(t=>(
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>{t.subject||"—"}</td>
                    <td>{(t.participants||[]).join(", ")}</td>
                    <td>{fmtDate(t.updated_at)}</td>
                    <td><a className="link" href={`/admin/support?id=${t.id}`}>Aç</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Sub>
      </Section>

      <Section title="Son Siparişler" href="/admin/orders">
        {recentOrders.length===0 ? (
          <div className="empty">Kayıt yok.</div>
        ) : (
          <table className="tbl">
            <thead><tr>
              <th>ID</th><th>Alıcı → Satıcı</th><th>Tutar</th><th>Durum</th><th>Tarih</th><th>Detay</th>
            </tr></thead>
            <tbody>
              {recentOrders.map(o=>(
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.buyer_uid||"?"} → {o.seller_uid||"?"}</td>
                  <td>{fmtTRY(o.amount)}</td>
                  <td>{o.status||"—"}</td>
                  <td>{fmtDate(o.created_at)}</td>
                  <td><a className="link" href={`/admin/orders?id=${o.id}`}>Gör</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>
    </>
  );
}

function Card({k, v}) {
  return (
    <div className="card">
      <div className="k">{k}</div>
      <div className="v">{typeof v==="number" ? new Intl.NumberFormat("tr-TR").format(v) : v}</div>
    </div>
  );
}

function Section({title, href, children}) {
  return (
    <section className="section">
      <div className="hd">
        <div className="ttl">{title}</div>
        {href && <a className="link" href={href}>Tümünü gör</a>}
      </div>
      <div style={{padding:"10px 14px"}}>{children}</div>
    </section>
  );
}

function Sub({title, href, children}) {
  return (
    <div className="section" style={{margin:"12px 0"}}>
      <div className="hd">
        <div className="ttl">{title}</div>
        {href && <a className="link" href={href}>Tümünü gör</a>}
      </div>
      <div style={{padding:"10px 14px"}}>{children}</div>
    </div>
  );
}

function fmtDate(v){
  try{
    if (!v) return "—";
    const d = typeof v==="string" ? new Date(v) : (v?.seconds ? new Date(v.seconds*1000) : new Date(v));
    return d.toLocaleString("tr-TR");
  }catch{ return "—"; }
}
function fmtTRY(v){
  if (typeof v!=="number") return "—";
  return new Intl.NumberFormat("tr-TR",{style:"currency",currency:"TRY",maximumFractionDigits:0}).format(v);
}
