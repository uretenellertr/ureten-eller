// /pages/admin/_guard.jsx
"use client";
import React, { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function useAdminGuard() {
  const [role, setRole] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const u = auth.currentUser;
      if (!u) { setRole(null); setReady(true); return; }
      const snap = await getDoc(doc(db, "roles", u.uid));
      if (alive) { setRole(snap.exists() ? snap.data().role : null); setReady(true); }
    })();
    return () => { alive = false; };
  }, []);

  return { role, ready };
}
