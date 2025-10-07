// pages/portal/seller/index.jsx
"use client";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import Head from "next/head";
import { createClient } from "@supabase/supabase-js";

/* ---------------- SUPABASE (varsa çıkışta kullanır) ---------------- */
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
const SUP = ["tr", "en", "ar", "de"];
const T = {
  tr: {
    brand: "Üreten Eller",
    sellerPortal: "Üreten El Portalı",
    needLogin: "Bu alana erişmek için giriş yapmalısınız.",
    goHome: "Ana sayfa",
    loginReg: "Giriş / Kayıt",
    tabs: { new: "Yeni İlan", my: "İlanlarım", orders: "Siparişler", payouts: "Ödemeler", profile: "Profil" },
    form: {
      title: "Başlık *",
      cat: "Kategori *",
      price: "Fiyat",
      img: "Görsel (URL)",
      desc: "Açıklama",
      save: "Kaydet",
      clear: "Temizle",
      note: "Not: Şimdilik ilanlar tarayıcı hafızasına kaydedilir. Anasayfadaki “İlanlar” bölümünde görünür.",
      required: "Başlık ve kategori zorunludur.",
      saved: "İlan taslak olarak kaydedildi.",
      saveErr: "Kaydetme sırasında hata (localStorage).",
    },
    tips: {
      title: "İpucu",
      li1: "Görsel için Cloudinary linki kullanabilirsiniz.",
      li2: "Gerçek ödeme & mesajlaşma sonradan eklenecek.",
      li3: "“İlanlarım” sekmesinden silebilirsiniz.",
    },
    my: { empty: "Henüz ilan yok. “Yeni İlan” sekmesinden ekleyin.", view: "Görüntüle", del: "Sil" },
    orders: "Bu sayfa ileride gerçek siparişleri gösterecek.",
    payouts: "Banka bilgileri ve ödemeler burada listelenecek.",
    profile: { text: "Çıkış yaparsanız tamamen oturum kapanır ve ana sayfaya dönersiniz.", logout: "Çıkış Yap" },
    bottom: { home: "Ana Sayfa", msgs: "Mesajlar", notifs: "Bildirimler" },
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
    sellerPortal: "Maker Portal",
    needLogin: "You must sign in to access this area.",
    goHome: "Home",
    loginReg: "Sign in / Sign up",
    tabs: { new: "Post Listing", my: "My Listings", orders: "Orders", payouts: "Payouts", profile: "Profile" },
    form: {
      title: "Title *",
      cat: "Category *",
      price: "Price",
      img: "Image (URL)",
      desc: "Description",
      save: "Save",
      clear: "Clear",
      note: "Note: For now, listings are stored in browser storage and appear on the homepage list.",
      required: "Title and category are required.",
      saved: "Listing saved as draft.",
      saveErr: "Error while saving (localStorage).",
    },
    tips: {
      title: "Tip",
      li1: "You can use a Cloudinary image link.",
      li2: "Real payments & messaging will arrive later.",
      li3: "You can delete in the “My Listings” tab.",
    },
    my: { empty: "No listings yet. Add one in “Post Listing”.", view: "View", del: "Delete" },
    orders: "This page will show real orders later.",
    payouts: "Bank details and payouts will be listed here.",
    profile: { text: "Logging out fully ends your session and returns to home.", logout: "Logout" },
    bottom: { home: "Home", msgs: "Messages", notifs: "Notifications" },
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
    sellerPortal: "بوابة المُنتِجات",
    needLogin: "يجب تسجيل الدخول للوصول إلى هذه الصفحة.",
    goHome: "الرئيسية",
    loginReg: "تسجيل / إنشاء حساب",
    tabs: { new: "إنشاء إعلان", my: "إعلاناتي", orders: "الطلبات", payouts: "المدفوعات", profile: "الملف الشخصي" },
    form: {
      title: "العنوان *",
      cat: "التصنيف *",
      price: "السعر",
      img: "الصورة (رابط)",
      desc: "الوصف",
      save: "حفظ",
      clear: "مسح",
      note: "ملاحظة: حاليًا يتم حفظ الإعلانات في المتصفح وتظهر في الصفحة الرئيسية.",
      required: "العنوان والتصنيف مطلوبان.",
      saved: "تم حفظ الإعلان كمسودة.",
      saveErr: "خطأ أثناء الحفظ (localStorage).",
    },
    tips: { title: "نصيحة", li1: "يمكنك استخدام رابط صورة Cloudinary.", li2: "الدفع والمراسلة لاحقًا.", li3: "يمكنك الحذف من “إعلاناتي”." },
    my: { empty: "لا توجد إعلانات بعد.", view: "عرض", del: "حذف" },
    orders: "ستظهر الطلبات هنا لاحقًا.",
    payouts: "ستُعرض المدفوعات هنا.",
    profile: { text: "تسجيل الخروج سيُنهي الجلسة ويعيدك للرئيسية.", logout: "تسجيل الخروج" },
    bottom: { home: "الصفحة الرئيسية", msgs: "رسائل", notifs: "إشعارات" },
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
    sellerPortal: "Anbieterinnen-Portal",
    needLogin: "Bitte zuerst anmelden.",
    goHome: "Startseite",
    loginReg: "Anmelden / Registrieren",
    tabs: { new: "Inserat einstellen", my: "Meine Inserate", orders: "Bestellungen", payouts: "Auszahlungen", profile: "Profil" },
    form: {
      title: "Titel *",
      cat: "Kategorie *",
      price: "Preis",
      img: "Bild (URL)",
      desc: "Beschreibung",
      save: "Speichern",
      clear: "Leeren",
      note: "Hinweis: Inserate werden vorerst im Browser gespeichert und erscheinen auf der Startseite.",
      required: "Titel und Kategorie sind Pflicht.",
      saved: "Inserat als Entwurf gespeichert.",
      saveErr: "Fehler beim Speichern (localStorage).",
    },
    tips: {
      title: "Tipp",
      li1: "Cloudinary-Bildlink verwenden.",
      li2: "Zahlung & Messaging folgen später.",
      li3: "Löschen in „Meine Inserate“ möglich.",
    },
    my: { empty: "Noch keine Inserate.", view: "Ansehen", del: "Löschen" },
    orders: "Diese Seite zeigt später echte Bestellungen.",
    payouts: "Bankdaten & Auszahlungen erscheinen hier.",
    profile: { text: "Abmelden beendet die Sitzung und führt zur Startseite.", logout: "Abmelden" },
    bottom: { home: "Start", msgs: "Nachrichten", notifs: "Mitteilungen" },
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

/* ---------------- Yardımcılar ---------------- */
const uid = () => Math.random().toString(36).slice(2, 9);
const slugify = (s = "") =>
  s.toString().toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

/* ---------------- Ana Bileşen ---------------- */
export default function SellerPortal() {
  const { lang, setLang, t } = useLang();

  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState("new"); // new | my | orders | payouts | profile
  const [ads, setAds] = useState([]);
  const [msg, setMsg] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [cat, setCat] = useState("");
  const [price, setPrice] = useState("");
  const [img, setImg] = useState("");
  const [desc, setDesc] = useState("");

  // Giriş kontrolü + ilanları yükle
  useEffect(() => {
    if (typeof window === "undefined") return;
    setAuthed(localStorage.getItem("authed") === "1");
    try {
      const local = JSON.parse(localStorage.getItem("ads") || "[]");
      setAds(Array.isArray(local) ? local : []);
    } catch {
      setAds([]);
    }
  }, []);

  const go = useCallback((href) => (window.location.href = href), []);

  // Çıkış
  const onLogout = async () => {
    try {
      const supa = getSupabase();
      if (supa) await supa.auth.signOut();
    } catch {}
    localStorage.removeItem("authed");
    localStorage.setItem("support_chat", "1"); // anasayfada canlı destek baloncuğu
    go("/");
  };

  // Kaydet
  function saveAd(e) {
    e.preventDefault();
    setMsg("");
    if (!title || !cat) {
      setMsg(t.form.required);
      return;
    }
    const ad = {
      id: uid(),
      slug: slugify(title),
      title,
      cat,
      price,
      img,
      desc,
      created_at: new Date().toISOString(),
      status: "active",
    };
    const next = [ad, ...ads];
    setAds(next);
    try {
      localStorage.setItem("ads", JSON.stringify(next));
      setMsg(t.form.saved);
    } catch {
      setMsg(t.form.saveErr);
    }
    setTitle("");
    setCat("");
    setPrice("");
    setImg("");
    setDesc("");
    setTab("my");
  }

  function removeAd(id) {
    const next = ads.filter((a) => a.id !== id);
    setAds(next);
    try {
      localStorage.setItem("ads", JSON.stringify(next));
    } catch {}
  }

  /* ---------------- UI ---------------- */
  return (
    <>
      <Head>
        <title>{t.brand} • {t.sellerPortal}</title>
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
        <nav className="tabs" aria-label="Tabs">
          {["new","my","orders","payouts","profile"].map((k) => (
            <button key={k} className={`tab ${tab === k ? "active" : ""}`} onClick={() => setTab(k)}>
              {t.tabs[k]}
            </button>
          ))}
        </nav>
        <div className="actions">
          <select aria-label="Language" value={lang} onChange={(e) => setLang(e.target.value)}>
            {SUP.map((k) => (<option key={k} value={k}>{k.toUpperCase()}</option>))}
          </select>
          <button className="ghost" onClick={() => go("/")}>{t.goHome}</button>
          <button className="danger" onClick={onLogout}>{t.profile.logout}</button>
        </div>
      </header>

      {/* Renkli Hero Şerit */}
      <section className="hero">
        <div className="heroText">
          <h1>{t.sellerPortal}</h1>
          <p className="lead">
            {lang === "tr" && "El emeği ürünlerini güvenle vitrine çıkar, siparişlerini tek panelden yönet."}
            {lang === "en" && "Showcase your handmade products and manage orders from one place."}
            {lang === "ar" && "اعرض منتجاتك اليدوية بثقة وادِر الطلبات من مكان واحد."}
            {lang === "de" && "Präsentiere Handgemachtes und verwalte Bestellungen zentral."}
          </p>
        </div>
        <div className="heroArt" aria-hidden>
          <div className="blob b1" />
          <div className="blob b2" />
          <div className="blob b3" />
        </div>
      </section>

      {/* İçerik */}
      <main className="wrap">
        {!authed ? (
          <div className="card">
            <div className="hd">{t.sellerPortal}</div>
            <div className="bd">
              <p className="note">{t.needLogin} (<code>authed=1</code>)</p>
              <div className="actionsRow">
                <button className="primary" onClick={() => go("/login?role=seller")}>{t.loginReg}</button>
                <button className="ghost" onClick={() => go("/")}>{t.goHome}</button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {tab === "new" && (
              <div className="grid">
                <div className="card">
                  <div className="hd">{t.tabs.new}</div>
                  <div className="bd">
                    {msg && (
                      <div className={/zorunlu|required|hata|error/i.test(msg) ? "alert danger" : "alert ok"}>
                        {msg}
                      </div>
                    )}
                    <form onSubmit={saveAd}>
                      <label><span>{t.form.title}</span>
                        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Örn: Ev Yapımı Mantı 1 kg" required />
                      </label>
                      <div className="row" style={{ marginTop: 10 }}>
                        <label><span>{t.form.cat}</span>
                          <input value={cat} onChange={(e) => setCat(e.target.value)} placeholder="Örn: Yemekler" required />
                        </label>
                        <label><span>{t.form.price}</span>
                          <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Örn: 250 TL" />
                        </label>
                      </div>
                      <label style={{ marginTop: 10 }}><span>{t.form.img}</span>
                        <input value={img} onChange={(e) => setImg(e.target.value)} placeholder="https://res.cloudinary.com/.../image/upload/..." />
                      </label>
                      <label style={{ marginTop: 10 }}><span>{t.form.desc}</span>
                        <textarea rows={4} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Ürününüzü anlatın (içerik, teslimat, vb.)" />
                      </label>
                      <div className="actionsRow">
                        <button className="primary" type="submit">{t.form.save}</button>
                        <button
                          className="ghost"
                          type="button"
                          onClick={() => { setTitle(""); setCat(""); setPrice(""); setImg(""); setDesc(""); setMsg(""); }}
                        >
                          {t.form.clear}
                        </button>
                      </div>
                      <p className="note">{t.form.note}</p>
                    </form>
                  </div>
                </div>

                <div className="card">
                  <div className="hd">{t.tips.title}</div>
                  <div className="bd">
                    <ul className="ul">
                      <li>{t.tips.li1}</li>
                      <li>{t.tips.li2}</li>
                      <li>{t.tips.li3}</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {tab === "my" && (
              <div className="card">
                <div className="hd">{t.tabs.my} ({ads.length})</div>
                <div className="bd">
                  {!ads.length ? (
                    <p className="note">{t.my.empty}</p>
                  ) : (
                    <div className="list">
                      {ads.map((a) => (
                        <article className="ad" key={a.id}>
                          <div className="thumb" style={a.img ? { backgroundImage: `url(${a.img})` } : undefined} />
                          <div className="adBody">
                            <div className="ttl">{a.title}</div>
                            <div className="meta">{a.cat} • <b>{a.price || "-"}</b></div>
                          </div>
                          <div className="adActions">
                            <button className="ghost" onClick={() => go(`/ads/${a.slug || a.id}`)}>{t.my.view}</button>
                            <button className="dangerSoft" onClick={() => removeAd(a.id)}>{t.my.del}</button>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {tab === "orders" && (
              <div className="card">
                <div className="hd">{t.tabs.orders}</div>
                <div className="bd"><p className="note">{t.orders}</p></div>
              </div>
            )}

            {tab === "payouts" && (
              <div className="card">
                <div className="hd">{t.tabs.payouts}</div>
                <div className="bd"><p className="note">{t.payouts}</p></div>
              </div>
            )}

            {tab === "profile" && (
              <div className="card">
                <div className="hd">{t.tabs.profile}</div>
                <div className="bd">
                  <p className="note">{t.profile.text}</p>
                  <div className="actionsRow">
                    <button className="danger" onClick={onLogout}>{t.profile.logout}</button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Alt gezinme çubuğu */}
      <nav className="bottombar" aria-label="Bottom Navigation">
        <button className="tabB active" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
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
        .tabs{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}
        .tab{padding:8px 12px;border:1px solid var(--line);background:#fff;border-radius:999px;cursor:pointer;font-weight:800}
        .tab.active{background:#111827;color:#fff;border-color:#111827}
        .actions{display:flex;gap:8px;align-items:center}
        .actions select{border:1px solid var(--line);border-radius:10px;padding:6px 8px;background:#fff}
        .ghost{border:1px solid var(--line);background:#fff;border-radius:10px;padding:8px 12px;font-weight:700;cursor:pointer}
        .danger{border:1px solid #111827;background:#111827;color:#fff;border-radius:10px;padding:8px 12px;font-weight:800;cursor:pointer}
        .dangerSoft{border:1px solid #fecaca;background:#fee2e2;color:#991b1b;border-radius:10px;padding:8px 10px;font-weight:800;cursor:pointer}

        .hero{display:grid;grid-template-columns:1.1fr .9fr;gap:18px;max-width:1100px;margin:14px auto 0;padding:0 16px}
        .heroText h1{margin:6px 0 4px;font-size:32px}
        .lead{margin:0 0 8px;color:#1f2937}
        .heroArt{position:relative;min-height:160px}
        .blob{position:absolute;filter:blur(30px);opacity:.6;border-radius:50%}
        .b1{width:180px;height:180px;background:#f472b6;top:10px;left:10px}
        .b2{width:220px;height:220px;background:#93c5fd;top:40px;right:20px}
        .b3{width:160px;height:160px;background:#86efac;bottom:-30px;left:120px}

        .wrap{max-width:1100px;margin:0 auto;padding:14px 16px}
        .grid{display:grid;gap:14px;grid-template-columns:1.2fr .8fr}
        @media (max-width:880px){ .grid{grid-template-columns:1fr} .hero{grid-template-columns:1fr} .heroArt{min-height:120px} }

        .card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;box-shadow:0 8px 22px rgba(0,0,0,.06)}
        .card .hd{padding:10px 12px;border-bottom:1px solid #e5e7eb;font-weight:900}
        .card .bd{padding:12px}

        label span{display:block;font-size:13px;color:#334155;margin-bottom:4px}
        input,textarea,select{width:100%;padding:12px;border-radius:12px;border:1px solid #e5e7eb;background:#fff;font-size:15px}
        .row{display:grid;gap:10px;grid-template-columns:1fr 1fr}
        @media (max-width:520px){ .row{grid-template-columns:1fr} }
        .actionsRow{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}
        .primary{padding:10px 14px;border-radius:10px;border:1px solid #111827;background:#111827;color:#fff;font-weight:800;cursor:pointer}
        .ghost{padding:10px 14px;border-radius:10px;border:1px solid var(--line);background:#fff;font-weight:700;cursor:pointer}
        .note{margin:8px 0 0;color:#475569;font-size:14px}
        .alert{border-radius:10px;padding:8px 10px;margin-bottom:10px}
        .alert.ok{border:1px solid #a5f3fc;background:#ecfeff;color:#0e7490}
        .alert.danger{border:1px solid #fecaca;background:#fee2e2;color:#991b1b}

        .list{display:grid;gap:10px}
        .ad{display:grid;grid-template-columns:96px 1fr auto;gap:10px;align-items:center;border:1px solid #e5e7eb;border-radius:12px;padding:8px;background:#fff}
        .thumb{width:96px;height:72px;background:#f1f5f9;border-radius:10px;background-size:cover;background-position:center}
        .ttl{font-weight:900}
        .meta{font-size:13px;color:#475569}
        .adActions{display:flex;gap:8px}

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
      `}</style>
    </>
  );
}
