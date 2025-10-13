// pages/portal/seller/profile.jsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

/** =========================================================
 * ÜRETEN ELLER – Satıcı Profili (client-only)
 * - 4 dil (tr/en/ar/de)
 * - Firestore: users/{uid}, listings (seller_uid==uid), payments
 * - Storage: avatars/{uid}.jpg , receipts/{uid}/{ts}.jpg
 * - Premium: ₺1999 (1 yıl) — dekont → admin onayı; onay sonrası gold çerçeve + rozet
 * - Vitrin: Premium 1 ücretsiz; ek vitrin Premium=₺100 / Standart=₺199
 * - Şifre: mevcut + yeni(2x) + görünürlük; modal Ayarlar içinde
 * - CORS fix: storageBucket kesinlikle *.appspot.com olmalı (AŞAĞIDA!)
 * ========================================================= */

import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth, onAuthStateChanged,
  updatePassword, EmailAuthProvider, reauthenticateWithCredential,
} from "firebase/auth";
import {
  getFirestore, doc, getDoc, setDoc, updateDoc,
  collection, query, where, getDocs, serverTimestamp, addDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

/** ---------- CONFIG (CORS hatası için doğru bucket!) ---------- */
const firebaseConfig = {
  apiKey: "AIzaSyCd9GjP6CDA8i4XByhXDHyESy-g_DHVwvQ",
  authDomain: "ureteneller-ecaac.firebaseapp.com",
  projectId: "ureteneller-ecaac",
  storageBucket: "ureteneller-ecaac.appspot.com", // <-- DÜZGÜN BU OLMALI
  messagingSenderId: "368042877151",
  appId: "1:368042877151:web:ee0879fc4717928079c96a",
  measurementId: "G-BJHKN8V4RQ",
};
function ensureApp() {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

/** ---------- Sabitler ---------- */
const IBAN = "TR590082900009491868461105";
const ACCOUNT_NAME = "Nejla Karataş";
const PAPARA = "Papara (ticari)";
const PREMIUM_PRICE = 1999; // 1 yıl
const SHOWCASE_PRICE_PREMIUM = 100;
const SHOWCASE_PRICE_STANDARD = 199;

/** ---------- 4 dil metinleri ---------- */
const STR = {
  tr: {
    brand: "Üreten Eller",
    navHome: "Ana Sayfa",
    navPost: "İlan Ver",
    navProfile: "Profil",
    sellerSettings: "Ayarlar",
    tabs: { urunler: "Ürünler", deger: "Değerlendirmeler", hakkinda: "Hakkında", kargo: "Kargo & İade", para: "$$$" },
    msg: "Mesaj Gönder", follow: "Takip Et", share: "Paylaş", report: "Şikayet Et",
    premium: "Premium",
    goPremium: "Premium'a Geç",
    premiumHint: "Premium admin onayıyla verilir.",
    premiumActive: (left) => `Premium aktif. Ücretsiz vitrin hakkı: ${left ? "1" : "0"}`,
    useShowcase: "Vitrin Hakkı Kullan",
    storeInfo: "Mağaza Bilgileri",
    wd: "Hafta içi", we: "Hafta sonu", ship: "Kargo süresi", ret: "İade politikası",
    none: "Henüz ilan yok.",
    view: "Görüntüle", takeShowcase: "Vitrine Al",
    payTitle: "Ödeme Bilgileri", process: "İşlem", price: "Tutar", freeRight: "Ücretsiz hak",
    iban: "IBAN", accName: "Hesap Adı", papara: "Papara",
    payNote: "Havale/EFT sonrası dekontu yükleyin. Açıklamaya kullanıcı adınızı yazın.",
    uploadReceipt: "Dekontu Yükle",
    settingsTitle: "Ayarlar", phone: "Telefon", address: "Adres", avatar: "Avatar",
    save: "Kaydet", saveHint: '"Kaydet"e basmadan yükleme başlamaz.',
    pwdNow: "Mevcut Şifre", pwdNew: "Yeni Şifre", pwdNew2: "Yeni Şifre (tekrar)", updatePwd: "Şifreyi Güncelle",
    show: "Göster", hide: "Gizle",
    mustLogin: "Giriş yapmalısınız.",
    joined: "Katılım", city: "Şehir", showcase: "Vitrin",
    name: "Ad Soyad",
    ok: "Tamam", cancel: "Vazgeç",
    premiumYear: "1 Yıllık Premium",
  },
  en: {
    brand: "Üreten Eller",
    navHome: "Home",
    navPost: "Post Listing",
    navProfile: "Profile",
    sellerSettings: "Settings",
    tabs: { urunler: "Products", deger: "Reviews", hakkinda: "About", kargo: "Shipping & Returns", para: "$$$" },
    msg: "Message", follow: "Follow", share: "Share", report: "Report",
    premium: "Premium",
    goPremium: "Go Premium",
    premiumHint: "Premium is enabled after admin approval.",
    premiumActive: (left) => `Premium active. Free showcase right: ${left ? "1" : "0"}`,
    useShowcase: "Use Showcase Right",
    storeInfo: "Store Info",
    wd: "Weekdays", we: "Weekend", ship: "Shipping time", ret: "Return policy",
    none: "No listings yet.",
    view: "View", takeShowcase: "Feature",
    payTitle: "Payment Details", process: "Process", price: "Amount", freeRight: "Free right",
    iban: "IBAN", accName: "Account Name", papara: "Papara",
    payNote: "After transfer, upload the receipt. Write your username in the note.",
    uploadReceipt: "Upload Receipt",
    settingsTitle: "Settings", phone: "Phone", address: "Address", avatar: "Avatar",
    save: "Save", saveHint: "Upload won't start until you press Save.",
    pwdNow: "Current Password", pwdNew: "New Password", pwdNew2: "New Password (repeat)", updatePwd: "Update Password",
    show: "Show", hide: "Hide",
    mustLogin: "You must sign in.",
    joined: "Joined", city: "City", showcase: "Showcase",
    name: "Full Name",
    ok: "OK", cancel: "Cancel",
    premiumYear: "1-Year Premium",
  },
  ar: {
    brand: "Üreten Eller",
    navHome: "الرئيسية",
    navPost: "أضف إعلانًا",
    navProfile: "الملف الشخصي",
    sellerSettings: "الإعدادات",
    tabs: { urunler: "المنتجات", deger: "التقييمات", hakkinda: "نبذة", kargo: "الشحن والإرجاع", para: "$$$" },
    msg: "أرسل رسالة", follow: "تابِع", share: "شارك", report: "أبلغ",
    premium: "بريميوم",
    goPremium: "الترقية لبريميوم",
    premiumHint: "يتم تفعيل بريميوم بعد موافقة المشرف.",
    premiumActive: (left) => `بريميوم مفعّل. حق العرض المجاني: ${left ? "1" : "0"}`,
    useShowcase: "استخدم حق العرض",
    storeInfo: "معلومات المتجر",
    wd: "أيام الأسبوع", we: "نهاية الأسبوع", ship: "مدة الشحن", ret: "سياسة الإرجاع",
    none: "لا توجد إعلانات بعد.",
    view: "عرض", takeShowcase: "تمييز",
    payTitle: "بيانات الدفع", process: "العملية", price: "المبلغ", freeRight: "حق مجاني",
    iban: "IBAN", accName: "اسم الحساب", papara: "Papara",
    payNote: "بعد التحويل، ارفع الإيصال. اكتب اسم المستخدم في الملاحظة.",
    uploadReceipt: "رفع إيصال",
    settingsTitle: "الإعدادات", phone: "الهاتف", address: "العنوان", avatar: "الصورة",
    save: "حفظ", saveHint: "لن يبدأ الرفع قبل الضغط على حفظ.",
    pwdNow: "كلمة المرور الحالية", pwdNew: "كلمة مرور جديدة", pwdNew2: "تأكيد كلمة المرور", updatePwd: "تحديث كلمة المرور",
    show: "إظهار", hide: "إخفاء",
    mustLogin: "يجب تسجيل الدخول.",
    joined: "انضم", city: "المدينة", showcase: "الواجهة",
    name: "الاسم الكامل",
    ok: "حسنًا", cancel: "إلغاء",
    premiumYear: "بريميوم لسنة",
  },
  de: {
    brand: "Üreten Eller",
    navHome: "Start",
    navPost: "Anzeige aufgeben",
    navProfile: "Profil",
    sellerSettings: "Einstellungen",
    tabs: { urunler: "Produkte", deger: "Bewertungen", hakkinda: "Über", kargo: "Versand & Rückgabe", para: "$$$" },
    msg: "Nachricht", follow: "Folgen", share: "Teilen", report: "Melden",
    premium: "Premium",
    goPremium: "Zu Premium wechseln",
    premiumHint: "Premium wird nach Admin-Freigabe aktiviert.",
    premiumActive: (left) => `Premium aktiv. Kostenloses Schaufenster-Recht: ${left ? "1" : "0"}`,
    useShowcase: "Schaufenster-Recht nutzen",
    storeInfo: "Shop-Infos",
    wd: "Wochentage", we: "Wochenende", ship: "Versandzeit", ret: "Rückgaberecht",
    none: "Noch keine Anzeigen.",
    view: "Ansehen", takeShowcase: "Hervorheben",
    payTitle: "Zahlungsdetails", process: "Vorgang", price: "Betrag", freeRight: "Freies Recht",
    iban: "IBAN", accName: "Kontoname", papara: "Papara",
    payNote: "Nach Überweisung Beleg hochladen. Nutzernamen in die Notiz schreiben.",
    uploadReceipt: "Beleg hochladen",
    settingsTitle: "Einstellungen", phone: "Telefon", address: "Adresse", avatar: "Avatar",
    save: "Speichern", saveHint: "Upload startet erst nach „Speichern“. ",
    pwdNow: "Aktuelles Passwort", pwdNew: "Neues Passwort", pwdNew2: "Neues Passwort (Wdh.)", updatePwd: "Passwort aktualisieren",
    show: "Anzeigen", hide: "Verbergen",
    mustLogin: "Bitte anmelden.",
    joined: "Beitritt", city: "Stadt", showcase: "Schaufenster",
    name: "Vor- & Nachname",
    ok: "OK", cancel: "Abbrechen",
    premiumYear: "Premium (1 Jahr)",
  },
};

export default function SellerProfile() {
  const app = ensureApp();
  const auth = useMemo(() => getAuth(app), [app]);
  const db = useMemo(() => getFirestore(app), [app]);
  const storage = useMemo(() => getStorage(app), [app]);

  // Dil
  const [lang, setLang] = useState("tr");
  const t = useMemo(() => STR[lang], [lang]);

  // Auth & user
  const [user, setUser] = useState(null);
  const [userDoc, setUserDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  // UI
  const [tab, setTab] = useState("urunler");
  const [msg, setMsg] = useState("");
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Settings state
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [saving, setSaving] = useState(false);

  // Password state
  const [pwdNow, setPwdNow] = useState("");
  const [pwdNew1, setPwdNew1] = useState("");
  const [pwdNew2, setPwdNew2] = useState("");
  const [showPwd, setShowPwd] = useState({ now: false, new1: false, new2: false });
  const [pwdBusy, setPwdBusy] = useState(false);

  // Listings
  const [ads, setAds] = useState([]);
  const [showcaseCount, setShowcaseCount] = useState(0);

  // Ödeme (dekont)
  const [receiptFile, setReceiptFile] = useState(null);

  // Mount & auth
  useEffect(() => {
    const off = onAuthStateChanged(auth, async (u) => {
      setUser(u || null);
      if (u) {
        // users/{uid} getir; yoksa oluştur
        const uref = doc(db, "users", u.uid);
        const snap = await getDoc(uref);
        if (!snap.exists()) {
          const display = u.displayName || (u.email ? u.email.split("@")[0] : "user");
          const init = {
            name: display,
            username: display,
            city: "",
            phone: "",
            address: "",
            avatar_url: "",
            premium: false,
            premium_until: null,
            showcase_used: 0,
            showcase_free_left: 1, // premium olup olmadığına göre admin günceller
            listings_used: 0,
            listings_quota_total: 9999,
            created_at: serverTimestamp(),
          };
          await setDoc(uref, init, { merge: true });
          setUserDoc(init);
        } else {
          setUserDoc(snap.data());
        }

        // ilanlar
        const q = query(collection(db, "listings"), where("seller_uid", "==", u.uid));
        const qs = await getDocs(q);
        const list = [];
        let showcase = 0;
        qs.forEach((d) => {
          const data = d.data();
          if (data.is_showcase) showcase += 1;
          list.push({ id: d.id, ...data });
        });
        setAds(list);
        setShowcaseCount(showcase);
      } else {
        setUserDoc(null);
        setAds([]);
        setShowcaseCount(0);
      }
      setLoading(false);
    });
    return () => off();
  }, [auth, db]);

  // userDoc -> settings form vars
  useEffect(() => {
    if (!userDoc) return;
    setName(userDoc.name || "");
    setCity(userDoc.city || "");
    setPhone(userDoc.phone || "");
    setAddress(userDoc.address || "");
  }, [userDoc]);

  const displayName = useMemo(() => {
    if (userDoc?.name && userDoc.name.trim()) return userDoc.name.trim();
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split("@")[0];
    return "—";
  }, [userDoc, user]);

  const joinedText = useMemo(() => {
    if (!userDoc?.created_at) return "-";
    const dt = userDoc.created_at?.toDate ? userDoc.created_at.toDate() : new Date();
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const dd = String(dt.getDate()).padStart(2, "0");
    return `${dd}.${mm}.${yyyy}`;
  }, [userDoc]);

  const isPremium = !!userDoc?.premium;
  const freeShowcaseLeft = (userDoc?.showcase_free_left ?? (isPremium ? 1 : 0)) > 0;

  /** --------- Profil Kaydet (avatar + bilgiler) ---------- */
  async function handleSaveProfile() {
    if (!user) return;
    setSaving(true);
    try {
      let avatar_url = userDoc?.avatar_url || "";
      if (avatarFile) {
        const fref = ref(storage, `avatars/${user.uid}.jpg`);
        await uploadBytes(fref, avatarFile);
        avatar_url = await getDownloadURL(fref);
      }
      const uref = doc(db, "users", user.uid);
      await updateDoc(uref, {
        name: name || displayName,
        city,
        phone,
        address,
        avatar_url,
        updated_at: serverTimestamp(),
      });
      setUserDoc({ ...(userDoc || {}), name: name || displayName, city, phone, address, avatar_url });
      setMsg("Profil güncellendi.");
      setAvatarFile(null);
    } catch (e) {
      console.error(e);
      setMsg("Kaydetme hatası: " + e.message);
    } finally {
      setSaving(false);
    }
  }

  /** --------- Şifre Güncelle ---------- */
  async function handleUpdatePassword() {
    if (!user) return;
    if (!pwdNow || !pwdNew1 || !pwdNew2) {
      setMsg("Lütfen tüm şifre alanlarını doldurun.");
      return;
    }
    if (pwdNew1 !== pwdNew2) {
      setMsg("Yeni şifreler aynı olmalı.");
      return;
    }
    try {
      setPwdBusy(true);
      const cred = EmailAuthProvider.credential(user.email, pwdNow);
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, pwdNew1);
      setMsg("Şifre güncellendi.");
      setPwdNow(""); setPwdNew1(""); setPwdNew2("");
    } catch (e) {
      console.error(e);
      setMsg("Şifre güncellenemedi: " + e.message);
    } finally {
      setPwdBusy(false);
    }
  }

  /** --------- Premium Modal: dekont yükle + payments kaydı ---------- */
  async function handleUploadReceipt() {
    if (!user) return;
    if (!receiptFile) {
      setMsg("Lütfen dekont seçin.");
      return;
    }
    try {
      const ts = Date.now();
      const sref = ref(storage, `receipts/${user.uid}/${ts}.jpg`);
      await uploadBytes(sref, receiptFile);
      const url = await getDownloadURL(sref);
      await addDoc(collection(db, "payments"), {
        user_id: user.uid,
        username: userDoc?.username || displayName,
        type: "premium_1y",
        amount: PREMIUM_PRICE,
        receipt_url: url,
        created_at: serverTimestamp(),
        status: "pending",
        note: "Premium (1 yıl) talebi. Dekont eklendi.",
      });
      setMsg("Dekont yüklendi. Admin onayı bekleniyor.");
      setReceiptFile(null);
      setPremiumOpen(false);
    } catch (e) {
      console.error(e);
      setMsg("Dekont yükleme hatası: " + e.message);
    }
  }

  if (loading) {
    return <div style={{padding:16}}>Yükleniyor…</div>;
  }
  if (!user) {
    return (
      <div style={{padding:16}}>
        <p>{t.mustLogin}</p>
        <Link className="btn" href="/login">Login</Link>
      </div>
    );
  }

  // Kullanıcı adı (slug benzeri)
  const atName = userDoc?.username || (user?.email ? user.email.split("@")[0] : user.uid.slice(0, 6));

  return (
    <div lang={lang} dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="hdr">
        <a className="brand" href="/">
          <img src="/logo.png" width={32} height={32} alt="logo" />
          <strong>{t.brand}</strong>
        </a>
        <div className="hdrNav">
          <a className="ghost" href="/">{t.navHome}</a>
          <a className="ghost" href="/portal/seller/post">{t.navPost}</a>
          <a className="ghost active" href="/portal/seller/profile">{t.navProfile}</a>
          <select aria-label="Language" value={lang} onChange={(e)=>setLang(e.target.value)}>
            {["tr","en","ar","de"].map(k => <option key={k} value={k}>{k.toUpperCase()}</option>)}
          </select>
        </div>
      </header>

      {/* Profil kartı */}
      <section className={`profileCard ${isPremium ? "gold" : ""}`}>
        <div className="left">
          <div
            className={`avatarWrap ${isPremium ? "gold" : ""}`}
            style={{ backgroundImage: `url(${userDoc?.avatar_url || "/avatar.svg"})` }}
            aria-label="avatar"
          />
          <div className="info">
            <div className="name">
              <span>{displayName}</span>
              {isPremium && <span className="badge">✔️ Onaylı Satıcı</span>}
            </div>
            <div className="user">@{atName}</div>
            <div className="meta">
              <div>{t.city}: {userDoc?.city?.trim() ? userDoc.city : "-"}</div>
              <div>{t.joined}: {joinedText}</div>
              <div>{t.showcase}: {showcaseCount}</div>
            </div>
            <div className="quick">
              <button className="ghost">{t.msg}</button>
              <button className="ghost">{t.follow}</button>
              <button className="ghost">{t.share}</button>
              <button className="ghost">{t.report}</button>
              <button className="btn ghost" onClick={() => setSettingsOpen(true)}>{t.sellerSettings}</button>
            </div>
          </div>
        </div>

        <div className="right">
          <div className="premium">
            <div className="ttl">{t.premium}</div>
            <div className="pRow">
              {!isPremium ? (
                <>
                  <div className="hint">{t.premiumHint}</div>
                  <button className="btn big" onClick={()=>setPremiumOpen(true)}>
                    {t.goPremium} — ₺{PREMIUM_PRICE} ({t.premiumYear})
                  </button>
                </>
              ) : (
                <>
                  <div className="hint">{t.premiumActive(freeShowcaseLeft)}</div>
                  <button className={`btn ${freeShowcaseLeft ? "" : "ghost"}`}>
                    {t.useShowcase}
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="shop">
            <div className="ttl">{t.storeInfo}</div>
            <table className="tbl">
              <tbody>
                <tr><td>{t.wd}</td><td>09.00 – 16.00</td></tr>
                <tr><td>{t.we}</td><td>10.00 – 16.00</td></tr>
                <tr><td>{t.ship}</td><td>1.5 – 3 iş günü</td></tr>
                <tr><td>{t.ret}</td><td>Geçerlidir</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="listings">
        <div className="tabs2" role="tablist">
          {["urunler","deger","hakkinda","kargo","para"].map(k => (
            <button
              key={k}
              role="tab"
              aria-selected={tab===k}
              className={tab===k ? "on" : ""}
              onClick={()=>setTab(k)}
            >
              {t.tabs[k]}
            </button>
          ))}
        </div>

        {tab === "urunler" && (
          <div className="grid">
            {ads.length === 0 ? (
              <div className="empty">{t.none}</div>
            ) : ads.map((ad, i) => (
              <article key={ad.id} className="card">
                <div className="thumb" style={{backgroundImage:`url(${ad.image_url || "/avatar.svg"})`}}>
                  {ad.is_showcase && <span className="badge">Vitrin</span>}
                </div>
                <div className="body">
                  <h3 className="title">{ad.title || "İlan"}</h3>
                  <div className="meta">
                    <span className="mono">#{3838 + i}</span>
                    <span>{ad.price ? `₺${ad.price}` : ""}</span>
                  </div>
                  <div className="act" style={{marginTop:8}}>
                    <a className="btn ghost" href={`/ad/${ad.id}`}>{t.view}</a>
                    <button className="btn">{t.takeShowcase}</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {tab === "deger" && (
          <div className="empty">• Puan & yorumlar yakında.</div>
        )}
        {tab === "hakkinda" && (
          <div className="empty">
            <div style={{fontWeight:900, marginBottom:6}}>{t.name}</div>
            <div style={{marginBottom:10}}>{displayName}</div>
            <div style={{fontWeight:900, marginBottom:6}}>{t.address}</div>
            <div>{userDoc?.address?.trim() ? userDoc.address : "-"}</div>
          </div>
        )}
        {tab === "kargo" && (
          <div className="empty">• {t.kargo} / {t.ret} metinleri.</div>
        )}
        {tab === "para" && (
          <div className="empty">
            Premium: ₺{PREMIUM_PRICE} (1 yıl) — Vitrin (Premium): ₺{SHOWCASE_PRICE_PREMIUM}, Standart: ₺{SHOWCASE_PRICE_STANDARD}
          </div>
        )}
      </section>

      {/* Premium modal */}
      {premiumOpen && (
        <div className="modal" role="dialog" aria-modal="true" aria-label={t.premium}>
          <div className="sheet">
            <div className="mHd">
              <div className="mTtl">{t.payTitle}</div>
              <button className="x" onClick={()=>setPremiumOpen(false)} aria-label="Kapat">✕</button>
            </div>
            <div className="mBd">
              <div className="payBox">
                <div className="row"><strong>{t.process}</strong><span>{t.premiumYear}</span></div>
                <div className="row"><strong>{t.price}</strong><span>₺{PREMIUM_PRICE}</span></div>
                <div className="row"><strong>{t.iban}</strong><span className="mono">{IBAN}</span></div>
                <div className="row"><strong>{t.accName}</strong><span>{ACCOUNT_NAME}</span></div>
                <div className="row"><strong>{t.papara}</strong><span>{PAPARA}</span></div>
              </div>
              <div className="hint">{t.payNote}</div>
              <div className="receipt">
                <input type="file" accept="image/*" onChange={(e)=>setReceiptFile(e.target.files?.[0]||null)} />
                <button className="btn" onClick={handleUploadReceipt}>{t.uploadReceipt}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ayarlar modal */}
      {settingsOpen && (
        <div className="modal" role="dialog" aria-modal="true" aria-label={t.settingsTitle}>
          <div className="sheet">
            <div className="mHd">
              <div className="mTtl">{t.settingsTitle}</div>
              <button className="x" onClick={() => setSettingsOpen(false)} aria-label="Kapat">✕</button>
            </div>
            <div className="mBd">

              {/* Profil bilgileri */}
              <div className="form">
                <div style={{fontWeight:900, marginBottom:6}}>{t.name}</div>
                <input
                  type="text"
                  value={name}
                  onChange={(e)=>setName(e.target.value)}
                  placeholder={t.name}
                />

                <div style={{fontWeight:900, marginTop:8}}>{t.city}</div>
                <input
                  type="text"
                  value={city}
                  onChange={(e)=>setCity(e.target.value)}
                  placeholder="İstanbul"
                />

                <div style={{fontWeight:900, marginTop:8}}>{t.avatar}</div>
                <input type="file" accept="image/*" onChange={(e)=>setAvatarFile(e.target.files?.[0]||null)} />

                <div style={{fontWeight:900, marginTop:8}}>{t.phone}</div>
                <input type="text" value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="+90..." />

                <div style={{fontWeight:900, marginTop:8}}>{t.address}</div>
                <textarea rows={3} value={address} onChange={(e)=>setAddress(e.target.value)} />

                <div className="rowBtns">
                  <button className={`btn ${saving ? "disabled" : ""}`} onClick={handleSaveProfile} disabled={saving}>
                    {t.save}
                  </button>
                  <div className="sub">{t.saveHint}</div>
                </div>
              </div>

              {/* Şifre */}
              <div className="form">
                <div style={{fontWeight:900, marginBottom:4}}>{t.updatePwd}</div>

                <label style={{fontWeight:900}}>{t.pwdNow}</label>
                <div className="pwdRow">
                  <input
                    type={showPwd.now ? "text" : "password"}
                    value={pwdNow}
                    onChange={(e)=>setPwdNow(e.target.value)}
                  />
                  <button type="button" className="eye" onClick={()=>setShowPwd(s=>({...s, now:!s.now}))}>
                    {showPwd.now ? t.hide : t.show}
                  </button>
                </div>

                <label style={{fontWeight:900, marginTop:6}}>{t.pwdNew}</label>
                <div className="pwdRow">
                  <input
                    type={showPwd.new1 ? "text" : "password"}
                    value={pwdNew1}
                    onChange={(e)=>setPwdNew1(e.target.value)}
                  />
                  <button type="button" className="eye" onClick={()=>setShowPwd(s=>({...s, new1:!s.new1}))}>
                    {showPwd.new1 ? t.hide : t.show}
                  </button>
                </div>

                <label style={{fontWeight:900, marginTop:6}}>{t.pwdNew2}</label>
                <div className="pwdRow">
                  <input
                    type={showPwd.new2 ? "text" : "password"}
                    value={pwdNew2}
                    onChange={(e)=>setPwdNew2(e.target.value)}
                  />
                  <button type="button" className="eye" onClick={()=>setShowPwd(s=>({...s, new2:!s.new2}))}>
                    {showPwd.new2 ? t.hide : t.show}
                  </button>
                </div>

                <div className="rowBtns" style={{marginTop:6}}>
                  <button className={`btn ${pwdBusy ? "disabled" : ""}`} onClick={handleUpdatePassword} disabled={pwdBusy}>
                    {t.updatePwd}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Bildirim balonu (tıkla kapat) */}
      {msg && (
        <div
          style={{
            position:"fixed", right:16, bottom:16, background:"#111827", color:"#fff",
            border:"1px solid #000", padding:"10px 14px", borderRadius:12, zIndex:80, cursor:"pointer"
          }}
          onClick={()=>setMsg("")}
          aria-live="polite"
        >
          {msg}
        </div>
      )}

      {/* Footer */}
      <footer className="legal">
        <div className="inner">
          <nav className="links" aria-label="legal">
            <Link href="/legal/kurumsal">Kurumsal</Link>
            <Link href="/legal/hakkimizda">Hakkımızda</Link>
            <Link href="/legal/iletisim">İletişim</Link>
            <Link href="/legal/gizlilik">Gizlilik</Link>
            <Link href="/legal/kvkk-aydinlatma">KVKK</Link>
            <Link href="/legal/kullanim-sartlari">Kullanım Şartları</Link>
            <Link href="/legal/mesafeli-satis-sozlesmesi">Mesafeli Satış</Link>
            <Link href="/legal/teslimat-iade">Teslimat & İade</Link>
            <Link href="/legal/cerez-politikasi">Çerez</Link>
            <Link href="/legal/topluluk-kurallari">Topluluk</Link>
            <Link href="/legal/yasakli-urunler">Yasaklı Ürünler</Link>
            <a className="homeLink" href="/legal">Tüm Legal</a>
          </nav>
          <div className="copy">© 2025 Üreten Eller</div>
        </div>
      </footer>
    </div>
  );
}
