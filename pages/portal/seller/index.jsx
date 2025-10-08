// pages/portal/seller/index.jsx
"use client";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

/* ------------------------------ SUPABASE (opsiyonel) ------------------------------ */
let sb = null;
function getSupabase() {
  if (sb) return sb;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || (typeof window !== "undefined" ? window.__SUPABASE_URL__ : "");
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || (typeof window !== "undefined" ? window.__SUPABASE_ANON__ : "");
  if (!url || !key) return null;
  sb = createClient(url, key);
  return sb;
}

/* ------------------------------ DİL / ÇEVİRİ ------------------------------ */
const SUPPORTED = ["tr", "en", "ar", "de"]; // RTL: ar
const LBL = {
  tr: {
    brand: "Üreten Eller",
    addListing: "İlan Ver",
    profile: "Profil",
    logout: "Çıkış",
    dashboard: "Ana Sayfa",
    messages: "Mesajlar",
    notifications: "Bildirimler",
    showcase: "Vitrin",
    standard: "Standart İlanlar",
    categories: "Kategorilerimiz",
    proBadge: "PRO",
    empty: "Henüz ilan yok.",
    support: "Canlı Destek",
    typeMsg: "Mesaj yazın...",
    send: "Gönder",
    attach: "Görsel ekle",
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
      home: "Ana Sayfa",
    },
  },
  en: {
    brand: "Ureten Eller",
    addListing: "Post Listing",
    profile: "Profile",
    logout: "Logout",
    dashboard: "Home",
    messages: "Messages",
    notifications: "Notifications",
    showcase: "Showcase",
    standard: "Standard Listings",
    categories: "Categories",
    proBadge: "PRO",
    empty: "No listings yet.",
    support: "Live Support",
    typeMsg: "Type a message...",
    send: "Send",
    attach: "Attach image",
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
      home: "Home",
    },
  },
  ar: {
    brand: "أُنتِج بالأيادي",
    addListing: "أنشئ إعلانًا",
    profile: "الملف الشخصي",
    logout: "تسجيل الخروج",
    dashboard: "الرئيسية",
    messages: "الرسائل",
    notifications: "الإشعارات",
    showcase: "الواجهة (Vitrin)",
    standard: "إعلانات عادية",
    categories: "التصنيفات",
    proBadge: "محترف",
    empty: "لا توجد إعلانات بعد.",
    support: "الدعم المباشر",
    typeMsg: "اكتب رسالة...",
    send: "إرسال",
    attach: "إرفاق صورة",
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
      home: "الرئيسية",
    },
  },
  de: {
    brand: "Ureten Eller",
    addListing: "Inserat einstellen",
    profile: "Profil",
    logout: "Abmelden",
    dashboard: "Start",
    messages: "Nachrichten",
    notifications: "Mitteilungen",
    showcase: "Vitrin",
    standard: "Standard-Inserate",
    categories: "Kategorien",
    proBadge: "PRO",
    empty: "Noch keine Inserate.",
    support: "Live-Support",
    typeMsg: "Nachricht schreiben...",
    send: "Senden",
    attach: "Bild anhängen",
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
      home: "Startseite",
    },
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
  const t = useMemo(() => LBL[lang] || LBL.tr, [lang]);
  return { lang, t };
}

/* ------------------------------ KATEGORİLER (tam set) ------------------------------ */
const CATS = {
  tr: [
    { icon: "🍲", title: "Yemekler", subs: ["Ev yemekleri","Börek-çörek","Çorba","Zeytinyağlı","Pilav-makarna","Et-tavuk","Kahvaltılık","Meze","Dondurulmuş","Çocuk öğünleri","Diyet/vegan/gf"] },
    { icon: "🎂", title: "Pasta & Tatlı", subs: ["Yaş pasta","Kek-cupcake","Kurabiye","Şerbetli","Sütlü","Cheesecake","Diyet tatlı","Çikolata/şekerleme","Doğum günü setleri"] },
    { icon: "🫙", title: "Reçel • Turşu • Sos", subs: ["Reçel-marmelat","Pekmez","Turşu","Domates/biber sos","Acı sos","Salça","Sirke","Konserve"] },
    { icon: "🌾", title: "Yöresel / Kışlık", subs: ["Erişte","Tarhana","Yufka","Mantı","Kurutulmuş sebze-meyve","Salça","Sirke","Konserve"] },
    { icon: "🥗", title: "Diyet / Vegan / Glutensiz", subs: ["Fit tabaklar","Vegan yemekler","GF unlu mamuller","Şekersiz tatlı","Keto ürün","Protein atıştırmalık"] },
    { icon: "💍", title: "Takı", subs: ["Bileklik","Kolye","Küpe","Yüzük","Halhal","Broş","Setler","İsimli/kişiye özel","Makrome","Doğal taş","Reçine","Tel sarma"] },
    { icon: "👶", title: "Bebek & Çocuk", subs: ["Hayvan/bebek figürleri","Çıngırak","Diş kaşıyıcı örgü","Bez oyuncak/kitap","Montessori oyuncak","Setler","Örgü patik-bere","Bebek battaniyesi","Önlük-ağız bezi","Lohusa seti","Saç aksesuarı","El emeği kıyafet"] },
    { icon: "🧶", title: "Örgü / Triko", subs: ["Hırka","Kazak","Atkı-bere","Panço","Şal","Çorap","Bebek takımı","Yelek","Kırlent-örtü"] },
    { icon: "✂️", title: "Dikiş / Terzilik", subs: ["Paça/onarım","Fermuar değişimi","Perde dikişi","Nevresim-yastık","Masa örtüsü","Özel dikim","Kostüm"] },
    { icon: "🧵", title: "Makrome & Dekor", subs: ["Duvar süsü","Saksı askısı","Anahtarlık","Avize","Amerikan servis/runner","Sepet","Raf/duvar dekoru"] },
    { icon: "🏠", title: "Ev Dekor & Aksesuar", subs: ["Keçe işleri","Kırlent","Kapı süsü","Tepsi süsleme","Çerçeve","Rüya kapanı","Tablo"] },
    { icon: "🕯️", title: "Mum & Kokulu Ürünler", subs: ["Soya/balmumu mum","Kokulu taş","Oda spreyi","Tütsü","Jel mum","Hediye seti"] },
    { icon: "🧼", title: "Doğal Sabun & Kozmetik", subs: ["Zeytinyağlı sabun","Bitkisel sabunlar","Katı şampuan","Dudak balmı","Krem/merhem","Banyo tuzu","Lavanta kesesi"] },
    { icon: "🧸", title: "Amigurumi & Oyuncak (dekoratif)", subs: ["Anahtarlık","Magnet","Koleksiyon figürü","Dekor bebek/karakter","İsimli amigurumi"] },
  ],
  en: [
    { icon: "🍲", title: "Meals", subs: ["Home meals","Savory bakes","Soup","Olive oil dishes","Rice-pasta","Meat-chicken","Breakfast","Meze","Frozen","Kids meals","Diet/vegan/gf"] },
    { icon: "🎂", title: "Cakes & Sweets", subs: ["Layer cake","Cupcake","Cookies","Syrupy","Milk desserts","Cheesecake","Diet sweets","Chocolate/candy","Birthday sets"] },
    { icon: "🫙", title: "Jam • Pickle • Sauce", subs: ["Jam-marmalade","Molasses","Pickles","Tomato/pepper sauce","Hot sauce","Paste","Vinegar","Canned"] },
    { icon: "🌾", title: "Regional / Winter Prep", subs: ["Noodles","Tarhana","Yufka","Manti","Dried veg/fruit","Paste","Vinegar","Canned"] },
    { icon: "🥗", title: "Diet / Vegan / Gluten-free", subs: ["Fit bowls","Vegan meals","GF bakery","Sugar-free desserts","Keto items","Protein snacks"] },
    { icon: "💍", title: "Jewelry", subs: ["Bracelet","Necklace","Earrings","Ring","Anklet","Brooch","Sets","Personalized","Macrame","Gemstones","Resin","Wire wrap"] },
    { icon: "👶", title: "Baby & Kids", subs: ["Animal/baby figures","Rattle","Knit teether","Cloth toy/book","Montessori toy","Sets","Knit booties-hats","Baby blanket","Bib/burp cloth","Maternity set","Hair accessory","Handmade wear"] },
    { icon: "🧶", title: "Knitwear", subs: ["Cardigan","Sweater","Scarf-hat","Poncho","Shawl","Socks","Baby set","Vest","Pillow/cover"] },
    { icon: "✂️", title: "Sewing / Tailor", subs: ["Hemming/repair","Zipper change","Curtains","Bedding","Tablecloth","Custom sew","Costume"] },
    { icon: "🧵", title: "Macrame & Decor", subs: ["Wall hanging","Plant hanger","Keychain","Pendant lamp","Table runner","Basket","Shelf/decor"] },
    { icon: "🏠", title: "Home Decor & Accessories", subs: ["Felt crafts","Pillow","Door wreath","Tray decor","Frame","Dreamcatcher","Painting"] },
    { icon: "🕯️", title: "Candles & Scents", subs: ["Soy/beeswax candles","Aroma stone","Room spray","Incense","Gel candle","Gift sets"] },
    { icon: "🧼", title: "Natural Soap & Cosmetics", subs: ["Olive oil soap","Herbal soaps","Solid shampoo","Lip balm","Cream/salve","Bath salt","Lavender sachet"] },
    { icon: "🧸", title: "Amigurumi & Toys (decor)", subs: ["Keychain","Magnet","Collectible figure","Decor doll/character","Named amigurumi"] },
  ],
  ar: [
    { icon: "🍲", title: "وجبات", subs: ["بيتي","معجنات مالحة","شوربة","أكلات بزيت الزيتون","أرز/معكرونة","لحم/دجاج","فطور","مقبلات","مجمدة","وجبات أطفال","نباتي/خالٍ من الغلوتين"] },
    { icon: "🎂", title: "كعك وحلويات", subs: ["كيك طبقات","كب كيك","بسكويت","حلويات بالقطر","حلويات ألبان","تشيز كيك","دايت","شوكولاتة/حلوى","طقم عيد ميلاد"] },
    { icon: "🫙", title: "مربى • مخلل • صوص", subs: ["مربى","دبس","مخللات","صلصة طماطم/فلفل","حار","معجون","خل","معلبات"] },
    { icon: "🌾", title: "تراثي / مؤونة الشتاء", subs: ["مكرونة منزلية","طرحنة","يوفكا","مانطي","مجففات","معجون","خل","معلبات"] },
    { icon: "🥗", title: "حمية / نباتي / خالٍ من الغلوتين", subs: ["أطباق صحية","نباتي","مخبوزات GF","حلويات بدون سكر","كيتو","سناك بروتين"] },
    { icon: "💍", title: "إكسسوارات", subs: ["أساور","قلائد","أقراط","خواتم","خلخال","بروش","أطقم","مخصص بالاسم","ماكرامه","أحجار","ريزن","سلك"] },
    { icon: "👶", title: "رضع وأطفال", subs: ["مجسّمات","خشخيشة","عضّاضة تريكو","لعبة/كتاب قماشي","مونتيسوري","أطقم","حذاء/قبعة تريكو","بطانية","مريلة","طقم نفاس","اكسسوار شعر","ملابس يدوية"] },
    { icon: "🧶", title: "تريكو", subs: ["جاكيت","بلوز","وشاح/قبعة","بونشو","شال","جوارب","طقم أطفال","صديري","وسادة/غطاء"] },
    { icon: "✂️", title: "خياطة/تفصيل", subs: ["تقصير/تصليح","تغيير سحاب","ستائر","مفارش سرير","مفرش طاولة","تفصيل خاص","ملابس تنكرية"] },
    { icon: "🧵", title: "ماكرامه وديكور", subs: ["تعليقة حائط","حامل نبات","ميدالية","إضاءة معلّقة","مفرش","سلة","رف/ديكور"] },
    { icon: "🏠", title: "ديكور المنزل", subs: ["فيلت","وسادة","زينة باب","صينية مزخرفة","إطار","صائد أحلام","لوحة"] },
    { icon: "🕯️", title: "شموع وروائح", subs: ["شموع صويا/نحل","حجر عطري","معطر غرف","بخور","شمعة جل","أطقم هدايا"] },
    { icon: "🧼", title: "صابون طبيعي وتجميلي", subs: ["صابون زيت زيتون","أعشاب","شامبو صلب","بلسم شفاه","كريم/مرهم","ملح حمام"] },
    { icon: "🧸", title: "أميجورومي وألعاب (ديكور)", subs: ["ميدالية","مغناطيس","فيجور","دمية ديكور","أميجورومي بالاسم"] },
  ],
  de: [
    { icon: "🍲", title: "Speisen", subs: ["Hausmannskost","Herzhafte Backwaren","Suppe","Olivenölgerichte","Reis/Pasta","Fleisch/Hähnchen","Frühstück","Meze","Tiefgekühlt","Kindermahlzeiten","Diät/Vegan/GF"] },
    { icon: "🎂", title: "Torten & Süßes", subs: ["Sahnetorte","Cupcake","Kekse","Sirupgebäck","Milchdesserts","Käsekuchen","Diät-Desserts","Schoko/Bonbon","Geburtstags-Sets"] },
    { icon: "🫙", title: "Marmelade • Pickles • Soßen", subs: ["Marmelade","Melasse","Eingelegtes","Tomaten/Pfeffersoße","Scharfsoße","Paste","Essig","Eingewecktes"] },
    { icon: "🌾", title: "Regional / Wintervorrat", subs: ["Hausgem. Nudeln","Tarhana","Yufka","Manti","Getrocknetes","Paste","Essig","Vorrat"] },
    { icon: "🥗", title: "Diät / Vegan / Glutenfrei", subs: ["Fit Bowls","Vegan","GF-Bäckerei","Zuckerfrei","Keto","Protein-Snacks"] },
    { icon: "💍", title: "Schmuck", subs: ["Armband","Kette","Ohrringe","Ring","Fußkettchen","Brosche","Sets","Personalisiert","Makramee","Edelsteine","Harz","Draht"] },
    { icon: "👶", title: "Baby & Kinder", subs: ["Figuren","Rassel","Beißring Strick","Stoffspielzeug/Buch","Montessori","Sets","Schühchen/Mützen","Babydecke","Lätzchen","Wochenbett-Set","Haar-Accessoire","Handgemachte Kleidung"] },
    { icon: "🧶", title: "Strickwaren", subs: ["Cardigan","Pullover","Schal/Mütze","Poncho","Tuch","Socken","Baby-Set","Weste","Kissen/Decke"] },
    { icon: "✂️", title: "Nähen / Schneiderei", subs: ["Saum/Reparatur","Reißverschluss","Gardinen","Bettwäsche","Tischdecke","Maßanfertigung","Kostüm"] },
    { icon: "🧵", title: "Makramee & Deko", subs: ["Wandbehang","Pflanzenhänger","Schlüsselanh.","Pendelleuchte","Läufer","Korb","Regal/Deko"] },
    { icon: "🏠", title: "Wohndeko & Accessoires", subs: ["Filzarbeiten","Kissen","Türkranz","Tablettdeko","Rahmen","Traumfänger","Bild"] },
    { icon: "🕯️", title: "Kerzen & Düfte", subs: ["Soja/Bienenwachs","Duftstein","Raumspray","Weihrauch","Gelkerze","Geschenksets"] },
    { icon: "🧼", title: "Naturseife & Kosmetik", subs: ["Olivenölseife","Kräuterseifen","Festes Shampoo","Lippenbalsam","Creme/Salbe","Badesalz","Lavendelsäckchen"] },
    { icon: "🧸", title: "Amigurumi & Spielzeug (Deko)", subs: ["Schlüsselanh.","Magnet","Sammelfigur","Deko-Puppe","Amigurumi mit Name"] },
  ],
};

/* ------------------------------ BİLEŞEN ------------------------------ */
export default function SellerHome() {
  const router = useRouter();
  const { lang, t } = useLang();

  // Auth (login sonrası bu sayfaya gelir)
  const [authed, setAuthed] = useState(true);
  useEffect(() => { setAuthed(localStorage.getItem("authed") === "1"); }, []);

  // İlanlar: vitrin (pro) + standart — /public/ads.json
  const [proAds, setProAds] = useState([]);
  const [stdAds, setStdAds] = useState([]);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/ads.json", { cache: "no-store" });
        if (res.ok) {
          const all = await res.json();
          if (!Array.isArray(all)) throw new Error();
          const pros = all.filter(x => x?.isPro);
          const std = all.filter(x => !x?.isPro);
          if (alive) { setProAds(pros.slice(0,50)); setStdAds(std.slice(0,20)); }
        }
      } catch {}
    })();
    return () => { alive = false; };
  }, []);

  const cats = CATS[lang] || CATS.tr;

  const go = useCallback((href) => router.push(href), [router]);

  const onLogout = async () => {
    try { const supa = getSupabase(); if (supa) await supa.auth.signOut(); } catch {}
    localStorage.removeItem("authed");
    localStorage.setItem("support_chat", "1"); // anasayfada baloncuk tetikleyici
    window.location.href = "/"; // tam çıkış
  };

  if (!authed) {
    if (typeof window !== "undefined") window.location.href = "/login?role=seller";
    return null;
  }

  // Bottom bar aktif sekme
  const activeTab = "home";

  return (
    <>
      <Head>
        <title>{t.brand} – {t.dashboard}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Faviconlar */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=5" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=5" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=5" />
        <link rel="icon" href="/favicon.png?v=5" />
        <meta name="theme-color" content="#0b0b0b" />
      </Head>

      {/* ÜST BAR — yalnız 3 buton */}
      <header className="topbar">
        <div className="brand" onClick={() => go("/portal/seller")}>👐 {t.brand}</div>
        <div className="actions">
          <button className="primary" onClick={() => go("/portal/seller/post")}>{t.addListing}</button>
          <button className="ghost" onClick={() => go("/profile")}>{t.profile}</button>
          <button className="danger" onClick={onLogout}>{t.logout}</button>
        </div>
      </header>

      {/* HERO / renkli bloblar */}
      <section className="hero">
        <div className="left">
          <h1>{t.dashboard}</h1>
          <p className="lead">El emeği ürünlerini güvenle vitrine çıkar, siparişlerini tek panelden yönet.</p>
        </div>
        <div className="right" aria-hidden>
          <div className="blob b1" />
          <div className="blob b2" />
          <div className="blob b3" />
        </div>
      </section>

      {/* Vitrin (PRO) */}
      <section className="section">
        <div className="sectionHead"><h2>✨ {t.showcase}</h2></div>
        <div className="grid ads">
          {proAds.length === 0 ? (<div className="empty">{t.empty}</div>) : proAds.map((a,i) => (
            <article key={i} className="ad">
              <div className="thumb" style={{ backgroundImage: a?.img ? `url(${a.img})` : undefined }}>
                <span className="badge">{t.proBadge}</span>
              </div>
              <div className="body">
                <div className="title">{a?.title || "İlan"}</div>
                <div className="meta"><span>{a?.cat || a?.category || ""}</span><b>{a?.price || ""}</b></div>
              </div>
              <button className="view" onClick={() => go(a?.url || `/ads/${a?.slug || a?.id || ""}`)}>İncele</button>
            </article>
          ))}
        </div>
      </section>

      {/* Standart ilanlar */}
      <section className="section">
        <div className="sectionHead"><h2>🧺 {t.standard}</h2></div>
        <div className="grid ads">
          {stdAds.length === 0 ? (<div className="empty">{t.empty}</div>) : stdAds.map((a,i) => (
            <article key={i} className="ad">
              <div className="thumb" style={{ backgroundImage: a?.img ? `url(${a.img})` : undefined }} />
              <div className="body">
                <div className="title">{a?.title || "İlan"}</div>
                <div className="meta"><span>{a?.cat || a?.category || ""}</span><b>{a?.price || ""}</b></div>
              </div>
              <button className="view" onClick={() => go(a?.url || `/ads/${a?.slug || a?.id || ""}`)}>İncele</button>
            </article>
          ))}
        </div>
      </section>

      {/* Kategoriler */}
      <section className="section">
        <div className="sectionHead"><h2>🗂️ {t.categories}</h2></div>
        <div className="grid cats">
          {(cats||[]).map((c,idx) => (
            <article key={idx} className="catCard">
              <div className="head"><span className="icn">{c.icon}</span><h3>{c.title}</h3><span className="count">{c.subs.length}</span></div>
              <div className="subs">{c.subs.map((s,i) => <span key={i} className="chip">{s}</span>)}</div>
            </article>
          ))}
        </div>
      </section>

      {/* ALT BAR — sabit */}
      <nav className="bottombar" aria-label="Bottom Navigation">
        <button className={activeTab === "home" ? "tab active" : "tab"} onClick={() => go("/portal/seller")}>🏠 <span>{t.dashboard}</span></button>
        <button className="tab" onClick={() => go("/messages")}>💬 <span>{t.messages}</span></button>
        <button className="tab" onClick={() => go("/notifications")}>🔔 <span>{t.notifications}</span></button>
      </nav>

      {/* Siyah LEGAL ALAN — kenardan kenara */}
      <footer className="legal">
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

      {/* Canlı Destek Baloncuğu (yerel) */}
      <SupportBubble t={t} />

      {/* STYLES */}
      <style>{`
        :root{ --ink:#0f172a; --muted:#475569; --line:rgba(0,0,0,.08); }
        html,body{height:100%}
        body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial,sans-serif;color:var(--ink);background:
          radial-gradient(1200px 600px at 10% -10%, #ffe4e6, transparent),
          radial-gradient(900px 500px at 90% -10%, #e0e7ff, transparent),
          linear-gradient(120deg,#ff80ab,#a78bfa,#60a5fa,#34d399);
          background-attachment:fixed;}

        .topbar{position:sticky;top:0;z-index:50;display:grid;grid-template-columns:1fr auto;gap:12px;align-items:center;padding:10px 14px;background:rgba(255,255,255,.92);backdrop-filter:blur(8px);border-bottom:1px solid var(--line)}
        .brand{font-weight:900;cursor:pointer}
        .actions{display:flex;gap:8px;align-items:center}
        .primary{padding:10px 14px;border-radius:12px;border:1px solid #111827;background:#111827;color:#fff;font-weight:800;cursor:pointer}
        .ghost{padding:10px 14px;border-radius:12px;border:1px solid var(--line);background:#fff;font-weight:700;cursor:pointer}
        .danger{padding:10px 14px;border-radius:12px;border:1px solid #111827;background:#111827;color:#fff;font-weight:800;cursor:pointer}

        .hero{display:grid;grid-template-columns:1.1fr .9fr;gap:18px;max-width:1100px;margin:16px auto 0;padding:10px 16px}
        .left h1{margin:6px 0 4px;font-size:30px}
        .lead{margin:0 0 10px;color:#1f2937}
        .right{position:relative;min-height:160px}
        .blob{position:absolute;filter:blur(30px);opacity:.6;border-radius:50%}
        .b1{width:180px;height:180px;background:#f472b6;top:10px;left:10px}
        .b2{width:220px;height:220px;background:#93c5fd;top:40px;right:20px}
        .b3{width:160px;height:160px;background:#86efac;bottom:-30px;left:120px}

        .section{max-width:1100px;margin:12px auto;padding:0 16px}
        .sectionHead{display:flex;align-items:center;justify-content:space-between;margin:8px 0}
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
        .catCard .head{display:grid;grid-template-columns:auto 1fr auto;gap:8px;align-items:center}
        .icn{font-size:22px}
        .catCard h3{margin:0;font-size:18px}
        .count{justify-self:end;background:#ffffffc0;border:1px solid #e5e7eb;font-size:12px;border-radius:999px;padding:2px 8px}
        .subs{display:grid;gap:8px;grid-template-columns:repeat(2,minmax(0,1fr));margin-top:8px}
        .chip{display:block;text-align:center;padding:8px;border-radius:12px;border:1px solid #e5e7eb;background:#fff;font-size:12px}

        .bottombar{position:sticky;bottom:0;z-index:40;display:grid;grid-template-columns:repeat(3,1fr);gap:6px;padding:6px;background:rgba(255,255,255,.94);backdrop-filter:blur(8px);border-top:1px solid var(--line)}
        .tab{display:flex;gap:6px;align-items:center;justify-content:center;padding:8px;border-radius:10px;border:1px solid transparent;background:transparent;cursor:pointer;font-weight:700}
        .tab.active{border-color:#111827;background:#111827;color:#fff}

        .legal{background:#0b0b0b;color:#f8fafc;border-top:1px solid rgba(255,255,255,.12);width:100vw;margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);margin-top:14px}
        .inner{max-width:1100px;margin:0 auto;padding:12px 16px}
        .ttl{font-weight:800;margin-bottom:6px}
        .links{display:flex;flex-wrap:wrap;gap:10px}
        .links a{color:#e2e8f0;font-size:13px;padding:6px 8px;border-radius:8px;text-decoration:none}
        .links a:hover{background:rgba(255,255,255,.08);color:#fff}
        .homeLink{margin-left:auto;font-weight:800}
        .copy{margin-top:6px;font-size:12px;color:#cbd5e1}

        /* Canlı Destek */
        .supBubble{position:fixed;right:16px;bottom:86px;z-index:60}
        .supBtn{display:flex;align-items:center;gap:8px;border-radius:999px;padding:10px 14px;border:1px solid #111827;background:#111827;color:#fff;font-weight:800;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.2)}
        .supPanel{position:fixed;right:16px;bottom:86px;width:320px;max-height:60vh;background:#fff;border:1px solid #e5e7eb;border-radius:16px;box-shadow:0 10px 28px rgba(0,0,0,.18);display:flex;flex-direction:column;overflow:hidden}
        .supHd{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border-bottom:1px solid #e5e7eb;font-weight:800}
        .supBody{padding:10px;overflow:auto;display:flex;flex-direction:column;gap:8px}
        .msg{max-width:86%;padding:8px 10px;border-radius:12px;border:1px solid #e5e7eb;background:#fff}
        .mine{align-self:flex-end;background:#111827;color:#fff;border-color:#111827}
        .supFt{display:flex;gap:6px;padding:10px;border-top:1px solid #e5e7eb}
        .supFt input[type="text"]{flex:1;border:1px solid #e5e7eb;border-radius:10px;padding:8px}
        .supFt input[type="file"]{display:none}
        .supFt .btn{border:1px solid var(--line);background:#fff;border-radius:10px;padding:8px 10px;font-weight:700;cursor:pointer}

        @media (max-width:820px){ .hero{grid-template-columns:1fr} }
      `}</style>
    </>
  );
}

/* ------------------------------ Canlı Destek Bileşeni ------------------------------ */
function SupportBubble({ t }) {
  const [open, setOpen] = useState(false);
  const [txt, setTxt] = useState("");
  const [items, setItems] = useState([]); // {me:boolean, text?, img?}

  useEffect(() => {
    try { const saved = JSON.parse(localStorage.getItem("support_items") || "[]"); if (Array.isArray(saved)) setItems(saved); } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem("support_items", JSON.stringify(items)); } catch {}
  }, [items]);

  const onSend = () => {
    if (!txt.trim()) return;
    setItems((x) => [...x, { me: true, text: txt.trim() }]);
    setTxt("");
  };

  const onAttach = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setItems((x) => [...x, { me: true, img: url }]);
    e.target.value = "";
  };

  if (!open) return (
    <div className="supBubble">
      <button className="supBtn" onClick={() => setOpen(true)}>💬 {t.support}</button>
    </div>
  );

  return (
    <div className="supPanel" role="dialog" aria-label={t.support}>
      <div className="supHd">
        <span>💬 {t.support}</span>
        <button className="ghost" onClick={() => setOpen(false)}>✕</button>
      </div>
      <div className="supBody">
        {items.length === 0 && <div className="msg">{t.typeMsg}</div>}
        {items.map((m, i) => (
          <div key={i} className={"msg " + (m.me ? "mine" : "")}>{m.img ? <img src={m.img} alt="" style={{maxWidth:"100%",borderRadius:8}}/> : m.text}</div>
        ))}
      </div>
      <div className="supFt">
        <input type="text" placeholder={t.typeMsg} value={txt} onChange={(e)=>setTxt(e.target.value)} onKeyDown={(e)=>{ if(e.key==="Enter") onSend(); }} />
        <label className="btn" title={t.attach}>
          📎<input type="file" accept="image/*" onChange={onAttach} />
        </label>
        <button className="btn" onClick={onSend}>{t.send}</button>
      </div>
    </div>
  );
}
