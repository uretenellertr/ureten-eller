/* /pages/legal/teslimat-iade.jsx */
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

/** 4 dil — Teslimat & İade / Shipping & Returns */
const T = {
  tr: {
    brand: "Üreten Eller",
    title: "Teslimat & İade Politikası",
    effective: "Yürürlük",
    intro:
      "Bu politika, ureteneller.com üzerinden verilen siparişlerin sevkiyat, teslimat, cayma ve iade süreçlerini açıklar. Üreten Eller aracı hizmet sağlayıcıdır; satış sözleşmesi alıcı ile satıcı arasında kurulur.",
    shipTitle: "1) Kargo ve Teslimat Süreleri",
    shipList: [
      "Ürünlerin hazırlık ve kargo süreleri satıcı tarafından ilanda belirtilir.",
      "Kargo firması seçimi ve ücretleri satıcının belirlediği koşullara göre değişebilir; alıcı, ödeme adımında toplam bedeli görür.",
      "Aynı şehir içi elden teslim/kurye seçenekleri varsa ilanda ayrıca belirtilir.",
      "Resmî tatil, hava koşulları ve mücbir sebeplerden kaynaklı gecikmeler satıcının kontrolü dışındadır.",
    ],
    packagingTitle: "2) Paketleme ve Hasar",
    packagingList: [
      "Satıcı, ürünü taşıma koşullarına uygun şekilde paketlemekle yükümlüdür.",
      "Teslim anında pakette ezilme/yırtılma/ıslanma görülürse kargo görevlisiyle birlikte hasar tespit tutanağı tutulması önerilir.",
      "Hasarlı teslimlerde fotoğraf/video ile kayıt altına alınması çözümü hızlandırır.",
    ],
    trackingTitle: "3) Kargo Takibi",
    trackingList: [
      "Sipariş kargoya teslim edildiğinde sistemde takip numarası gösterilir veya alıcıya bildirilir.",
      "“Ürünüm nerede?” bağlantısıyla sipariş detayından taşıyıcı ekranına yönlendirme yapılır.",
    ],
    withdrawalTitle: "4) Cayma Hakkı (14 Gün)",
    withdrawalList: [
      "Alıcı, teslimden itibaren 14 gün içinde gerekçe göstermeden cayma hakkını kullanabilir.",
      "İstisnalar: kişiye özel üretim, hızlı bozulan gıda, hijyen gerektiren ambalajı açılmış ürünler vb.",
      "Cayma talebi platform üzerinden başlatılmalı; satıcıya iade gönderisi yapılmalıdır.",
    ],
    returnTitle: "5) İade Şartları",
    returnList: [
      "Ürün kullanılmamış, yeniden satılabilir nitelikte ve mümkünse orijinal ambalajında olmalıdır.",
      "Eksik/yanlış/ayıplı ürünlerde satıcı durum tespitinden sonra değişim veya iade sunar.",
      "Yasal durumlarda iade kargo bedeli satıcıya; cayma nedeniyle iade kargo bedeli ise ilandaki koşullara göre alıcıya ait olabilir.",
    ],
    refundTitle: "6) Ücret İadesi",
    refundList: [
      "İade kabul edildiğinde bedel, ödeme kuruluşu (PayTR/iyzico) üzerinden alıcının kullandığı yönteme iade edilir.",
      "Bankaların iş günleri ve PSP süreçlerine bağlı olarak hesaplara yansıma süresi değişebilir.",
    ],
    noShowTitle: "7) Teslim Alınmayan Gönderiler",
    noShowList: [
      "Adreste bulunamama/teslim alınmama hâlinde kargo belirli süre şubede bekletilir ve geri döner.",
      "Tekrar gönderim ücreti ilandaki koşullara göre alıcıdan talep edilebilir.",
    ],
    foodTitle: "8) Gıda/Kısa Raf Ömürlü Ürünler",
    foodList: [
      "Taze/ev yapımı gıda ürünlerinde soğuk zincir, raf ömrü ve içerik bilgileri ilanda açıkça belirtilmelidir.",
      "Bu ürünlerde hijyen nedeniyle cayma hakkı kısıtlı olabilir; ilandaki istisnalar geçerlidir.",
    ],
    contactTitle: "9) İletişim ve Destek",
    contactText:
      "Sorularınız ve talepleriniz için satıcıyla mesajlaşma üzerinden iletişime geçebilir, çözülemezse destek için bize yazabilirsiniz.",
    contactList: [
      "E-posta: uretenellertr@gmail.com",
      "Adres: Gümüşyaka Mah., Rahmi Sok., No: 27A, Silivri / İstanbul, 34588",
      "Telefon (WhatsApp): 0507279143",
    ],
    legalTitle: "10) Hukuki Çerçeve",
    legalText:
      "Tüketicinin korunmasına ilişkin mevzuat hükümleri saklıdır. Üreten Eller, aracı hizmet sağlayıcı olarak kayıtları inceler ve çözüm sürecini kolaylaştırır.",
    quick: "Hızlı Geçiş",
    back: "Ana sayfa",
  },

  en: {
    brand: "Ureten Eller",
    title: "Shipping & Returns Policy",
    effective: "Effective",
    intro:
      "This policy explains shipping, delivery, withdrawal and returns for orders on ureteneller.com. Ureten Eller is an intermediary; the sales contract is between buyer and seller.",
    shipTitle: "1) Shipping & Delivery Times",
    shipList: [
      "Preparation and dispatch times are stated by the seller on the listing.",
      "Carrier choice/fees may vary per seller; buyer sees total charges at checkout.",
      "If same-city handover/courier is available, it’s specified on the listing.",
      "Delays due to holidays, weather or force majeure are beyond seller’s control.",
    ],
    packagingTitle: "2) Packaging & Damage",
    packagingList: [
      "Seller must pack items suitably for transit.",
      "If the parcel shows damage at delivery, create a damage report with the courier.",
      "Photos/videos at delivery speed up resolution.",
    ],
    trackingTitle: "3) Tracking",
    trackingList: [
      "Tracking code appears in the order once dispatched or is shared with the buyer.",
      "Use the “Where is my item?” link in order details to reach the carrier page.",
    ],
    withdrawalTitle: "4) Right of Withdrawal (14 Days)",
    withdrawalList: [
      "Buyer may withdraw within 14 days from delivery without stating a reason.",
      "Exceptions: custom-made items, perishable foods, opened hygiene items, etc.",
      "Start the withdrawal in-platform and return the item to the seller.",
    ],
    returnTitle: "5) Return Conditions",
    returnList: [
      "Items must be unused, resellable and preferably in original packaging.",
      "For missing/wrong/defective items, seller offers exchange or refund after assessment.",
      "By law, return shipping for defects is borne by seller; for voluntary withdrawal it may be by buyer as per listing terms.",
    ],
    refundTitle: "6) Refunds",
    refundList: [
      "Once accepted, refunds are processed via the PSP (PayTR/iyzico) to the original payment method.",
      "Posting time to the account depends on banks and PSP processing times.",
    ],
    noShowTitle: "7) Undelivered/Unclaimed Parcels",
    noShowList: [
      "If undelivered, carriers hold parcels for a limited time before returning.",
      "Reshipment fees may be requested from the buyer per listing terms.",
    ],
    foodTitle: "8) Food/Short Shelf-Life Items",
    foodList: [
      "For fresh/home-made foods, cold-chain, shelf life and ingredients must be disclosed.",
      "Withdrawal may be limited for hygiene reasons; listing exceptions apply.",
    ],
    contactTitle: "9) Contact & Support",
    contactText:
      "Message the seller first; if unresolved, contact our support.",
    contactList: [
      "Email: uretenellertr@gmail.com",
      "Address: Gumusyaka Mah., Rahmi Sok., No: 27A, Silivri / Istanbul, 34588",
      "Phone (WhatsApp): 0507279143",
    ],
    legalTitle: "10) Legal Framework",
    legalText:
      "Consumer protection laws apply. As an intermediary, Ureten Eller reviews records and facilitates resolution.",
    quick: "Quick Links",
    back: "Home",
  },

  ar: {
    brand: "أُنتِج بالأيادي",
    title: "سياسة التسليم والإرجاع",
    effective: "سريان",
    intro:
      "توضح هذه السياسة التسليم وحق الانسحاب والإرجاع للطلبات على ureteneller.com. «أُنتِج بالأيادي» وسيط؛ العقد بين المشتري والبائع.",
    shipTitle: "1) الشحن ومواعيد التسليم",
    shipList: [
      "يُذكر وقت التحضير والإرسال في الإعلان من قِبل البائع.",
      "قد تختلف شركة الشحن ورسومها حسب البائع؛ يرى المشتري التكلفة النهائية عند الدفع.",
      "إن وُجد تسليم داخل المدينة/مرسل خاص فيُذكر في الإعلان.",
      "التأخيرات بسبب العطل/الطقس/القوة القاهرة خارجة عن سيطرة البائع.",
    ],
    packagingTitle: "2) التغليف والضرر",
    packagingList: [
      "على البائع تغليف المنتجات بما يلائم الشحن.",
      "عند ظهور ضرر عند التسليم، أنشئ محضر ضرر مع شركة الشحن.",
      "تُسرّع الصور/الفيديو وقت التسليم من الحل.",
    ],
    trackingTitle: "3) التتبّع",
    trackingList: [
      "يظهر رقم التتبّع في الطلب بعد الإرسال أو يُشارك مع المشتري.",
      "استخدم رابط «أين طلبي؟» من تفاصيل الطلب للوصول لصفحة شركة الشحن.",
    ],
    withdrawalTitle: "4) حق الانسحاب (14 يومًا)",
    withdrawalList: [
      "يحق للمشتري الانسحاب خلال 14 يومًا من التسليم دون سبب.",
      "الاستثناءات: المنتجات المخصصة، الأطعمة السريعة التلف، منتجات العناية المفتوحة…",
      "ابدأ الانسحاب من داخل المنصّة ثم أرسل المنتج للبائع.",
    ],
    returnTitle: "5) شروط الإرجاع",
    returnList: [
      "يجب أن تكون المنتجات غير مستخدمة وصالحة للبيع ويفضّل بعبوتها الأصلية.",
      "في النواقص/الخطأ/العيب يقدّم البائع استبدالًا أو استردادًا بعد التقييم.",
      "في حالة العيب يتحمّل البائع الشحن؛ في الانسحاب الطوعي قد يتحمّله المشتري وفق شروط الإعلان.",
    ],
    refundTitle: "6) الاسترداد",
    refundList: [
      "بعد القبول، تُنفّذ الاستردادات عبر مزوّد الدفع (PayTR/iyzico) لنفس وسيلة الدفع.",
      "مدة الإيداع تتبع إجراءات البنوك/المزوّد.",
    ],
    noShowTitle: "7) الشحنات غير المستلمة",
    noShowList: [
      "عند عدم التسليم تُحتفَظ الشحنة مدة محدودة ثم تُعاد.",
      "قد تُطلب رسوم إعادة الشحن من المشتري وفق شروط الإعلان.",
    ],
    foodTitle: "8) الأطعمة/قصيرة الصلاحية",
    foodList: [
      "للأطعمة الطازجة/المنزلية يجب توضيح سلسلة التبريد والصلاحية والمكونات.",
      "قد يُقيَّد حق الانسحاب لأسباب صحية؛ تُطبّق استثناءات الإعلان.",
    ],
    contactTitle: "9) التواصل والدعم",
    contactText:
      "تواصل مع البائع أولًا؛ وإن تعذر الحل راسل دعمنا.",
    contactList: [
      "البريد: uretenellertr@gmail.com",
      "العنوان: حي غوموشياكا، شارع رحمي، رقم 27A، سيليفري/إسطنبول 34588",
      "الهاتف (واتساب): 0507279143",
    ],
    legalTitle: "10) الإطار القانوني",
    legalText:
      "تُطبّق قوانين حماية المستهلك. كوسيط نراجع السجلات ونيسّر الحل.",
    quick: "روابط سريعة",
    back: "الصفحة الرئيسية",
  },

  de: {
    brand: "Ureten Eller",
    title: "Lieferung & Rückgabe",
    effective: "Wirksam ab",
    intro:
      "Diese Richtlinie erläutert Versand, Lieferung, Widerruf und Rückgaben für Bestellungen auf ureteneller.com. Ureten Eller ist Vermittler; der Kaufvertrag besteht zwischen Käufer und Verkäufer.",
    shipTitle: "1) Versand & Lieferzeiten",
    shipList: [
      "Vorbereitungs- und Versandzeiten nennt der Verkäufer im Inserat.",
      "Versender/Gebühren können je Verkäufer variieren; die Gesamtkosten sind im Checkout sichtbar.",
      "Falls Stadtkurier/Abholung möglich ist, steht dies im Inserat.",
      "Verzögerungen durch Feiertage/Wetter/Force Majeure liegen außerhalb der Verkäuferkontrolle.",
    ],
    packagingTitle: "2) Verpackung & Schäden",
    packagingList: [
      "Der Verkäufer muss transportsicher verpacken.",
      "Bei sichtbaren Schäden bei Übergabe: Schadensprotokoll mit Zusteller erstellen.",
      "Fotos/Videos bei Zustellung beschleunigen die Klärung.",
    ],
    trackingTitle: "3) Sendungsverfolgung",
    trackingList: [
      "Die Trackingnummer erscheint nach Versand in der Bestellung oder wird übermittelt.",
      "Nutzen Sie „Wo ist mein Artikel?“ in den Bestelldetails für die Carrier-Seite.",
    ],
    withdrawalTitle: "4) Widerrufsrecht (14 Tage)",
    withdrawalList: [
      "Widerruf binnen 14 Tagen ab Lieferung ohne Angabe von Gründen.",
      "Ausnahmen: Maßanfertigungen, leicht verderbliche Lebensmittel, geöffnete Hygieneartikel usw.",
      "Widerruf im System starten und die Ware an den Verkäufer zurücksenden.",
    ],
    returnTitle: "5) Rückgabebedingungen",
    returnList: [
      "Artikel unbenutzt, wiederverkaufsfähig und nach Möglichkeit in Originalverpackung.",
      "Bei fehlender/falscher/mangelhafter Ware: Austausch oder Erstattung nach Prüfung.",
      "Bei Mängeln trägt der Verkäufer die Rücksendekosten; bei freiwilligem Widerruf ggf. der Käufer laut Inserat.",
    ],
    refundTitle: "6) Erstattungen",
    refundList: [
      "Nach Annahme via PSP (PayTR/iyzico) auf die ursprüngliche Zahlmethode.",
      "Gutschrift abhängig von Banken/PSP-Bearbeitungszeiten.",
    ],
    noShowTitle: "7) Nicht zugestellte/abgeholte Sendungen",
    noShowList: [
      "Nicht zugestellte Pakete werden begrenzt gelagert und retourniert.",
      "Neusendung kann laut Inserat vom Käufer zu tragen sein.",
    ],
    foodTitle: "8) Lebensmittel/Kurze Haltbarkeit",
    foodList: [
      "Für frische/hausgemachte Lebensmittel sind Kühlkette, Haltbarkeit und Zutaten offenzulegen.",
      "Widerruf kann aus Hygienegründen eingeschränkt sein; Inseratsausnahmen gelten.",
    ],
    contactTitle: "9) Kontakt & Support",
    contactText:
      "Kontaktieren Sie zuerst den Verkäufer; bei Bedarf den Support.",
    contactList: [
      "E-Mail: uretenellertr@gmail.com",
      "Adresse: Gumusyaka Mah., Rahmi Sok., Nr. 27A, Silivri / Istanbul, 34588",
      "Telefon (WhatsApp): 0507279143",
    ],
    legalTitle: "10) Rechtlicher Rahmen",
    legalText:
      "Verbraucherschutzrecht gilt. Als Vermittler prüft Ureten Eller Protokolle und fördert die Lösung.",
    quick: "Schnellzugriff",
    back: "Startseite",
  },
};

export const metadata = { title: "Teslimat & İade • Üreten Eller" };

export default function ShippingReturnsPage() {
  const lang = useLang();
  const t = useMemo(() => T[lang] || T.tr, [lang]);
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <div className="page" dir={dir}>
      <header className="topbar">
        <div className="wrap">
          <a className="brand" href="/">{t.brand}</a>
          <nav className="nav">
            <a className="link" href="/legal/mesafeli-satis-sozlesmesi">
              {lang === "tr" ? "Mesafeli Satış" : lang === "en" ? "Distance Sales" : lang === "ar" ? "البيع عن بُعد" : "Fernabsatz"}
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
          <p>{t.intro}</p>

          <h2>{t.shipTitle}</h2>
          <ul>{t.shipList.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <h2>{t.packagingTitle}</h2>
          <ul>{t.packagingList.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <h2>{t.trackingTitle}</h2>
          <ul>{t.trackingList.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <h2>{t.withdrawalTitle}</h2>
          <ul>{t.withdrawalList.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <h2>{t.returnTitle}</h2>
          <ul>{t.returnList.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <h2>{t.refundTitle}</h2>
          <ul>{t.refundList.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <h2>{t.noShowTitle}</h2>
          <ul>{t.noShowList.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <h2>{t.foodTitle}</h2>
          <ul>{t.foodList.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <h2>{t.contactTitle}</h2>
          <p>{t.contactText}</p>
          <ul>{t.contactList.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <h2>{t.legalTitle}</h2>
          <p>{t.legalText}</p>

          <hr />
          <p className="quick">
            <strong>{t.quick}: </strong>
            <a href="/legal/cerez-politikasi">
              {lang === "tr" ? "Çerez Politikası" : lang === "en" ? "Cookie Policy" : lang === "ar" ? "سياسة الكوكيز" : "Cookie-Richtlinie"}
            </a>{" "}
            • <a href="/legal/kullanim-sartlari">
              {lang === "tr" ? "Kullanım Şartları" : lang === "en" ? "Terms of Use" : lang === "ar" ? "شروط الاستخدام" : "Nutzungsbedingungen"}
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
