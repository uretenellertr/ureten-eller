/* /pages/legal/cerez-politikasi.jsx */
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
      /* document.documentElement.lang = lang; */
      /* document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"; */
    }
  }, [lang]);
  return lang;
}

/** 4 dil — Çerez Politikası / Cookie Policy */
const T = {
  tr: {
    brand: "Üreten Eller",
    title: "Çerez Politikası",
    effective: "Yürürlük",
    intro:
      "Bu Çerez Politikası, ureteneller.com üzerinde kullanılan çerezleri ve benzeri teknolojileri, bu teknolojilerin amaçlarını ve tercihlerinizi nasıl yönetebileceğinizi açıklar.",
    whatTitle: "1) Çerez Nedir?",
    what:
      "Çerez (cookie), tarayıcınıza kaydedilen küçük metin dosyalarıdır. Oturumunuzu sürdürmek, tercihlerinizi hatırlamak, site performansını ölçmek ve güvenliği sağlamak için kullanılır.",
    typesTitle: "2) Kullandığımız Çerez Türleri",
    typesList: [
      "Zorunlu Çerezler: Oturum açma, güvenlik ve temel işlevler için gereklidir. Devre dışı bırakılamaz.",
      "Tercih Çerezleri: Dil (tr/en/ar/de), görünüm ve yerel ayarlar gibi tercihleri hatırlar.",
      "Analitik/Performans Çerezleri: Hangi sayfaların kullanıldığını, hataları ve hızları ölçer.",
      "Pazarlama/İzleme Çerezleri: Sadece açık rızanızla; kişiselleştirme ve kampanya ölçümü için kullanılır.",
    ],
    techTitle: "3) Benzeri Teknolojiler",
    techList: [
      "LocalStorage/SessionStorage: Dil ve oturum benzeri ayarlar için tarayıcı depolaması.",
      "Cihaz parmak izi ve günlük (log) verileri: Güvenlik, dolandırıcılık önleme ve hata ayıklama.",
      "CDN ve medya barındırma: Görseller ve statik içerikler için önbellekleme.",
    ],
    thirdTitle: "4) Üçüncü Taraflar",
    thirdIntro:
      "Hizmet için gerekli bazı çerezler/teknolojiler üçüncü taraf sağlayıcılarca sunulur:",
    thirdList: [
      "Ödeme kuruluşları (PayTR/iyzico): Ödeme, bloke/emanet, iade akışları.",
      "Barındırma/Veritabanı (Supabase): Kimlik, veri saklama ve güvenlik.",
      "Medya (Cloudinary): İlan ve profil görsellerinin güvenli sunumu.",
      "Analitik/Hata ayıklama: Sadece gerekli ve asgari verilerle.",
    ],
    consentTitle: "5) Rıza ve Yönetim",
    consentList: [
      "Zorunlu çerezler olmadan site temel fonksiyonları çalışmaz.",
      "Tercih/analitik/pazarlama çerezleri için sayfa altındaki çerez çubuğundan onay verebilir veya geri çekebilirsiniz.",
      "Tarayıcı ayarlarından çerezleri engelleyebilir/silebilirsiniz; bu durumda bazı özellikler çalışmayabilir.",
    ],
    manageTitle: "6) Tarayıcı Ayarları ile Yönetim",
    manageIntro: "Popüler tarayıcılar için çerez yönetimi:",
    manageList: [
      "Chrome: Ayarlar → Gizlilik ve güvenlik → Çerezler ve site verileri",
      "Firefox: Seçenekler → Gizlilik ve Güvenlik → Çerezler ve Site Verileri",
      "Safari: Tercihler → Gizlilik → Çerezleri Yönet",
      "Edge: Ayarlar → Çerezler ve site izinleri",
      "Mobil tarayıcılar: Sistem ayarları veya tarayıcı menüsü üzerinden çerez yönetimi",
    ],
    retentionTitle: "7) Saklama Süreleri",
    retention:
      "Oturum çerezleri tarayıcı kapanınca silinir; kalıcı çerezler türüne göre 30 gün ile 12 ay arasında tutulabilir. LocalStorage verileri siz silene kadar kalır.",
    changesTitle: "8) Değişiklikler",
    changes:
      "Bu politika güncellenebilir. En güncel sürüm ve yürürlük tarihi bu sayfada yayımlanır.",
    contactTitle: "9) İletişim",
    contact:
      "Sorularınız için: uretenellertr@gmail.com — Adres: Gümüşyaka Mah., Rahmi Sok., No: 27A, Silivri / İstanbul, 34588",
    quick: "Hızlı Geçiş",
    back: "Ana sayfa",
  },

  en: {
    brand: "Ureten Eller",
    title: "Cookie Policy",
    effective: "Effective",
    intro:
      "This Cookie Policy explains the cookies and similar technologies we use on ureteneller.com, their purposes, and how you can manage your preferences.",
    whatTitle: "1) What Are Cookies?",
    what:
      "Cookies are small text files stored in your browser. They help maintain your session, remember preferences, measure performance and improve security.",
    typesTitle: "2) Types We Use",
    typesList: [
      "Strictly Necessary: Required for login, security and core functions. Cannot be disabled.",
      "Preference: Remember language (tr/en/ar/de), view and locale settings.",
      "Analytics/Performance: Measure usage, errors and speed.",
      "Marketing/Tracking: Only with consent; used for personalization and campaign measurement.",
    ],
    techTitle: "3) Similar Technologies",
    techList: [
      "LocalStorage/SessionStorage: For language and session-like settings.",
      "Device fingerprinting & logs: Security, anti-fraud and debugging.",
      "CDN & media hosting: Caching images and static assets.",
    ],
    thirdTitle: "4) Third Parties",
    thirdIntro:
      "Some cookies/technologies are provided by service partners:",
    thirdList: [
      "Payment (PayTR/iyzico): payments, escrow and refunds.",
      "Hosting/Database (Supabase): identity, storage and security.",
      "Media (Cloudinary): secure delivery of listing and profile images.",
      "Analytics/Debugging: minimal data only.",
    ],
    consentTitle: "5) Consent & Controls",
    consentList: [
      "Without strictly necessary cookies, basic features won’t work.",
      "You can opt in/out of preference/analytics/marketing via the cookie bar shown at the bottom of pages.",
      "You may block/delete cookies via your browser; some features may break.",
    ],
    manageTitle: "6) Manage in Your Browser",
    manageIntro: "Where to manage cookies in popular browsers:",
    manageList: [
      "Chrome: Settings → Privacy and security → Cookies and other site data",
      "Firefox: Options → Privacy & Security → Cookies and Site Data",
      "Safari: Preferences → Privacy → Manage Website Data",
      "Edge: Settings → Cookies and site permissions",
      "Mobile browsers: system settings or in-app menu",
    ],
    retentionTitle: "7) Retention",
    retention:
      "Session cookies are deleted when the browser closes; persistent cookies last between 30 days and 12 months depending on type. LocalStorage persists until you clear it.",
    changesTitle: "8) Changes",
    changes:
      "We may update this policy. The latest version and effective date appear on this page.",
    contactTitle: "9) Contact",
    contact:
      "Questions: uretenellertr@gmail.com — Address: Gumusyaka Mah., Rahmi Sok., No: 27A, Silivri / Istanbul, 34588",
    quick: "Quick Links",
    back: "Home",
  },

  ar: {
    brand: "أُنتِج بالأيادي",
    title: "سياسة ملفات تعريف الارتباط (الكوكيز)",
    effective: "سريان",
    intro:
      "تشرح هذه السياسة الكوكيز والتقنيات المشابهة المستخدمة على ureteneller.com وأغراضها وكيفية إدارة تفضيلاتك.",
    whatTitle: "1) ما هي الكوكيز؟",
    what:
      "الكوكيز ملفات نصية صغيرة تُخزن في المتصفح. تساعد على الحفاظ على الجلسة وتذكر التفضيلات وقياس الأداء وتحسين الأمان.",
    typesTitle: "2) الأنواع التي نستخدمها",
    typesList: [
      "الضرورية تمامًا: مطلوبة لتسجيل الدخول والأمان والوظائف الأساسية. لا يمكن تعطيلها.",
      "التفضيلات: تتذكر اللغة (tr/en/ar/de) وإعدادات العرض والمنطقة.",
      "التحليلات/الأداء: قياس الاستخدام والأخطاء والسرعة.",
      "التسويق/التتبع: بموافقتك فقط؛ للتخصيص وقياس الحملات.",
    ],
    techTitle: "3) تقنيات مشابهة",
    techList: [
      "LocalStorage/SessionStorage: للغة وإعدادات مشابهة للجلسة.",
      "بصمة الجهاز والسجلات: للأمان ومكافحة الاحتيال وتصحيح الأخطاء.",
      "CDN واستضافة الوسائط: لتخزين الصور والمحتوى الثابت مؤقتًا.",
    ],
    thirdTitle: "4) جهات خارجية",
    thirdIntro:
      "تُقدم بعض التقنيات عبر مزوّدي خدمات:",
    thirdList: [
      "الدفع (PayTR/iyzico): المدفوعات والحجز والاستردادات.",
      "الاستضافة/قواعد البيانات (Supabase): الهوية والتخزين والأمان.",
      "الوسائط (Cloudinary): تقديم آمن لصور الإعلانات والملفات الشخصية.",
      "التحليلات/إصلاح الأخطاء: بحد أدنى من البيانات.",
    ],
    consentTitle: "5) الموافقة والتحكم",
    consentList: [
      "بدون الكوكيز الضرورية لن تعمل الوظائف الأساسية.",
      "يمكنك تفعيل/إلغاء كوكيز التفضيلات/التحليلات/التسويق عبر شريط الكوكيز أسفل الصفحات.",
      "يمكنك حظر/حذف الكوكيز من المتصفح؛ قد تتعطل بعض الميزات.",
    ],
    manageTitle: "6) الإدارة عبر المتصفح",
    manageIntro: "أماكن الإدارة في المتصفحات الشائعة:",
    manageList: [
      "Chrome: Settings → Privacy and security → Cookies and other site data",
      "Firefox: Options → Privacy & Security → Cookies and Site Data",
      "Safari: Preferences → Privacy → Manage Website Data",
      "Edge: Settings → Cookies and site permissions",
      "المتصفحات المحمولة: إعدادات النظام أو قائمة التطبيق",
    ],
    retentionTitle: "7) الاحتفاظ",
    retention:
      "تُحذف كوكيز الجلسة عند إغلاق المتصفح؛ وتستمر الكوكيز الدائمة بين 30 يومًا و12 شهرًا حسب النوع. تبقى LocalStorage حتى تقوم بمسحها.",
    changesTitle: "8) التغييرات",
    changes:
      "قد نقوم بتحديث هذه السياسة؛ يظهر أحدث إصدار وتاريخ السريان في هذه الصفحة.",
    contactTitle: "9) التواصل",
    contact:
      "الاستفسارات: uretenellertr@gmail.com — العنوان: حي غوموشياكا، شارع رحمي، رقم 27A، سيليفري/إسطنبول، 34588",
    quick: "روابط سريعة",
    back: "الصفحة الرئيسية",
  },

  de: {
    brand: "Ureten Eller",
    title: "Cookie-Richtlinie",
    effective: "Wirksam ab",
    intro:
      "Diese Richtlinie erklärt die auf ureteneller.com verwendeten Cookies/ähnlichen Technologien, ihre Zwecke und wie Sie Ihre Präferenzen verwalten.",
    whatTitle: "1) Was sind Cookies?",
    what:
      "Cookies sind kleine Textdateien im Browser. Sie halten Sitzungen aufrecht, merken Präferenzen, messen Performance und erhöhen die Sicherheit.",
    typesTitle: "2) Von uns verwendete Typen",
    typesList: [
      "Streng notwendige: Für Login, Sicherheit und Grundfunktionen. Nicht deaktivierbar.",
      "Präferenz: Merken Sprache (tr/en/ar/de), Ansicht und Locale.",
      "Analytics/Performance: Nutzung, Fehler und Geschwindigkeit messen.",
      "Marketing/Tracking: Nur mit Einwilligung; für Personalisierung/Kampagnenmessung.",
    ],
    techTitle: "3) Ähnliche Technologien",
    techList: [
      "LocalStorage/SessionStorage: Sprache und sitzungsähnliche Einstellungen.",
      "Geräte-Fingerprint & Logs: Sicherheit, Anti-Fraud, Debugging.",
      "CDN & Medienhosting: Caching von Bildern und statischen Assets.",
    ],
    thirdTitle: "4) Dritte",
    thirdIntro:
      "Einige Technologien werden von Partnern bereitgestellt:",
    thirdList: [
      "Zahlung (PayTR/iyzico): Zahlungen, Treuhand, Rückerstattungen.",
      "Hosting/Datenbank (Supabase): Identität, Speicherung, Sicherheit.",
      "Medien (Cloudinary): sichere Auslieferung von Inserats-/Profilbildern.",
      "Analytics/Debugging: nur Minimaldaten.",
    ],
    consentTitle: "5) Einwilligung & Steuerung",
    consentList: [
      "Ohne essentielle Cookies funktionieren Grundfunktionen nicht.",
      "Ein-/Ausschalten von Präferenz/Analytics/Marketing über die Cookie-Leiste unten.",
      "Sie können Cookies im Browser blockieren/löschen; Funktionen können beeinträchtigt werden.",
    ],
    manageTitle: "6) Im Browser verwalten",
    manageIntro: "So verwalten Sie Cookies in gängigen Browsern:",
    manageList: [
      "Chrome: Einstellungen → Datenschutz und Sicherheit → Cookies und Websitedaten",
      "Firefox: Einstellungen → Datenschutz & Sicherheit → Cookies und Website-Daten",
      "Safari: Einstellungen → Datenschutz → Website-Daten verwalten",
      "Edge: Einstellungen → Cookies und Websiteberechtigungen",
      "Mobil: Systemeinstellungen oder In-App-Menü",
    ],
    retentionTitle: "7) Aufbewahrung",
    retention:
      "Sitzungs-Cookies werden beim Schließen gelöscht; persistente Cookies 30 Tage bis 12 Monate. LocalStorage bleibt, bis Sie es löschen.",
    changesTitle: "8) Änderungen",
    changes:
      "Diese Richtlinie kann aktualisiert werden; die aktuelle Fassung/Wirksamkeit steht hier.",
    contactTitle: "9) Kontakt",
    contact:
      "Fragen: uretenellertr@gmail.com — Adresse: Gumusyaka Mah., Rahmi Sok., Nr. 27A, Silivri / Istanbul, 34588",
    quick: "Schnellzugriff",
    back: "Startseite",
  },
};

export const metadata = { title: "Çerez Politikası • Üreten Eller" };

export default function CookiesPage() {
  const lang = useLang();
  const t = useMemo(() => T[lang] || T.tr, [lang]);
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <div className="page" dir={dir}>
      <header className="topbar">
        <div className="wrap">
          <a className="brand" href="/">{t.brand}</a>
          <nav className="nav">
            <a className="link" href="/legal/gizlilik">
              {lang === "tr" ? "Gizlilik" : lang === "en" ? "Privacy" : lang === "ar" ? "الخصوصية" : "Datenschutz"}
            </a>
            <a className="link" href="/legal/kvkk-aydinlatma">
              {lang === "tr" ? "KVKK" : "KVKK"}
            </a>
            <a className="btn" href="/">{t.back}</a>
          </nav>
        </div>
      </header>

      <main className="wrap">
        <article className="paper">
          <h1>{t.title}</h1>
          <p className="muted">{t.effective}: 06.10.2025 — ureteneller.com</p>
          <p>{t.intro}</p>

          <h2>{t.whatTitle}</h2>
          <p>{t.what}</p>

          <h2>{t.typesTitle}</h2>
          <ul>{t.typesList.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <h2>{t.techTitle}</h2>
          <ul>{t.techList.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <h2>{t.thirdTitle}</h2>
          <p>{t.thirdIntro}</p>
          <ul>{t.thirdList.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <h2>{t.consentTitle}</h2>
          <ul>{t.consentList.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <h2>{t.manageTitle}</h2>
          <p>{t.manageIntro}</p>
          <ul>{t.manageList.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <h2>{t.retentionTitle}</h2>
          <p>{t.retention}</p>

          <h2>{t.changesTitle}</h2>
          <p>{t.changes}</p>

          <h2>{t.contactTitle}</h2>
          <p>{t.contact}</p>

          <hr />
          <p className="quick">
            <strong>{t.quick}: </strong>
            <a href="/legal/gizlilik">
              {lang === "tr" ? "Gizlilik" : lang === "en" ? "Privacy" : lang === "ar" ? "الخصوصية" : "Datenschutz"}
            </a>{" "}
            • <a href="/legal/kullanim-sartlari">
              {lang === "tr" ? "Kullanım Şartları" : lang === "en" ? "Terms of Use" : lang === "ar" ? "شروط الاستخدام" : "Nutzungsbedingungen"}
            </a>{" "}
            • <a href="/legal/teslimat-iade">
              {lang === "tr" ? "Teslimat & İade" : lang === "en" ? "Shipping & Returns" : lang === "ar" ? "التسليم والإرجاع" : "Lieferung & Rückgabe"}
            </a>
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
