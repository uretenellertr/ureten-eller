// /pages/admin/listings.jsx
"use client";
import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import useAdminGuard from "./_guard";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, query, where, limit } from "firebase/firestore";

export default function AdminListings(){
  const { role, ready } = useAdminGuard();
  const [pending, setPending] = useState([]);

  useEffect(()=>{ (async()=>{
    const snap = await getDocs(query(collection(db,"listings"), where("status","==","pending"), limit(200)));
    setPending(snap.docs.map(d=>({id:d.id, ...d.data()})));
  })(); },[]);

  if (!ready) return null;
  if (!role) return <div style={{padding:24}}>Yetkiniz yok.</div>;

  const setStatus = async (id, status) => {
    await updateDoc(doc(db,"listings",id), { status });
    setPending(pending.filter(x=>x.id!==id));
  };

  return (
    <AdminLayout role={role}>
      <h1>İlan Onay</h1>
      <div style={{display:"grid",gap:8}}>
        {pending.map(it=>(
          <div key={it.id} style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,padding:12,display:"grid",gridTemplateColumns:"1fr auto auto",gap:8}}>
            <div>
              <div style={{fontWeight:700}}>{it.title}</div>
              <div style={{fontSize:12,color:"#475569"}}>{it.cat} • {it.city}</div>
            </div>
            <button onClick={()=>setStatus(it.id,"approved")} style={btn()}>Onayla</button>
            <button onClick={()=>setStatus(it.id,"suspended")} style={btnOutline()}>Askıya al</button>
          </div>
        ))}
        {pending.length===0 && <div>Bekleyen ilan yok.</div>}
      </div>
    </AdminLayout>
  );
}
const btn = ()=>({padding:"8px 10px",borderRadius:8,border:"1px solid #111",background:"#111",color:"#fff",cursor:"pointer"});
const btnOutline = ()=>({padding:"8px 10px",borderRadius:8,border:"1px solid #111",background:"#fff",color:"#111",cursor:"pointer"});
