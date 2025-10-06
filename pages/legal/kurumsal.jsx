/* /pages/legal/kurumsal.jsx */
"use client";
import { useEffect, useMemo, useState } from "react";

/** Lang */
function useLang() {
  const [lang, setLang] = useState("tr");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const s = localStorage.getItem("lang");
      if (s && ["tr","en","ar","de"].includes(s)) setLang(s);
      if (!s) {
        const nav = (navigator.language||"tr").slice(0,2).toLowerCase();
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

/** 4 dil — Kurumsal / Corporate */
const T = {
  tr: {
    brand:"Üreten Eller",
    title:"Kurumsal",
    effective:"Güncel",
    legalNote:"Hukuki Not: Üreten Eller bir şahıs işletmesidir.",
    missionTitle:"Misyon & Vizyon",
    mission:[
      "Misyon: Kadın üreticilerin emeğini dijitalde görünür kılmak, güvenli ödeme ve adil pazarla desteklemek.",
      "Vizyon: Yerelden ulusala yayılan güvenilir bir el emeği pazaryeri olmak."
    ],
    whoTitle:"Kimlik Bilgileri",
    who:[
      "Alan adı: ureteneller.com",
      "Vergi Dairesi/No: Silivri — 9530226667",
      "Adres: Gümüşyaka Mah., Rahmi Sok., No: 27A, Silivri / İstanbul, 34588",
      "E-posta: uretenellertr@gmail.com",
      "Telefon (WhatsApp): 0507279143",
    ],
    modelTitle:"İş Modeli",
    model:[
      "Aracı hizmet sağlayıcı: Satış sözleşmesi alıcı-satıcı arasında kurulur.",
      "Gelir kalemleri: Premium üyelik, vitrin/doping, reklam hizmetleri.",
      "Ödeme: PayTR/iyzico üzerinden tahsilat, teslim onayına kadar bloke.",
    ],
    trustTitle:"Güven & Uyum",
    trust:[
      "KVKK ve ilgili tüketici mevzuatına uyum.",
      "RLS/politikalar ile veri güvenliği ve erişim kontrolü.",
      "Yasaklı ürünler listesi ve moderasyon süreçleri.",
    ],
    quick:"Hızlı Geçiş",
    back:"Ana sayfa",
  },

  en: {
    brand:"Ureten Eller",
    title:"Corporate",
    effective:"Updated",
    legalNote:"Legal Note: Ureten Eller operates as a sole proprietorship.",
    missionTitle:"Mission & Vision",
    mission:[
      "Mission: Make women makers visible online with secure payments and fair marketplace access.",
      "Vision: A trusted handmade marketplace scaling from local to national."
    ],
    whoTitle:"Company Details",
    who:[
      "Domain: ureteneller.com",
      "Tax Office/No: Silivri — 9530226667",
      "Address: Gumusyaka Mah., Rahmi Sok., No: 27A, Silivri / Istanbul, 34588",
      "Email: uretenellertr@gmail.com",
      "Phone (WhatsApp): +90 507 279 14 3",
    ],
    modelTitle:"Business Model",
    model:[
      "Intermediary: sales contract is between buyer and seller.",
      "Revenue: premium plans, showcase/boosts, ads.",
      "Payments: via PayTR/iyzico, held in escrow until delivery confirmation.",
    ],
    trustTitle:"Trust & Compliance",
    trust:[
      "Compliant with KVKK and consumer laws.",
      "Data security via RLS/policies and access control.",
      "Enforcement of prohibited items and moderation.",
    ],
    quick:"Quick Links",
    back:"Home",
  },

  ar: {
    brand:"أُنتِج بالأيادي",
    title:"المعلومات المؤسسية",
    effective:"محدّث",
    legalNote:"ملاحظة قانونية: المنصّة منشأة فردية.",
    missionTitle:"الرؤية والرسالة",
    mission:[
      "رسالتنا: تمكين المُنتِجات عبر سوق آمن وعادل.",
      "رؤيتنا: سوق موثوق للأعمال اليدوية من المحلي إلى الوطني."
    ],
    whoTitle:"البيانات التعريفية",
    who:[
      "النطاق: ureteneller.com",
      "الضرائب/الرقم: سيليفري — 9530226667",
      "العنوان: حي غوموشياكا، شارع رحمي، رقم 27A، سيليفري/إسطنبول 34588",
      "البريد: uretenellertr@gmail.com",
      "الهاتف (واتساب): 0507279143",
    ],
    modelTitle:"نموذج العمل",
    model:[
      "وسيط: العقد بين المشتري والبائع.",
      "الإيرادات: عضوية مميّزة، عرض/ترويج، إعلانات.",
      "المدفوعات: عبر PayTR/iyzico مع حجز حتى تأكيد التسليم.",
    ],
    trustTitle:"الثقة والامتثال",
    trust:[
      "امتثال KVKK وقوانين المستهلك.",
      "أمن البيانات عبر سياسات RLS والتحكم في الوصول.",
      "قائمة المنتجات المحظورة وإجراءات الإشراف.",
    ],
    quick:"روابط سريعة",
    back:"الصفحة الرئيسية",
  },

  de: {
    brand:"Ureten Eller",
    title:"Unternehmen",
    effective:"Aktualisiert",
    legalNote:"Rechtlicher Hinweis: Ureten Eller ist ein Einzelunternehmen.",
    missionTitle:"Mission & Vision",
    mission:[
      "Mission: Frauenproduzentinnen mit sicheren Zahlungen und fairem Marktzugang stärken.",
      "Vision: Vertrauenswürdiger Handmade-Marktplatz vom Lokalen zum Nationalen."
    ],
    whoTitle:"Firmendaten",
    who:[
      "Domain: ureteneller.com",
      "Steueramt/-Nr.: Silivri — 9530226667",
      "Adresse: Gumusyaka Mah., Rahmi Sok., Nr. 27A, Silivri / Istanbul, 34588",
      "E-Mail: uretenellertr@gmail.com",
      "Telefon (WhatsApp): +90 507 279 14 3",
    ],
    modelTitle:"Geschäftsmodell",
    model:[
      "Vermittlerrolle: Kaufvertrag zwischen Käufer und Verkäufer.",
      "Erlöse: Premium, Vitrine/Boosts, Werbung.",
      "Zahlungen: via PayTR/iyzico, Treuhand bis Lieferbestätigung.",
    ],
    trustTitle:"Sicherheit & Compliance",
    trust:[
      "KVKK- und Verbraucherschutz-Compliance.",
      "Datensicherheit via RLS/Policies und Zugriffskontrollen.",
      "Durchsetzung der Verbotsliste und Moderation.",
    ],
    quick:"Schnellzugriff",
    back:"Startseite",
  },
};

export const metadata = { title: "Kurumsal • Üreten Eller" };

export default function CorporatePage(){
  const lang=useLang();
  const t=useMemo(()=>T[lang]||T.tr,[lang]);
  const dir=lang==="ar"?"rtl":"ltr";

  return (
    <div className="page" dir={dir}>
      <header className="topbar">
        <div className="wrap">
          <a className="brand" href="/">{t.brand}</a>
          <nav className="nav">
            <a className="link" href="/legal/hakkimizda">{lang==="tr"?"Hakkımızda":lang==="en"?"About":lang==="ar"?"من نحن":"Über uns"}</a>
            <a className="link" href="/legal/iletisim">{lang==="tr"?"İletişim":lang==="en"?"Contact":lang==="ar"?"اتصال":"Kontakt"}</a>
            <a className="btn" href="/">{t.back}</a>
          </nav>
        </div>
      </header>

      <main className="wrap">
        <article className="paper">
          <h1>{t.title}</h1>
          <p className="muted">{t.effective}: 06.10.2025 — ureteneller.com</p>
          <p className="legalNote">{t.legalNote}</p>

          <h2>{t.missionTitle}</h2>
          <ul>{t.mission.map((x,i)=><li key={i}>{x}</li>)}</ul>

          <h2>{t.whoTitle}</h2>
          <ul>{t.who.map((x,i)=><li key={i}>{x}</li>)}</ul>

          <h2>{t.modelTitle}</h2>
          <ul>{t.model.map((x,i)=><li key={i}>{x}</li>)}</ul>

          <h2>{t.trustTitle}</h2>
          <ul>{t.trust.map((x,i)=><li key={i}>{x}</li>)}</ul>

          <hr />
          <p className="quick">
            <strong>{t.quick}: </strong>
            <a href="/legal/kullanim-sartlari">{lang==="tr"?"Kullanım Şartları":"Terms"}</a>{" • "}
            <a href="/legal/gizlilik">{lang==="tr"?"Gizlilik":"Privacy"}</a>{" • "}
            <a href="/legal/yasakli-urunler">{lang==="tr"?"Yasaklı Ürünler":"Prohibited"}</a>
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
        .legalNote{background:#f1f5f9;border:1px solid var(--line);padding:10px;border-radius:10px}
      `}</style>
    </div>
  );
}
