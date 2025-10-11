"use client";
import React, { useEffect, useMemo, useState, useContext, createContext } from "react";

/* ----------------------------- FIREBASE (Auth eşitleme) ----------------------------- */
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCd9GjP6CDA8i4XByhXDHyESy-g_DHVwvQ",
  authDomain: "ureteneller-ecaac.firebaseapp.com",
  projectId: "ureteneller-ecaac",
  storageBucket: "ureteneller-ecaac.firebasestorage.app",
  messagingSenderId: "368042877151",
  appId: "1:368042877151:web:ee0879fc4717928079c96a",
  measurementId: "G-BJHKN8V4RQ",
};
const fbApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(fbApp);

/* ----------------------------- AUTH (Canvas-friendly stub) ----------------------------- */
const AuthCtx = createContext(false);
function SignedIn({ children }) {
  const isAuthed = useContext(AuthCtx);
  return isAuthed ? children : null;
}
function SignedOut({ children }) {
  const isAuthed = useContext(AuthCtx);
  return isAuthed ? null : children;
}

/* ----------------------------- DİL AYARLARI ----------------------------- */
const SUPPORTED = ["tr", "en", "ar", "de"];
const LOCALE_LABEL = { tr: "Türkçe", en: "English", ar: "العربية", de: "Deutsch" };

const STR = {
  tr: {
    brand: "Üreten Eller",
    heroTitle: "Üreten Ellere Hoş Geldiniz",
    sellerPortal: "Üreten El Portalı",
    customerPortal: "Müşteri Portalı",
    needAuth: "Önce kayıt olmalısınız.",
    categories: "Kategorilerimiz",
    listings: "Son 20 İlan",
    view: "İncele",
    loginToView: "İlanı görmek için giriş yapın veya kaydolun.",
    noAds: "Henüz ilan yok.",
    legalBarTitle: "Kurumsal",
    legal: {
      corporate: "Kurumsal",
      about: "Hakkımızda",
      contact: "İletişim",
      privacy: "Gizlilik",
      kvkk: "KVKK Aydınlatma",
      privacyTerms: "Gizlilik & Kullanım",
      terms: "Kullanım Şartları",
      distance: "Mesafeli Satış",
      shippingReturn: "Teslimat & İade",
      cookies: "Çerez Politikası",
      help: "Topluluk Kuralları",
      banned: "Yasaklı Ürünler",
      all: "Tüm Legal",
      home: "Ana Sayfa",
      copyright: "© 2025 Üreten Eller",
      open: "Aç",
      close: "Kapat",
    },
  },
  en: {
    brand: "Ureten Eller",
    heroTitle: "Welcome to Ureten Eller",
    sellerPortal: "Maker Portal",
    customerPortal: "Customer Portal",
    needAuth: "Please sign up first.",
    categories: "Our Categories",
    listings: "Latest 20 Listings",
    view: "View",
    loginToView: "Please sign in or sign up to view the listing.",
    noAds: "No listings yet.",
    legalBarTitle: "Corporate",
    legal: {
      corporate: "Corporate",
      about: "About Us",
      contact: "Contact",
      privacy: "Privacy",
      kvkk: "KVKK Notice",
      privacyTerms: "Privacy & Terms",
      terms: "Terms of Use",
      distance: "Distance Sales",
      shippingReturn: "Shipping & Returns",
      cookies: "Cookie Policy",
      help: "Community Rules",
      banned: "Prohibited Products",
      all: "All Legal",
      home: "Home",
      copyright: "© 2025 Ureten Eller",
      open: "Open",
      close: "Close",
    },
  },
  ar: {
    brand: "أُنتِج بالأيادي",
    heroTitle: "مرحبًا بكم في منصتنا",
    sellerPortal: "بوابة المُنتِجات",
    customerPortal: "بوابة العملاء",
    needAuth: "يرجى التسجيل أولًا.",
    categories: "تصنيفاتنا",
    listings: "آخر 20 إعلان",
    view: "عرض",
    loginToView: "سجّل الدخول أو أنشئ حسابًا لعرض الإعلان.",
    noAds: "لا توجد إعلانات بعد.",
    legalBarTitle: "المعلومات المؤسسية",
    legal: {
      corporate: "المؤسسة",
      about: "من نحن",
      contact: "اتصال",
      privacy: "الخصوصية",
      kvkk: "إشعار KVKK",
      privacyTerms: "الخصوصية والشروط",
      terms: "شروط الاستخدام",
      distance: "البيع عن بُعد",
      shippingReturn: "الشحن والإرجاع",
      cookies: "سياسة ملفات تعريف الارتباط",
      help: "قواعد المجتمع",
      banned: "المنتجات المحظورة",
      all: "كل السياسات",
      home: "الصفحة الرئيسية",
      copyright: "© 2025 Üreten Eller",
      open: "فتح",
      close: "إغلاق",
    },
  },
  de: {
    brand: "Ureten Eller",
    heroTitle: "Willkommen bei Ureten Eller",
    sellerPortal: "Portal für Anbieterinnen",
    customerPortal: "Kundenportal",
    needAuth: "Bitte zuerst registrieren.",
    categories: "Unsere Kategorien",
    listings: "Neueste 20 Inserate",
    view: "Ansehen",
    loginToView: "Bitte anmelden oder registrieren, um das Inserat zu sehen.",
    noAds: "Noch keine Inserate.",
    legalBarTitle: "Unternehmen",
    legal: {
      corporate: "Unternehmen",
      about: "Über uns",
      contact: "Kontakt",
      privacy: "Datenschutz",
      kvkk: "KVKK-Hinweis",
      privacyTerms: "Datenschutz & AGB",
      terms: "Nutzungsbedingungen",
      distance: "Fernabsatz",
      shippingReturn: "Lieferung & Rückgabe",
      cookies: "Cookie-Richtlinie",
      help: "Community-Regeln",
      banned: "Verbotene Produkte",
      all: "Alle Rechtliches",
      home: "Startseite",
      copyright: "© 2025 Ureten Eller",
      open: "Öffnen",
      close: "Schließen",
    },
  },
};

/* ----------------------------- 20+ MOTTO (RENKLİ) ----------------------------- */
const PHRASES = {
  tr: [
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
  ],
  en: [
    { text: "Our aim: support household budgets of women.", color: "#e11d48" },
    { text: "Women’s labor should be valued.", color: "#c026d3" },
    { text: "Handmade products at fair prices.", color: "#7c3aed" },
    { text: "Neighborhood flavors to your door.", color: "#2563eb" },
    { text: "Fresh production from skilled hands.", color: "#0ea5e9" },
    { text: "Platform protection on every order.", color: "#14b8a6" },
    { text: "Big support for small producers.", color: "#059669" },
    { text: "Transparent pricing, clear delivery.", color: "#16a34a" },
    { text: "Secure payments, easy returns.", color: "#65a30d" },
    { text: "Buy local, boost the economy.", color: "#ca8a04" },
    { text: "Fair reward for labor, savings for customers.", color: "#d97706" },
    { text: "Homemade tastes, handcrafted beauty.", color: "#ea580c" },
    { text: "Careful production across categories.", color: "#f97316" },
    { text: "Seamless tracking from order to delivery.", color: "#f59e0b" },
    { text: "Trusted seller badges.", color: "#eab308" },
    { text: "Stronger together as a community.", color: "#84cc16" },
    { text: "Support sustainable production.", color: "#22c55e" },
    { text: "Fair trade, happy customers.", color: "#10b981" },
    { text: "Respect for craft, budget-friendly prices.", color: "#06b6d4" },
    { text: "We grow with women’s work.", color: "#3b82f6" },
    { text: "Fresh from your city, shop with confidence.", color: "#6366f1" },
    { text: "Quality, care and transparency.", color: "#8b5cf6" },
    { text: "The handmade you need is here.", color: "#d946ef" },
    { text: "Good price, safe process, happy ending.", color: "#ec4899" },
  ],
  ar: [
    { text: "هدفنا: دعم ميزانية ربّات البيوت.", color: "#e11d48" },
    { text: "قيمة عمل المرأة يجب أن تُكرَّم.", color: "#c026d3" },
    { text: "منتجات يدوية بأسعار عادلة.", color: "#7c3aed" },
    { text: "نَكهات الحي إلى بابك.", color: "#2563eb" },
    { text: "إنتاج طازج بأيادٍ ماهرة.", color: "#0ea5e9" },
    { text: "حماية المنصّة مع كل طلب.", color: "#14b8a6" },
    { text: "دعم كبير للمنتِجات الصُغرى.", color: "#059669" },
    { text: "أسعار شفافة وتسليم واضح.", color: "#16a34a" },
    { text: "دفع آمن وإرجاع سهل.", color: "#65a30d" },
    { text: "اشترِ محليًا وادعم الاقتصاد.", color: "#ca8a04" },
    { text: "أجر عادل للعمل وتوفير للعميل.", color: "#d97706" },
    { text: "مذاقات منزلية وجمال مصنوع يدويًا.", color: "#ea580c" },
    { text: "عناية في كل فئة إنتاج.", color: "#f97316" },
    { text: "تتبع سلس من الطلب حتى التسليم.", color: "#f59e0b" },
    { text: "شارات بائعات موثوقات.", color: "#eab308" },
    { text: "نقوى معًا كمجتمع.", color: "#84cc16" },
    { text: "ندعم الإنتاج المستدام.", color: "#22c55e" },
    { text: "تجارة عادلة وزبائن سعداء.", color: "#10b981" },
    { text: "احترام للحِرفة وأسعار مناسبة.", color: "#06b6d4" },
    { text: "ننمو بعمل النساء.", color: "#3b82f6" },
    { text: "طازج من مدينتك وتسوق بثقة.", color: "#6366f1" },
    { text: "جودة وعناية وشفافية.", color: "#8b5cf6" },
    { text: "كل ما تحتاجه من أعمال يدوية هنا.", color: "#d946ef" },
    { text: "سعر جيد، عملية آمنة، نهاية سعيدة.", color: "#ec4899" },
  ],
  de: [
    { text: "Ziel: Haushaltsbudgets von Frauen stärken.", color: "#e11d48" },
    { text: "Frauenarbeit soll wertgeschätzt werden.", color: "#c026d3" },
    { text: "Handgemachtes zum fairen Preis.", color: "#7c3aed" },
    { text: "Nachbarschafts-Geschmack bis vor die Tür.", color: "#2563eb" },
    { text: "Frische Produktion aus geübten Händen.", color: "#0ea5e9" },
    { text: "Plattformschutz bei jeder Bestellung.", color: "#14b8a6" },
    { text: "Große Unterstützung für kleine Anbieterinnen.", color: "#059669" },
    { text: "Transparente Preise, klare Lieferung.", color: "#16a34a" },
    { text: "Sichere Zahlung, einfache Rückgabe.", color: "#65a30d" },
    { text: "Kauf lokal – stärke die Wirtschaft.", color: "#ca8a04" },
    { text: "Faire Entlohnung, glückliche Kund:innen.", color: "#d97706" },
    { text: "Hausgemachter Geschmack, liebevolle Handarbeit.", color: "#ea580c" },
    { text: "Sorgfalt in jeder Kategorie.", color: "#f97316" },
    { text: "Nahtloses Tracking von Bestellung bis Lieferung.", color: "#f59e0b" },
    { text: "Vertrauens-Abzeichen für Anbieterinnen.", color: "#eab308" },
    { text: "Gemeinsam als Community stärker.", color: "#84cc16" },
    { text: "Unterstütze nachhaltige Produktion.", color: "#22c55e" },
    { text: "Fairer Handel, glückliche Kund:innen.", color: "#10b981" },
    { text: "Respekt für Handwerk, faire Preise.", color: "#06b6d4" },
    { text: "Wir wachsen mit Frauenarbeit.", color: "#3b82f6" },
    { text: "Frisch aus deiner Stadt – sicher einkaufen.", color: "#6366f1" },
    { text: "Qualität, Sorgfalt und Transparenz.", color: "#8b5cf6" },
    { text: "Das Handgemachte, das du brauchst – hier.", color: "#d946ef" },
    { text: "Guter Preis, sicherer Ablauf, gutes Ende.", color: "#ec4899" },
  ],
};

/* ----------------------------- KATEGORİLER ----------------------------- */
const CATS = {
  tr: [
    { icon: "🍲", title: "Yemekler", subs: ["Ev yemekleri", "Börek-çörek", "Çorba", "Zeytinyağlı", "Pilav-makarna", "Et-tavuk", "Kahvaltılık", "Meze", "Dondurulmuş", "Çocuk öğünleri", "Diyet/vegan/gf"] },
    { icon: "🎂", title: "Pasta & Tatlı", subs: ["Yaş pasta", "Kek-cupcake", "Kurabiye", "Şerbetli", "Sütlü", "Cheesecake", "Diyet tatlı", "Çikolata/şekerleme", "Doğum günü setleri"] },
    { icon: "🫙", title: "Reçel • Turşu • Sos", subs: ["Reçel-marmelat", "Pekmez", "Turşu", "Domates/biber sos", "Acı sos", "Salça", "Sirke", "Konserve"] },
    { icon: "🌾", title: "Yöresel / Kışlık", subs: ["Erişte", "Tarhana", "Yufka", "Mantı", "Kurutulmuş sebze-meyve", "Salça", "Sirke", "Konserve"] },
    { icon: "🥗", title: "Diyet / Vegan / Glutensiz", subs: ["Fit tabaklar", "Vegan yemekler", "GF unlu mamuller", "Şekersiz tatlı", "Keto ürün", "Protein atıştırmalık"] },
    { icon: "💍", title: "Takı", subs: ["Bileklik", "Kolye", "Küpe", "Yüzük", "Halhal", "Broş", "Setler", "İsimli/kişiye özel", "Makrome", "Doğal taş", "Reçine", "Tel sarma"] },
    { icon: "👶", title: "Bebek & Çocuk", subs: ["Hayvan/bebek figürleri", "Çıngırak", "Diş kaşıyıcı örgü", "Bez oyuncak/kitap", "Montessori oyuncak", "Setler", "Örgü patik-bere", "Bebek battaniyesi", "Önlük-ağız bezi", "Lohusa seti", "Saç aksesuarı", "El emeği kıyafet"] },
    /* ↓↓↓ Örgü/Triko: 'Lif takımı' eklendi ↓↓↓ */
    { icon: "🧶", title: "Örgü / Triko", subs: ["Hırka", "Kazak", "Atkı-bere", "Panço", "Şal", "Çorap", "Lif takımı", "Bebek takımı", "Yelek", "Kırlent-örtü"] },
    { icon: "✂️", title: "Dikiş / Terzilik", subs: ["Paça/onarım", "Fermuar değişimi", "Perde dikişi", "Nevresim-yastık", "Masa örtüsü", "Özel dikim", "Kostüm"] },
    { icon: "🧵", title: "Makrome & Dekor", subs: ["Duvar süsü", "Saksı askısı", "Anahtarlık", "Avize", "Amerikan servis/runner", "Sepet", "Raf/duvar dekoru"] },
    { icon: "🏠", title: "Ev Dekor & Aksesuar", subs: ["Keçe işleri", "Kırlent", "Kapı süsü", "Tepsi süsleme", "Çerçeve", "Rüya kapanı", "Tablo"] },
    { icon: "🕯️", title: "Mum & Kokulu Ürünler", subs: ["Soya/balmumu mum", "Kokulu taş", "Oda spreyi", "Tütsü", "Jel mum", "Hediye seti"] },
    { icon: "🧼", title: "Doğal Sabun & Kozmetik", subs: ["Zeytinyağlı sabun", "Bitkisel sabunlar", "Katı şampuan", "Dudak balmı", "Krem/merhem", "Banyo tuzu", "Lavanta kesesi"] },
    { icon: "🧸", title: "Amigurumi & Oyuncak (dekoratif)", subs: ["Anahtarlık", "Magnet", "Koleksiyon figürü", "Dekor bebek/karakter", "İsimli amigurumi"] },
  ],
  en: [
    { icon: "🍲", title: "Meals", subs: ["Home meals", "Savory bakes", "Soup", "Olive oil dishes", "Rice-pasta", "Meat-chicken", "Breakfast", "Meze", "Frozen", "Kids meals", "Diet/vegan/gf"] },
    { icon: "🎂", title: "Cakes & Sweets", subs: ["Layer cake", "Cupcake", "Cookies", "Syrupy", "Milk desserts", "Cheesecake", "Diet sweets", "Chocolate/candy", "Birthday sets"] },
    { icon: "🫙", title: "Jam • Pickle • Sauce", subs: ["Jam-marmalade", "Molasses", "Pickles", "Tomato/pepper sauce", "Hot sauce", "Paste", "Vinegar", "Canned"] },
    { icon: "🌾", title: "Regional / Winter Prep", subs: ["Noodles", "Tarhana", "Yufka", "Manti", "Dried veg/fruit", "Paste", "Vinegar", "Canned"] },
    { icon: "🥗", title: "Diet / Vegan / Gluten-free", subs: ["Fit bowls", "Vegan meals", "GF bakery", "Sugar-free desserts", "Keto items", "Protein snacks"] },
    { icon: "💍", title: "Jewelry", subs: ["Bracelet", "Necklace", "Earrings", "Ring", "Anklet", "Brooch", "Sets", "Personalized", "Macrame", "Gemstones", "Resin", "Wire wrap"] },
    { icon: "👶", title: "Baby & Kids", subs: ["Animal/baby figures", "Rattle", "Knit teether", "Cloth toy/book", "Montessori toy", "Sets", "Knit booties-hats", "Baby blanket", "Bib/burp cloth", "Maternity set", "Hair accessory", "Handmade wear"] },
    { icon: "🧶", title: "Knitwear", subs: ["Cardigan", "Sweater", "Scarf-hat", "Poncho", "Shawl", "Socks", "Baby set", "Vest", "Pillow/cover"] },
    { icon: "✂️", title: "Sewing / Tailor", subs: ["Hemming/repair", "Zipper change", "Curtains", "Bedding", "Tablecloth", "Custom sew", "Costume"] },
    { icon: "🧵", title: "Macrame & Decor", subs: ["Wall hanging", "Plant hanger", "Keychain", "Pendant lamp", "Table runner", "Basket", "Shelf/decor"] },
    { icon: "🏠", title: "Home Decor & Accessories", subs: ["Felt crafts", "Pillow", "Door wreath", "Tray decor", "Frame", "Dreamcatcher", "Painting"] },
    { icon: "🕯️", title: "Candles & Scents", subs: ["Soy/beeswax candles", "Aroma stone", "Room spray", "Incense", "Gel candle", "Gift sets"] },
    { icon: "🧼", title: "Natural Soap & Cosmetics", subs: ["Olive oil soap", "Herbal soaps", "Solid shampoo", "Lip balm", "Cream/salve", "Bath salt", "Lavender sachet"] },
    { icon: "🧸", title: "Amigurumi & Toys (decor)", subs: ["Keychain", "Magnet", "Collectible figure", "Decor doll/character", "Named amigurumi"] },
  ],
  ar: [
    { icon: "🍲", title: "وجبات", subs: ["بيتي", "معجنات مالحة", "شوربة", "أكلات بزيت الزيتون", "أرز/معكرونة", "لحم/دجاج", "فطور", "مقبلات", "مجمدة", "وجبات أطفال", "نباتي/خالٍ من الغلوتين"] },
    { icon: "🎂", title: "كعك وحلويات", subs: ["كيك طبقات", "كب كيك", "بسكويت", "حلويات بالقطر", "حلويات ألبان", "تشيز كيك", "دايت", "شوكولاتة/حلوى", "طقم عيد ميلاد"] },
    { icon: "🫙", title: "مربى • مخلل • صوص", subs: ["مربى", "دبس", "مخللات", "صلصة طماطم/فلفل", "حار", "معجون", "خل", "معلبات"] },
    { icon: "🌾", title: "تراثي / مؤونة الشتاء", subs: ["مكرونة منزلية", "طرحنة", "يوفكا", "مانطي", "مجففات", "معجون", "خل", "معلبات"] },
    { icon: "🥗", title: "حمية / نباتي / خالٍ من الغلوتين", subs: ["أطباق صحية", "نباتي", "مخبوزات GF", "حلويات بدون سكر", "كيتو", "سناك بروتين"] },
    { icon: "💍", title: "إكسسوارات", subs: ["أساور", "قلائد", "أقراط", "خواتم", "خلخال", "بروش", "أطقم", "مخصص بالاسم", "ماكرامه", "أحجار", "ريزن", "سلك"] },
    { icon: "👶", title: "رضع وأطفال", subs: ["مجسّمات", "خشخيشة", "عضّاضة تريكو", "لعبة/كتاب قماشي", "مونتيسوري", "أطقم", "حذاء/قبعة تريكو", "بطانية", "مريلة", "طقم نفاس", "اكسسوار شعر", "ملابس يدوية"] },
    { icon: "🧶", title: "تريكو", subs: ["جاكيت", "بلوز", "وشاح/قبعة", "بونشو", "شال", "جوارب", "طقم أطفال", "صديري", "وسادة/غطاء"] },
    { icon: "✂️", title: "خياطة/تفصيل", subs: ["تقصير/تصليح", "تغيير سحاب", "ستائر", "مفارش سرير", "مفرش طاولة", "تفصيل خاص", "ملابس تنكرية"] },
    { icon: "🧵", title: "ماكرامه وديكور", subs: ["تعليقة حائط", "حامل نبات", "ميدالية", "إضاءة معلّقة", "مفرش", "سلة", "رف/ديكور"] },
    { icon: "🏠", title: "ديكور المنزل", subs: ["فيلت", "وسادة", "زينة باب", "صينية مزخرفة", "إطار", "صائد أحلام", "لوحة"] },
    { icon: "🕯️", title: "شموع وروائح", subs: ["شموع صويا/نحل", "حجر عطري", "معطر غرف", "بخور", "شمعة جل", "أطقم هدايا"] },
    { icon: "🧼", title: "صابون طبيعي وتجميلي", subs: ["صابون زيت زيتون", "أعشاب", "شامبو صلب", "بلسم شفاه", "كريم/مرهم", "ملح حمام"] },
    { icon: "🧸", title: "أميجورومي وألعاب (ديكور)", subs: ["ميدالية", "مغناطيس", "فيجور", "دمية ديكور", "أميجورومي بالاسم"] },
  ],
  de: [
    { icon: "🍲", title: "Speisen", subs: ["Hausmannskost", "Herzhafte Backwaren", "Suppe", "Olivenölgerichte", "Reis/Pasta", "Fleisch/Hähnchen", "Frühstück", "Meze", "Tiefgekühlt", "Kindermahlzeiten", "Diät/Vegan/GF"] },
    { icon: "🎂", title: "Torten & Süßes", subs: ["Sahnetorte", "Cupcake", "Kekse", "Sirupgebäck", "Milchdesserts", "Käsekuchen", "Diät-Desserts", "Schoko/Bonbon", "Geburtstags-Sets"] },
    { icon: "🫙", title: "Marmelade • Pickles • Soßen", subs: ["Marmelade", "Melasse", "Eingelegtes", "Tomaten/Pfeffersoße", "Scharfsoße", "Paste", "Essig", "Eingewecktes"] },
    { icon: "🌾", title: "Regional / Wintervorrat", subs: ["Hausgem. Nudeln", "Tarhana", "Yufka", "Manti", "Getrocknetes", "Paste", "Essig", "Vorrat"] },
    { icon: "🥗", title: "Diät / Vegan / Glutenfrei", subs: ["Fit Bowls", "Vegan", "GF-Bäckerei", "Zuckerfrei", "Keto", "Protein-Snacks"] },
    { icon: "💍", title: "Schmuck", subs: ["Armband", "Kette", "Ohrringe", "Ring", "Fußkettchen", "Brosche", "Sets", "Personalisiert", "Makramee", "Edelsteine", "Harz", "Draht"] },
    { icon: "👶", title: "Baby & Kinder", subs: ["Figuren", "Rassel", "Beißring Strick", "Stoffspielzeug/Buch", "Montessori", "Sets", "Schühchen/Mützen", "Babydecke", "Lätzchen", "Wochenbett-Set", "Haar-Accessoire", "Handgemachte Kleidung"] },
    { icon: "🧶", title: "Strickwaren", subs: ["Cardigan", "Pullover", "Schal/Mütze", "Poncho", "Tuch", "Socken", "Baby-Set", "Weste", "Kissen/Decke"] },
    { icon: "✂️", title: "Nähen / Schneiderei", subs: ["Saum/Reparatur", "Reißverschluss", "Gardinen", "Bettwäsche", "Tischdecke", "Maßanfertigung", "Kostüm"] },
    { icon: "🧵", title: "Makramee & Deko", subs: ["Wandbehang", "Pflanzenhänger", "Schlüsselanh.", "Pendelleuchte", "Läufer", "Korb", "Regal/Deko"] },
    { icon: "🏠", title: "Wohndeko & Accessoires", subs: ["Filzarbeiten", "Kissen", "Türkranz", "Tablettdeko", "Rahmen", "Traumfänger", "Bild"] },
    { icon: "🕯️", title: "Kerzen & Düfte", subs: ["Soja/Bienenwachs", "Duftstein", "Raumspray", "Weihrauch", "Gelkerze", "Geschenksets"] },
    { icon: "🧼", title: "Naturseife & Kosmetik", subs: ["Olivenölseife", "Kräuterseifen", "Festes Shampoo", "Lippenbalsam", "Creme/Salbe", "Badesalz", "Lavendelsäckchen"] },
    { icon: "🧸", title: "Amigurumi & Spielzeug (Deko)", subs: ["Schlüsselanh.", "Magnet", "Sammelfigur", "Deko-Puppe", "Amigurumi mit Name"] },
  ],
};

/* ----------------------------- DİL KANCASI ----------------------------- */
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
  const t = useMemo(() => STR[lang] || STR.tr, [lang]);
  return { lang, setLang, t };
}

/* ----------------------------- LEGAL İÇERİK (başlıklar, gövdesiz) ----------------------------- */
function useLegal(lang) {
  const S = STR[lang]?.legal || STR.tr.legal;
  return {
    corporate: { title: S.corporate, body: "" },
    about: { title: S.about, body: "" },
    contact: { title: S.contact, body: "" },
    privacy: { title: S.privacy, body: "" },
    kvkk: { title: S.kvkk, body: "" },
    privacyTerms: { title: S.privacyTerms, body: "" },
    terms: { title: S.terms, body: "" },
    distance: { title: S.distance, body: "" },
    shippingReturn: { title: S.shippingReturn, body: "" },
    cookies: { title: S.cookies, body: "" },
    help: { title: S.help, body: "" },
    banned: { title: S.banned, body: "" },
    all: { title: S.all, body: "" },
  };
}

/* ----------------------------- SAYFA ----------------------------- */
export default function Home() {
  const { lang, setLang, t } = useLang();

  /* Firebase Auth state → isAuthed ve localStorage eşitleme */
  const [isAuthed, setIsAuthed] = useState(false);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      const authed = !!user;
      setIsAuthed(authed);
      if (authed) localStorage.setItem("authed", "1");
      else localStorage.removeItem("authed");
    });
    return () => unsub();
  }, []);

  // Motto metni 5 sn'de bir değişsin
  const phrases = useMemo(() => PHRASES[lang] || PHRASES.tr, [lang]);
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % Math.max(1, phrases.length)), 5000);
    return () => clearInterval(id);
  }, [phrases.length]);
  const current = phrases.length ? phrases[i % phrases.length] : { text: "" };

  // KOYU renk paleti (5 sn'de bir)
  const DARKS = ["#111827", "#4b2e2b", "#7f1d1d", "#065f46"];
  const [di, setDi] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setDi((x) => (x + 1) % DARKS.length), 5000);
    return () => clearInterval(id);
  }, []);
  const accent = DARKS[di];

  // İlanlar
  const [ads, setAds] = useState([]);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/ads/public?limit=20", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (alive) setAds(Array.isArray(data) ? data.slice(0, 20) : []);
          return;
        }
      } catch {}
      try {
        const local = JSON.parse(localStorage.getItem("ads") || "[]");
        if (alive) setAds(Array.isArray(local) ? local.slice(0, 20) : []);
      } catch {}
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Kategoriler
  const cats = CATS[lang] || CATS.tr;

  // Tüm kartlar için ortak arka plan
  const CAT_GRADS = [
    "linear-gradient(135deg, #ff80ab, #ffd166)",
    "linear-gradient(135deg, #a78bfa, #60a5fa)",
    "linear-gradient(135deg, #34d399, #a7f3d0)",
    "linear-gradient(135deg, #f59e0b, #f97316)",
    "linear-gradient(135deg, #06b6d4, #3b82f6)",
  ];
  const [ci, setCi] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setCi((x) => (x + 1) % CAT_GRADS.length), 5000);
    return () => clearInterval(id);
  }, []);
  const catBg = CAT_GRADS[ci];

  const LEGAL_LABELS = STR[lang]?.legal || STR.tr.legal;
  useLegal(lang);

  const go = (href) => {
    window.location.href = href;
  };
  const needAuth = (role) => {
    window.location.href = `/login?role=${role}`;
  };

  return (
    <AuthCtx.Provider value={isAuthed}>
      <main className="wrap">
        {/* Dil seçimi */}
        <div className="langbox">
          <select aria-label="Language" value={lang} onChange={(e) => setLang(e.target.value)}>
            {SUPPORTED.map((k) => (
              <option key={k} value={k}>
                {LOCALE_LABEL[k]}
              </option>
            ))}
          </select>
        </div>

        {/* HERO */}
        <section className="hero" style={{ "--accent": accent }}>
          <img src="/logo.png" alt={t.brand} width="96" height="96" className="logo" />
          <h1 className="title">{t.brand}</h1>
          <h2 className="subtitle">{t.heroTitle}</h2>
          <p key={i} className="lead phrase">
            {current.text}
          </p>
          <div className="ctaRow">
            <SignedOut>
              <button className="btnPrimary" onClick={() => needAuth("seller")}>
                {t.sellerPortal}
              </button>
              <button className="btnGhost" onClick={() => needAuth("customer")}>
                {t.customerPortal}
              </button>
            </SignedOut>
            <SignedIn>
              <button className="btnPrimary" onClick={() => go("/portal/seller")}>
                {t.sellerPortal}
              </button>
              <button className="btnGhost" onClick={() => go("/portal/customer")}>
                {t.customerPortal}
              </button>
            </SignedIn>
          </div>
        </section>

        {/* İlanlar */}
        <section className="adsSection">
          <h3>{t.listings}</h3>
          <div className="adsGrid">
            {ads.length === 0 ? (
              <div className="adCard">
                <div className="adBody empty">{t.noAds}</div>
              </div>
            ) : (
              ads.map((a, idx) => {
                const imgStyle = a?.img
                  ? { backgroundImage: `url(${a.img})`, backgroundSize: "cover", backgroundPosition: "center" }
                  : undefined;
                const title = a?.title || "İlan";
                const cat = a?.cat || a?.category || "";
                const price = a?.price || "";
                const url = a?.url || `/ads/${a?.slug || a?.id || ""}`;
                return (
                  <div className="adCard" key={idx}>
                    <div className="adThumb" style={imgStyle} />
                    <div className="adBody">
                      <h4 className="adTitle">{title}</h4>
                      <div className="adMeta">
                        <span>{cat}</span>
                        <b>{price}</b>
                      </div>
                    </div>
                    <div className="adActions">
                      <SignedOut>
                        <button
                          className="viewBtn"
                          onClick={() => {
                            alert(t.loginToView);
                            needAuth("customer");
                          }}
                        >
                          {t.view}
                        </button>
                      </SignedOut>
                      <SignedIn>
                        <button className="viewBtn" onClick={() => go(url)}>
                          {t.view}
                        </button>
                      </SignedIn>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Kategoriler — kartlar tıklanmaz, başlıkla alt kategoriler yakın; altlar tam görünür */}
        <section className="cats">
          <h3>{t.categories}</h3>
          <div className="grid">
            {cats.map((c, idx) => (
              <article key={idx} className="card" style={{ backgroundImage: catBg }}>
                <div className="cardHead centered">
                  <span className="icon" aria-hidden>
                    {c.icon}
                  </span>
                  <h4>{c.title}</h4>
                  <span className="count">{c.subs.length}</span>
                </div>
                <div className="subsWrap">
                  <div className="subsGrid">
                    {c.subs.map((s, k) => (
                      <span key={k} className="chip">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* STYLES (footer dışarıda ama CSS buradan uygulanır) */}
        <style>{`
          :root { --ink:#0f172a; --muted:#475569; --paperA:rgba(255,255,255,.92); --lineA:rgba(0,0,0,.08); }
          html, body { height:100%; }
          body { 
            margin:0; color:var(--ink); font-family: system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial, sans-serif;
            background: linear-gradient(120deg, #ff80ab, #a78bfa, #60a5fa, #34d399);
            background-attachment: fixed;
            display:flex; flex-direction:column; min-height:100vh; 
            overflow-x:hidden; /* full-bleed footer taşma yapmasın */
          }

          .wrap { max-width:1120px; margin:0 auto; padding:24px 20px 0; display:flex; flex-direction:column; flex:1; }

          /* Dil seçimi */
          .langbox { position:fixed; top:12px; right:12px; z-index:50; background:rgba(255,255,255,.95); border:1px solid #e5e7eb; border-radius:12px; padding:6px 10px; backdrop-filter: blur(8px); display:flex; gap:8px; align-items:center; }
          .langbox select { border:none; background:transparent; font-weight:600; cursor:pointer; }

          /* HERO */
          .hero { display:grid; place-items:center; text-align:center; gap:8px; padding:72px 0 12px; }
          .logo { filter: drop-shadow(0 10px 24px rgba(0,0,0,.18)); border-radius:20px; }
          .title { margin:8px 0 0; font-size:48px; color: var(--accent); transition: color .3s ease; }
          .subtitle { margin:0; font-size:22px; color: var(--accent); transition: color .3s ease; }
          .lead { max-width:820px; margin:4px auto 0; font-size:18px; color: var(--accent); transition: color .3s ease; }
          .ctaRow { display:flex; gap:12px; flex-wrap:wrap; justify-content:center; margin-top:10px; }
          .btnPrimary { padding:12px 18px; border-radius:999px; border:none; cursor:pointer; background:#111827; color:#fff; font-weight:600; box-shadow:0 8px 24px rgba(0,0,0,.15); }
          .btnGhost { padding:12px 18px; border-radius:999px; cursor:pointer; font-weight:600; background: var(--paperA); border:1px solid var(--lineA); color:#111827; backdrop-filter: blur(8px); }
          @media (max-width:520px){ .title{font-size:36px} .subtitle{font-size:20px} }

          /* İLANLAR */
          .adsSection h3 { font-size:22px; margin:20px 0 12px; text-align:center; }
          .adsGrid { display:grid; gap:16px; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }
          .adCard { background:#fff; border:1px solid #e5e7eb; border-radius:16px; overflow:hidden; display:flex; flex-direction:column; box-shadow:0 6px 18px rgba(0,0,0,.06); }
          .adThumb { width:100%; aspect-ratio: 4/3; background:#f1f5f9; }
          .adBody { padding:10px; }
          .adBody.empty { text-align:center; color:#475569; font-weight:600; padding:18px; }
          .adTitle { margin:0 0 6px; font-weight:700; font-size:15px; line-height:1.35; color:#0f172a; }
          .adMeta { display:flex; justify-content:space-between; align-items:center; color:#475569; font-size:13px; }
          .adActions { padding:0 10px 12px; }
          .viewBtn { width:100%; padding:10px 12px; border-radius:10px; border:1px solid #111827; background:#111827; color:#fff; font-weight:700; cursor:pointer; }

          /* KATEGORİLER – başlığın hemen altında alt kategoriler, metinler TAM (kesme yok) */
          .cats h3 { font-size:22px; margin:22px 0 12px; text-align:center; }
          .grid { display:grid; gap:16px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }

          .card { border-radius:18px; padding:14px; background: var(--paperA); background-size: cover; background-position:center; border:1px solid var(--lineA);
                  box-shadow:0 10px 24px rgba(0,0,0,.08); aspect-ratio:1/1; display:flex; flex-direction:column; cursor:default; }

          .cardHead { display:grid; grid-template-columns: 1fr auto 1fr; align-items:center; gap:6px; margin-bottom:4px; }
          .cardHead.centered { justify-items:center; }
          .icon { font-size:26px; grid-column:1/2; }
          .cardHead h4 { margin:0; font-size:19px; grid-column:2/3; text-align:center; }
          .count { grid-column:3/4; justify-self:end; background:#ffffffc0; border:1px solid #e5e7eb; font-size:12px; border-radius:999px; padding:2px 8px; }

          /* ALT KATEGORİLER: başlığın HEMEN altında, kesmeden çok satırlı */
          .subsWrap { flex:1; min-height:0; }
          .subsGrid {
            height:100%;
            overflow:auto;
            display:grid;
            gap:8px;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            padding-top:4px; /* yakın */
          }
          .chip {
            display:block;
            text-align:center;
            padding:8px 10px;
            border-radius:12px;
            font-size:12px;
            background: rgba(255,255,255,0.98);
            border:1px solid #e5e7eb;
            white-space: normal;
            overflow: visible;
            text-overflow: clip;
            word-break: break-word;
            hyphens: auto;
            line-height: 1.25;
          }
          @media (max-width:520px){
            .subsGrid { grid-template-columns: repeat(2, minmax(0,1fr)); }
          }
        `}</style>
      </main>

      {/* FOOTER — full-bleed, sayfanın en altı */}
      <footer className="legalFooter" role="contentinfo">
        <div className="legalWrap">
          <div className="legalTitle">{(STR[lang] || STR.tr).legalBarTitle}</div>
          <nav className="legalLinks" aria-label={(STR[lang] || STR.tr).legalBarTitle}>
            <a href="/legal/kurumsal">{LEGAL_LABELS.corporate}</a>
            <a href="/legal/hakkimizda">{LEGAL_LABELS.about}</a>
            <a href="/legal/iletisim">{LEGAL_LABELS.contact}</a>
            <a href="/legal/gizlilik">{LEGAL_LABELS.privacy}</a>
            <a href="/legal/kvkk-aydinlatma">{LEGAL_LABELS.kvkk}</a>
            <a href="/legal/kullanim-sartlari">{LEGAL_LABELS.terms}</a>
            <a href="/legal/mesafeli-satis-sozlesmesi">{LEGAL_LABELS.distance}</a>
            <a href="/legal/teslimat-iade">{LEGAL_LABELS.shippingReturn}</a>
            <a href="/legal/cerez-politikasi">{LEGAL_LABELS.cookies}</a>
            <a href="/legal/topluluk-kurallari">{LEGAL_LABELS.help}</a>
            <a href="/legal/yasakli-urunler">{LEGAL_LABELS.banned}</a>
            <a href="/legal" className="homeLink">{LEGAL_LABELS.all}</a>
          </nav>
          <div className="copy">{LEGAL_LABELS.copyright}</div>
        </div>

        <style>{`
          .legalFooter { 
            background:#0b0b0b; color:#f8fafc; border-top:1px solid rgba(255,255,255,.12);
            width:100vw; 
            margin-left:calc(50% - 50vw); 
            margin-right:calc(50% - 50vw);
          }
          .legalWrap { max-width:none; padding:10px 12px 12px; }
          .legalTitle { font-weight:700; font-size:14px; margin-bottom:6px; }
          .legalLinks { display:flex; flex-wrap:wrap; gap:10px; }
          .legalLinks > * { color:#e2e8f0; font-size:13px; padding:6px 8px; border-radius:8px; text-decoration:none; }
          .legalLinks > *:hover { background: rgba(255,255,255,.08); color:#fff; }
          .homeLink { margin-left:auto; font-weight:700; }
          .copy { margin-top:6px; font-size:12px; color:#cbd5e1; }
          html[dir="rtl"] .homeLink { margin-left:0; margin-right:auto; }
        `}</style>
      </footer>
    </AuthCtx.Provider>
  );
}
