// /pages/admin/moderation.jsx
"use client";
import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import useAdminGuard from "./_guard";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, setDoc, deleteDoc, query, limit } from "firebase/firestore";

export default function AdminModeration(){
  const { role, ready } = useAdminGuard();
  const [mods, setMods] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(()=>{ (async()=>{
    const rs = await getDocs(query(collection(db,"roles"), limit(500)));
    setMods(rs.docs.filter(d=>d.data().role==="moderator").map(d=>({id:d.id, ...d.data()})));
    const us = await getDocs(query(collection(db,"users"), limit(500)));
    setUsers(us.docs.map(d=>({id:d.id, ...d.data()})));
  })(); },[]);

  if (!ready) return null;
  if (!role) return <div style={{padding:24}}>Yetkiniz yok.</div>;
  if (role!=="owner") return <AdminLayout role={role}><div>Sadece owner.</div></AdminLayout>;

  const make = async (uid)=>{ await setDoc(doc(db,"roles",uid), { role:"moderator", assignedBy:"owner", at:new Date().toISOString() }); alert("Atandı"); };
  const revoke = async (uid)=>{ await deleteDoc(doc(db,"roles",uid)); alert("Geri alındı"); };

  return (
    <AdminLayout role={role}>
      <h1>Moderatör Yönetimi</h1>
      <h3>Mevcut Moderatörler</h3>
      <ul>{mods.map(m=><li key={m.id} style={{marginBottom:6}}>{m.id} <button onClick={()=>revoke(m.id)} style={btnOutline()}>Geri al</button></li>)}</ul>
      <h3>Kullanıcılar</h3>
      <ul>{users.map(u=><li key={u.id} style={{marginBottom:6}}>{u.displayName||"-"} • {u.email} <button onClick={()=>make(u.id)} style={btn()}>Moder. ata</button></li>)}</ul>
    </AdminLayout>
  );
}
const btn = ()=>({marginLeft:8,padding:"4px 8px",borderRadius:8,border:"1px solid #111",background:"#111",color:"#fff",cursor:"pointer"});
const btnOutline = ()=>({marginLeft:8,padding:"4px 8px",borderRadius:8,border:"1px solid #111",background:"#fff",color:"#111",cursor:"pointer"});
