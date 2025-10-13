// pages/admin/users.jsx
"use client";
import React from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection, query, orderBy, limit, startAfter, getDocs,
  updateDoc, doc
} from "firebase/firestore";

export default function AdminUsers() {
  // Basit admin guard (login’de yazdığımız anahtar + cookie)
  React.useEffect(() => {
    try {
      const ok = localStorage.getItem("ue_admin_auth")==="ok" || document.cookie.includes("ue_admin=1");
      if (!ok) window.location.replace("/admin/login/");
    } catch {}
  }, []);

  // Firebase oturum: gerçek veri için gerekli (yoksa sadece uyarı göster)
  const [fbReady, setFbReady] = React.useState(false);
  const [fbUser, setFbUser] = React.useState(null);
  React.useEffect(() => {
    const off = onAuthStateChanged(auth, u => { setFbUser(u); setFbReady(true); });
    return () => off();
  }, []);

  // Liste/Paging
  const [users, setUsers] = React.useState([]);
  const [cursor, setCursor] = React.useState(null);
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState("");

  // Arama (client-side filtreleme)
  const [qText, setQText] = React.useState("");

  async function loadPage(next=false) {
    setErr("");
    setBusy(true);
    try {
      let q;
      // Öncelik: created_at varsa ona göre; yoksa email’e göre
      if (!next) {
        try {
          q = query(collection(db,"users"), orderBy("created_at","desc"), limit(50));
          const snap = await getDocs(q);
          const rows = snap.docs.map(d=>({ id:d.id, ...d.data() }));
          setUsers(rows);
          setCursor(snap.docs.at(-1) || null);
          setBusy(false);
          return;
        } catch { /* alan yoksa fallback */ }
      }
      const base = query(
        collection(db,"users"),
        orderBy("email","asc"),
        limit(50),
      );
      const q2 = next && cursor ? query(base, startAfter(cursor)) : base;
      const snap2 = await getDocs(q2);
      const rows2 = snap2.docs.map(d=>({ id:d.id, ...d.data() }));
      setUsers(next ? [...users, ...rows2] : rows2);
      setCursor(snap2.docs.at(-1) || null);
    } catch(e) {
      setErr(e?.message || String(e));
    } finally {
      setBusy(false);
    }
  }

  React.useEffect(()=>{ if (fbReady && fbUser) loadPage(false); }, [fbReady, fbUser]);

  // İşlemler
  async function setRole(u, role) {
    try {
      await updateDoc(doc(db,"users",u.id), { role });
      setUsers(x=>x.map(r=>r.id===u.id?{...r, role}:r));
    } catch(e) { alert("Rol güncellenemedi: " + (e?.message||e)); }
  }
  async function setStatus(u, status) {
    try {
      await updateDoc(doc(db,"users",u.id), { status });
      setUsers(x=>x.map(r=>r.id===u.id?{...r, status}:r));
    } catch(e) { alert("Durum güncellenemedi: " + (e?.message||e)); }
  }

  // Filtrelenmiş liste
  const list = React.useMemo(()=>{
    const q = qText.trim().toLowerCase();
    if (!q) return users;
    return users.filter(u=>{
      const t = [
        u.id, u.email, u.full_name, u.displayName, u.username, u.handle, u.city, u.status, u.role
      ].filter(Boolean).join(" ").toLowerCase();
      return t.includes(q);
    });
  }, [qText, users]);

  return (
    <div className="wrap">
      <aside className="side">
        <div className="brand">R · Admin</div>
        <nav className="nav">
          <a className="navBtn" href="/admin/">Ön Panel</a>
          <a className="navBtn" href="/admin/listings">İlanlar</a>
          <a className="navBtn" href="/admin/orders">Siparişler</a>
          <a className="navBtn" href="/admin/support">Destek</a>
          <a className="navBtn" href="/admin/moderation">Ödemeler</a>
          <a className="navBtn on" href="/admin/users">Kullanıcılar</a>
        </nav>
        <button
          className="logout"
          onClick={()=>{
            try{ localStorage.removeItem("ue_admin_auth"); }catch{}
            document.cookie="ue_admin=; Max-Age=0; Path=/; SameSite=Lax; Secure";
            location.href="/admin/login/";
          }}
        >Çıkış</button>
      </aside>

      <main className="main">
        <h1 style={{fontWeight:800, margin:"0 0 12px"}}>Kullanıcılar</h1>

        {!fbUser && (
          <div className="warn">
            Gerçek veriyi görmek ve işlem yapmak için <a href="/login">/login</a> sayfasından Firebase hesabınızla giriş yapın
            (hesabınızın <b>users/{'{uid}'} → role = "admin"</b> olması gerekir).
          </div>
        )}

        <div className="toolbar">
          <input
            className="search"
            placeholder="E-posta, ad, UID ara…"
            value={qText}
            onChange={e=>setQText(e.target.value)}
          />
          <div className="spacer" />
          <button className="btn" disabled={busy} onClick={()=>loadPage(false)}>Yenile</button>
          <button className="btn" disabled={busy || !cursor} onClick={()=>loadPage(true)}>Daha fazla</button>
        </div>

        {err && <div className="err">Hata: {err}</div>}

        <div className="tableWrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>UID</th>
                <th>Ad / E-posta</th>
                <th>Şehir</th>
                <th>Rol</th>
                <th>Durum</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {list.length===0 ? (
                <tr><td colSpan={6} className="empty">Kayıt yok.</td></tr>
              ) : list.map(u=>(
                <tr key={u.id}>
                  <td className="mono">{u.id}</td>
                  <td>
                    <div className="strong">{u.full_name || u.displayName || "—"}</div>
                    <div className="muted">{u.email || "—"}</div>
                  </td>
                  <td>{u.city || "—"}</td>
                  <td>{u.role || "user"}</td>
                  <td>{u.status || "active"}</td>
                  <td className="actions">
                    {u.role==="admin"
                      ? <button className="btn" onClick={()=>setRole(u,"user")}>Admin Al</button>
                      : <button className="btn" onClick={()=>setRole(u,"admin")}>Admin Yap</button>}
                    {u.status==="suspended"
                      ? <button className="btn" onClick={()=>setStatus(u,"active")}>Aktif Et</button>
                      : <button className="btn" onClick={()=>setStatus(u,"suspended")}>Askıya Al</button>}
                    <a className="link" href={`/portal/seller/profile?uid=${u.id}`} target="_blank" rel="noreferrer">Profili Aç</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <style jsx>{`
        .wrap{display:grid;grid-template-columns:240px 1fr;min-height:100vh;background:#0b0b0b;color:#e5e7eb;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial}
        .side{border-right:1px solid #1f2937;padding:16px;display:flex;flex-direction:column;gap:12px;position:sticky;top:0;height:100vh}
        .brand{font-weight:800;color:#fff;margin-bottom:8px}
        .nav{display:flex;flex-direction:column;gap:6px}
        .navBtn{display:block;padding:10px 12px;border-radius:10px;border:1px solid #1f2937;background:#0f172a;text-decoration:none;color:#e5e7eb}
        .navBtn.on{background:#111827;border-color:#374151}
        .navBtn:hover{background:#0f172a99}
        .logout{margin-top:auto;all:unset;cursor:pointer;padding:10px 12px;border-radius:10px;border:1px solid #ef4444;color:#fff;background:#991b1b;text-align:center}
        .logout:hover{background:#b91c1c}
        .main{padding:20px}
        .warn{background:#0f172a;border:1px solid #374151;border-radius:12px;padding:12px;margin:0 0 12px}
        .toolbar{display:flex;gap:8px;margin:0 0 12px}
        .search{flex:0 0 360px;max-width:100%;background:#0f172a;border:1px solid #334155;border-radius:10px;padding:10px 12px;color:#e5e7eb}
        .spacer{flex:1}
        .btn{all:unset;cursor:pointer;padding:8px 12px;border-radius:10px;border:1px solid #374151;background:#111827}
        .btn:disabled{opacity:.6;cursor:not-allowed}
        .tableWrap{overflow:auto;border:1px solid #1f2937;border-radius:12px}
        .tbl{width:100%;border-collapse:separate;border-spacing:0}
        .tbl th,.tbl td{padding:10px 12px;border-bottom:1px solid #1f2937;font-size:14px;vertical-align:middle}
        .tbl thead th{position:sticky;top:0;background:#0b0b0b}
        .mono{font-family:ui-monospace, SFMono-Regular, Menlo, monospace;font-size:12px}
        .strong{font-weight:700;color:#fff}
        .muted{color:#94a3b8;font-size:12px}
        .empty{color:#94a3b8;text-align:center}
        .actions{display:flex;gap:6px;flex-wrap:wrap}
        .link{font-size:13px;color:#e5e7eb;text-decoration:none;border:1px solid #374151;padding:6px 10px;border-radius:8px}
        @media(max-width:900px){.wrap{grid-template-columns:1fr}.side{position:static;height:auto;flex-direction:row;flex-wrap:wrap}.logout{margin-top:0}.search{flex:1}}
      `}</style>
    </div>
  );
}
