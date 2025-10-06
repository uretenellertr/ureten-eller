/* /pages/legal/index.jsx */
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

/** 4 dil — Tüm Legal / All Legal */
const T = {
  tr: {
    brand:"Üreten Eller",
    title:"Tüm Legal Dokümanlar",
    searchPH:"Belge ara… (örn: gizlilik, iade, kvkk)",
    groups:[
      {
        name:"Sözleşmeler & Politikalar",
        items:[
          {href:"/legal/kullanim-sartlari",label:"Kullanım Şartları"},
          {href:"/legal/gizlilik",label:"Gizlilik Politikası"},
          {href:"/legal/cerez-politikasi",label:"Çerez Politikası"},
          {href:"/legal/kvkk-aydinlatma",label:"KVKK Aydınlatma"},
          {href:"/legal/mesafeli-satis-sozlesmesi",label:"Mesafeli Satış Sözleşmesi"},
          {href:"/legal/teslimat-iade",label:"Teslimat & İade"},
          {href:"/legal/topluluk-kurallari",label:"Topluluk Kuralları"},
          {href:"/legal/yasakli-urunler",label:"Yasaklı Ürünler"},
        ]
      },
      {
        name:"Kurumsal",
        items:[
          {href:"/legal/kurumsal",label:"Kurumsal"},
          {href:"/legal/hakkimizda",label:"Hakkımızda"},
          {href:"/legal/iletisim",label:"İletişim"},
        ]
      }
    ],
    updated:"Güncellenme",
    back:"Ana sayfa",
    none:"Sonuç bulunamadı.",
  },

  en: {
    brand:"Ureten Eller",
    title:"All Legal Documents",
    searchPH:"Search… (e.g. privacy, returns, kvkk)",
    groups:[
      {
        name:"Agreements & Policies",
        items:[
          {href:"/legal/kullanim-sartlari",label:"Terms of Use"},
          {href:"/legal/gizlilik",label:"Privacy Policy"},
          {href:"/legal/cerez-politikasi",label:"Cookie Policy"},
          {href:"/legal/kvkk-aydinlatma",label:"KVKK Notice"},
          {href:"/legal/mesafeli-satis-sozlesmesi",label:"Distance Sales"},
          {href:"/legal/teslimat-iade",label:"Shipping & Returns"},
          {href:"/legal/topluluk-kurallari",label:"Community Rules"},
          {href:"/legal/yasakli-urunler",label:"Prohibited Products"},
        ]
      },
      {
        name:"Corporate",
        items:[
          {href:"/legal/kurumsal",label:"Corporate"},
          {href:"/legal/hakkimizda",label:"About Us"},
          {href:"/legal/iletisim",label:"Contact"},
        ]
      }
    ],
    updated:"Updated",
    back:"Home",
    none:"No results.",
  },

  ar: {
    brand:"أُنتِج بالأيادي",
    title:"جميع الوثائق القانونية",
    searchPH:"ابحث… (مثال: الخصوصية، الإرجاع، KVKK)",
    groups:[
      {
        name:"الاتفاقيات والسياسات",
        items:[
          {href:"/legal/kullanim-sartlari",label:"شروط الاستخدام"},
          {href:"/legal/gizlilik",label:"سياسة الخصوصية"},
          {href:"/legal/cerez-politikasi",label:"سياسة الكوكيز"},
          {href:"/legal/kvkk-aydinlatma",label:"إشعار KVKK"},
          {href:"/legal/mesafeli-satis-sozlesmesi",label:"البيع عن بُعد"},
          {href:"/legal/teslimat-iade",label:"التسليم والإرجاع"},
          {href:"/legal/topluluk-kurallari",label:"قواعد المجتمع"},
          {href:"/legal/yasakli-urunler",label:"المنتجات المحظورة"},
        ]
      },
      {
        name:"المعلومات المؤسسية",
        items:[
          {href:"/legal/kurumsal",label:"المؤسسة"},
          {href:"/legal/hakkimizda",label:"من نحن"},
          {href:"/legal/iletisim",label:"اتصال"},
        ]
      }
    ],
    updated:"محدّث",
    back:"الصفحة الرئيسية",
    none:"لا توجد نتائج.",
  },

  de: {
    brand:"Ureten Eller",
    title:"Alle Rechtstexte",
    searchPH:"Suchen… (z. B. Datenschutz, Rückgabe)",
    groups:[
      {
        name:"Verträge & Richtlinien",
        items:[
          {href:"/legal/kullanim-sartlari",label:"Nutzungsbedingungen"},
          {href:"/legal/gizlilik",label:"Datenschutzerklärung"},
          {href:"/legal/cerez-politikasi",label:"Cookie-Richtlinie"},
          {href:"/legal/kvkk-aydinlatma",label:"KVKK-Hinweis"},
          {href:"/legal/mesafeli-satis-sozlesmesi",label:"Fernabsatzvertrag"},
          {href:"/legal/teslimat-iade",label:"Lieferung & Rückgabe"},
          {href:"/legal/topluluk-kurallari",label:"Community-Regeln"},
          {href:"/legal/yasakli-urunler",label:"Verbotene Artikel"},
        ]
      },
      {
        name:"Unternehmen",
        items:[
          {href:"/legal/kurumsal",label:"Unternehmen"},
          {href:"/legal/hakkimizda",label:"Über uns"},
          {href:"/legal/iletisim",label:"Kontakt"},
        ]
      }
    ],
    updated:"Aktualisiert",
    back:"Startseite",
    none:"Keine Ergebnisse.",
  },
};

export const metadata = { title: "Tüm Legal • Üreten Eller" };

export default function LegalIndex(){
  const lang=useLang();
  const t=useMemo(()=>T[lang]||T.tr,[lang]);
  const dir=lang==="ar"?"rtl":"ltr";
  const [q,setQ]=useState("");

  const list = useMemo(()=>{
    const all = t.groups.flatMap(g=>g.items.map(x=>({group:g.name,...x})));
    if(!q.trim()) return all;
    const s=q.toLowerCase();
    return all.filter(x=> (x.label.toLowerCase().includes(s) || x.href.toLowerCase().includes(s)));
  },[q,t]);

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
        <section className="head">
          <h1>{t.title}</h1>
          <input
            aria-label={t.searchPH}
            placeholder={t.searchPH}
            value={q}
            onChange={(e)=>setQ(e.target.value)}
            className="search"
          />
        </section>

        <section className="grid">
          {t.groups.map((g,gi)=>(
            <article key={gi} className="card">
              <h3>{g.name}</h3>
              <ul className="links">
                {g.items.map((it,ii)=>(
                  <li key={ii}><a href={it.href}>{it.label}</a></li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="results">
          {q.trim() && (
            <>
              <h2>{q}</h2>
              {list.length===0 ? (
                <p className="muted">{t.none}</p>
              ) : (
                <ul className="links">
                  {list.map((it,i)=><li key={i}><a href={it.href}>{it.label}</a> <span className="muted">· {it.group}</span></li>)}
                </ul>
              )}
            </>
          )}
        </section>
      </main>

      <style jsx>{`
        :root{--ink:#0f172a;--muted:#475569;--bg:#f8fafc;--paper:#fff;--line:#e5e7eb;--brand:#111827;--focus:#0ea5e9}
        *{box-sizing:border-box}body{margin:0} .page{background:var(--bg);min-height:100vh;color:var(--ink)}
        .wrap{max-width:1100px;margin:0 auto;padding:0 16px}
        .topbar{position:sticky;top:0;z-index:20;background:#fff;border-bottom:1px solid var(--line)}
        .topbar .wrap{height:56px;display:flex;align-items:center;justify-content:space-between}
        .brand{font-weight:800;text-decoration:none;color:var(--brand)}
        .nav{display:flex;gap:10px;align-items:center}
        .btn{display:inline-block;padding:8px 12px;border-radius:10px;border:1px solid var(--line);text-decoration:none;color:var(--brand)}
        .btn:hover{border-color:var(--focus)}
        .head{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin:18px 0}
        .search{flex:1;min-width:260px;padding:10px 12px;border-radius:12px;border:1px solid var(--line);outline:none}
        .search:focus{border-color:var(--focus);box-shadow:0 0 0 3px rgba(14,165,233,.2)}
        .grid{display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));margin:8px 0 18px}
        .card{background:var(--paper);border:1px solid var(--line);border-radius:14px;padding:16px}
        .card h3{margin:0 0 8px}
        .links{list-style:none;padding:0;margin:0;display:grid;gap:8px}
        .links a{text-decoration:none;color:#0ea5e9}
        .links a:hover{text-decoration:underline}
        .muted{color:var(--muted)}
      `}</style>
    </div>
  );
}
