// /pages/admin/orders.jsx
"use client";
import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import useAdminGuard from "@/components/admin/useAdminGuard";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, query, limit } from "firebase/firestore";

const STATUSES = ["placed","preparing","shipped","delivered","return","refunded"];

export default function AdminOrders(){
  const { role, ready } = useAdminGuard();
  const [rows, setRows] = useState([]);

  useEffect(()=>{ (async()=>{
    const snap = await getDocs(query(collection(db,"orders"), limit(200)));
    setRows(snap.docs.map(d=>({id:d.id, ...d.data()})));
  })(); },[]);

  if (!ready) return null;
  if (!role) return <div style={{padding:24}}>Yetkiniz yok.</div>;

  const setStatus = async (id, status) => {
    if (role!=="owner") { alert("Sipariş durumunu sadece owner değiştirir."); return; }
    await updateDoc(doc(db,"orders",id), { status, updatedAt: new Date().toISOString() });
    setRows(rows.map(r=>r.id===id?{...r,status}:r));
  };

  return (
    <AdminLayout role={role}>
      <h1>Siparişler</h1>
      <div style={{display:"grid",gap:8}}>
        {rows.map(o=>(
          <div key={o.id} style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,padding:12,display:"grid",gridTemplateColumns:"1fr auto",gap:8}}>
            <div>
              <div style={{fontWeight:700}}>#{o.id} • {o.total}₺</div>
              <div style={{fontSize:12,color:"#475569"}}>{o.status} • {o.buyerId} → {o.sellerId}</div>
            </div>
            <select value={o.status} onChange={e=>setStatus(o.id, e.target.value)} style={{padding:8,borderRadius:8,border:"1px solid #e5e7eb"}}>
              {STATUSES.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
