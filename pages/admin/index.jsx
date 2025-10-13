"use client";
import React from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection, query, where, orderBy, limit,
  getCountFromServer, getDocs, doc, getDoc
} from "firebase/firestore";

export default function AdminHome(){
  const [ready, setReady] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);

  const [cards, setCards] = React.useState({
    orders: "—",
    pendingListings: "—",
    openSupport: "—",
    paymentsPending: "—",     // kurallar izin vermezse “—” kalır
    usersTotal: "—",
  });

  const [pendingListings, setPendingListings] = React.useState([]);
  const [openTickets, setOpenTickets] = React.useState([]);
  const [lastOrders, setLastOrders] = React.useState([]);

  // Firebase Auth → users/{uid}.role == "admin" kontrolü
  React.useEffect(()=>{
    const unsub = onAuthStateChanged(auth, async (u)=>{
      if (!u){ setIsAdmin(false); setReady(true); return; }
      try{
        const snap = await getDoc(doc(db,"users",u.uid));
        const role = snap.exists() ? snap.data()?.role : null;
        setIsAdmin(role === "admin");
      }catch{
        setIsAdmin(false);
      }finally{
        setReady(true);
      }
    });
    return ()=>unsub();
  },[]);

  // Sadece admin ise: sayaçlar + tablolar
  React.useEffect(()=>{
    if (!ready || !isAdmin) return;
    let alive = true;
    (async ()=>{
      try{
        const [o, l, s] = await Promise.all([
          getCountFromServer(collection(db,"orders")),
          getCountFromServer(query(collection(db,"listings"), where("status","==","pending"))),
          getCountFromServer(query(collection(db,"conversations"), where("status","==","open"))),
        ]);

        // users toplam (kuralda list izni gerekebilir)
        let usersCount = "—";
        try{
          const u = await getCountFromServer(collection(db,"users"));
          usersCount = u.data().count ?? "—";
        }catch{ /* rules izin vermiyorsa “—” kalır */ }

        // payments bekleyen (opsiyonel: rules yoksa “—” kalsın)
        let payCount = "—";
        try{
          const p = await getCountFromServer(query(collection(db,"payments"), where("status","==","pending_admin")));
          payCount = p.data().count ?? "—";
        }catch{}

        if (!alive) return;
        setCards({
          orders: o.data().count,
          pendingListings: l.data().count,
          openSupport: s.data().count,
          paymentsPending: payCount,
          usersTotal: usersCount,
        });
      }catch{}

      try{
        // İlan onay kuyruğu
        const qL = query(
          collection(db,"listings"),
          where("status","==","pending"),
          orderBy("created_at","desc"),
          limit(5)
        );
        const qsL = await getDocs(qL);
        const rowsL = [];
        qsL.forEach(d => rowsL.push({ id:d.id, ...d.data() }));
        setPendingListings(rowsL);
      }catch{}

      try{
        // Açık destek talepleri
        const qC = query(
          collection(db,"conversations"),
          where("status","==","open"),
          orderBy("updated_at","desc"),
          limit(5)
        );
        const qsC = await getDocs(qC);
        const rowsC = [];
        qsC.forEach(d => rowsC.push({ id:d.id, ...d.data() }));
        setOpenTickets(rowsC);
      }catch{}

      try{
        // Son siparişler
        const qO = query(
          collection(db,"orders"),
          orderBy("created_at","desc"),
          limit(10)
        );
        const qsO = await getDocs(qO);
        const rowsO = [];
        qsO.forEach(d => rowsO.push({ id:d.id, ...d.data() }));
        setLastOrders(rowsO);
      }catch{}
    })();
    return ()=>{ alive=false; };
  },[ready,isAdmin]);

  if (!ready) return null;

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.brand}>ÜRETEN ELLER · <b>Admin</b></div>
        {!isAdmin && (
          <a href="/login?next=/admin/" style={styles.badge}>
            Gerçek veri için giriş yap
          </a>
        )}
      </header>

      <main style={styles.main}>
        {/* Hızlı Bakış */}
        <section>
          <h1 style={styles.h1}>Ön Panel</h1>
          <div style={styles.grid}>
            <StatCard title="Toplam Sipariş" value={cards.orders}/>
            <StatCard title="Onay Bekleyen İlan" value={cards.pendingListings}/>
            <StatCard title="Açık Destek" value={cards.openSupport}/>
            <StatCard title="Bekleyen Ödeme" value={cards.paymentsPending}/>
            <StatCard title="Toplam Kullanıcı" value={cards.usersTotal}/>
          </div>
        </section>

        {/* Bekleyen İşler */}
        <section style={{marginTop:24}}>
          <div style={styles.sectionTitle}>Bekleyen İşler</div>
          <div style={styles.twoCols}>
            {/* İlan Onay Kuyruğu */}
            <div style={styles.tableCard}>
              <div style={styles.tableHead}>
                <div style={styles.tableTitle}>İlan Onay Kuyruğu</div>
                <a href="/admin/listings" style={styles.link}>Tümünü gör</a>
              </div>
              <table style={styles.table}>
                <thead>
                  <tr><th>ID</th><th>Başlık</th><th>Satıcı</th><th>Fiyat</th><th>Oluşturma</th><th>İşlem</th></tr>
                </thead>
                <tbody>
                  {pendingListings.map(row=>(
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.title || "—"}</td>
                      <td>{row.seller_uid || row.seller_id || "—"}</td>
                      <td>{row.price != null ? formatTRY(row.price) : "—"}</td>
                      <td>{fmtDate(row.created_at)}</td>
                      <td>
                        <div style={styles.stackLeft}>
                          <button style={styles.btnApprove}>Onayla</button>
                          <button style={styles.btnReject}>Reddet</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!pendingListings.length && (
                    <tr><td colSpan={6} style={styles.empty}>Kuyruk boş.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Destek Talepleri */}
            <div style={styles.tableCard}>
              <div style={styles.tableHead}>
                <div style={styles.tableTitle}>Destek Talepleri</div>
                <a href="/admin/support" style={styles.link}>Tümünü gör</a>
              </div>
              <table style={styles.table}>
                <thead>
                  <tr><th>ID</th><th>Konu</th><th>Kullanıcı</th><th>Son Mesaj</th><th>İşlem</th></tr>
                </thead>
                <tbody>
                  {openTickets.map(row=>(
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.subject || "—"}</td>
                      <td>{(row.participants && row.participants.join?.(", ")) || "—"}</td>
                      <td>{fmtDate(row.updated_at)}</td>
                      <td>
                        <div style={styles.stackLeft}>
                          <a href={`/admin/support?id=${row.id}`} style={styles.btnGhost}>Aç</a>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!openTickets.length && (
                    <tr><td colSpan={5} style={styles.empty}>Açık talep yok.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Son Siparişler */}
        <section style={{marginTop:24}}>
          <div style={styles.sectionTitle}>Son Siparişler</div>
          <div style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr><th>ID</th><th>Alıcı → Satıcı</th><th>Tutar</th><th>Durum</th><th>Tarih</th><th>Detay</th></tr>
              </thead>
              <tbody>
                {lastOrders.map(row=>(
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{(row.buyer_uid||"—")+" → "+(row.seller_uid||"—")}</td>
                    <td>{row.amount != null ? formatTRY(row.amount) : "—"}</td>
                    <td>{row.status || "—"}</td>
                    <td>{fmtDate(row.created_at)}</td>
                    <td>
                      <div style={styles.stackLeft}>
                        <a href={`/admin/orders?id=${row.id}`} style={styles.btnGhost}>Gör</a>
                      </div>
                    </td>
                  </tr>
                ))}
                {!lastOrders.length && (
                  <tr><td colSpan={6} style={styles.empty}>Kayıt yok.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({title,value}){
  return (
    <div style={styles.card}>
      <div style={styles.cardTitle}>{title}</div>
      <div style={styles.cardValue}>{value}</div>
    </div>
  );
}

const styles = {
  page: { minHeight:"100vh", background:"#0b0b0b", color:"#e5e7eb", fontFamily:"system-ui,-apple-system,Segoe UI,Roboto,Arial", paddingBottom:24 },
  header:{ position:"sticky", top:0, zIndex:10, display:"flex", alignItems:"center", gap:12, padding:"14px 18px", background:"#0b0b0b", borderBottom:"1px solid #1f2937" },
  brand:{ fontWeight:800, letterSpacing:.3 },
  badge:{ marginLeft:"auto", fontSize:12, border:"1px solid #374151", padding:"4px 8px", borderRadius:999, color:"#9ca3af", textDecoration:"none" },
  main:{ maxWidth:1200, margin:"0 auto", padding:"20px" },
  h1:{ fontSize:22, fontWeight:800, margin:"0 0 12px" },
  grid:{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px,1fr))", gap:12 },
  card:{ background:"#0f0f10", border:"1px solid #1f2937", borderRadius:12, padding:16 },
  cardTitle:{ fontSize:13, color:"#94a3b8" },
  cardValue:{ fontSize:28, fontWeight:900 },
  sectionTitle:{ fontSize:14, color:"#9ca3af", marginBottom:8 },
  twoCols:{ display:"grid", gridTemplateColumns:"1fr", gap:12 },
  tableCard:{ background:"#0f0f10", border:"1px solid #1f2937", borderRadius:12, overflow:"hidden" },
  tableHead:{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 14px", borderBottom:"1px solid #1f2937" },
  tableTitle:{ fontWeight:700 },
  link:{ color:"#93c5fd", textDecoration:"none" },
  table:{ width:"100%", borderCollapse:"collapse" },
  empty:{ padding:"10px 12px", color:"#9ca3af", textAlign:"center" },
  stackLeft:{ display:"flex", flexDirection:"column", alignItems:"flex-start", gap:6 }, /* ← butonlar solda alt alta */
  btnApprove:{ padding:"6px 10px", borderRadius:8, border:"1px solid #065f46", background:"#065f46", color:"#fff", cursor:"pointer" },
  btnReject:{ padding:"6px 10px", borderRadius:8, border:"1px solid #7f1d1d", background:"#7f1d1d", color:"#fff", cursor:"pointer" },
  btnGhost:{ padding:"6px 10px", borderRadius:8, border:"1px solid #374151", background:"transparent", color:"#e5e7eb", textDecoration:"none" },
};

const TRY_FMT = new Intl.NumberFormat("tr-TR",{style:"currency",currency:"TRY", maximumFractionDigits:0});
function formatTRY(v){ try{ return TRY_FMT.format(Number(v)); }catch{ return "₺"+String(v); } }
function tsToMs(ts){
  if (!ts) return null;
  if (typeof ts === "number") return ts;
  if (typeof ts === "string") return Date.parse(ts);
  if (ts?.seconds) return ts.seconds*1000 + Math.floor((ts.nanoseconds||0)/1e6);
  const d = new Date(ts); return d.getTime();
}
function fmtDate(ts){
  const ms = tsToMs(ts); if (!ms) return "—";
  try{ return new Date(ms).toLocaleString("tr-TR"); }catch{ return "—"; }
}
