/* /pages/legal/mesafeli-satis-sozlesmesi.jsx */
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

/** 4 dil — Mesafeli Satış Sözleşmesi / Distance Sales Agreement */
const T = {
  tr: {
    brand: "Üreten Eller",
    title: "Mesafeli Satış Sözleşmesi",
    effective: "Yürürlük",
    preface:
      "Bu Mesafeli Satış Sözleşmesi (“Sözleşme”), ureteneller.com üzerinden verilen siparişler için alıcı ile satıcı arasında kurulmuştur. Üreten Eller, 6563 sayılı kanun kapsamında aracı hizmet sağlayıcıdır.",
    partiesTitle: "1) Taraflar",
    parties: [
      "Alıcı: Platformda siparişi oluşturan kişi/kuruluş. Kayıt esnasında sağlanan bilgiler esas alınır.",
      "Satıcı: İlan oluşturan ve ürünü/hizmeti sunan kişi/kuruluş.",
      "Aracı: Üreten Eller (şahıs işletmesi) — alan adı: ureteneller.com; E-posta: uretenellertr@gmail.com; Adres: Gümüşyaka Mah., Rahmi Sok., No: 27A, Silivri/İstanbul, 34588; Tel/WhatsApp: 0507279143.",
    ],
    subjectTitle: "2) Konu ve Kapsam",
    subject:
      "Alıcı tarafından elektronik ortamda siparişi verilen ürün/ürünlerin nitelikleri, satış bedeli, ödeme, teslimat ve cayma/iade koşulları bu Sözleşmenin konusudur.",
    specsTitle: "3) Ürün/Bedel/Ödeme",
    specsList: [
      "Ürün/bedel bilgileri, sipariş özetinde ve satıcının ilan sayfasında yer alır.",
      "Ödeme, lisanslı ödeme kuruluşları (ör. PayTR/iyzico) aracılığıyla tahsil edilir ve teslim onayına kadar bloke edilir.",
      "Alıcı; vergiler, kargo, ek ücretleri sipariş ekranında görür ve onaylar.",
    ],
    deliveryTitle: "4) Teslimat",
    deliveryList: [
      "Teslimat adresi alıcı tarafından belirtilir. Tedarik ve kargo süresi ilanda/özet sayfasında açıklanır.",
      "Teslimat gecikmesi veya imkânsızlık halinde alıcı bilgilendirilir; talep hâlinde bedel iadesi yapılır.",
      "Kırılma/hasar şüphesinde tutanak tutulması ve görsel kanıtların saklanması önerilir.",
    ],
    withdrawalTitle: "5) Cayma Hakkı",
    withdrawalList: [
      "Alıcı, teslimden itibaren 14 gün içinde sebep göstermeksizin cayabilir.",
      "İstisnalar: Kişiye özel üretim, çabuk bozulabilen ürünler, hijyen gerektiren ambalajı açılmış ürünler vb.",
      "Cayma halinde ürün iade edilmeli; iade kargo bedeli mevzuat ve ilandaki şartlara göre belirlenir.",
    ],
    returnTitle: "6) İade ve Bedel İadesi",
    returnList: [
      "İade kabul edildiğinde bedel, ödeme sırasında kullanılan yönteme ödeme kuruluşu aracılığıyla iade edilir.",
      "İade süresi; kargonun satıcıya ulaşması ve uygunluğun teyidi sonrası başlar.",
      "Ayıplı ürün hallerinde masraflar satıcıya aittir.",
    ],
    conformityTitle: "7) Ayıplı Mal / Uygunsuzluk",
    conformityList: [
      "Ürün ilandaki temel niteliklere uygun değilse alıcı; bedel iadesi, ayıp oranında indirim, ücretsiz onarım veya ayıpsız misli ile değiştirme haklarını talep edebilir.",
      "Satıcı; talebe makul süre içinde yanıt verir.",
    ],
    commsTitle: "8) İletişim ve Kayıtlar",
    commsList: [
      "Taraflar arasındaki mesajlar, bildirimler ve onaylar platform içi mesajlaşma ve e-posta üzerinden yürütülür.",
      "Uyuşmazlıklarda sistem kayıtları esas alınabilir.",
    ],
    feesTitle: "9) Ücretler ve Komisyon",
    fees:
      "Üreten Eller satıştan doğrudan komisyon almayabilir; vitrin/premium ve reklam gibi hizmetlerden ücret talep edebilir. Ödeme kuruluşu ücretleri ayrıca uygulanabilir.",
    disputeTitle: "10) Uyuşmazlık Çözümü",
    dispute:
      "Tüketici işlemlerinde Tüketici Hakem Heyetleri ve/veya Mahkemeleri; diğer hallerde İstanbul mahkemeleri yetkilidir.",
    finalTitle: "11) Yürürlük ve Kabul",
    final:
      "Siparişi onaylayan alıcı, Sözleşme koşullarını okuduğunu ve kabul ettiğini beyan eder. Sözleşme elektronik ortamda saklanır ve talep edilirse paylaşılabilir.",
    quick: "Hızlı Geçiş",
    back: "Ana sayfa",
  },

  en: {
    brand: "Ureten Eller",
    title: "Distance Sales Agreement",
    effective: "Effective",
    preface:
      "This Agreement is formed between the buyer and the seller for orders placed on ureteneller.com. Ureten Eller acts as an intermediary service provider.",
    partiesTitle: "1) Parties",
    parties: [
      "Buyer: the person/entity placing the order, based on account details.",
      "Seller: the person/entity publishing the listing and supplying the product/service.",
      "Intermediary: Ureten Eller (sole proprietorship) — Domain: ureteneller.com; Email: uretenellertr@gmail.com; Address: Gumusyaka Mah., Rahmi Sok., No: 27A, Silivri/Istanbul, 34588; Phone/WhatsApp: 0507279143.",
    ],
    subjectTitle: "2) Subject & Scope",
    subject:
      "Features of the product(s), price, payment, delivery and withdrawal/return terms are governed by this Agreement.",
    specsTitle: "3) Product/Price/Payment",
    specsList: [
      "Product/price info appears on the listing and order summary.",
      "Payments are processed via licensed PSPs (e.g., PayTR/iyzico) and held in escrow until delivery confirmation.",
      "Buyer sees and approves taxes, shipping and extra charges at checkout.",
    ],
    deliveryTitle: "4) Delivery",
    deliveryList: [
      "Delivery address is provided by the buyer. Lead times are shown on the listing/summary.",
      "In case of delay or impossibility, the buyer is informed; refund upon request.",
      "For damage/suspicions, keep a report and photo evidence.",
    ],
    withdrawalTitle: "5) Right of Withdrawal",
    withdrawalList: [
      "Buyer may withdraw within 14 days from delivery without reason.",
      "Exceptions: custom-made items, perishable goods, opened hygiene products, etc.",
      "Upon withdrawal, the product must be returned; return shipping per law and listing terms.",
    ],
    returnTitle: "6) Returns & Refunds",
    returnList: [
      "After acceptance, refunds are issued to the original method via the PSP.",
      "Timing starts once the item reaches the seller and conformity is verified.",
      "For defective items, costs are borne by the seller.",
    ],
    conformityTitle: "7) Defects / Non-Conformity",
    conformityList: [
      "If not as described, buyer may seek refund, price reduction, free repair, or replacement.",
      "Seller responds within a reasonable time.",
    ],
    commsTitle: "8) Communication & Records",
    commsList: [
      "Messages/notices/consents are conducted via in-platform messaging and email.",
      "System records may be relied upon in disputes.",
    ],
    feesTitle: "9) Fees & Commissions",
    fees:
      "Ureten Eller may not charge sales commissions; fees may apply for premium/showcase/ads. PSP fees may apply separately.",
    disputeTitle: "10) Dispute Resolution",
    dispute:
      "For consumer transactions: Consumer Arbitration Committees/Courts; otherwise Istanbul courts have jurisdiction.",
    finalTitle: "11) Effective Date & Acceptance",
    final:
      "By confirming the order, the buyer declares they read and accept the terms. The Agreement is stored electronically and shared upon request.",
    quick: "Quick Links",
    back: "Home",
  },

  ar: {
    brand: "أُنتِج بالأيادي",
    title: "اتفاقية البيع عن بُعد",
    effective: "سريان",
    preface:
      "تُبرم هذه الاتفاقية بين المشتري والبائع للطلبات عبر ureteneller.com. «أُنتِج بالأيادي» يعمل كوسيط.",
    partiesTitle: "1) الأطراف",
    parties: [
      "المشتري: الشخص/الجهة التي تُنشئ الطلب وفق بيانات الحساب.",
      "البائع: الشخص/الجهة التي تنشر الإعلان وتورّد المنتج/الخدمة.",
      "الوسيط: «أُنتِج بالأيادي» (منشأة فردية) — النطاق: ureteneller.com؛ البريد: uretenellertr@gmail.com؛ العنوان: حي غوموشياكا، شارع رحمي، رقم 27A، سيليفري/إسطنبول 34588؛ الهاتف/واتساب: 0507279143.",
    ],
    subjectTitle: "2) الموضوع والنطاق",
    subject:
      "تتحكم هذه الاتفاقية في خصائص المنتج/المنتجات والسعر والدفع والتسليم وحق الانسحاب/الإرجاع.",
    specsTitle: "3) المنتج/السعر/الدفع",
    specsList: [
      "تظهر معلومات المنتج/السعر في صفحة الإعلان وملخّص الطلب.",
      "تُعالج المدفوعات عبر مزوّدي دفع مرخّصين (PayTR/iyzico) وتُحتجز حتى تأكيد التسليم.",
      "يرى المشتري الضرائب والشحن والرسوم الإضافية ويوافق عليها أثناء السداد.",
    ],
    deliveryTitle: "4) التسليم",
    deliveryList: [
      "يُحدّد المشتري عنوان التسليم. تُعرض المدد على الإعلان/الملخص.",
      "في حال التأخير أو الاستحالة يُبلّغ المشتري؛ ويتم الاسترداد عند الطلب.",
      "عند الاشتباه بالضرر يُنصح بتوثيق تقرير وصور.",
    ],
    withdrawalTitle: "5) حق الانسحاب",
    withdrawalList: [
      "يجوز للمشتري الانسحاب خلال 14 يومًا من التسليم دون إبداء سبب.",
      "الاستثناءات: المنتجات المخصصة، القابلة للتلف، منتجات العناية الشخصية المفتوحة…",
      "عند الانسحاب يجب إعادة المنتج؛ وتُحدّد تكلفة الإرجاع وفق القانون وشروط الإعلان.",
    ],
    returnTitle: "6) الإرجاع والاسترداد",
    returnList: [
      "بعد القبول، يُعاد المبلغ عبر مزوّد الدفع بالوسيلة الأصلية.",
      "تبدأ المدة بعد وصول المنتج إلى البائع وتأكيد مطابقته.",
      "في العيوب يتحمّل البائع التكاليف.",
    ],
    conformityTitle: "7) العيوب/عدم المطابقة",
    conformityList: [
      "إن لم يطابق الوصف، للمشتري طلب الاسترداد أو التخفيض أو الإصلاح المجاني أو الاستبدال.",
      "يرد البائع ضمن مهلة معقولة.",
    ],
    commsTitle: "8) المراسلات والسجلات",
    commsList: [
      "تُدار الرسائل/الإشعارات/الموافقات عبر رسائل المنصّة والبريد.",
      "يجوز الاعتماد على سجلات النظام في النزاعات.",
    ],
    feesTitle: "9) الرسوم والعمولات",
    fees:
      "قد لا تفرض المنصّة عمولة بيع؛ وقد تُطبّق رسوم على المميّز/العرض/الإعلانات. قد تُطبّق رسوم مزوّد الدفع.",
    disputeTitle: "10) تسوية النزاعات",
    dispute:
      "في معاملات المستهلك: لجان/محاكم حماية المستهلك؛ وإلا فمحاكم إسطنبول مختصّة.",
    finalTitle: "11) السريان والقبول",
    final:
      "بتأكيد الطلب يقرّ المشتري أنه قرأ الشروط وقَبِلها. تُحفظ الاتفاقية إلكترونيًا وتُشارك عند الطلب.",
    quick: "روابط سريعة",
    back: "الصفحة الرئيسية",
  },

  de: {
    brand: "Ureten Eller",
    title: "Fernabsatzvertrag",
    effective: "Wirksam ab",
    preface:
      "Dieser Vertrag wird zwischen Käufer und Verkäufer für Bestellungen auf ureteneller.com geschlossen. Ureten Eller handelt als Vermittler.",
    partiesTitle: "1) Parteien",
    parties: [
      "Käufer: Person/Unternehmen, das die Bestellung aufgibt (gemäß Kontodaten).",
      "Verkäufer: Person/Unternehmen, das das Inserat veröffentlicht und liefert.",
      "Vermittler: Ureten Eller (Einzelunternehmen) — Domain: ureteneller.com; E-Mail: uretenellertr@gmail.com; Adresse: Gumusyaka Mah., Rahmi Sok., Nr. 27A, Silivri/Istanbul, 34588; Telefon/WhatsApp: 0507279143.",
    ],
    subjectTitle: "2) Gegenstand & Umfang",
    subject:
      "Merkmale der Ware(n), Preis, Zahlung, Lieferung sowie Widerruf/Rückgabe werden geregelt.",
    specsTitle: "3) Produkt/Preis/Zahlung",
    specsList: [
      "Produkt-/Preisinformationen stehen im Inserat und in der Bestellübersicht.",
      "Zahlungen über lizenzierte PSPs (z. B. PayTR/iyzico) und treuhänderische Verwahrung bis Lieferbestätigung.",
      "Steuern/Versand/Zuschläge werden im Checkout angezeigt und bestätigt.",
    ],
    deliveryTitle: "4) Lieferung",
    deliveryList: [
      "Lieferadresse vom Käufer. Laufzeiten im Inserat/der Übersicht.",
      "Bei Verzögerung/Unmöglichkeit: Information des Käufers; Rückerstattung auf Wunsch.",
      "Bei Schäden: Protokoll/Foto-Belege aufbewahren.",
    ],
    withdrawalTitle: "5) Widerrufsrecht",
    withdrawalList: [
      "14 Tage ab Lieferung ohne Angabe von Gründen.",
      "Ausnahmen: kundenspezifische Ware, schnell verderblich, geöffnete Hygieneartikel usw.",
      "Rücksendung erforderlich; Kosten gem. Gesetz und Inseratsbedingungen.",
    ],
    returnTitle: "6) Rückgabe & Erstattung",
    returnList: [
      "Nach Annahme Rückzahlung über PSP auf ursprüngliche Zahlmethode.",
      "Fristbeginn nach Wareneingang beim Verkäufer und Prüfung.",
      "Bei Mängeln trägt der Verkäufer die Kosten.",
    ],
    conformityTitle: "7) Mängel/Nichtkonformität",
    conformityList: [
      "Bei Abweichung: Rückzahlung, Minderung, kostenlose Reparatur oder Ersatz.",
      "Der Verkäufer antwortet innerhalb angemessener Frist.",
    ],
    commsTitle: "8) Kommunikation & Nachweise",
    commsList: [
      "Nachrichten/Hinweise/Zustimmungen über Plattformnachrichten und E-Mail.",
      "Systemprotokolle können im Streitfall herangezogen werden.",
    ],
    feesTitle: "9) Entgelte & Provisionen",
    fees:
      "Keine direkte Verkaufsprovision; Entgelte ggf. für Premium/Vitrine/Werbung. PSP-Gebühren separat.",
    disputeTitle: "10) Streitbeilegung",
    dispute:
      "Bei Verbrauchergeschäften: Verbraucher-Schlichtungsstellen/Gerichte; sonst Gerichtsstand Istanbul.",
    finalTitle: "11) Wirksamkeit & Annahme",
    final:
      "Mit Bestellbestätigung erklärt der Käufer die Kenntnisnahme und Zustimmung. Der Vertrag wird elektronisch gespeichert und auf Wunsch bereitgestellt.",
    quick: "Schnellzugriff",
    back: "Startseite",
  },
};

export const metadata = { title: "Mesafeli Satış Sözleşmesi • Üreten Eller" };

export default function DistanceSalesPage() {
  const lang = useLang();
  const t = useMemo(() => T[lang] || T.tr, [lang]);
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <div className="page" dir={dir}>
      <header className="topbar">
        <div className="wrap">
          <a className="brand" href="/">{t.brand}</a>
          <nav className="nav">
            <a className="link" href="/legal/kullanim-sartlari">
              {lang === "tr" ? "Kullanım Şartları" : lang === "en" ? "Terms of Use" : lang === "ar" ? "شروط الاستخدام" : "Nutzungsbedingungen"}
            </a>
            <a className="link" href="/legal/gizlilik">
              {lang === "tr" ? "Gizlilik" : lang === "en" ? "Privacy" : lang === "ar" ? "الخصوصية" : "Datenschutz"}
            </a>
            <a className="btn" href="/">{t.back}</a>
          </nav>
        </div>
      </header>

      <main className="wrap">
        <article className="paper">
          <h1>{t.title}</h1>
          <p className="muted">{t.effective}: 06.10.2025 — ureteneller.com</p>
          <p>{t.preface}</p>

          <h2>{t.partiesTitle}</h2>
          <ul>{t.parties.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <h2>{t.subjectTitle}</h2>
          <p>{t.subject}</p>

          <h2>{t.specsTitle}</h2>
          <ul>{t.specsList.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <h2>{t.deliveryTitle}</h2>
          <ul>{t.deliveryList.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <h2>{t.withdrawalTitle}</h2>
          <ul>{t.withdrawalList.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <h2>{t.returnTitle}</h2>
          <ul>{t.returnList.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <h2>{t.conformityTitle}</h2>
          <ul>{t.conformityList.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <h2>{t.commsTitle}</h2>
          <ul>{t.commsList.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <h2>{t.feesTitle}</h2>
          <p>{t.fees}</p>

          <h2>{t.disputeTitle}</h2>
          <p>{t.dispute}</p>

          <h2>{t.finalTitle}</h2>
          <p>{t.final}</p>

          <hr />
          <p className="quick">
            <strong>{t.quick}: </strong>
            <a href="/legal/teslimat-iade">
              {lang === "tr" ? "Teslimat & İade" : lang === "en" ? "Shipping & Returns" : lang === "ar" ? "التسليم والإرجاع" : "Lieferung & Rückgabe"}
            </a>{" "}
            • <a href="/legal/cerez-politikasi">
              {lang === "tr" ? "Çerez Politikası" : lang === "en" ? "Cookie Policy" : lang === "ar" ? "سياسة الكوكيز" : "Cookie-Richtlinie"}
            </a>{" "}
            • <a href="/legal/kvkk-aydinlatma">KVKK</a>
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
