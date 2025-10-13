"use client";
import React, { useEffect, useMemo, useState } from "react";

/* ======================== Firebase ======================== */
import { initializeApp, getApps } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore, doc, getDoc, setDoc, addDoc, collection, serverTimestamp, updateDoc,
} from "firebase/firestore";
import {
  getStorage, ref as sRef, uploadBytes, getDownloadURL,
} from "firebase/storage";

/* ---- Firebase init (self-contained, uses your project keys) ---- */
const firebaseConfig = {
  apiKey: "AIzaSyCd9GjP6CDA8i4XByhXDHyESy-g_DHVwvQ",
  authDomain: "ureteneller-ecaac.firebaseapp.com",
  projectId: "ureteneller-ecaac",
  storageBucket: "ureteneller-ecaac.firebasestorage.app",
  messagingSenderId: "368042877151",
  appId: "1:368042877151:web:ee0879fc4717928079c96a",
  measurementId: "G-BJHKN8V4RQ",
};
if (!getApps().length) initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

/* ======================== i18n (TR/EN/AR/DE) ======================== */
const SUPPORTED = ["tr", "en", "ar", "de"];
const LOCALE_LABEL = { tr: "Türkçe", en: "English", ar: "العربية", de: "Deutsch" };

const STR = {
  tr: {
    brand: "Üreten Eller",
    profile: "Profil",
    logout: "Çıkış",
    search: "İlan Ara",
    postAd: "İlan Ver",
    premiumCta: "Premium Ol (₺1.999/yıl)",
    showcaseCta: "İlanı Vitrine Al",
    heroTitle: "Üreten Ellere Hoş Geldiniz",
    mottos: [
      { text: "Kadın emeği değer bulsun.", color: "#c026d3" },
      { text: "El emeği ürünler adil fiyata.", color: "#7c3aed" },
      { text: "Güvenli ödeme, kolay iade.", color: "#65a30d" },
      { text: "Yerelden al, ekonomiye can ver.", color: "#ca8a04" },
      { text: "Usta ellerden taze üretim.", color: "#0ea5e9" },
    ],
    showcase: "Vitrin",
    standard: "Standart İlanlar",
    categories: "Kategorilerimiz",
    empty: "Henüz ilan yok.",
    tabs: { home: "Ana Sayfa", messages: "Mesajlar", notifs: "Bildirimler" },
    chat: { title: "Canlı Destek", helloYou: "Merhaba! Nasıl yardımcı olabilirim?", helloMe: "Merhaba 👋", placeholder: "Mesaj yazın...", send: "Gönder" },
    legal: {
      corporate: "Kurumsal", about: "Hakkımızda", contact: "İletişim", privacy: "Gizlilik", kvkk: "KVKK Aydınlatma",
      terms: "Kullanım Şartları", distance: "Mesafeli Satış", delivery: "Teslimat & İade", cookie: "Çerez Politikası",
      community: "Topluluk Kuralları", prohibited: "Yasaklı Ürünler", all: "Tüm Legal",
    },
  },
  en: {
    brand: "Üreten Eller",
    profile: "Profile",
    logout: "Logout",
    search: "Search Listings",
    postAd: "Post Listing",
    premiumCta: "Go Premium (₺1,999/yr)",
    showcaseCta: "Showcase This Listing",
    heroTitle: "Welcome to Üreten Eller",
    mottos: [
      { text: "Let women's labor be valued.", color: "#c026d3" },
      { text: "Handmade at fair prices.", color: "#7c3aed" },
      { text: "Secure payment, easy returns.", color: "#65a30d" },
      { text: "Buy local, boost the economy.", color: "#ca8a04" },
      { text: "Fresh production from skilled hands.", color: "#0ea5e9" },
    ],
    showcase: "Showcase",
    standard: "Standard Listings",
    categories: "Our Categories",
    empty: "No listings yet.",
    tabs: { home: "Home", messages: "Messages", notifs: "Notifications" },
    chat: { title: "Live Support", helloYou: "Hello! How can I help?", helloMe: "Hello 👋", placeholder: "Type a message...", send: "Send" },
    legal: {
      corporate: "Corporate", about: "About", contact: "Contact", privacy: "Privacy", kvkk: "PDPL (KVKK) Notice",
      terms: "Terms of Use", distance: "Distance Sales", delivery: "Delivery & Returns", cookie: "Cookie Policy",
      community: "Community Guidelines", prohibited: "Prohibited Items", all: "All Legal",
    },
  },
  ar: {
    brand: "Üreten Eller",
    profile: "الملف الشخصي",
    logout: "تسجيل الخروج",
    search: "البحث في الإعلانات",
    postAd: "أضف إعلانًا",
    premiumCta: "العضوية المميزة (₺1,999/سنة)",
    showcaseCta: "وضع الإعلان في الواجهة",
    heroTitle: "مرحبًا بكم في Üreten Eller",
    mottos: [
      { text: "ليُقَدَّر عمل المرأة.", color: "#c026d3" },
      { text: "منتجات يدوية بأسعار عادلة.", color: "#7c3aed" },
      { text: "دفع آمن وإرجاع سهل.", color: "#65a30d" },
      { text: "اشترِ المحليّ وانعش الاقتصاد.", color: "#ca8a04" },
      { text: "إنتاج طازج بأيدي خبيرة.", color: "#0ea5e9" },
    ],
    showcase: "الواجهة المميزة",
    standard: "إعلانات عادية",
    categories: "فئاتنا",
    empty: "لا يوجد إعلانات بعد.",
    tabs: { home: "الرئيسية", messages: "الرسائل", notifs: "الإشعارات" },
    chat: { title: "الدعم المباشر", helloYou: "مرحبًا! كيف أستطيع المساعدة؟", helloMe: "مرحبًا 👋", placeholder: "اكتب رسالة...", send: "إرسال" },
    legal: {
      corporate: "الشركة", about: "من نحن", contact: "اتصال", privacy: "الخصوصية", kvkk: "إشعار KVKK",
      terms: "شروط الاستخدام", distance: "البيع عن بُعد", delivery: "التسليم والإرجاع", cookie: "سياسة ملفات تعريف الارتباط",
      community: "إرشادات المجتمع", prohibited: "السلع المحظورة", all: "جميع الصفحات القانونية",
    },
  },
  de: {
    brand: "Üreten Eller",
    profile: "Profil",
    logout: "Abmelden",
    search: "Anzeigen suchen",
    postAd: "Anzeige aufgeben",
    premiumCta: "Premium werden (₺1.999/Jahr)",
    showcaseCta: "Anzeige hervorheben",
    heroTitle: "Willkommen bei Üreten Eller",
    mottos: [
      { text: "Frauenarbeit soll wertgeschätzt werden.", color: "#c026d3" },
      { text: "Handgemachtes zu fairen Preisen.", color: "#7c3aed" },
      { text: "Sichere Zahlung, einfache Rückgabe.", color: "#65a30d" },
      { text: "Kauf lokal, stärke die Wirtschaft.", color: "#ca8a04" },
      { text: "Frische Produktion aus Meisterhand.", color: "#0ea5e9" },
    ],
    showcase: "Schaufenster",
    standard: "Standardanzeigen",
    categories: "Kategorien",
    empty: "Noch keine Anzeigen.",
    tabs: { home: "Startseite", messages: "Nachrichten", notifs: "Benachrichtigungen" },
    chat: { title: "Live-Support", helloYou: "Hallo! Wie kann ich helfen?", helloMe: "Hallo 👋", placeholder: "Nachricht schreiben...", send: "Senden" },
    legal: {
      corporate: "Unternehmen", about: "Über uns", contact: "Kontakt", privacy: "Datenschutz", kvkk: "KVKK-Hinweis",
      terms: "Nutzungsbedingungen", distance: "Fernabsatz", delivery: "Lieferung & Rückgabe", cookie: "Cookie-Richtlinie",
      community: "Community-Richtlinien", prohibited: "Verbotene Artikel", all: "Alle Rechtstexte",
    },
  },
};

/* ======================== Pricing & IBAN ======================== */
const PRICING = {
  premiumYear: 1999,            // ₺
  showcasePremium: 100,         // ₺ / 30 gün
  showcaseStandard: 199,        // ₺ / 30 gün
  showcaseDays: 30,
};
const BANK = {
  iban: "TR590082900009491868461105",
  papara: "", // varsa Papara ticari IBAN/numara
};

/* ======================== Payment Modal ======================== */
function PaymentModal({
  open, onClose, mode, user, userDoc, defaultListingNo,
}) {
  const [method, setMethod] = useState("eft");
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [listingNo, setListingNo] = useState(defaultListingNo || "");
  const [note, setNote] = useState("");

  const isPremiumActive = userDoc?.premium?.status === "active";
  const hasFreeSlot = !!userDoc?.premium?.status === "active" && userDoc?.premium?.freeShowcaseUsed !== true;

  const amount = useMemo(() => {
    if (mode === "premium") return PRICING.premiumYear;
    // showcase:
    if (isPremiumActive && hasFreeSlot) return 0;
    if (isPremiumActive && !hasFreeSlot) return PRICING.showcasePremium;
    return PRICING.showcaseStandard;
  }, [mode, isPremiumActive, hasFreeSlot]);

  useEffect(() => {
    const uname = (userDoc?.profile?.displayName || user?.email || "").split("@")[0];
    if (mode === "premium") {
      setNote(`URETENELLER PRO + ${uname}`);
    } else {
      const ln = listingNo || "3838-000001";
      setNote(`URETENELLER VITRIN + ${uname} + ${ln}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, user?.uid, user?.email, userDoc?.profile?.displayName, listingNo]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { alert("Lütfen giriş yapın."); return; }
    if (!file) { alert("Dekont yüklemek zorunludur."); return; }
    if (!note || (mode === "showcase" && !listingNo)) {
      alert("Not/Açıklama ve (showcase için) İlan No zorunludur.");
      return;
    }
    try {
      setSubmitting(true);
      // upload receipt
      const ts = Date.now();
      const path = `receipts/${user.uid}/${mode}-${ts}-${file.name.replace(/\s+/g, "_")}`;
      const ref = sRef(storage, path);
      await uploadBytes(ref, file);
      const receiptUrl = await getDownloadURL(ref);

      // payment doc
      const pay = {
        userId: user.uid,
        type: mode,                           // "premium" | "showcase"
        amount,
        method,                               // "eft" | "papara"
        note,                                 // contains username (+ listingNo)
        receiptUrl,
        status: "pending",
        targetListingNo: mode === "showcase" ? listingNo : null,
        createdAt: serverTimestamp(),
      };
      const paymentsRef = collection(db, "payments");
      await addDoc(paymentsRef, pay);

      alert("Dekont gönderildi. Admin onayı sonrası bilgilendirileceksiniz.");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Gönderim sırasında hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modalMask" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modalHd">
          <div className="ttl">{mode === "premium" ? "Premium Üyelik Ödemesi" : "İlanı Vitrine Alma Ödemesi"}</div>
          <button className="x" onClick={onClose} aria-label="Kapat">✕</button>
        </div>

        <div className="modalBd">
          <div className="box">
            <div className="row">
              <div>
                <div className="lbl">Tutar</div>
                <div className="val">{amount === 0 ? "ÜCRETSİZ (Premium ücretsiz slot)" : `₺${amount}`}</div>
              </div>
              <div>
                <div className="lbl">Süre</div>
                <div className="val">{mode === "premium" ? "1 Yıl" : `${PRICING.showcaseDays} Gün`}</div>
              </div>
            </div>

            <div className="sep"/>

            <div className="payInfo">
              <div className="lbl">IBAN</div>
              <div className="iban">{BANK.iban}</div>
              {BANK.papara ? (<>
                <div className="lbl">Papara (ticari)</div>
                <div className="iban">{BANK.papara}</div>
              </>) : null}
              <div className="hint">Açıklama alanına aşağıdaki formatı yazmayı unutmayın.</div>
            </div>

            <form onSubmit={handleSubmit} className="form">
              {mode === "showcase" && (
                <label className="field">
                  <span>İlan No (3838-xxxxxx)</span>
                  <input
                    required
                    value={listingNo}
                    onChange={(e) => setListingNo(e.target.value.trim())}
                    placeholder="3838-000001"
                  />
                </label>
              )}

              <label className="field">
                <span>Açıklama (not)</span>
                <input required value={note} onChange={(e) => setNote(e.target.value)} />
                <small>
                  Premium: <code>URETENELLER PRO + kullanıcı_adı</code> • Vitrin: <code>URETENELLER VITRIN + kullanıcı_adı + ilan_no</code>
                </small>
              </label>

              <label className="field">
                <span>Ödeme Yöntemi</span>
                <select value={method} onChange={(e) => setMethod(e.target.value)}>
                  <option value="eft">EFT/Havale</option>
                  <option value="papara">Papara</option>
                </select>
              </label>

              <label className="field">
                <span>Dekont (PDF/JPG/PNG)</span>
                <input required type="file" accept=".pdf,image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </label>

              <button disabled={submitting} className="btnPrimary" type="submit">
                {submitting ? "Gönderiliyor..." : "Dekontu Gönder ve Onaya Sun"}
              </button>
            </form>
          </div>

          <ul className="bullets">
            <li>Onaylanınca: “Onaylı Satıcı” rozeti ve (Premium’da) 1 ücretsiz vitrin hakkı açılır.</li>
            <li>Vitrin süresi bitince ilan yayında kalır, yalnızca vitrin rozeti kalkar.</li>
          </ul>
        </div>
      </div>

      <style>{`
        .modalMask{position:fixed;inset:0;background:rgba(0,0,0,.45);display:grid;place-items:center;z-index:70}
        .modal{width:min(680px,92vw);background:#fff;border-radius:16px;box-shadow:0 24px 60px rgba(0,0,0,.25);overflow:hidden}
        .modalHd{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-bottom:1px solid #eee;background:#111827;color:#fff}
        .ttl{font-weight:900}
        .x{border:none;background:transparent;color:#fff;font-size:20px;cursor:pointer}
        .modalBd{padding:12px}
        .box{border:1px solid #e5e7eb;border-radius:14px;padding:12px;background:#fafafa}
        .row{display:flex;gap:12px;flex-wrap:wrap}
        .lbl{font-size:12px;color:#475569}
        .val{font-weight:900}
        .sep{height:1px;background:#e5e7eb;margin:12px 0}
        .payInfo .iban{font-family:ui-monospace, SFMono-Regular, Menlo, monospace; padding:6px 8px; background:#fff;border:1px dashed #cbd5e1;border-radius:8px;margin:4px 0;display:inline-block}
        .hint{font-size:12px;color:#64748b;margin-top:6px}
        .form{display:grid;gap:10px;margin-top:10px}
        .field{display:grid;gap:6px}
        .field input,.field select{border:1px solid #e5e7eb;border-radius:10px;padding:8px;background:#fff}
        .btnPrimary{border:1px solid #111827;background:#111827;color:#fff;border-radius:10px;padding:10px 12px;font-weight:900;cursor:pointer}
        .bullets{margin:12px 4px 0 20px;color:#475569}
        code{background:#eef2ff;padding:2px 4px;border-radius:6px}
      `}</style>
    </div>
  );
}

/* ======================== Page ======================== */
export default function SellerHome() {
  const [lang, setLang] = useState("tr");
  const t = useMemo(() => STR[lang], [lang]);
  const [user, setUser] = useState(null);
  const [userDoc, setUserDoc] = useState(null);

  // rotating motto
  const [motIdx, setMotIdx] = useState(0);
  useEffect(() => setMotIdx(0), [lang]);
  useEffect(() => {
    const id = setInterval(() => setMotIdx(i => (i + 1) % t.mottos.length), 5000);
    return () => clearInterval(id);
  }, [t]);

  // auth + user doc
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u || null);
      if (u) {
        const uref = doc(db, "users", u.uid);
        const snap = await getDoc(uref);
        if (snap.exists()) setUserDoc(snap.data());
        else {
          // minimal profile bootstrap
          const base = {
            role: "standard",
            premium: { status: "none" },
            badges: { verifiedSeller: false },
            profile: { displayName: u.email?.split("@")[0] || "", phone: "", address: "", avatarUrl: "" },
            createdAt: serverTimestamp(),
          };
          await setDoc(uref, base, { merge: true });
          setUserDoc(base);
        }
      } else {
        setUserDoc(null);
      }
    });
    return () => unsub();
  }, []);

  const [openPay, setOpenPay] = useState(false);
  const [payMode, setPayMode] = useState("premium"); // "premium" | "showcase"
  const [currentListingNo, setCurrentListingNo] = useState(""); // showcase için kullanıcı girer

  const currentMotto = t.mottos[motIdx];

  return (
    <div lang={lang} dir={lang === "ar" ? "rtl" : "ltr"}>
      <header className="topbar">
        <a className="brand" href="/">
          <img src="/logo.png" width={36} height={36} alt="logo" />
          <span>{t.brand}</span>
        </a>
        <div className="actions">
          <div className="userGroup">
            <a className="ghost" href="/portal/seller/profile/" aria-label={t.profile}>{t.profile}</a>
            <a className="danger" href="/login" aria-label={t.logout}>{t.logout}</a>
          </div>
          <div className="actionGroup">
            <a className="ghost" href="/portal/seller?tab=search" aria-label={t.search}>{t.search}</a>
            <a className="primary" href="/portal/seller/post/" aria-label={t.postAd}>{t.postAd}</a>
          </div>
          <select aria-label="Language" value={lang} onChange={(e) => setLang(e.target.value)}>
            {SUPPORTED.map(k => (<option key={k} value={k}>{LOCALE_LABEL[k]}</option>))}
          </select>
        </div>
      </header>

      <section className="hero">
        <h1 className="heroTitle">{t.heroTitle}</h1>
        <div className="mottoWrap" aria-live="polite" role="status">
          <div key={`${lang}-${motIdx}`} className="mottoLine" style={{ color: currentMotto.color }}>
            {currentMotto.text}
          </div>
        </div>

        <div className="ctaRow">
          <button
            className="btnPrimary"
            onClick={() => { setPayMode("premium"); setOpenPay(true); }}
          >
            {t.premiumCta}
          </button>
          <button
            className="btnGhost"
            onClick={() => { setPayMode("showcase"); setCurrentListingNo(""); setOpenPay(true); }}
          >
            {t.showcaseCta}
          </button>
        </div>
      </section>

      <section className="section">
        <div className="sectionHead"><h2>✨ {t.showcase}</h2></div>
        <div className="grid ads"><div className="empty">{t.empty}</div></div>
      </section>

      <section className="section">
        <div className="sectionHead"><h2>🧺 {t.standard}</h2></div>
        <div className="grid ads"><div className="empty">{t.empty}</div></div>
      </section>

      <nav className="bottombar" aria-label="Bottom Navigation">
        <a className="tab active" href="/portal/seller" aria-label={t.tabs.home}><span className="tIc">🏠</span><span>{t.tabs.home}</span></a>
        <a className="tab" href="/portal/seller?tab=messages" aria-label={t.tabs.messages}><span className="tIc">💬</span><span>{t.tabs.messages}</span></a>
        <a className="tab" href="/portal/seller?tab=notifications" aria-label={t.tabs.notifs}><span className="tIc">🔔</span><span>{t.tabs.notifs}</span></a>
      </nav>

      {/* Payment Modal */}
      <PaymentModal
        open={openPay}
        onClose={() => setOpenPay(false)}
        mode={payMode}
        user={user}
        userDoc={userDoc}
        defaultListingNo={currentListingNo}
      />

      <style>{`
        :root{ --ink:#0f172a; --muted:#475569; --line:rgba(0,0,0,.08); }
        html,body{height:100%}
        body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial,sans-serif;color:var(--ink);
          background: radial-gradient(1200px 600px at 10% -10%, #ffe4e6, transparent),
                      radial-gradient(900px 500px at 90% -10%, #e0e7ff, transparent),
                      linear-gradient(120deg,#ff80ab,#a78bfa,#60a5fa,#34d399);
          background-attachment:fixed;}

        .topbar{position:sticky;top:0;z-index:50;display:grid;grid-template-columns:1fr auto;gap:12px;align-items:center;
          padding:10px 14px;background:rgba(255,255,255,.92);backdrop-filter:blur(8px);border-bottom:1px solid var(--line)}
        .brand{display:flex;align-items:center;gap:8px;font-weight:900;text-decoration:none;color:inherit}
        .actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center;justify-content:flex-end}
        .userGroup{display:flex;gap:8px;order:1}
        .actionGroup{display:flex;gap:8px;order:2}
        .ghost,.primary,.danger{border:1px solid #111827;background:#fff;border-radius:10px;padding:8px 12px;font-weight:700;cursor:pointer;text-decoration:none;display:inline-block}
        .primary,.danger{background:#111827;color:#fff}
        .actions select{border:1px solid var(--line);border-radius:10px;padding:6px 8px;background:#fff}
        @media (min-width:640px){ .actionGroup{order:1} .actions{flex-wrap:nowrap} }

        .hero{display:grid;place-items:center;text-align:center;gap:10px;max-width:1100px;margin:12px auto 0;padding:12px 16px}
        .heroTitle{margin:0;font-size:42px;line-height:1.15;letter-spacing:.2px;text-shadow:0 8px 28px rgba(0,0,0,.15)}
        @media (max-width:520px){ .heroTitle{font-size:34px} }
        .mottoWrap{min-height:28px;margin-top:6px}
        .mottoLine{margin:0;font-weight:700;animation:fadeIn .35s ease}
        @keyframes fadeIn{from{opacity:0; transform: translateY(4px)} to{opacity:1; transform:none}}
        .ctaRow{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:10px}
        .btnPrimary,.btnGhost{border:1px solid #111827;border-radius:12px;padding:10px 14px;font-weight:900;cursor:pointer}
        .btnPrimary{background:#111827;color:#fff}
        .btnGhost{background:#fff}

        .section{max-width:1100px;margin:12px auto;padding:0 16px}
        .sectionHead{display:flex;align-items:center;justify-content:space-between;margin:8px 0}
        .grid.ads{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}
        .empty{padding:18px;border:1px dashed #e5e7eb;border-radius:14px;text-align:center;color:#475569}

        .bottombar{position:sticky;bottom:0;z-index:40;display:grid;grid-template-columns:repeat(3,1fr);gap:6px;padding:6px;
          background:rgba(255,255,255,.94);backdrop-filter:blur(8px);border-top:1px solid var(--line)}
        .tab{display:flex;flex-direction:column;align-items:center;gap:2px;padding:8px;border-radius:10px;border:1px solid transparent;background:transparent;cursor:pointer;font-weight:700;text-decoration:none;color:inherit}
        .tab.active{border-color:#111827;background:#111827;color:#fff}
        .tIc{font-size:16px}
      `}</style>
    </div>
  );
}

/* ======================== NOT: İlan numarası şablonu ========================
   Yeni ilan oluştururken (pages/portal/seller/post.jsx) için öneri:
   - listingNo formatı: "3838-" + 6 haneli sayı (ör: 3838-000001)
   - payment modalı vitrin seçeneğinde bu "listingNo" alanını kullanıcıdan alıyoruz.
   - İstersen post.jsx dosyasına atomik sayaç örneğini ayrıca eklerim.
======================================================================== */
