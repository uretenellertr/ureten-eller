/* /pages/legal/gizlilik.jsx */
"use client";
import { useEffect, useMemo, useState } from "react";

/** Dil tespiti: localStorage.lang → tr | en | ar | de */
function useLang() {
  const [lang, setLang] = useState("tr");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const s = localStorage.getItem("lang");
      if (s && ["tr", "en", "ar", "de"].includes(s)) setLang(s);
      if (!s) {
        const nav = (navigator.language || "tr").slice(0, 2).toLowerCase();
        if (["tr", "en", "ar", "de"].includes(nav)) setLang(nav);
      }
    }
  }, []);
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    }
  }, [lang]);
  return lang;
}

/** 4 dil metinleri — Gizlilik Politikası */
const T = {
  tr: {
    brand: "Üreten Eller",
    title: "Gizlilik Politikası",
    intro:
      "Bu Gizlilik Politikası, Üreten Eller platformunda (ureteneller.com) kişisel verilerinizin toplanması, kullanılması, saklanması ve paylaşılmasına ilişkin ilkeleri açıklar.",
    scopeTitle: "1) Kapsam ve Veri Sorumlusu",
    controllerName: "Veri Sorumlusu",
    controller:
      "Üreten Eller (Şahıs işletmesi). Ticari unvan bulunmamakla birlikte mevzuat uyarınca veri sorumlusu sıfatıyla hareket eder.",
    controllerBlock: [
      "Adres: Gümüşyaka Mahallesi, Rahmi Sokak, No: 27A, Silivri / İstanbul, PK 34588",
      "Vergi Dairesi/No: Silivri VD — 9530226667",
      "E-posta: uretenellertr@gmail.com",
      "Telefon (WhatsApp): 0507279143",
      "Alan Adı: ureteneller.com",
    ],
    dataWeCollectTitle: "2) Topladığımız Veriler",
    dataWeCollectIntro:
      "Hizmetlerimizi sunabilmek için aşağıdaki veri kategorilerini işleriz:",
    dataWeCollect: [
      "Hesap verileri: ad-soyad, kullanıcı adı, e-posta, telefon, şehir, dil tercihi, KVKK onayı.",
      "Kimlik/iletişim doğrulamaları: e-posta doğrulama, (gerekirse) GSM doğrulama.",
      "İşlem verileri: ilan, sipariş, sepet/ödeme adımları, mesajlaşma, puan/yorum.",
      "Teknik veriler: IP, cihaz/cihaz parmak izi, tarayıcı bilgisi, günlük (log) kayıtları.",
      "Çerez ve benzeri teknolojiler: oturum, tercih, güvenlik ve analitik çerezler.",
      "Medya: profil fotoğrafı, ilan görselleri (Cloudinary vb. servislerde saklanabilir).",
      "Ödeme/kargo: ödeme sağlayıcı ve kargo entegrasyonunda gerekli sınırlı veriler.",
    ],
    legalBasisTitle: "3) Hukuki Sebepler (KVKK m.5-6 / GDPR eşdeğeri)",
    legalBasis: [
      "Sözleşmenin kurulması/ifası: üyelik, ilan, sipariş ve müşteri desteği.",
      "Meşru menfaat: güvenlik, dolandırıcılık önleme, hizmet iyileştirme.",
      "Hukuki yükümlülük: mali/vergisel kayıtlar, uyuşmazlık çözümü.",
      "Açık rıza: pazarlama iletileri, opsiyonel analitik/kişiselleştirme çerezleri.",
    ],
    purposesTitle: "4) İşleme Amaçları",
    purposes: [
      "Üyelik, giriş, şifre sıfırlama, e-posta doğrulama.",
      "İlan yayınlama, listeleme, vitrin ve arama.",
      "Sipariş/ödeme/kargo süreçleri; iade/iptal akışları.",
      "Mesajlaşma (satıcı–alıcı), yorum/puan sistemi.",
      "Güvenlik, dolandırıcılık tespiti, kötüye kullanım önleme.",
      "Hizmet kalitesi takibi, istatistik ve raporlama.",
      "Yasal taleplere yanıt ve yükümlülüklerin yerine getirilmesi.",
    ],
    cookiesTitle: "5) Çerezler ve Benzeri Teknolojiler",
    cookiesIntro:
      "Sitemizde zorunlu, tercih, performans ve pazarlama çerezleri kullanılır.",
    cookies: [
      "Zorunlu çerezler: oturum ve güvenlik için gereklidir.",
      "Tercih çerezleri: dil ve görüntüleme ayarlarını hatırlar.",
      "Analitik çerezler: site kullanımı ve performansı ölçer.",
      "Pazarlama çerezleri: yalnızca açık rıza ile kişiselleştirme/reklam.",
      "Ayrıntılar ve yönetim için: /legal/cerez-politikasi",
    ],
    sharingTitle: "6) Aktarımlar ve Alıcı Grupları",
    sharing: [
      "Ödeme kuruluşları (PayTR/iyzico): ödeme/bloke, iade süreçleri.",
      "Kargo/lojistik firmaları: teslimat ve iade gönderileri.",
      "Barındırma/altyapı/medya: Supabase, Cloudinary, CDN ve güvenlik servisleri.",
      "Analitik ve hata ayıklama: sadece gerekli ve asgari veriler.",
      "Yasal merciler: mevzuat gereği zorunlu haller.",
    ],
    retentionTitle: "7) Saklama Süreleri",
    retention: [
      "Hesap/işlem kayıtları: mevzuattaki asgari süreler (ör. 10 yıl) boyunca.",
      "Çerez verileri: türüne göre oturum/30 gün/12 aya kadar.",
      "Pazarlama rızası: geri çekilene kadar; istediğiniz an çekebilirsiniz.",
    ],
    rightsTitle: "8) Haklarınız (KVKK m.11)",
    rights: [
      "Veri işlenip işlenmediğini öğrenme ve bilgi talebi.",
      "Amaç, kapsam ve alıcılar hakkında bilgi alma.",
      "Eksik/yanlış işlenen verilerin düzeltilmesini isteme.",
      "Silme/yok etme talebi (mevzuat saklama zorunlulukları hariç).",
      "İtiraz ve rıza geri çekme hakkı.",
      "Başvuru: uretenellertr@gmail.com",
    ],
    securityTitle: "9) Güvenlik",
    security: [
      "Şifreli iletişim (HTTPS), erişim kısıtları ve rol tabanlı yetkilendirme.",
      "RLS politikaları (veritabanı düzeyi) ve en az ayrıcalık ilkesi.",
      "Hesap güvenliği için güçlü şifre ve 2FA (desteklendiğinde) önerilir.",
    ],
    childrenTitle: "10) 18 Yaş Altı",
    children:
      "Platform yetişkin kullanımına yöneliktir. 18 yaş altı, veli/vasî izni olmaksızın işlem yapmamalıdır.",
    updatesTitle: "11) Güncellemeler",
    updates:
      "Bu politika güncellenebilir; yürürlük tarihi ve sürümü sayfanın başında belirtilir.",
    contactTitle: "12) İletişim",
    contactIntro:
      "Hak ve talepleriniz için veri sorumlusuna aşağıdaki kanallardan ulaşabilirsiniz:",
    contactOutro:
      "Başvurularınız mevzuata uygun sürede sonuçlandırılır; gerekirse kimlik doğrulaması istenir.",
    quick: "Hızlı Geçiş",
    back: "Ana sayfa",
    effective: "Yürürlük",
  },

  en: {
    brand: "Ureten Eller",
    title: "Privacy Policy",
    intro:
      "This Policy explains how we collect, use, store and share your personal data on Ureten Eller (ureteneller.com).",
    scopeTitle: "1) Scope & Controller",
    controllerName: "Data Controller",
    controller:
      "Ureten Eller (sole proprietorship). Acts as the data controller under applicable law.",
    controllerBlock: [
      "Address: Gumusyaka Mah., Rahmi Sok., No: 27A, Silivri / Istanbul, 34588",
      "Tax Office/No: Silivri — 9530226667",
      "Email: uretenellertr@gmail.com",
      "Phone (WhatsApp): 0507279143",
      "Domain: ureteneller.com",
    ],
    dataWeCollectTitle: "2) Data We Collect",
    dataWeCollectIntro:
      "We process the following categories of data to provide our services:",
    dataWeCollect: [
      "Account data: name-surname, username, email, phone, city, language, KVKK consent.",
      "Verification: email verification, (if needed) GSM verification.",
      "Transactional: listings, orders, checkout/payment, messaging, ratings/reviews.",
      "Technical: IP, device fingerprint, browser info, logs.",
      "Cookies & similar tech: session, preference, security, analytics.",
      "Media: avatars and listing images (may be stored via Cloudinary, etc.).",
      "Payment/shipping: limited data required by PSP and carriers.",
    ],
    legalBasisTitle: "3) Legal Bases",
    legalBasis: [
      "Contract: membership, listings, orders and support.",
      "Legitimate interests: security, fraud prevention, service improvement.",
      "Legal obligation: fiscal records, dispute handling.",
      "Consent: marketing messages, optional analytics/personalization cookies.",
    ],
    purposesTitle: "4) Purposes",
    purposes: [
      "Sign-up, login, password reset, email verification.",
      "Publishing and browsing listings, showcase and search.",
      "Order/payment/shipping flows; cancellations/returns.",
      "Messaging (buyer–seller), ratings/reviews.",
      "Security, fraud detection, abuse prevention.",
      "Quality monitoring, statistics and reporting.",
      "Compliance with legal requests and obligations.",
    ],
    cookiesTitle: "5) Cookies & Similar Tech",
    cookiesIntro:
      "We use essential, preference, performance and marketing cookies.",
    cookies: [
      "Essential: required for session and security.",
      "Preference: remember language and view settings.",
      "Analytics: measure usage and performance.",
      "Marketing: only with consent for personalization/ads.",
      "Details & management: /legal/cerez-politikasi",
    ],
    sharingTitle: "6) Disclosures & Recipients",
    sharing: [
      "Payment service providers (PayTR/iyzico): escrow and refunds.",
      "Carriers/logistics: shipment and returns.",
      "Hosting/infrastructure/media: Supabase, Cloudinary, CDN and security services.",
      "Analytics and debugging: minimal data only.",
      "Authorities: where required by law.",
    ],
    retentionTitle: "7) Retention",
    retention: [
      "Accounts/transactions: for statutory minimums (e.g., up to 10 years).",
      "Cookies: per type — session/30 days/up to 12 months.",
      "Marketing consent: until withdrawn; you may opt out anytime.",
    ],
    rightsTitle: "8) Your Rights",
    rights: [
      "Access and information on processing.",
      "Learn purposes, scope and recipients.",
      "Rectification of incomplete/inaccurate data.",
      "Erasure (subject to statutory retention).",
      "Objection and withdrawal of consent.",
      "Contact: uretenellertr@gmail.com",
    ],
    securityTitle: "9) Security",
    security: [
      "Encrypted transport (HTTPS), access controls, role-based authorization.",
      "RLS policies at database level and least-privilege principle.",
      "Use strong passwords and 2FA where available.",
    ],
    childrenTitle: "10) Children",
    children:
      "Service is intended for adults. Under 18 should not use without guardian consent.",
    updatesTitle: "11) Updates",
    updates:
      "We may update this Policy; effective date/version appear at the top.",
    contactTitle: "12) Contact",
    contactIntro:
      "For inquiries and requests, contact the controller via the following channels:",
    contactOutro:
      "We respond within legal timeframes; identity verification may be required.",
    quick: "Quick Links",
    back: "Home",
    effective: "Effective",
  },

  ar: {
    brand: "أُنتِج بالأيادي",
    title: "سياسة الخصوصية",
    intro:
      "توضح هذه السياسة كيف نجمع بياناتك ونستخدمها ونخزّنها ونشاركها على «أُنتِج بالأيادي» (ureteneller.com).",
    scopeTitle: "1) النطاق والمسؤول عن المعالجة",
    controllerName: "المسؤول عن البيانات",
    controller:
      "أُنتِج بالأيادي (منشأة فردية) بوصفه مسؤولًا عن البيانات وفق القانون.",
    controllerBlock: [
      "العنوان: حي غوموشياكا، شارع رحمي، رقم 27A، سيليفري/إسطنبول 34588",
      "الضرائب: سيليفري — 9530226667",
      "البريد: uretenellertr@gmail.com",
      "الهاتف (واتساب): 0507279143",
      "النطاق: ureteneller.com",
    ],
    dataWeCollectTitle: "2) البيانات التي نجمعها",
    dataWeCollectIntro:
      "نعالج الفئات التالية من البيانات لتقديم خدماتنا:",
    dataWeCollect: [
      "بيانات الحساب: الاسم، اسم المستخدم، البريد، الهاتف، المدينة، اللغة، موافقة KVKK.",
      "التحقق: تفعيل البريد، (عند الحاجة) تحقق الهاتف.",
      "المعاملات: الإعلانات، الطلبات، الدفع، الرسائل، التقييمات.",
      "الفنية: IP، بصمة الجهاز، المتصفح، السجلات.",
      "الكوكيز: الجلسة، التفضيلات، الأمان، التحليلات.",
      "الوسائط: الصور الرمزية وصور الإعلانات (قد تُخزّن عبر Cloudinary).",
      "الدفع/الشحن: البيانات اللازمة لمزوّدي الدفع وشركات الشحن.",
    ],
    legalBasisTitle: "3) الأسس القانونية",
    legalBasis: [
      "العقد: العضوية، الإعلانات، الطلبات والدعم.",
      "المصلحة المشروعة: الأمان، مكافحة الاحتيال، تحسين الخدمة.",
      "الالتزام القانوني: السجلات الضريبية والنزاعات.",
      "الموافقة: التسويق والكوكيز الاختيارية.",
    ],
    purposesTitle: "4) الأغراض",
    purposes: [
      "التسجيل وتسجيل الدخول وإعادة تعيين كلمة المرور وتفعيل البريد.",
      "نشر وتصفّح الإعلانات والواجهة المميّزة والبحث.",
      "تدفقات الطلب/الدفع/الشحن؛ الإلغاء/الإرجاع.",
      "الرسائل (بائع–مشتري) والتقييمات.",
      "الأمان وكشف الاحتيال ومنع إساءة الاستخدام.",
      "الجودة والإحصاءات والتقارير.",
      "الامتثال للطلبات القانونية.",
    ],
    cookiesTitle: "5) الكوكيز والتقنيات المشابهة",
    cookiesIntro:
      "نستخدم الكوكيز الأساسية وتفضيلات الأداء والتسويق.",
    cookies: [
      "الأساسية: مطلوبة للجلسة والأمان.",
      "التفضيلات: تتذكر اللغة والإعدادات.",
      "التحليلات: قياس الاستخدام والأداء.",
      "التسويق: بموافقة فقط للتخصيص/الإعلانات.",
      "التفاصيل والإدارة: /legal/cerez-politikasi",
    ],
    sharingTitle: "6) الإفصاحات والمستلمون",
    sharing: [
      "مزودو الدفع (PayTR/iyzico): الحجز والاسترداد.",
      "شركات الشحن: التسليم والإرجاع.",
      "الاستضافة/البنية/الوسائط: Supabase وCloudinary وCDN وخدمات الأمان.",
      "التحليلات وإصلاح الأخطاء: بحد أدنى من البيانات.",
      "السلطات: حيثما يُطلب قانونًا.",
    ],
    retentionTitle: "7) الاحتفاظ",
    retention: [
      "الحساب/المعاملات: وفق الحدود القانونية (حتى 10 سنوات).",
      "الكوكيز: بحسب النوع — جلسة/30 يومًا/حتى 12 شهرًا.",
      "التسويق: حتى سحب الموافقة.",
    ],
    rightsTitle: "8) حقوقك",
    rights: [
      "الوصول والمعرفة بالمعالجة.",
      "معرفة الأغراض والنطاق والمستلمين.",
      "تصحيح البيانات غير الدقيقة.",
      "المحو (مع مراعاة الاحتفاظ القانوني).",
      "الاعتراض وسحب الموافقة.",
      "التواصل: uretenellertr@gmail.com",
    ],
    securityTitle: "9) الأمان",
    security: [
      "اتصال مشفّر (HTTPS) وضوابط وصول وتخويل قائم على الأدوار.",
      "سياسات RLS على مستوى قاعدة البيانات ومبدأ أقل امتياز.",
      "ننصح بكلمات مرور قوية و2FA عند توفره.",
    ],
    childrenTitle: "10) القُصَّر",
    children:
      "الخدمة مخصصة للبالغين. لا يُنصح لمن هم دون 18 دون موافقة ولي الأمر.",
    updatesTitle: "11) التحديثات",
    updates:
      "قد نحدّث هذه السياسة؛ تُذكر صلاحيتها/نسختها في الأعلى.",
    contactTitle: "12) الاتصال",
    contactIntro:
      "للطلبات والاستفسارات تواصل مع المسؤول عبر القنوات التالية:",
    contactOutro:
      "نرد ضمن المهل القانونية وقد نطلب التحقق من الهوية.",
    quick: "روابط سريعة",
    back: "الصفحة الرئيسية",
    effective: "سريان",
  },

  de: {
    brand: "Ureten Eller",
    title: "Datenschutz",
    intro:
      "Diese Richtlinie erläutert, wie wir Ihre Daten auf Ureten Eller (ureteneller.com) erheben, nutzen, speichern und teilen.",
    scopeTitle: "1) Umfang & Verantwortlicher",
    controllerName: "Verantwortlicher",
    controller:
      "Ureten Eller (Einzelunternehmen) als Verantwortlicher nach geltendem Recht.",
    controllerBlock: [
      "Adresse: Gumusyaka Mah., Rahmi Sok., Nr. 27A, Silivri / Istanbul, 34588",
      "Steueramt/-Nr.: Silivri — 9530226667",
      "E-Mail: uretenellertr@gmail.com",
      "Telefon (WhatsApp): 0507279143",
      "Domain: ureteneller.com",
    ],
    dataWeCollectTitle: "2) Erhobene Daten",
    dataWeCollectIntro:
      "Zur Bereitstellung verarbeiten wir folgende Kategorien:",
    dataWeCollect: [
      "Konto: Name, Nutzername, E-Mail, Telefon, Stadt, Sprache, KVKK-Einwilligung.",
      "Verifizierung: E-Mail-Bestätigung, ggf. GSM-Verifizierung.",
      "Transaktionen: Inserate, Bestellungen, Checkout/Zahlung, Nachrichten, Bewertungen.",
      "Technisch: IP, Geräte-Fingerprint, Browser, Logs.",
      "Cookies: Session, Präferenzen, Sicherheit, Analytics.",
      "Medien: Avatar-/Inseratbilder (ggf. Cloudinary).",
      "Zahlung/Versand: erforderliche Minimaldaten für PSP/Carrier.",
    ],
    legalBasisTitle: "3) Rechtsgrundlagen",
    legalBasis: [
      "Vertrag: Mitgliedschaft, Inserate, Bestellungen, Support.",
      "Berechtigtes Interesse: Sicherheit, Betrugsprävention, Verbesserung.",
      "Rechtspflicht: steuerliche Aufbewahrung, Streitbeilegung.",
      "Einwilligung: Marketing, optionale Analytics/Personalisierung-Cookies.",
    ],
    purposesTitle: "4) Zwecke",
    purposes: [
      "Registrierung, Login, Passwort-Reset, E-Mail-Verifizierung.",
      "Veröffentlichen/Ansehen von Inseraten, Vitrine, Suche.",
      "Bestell-/Zahlungs-/Versandabläufe; Storno/Retouren.",
      "Nachrichten (Käufer–Verkäufer), Bewertungen.",
      "Sicherheit, Betrugserkennung, Missbrauchsvermeidung.",
      "Qualität, Statistik, Reporting.",
      "Erfüllung rechtlicher Pflichten.",
    ],
    cookiesTitle: "5) Cookies & Ähnliche",
    cookiesIntro:
      "Wir nutzen essentielle, Präferenz-, Performance- und Marketing-Cookies.",
    cookies: [
      "Essentiell: für Session & Sicherheit erforderlich.",
      "Präferenz: merkt Sprache/Ansichten.",
      "Analytics: misst Nutzung & Performance.",
      "Marketing: nur mit Einwilligung.",
      "Details/Verwaltung: /legal/cerez-politikasi",
    ],
    sharingTitle: "6) Weitergaben & Empfänger",
    sharing: [
      "Zahlungsdienste (PayTR/iyzico): Treuhand & Rückerstattungen.",
      "Versender/Logistik: Lieferung & Retouren.",
      "Hosting/Infra/Medien: Supabase, Cloudinary, CDN, Security-Dienste.",
      "Analytics & Debugging: nur Minimaldaten.",
      "Behörden: wenn gesetzlich gefordert.",
    ],
    retentionTitle: "7) Aufbewahrung",
    retention: [
      "Konten/Transaktionen: gesetzliche Mindestfristen (z. B. bis 10 Jahre).",
      "Cookies: je Typ — Session/30 Tage/bis 12 Monate.",
      "Marketing-Einwilligung: bis zum Widerruf.",
    ],
    rightsTitle: "8) Ihre Rechte",
    rights: [
      "Auskunft und Informationen zur Verarbeitung.",
      "Zwecke, Umfang und Empfänger erfahren.",
      "Berichtigung unrichtiger/unvollständiger Daten.",
      "Löschung (unter Beachtung gesetzlicher Aufbewahrung).",
      "Widerspruch und Widerruf der Einwilligung.",
      "Kontakt: uretenellertr@gmail.com",
    ],
    securityTitle: "9) Sicherheit",
    security: [
      "Verschlüsselte Übertragung (HTTPS), Zugriffskontrollen, Rollenrechte.",
      "RLS auf DB-Ebene, Least-Privilege-Prinzip.",
      "Starke Passwörter, ggf. 2FA empfohlen.",
    ],
    childrenTitle: "10) Minderjährige",
    children:
      "Dienst richtet sich an Erwachsene. Unter 18 nur mit Zustimmung der Erziehungsberechtigten.",
    updatesTitle: "11) Aktualisierungen",
    updates:
      "Diese Richtlinie kann aktualisiert werden; Wirksamkeitsdatum/Version oben.",
    contactTitle: "12) Kontakt",
    contactIntro:
      "Für Anfragen wenden Sie sich an den Verantwortlichen über:",
    contactOutro:
      "Wir antworten fristgerecht; ggf. Identitätsprüfung.",
    quick: "Schnellzugriff",
    back: "Startseite",
    effective: "Wirksam ab",
  },
};

export const metadata = { title: "Gizlilik • Üreten Eller" };

export default function PrivacyPage() {
  const lang = useLang();
  const t = useMemo(() => T[lang] || T.tr, [lang]);
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <div className="page" dir={dir}>
      <header className="topbar">
        <div className="wrap">
          <a className="brand" href="/">{t.brand}</a>
          <nav className="nav">
            <a className="link" href="/legal/cerez-politikasi">Çerez Politikası</a>
            <a className="link" href="/legal/kvkk-aydinlatma">KVKK</a>
            <a className="btn" href="/">{t.back}</a>
          </nav>
        </div>
      </header>

      <main className="wrap">
        <article className="paper">
          <h1>{t.title}</h1>
          <p className="muted">
            {t.effective}: 06.10.2025 — ureteneller.com
          </p>
          <p>{t.intro}</p>

          <h2>{t.scopeTitle}</h2>
          <p><strong>{t.controllerName}:</strong> {t.controller}</p>
          <ul>{t.controllerBlock.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <h2>{t.dataWeCollectTitle}</h2>
          <p>{t.dataWeCollectIntro}</p>
          <ul>{t.dataWeCollect.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <h2>{t.legalBasisTitle}</h2>
          <ul>{t.legalBasis.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <h2>{t.purposesTitle}</h2>
          <ul>{t.purposes.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <h2>{t.cookiesTitle}</h2>
          <p>{t.cookiesIntro}</p>
          <ul>{t.cookies.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <h2>{t.sharingTitle}</h2>
          <ul>{t.sharing.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <h2>{t.retentionTitle}</h2>
          <ul>{t.retention.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <h2>{t.rightsTitle}</h2>
          <ul>{t.rights.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <h2>{t.securityTitle}</h2>
          <ul>{t.security.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <h2>{t.childrenTitle}</h2>
          <p>{t.children}</p>

          <h2>{t.updatesTitle}</h2>
          <p>{t.updates}</p>

          <h2>{t.contactTitle}</h2>
          <p>{t.contactIntro}</p>
          <ul>
            <li>E-posta: uretenellertr@gmail.com</li>
            <li>Adres: Gümüşyaka Mah., Rahmi Sok., No: 27A, Silivri / İstanbul, 34588</li>
            <li>Telefon (WhatsApp): 0507279143</li>
          </ul>
          <p>{t.contactOutro}</p>

          <hr />
          <p className="quick">
            <strong>{t.quick}: </strong>
            <a href="/legal/kullanim-sartlari">Kullanım Şartları</a> •{" "}
            <a href="/legal/kvkk-aydinlatma">KVKK Aydınlatma</a> •{" "}
            <a href="/legal/teslimat-iade">Teslimat &amp; İade</a>
          </p>
        </article>
      </main>

      <style jsx>{`
        :root{
          --ink:#0f172a; --muted:#475569; --bg:#f8fafc;
          --paper:#ffffff; --line:#e5e7eb; --brand:#111827; --focus:#0ea5e9;
        }
        *{box-sizing:border-box}
        body{margin:0}
        .wrap{max-width:1100px;margin:0 auto;padding:0 16px}
        .topbar{position:sticky;top:0;z-index:30;background:#fff;border-bottom:1px solid var(--line)}
        .topbar .wrap{height:56px;display:flex;align-items:center;justify-content:space-between}
        .brand{font-weight:800;text-decoration:none;color:var(--brand)}
        .nav{display:flex;gap:10px;align-items:center}
        .link{color:#334155;text-decoration:none;font-size:14px;border:1px solid transparent;padding:6px 8px;border-radius:8px}
        .link:hover{border-color:var(--line)}
        .btn{display:inline-block;padding:8px 12px;border-radius:10px;border:1px solid var(--line);text-decoration:none;color:var(--brand)}
        .btn:hover{border-color:var(--focus)}
        .page{background:var(--bg);min-height:100vh;color:var(--ink)}
        .paper{background:var(--paper);border:1px solid var(--line);border-radius:14px;margin:18px 0;padding:18px}
        .paper h1{margin:.1em 0 .4em}
        .paper h2{margin:1.2em 0 .5em}
        .paper p,.paper li{line-height:1.7}
        .muted{color:var(--muted)}
        .quick a{color:#0ea5e9;text-decoration:none}
        .quick a:hover{text-decoration:underline}
      `}</style>
    </div>
  );
}
