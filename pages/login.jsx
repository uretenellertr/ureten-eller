"use client";
import React, { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { createClient } from "@supabase/supabase-js";

/**
 * ENV GEREKSİNİMİ
 * .env.local içine ekleyin (build sırasında otomatik okunur):
 * NEXT_PUBLIC_SUPABASE_URL=https://krmjbjfwmnhzfhnrswgg.supabase.co
 * NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
 * NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=drew5qmug
 */

// Supabase init — preview-safe (env yoksa null döner)
let sb = null;
function getSupabase() {
  if (sb) return sb;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || (typeof window !== 'undefined' ? window.__SUPABASE_URL__ : "");
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || (typeof window !== 'undefined' ? window.__SUPABASE_ANON__ : "");
  if (!url || !key) return null; // Canvas/preview'de env yoksa crash olmasın
  sb = createClient(url, key);
  return sb;
}

/* ----------------------------- DİL ----------------------------- */
const SUPPORTED = ["tr", "en", "ar", "de"];
const LOCALE_LABEL = { tr: "Türkçe", en: "English", ar: "العربية", de: "Deutsch" };
const TXT = {
  tr: {
    titleLogin: "Giriş / Kayıt",
    welcome: "Hoş geldiniz",
    roleSeller: "Üreten El",
    roleCustomer: "Müşteri",
    email: "E‑posta",
    password: "Şifre",
    passwordAgain: "Şifre (tekrar)",
    name: "Ad Soyad",
    username: "Kullanıcı Adı",
    city: "İl",
    district: "İlçe",
    or: "veya",
    signIn: "Giriş Yap",
    signUp: "Kaydol",
    google: "Google ile devam et",
    forgot: "Şifremi Unuttum",
    showPwd: "Göster",
    hidePwd: "Gizle",
    accept: "Kabul ediyorum",
    kvkk: "KVKK Aydınlatma",
    cookies: "Çerez Politikası",
    policyNote: "Kaydolmadan önce KVKK ve Çerez Politikası'nı onaylayın.",
    read: "Oku",
    codeSent: "Doğrulama e‑postası gönderildi. Lütfen e‑postanızı kontrol edin.",
    resetSent: "Şifre sıfırlama bağlantısı e‑postanıza gönderildi.",
    pwdRule: "En az 8 karakter ve 1 büyük harf içermelidir.",
    mismatch: "Şifreler eşleşmiyor.",
    required: "Zorunlu alanları doldurun.",
    roleInfoSeller: "(İlan açabilir, yoruma/puanlamaya katılmaz)",
    roleInfoCustomer: "(İlan açamaz, yorum ve puanlamaya katılır)",
    backHome: "Ana sayfaya dön",
  },
  en: {
    titleLogin: "Sign in / Sign up",
    welcome: "Welcome",
    roleSeller: "Maker",
    roleCustomer: "Customer",
    email: "Email",
    password: "Password",
    passwordAgain: "Password (again)",
    name: "Full name",
    username: "Username",
    city: "City",
    district: "District",
    or: "or",
    signIn: "Sign in",
    signUp: "Create account",
    google: "Continue with Google",
    forgot: "Forgot password",
    showPwd: "Show",
    hidePwd: "Hide",
    accept: "I accept",
    kvkk: "Privacy Notice",
    cookies: "Cookie Policy",
    policyNote: "Please accept Privacy & Cookies to sign up.",
    read: "Read",
    codeSent: "Verification email sent. Please check your inbox.",
    resetSent: "Password reset link sent to your email.",
    pwdRule: "Min 8 chars & 1 uppercase.",
    mismatch: "Passwords don’t match.",
    required: "Please fill required fields.",
    roleInfoSeller: "(Can post listings, cannot rate)",
    roleInfoCustomer: "(Cannot post listings, can rate)",
    backHome: "Back to home",
  },
  ar: {
    titleLogin: "تسجيل الدخول / إنشاء حساب",
    welcome: "مرحبًا بك",
    roleSeller: "منتِجة",
    roleCustomer: "عميل",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    passwordAgain: "تأكيد كلمة المرور",
    name: "الاسم الكامل",
    username: "اسم المستخدم",
    city: "المدينة",
    district: "المنطقة",
    or: "أو",
    signIn: "تسجيل الدخول",
    signUp: "إنشاء حساب",
    google: "المتابعة عبر Google",
    forgot: "نسيت كلمة المرور",
    showPwd: "إظهار",
    hidePwd: "إخفاء",
    accept: "أوافق",
    kvkk: "إشعار الخصوصية",
    cookies: "سياسة الكوكيز",
    policyNote: "يجب الموافقة على الخصوصية والكوكيز للتسجيل.",
    read: "قراءة",
    codeSent: "تم إرسال بريد تحقق. يرجى فحص بريدك.",
    resetSent: "تم إرسال رابط إعادة التعيين لبريدك.",
    pwdRule: "٨ أحرف على الأقل وحرف كبير واحد.",
    mismatch: "كلمتا المرور غير متطابقتين.",
    required: "يرجى ملء الحقول المطلوبة.",
    roleInfoSeller: "(تنشر الإعلانات ولا تقيّم)",
    roleInfoCustomer: "(لا تنشر الإعلانات ويمكنها التقييم)",
    backHome: "العودة للرئيسية",
  },
  de: {
    titleLogin: "Anmelden / Registrieren",
    welcome: "Willkommen",
    roleSeller: "Anbieterin",
    roleCustomer: "Kundin/Kunde",
    email: "E‑Mail",
    password: "Passwort",
    passwordAgain: "Passwort (wieder)",
    name: "Voller Name",
    username: "Benutzername",
    city: "Stadt",
    district: "Bezirk",
    or: "oder",
    signIn: "Anmelden",
    signUp: "Konto erstellen",
    google: "Mit Google fortfahren",
    forgot: "Passwort vergessen",
    showPwd: "Anzeigen",
    hidePwd: "Verbergen",
    accept: "Ich akzeptiere",
    kvkk: "Datenschutzhinweis",
    cookies: "Cookie‑Richtlinie",
    policyNote: "Bitte Datenschutz & Cookies akzeptieren.",
    read: "Lesen",
    codeSent: "Bestätigungs‑E‑Mail gesendet.",
    resetSent: "Link zum Zurücksetzen gesendet.",
    pwdRule: "Mind. 8 Zeichen & 1 Großbuchst.",
    mismatch: "Passwörter stimmen nicht überein.",
    required: "Bitte Pflichtfelder ausfüllen.",
    roleInfoSeller: "(Kann inserieren, keine Bewertung)",
    roleInfoCustomer: "(Kein Inserat, kann bewerten)",
    backHome: "Zur Startseite",
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
  return { lang, setLang, t: TXT[lang] || TXT.tr };
}

/* ----------------------------- YARDIMCI ----------------------------- */
function validPassword(pwd) {
  return /[A-Z]/.test(pwd) && pwd.length >= 8;
}

/* ----------------------------- SAYFA ----------------------------- */
export default function LoginPage() {
  const { lang, setLang, t } = useLang();

  // role query ( ?role=seller | customer )
  const [role, setRole] = useState("customer");
  useEffect(() => {
    const qp = new URLSearchParams(window.location.search);
    const r = qp.get("role");
    if (r === "seller" || r === "customer") setRole(r);
  }, []);

  const [mode, setMode] = useState("signin"); // 'signin' | 'signup' | 'forgot'
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  // shared fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  // signup fields
  const [password2, setPassword2] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [acceptKvkk, setAcceptKvkk] = useState(false);
  const [acceptCookies, setAcceptCookies] = useState(false);

  // redirect helper
  function go(path) { window.location.href = path; }

  async function handleGoogle() {
    try {
      setErr("");
      setLoading(true);
      const supa = getSupabase();
      if (!supa) { setErr("Supabase ayarları eksik (ENV)"); return; }
      const { error } = await supa.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/login`, queryParams: { access_type: "offline", prompt: "consent" } },
      });
      if (error) throw error;
    } catch (e) {
      setErr(e.message || String(e));
    } finally { setLoading(false); }
  } {
    try {
      setErr("");
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/login`,
          queryParams: { access_type: "offline", prompt: "consent" },
        },
      });
      if (error) throw error;
    } catch (e) {
      setErr(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  async function handleSignIn(e) {
    e.preventDefault();
    try {
      setErr(""); setMsg(""); setLoading(true);
      const supa = getSupabase();
      if (!supa) { setErr("Supabase ayarları eksik (ENV)"); return; }
      const { error, data } = await supa.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const { data: prof } = await supa.from("profiles").select("role").eq("id", data.user.id).maybeSingle();
      const r = prof?.role || role || "customer";
      if (r === "seller") go("/portal/seller"); else go("/portal/customer");
    } catch (e) { setErr(e.message || String(e)); }
    finally { setLoading(false); }
  } {
    e.preventDefault();
    try {
      setErr("");
      setMsg("");
      setLoading(true);
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      // profil çek ve role göre yönlendir (varsayılan customer)
      const { data: prof } = await supabase.from("profiles").select("role").eq("id", data.user.id).maybeSingle();
      const r = prof?.role || role || "customer";
      if (r === "seller") go("/portal/seller"); else go("/portal/customer");
    } catch (e) {
      setErr(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUp(e) {
    e.preventDefault();
    try {
      setErr(""); setMsg("");
      if (!email || !password || !password2 || !name || !username) { setErr(t.required); return; }
      if (!validPassword(password)) { setErr(t.pwdRule); return; }
      if (password !== password2) { setErr(t.mismatch); return; }
      if (!acceptKvkk || !acceptCookies) { setErr(t.policyNote); return; }
      setLoading(true);

      const supa = getSupabase();
      if (!supa) { setErr("Supabase ayarları eksik (ENV)"); return; }
      const { data: sign, error } = await supa.auth.signUp({
        email,
        password,
        options: { data: { name, username, city, district, role }, emailRedirectTo: `${window.location.origin}/login` },
      });
      if (error) throw error;
      if (sign.user) {
        await supa.from("profiles").upsert({ id: sign.user.id, email, name, username, city, district, role, created_at: new Date().toISOString() });
      }
      setMsg(t.codeSent); setMode("signin");
    } catch (e) { setErr(e.message || String(e)); }
    finally { setLoading(false); }
  } {
    e.preventDefault();
    try {
      setErr("");
      setMsg("");
      if (!email || !password || !password2 || !name || !username) {
        setErr(t.required); return;
      }
      if (!validPassword(password)) { setErr(t.pwdRule); return; }
      if (password !== password2) { setErr(t.mismatch); return; }
      if (!acceptKvkk || !acceptCookies) { setErr(t.policyNote); return; }
      setLoading(true);

      const { data: sign, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, username, city, district, role },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });
      if (error) throw error;

      // profil tablosuna ek (RLS: user = auth.uid())
      if (sign.user) {
        await supabase.from("profiles").upsert({
          id: sign.user.id,
          email,
          name,
          username,
          city,
          district,
          role,
          created_at: new Date().toISOString(),
        });
      }
      setMsg(t.codeSent);
      setMode("signin");
    } catch (e) {
      setErr(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  async function handleForgot(e) {
    e.preventDefault();
    try {
      setErr(""); setMsg(""); setLoading(true);
      const supa = getSupabase();
      if (!supa) { setErr("Supabase ayarları eksik (ENV)"); return; }
      const { error } = await supa.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/login` });
      if (error) throw error;
      setMsg(t.resetSent); setMode("signin");
    } catch (e) { setErr(e.message || String(e)); }
    finally { setLoading(false); }
  } {
    e.preventDefault();
    try {
      setErr("");
      setMsg("");
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      if (error) throw error;
      setMsg(t.resetSent);
      setMode("signin");
    } catch (e) {
      setErr(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  // başarılı login sonra session dinle ve local storage
  useEffect(() => {
    const supaForSub = getSupabase();
    if (!supaForSub) return;
    const { data: sub } = supaForSub.auth.onAuthStateChange(async (evt, session) => {
      if (session?.user) {
        localStorage.setItem("authed", "1");
      }
    });
        // rol ile yönlendirme (sayfada kalırsa butonlarla gider)
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const ACCENTS = ["#111827", "#4b2e2b", "#7f1d1d", "#065f46", "#0ea5e9", "#7c3aed"];
  const [ai, setAi] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setAi((x) => (x + 1) % ACCENTS.length), 5000);
    return () => clearInterval(id);
  }, []);
  const accent = ACCENTS[ai];

  const title = `${TXT[lang]?.welcome || TXT.tr.welcome} – ${role === "seller" ? TXT[lang]?.roleSeller : TXT[lang]?.roleCustomer}`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="wrap">
        {/* Dil seçimi */}
        <div className="langbox">
          <select aria-label="Language" value={lang} onChange={(e) => setLang(e.target.value)}>
            {SUPPORTED.map((k) => (
              <option key={k} value={k}>{LOCALE_LABEL[k]}</option>
            ))}
          </select>
          <a className="home" href="/">{TXT[lang]?.backHome}</a>
        </div>

        {/* Başlık */}
        <section className="hero" style={{ "--accent": accent }}>
          <img src="/logo.png" alt="logo" width="88" height="88" className="logo" />
          <h1 className="title">{TXT[lang]?.titleLogin}</h1>
          <p className="subtitle">{title} {role === "seller" ? <small>{TXT[lang]?.roleInfoSeller}</small> : <small>{TXT[lang]?.roleInfoCustomer}</small>}</p>
        </section>

        {/* Kart */}
        <section className="panel">
          <div className="card">
            {/* Tablar */}
            <div className="tabs">
              <button className={mode === "signin" ? "tab active" : "tab"} onClick={() => setMode("signin")}>{TXT[lang]?.signIn}</button>
              <button className={mode === "signup" ? "tab active" : "tab"} onClick={() => setMode("signup")}>{TXT[lang]?.signUp}</button>
              <button className={mode === "forgot" ? "tab active" : "tab"} onClick={() => setMode("forgot")}>{TXT[lang]?.forgot}</button>
            </div>

            {/* Mesajlar */}
            {(err || msg) && (
              <div className={err ? "alert err" : "alert ok"}>{err || msg}</div>
            )}

            {/* Sign in */}
            {mode === "signin" && (
              <form onSubmit={handleSignIn} className="form">
                <label>
                  <span>{TXT[lang]?.email}</span>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <label className="pwd">
                  <span>{TXT[lang]?.password}</span>
                  <div className="pwdbox">
                    <input type={showPwd ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type="button" className="eye" onClick={() => setShowPwd((v) => !v)}>{showPwd ? TXT[lang]?.hidePwd : TXT[lang]?.showPwd}</button>
                  </div>
                </label>
                <div className="actions">
                  <button type="submit" className="primary" disabled={loading}>{TXT[lang]?.signIn}</button>
                  <button type="button" className="ghost" onClick={() => setMode("forgot")}>{TXT[lang]?.forgot}</button>
                </div>
                <div className="divider"><span>{TXT[lang]?.or}</span></div>
                <button type="button" className="google" onClick={handleGoogle} disabled={loading}>{TXT[lang]?.google}</button>
              </form>
            )}

            {/* Sign up */}
            {mode === "signup" && (
              <form onSubmit={handleSignUp} className="form">
                <div className="grid2">
                  <label>
                    <span>{TXT[lang]?.name}</span>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} />
                  </label>
                  <label>
                    <span>{TXT[lang]?.username}</span>
                    <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} />
                  </label>
                </div>
                <div className="grid2">
                  <label>
                    <span>{TXT[lang]?.city}</span>
                    <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
                  </label>
                  <label>
                    <span>{TXT[lang]?.district}</span>
                    <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} />
                  </label>
                </div>
                <label>
                  <span>{TXT[lang]?.email}</span>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <div className="grid2">
                  <label className="pwd">
                    <span>{TXT[lang]?.password} <em className="hint">({TXT[lang]?.pwdRule})</em></span>
                    <div className="pwdbox">
                      <input type={showPwd ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} />
                      <button type="button" className="eye" onClick={() => setShowPwd((v) => !v)}>{showPwd ? TXT[lang]?.hidePwd : TXT[lang]?.showPwd}</button>
                    </div>
                  </label>
                  <label>
                    <span>{TXT[lang]?.passwordAgain}</span>
                    <input type={showPwd ? "text" : "password"} required value={password2} onChange={(e) => setPassword2(e.target.value)} />
                  </label>
                </div>

                {/* KVKK & Cookies */}
                <div className="checks">
                  <label className="check">
                    <input type="checkbox" checked={acceptKvkk} onChange={(e) => setAcceptKvkk(e.target.checked)} />
                    <span>{TXT[lang]?.accept} <a href="/legal/kvkk-aydinlatma" target="_blank" rel="noreferrer">{TXT[lang]?.kvkk}</a></span>
                    <a className="read" href="/legal/kvkk-aydinlatma" target="_blank" rel="noreferrer">{TXT[lang]?.read}</a>
                  </label>
                  <label className="check">
                    <input type="checkbox" checked={acceptCookies} onChange={(e) => setAcceptCookies(e.target.checked)} />
                    <span>{TXT[lang]?.accept} <a href="/legal/cerez-politikasi" target="_blank" rel="noreferrer">{TXT[lang]?.cookies}</a></span>
                    <a className="read" href="/legal/cerez-politikasi" target="_blank" rel="noreferrer">{TXT[lang]?.read}</a>
                  </label>
                </div>

                <div className="actions">
                  <button type="submit" className="primary" disabled={loading}>{TXT[lang]?.signUp}</button>
                  <button type="button" className="ghost" onClick={() => setMode("signin")}>{TXT[lang]?.signIn}</button>
                </div>
                <div className="divider"><span>{TXT[lang]?.or}</span></div>
                <button type="button" className="google" onClick={handleGoogle} disabled={loading}>{TXT[lang]?.google}</button>
              </form>
            )}

            {/* Forgot */}
            {mode === "forgot" && (
              <form onSubmit={handleForgot} className="form">
                <label>
                  <span>{TXT[lang]?.email}</span>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <div className="actions">
                  <button type="submit" className="primary" disabled={loading}>{TXT[lang]?.forgot}</button>
                  <button type="button" className="ghost" onClick={() => setMode("signin")}>{TXT[lang]?.signIn}</button>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* LEGAL FOOTER – full-bleed */}
      <footer className="legalFooter">
        <div className="legalInner">
          <nav className="legalLinks" aria-label="Legal">
            <a href="/legal/kurumsal">Kurumsal</a>
            <a href="/legal/hakkimizda">Hakkımızda</a>
            <a href="/legal/iletisim">İletişim</a>
            <a href="/legal/gizlilik">Gizlilik</a>
            <a href="/legal/kvkk-aydinlatma">KVKK</a>
            <a href="/legal/mesafeli-satis-sozlesmesi">Mesafeli Satış</a>
            <a href="/legal/teslimat-iade">Teslimat & İade</a>
            <a href="/legal/cerez-politikasi">Çerez Politikası</a>
            <a href="/legal/topluluk-kurallari">Topluluk Kuralları</a>
            <a href="/legal/yasakli-urunler">Yasaklı Ürünler</a>
            <a href="/legal" className="homeLink">Tüm Legal</a>
          </nav>
          <div className="copy">© 2025 Üreten Eller</div>
        </div>
      </footer>

      <style>{`
        :root { --ink:#0f172a; --muted:#475569; --paper:rgba(255,255,255,.96); --line:rgba(0,0,0,.08); }
        html, body { height:100%; }
        body { margin:0; color:var(--ink); font-family: system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial, sans-serif; background: radial-gradient(1200px 600px at 20% 0%, #ffe4e6, transparent), radial-gradient(1000px 500px at 80% 0%, #e0e7ff, transparent), linear-gradient(120deg, #ff80ab, #a78bfa, #60a5fa, #34d399); background-attachment: fixed; min-height:100vh; display:flex; flex-direction:column; }
        .wrap { max-width:1120px; margin:0 auto; padding:18px 16px 0; flex:1; }

        .langbox { position:fixed; top:12px; right:12px; z-index:50; background:var(--paper); border:1px solid var(--line); border-radius:12px; padding:6px 10px; backdrop-filter: blur(8px); display:flex; gap:10px; align-items:center; }
        .langbox select { border:none; background:transparent; font-weight:600; cursor:pointer; }
        .langbox .home { text-decoration:none; font-size:13px; color:#0f172a; font-weight:700; }

        .hero { display:grid; place-items:center; text-align:center; gap:6px; padding:82px 0 14px; }
        .logo { filter: drop-shadow(0 10px 24px rgba(0,0,0,.18)); border-radius:18px; }
        .title { margin:8px 0 0; font-size:40px; color: var(--accent); }
        .subtitle { margin:0; font-size:16px; color:#0f172a; }

        .panel { display:grid; place-items:center; padding:10px 0 24px; }
        .card { width:100%; max-width:720px; background:var(--paper); border:1px solid var(--line); border-radius:20px; box-shadow:0 12px 36px rgba(0,0,0,.12); overflow:hidden; }
        .tabs { display:flex; gap:6px; padding:10px; background:linear-gradient(135deg, #11182710, #11182705); border-bottom:1px solid var(--line); }
        .tab { flex:1; padding:10px 14px; border-radius:12px; border:1px solid var(--line); background:#fff; cursor:pointer; font-weight:700; }
        .tab.active { background:#111827; color:#fff; border-color:#111827; }

        .form { padding:14px; display:grid; gap:12px; }
        label span { display:block; font-size:13px; color:#334155; margin-bottom:4px; }
        input { width:100%; padding:12px 12px; border-radius:12px; border:1px solid #e5e7eb; font-size:15px; background:#fff; }
        .grid2 { display:grid; gap:12px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .pwdbox { display:flex; gap:8px; align-items:center; }
        .eye { border:1px solid var(--line); background:#fff; border-radius:10px; padding:8px 10px; cursor:pointer; }
        .hint { color:#64748b; font-weight:500; }

        .actions { display:flex; gap:10px; flex-wrap:wrap; }
        .primary { padding:12px 16px; border-radius:12px; border:1px solid #111827; background:#111827; color:#fff; font-weight:800; cursor:pointer; }
        .ghost { padding:12px 16px; border-radius:12px; border:1px solid var(--line); background:#fff; color:#0f172a; font-weight:700; cursor:pointer; }
        .google { padding:12px 16px; border-radius:12px; border:1px solid #e5e7eb; background:#fff; font-weight:800; cursor:pointer; }
        .divider { text-align:center; color:#64748b; font-size:12px; }
        .divider span { background:#fff; padding:0 8px; border-radius:999px; border:1px solid var(--line); }

        .checks { display:grid; gap:8px; }
        .check { display:flex; align-items:center; gap:8px; justify-content:space-between; border:1px dashed #e5e7eb; border-radius:12px; padding:8px 10px; }
        .check span a { color:#0f172a; font-weight:800; text-decoration:underline; }
        .check .read { font-size:12px; color:#334155; text-decoration:underline; }

        .alert { margin:10px; padding:10px 12px; border-radius:12px; font-weight:700; }
        .alert.ok { background:#ecfeff; border:1px solid #a5f3fc; color:#0e7490; }
        .alert.err { background:#fef2f2; border:1px solid #fecaca; color:#991b1b; }

        @media (max-width:560px){ .grid2 { grid-template-columns: 1fr; } .title{font-size:32px} }

        /* LEGAL FOOTER */
        .legalFooter { background:#0b0b0b; color:#f8fafc; border-top:1px solid rgba(255,255,255,.12); width:100vw; margin-left:calc(50% - 50vw); margin-right:calc(50% - 50vw); }
        .legalInner { max-width:1120px; margin:0 auto; padding:12px 16px calc(12px + env(safe-area-inset-bottom)); }
        .legalLinks { display:flex; flex-wrap:wrap; gap:10px; }
        .legalLinks > a { color:#e2e8f0; font-size:13px; padding:6px 8px; border-radius:8px; text-decoration:none; }
        .legalLinks > a:hover { background: rgba(255,255,255,.08); color:#fff; }
        .homeLink { margin-left:auto; font-weight:700; }
        .copy { margin-top:6px; font-size:12px; color:#cbd5e1; }
        html[dir="rtl"] .homeLink { margin-left:0; margin-right:auto; }
      `}</style>
    </>
  );
}
