"use client";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

/* ---------------------------- FIREBASE ---------------------------- */
import { initializeApp, getApps } from "firebase/app";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";

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

/* ---------------------------- DİL / ÇEVİRİLER ---------------------------- */
const SUPPORTED = ["tr", "en", "ar", "de"]; // RTL: ar
const LBL = {
  tr: {
    brand: "Üreten Eller",
    heroWelcome: "Üreten Ellere Hoş Geldiniz",
    dashboard: "Ana Sayfa",
    messages: "Mesajlar",
    notifications: "Bildirimler",
    profile: "Profil",
    logout: "Çıkış",
    addListing: "İlan Ver",
    findListing: "İlan Ara",
    showcase: "Vitrin",
    standard: "Standart İlanlar",
    categories: "Kategorilerimiz",
    proBadge: "PRO",
    empty: "Henüz ilan yok.",
    chat_greet: "Merhaba! Size nasıl yardımcı olabilirim?",
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
    heroWelcome: "Welcome to Ureten Eller",
    dashboard: "Home",
    messages: "Messages",
    notifications: "Notifications",
    profile: "Profile",
    logout: "Logout",
    addListing: "Post Listing",
    findListing: "Find Listing",
    showcase: "Showcase",
    standard: "Standard Listings",
    categories: "Categories",
    proBadge: "PRO",
    empty: "No listings yet.",
    chat_greet: "Hello! How can I help you?",
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
    heroWelcome: "مرحبًا بكم في منصتنا",
    dashboard: "الرئيسية",
    messages: "الرسائل",
    notifications: "الإشعارات",
    profile: "الملف الشخصي",
    logout: "تسجيل الخروج",
    addListing: "أنشئ إعلانًا",
    findListing: "ابحث عن إعلان",
    showcase: "الواجهة (Vitrin)",
    standard: "إعلانات عادية",
    categories: "التصنيفات",
    proBadge: "محترف",
    empty: "لا توجد إعلانات بعد.",
    chat_greet: "مرحبًا! كيف أستطيع مساعدتك؟",
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
    heroWelcome: "Willkommen bei Ureten Eller",
    dashboard: "Start",
    messages: "Nachrichten",
    notifications: "Mitteilungen",
    profile: "Profil",
    logout: "Abmelden",
    addListing: "Inserat einstellen",
    findListing: "Inserat suchen",
    showcase: "Vitrin",
    standard: "Standard-Inserate",
    categories: "Kategorien",
    proBadge: "PRO",
    empty: "Noch keine Inserate.",
    chat_greet: "Hallo! Wie kann ich helfen?",
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

/* ---------------------------- ROTASYON SÖZLERİ ---------------------------- */
const PHRASES_TR = [
  { text: "Amacımız: ev hanımlarına bütçe katkısı sağlamak.", color: "#e11d48" },
  { text: "Kadın emeği değer bulsun.", color: "#c026d3" },
  { text: "El emeği ürünler adil fiyata.", color: "#7c3aed" },
  { text: "Mahalle lezzetleri kapınıza gelsin.", color: "#2563eb" },
  { text: "Usta ellerden taze üretim.", color: "#0ea5e9" },
  { text: "Her siparişte platform güvencesi.", color: "#14b8a6" },
  { text: "Küçük üreticiye büyük destek.", color: "#059669" },
  { text: "Şeffaf fiyat, net teslimat.", color: "#16a34a" },
  { text: "Güvenli ödeme, kolay iade.", color: "#65a30d" },
  { text: "Yerelden al, ekonomiye can ver.", color: "#ca8a04" },
  { text: "Emeğin karşılığı, müşteriye kazanç.", color: "#d97706" },
  { text: "Ev yapımı tatlar, el işi güzellikler.", color: "#ea580c" },
  { text: "Her kategoride özenli üretim.", color: "#f97316" },
  { text: "Siparişten teslimata kesintisiz takip.", color: "#f59e0b" },
  { text: "Güvenilir satıcı rozetleri.", color: "#eab308" },
  { text: "Topluluğumuzla daha güçlüyüz.", color: "#84cc16" },
  { text: "Sürdürülebilir üretime destek.", color: "#22c55e" },
  { text: "Adil ticaret, mutlu müşteri.", color: "#10b981" },
  { text: "El emeğine saygı, bütçeye dost fiyat.", color: "#06b6d4" },
  { text: "Kadınların emeğiyle büyüyoruz.", color: "#3b82f6" },
  { text: "Şehrinden taze üretim, güvenle alışveriş.", color: "#6366f1" },
  { text: "Kalite, özen ve şeffaflık.", color: "#8b5cf6" },
  { text: "İhtiyacın olan el emeği burada.", color: "#d946ef" },
  { text: "Uygun fiyat, güvenli süreç, mutlu son.", color: "#ec4899" },
];

/* ---------------------------- KATEGORİLER (renkli) ---------------------------- */
const CATS = {
  tr: [
    { icon: "🍲", title: "Yemekler", subs: ["Ev yemekleri","Börek-çörek","Çorba","Zeytinyağlı","Pilav-makarna","Et-tavuk","Kahvaltılık","Meze","Dondurulmuş","Çocuk öğünleri","Diyet/vegan/gf"] },
    { icon: "🎂", title: "Pasta & Tatlı", subs: ["Yaş pasta","Kek-cupcake","Kurabiye","Şerbetli","Sütlü","Cheesecake","Diyet tatlı","Çikolata/şekerleme","Doğum günü setleri"] },
    { icon: "🫙", title: "Reçel • Turşu • Sos", subs: ["Reçel-marmelat","Pekmez","Turşu","Domates/biber sos","Acı sos","Salça","Sirke","Konserve"] },
    { icon: "🌾", title: "Yöresel / Kışlık", subs: ["Erişte","Tarhana","Yufka","Mantı","Kurutulmuş sebze-meyve","Salça","Sirke","Konserve"] },
    { icon: "🥗", title: "Diyet / Vegan / Glutensiz", subs: ["Fit tabaklar","Vegan yemekler","GF unlu mamuller","Şekersiz tatlı","Keto ürün","Protein atıştırmalık"] },
    { icon: "💍", title: "Takı", subs: ["Bileklik","Kolye","Küpe","Yüzük","Halhal","Broş","Setler","İsimli/kişiye özel","Makrome","Doğal taş","Reçine","Tel sarma"] },
    { icon: "👶", title: "Bebek & Çocuk", subs: ["Hayvan/bebek figürleri","Çıngırak","Diş kaşıyıcı örgü","Bez oyuncak/kitap","Montessori oyuncak","Setler","Örgü patik-bere","Bebek battaniyesi","Önlük-ağız bezi","Lohusa seti","Saç aksesuarı","El emeği kıyafet"] },
    /* Önemli ekleme: 'Lif takımı' */
    { icon: "🧶", title: "Örgü / Triko", subs: ["Hırka","Kazak","Atkı-bere","Panço","Şal","Çorap","Bebek takımı","Yelek","Kırlent-örtü","Lif takımı"] },
    { icon: "✂️", title: "Dikiş / Terzilik", subs: ["Paça/onarım","Fermuar değişimi","Perde dikişi","Nevresim-yastık","Masa örtüsü","Özel dikim","Kostüm"] },
    { icon: "🧵", title: "Makrome & Dekor", subs: ["Duvar süsü","Saksı askısı","Anahtarlık","Avize","Amerikan servis/runner","Sepet","Raf/duvar dekoru"] },
    { icon: "🏠", title: "Ev Dekor & Aksesuar", subs: ["Keçe işleri","Kırlent","Kapı süsü","Tepsi süsleme","Çerçeve","Rüya kapanı","Tablo"] },
    { icon: "🕯️", title: "Mum & Kokulu Ürünler", subs: ["Soya/balmumu mum","Kokulu taş","Oda spreyi","Tütsü","Jel mum","Hediye seti"] },
    { icon: "🧼", title: "Doğal Sabun & Kozmetik", subs: ["Zeytinyağlı sabun","Bitkisel sabunlar","Katı şampuan","Dudak balmı","Krem/merhem","Banyo tuzu","Lavanta kesesi"] },
    { icon: "🧸", title: "Amigurumi & Oyuncak (dekoratif)", subs: ["Anahtarlık","Magnet","Koleksiyon figürü","Dekor bebek/karakter","İsimli amigurumi"] },
  ],
  en: [
    { icon: "🍲", title: "Meals", subs: ["Home meals","Savory bakes","Soup","Olive oil dishes","Rice/pasta","Meat-chicken","Breakfast","Meze","Frozen","Kids meals","Diet/vegan/gf"] },
    { icon: "🎂", title: "Cakes & Sweets", subs: ["Layer cake","Cupcake","Cookies","Syrupy","Milk desserts","Cheesecake","Diet sweets","Chocolate/candy","Birthday sets"] },
    { icon: "🫙", title: "Jam • Pickle • Sauce", subs: ["Jam/marmalade","Molasses","Pickles","Tomato/pepper sauce","Hot sauce","Paste","Vinegar","Canned"] },
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
    { icon: "🧼", title: "صابون طبيعي وتجميلي", subs: ["صابون زيت زيتون","أعشاب","شامبو صلب","بلسم شفاه","كريم/مرهم","ملح حمام","أكياس لافندر"] },
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

function useLang() {
  const [lang, setLang] = useState("tr");
  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved && SUPPORTED.includes(saved)) setLang(saved);
  }, []);
  useEffect(() => {
    localStorage.setItem("lang", lang);
    /* document.documentElement.lang = lang; */
    /* document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"; */
  }, [lang]);
  const t = useMemo(() => LBL[lang] || LBL.tr, [lang]);
  return { lang, setLang, t };
}

/* ---------------------------- BİLEŞEN ---------------------------- */
export default function SellerHome() {
  const router = useRouter();
  const { lang, setLang, t } = useLang();

  // auth
  const [authed, setAuthed] = useState(true);
  useEffect(() => {
    setAuthed(localStorage.getItem("authed") === "1");
    const unsub = onAuthStateChanged(auth, (u) => {
      setAuthed(!!u);
      if (u) localStorage.setItem("authed", "1");
      else localStorage.removeItem("authed");
    });
    return () => unsub();
  }, []);

  // ilanlar
  const [proAds, setProAds] = useState([]);
  const [stdAds, setStdAds] = useState([]);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/ads.json", { cache: "no-store" });
        if (res.ok) {
          const all = await res.json();
          const pros = (all || []).filter((x) => x?.isPro).slice(0, 50);
          const std = (all || []).filter((x) => !x?.isPro).slice(0, 20);
          if (alive) {
            setProAds(pros);
            setStdAds(std);
          }
        }
      } catch {}
    })();
    return () => { alive = false; };
  }, []);

  // hero sözleri
  const phrases = PHRASES_TR;
  const [pi, setPi] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setPi((x) => (x + 1) % phrases.length), 4000);
    return () => clearInterval(id);
  }, [phrases.length]);

  const go = useCallback((href) => router.push(href), [router]);
  const onLogout = async () => {
    try { await signOut(auth); } catch {}
    localStorage.removeItem("authed");
    window.location.href = "/";
  };

  // alt bar aktif
  const tab = "home";

  // kategori renkleri
  const GRADS = [
    "linear-gradient(135deg,#ff80ab,#ffd166)",
    "linear-gradient(135deg,#a78bfa,#60a5fa)",
    "linear-gradient(135deg,#34d399,#a7f3d0)",
    "linear-gradient(135deg,#f59e0b,#f97316)",
    "linear-gradient(135deg,#06b6d4,#3b82f6)",
  ];
  const cats = CATS[lang] || CATS.tr;

  return (
    <>
      <Head>
        <title>{t.brand} – {t.dashboard}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=5" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=5" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=5" />
        <link rel="icon" href="/favicon.png?v=5" />
        <meta name="theme-color" content="#0b0b0b" />
      </Head>

      {/* ÜST BAR */}
      <header className="topbar">
        <div className="brand" onClick={() => go("/")}>
          <img src="/logo.png" width="36" height="36" alt="logo" />
          <span>{t.brand}</span>
        </div>

        <div className="actions">
          {/* Kullanıcı grubu — MOBİLDE ÜSTE */}
          <div className="userGroup">
            <button className="ghost" onClick={() => go("/profile")}>{t.profile}</button>
            <button className="danger" onClick={onLogout}>{t.logout}</button>
          </div>

          {/* İşlem grubu — MOBİLDE ALTA */}
          <div className="actionGroup">
            <button className="ghost" onClick={() => go("/search")}>{t.findListing}</button>
            <button className="primary" onClick={() => go("/portal/seller/post")}>{t.addListing}</button>
          </div>

          <select aria-label="Language" value={lang} onChange={(e) => setLang(e.target.value)}>
            {SUPPORTED.map((k) => (<option key={k} value={k}>{k.toUpperCase()}</option>))}
          </select>
        </div>
      </header>

      {/* HERO — ortalanmış başlık */}
      <section className="hero">
        <h1 className="heroTitle">{t.heroWelcome}</h1>
        <p key={pi} className="phrase" style={{ color: phrases[pi].color }}>{phrases[pi].text}</p>
      </section>

      {/* VİTRİN */}
      <section className="section">
        <div className="sectionHead"><h2>✨ {t.showcase}</h2></div>
        <div className="grid ads">
          {proAds.length ? proAds.map((a, i) => (
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
          )) : <div className="empty">{t.empty}</div>}
        </div>
      </section>

      {/* STANDART */}
      <section className="section">
        <div className="sectionHead"><h2>🧺 {t.standard}</h2></div>
        <div className="grid ads">
          {stdAds.length ? stdAds.map((a, i) => (
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
          )) : <div className="empty">{t.empty}</div>}
        </div>
      </section>

      {/* KATEGORİLER */}
      <section className="section">
        <div className="sectionHead"><h2>🗂️ {t.categories}</h2></div>
        <div className="grid cats">
          {cats.map((c, i) => (
            <article key={i} className="catCard" style={{ backgroundImage: GRADS[i % GRADS.length] }}>
              <div className="head"><span className="icn">{c.icon}</span><h3>{c.title}</h3></div>
              <div className="subs">
                {(c.subs || []).map((s, k) => <span key={k} className="chip">{s}</span>)}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ALT GEZİNME ÇUBUĞU */}
      <nav className="bottombar" aria-label="Bottom Navigation">
        <button className={tab === "home" ? "tab active" : "tab"} onClick={() => go("/portal/seller")}>
          <span className="tIc">🏠</span><span>{t.dashboard}</span>
        </button>
        <button className="tab" onClick={() => go("/messages")}>
          <span className="tIc">💬</span><span>{t.messages}</span>
        </button>
        <button className="tab" onClick={() => go("/notifications")}>
          <span className="tIc">🔔</span><span>{t.notifications}</span>
        </button>
      </nav>

      {/* CANLI DESTEK BALONU */}
      <ChatBubble greet={t.chat_greet} lang={lang} />

      {/* LEGAL FOOTER */}
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

      {/* STYLES */}
      <style>{`
        :root{ --ink:#0f172a; --muted:#475569; --line:rgba(0,0,0,.08); }
        html,body{height:100%}
        body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial,sans-serif;color:var(--ink);
          background: radial-gradient(1200px 600px at 10% -10%, #ffe4e6, transparent),
                      radial-gradient(900px 500px at 90% -10%, #e0e7ff, transparent),
                      linear-gradient(120deg,#ff80ab,#a78bfa,#60a5fa,#34d399);
          background-attachment:fixed;}

        /* TOPBAR */
        .topbar{position:sticky;top:0;z-index:50;display:grid;grid-template-columns:1fr auto;gap:12px;align-items:center;
          padding:10px 14px;background:rgba(255,255,255,.92);backdrop-filter:blur(8px);border-bottom:1px solid var(--line)}
        .brand{display:flex;align-items:center;gap:8px;font-weight:900;cursor:pointer}
        .actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center;justify-content:flex-end}
        .userGroup{display:flex;gap:8px;order:1}
        .actionGroup{display:flex;gap:8px;order:2}
        .ghost{border:1px solid var(--line);background:#fff;border-radius:10px;padding:8px 12px;font-weight:700;cursor:pointer}
        .primary{border:1px solid #111827;background:#111827;color:#fff;border-radius:10px;padding:8px 12px;font-weight:800;cursor:pointer}
        .danger{border:1px solid #111827;background:#111827;color:#fff;border-radius:10px;padding:8px 12px;font-weight:800;cursor:pointer}
        .actions select{border:1px solid var(--line);border-radius:10px;padding:6px 8px;background:#fff}

        /* MOBİLDE 'İlan Ara' + 'İlan Ver' ALTA insin */
        @media (min-width:640px){ .actionGroup{order:1} .actions{flex-wrap:nowrap} }

        /* HERO */
        .hero{display:grid;place-items:center;text-align:center;gap:8px;max-width:1100px;margin:12px auto 0;padding:12px 16px}
        .heroTitle{margin:0;font-size:42px;line-height:1.15;letter-spacing:.2px;text-shadow:0 8px 28px rgba(0,0,0,.15)}
        .phrase{margin:4px 0 0;font-weight:700}
        @media (max-width:520px){ .heroTitle{font-size:34px} }

        /* SECTIONS */
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
        .catCard{border:1px solid #e5e7eb;border-radius:16px;background:rgba(255,255,255,.92);background-size:cover;background-position:center;box-shadow:0 8px 22px rgba(0,0,0,.06);padding:12px}
        .catCard .head{display:flex;gap:8px;align-items:center}
        .icn{font-size:22px}
        .catCard h3{margin:0;font-size:18px}
        .subs{display:grid;gap:8px;grid-template-columns:repeat(2,minmax(0,1fr));margin-top:8px}
        .chip{display:block;text-align:center;padding:8px;border-radius:12px;border:1px solid #e5e7eb;background:#fff;font-size:12px}

        /* BOTTOM BAR */
        .bottombar{position:sticky;bottom:0;z-index:40;display:grid;grid-template-columns:repeat(3,1fr);gap:6px;padding:6px;
          background:rgba(255,255,255,.94);backdrop-filter:blur(8px);border-top:1px solid var(--line)}
        .tab{display:flex;flex-direction:column;align-items:center;gap:2px;padding:8px;border-radius:10px;border:1px solid transparent;background:transparent;cursor:pointer;font-weight:700}
        .tab.active{border-color:#111827;background:#111827;color:#fff}
        .tIc{font-size:16px}

        /* CHAT */
        .chatBtn{position:fixed;right:16px;bottom:76px;z-index:60;background:#111827;color:#fff;border:none;border-radius:999px;
          width:54px;height:54px;cursor:pointer;box-shadow:0 10px 26px rgba(0,0,0,.18);font-size:20px}
        .chatWin{position:fixed;right:16px;bottom:140px;z-index:60;width:320px;max-width:calc(100vw - 32px);
          background:#fff;border:1px solid #e5e7eb;border-radius:16px;box-shadow:0 24px 60px rgba(0,0,0,.18);overflow:hidden}
        .chatHd{padding:10px 12px;font-weight:900;border-bottom:1px solid #e5e7eb;background:#111827;color:#fff}
        .chatBd{max-height:300px;overflow:auto;padding:10px;display:flex;flex-direction:column;gap:8px}
        .msg{padding:8px 10px;border-radius:12px;max-width:80%}
        .msg.me{align-self:flex-end;background:#111827;color:#fff}
        .msg.you{align-self:flex-start;background:#f1f5f9}
        .chatFt{display:flex;gap:6px;padding:10px;border-top:1px solid #e5e7eb}
        .chatFt input[type="text"]{flex:1;border:1px solid #e5e7eb;border-radius:10px;padding:8px}
        .send{border:1px solid #111827;background:#111827;color:#fff;border-radius:10px;padding:8px 12px;font-weight:800;cursor:pointer}

        /* LEGAL */
        .legal{background:#0b0b0b;color:#f8fafc;border-top:1px solid rgba(255,255,255,.12);width:100vw;margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);margin-top:14px}
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

/* ---------------------------- Chat Bubble Component ---------------------------- */
function ChatBubble({ greet }) {
  const [open, setOpen] = useState(false);
  const [list, setList] = useState([{ who: "you", text: greet }]);
  const [text, setText] = useState("");

  function send() {
    const t = text.trim();
    if (!t) return;
    setList((l) => [...l, { who: "me", text: t }]);
    setText("");
    // burada admin entegrasyonu için API çağrısı eklenebilir
  }

  return (
    <>
      {open && (
        <div className="chatWin" role="dialog" aria-label="Live Chat">
          <div className="chatHd">Canlı Destek</div>
          <div className="chatBd">
            {list.map((m, i) => (
              <div key={i} className={`msg ${m.who}`}>{m.text}</div>
            ))}
          </div>
          <div className="chatFt">
            <input type="file" accept="image/*" title="Resim gönder" />
            <input type="text" value={text} onChange={(e)=>setText(e.target.value)} placeholder="Mesaj yaz..." />
            <button className="send" onClick={send}>Gönder</button>
          </div>
        </div>
      )}
      <button className="chatBtn" onClick={() => setOpen((x)=>!x)}>💬</button>
    </>
  );
}
