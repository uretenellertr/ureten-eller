"use client";
import React from "react";

// İLAN VERME SAYFASI — TEMİZ SÜRÜM (derleme hatası yok)
// - 4 dil (TR/EN/AR/DE)
// - İl dropdown (alfabetik TR), İlçe manuel
// - 5 foto limit, küfür filtresi
// - PRO/Standart kota & ücret hesabı
// - Vitrin (PRO 1 ücretsiz/ay)
// - Admin onay akışı + ödeme yönlendirme

export default function Page(){
  // === STATE ===
  const [lang, setLang] = React.useState("tr");
  const [uid, setUid] = React.useState(null);
  const [isPro, setIsPro] = React.useState(false);
  const [adsThisMonth, setAdsThisMonth] = React.useState(0);
  const [showcaseThisMonth, setShowcaseThisMonth] = React.useState(0);

  const [catKey, setCatKey] = React.useState("food");
  const [subcat, setSubcat] = React.useState("");
  const [city, setCity] = React.useState("İstanbul");
  const [district, setDistrict] = React.useState("");
  const [listingType, setListingType] = React.useState("standard");

  const [title, setTitle] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [photos, setPhotos] = React.useState([]);
  const [uploading, setUploading] = React.useState(false);
  const [payWarn, setPayWarn] = React.useState("");

  const SUPPORTED = ["tr","en","ar","de"];
  const DIR = lang === "ar" ? "rtl" : "ltr";

  // === I18N ===
  const STR = {
    tr:{ BRAND:"ÜRETEN ELLER", PAGE_TITLE:"İLAN VER", SUBTITLE:"Foto → başlık → açıklama → kategori → alt kategori → il → ilçe → fiyat.",
      MEMBERSHIP:"Üyelik", PRO:"PRO", STANDARD:"STANDART", REMAINING:"Kalan kota", ADS_THIS_MONTH:"Bu ayki ilan sayınız", SHOWCASE_THIS_MONTH:"Bu ayki vitrin sayınız",
      CATEGORY:"Kategori", SUBCATEGORY:"Alt Kategori", CITY:"İl", DISTRICT:"İlçe", LISTING_TYPE:"İlan Tipi", STANDARD_L:"Standart", SHOWCASE_L:"Vitrin",
      TITLE:"Başlık", PRICE:"Fiyat (TL)", DESC:"Açıklama", PHOTOS:"Fotoğraflar (en fazla 5)", DRAG:"Dosyaları sürükleyin ya da tıklayın",
      ESTIMATE:"Tahmini Ücret", FEE_DETAIL:"Kota aşımı / vitrin seçimine göre hesaplanır.", SUBMIT:"Yayınla", CANCEL:"İptal",
      RULES_TITLE:"Kurallar", R1:"PRO: ayda 10 ilan.", R2:"STANDART: ayda 1 ilan.", R3:"PRO: ayda 1 vitrin ücretsiz.", R4:"Kota aşımı: PRO 100 TL, STANDART 150 TL.", R5:"Vitrin: PRO 150 TL (hakkı bittiyse), STANDART 299 TL.", R6:"Tüm ilanlar önce ADMIN ONAYINA gider.", WILL_SHOWCASE:"Onay sonrası Ana Sayfa › Vitrin'e düşer.", WILL_STANDARD:"Onay sonrası Standart alana düşer.", VERIFIED:"ONAYLI SATICI", GOLD_HINT:"PRO ilanları ALTIN çerçevede görünür.", ERR_MAX5:"En fazla 5 foto.", UPLOADING:"Yükleniyor…", DONE:"Gönderildi.", NEED_PAYMENT:"Ödeme gerekli: ", GO_PAY:"Ödemeye git", AFTER_REVIEW:"İlanınız incelendikten sonra yayına alınacaktır." },
    en:{ BRAND:"ÜRETEN ELLER", PAGE_TITLE:"POST LISTING", SUBTITLE:"Photos → title → description → category → subcategory → city → district → price.", MEMBERSHIP:"Membership", PRO:"PRO", STANDARD:"STANDARD", REMAINING:"Remaining quota", ADS_THIS_MONTH:"Your ads this month", SHOWCASE_THIS_MONTH:"Your showcase this month", CATEGORY:"Category", SUBCATEGORY:"Subcategory", CITY:"City", DISTRICT:"District", LISTING_TYPE:"Listing Type", STANDARD_L:"Standard", SHOWCASE_L:"Showcase", TITLE:"Title", PRICE:"Price (TRY)", DESC:"Description", PHOTOS:"Photos (max 5)", DRAG:"Drag files or click to upload", ESTIMATE:"Estimated Fee", FEE_DETAIL:"Calculated from quota / showcase.", SUBMIT:"Publish", CANCEL:"Cancel", RULES_TITLE:"Rules", R1:"PRO: 10 / month.", R2:"STANDARD: 1 / month.", R3:"PRO: 1 showcase / month free.", R4:"Over‑quota: PRO 100 TRY, STANDARD 150 TRY.", R5:"Showcase: PRO 150 TRY (if no free left), STANDARD 299 TRY.", R6:"All listings require ADMIN APPROVAL first.", WILL_SHOWCASE:"After approval appears on Home › Showcase.", WILL_STANDARD:"After approval appears in Standard list.", VERIFIED:"VERIFIED SELLER", GOLD_HINT:"PRO listings show with GOLD frame.", ERR_MAX5:"Max 5 photos.", UPLOADING:"Uploading…", DONE:"Submitted.", NEED_PAYMENT:"Payment required: ", GO_PAY:"Proceed to payment", AFTER_REVIEW:"Your listing will be published after review." },
    ar:{ BRAND:"أُورَتِن إِلَّر", PAGE_TITLE:"أَضِفْ إِعْلَانًا", SUBTITLE:"صور ← العنوان ← الوصف ← الفئة ← الفرعية ← الولاية ← القضاء ← السعر.", MEMBERSHIP:"العضوية", PRO:"برو", STANDARD:"عادي", REMAINING:"المتبقّي", ADS_THIS_MONTH:"إعلانات هذا الشهر", SHOWCASE_THIS_MONTH:"عروض مميزة هذا الشهر", CATEGORY:"الفئة", SUBCATEGORY:"الفرعية", CITY:"الولاية", DISTRICT:"القضاء", LISTING_TYPE:"نوع الإعلان", STANDARD_L:"عادي", SHOWCASE_L:"مميّز", TITLE:"العنوان", PRICE:"السعر (TL)", DESC:"الوصف", PHOTOS:"صور (حتى 5)", DRAG:"اسحب الملفات أو انقر للرفع", ESTIMATE:"الرسوم التقديرية", FEE_DETAIL:"بحسب الحصة/المميّز.", SUBMIT:"نشر", CANCEL:"إلغاء", RULES_TITLE:"القواعد", R1:"برو: 10 شهريًا.", R2:"عادي: 1 شهريًا.", R3:"برو: مميّز واحد مجانًا شهريًا.", R4:"تجاوز الحصة: برو 100 TL، عادي 150 TL.", R5:"المميّز: برو 150 TL (إن نفدت المجانية)، عادي 299 TL.", R6:"كل الإعلانات تتطلّب موافقة الإدارة أولًا.", WILL_SHOWCASE:"بعد الموافقة يظهر في الرئيسية › المميز.", WILL_STANDARD:"بعد الموافقة يظهر في القائمة العادية.", VERIFIED:"بائع موثّق", GOLD_HINT:"إعلانات برو بإطار ذهبي.", ERR_MAX5:"الحد 5 صور.", UPLOADING:"جارٍ الرفع…", DONE:"تم الإرسال.", NEED_PAYMENT:"يلزم دفع: ", GO_PAY:"انتقال للدفع", AFTER_REVIEW:"سيُنشر إعلانك بعد المراجعة." },
    de:{ BRAND:"ÜRETEN ELLER", PAGE_TITLE:"ANZEIGE AUFGEBEN", SUBTITLE:"Fotos → Titel → Beschreibung → Kategorie → Unterkategorie → Stadt → Bezirk → Preis.", MEMBERSHIP:"Mitgliedschaft", PRO:"PRO", STANDARD:"STANDARD", REMAINING:"Restkontingent", ADS_THIS_MONTH:"Deine Anzeigen (Monat)", SHOWCASE_THIS_MONTH:"Deine Schaufenster (Monat)", CATEGORY:"Kategorie", SUBCATEGORY:"Unterkategorie", CITY:"Stadt", DISTRICT:"Bezirk", LISTING_TYPE:"Anzeigentyp", STANDARD_L:"Standard", SHOWCASE_L:"Schaufenster", TITLE:"Titel", PRICE:"Preis (TRY)", DESC:"Beschreibung", PHOTOS:"Fotos (max. 5)", DRAG:"Dateien ziehen oder klicken", ESTIMATE:"Vorauss. Gebühr", FEE_DETAIL:"aus Kontingent/Schaufenster.", SUBMIT:"Veröffentlichen", CANCEL:"Abbrechen", RULES_TITLE:"Regeln", R1:"PRO: 10 / Monat.", R2:"STANDARD: 1 / Monat.", R3:"PRO: 1 Schaufenster/Monat gratis.", R4:"Überkontingent: PRO 100 TRY, STANDARD 150 TRY.", R5:"Schaufenster: PRO 150 TRY (wenn gratis verbraucht), STANDARD 299 TRY.", R6:"Alle Anzeigen zuerst ADMIN‑Freigabe.", WILL_SHOWCASE:"Nach Freigabe: Start › Schaufenster.", WILL_STANDARD:"Nach Freigabe: Standardliste.", VERIFIED:"VERIFIZIERTER VERKÄUFER", GOLD_HINT:"PRO‑Anzeigen mit GOLD‑Rahmen.", ERR_MAX5:"Max. 5 Fotos.", UPLOADING:"Wird hochgeladen…", DONE:"Gesendet.", NEED_PAYMENT:"Zahlung nötig: ", GO_PAY:"Zur Zahlung", AFTER_REVIEW:"Deine Anzeige wird nach Prüfung veröffentlicht." }
  };
  const t = STR[lang] || STR.tr;

  // === KATEGORİLER ===
  const CATS = React.useMemo(()=>({
    tr:[
      { key:"food", title:"Yemekler", subs:["Ev yemekleri","Börek-çörek","Çorba","Zeytinyağlı","Pilav-makarna","Et-tavuk","Kahvaltılık","Meze","Dondurulmuş","Çocuk öğünleri","Diyet/vegan/gf"]},
      { key:"cake", title:"Pasta & Tatlı", subs:["Yaş pasta","Kek-cupcake","Kurabiye","Şerbetli","Sütlü","Cheesecake","Diyet tatlı","Çikolata/şekerleme","Doğum günü setleri"]},
      { key:"jam", title:"Reçel • Turşu • Sos", subs:["Reçel-marmelat","Pekmez","Turşu","Domates/biber sos","Acı sos","Salça","Sirke","Konserve"]},
      { key:"local", title:"Yöresel / Kışlık", subs:["Erişte","Tarhana","Yufka","Mantı","Kurutulmuş sebze-meyve","Salça","Sirke","Konserve"]},
      { key:"diet", title:"Diyet / Vegan / Glutensiz", subs:["Fit tabaklar","Vegan yemekler","GF unlu mamuller","Şekersiz tatlı","Keto ürün","Protein atıştırmalık"]},
      { key:"jewelry", title:"Takı", subs:["Bileklik","Kolye","Küpe","Yüzük","Halhal","Broş","Setler","İsimli/kişiye özel","Makrome","Doğal taş","Reçine","Tel sarma"]},
      { key:"kids", title:"Bebek & Çocuk", subs:["Hayvan/bebek figürleri","Çıngırak","Diş kaşıyıcı örgü","Bez oyuncak/kitap","Montessori oyuncak","Setler","Örgü patik-bere","Bebek battaniyesi","Önlük-ağız bezi","Lohusa seti","Saç aksesuarı","El emeği kıyafet"]},
      { key:"knit", title:"Örgü / Triko", subs:["Hırka","Kazak","Atkı-bere","Panço","Şal","Çorap","Bebek takımı","Yelek","Kırlent-örtü","Lif takımı"]},
      { key:"sew", title:"Dikiş / Terzilik", subs:["Paça/onarım","Fermuar değişimi","Perde dikişi","Nevresim-yastık","Masa örtüsü","Özel dikim","Kostüm"]},
      { key:"macrame", title:"Makrome & Dekor", subs:["Duvar süsü","Saksı askısı","Anahtarlık","Avize","Amerikan servis/runner","Sepet","Raf/duvar dekoru"]},
      { key:"home", title:"Ev Dekor & Aksesuar", subs:["Keçe işleri","Kırlent","Kapı süsü","Tepsi süsleme","Çerçeve","Rüya kapanı","Tablo"]},
      { key:"candle", title:"Mum & Kokulu Ürünler", subs:["Soya/balmumu mum","Kokulu taş","Oda spreyi","Tütsü","Jel mum","Hediye seti"]},
      { key:"soap", title:"Doğal Sabun & Kozmetik", subs:["Zeytinyağlı sabun","Bitkisel sabunlar","Katı şampuan","Dudak balmı","Krem/merhem","Banyo tuzu","Lavanta kesesi"]},
      { key:"amigurumi", title:"Amigurumi & Oyuncak (dekoratif)", subs:["Anahtarlık","Magnet","Koleksiyon figürü","Dekor bebek/karakter","İsimli amigurumi"]},
    ],
    en:[
      { key:"food", title:"Food", subs:["Home-cooked meals","Börek & pastries","Soup","Olive-oil dishes","Rice & pasta","Meat & chicken","Breakfast items","Meze","Frozen","Kids' meals","Diet/vegan/GF"]},
      { key:"cake", title:"Cakes & Desserts", subs:["Layer cakes","Cakes & cupcakes","Cookies","Syrupy desserts","Milk-based desserts","Cheesecake","Diet desserts","Chocolate/candy","Birthday sets"]},
      { key:"jam", title:"Jam • Pickle • Sauce", subs:["Jam & marmalade","Molasses (pekmez)","Pickles","Tomato/pepper sauce","Hot sauce","Tomato paste","Vinegar","Canned goods"]},
      { key:"local", title:"Local / Pantry Staples", subs:["Homemade noodles (erişte)","Tarhana","Yufka","Mantı","Dried veg/fruit","Tomato paste","Vinegar","Canned"]},
      { key:"diet", title:"Diet / Vegan / Gluten-free", subs:["Fit plates","Vegan meals","GF baked goods","Sugar-free desserts","Keto products","Protein snacks"]},
      { key:"jewelry", title:"Jewelry", subs:["Bracelet","Necklace","Earrings","Ring","Anklet","Brooch","Sets","Personalized","Macrame","Natural stone","Resin","Wire wrap"]},
      { key:"kids", title:"Baby & Child", subs:["Animal/baby figures","Rattle","Crochet teether","Cloth toy/book","Montessori toy","Sets","Knitted booties-hat","Baby blanket","Bib & burp cloth","Maternity set","Hair accessory","Handmade clothing"]},
      { key:"knit", title:"Knitwear", subs:["Cardigan","Sweater","Scarf & beanie","Poncho","Shawl","Socks","Baby set","Vest","Cushion/throw","Bath set"]},
      { key:"sew", title:"Sewing / Tailoring", subs:["Hems/repairs","Zipper replacement","Curtain sewing","Duvet/pillow","Tablecloth","Custom tailoring","Costume"]},
      { key:"macrame", title:"Macrame & Decor", subs:["Wall hanging","Plant hanger","Keychain","Chandelier","Placemat/runner","Basket","Shelf/wall decor"]},
      { key:"home", title:"Home Decor & Accessories", subs:["Felt crafts","Cushion","Door wreath","Tray decoration","Frame","Dreamcatcher","Painting"]},
      { key:"candle", title:"Candles & Fragrances", subs:["Soy/beeswax candle","Scented stone","Room spray","Incense","Gel candle","Gift set"]},
      { key:"soap", title:"Natural Soap & Cosmetics", subs:["Olive-oil soap","Herbal soaps","Solid shampoo","Lip balm","Cream/ointment","Bath salts","Lavender sachet"]},
      { key:"amigurumi", title:"Amigurumi & Toys (decorative)", subs:["Keychain","Magnet","Collector figure","Decor doll/character","Name-custom amigurumi"]},
    ],
    ar:[
      { key:"food", title:"الأطعمة", subs:["أطعمة منزلية","بورك ومعجنات","شوربة","أطباق بزيت الزيتون","أرز ومعكرونة","لحوم ودجاج","فطور","مقبلات","مجمدات","وجبات للأطفال","دايت/نباتي/خالٍ من الغلوتين"]},
      { key:"cake", title:"كيك وحلويات", subs:["كعكات طبقات","كيك وكب كيك","بسكويت","حلويات شرابية","حلويات بالحليب","تشيزكيك","حلويات دايت","شوكولاتة/حلوى","مجموعات عيد الميلاد"]},
      { key:"jam", title:"مربى • مخللات • صلصات", subs:["مربى ومارمالاد","دبس (بكميز)","مخللات","صلصة طماطم/فلفل","صلصة حارة","معجون طماطم","خل","معلبات"]},
      { key:"local", title:"منتجات محلية / مؤن", subs:["معكرونة منزلية (إريشته)","طرخانة","يوفكا","مانتي","خضار/فاكهة مجففة","معجون طماطم","خل","معلبات"]},
      { key:"diet", title:"دايت / نباتي / خالٍ من الغلوتين", subs:["أطباق لياقة","وجبات نباتية","مخبوزات GF","حلويات بدون سكر","منتجات كيتو","سناك بروتين"]},
      { key:"jewelry", title:"مجوهرات", subs:["أساور","قلادات","أقراط","خواتم","خلخال","بروش","أطقم","مخصصة بالاسم","مكرمية","أحجار طبيعية","ريزين","لفّ سلكي"]},
      { key:"kids", title:"رضّع وأطفال", subs:["مجسّمات حيوانات/أطفال","خشخاشة","عضّاضة كروشيه","دمى/كتب قماش","ألعاب منتسوري","أطقم","بوت/قبعة محبوكة","بطانية أطفال","مريلة/قطعة تجفيف","طقم نفاس","إكسسوارات شعر","ملابس يدوية"]},
      { key:"knit", title:"حياكة/تريكو", subs:["كارديغان","كنزة","وشاح/قبعة","بونشو","شال","جوارب","طقم أطفال","صديري","غلاف وسادة/بطانية","طقم حمّام"]},
      { key:"sew", title:"خياطة / تفصيل", subs:["تقصير/تصليح","تبديل سحّاب","خياطة ستائر","أغطية/وسائد","مفرش طاولة","تفصيل خاص","زيّ تنكري"]},
      { key:"macrame", title:"مكرمية وديكور", subs:["تعليق جداري","حامل نبات","ميدالية مفاتيح","ثريا","مفرش/رانر","سلّة","رف/ديكور جداري"]},
      { key:"home", title:"ديكور المنزل وإكسسواراته", subs:["أعمال لباد","وسادة","إكليل الباب","تزيين صينية","إطار","صائد أحلام","لوحة"]},
      { key:"candle", title:"شموع ومنتجات عطرية", subs:["شموع صويا/شمع نحل","حجر عطري","معطر غرف","بخور","شمعة جل","طقم هدايا"]},
      { key:"soap", title:"صابون طبيعي ومستحضرات", subs:["صابون بزيت الزيتون","صوابين عشبية","شامبو صلب","بلسم شفاه","كريم/مرهم","أملاح حمام","أكياس خزامى"]},
      { key:"amigurumi", title:"أميغورومي وألعاب (ديكورية)", subs:["ميدالية مفاتيح","مغناطيس","مجسمات تجميع","دمية/شخصية ديكورية","أميغورومي بالاسم"]},
    ],
    de:[
      { key:"food", title:"Speisen", subs:["Hausmannskost","Börek & Gebäck","Suppe","Gerichte mit Olivenöl","Reis & Pasta","Fleisch & Hähnchen","Frühstück","Meze","Tiefgekühlt","Kindergerichte","Diät/vegan/glutenfrei"]},
      { key:"cake", title:"Kuchen & Süßes", subs:["Torten","Kuchen & Cupcakes","Kekse","Sirup‑Desserts","Milch‑Desserts","Käsekuchen","Diät‑Desserts","Schokolade/Bonbons","Geburtstags‑Sets"]},
      { key:"jam", title:"Marmelade • Pickles • Saucen", subs:["Marmelade","Pekmez (Traubensirup)","Eingelegtes","Tomaten-/Paprikasauce","Scharfe Sauce","Tomatenmark","Essig","Konserven"]},
      { key:"local", title:"Regional / Vorrat", subs:["Erişte (Hausnudeln)","Tarhana","Yufka","Mantı","Getrocknetes Obst/Gemüse","Tomatenmark","Essig","Konserven"]},
      { key:"diet", title:"Diät / Vegan / Glutenfrei", subs:["Fitness‑Teller","Vegane Gerichte","GF Backwaren","Zuckerfreie Desserts","Keto‑Produkte","Protein‑Snacks"]},
      { key:"jewelry", title:"Schmuck", subs:["Armband","Kette","Ohrringe","Ring","Fußkettchen","Brosche","Sets","Personalisiert","Makramee","Naturstein","Harz","Drahtwickel"]},
      { key:"kids", title:"Baby & Kind", subs:["Tier-/Babyfiguren","Rassel","Beißring (gehäkelt)","Stoffspielzeug/-buch","Montessori‑Spielzeug","Sets","Booties‑Mütze (gestrickt)","Babydecke","Lätzchen & Spucktuch","Wochenbett‑Set","Haar‑Accessoires","Handgemachte Kleidung"]},
      { key:"knit", title:"Strick/Trikot", subs:["Cardigan","Pullover","Schal & Mütze","Poncho","Tuch","Socken","Baby‑Set","Weste","Kissenbezug/Decke","Bade‑Set"]},
      { key:"sew", title:"Nähen / Schneiderei", subs:["Saum/Reparaturen","Reißverschlusswechsel","Vorhänge nähen","Bettwäsche/Kissen","Tischdecke","Maßanfertigung","Kostüm"]},
      { key:"macrame", title:"Makramee & Deko", subs:["Wandbehang","Pflanzenhänger","Schlüsselanhänger","Deckenlampe","Platzset/Läufer","Korb","Regal/Wanddeko"]},
      { key:"home", title:"Wohn‑Deko & Accessoires", subs:["Filzarbeiten","Kissen","Türkranz","Tablett‑Deko","Rahmen","Traumfänger","Bild"]},
      { key:"candle", title:"Kerzen & Duft", subs:["Soja/Bienenwachs‑Kerze","Duftstein","Raumspray","Weihrauch","Gelkerze","Geschenk‑Set"]},
      { key:"soap", title:"Naturseife & Kosmetik", subs:["Olivenölseife","Kräuterseifen","Festes Shampoo","Lippenbalsam","Creme/Salbe","Badesalz","Lavendelsäckchen"]},
      { key:"amigurumi", title:"Amigurumi & Spielzeug (dekorativ)", subs:["Schlüsselanhänger","Magnet","Sammlerfigur","Deko‑Puppe/Charakter","Amigurumi mit Namen"]},
    ],
  }),[]);
  const catList = CATS[lang as keyof typeof CATS];
  const cat = catList.find(c=>c.key===catKey) || catList[0];

  // === 81 İL (Türkçe alfabetik) ===
  const CITIES = ["Adana","Adıyaman","Afyonkarahisar","Ağrı","Amasya","Ankara","Antalya","Artvin","Aydın","Balıkesir","Bartın","Batman","Bayburt","Bilecik","Bingöl","Bitlis","Bolu","Burdur","Bursa","Çanakkale","Çankırı","Çorum","Denizli","Diyarbakır","Düzce","Edirne","Elazığ","Erzincan","Erzurum","Eskişehir","Gaziantep","Giresun","Gümüşhane","Hakkâri","Hatay","Iğdır","Isparta","İstanbul","İzmir","Kahramanmaraş","Karabük","Karaman","Kars","Kastamonu","Kayseri","Kilis","Kırıkkale","Kırklareli","Kırşehir","Kocaeli","Konya","Kütahya","Malatya","Manisa","Mardin","Mersin","Muğla","Muş","Nevşehir","Niğde","Ordu","Osmaniye","Rize","Sakarya","Samsun","Siirt","Sinop","Sivas","Şanlıurfa","Şırnak","Tekirdağ","Tokat","Trabzon","Tunceli","Uşak","Van","Yalova","Yozgat","Zonguldak"];
  const sortedCities = React.useMemo(()=>[...CITIES].sort((a,b)=>a.localeCompare(b,'tr')),[]);

  // === MOTTO (5 sn) ===
  const MOTTO = {
    tr:["Küçük üreticiye büyük destek","Güvenli ödeme, kolay iade","Şeffaf fiyat, net teslimat"],
    en:["Big support for small producers","Secure payment, easy returns","Transparent price, clear delivery"],
    ar:["دعم كبير للمنتِج الصغير","دفع آمن وإرجاع سهل","سعر شفاف وتسليم واضح"],
    de:["Große Unterstützung für kleine Produzenten","Sichere Zahlung, einfache Rückgabe","Transparente Preise, klare Lieferung"],
  };
  const BAD_WORDS = ["amk","aq","orospu","sike","sikerim","siktir","piç","yarrak","ananı","avradını","göt","ibne","pezevenk","kahpe","allahsız","şerefsiz"];
  const [mi,setMi]=React.useState(0);
  React.useEffect(()=>{ const id=setInterval(()=>setMi(p=>(p+1)%MOTTO[lang as keyof typeof MOTTO].length),5000); return()=>clearInterval(id); },[lang]);

  // === Firebase (lazy) ===
  const fbRef = React.useRef({app:null,auth:null,db:null,storage:null});
  React.useEffect(()=>{ let unsub = ()=>{}; (async()=>{
    try{
      const { initializeApp, getApps } = await import("firebase/app");
      const { getAuth, onAuthStateChanged, signInAnonymously } = await import("firebase/auth");
      const { getFirestore, doc, getDoc, collection, query, where, Timestamp, getCountFromServer } = await import("firebase/firestore");
      const { getStorage } = await import("firebase/storage");
      const firebaseConfig = { apiKey: "AIzaSyCd9GjP6CDA8i4XByhXDHyESy-g_DHVwvQ", authDomain:"ureteneller-ecaac.firebaseapp.com", projectId:"ureteneller-ecaac", storageBucket:"ureteneller-ecaac.firebasestorage.app" };
      const app = getApps().length? getApps()[0] : initializeApp(firebaseConfig);
      const auth = getAuth(app); const db = getFirestore(app); const storage = getStorage(app);
      fbRef.current = { app, auth, db, storage };
      unsub = onAuthStateChanged(auth, async (user)=>{
        try{ if(!user){ await signInAnonymously(auth); return; } }catch(_e){}
        setUid(user.uid);
        const uSnap = await getDoc(doc(db, "users", user.uid));
        const pro = !!(uSnap.exists() && (uSnap.data().isPro || uSnap.data().membership === 'pro'));
        setIsPro(pro);
        const start = new Date(); start.setDate(1); start.setHours(0,0,0,0);
        const q1 = query(collection(db, "listings"), where("ownerId","==",user.uid), where("createdAt", ">=", Timestamp.fromDate(start)));
        const q2 = query(collection(db, "listings"), where("ownerId","==",user.uid), where("createdAt", ">=", Timestamp.fromDate(start)), where("isShowcase","==", true));
        const c1 = await getCountFromServer(q1); const c2 = await getCountFromServer(q2);
        setAdsThisMonth(c1.data().count||0); setShowcaseThisMonth(c2.data().count||0);
      });
    }catch(e){ console.warn("Firebase init (preview)", e); }
  })(); return ()=>unsub(); },[]);

  // === Ücret & Limit ===
  const adsLimit = isPro? 10 : 1;
  const freeShowcaseLimit = isPro? 1 : 0;
  const overQuota = adsThisMonth + 1 > adsLimit;
  const showcaseUsedUp = showcaseThisMonth >= freeShowcaseLimit;
  const extraAdFee = overQuota ? (isPro?100:150) : 0;
  const showcaseFee = (listingType === 'showcase' && showcaseUsedUp) ? (isPro?150:299) : 0;
  const needPayment = extraAdFee + showcaseFee;
  React.useEffect(()=>{ if(needPayment>0){ setPayWarn(`${t.NEED_PAYMENT}${needPayment} TL`);} else setPayWarn(""); },[needPayment,lang]);
  React.useEffect(()=>{ if(!(catList as any[]).find(s=>s.key===catKey)) setCatKey((catList as any[])[0]?.key||"food"); },[lang]);
  React.useEffect(()=>{ if(!(cat.subs as string[]).includes(subcat)) setSubcat(cat.subs[0]||""); },[catKey, lang]);

  // === SUBMIT ===
  async function onSubmit(e: React.FormEvent){
    e.preventDefault();
    if(photos.length>5){ alert(t.ERR_MAX5); return; }
    const haystack = `${title} ${desc}`.toLowerCase();
    if (BAD_WORDS.some(w => haystack.includes(w))) { alert('Küfür / yasaklı kelime tespit edildi. Lütfen metni düzenleyin.'); return; }
    try{
      setUploading(true);
      const { getFirestore, collection, addDoc, serverTimestamp } = await import("firebase/firestore");
      const { getStorage, ref, uploadBytesResumable, getDownloadURL } = await import("firebase/storage");
      const db = fbRef.current.db || getFirestore();
      const storage = fbRef.current.storage || getStorage();
      const urls:string[] = [];
      for (let i=0;i<photos.length;i++){
        const f = photos[i];
        const path = `listings/${uid||'anon'}/${Date.now()}_${i}_${f.name}`;
        const r = ref(storage, path);
        await new Promise<void>((resolve,reject)=>{
          const task = uploadBytesResumable(r, f);
          task.on('state_changed', ()=>{}, reject, async()=>{ const u = await getDownloadURL(r); urls.push(u); resolve(); });
        });
      }
      const { getAuth } = await import("firebase/auth");
      const auth = fbRef.current.auth || getAuth();
      const docData:any = { ownerId: auth?.currentUser?.uid||null, title, desc, price: Number(price)||0, categoryKey: catKey, subcategory: subcat, city, district, isShowcase: listingType==='showcase', status: 'pending', createdAt: (await import("firebase/firestore")).serverTimestamp(), needPayment: needPayment>0? { amount: needPayment, items:{ extraAd: extraAdFee>0, showcase: showcaseFee>0 } } : null, photos: urls, membership: isPro? 'pro':'standard' };
      await (await import("firebase/firestore")).addDoc((await import("firebase/firestore")).collection(db, 'listing_submissions'), docData);
      setUploading(false);
      alert(`${t.DONE}
${t.AFTER_REVIEW}${needPayment>0?`
${t.NEED_PAYMENT}${needPayment} TL`:''}`);
      if (typeof window !== 'undefined'){
        if(needPayment>0){ window.location.href = `/portal/pay?amount=${needPayment}`; }
        else { window.location.href = `/portal/seller`; }
      }
    }catch(err:any){ console.error(err); setUploading(false); alert('Hata: '+(err?.message||err)); }
  }

  // === UI ===
  return (
    <main lang={lang} dir={DIR} className="min-h-screen">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-zinc-200">
        <div className="wrap flex items-center gap-3 py-3">
          <a className="brand" href="/"><img src="/logo.png" alt="logo" width={36} height={36}/><span>{t.BRAND}</span></a>
          <div className="ml-auto flex items-center gap-2">
            <select value={lang} onChange={e=>setLang(e.target.value)} className="sel">
              {SUPPORTED.map(k=>(<option key={k} value={k}>{k.toUpperCase()}</option>))}
            </select>
            <div className="mem">
              <span className="memLabel">{t.MEMBERSHIP}</span>
              <span className={`memTag ${isPro?'pro':''}`}>{isPro?t.PRO:t.STANDARD}</span>
            </div>
          </div>
        </div>
      </header>

      <section className="wrap tcenter mt-4">
        <h1 className="ttl">{t.PAGE_TITLE}</h1>
        <p className="sub">{t.SUBTITLE}</p>
        <div className="motto" data-i={mi}>{MOTTO[lang as keyof typeof MOTTO][mi]}</div>
      </section>

      <section className="wrap grid3 mt-4">
        <div className="infoCard">
          <div className="infoTop">📦 {t.REMAINING}</div>
          <div className="infoMain">{Math.max(0,(isPro?10:1)-adsThisMonth)} / {isPro?10:1}</div>
          <div className="infoFoot">{t.ADS_THIS_MONTH}: {adsThisMonth} • {t.SHOWCASE_THIS_MONTH}: {showcaseThisMonth}</div>
        </div>
        <div className="infoCard">
          <div className="infoTop">💳 {t.ESTIMATE}</div>
          <div className="infoMain">{(isPro?0:0) + (listingType==='showcase' && showcaseThisMonth>=(isPro?1:0) ? (isPro?150:299):0) + ((adsThisMonth+1>(isPro?10:1))?(isPro?100:150):0)} TL</div>
          <div className="infoFoot">{t.FEE_DETAIL}</div>
        </div>
        <div className={`infoCard ${isPro?'gold':''}`}>
          <div className="infoTop">✅ {t.VERIFIED}</div>
          <div className="infoMain small">{t.GOLD_HINT}</div>
          {isPro && <div className="badgePro">{t.PRO}</div>}
        </div>
      </section>

      <form onSubmit={onSubmit} className="wrap gridMain mt-4">
        <div className="col">
          <div className="card">
            <label className="lbl">{t.PHOTOS}</label>
            <div className="uploader">
              <input type="file" accept="image/*" multiple onChange={ev=>{ const arr = Array.from(ev.currentTarget.files||[]); if(arr.length>5){ alert(t.ERR_MAX5); return; } setPhotos(arr as File[]); }}/>
              <div className="hint">{t.DRAG} • {photos.length}/5</div>
              {photos.length>0 && (
                <div className="thumbs">
                  {photos.map((f,i)=> (<div key={i} className="ph"><img src={URL.createObjectURL(f)} alt=""/></div>))}
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <label className="lbl">{t.TITLE}</label>
            <input required value={title} onChange={e=>setTitle(e.target.value)} className="inp" placeholder="Ev yapımı mantı"/>
          </div>

          <div className="card">
            <label className="lbl">{t.DESC}</label>
            <textarea rows={6} value={desc} onChange={e=>setDesc(e.target.value)} className="inp" placeholder="Ürün açıklaması, içerik, teslimat…"/>
          </div>

          <div className="grid2">
            <div className="card">
              <label className="lbl">{t.CATEGORY}</label>
              <select value={catKey} onChange={e=>setCatKey(e.target.value)} className="inp">
                {(catList as any[]).map(c => (<option key={c.key} value={c.key}>{c.title}</option>))}
              </select>
            </div>
            <div className="card">
              <label className="lbl">{t.SUBCATEGORY}</label>
              <select value={subcat} onChange={e=>setSubcat(e.target.value)} className="inp">
                {(cat.subs as string[]).map(s => (<option key={s} value={s}>{s}</option>))}
              </select>
            </div>
          </div>

          <div className="grid2">
            <div className="card">
              <label className="lbl">{t.CITY}</label>
              <select value={city} onChange={e=>setCity(e.target.value)} className="inp">
                {sortedCities.map(c=> (<option key={c} value={c}>{c}</option>))}
              </select>
            </div>
            <div className="card">
              <label className="lbl">{t.DISTRICT}</label>
              <input required value={district} onChange={e=>setDistrict(e.target.value)} className="inp" placeholder={lang==='tr'? 'İlçe (ör. Kadıköy)' : lang==='en'? 'District (e.g., Kadıköy)' : lang==='ar'? 'القضاء' : 'Bezirk (z. B. Kadıköy)'} />
            </div>
          </div>

          <div className="grid2">
            <div className="card">
              <label className="lbl">{t.PRICE}</label>
              <input required type="number" min={0} step={1} value={price} onChange={e=>setPrice(e.target.value)} className="inp" placeholder="150"/>
            </div>
            <div className="card">
              <label className="lbl">{t.LISTING_TYPE}</label>
              <div className="toggle">
                <button type="button" className={`pill ${listingType==='standard'?'on':''}`} onClick={()=>setListingType('standard')}>{t.STANDARD_L}</button>
                <button type="button" className={`pill ${listingType==='showcase'?'on':''}`} onClick={()=>setListingType('showcase')}>{t.SHOWCASE_L}</button>
                {listingType==='showcase' && (<span className="feeNote">{showcaseThisMonth<(isPro?1:0)? 'FREE':'+' + (isPro? '150 TL':'299 TL')}</span>)}
              </div>
              {payWarn && <div className="warn">{payWarn}</div>}
            </div>
          </div>

          <div className={`card ${isPro?'goldOutline':''}`}>
            <div className="veri"><span className="vTtl">{t.VERIFIED}</span>{isPro && <span className="vTag">{t.PRO}</span>}</div>
            <div className="vHint">{t.GOLD_HINT}</div>
          </div>

          <div className="actions">
            <button disabled={uploading} type="submit" className="btnPrimary">{uploading? t.UPLOADING : t.SUBMIT}</button>
            {((adsThisMonth+1>(isPro?10:1)) || (listingType==='showcase' && showcaseThisMonth>=(isPro?1:0))) && (
              <button type="button" onClick={()=>{ if(typeof window!=='undefined') window.location.href=`/portal/pay?amount=${((adsThisMonth+1>(isPro?10:1))?(isPro?100:150):0)+((listingType==='showcase' && showcaseThisMonth>=(isPro?1:0))?(isPro?150:299):0)}`; }} className="btnGhost">{t.GO_PAY}</button>
            )}
            <button type="button" onClick={()=>window.history.back()} className="btnGhost">{t.CANCEL}</button>
          </div>
        </div>
      </form>

      <footer className="footer">
        <div className="wrap">
          <section className="rulesFooter">
            <div className="rulesBox">
              <div className="rulesHd">{t.RULES_TITLE}</div>
              <ul>
                <li>{t.R1}</li>
                <li>{t.R2}</li>
                <li>{t.R3}</li>
                <li>{t.R4}</li>
                <li>{t.R5}</li>
                <li>{t.R6}</li>
                <li>{listingType==='showcase'?t.WILL_SHOWCASE:t.WILL_STANDARD}</li>
              </ul>
            </div>
          </section>
          <div className="footTtl">{lang==='tr'? 'KURUMSAL' : lang==='en'? 'CORPORATE' : lang==='ar'? 'الشركة' : 'UNTERNEHMEN'}</div>
          <nav className="footLinks">
            <a href="/legal/hakkimizda">{lang==='tr'? 'HAKKIMIZDA' : lang==='en'? 'ABOUT' : lang==='ar'? 'مَنْ نَحْنُ' : 'ÜBER UNS'}</a>
            <a href="/legal/iletisim">{lang==='tr'? 'İLETİŞİM' : lang==='en'? 'CONTACT' : lang==='ar'? 'اتِّصَال' : 'KONTAKT'}</a>
            <a href="/legal/gizlilik">{lang==='tr'? 'GİZLİLİK' : lang==='en'? 'PRIVACY' : lang==='ar'? 'الخصوصية' : 'DATENSCHUTZ'}</a>
            <a href="/legal/kvkk-aydinlatma">{lang==='tr'? 'KVKK AYDINLATMA' : lang==='en'? 'PDPL (KVKK) NOTICE' : lang==='ar'? 'إشعار KVKK' : 'KVKK‑HINWEIS'}</a>
            <a href="/legal/kullanim-sartlari">{lang==='tr'? 'KULLANIM ŞARTLARI' : lang==='en'? 'TERMS OF USE' : lang==='ar'? 'شروط الاستخدام' : 'NUTZUNGSBEDINGUNGEN'}</a>
            <a href="/legal/mesafeli-satis-sozlesmesi">{lang==='tr'? 'MESAFELİ SATIŞ' : lang==='en'? 'DISTANCE SALES' : lang==='ar'? 'البيع عن بُعد' : 'FERNABSATZ'}</a>
            <a href="/legal/teslimat-iade">{lang==='tr'? 'TESLİMAT & İADE' : lang==='en'? 'DELIVERY & RETURNS' : lang==='ar'? 'التسليم والإرجاع' : 'LIEFERUNG & RÜCKGABE'}</a>
            <a href="/legal/cerez-politikasi">{lang==='tr'? 'ÇEREZ POLİTİKASI' : lang==='en'? 'COOKIE POLICY' : lang==='ar'? 'سياسة الكوكيز' : 'COOKIE‑RICHTLINIE'}</a>
            <a href="/legal/topluluk-kurallari">{lang==='tr'? 'TOPLULUK KURALLARI' : lang==='en'? 'COMMUNITY GUIDELINES' : lang==='ar'? 'إرشادات المجتمع' : 'COMMUNITY‑RICHTLINIEN'}</a>
            <a href="/legal/yasakli-urunler">{lang==='tr'? 'YASAKLI ÜRÜNLER' : lang==='en'? 'PROHIBITED ITEMS' : lang==='ar'? 'السلع المحظورة' : 'VERBOTENE ARTIKEL'}</a>
          </nav>
          <div className="copy">© 2025 Üreten Eller</div>
        </div>
      </footer>

      <style>{`
        *{box-sizing:border-box}
        html,body,#root{height:100%}
        body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial,sans-serif;color:#0f172a;background:
          radial-gradient(1200px 600px at 10% -10%, #ffe4e6, transparent),
          radial-gradient(900px 500px at 90% -10%, #e0e7ff, transparent),
          linear-gradient(120deg,#ff80ab,#a78bfa,#60a5fa,#34d399)}
        .min-h-screen{min-height:100vh}
        .wrap{max-width:1100px;margin:0 auto;padding:0 16px}
        .tcenter{text-align:center}
        .mt-4{margin-top:16px}
        .py-3{padding:12px 0}
        .brand{display:flex;align-items:center;gap:10px;font-weight:900;text-decoration:none;color:inherit}
        .sel{border:1px solid #e5e7eb;border-radius:12px;padding:8px 10px;background:#fff}
        .mem{display:flex;align-items:center;gap:8px}
        .memLabel{font-weight:800;font-size:12px;color:#475569}
        .memTag{border:1px solid #e5e7eb;border-radius:12px;padding:6px 10px;font-weight:800;background:#fff}
        .memTag.pro{background:#facc15;color:#111827}
        .ttl{margin:0;font-size:38px;line-height:1.15;letter-spacing:.2px;text-shadow:0 8px 28px rgba(0,0,0,.15)}
        .sub{margin:6px 0 0;color:#475569}
        .motto{margin-top:8px;font-weight:900}

        .grid3{display:grid;gap:14px;grid-template-columns:repeat(1,minmax(0,1fr))}
        @media(min-width:700px){.grid3{grid-template-columns:repeat(3,minmax(0,1fr))}}
        .infoCard{position:relative;border:1px solid #e5e7eb;border-radius:18px;background:#fff;box-shadow:0 12px 30px rgba(0,0,0,.07);padding:16px;min-height:120px;display:flex;flex-direction:column;justify-content:space-between}
        .infoCard.gold{box-shadow:0 0 0 3px rgba(234,179,8,.35) inset}
        .infoTop{font-size:13px;color:#64748b;font-weight:800}
        .infoMain{font-size:26px;font-weight:900}
        .infoMain.small{font-size:16px}
        .infoFoot{font-size:12px;color:#6b7280}
        .badgePro{position:absolute;right:12px;top:12px;background:#facc15;border:1px solid #d1a90b;border-radius:999px;padding:2px 8px;font-size:11px;font-weight:900}

        .gridMain{display:grid;grid-template-columns:1fr;gap:16px}
        .grid2{display:grid;gap:16px;grid-template-columns:1fr}
        @media(min-width:860px){.gridMain{grid-template-columns:1fr}.grid2{grid-template-columns:1fr 1fr}}
        .col{display:grid;gap:16px}
        .card{border:1px solid #e5e7eb;border-radius:18px;background:#fff;box-shadow:0 12px 30px rgba(0,0,0,.07);padding:16px}
        .lbl{display:block;font-weight:900;margin-bottom:8px}
        .inp{width:100%;border:1px solid #e5e7eb;border-radius:14px;padding:12px 14px;font-size:15px}
        .uploader{border:1px dashed #d1d5db;border-radius:14px;padding:12px;background:#fafafa}
        .hint{margin-top:4px;font-size:12px;color:#6b7280}
        .thumbs{margin-top:10px;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px}
        .ph{aspect-ratio:1/1;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;background:#fff}
        .ph img{width:100%;height:100%;object-fit:cover}

        .toggle{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
        .pill{border:1px solid #e5e7eb;border-radius:999px;padding:8px 14px;font-weight:800;background:#fff;cursor:pointer}
        .pill.on{background:#111827;color:#fff;border-color:#111827}
        .feeNote{font-size:12px;font-weight:900;color:#92400e}
        .warn{margin-top:6px;font-size:12px;font-weight:900;color:#b91c1c}

        .goldOutline{box-shadow:0 0 0 3px rgba(234,179,8,.35) inset}
        .veri{display:flex;align-items:center;gap:8px}
        .vTtl{font-weight:900;font-size:14px}
        .vTag{font-size:11px;border:1px solid #e5e7eb;background:#fff3bf;color:#7c5c0a;border-radius:999px;padding:2px 8px;font-weight:900}
        .vHint{font-size:12px;color:#6b7280;margin-top:4px}

        .actions{display:flex;gap:10px;flex-wrap:wrap}
        .btnPrimary{border:1px solid #111827;background:#111827;color:#fff;border-radius:12px;padding:12px 16px;font-weight:900;cursor:pointer;background-image:linear-gradient(135deg,#ef4444,#8b5cf6,#22c55e)}
        .btnGhost{border:1px solid #e5e7eb;background:#fff;border-radius:12px;padding:12px 16px;font-weight:900;cursor:pointer}

        .rulesFooter{margin:12px 0}
        .rulesBox{background:#111;border:1px solid rgba(255,255,255,.12);color:#e2e8f0;border-radius:14px;padding:14px}
        .rulesBox .rulesHd{font-weight:900;margin-bottom:6px}
        .rulesBox ul{margin:0;padding-left:18px;font-size:13px;color:#cbd5e1}

        .footer{margin-top:18px;background:#0b0b0b;color:#e2e8f0;border-top:1px solid rgba(255,255,255,.12)}
        .footTtl{font-weight:900;margin-bottom:6px}
        .footLinks{display:flex;flex-wrap:wrap;gap:10px}
        .footLinks a{color:#e2e8f0;font-size:13px;padding:6px 8px;border-radius:8px;text-decoration:none}
        .footLinks a:hover{background:rgba(255,255,255,.08);color:#fff}
        .copy{margin:6px 0 8px;font-size:12px;color:#94a3b8}

        header{border-bottom:1px solid #e5e7eb}
      `}</style>
    </main>
  );
}
