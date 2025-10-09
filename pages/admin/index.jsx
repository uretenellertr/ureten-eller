"use client";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import Head from "next/head";
import { createClient } from "@supabase/supabase-js";

/* ---------------- ENV / SUPABASE ---------------- */
let _sb = null;
function getSupabase() {
  if (_sb) return _sb;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || (typeof window !== "undefined" ? window.__SUPABASE_URL__ : "");
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || (typeof window !== "undefined" ? window.__SUPABASE_ANON__ : "");
  if (!url || !key) return null;
  _sb = createClient(url, key);
  return _sb;
}

/* ---------------- Basit UI parçaları ---------------- */
function Badge({ children, color="gray" }) {
  const map = {
    gray: "#9ca3af", green: "#10b981", blue: "#3b82f6",
    yellow: "#eab308", red:"#ef4444", purple:"#a78bfa"
  };
  return (
    <span style={{
      display:"inline-block", padding:"3px 8px", borderRadius:999,
      fontSize:12, fontWeight:800, color:"#111", background: map[color] || "#9ca3af"
    }}>{children}</span>
  );
}
function Row({ label, children }) {
  return (
    <div className="row">
      <div className="lab">{label}</div>
      <div className="val">{children}</div>
    </div>
  );
}

/* ---------------- ANA KOMPONENT ---------------- */
export default function AdminPanel() {
  const supa = getSupabase();

  const [authedUser, setAuthedUser] = useState(null);       // auth.users
  const [isAdmin, setIsAdmin] = useState(false);            // public.users.role === 'admin'
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Sekme: pending, search, users, pro
  const [tab, setTab] = useState("pending");

  // --- Login formu ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginErr, setLoginErr] = useState("");

  // --- Bekleyen ilanlar ---
  const [pending, setPending] = useState([]);
  const [loadingPending, setLoadingPending] = useState(false);

  // --- İlan arama ---
  const [qTitle, setQTitle] = useState("");
  const [qCity, setQCity] = useState("");
  const [qStatus, setQStatus] = useState("all");
  const [searchRes, setSearchRes] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  // --- Kullanıcılar ---
  const [uQuery, setUQuery] = useState("");
  const [uRes, setURes] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // --- PRO İşlemleri ---
  const [proEmail, setProEmail] = useState("");
  const [proMonths, setProMonths] = useState(12);
  const [proMsg, setProMsg] = useState("");
  const [proErr, setProErr] = useState("");

  // ---------------- AUTH KONTROL ----------------
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (!supa) return;
        const { data: { user } } = await supa.auth.getUser();
        if (!alive) return;
        if (!user) {
          setAuthedUser(null);
          setIsAdmin(false);
          return;
        }
        setAuthedUser(user);
        // role check
        const { data: me } = await supa
          .from("users")
          .select("role")
          .eq("auth_user_id", user.id)
          .single();
        setIsAdmin(me?.role === "admin");
      } finally {
        if (alive) setLoadingAuth(false);
      }
    })();
    return () => { alive = false; };
  }, [supa]);

  // ---------------- GİRİŞ ----------------
  const onLogin = useCallback(async (e) => {
    e.preventDefault();
    setLoginErr("");
    try {
      const { error } = await supa.auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw error;
      // Yeniden kontrol
      const { data: { user } } = await supa.auth.getUser();
      setAuthedUser(user || null);
      if (user) {
        const { data: me } = await supa
          .from("users")
          .select("role")
          .eq("auth_user_id", user.id)
          .single();
        setIsAdmin(me?.role === "admin");
      }
    } catch (err) {
      setLoginErr(err?.message || "Giriş başarısız.");
    }
  }, [email, password, supa]);

  const onLogout = useCallback(async () => {
    try { await supa.auth.signOut(); } catch {}
    setAuthedUser(null);
    setIsAdmin(false);
  }, [supa]);

  // ---------------- BEKLEYEN İLANLAR ----------------
  const loadPending = useCallback(async () => {
    setLoadingPending(true);
    try {
      const { data, error } = await supa
        .from("listings")
        .select("id, title, description, price, currency, city, district, created_at, is_showcase, status, seller_auth_id")
        .eq("status", "pending")
        .order("created_at", { ascending: true });
      if (error) throw error;
      setPending(data || []);
    } finally {
      setLoadingPending(false);
    }
  }, [supa]);

  useEffect(() => { if (isAdmin && tab === "pending") loadPending(); }, [isAdmin, tab, loadPending]);

  const approveListing = async (id) => {
    await supa.from("listings").update({ status: "active" }).eq("id", id);
    await loadPending();
  };
  const rejectListing = async (id) => {
    await supa.from("listings").update({ status: "rejected" }).eq("id", id);
    await loadPending();
  };
  const toggleShowcase = async (id, current) => {
    await supa.from("listings").update({ is_showcase: !current }).eq("id", id);
    await loadPending();
  };

  // ---------------- İLAN ARAMA ----------------
  const doSearch = useCallback(async () => {
    setLoadingSearch(true);
    try {
      let q = supa.from("listings").select("id, title, price, currency, city, status, is_showcase, created_at").order("created_at", { ascending: false });
      if (qTitle.trim()) q = q.ilike("title", `%${qTitle.trim()}%`);
      if (qCity.trim()) q = q.eq("city", qCity.trim());
      if (qStatus !== "all") q = q.eq("status", qStatus);
      const { data, error } = await q.range(0, 99);
      if (error) throw error;
      setSearchRes(data || []);
    } finally {
      setLoadingSearch(false);
    }
  }, [qTitle, qCity, qStatus, supa]);

  // ---------------- KULLANICI YÖNETİMİ ----------------
  const searchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      let q = supa.from("users").select("id, auth_user_id, email, full_name, role, premium_until").order("created_at", { ascending: false });
      if (uQuery.trim()) {
        q = q.or(`email.ilike.%${uQuery.trim()}%,full_name.ilike.%${uQuery.trim()}%`);
      }
      const { data, error } = await q.range(0, 99);
      if (error) throw error;
      setURes(data || []);
    } finally {
      setLoadingUsers(false);
    }
  }, [uQuery, supa]);

  const setRole = async (authUserId, role) => {
    await supa.from("users").update({ role }).eq("auth_user_id", authUserId);
    await searchUsers();
  };
  const clearPro = async (authUserId) => {
    await supa.from("users").update({ premium_until: null }).eq("auth_user_id", authUserId);
    await searchUsers();
  };

  // ---------------- PRO İŞLEMLERİ ----------------
  const grantPro = async () => {
    setProMsg(""); setProErr("");
    try {
      const { error } = await supa.rpc("admin_grant_pro_by_email", {
        p_email: proEmail.trim(),
        p_months: Number(proMonths) || 12,
      });
      if (error) throw error;
      setProMsg("PRO tanımlandı.");
    } catch (e) {
      setProErr(e?.message || "İşlem başarısız.");
    }
  };

  /* ---------------- RENDER ---------------- */
  return (
    <>
      <Head>
        <title>Admin Paneli</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="layout">
        <header className="topbar">
          <div className="brand">Admin Paneli</div>
          <div className="spacer" />
          {isAdmin && (
            <button className="btn danger" onClick={onLogout}>Çıkış</button>
          )}
        </header>

        <main className="content">
          {/* LOGIN GATE */}
          {loadingAuth ? (
            <div className="card">Yükleniyor…</div>
          ) : !authedUser ? (
            <div className="card login">
              <h1>Giriş</h1>
              <form onSubmit={onLogin} className="form">
                <div className="field">
                  <label>E-posta</label>
                  <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="admin@site.com" />
                </div>
                <div className="field">
                  <label>Şifre</label>
                  <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" />
                </div>
                {loginErr && <div className="err">{loginErr}</div>}
                <div className="actions">
                  <button type="submit" className="btn primary">Giriş Yap</button>
                </div>
              </form>
            </div>
          ) : !isAdmin ? (
            <div className="card">
              <h2>Yetkin yok</h2>
              <p>Bu alana sadece <b>admin</b> rolü erişebilir.</p>
              <button className="btn" onClick={onLogout}>Hesaptan çık</button>
            </div>
          ) : (
            <>
              {/* Sekmeler */}
              <nav className="tabs">
                <button className={tab==="pending"?"tab active":"tab"} onClick={()=>setTab("pending")}>Bekleyen İlanlar</button>
                <button className={tab==="search"?"tab active":"tab"} onClick={()=>setTab("search")}>İlan Ara</button>
                <button className={tab==="users"?"tab active":"tab"} onClick={()=>setTab("users")}>Kullanıcılar</button>
                <button className={tab==="pro"?"tab active":"tab"} onClick={()=>setTab("pro")}>PRO İşlemleri</button>
              </nav>

              {/* PENDING */}
              {tab==="pending" && (
                <section className="card">
                  <div className="head">
                    <h2>Onay Bekleyen İlanlar</h2>
                    <button className="btn" onClick={loadPending}>Yenile</button>
                  </div>
                  {loadingPending ? (
                    <div>Yükleniyor…</div>
                  ) : !pending.length ? (
                    <div>Bekleyen ilan yok.</div>
                  ) : (
                    <div className="list">
                      {pending.map((it)=>(
                        <div className="item" key={it.id}>
                          <div className="flex">
                            <div className="grow">
                              <div className="ttl">{it.title}</div>
                              <div className="meta">
                                <Badge color="yellow">pending</Badge>
                                {!!it.is_showcase && <span style={{marginLeft:8}}><Badge color="purple">vitrin</Badge></span>}
                                <span style={{marginLeft:12, opacity:.8}}>{new Date(it.created_at).toLocaleString()}</span>
                              </div>
                              <div className="dim">{it.city}{it.district ? ` / ${it.district}`:""} — {it.price ? `${it.price} ${it.currency}` : "-"}</div>
                            </div>
                            <div className="actions">
                              <button className="btn success" onClick={()=>approveListing(it.id)}>Onayla</button>
                              <button className="btn warn" onClick={()=>rejectListing(it.id)}>Reddet</button>
                              <button className="btn" onClick={()=>toggleShowcase(it.id, it.is_showcase)}>
                                {it.is_showcase ? "Vitrinden Kaldır" : "Vitrine Al"}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {/* SEARCH LISTINGS */}
              {tab==="search" && (
                <section className="card">
                  <h2>İlan Arama</h2>
                  <div className="grid2">
                    <div className="field">
                      <label>Başlık</label>
                      <input value={qTitle} onChange={(e)=>setQTitle(e.target.value)} placeholder="başlıkta ara" />
                    </div>
                    <div className="field">
                      <label>İl</label>
                      <input value={qCity} onChange={(e)=>setQCity(e.target.value)} placeholder="İstanbul" />
                    </div>
                    <div className="field">
                      <label>Durum</label>
                      <select value={qStatus} onChange={(e)=>setQStatus(e.target.value)}>
                        <option value="all">Hepsi</option>
                        <option value="pending">pending</option>
                        <option value="active">active</option>
                        <option value="rejected">rejected</option>
                        <option value="expired">expired</option>
                      </select>
                    </div>
                    <div className="field" style={{alignSelf:"end"}}>
                      <button className="btn primary" onClick={doSearch}>Ara</button>
                    </div>
                  </div>

                  {loadingSearch ? (
                    <div>Aranıyor…</div>
                  ) : (
                    <div className="list">
                      {searchRes.map((it)=>(
                        <div className="item" key={it.id}>
                          <div className="flex">
                            <div className="grow">
                              <div className="ttl">{it.title}</div>
                              <div className="meta">
                                <Badge color={
                                  it.status==="active" ? "green" :
                                  it.status==="pending" ? "yellow" :
                                  it.status==="rejected" ? "red" : "gray"
                                }>{it.status}</Badge>
                                {!!it.is_showcase && <span style={{marginLeft:8}}><Badge color="purple">vitrin</Badge></span>}
                                <span style={{marginLeft:12, opacity:.8}}>{new Date(it.created_at).toLocaleString()}</span>
                              </div>
                              <div className="dim">{it.city || "-"} — {it.price ? `${it.price} ${it.currency}` : "-"}</div>
                            </div>
                            <div className="actions">
                              {it.status!=="active" && <button className="btn success" onClick={()=>supUpdateListing(supa, it.id, {status:"active"}, doSearch)}>Onayla</button>}
                              {it.status!=="rejected" && <button className="btn warn" onClick={()=>supUpdateListing(supa, it.id, {status:"rejected"}, doSearch)}>Reddet</button>}
                              <button className="btn" onClick={()=>supUpdateListing(supa, it.id, {is_showcase: !it.is_showcase}, doSearch)}>
                                {it.is_showcase ? "Vitrinden Kaldır" : "Vitrine Al"}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {!searchRes.length && <div>Sonuç yok.</div>}
                    </div>
                  )}
                </section>
              )}

              {/* USERS */}
              {tab==="users" && (
                <section className="card">
                  <h2>Kullanıcılar</h2>
                  <div className="grid2">
                    <div className="field">
                      <label>E-posta / İsim ara</label>
                      <input value={uQuery} onChange={(e)=>setUQuery(e.target.value)} placeholder="ornekkisi@mail.com" />
                    </div>
                    <div className="field" style={{alignSelf:"end"}}>
                      <button className="btn primary" onClick={searchUsers}>Ara</button>
                    </div>
                  </div>
                  {loadingUsers ? (
                    <div>Yükleniyor…</div>
                  ) : (
                    <div className="list">
                      {uRes.map((u)=>(
                        <div className="item" key={u.id}>
                          <div className="flex">
                            <div className="grow">
                              <div className="ttl">{u.full_name || u.email || u.auth_user_id}</div>
                              <div className="meta">
                                <Badge color={u.role==="admin" ? "red" : u.role==="moderator" ? "blue" : "gray"}>{u.role || "user"}</Badge>
                                {u.premium_until && <span style={{marginLeft:8}}><Badge color="yellow">PRO</Badge></span>}
                                <span style={{marginLeft:12, opacity:.8}}>{u.email || "-"}</span>
                              </div>
                              {u.premium_until && <div className="dim">PRO bitiş: {new Date(u.premium_until).toLocaleDateString()}</div>}
                            </div>
                            <div className="actions">
                              <button className="btn" onClick={()=>setRole(u.auth_user_id, "user")}>User</button>
                              <button className="btn" onClick={()=>setRole(u.auth_user_id, "moderator")}>Moderatör yap</button>
                              <button className="btn warn" onClick={()=>setRole(u.auth_user_id, "admin")}>Admin yap</button>
                              {u.premium_until && <button className="btn" onClick={()=>clearPro(u.auth_user_id)}>PRO kaldır</button>}
                            </div>
                          </div>
                        </div>
                      ))}
                      {!uRes.length && <div>Sonuç yok.</div>}
                    </div>
                  )}
                </section>
              )}

              {/* PRO */}
              {tab==="pro" && (
                <section className="card">
                  <h2>PRO Üyelik İşlemleri</h2>
                  <div className="grid3">
                    <div className="field">
                      <label>E-posta</label>
                      <input value={proEmail} onChange={(e)=>setProEmail(e.target.value)} placeholder="kisi@mail.com" />
                    </div>
                    <div className="field">
                      <label>Süre (ay)</label>
                      <input type="number" min={1} max={60} value={proMonths} onChange={(e)=>setProMonths(e.target.value)} />
                    </div>
                    <div className="field" style={{alignSelf:"end"}}>
                      <button className="btn primary" onClick={grantPro}>PRO Ver</button>
                    </div>
                  </div>
                  {proMsg && <div className="ok">{proMsg}</div>}
                  {proErr && <div className="err">{proErr}</div>}
                  <div className="mini">Not: Bu işlem sadece <b>admin</b> tarafından çalışır; RLS bunu zaten zorlar.</div>
                </section>
              )}
            </>
          )}
        </main>

        <footer className="foot">
          © {new Date().getFullYear()} Admin
        </footer>
      </div>

      <style jsx>{`
        :root{ --bg:#0b0b0b; --ink:#f8fafc; --muted:#cbd5e1; --line:rgba(255,255,255,.12); }
        html,body,#__next{height:100%}
        body{margin:0;background:var(--bg);color:var(--ink);font-family:system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial,sans-serif}

        .layout{min-height:100vh;display:grid;grid-template-rows:auto 1fr auto}
        .topbar{display:flex;align-items:center;gap:10px;padding:12px 16px;border-bottom:1px solid var(--line);background:#0f0f10;position:sticky;top:0;z-index:50}
        .brand{font-weight:900}
        .spacer{flex:1}

        .content{max-width:1100px;margin:0 auto;padding:16px}
        .foot{padding:12px 16px;border-top:1px solid var(--line);color:var(--muted);text-align:center}

        .tabs{display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap}
        .tab{border:1px solid var(--line);background:#151515;color:var(--ink);padding:8px 12px;border-radius:10px;font-weight:800;cursor:pointer}
        .tab.active{background:#111827}

        .card{background:#111317;border:1px solid var(--line);border-radius:16px;padding:14px;box-shadow:0 18px 50px rgba(0,0,0,.35)}
        .login{max-width:420px;margin:0 auto}
        .head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:8px}

        .grid2{display:grid;gap:12px;grid-template-columns:repeat(2,1fr)}
        .grid3{display:grid;gap:12px;grid-template-columns:repeat(3,1fr)}
        @media (max-width:800px){ .grid2,.grid3{grid-template-columns:1fr} }

        .form{display:grid;gap:12px}
        .field{display:grid;gap:6px}
        .field label{font-weight:700;color:var(--muted)}
        .field input, .field select, .field textarea{
          background:#0d0f14;border:1px solid var(--line);color:var(--ink);
          border-radius:10px;padding:10px;outline:none;
        }

        .row{display:grid;grid-template-columns:140px 1fr;gap:10px;margin:6px 0}
        .lab{color:var(--muted)}
        .val{color:var(--ink)}

        .list{display:grid;gap:10px}
        .item{padding:10px;border:1px solid var(--line);border-radius:12px;background:#0d0f14}
        .flex{display:flex;gap:10px}
        .grow{flex:1}
        .ttl{font-weight:900}
        .meta{display:flex;align-items:center;gap:6px;margin-top:2px}
        .dim{color:var(--muted);margin-top:2px}

        .btn{border:1px solid var(--line);background:#1f2937;color:#fff;padding:8px 10px;border-radius:10px;cursor:pointer;font-weight:800}
        .btn.primary{background:#1d4ed8}
        .btn.success{background:#059669}
        .btn.warn{background:#b45309}
        .btn.danger{background:#ef4444}

        .actions{display:flex;gap:8px;flex-wrap:wrap}
        .ok{margin-top:10px;padding:10px;border:1px solid #14532d;background:#064e3b;color:#dcfce7;border-radius:10px}
        .err{margin-top:10px;padding:10px;border:1px solid #7f1d1d;background:#450a0a;color:#fecaca;border-radius:10px}
        .mini{margin-top:6px;color:var(--muted);font-size:12px}
      `}</style>
    </>
  );
}

/* ---- küçük yardımcı (ilan güncelle ve listeyi tazele) ---- */
async function supUpdateListing(supa, id, patch, after) {
  await supa.from("listings").update(patch).eq("id", id);
  if (typeof after === "function") await after();
}
