// pages/portal/customer/index.jsx
"use client";
import React, { useEffect, useMemo, useState, useRef } from "react";
import Head from "next/head";

/* ----------------------------- Dil / Çeviriler ----------------------------- */
const SUPPORTED = ["tr", "en", "ar", "de"];
const LOCALE_LABEL = { tr: "TR", en: "EN", ar: "AR", de: "DE" };

const LBL = {
  tr: {
    brand: "Üreten Eller",
    welcome: "Üreten Ellere Hoş Geldiniz",
    showcase: "Vitrin",
    standard: "Standart İlanlar",
    categories: "Kategorilerimiz",
    view: "İncele",
    empty: "Henüz ilan yok.",
    findListing: "İlan Ara",
    profile: "Profil",
    logout: "Çıkış",
    home: "Ana Sayfa",
    messages: "Mesajlar",
    notifications: "Bildirimler",
    proBadge: "PRO",
    chat: {
      open: "Canlı Destek",
      placeholder: "Mesaj yazın…",
      hello: "Merhaba! Size nasıl yardımcı olabilirim?",
      send: "Gönder",
      attach: "Resim ekle",
    },
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
    welcome: "Welcome to Ureten Eller",
    showcase: "Showcase",
    standard: "Standard Listings",
    categories: "Our Categories",
    view: "View",
    empty: "No listings yet.",
    findListing: "Find Listing",
    profile: "Profile",
    logout: "Logout",
    home: "Home",
    messages: "Messages",
    notifications: "Notifications",
    proBadge: "PRO",
    chat: {
      open: "Live Support",
      placeholder: "Type a message…",
      hello: "Hello! How can I help you?",
      send: "Send",
      attach: "Attach image",
    },
    legalBar: "Corporate",
    legal: {
      corporate: "Corporate",
      about: "About Us",
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
    welcome: "مرحبًا بكم في منصتنا",
    showcase: "الواجهة (Vitrin)",
    standard: "إعلانات عادية",
    categories: "تصنيفاتنا",
    view: "عرض",
    empty: "لا توجد إعلانات بعد.",
    findListing: "ابحث عن إعلان",
    profile: "الملف الشخصي",
    logout: "تسجيل الخروج",
    home: "الرئيسية",
    messages: "الرسائل",
    notifications: "الإشعارات",
    proBadge: "محترف",
    chat: {
      open: "الدعم المباشر",
      placeholder: "اكتب رسالة…",
      hello: "مرحبًا! كيف يمكنني مساعدتك؟",
      send: "إرسال",
      attach: "إرفاق صورة",
    },
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
    welcome: "Willkommen bei Ureten Eller",
    showcase: "Vitrin",
    standard: "Standard-Inserate",
    categories: "Unsere Kategorien",
    view: "Ansehen",
    empty: "Noch keine Inserate.",
    findListing: "Inserat finden",
    profile: "Profil",
    logout: "Abmelden",
    home: "Start",
    messages: "Nachrichten",
    notifications: "Mitteilungen",
    proBadge: "PRO",
    chat: {
      open: "Live-Support",
      placeholder: "Nachricht schreiben…",
      hello: "Hallo! Wobei kann ich helfen?",
      send: "Senden",
      attach: "Bild anhängen",
    },
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
    if (saved && SUPPORTED.includes(saved)) setLang(saved);
  }, []);
  useEffect(() => {
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);
  const t = useMemo(() => LBL[lang] || LBL.tr, [lang]);
  return { lang, setLang, t };
}

/* ----------------------------- Dönen motto (4 dil) ----------------------------- */
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

/* ----------------------------- Kategoriler (tam) ----------------------------- */
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

/* ----------------------------- Yardımcılar ----------------------------- */
const go = (href) => { window.location.href = href; };

/* ----------------------------- Canlı Destek (yerel) ----------------------------- */
function useChat(lang) {
  const key = "chat_msgs";
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([]);
  useEffect(() => {
    try { const m = JSON.parse(localStorage.getItem(key) || "[]"); setMsgs(Array.isArray(m) ? m : []); } catch {}
  }, []);
  const persist = (arr) => { setMsgs(arr); try { localStorage.setItem(key, JSON.stringify(arr)); } catch {} };
  const send = (content, img) => {
    const me = { id: Date.now() + "-me", from: "me", content, img, at: new Date().toISOString() };
    const next = [...msgs, me];
    persist(next);
    if (!msgs.some(m => m.from === "admin")) {
      setTimeout(() => {
        const admin = { id: Date.now() + "-ad", from: "admin", content: LBL[lang].chat.hello, at: new Date().toISOString() };
        persist([...next, admin]);
      }, 300);
    }
  };
  return { open, setOpen, msgs, send };
}

/* ----------------------------- Sayfa ----------------------------- */
export default function CustomerHome() {
  const { lang, setLang, t } = useLang();

  // auth guard
  useEffect(() => {
    const a = localStorage.getItem("authed") === "1";
    if (!a) go("/login?role=customer");
  }, []);

  // ads.json’dan veriler
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
          if (alive) { setProAds(pros); setStdAds(std); }
        }
      } catch {}
    })();
    return () => { alive = false; };
  }, []);

  // dönen motto
  const phrases = useMemo(() => PHRASES[lang] || PHRASES.tr, [lang]);
  const [pi, setPi] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setPi((x) => (x + 1) % Math.max(1, phrases.length)), 4000);
    return () => clearInterval(id);
  }, [phrases.length]);
  const currentPhrase = phrases[pi % phrases.length];

  // kategoriler
  const cats = CATS[lang] || CATS.tr;

  // chat state
  const { open, setOpen, msgs, send } = useChat(lang);
  const [text, setText] = useState("");
  const fileRef = useRef(null);

  const onLogout = () => {
    localStorage.removeItem("authed");
    go("/");
  };

  return (
    <>
      <Head>
        <title>{t.brand} – {t.home}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Faviconlar */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=5" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=5" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=5" />
        <link rel="icon" href="/favicon.png?v=5" />
        <meta name="theme-color" content="#0b0b0b" />
      </Head>

      {/* ÜST BAR */}
      <header className="topbar" role="banner">
        <div className="brand" onClick={() => go("/")}>
          <img src="/logo.png" alt={t.brand} width="36" height="36" />
          <strong>{t.brand}</strong>
        </div>

        <div className="actions">
          <button className="primary" onClick={() => go("/search")}>{t.findListing}</button>
          <button className="ghost" onClick={() => go("/profile")}>{t.profile}</button>
          <button className="danger" onClick={onLogout}>{t.logout}</button>
          <select aria-label="Language" value={lang} onChange={(e) => setLang(e.target.value)}>
            {SUPPORTED.map((k) => <option key={k} value={k}>{LOCALE_LABEL[k]}</option>)}
          </select>
        </div>
      </header>

      {/* HERO – renkli arka plan, dönen motto */}
      <section className="hero">
        <div className="heroText">
          <h1>{t.welcome}</h1>
          <p key={pi} className="phrase" style={{ color: currentPhrase?.color || "#111827" }}>
            {currentPhrase?.text}
          </p>
        </div>
        <div className="heroArt" aria-hidden>
          <div className="blob b1" />
          <div className="blob b2" />
          <div className="blob b3" />
        </div>
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
                <div className="meta"><span>{a?.cat || a?.category || ""}</span><b>{a?.price || ""}</b></div>
              </div>
              <button className="view" onClick={() => go(a?.url || `/ads/${a?.slug || a?.id || ""}`)}>{t.view}</button>
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
                <div className="meta"><span>{a?.cat || a?.category || ""}</span><b>{a?.price || ""}</b></div>
              </div>
              <button className="view" onClick={() => go(a?.url || `/ads/${a?.slug || a?.id || ""}`)}>{t.view}</button>
            </article>
          )) : <div className="empty">{t.empty}</div>}
        </div>
      </section>

      {/* KATEGORİLER */}
      <section className="section">
        <div className="sectionHead"><h2>🗂️ {t.categories}</h2></div>
        <div className="grid cats">
          {cats.map((c, idx) => (
            <article key={idx} className="catCard" style={{ backgroundImage: `linear-gradient(135deg, var(--g${(idx%5)+1}a), var(--g${(idx%5)+1}b))` }}>
              <div className="head">
                <span className="icn">{c.icon}</span>
                <h3>{c.title}</h3>
                <span className="count">{c.subs.length}</span>
              </div>
              <div className="subs">
                {c.subs.map((s, k) => <span key={k} className="chip">{s}</span>)}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ALT BAR – sabit */}
      <nav className="bottombar" aria-label="Bottom Navigation">
        <button className="tab active" onClick={() => go("/portal/customer")}>🏠 {t.home}</button>
        <button className="tab" onClick={() => go("/messages")}>💬 {t.messages}</button>
        <button className="tab" onClick={() => go("/notifications")}>🔔 {t.notifications}</button>
      </nav>

      {/* SİYAH LEGAL ALAN */}
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

      {/* CANLI DESTEK BALONU */}
      <button className="chatFab" aria-label={t.chat.open} onClick={() => setOpen(v => !v)}>💬</button>
      {open && (
        <div className="chatBox" role="dialog" aria-label={t.chat.open}>
          <div className="chatHead">
            <strong>{t.chat.open}</strong>
            <button className="x" onClick={() => setOpen(false)}>✕</button>
          </div>
          <div className="chatBody">
            {msgs.map(m => (
              <div key={m.id} className={`msg ${m.from}`}>
                {m.img && <img src={m.img} alt="" />}
                {m.content && <p>{m.content}</p>}
              </div>
            ))}
            {!msgs.length && <div className="msg admin"><p>{t.chat.hello}</p></div>}
          </div>
          <div className="chatFoot">
            <input
              value={text}
              onChange={(e)=>setText(e.target.value)}
              placeholder={t.chat.placeholder}
              onKeyDown={(e)=>{ if(e.key==="Enter"&&text.trim()){ send(text.trim()); setText(""); } }}
            />
            <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}}
              onChange={(e)=>{
                const f=e.target.files?.[0]; if(!f) return;
                const r=new FileReader();
                r.onload=()=>{ send("", r.result); };
                r.readAsDataURL(f);
                e.target.value="";
              }} />
            <button className="ghost" onClick={()=>fileRef.current?.click()} title={t.chat.attach}>📎</button>
            <button className="primary" onClick={()=>{ if(text.trim()){ send(text.trim()); setText(""); } }}>{t.chat.send}</button>
          </div>
        </div>
      )}

      {/* STYLES */}
      <style>{`
        :root{
          --ink:#0f172a; --muted:#475569; --line:rgba(0,0,0,.08);
          --g1a:#ff80ab; --g1b:#ffd166;
          --g2a:#a78bfa; --g2b:#60a5fa;
          --g3a:#34d399; --g3b:#a7f3d0;
          --g4a:#f59e0b; --g4b:#f97316;
          --g5a:#06b6d4; --g5b:#3b82f6;
        }
        html,body{height:100%}
        body{
          margin:0; color:var(--ink);
          font-family:system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial,sans-serif;
          background: radial-gradient(1200px 600px at 10% -10%, #ffe4e6, transparent),
                      radial-gradient(900px 500px at 90% -10%, #e0e7ff, transparent),
                      linear-gradient(120deg,#ff80ab,#a78bfa,#60a5fa,#34d399);
          background-attachment:fixed;
          padding-bottom: 74px; /* alt bar için boşluk */
        }

        /* Üst bar */
        .topbar{
          position:sticky; top:0; z-index:60;
          display:grid; grid-template-columns:1fr auto; gap:12px; align-items:center;
          padding:10px 14px; background:rgba(255,255,255,.92);
          backdrop-filter:blur(8px); border-bottom:1px solid var(--line);
        }
        .brand{display:flex; gap:8px; align-items:center; cursor:pointer; font-weight:900}
        .brand img{border-radius:10px}
        .actions{display:flex; gap:8px; align-items:center; flex-wrap:wrap}
        .actions select{border:1px solid var(--line); border-radius:10px; padding:6px 8px; background:#fff}
        .primary{padding:9px 12px; border-radius:10px; border:1px solid #111827; background:#111827; color:#fff; font-weight:800; cursor:pointer}
        .ghost{padding:9px 12px; border-radius:10px; border:1px solid var(--line); background:#fff; color:#111827; font-weight:700; cursor:pointer}
        .danger{padding:9px 12px; border-radius:10px; border:1px solid #ef4444; background:#ef4444; color:#fff; font-weight:800; cursor:pointer}

        /* Hero */
        .hero{max-width:1100px; margin:12px auto 0; padding:0 16px; display:grid; grid-template-columns:1.1fr .9fr; gap:18px}
        .heroText h1{margin:6px 0 4px; font-size:30px}
        .phrase{margin:0; font-size:18px; font-weight:700}
        .heroArt{position:relative; min-height:160px}
        .blob{position:absolute; filter:blur(32px); opacity:.6; border-radius:50%}
        .b1{width:180px;height:180px;background:#f472b6;top:10px;left:10px}
        .b2{width:220px;height:220px;background:#93c5fd;top:40px;right:20px}
        .b3{width:160px;height:160px;background:#86efac;bottom:-30px;left:120px}

        /* Bölümler */
        .section{max-width:1100px; margin:12px auto; padding:0 16px}
        .sectionHead{display:flex; align-items:center; justify-content:space-between; margin:8px 0}
        .grid.ads{display:grid; gap:14px; grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}
        .ad{border:1px solid #e5e7eb; border-radius:16px; overflow:hidden; background:#fff; display:flex; flex-direction:column; box-shadow:0 8px 22px rgba(0,0,0,.06)}
        .thumb{aspect-ratio:4/3; background:#f1f5f9; background-size:cover; background-position:center; position:relative}
        .badge{position:absolute; top:8px; left:8px; background:#111827; color:#fff; font-size:12px; padding:4px 8px; border-radius:999px}
        .body{padding:10px}
        .title{font-weight:800; margin:0 0 6px}
        .meta{display:flex; justify-content:space-between; color:#475569; font-size:13px}
        .view{margin:0 10px 12px; border:1px solid #111827; background:#111827; color:#fff; border-radius:10px; padding:8px 10px; font-weight:700; cursor:pointer}
        .empty{padding:18px; border:1px dashed #e5e7eb; border-radius:14px; text-align:center; color:#475569}

        /* Kategoriler */
        .grid.cats{display:grid; gap:14px; grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}
        .catCard{
          border-radius:18px; padding:12px; background-size:cover; background-position:center;
          border:1px solid rgba(255,255,255,.35); backdrop-filter: blur(2px);
          box-shadow:0 10px 24px rgba(0,0,0,.08);
        }
        .head{display:grid; grid-template-columns:1fr auto auto; gap:6px; align-items:center}
        .icn{font-size:22px}
        .head h3{margin:0; font-size:18px; text-align:center}
        .count{justify-self:end; background:#ffffffc8; border:1px solid #e5e7eb; font-size:12px; border-radius:999px; padding:2px 8px}
        .subs{display:grid; gap:8px; grid-template-columns:repeat(2,minmax(0,1fr)); margin-top:8px}
        .chip{display:block; text-align:center; padding:8px 10px; border-radius:12px; font-size:12px; background: rgba(255,255,255,0.98); border:1px solid #e5e7eb}

        /* Alt bar – sabit */
        .bottombar{
          position: fixed; left:0; right:0; bottom:0; width:100vw;
          z-index:50; padding:6px; padding-bottom: max(6px, env(safe-area-inset-bottom));
          background:rgba(255,255,255,.94); backdrop-filter:blur(8px); border-top:1px solid var(--line);
          display:grid; grid-template-columns:repeat(3,1fr); gap:6px;
        }
        .tab{display:flex; align-items:center; justify-content:center; gap:6px; padding:10px; border-radius:10px; border:1px solid transparent; background:transparent; cursor:pointer; font-weight:800}
        .tab.active{border-color:#111827; background:#111827; color:#fff}

        /* Legal full-bleed */
        .legal{background:#0b0b0b; color:#f8fafc; border-top:1px solid rgba(255,255,255,.12);
               width:100vw; margin-left:calc(50% - 50vw); margin-right:calc(50% - 50vw); margin-top:14px}
        .inner{max-width:1100px; margin:0 auto; padding:12px 16px}
        .ttl{font-weight:800; margin-bottom:6px}
        .links{display:flex; flex-wrap:wrap; gap:10px}
        .links a{color:#e2e8f0; font-size:13px; padding:6px 8px; border-radius:8px; text-decoration:none}
        .links a:hover{background:rgba(255,255,255,.08); color:#fff}
        .homeLink{margin-left:auto; font-weight:800}
        .copy{margin-top:6px; font-size:12px; color:#cbd5e1}

        /* Chat */
        .chatFab{
          position:fixed; right:14px; bottom:88px; z-index:60;
          width:52px; height:52px; border-radius:50%;
          border:1px solid #111827; background:#111827; color:#fff; font-size:20px; cursor:pointer;
          box-shadow:0 10px 20px rgba(0,0,0,.2);
        }
        .chatBox{
          position:fixed; right:14px; bottom:150px; width:320px; max-height:60vh; z-index:60;
          background:#fff; border:1px solid #e5e7eb; border-radius:14px; box-shadow:0 10px 24px rgba(0,0,0,.15);
          display:flex; flex-direction:column; overflow:hidden;
        }
        .chatHead{display:flex; align-items:center; justify-content:space-between; padding:8px 10px; font-weight:800; background:#111827; color:#fff}
        .chatHead .x{background:transparent; border:none; color:#fff; font-size:16px; cursor:pointer}
        .chatBody{padding:10px; display:flex; flex-direction:column; gap:8px; overflow:auto}
        .msg{max-width:85%; padding:8px 10px; border-radius:12px; line-height:1.3; word-break:break-word}
        .msg.me{align-self:flex-end; background:#111827; color:#fff}
        .msg.admin{align-self:flex-start; background:#f1f5f9; color:#0f172a}
        .msg img{display:block; max-width:200px; border-radius:10px; border:1px solid #e5e7eb}
        .chatFoot{display:grid; grid-template-columns:1fr auto auto; gap:6px; padding:8px; border-top:1px solid #e5e7eb; background:#fafafa}
        .chatFoot input{padding:10px; border-radius:10px; border:1px solid #e5e7eb; background:#fff}

        @media (max-width:820px){
          .hero{grid-template-columns:1fr}
          .heroArt{min-height:120px}
          .chatBox{right:10px; width:92vw}
        }
      `}</style>
    </>
  );
}
