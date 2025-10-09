/* /pages/legal/yasakli-urunler.jsx */
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

/** 4 dil — Yasaklı Ürünler / Prohibited Products */
const T = {
  tr: {
    brand: "Üreten Eller",
    title: "Yasaklı Ürünler Listesi",
    effective: "Yürürlük",
    intro:
      "Bu sayfa, Üreten Eller’de kesinlikle ilanı verilemeyen veya kısıtlı olarak kabul edilen ürün/hizmetleri açıklar. Aşağıdaki ihlaller ilan kaldırma, hesap kısıtlama ve yasal bildirim süreçlerine yol açar.",
    banTitle: "1) Kesinlikle Yasaklı",
    banList: [
      "Yasadışı, taklit/kaçak ürünler; çalıntı mallar.",
      "Alkol, tütün ve elektronik sigara ürünleri.",
      "Cinsel içerikli ürünler, yetişkin hizmetleri.",
      "Canlı hayvan, yasaklı/nesli tehlike altındaki türler.",
      "Uyuşturucu, psikotrop, uçucu, zararlı kimyasallar.",
      "Reçeteye tabi ilaç/medikal ürünler ve tıbbi cihazlar (izin gerektirenler).",
      "Silah, mühimmat, patlayıcı, bıçak vb. saldırı aletleri.",
      "Kumar/çekiliş/kredisiz finans vaatleri.",
      "Nefret söylemi/şiddet/ayrımcılık içeren materyaller.",
    ],
    limitedTitle: "2) Kısıtlı/Kural Gerektiren",
    limitedList: [
      "Gıda: Son tüketim tarihi, içerik/alerjen, üretim koşulları, saklama talimatı belirtilmeli; hijyen şartlarına uymayan ürünler yasak.",
      "Kozmetik/sabun: İçerik listesi, uyarılar; mevzuata aykırı tedavi beyanları yasak.",
      "Çocuk ürünleri/oyuncak: Yaş uyarısı, malzeme güvenliği; yanıcı/boğulma riskli ürünlere dikkat.",
      "El yapımı elektrikli ürünler: Yetkili sertifikasyon yoksa yasak.",
      "Diyet/sağlık iddiaları: Klinik/tedavi vaatleri yasak.",
    ],
    ipTitle: "3) Fikri Hak İhlalleri",
    ipText:
      "Marka, telif, tasarım, patent ihlali içeren ürünler veya izinsiz logo/fotoğraf kullanımı yasaktır.",
    reportTitle: "4) Bildirim ve Yaptırım",
    reportList: [
      "İhlal şüphesinde ilan derhal yayından kaldırılabilir.",
      "Tekrarlayan ihlallerde hesap kalıcı olarak kapatılabilir.",
      "Gerekirse resmi makamlara bildirim yapılır.",
    ],
    contactTitle: "5) İletişim",
    contact:
      "Sorular ve bildirimler için: uretenellertr@gmail.com | 0507279143",
    quick: "Hızlı Geçiş",
    back: "Ana sayfa",
  },

  en: {
    brand: "Ureten Eller",
    title: "Prohibited Products",
    effective: "Effective",
    intro:
      "This page lists items/services strictly forbidden or restricted on Ureten Eller. Violations may result in removal, account restrictions and legal notices.",
    banTitle: "1) Strictly Prohibited",
    banList: [
      "Illegal, counterfeit, stolen goods.",
      "Alcohol, tobacco and vaping products.",
      "Adult/explicit products and services.",
      "Live animals or endangered species.",
      "Drugs, psychoactive substances, hazardous chemicals.",
      "Prescription-only medicines/medical devices (without authorization).",
      "Weapons, ammo, explosives, assault knives, etc.",
      "Gambling/lottery/financing schemes.",
      "Hate/violence/discrimination materials.",
    ],
    limitedTitle: "2) Restricted/Conditional",
    limitedList: [
      "Food: expiry date, ingredients/allergens, storage; non-compliant hygiene is forbidden.",
      "Cosmetics/soaps: full INCI/ingredients, warnings; medical cure claims are forbidden.",
      "Child products/toys: age labels, safety; avoid flammable/choking hazards.",
      "DIY electricals: not allowed without certification.",
      "Health/diet claims: no clinical/treatment promises.",
    ],
    ipTitle: "3) IP Infringements",
    ipText:
      "No trademark/copyright/design/patent violations or unauthorized logos/photos.",
    reportTitle: "4) Reporting & Enforcement",
    reportList: [
      "Listings may be taken down immediately upon suspicion.",
      "Repeat offenses may lead to permanent ban.",
      "Authorities may be notified if required.",
    ],
    contactTitle: "5) Contact",
    contact:
      "Reports: uretenellertr@gmail.com | +90 507 279 14 3",
    quick: "Quick Links",
    back: "Home",
  },

  ar: {
    brand: "أُنتِج بالأيادي",
    title: "المنتجات المحظورة",
    effective: "سريان",
    intro:
      "تسرد هذه الصفحة العناصر/الخدمات المحظورة أو المقيدة. المخالفات قد تؤدي لحذف الإعلان وتقييد الحساب وإشعار الجهات المختصة.",
    banTitle: "1) محظورات قطعية",
    banList: [
      "سلع غير قانونية/مقلّدة/مسروقة.",
      "الكحول والتبغ والسجائر الإلكترونية.",
      "منتجات وخدمات ذات محتوى جنسي.",
      "حيوانات حية/أنواع مهددة.",
      "مخدرات ومواد خطرة.",
      "أدوية بوصفة/أجهزة طبية دون ترخيص.",
      "أسلحة وذخائر ومتفجرات وسكاكين هجومية.",
      "قمار/يانصيب/مخططات تمويلية.",
      "مواد كراهية/عنف/تمييز.",
    ],
    limitedTitle: "2) مقيدة/بشروط",
    limitedList: [
      "الأغذية: تاريخ الصلاحية والمكونات والحفظ؛ مخالفة الصحة ممنوعة.",
      "مستحضرات التجميل/الصابون: مكونات وتحذيرات؛ منع ادعاءات علاجية.",
      "منتجات الأطفال/الألعاب: العمر والسلامة؛ مخاطر الاشتعال/الاختناق.",
      "أجهزة كهربائية منزلية الصنع دون اعتماد: ممنوعة.",
      "ادعاءات صحية/حمية علاجية: ممنوعة.",
    ],
    ipTitle: "3) حقوق الملكية الفكرية",
    ipText:
      "ممنوع انتهاك العلامات/الحقوق/التصميم/البراءات أو استخدام شعارات/صور دون إذن.",
    reportTitle: "4) الإبلاغ والتنفيذ",
    reportList: [
      "يمكن إزالة الإعلان فور الاشتباه بالمخالفة.",
      "التكرار قد يؤدي للحظر النهائي.",
      "قد نُخطر الجهات المختصة عند اللزوم.",
    ],
    contactTitle: "5) التواصل",
    contact:
      "للإبلاغ: uretenellertr@gmail.com | 0507279143",
    quick: "روابط سريعة",
    back: "الصفحة الرئيسية",
  },

  de: {
    brand: "Ureten Eller",
    title: "Verbotene Artikel",
    effective: "Wirksam ab",
    intro:
      "Diese Seite listet strikt verbotene oder eingeschränkt zulässige Artikel/Dienste. Verstöße führen zur Entfernung, Kontosperren und ggf. Meldungen.",
    banTitle: "1) Strikt verboten",
    banList: [
      "Illegale, gefälschte, gestohlene Waren.",
      "Alkohol, Tabak und E-Zigaretten.",
      "Erwachsenen-/explizite Produkte/Dienste.",
      "Lebende Tiere, bedrohte Arten.",
      "Drogen, gefährliche Chemikalien.",
      "Verschreibungspflichtige Medizin/Medizinprodukte ohne Zulassung.",
      "Waffen, Munition, Explosivstoffe, Angriffs­messer.",
      "Glücksspiel/Lotterien/Finanzierungsmodelle.",
      "Hass/ Gewalt/ Diskriminierungsmaterialien.",
    ],
    limitedTitle: "2) Eingeschränkt/mit Auflagen",
    limitedList: [
      "Lebensmittel: MHD, Zutaten/Allergene, Lagerung; Hygieneverstöße verboten.",
      "Kosmetik/Seife: Inhaltsstoffe, Warnhinweise; Heilversprechen verboten.",
      "Kinderartikel/Spielzeug: Altershinweise, Sicherheit; Brand-/Erstickungsgefahr vermeiden.",
      "Selbstgebaute Elektrogeräte ohne Zertifizierung: verboten.",
      "Gesundheits-/Diätversprechen: keine klinischen Heilzusagen.",
    ],
    ipTitle: "3) Schutzrechte",
    ipText:
      "Keine Marken-/Urheber-/Design-/Patentrechtsverletzungen; keine unbefugten Logos/Fotos.",
    reportTitle: "4) Meldung & Durchsetzung",
    reportList: [
      "Inserate können bei Verdacht sofort entfernt werden.",
      "Wiederholte Verstöße → dauerhafte Sperre.",
      "Meldung an Behörden möglich.",
    ],
    contactTitle: "5) Kontakt",
    contact:
      "Meldungen: uretenellertr@gmail.com | +90 507 279 14 3",
    quick: "Schnellzugriff",
    back: "Startseite",
  },
};

export const metadata = { title: "Yasaklı Ürünler • Üreten Eller" };

export default function BannedProductsPage() {
  const lang = useLang();
  const t = useMemo(() => T[lang] || T.tr, [lang]);
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <div className="page" dir={dir}>
      <header className="topbar">
        <div className="wrap">
          <a className="brand" href="/">{t.brand}</a>
          <nav className="nav">
            <a className="link" href="/legal/topluluk-kurallari">{lang==="tr"?"Topluluk Kuralları":lang==="en"?"Community Rules":lang==="ar"?"قواعد المجتمع":"Community-Regeln"}</a>
            <a className="btn" href="/">{t.back}</a>
          </nav>
        </div>
      </header>

      <main className="wrap">
        <article className="paper">
          <h1>{t.title}</h1>
          <p className="muted">{t.effective}: 06.10.2025 — ureteneller.com</p>
          <p>{t.intro}</p>

          <h2>{t.banTitle}</h2>
          <ul>{t.banList.map((x,i)=><li key={i}>{x}</li>)}</ul>

          <h2>{t.limitedTitle}</h2>
          <ul>{t.limitedList.map((x,i)=><li key={i}>{x}</li>)}</ul>

          <h2>{t.ipTitle}</h2>
          <p>{t.ipText}</p>

          <h2>{t.reportTitle}</h2>
          <ul>{t.reportList.map((x,i)=><li key={i}>{x}</li>)}</ul>

          <h2>{t.contactTitle}</h2>
          <p>{t.contact}</p>

          <hr />
          <p className="quick">
            <strong>{t.quick}: </strong>
            <a href="/legal/kullanim-sartlari">{lang==="tr"?"Kullanım Şartları":lang==="en"?"Terms":lang==="ar"?"الشروط":"Nutzungsbedingungen"}</a>
            {" • "}
            <a href="/legal/gizlilik">{lang==="tr"?"Gizlilik":lang==="en"?"Privacy":lang==="ar"?"الخصوصية":"Datenschutz"}</a>
            {" • "}
            <a href="/legal/cerez-politikasi">{lang==="tr"?"Çerez":lang==="en"?"Cookies":lang==="ar"?"الكوكيز":"Cookies"}</a>
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
      `}</style>
    </div>
  );
}
