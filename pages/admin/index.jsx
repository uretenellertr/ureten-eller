// /pages/admin/index.jsx
"use client";
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import useAdminGuard from "@/components/admin/useAdminGuard";
import { db } from "@/lib/firebase";
import { collection, getCountFromServer, query, where } from "firebase/firestore";

export default function AdminHome(){
  const { role, ready } = useAdminGuard();
  if (!ready) return null;
  if (!role) return <div style={{padding:24}}>Yetkiniz yok.</div>;

  const [stats, setStats] = React.useState({orders:0, pendingListings:0, openSupport:0});
  React.useEffect(() => {
    (async () => {
      const o = await getCountFromServer(collection(db,"orders"));
      const l = await getCountFromServer(query(collection(db,"listings"), where("status","==","pending")));
      const s = await getCountFromServer(query(collection(db,"conversations"), where("status","==","open")));
      setStats({orders:o.data().count, pendingListings:l.data().count, openSupport:s.data().count});
    })();
  }, []);

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
  return <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,padding:16}}><div style={{fontSize:13,color:"#475569"}}>{title}</div><div style={{fontSize:28,fontWeight:800}}>{value}</div></div>;
}
