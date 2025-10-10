"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

/* ---------------------------- ENV / SUPABASE ---------------------------- */
let _sb = null;
function getSupabase() {
  if (_sb) return _sb;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || (typeof window !== "undefined" ? window.__SUPABASE_URL__ : "");
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || (typeof window !== "undefined" ? window.__SUPABASE_ANON__ : "");
  if (!url || !key) return null;
  _sb = createClient(url, key);
  return _sb;
}

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || (typeof window !== "undefined" ? window.__CLOUD_NAME__ : "");
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || (typeof window !== "undefined" ? window.__CLOUD_PRESET__ : "");

/* ---------------------------- DİL / ÇEVİRİLER ---------------------------- */
const SUPPORTED = ["tr", "en", "ar", "de"]; // RTL: ar
const LBL = {
  tr: {
    brand: "Üreten Eller",
    page: { title: "İlan Ver", submit: "Onaya Gönder", draft: "Taslak Kaydet", success: "İlan gönderildi. Onay bekliyor." },
    top: { profile: "Profil", logout: "Çıkış", back: "Geri" },
    form: {
      title: "İlan Başlığı",
      desc: "Açıklama",
      category: "Kategori",
      subcategory: "Alt Kategori",
      price: "Fiyat",
      currency: "Para Birimi",
      city: "İl",
      district: "İlçe (yazınız)",
      shipDays: "Tahmini Teslim (gün)",
      photos: "Fotoğraflar (en fazla 5)",
      showcase: "Vitrin (PRO)",
      choose: "— Seçin —",
      pickFiles: "Dosya seçin veya tıklayın"
    },
    tips: { filterWarn: "Telefon / e‑posta / WhatsApp paylaşımı yasaktır.", showcaseNeedPro: "Vitrin için Premium gerekir." },
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
    errors: {
      needLogin: "Devam etmek için giriş yap.",
      needTitle: "Başlık zorunlu.",
      needCategory: "Kategori seçin.",
      needCity: "İl seçin.",
      badFilter: "Metin uygun değil: ",
      uploadFail: "Fotoğraf yüklenemedi.",
      saveFail: "İlan kaydedilemedi.",
    },
  },
  en: {
    brand: "Ureten Eller",
    page: { title: "Post Listing", submit: "Submit for Review", draft: "Save Draft", success: "Listing submitted. Awaiting approval." },
    top: { profile: "Profile", logout: "Logout", back: "Back" },
    form: {
      title: "Title",
      desc: "Description",
      category: "Category",
      subcategory: "Subcategory",
      price: "Price",
      currency: "Currency",
      city: "City",
      district: "District (type)",
      shipDays: "Estimated Delivery (days)",
      photos: "Photos (max 5)",
      showcase: "Showcase (PRO)",
      choose: "— Select —",
      pickFiles: "Pick files or click"
    },
    tips: { filterWarn: "No phone / email / WhatsApp in text.", showcaseNeedPro: "Showcase requires Premium." },
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
    errors: {
      needLogin: "Please sign in to continue.",
      needTitle: "Title is required.",
      needCategory: "Select a category.",
      needCity: "Select a city.",
      badFilter: "Text blocked: ",
      uploadFail: "Upload failed.",
      saveFail: "Save failed.",
    },
  },
  ar: {
    brand: "أُنتِج بالأيادي",
    page: { title: "إنشاء إعلان", submit: "إرسال للمراجعة", draft: "حفظ مسودة", success: "تم الإرسال بانتظار الموافقة." },
    top: { profile: "الملف", logout: "خروج", back: "رجوع" },
    form: {
      title: "العنوان",
      desc: "الوصف",
      category: "التصنيف",
      subcategory: "التصنيف الفرعي",
      price: "السعر",
      currency: "العملة",
      city: "الولاية",
      district: "الحي (أدخل)",
      shipDays: "التسليم المتوقع (أيام)",
      photos: "صور (بحد أقصى 5)",
      showcase: "الواجهة (PRO)",
      choose: "— اختر —",
      pickFiles: "اختر ملفات أو اضغط"
    },
    tips: { filterWarn: "ممنوع مشاركة الهاتف/الإيميل/واتساب.", showcaseNeedPro: "الواجهة تحتاج اشتراك بريميوم." },
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
    errors: {
      needLogin: "الرجاء تسجيل الدخول.",
      needTitle: "العنوان مطلوب.",
      needCategory: "اختر تصنيفًا.",
      needCity: "اختر ولاية.",
      badFilter: "تم الحظر: ",
      uploadFail: "فشل الرفع.",
      saveFail: "فشل الحفظ.",
    },
  },
  de: {
    brand: "Ureten Eller",
    page: { title: "Inserat einstellen", submit: "Zur Prüfung senden", draft: "Entwurf speichern", success: "Inserat gesendet. Wartet auf Freigabe." },
    top: { profile: "Profil", logout: "Abmelden", back: "Zurück" },
    form: {
      title: "Titel",
      desc: "Beschreibung",
      category: "Kategorie",
      subcategory: "Unterkategorie",
      price: "Preis",
      currency: "Währung",
      city: "Stadt",
      district: "Bezirk (eingeben)",
      shipDays: "Lieferzeit (Tage)",
      photos: "Fotos (max. 5)",
      showcase: "Vitrine (PRO)",
      choose: "— Wählen —",
      pickFiles: "Dateien wählen oder klicken"
    },
    tips: { filterWarn: "Keine Telefon/Email/WhatsApp im Text.", showcaseNeedPro: "Vitrine erfordert Premium." },
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
    errors: {
      needLogin: "Bitte anmelden.",
      needTitle: "Titel erforderlich.",
      needCategory: "Kategorie wählen.",
      needCity: "Stadt wählen.",
      badFilter: "Blockiert: ",
      uploadFail: "Upload fehlgeschlagen.",
      saveFail: "Speichern fehlgeschlagen.",
    },
  },
};

function useLang() {
  const [lang, setLang] = useState("tr");
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("lang") : null;
    if (saved && SUPPORTED.includes(saved)) setLang(saved);
  }, []);
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    }
  }, [lang]);
  const t = useMemo(() => LBL[lang] || LBL.tr, [lang]);
  return { lang, setLang, t };
}

/* ---------------------------- KATEGORİLER + 81 İL ---------------------------- */
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

const PROVINCES_TR = [
  "Adana","Adıyaman","Afyonkarahisar","Ağrı","Amasya","Ankara","Antalya","Artvin","Aydın","Balıkesir","Bilecik","Bingöl","Bitlis","Bolu","Burdur","Bursa","Çanakkale","Çankırı","Çorum","Denizli","Diyarbakır","Edirne","Elazığ","Erzincan","Erzurum","Eskişehir","Gaziantep","Giresun","Gümüşhane","Hakkâri","Hatay","Isparta","Mersin","İstanbul","İzmir","Kars","Kastamonu","Kayseri","Kırklareli","Kırşehir","Kocaeli","Konya","Kütahya","Malatya","Manisa","Kahramanmaraş","Mardin","Muğla","Muş","Nevşehir","Niğde","Ordu","Rize","Sakarya","Samsun","Siirt","Sinop","Sivas","Tekirdağ","Tokat","Trabzon","Tunceli","Şanlıurfa","Uşak","Van","Yozgat","Zonguldak","Aksaray","Bayburt","Karaman","Kırıkkale","Batman","Şırnak","Bartın","Ardahan","Iğdır","Yalova","Karabük","Kilis","Osmaniye","Düzce"
];

/* ---------------------------- COMPONENT ---------------------------- */
export default function SellerPost() {
  const router = useRouter();
  const { lang, setLang, t } = useLang();

  const supa = getSupabase();
  const [user, setUser] = useState(null);
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  // Form state
  const catList = CATS[lang] || CATS.tr;
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [cat, setCat] = useState("");
  const [subcat, setSubcat] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("TRY");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [shipDays, setShipDays] = useState(5);
  const [showcase, setShowcase] = useState(false);
  const [files, setFiles] = useState([]); // File[]

  const fileInputRef = useRef(null);

  // Init: user + pro status
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!supa) return;
        const { data: { user } } = await supa.auth.getUser();
        if (!mounted) return;
        if (!user) {
          setErr(t.errors.needLogin);
          setLoading(false);
          setTimeout(() => router.push("/login"), 1200);
          return;
        }
        setUser(user);
        // PRO sorgu
        const { data: prof } = await supa
          .from("users")
          .select("premium_until")
          .eq("auth_user_id", user.id)
          .single();
        const pu = prof?.premium_until ? new Date(prof.premium_until) : null;
        setIsPro(!!pu && pu > new Date());
      } catch (e) {
        // sessiz: PRO false
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [supa, t.errors.needLogin, router]);

  const onPickFiles = (e) => {
    const list = Array.from(e.target.files || []);
    const all = [...files, ...list].slice(0, 5);
    setFiles(all);
  };
  const removeFile = (i) => { setFiles((arr) => arr.filter((_, idx) => idx !== i)); };

  const onSubmit = useCallback(async (mode = "submit") => {
    setMsg(""); setErr("");
    if (!user) { setErr(t.errors.needLogin); return; }
    if (!title.trim()) { setErr(t.errors.needTitle); return; }
    if (!cat) { setErr(t.errors.needCategory); return; }
    if (!city) { setErr(t.errors.needCity); return; }

    try {
      setSaving(true);
      // 1) Metin filtresi (DB fonksiyonu varsa)
      try {
        await supa.rpc("check_listing_text", { p_title: title, p_desc: desc });
      } catch (e) {
        if (e?.message && !/function .* does not exist/i.test(e.message)) {
          throw new Error(t.errors.badFilter + e.message);
        }
      }

      // 2) İlan kaydı → pending
      const payload = {
        seller_auth_id: user.id,
        title: title.trim(),
        description: desc?.trim() || null,
        category: cat || null,
        subcategory: subcat || null,
        price: price ? Number(price) : null,
        currency,
        city,
        district: district?.trim() || null,
        ship_days: shipDays ? Number(shipDays) : null,
        is_showcase: isPro ? !!showcase : false,
        status: "pending",
      };

      const { data: ins, error: insErr } = await supa
        .from("listings")
        .insert([payload])
        .select("id")
        .single();
      if (insErr) throw insErr;
      const listingId = ins?.id;

      // 3) Fotoğraflar → Cloudinary → listing_photos
      if (files.length && CLOUD_NAME && UPLOAD_PRESET) {
        let order = 0;
        for (const f of files) {
          const form = new FormData();
          form.append("file", f);
          form.append("upload_preset", UPLOAD_PRESET);
          const up = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, { method: "POST", body: form });
          if (!up.ok) throw new Error(t.errors.uploadFail);
          const json = await up.json();
          const url = json.secure_url || json.url;
          if (url) {
            await supa.from("listing_photos").insert([{ listing_id: listingId, url, order: order++ }]);
          }
        }
      }

      setMsg(t.page.success);
      setTimeout(() => router.push("/portal/seller"), 900);
    } catch (e) {
      setErr(e?.message || t.errors.saveFail);
    } finally {
      setSaving(false);
    }
  }, [user, title, cat, city, desc, price, currency, district, shipDays, showcase, isPro, files, supa, t, router]);

  const subs = useMemo(() => {
    const c = catList.find((x) => x.title === cat);
    return c?.subs || [];
  }, [catList, cat]);

  return (
    <>
      <Head>
        <title>{LBL.tr.brand} – {t.page.title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* FAVICONS → public/ */}
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="shortcut icon" href="/favicon.png" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#0b0b0b" />
      </Head>

      {/* ÜST BAR */}
      <header className="topbar">
        <div className="brand" onClick={() => router.push("/")}> <img src="/logo.png" width="32" height="32" alt="logo" /> <span>{t.brand}</span> </div>
        <div className="actions">
          <select aria-label="Language" value={lang} onChange={(e)=>{ localStorage.setItem('lang', e.target.value); setLang(e.target.value); }}>
            {SUPPORTED.map((k)=>(<option key={k} value={k}>{k.toUpperCase()}</option>))}
          </select>
          <button className="ghost" onClick={()=>router.push("/profile")}>{t.top.profile}</button>
          <button className="danger" onClick={()=>{ try{ getSupabase()?.auth.signOut(); }catch{}; router.push("/"); }}>{t.top.logout}</button>
        </div>
      </header>

      <main className="wrap">
        <h1 className="title">{t.page.title}</h1>

        <div className="card colored">
          {loading ? (
            <div className="loading">…</div>
          ) : (
            <form onSubmit={(e)=>{ e.preventDefault(); onSubmit("submit"); }}>
              {/* Üst bilgiler */}
              <div className="flex2">
                <div className="field">
                  <label>{t.form.title}</label>
                  <input type="text" value={title} onChange={(e)=>setTitle(e.target.value)} maxLength={120} placeholder="Örn: El emeği makrome duvar süsü" />
                </div>
                <div className="field">
                  <label>{t.form.price}</label>
                  <div className="row">
                    <input type="number" min="0" step="0.01" value={price} onChange={(e)=>setPrice(e.target.value)} placeholder="0" />
                    <select value={currency} onChange={(e)=>setCurrency(e.target.value)}>
                      <option value="TRY">TRY</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="field">
                <label>{t.form.desc}</label>
                <textarea value={desc} onChange={(e)=>setDesc(e.target.value)} rows={5} placeholder="Ürünün hammaddesi, ölçüleri, kişiye özel mi vb." />
                <div className="mini">{t.tips.filterWarn}</div>
              </div>

              <div className="flex2">
                <div className="field">
                  <label>{t.form.category}</label>
                  <select value={cat} onChange={(e)=>{ setCat(e.target.value); setSubcat(""); }}>
                    <option value="" disabled>{t.form.choose}</option>
                    {catList.map((c,i)=>(<option key={i} value={c.title}>{c.icon} {c.title}</option>))}
                  </select>
                </div>
                <div className="field">
                  <label>{t.form.subcategory}</label>
                  <select value={subcat} onChange={(e)=>setSubcat(e.target.value)} disabled={!subs.length}>
                    <option value="" disabled>{t.form.choose}</option>
                    {subs.map((s,i)=>(<option key={i} value={s}>{s}</option>))}
                  </select>
                </div>
              </div>

              <div className="flex2">
                <div className="field">
                  <label>{t.form.city}</label>
                  <select value={city} onChange={(e)=>setCity(e.target.value)}>
                    <option value="" disabled>{t.form.choose}</option>
                    {PROVINCES_TR.map((p)=>(<option key={p} value={p}>{p}</option>))}
                  </select>
                </div>
                <div className="field">
                  <label>{t.form.district}</label>
                  <input type="text" value={district} onChange={(e)=>setDistrict(e.target.value)} placeholder="Örn: Kadıköy" />
                </div>
              </div>

              <div className="flex2">
                <div className="field">
                  <label>{t.form.shipDays}</label>
                  <input type="number" min={1} max={60} value={shipDays} onChange={(e)=>setShipDays(e.target.value)} />
                </div>
                <div className="field">
                  <label>{t.form.showcase}</label>
                  <div className="row">
                    <input type="checkbox" checked={isPro && showcase} onChange={(e)=>setShowcase(e.target.checked)} disabled={!isPro} />
                    {!isPro && <span className="mini">{t.tips.showcaseNeedPro}</span>}
                  </div>
                </div>
              </div>

              {/* Fotoğraflar */}
              <div className="field">
                <label>{t.form.photos}</label>
                <div className="drop" onClick={()=>fileInputRef.current?.click()}>
                  <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={onPickFiles} style={{ display: "none" }} />
                  <div>{t.form.pickFiles}</div>
                </div>
                {!!files.length && (
                  <div className="thumbs">
                    {files.map((f,i)=> (
                      <div key={i} className="thumb">
                        <img src={URL.createObjectURL(f)} alt={`photo-${i}`} />
                        <button type="button" onClick={()=>removeFile(i)} aria-label="remove">×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {err && <div className="err">{err}</div>}
              {msg && <div className="msg">{msg}</div>}

              <div className="actions">
                <button type="button" className="ghost" disabled={saving} onClick={()=>onSubmit("draft")}>
                  {t.page.draft}
                </button>
                <button type="submit" className="primary" disabled={saving}>{saving ? "…" : t.page.submit}</button>
              </div>
            </form>
          )}
        </div>
      </main>

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

      <style jsx>{`
        :root{ --ink:#0f172a; --muted:#475569; --line:rgba(0,0,0,.08); }
        html,body,#__next{height:100%}
        body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial,sans-serif;color:var(--ink)}

        /* Full sayfa degrade arka plan */
        .wrap{min-height:calc(100vh - 120px);padding:20px; background:
          radial-gradient(1200px 600px at 10% -10%, #ffe4e6, transparent),
          radial-gradient(900px 500px at 90% -10%, #e0e7ff, transparent),
          linear-gradient(120deg,#ff80ab,#a78bfa,#60a5fa,#34d399);}        

        .topbar{position:sticky;top:0;z-index:40;display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center; padding:10px 14px; background:rgba(255,255,255,.92);backdrop-filter:blur(8px);border-bottom:1px solid var(--line)}
        .brand{display:flex;align-items:center;gap:8px;font-weight:900;cursor:pointer}
        .actions{display:flex;gap:8px;align-items:center}
        .ghost{border:1px solid #111827;background:transparent;color:#111827;border-radius:10px;padding:8px 12px;font-weight:700;cursor:pointer}
        .danger{border:1px solid #111827;background:#111827;color:#fff;border-radius:10px;padding:8px 12px;font-weight:800;cursor:pointer}

        .title{margin:8px 0 12px;font-size:28px;color:#0f172a;text-shadow:0 8px 28px rgba(0,0,0,.15)}

        .card{border-radius:20px; padding:18px; box-shadow:0 18px 50px rgba(0,0,0,.18)}
        .card.colored{color:#fff; background:linear-gradient(135deg,#111827,#3b82f6 35%, #a78bfa 70%, #34d399)}
        form{display:grid;gap:14px}
        .flex2{display:grid;gap:14px;grid-template-columns:repeat(2,1fr)}
        @media (max-width:720px){ .flex2{grid-template-columns:1fr} }

        .field{display:grid;gap:6px}
        .field label{font-weight:800}
        .field input[type="text"],
        .field input[type="number"],
        .field textarea,
        .field select{
          border:1px solid rgba(255,255,255,.25);
          background:rgba(255,255,255,.12);
          color:#fff;
          border-radius:12px; padding:10px; outline:none;
        }
        .field textarea{resize:vertical}
        .row{display:flex;gap:8px;align-items:center}
        .mini{font-size:12px;opacity:.9}

        .drop{display:grid;place-items:center;gap:6px;border:1px dashed rgba(255,255,255,.4);border-radius:14px;padding:14px;cursor:pointer;}
        .thumbs{display:flex;gap:10px;flex-wrap:wrap;margin-top:10px}
        .thumb{position:relative;width:120px;height:90px;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,.25)}
        .thumb img{width:100%;height:100%;object-fit:cover}
        .thumb button{position:absolute;top:4px;right:4px;border:none;background:rgba(0,0,0,.5);color:#fff;border-radius:999px;width:22px;height:22px;cursor:pointer}

        .actions{display:flex;gap:8px;justify-content:flex-end}
        .primary{border:1px solid #111827;background:#111827;color:#fff;border-radius:10px;padding:10px 14px;font-weight:800;cursor:pointer}

        .err{background:rgba(239,68,68,.15);border:1px solid rgba(239,68,68,.4);color:#fff;padding:10px;border-radius:12px}
        .msg{background:rgba(16,185,129,.15);border:1px solid rgba(16,185,129,.4);color:#fff;padding:10px;border-radius:12px}

        /* LEGAL */
        .legal{background:#0b0b0b;color:#f8fafc;border-top:1px solid rgba(255,255,255,.12);width:100vw;margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);margin-top:18px}
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
