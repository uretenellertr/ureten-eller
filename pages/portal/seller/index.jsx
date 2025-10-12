// Dosya: pages/portal/seller/index.impl.jsx
// İstek: Tüm metinleri TR/EN/AR/DE dillerinde çevir – eksiksiz. (İlan Ver linki korunur)

"use client";
import React, { useEffect, useMemo, useState } from "react";

const SUPPORTED = ["tr", "en", "ar", "de"];
const LOCALE_LABEL = { tr: "Türkçe", en: "English", ar: "العربية", de: "Deutsch" };

const STR = {
  tr: {
    brand: "Üreten Eller",
    profile: "Profil",
    logout: "Çıkış",
    search: "İlan Ara",
    postAd: "İlan Ver",
    heroTitle: "Üreten Ellere Hoş Geldiniz",
    tagline: "Amacımız: ev hanımlarına bütçe katkısı sağlamak.",
    showcase: "Vitrin",
    standard: "Standart İlanlar",
    categories: "Kategorilerimiz",
    empty: "Henüz ilan yok.",
    tabs: { home: "Ana Sayfa", messages: "Mesajlar", notifs: "Bildirimler" },
    chat: { title: "Canlı Destek", helloYou: "Merhaba! Nasıl yardımcı olabilirim?", helloMe: "Merhaba 👋", placeholder: "Mesaj yazın...", send: "Gönder" },
    legal: {
      corporate: "Kurumsal", about: "Hakkımızda", contact: "İletişim", privacy: "Gizlilik", kvkk: "KVKK Aydınlatma",
      terms: "Kullanım Şartları", distance: "Mesafeli Satış", delivery: "Teslimat & İade", cookie: "Çerez Politikası",
      community: "Topluluk Kuralları", prohibited: "Yasaklı Ürünler", all: "Tüm Legal", copyright: "© 2025 Üreten Eller"
    },
    cats: [
      { key: "food", icon: "🍲", bg: "linear-gradient(135deg,#ff80ab,#ffd166)", title: "Yemekler", subs: ["Ev yemekleri","Börek-çörek","Çorba","Zeytinyağlı","Pilav-makarna","Et-tavuk","Kahvaltılık","Meze","Dondurulmuş","Çocuk öğünleri","Diyet/vegan/gf"] },
      { key: "cake", icon: "🎂", bg: "linear-gradient(135deg,#a78bfa,#60a5fa)", title: "Pasta & Tatlı", subs: ["Yaş pasta","Kek-cupcake","Kurabiye","Şerbetli","Sütlü","Cheesecake","Diyet tatlı","Çikolata/şekerleme","Doğum günü setleri"] },
      { key: "jam", icon: "🫙", bg: "linear-gradient(135deg,#34d399,#a7f3d0)", title: "Reçel • Turşu • Sos", subs: ["Reçel-marmelat","Pekmez","Turşu","Domates/biber sos","Acı sos","Salça","Sirke","Konserve"] },
      { key: "local", icon: "🌾", bg: "linear-gradient(135deg,#f59e0b,#f97316)", title: "Yöresel / Kışlık", subs: ["Erişte","Tarhana","Yufka","Mantı","Kurutulmuş sebze-meyve","Salça","Sirke","Konserve"] },
      { key: "diet", icon: "🥗", bg: "linear-gradient(135deg,#06b6d4,#3b82f6)", title: "Diyet / Vegan / Glutensiz", subs: ["Fit tabaklar","Vegan yemekler","GF unlu mamuller","Şekersiz tatlı","Keto ürün","Protein atıştırmalık"] },
      { key: "jewelry", icon: "💍", bg: "linear-gradient(135deg,#ff80ab,#ffd166)", title: "Takı", subs: ["Bileklik","Kolye","Küpe","Yüzük","Halhal","Broş","Setler","İsimli/kişiye özel","Makrome","Doğal taş","Reçine","Tel sarma"] },
      { key: "kids", icon: "👶", bg: "linear-gradient(135deg,#a78bfa,#60a5fa)", title: "Bebek & Çocuk", subs: ["Hayvan/bebek figürleri","Çıngırak","Diş kaşıyıcı örgü","Bez oyuncak/kitap","Montessori oyuncak","Setler","Örgü patik-bere","Bebek battaniyesi","Önlük-ağız bezi","Lohusa seti","Saç aksesuarı","El emeği kıyafet"] },
      { key: "knit", icon: "🧶", bg: "linear-gradient(135deg,#34d399,#a7f3d0)", title: "Örgü / Triko", subs: ["Hırka","Kazak","Atkı-bere","Panço","Şal","Çorap","Bebek takımı","Yelek","Kırlent-örtü","Lif takımı"] },
      { key: "sew", icon: "✂️", bg: "linear-gradient(135deg,#f59e0b,#f97316)", title: "Dikiş / Terzilik", subs: ["Paça/onarım","Fermuar değişimi","Perde dikişi","Nevresim-yastık","Masa örtüsü","Özel dikim","Kostüm"] },
      { key: "macrame", icon: "🧵", bg: "linear-gradient(135deg,#06b6d4,#3b82f6)", title: "Makrome & Dekor", subs: ["Duvar süsü","Saksı askısı","Anahtarlık","Avize","Amerikan servis/runner","Sepet","Raf/duvar dekoru"] },
      { key: "home", icon: "🏠", bg: "linear-gradient(135deg,#ff80ab,#ffd166)", title: "Ev Dekor & Aksesuar", subs: ["Keçe işleri","Kırlent","Kapı süsü","Tepsi süsleme","Çerçeve","Rüya kapanı","Tablo"] },
      { key: "candle", icon: "🕯️", bg: "linear-gradient(135deg,#a78bfa,#60a5fa)", title: "Mum & Kokulu Ürünler", subs: ["Soya/balmumu mum","Kokulu taş","Oda spreyi","Tütsü","Jel mum","Hediye seti"] },
      { key: "soap", icon: "🧼", bg: "linear-gradient(135deg,#34d399,#a7f3d0)", title: "Doğal Sabun & Kozmetik", subs: ["Zeytinyağlı sabun","Bitkisel sabunlar","Katı şampuan","Dudak balmı","Krem/merhem","Banyo tuzu","Lavanta kesesi"] },
      { key: "amigurumi", icon: "🧸", bg: "linear-gradient(135deg,#f59e0b,#f97316)", title: "Amigurumi & Oyuncak (dekoratif)", subs: ["Anahtarlık","Magnet","Koleksiyon figürü","Dekor bebek/karakter","İsimli amigurumi"] }
    ]
  },
  en: {
    brand: "Üreten Eller",
    profile: "Profile",
    logout: "Logout",
    search: "Search Listings",
    postAd: "Post Listing",
    heroTitle: "Welcome to Üreten Eller",
    tagline: "Our aim: support homemakers' budgets.",
    showcase: "Showcase",
    standard: "Standard Listings",
    categories: "Our Categories",
    empty: "No listings yet.",
    tabs: { home: "Home", messages: "Messages", notifs: "Notifications" },
    chat: { title: "Live Support", helloYou: "Hello! How can I help?", helloMe: "Hello 👋", placeholder: "Type a message...", send: "Send" },
    legal: {
      corporate: "Corporate", about: "About", contact: "Contact", privacy: "Privacy", kvkk: "PDPL (KVKK) Notice",
      terms: "Terms of Use", distance: "Distance Sales", delivery: "Delivery & Returns", cookie: "Cookie Policy",
      community: "Community Guidelines", prohibited: "Prohibited Items", all: "All Legal", copyright: "© 2025 Üreten Eller"
    },
    cats: [
      { key: "food", icon: "🍲", bg: "linear-gradient(135deg,#ff80ab,#ffd166)", title: "Home‑cooked Meals", subs: ["Home‑cooked","Savory pastries","Soup","Olive‑oil dishes","Rice/Pasta","Meat/Chicken","Breakfast","Meze","Frozen","Kids' meals","Diet/Vegan/GF"] },
      { key: "cake", icon: "🎂", bg: "linear-gradient(135deg,#a78bfa,#60a5fa)", title: "Cakes & Desserts", subs: ["Fresh cake","Cake/Cupcake","Cookies","Syrupy desserts","Milk desserts","Cheesecake","Diet desserts","Chocolate/Confectionery","Birthday sets"] },
      { key: "jam", icon: "🫙", bg: "linear-gradient(135deg,#34d399,#a7f3d0)", title: "Jams • Pickles • Sauces", subs: ["Jam/Marmalade","Molasses","Pickles","Tomato/pepper sauce","Hot sauce","Paste","Vinegar","Canned"] },
      { key: "local", icon: "🌾", bg: "linear-gradient(135deg,#f59e0b,#f97316)", title: "Local / Winter Prep", subs: ["Erişte noodles","Tarhana","Yufka","Manti","Dried veg/fruit","Paste","Vinegar","Canned"] },
      { key: "diet", icon: "🥗", bg: "linear-gradient(135deg,#06b6d4,#3b82f6)", title: "Diet / Vegan / Gluten‑Free", subs: ["Fit plates","Vegan meals","GF bakery","Sugar‑free dessert","Keto product","Protein snack"] },
      { key: "jewelry", icon: "💍", bg: "linear-gradient(135deg,#ff80ab,#ffd166)", title: "Jewelry", subs: ["Bracelet","Necklace","Earrings","Ring","Anklet","Brooch","Sets","Personalized/Named","Macramé","Natural stone","Resin","Wire wrap"] },
      { key: "kids", icon: "👶", bg: "linear-gradient(135deg,#a78bfa,#60a5fa)", title: "Baby & Kids", subs: ["Animal/Baby figures","Rattle","Crochet teether","Cloth toy/book","Montessori toy","Sets","Knit booties/hat","Baby blanket","Bib/Burp cloth","Postpartum set","Hair accessory","Handmade clothing"] },
      { key: "knit", icon: "🧶", bg: "linear-gradient(135deg,#34d399,#a7f3d0)", title: "Knits", subs: ["Cardigan","Sweater","Scarf/Beanie","Poncho","Shawl","Socks","Baby set","Vest","Cushion/Throw","Bath set"] },
      { key: "sew", icon: "✂️", bg: "linear-gradient(135deg,#f59e0b,#f97316)", title: "Sewing / Tailoring", subs: ["Hem/Repair","Zipper replacement","Curtain sewing","Duvet/Pillow","Tablecloth","Custom tailoring","Costume"] },
      { key: "macrame", icon: "🧵", bg: "linear-gradient(135deg,#06b6d4,#3b82f6)", title: "Macramé & Decor", subs: ["Wall hanging","Plant hanger","Keychain","Chandelier","Placemat/Runner","Basket","Shelf/Wall decor"] },
      { key: "home", icon: "🏠", bg: "linear-gradient(135deg,#ff80ab,#ffd166)", title: "Home Decor & Accessories", subs: ["Felt works","Cushion","Door wreath","Tray decor","Frame","Dreamcatcher","Painting"] },
      { key: "candle", icon: "🕯️", bg: "linear-gradient(135deg,#a78bfa,#60a5fa)", title: "Candles & Fragranced Items", subs: ["Soy/Beeswax candles","Scented stone","Room spray","Incense","Gel candle","Gift set"] },
      { key: "soap", icon: "🧼", bg: "linear-gradient(135deg,#34d399,#a7f3d0)", title: "Natural Soap & Cosmetics", subs: ["Olive‑oil soap","Herbal soaps","Solid shampoo","Lip balm","Cream/Ointment","Bath salt","Lavender sachet"] },
      { key: "amigurumi", icon: "🧸", bg: "linear-gradient(135deg,#f59e0b,#f97316)", title: "Amigurumi & Decorative Toys", subs: ["Keychain","Magnet","Collectible figure","Decor doll/character","Named amigurumi"] }
    ]
  },
  ar: {
    brand: "Üreten Eller",
    profile: "الملف الشخصي",
    logout: "تسجيل الخروج",
    search: "البحث في الإعلانات",
    postAd: "أضف إعلانًا",
    heroTitle: "مرحبًا بكم في Üreten Eller",
    tagline: "هدفنا: دعم ميزانية ربات البيوت.",
    showcase: "الواجهة المميزة",
    standard: "إعلانات عادية",
    categories: "فئاتنا",
    empty: "لا يوجد إعلانات بعد.",
    tabs: { home: "الرئيسية", messages: "الرسائل", notifs: "الإشعارات" },
    chat: { title: "الدعم المباشر", helloYou: "مرحبًا! كيف أستطيع المساعدة؟", helloMe: "مرحبًا 👋", placeholder: "اكتب رسالة...", send: "إرسال" },
    legal: {
      corporate: "الشركة", about: "من نحن", contact: "اتصال", privacy: "الخصوصية", kvkk: "إشعار KVKK",
      terms: "شروط الاستخدام", distance: "البيع عن بُعد", delivery: "التسليم والإرجاع", cookie: "سياسة ملفات تعريف الارتباط",
      community: "إرشادات المجتمع", prohibited: "السلع المحظورة", all: "جميع الصفحات القانونية", copyright: "© 2025 Üreten Eller"
    },
    cats: [
      { key: "food", icon: "🍲", bg: "linear-gradient(135deg,#ff80ab,#ffd166)", title: "أطعمة منزلية", subs: ["أطباق منزلية","فطائر ومعجنات","شوربة","أطباق بالزيت","أرز/معكرونة","لحوم/دجاج","فطور","مقبلات","مجمدات","وجبات للأطفال","حمية/نباتي/خالٍ من الغلوتين"] },
      { key: "cake", icon: "🎂", bg: "linear-gradient(135deg,#a78bfa,#60a5fa)", title: "كعك وحلويات", subs: ["كيك طازج","كيك/كب كيك","بسكويت","حلويات شرابية","حلويات بالحليب","تشيزكيك","حلويات دايت","شوكولاتة/حلويات","مجموعات عيد الميلاد"] },
      { key: "jam", icon: "🫙", bg: "linear-gradient(135deg,#34d399,#a7f3d0)", title: "مربى • مخللات • صلصات", subs: ["مربى/مارملاد","دبس","مخللات","صلصة طماطم/فلفل","صلصة حارة","صلصة مركزة","خل","معلبات"] },
      { key: "local", icon: "🌾", bg: "linear-gradient(135deg,#f59e0b,#f97316)", title: "منتجات تقليدية/مؤونة الشتاء", subs: ["إريشته (نودلز)","طرحنة","يوفكا (رقائق)","مانتي","خضار/فاكهة مجففة","صلصة مركزة","خل","معلبات"] },
      { key: "diet", icon: "🥗", bg: "linear-gradient(135deg,#06b6d4,#3b82f6)", title: "حمية/نباتي/خالٍ من الغلوتين", subs: ["أطباق صحية","أطعمة نباتية","مخبوزات خالية من الغلوتين","حلويات بدون سكر","منتجات كيتو","وجبات خفيفة بروتينية"] },
      { key: "jewelry", icon: "💍", bg: "linear-gradient(135deg,#ff80ab,#ffd166)", title: "إكسسوارات", subs: ["أساور","قلائد","أقراط","خواتم","خلخال","بروش","مجموعات","مخصص/بالاسم","مكرمية","أحجار طبيعية","ريزين","سلك ملفوف"] },
      { key: "kids", icon: "👶", bg: "linear-gradient(135deg,#a78bfa,#60a5fa)", title: "رضّع وأطفال", subs: ["دمى حيوانات/أطفال","خشخيشة","عضّاضة محاكة","ألعاب/كتب قماشية","ألعاب مونتيسوري","مجموعات","حذاء/قبعة محاكة","بطانية أطفال","مريلة/منشفة فم","طقم نفاس","إكسسوار شعر","ملابس يدوية"] },
      { key: "knit", icon: "🧶", bg: "linear-gradient(135deg,#34d399,#a7f3d0)", title: "حياكة/تريكو", subs: ["كارديغان","كنزة","وشاح/قبعة","بانشو","شال","جوارب","طقم أطفال","فيست","وسادة/غطاء","طقم ليف"] },
      { key: "sew", icon: "✂️", bg: "linear-gradient(135deg,#f59e0b,#f97316)", title: "خياطة/تفصيل", subs: ["ثني/تصليح","تبديل سحاب","تفصيل ستائر","أغطية/وسائد","مفرش طاولة","تفصيل خاص","زي تنكري"] },
      { key: "macrame", icon: "🧵", bg: "linear-gradient(135deg,#06b6d4,#3b82f6)", title: "مكرمية وديكور", subs: ["زينة جدارية","حامل أصيص","ميدالية","ثريا","مفرش أمريكي/رنر","سلة","رف/ديكور جداري"] },
      { key: "home", icon: "🏠", bg: "linear-gradient(135deg,#ff80ab,#ffd166)", title: "ديكور وإكسسوارات منزلية", subs: ["أعمال لباد","وسادة","زينة باب","تزيين صينية","إطار","صائدة أحلام","لوحة"] },
      { key: "candle", icon: "🕯️", bg: "linear-gradient(135deg,#a78bfa,#60a5fa)", title: "شموع ومنتجات عطرية", subs: ["شموع صويا/شمع عسل","حجر عطري","رذاذ للغرفة","بخور","شموع هلامية","طقم هدايا"] },
      { key: "soap", icon: "🧼", bg: "linear-gradient(135deg,#34d399,#a7f3d0)", title: "صابون طبيعي ومستحضرات", subs: ["صابون بزيت الزيتون","صابون عشبي","شامبو صلب","بلسم شفاه","كريم/مرهم","ملح حمام","أكياس لافندر"] },
      { key: "amigurumi", icon: "🧸", bg: "linear-gradient(135deg,#f59e0b,#f97316)", title: "أميغورومي ولُعب (زخرفية)", subs: ["ميدالية","مغناطيس","مجسّم تجميعي","دمية/شخصية للزينة","أميغورومي بالاسم"] }
    ]
  },
  de: {
    brand: "Üreten Eller",
    profile: "Profil",
    logout: "Abmelden",
    search: "Anzeigen suchen",
    postAd: "Anzeige aufgeben",
    heroTitle: "Willkommen bei Üreten Eller",
    tagline: "Ziel: Das Haushaltsbudget von Frauen unterstützen.",
    showcase: "Schaufenster",
    standard: "Standardanzeigen",
    categories: "Kategorien",
    empty: "Noch keine Anzeigen.",
    tabs: { home: "Startseite", messages: "Nachrichten", notifs: "Benachrichtigungen" },
    chat: { title: "Live‑Support", helloYou: "Hallo! Wie kann ich helfen?", helloMe: "Hallo 👋", placeholder: "Nachricht schreiben...", send: "Senden" },
    legal: {
      corporate: "Unternehmen", about: "Über uns", contact: "Kontakt", privacy: "Datenschutz", kvkk: "KVKK‑Hinweis",
      terms: "Nutzungsbedingungen", distance: "Fernabsatz", delivery: "Lieferung & Rückgabe", cookie: "Cookie‑Richtlinie",
      community: "Community‑Richtlinien", prohibited: "Verbotene Artikel", all: "Alle Rechtstexte", copyright: "© 2025 Üreten Eller"
    },
    cats: [
      { key: "food", icon: "🍲", bg: "linear-gradient(135deg,#ff80ab,#ffd166)", title: "Hausgemachte Gerichte", subs: ["Hausmannskost","Börek & Gebäck","Suppe","Olivenölgerichte","Reis/Nudeln","Fleisch/Huhn","Frühstück","Meze","Tiefgekühlt","Kindermahlzeiten","Diät/Vegan/Glutenfrei"] },
      { key: "cake", icon: "🎂", bg: "linear-gradient(135deg,#a78bfa,#60a5fa)", title: "Kuchen & Desserts", subs: ["Frische Torte","Kuchen/Cupcake","Kekse","Sirupdesserts","Milchdesserts","Käsekuchen","Diät‑Desserts","Schokolade/Süßwaren","Geburtstags‑Sets"] },
      { key: "jam", icon: "🫙", bg: "linear-gradient(135deg,#34d399,#a7f3d0)", title: "Marmelade • Eingelegtes • Saucen", subs: ["Marmelade","Pekmez","Eingelegtes","Tomaten-/Paprikasoße","Scharfe Soße","Tomatenmark","Essig","Konserven"] },
      { key: "local", icon: "🌾", bg: "linear-gradient(135deg,#f59e0b,#f97316)", title: "Regional / Wintervorrat", subs: ["Erişte (Nudeln)","Tarhana","Yufka (Teigblätter)","Mantı","Getrocknetes Obst/Gemüse","Tomatenmark","Essig","Konserven"] },
      { key: "diet", icon: "🥗", bg: "linear-gradient(135deg,#06b6d4,#3b82f6)", title: "Diät / Vegan / Glutenfrei", subs: ["Fitness‑Teller","Vegane Gerichte","Glutenfreie Backwaren","Zuckerfreie Desserts","Keto‑Produkte","Protein‑Snacks"] },
      { key: "jewelry", icon: "💍", bg: "linear-gradient(135deg,#ff80ab,#ffd166)", title: "Schmuck", subs: ["Armband","Halskette","Ohrringe","Ring","Fußkettchen","Brosche","Sets","Personalisiert","Makramee","Naturstein","Harz","Drahtumwicklung"] },
      { key: "kids", icon: "👶", bg: "linear-gradient(135deg,#a78bfa,#60a5fa)", title: "Baby & Kinder", subs: ["Tier-/Babyfiguren","Rassel","Gehäkelter Beißring","Stoffspielzeug/-buch","Montessori‑Spielzeug","Sets","Gehäkelte Puschen/Mütze","Babydecke","Lätzchen/Sabber","Wochenbett‑Set","Haaraccessoire","Handgemachte Kleidung"] },
      { key: "knit", icon: "🧶", bg: "linear-gradient(135deg,#34d399,#a7f3d0)", title: "Strick / Häkel", subs: ["Strickjacke","Pullover","Schal/Mütze","Poncho","Schal (Stola)","Socken","Baby‑Set","Weste","Kissen/Decke","Wasch‑Set"] },
      { key: "sew", icon: "✂️", bg: "linear-gradient(135deg,#f59e0b,#f97316)", title: "Näherei / Schneiderei", subs: ["Saum/Reparatur","Reißverschlusswechsel","Gardinen nähen","Bettwäsche/Kissen","Tischdecke","Maßanfertigung","Kostüm"] },
      { key: "macrame", icon: "🧵", bg: "linear-gradient(135deg,#06b6d4,#3b82f6)", title: "Makramee & Deko", subs: ["Wanddeko","Blumenampel","Schlüsselanhänger","Deckenleuchte","Platzset/Runner","Korb","Regal/Wanddeko"] },
      { key: "home", icon: "🏠", bg: "linear-gradient(135deg,#ff80ab,#ffd166)", title: "Wohndeko & Accessoires", subs: ["Filzarbeiten","Kissen","Türdeko","Tablett‑Deko","Rahmen","Traumfänger","Bild"] },
      { key: "candle", icon: "🕯️", bg: "linear-gradient(135deg,#a78bfa,#60a5fa)", title: "Kerzen & Duftprodukte", subs: ["Soja-/Bienenwachskerzen","Duftstein","Raumspray","Weihrauch","Gelierkerze","Geschenkset"] },
      { key: "soap", icon: "🧼", bg: "linear-gradient(135deg,#34d399,#a7f3d0)", title: "Natürliche Seife & Kosmetik", subs: ["Olivenölseife","Kräuterseifen","Festes Shampoo","Lippenbalsam","Creme/Salbe","Badesalz","Lavendelsäckchen"] },
      { key: "amigurumi", icon: "🧸", bg: "linear-gradient(135deg,#f59e0b,#f97316)", title: "Amigurumi & Deko‑Spielzeug", subs: ["Schlüsselanhänger","Magnet","Sammelfigur","Deko‑Puppe/Charakter","Amigurumi mit Namen"] }
    ]
  }
};

export default function SellerHome() {
  const [lang, setLang] = useState("tr");
  const t = useMemo(() => STR[lang], [lang]);

  useEffect(() => {
    // HTML lang/dir güncelle
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    }
  }, [lang]);

  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <header className="topbar">
        <div className="brand" onClick={() => (window.location.href = "/")}> 
          <img src="/logo.png" width={36} height={36} alt="logo" />
          <span>{t.brand}</span>
        </div>
        <div className="actions">
          <div className="userGroup">
            <button className="ghost" onClick={() => (window.location.href = "/portal/customer")} aria-label={t.profile}>{t.profile}</button>
            <button className="danger" onClick={() => (window.location.href = "/login")} aria-label={t.logout}>{t.logout}</button>
          </div>
          <div className="actionGroup">
            <button className="ghost" onClick={() => (window.location.href = "/portal/seller?tab=search")} aria-label={t.search}>{t.search}</button>
            <a href="/portal/seller/post" className="primary" aria-label={t.postAd}>{t.postAd}</a>
          </div>
          <select aria-label="Language" value={lang} onChange={(e)=>setLang(e.target.value)}>
            {SUPPORTED.map(k => (<option key={k} value={k}>{LOCALE_LABEL[k]}</option>))}
          </select>
        </div>
      </header>

      <section className="hero">
        <h1 className="heroTitle">{t.heroTitle}</h1>
        <p className="phrase" style={{ color: "#e11d48" }}>{t.tagline}</p>
      </section>

      <section className="section">
        <div className="sectionHead"><h2>✨ {t.showcase}</h2></div>
        <div className="grid ads"><div className="empty">{t.empty}</div></div>
      </section>

      <section className="section">
        <div className="sectionHead"><h2>🧺 {t.standard}</h2></div>
        <div className="grid ads"><div className="empty">{t.empty}</div></div>
      </section>

      <section className="section">
        <div className="sectionHead"><h2>🗂️ {t.categories}</h2></div>
        <div className="grid cats">
          {t.cats.map(cat => (
            <article key={cat.key} className="catCard" style={{ backgroundImage: cat.bg }}>
              <div className="head"><span className="icn">{cat.icon}</span><h3>{cat.title}</h3></div>
              <div className="subs">
                {cat.subs.map((s, i) => (<span key={i} className="chip">{s}</span>))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <nav className="bottombar" aria-label="Bottom Navigation">
        <button className="tab active" onClick={() => (window.location.href = "/portal/seller")} aria-label={t.tabs.home}><span className="tIc">🏠</span><span>{t.tabs.home}</span></button>
        <button className="tab" onClick={() => (window.location.href = "/portal/seller?tab=messages")} aria-label={t.tabs.messages}><span className="tIc">💬</span><span>{t.tabs.messages}</span></button>
        <button className="tab" onClick={() => (window.location.href = "/portal/seller?tab=notifications")} aria-label={t.tabs.notifs}><span className="tIc">🔔</span><span>{t.tabs.notifs}</span></button>
      </nav>

      <button className="chatBtn" onClick={() => setChatOpen(!chatOpen)}>💬</button>
      {chatOpen && (
        <div className="chatWin">
          <div className="chatHd">{t.chat.title}</div>
          <div className="chatBd">
            <div className="msg you">{t.chat.helloYou}</div>
            <div className="msg me">{t.chat.helloMe}</div>
          </div>
          <div className="chatFt">
            <input type="text" placeholder={t.chat.placeholder} />
            <button className="send">{t.chat.send}</button>
          </div>
        </div>
      )}

      <footer className="legal">
        <div className="inner">
          <div className="ttl">{t.legal.corporate}</div>
          <nav className="links" aria-label={t.legal.corporate}>
            <a href="/legal/kurumsal">{t.legal.corporate}</a>
            <a href="/legal/hakkimizda">{t.legal.about}</a>
            <a href="/legal/iletisim">{t.legal.contact}</a>
            <a href="/legal/gizlilik">{t.legal.privacy}</a>
            <a href="/legal/kvkk-aydinlatma">{t.legal.kvkk}</a>
            <a href="/legal/kullanim-sartlari">{t.legal.terms}</a>
            <a href="/legal/mesafeli-satis-sozlesmesi">{t.legal.distance}</a>
            <a href="/legal/teslimat-iade">{t.legal.delivery}</a>
            <a href="/legal/cerez-politikasi">{t.legal.cookie}</a>
            <a href="/legal/topluluk-kurallari">{t.legal.community}</a>
            <a href="/legal/yasakli-urunler">{t.legal.prohibited}</a>
            <a href="/legal" className="homeLink">{t.legal.all}</a>
          </nav>
          <div className="copy">{t.legal.copyright}</div>
        </div>
      </footer>

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
        .primary{border:1px solid #111827;background:#111827;color:#fff;border-radius:10px;padding:8px 12px;font-weight:800;cursor:pointer;text-decoration:none;display:inline-block}
        .danger{border:1px solid #111827;background:#111827;color:#fff;border-radius:10px;padding:8px 12px;font-weight:800;cursor:pointer}
        .actions select{border:1px solid var(--line);border-radius:10px;padding:6px 8px;background:#fff}

        /* MOBİLDE 'İlan Ara' + 'İlan Ver' alta insin */
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
        .chatFt input[type='text']{flex:1;border:1px solid #e5e7eb;border-radius:10px;padding:8px}
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
