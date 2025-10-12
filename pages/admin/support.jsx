// /pages/admin/support.jsx
"use client";
import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import useAdminGuard from "@/components/admin/useAdminGuard";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc, doc, getDocs, onSnapshot, orderBy, query, updateDoc, where, serverTimestamp } from "firebase/firestore";

export default function AdminSupport(){
  const { role, ready } = useAdminGuard();
  const [convs, setConvs] = useState([]);
  const [sel, setSel] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");

  useEffect(()=>{ (async()=>{
    const snap = await getDocs(query(collection(db,"conversations"), where("status","in",["open","waiting"])));
    setConvs(snap.docs.map(d=>({id:d.id, ...d.data()})));
  })(); },[]);

  useEffect(()=>{
    if(!sel) return;
    return onSnapshot(query(collection(db,"messages"), where("conversationId","==",sel.id), orderBy("ts","asc")), s=>{
      setMsgs(s.docs.map(d=>({id:d.id, ...d.data()})));
    });
  },[sel]);

  if (!ready) return null;
  if (!role) return <div style={{padding:24}}>Yetkiniz yok.</div>;

  const reply = async ()=>{
    const u = auth.currentUser;
    if(!u || !sel || !text.trim()) return;
    await addDoc(collection(db,"messages"), {
      conversationId: sel.id, from: u.uid, text: text.trim(), ts: serverTimestamp()
    });
    setText("");
    await updateDoc(doc(db,"conversations",sel.id), { status: "open", assignedTo: u.uid });
  };

  return (
    <AdminLayout role={role}>
      <h1>Canlı Destek</h1>
      <div style={{display:"grid",gridTemplateColumns:"320px 1fr",gap:12}}>
        <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,padding:8}}>
          {convs.map(c=>(
            <div key={c.id} onClick={()=>setSel(c)} style={{padding:10,borderRadius:8,cursor:"pointer",background: sel?.id===c.id?"#eef2ff":"transparent"}}>
              <div style={{fontWeight:700}}>{c.subject || c.id}</div>
              <div style={{fontSize:12,color:"#475569"}}>{c.status}</div>
            </div>
          ))}
        </div>
        <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,padding:8,display:"grid",gridTemplateRows:"1fr auto",minHeight:360}}>
          <div style={{overflow:"auto"}}>
            {msgs.map(m=>(
              <div key={m.id} style={{margin:"6px 0", textAlign: m.from===auth.currentUser?.uid?"right":"left"}}>
                <span style={{display:"inline-block",padding:"8px 10px",borderRadius:12,background:m.from===auth.currentUser?.uid?"#111":"#f1f5f9",color:m.from===auth.currentUser?.uid?"#fff":"#111"}}>
                  {m.text}
                </span>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:8}}>
            <input value={text} onChange={e=>setText(e.target.value)} placeholder="Yanıt yaz..." style={{flex:1,padding:10,borderRadius:8,border:"1px solid #e5e7eb"}}/>
            <button onClick={reply} style={{padding:"8px 12px",borderRadius:8,border:"1px solid #111",background:"#111",color:"#fff"}}>Gönder</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
