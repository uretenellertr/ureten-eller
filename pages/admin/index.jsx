// /pages/admin/index.jsx
"use client";
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import useAdminGuard from "@/components/admin/useAdminGuard";
import { db } from "@/lib/firebase";
import { collection, getCountFromServer, query, where } from "firebase/firestore";

export default function AdminHome(){
  const { role, ready } = useAdminGuard();

  // Admin değilken Firestore'a sorgu atmayalım
  const [stats, setStats] = React.useState({orders:"—", pendingListings:"—", openSupport:"—"});

  React.useEffect(() => {
    if (!ready || role !== "admin") return;
    let alive = true;
    (async () => {
      try {
        const [o, l, s] = await Promise.all([
          getCountFromServer(collection(db,"orders")),
          getCountFromServer(query(collection(db,"listings"), where("status","==","pending"))),
          getCountFromServer(query(collection(db,"conversations"), where("status","==","open"))),
        ]);
        if (alive) setStats({orders:o.data().count, pendingListings:l.data().count, openSupport:s.data().count});
      } catch (e) {
        console.error("admin-counters", e);
      }
    })();
    return () => { alive = false; };
  }, [ready, role]);

  if (!ready) return null;

  // ⬇️ Admin değilse: doğrudan login çağrısı gösteriyoruz
  if (role !== "admin") {
    return (
      <div style={{maxWidth:520, margin:"60px auto", padding:"24px", fontFamily:"system-ui"}}>
        <h1 style={{fontSize:28, fontWeight:800, margin:"0 0 8px"}}>Admin panel</h1>
        <p style={{color:"#475569", margin:"0 0 16px"}}>
          Devam etmek için giriş yapın.
        </p>
        <a
          href="/login?next=/admin/"
          style={{
            display:"inline-block",
            background:"#111827",
            color:"#fff",
            border:"1px solid #111827",
            padding:"10px 14px",
            borderRadius:10,
            fontWeight:800,
            textDecoration:"none"
          }}
        >
          Giriş yap
        </a>
      </div>
    );
  }

  // ⬇️ Admin ise: paneli göster
  return (
    <AdminLayout role={role}>
      <h1>Ön Panel</h1>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12}}>
        <Card title="Toplam Sipariş" value={stats.orders}/>
        <Card title="Onay Bekleyen İlan" value={stats.pendingListings}/>
        <Card title="Açık Destek" value={stats.openSupport}/>
      </div>
    </AdminLayout>
  );
}

function Card({title,value}) {
  return (
    <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,padding:16}}>
      <div style={{fontSize:13,color:"#475569"}}>{title}</div>
      <div style={{fontSize:28,fontWeight:800}}>{value}</div>
    </div>
  );
}
