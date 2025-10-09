"use client";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

// --- Supabase helper
let _sb = null;
function sb() {
  if (_sb) return _sb;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  _sb = createClient(url, key);
  return _sb;
}

// --- Basit format yardımcıları
const fmtDate = (d) => new Date(d).toLocaleString("tr-TR");
const addDaysIso = (days = 30) => new Date(Date.now() + days*24*60*60*1000).toISOString();

export default function AdminPanel() {
  const router = useRouter();
  const supa = sb();

  const [me, setMe] = useState(null); // auth user
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("pending"); // pending | users
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  // data
  const [pending, setPending] = useState([]);
  const [users, setUsers] = useState([]);

  // filters
  const [uQuery, setUQuery] = useState("");
  const [grantMonths, setGrantMonths] = useState(12);

  // --- giriş kontrolü
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (!supa) return;
        const { data: { user } } = await supa.auth.getUser();
        if (!alive) return;
        if (!user) {
          setLoading(false);
          return; // login form gösterilecek
        }
        setMe(user);
        // rol kontrol
        const { data: rec, error } = await supa
          .from("users")
          .select("role")
          .eq("auth_user_id", user.id)
          .single();
        if (error) throw error;
        const admin = rec?.role === "admin";
        setIsAdmin(admin);
        if (admin) {
          await fetchPending();
        }
      } catch (e) {
        setErr(e.message || "Hata");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [supa]);

  const fetchPending = useCallback(async () => {
    setErr("");
    const { data, error } = await supa
      .from("listings")
      .select("id, title, description, price, currency, city, district, created_at, is_showcase, seller_auth_id")
      .in("status", ["pending"]) // sadece bekleyenler
      .order("created_at", { ascending: false });
    if (error) { setErr(error.message); return; }
    setPending(data || []);
  }, [supa]);

  const fetchUsers = useCallback(async () => {
    setErr("");
    let q = supa.from("users").select("auth_user_id, email, full_name, role, premium_until").order("created_at", { ascending:false });
    if (uQuery.trim()) {
      q = q.ilike("email", `%${uQuery.trim()}%`);
    }
    const { data, error } = await q;
    if (error) { setErr(error.message); return; }
    setUsers(data || []);
  }, [supa, uQuery]);

  // --- giriş
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const onLogin = async (e) => {
    e.preventDefault(); setErr(""); setMsg("");
    try {
      const { error } = await supa.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.replace("/admin");
    } catch (e) { setErr(e.message || "Giriş başarısız"); }
  };

  const onLogout = async () => { try { await supa.auth.signOut(); } catch{}; router.replace("/"); };

  // --- İŞLEMLER: ilan onay/ret, vitrin kaldır
  const approveListing = async (id) => {
    setErr(""); setMsg("");
    const { error } = await supa
      .from("listings")
      .update({ status: "active", expires_at: addDaysIso(30) })
      .eq("id", id);
    if (error) { setErr(error.message); return; }
    setMsg(`#${id} onaylandı`); fetchPending();
  };

  const rejectListing = async (id) => {
    setErr(""); setMsg("");
    const { error } = await supa
      .from("listings")
      .update({ status: "rejected" })
      .eq("id", id);
    if (error) { setErr(error.message); return; }
    setMsg(`#${id} reddedildi`); fetchPending();
  };

  const clearShowcase = async (id) => {
    setErr(""); setMsg("");
    const { error } = await supa
      .from("listings")
      .update({ is_showcase: false })
      .eq("id", id);
    if (error) { setErr(error.message); return; }
    setMsg(`#${id} vitrin kaldırıldı`); fetchPending();
  };

  // --- Kullanıcı işlemleri: PRO ver / admin yap / admin al
  const grantPro = async (mail) => {
    setErr(""); setMsg("");
    // RPC varsa onu kullan (yarın öbür gün log vs. için iyi)
    const { error } = await supa.rpc("admin_grant_pro_by_email", { p_email: mail, p_months: grantMonths });
    if (error) { setErr(error.message); return; }
    setMsg(`${mail} → ${grantMonths} ay PRO verildi`);
    fetchUsers();
  };

  const makeAdmin = async (auth_user_id) => {
    setErr(""); setMsg("");
    const { error } = await supa.from("users").update({ role: "admin" }).eq("auth_user_id", auth_user_id);
    if (error) { setErr(error.message); return; }
    setMsg(`Yetki verildi (admin)`);
    fetchUsers();
  };

  const removeAdmin = async (auth_user_id) => {
    setErr(""); setMsg("");
    const { error } = await supa.from("users").update({ role: null }).eq("auth_user_id", auth_user_id);
    if (error) { setErr(error.message); return; }
    setMsg(`Admin yetkisi alındı`);
    fetchUsers();
  };

  // --- UI ---
  return (
    <>
      <Head>
        <title>Admin Paneli · Üreten Eller</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <header className="top">
        <div className="brand" onClick={() => router.push("/")}>🛠️ Admin · Üreten Eller</div>
        {isAdmin ? (
          <div className="actions">
            <button className={tab === "pending" ? "tab active" : "tab"} onClick={() => { setTab("pending"); fetchPending(); }}>Bekleyen İlanlar</button>
            <button className={tab === "users" ? "tab active" : "tab"} onClick={() => { setTab("users"); fetchUsers(); }}>Kullanıcılar</button>
            <button className="logout" onClick={onLogout}>Çıkış</button>
          </div>
        ) : (
          <div className="actions"><button className="logout" onClick={onLogout}>Ana Sayfa</button></div>
        )}
      </header>

      <main className="wrap">
        {!me || !isAdmin ? (
          <section className="card login">
            <h1>Admin Giriş</h1>
            <form onSubmit={onLogin} className="grid">
              <label>E‑posta</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@mail.com" required />
              <label>Şifre</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required />
              <button type="submit" className="primary">Giriş Yap</button>
            </form>
            {loading && <div className="muted">Oturum kontrol ediliyor…</div>}
            {err && <div className="err">{err}</div>}
          </section>
        ) : (
          <>
            {msg && <div className="msg">{msg}</div>}
            {err && <div className="err">{err}</div>}

            {tab === "pending" && (
              <section className="card">
                <h2>Bekleyen İlanlar</h2>
                {!pending.length && <div className="muted">Bekleyen ilan yok.</div>}
                <div className="table">
                  <div className="row head">
                    <div>#</div>
                    <div>Başlık</div>
                    <div>Fiyat</div>
                    <div>Konum</div>
                    <div>Vitrin</div>
                    <div>Tarih</div>
                    <div>İşlem</div>
                  </div>
                  {pending.map(it => (
                    <div className="row" key={it.id}>
                      <div>#{it.id}</div>
                      <div className="ell">{it.title}</div>
                      <div>{it.price ?? "-"} {it.currency}</div>
                      <div>{it.city}{it.district ? ` / ${it.district}` : ""}</div>
                      <div>{it.is_showcase ? "Evet" : "Hayır"}</div>
                      <div>{fmtDate(it.created_at)}</div>
                      <div className="ops">
                        <button onClick={() => approveListing(it.id)} className="ok">Onayla</button>
                        <button onClick={() => rejectListing(it.id)} className="no">Reddet</button>
                        {it.is_showcase && (
                          <button onClick={() => clearShowcase(it.id)} className="ghost">Vitrin Kaldır</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {tab === "users" && (
              <section className="card">
                <h2>Kullanıcılar</h2>
                <div className="userbar">
                  <input value={uQuery} onChange={e=>setUQuery(e.target.value)} placeholder="email ara…" />
                  <button onClick={fetchUsers}>Ara</button>
                  <select value={grantMonths} onChange={e=>setGrantMonths(Number(e.target.value))}>
                    <option value={6}>6 ay PRO</option>
                    <option value={12}>12 ay PRO</option>
                    <option value={24}>24 ay PRO</option>
                  </select>
                </div>

                <div className="table">
                  <div className="row head">
                    <div>Email</div>
                    <div>Ad Soyad</div>
                    <div>Rol</div>
                    <div>PRO Bitiş</div>
                    <div>İşlem</div>
                  </div>
                  {users.map(u => (
                    <div className="row" key={u.auth_user_id}>
                      <div className="ell">{u.email || "-"}</div>
                      <div className="ell">{u.full_name || "-"}</div>
                      <div>{u.role || "-"}</div>
                      <div>{u.premium_until ? fmtDate(u.premium_until) : "-"}</div>
                      <div className="ops">
                        {u.email && <button onClick={() => grantPro(u.email)} className="ok">PRO Ver</button>}
                        {u.role === "admin" ? (
                          <button onClick={() => removeAdmin(u.auth_user_id)} className="no">Admin Al</button>
                        ) : (
                          <button onClick={() => makeAdmin(u.auth_user_id)} className="ghost">Admin Yap</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <style jsx>{`
        :root{ --ink:#0f172a; --line:rgba(0,0,0,.1); }
        body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Inter,Roboto,Arial,sans-serif}
        .top{position:sticky;top:0;z-index:10;display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-bottom:1px solid var(--line);
          background:linear-gradient(90deg,#0b0b0b,#1f2937);color:#fff}
        .brand{font-weight:900;cursor:pointer}
        .actions{display:flex;gap:8px;align-items:center}
        .tab{border:1px solid rgba(255,255,255,.25);background:transparent;color:#fff;border-radius:10px;padding:8px 10px;cursor:pointer}
        .tab.active{background:#111827;border-color:#111827}
        .logout{border:1px solid #ef4444;background:#ef4444;color:#fff;border-radius:10px;padding:8px 10px;cursor:pointer}

        .wrap{min-height:100vh;padding:16px;background:
          radial-gradient(1000px 500px at 10% -10%, #ffe4e6, transparent),
          radial-gradient(700px 400px at 90% -10%, #e0e7ff, transparent),
          linear-gradient(120deg,#ff80ab,#a78bfa,#60a5fa,#34d399);}

        .card{max-width:1200px;margin:12px auto;background:#fff;border:1px solid #e5e7eb;border-radius:16px;box-shadow:0 18px 50px rgba(0,0,0,.15);padding:14px}
        .card.login{max-width:420px}
        h1,h2{margin:6px 0 12px}
        .grid{display:grid;gap:10px}
        input,select{border:1px solid #e5e7eb;border-radius:10px;padding:10px}
        .primary{border:1px solid #111827;background:#111827;color:#fff;border-radius:10px;padding:10px;cursor:pointer;font-weight:800}
        .muted{color:#475569;margin-top:8px}
        .err{background:#fee2e2;border:1px solid #fecaca;padding:10px;border-radius:10px;color:#991b1b;margin:10px auto}
        .msg{background:#dcfce7;border:1px solid #bbf7d0;padding:10px;border-radius:10px;color:#065f46;margin:10px auto}

        .table{display:grid;gap:6px}
        .row{display:grid;grid-template-columns:70px 1.6fr .7fr 1fr .7fr 1fr 1fr;gap:8px;align-items:center;padding:8px;border:1px solid #e5e7eb;border-radius:10px}
        .row.head{background:#f8fafc;font-weight:800}
        .ell{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .ops{display:flex;gap:6px;flex-wrap:wrap}
        .ok{border:1px solid #16a34a;background:#16a34a;color:#fff;border-radius:10px;padding:6px 10px;cursor:pointer}
        .no{border:1px solid #ef4444;background:#ef4444;color:#fff;border-radius:10px;padding:6px 10px;cursor:pointer}
        .ghost{border:1px solid #111827;background:transparent;color:#111827;border-radius:10px;padding:6px 10px;cursor:pointer}

        .userbar{display:flex;gap:8px;align-items:center;margin-bottom:10px}
      `}</style>
    </>
  );
}
