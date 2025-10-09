"use client";
import React, { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { createClient } from "@supabase/supabase-js";

/* ---------------------- Supabase ---------------------- */
let _sb = null;
function getSupabase() {
  if (_sb) return _sb;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  _sb = createClient(url, key);
  return _sb;
}

/* ---------------------- UI Helpers ---------------------- */
const fmtDate = (d) => (d ? new Date(d).toLocaleString("tr-TR") : "—");
const roles = ["user", "moderator", "admin"];

/* ---------------------- Component ---------------------- */
export default function AdminPanel() {
  const supa = getSupabase();
  const [me, setMe] = useState(null);         // supabase user
  const [meRow, setMeRow] = useState(null);   // public.users satırı
  const [tab, setTab] = useState("approve");  // approve | showcase | users
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  // Giriş formu
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  // Veriler
  const [pending, setPending] = useState([]);
  const [active, setActive] = useState([]);
  const [uList, setUList] = useState([]);

  // oturum + admin kontrol
  useEffect(() => {
    let on = true;
    (async () => {
      if (!supa) return;
      const { data: { user } } = await supa.auth.getUser();
      if (!on) return;
      if (user) {
        setMe(user);
        // admin mi?
        const { data: row } = await supa
          .from("users")
          .select("auth_user_id, role, premium_until, email, full_name")
          .eq("auth_user_id", user.id)
          .single();
        setMeRow(row || null);
      }
    })();
    return () => (on = false);
  }, [supa]);

  const isAdmin = useMemo(() => meRow?.role === "admin", [meRow]);

  // veri çek
  useEffect(() => {
    let on = true;
    (async () => {
      if (!supa || !isAdmin) return;
      // pending ilanlar
      const { data: p } = await supa
        .from("listings")
        .select("id, title, seller_auth_id, created_at, city, price, currency, status, is_showcase, category, subcategory, ship_days")
        .eq("status", "pending")
        .order("created_at", { ascending: true });
      if (on) setPending(p || []);

      // aktif ilanlar (vitrin/PRO sekmesi için)
      const { data: a } = await supa
        .from("listings")
        .select("id, title, seller_auth_id, created_at, city, price, currency, status, is_showcase, category, subcategory, ship_days")
        .eq("status", "active")
        .order("created_at", { ascending: false });
      if (on) setActive(a || []);

      // kullanıcılar
      const { data: u } = await supa
        .from("users")
        .select("auth_user_id, email, full_name, role, premium_until")
        .order("created_at", { ascending: false });
      if (on) setUList(u || []);
    })();
    return () => (on = false);
  }, [supa, isAdmin, tab]); // sekme değişince tazelemek hoş

  async function handleLogin(e) {
    e.preventDefault();
    setErr(""); setMsg(""); setBusy(true);
    try {
      const { data, error } = await supa.auth.signInWithPassword({ email, password: pass });
      if (error) throw error;
      // kullanıcı satırı
      const { data: row } = await supa
        .from("users")
        .select("auth_user_id, role, premium_until, email, full_name")
        .eq("auth_user_id", data.user.id)
        .single();
      setMe(data.user);
      setMeRow(row || null);
      setMsg("Giriş başarılı.");
    } catch (e) {
      setErr(e?.message || "Giriş başarısız.");
    } finally {
      setBusy(false);
    }
  }

  function signOut() {
    supa?.auth.signOut().finally(() => {
      setMe(null); setMeRow(null);
    });
  }

  // ---- İLAN İŞLEMLERİ ----
  async function approveListing(id) {
    setErr(""); setMsg(""); setBusy(true);
    try {
      const { error } = await supa.from("listings").update({ status: "active" }).eq("id", id);
      if (error) throw error;
      setMsg(`İlan #${id} onaylandı.`);
      setPending((x) => x.filter((i) => i.id !== id));
    } catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  }

  async function rejectListing(id) {
    setErr(""); setMsg(""); setBusy(true);
    try {
      const { error } = await supa.from("listings").update({ status: "rejected" }).eq("id", id);
      if (error) throw error;
      setMsg(`İlan #${id} reddedildi.`);
      setPending((x) => x.filter((i) => i.id !== id));
    } catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  }

  async function toggleShowcase(id, current) {
    setErr(""); setMsg(""); setBusy(true);
    try {
      const { error } = await supa.from("listings").update({ is_showcase: !current }).eq("id", id);
      if (error) throw error;
      setActive((arr) => arr.map(it => it.id === id ? { ...it, is_showcase: !current } : it));
      setMsg(`İlan #${id} vitrin ${current ? "çıkarıldı" : "eklendi"}.`);
    } catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  }

  // ---- KULLANICI İŞLEMLERİ ----
  async function setRole(uid, role) {
    setErr(""); setMsg(""); setBusy(true);
    try {
      const { error } = await supa.from("users").update({ role }).eq("auth_user_id", uid);
      if (error) throw error;
      setUList((arr)=> arr.map(u => u.auth_user_id===uid ? { ...u, role } : u));
      setMsg("Rol güncellendi.");
    } catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  }

  async function grantPro(uid, months) {
    setErr(""); setMsg(""); setBusy(true);
    try {
      // premium_until = now() + X ay
      const { error } = await supa.rpc("admin_grant_pro", { p_user_id: uid, p_months: months });
      if (error) throw error;
      // ekrandaki tarihi tazele
      const { data } = await supa
        .from("users")
        .select("auth_user_id, premium_until, role, email, full_name")
        .eq("auth_user_id", uid)
        .single();
      setUList((arr)=> arr.map(u => u.auth_user_id===uid ? { ...u, premium_until: data?.premium_until } : u));
      setMsg(`${months} ay PRO verildi.`);
    } catch (e) { setErr(e.message || "PRO verilemedi."); }
    finally { setBusy(false); }
  }

  // ---- UI Kısımları ----
  if (!supa) {
    return (
      <>
        <Head><title>Admin • Üreten Eller</title></Head>
        <div className="screen center"><div className="card">
          <h1>Admin</h1>
          <div className="err">Supabase anahtarları bulunamadı (ENV).</div>
        </div></div>
        <style jsx>{baseCss}</style>
      </>
    );
  }

  if (!me || !isAdmin) {
    return (
      <>
        <Head>
          <title>Admin Giriş • Üreten Eller</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {/* Global faviconlar (_document.jsx varsa oradan da gelir) */}
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=8" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=8" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=8" />
          <link rel="icon" href="/favicon.png?v=8" />
        </Head>
        <div className="screen center">
          <form className="card form" onSubmit={handleLogin}>
            <h1 className="ttl">Admin Panel</h1>
            <div className="field">
              <label>E-posta</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@mail.com" required />
            </div>
            <div className="field">
              <label>Şifre</label>
              <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••" required />
            </div>
            {err && <div className="err">{err}</div>}
            {msg && <div className="msg">{msg}</div>}
            <button type="submit" className="btn primary" disabled={busy}>{busy ? "…" : "Giriş Yap"}</button>
            <div className="mini">Not: Girişten sonra hesabınızın <b>public.users.role = 'admin'</b> olması gerekir.</div>
          </form>
        </div>
        <style jsx>{baseCss}</style>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Admin • Üreten Eller</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=8" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=8" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=8" />
        <link rel="icon" href="/favicon.png?v=8" />
      </Head>

      {/* HEADER */}
      <header className="top">
        <div className="brand" onClick={()=>setTab("approve")}>
          <img src="/logo.png" width="28" height="28" alt="logo" />
          <span>Üreten Eller • Admin</span>
        </div>
        <div className="me">
          <div className="who">
            <b>{meRow?.full_name || meRow?.email || "Yönetici"}</b>
            <span>rol: {meRow?.role}</span>
          </div>
          <button className="btn outline" onClick={signOut}>Çıkış</button>
        </div>
      </header>

      {/* TABS */}
      <nav className="tabs">
        <button onClick={()=>setTab("approve")} className={tab==="approve"?"tab active":"tab"}>İlan Onayı</button>
        <button onClick={()=>setTab("showcase")} className={tab==="showcase"?"tab active":"tab"}>Vitrin / PRO</button>
        <button onClick={()=>setTab("users")} className={tab==="users"?"tab active":"tab"}>Kullanıcılar</button>
      </nav>

      {err && <div className="feedback err">{err}</div>}
      {msg && <div className="feedback msg">{msg}</div>}

      {/* CONTENT */}
      <main className="wrap">
        {tab === "approve" && (
          <section className="card">
            <h2>Bekleyen İlanlar</h2>
            {!pending.length ? <div className="empty">Bekleyen ilan yok.</div> : (
              <div className="tableWrap">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>ID</th><th>Başlık</th><th>Satıcı</th><th>Şehir</th><th>Fiyat</th><th>Tarih</th><th>İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pending.map((r)=>(
                      <tr key={r.id}>
                        <td>#{r.id}</td>
                        <td>{r.title}</td>
                        <td><code className="code">{r.seller_auth_id?.slice(0,8)}…</code></td>
                        <td>{r.city || "—"}</td>
                        <td>{r.price != null ? `${r.price} ${r.currency||"TRY"}` : "—"}</td>
                        <td>{fmtDate(r.created_at)}</td>
                        <td className="actionsRow">
                          <button className="btn success" onClick={()=>approveListing(r.id)} disabled={busy}>Onayla</button>
                          <button className="btn danger" onClick={()=>rejectListing(r.id)} disabled={busy}>Reddet</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {tab === "showcase" && (
          <section className="card">
            <h2>Aktif İlanlar (Vitrin / PRO)</h2>
            {!active.length ? <div className="empty">Aktif ilan yok.</div> : (
              <div className="tableWrap">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>ID</th><th>Başlık</th><th>Şehir</th><th>Fiyat</th><th>Vitrin</th><th>İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {active.map((r)=>(
                      <tr key={r.id}>
                        <td>#{r.id}</td>
                        <td>{r.title}</td>
                        <td>{r.city || "—"}</td>
                        <td>{r.price != null ? `${r.price} ${r.currency||"TRY"}` : "—"}</td>
                        <td>{r.is_showcase ? "Evet" : "Hayır"}</td>
                        <td className="actionsRow">
                          <button className="btn outline" onClick={()=>toggleShowcase(r.id, r.is_showcase)} disabled={busy}>
                            {r.is_showcase ? "Vitrinden Çıkar" : "Vitrine Ekle"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {tab === "users" && (
          <section className="card">
            <h2>Kullanıcılar</h2>
            {!uList.length ? <div className="empty">Kayıt yok.</div> : (
              <div className="tableWrap">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>Kullanıcı</th><th>Rol</th><th>PRO Bitiş</th><th>Rol İşlem</th><th>PRO Ver</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uList.map((u)=>(
                      <tr key={u.auth_user_id}>
                        <td>
                          <div className="uCell">
                            <div className="name">{u.full_name || "—"}</div>
                            <div className="muted">{u.email || "—"}</div>
                            <code className="code">{u.auth_user_id?.slice(0,8)}…</code>
                          </div>
                        </td>
                        <td>{u.role || "user"}</td>
                        <td>{fmtDate(u.premium_until)}</td>
                        <td className="actionsRow">
                          <select
                            value={u.role || "user"}
                            onChange={(e)=>setRole(u.auth_user_id, e.target.value)}
                            className="sel"
                            disabled={busy}
                          >
                            {roles.map(r => <option key={r} value={r}>{r}</option>)}
                          </select>
                        </td>
                        <td className="actionsRow">
                          <div className="proGrant">
                            <input type="number" min={1} max={36} defaultValue={12} className="months" id={`m-${u.auth_user_id}`} />
                            <button className="btn primary" disabled={busy}
                              onClick={()=>{
                                const m = Number(document.getElementById(`m-${u.auth_user_id}`).value || 12);
                                grantPro(u.auth_user_id, m);
                              }}>
                              PRO Ver
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="foot">
        <div>© {new Date().getFullYear()} Üreten Eller • Admin</div>
      </footer>

      <style jsx>{baseCss}</style>
    </>
  );
}

/* ---------------------- CSS (okunaklı tema) ---------------------- */
const baseCss = `
:root{
  --ink:#0f172a; --muted:#6b7280; --line:#e5e7eb; --bg:#f8fafc;
  --brand:#111827; --ok:#10b981; --bad:#ef4444; --pri:#111827;
}
html,body,#__next{height:100%}
body{margin:0;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:var(--ink);
  background:
    radial-gradient(1200px 600px at 10% -10%, #ffe4e6, transparent),
    radial-gradient(900px 500px at 90% -10%, #e0e7ff, transparent),
    linear-gradient(120deg,#ff80ab,#a78bfa,#60a5fa,#34d399);
  background-attachment: fixed;
}

.screen.center{min-height:100vh; display:grid; place-items:center; padding:18px}
.card{background:#fff;border:1px solid var(--line);border-radius:16px; padding:16px; box-shadow:0 18px 50px rgba(0,0,0,.08)}
.card.form{width:min(520px,100%); display:grid; gap:12px}
.ttl{margin:2px 0 6px}
.field{display:grid; gap:6px}
.field label{font-weight:700}
.field input[type="email"], .field input[type="password"], .field input[type="text"], .field select{
  border:1px solid var(--line); border-radius:10px; padding:10px; background:#fff; color:#111;
}
.btn{border:1px solid transparent; border-radius:10px; padding:10px 12px; cursor:pointer; font-weight:800}
.btn.primary{background:var(--pri); color:#fff; border-color:var(--pri)}
.btn.outline{background:#fff; color:var(--pri); border-color:var(--pri)}
.btn.success{background:var(--ok); color:#fff; border-color:var(--ok)}
.btn.danger{background:var(--bad); color:#fff; border-color:var(--bad)}
.mini{color:var(--muted); font-size:12px}

.err{background:rgba(239,68,68,.08); border:1px solid rgba(239,68,68,.35); color:#991b1b; padding:10px; border-radius:10px}
.msg{background:rgba(16,185,129,.08); border:1px solid rgba(16,185,129,.35); color:#065f46; padding:10px; border-radius:10px}
.feedback{max-width:1200px; margin:12px auto 0; padding:0 12px}

.top{position:sticky; top:0; z-index:10; display:grid; grid-template-columns:1fr auto; gap:10px; align-items:center;
  padding:10px 14px; background:rgba(255,255,255,.92); backdrop-filter: blur(8px); border-bottom:1px solid var(--line)}
.brand{display:flex; gap:8px; align-items:center; font-weight:900; cursor:pointer}
.me{display:flex; gap:10px; align-items:center}
.who{display:flex; flex-direction:column; line-height:1.1}

.tabs{max-width:1200px; margin:14px auto 0; padding:0 12px; display:flex; gap:8px; flex-wrap:wrap}
.tab{border:1px solid var(--line); background:#fff; color:#111; border-radius:999px; padding:8px 12px; cursor:pointer; font-weight:800}
.tab.active{background:var(--pri); color:#fff; border-color:var(--pri)}

.wrap{max-width:1200px; margin:12px auto; padding:0 12px; display:grid; gap:14px}
.tableWrap{overflow:auto; border:1px solid var(--line); border-radius:14px}
.tbl{width:100%; border-collapse:separate; border-spacing:0}
.tbl thead th{position:sticky; top:0; background:#f1f5f9; text-align:left; padding:10px; font-weight:800; border-bottom:1px solid var(--line)}
.tbl tbody td{padding:10px; border-bottom:1px solid #f1f5f9; vertical-align:middle; color:#111}
.tbl tbody tr:nth-child(even){background:#fafafa}
.actionsRow{display:flex; gap:8px; align-items:center}
.code{background:#f1f5f9; padding:2px 6px; border-radius:8px; font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace}
.empty{padding:14px; border:1px dashed var(--line); border-radius:12px; background:#fff; color:#555}

.proGrant{display:flex; gap:8px; align-items:center}
.months{width:80px; border:1px solid var(--line); border-radius:8px; padding:8px; background:#fff; color:#111}
.sel{border:1px solid var(--line); border-radius:8px; padding:8px; background:#fff; color:#111}

.foot{padding:16px; text-align:center; color:#0b0b0b; font-weight:700}
`;
