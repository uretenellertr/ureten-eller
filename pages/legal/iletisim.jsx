/* /pages/legal/iletisim.jsx */
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

/** 4 dil — İletişim / Contact */
const T = {
  tr: {
    brand:"Üreten Eller",
    title:"İletişim",
    lead:"Sorularınız, geri bildirimleriniz ve iş birlikleri için bize ulaşın.",
    blocks: [
      { h:"Genel İletişim", items:[
        "E-posta: uretenellertr@gmail.com",
        "WhatsApp: 0507279143",
        "Telefon: 0507279143",
      ]},
      { h:"Adres", items:[
        "Gümüşyaka Mah., Rahmi Sok., No: 27A",
        "Silivri / İstanbul, 34588",
        "Vergi Dairesi/No: Silivri — 9530226667",
      ]},
      { h:"Çalışma Saatleri", items:[
        "Hafta içi: 09:00 – 18:00",
        "Hafta sonu: 10:00 – 16:00",
        "Resmî tatillerde yanıt süreleri uzayabilir."
      ]},
      { h:"Destek ve Şikayet", items:[
        "Sipariş uyuşmazlıklarında önce satıcıyla mesajlaşın.",
        "Çözülmezse sipariş numarasıyla bize yazın.",
        "Yanıt hedefimiz: 24–48 saat."
      ]},
    ],
    mapLabel:"Haritada Aç (Google Maps)",
    mapHref:"https://maps.google.com/?q=G%C3%BCm%C3%BC%C5%9Fyaka+Mah.,+Rahmi+Sok.,+No:+27A,+Silivri,+Istanbul+34588",
    quick:"Hızlı Geçiş",
    back:"Ana sayfa"
  },

  en: {
    brand:"Ureten Eller",
    title:"Contact",
    lead:"Reach us for questions, feedback and partnerships.",
    blocks: [
      { h:"General", items:[
        "Email: uretenellertr@gmail.com",
        "WhatsApp: +90 507 279 14 3",
        "Phone: +90 507 279 14 3",
      ]},
      { h:"Address", items:[
        "Gumusyaka Mah., Rahmi Sok., No: 27A",
        "Silivri / Istanbul, 34588",
        "Tax Office/No: Silivri — 9530226667",
      ]},
      { h:"Hours", items:[
        "Weekdays: 09:00 – 18:00",
        "Weekends: 10:00 – 16:00",
        "Public holidays may delay responses."
      ]},
      { h:"Support & Complaints", items:[
        "For disputes, message the seller first.",
        "If unresolved, contact us with your order number.",
        "Target response: 24–48 hours."
      ]},
    ],
    mapLabel:"Open in Maps",
    mapHref:"https://maps.google.com/?q=Gumusyaka+Mah.,+Rahmi+Sok.,+No:+27A,+Silivri,+Istanbul+34588",
    quick:"Quick Links",
    back:"Home"
  },

  ar: {
    brand:"أُنتِج بالأيادي",
    title:"اتصال",
    lead:"للاستفسارات والملاحظات والشراكات.",
    blocks: [
      { h:"عام", items:[
        "البريد: uretenellertr@gmail.com",
        "واتساب: 0507279143",
        "الهاتف: 0507279143",
      ]},
      { h:"العنوان", items:[
        "حي غوموشياكا، شارع رحمي، رقم 27A",
        "سيليفري/إسطنبول 34588",
        "الضرائب/الرقم: سيليفري — 9530226667",
      ]},
      { h:"ساعات العمل", items:[
        "أيام الأسبوع: 09:00 – 18:00",
        "عطلة نهاية الأسبوع: 10:00 – 16:00",
        "قد تتأخر الردود في العطل الرسمية."
      ]},
      { h:"الدعم والشكاوى", items:[
        "للنزاعات تواصل أولًا مع البائعة.",
        "إن لم يُحل، راسلنا مع رقم الطلب.",
        "هدف الرد: 24–48 ساعة."
      ]},
    ],
    mapLabel:"افتح على الخريطة",
    mapHref:"https://maps.google.com/?q=Gumusyaka+Mah.,+Rahmi+Sok.,+No:+27A,+Silivri,+Istanbul+34588",
    quick:"روابط سريعة",
    back:"الصفحة الرئيسية"
  },

  de: {
    brand:"Ureten Eller",
    title:"Kontakt",
    lead:"Kontakt für Fragen, Feedback und Partnerschaften.",
    blocks: [
      { h:"Allgemein", items:[
        "E-Mail: uretenellertr@gmail.com",
        "WhatsApp: +90 507 279 14 3",
        "Telefon: +90 507 279 14 3",
      ]},
      { h:"Adresse", items:[
        "Gumusyaka Mah., Rahmi Sok., Nr. 27A",
        "Silivri / Istanbul, 34588",
        "Steueramt/-Nr.: Silivri — 9530226667",
      ]},
      { h:"Zeiten", items:[
        "Werktage: 09:00 – 18:00",
        "Wochenende: 10:00 – 16:00",
        "An Feiertagen ggf. verzögert."
      ]},
      { h:"Support & Beschwerden", items:[
        "Bei Streitfällen zuerst Verkäufer:in kontaktieren.",
        "Falls ungelöst, mit Bestellnummer melden.",
        "Zielreaktion: 24–48 Stunden."
      ]},
    ],
    mapLabel:"In Maps öffnen",
    mapHref:"https://maps.google.com/?q=Gumusyaka+Mah.,+Rahmi+Sok.,+Nr.+27A,+Silivri,+Istanbul+34588",
    quick:"Schnellzugriff",
    back:"Startseite"
  }
};

export const metadata = { title: "İletişim • Üreten Eller" };

export default function ContactPage(){
  const lang=useLang();
  const t=useMemo(()=>T[lang]||T.tr,[lang]);
  const dir=lang==="ar"?"rtl":"ltr";

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

          <section className="grid">
            {t.blocks.map((b,i)=>(
              <div className="card" key={i}>
                <h3>{b.h}</h3>
                <ul>{b.items.map((x,k)=><li key={k}>{x}</li>)}</ul>
              </div>
            ))}
          </section>

          <p className="map">
            <a href={t.mapHref} target="_blank" rel="noopener noreferrer">{t.mapLabel}</a>
          </p>

          <hr />
          <p className="quick">
            <strong>{t.quick}: </strong>
            <a href="/legal/gizlilik">{lang==="tr"?"Gizlilik":"Privacy"}</a>{" • "}
            <a href="/legal/cerez-politikasi">{lang==="tr"?"Çerez":"Cookies"}</a>{" • "}
            <a href="/legal/kvkk-aydinlatma">KVKK</a>
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
        .paper h2,.paper h3{margin:1.2em 0 .5em}
        .paper p,.paper li{line-height:1.7}
        .lead{font-size:18px}
        .grid{display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(260px,1fr))}
        .card{background:#fff;border:1px solid var(--line);border-radius:12px;padding:14px}
        .map a{display:inline-block;margin-top:10px;color:#0ea5e9;text-decoration:none}
        .map a:hover{text-decoration:underline}
      `}</style>
    </div>
  );
}
