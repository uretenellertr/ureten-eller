// pages/login.jsx
"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
// Canvas önizlemesi için basit Head şimi; Next.js build'de <head> olmaması sorun değil
const Head = ({ children }) => <>{children}</>;
import { createClient } from "@supabase/supabase-js";

/**
 * .env.local içine ekleyin:
 * NEXT_PUBLIC_SUPABASE_URL=https://krmjbjfwmnhzfhnrswgg.supabase.co
 * NEXT_PUBLIC_SUPABASE_ANON_KEY=...ANON...
 */

/* ----------------------------- Supabase init ----------------------------- */
let _supa = null;
function getSupabase() {
  if (_supa) return _supa;
  const url = (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_SUPABASE_URL) || (typeof window !== 'undefined' ? window.__SUPABASE_URL__ : "");
  const key = (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) || (typeof window !== 'undefined' ? window.__SUPABASE_ANON__ : "");
  if (!url || !key) return null;
  _supa = createClient(url, key);
  return _supa;
}

/* ----------------------------- Dil metinleri ----------------------------- */
const SUPPORTED = ["tr", "en", "ar", "de"];
const LOCALE_LABEL = { tr: "Türkçe", en: "English", ar: "العربية", de: "Deutsch" };

const T = {
  tr: {
    title: "Giriş / Kayıt",
    brand: "Üreten Eller",
    sellerPortal: "Üreten El Portalı",
    customerPortal: "Müşteri Portalı",
    selected: "Seçili Portal:",
    welcome: "Hoş geldiniz",
    pickRoleTip: "Bir portal seçin, giriş yapın veya kaydolun.",
    email: "E‑posta",
    password: "Şifre",
    passwordAgain: "Şifre (tekrar)",
    name: "Ad Soyad",
    username: "Kullanıcı Adı",
    city: "İl",
    district: "İlçe",
    signIn: "Giriş Yap",
    signUp: "Kaydol",
    google: "Google ile devam et",
    forgot: "Şifremi Unuttum",
    or: "veya",
    show: "Göster",
    hide: "Gizle",
    accept: "Okudum, onaylıyorum",
    kvkk: "KVKK Aydınlatma",
    cookies: "Çerez Politikası",
    read: "Oku",
    policyNote: "Kaydolmadan önce KVKK ve Çerez Politikası'nı onaylayın.",
    pwdRule: "En az 8 karakter ve 1 büyük harf içermeli.",
    required: "Zorunlu alanları doldurun.",
    mismatch: "Şifreler eşleşmiyor.",
    codeSent: "Doğrulama e‑postası gönderildi.",
    resetSent: "Şifre sıfırlama e‑postası gönderildi.",
    roleInfoSeller: "(İlan açabilir; puan/yorum yapamaz)",
    roleInfoCustomer: "(İlan açamaz; puan/yorum yapabilir)",
    backHome: "Ana sayfa",
    legalBar: "Legal",
    noEnv: "Supabase ayarları eksik: .env.local içinde URL ve ANON KEY gerekli.",
  },
  en: {
    title: "Sign in / Sign up",
    brand: "Ureten Eller",
    sellerPortal: "Maker Portal",
    customerPortal: "Customer Portal",
    selected: "Selected Portal:",
    welcome: "Welcome",
    pickRoleTip: "Pick a portal, sign in or sign up.",
    email: "Email",
    password: "Password",
    passwordAgain: "Password (again)",
    name: "Full name",
    username: "Username",
    city: "City",
    district: "District",
    signIn: "Sign in",
    signUp: "Create account",
    google: "Continue with Google",
    forgot: "Forgot password",
    or: "or",
    show: "Show",
    hide: "Hide",
    accept: "I have read & accept",
    kvkk: "Privacy Notice",
    cookies: "Cookie Policy",
    read: "Read",
    policyNote: "Please accept Privacy & Cookies to sign up.",
    pwdRule: "Min 8 chars & 1 uppercase.",
    required: "Please fill required fields.",
    mismatch: "Passwords don’t match.",
    codeSent: "Verification email sent.",
    resetSent: "Password reset link sent.",
    roleInfoSeller: "(Can post listings; cannot rate)",
    roleInfoCustomer: "(Cannot post listings; can rate)",
    backHome: "Home",
    legalBar: "Legal",
    noEnv: "Supabase env missing. Add URL and ANON KEY to .env.local.",
  },
  ar: {
    title: "تسجيل الدخول / إنشاء حساب",
    brand: "أُنتِج بالأيادي",
    sellerPortal: "بوابة المُنتِجات",
    customerPortal: "بوابة العملاء",
    selected: "البوابة المختارة:",
    welcome: "مرحبًا",
    pickRoleTip: "اختر البوابة، ثم سجّل أو أنشئ حسابًا.",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    passwordAgain: "تأكيد كلمة المرور",
    name: "الاسم الكامل",
    username: "اسم المستخدم",
    city: "المدينة",
    district: "المنطقة",
    signIn: "تسجيل الدخول",
    signUp: "إنشاء حساب",
    google: "المتابعة عبر Google",
    forgot: "نسيت كلمة المرور",
    or: "أو",
    show: "إظهار",
    hide: "إخفاء",
    accept: "قرأت وأوافق",
    kvkk: "إشعار الخصوصية",
    cookies: "سياسة الكوكيز",
    read: "قراءة",
    policyNote: "يلزم الموافقة على الخصوصية والكوكيز للتسجيل.",
    pwdRule: "٨ أحرف على الأقل وحرف كبير واحد.",
    required: "يرجى ملء الحقول المطلوبة.",
    mismatch: "كلمتا المرور غير متطابقتين.",
    codeSent: "تم إرسال بريد التحقق.",
    resetSent: "تم إرسال رابط الاستعادة.",
    roleInfoSeller: "(تنشر الإعلانات ولا تقيّم)",
    roleInfoCustomer: "(لا تنشر الإعلانات ويمكنها التقييم)",
    backHome: "الرئيسية",
    legalBar: "سياسات",
    noEnv: "إعدادات Supabase مفقودة.",
  },
  de: {
    title: "Anmelden / Registrieren",
    brand: "Ureten Eller",
    sellerPortal: "Portal für Anbieterinnen",
    customerPortal: "Kundenportal",
    selected: "Gewähltes Portal:",
    welcome: "Willkommen",
    pickRoleTip: "Portal wählen, anmelden oder registrieren.",
    email: "E‑Mail",
    password: "Passwort",
    passwordAgain: "Passwort (wieder)",
    name: "Voller Name",
    username: "Benutzername",
    city: "Stadt",
    district: "Bezirk",
    signIn: "Anmelden",
    signUp: "Konto erstellen",
    google: "Mit Google fortfahren",
    forgot: "Passwort vergessen",
    or: "oder",
    show: "Anzeigen",
    hide: "Verbergen",
    accept: "Gelesen & akzeptiert",
    kvkk: "Datenschutzhinweis",
    cookies: "Cookie‑Richtlinie",
    read: "Lesen",
    policyNote: "Bitte Datenschutz & Cookies akzeptieren.",
    pwdRule: "Mind. 8 Zeichen & 1 Großbuchst.",
    required: "Bitte Pflichtfelder ausfüllen.",
    mismatch: "Passwörter stimmen nicht überein.",
    codeSent: "Bestätigungs‑E‑Mail gesendet.",
    resetSent: "Reset‑Link gesendet.",
    roleInfoSeller: "(Kann inserieren; keine Bewertung)",
    roleInfoCustomer: "(Kein Inserat; kann bewerten)",
    backHome: "Startseite",
    legalBar: "Rechtliches",
    noEnv: "Supabase‑Umgebung fehlt.",
  },
};

function useLang() {
  const [lang, setLang] = useState("tr");
  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved && SUPPORTED.includes(saved)) setLang(saved);
  }, []);
  useEffect(() => {
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);
  const t = useMemo(() => T[lang] || T.tr, [lang]);
  return { lang, setLang, t };
}

/* ----------------------------- Yardımcılar ----------------------------- */
function validPassword(pwd) { return /[A-Z]/.test(pwd) && pwd.length >= 8; }

/* ----------------------------- Sayfa ----------------------------- */
export default function LoginPage() {
  const { lang, setLang, t } = useLang();

  const [role, setRole] = useState("customer"); // seller | customer
  const [mode, setMode] = useState("signin"); // signin | signup | forgot
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  // shared
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  // signup
  const [password2, setPassword2] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [acceptKvkk, setAcceptKvkk] = useState(false);
  const [acceptCookies, setAcceptCookies] = useState(false);

  const supa = getSupabase();
  const formRef = useRef(null);

  function choosePortal(r) {
    setRole(r);
    setMode("signin");
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
  }

  function go(href) { window.location.href = href; }

  /* ----------------------------- Actions ----------------------------- */
  async function onGoogle() {
    try {
      setErr(""); setLoading(true);
      if (!supa) { setErr(t.noEnv); return; }
      const { error } = await supa.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/login`, queryParams: { access_type: "offline", prompt: "consent" } },
      });
      if (error) throw error;
    } catch (e) { setErr(e?.message || String(e)); }
    finally { setLoading(false); }
  }

  async function onSignIn(e) {
    e.preventDefault();
    try {
      setErr(""); setMsg(""); setLoading(true);
      if (!supa) { setErr(t.noEnv); return; }
      const { data, error } = await supa.auth.signInWithPassword({ email, password });
      if (error) throw error;
      let finalRole = role;
      try {
        const { data: prof } = await supa.from("profiles").select("role").eq("id", data.user.id).maybeSingle();
        if (prof?.role === "seller" || prof?.role === "customer") finalRole = prof.role;
      } catch {}
      if (finalRole === "seller") go("/portal/seller"); else go("/portal/customer");
    } catch (e) { setErr(e?.message || String(e)); }
    finally { setLoading(false); }
  }

  async function onSignUp(e) {
    e.preventDefault();
    try {
      setErr(""); setMsg("");
      if (!email || !password || !password2 || !name || !username) { setErr(t.required); return; }
      if (!validPassword(password)) { setErr(t.pwdRule); return; }
      if (password !== password2) { setErr(t.mismatch); return; }
      if (!acceptKvkk || !acceptCookies) { setErr(t.policyNote); return; }
      setLoading(true);
      if (!supa) { setErr(t.noEnv); return; }

      const { data: sign, error } = await supa.auth.signUp({
        email,
        password,
        options: { data: { name, username, city, district, role }, emailRedirectTo: `${window.location.origin}/login` },
      });
      if (error) throw error;

      if (sign?.user) {
        try {
          await supa.from("profiles").upsert({ id: sign.user.id, email, name, username, city, district, role, created_at: new Date().toISOString() });
        } catch {}
      }
      setMsg(t.codeSent); setMode("signin");
    } catch (e) { setErr(e?.message || String(e)); }
    finally { setLoading(false); }
  }

  async function onForgot(e) {
    e.preventDefault();
    try {
      setErr(""); setMsg(""); setLoading(true);
      if (!supa) { setErr(t.noEnv); return; }
      const { error } = await supa.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/login` });
      if (error) throw error;
      setMsg(t.resetSent); setMode("signin");
    } catch (e) { setErr(e?.message || String(e)); }
    finally { setLoading(false); }
  }

  // session işareti
  useEffect(() => {
    if (!supa) return;
    const { data: sub } = supa.auth.onAuthStateChange((_evt, session) => {
      if (session?.user) localStorage.setItem("authed", "1");
    });
    return () => sub?.subscription?.unsubscribe();
  }, [supa]);

  // Arkaplan animasyon degrade
  const BG = [
    "linear-gradient(120deg, #ff80ab, #a78bfa, #60a5fa, #34d399)",
    "linear-gradient(120deg, #f59e0b, #f97316, #ef4444, #8b5cf6)",
    "linear-gradient(120deg, #22c55e, #06b6d4, #3b82f6, #9333ea)",
  ];
  const [bi, setBi] = useState(0);
  useEffect(() => { const id = setInterval(() => setBi((x) => (x + 1) % BG.length), 6000); return () => clearInterval(id); }, []);

  const title = `${t.title} — ${t.brand}`;
  const roleLabel = role === "seller" ? t.sellerPortal : t.customerPortal;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Favicon'lar (login sekmesinde ikon için) */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=5" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=5" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=5" />
        <meta name="theme-color" content="#111827" />
      </Head>

      <main className="wrap" style={{ backgroundImage: BG[bi] }}>
        {/* Dil seçimi */}
        <div className="langbox">
          <select aria-label="Language" value={lang} onChange={(e) => setLang(e.target.value)}>
            {SUPPORTED.map((k) => (<option key={k} value={k}>{LOCALE_LABEL[k]}</option>))}
          </select>
          <a className="home" href="/">{t.backHome}</a>
        </div>

        {/* HERO */}
        <section className="hero">
          <img src="/logo.png" alt={t.brand} width="96" height="96" className="logo" />
          <h1 className="brand">{t.brand}</h1>
          <p className="lead">{t.welcome} · {t.pickRoleTip}</p>

          {/* Portal seçimleri */}
          <div className="roles">
            <button
              className={"role seller " + (role === "seller" ? "active" : "")}
              onClick={() => choosePortal("seller")}
              title={t.roleInfoSeller}
            >
              <span className="icn" aria-hidden>🧵</span>{t.sellerPortal}
              {role === "seller" && <span className="tick">✓</span>}
            </button>
            <button
              className={"role customer " + (role === "customer" ? "active" : "")}
              onClick={() => choosePortal("customer")}
              title={t.roleInfoCustomer}
            >
              <span className="icn" aria-hidden>🛒</span>{t.customerPortal}
              {role === "customer" && <span className="tick">✓</span>}
            </button>
          </div>

          {/* Seçili portal rozeti */}
          <div className="roleBadge" aria-live="polite">
            <span className="dot" /> {t.selected} <b>{roleLabel}</b>
          </div>
        </section>

        {/* FORM PANEL */}
        <section className="panel" ref={formRef}>
          <div className="card fancy">
            <div className="tabs">
              <button className={mode === "signin" ? "tab active" : "tab"} onClick={() => setMode("signin")}>{t.signIn}</button>
              <button className={mode === "signup" ? "tab active" : "tab"} onClick={() => setMode("signup")}>{t.signUp}</button>
              <button className={mode === "forgot" ? "tab active" : "tab"} onClick={() => setMode("forgot")}>{t.forgot}</button>
            </div>

            {(err || msg || !supa) && (
              <div className={(!supa || err) ? "alert err" : "alert ok"}>{!supa ? t.noEnv : (err || msg)}</div>
            )}

            {mode === "signin" && (
              <form onSubmit={onSignIn} className="form" noValidate>
                <label>
                  <span>{t.email}</span>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <label className="pwd">
                  <span>{t.password}</span>
                  <div className="pwdbox">
                    <input type={showPwd ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type="button" className="eye" onClick={() => setShowPwd((v) => !v)}>{showPwd ? t.hide : t.show}</button>
                  </div>
                </label>
                <div className="actions">
                  <button type="submit" className="primary" disabled={loading || !supa}>{t.signIn}</button>
                  <button type="button" className="ghost" onClick={() => setMode("forgot")}>{t.forgot}</button>
                </div>
                <div className="divider"><span>{t.or}</span></div>
                <button type="button" className="google" onClick={onGoogle} disabled={loading || !supa}>{t.google}</button>
              </form>
            )}

            {mode === "signup" && (
              <form onSubmit={onSignUp} className="form" noValidate>
                <div className="grid2">
                  <label>
                    <span>{t.name}</span>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} />
                  </label>
                  <label>
                    <span>{t.username}</span>
                    <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} />
                  </label>
                </div>
                <div className="grid2">
                  <label>
                    <span>{t.city}</span>
                    <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
                  </label>
                  <label>
                    <span>{t.district}</span>
                    <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} />
                  </label>
                </div>
                <label>
                  <span>{t.email}</span>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <div className="grid2">
                  <label className="pwd">
                    <span>{t.password} <em className="hint">({t.pwdRule})</em></span>
                    <div className="pwdbox">
                      <input type={showPwd ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} />
                      <button type="button" className="eye" onClick={() => setShowPwd((v) => !v)}>{showPwd ? t.hide : t.show}</button>
                    </div>
                  </label>
                  <label>
                    <span>{t.passwordAgain}</span>
                    <input type={showPwd ? "text" : "password"} required value={password2} onChange={(e) => setPassword2(e.target.value)} />
                  </label>
                </div>

                <div className="checks">
                  <label className="check">
                    <input type="checkbox" checked={acceptKvkk} onChange={(e) => setAcceptKvkk(e.target.checked)} />
                    <span>{t.accept} <a href="/legal/kvkk-aydinlatma" target="_blank" rel="noreferrer">{t.kvkk}</a></span>
                    <a className="read" href="/legal/kvkk-aydinlatma" target="_blank" rel="noreferrer">{t.read}</a>
                  </label>
                  <label className="check">
                    <input type="checkbox" checked={acceptCookies} onChange={(e) => setAcceptCookies(e.target.checked)} />
                    <span>{t.accept} <a href="/legal/cerez-politikasi" target="_blank" rel="noreferrer">{t.cookies}</a></span>
                    <a className="read" href="/legal/cerez-politikasi" target="_blank" rel="noreferrer">{t.read}</a>
                  </label>
                </div>

                <div className="actions">
                  <button type="submit" className="primary" disabled={loading || !supa}>{t.signUp}</button>
                  <button type="button" className="ghost" onClick={() => setMode("signin")}>{t.signIn}</button>
                </div>
                <div className="divider"><span>{t.or}</span></div>
                <button type="button" className="google" onClick={onGoogle} disabled={loading || !supa}>{t.google}</button>
              </form>
            )}

            {mode === "forgot" && (
              <form onSubmit={onForgot} className="form" noValidate>
                <label>
                  <span>{t.email}</span>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <div className="actions">
                  <button type="submit" className="primary" disabled={loading || !supa}>{t.forgot}</button>
                  <button type="button" className="ghost" onClick={() => setMode("signin")}>{t.signIn}</button>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* LEGAL FOOTER */}
      <footer className="legalFooter">
        <div className="legalInner">
          <nav className="legalLinks" aria-label={t.legalBar}>
            <a href="/legal/kurumsal">Kurumsal</a>
            <a href="/legal/hakkimizda">Hakkımızda</a>
            <a href="/legal/iletisim">İletişim</a>
            <a href="/legal/gizlilik">Gizlilik</a>
            <a href="/legal/kvkk-aydinlatma">KVKK</a>
            <a href="/legal/kullanim-sartlari">Kullanım Şartları</a>
            <a href="/legal/mesafeli-satis-sozlesmesi">Mesafeli Satış</a>
            <a href="/legal/teslimat-iade">Teslimat & İade</a>
            <a href="/legal/cerez-politikasi">Çerez Politikası</a>
            <a href="/legal/topluluk-kurallari">Topluluk Kuralları</a>
            <a href="/legal/yasakli-urunler">Yasaklı Ürünler</a>
            <a href="/legal" className="homeLink">Tüm Legal</a>
          </nav>
          <div className="copy">© {new Date().getFullYear()} Üreten Eller</div>
        </div>
      </footer>

      <style>{`
        :root { --ink:#0f172a; --muted:#475569; --paper:rgba(255,255,255,.96); --line:rgba(0,0,0,.08); }
        html, body { height:100%; }
        body { margin:0; color:var(--ink); font-family: system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial,sans-serif; min-height:100vh; display:flex; flex-direction:column; }
        .wrap { min-height:100vh; display:flex; flex-direction:column; background-attachment: fixed; }

        /* dil kutusu */
        .langbox { position:fixed; top:12px; right:12px; z-index:50; background:var(--paper); border:1px solid var(--line); border-radius:12px; padding:6px 10px; backdrop-filter: blur(10px); display:flex; gap:10px; align-items:center; }
        .langbox select { border:none; background:transparent; font-weight:700; cursor:pointer; }
        .langbox .home { text-decoration:none; font-size:13px; color:#0f172a; font-weight:800; }

        /* hero */
        .hero { display:grid; place-items:center; text-align:center; gap:8px; padding:92px 16px 14px; color:#0b1324; }
        .logo { filter: drop-shadow(0 10px 24px rgba(0,0,0,.18)); border-radius:20px; }
        .brand { margin:6px 0 0; font-size:44px; letter-spacing:.2px; }
        .lead { margin:0; font-weight:700; }

        .roles { display:flex; gap:12px; flex-wrap:wrap; justify-content:center; margin-top:10px; }
        .role { position:relative; padding:12px 16px; border-radius:999px; border:1px solid #0b1324; background:#0b1324; color:#fff; font-weight:900; cursor:pointer; display:inline-flex; align-items:center; gap:8px; box-shadow:0 10px 30px rgba(0,0,0,.18); }
        .role.ghost { background:#ffffffee; color:#0b1324; border:1px solid var(--line); }
        .role .icn { font-size:18px; }
        .role .tick { position:absolute; top:-6px; right:-6px; background:#10b981; color:#fff; width:20px; height:20px; border-radius:999px; display:grid; place-items:center; font-size:12px; box-shadow:0 6px 16px rgba(0,0,0,.25); }
        .role.active { outline: 2px solid #fff; box-shadow:0 18px 48px rgba(0,0,0,.28); }

        .roleBadge { margin-top:10px; display:inline-flex; align-items:center; gap:8px; background:rgba(255,255,255,.92); border:1px solid var(--line); border-radius:999px; padding:6px 12px; font-weight:800; }
        .roleBadge .dot { width:10px; height:10px; border-radius:999px; background:#10b981; display:inline-block; box-shadow:0 0 0 3px rgba(16,185,129,.25); }

        /* panel */
        .panel { display:grid; place-items:center; padding:16px 16px 28px; }
        .card { width:100%; max-width:820px; background:var(--paper); border:1px solid var(--line); border-radius:22px; box-shadow:0 18px 58px rgba(0,0,0,.18); overflow:hidden; position:relative; }
        /* neon gradient kenar */
        .card.fancy:before { content:""; position:absolute; inset:-2px; z-index:-1; border-radius:24px; background:conic-gradient(from 180deg at 50% 50%, #ff80ab, #60a5fa, #34d399, #f59e0b, #ff80ab); filter:blur(16px); opacity:.6; }

        .tabs { display:flex; gap:6px; padding:10px; background:linear-gradient(135deg,#11182710,#11182705); border-bottom:1px solid var(--line); }
        .tab { flex:1; padding:10px 14px; border-radius:12px; border:1px solid var(--line); background:#fff; cursor:pointer; font-weight:800; }
        .tab.active { background:#111827; color:#fff; border-color:#111827; }

        .form { padding:16px; display:grid; gap:12px; }
        .grid2 { display:grid; gap:12px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
        @media (max-width:560px){ .grid2 { grid-template-columns: 1fr; } }
        label span { display:block; font-size:13px; color:#334155; margin-bottom:4px; }
        input { width:100%; padding:12px; border-radius:12px; border:1px solid #e5e7eb; font-size:15px; background:#fff; }
        .pwdbox { display:flex; gap:8px; align-items:center; }
        .eye { border:1px solid var(--line); background:#fff; border-radius:10px; padding:8px 10px; cursor:pointer; }
        .hint { color:#64748b; font-weight:500; font-style:normal; }

        .actions { display:flex; gap:10px; flex-wrap:wrap; }
        .primary { padding:12px 16px; border-radius:12px; border:1px solid #111827; background:#111827; color:#fff; font-weight:900; cursor:pointer; }
        .ghost { padding:12px 16px; border-radius:12px; border:1px solid var(--line); background:#fff; color:#0f172a; font-weight:800; cursor:pointer; }
        .google { padding:12px 16px; border-radius:12px; border:1px solid #e5e7eb; background:#fff; font-weight:900; cursor:pointer; width:100%; }
        .divider { text-align:center; color:#64748b; font-size:12px; }
        .divider span { background:#fff; padding:0 8px; border-radius:999px; border:1px solid var(--line); }

        .checks { display:grid; gap:8px; }
        .check { display:flex; align-items:center; gap:8px; justify-content:space-between; border:1px dashed #e5e7eb; border-radius:12px; padding:8px 10px; }
        .check span a { color:#0f172a; font-weight:800; text-decoration:underline; }
        .check .read { font-size:12px; color:#334155; text-decoration:underline; }

        .alert { margin:10px; padding:10px 12px; border-radius:12px; font-weight:800; }
        .alert.ok { background:#ecfeff; border:1px solid #a5f3fc; color:#0e7490; }
        .alert.err { background:#fef2f2; border:1px solid #fecaca; color:#991b1b; }

        /* LEGAL FOOTER – full-bleed */
        .legalFooter { background:#0b0b0b; color:#f8fafc; border-top:1px solid rgba(255,255,255,.12); width:100vw; margin-left:calc(50% - 50vw); margin-right:calc(50% - 50vw); }
        .legalInner { max-width:1120px; margin:0 auto; padding:12px 16px calc(12px + env(safe-area-inset-bottom)); }
        .legalLinks { display:flex; flex-wrap:wrap; gap:10px; }
        .legalLinks > a { color:#e2e8f0; font-size:13px; padding:6px 8px; border-radius:8px; text-decoration:none; }
        .legalLinks > a:hover { background: rgba(255,255,255,.08); color:#fff; }
        .homeLink { margin-left:auto; font-weight:800; }
        .copy { margin-top:6px; font-size:12px; color:#cbd5e1; }
        html[dir="rtl"] .homeLink { margin-left:0; margin-right:auto; }
      `}</style>
    </>
  );
}
