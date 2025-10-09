"use client";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

/**
 * FILE: /pages/portal/seller/post.jsx
 * Amaç: İlan Ver (PRO/Standart kuralları, 81 il, ilçe manuel, teslim süresi gün, max 5 foto)
 * Özellikler:
 *  - Tüm UI metinleri 4 dilde (tr, en, ar, de). Arapça RTL.
 *  - Favicon yolları public/ altındaki dosyalarla eşleşiyor.
 *  - Supabase + Cloudinary .env üzerinden. Eksikse kırmadan uyarı verir.
 *  - Kategori/alt kategori çok dilli. (Liste sabit; arama/filtre ileride)
 *  - Metin filtresi (check_listing_text) varsa çağırır; yoksa uyarıyla devam eder.
 *  - PRO → vitrin anahtarı ve kota kontrolü. Standart → 30 günde 1 ilan.
 */

/* ---------------------------- Supabase & Cloudinary ---------------------------- */
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = typeof window !== "undefined" && SUPABASE_URL && SUPABASE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

async function uploadToCloudinary(file) {
  if (!CLOUD_NAME || !UPLOAD_PRESET) throw new Error("CLOUDINARY_MISSING");
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", UPLOAD_PRESET);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: "POST", body: fd });
  if (!res.ok) throw new Error("CLOUDINARY_FAIL");
  const json = await res.json();
  return json.secure_url;
}

/* ---------------------------- DİL / ÇEVİRİLER ---------------------------- */
const SUPPORTED = ["tr", "en", "ar", "de"]; // RTL: ar
const LBL = {
  tr: {
    brand: "Üreten Eller",
    page: {
      title: "İlan Ver",
      subtitle: "Premium: 15 ilan + 1 vitrin. Standart: 30 günde 1 ilan. Her ilan 30 gün yayında.",
      back: "Geri",
      sending: "Gönderiliyor...",
      draftSaved: "Taslak kaydedildi.",
      mustLogin: "Bu işlem için giriş yapmalısınız.",
      sbMissing: "Veri ayarları eksik (Supabase)",
      cdnMissing: "Görsel ayarları eksik (Cloudinary)",
      cdnError: "Görsel yükleme başarısız. Lütfen tekrar deneyin.",
      textBlocked: "İlan metni kurallara uymuyor: ",
      okSubmitted: "İlan onaya gönderildi. Admin onaylayınca yayında olacak.",
      stdQuota: "Standart üyelik: son 30 günde 1 ilan hakkınız dolu.",
      showcaseUsed: "Vitrin hakkınız zaten kullanıldı.",
    },
    fields: {
      title: "Başlık",
      desc: "Açıklama",
      cat: "Ana Kategori",
      sub: "Alt Kategori",
      price: "Fiyat (₺)",
      currency: "Para Birimi",
      city: "İl",
      district: "İlçe",
      ship: "Tahmini Teslim Süresi (gün)",
      showcase: "Vitrin (PRO)",
      photos: "Fotoğraflar (en fazla 5)",
      photosHelp: "Görsel eklemek için tıklayın veya dosya bırakın",
    },
    ui: {
      required: "Zorunlu",
      optional: "opsiyonel",
      select: "Seçiniz...",
      chooseCat: "Önce kategori seçiniz",
      invalid: "Geçersiz",
      saveDraft: "Taslak Kaydet",
      submit: "Onaya Gönder",
      premiumNeeded: "Premium gerekli",
      oneRight: "1 hak",
    },
    panels: {
      rules: "Yayın Kuralları",
      tips: "Öneriler",
      rulesList: [
        "İlanlar 30 gün yayında kalır. Süre dolunca 'Süre uzat' ile +30 gün.",
        "Premium: aynı anda 15 ilan + 1 vitrin.",
        "Standart: 30 günde 1 ilan.",
        "Küfür/hakaret ve iletişim bilgisi (tel/e‑posta/WhatsApp) yasaktır.",
        "Tüm ilanlar önce admin onayına gelir.",
      ],
      tipsList: [
        "Kapakta 4:3 oranlı net bir fotoğraf kullanın.",
        "Fiyat, ölçü ve teslim süresini açık yazın.",
        "Alt kategori seçmek aramalarda görünürlüğü artırır.",
      ],
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
    page: {
      title: "Post Listing",
      subtitle: "Premium: 15 listings + 1 showcase. Standard: 1 per 30 days. Each listing stays live 30 days.",
      back: "Back",
      sending: "Submitting...",
      draftSaved: "Draft saved.",
      mustLogin: "Please sign in to continue.",
      sbMissing: "Data settings missing (Supabase)",
      cdnMissing: "Image settings missing (Cloudinary)",
      cdnError: "Image upload failed. Please try again.",
      textBlocked: "Listing text blocked: ",
      okSubmitted: "Listing submitted for review. It will go live after admin approval.",
      stdQuota: "Standard plan: your 1-per-30-days slot is already used.",
      showcaseUsed: "Your showcase slot is already used.",
    },
    fields: {
      title: "Title",
      desc: "Description",
      cat: "Category",
      sub: "Subcategory",
      price: "Price (₺)",
      currency: "Currency",
      city: "City",
      district: "District",
      ship: "Estimated Lead Time (days)",
      showcase: "Showcase (PRO)",
      photos: "Photos (max 5)",
      photosHelp: "Click or drop images to upload",
    },
    ui: {
      required: "Required",
      optional: "optional",
      select: "Select...",
      chooseCat: "Choose category first",
      invalid: "Invalid",
      saveDraft: "Save Draft",
      submit: "Submit for Review",
      premiumNeeded: "Premium required",
      oneRight: "1 slot",
    },
    panels: {
      rules: "Publishing Rules",
      tips: "Tips",
      rulesList: [
        "Listings stay live 30 days; extend +30 with 'Extend'.",
        "Premium: up to 15 listings + 1 showcase.",
        "Standard: 1 per 30 days.",
        "Profanity/contact info (phone/email/WhatsApp) is forbidden.",
        "All listings are reviewed by admin first.",
      ],
      tipsList: [
        "Use a clear 4:3 cover image.",
        "State price, size and lead time clearly.",
        "Picking a subcategory helps search.",
      ],
    },
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
    page: {
      title: "إنشاء إعلان",
      subtitle: "المحترف: 15 إعلانًا + واجهة. العادي: إعلان كل 30 يومًا. مدة الإعلان 30 يومًا.",
      back: "رجوع",
      sending: "جارٍ الإرسال...",
      draftSaved: "تم حفظ المسودة.",
      mustLogin: "فضلاً سجّل الدخول للمتابعة.",
      sbMissing: "إعدادات البيانات غير مكتملة (Supabase)",
      cdnMissing: "إعدادات الصور غير مكتملة (Cloudinary)",
      cdnError: "فشل رفع الصورة. حاول مجددًا.",
      textBlocked: "تم حظر نص الإعلان: ",
      okSubmitted: "تم إرسال الإعلان للمراجعة وسيُنشر بعد الموافقة.",
      stdQuota: "الخطة العادية: استخدمت حق إعلان واحد خلال 30 يومًا.",
      showcaseUsed: "لقد استخدمت حق الواجهة بالفعل.",
    },
    fields: {
      title: "العنوان",
      desc: "الوصف",
      cat: "التصنيف",
      sub: "التصنيف الفرعي",
      price: "السعر (₺)",
      currency: "العملة",
      city: "المدينة",
      district: "الحي / المنطقة",
      ship: "المدة التقديرية للتسليم (أيام)",
      showcase: "واجهة (محترف)",
      photos: "صور (حتى 5)",
      photosHelp: "انقر أو أسقط الصور للرفع",
    },
    ui: {
      required: "إلزامي",
      optional: "اختياري",
      select: "اختر...",
      chooseCat: "اختر التصنيف أولاً",
      invalid: "غير صالح",
      saveDraft: "حفظ المسودة",
      submit: "إرسال للمراجعة",
      premiumNeeded: "يتطلب محترف",
      oneRight: "حق واحد",
    },
    panels: {
      rules: "قواعد النشر",
      tips: "نصائح",
      rulesList: [
        "مدة الإعلان 30 يومًا، ويمكن التمديد 30 يومًا.",
        "المحترف: 15 إعلانًا + واجهة واحدة.",
        "العادي: إعلان واحد كل 30 يومًا.",
        "يُمنع الألفاظ النابية ومشاركة وسائل التواصل (هاتف/إيميل/واتساب).",
        "كل الإعلانات تُراجع قبل النشر.",
      ],
      tipsList: [
        "استخدم صورة غلاف واضحة بنسبة 4:3.",
        "اذكر السعر والمقاس ومدة التنفيذ بوضوح.",
        "اختيار تصنيف فرعي يحسن الظهور في البحث.",
      ],
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
      all: "كافة السياسات",
    },
  },
  de: {
    brand: "Ureten Eller",
    page: {
      title: "Inserat einstellen",
      subtitle: "Premium: 15 Inserate + 1 Vitrine. Standard: 1 alle 30 Tage. Laufzeit je 30 Tage.",
      back: "Zurück",
      sending: "Wird gesendet...",
      draftSaved: "Entwurf gespeichert.",
      mustLogin: "Bitte anmelden.",
      sbMissing: "Daten-Einstellungen fehlen (Supabase)",
      cdnMissing: "Bildeinstellungen fehlen (Cloudinary)",
      cdnError: "Bildupload fehlgeschlagen. Bitte erneut versuchen.",
      textBlocked: "Inseratstext blockiert: ",
      okSubmitted: "Inserat zur Prüfung gesendet. Veröffentlichung nach Freigabe.",
      stdQuota: "Standard: Dein 1/30‑Tage‑Kontingent ist verbraucht.",
      showcaseUsed: "Dein Vitrinen‑Kontingent ist bereits genutzt.",
    },
    fields: {
      title: "Titel",
      desc: "Beschreibung",
      cat: "Kategorie",
      sub: "Unterkategorie",
      price: "Preis (₺)",
      currency: "Währung",
      city: "Stadt",
      district: "Bezirk",
      ship: "Voraussichtliche Lieferzeit (Tage)",
      showcase: "Vitrine (PRO)",
      photos: "Fotos (max. 5)",
      photosHelp: "Zum Hochladen klicken oder Dateien ablegen",
    },
    ui: {
      required: "Pflicht",
      optional: "optional",
      select: "Bitte wählen...",
      chooseCat: "Erst Kategorie wählen",
      invalid: "Ungültig",
      saveDraft: "Entwurf speichern",
      submit: "Zur Prüfung senden",
      premiumNeeded: "Premium erforderlich",
      oneRight: "1 Slot",
    },
    panels: {
      rules: "Publikationsregeln",
      tips: "Tipps",
      rulesList: [
        "Inserate 30 Tage online; mit 'Verlängern' +30.",
        "Premium: bis 15 Inserate + 1 Vitrine.",
        "Standard: 1 pro 30 Tage.",
        "Vulgärsprache/Kontaktdaten (Telefon/E‑Mail/WhatsApp) verboten.",
        "Alle Inserate werden zuerst geprüft.",
      ],
      tipsList: [
        "Klares 4:3‑Titelbild verwenden.",
        "Preis, Maße und Lieferzeit klar angeben.",
        "Unterkategorie verbessert die Suche.",
      ],
    },
    legalBar: "Unternehmen",
    legal: {
      corporate: "Unternehmen",
      about: "Über uns",
      contact: "Kontakt",
      privacy: "Datenschutz",
      kvkk: "KVKK‑Hinweis",
      terms: "Nutzungsbedingungen",
      distance: "Fernabsatz",
      shippingReturn: "Lieferung & Rückgabe",
      cookies: "Cookie‑Richtlinie",
      rules: "Community‑Regeln",
      banned: "Verbotene Produkte",
      all: "Alle Rechtliches",
    },
  },
};

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
    { icon: "🧸", title: "Amigurumi & Spielzeug (Deko)", subs: ["Schlüsselanh.","Magnet","Sammelfigur","Deko‑Puppe","Amigurumi mit Name"] },
  ],
};

const TR_CITIES = [
  "Adana","Adıyaman","Afyonkarahisar","Ağrı","Amasya","Ankara","Antalya","Artvin","Aydın","Balıkesir","Bilecik","Bingöl","Bitlis","Bolu","Burdur","Bursa","Çanakkale","Çankırı","Çorum","Denizli","Diyarbakır","Edirne","Elazığ","Erzincan","Erzurum","Eskişehir","Gaziantep","Giresun","Gümüşhane","Hakkari","Hatay","Isparta","Mersin","İstanbul","İzmir","Kars","Kastamonu","Kayseri","Kırklareli","Kırşehir","Kocaeli","Konya","Kütahya","Malatya","Manisa","Kahramanmaraş","Mardin","Muğla","Muş","Nevşehir","Niğde","Ordu","Rize","Sakarya","Samsun","Siirt","Sinop","Sivas","Tekirdağ","Tokat","Trabzon","Tunceli","Şanlıurfa","Uşak","Van","Yozgat","Zonguldak","Aksaray","Bayburt","Karaman","Kırıkkale","Batman","Şırnak","Bartın","Ardahan","Iğdır","Yalova","Karabük","Kilis","Osmaniye","Düzce"
];

function useLang() {
  const [lang, setLang] = useState("tr");
  useEffect(() => {
    try { const saved = localStorage.getItem("lang"); if (saved && SUPPORTED.includes(saved)) setLang(saved); } catch {}
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);
  const t = useMemo(() => LBL[lang] || LBL.tr, [lang]);
  const cats = useMemo(() => (CATS[lang] || CATS.tr), [lang]);
  return { lang, t, cats };
}

export default function SellerPostPage() {
  const router = useRouter();
  const { t, cats } = useLang();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    subcategory: "",
    price: "",
    currency: "TRY",
    city: "",
    district: "",
    shipDays: "",
    isShowcase: false,
    images: [],
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [isPro, setIsPro] = useState(false);

  // Alt kategori listesi (seçilen kategoriye göre)
  const subs = useMemo(() => {
    const c = cats.find((x) => x.title === form.category);
    return c ? (c.subs || []) : [];
  }, [form.category, cats]);

  // Taslak geri yükle
  useEffect(() => {
    try {
      const raw = localStorage.getItem("sellerPostDraft");
      if (raw) setForm((f) => ({ ...f, ...JSON.parse(raw) }));
    } catch {}
  }, []);

  // PRO durumunu çek (varsa)
  useEffect(() => {
    (async () => {
      if (!supabase) return;
      try {
        const { data: sess } = await supabase.auth.getSession();
        const uid = sess?.session?.user?.id; if (!uid) return;
        const { data: me } = await supabase
          .from("users").select("premium_until").eq("auth_user_id", uid).maybeSingle();
        setIsPro(!!(me?.premium_until && new Date(me.premium_until) > new Date()));
      } catch {}
    })();
  }, []);

  // Görsel seçimi
  const onPickImages = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const remain = Math.max(0, 5 - form.images.length);
    const slice = files.slice(0, remain);
    const mapped = slice.map((file) => ({ file, url: URL.createObjectURL(file) }));
    setForm((f) => ({ ...f, images: [...f.images, ...mapped] }));
    e.target.value = "";
  };
  const removeImg = (idx) => setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));

  // Basit doğrulama
  const validate = useCallback(() => {
    const err = {};
    if (!form.title.trim()) err.title = t.ui.required;
    if (!form.description.trim()) err.description = t.ui.required;
    if (!form.category) err.category = t.ui.select;
    if (subs.length && !form.subcategory) err.subcategory = t.ui.select;
    if (!form.price || Number(form.price) <= 0) err.price = t.ui.invalid;
    if (!form.city) err.city = t.ui.select;
    if (!form.district.trim()) err.district = t.ui.required;
    if (!form.shipDays || Number(form.shipDays) <= 0) err.shipDays = t.ui.invalid;
    if (!form.images.length) err.images = t.ui.required;
    setErrors(err);
    return Object.keys(err).length === 0;
  }, [form, subs.length, t]);

  const saveDraft = () => {
    try { localStorage.setItem("sellerPostDraft", JSON.stringify({ ...form, images: [] })); alert(t.page.draftSaved); } catch {}
  };

  const submitForApproval = async () => {
    if (!validate()) { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    if (!supabase) { alert(t.page.sbMissing); return; }

    setSubmitting(true);
    try {
      const { data: sess, error: sErr } = await supabase.auth.getSession();
      if (sErr) throw sErr;
      const uid = sess?.session?.user?.id; if (!uid) throw new Error(t.page.mustLogin);

      // Kota kontrolleri (yumuşak)
      try {
        if (!isPro) {
          const since = new Date(Date.now() - 30*24*60*60*1000).toISOString();
          const { count } = await supabase
            .from("listings").select("id", { head:true, count:"exact" })
            .eq("seller_auth_id", uid).gte("created_at", since);
          if ((count || 0) >= 1) { alert(t.page.stdQuota); setSubmitting(false); return; }
        } else if (form.isShowcase) {
          const { count: vit } = await supabase
            .from("listings").select("id", { head:true, count:"exact" })
            .eq("seller_auth_id", uid).in("status", ["pending","active"]).eq("is_showcase", true);
          if ((vit || 0) >= 1) { alert(t.page.showcaseUsed); setSubmitting(false); return; }
        }
      } catch (e) { /* kota hatası UI'ı kırmasın */ }

      // Metin filtresi (varsa)
      try {
        const { error: txtErr } = await supabase.rpc("check_listing_text", { p_title: form.title, p_desc: form.description });
        if (txtErr) throw txtErr;
      } catch (e) {
        if (e?.message && !/function check_listing_text/i.test(e.message)) { // fonksiyon yoksa devam
          alert(t.page.textBlocked + e.message);
          setSubmitting(false); return;
        }
      }

      // Kayıt
      const payload = {
        seller_auth_id: uid,
        title: form.title.trim(), description: form.description.trim(),
        category: form.category || null, subcategory: form.subcategory || null,
        price: Number(form.price), currency: form.currency || "TRY",
        city: form.city, district: form.district.trim(), ship_days: Number(form.shipDays),
        is_showcase: !!(isPro && form.isShowcase), status: "pending",
      };
      const { data: ins, error: insErr } = await supabase
        .from("listings").insert([payload]).select("id").single();
      if (insErr) throw insErr; const listingId = ins.id;

      // Fotoğraflar
      const rows = [];
      for (let i=0; i<form.images.length; i++) {
        try {
          const url = await uploadToCloudinary(form.images[i].file);
          rows.push({ listing_id: listingId, url, order: i+1 });
        } catch (e) {
          if (e?.message === "CLOUDINARY_MISSING") { alert(t.page.cdnMissing); setSubmitting(false); return; }
          alert(t.page.cdnError); setSubmitting(false); return;
        }
      }
      if (rows.length) {
        const { error: phErr } = await supabase.from("listing_photos").insert(rows);
        if (phErr) throw phErr;
      }

      alert(t.page.okSubmitted);
      router.push("/portal/seller");
    } catch (e) {
      alert(e?.message || "Unexpected error");
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------------------- UI ---------------------------- */
  return (
    <>
      <Head>
        <title>{LBL.tr.brand} – {t.page.title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* FAVICONS → public/ */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <meta name="theme-color" content="#0b0b0b" />
      </Head>

      {/* TOPBAR */}
      <header className="topbar">
        <div className="brand" onClick={() => router.push("/portal/seller")}>
          <img src="/logo.png" width="34" height="34" alt="logo" />
          <span>{LBL.tr.brand}</span>
        </div>
        <div className="actions">
          <button className="ghost" onClick={() => router.back()}>{t.page.back}</button>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <h1 className="heroTitle">{t.page.title}</h1>
        <p className="subtitle">{t.page.subtitle}</p>
      </section>

      {/* FORM CARD */}
      <main className="wrap">
        <div className="card accent">
          <div className="grid">
            {/* LEFT: FORM */}
            <div className="col">
              <div className="field">
                <label>{t.fields.title} <span>*</span></label>
                <input type="text" value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} placeholder="Örn: El yapımı makrome duvar süsü" />
                {errors.title && <div className="err">{errors.title}</div>}
              </div>

              <div className="field">
                <label>{t.fields.desc} <span>*</span></label>
                <textarea rows={6} value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} placeholder="Ürün detayları, ölçüler, malzeme, bakım..." />
                {errors.description && <div className="err">{errors.description}</div>}
              </div>

              <div className="row2">
                <div className="field">
                  <label>{t.fields.cat} <span>*</span></label>
                  <select value={form.category} onChange={(e)=>setForm({...form,category:e.target.value,subcategory:""})}>
                    <option value="">{t.ui.select}</option>
                    {cats.map((c,i)=>(<option key={i} value={c.title}>{c.icon} {c.title}</option>))}
                  </select>
                  {errors.category && <div className="err">{errors.category}</div>}
                </div>
                <div className="field">
                  <label>{t.fields.sub} {subs.length ? <span>*</span> : <em className="soft">({t.ui.optional})</em>}</label>
                  <select value={form.subcategory} onChange={(e)=>setForm({...form,subcategory:e.target.value})} disabled={!subs.length}>
                    <option value="">{subs.length ? t.ui.select : t.ui.chooseCat}</option>
                    {subs.map((s,i)=>(<option key={i} value={s}>{s}</option>))}
                  </select>
                  {errors.subcategory && <div className="err">{errors.subcategory}</div>}
                </div>
              </div>

              <div className="row3">
                <div className="field">
                  <label>{t.fields.price} <span>*</span></label>
                  <input type="number" min="0" step="0.01" value={form.price} onChange={(e)=>setForm({...form,price:e.target.value})} placeholder="Örn: 249.90" />
                  {errors.price && <div className="err">{errors.price}</div>}
                </div>
                <div className="field">
                  <label>{t.fields.city} <span>*</span></label>
                  <select value={form.city} onChange={(e)=>setForm({...form,city:e.target.value})}>
                    <option value="">{t.ui.select}</option>
                    {TR_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.city && <div className="err">{errors.city}</div>}
                </div>
                <div className="field">
                  <label>{t.fields.district} <span>*</span></label>
                  <input type="text" value={form.district} onChange={(e)=>setForm({...form,district:e.target.value})} placeholder="Örn: Kadıköy" />
                  {errors.district && <div className="err">{errors.district}</div>}
                </div>
              </div>

              <div className="row2">
                <div className="field">
                  <label>{t.fields.ship} <span>*</span></label>
                  <input type="number" min="1" max="60" value={form.shipDays} onChange={(e)=>setForm({...form,shipDays:e.target.value})} placeholder="Örn: 7" />
                  {errors.shipDays && <div className="err">{errors.shipDays}</div>}
                </div>
                <div className="field">
                  <label>{t.fields.showcase}</label>
                  <div className="toggleLine">
                    <input id="vitrin" type="checkbox" checked={form.isShowcase} onChange={(e)=>setForm({...form,isShowcase:e.target.checked})} disabled={!isPro} />
                    <label htmlFor="vitrin" className="soft">{isPro ? t.ui.oneRight : t.ui.premiumNeeded}</label>
                  </div>
                </div>
              </div>

              <div className="field">
                <label>{t.fields.photos} <span>*</span></label>
                <div className="uploader" onClick={()=>document.getElementById("imgpick")?.click()}>
                  <input id="imgpick" type="file" accept="image/*" multiple onChange={onPickImages} style={{display:"none"}} />
                  <div className="drop">{t.fields.photosHelp}</div>
                  <div className="thumbs">
                    {form.images.map((im, idx) => (
                      <div className="thumb" key={idx}>
                        <img src={im.url} alt={`img-${idx}`} />
                        <button type="button" className="rm" onClick={() => removeImg(idx)} aria-label="Sil">×</button>
                      </div>
                    ))}
                    {Array.from({ length: Math.max(0, 5 - form.images.length) }).map((_, i) => (
                      <div className="ph" key={`ph-${i}`}>+</div>
                    ))}
                  </div>
                </div>
                {errors.images && <div className="err">{errors.images}</div>}
              </div>

              <div className="actionsRow">
                <button className="ghost" type="button" onClick={saveDraft} disabled={submitting}>{t.ui.saveDraft}</button>
                <button className="primary" type="button" onClick={submitForApproval} disabled={submitting}>{submitting ? t.page.sending : t.ui.submit}</button>
              </div>
            </div>

            {/* RIGHT: INFO */}
            <aside className="aside">
              <div className="mini">
                <h3>✨ {t.panels.rules}</h3>
                <ul>{t.panels.rulesList.map((li, i)=>(<li key={i}>{li}</li>))}</ul>
              </div>
              <div className="mini">
                <h3>💡 {t.panels.tips}</h3>
                <ul>{t.panels.tipsList.map((li, i)=>(<li key={i}>{li}</li>))}</ul>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* LEGAL FOOTER (siyah) */}
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
          <div className="copy">© {new Date().getFullYear()} {LBL.tr.brand}</div>
        </div>
      </footer>

      {/* STYLES */}
      <style jsx>{`
        :root{ --ink:#0f172a; --muted:#475569; --line:rgba(0,0,0,.10); }
        html,body{height:100%}
        body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial,sans-serif;color:var(--ink);
          background: radial-gradient(1100px 500px at 12% -10%, #ffe4e6, transparent),
                      radial-gradient(900px 480px at 88% -10%, #e0e7ff, transparent),
                      linear-gradient(120deg,#ff80ab,#a78bfa,#60a5fa,#34d399);
          background-attachment:fixed;}
        [dir="rtl"] .heroTitle, [dir="rtl"] .subtitle { text-align:center; }

        /* TOPBAR */
        .topbar{position:sticky;top:0;z-index:30;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 14px;
          background:rgba(255,255,255,.92);backdrop-filter:blur(8px);border-bottom:1px solid var(--line)}
        .brand{display:flex;align-items:center;gap:8px;font-weight:900;cursor:pointer}
        .actions{display:flex;gap:8px}
        .ghost{border:1px solid var(--line);background:#fff;border-radius:12px;padding:10px 12px;font-weight:700;cursor:pointer}
        .primary{border:none;background:linear-gradient(135deg,#111827,#4f46e5,#06b6d4);color:#fff;border-radius:12px;padding:12px 16px;font-weight:900;cursor:pointer;box-shadow:0 8px 22px rgba(0,0,0,.18)}

        /* HERO */
        .hero{max-width:1100px;margin:14px auto 0;padding:0 16px;text-align:center}
        .heroTitle{margin:6px 0 2px;font-size:40px;letter-spacing:.2px;text-shadow:0 8px 28px rgba(0,0,0,.15)}
        .subtitle{margin:0;color:#1f2937;font-weight:600}

        /* CARD */
        .wrap{max-width:1100px;margin:14px auto;padding:0 16px 40px}
        .card{background:#fff;border:1px solid #e5e7eb;border-radius:18px;box-shadow:0 12px 30px rgba(0,0,0,.10);padding:16px}
        .accent{position:relative}
        .accent:before{content:"";position:absolute;inset:-2px;z-index:-1;border-radius:20px;background:linear-gradient(135deg,#ff80ab,#a78bfa,#60a5fa,#34d399)}

        .grid{display:grid;gap:16px;grid-template-columns:1fr}
        @media(min-width:980px){ .grid{grid-template-columns:2fr 1fr;} }
        .col{display:flex;flex-direction:column;gap:12px}
        .aside{display:flex;flex-direction:column;gap:12px}
        .mini{border:1px solid #e5e7eb;border-radius:14px;padding:12px;background:#fafafa}
        .mini h3{margin:0 0 6px}
        ul{margin:6px 0 0;padding-left:18px}
        [dir="rtl"] ul{padding-left:0;padding-right:18px}
        li{margin:4px 0}

        /* FIELDS */
        .field{display:flex;flex-direction:column;gap:6px}
        .field label{font-weight:900}
        .field label span{color:#dc2626}
        .soft{color:#6b7280;font-style:normal;font-weight:600}
        input[type="text"], input[type="number"], select, textarea{border:1px solid #e5e7eb;border-radius:12px;padding:12px;font-size:14px;outline:none;background:#fff}
        textarea{resize:vertical}
        .row2{display:grid;gap:12px;grid-template-columns:1fr}
        .row3{display:grid;gap:12px;grid-template-columns:1fr}
        @media(min-width:700px){ .row2{grid-template-columns:1fr 1fr} .row3{grid-template-columns:1fr 1fr 1fr} }
        .err{color:#dc2626;font-size:12px}
        .toggleLine{display:flex;align-items:center;gap:8px}
        [dir="rtl"] .toggleLine{flex-direction:row-reverse}

        /* UPLOADER */
        .uploader{border:2px dashed #cbd5e1;border-radius:14px;padding:12px;background:linear-gradient(0deg,#fff, #f8fafc)}
        .drop{text-align:center;color:#475569;font-size:14px;margin-bottom:8px}
        .thumbs{display:grid;gap:10px;grid-template-columns:repeat(auto-fill,minmax(100px,1fr))}
        .thumb{position:relative;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;background:#fff}
        .thumb img{width:100%;height:100px;object-fit:cover;display:block}
        .thumb .rm{position:absolute;top:4px;right:4px;border:none;background:rgba(0,0,0,.65);color:#fff;border-radius:999px;width:24px;height:24px;cursor:pointer;font-size:16px}
        .ph{display:grid;place-items:center;border:2px dashed #e5e7eb;border-radius:12px;height:100px;color:#94a3b8;font-weight:900;font-size:22px;background:#fff}

        .actionsRow{display:flex;gap:10px;justify-content:flex-end;margin-top:6px}
        [dir="rtl"] .actionsRow{flex-direction:row-reverse}

        /* FOOTER */
        .legal{background:#0b0b0b;color:#f8fafc;border-top:1px solid rgba(255,255,255,.12);width:100vw;margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);margin-top:20px}
        .inner{max-width:1100px;margin:0 auto;padding:14px 16px}
        .ttl{font-weight:800;margin-bottom:8px}
        .links{display:flex;flex-wrap:wrap;gap:10px}
        .links a{color:#e2e8f0;font-size:13px;padding:6px 8px;border-radius:8px;text-decoration:none}
        .links a:hover{background:rgba(255,255,255,.08);color:#fff}
        .homeLink{margin-left:auto;font-weight:800}
        [dir="rtl"] .homeLink{margin-left:0;margin-right:auto}
        .copy{margin-top:8px;font-size:12px;color:#cbd5e1}
      `}</style>
    </>
  );
}
