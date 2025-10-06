/* /pages/legal/topluluk-kurallari.jsx */
"use client";
import { useEffect, useMemo, useState } from "react";

/** Dil */
function useLang() {
  const [lang, setLang] = useState("tr");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const s = localStorage.getItem("lang");
      if (s && ["tr","en","ar","de"].includes(s)) setLang(s);
      if (!s) {
        const nav=(navigator.language||"tr").slice(0,2).toLowerCase();
        if (["tr","en","ar","de"].includes(nav)) setLang(nav);
      }
    }
  }, []);
  useEffect(()=>{
    if (typeof document!=="undefined"){
      document.documentElement.lang=lang;
      document.documentElement.dir=lang==="ar"?"rtl":"ltr";
    }
  },[lang]);
  return lang;
}

/** 4 dil — Topluluk Kuralları / Community Rules */
const T = {
  tr: {
    brand:"Üreten Eller",
    title:"Topluluk Kuralları",
    intro:"Üreten Eller; güvenli, saygılı ve adil bir pazar yeri olması için bazı kurallara sahiptir. Aşağıdaki ihlaller ilan kaldırma, hesap kısıtlama veya kapatma gibi yaptırımlara yol açabilir.",
    respectTitle:"1) Saygı ve Davranış",
    respect:[
      "Hakaret, nefret söylemi, ayrımcı ifadeler ve taciz yasaktır.",
      "Spam, istenmeyen reklam ve manipülatif davranışlar yasaktır.",
      "Kişisel verileri izinsiz paylaşmak yasaktır."
    ],
    fairTitle:"2) Adil Ticaret",
    fair:[
      "İlan bilgileri doğru ve eksiksiz olmalı; fiyat/teslim/iade net yazılmalı.",
      "Yanıltıcı görsel, sahte yorum/puan ve aldatıcı etiketler yasaktır.",
      "Teslimat sürelerine uyulmalı; gecikmeler şeffaf şekilde bildirilmelidir."
    ],
    msgTitle:"3) Mesajlaşma ve Sipariş Sonrası",
    msg:[
      "Sipariş sonrası mesajlar yalnızca ürün/sipariş içindir.",
      "Küfür, tehdit, pazarlık dışı baskı yasaktır.",
      "Kişisel iletişim ve ödeme kanallarına yönlendirme yasaktır (platform dışı tahsilat yok)."
    ],
    rateTitle:"4) Değerlendirme ve Yorum",
    rate:[
      "Yorumlar dürüst, deneyime dayalı ve saygılı olmalıdır.",
      "Karalama amaçlı organize yorum/puan manipülasyonu yasaktır.",
      "Satıcılar kendi ürünlerine yorum yazamaz; çıkar çatışması olamaz."
    ],
    contentTitle:"5) İçerik ve Fikri Haklar",
    content:[
      "Telif/marka ihlallerine izin verilmez; izinsiz logo/fotoğraf kullanmayın.",
      "Yasaklı ürünler ve mevzuata aykırı iddialar paylaşılamaz.",
      "Uygunsuz içerikleri şikayet butonuyla bildirin."
    ],
    sellerTitle:"6) Satıcı Standartları",
    seller:[
      "Zamanında üretim/teslim, özenli paketleme.",
      "Mesaj ve uyuşmazlıklara 48 saat içinde dönüş.",
      "İade/cayma taleplerinde mevzuata uygun hareket."
    ],
    buyerTitle:"7) Alıcı Sorumlulukları",
    buyer:[
      "Adres ve iletişim bilgilerini doğru girin; teslim anında hazır olun.",
      "Ürünle ilgili sorunlarda öncelikle satıcıyla çözüm arayın.",
      "Haksız cayma/istismar ve kötü niyetli iade yasaktır."
    ],
    enforcementTitle:"8) Yaptırımlar ve İtiraz",
    enforcement:[
      "İhlalde içerik kaldırma, uyarı, geçici/permanent hesap kapatma uygulanabilir.",
      "Yanlış yaptırım iddiası için destek kanalından itiraz edebilirsiniz.",
      "Yasal zorunluluklarda resmi mercilerle iş birliği yapılır."
    ],
    reportTitle:"9) Şikayet ve Destek",
    report:[
      "E-posta: uretenellertr@gmail.com",
      "WhatsApp: 0507279143",
      "Adres: Gümüşyaka Mah., Rahmi Sok., No: 27A, Silivri / İstanbul, 34588"
    ],
    quick:"Hızlı Geçiş",
    back:"Ana sayfa"
  },

  en: {
    brand:"Ureten Eller",
    title:"Community Rules",
    intro:"To keep Ureten Eller safe, respectful and fair, we enforce the following rules. Violations may result in removal, account restrictions or termination.",
    respectTitle:"1) Respectful Conduct",
    respect:[
      "No harassment, hate speech, discrimination or insults.",
      "No spam, unwanted advertising or manipulative behavior.",
      "No sharing others’ personal data without consent."
    ],
    fairTitle:"2) Fair Trading",
    fair:[
      "Listings must be accurate; price/delivery/returns clearly stated.",
      "No misleading visuals, fake reviews/ratings or deceptive tags.",
      "Meet delivery times; inform buyers transparently about delays."
    ],
    msgTitle:"3) Messaging & Post-Order",
    msg:[
      "Post-order chat is only for the order/product.",
      "No profanity, threats or coercion.",
      "No off-platform payments or contact redirection."
    ],
    rateTitle:"4) Ratings & Reviews",
    rate:[
      "Reviews must be honest, experience-based and respectful.",
      "No coordinated smear or rating manipulation.",
      "Sellers cannot review their own items; avoid conflicts of interest."
    ],
    contentTitle:"5) Content & IP",
    content:[
      "No trademark/copyright/design violations or unauthorized logos/photos.",
      "No prohibited items or unlawful claims.",
      "Use the report button for inappropriate content."
    ],
    sellerTitle:"6) Seller Standards",
    seller:[
      "On-time production/delivery; careful packaging.",
      "Respond to messages/disputes within 48 hours.",
      "Follow consumer law for returns/withdrawals."
    ],
    buyerTitle:"7) Buyer Responsibilities",
    buyer:[
      "Provide correct address/contact; be available at delivery.",
      "Contact the seller first for issues.",
      "No abusive withdrawals/returns or bad-faith behavior."
    ],
    enforcementTitle:"8) Enforcement & Appeals",
    enforcement:[
      "We may remove content, warn, suspend or terminate accounts.",
      "Appeal via support if you believe action was incorrect.",
      "We cooperate with authorities where required."
    ],
    reportTitle:"9) Report & Support",
    report:[
      "Email: uretenellertr@gmail.com",
      "WhatsApp: +90 507 279 14 3",
      "Address: Gumusyaka Mah., Rahmi Sok., No: 27A, Silivri / Istanbul, 34588"
    ],
    quick:"Quick Links",
    back:"Home"
  },

  ar: {
    brand:"أُنتِج بالأيادي",
    title:"قواعد المجتمع",
    intro:"لضمان سوق آمن ومحترم وعادل نطبّق القواعد التالية. المخالفات قد تؤدي إلى إزالة المحتوى أو تقييد/إغلاق الحساب.",
    respectTitle:"1) الاحترام والسلوك",
    respect:[
      "ممنوع الإساءة وخطاب الكراهية والتمييز والتحرّش.",
      "ممنوع الرسائل المزعجة والدعاية المرفوضة والممارسات المضلّلة.",
      "ممنوع مشاركة بيانات الغير دون موافقة."
    ],
    fairTitle:"2) التجارة العادلة",
    fair:[
      "يجب أن تكون الإعلانات دقيقة؛ السعر/التسليم/الإرجاع موضح.",
      "ممنوع الصور/المراجعات المضلّلة والتلاعب بالتقييمات والوسوم.",
      "احترام مواعيد التسليم وإبلاغ التأخيرات بشفافية."
    ],
    msgTitle:"3) الرسائل وما بعد الطلب",
    msg:[
      "المحادثة بعد الطلب مخصّصة للطلب/المنتج فقط.",
      "ممنوع الألفاظ البذيئة والتهديد والإكراه.",
      "ممنوع التحويل للدفع خارج المنصّة."
    ],
    rateTitle:"4) التقييمات والمراجعات",
    rate:[
      "المراجعات صادقة ومحترمة ومبنية على تجربة.",
      "ممنوع حملات التشويه أو التلاعب بالتقييم.",
      "لا يراجع البائع منتجاته؛ تجنّب تعارض المصالح."
    ],
    contentTitle:"5) المحتوى والملكية الفكرية",
    content:[
      "ممنوع انتهاك العلامات/الحقوق أو استخدام شعارات/صور دون إذن.",
      "ممنوع العناصر المحظورة أو الادعاءات غير القانونية.",
      "استخدم زر الإبلاغ للمحتوى غير المناسب."
    ],
    sellerTitle:"6) معايير البائع",
    seller:[
      "إنتاج/تسليم في الوقت وتغليف مناسب.",
      "الرد على الرسائل/النزاعات خلال 48 ساعة.",
      "اتباع قوانين المستهلك في الإرجاع/الانسحاب."
    ],
    buyerTitle:"7) مسؤوليات المشتري",
    buyer:[
      "إدخال عنوان/اتصال صحيح والتواجد للتسليم.",
      "التواصل مع البائع أولًا عند المشاكل.",
      "ممنوع الإرجاع التعسّفي أو سوء النية."
    ],
    enforcementTitle:"8) التنفيذ والاعتراض",
    enforcement:[
      "قد نحذف المحتوى أو نحذر أو نعلّق/نغلق الحساب.",
      "يمكنك الاعتراض عبر الدعم إن كان الإجراء خاطئًا.",
      "نتعاون مع الجهات المختصّة عند اللزوم."
    ],
    reportTitle:"9) الإبلاغ والدعم",
    report:[
      "البريد: uretenellertr@gmail.com",
      "واتساب: 0507279143",
      "العنوان: حي غوموشياكا، شارع رحمي، رقم 27A، سيليفري/إسطنبول 34588"
    ],
    quick:"روابط سريعة",
    back:"الصفحة الرئيسية"
  },

  de: {
    brand:"Ureten Eller",
    title:"Community-Regeln",
    intro:"Für einen sicheren, respektvollen und fairen Marktplatz gelten folgende Regeln. Verstöße können zur Entfernung, Sperre oder Kündigung führen.",
    respectTitle:"1) Respekt & Verhalten",
    respect:[
      "Kein Hass, keine Diskriminierung, Belästigung oder Beleidigungen.",
      "Kein Spam, keine unaufgeforderte Werbung, keine Manipulation.",
      "Keine Weitergabe personenbezogener Daten ohne Einwilligung."
    ],
    fairTitle:"2) Fairer Handel",
    fair:[
      "Inserate müssen korrekt sein; Preis/Lieferung/Rückgabe klar.",
      "Keine irreführenden Darstellungen, Fake-Reviews/-Ratings, Täuschung.",
      "Lieferzeiten einhalten; Verzögerungen transparent melden."
    ],
    msgTitle:"3) Nachrichten & Nach-Bestellung",
    msg:[
      "Chat nach Bestellung nur für Produkt/Bestellung.",
      "Kein Fluchen, Drohen oder Zwang.",
      "Keine Off-Platform-Zahlungen oder Kontaktumlenkung."
    ],
    rateTitle:"4) Bewertungen",
    rate:[
      "Ehrlich, erfahrungsbasiert, respektvoll.",
      "Keine koordinierte Rufschädigung/Manipulation.",
      "Verkäufer bewerten ihre eigenen Produkte nicht."
    ],
    contentTitle:"5) Inhalte & Schutzrechte",
    content:[
      "Keine Marken-/Urheber-/Designverletzungen; keine unbefugten Logos/Fotos.",
      "Keine verbotenen Artikel oder unzulässige Behauptungen.",
      "Unangemessene Inhalte bitte melden."
    ],
    sellerTitle:"6) Verkäufer-Standards",
    seller:[
      "Pünktliche Produktion/Lieferung; sorgfältige Verpackung.",
      "Antwort auf Nachrichten/Streitfälle binnen 48 Std.",
      "Rückgaben/Widerruf gesetzeskonform abwickeln."
    ],
    buyerTitle:"7) Käufer-Pflichten",
    buyer:[
      "Korrekte Adresse/Kontakt; bei Lieferung erreichbar sein.",
      "Bei Problemen zuerst den Verkäufer kontaktieren.",
      "Kein missbräuchlicher Widerruf oder bösgläubiges Verhalten."
    ],
    enforcementTitle:"8) Durchsetzung & Einspruch",
    enforcement:[
      "Entfernung, Verwarnung, Sperre oder Kündigung möglich.",
      "Einspruch über Support bei Fehlentscheidung.",
      "Zusammenarbeit mit Behörden, falls erforderlich."
    ],
    reportTitle:"9) Meldung & Support",
    report:[
      "E-Mail: uretenellertr@gmail.com",
      "WhatsApp: +90 507 279 14 3",
      "Adresse: Gumusyaka Mah., Rahmi Sok., Nr. 27A, Silivri / Istanbul, 34588"
    ],
    quick:"Schnellzugriff",
    back:"Startseite"
  }
};

export const metadata = { title: "Topluluk Kuralları • Üreten Eller" };

export default function CommunityRulesPage(){
  const lang=useLang();
  const t=useMemo(()=>T[lang]||T.tr,[lang]);
  const dir=lang==="ar"?"rtl":"ltr";

  const Section = ({title,list}) => (
    <>
      <h2>{title}</h2>
      <ul>{list.map((x,i)=><li key={i}>{x}</li>)}</ul>
    </>
  );

  return (
    <div className="page" dir={dir}>
      <header className="topbar">
        <div className="wrap">
          <a className="brand" href="/">{t.brand}</a>
          <nav className="nav">
            <a className="btn" href="/">{t.back}</a>
          </nav>
        </div>
      </header>

      <main className="wrap">
        <article className="paper">
          <h1>{t.title}</h1>
          <p>{t.intro}</p>

          <Section title={t.respectTitle} list={t.respect}/>
          <Section title={t.fairTitle} list={t.fair}/>
          <Section title={t.msgTitle} list={t.msg}/>
          <Section title={t.rateTitle} list={t.rate}/>
          <Section title={t.contentTitle} list={t.content}/>
          <Section title={t.sellerTitle} list={t.seller}/>
          <Section title={t.buyerTitle} list={t.buyer}/>
          <Section title={t.enforcementTitle} list={t.enforcement}/>

          <h2>{t.reportTitle}</h2>
          <ul>{t.report.map((x,i)=><li key={i}>{x}</li>)}</ul>

          <hr />
          <p className="quick">
            <strong>{t.quick}: </strong>
            <a href="/legal/yasakli-urunler">{lang==="tr"?"Yasaklı Ürünler":"Prohibited"}</a>{" • "}
            <a href="/legal/kullanim-sartlari">{lang==="tr"?"Kullanım Şartları":"Terms"}</a>{" • "}
            <a href="/legal/gizlilik">{lang==="tr"?"Gizlilik":"Privacy"}</a>
          </p>
        </article>
      </main>

      <style jsx>{`
        :root{--ink:#0f172a;--muted:#475569;--bg:#f8fafc;--paper:#fff;--line:#e5e7eb;--brand:#111827;--focus:#0ea5e9}
        *{box-sizing:border-box}body{margin:0}
        .wrap{max-width:1100px;margin:0 auto;padding:0 16px}
        .topbar{position:sticky;top:0;z-index:30;background:#fff;border-bottom:1px solid var(--line)}
        .topbar .wrap{height:56px;display:flex;align-items:center;justify-content:space-between}
        .brand{font-weight:800;text-decoration:none;color:var(--brand)}
        .nav{display:flex;gap:10px;align-items:center}
        .btn{display:inline-block;padding:8px 12px;border-radius:10px;border:1px solid var(--line);text-decoration:none;color:var(--brand)}
        .btn:hover{border-color:var(--focus)}
        .page{background:var(--bg);min-height:100vh;color:var(--ink)}
        .paper{background:var(--paper);border:1px solid var(--line);border-radius:14px;margin:18px 0;padding:18px}
        .paper h1{margin:.1em 0 .4em}
        .paper h2{margin:1.2em 0 .5em}
        .paper p,.paper li{line-height:1.7}
      `}</style>
    </div>
  );
}
