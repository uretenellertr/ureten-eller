"use client";
import React, { useEffect, useMemo, useState } from "react";
import Head from "next/head";

/* ---------------------------- FIREBASE ---------------------------- */
import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCd9GjP6CDA8i4XByhXDHyESy-g_DHVwvQ",
  authDomain: "ureteneller-ecaac.firebaseapp.com",
  projectId: "ureteneller-ecaac",
  storageBucket: "ureteneller-ecaac.firebasestorage.app",
  messagingSenderId: "368042877151",
  appId: "1:368042877151:web:ee0879fc4717928079c96a",
  measurementId: "G-BJHKN8V4RQ",
};
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);

/* ---------------------------- DİL ---------------------------- */
const SUPPORTED = ["tr","en","ar","de"];
const LBL = {
  tr: {
    brand: "Üreten Eller",
    title: "Giriş / Kayıt",
    welcome: "Hoş geldiniz",
    pick: "Portal seçin ve giriş yapın",
    seller: "Satıcı (Üreten El)",
    customer: "Müşteri",
    email: "E-posta",
    password: "Şifre",
    password2: "Şifre (tekrar)",
    name: "Ad Soyad",
    username: "Kullanıcı adı",
    city: "İl",
    district: "İlçe",
    signin: "Giriş Yap",
    signup: "Kaydol",
    google: "Google ile devam et",
    forgot: "Şifremi Unuttum",
    sendReset: "Sıfırlama Bağlantısı Gönder",
    haveAcc: "Hesabın var mı?",
    noAcc: "Hesabın yok mu?",
    rules: "En az 8 karakter ve 1 büyük harf",
    agreeKVKK: "KVKK ve Çerez Politikası'nı okudum, onaylıyorum.",
    policy: "Politikalar",
    back: "Geri",
    verifySent: "Doğrulama e-postası gönderildi.",
    resetSent: "Sıfırlama e-postası gönderildi.",
    logout: "Çıkış",
  },
  en: {
    brand: "Ureten Eller",
    title: "Login / Register",
    welcome: "Welcome",
    pick: "Choose a portal and sign in",
    seller: "Seller",
    customer: "Customer",
    email: "Email",
    password: "Password",
    password2: "Password (again)",
    name: "Full name",
    username: "Username",
    city: "City",
    district: "District",
    signin: "Sign In",
    signup: "Sign Up",
    google: "Continue with Google",
    forgot: "Forgot Password",
    sendReset: "Send Reset Link",
    haveAcc: "Have an account?",
    noAcc: "No account?",
    rules: "Min 8 chars and 1 uppercase",
    agreeKVKK: "I accept KVKK & Cookie Policy.",
    policy: "Policies",
    back: "Back",
    verifySent: "Verification email sent.",
    resetSent: "Password reset email sent.",
    logout: "Logout",
  },
  ar: {
    brand: "أُنتِج بالأيادي",
    title: "تسجيل الدخول / إنشاء حساب",
    welcome: "مرحبًا",
    pick: "اختر البوابة وسجّل الدخول",
    seller: "بائع",
    customer: "عميل",
    email: "البريد",
    password: "كلمة المرور",
    password2: "تأكيد كلمة المرور",
    name: "الاسم الكامل",
    username: "اسم المستخدم",
    city: "المدينة",
    district: "الحي",
    signin: "تسجيل الدخول",
    signup: "إنشاء حساب",
    google: "المتابعة مع Google",
    forgot: "نسيت كلمة المرور",
    sendReset: "إرسال رابط الاستعادة",
    haveAcc: "لديك حساب؟",
    noAcc: "ليس لديك حساب؟",
    rules: "8 أحرف على الأقل وحرف كبير",
    agreeKVKK: "أوافق على سياسة KVKK والكوكيز",
    policy: "السياسات",
    back: "رجوع",
    verifySent: "تم إرسال رسالة التحقق.",
    resetSent: "تم إرسال رابط الاستعادة.",
    logout: "تسجيل الخروج",
  },
  de: {
    brand: "Ureten Eller",
    title: "Anmelden / Registrieren",
    welcome: "Willkommen",
    pick: "Portal wählen und anmelden",
    seller: "Verkäufer",
    customer: "Kunde",
    email: "E-Mail",
    password: "Passwort",
    password2: "Passwort (wiederholen)",
    name: "Vollständiger Name",
    username: "Benutzername",
    city: "Stadt",
    district: "Bezirk",
    signin: "Anmelden",
    signup: "Registrieren",
    google: "Mit Google fortfahren",
    forgot: "Passwort vergessen",
    sendReset: "Link senden",
    haveAcc: "Schon ein Konto?",
    noAcc: "Kein Konto?",
    rules: "Mind. 8 Zeichen & 1 Großbuchst.",
    agreeKVKK: "Ich akzeptiere KVKK & Cookies.",
    policy: "Richtlinien",
    back: "Zurück",
    verifySent: "Bestätigungs-E-Mail gesendet.",
    resetSent: "Passwort-Reset gesendet.",
    logout: "Abmelden",
  },
};

function useLang(){
  const [lang,setLang]=useState("tr");
  useEffect(()=>{ const s=localStorage.getItem("lang"); if(s&&SUPPORTED.includes(s)) setLang(s); },[]);
  useEffect(()=>{ localStorage.setItem("lang",lang); },[lang]);
  const t = useMemo(()=> LBL[lang] || LBL.tr, [lang]);
  return { lang, setLang, t };
}

function validPassword(pwd){ return /[A-Z]/.test(pwd) && pwd?.length>=8; }

export default function LoginPage(){
  const { lang, setLang, t } = useLang();
  const [role,setRole]=useState("customer"); // seller | customer
  const [mode,setMode]=useState("signin");   // signin | signup | forgot
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [password2,setPassword2]=useState("");
  const [name,setName]=useState("");
  const [username,setUsername]=useState("");
  const [city,setCity]=useState("");
  const [district,setDistrict]=useState("");
  const [accept,setAccept]=useState(false);
  const [loading,setLoading]=useState(false);
  const [msg,setMsg]=useState("");
  const [err,setErr]=useState("");

  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, (u)=>{
      if(u){ localStorage.setItem("authed","1"); }
    });
    return ()=>unsub();
  },[]);

  async function signInEmail(e){
    e.preventDefault();
    try{
      setErr(""); setMsg(""); setLoading(true);
      await signInWithEmailAndPassword(auth,email,password);
      localStorage.setItem("authed","1");
      window.location.href = role==="seller" ? "/portal/seller" : "/portal/customer";
    }catch(e){ setErr(e?.message||String(e)); } finally{ setLoading(false); }
  }
  async function signUpEmail(e){
    e.preventDefault();
    try{
      setErr(""); setMsg("");
      if(!email||!password||!password2||!name||!username){ setErr(t.rules); return; }
      if(password!==password2){ setErr("Şifreler eşleşmiyor"); return; }
      if(!validPassword(password)){ setErr(t.rules); return; }
      if(!accept){ setErr(t.agreeKVKK); return; }
      setLoading(true);
      const { user } = await createUserWithEmailAndPassword(auth,email,password);
      await updateProfile(user,{ displayName:name });
      localStorage.setItem("ue_profile", JSON.stringify({name,username,city,district,role,email}));
      await sendEmailVerification(user,{ url: `${window.location.origin}/login` });
      setMsg(t.verifySent);
      setMode("signin");
    }catch(e){ setErr(e?.message||String(e)); } finally{ setLoading(false); }
  }
  async function doReset(e){
    e.preventDefault();
    try{
      setErr(""); setMsg(""); setLoading(true);
      await sendPasswordResetEmail(auth,email,{ url: `${window.location.origin}/login` });
      setMsg(t.resetSent);
      setMode("signin");
    }catch(e){ setErr(e?.message||String(e)); } finally{ setLoading(false); }
  }
  async function signGoogle(){
    try{
      setErr(""); setMsg(""); setLoading(true);
      const prov = new GoogleAuthProvider();
      await signInWithPopup(auth, prov);
      localStorage.setItem("authed","1");
      window.location.href = role==="seller" ? "/portal/seller" : "/portal/customer";
    }catch(e){ setErr(e?.message||String(e)); } finally{ setLoading(false); }
  }
  async function doLogout(){
    try{ await signOut(auth); localStorage.removeItem("authed"); }catch{}

  }

  return (
    <>
      <Head>
        <title>{t.title} — {t.brand}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="wrap">
        <header className="head">
          <div className="brand">
            <img src="/logo.png" width="36" height="36" alt="logo" />
            <span>{t.brand}</span>
          </div>
          <div className="lang">
            <select value={lang} onChange={(e)=>setLang(e.target.value)}>
              {SUPPORTED.map(k=>(<option key={k} value={k}>{k.toUpperCase()}</option>))}
            </select>
          </div>
        </header>

        <section className="card">
          <h1>{t.welcome}</h1>
          <p className="muted">{t.pick}</p>

          <div className="roles">
            <button className={role==="customer"?"role active":"role"} onClick={()=>setRole("customer")}>{t.customer}</button>
            <button className={role==="seller"?"role active":"role"} onClick={()=>setRole("seller")}>{t.seller}</button>
          </div>

          <div className="tabs">
            <button className={mode==="signin"?"tab active":"tab"} onClick={()=>setMode("signin")}>{t.signin}</button>
            <button className={mode==="signup"?"tab":"tab"} onClick={()=>setMode("signup")}>{t.signup}</button>
            <button className={mode==="forgot"?"tab":"tab"} onClick={()=>setMode("forgot")}>{t.forgot}</button>
          </div>

          {err && <div className="err">{err}</div>}
          {msg && <div className="msg">{msg}</div>}

          {mode==="signin" && (
            <form onSubmit={signInEmail} className="form">
              <input type="email" placeholder={t.email} value={email} onChange={e=>setEmail(e.target.value)} required />
              <input type="password" placeholder={t.password} value={password} onChange={e=>setPassword(e.target.value)} required />
              <button type="submit" disabled={loading} className="primary">{t.signin}</button>
              <button type="button" onClick={signGoogle} disabled={loading} className="ghost">{t.google}</button>
            </form>
          )}

          {mode==="signup" && (
            <form onSubmit={signUpEmail} className="form">
              <input type="text" placeholder={t.name} value={name} onChange={e=>setName(e.target.value)} required />
              <input type="text" placeholder={t.username} value={username} onChange={e=>setUsername(e.target.value)} required />
              <div className="grid2">
                <input type="text" placeholder={t.city} value={city} onChange={e=>setCity(e.target.value)} />
                <input type="text" placeholder={t.district} value={district} onChange={e=>setDistrict(e.target.value)} />
              </div>
              <input type="email" placeholder={t.email} value={email} onChange={e=>setEmail(e.target.value)} required />
              <input type="password" placeholder={t.password} value={password} onChange={e=>setPassword(e.target.value)} required />
              <input type="password" placeholder={t.password2} value={password2} onChange={e=>setPassword2(e.target.value)} required />
              <div className="note">{t.rules}</div>
              <label className="chk">
                <input type="checkbox" checked={accept} onChange={e=>setAccept(e.target.checked)} /> {t.agreeKVKK}
              </label>
              <button type="submit" disabled={loading} className="primary">{t.signup}</button>
              <button type="button" onClick={signGoogle} disabled={loading} className="ghost">{t.google}</button>
            </form>
          )}

          {mode==="forgot" && (
            <form onSubmit={doReset} className="form">
              <input type="email" placeholder={t.email} value={email} onChange={e=>setEmail(e.target.value)} required />
              <button type="submit" disabled={loading} className="primary">{t.sendReset}</button>
              <button type="button" className="ghost" onClick={()=>setMode("signin")}>{t.back}</button>
            </form>
          )}
        </section>
      </main>

      <style>{`
        :root{ --ink:#0f172a; --muted:#475569; --line:rgba(0,0,0,.1); }
        *{box-sizing:border-box}
        body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial,sans-serif;background:#f8fafc;color:var(--ink)}
        .wrap{min-height:100vh;display:grid;place-items:center;padding:16px}
        .head{position:fixed;top:0;left:0;right:0;display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:rgba(255,255,255,.9);backdrop-filter:blur(8px);border-bottom:1px solid var(--line)}
        .brand{display:flex;align-items:center;gap:8px;font-weight:900}
        .lang select{border:1px solid var(--line);padding:6px 8px;border-radius:10px;background:#fff}
        .card{width:min(720px,100%);margin-top:70px;background:#fff;border:1px solid #e5e7eb;border-radius:16px;box-shadow:0 10px 28px rgba(0,0,0,.08);padding:14px}
        .muted{color:var(--muted);margin:6px 0 10px}
        .roles{display:flex;gap:8px;margin:10px 0}
        .role{flex:1;padding:10px;border:1px solid var(--line);border-radius:12px;background:#fff;font-weight:800;cursor:pointer}
        .role.active{background:#111827;color:#fff;border-color:#111827}
        .tabs{display:flex;gap:8px;margin:6px 0 12px}
        .tab{flex:1;padding:8px;border:1px solid var(--line);background:#fff;border-radius:10px;font-weight:700;cursor:pointer}
        .tab.active{background:#111827;color:#fff;border-color:#111827}
        .form{display:grid;gap:8px}
        .grid2{display:grid;gap:8px;grid-template-columns:repeat(2,1fr)}
        input[type="text"],input[type="email"],input[type="password"]{border:1px solid #e5e7eb;border-radius:10px;padding:10px;font-size:14px}
        .primary{border:1px solid #111827;background:#111827;color:#fff;border-radius:10px;padding:10px 12px;font-weight:800;cursor:pointer}
        .ghost{border:1px solid var(--line);background:#fff;border-radius:10px;padding:10px 12px;font-weight:700;cursor:pointer}
        .chk{font-size:14px;color:var(--muted)}
        .note{font-size:12px;color:var(--muted);margin:4px 0}
        .err{background:#fee2e2;color:#991b1b;border:1px solid #fecaca;padding:8px;border-radius:10px;margin-bottom:8px}
        .msg{background:#dcfce7;color:#065f46;border:1px solid #bbf7d0;padding:8px;border-radius:10px;margin-bottom:8px}
      `}</style>
    </>
  );
}
