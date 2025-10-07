// pages/portal/customer/index.jsx
"use client";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import Head from "next/head";
import { createClient } from "@supabase/supabase-js";

/* ---------------- SUPABASE (opsiyonel: çıkışta kullanır) ---------------- */
let sb = null;
function getSupabase() {
  if (sb) return sb;
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    (typeof window !== "undefined" ? window.__SUPABASE_URL__ : "");
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    (typeof window !== "undefined" ? window.__SUPABASE_ANON__ : "");
  if (!url || !key) return null;
  sb = createClient(url, key);
  return sb;
}

/* ---------------- DİL/ÇEVİRİ ---------------- */
const SUP = ["tr", "en", "ar", "de"]; // RTL: ar
const T = {
  tr: {
    brand: "Üreten Eller",
    customerPortal: "Müşteri Portalı",
    needLogin: "Bu alana erişmek için giriş yapmalısınız.",
    goHome: "Ana sayfa",
    loginReg: "Giriş / Kayıt",
    heroLead: "Bölendeki el emeği ürünleri keşfet, güvenle sipariş ver, süreci kolayca takip et.",
    cta: { find: "İlan Ara", dashboard: "Ana Sayfa" },
    showcase: "Vitrin",
    standard: "Standart İlanlar",
    categories: "Kategoriler",
    proBadge: "PRO",
    empty: "Henüz ilan yok.",
    bottom: { home: "Ana Sayfa", msgs: "Mesajlar", notifs: "Bildirimler" },
    profile: "Profil",
    logout: "Çıkış",
    legalBar: "Kurumsal",
    legal: {
      corporate: "Kurumsal",
      about: "Hakkımızda",
      contact: "İletişim",
      privacy: "Gizlilik",
      kvkk: "KVKK Aydınlatma",
      terms: "Kullanım Şartları",
      distance: "Mesafeli Satış",
      shippingReturn: "Teslimat & İade",
      cookies: "Çerez Politikası",
      rules: "Topluluk Kuralları",
      banned: "Yasaklı Ürünler",
      all: "Tüm Legal",
    },
  },
  en: {
    brand: "Ureten Eller",
    customerPortal: "Customer Portal",
    needLogin: "You must sign in to access this area.",
    goHome: "Home",
    loginReg: "Sign in / Sign up",
    heroLead: "Discover handmade products nearby, order securely, and track easily.",
    cta: { find: "Find Listing", dashboard: "Home" },
    showcase: "Showcase",
    standard: "Standard Listings",
    categories: "Categories",
    proBadge: "PRO",
    empty: "No listings yet.",
    bottom: { home: "Home", msgs: "Messages", notifs: "Notifications" },
    profile: "Profile",
    logout: "Logout",
    legalBar: "Corporate",
    legal: {
      corporate: "Corporate",
      about: "About",
      contact: "Contact",
      privacy: "Privacy",
      kvkk: "KVKK Notice",
      terms: "Terms of Use",
      distance: "Distance Sales",
      shippingReturn: "Shipping & Returns",
      cookies: "Cookie Policy",
      rules: "Community Rules",
      banned: "Prohibited Products",
      all: "All Legal",
    },
  },
  ar: {
    brand: "أُنتِج بالأيادي",
    customerPortal: "بوابة العملاء",
    needLogin: "يجب تسجيل الدخول للوصول إلى هذه الصفحة.",
    goHome: "الرئيسية",
    loginReg: "تسجيل / إنشاء حساب",
    heroLead: "اكتشف المنتجات اليدوية القريبة، واطلب بأمان، وتابع بسهولة.",
    cta: { find: "ابحث عن إعلان", dashboard: "الرئيسية" },
    showcase: "الواجهة (Vitrin)",
    standard: "إعلانات عادية",
    categories: "التصنيفات",
    proBadge: "محترف",
    empty: "لا توجد إعلانات بعد.",
    bottom: { home: "الصفحة الرئيسية", msgs: "رسائل", notifs: "إشعارات" },
    profile: "الملف الشخصي",
    logout: "تسجيل الخروج",
    legalBar: "المعلومات المؤسسية",
    legal: {
      corporate: "المؤسسة",
      about: "من نحن",
      contact: "اتصال",
      privacy: "الخصوصية",
      kvkk: "إشعار KVKK",
      terms: "شروط الاستخدام",
      distance: "البيع عن بُعد",
      shippingReturn: "التسليم والإرجاع",
      cookies: "سياسة الكوكيز",
      rules: "قواعد المجتمع",
      banned: "منتجات محظورة",
      all: "كل السياسات",
    },
  },
  de: {
    brand: "Ureten Eller",
    customerPortal: "Kundenportal",
    needLogin: "Bitte zuerst anmelden.",
    goHome: "Startseite",
    loginReg: "Anmelden / Registrieren",
    heroLead: "Entdecke Handgemachtes in deiner Nähe, bestelle sicher und verfolge unkompliziert.",
    cta: { find: "Inserat suchen", dashboard: "Start" },
    showcase: "Vitrin",
    standard: "Standard-Inserate",
    categories: "Kategorien",
    proBadge: "PRO",
    empty: "Noch keine Inserate.",
    bottom: { home: "Start", msgs: "Nachrichten", notifs: "Mitteilungen" },
    profile: "Profil",
    logout: "Abmelden",
    legalBar: "Unternehmen",
    legal: {
      corporate: "Unternehmen",
      about: "Über uns",
      contact: "Kontakt",
      privacy: "Datenschutz",
      kvkk: "KVKK-Hinweis",
      terms: "Nutzungsbedingungen",
      distance: "Fernabsatz",
      shippingReturn: "Lieferung & Rückgabe",
      cookies: "Cookie-Richtlinie",
      rules: "Community-Regeln",
      banned: "Verbotene Produkte",
      all: "Alle Rechtliches",
    },
  },
};

function useLang() {
  const [lang, setLang] = useState("tr");
  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved && SUP.includes(saved)) setLang(saved);
  }, []);
  useEffect(() => {
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);
  const t = useMemo(() => T[lang] || T.tr, [lang]);
  return { lang, setLang, t };
}

/* ---------------- KATEGORİLER (kısa) ---------------- */
const CATS = {
  tr: [
    { icon: "🍲", title: "Yemekler", subs: ["Ev yemekleri", "Börek-çörek", "Çorba", "Diyet/vegan/gf"] },
    { icon: "🎂", title: "Pasta & Tatlı", subs: ["Yaş pasta", "Kurabiye", "Sütlü", "Doğum günü"] },
    { icon: "💍", title: "Takı", subs: ["Bileklik", "Kolye", "Küpe", "İsimli"] },
    { icon: "🧶", title: "Örgü", subs: ["Hırka", "Atkı", "Bebek", "Kırlent"] },
  ],
  en: [
    { icon: "🍲", title: "Meals", subs: ["Home", "Savory", "Soup", "Diet/vegan/gf"] },
    { icon: "🎂", title: "Cakes & Sweets", subs: ["Layer", "Cookies", "Milk", "Birthday"] },
    { icon: "💍", title: "Jewelry", subs: ["Bracelet", "Necklace", "Earrings", "Personalized"] },
    { icon: "🧶", title: "Knitwear", subs: ["Cardigan", "Scarf", "Baby", "Pillow"] },
  ],
  ar: [
    { icon: "🍲", title: "وجبات", subs: ["بيتي", "مالحة", "شوربة", "حمية/نباتي"] },
    { icon: "🎂", title: "حلويات", subs: ["طبقات", "بسكويت", "حليب", "عيد ميلاد"] },
    { icon: "💍", title: "إكسسوارات", subs: ["سوار", "قلادة", "أقراط", "بالاسم"] },
    { icon: "🧶", title: "تريكو", subs: ["جاكيت", "وشاح", "أطفال", "وسادة"] },
  ],
  de: [
    { icon: "🍲", title: "Speisen", subs: ["Hausmann", "Herzhaft", "Suppe", "Diät/vegan"] },
    { icon: "🎂", title: "Torten & Süßes", subs: ["Sahne", "Kekse", "Milch", "Geburtstag"] },
    { icon: "💍", title: "Schmuck", subs: ["Armband", "Kette", "Ohrringe", "Name"] },
    { icon: "🧶", title: "Strick", subs: ["Cardigan", "Schal", "Baby", "Kissen"] },
  ],
};

/* ---------------- ANA BİLEŞEN ---------------- */
export default function CustomerPortal() {
  const { lang, setLang, t } = useLang();

  const [authed, setAuthed] = useState(true); // login sonrası varsayılan true
  useEffect(() => {
    const a = localStorage.getItem("authed") === "1";
    setAuthed(a);
  }, []);

  // Vitrin (pro) + standart ilanlar — /public/ads.json içinden okur
  const [proAds, setProAds] = useState([]);
  const [stdAds, setStdAds] = useState([]);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/ads.json", { cache: "no-store" });
        if (res.ok) {
          const all = await res.json();
          if (!Array.isArray(all)) throw new Error("bad ads.json");
          const pros = all.filter((x) => x?.isPro);
          const std = all.filter((x) => !x?.isPro);
          if (alive) {
            setProAds(pros.slice(0, 50));
            setStdAds(std.slice(0, 20));
          }
          return;
        }
      } catch {}
      if (alive) {
        setProAds([]);
        setStdAds([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const cats = CATS[lang] || CATS.tr;

  const go = useCallback((href) => (window.location.href = href), []);
  const onLogout = async () => {
    try {
      const supa = getSupabase();
      if (supa) await supa.auth.signOut();
    } catch {}
    localStorage.removeItem("authed");
    localStorage.setItem("support_chat", "1"); // anasayfada canlı destek baloncuğu
    go("/"); // pages/index.jsx
  };

  // Alt bar aktif sekme
  const tab = "home";

  return (
    <>
      <Head>
        <title>{t.brand} • {t.customerPortal}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Faviconlar */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=5" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=5" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=5" />
        <link rel="icon" href="/favicon.png?v=5" />
        <meta name="theme-color" content="#0b0b0b" />
      </Head>

      {/* Üst Bar */}
      <header className="topbar">
        <div className="brand" onClick={() => go("/")}>👐 {t.brand}</div>
        <div className="spacer" />
        <div className="actions">
          <button className="ghost" onClick={() => go("/profile")}>{t.profile}</button>
          <button className="danger" onClick={onLogout}>{t.logout}</button>
          <select aria-label="Language" value={lang} onChange={(e) => setLang(e.target.value)}>
            {SUP.map((k) => (<option key={k} value={k}>{k.toUpperCase()}</option>))}
          </select>
        </div>
      </header>

      {/* HERO / Renkli şerit */}
      <section className="hero">
        <div className="left">
          <h1>{t.customerPortal}</h1>
          <p className="lead">{t.heroLead}</p>
          <div className="cta">
            <button className="primary" onClick={() => go("/search")}>
              {t.cta.find}
            </button>
            <button className="ghost" onClick={() => go("/portal/customer")}>
              {t.cta.dashboard}
            </button>
          </div>
        </div>
        <div className="right" aria-hidden>
          <div className="blob b1" />
          <div className="blob b2" />
          <div className="blob b3" />
        </div>
      </section>

      {/* İçerik */}
      <main className="wrap">
        {!authed ? (
          <div className="card">
            <div className="hd">{t.customerPortal}</div>
            <div className="bd">
              <p className="note">{t.needLogin} (<code>authed=1</code>)</p>
              <div className="actionsRow">
                <button className="primary" onClick={() => go("/login?role=customer")}>{t.loginReg}</button>
                <button className="ghost" onClick={() => go("/")}>{t.goHome}</button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Vitrin (PRO) */}
            <section className="section">
              <div className="sectionHead">
                <h2>✨ {t.showcase}</h2>
              </div>
              <div className="grid ads">
                {proAds.length === 0 ? (
                  <div className="empty">{t.empty}</div>
                ) : (
                  proAds.map((a, i) => (
                    <article key={i} className="ad">
                      <div className="thumb" style={{ backgroundImage: a?.img ? `url(${a.img})` : undefined }}>
                        <span className="badge">{t.proBadge}</span>
                      </div>
                      <div className="body">
                        <div className="title">{a?.title || "İlan"}</div>
                        <div className="meta">
                          <span>{a?.cat || a?.category || ""}</span>
                          <b>{a?.price || ""}</b>
                        </div>
                      </div>
                      <button className="view" onClick={() => go(a?.url || `/ads/${a?.slug || a?.id || ""}`)}>İncele</button>
                    </article>
                  ))
                )}
              </div>
            </section>

            {/* Standart ilanlar */}
            <section className="section">
              <div className="sectionHead">
                <h2>🧺 {t.standard}</h2>
              </div>
              <div className="grid ads">
                {stdAds.length === 0 ? (
                  <div className="empty">{t.empty}</div>
                ) : (
                  stdAds.map((a, i) => (
                    <article key={i} className="ad">
                      <div className="thumb" style={{ backgroundImage: a?.img ? `url(${a.img})` : undefined }} />
                      <div className="body">
                        <div className="title">{a?.title || "İlan"}</div>
                        <div className="meta">
                          <span>{a?.cat || a?.category || ""}</span>
                          <b>{a?.price || ""}</b>
                        </div>
                      </div>
                      <button className="view" onClick={() => go(a?.url || `/ads/${a?.slug || a?.id || ""}`)}>İncele</button>
                    </article>
                  ))
                )}
              </div>
            </section>

            {/* Kategoriler */}
            <section className="section">
              <div className="sectionHead">
                <h2>🗂️ {t.categories}</h2>
              </div>
              <div className="grid cats">
                {(cats || []).map((c, i) => (
                  <article key={i} className="catCard">
                    <div className="head"><span className="icn">{c.icon}</span><h3>{c.title}</h3></div>
                    <div className="subs">
                      {(c.subs || []).map((s, k) => <span key={k} className="chip">{s}</span>)}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      {/* Alt gezinme çubuğu */}
      <nav className="bottombar" aria-label="Bottom Navigation">
        <button className={tab === "home" ? "tabB active" : "tabB"} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <span>🏠</span><b>{t.bottom.home}</b>
        </button>
        <button className="tabB" onClick={() => go("/messages")}>
          <span>💬</span><b>{t.bottom.msgs}</b>
        </button>
        <button className="tabB" onClick={() => go("/notifications")}>
          <span>🔔</span><b>{t.bottom.notifs}</b>
        </button>
      </nav>

      {/* Siyah LEGAL alan — tam genişlik */}
      <footer className="legal" role="contentinfo">
        <div className="inner">
          <div className="ttl">{t.legalBar}</div>
          <nav className="links" aria-label={t.legalBar}>
            <a href="/legal/kurumsal">{t.legal.corporate}</a>
            <a href="/legal/hakkimizda">{t.legal.about}</a>
            <a href="/legal/iletisim">{t.legal.contact}</a>
            <a href="/legal/gizlilik">{t.legal.privacy}</a>
            <a href="/legal/kvkk-aydinlatma">{t.legal.kvkk}</a>
            <a href="/legal/kullanim-sartlari">{t.legal.terms}</a>
            <a href="/legal/mesafeli-satis-sozlesmesi">{t.legal.distance}</a>
            <a href="/legal/teslimat-iade">{t.legal.shippingReturn}</a>
            <a href="/legal/cerez-politikasi">{t.legal.cookies}</a>
            <a href="/legal/topluluk-kurallari">{t.legal.rules}</a>
            <a href="/legal/yasakli-urunler">{t.legal.banned}</a>
            <a href="/legal" className="homeLink">{t.legal.all}</a>
          </nav>
          <div className="copy">© {new Date().getFullYear()} {t.brand}</div>
        </div>
      </footer>

      {/* STYLES */}
      <style>{`
        :root{ --ink:#0f172a; --muted:#475569; --line:rgba(0,0,0,.08); }
        html,body{height:100%}
        body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial,sans-serif;color:var(--ink);
          background:
            radial-gradient(1200px 600px at 10% -10%, #ffe4e6, transparent),
            radial-gradient(900px 500px at 90% -10%, #e0e7ff, transparent),
            linear-gradient(120deg,#ff80ab,#a78bfa,#60a5fa,#34d399);
          background-attachment:fixed;}

        .topbar{position:sticky;top:0;z-index:60;display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:center;
          padding:10px 14px;background:rgba(255,255,255,.92);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
        .brand{font-weight:900;cursor:pointer}
        .spacer{min-width:12px}
        .actions{display:flex;gap:8px;align-items:center}
        .actions select{border:1px solid var(--line);border-radius:10px;padding:6px 8px;background:#fff}
        .ghost{border:1px solid var(--line);background:#fff;border-radius:10px;padding:8px 12px;font-weight:700;cursor:pointer}
        .danger{border:1px solid #111827;background:#111827;color:#fff;border-radius:10px;padding:8px 12px;font-weight:800;cursor:pointer}

        .hero{display:grid;grid-template-columns:1.1fr .9fr;gap:18px;max-width:1100px;margin:14px auto 0;padding:0 16px}
        .left h1{margin:6px 0 4px;font-size:32px}
        .lead{margin:0 0 8px;color:#1f2937}
        .cta{display:flex;gap:10px;flex-wrap:wrap}
        .primary{padding:12px 16px;border-radius:12px;border:1px solid #111827;background:#111827;color:#fff;font-weight:800;cursor:pointer}
        .right{position:relative;min-height:160px}
        .blob{position:absolute;filter:blur(30px);opacity:.6;border-radius:50%}
        .b1{width:180px;height:180px;background:#f472b6;top:10px;left:10px}
        .b2{width:220px;height:220px;background:#93c5fd;top:40px;right:20px}
        .b3{width:160px;height:160px;background:#86efac;bottom:-30px;left:120px}

        .wrap{max-width:1100px;margin:0 auto;padding:14px 16px}
        .section{max-width:1100px;margin:12px auto;padding:0 0}
        .sectionHead{display:flex;align-items:center;justify-content:space-between;margin:8px 0;padding:0 0}
        .grid.ads{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}
        .ad{border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;background:#fff;display:flex;flex-direction:column;box-shadow:0 8px 22px rgba(0,0,0,.06)}
        .thumb{aspect-ratio:4/3;background:#f1f5f9;background-size:cover;background-position:center;position:relative}
        .badge{position:absolute;top:8px;left:8px;background:#111827;color:#fff;font-size:12px;padding:4px 8px;border-radius:999px}
        .body{padding:10px}
        .title{font-weight:800;margin:0 0 6px}
        .meta{display:flex;justify-content:space-between;color:#475569;font-size:13px}
        .view{margin:0 10px 12px;border:1px solid #111827;background:#111827;color:#fff;border-radius:10px;padding:8px 10px;font-weight:700;cursor:pointer}
        .empty{padding:18px;border:1px dashed #e5e7eb;border-radius:14px;text-align:center;color:#475569}

        .grid.cats{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}
        .catCard{border:1px solid #e5e7eb;border-radius:16px;background:rgba(255,255,255,.92);box-shadow:0 8px 22px rgba(0,0,0,.06);padding:12px}
        .catCard .head{display:flex;gap:8px;align-items:center}
        .icn{font-size:22px}
        .catCard h3{margin:0;font-size:18px}
        .subs{display:grid;gap:8px;grid-template-columns:repeat(2,minmax(0,1fr));margin-top:8px}
        .chip{display:block;text-align:center;padding:8px;border-radius:12px;border:1px solid #e5e7eb;background:#fff;font-size:12px}

        .card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;box-shadow:0 8px 22px rgba(0,0,0,.06)}
        .card .hd{padding:10px 12px;border-bottom:1px solid #e5e7eb;font-weight:900}
        .card .bd{padding:12px}
        .actionsRow{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}
        .note{margin:8px 0 0;color:#475569;font-size:14px}

        .bottombar{position:sticky;bottom:0;z-index:50;display:grid;grid-template-columns:repeat(3,1fr);gap:6px;padding:6px;background:rgba(255,255,255,.94);backdrop-filter:blur(8px);border-top:1px solid var(--line)}
        .tabB{display:flex;flex-direction:column;align-items:center;gap:2px;padding:8px;border-radius:10px;border:1px solid transparent;background:transparent;cursor:pointer;font-weight:700}
        .tabB.active{border-color:#111827;background:#111827;color:#fff}

        .legal{background:#0b0b0b;color:#f8fafc;border-top:1px solid rgba(255,255,255,.12);width:100vw;
          margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);margin-top:14px}
        .inner{max-width:1100px;margin:0 auto;padding:12px 16px}
        .ttl{font-weight:800;margin-bottom:6px}
        .links{display:flex;flex-wrap:wrap;gap:10px}
        .links a{color:#e2e8f0;font-size:13px;padding:6px 8px;border-radius:8px;text-decoration:none}
        .links a:hover{background:rgba(255,255,255,.08);color:#fff}
        .homeLink{margin-left:auto;font-weight:800}
        .copy{margin-top:6px;font-size:12px;color:#cbd5e1}

        @media (max-width:820px){
          .hero{grid-template-columns:1fr}
          .right{min-height:120px}
        }
      `}</style>
    </>
  );
}
