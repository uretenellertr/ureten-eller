// /pages/admin/users.jsx
"use client";
import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import useAdminGuard from "@/components/admin/useAdminGuard";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, setDoc, updateDoc, query, limit } from "firebase/firestore";

export default function AdminUsers(){
  const { role, ready } = useAdminGuard();
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      const snap = await getDocs(query(collection(db,"users"), limit(200)));
      setRows(snap.docs.map(d => ({id:d.id, ...d.data()})));
    })();
  }, []);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if(!t) return rows;
    return rows.filter(r =>
      (r.displayName||"").toLowerCase().includes(t) ||
      (r.email||"").toLowerCase().includes(t)
    );
  }, [rows, q]);

  if (!ready) return null;
  if (!role) return <div style={{padding:24}}>Yetkiniz yok.</div>;

  const togglePremium = async (u) => {
    await updateDoc(doc(db,"users",u.id), {
      premiumStatus: u.premiumStatus === "active" ? "cancelled" : "active",
      premiumUntil: u.premiumStatus === "active" ? null : new Date(Date.now()+1000*60*60*24*30).toISOString(),
    });
    setRows(rows.map(r => r.id===u.id ? {...r, premiumStatus: r.premiumStatus==="active"?"cancelled":"active"} : r));
  };

  const setModerator = async (u, make=true) => {
    if (role !== "owner") return alert("Sadece owner.");
    await setDoc(doc(db,"roles",u.id), make ? {
      role: "moderator", assignedBy: "owner", at: new Date().toISOString(),
    } : {
      role: "", assignedBy: "owner", at: new Date().toISOString(),
    });
    alert(make? "Moderator verildi":"Moderator geri alındı");
  };

  return (
    <AdminLayout role={role}>
      <h1>Kullanıcılar</h1>
      <div style={{display:"flex",gap:8,marginBottom:8}}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="İsim veya e-posta ara" style={{flex:1,padding:10,borderRadius:8,border:"1px solid #e5e7eb"}}/>
      </div>
      <div style={{display:"grid",gap:8}}>
        {filtered.map(u=>(
          <div key={u.id} style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,padding:12,display:"grid",gridTemplateColumns:"1fr auto auto auto",gap:8,alignItems:"center"}}>
            <div>
              <div style={{fontWeight:700}}>{u.displayName || "-"}</div>
              <div style={{fontSize:12,color:"#475569"}}>{u.email}</div>
            </div>
            <div>Premium: <b>{u.premiumStatus || "yok"}</b></div>
            <button onClick={()=>togglePremium(u)} style={btn()}>Premium ver/al</button>
            {role==="owner" && (
              <>
                <button onClick={()=>setModerator(u,true)} style={btn()}>Moderator ata</button>
                <button onClick={()=>setModerator(u,false)} style={btnOutline()}>Geri al</button>
              </>
            )}
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
const btn = ()=>({padding:"8px 10px",borderRadius:8,border:"1px solid #111",background:"#111",color:"#fff",cursor:"pointer"});
const btnOutline = ()=>({padding:"8px 10px",borderRadius:8,border:"1px solid #111",background:"#fff",color:"#111",cursor:"pointer"});
