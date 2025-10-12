// pages/portal/seller/index.jsx
"use client";
import React, { useState, useMemo, useEffect } from "react";

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
    mottos: [
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
      { text: "Uygun fiyat, güvenli süreç, mutlu son.", color: "#ec4899" }
    ],
    showcase: "Vitrin",
    standard: "Standart İlanlar",
    categories: "Kategorilerimiz",
    empty: "Henüz ilan yok.",
    tabs: { home: "Ana Sayfa", messages: "Mesajlar", notifs: "Bildirimler" },
    chat: { title: "Canlı Destek", helloYou: "Merhaba! Nasıl yardımcı olabilirim?", helloMe: "Merhaba 👋", placeholder: "Mesaj yazın...", send: "Gönder" },
    legal: {
      corporate: "Kurumsal", about: "Hakkımızda", contact: "İletişim", privacy: "Gizlilik", kvkk: "KVKK Aydınlatma",
      terms: "Kullanım Şartları", distance: "Mesafeli Satış", delivery: "Teslimat & İade", cookie: "Çerez Politikası",
      community: "Topluluk Kuralları", prohibited: "Yasaklı Ürünler", all: "Tüm Legal"
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
    mottos: [
      { text: "Our aim: support homemakers' budgets.", color: "#e11d48" },
      { text: "Let women's labor be valued.", color: "#c026d3" },
      { text: "Handmade products at fair prices.", color: "#7c3aed" },
      { text: "Neighborhood flavors to your doorstep.", color: "#2563eb" },
      { text: "Fresh production from skilled hands.", color: "#0ea5e9" },
      { text: "Platform assurance on every order.", color: "#14b8a6" },
      { text: "Big support for small producers.", color: "#059669" },
      { text: "Transparent pricing, clear delivery.", color: "#16a34a" },
      { text: "Secure payment, easy returns.", color: "#65a30d" },
      { text: "Buy local, boost the economy.", color: "#ca8a04" },
      { text: "Fair pay for labor, value for customers.", color: "#d97706" },
      { text: "Homemade tastes, handcrafted beauties.", color: "#ea580c" },
      { text: "Careful production in every category.", color: "#f97316" },
      { text: "Seamless tracking from order to delivery.", color: "#f59e0b" },
      { text: "Trusted seller badges.", color: "#eab308" },
      { text: "Stronger with our community.", color: "#84cc16" },
      { text: "Support for sustainable production.", color: "#22c55e" },
      { text: "Fair trade, happy customers.", color: "#10b981" },
      { text: "Respect for craft, budget-friendly prices.", color: "#06b6d4" },
      { text: "We grow with women's labor.", color: "#3b82f6" },
      { text: "Fresh production from your city, shop with confidence.", color: "#6366f1" },
      { text: "Quality, care and transparency.", color: "#8b5cf6" },
      { text: "The handmade you need is here.", color: "#d946ef" },
      { text: "Good prices, safe process, happy outcome.", color: "#ec4899" }
    ],
    showcase: "Showcase",
    standard: "Standard Listings",
    categories: "Our Categories",
    empty: "No listings yet.",
    tabs: { home: "Home", messages: "Messages", notifs: "Notifications" },
    chat: { title: "Live Support", helloYou: "Hello! How can I help?", helloMe: "Hello 👋", placeholder: "Type a message...", send: "Send" },
    legal: {
      corporate: "Corporate", about: "About", contact: "Contact", privacy: "Privacy", kvkk: "PDPL (KVKK) Notice",
      terms: "Terms of Use", distance: "Distance Sales", delivery: "Delivery & Returns", cookie: "Cookie Policy",
      community: "Community Guidelines", prohibited: "Prohibited Items", all: "All Legal"
    },
    cats: [
      { key: "food", icon: "🍲", bg: "linear-gradient(135deg,#ff80ab,#ffd166)", title: "Food", subs: ["Home-cooked meals","Börek & pastries","Soup","Olive-oil dishes","Rice & pasta","Meat & chicken","Breakfast items","Meze","Frozen","Kids' meals","Diet/vegan/GF"] },
      { key: "cake", icon: "🎂", bg: "linear-gradient(135deg,#a78bfa,#60a5fa)", title: "Cakes & Desserts", subs: ["Layer cakes","Cakes & cupcakes","Cookies","Syrupy desserts","Milk-based desserts","Cheesecake","Diet desserts","Chocolate/candy","Birthday sets"] },
      { key: "jam", icon: "🫙", bg: "linear-gradient(135deg,#34d399,#a7f3d0)", title: "Jam • Pickle • Sauce", subs: ["Jam & marmalade","Molasses (pekmez)","Pickles","Tomato/pepper sauce","Hot sauce","Tomato paste","Vinegar","Canned goods"] },
      { key: "local", icon: "🌾", bg: "linear-gradient(135deg,#f59e0b,#f97316)", title: "Local / Pantry Staples", subs: ["Homemade noodles (erişte)","Tarhana","Yufka","Mantı","Dried veg/fruit","Tomato paste","Vinegar","Canned"] },
      { key: "diet", icon: "🥗", bg: "linear-gradient(135deg,#06b6d4,#3b82f6)", title: "Diet / Vegan / Gluten-free", subs: ["Fit plates","Vegan meals","GF baked goods","Sugar-free desserts","Keto products","Protein snacks"] },
      { key: "jewelry", icon: "💍", bg: "linear-gradient(135deg,#ff80ab,#ffd166)", title: "Jewelry", subs: ["Bracelet","Necklace","Earrings","Ring","Anklet","Brooch","Sets","Personalized","Macrame","Natural stone","Resin","Wire wrap"] },
      { key: "kids", icon: "👶", bg: "linear-gradient(135deg,#a78bfa,#60a5fa)", title: "Baby & Child", subs: ["Animal/baby figures","Rattle","Crochet teether","Cloth toy/book","Montessori toy","Sets","Knitted booties-hat","Baby blanket","Bib & burp cloth","Maternity set","Hair accessory","Handmade clothing"] },
      { key: "knit", icon: "🧶", bg: "linear-gradient(135deg,#34d399,#a7f3d0)", title: "Knitwear", subs: ["Cardigan","Sweater","Scarf & beanie","Poncho","Shawl","Socks","Baby set","Vest","Cushion/throw","Bath set"] },
      { key: "sew", icon: "✂️", bg: "linear-gradient(135deg,#f59e0b,#f97316)", title: "Sewing / Tailoring", subs: ["Hems/repairs","Zipper replacement","Curtain sewing","Duvet/pillow","Tablecloth","Custom tailoring","Costume"] },
      { key: "macrame", icon: "🧵", bg: "linear-gradient(135deg,#06b6d4,#3b82f6)", title: "Macrame & Decor", subs: ["Wall hanging","Plant hanger","Keychain","Chandelier","Placemat/runner","Basket","Shelf/wall decor"] },
      { key: "home", icon: "🏠", bg: "linear-gradient(135deg,#ff80ab,#ffd166)", title: "Home Decor & Accessories", subs: ["Felt crafts","Cushion","Door wreath","Tray decoration","Frame","Dreamcatcher","Painting"] },
      { key: "candle", icon: "🕯️", bg: "linear-gradient(135deg,#a78bfa,#60a5fa)", title: "Candles & Fragrances", subs: ["Soy/beeswax candle","Scented stone","Room spray","Incense","Gel candle","Gift set"] },
      { key: "soap", icon: "🧼", bg: "linear-gradient(135deg,#34d399,#a7f3d0)", title: "Natural Soap & Cosmetics", subs: ["Olive-oil soap","Herbal soaps","Solid shampoo","Lip balm","Cream/ointment","Bath salts","Lavender sachet"] },
      { key: "amigurumi", icon: "🧸", bg: "linear-gradient(135deg,#f59e0b,#f97316)", title: "Amigurumi & Toys (decorative)", subs: ["Keychain","Magnet","Collector figure","Decor doll/character","Name-custom amigurumi"] }
    ]
  },
  ar: {
    brand: "Üreten Eller",
    profile: "الملف الشخصي",
    logout: "تسجيل الخروج",
    search: "البحث في الإعلانات",
    postAd: "أضف إعلانًا",
    heroTitle: "مرحبًا بكم في Üreten Eller",
    mottos: [
      { text: "هدفنا: دعم ميزانية ربات البيوت.", color: "#e11d48" },
      { text: "ليُقَدَّر عمل المرأة.", color: "#c026d3" },
      { text: "منتجات يدوية بأسعار عادلة.", color: "#7c3aed" },
      { text: "نكهات الحي إلى بابك.", color: "#2563eb" },
      { text: "إنتاج طازج بأيدي خبيرة.", color: "#0ea5e9" },
      { text: "ضمان المنصّة مع كل طلب.", color: "#14b8a6" },
      { text: "دعم كبير للمنتِج الصغير.", color: "#059669" },
      { text: "سعر شفاف، تسليم واضح.", color: "#16a34a" },
      { text: "دفع آمن، إرجاع سهل.", color: "#65a30d" },
      { text: "اشترِ المحليّ، وانعش الاقتصاد.", color: "#ca8a04" },
      { text: "أجر عادل للعمل، وقيمة للعميل.", color: "#d97706" },
      { text: "نكهات منزلية، وجماليات مصنوعة يدويًا.", color: "#ea580c" },
      { text: "إنتاج مُتقَن في كل فئة.", color: "#f97316" },
      { text: "تتبّع سلس من الطلب حتى التسليم.", color: "#f59e0b" },
      { text: "شارات بائع موثوق.", color: "#eab308" },
      { text: "نقوى مع مجتمعنا.", color: "#84cc16" },
      { text: "دعم للإنتاج المستدام.", color: "#22c55e" },
      { text: "تجارة عادلة، عملاء سعداء.", color: "#10b981" },
      { text: "احترام للحِرفة وأسعار مناسبة للميزانية.", color: "#06b6d4" },
      { text: "ننمو بجهد النساء.", color: "#3b82f6" },
      { text: "إنتاج طازج من مدينتك وتسوق بثقة.", color: "#6366f1" },
      { text: "جودة وعناية وشفافية.", color: "#8b5cf6" },
      { text: "الحِرف اليدوية التي تحتاجها هنا.", color: "#d946ef" },
      { text: "سعر مناسب، عملية آمنة، ونتيجة سعيدة.", color: "#ec4899" }
    ],
    showcase: "الواجهة المميزة",
    standard: "إعلانات عادية",
    categories: "فئاتنا",
    empty: "لا يوجد إعلانات بعد.",
    tabs: { home: "الرئيسية", messages: "الرسائل", notifs: "الإشعارات" },
    chat: { title: "الدعم المباشر", helloYou: "مرحبًا! كيف أستطيع المساعدة؟", helloMe: "مرحبًا 👋", placeholder: "اكتب رسالة...", send: "إرسال" },
    legal: {
      corporate: "الشركة", about: "من نحن", contact: "اتصال", privacy: "الخصوصية", kvkk: "إشعار KVKK",
      terms: "شروط الاستخدام", distance: "البيع عن بُعد", delivery: "التسليم والإرجاع", cookie: "سياسة ملفات تعريف الارتباط",
      community: "إرشادات المجتمع", prohibited: "السلع المحظورة", all: "جميع الصفحات القانونية"
    },
    cats: [
      { key: "food", icon: "🍲", bg: "linear-gradient(135deg,#ff80ab,#ffd166)", title: "الأطعمة", subs: ["أطعمة منزلية","بورك ومعجنات","شوربة","أطباق بزيت الزيتون","أرز ومعكرونة","لحوم ودجاج","فطور","مقبلات","مجمدات","وجبات للأطفال","دايت/نباتي/خالٍ من الغلوتين"] },
      { key: "cake", icon: "🎂", bg: "linear-gradient(135deg,#a78bfa,#60a5fa)", title: "كيك وحلويات", subs: ["كعكات طبقات","كيك وكب كيك","بسكويت","حلويات شرابية","حلويات بالحليب","تشيزكيك","حلويات دايت","شوكولاتة/حلوى","مجموعات عيد الميلاد"] },
      { key: "jam", icon: "🫙", bg: "linear-gradient(135deg,#34d399,#a7f3d0)", title: "مربى • مخللات • صلصات", subs: ["مربى ومارمالاد","دبس (بكميز)","مخللات","صلصة طماطم/فلفل","صلصة حارة","معجون طماطم","خل","معلبات"] },
      { key: "local", icon: "🌾", bg: "linear-gradient(135deg,#f59e0b,#f97316)", title: "منتجات محلية / مؤن", subs: ["معكرونة منزلية (إريشته)","طرخانة","يوفكا","مانتي","خضار/فاكهة مجففة","معجون طماطم","خل","معلبات"] },
      { key: "diet", icon: "🥗", bg: "linear-gradient(135deg,#06b6d4,#3b82f6)", title: "دايت / نباتي / خالٍ من الغلوتين", subs: ["أطباق لياقة","وجبات نباتية","مخبوزات GF","حلويات بدون سكر","منتجات كيتو","سناك بروتين"] },
      { key: "jewelry", icon: "💍", bg: "linear-gradient(135deg,#ff80ab,#ffd166)", title: "مجوهرات", subs: ["أساور","قلادات","أقراط","خواتم","خلخال","بروش","أطقم","مخصصة بالاسم","مكرمية","أحجار طبيعية","ريزين","لفّ سلكي"] },
      { key: "kids", icon: "👶", bg: "linear-gradient(135deg,#a78bfa,#60a5fa)", title: "رضّع وأطفال", subs: ["مجسّمات حيوانات/أطفال","خشخاشة","عضّاضة كروشيه","دمى/كتب قماش","ألعاب منتسوري","أطقم","بوت/قبعة محبوكة","بطانية أطفال","مريلة/قطعة تجفيف","طقم نفاس","إكسسوارات شعر","ملابس يدوية"] },
      { key: "knit", icon: "🧶", bg: "linear-gradient(135deg,#34d399,#a7f3d0)", title: "حياكة/تريكو", subs: ["كارديغان","كنزة","وشاح/قبعة","بونشو","شال","جوارب","طقم أطفال","صديري","غلاف وسادة/بطانية","طقم حمّام"] },
      { key: "sew", icon: "✂️", bg: "linear-gradient(135deg,#f59e0b,#f97316)", title: "خياطة / تفصيل", subs: ["تقصير/تصليح","تبديل سحّاب","خياطة ستائر","أغطية/وسائد","مفرش طاولة","تفصيل خاص","زيّ تنكري"] },
      { key: "macrame", icon: "🧵", bg: "linear-gradient(135deg,#06b6d4,#3b82f6)", title: "مكرمية وديكور", subs: ["تعليق جداري","حامل نبات","ميدالية مفاتيح","ثريا","مفرش/رانر","سلّة","رف/ديكور جداري"] },
      { key: "home", icon: "🏠", bg: "linear-gradient(135deg,#ff80ab,#ffd166)", title: "ديكور المنزل وإكسسواراته", subs: ["أعمال لباد","وسادة","إكليل الباب","تزيين صينية","إطار","صائد أحلام","لوحة"] },
      { key: "candle", icon: "🕯️", bg: "linear-gradient(135deg,#a78bfa,#60a5fa)", title: "شموع ومنتجات عطرية", subs: ["شموع صويا/شمع نحل","حجر عطري","معطر غرف","بخور","شمعة جل","طقم هدايا"] },
      { key: "soap", icon: "🧼", bg: "linear-gradient(135deg,#34d399,#a7f3d0)", title: "صابون طبيعي ومستحضرات", subs: ["صابون بزيت الزيتون","صوابين عشبية","شامبو صلب","بلسم شفاه","كريم/مرهم","أملاح حمام","أكياس خزامى"] },
      { key: "amigurumi", icon: "🧸", bg: "linear-gradient(135deg,#f59e0b,#f97316)", title: "أميغورومي وألعاب (ديكورية)", subs: ["ميدالية مفاتيح","مغناطيس","مجسمات تجميع","دمية/شخصية ديكورية","أميغورومي بالاسم"] }
    ]
  },
  de: {
    brand: "Üreten Eller",
    profile: "Profil",
    logout: "Abmelden",
    search: "Anzeigen suchen",
    postAd: "Anzeige aufgeben",
    heroTitle: "Willkommen bei Üreten Eller",
    mottos: [
      { text: "Unser Ziel: das Haushaltsbudget von Frauen unterstützen.", color: "#e11d48" },
      { text: "Frauenarbeit soll wertgeschätzt werden.", color: "#c026d3" },
      { text: "Handgefertigte Produkte zu fairen Preisen.", color: "#7c3aed" },
      { text: "Geschmäcker aus deinem Viertel bis an die Haustür.", color: "#2563eb" },
      { text: "Frische Produktion aus Meisterhand.", color: "#0ea5e9" },
      { text: "Plattform-Garantie bei jeder Bestellung.", color: "#14b8a6" },
      { text: "Große Unterstützung für kleine Produzenten.", color: "#059669" },
      { text: "Transparente Preise, klare Lieferung.", color: "#16a34a" },
      { text: "Sichere Zahlung, einfache Rückgabe.", color: "#65a30d" },
      { text: "Kauf lokal, stärke die Wirtschaft.", color: "#ca8a04" },
      { text: "Faire Entlohnung der Arbeit, Mehrwert für Kund:innen.", color: "#d97706" },
      { text: "Hausgemachte Geschmäcker, handgefertigte Schönheiten.", color: "#ea580c" },
      { text: "Sorgfältige Produktion in jeder Kategorie.", color: "#f97316" },
      { text: "Nahtloses Tracking von Bestellung bis Lieferung.", color: "#f59e0b" },
      { text: "Abzeichen für verlässliche Verkäufer:innen.", color: "#eab308" },
      { text: "Mit unserer Community sind wir stärker.", color: "#84cc16" },
      { text: "Unterstützung für nachhaltige Produktion.", color: "#22c55e" },
      { text: "Fairer Handel, zufriedene Kundschaft.", color: "#10b981" },
      { text: "Respekt fürs Handwerk, preiswert für dein Budget.", color: "#06b6d4" },
      { text: "Wir wachsen durch die Arbeit von Frauen.", color: "#3b82f6" },
      { text: "Frische Produkte aus deiner Stadt – sicher einkaufen.", color: "#6366f1" },
      { text: "Qualität, Sorgfalt und Transparenz.", color: "#8b5cf6" },
      { text: "Das Handgemachte, das du brauchst, ist hier.", color: "#d946ef" },
      { text: "Guter Preis, sicherer Prozess, gutes Ergebnis.", color: "#ec4899" }
    ],
    showcase: "Schaufenster",
    standard: "Standardanzeigen",
    categories: "Kategorien",
    empty: "Noch keine Anzeigen.",
    tabs: { home: "Startseite", messages: "Nachrichten", notifs: "Benachrichtigungen" },
    chat: { title: "Live-Support", helloYou: "Hallo! Wie kann ich helfen?", helloMe: "Hallo 👋", placeholder: "Nachricht schreiben...", send: "Senden" },
    legal: {
      corporate: "Unternehmen", about: "Über uns", contact: "Kontakt", privacy: "Datenschutz", kvkk: "KVKK-Hinweis",
      terms: "Nutzungsbedingungen", distance: "Fernabsatz", delivery: "Lieferung & Rückgabe", cookie: "Cookie-Richtlinie",
      community: "Community-Richtlinien", prohibited: "Verbotene Artikel", all: "Alle Rechtstexte"
    },
    cats: [
      { key: "food", icon: "🍲", bg: "linear-gradient(135deg,#ff80ab,#ffd166)", title: "Speisen", subs: ["Hausmannskost","Börek & Gebäck","Suppe","Gerichte mit Olivenöl","Reis & Pasta","Fleisch & Hähnchen","Frühstück","Meze","Tiefgekühlt","Kindergerichte","Diät/vegan/glutenfrei"] },
      { key: "cake", icon: "🎂", bg: "linear-gradient(135deg,#a78bfa,#60a5fa)", title: "Kuchen & Süßes", subs: ["Torten","Kuchen & Cupcakes","Kekse","Sirup-Desserts","Milch-Desserts","Käsekuchen","Diät-Desserts","Schokolade/Bonbons","Geburtstags-Sets"] },
      { key: "jam", icon: "🫙", bg: "linear-gradient(135deg,#34d399,#a7f3d0)", title: "Marmelade • Pickles • Saucen", subs: ["Marmelade","Pekmez (Traubensirup)","Eingelegtes","Tomaten-/Paprikasauce","Scharfe Sauce","Tomatenmark","Essig","Konserven"] },
      { key: "local", icon: "🌾", bg: "linear-gradient(135deg,#f59e0b,#f97316)", title: "Regional / Vorrat", subs: ["Erişte (Hausnudeln)","Tarhana","Yufka","Mantı","Getrocknetes Obst/Gemüse","Tomatenmark","Essig","Konserven"] },
      { key: "diet", icon: "🥗", bg: "linear-gradient(135deg,#06b6d4,#3b82f6)", title: "Diät / Vegan / Glutenfrei", subs: ["Fitness-Teller","Vegane Gerichte","GF Backwaren","Zuckerfreie Desserts","Keto-Produkte","Protein-Snacks"] },
      { key: "jewelry", icon: "💍", bg: "linear-gradient(135deg,#ff80ab,#ffd166)", title: "Schmuck", subs: ["Armband","Kette","Ohrringe","Ring","Fußkettchen","Brosche","Sets","Personalisiert","Makramee","Naturstein","Harz","Drahtwickel"] },
      { key: "kids", icon: "👶", bg: "linear-gradient(135deg,#a78bfa,#60a5fa)", title: "Baby & Kind", subs: ["Tier-/Babyfiguren","Rassel","Beißring (gehäkelt)","Stoffspielzeug/-buch","Montessori-Spielzeug","Sets","Booties-Mütze (gestrickt)","Babydecke","Lätzchen & Spucktuch","Wochenbett-Set","Haar-Accessoires","Handgemachte Kleidung"] },
      { key: "knit", icon: "🧶", bg: "linear-gradient(135deg,#34d399,#a7f3d0)", title: "Strick/Trikot", subs: ["Cardigan","Pullover","Schal & Mütze","Poncho","Tuch","Socken","Baby-Set","Weste","Kissenbezug/Decke","Bade-Set"] },
      { key: "sew", icon: "✂️", bg: "linear-gradient(135deg,#f59e0b,#f97316)", title: "Nähen / Schneiderei", subs: ["Saum/Reparaturen","Reißverschlusswechsel","Vorhänge nähen","Bettwäsche/Kissen","Tischdecke","Maßanfertigung","Kostüm"] },
      { key: "macrame", icon: "🧵", bg: "linear-gradient(135deg,#06b6d4,#3b82f6)", title: "Makramee & Deko", subs: ["Wandbehang","Pflanzenhänger","Schlüsselanhänger","Deckenlampe","Platzset/Läufer","Korb","Regal/Wanddeko"] },
      { key: "home", icon: "🏠", bg: "linear-gradient(135deg,#ff80ab,#ffd166)", title: "Wohn-Deko & Accessoires", subs: ["Filzarbeiten","Kissen","Türkranz","Tablett-Deko","Rahmen","Traumfänger","Bild"] },
      { key: "candle", icon: "🕯️", bg: "linear-gradient(135deg,#a78bfa,#60a5fa)", title: "Kerzen & Duft", subs: ["Soja/Bienenwachs-Kerze","Duftstein","Raumspray","Weihrauch","Gelkerze","Geschenk-Set"] },
      { key: "soap", icon: "🧼", bg: "linear-gradient(135deg,#34d399,#a7f3d0)", title: "Naturseife & Kosmetik", subs: ["Olivenölseife","Kräuterseifen","Festes Shampoo","Lippenbalsam","Creme/Salbe","Badesalz","Lavendelsäckchen"] },
      { key: "amigurumi", icon: "🧸", bg: "linear-gradient(135deg,#f59e0b,#f97316)", title: "Amigurumi & Spielzeug (dekorativ)", subs: ["Schlüsselanhänger","Magnet","Sammlerfigur","Deko-Puppe/Charakter","Amigurumi mit Namen"] }
    ]
  }
};

export default function SellerHome() {
  const [lang, setLang] = useState("tr");
  const t = useMemo(() => STR[lang], [lang]);

  // 5 saniyede bir motto döndür
  const [motIdx, setMotIdx] = useState(0);
  const motLen = t.mottos.length;
  useEffect(() => setMotIdx(0), [lang]); // dil değişince başa dön
  useEffect(() => {
    const id = setInterval(() => setMotIdx(i => (i + 1) % motLen), 5000);
    return () => clearInterval(id);
  }, [motLen, lang]);

  const currentMotto = t.mottos[motIdx];

  return (
    <div lang={lang} dir={lang === "ar" ? "rtl" : "ltr"}>
      <header className="topbar">
        <a className="brand" href="/">
          <img src="/logo.png" width={36} height={36} alt="logo" />
          <span>{t.brand}</span>
        </a>
        <div className="actions">
          <div className="userGroup">
            <a className="ghost" href="/portal/seller/profile/" aria-label={t.profile}>{t.profile}</a>
            <a className="danger" href="/login" aria-label={t.logout}>{t.logout}</a>
          </div>
          <div className="actionGroup">
            <a className="ghost" href="/portal/seller?tab=search" aria-label={t.search}>{t.search}</a>
            {/* JS olmasa bile çalışsın */}
            <a className="primary" href="/portal/seller/post/" aria-label={t.postAd}>{t.postAd}</a>
          </div>
          <select aria-label="Language" value={lang} onChange={(e) => setLang(e.target.value)}>
            {SUPPORTED.map(k => (<option key={k} value={k}>{LOCALE_LABEL[k]}</option>))}
          </select>
        </div>
      </header>

      <section className="hero">
        <h1 className="heroTitle">{t.heroTitle}</h1>

        {/* Tek satır – 5 sn'de bir değişir */}
        <div className="mottoWrap" aria-live="polite" role="status">
          <div key={`${lang}-${motIdx}`} className="mottoLine" style={{ color: currentMotto.color }}>
            {currentMotto.text}
          </div>
        </div>
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
            <article key={cat.key} className="catCard" style={{ background: cat.bg }}>
              <div className="head"><span className="icn">{cat.icon}</span><h3>{cat.title}</h3></div>
              <div className="subs">
                {cat.subs.map((s, i) => (<span key={i} className="chip">{s}</span>))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <nav className="bottombar" aria-label="Bottom Navigation">
        <a className="tab active" href="/portal/seller" aria-label={t.tabs.home}><span className="tIc">🏠</span><span>{t.tabs.home}</span></a>
        <a className="tab" href="/portal/seller?tab=messages" aria-label={t.tabs.messages}><span className="tIc">💬</span><span>{t.tabs.messages}</span></a>
        <a className="tab" href="/portal/seller?tab=notifications" aria-label={t.tabs.notifs}><span className="tIc">🔔</span><span>{t.tabs.notifs}</span></a>
      </nav>

      <button
        className="chatBtn"
        onClick={(e) => {
          e.preventDefault();
          const win = document.querySelector(".chatWin");
          if (win) win.classList.toggle("open");
        }}
      >
        💬
      </button>

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
          <div className="copy">© 2025 {t.brand}</div>
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

        .topbar{position:sticky;top:0;z-index:50;display:grid;grid-template-columns:1fr auto;gap:12px;align-items:center;
          padding:10px 14px;background:rgba(255,255,255,.92);backdrop-filter:blur(8px);border-bottom:1px solid var(--line)}
        .brand{display:flex;align-items:center;gap:8px;font-weight:900;text-decoration:none;color:inherit}
        .actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center;justify-content:flex-end}
        .userGroup{display:flex;gap:8px;order:1}
        .actionGroup{display:flex;gap:8px;order:2}
        .ghost,.primary,.danger{border:1px solid #111827;background:#fff;border-radius:10px;padding:8px 12px;font-weight:700;cursor:pointer;text-decoration:none;display:inline-block}
        .primary,.danger{background:#111827;color:#fff}
        .actions select{border:1px solid var(--line);border-radius:10px;padding:6px 8px;background:#fff}
        @media (min-width:640px){ .actionGroup{order:1} .actions{flex-wrap:nowrap} }

        .hero{display:grid;place-items:center;text-align:center;gap:8px;max-width:1100px;margin:12px auto 0;padding:12px 16px}
        .heroTitle{margin:0;font-size:42px;line-height:1.15;letter-spacing:.2px;text-shadow:0 8px 28px rgba(0,0,0,.15)}
        @media (max-width:520px){ .heroTitle{font-size:34px} }

        /* Dönen motto */
        .mottoWrap{min-height:28px;margin-top:6px}
        .mottoLine{margin:0;font-weight:700;animation:fadeIn .35s ease}
        @keyframes fadeIn{from{opacity:0; transform: translateY(4px)} to{opacity:1; transform:none}}

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

        .bottombar{position:sticky;bottom:0;z-index:40;display:grid;grid-template-columns:repeat(3,1fr);gap:6px;padding:6px;
          background:rgba(255,255,255,.94);backdrop-filter:blur(8px);border-top:1px solid var(--line)}
        .tab{display:flex;flex-direction:column;align-items:center;gap:2px;padding:8px;border-radius:10px;border:1px solid transparent;background:transparent;cursor:pointer;font-weight:700;text-decoration:none;color:inherit}
        .tab.active{border-color:#111827;background:#111827;color:#fff}
        .tIc{font-size:16px}

        .chatBtn{position:fixed;right:16px;bottom:76px;z-index:60;background:#111827;color:#fff;border:none;border-radius:999px;
          width:54px;height:54px;cursor:pointer;box-shadow:0 10px 26px rgba(0,0,0,.18);font-size:20px}
        .chatWin{position:fixed;right:16px;bottom:140px;z-index:60;width:320px;max-width:calc(100vw - 32px);
          background:#fff;border:1px solid #e5e7eb;border-radius:16px;box-shadow:0 24px 60px rgba(0,0,0,.18);overflow:hidden;display:none}
        .chatWin.open{display:block}
        .chatHd{padding:10px 12px;font-weight:900;border-bottom:1px solid #e5e7eb;background:#111827;color:#fff}
        .chatBd{max-height:300px;overflow:auto;padding:10px;display:flex;flex-direction:column;gap:8px}
        .msg{padding:8px 10px;border-radius:12px;max-width:80%}
        .msg.me{align-self:flex-end;background:#111827;color:#fff}
        .msg.you{align-self:flex-start;background:#f1f5f9}
        .chatFt{display:flex;gap:6px;padding:10px;border-top:1px solid #e5e7eb}
        .chatFt input[type='text']{flex:1;border:1px solid #e5e7eb;border-radius:10px;padding:8px}
        .send{border:1px solid #111827;background:#111827;color:#fff;border-radius:10px;padding:8px 12px;font-weight:800;cursor:pointer}

        .legal{background:#0b0b0b;color:#f8fafc;border-top:1px solid rgba(255,255,255,.12);width:100vw;margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);margin-top:14px}
        .inner{max-width:1100px;margin:0 auto;padding:12px 16px}
        .ttl{font-weight:800;margin-bottom:6px}
        .links{display:flex;flex-wrap:wrap;gap:10px}
        .links a{color:#e2e8f0;font-size:13px;padding:6px 8px;border-radius:8px;text-decoration:none}
        .links a:hover{background:rgba(255,255,255,.08);color:#fff}
        .homeLink{margin-left:auto;font-weight:800}
        .copy{margin-top:6px;font-size:12px;color:#cbd5e1}
      `}</style>
    </div>
  );
}
