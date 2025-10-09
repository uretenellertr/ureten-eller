/* /pages/legal/kvkk-aydinlatma.jsx */
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

/** 4 dil — KVKK Aydınlatma Metni */
const T = {
  tr: {
    brand: "Üreten Eller",
    title: "KVKK Aydınlatma Metni",
    effective: "Yürürlük",
    intro:
      "6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca, Üreten Eller olarak kişisel verilerin işlenmesine ilişkin aşağıdaki konularda sizleri bilgilendiriyoruz.",
    controllerTitle: "1) Veri Sorumlusu ve İletişim",
    controllerDesc:
      "Üreten Eller (şahıs işletmesi) veri sorumlusu sıfatıyla hareket etmektedir.",
    controllerBlock: [
      "Adres: Gümüşyaka Mahallesi, Rahmi Sokak, No: 27A, Silivri / İstanbul, PK 34588",
      "Vergi Dairesi/No: Silivri — 9530226667",
      "E-posta: uretenellertr@gmail.com",
      "Telefon (WhatsApp): 0507279143",
      "Alan Adı: ureteneller.com",
    ],
    purposeTitle: "2) Kişisel Verilerin İşlenme Amaçları (KVKK m.10)",
    purposeList: [
      "Üyelik ve kimlik doğrulama süreçlerinin yürütülmesi.",
      "Satıcı ve alıcı işlemlerinin (ilan, sipariş, ödeme, kargo) gerçekleştirilmesi.",
      "Müşteri hizmetleri, itiraz/şikâyet, iade/iptal süreçlerinin yönetimi.",
      "Güvenlik, dolandırıcılık önleme, kötüye kullanım tespiti ve denetim.",
      "Hizmet kalitesinin artırılması, istatistik/raporlama, performans ölçümü.",
      "Hukuki yükümlülüklerin yerine getirilmesi ve resmi makam taleplerine yanıt.",
      "Açık rıza bulunması hâlinde pazarlama/iletişim faaliyetleri.",
    ],
    dataTitle: "3) İşlenen Kişisel Veri Kategorileri",
    dataIntro:
      "Hizmet kapsamına göre aşağıdaki veri kategorileri işlenebilir:",
    dataList: [
      "Kimlik/iletişim: ad-soyad, kullanıcı adı, e-posta, telefon, şehir.",
      "Hesap/işlem: ilan, sipariş, ödeme adımları, mesajlaşma, puan/yorum.",
      "Teknik: IP, cihaz bilgisi, oturum/çerez kayıtları, günlük (log) verileri.",
      "Görsel/işitsel: profil ve ilan görselleri (Cloudinary gibi servislerde saklanabilir).",
      "Ödeme/kargo: ödeme kuruluşu ve kargo süreçleri için gerekli asgari veriler.",
      "Tercih: dil seçimi, KVKK/çerez onayı, bildirim tercihleri.",
    ],
    legalTitle: "4) Hukuki Sebepler (KVKK m.5-6)",
    legalList: [
      "Sözleşmenin kurulması/ifası (üyelik, ilan, sipariş).",
      "Hukuki yükümlülüklerin yerine getirilmesi.",
      "Meşru menfaat (güvenlik, dolandırıcılık önleme, geliştirme).",
      "Açık rıza (pazarlama, opsiyonel çerezler vb.).",
      "Kanunlarda açıkça öngörülmesi.",
    ],
    collectTitle: "5) Toplama Yöntemleri",
    collectList: [
      "Doğrudan sizden (kayıt formları, profil, ilan, sipariş).",
      "Otomatik yollarla (çerezler, oturum, cihaz/uygulama kayıtları).",
      "Üçüncü kişilerden (ödeme/kargo hizmet sağlayıcıları, güvenlik/analitik).",
    ],
    transferTitle: "6) Aktarımlar ve Yurt Dışı Aktarım",
    transferIntro:
      "KVKK m.8-9 çerçevesinde; kişisel verileriniz aşağıdaki taraflarla ve gerekli hâllerde yurt dışına aktarılabilir:",
    transferList: [
      "Ödeme kuruluşları (PayTR/iyzico) — ödeme/bloke/iadeler.",
      "Kargo/lojistik firmaları — gönderi ve iade süreçleri.",
      "Barındırma/altyapı/medya — Supabase, Cloudinary, CDN, güvenlik servisleri.",
      "Analitik/hata ayıklama — asgari veri prensibiyle.",
      "Resmî kurumlar — mevzuat gereği zorunlu haller.",
    ],
    transferLawNote:
      "Yurt dışı aktarımlarda KVKK m.9’daki yeterlilik kararları, taahhütname veya açık rıza koşulları esas alınır.",
    rightsTitle: "7) KVKK m.11 Kapsamındaki Haklarınız",
    rightsList: [
      "Kişisel verinizin işlenip işlenmediğini öğrenme.",
      "Amaç, kapsam ve aktarımlar hakkında bilgi talebi.",
      "Eksik/yanlış işlenen verilerin düzeltilmesini isteme.",
      "Silinmesini/anonimleştirilmesini talep etme (saklama yükümlülükleri hariç).",
      "İtiraz, rıza geri çekme ve zarar halinde tazmin talebi.",
    ],
    applyTitle: "8) Başvuru Yöntemi",
    applyIntro:
      "KVKK kapsamındaki taleplerinizi yazılı veya kayıtlı iletişim kanallarından iletebilirsiniz:",
    applyList: [
      "E-posta: uretenellertr@gmail.com",
      "Posta: Gümüşyaka Mah., Rahmi Sok., No: 27A, Silivri / İstanbul, 34588",
      "Talebinize kimlik teyidi için ek bilgi/belge istenebilir.",
    ],
    retentionTitle: "9) Saklama Süreleri",
    retentionList: [
      "Hesap/işlem verileri — mevzuatın öngördüğü asgari süreler (ör. 10 yıl).",
      "Çerez verileri — türüne göre oturum/30 gün/12 aya kadar.",
      "Pazarlama rızası — rıza geri çekilene kadar.",
    ],
    securityTitle: "10) Güvenlik Tedbirleri",
    securityList: [
      "Şifreleme (HTTPS), erişim kontrolleri, rol tabanlı yetkilendirme.",
      "Veri tabanı düzeyinde RLS politikaları ve en az ayrıcalık ilkesi.",
      "Altyapı ve tedarikçilerde sözleşmesel/teknik-idari tedbirler.",
    ],
    updateTitle: "11) Güncellemeler",
    updateText:
      "Aydınlatma metni güncellenebilir; yürürlük tarihi bu sayfanın başında belirtilir.",
    quick: "Hızlı Geçiş",
    back: "Ana sayfa",
  },

  en: {
    brand: "Ureten Eller",
    title: "KVKK Notice (Turkish Data Law)",
    effective: "Effective",
    intro:
      "Pursuant to Turkish Law No. 6698 (KVKK), we inform you about processing of personal data by Ureten Eller.",
    controllerTitle: "1) Data Controller & Contact",
    controllerDesc:
      "Ureten Eller (sole proprietorship) acts as the data controller.",
    controllerBlock: [
      "Address: Gumusyaka Mah., Rahmi Sok., No: 27A, Silivri / Istanbul, 34588",
      "Tax Office/No: Silivri — 9530226667",
      "Email: uretenellertr@gmail.com",
      "Phone (WhatsApp): 0507279143",
      "Domain: ureteneller.com",
    ],
    purposeTitle: "2) Purposes of Processing",
    purposeList: [
      "Membership and identity verification.",
      "Listings, orders, payments, and shipping.",
      "Customer support, complaints, cancellation/returns.",
      "Security, fraud prevention, abuse detection and audits.",
      "Service quality, statistics and performance.",
      "Legal compliance and responses to authorities.",
      "With consent: marketing/communications.",
    ],
    dataTitle: "3) Categories of Data",
    dataIntro: "Depending on the service scope, we may process:",
    dataList: [
      "Identity/Contact: name, username, email, phone, city.",
      "Account/Transactions: listings, orders, payments, messages, ratings.",
      "Technical: IP, device info, session/cookie records, logs.",
      "Visual/Audio: avatars and listing images (may be stored via Cloudinary).",
      "Payment/Shipping: minimal data required by PSP and carriers.",
      "Preferences: language, KVKK/cookie consent, notifications.",
    ],
    legalTitle: "4) Legal Bases",
    legalList: [
      "Contract performance (membership, listings, orders).",
      "Legal obligation.",
      "Legitimate interests (security, anti-fraud, improvement).",
      "Consent (marketing, optional cookies, etc.).",
      "Explicitly stipulated by law.",
    ],
    collectTitle: "5) How We Collect",
    collectList: [
      "Directly from you (sign-up, profile, listings, orders).",
      "Automatically (cookies, sessions, device/application logs).",
      "From third parties (PSP/shipping providers, security/analytics).",
    ],
    transferTitle: "6) Disclosures & International Transfers",
    transferIntro:
      "Under KVKK, your data may be shared with the following and transferred abroad when necessary:",
    transferList: [
      "Payment service providers (PayTR/iyzico) — escrow/refunds.",
      "Carriers/logistics — shipment and returns.",
      "Hosting/infrastructure/media — Supabase, Cloudinary, CDN, security.",
      "Analytics/debugging — minimal data only.",
      "Authorities — where required by law.",
    ],
    transferLawNote:
      "International transfers rely on adequacy decisions, undertakings or explicit consent as per KVKK.",
    rightsTitle: "7) Your Rights (KVKK Art. 11)",
    rightsList: [
      "Learn whether data is processed.",
      "Request information on purposes and disclosures.",
      "Request correction of incomplete/inaccurate data.",
      "Request deletion/anonymization (subject to statutory retention).",
      "Object, withdraw consent, and claim damages if incurred.",
    ],
    applyTitle: "8) How to Apply",
    applyIntro:
      "Send your KVKK requests via the following channels:",
    applyList: [
      "Email: uretenellertr@gmail.com",
      "Mail: Gumusyaka Mah., Rahmi Sok., No: 27A, Silivri / Istanbul, 34588",
      "We may request additional info for identity verification.",
    ],
    retentionTitle: "9) Retention",
    retentionList: [
      "Accounts/transactions — statutory minimums (e.g., up to 10 years).",
      "Cookies — per type (session/30 days/12 months).",
      "Marketing consent — until withdrawn.",
    ],
    securityTitle: "10) Security Measures",
    securityList: [
      "Encryption (HTTPS), access controls, role-based authorization.",
      "DB-level RLS and least-privilege principle.",
      "Contractual/technical-organizational measures with providers.",
    ],
    updateTitle: "11) Updates",
    updateText:
      "This notice may be updated; the effective date appears above.",
    quick: "Quick Links",
    back: "Home",
  },

  ar: {
    brand: "أُنتِج بالأيادي",
    title: "إشعار KVKK (قانون البيانات التركي)",
    effective: "سريان",
    intro:
      "بموجب القانون التركي رقم 6698 (KVKK)، نُعلمكم بكيفية معالجة بياناتكم لدى «أُنتِج بالأيادي».",
    controllerTitle: "1) المسؤول عن البيانات والتواصل",
    controllerDesc:
      "«أُنتِج بالأيادي» (منشأة فردية) بصفته المسؤول عن البيانات.",
    controllerBlock: [
      "العنوان: حي غوموشياكا، شارع رحمي، رقم 27A، سيليفري/إسطنبول 34588",
      "الضرائب: سيليفري — 9530226667",
      "البريد: uretenellertr@gmail.com",
      "الهاتف (واتساب): 0507279143",
      "النطاق: ureteneller.com",
    ],
    purposeTitle: "2) أغراض المعالجة",
    purposeList: [
      "العضوية والتحقق من الهوية.",
      "الإعلانات والطلبات والمدفوعات والشحن.",
      "الدعم والشكاوى والإلغاء/الإرجاع.",
      "الأمان ومكافحة الاحتيال والكشف عن الإساءة والتدقيق.",
      "تحسين الخدمة والإحصاءات والأداء.",
      "الامتثال القانوني والاستجابة للسلطات.",
      "بالموافقة: التسويق/التواصل.",
    ],
    dataTitle: "3) فئات البيانات",
    dataIntro: "وفق نطاق الخدمة قد نعالج:",
    dataList: [
      "الهوية/الاتصال: الاسم، اسم المستخدم، البريد، الهاتف، المدينة.",
      "الحساب/المعاملات: الإعلانات، الطلبات، الدفعات، الرسائل، التقييمات.",
      "الفنية: IP، معلومات الجهاز، الجلسة/الكوكيز، السجلات.",
      "المرئية/السمعية: الصور الرمزية وصور الإعلانات (قد تُخزن عبر Cloudinary).",
      "الدفع/الشحن: الحد الأدنى المطلوب من مزوّدي الدفع والشحن.",
      "التفضيلات: اللغة، موافقة KVKK/الكوكيز، الإشعارات.",
    ],
    legalTitle: "4) الأسس القانونية",
    legalList: [
      "تنفيذ العقد (العضوية، الإعلانات، الطلبات).",
      "الالتزام القانوني.",
      "المصلحة المشروعة (الأمان، مكافحة الاحتيال، التحسين).",
      "الموافقة (التسويق، الكوكيز الاختيارية…).",
      "النصوص القانونية الصريحة.",
    ],
    collectTitle: "5) طرق الجمع",
    collectList: [
      "مباشرة منكم (التسجيل، الملف، الإعلانات، الطلبات).",
      "آليًا (الكوكيز، الجلسات، سجلات الجهاز/التطبيق).",
      "من أطراف ثالثة (الدفع/الشحن، الأمان/التحليلات).",
    ],
    transferTitle: "6) الإفصاحات والنقل الدولي",
    transferIntro:
      "وفق KVKK قد نشارك بياناتكم مع الآتي وننقلها خارج البلاد عند الحاجة:",
    transferList: [
      "مزودو الدفع (PayTR/iyzico) — الحجز/الاستردادات.",
      "شركات الشحن — التسليم والإرجاع.",
      "الاستضافة/البنية/الوسائط — Supabase وCloudinary وCDN وخدمات الأمان.",
      "التحليلات/إصلاح الأخطاء — حد أدنى من البيانات.",
      "السلطات — عند الطلب القانوني.",
    ],
    transferLawNote:
      "النقل الدولي يعتمد قرارات الملاءمة أو التعهدات أو الموافقة الصريحة حسب KVKK.",
    rightsTitle: "7) حقوقكم (المادة 11)",
    rightsList: [
      "معرفة ما إذا كانت البيانات تُعالج.",
      "طلب معلومات عن الأغراض والجهات المستلمة.",
      "تصحيح البيانات غير الدقيقة/الناقصة.",
      "المحو/إخفاء الهوية (مع مراعاة الاحتفاظ القانوني).",
      "الاعتراض وسحب الموافقة والمطالبة بالتعويض عند الضرر.",
    ],
    applyTitle: "8) كيفية التقديم",
    applyIntro:
      "أرسلوا طلبات KVKK عبر القنوات التالية:",
    applyList: [
      "البريد الإلكتروني: uretenellertr@gmail.com",
      "البريد: حي غوموشياكا، شارع رحمي، رقم 27A، سيليفري/إسطنبول 34588",
      "قد نطلب معلومات إضافية للتحقق من الهوية.",
    ],
    retentionTitle: "9) الاحتفاظ",
    retentionList: [
      "الحساب/المعاملات — الحدود القانونية (حتى 10 سنوات).",
      "الكوكيز — حسب النوع (جلسة/30 يومًا/12 شهرًا).",
      "التسويق — حتى سحب الموافقة.",
    ],
    securityTitle: "10) التدابير الأمنية",
    securityList: [
      "اتصال مُشفّر (HTTPS) وضوابط وصول وتخويل بالأدوار.",
      "سياسات RLS على مستوى قاعدة البيانات ومبدأ أقل امتياز.",
      "تدابير تعاقدية وتقنية/تنظيمية مع المزوّدين.",
    ],
    updateTitle: "11) التحديثات",
    updateText:
      "قد يتم تحديث هذا الإشعار؛ يُذكر تاريخ السريان أعلاه.",
    quick: "روابط سريعة",
    back: "الصفحة الرئيسية",
  },

  de: {
    brand: "Ureten Eller",
    title: "KVKK-Hinweis (Türkisches Datenschutzrecht)",
    effective: "Wirksam ab",
    intro:
      "Gemäß dem türkischen Gesetz Nr. 6698 (KVKK) informieren wir über die Verarbeitung personenbezogener Daten durch Ureten Eller.",
    controllerTitle: "1) Verantwortlicher & Kontakt",
    controllerDesc:
      "Ureten Eller (Einzelunternehmen) handelt als Verantwortlicher.",
    controllerBlock: [
      "Adresse: Gumusyaka Mah., Rahmi Sok., Nr. 27A, Silivri / Istanbul, 34588",
      "Steueramt/-Nr.: Silivri — 9530226667",
      "E-Mail: uretenellertr@gmail.com",
      "Telefon (WhatsApp): 0507279143",
      "Domain: ureteneller.com",
    ],
    purposeTitle: "2) Zwecke der Verarbeitung",
    purposeList: [
      "Mitgliedschaft und Identitätsprüfung.",
      "Inserate, Bestellungen, Zahlungen, Versand.",
      "Support, Beschwerden, Storno/Retouren.",
      "Sicherheit, Betrugsprävention, Missbrauchserkennung, Audits.",
      "Servicequalität, Statistik, Performance.",
      "Gesetzliche Pflichten und behördliche Auskünfte.",
      "Mit Einwilligung: Marketing/Kommunikation.",
    ],
    dataTitle: "3) Datenkategorien",
    dataIntro: "Je nach Leistungsumfang verarbeiten wir ggf.:",
    dataList: [
      "Identität/Kontakt: Name, Nutzername, E-Mail, Telefon, Stadt.",
      "Konto/Transaktion: Inserate, Bestellungen, Zahlungen, Nachrichten, Bewertungen.",
      "Technisch: IP, Gerät, Session/Cookies, Logs.",
      "Visuell/Akustisch: Avatare/Inseratbilder (ggf. Cloudinary).",
      "Zahlung/Versand: Minimaldaten für PSP/Carrier.",
      "Präferenzen: Sprache, KVKK-/Cookie-Einwilligung, Benachrichtigungen.",
    ],
    legalTitle: "4) Rechtsgrundlagen",
    legalList: [
      "Vertragserfüllung (Mitgliedschaft, Inserate, Bestellungen).",
      "Rechtspflicht.",
      "Berechtigtes Interesse (Sicherheit, Anti-Fraud, Verbesserung).",
      "Einwilligung (Marketing, optionale Cookies usw.).",
      "Gesetzliche Vorschriften.",
    ],
    collectTitle: "5) Erhebungsmethoden",
    collectList: [
      "Direkt von Ihnen (Registrierung, Profil, Inserate, Bestellungen).",
      "Automatisiert (Cookies, Sessions, Geräte-/App-Logs).",
      "Von Dritten (Zahlung/Versand, Security/Analytics).",
    ],
    transferTitle: "6) Offenlegungen & Auslandsübermittlungen",
    transferIntro:
      "Nach KVKK können Daten an folgende Stellen weitergegeben und ggf. ins Ausland übermittelt werden:",
    transferList: [
      "Zahlungsdienste (PayTR/iyzico) — Treuhand/Erstattungen.",
      "Versender/Logistik — Versand & Retouren.",
      "Hosting/Infra/Medien — Supabase, Cloudinary, CDN, Security.",
      "Analytics/Debugging — Minimaldaten.",
      "Behörden — wo gesetzlich gefordert.",
    ],
    transferLawNote:
      "Auslandsübermittlungen stützen sich auf Angemessenheitsbeschlüsse, Verpflichtungen oder ausdrückliche Einwilligung gem. KVKK.",
    rightsTitle: "7) Ihre Rechte (Art. 11 KVKK)",
    rightsList: [
      "Auskunft, ob Daten verarbeitet werden.",
      "Informationen zu Zwecken und Empfängern.",
      "Berichtigung unrichtiger/unvollständiger Daten.",
      "Löschung/Anonymisierung (unter Beachtung gesetzlicher Aufbewahrung).",
      "Widerspruch, Widerruf, Schadensersatz bei Nachweis.",
    ],
    applyTitle: "8) Antragstellung",
    applyIntro:
      "Senden Sie Anträge nach KVKK über folgende Kanäle:",
    applyList: [
      "E-Mail: uretenellertr@gmail.com",
      "Post: Gumusyaka Mah., Rahmi Sok., Nr. 27A, Silivri / Istanbul, 34588",
      "Zur Identifizierung können Zusatzangaben erforderlich sein.",
    ],
    retentionTitle: "9) Aufbewahrung",
    retentionList: [
      "Konten/Transaktionen — gesetzliche Mindestfristen (z. B. bis 10 Jahre).",
      "Cookies — je Typ (Session/30 Tage/12 Monate).",
      "Marketing-Einwilligung — bis zum Widerruf.",
    ],
    securityTitle: "10) Sicherheit",
    securityList: [
      "Verschlüsselung (HTTPS), Zugriffskontrollen, Rollenrechte.",
      "RLS auf DB-Ebene, Least-Privilege-Prinzip.",
      "Vertragliche/technisch-organisatorische Maßnahmen bei Anbietern.",
    ],
    updateTitle: "11) Aktualisierungen",
    updateText:
      "Dieser Hinweis kann aktualisiert werden; Wirksamkeitsdatum siehe oben.",
    quick: "Schnellzugriff",
    back: "Startseite",
  },
};

export const metadata = { title: "KVKK Aydınlatma • Üreten Eller" };

export default function KvkkPage() {
  const lang = useLang();
  const t = useMemo(() => T[lang] || T.tr, [lang]);
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <div className="page" dir={dir}>
      <header className="topbar">
        <div className="wrap">
          <a className="brand" href="/">{t.brand}</a>
          <nav className="nav">
            <a className="link" href="/legal/gizlilik">Gizlilik</a>
            <a className="link" href="/legal/cerez-politikasi">Çerez Politikası</a>
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

          <h2>{t.controllerTitle}</h2>
          <p>{t.controllerDesc}</p>
          <ul>{t.controllerBlock.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <h2>{t.purposeTitle}</h2>
          <ul>{t.purposeList.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <h2>{t.dataTitle}</h2>
          <p>{t.dataIntro}</p>
          <ul>{t.dataList.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <h2>{t.legalTitle}</h2>
          <ul>{t.legalList.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <h2>{t.collectTitle}</h2>
          <ul>{t.collectList.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <h2>{t.transferTitle}</h2>
          <p>{t.transferIntro}</p>
          <ul>{t.transferList.map((x, i) => <li key={i}>{x}</li>)}</ul>
          <p className="muted">{t.transferLawNote}</p>

          <h2>{t.rightsTitle}</h2>
          <ul>{t.rightsList.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <h2>{t.applyTitle}</h2>
          <p>{t.applyIntro}</p>
          <ul>{t.applyList.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <h2>{t.retentionTitle}</h2>
          <ul>{t.retentionList.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <h2>{t.securityTitle}</h2>
          <ul>{t.securityList.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <h2>{t.updateTitle}</h2>
          <p>{t.updateText}</p>

          <hr />
          <p className="quick">
            <strong>{t.quick}: </strong>
            <a href="/legal/kullanim-sartlari">Kullanım Şartları</a> •{" "}
            <a href="/legal/gizlilik">Gizlilik</a> •{" "}
            <a href="/legal/cerez-politikasi">Çerez Politikası</a>
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
