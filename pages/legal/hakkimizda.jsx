/* /pages/legal/hakkimizda.jsx */
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

/** 4 dil — Hakkımızda / About */
const T = {
  tr: {
    brand:"Üreten Eller",
    title:"Hakkımızda",
    lead:"Kadınların el emeğini teknolojiyle buluşturup adil ve güvenli bir pazar yerine dönüştürüyoruz.",
    storyTitle:"Hikayemiz",
    story:[
      "Mahalle üreticilerinin emeği çoğu zaman görünür olamıyor; biz bu emeğe sahne açıyoruz.",
      "Güvenli ödeme, şeffaf süreç ve kullanıcı dostu arayüz ile alıcıyla üreticiyi buluşturuyoruz.",
      "Yerel ekonomiyi güçlendirirken sürdürülebilir üretimi destekliyoruz."
    ],
    valuesTitle:"Değerlerimiz",
    values:[
      "Adalet: Emeğin karşılığını bulması.",
      "Güven: Blokeli/emanet ödeme, açık politikalar.",
      "Topluluk: Saygı, dayanışma ve kapsayıcılık.",
      "Kalite: Özenli üretim, dürüst iletişim."
    ],
    pillarsTitle:"Neden Üreten Eller?",
    pillars:[
      "Güvenli Ödeme: Teslim onayına kadar emanet.",
      "Şeffaflık: Siparişten teslimata izlenebilir süreç.",
      "Destek: Türkçe/İngilizce/Arapça/Almanca arayüz.",
      "Yerellik: Şehrindeki üreticiye doğrudan erişim."
    ],
    contactTitle:"İletişim",
    contact:[
      "E-posta: uretenellertr@gmail.com",
      "WhatsApp: 0507279143",
      "Adres: Gümüşyaka Mah., Rahmi Sok., No: 27A, Silivri / İstanbul, 34588"
    ],
    quick:"Hızlı Geçiş",
    back:"Ana sayfa"
  },

  en: {
    brand:"Ureten Eller",
    title:"About Us",
    lead:"We connect women makers with buyers through a fair, safe and local-first marketplace.",
    storyTitle:"Our Story",
    story:[
      "Local craftsmanship often lacks visibility; we give it a stage.",
      "Secure payments, transparent flow and friendly UX bring buyers and makers together.",
      "We strengthen local economies and support sustainable production."
    ],
    valuesTitle:"Our Values",
    values:[
      "Fairness: Rewarding labor properly.",
      "Trust: Escrowed payments, clear policies.",
      "Community: Respect, solidarity, inclusion.",
      "Quality: Careful making, honest communication."
    ],
    pillarsTitle:"Why Ureten Eller?",
    pillars:[
      "Secure Payments: Held in escrow until delivery.",
      "Transparency: Trackable flow from order to handover.",
      "Support: TR/EN/AR/DE interface.",
      "Local: Direct access to makers in your city."
    ],
    contactTitle:"Contact",
    contact:[
      "Email: uretenellertr@gmail.com",
      "WhatsApp: +90 507 279 14 3",
      "Address: Gumusyaka Mah., Rahmi Sok., No: 27A, Silivri / Istanbul, 34588"
    ],
    quick:"Quick Links",
    back:"Home"
  },

  ar: {
    brand:"أُنتِج بالأيادي",
    title:"من نحن",
    lead:"نربط المُنتِجات بالعملاء عبر سوق آمن وعادل ومحلي.",
    storyTitle:"قصتنا",
    story:[
      "غالبًا ما لا تحظى الأعمال اليدوية المحلية بالظهور؛ نحن نمنحها منصة.",
      "مدفوعات آمنة وتدفق شفاف وتجربة سهلة تربط المشتري بالمُنتِجة.",
      "ندعم الاقتصاد المحلي والإنتاج المستدام."
    ],
    valuesTitle:"قيمنا",
    values:[
      "العدالة: إنصاف الجهد.",
      "الثقة: حجز المدفوعات وسياسات واضحة.",
      "المجتمع: الاحترام والتضامن والشمول.",
      "الجودة: عناية في الإنتاج وتواصل صادق."
    ],
    pillarsTitle:"لماذا منصتنا؟",
    pillars:[
      "مدفوعات آمنة: تُحجز حتى تأكيد التسليم.",
      "شفافية: تتبّع من الطلب حتى الاستلام.",
      "دعم: واجهة TR/EN/AR/DE.",
      "محلية: وصول مباشر إلى المُنتِجات في مدينتك."
    ],
    contactTitle:"التواصل",
    contact:[
      "البريد: uretenellertr@gmail.com",
      "واتساب: 0507279143",
      "العنوان: حي غوموشياكا، شارع رحمي، رقم 27A، سيليفري/إسطنبول 34588"
    ],
    quick:"روابط سريعة",
    back:"الصفحة الرئيسية"
  },

  de: {
    brand:"Ureten Eller",
    title:"Über uns",
    lead:"Wir verbinden Produzentinnen mit Käufer:innen – fair, sicher und lokal.",
    storyTitle:"Unsere Geschichte",
    story:[
      "Lokales Handwerk bleibt oft unsichtbar – wir geben ihm eine Bühne.",
      "Sichere Zahlungen, transparente Abläufe, freundliche UX.",
      "Wir stärken lokale Wirtschaft und nachhaltige Produktion."
    ],
    valuesTitle:"Unsere Werte",
    values:[
      "Fairness: Leistung gerecht entlohnen.",
      "Vertrauen: Treuhandzahlungen, klare Richtlinien.",
      "Community: Respekt, Solidarität, Inklusion.",
      "Qualität: Sorgfalt und ehrliche Kommunikation."
    ],
    pillarsTitle:"Warum Ureten Eller?",
    pillars:[
      "Sichere Zahlungen: Treuhand bis Bestätigung.",
      "Transparenz: Nachvollziehbar vom Auftrag bis Übergabe.",
      "Support: TR/EN/AR/DE-Interface.",
      "Lokal: Direkter Zugang zu Produzentinnen vor Ort."
    ],
    contactTitle:"Kontakt",
    contact:[
      "E-Mail: uretenellertr@gmail.com",
      "WhatsApp: +90 507 279 14 3",
      "Adresse: Gumusyaka Mah., Rahmi Sok., Nr. 27A, Silivri / Istanbul, 34588"
    ],
    quick:"Schnellzugriff",
    back:"Startseite"
  }
};

export const metadata = { title: "Hakkımızda • Üreten Eller" };

export default function AboutPage(){
  const lang=useLang();
  const t=useMemo(()=>T[lang]||T.tr,[lang]);
  const dir=lang==="ar"?"rtl":"ltr";

  const List = ({arr}) => <ul>{arr.map((x,i)=><li key={i}>{x}</li>)}</ul>;

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
          <p className="lead">{t.lead}</p>

          <h2>{t.storyTitle}</h2>
          <List arr={t.story}/>

          <h2>{t.valuesTitle}</h2>
          <List arr={t.values}/>

          <h2>{t.pillarsTitle}</h2>
          <List arr={t.pillars}/>

          <h2>{t.contactTitle}</h2>
          <List arr={t.contact}/>

          <hr />
          <p className="quick">
            <strong>{t.quick}: </strong>
            <a href="/legal/kurumsal">{lang==="tr"?"Kurumsal":"Corporate"}</a>{" • "}
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
        .lead{font-size:18px;color:#0f172a}
      `}</style>
    </div>
  );
}
