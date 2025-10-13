"use client";
import React from "react";

export default function AdminHome(){
  // Yerel "giriş" bilgisi (giriş yapmasan da UI görünsün)
  const [isAdmin, setIsAdmin] = React.useState(false);
  React.useEffect(()=>{
    try{
      const ok = (localStorage.getItem("ue_admin_auth")==="ok") || document.cookie.includes("ue_admin=1");
      setIsAdmin(!!ok);
    }catch{}
  },[]);

  // Sahte özet veriler (Firestore sorgusu YOK; UI göstermek için)
  const stats = [
    { title: "Toplam Sipariş", value: "—" },
    { title: "Onay Bekleyen İlan", value: "—" },
    { title: "Açık Destek", value: "—" },
    { title: "Bekleyen Ödeme", value: "—" },
    { title: "Yeni Kullanıcı (7g)", value: "—" },
  ];

  const pendingListings = [
    { id: "LST-001", title: "El Örgüsü Oyuncak", seller: "satici123", price: "₺450", created_at: "—" },
    { id: "LST-002", title: "Gümüş Bileklik", seller: "silverhand", price: "₺950", created_at: "—" },
  ];
  const openTickets = [
    { id: "TCK-1001", subject: "Ödeme sorunu", user: "mehmet", last: "—" },
    { id: "TCK-1002", subject: "Kargo gecikmesi", user: "ayse", last: "—" },
  ];
  const lastOrders = [
    { id: "ORD-5001", from: "alici → satici123", amount: "₺750", status: "paid", date: "—" },
    { id: "ORD-5002", from: "veli → fatma", amount: "₺1.250", status: "delivered", date: "—" },
  ];

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.brand}>ÜRETEN ELLER · <b>Admin</b></div>
        {!isAdmin && <div style={styles.badge}>Görüntüleme modu</div>}
      </header>

      <main style={styles.main}>
        {/* Hızlı Bakış */}
        <section>
          <h1 style={styles.h1}>Ön Panel</h1>
          <div style={styles.grid}>
            {stats.map((c,i)=>(
              <div key={i} style={styles.card}>
                <div style={styles.cardTitle}>{c.title}</div>
                <div style={styles.cardValue}>{c.value}</div>
              </div>
            ))}
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
                <a href="#" style={styles.link}>Tümünü gör</a>
              </div>
              <table style={styles.table}>
                <thead>
                  <tr><th>ID</th><th>Başlık</th><th>Satıcı</th><th>Fiyat</th><th>Oluşturma</th><th>İşlem</th></tr>
                </thead>
                <tbody>
                  {pendingListings.map(row=>(
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.title}</td>
                      <td>{row.seller}</td>
                      <td>{row.price}</td>
                      <td>{row.created_at}</td>
                      <td>
                        <button style={styles.btnApprove}>Onayla</button>
                        <button style={styles.btnReject}>Reddet</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Destek Talepleri */}
            <div style={styles.tableCard}>
              <div style={styles.tableHead}>
                <div style={styles.tableTitle}>Destek Talepleri</div>
                <a href="#" style={styles.link}>Tümünü gör</a>
              </div>
              <table style={styles.table}>
                <thead>
                  <tr><th>ID</th><th>Konu</th><th>Kullanıcı</th><th>Son Mesaj</th><th>İşlem</th></tr>
                </thead>
                <tbody>
                  {openTickets.map(row=>(
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.subject}</td>
                      <td>{row.user}</td>
                      <td>{row.last}</td>
                      <td><button style={styles.btnGhost}>Aç</button></td>
                    </tr>
                  ))}
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
                    <td>{row.from}</td>
                    <td>{row.amount}</td>
                    <td>{row.status}</td>
                    <td>{row.date}</td>
                    <td><button style={styles.btnGhost}>Gör</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

const styles = {
  page: { minHeight:"100vh", background:"#0b0b0b", color:"#e5e7eb", fontFamily:"system-ui,-apple-system,Segoe UI,Roboto,Arial", paddingBottom:24 },
  header:{ position:"sticky", top:0, zIndex:10, display:"flex", alignItems:"center", gap:12, padding:"14px 18px", background:"#0b0b0b", borderBottom:"1px solid #1f2937" },
  brand:{ fontWeight:800, letterSpacing:.3 },
  badge:{ marginLeft:"auto", fontSize:12, border:"1px solid #374151", padding:"4px 8px", borderRadius:999, color:"#9ca3af" },
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
  btnApprove:{ padding:"6px 10px", borderRadius:8, border:"1px solid #065f46", background:"#065f46", color:"#fff", cursor:"pointer", marginRight:6 },
  btnReject:{ padding:"6px 10px", borderRadius:8, border:"1px solid #7f1d1d", background:"#7f1d1d", color:"#fff", cursor:"pointer" },
  btnGhost:{ padding:"6px 10px", borderRadius:8, border:"1px solid #374151", background:"transparent", color:"#e5e7eb", cursor:"pointer" },
};
