/* /pages/legal/kullanim-sartlari.jsx */
"use client";
import { useEffect, useMemo, useState } from "react";

/** Dil tespiti: localStorage.lang → tr | en | ar | de */
function useLang() {
  const [lang, setLang] = useState("tr");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const s = localStorage.getItem("lang");
      if (s && ["tr", "en", "ar", "de"].includes(s)) setLang(s);
      // yoksa tarayıcı diline bak
      if (!s) {
        const nav = (navigator.language || "tr").slice(0, 2).toLowerCase();
        if (["tr", "en", "ar", "de"].includes(nav)) setLang(nav);
      }
    }
  }, []);
  // <html dir/lang>
  useEffect(() => {
    if (typeof document !== "undefined") {
      /* document.documentElement.lang = lang; */
      /* document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"; */
    }
  }, [lang]);
  return lang;
}

/** 4 dil metinleri */
const T = {
  tr: {
    brand: "Üreten Eller",
    title: "Kullanım Şartları",
    intro:
      "Bu Kullanım Şartları, Üreten Eller platformunun kullanımına ilişkin kuralları ve hak/yükümlülükleri düzenler. Siteyi kullanarak bu şartları kabul etmiş sayılırsınız.",
    defsTitle: "1) Tanımlar",
    defs: [
      "Platform: Üreten Eller web sitesi ve ilgili mobil arayüzler.",
      "Kullanıcı: Siteyi ziyaret eden, üye olan veya işlem yapan gerçek/tüzel kişi.",
      "Satıcı: İlan oluşturan ve ürün/hizmet sunan kullanıcı.",
      "Alıcı: Satıcıların ilanladığı ürün/hizmetleri sipariş eden kullanıcı.",
      "Hesap: Kullanıcıya ait üyelik profili."
    ],
    membershipTitle: "2) Üyelik ve Hesap",
    membership: [
      "Kullanıcı, kayıt esnasında doğru ve güncel bilgi vermekle yükümlüdür.",
      "Hesap güvenliği (şifre, cihaz erişimi) kullanıcı sorumluluğundadır.",
      "Birden fazla sahte hesap açılması, kimlik taklidi, yetkisiz erişim yasaktır.",
      "Hesap bilgilerinin üçüncü kişilerle paylaşılmasından doğan sonuçlardan kullanıcı sorumludur."
    ],
    listingTitle: "3) İlan Kuralları ve Yasaklı Ürünler",
    listingIntro:
      "Satıcı; yürürlükteki mevzuata uygun, doğru ve eksiksiz ilan vermekle yükümlüdür.",
    listing: [
      "Taklit/kaçak, tehlikeli, mevzuata aykırı ürünler; telif/marka ihlalli içerikler yasaktır.",
      "AÇIK YASAK: Alkol, tütün, cinsel içerikli ürünler, canlı hayvan, yasa dışı/sağlığa zararlı maddeler, reçeteli tıbbi ürünler.",
      "Ürün nitelikleri, fiyat, teslimat ve iade şartları açıkça belirtilmelidir.",
      "Yanıltıcı görsel/metin, manipülatif etiket ve spam yasaktır."
    ],
    paymentsTitle: "4) Ödeme, Bloke (Escrow) ve Ücretlendirme",
    payments: [
      "Ödeme, lisanslı ödeme kuruluşları (ör. PayTR, iyzico) üzerinden tahsil edilir.",
      "Tutar, alıcının teslimi onayına kadar blokede tutulur.",
      "Teslim onayı ile birlikte bedel satıcıya aktarılır; iadeler ödeme kuruluşu akışına göre yapılır.",
      "Platform satıştan komisyon almayabilir; gelir premium, vitrin/doping ve reklam servislerinden gelebilir.",
      "Gecikmeler PSP/banka prosedürlerine bağlı olabilir."
    ],
    intermediaryTitle: "5) Aracı Hizmet Sağlayıcı Rolü",
    intermediary:
      "Satış sözleşmesi alıcı ile satıcı arasında kurulur. Üreten Eller, 6563 sayılı Kanun kapsamında aracı hizmet sağlayıcıdır; ayıp, teslimat ve iade süreçlerinden doğrudan sorumlu değildir.",
    returnsTitle: "6) Cayma ve İade",
    returns: [
      "Tüketici mevzuatına göre 14 gün içinde cayma hakkı (istisnalar saklı) kullanılabilir.",
      "Ayıplı ürünlerde iade kargo bedeli satıcıya aittir.",
      "Ücret iadesi, ödeme kuruluşu üzerinden orijinal yönteme yapılır."
    ],
    ipTitle: "7) Fikri ve Sınai Mülkiyet",
    ip: [
      "Arayüz, marka, logo, yazılım ve tasarımlar korunur.",
      "Kullanıcı, yüklediği içerikler için Üreten Eller’e dünya çapında, devredilebilir, alt lisanslanabilir, basit lisans verir.",
      "İhlal tespitinde içerik kaldırılabilir."
    ],
    abuseTitle: "8) Kötüye Kullanım ve Askıya Alma",
    abuse: [
      "Dolandırıcılık şüphesi, yasa dışı faaliyet, spam veya moderasyon ihlallerinde hesap kısıtlanabilir/askıya alınabilir.",
      "Yasal taleplerde kayıtlar mevzuata uygun paylaşılabilir."
    ],
    liabilityTitle: "9) Sorumluluk",
    liability: [
      "Kesinti/bakım/üçüncü taraf arızalarından doğan dolaylı zararlardan sorumlu değiliz.",
      "Kullanıcı, kendi içerik ve işlemlerinden sorumludur."
    ],
    terminationTitle: "10) Fesih",
    termination:
      "Kullanıcı hesabını dilediği an kapatabilir. İhlal/güvenlik/hukuki gerekçelerle hesap askıya alınabilir veya feshedilebilir.",
    lawTitle: "11) Uygulanacak Hukuk ve Yetki",
    law: "Türk hukuku geçerlidir. İstanbul mahkemeleri ve icra daireleri yetkilidir.",
    updateTitle: "12) Değişiklikler",
    update: "Şartlar güncellenebilir; en güncel sürüm bu sayfada yayımlanır.",
    quick: "Hızlı Geçiş",
    back: "Ana sayfa"
  },

  en: {
    brand: "Ureten Eller",
    title: "Terms of Use",
    intro:
      "These Terms govern your use of Ureten Eller. By using the site, you accept these Terms.",
    defsTitle: "1) Definitions",
    defs: [
      "Platform: Ureten Eller website and related mobile interfaces.",
      "User: any natural/legal person visiting, registering or transacting.",
      "Seller: user who creates listings and offers goods/services.",
      "Buyer: user who orders listed goods/services.",
      "Account: the user’s membership profile."
    ],
    membershipTitle: "2) Membership & Account",
    membership: [
      "Provide accurate, up-to-date information.",
      "Account security (password, device access) is your responsibility.",
      "No fake accounts, impersonation or unauthorized access.",
      "You’re liable for sharing your credentials with third parties."
    ],
    listingTitle: "3) Listings & Prohibited Items",
    listingIntro: "Sellers must publish lawful, accurate and complete listings.",
    listing: [
      "Counterfeit/illegal/dangerous items and IP-infringing content are prohibited.",
      "STRICT BAN: alcohol, tobacco, adult content, live animals, illegal/harmful substances, prescription-only medical items.",
      "State attributes, price, delivery and returns clearly.",
      "No misleading visuals/texts, manipulative tags or spam."
    ],
    paymentsTitle: "4) Payments, Escrow & Fees",
    payments: [
      "Payments via licensed PSPs (e.g., PayTR, iyzico).",
      "Funds held in escrow until delivery confirmation.",
      "Upon confirmation, funds are released; refunds follow PSP flow.",
      "Platform revenue may come from premium, boosts and ads.",
      "Delays can occur due to PSP/bank procedures."
    ],
    intermediaryTitle: "5) Intermediary Role",
    intermediary:
      "Contract is between buyer and seller. Ureten Eller is an intermediary under Law No. 6563; not directly liable for defects, delivery or returns.",
    returnsTitle: "6) Withdrawal & Returns",
    returns: [
      "14-day right of withdrawal (statutory exceptions apply).",
      "For faulty items, return shipping is borne by the seller.",
      "Refunds are processed via PSP to the original method."
    ],
    ipTitle: "7) Intellectual Property",
    ip: [
      "UI, marks, software and designs are protected.",
      "User grants a worldwide, transferable, sublicensable, non-exclusive license for uploaded content.",
      "Unlawful content may be removed."
    ],
    abuseTitle: "8) Abuse & Suspension",
    abuse: [
      "Fraud suspicion, illegal activity, spam or moderation breaches may lead to restriction/suspension.",
      "Records may be shared with authorities as required by law."
    ],
    liabilityTitle: "9) Liability",
    liability: [
      "No liability for indirect damages from outages/maintenance/third parties.",
      "Users are liable for their content and actions."
    ],
    terminationTitle: "10) Termination",
    termination:
      "Users may close accounts anytime. Breaches or legal/security grounds may lead to suspension/termination.",
    lawTitle: "11) Governing Law & Jurisdiction",
    law: "Turkish law applies. Istanbul courts have jurisdiction.",
    updateTitle: "12) Updates",
    update: "The latest version is published here.",
    quick: "Quick Links",
    back: "Home"
  },

  ar: {
    brand: "أُنتِج بالأيادي",
    title: "شروط الاستخدام",
    intro: "تنظّم هذه الشروط استخدامك للمنصّة. باستخدامك للموقع فأنت توافق عليها.",
    defsTitle: "1) التعاريف",
    defs: [
      "المنصّة: موقع «أُنتِج بالأيادي» وواجهاته.",
      "المستخدم: كل شخص طبيعي/اعتباري يزور أو يسجّل أو يجري معاملات.",
      "البائع: من ينشئ الإعلانات ويعرض سلعة/خدمة.",
      "المشتري: من يطلب السلع/الخدمات المُعلنة.",
      "الحساب: ملف عضوية المستخدم."
    ],
    membershipTitle: "2) العضوية والحساب",
    membership: [
      "يجب تقديم معلومات صحيحة ومحدّثة.",
      "أمن الحساب (كلمة المرور، الأجهزة) مسؤولية المستخدم.",
      "ممنوع الحسابات المزيّفة، انتحال الهوية، الوصول غير المصرّح.",
      "المستخدم مسؤول عن مشاركة بيانات الحساب مع الغير."
    ],
    listingTitle: "3) الإعلانات والعناصر المحظورة",
    listingIntro: "يجب أن تكون الإعلانات قانونية ودقيقة وكاملة.",
    listing: [
      "ممنوع السلع المقلّدة/غير القانونية/الخطرة وانتهاك الحقوق الفكرية.",
      "حظر صارم: الكحول، التبغ، المحتوى الجنسي، الحيوانات الحية، المواد غير القانونية/الضارّة، الأدوية بوصفة فقط.",
      "بيان الصفات والسعر والتسليم والإرجاع بوضوح.",
      "منع الصور/النصوص المضلّلة والوسوم المخادعة والرسائل المزعجة."
    ],
    paymentsTitle: "4) المدفوعات والحجز والرسوم",
    payments: [
      "تُعالج المدفوعات عبر مزوّدي دفع مرخّصين (PayTR, iyzico).",
      "يُحجز المبلغ حتى تأكيد الاستلام.",
      "بعد التأكيد يُحوّل المبلغ للبائع؛ الاستردادات عبر جهة الدفع.",
      "دخل المنصّة قد يكون من العضوية المميّزة والترويج والإعلانات.",
      "قد تحدث تأخيرات بسبب إجراءات البنك/جهة الدفع."
    ],
    intermediaryTitle: "5) دور الوسيط",
    intermediary:
      "العقد بين المشتري والبائع. «أُنتِج بالأيادي» وسيط وفق القانون 6563؛ غير مسؤول مباشرة عن العيوب أو التسليم أو الإرجاع.",
    returnsTitle: "6) الانسحاب والإرجاع",
    returns: [
      "حق الانسحاب خلال 14 يومًا (مع الاستثناءات القانونية).",
      "في حالات العيب، يتحمّل البائع تكلفة الشحن المرتجع.",
      "تُعاد المبالغ عبر جهة الدفع إلى الوسيلة الأصلية."
    ],
    ipTitle: "7) الملكية الفكرية",
    ip: [
      "واجهة المنصّة والعلامات والبرمجيات والتصاميم محمية.",
      "يمنح المستخدم ترخيصًا عالميًا قابلًا للنقل والترخيص الفرعي لاستخدام المحتوى المرفوع.",
      "إزالة المحتوى غير القانوني عند اللزوم."
    ],
    abuseTitle: "8) إساءة الاستخدام والتعليق",
    abuse: [
      "الاحتيال أو النشاط غير القانوني أو خرق الإشراف قد يؤدي للتقييد/التعليق.",
      "قد تُشارك السجلات مع السلطات وفق القانون."
    ],
    liabilityTitle: "9) المسؤولية",
    liability: [
      "لا نتحمّل الأضرار غير المباشرة نتيجة الانقطاعات/الصيانة/أعطال الأطراف الثالثة.",
      "المستخدم مسؤول عن محتواه وتصرفاته."
    ],
    terminationTitle: "10) الإنهاء",
    termination:
      "يمكن للمستخدم إغلاق الحساب في أي وقت. قد نُعلّق/ننهي الحساب عند المخالفة أو لأسباب قانونية/أمنية.",
    lawTitle: "11) القانون والاختصاص",
    law: "يُطبّق القانون التركي. محاكم إسطنبول مختصّة.",
    updateTitle: "12) التحديثات",
    update: "ينشر أحدث إصدار هنا دائمًا.",
    quick: "روابط سريعة",
    back: "الصفحة الرئيسية"
  },

  de: {
    brand: "Ureten Eller",
    title: "Nutzungsbedingungen",
    intro:
      "Diese Bedingungen regeln die Nutzung von Ureten Eller. Mit der Nutzung akzeptieren Sie sie.",
    defsTitle: "1) Begriffe",
    defs: [
      "Plattform: Website und mobile Oberflächen von Ureten Eller.",
      "Nutzer: natürliche/juristische Person, die besucht/registriert/transagiert.",
      "Verkäufer: erstellt Inserate und bietet Waren/Dienste an.",
      "Käufer: bestellt inserierte Waren/Dienste.",
      "Konto: Mitgliederprofil."
    ],
    membershipTitle: "2) Mitgliedschaft & Konto",
    membership: [
      "Angaben müssen korrekt und aktuell sein.",
      "Kontosicherheit (Passwort, Gerätezugriff) liegt beim Nutzer.",
      "Verboten: Fake-Accounts, Identitätsdiebstahl, unbefugter Zugriff.",
      "Teilen von Zugangsdaten erfolgt auf eigenes Risiko."
    ],
    listingTitle: "3) Inserate & Verbotene Artikel",
    listingIntro: "Inserate müssen rechtmäßig, korrekt und vollständig sein.",
    listing: [
      "Verboten: gefälschte/illegale/gefährliche Waren, IP-Verstöße.",
      "STRIKTES VERBOT: Alkohol, Tabak, Erwachsenenartikel, lebende Tiere, illegale/gefährliche Stoffe, verschreibungspflichtige Medizin.",
      "Eigenschaften, Preis, Lieferung & Rückgabe klar angeben.",
      "Keine irreführenden Darstellungen/Tags, kein Spam."
    ],
    paymentsTitle: "4) Zahlungen, Treuhand & Entgelte",
    payments: [
      "Zahlungen über lizenzierte Zahlungsdienste (PayTR, iyzico).",
      "Gelder bis zur Lieferbestätigung treuhänderisch gehalten.",
      "Nach Bestätigung Auszahlung; Rückerstattungen über den PSP.",
      "Erlöse ggf. aus Premium, Boosts, Werbung.",
      "Verzögerungen durch PSP/Bank möglich."
    ],
    intermediaryTitle: "5) Vermittlerrolle",
    intermediary:
      "Kaufvertrag zwischen Käufer und Verkäufer. Ureten Eller ist Vermittler gem. Gesetz Nr. 6563; keine direkte Haftung für Mängel/Lieferung/Rückgaben.",
    returnsTitle: "6) Widerruf & Rückgaben",
    returns: [
      "14-tägiges Widerrufsrecht (gesetzliche Ausnahmen).",
      "Bei Mängeln trägt der Verkäufer die Rücksendekosten.",
      "Erstattung via PSP auf ursprüngliche Zahlmethode."
    ],
    ipTitle: "7) Geistiges Eigentum",
    ip: [
      "UI, Marken, Software und Designs sind geschützt.",
      "Nutzer räumt eine weltweite, übertragbare, unterlizenzierbare, einfache Lizenz ein.",
      "Rechtswidrige Inhalte können entfernt werden."
    ],
    abuseTitle: "8) Missbrauch & Sperre",
    abuse: [
      "Betrugsverdacht, illegale Aktivität, Spam oder Moderationsverstöße → Einschränkung/Sperre.",
      "Datenweitergabe an Behörden nach Gesetz möglich."
    ],
    liabilityTitle: "9) Haftung",
    liability: [
      "Keine Haftung für indirekte Schäden durch Ausfälle/Wartung/Dritte.",
      "Nutzer haften für eigene Inhalte/Handlungen."
    ],
    terminationTitle: "10) Kündigung",
    termination:
      "Konto jederzeit kündbar. Bei Verstößen o. rechtl./sicherheitsrelevanten Gründen Sperre/Kündigung möglich.",
    lawTitle: "11) Recht & Gerichtsstand",
    law: "Türkisches Recht; Gerichtsstand Istanbul.",
    updateTitle: "12) Aktualisierungen",
    update: "Aktuelle Fassung wird hier veröffentlicht.",
    quick: "Schnellzugriff",
    back: "Startseite"
  }
};

export const metadata = { title: "Kullanım Şartları • Üreten Eller" };

export default function TermsPage() {
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
            <a className="link" href="/legal/kvkk-aydinlatma">KVKK</a>
            <a className="btn" href="/">{t.back}</a>
          </nav>
        </div>
      </header>

      <main className="wrap">
        <article className="paper">
          <h1>{t.title}</h1>
          <p>{t.intro}</p>

          <h2>{t.defsTitle}</h2>
          <ul>{t.defs.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <h2>{t.membershipTitle}</h2>
          <ul>{t.membership.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <h2>{t.listingTitle}</h2>
          <p>{t.listingIntro}</p>
          <ul>{t.listing.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <h2>{t.paymentsTitle}</h2>
          <ul>{t.payments.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <h2>{t.intermediaryTitle}</h2>
          <p>{t.intermediary}</p>

          <h2>{t.returnsTitle}</h2>
          <ul>{t.returns.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <h2>{t.ipTitle}</h2>
          <ul>{t.ip.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <h2>{t.abuseTitle}</h2>
          <ul>{t.abuse.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <h2>{t.liabilityTitle}</h2>
          <ul>{t.liability.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <h2>{t.terminationTitle}</h2>
          <p>{t.termination}</p>

          <h2>{t.lawTitle}</h2>
          <p>{t.law}</p>

          <h2>{t.updateTitle}</h2>
          <p>{t.update}</p>

          <hr />
          <p className="quick">
            <strong>{t.quick}: </strong>
            <a href="/legal/gizlilik">Gizlilik</a> •{" "}
            <a href="/legal/mesafeli-satis-sozlesmesi">Mesafeli Satış</a> •{" "}
            <a href="/legal/teslimat-iade">Teslimat &amp; İade</a>
          </p>
        </article>
      </main>

      <style jsx>{`
        :root{
          --ink:#0f172a; --muted:#475569; --bg:#f8fafc;
          --paper:#ffffff; --line:#e5e7eb; --footer:#0b0b0f;
          --brand:#111827; --focus:#0ea5e9;
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
        .quick a{color:#0ea5e9;text-decoration:none}
        .quick a:hover{text-decoration:underline}
      `}</style>
    </div>
  );
}
