// components/admin/useAdminGuard.jsx
"use client";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function useAdminGuard() {
  const [role, setRole] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { setRole(null); setReady(true); return; }
      try {
        const snap = await getDoc(doc(db, "roles", u.uid));
        setRole(snap.exists() ? snap.data().role : null);
      } finally { setReady(true); }
    });
    return () => unsub();
  }, []);

  return { role, ready };
}
