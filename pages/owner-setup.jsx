// /pages/owner-setup.jsx
"use client";
import React, { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function OwnerSetup() {
  const [uid, setUid] = useState(null);
  const [hasOwner, setHasOwner] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const u = auth.currentUser;
    setUid(u?.uid || null);
    (async () => {
      const snap = await getDoc(doc(db, "meta", "owner"));
      setHasOwner(snap.exists());
    })();
  }, []);

  const claim = async () => {
    try {
      const user = auth.currentUser;
      if (!user) { setMsg("Önce giriş yap."); return; }
      if (user.email !== "ozkank603@gmail.com") { setMsg("Bu sayfa sadece belirlenen e-posta ile çalışır."); return; }
      const ownerRef = doc(db, "meta", "owner");
      const exists = (await getDoc(ownerRef)).exists();
      if (exists) { setMsg("Owner zaten atanmış."); return; }
      // 1) meta/owner
      await setDoc(ownerRef, { ownerUid: user.uid, at: new Date().toISOString() });
      // 2) roles/{uid}
      await setDoc(doc(db, "roles", user.uid), {
        role: "owner",
        assignedBy: user.uid,
        at: new Date().toISOString(),
      });
      setMsg("Owner ayarlandı. Artık /admin kullanabilirsiniz.");
      setHasOwner(true);
    } catch (e) { setMsg("Hata: " + e.message); }
  };

  return (
    <main style={{maxWidth:600,margin:"40px auto",padding:20,background:"#fff",borderRadius:12,border:"1px solid #e5e7eb"}}>
      <h1>Owner Kurulumu</h1>
      <p>Giriş yapan UID: {uid || "-"}</p>
      <p>Durum: {hasOwner ? "Owner VAR" : "Owner YOK"}</p>
      <button disabled={hasOwner} onClick={claim} style={{padding:"10px 14px",borderRadius:8,border:"1px solid #111",cursor:"pointer"}}>
        Owner’ı Kaydet
      </button>
      <p style={{marginTop:12,color:"#334155"}}>{msg}</p>
    </main>
  );
}
