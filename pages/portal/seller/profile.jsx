// pages/portal/seller/profile.jsx
"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

/* =========================================================
   ÜRETEN ELLER – Satıcı Profili (4 dil + Premium + Vitrin + Ayarlar)
   - Auth: Firebase e-posta/şifre varsayımı
   - Firestore: users/{uid}, listings (seller_id==uid), payments
   - Storage: avatars/{uid}.jpg , receipts/{uid}/...
   - Premium: ₺1999 (dekont → admin onayı); onay sonrası altın çerçeve + rozet
   - Vitrin: Premium=₺100 (1 ücretsiz hak), Standart=₺199
   - Şifre değiştir: mevcut şifre + yeni şifre (2 kez), göz ikonu ile görünürlük
   - İlan No görsel: 3838 + sıra (istemci tarafı)
   - Sıralama: istemci tarafı (orderBy yok → index gerekmez)
   ========================================================= */

/* ------------------------------ Firebase ------------------------------ */
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCd9GjP6CDA8i4XByhXDHyESy-g_DHVwvQ",
  authDomain: "ureteneller-ecaac.firebaseapp.com",
  projectId: "ureteneller-ecaac",
  storageBucket: "ureteneller-ecaac.firebasestorage.app",
  messagingSenderId: "368042877151",
  appId: "1:368042877151:web:ee0879fc4717928079c96a",
  measurementId: "G-BJHKN8V4RQ",
};
function ensureApp() {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

/* ------------------------------- Sabitler ------------------------------ */
const IBAN = "TR590082900009491868461105";
const ACCOUNT_NAME = "Nejla Karataş";
const PAPARA = "Papara Ticari";
const PREMIUM_PRICE = 1999;
const SHOWCASE_PRICE_PREMIUM = 100;
const SHOWCASE_PRICE_STANDARD = 199;

/* ------------------------------ Çok Dilli Metinler --------------------- */
const STR = {
  tr: {
    brand: "Üreten Eller",
    navHome: "Ana Sayfa",
    navPost: "İlan Ver",
    navProfile: "Profil",
    sellerSettings: "Satıcı Ayarları",
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
    mustLogin: "Giriş yapmalısınız.", joined: "Katılım", city: "Şehir", showcase: "Vitrin",
    legal: ["Kurumsal","Hakkımızda","İletişim","Gizlilik","KVKK","Kullanım Şartları","Mesafeli Satış","Teslimat & İade","Çerez","Topluluk","Yasaklı Ürünler"],
  },
  en: {
    brand: "Üreten Eller",
    navHome: "Home",
    navPost: "Post Listing",
    navProfile: "Profile",
    sellerSettings: "Seller Settings",
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
    payNote: "After wire/EFT, upload the receipt. Write your username in the note.",
    uploadReceipt: "Upload Receipt",
    settingsTitle: "Settings", phone: "Phone", address: "Address", avatar: "Avatar",
    save: "Save", saveHint: "Upload won't start until you press Save.",
    pwdNow: "Current Password", pwdNew: "New Password", pwdNew2: "New Password (repeat)", updatePwd: "Update Password",
    show: "Show", hide: "Hide",
    mustLogin: "You must sign in.", joined: "Joined", city: "City", showcase: "Showcase",
    legal: ["Corporate","About","Contact","Privacy","PDPL (KVKK)","Terms","Distance Sales","Delivery & Returns","Cookie","Community","Prohibited Items"],
  },
  ar: {
    brand: "Üreten Eller",
    navHome: "الرئيسية",
    navPost: "أضف إعلانًا",
    navProfile: "الملف الشخصي",
    sellerSettings: "إعدادات البائع",
    tabs: { urunler: "المنتجات", deger: "المراجعات", hakkinda: "حول", kargo: "الشحن والإرجاع", para: "$$$" },
    msg: "أرسل رسالة", follow: "متابعة", share: "مشاركة", report: "إبلاغ",
    premium: "بريميوم",
    goPremium: "الترقية إلى بريميوم",
    premiumHint: "يُفعَّل بريميوم بعد موافقة المشرف.",
    premiumActive: (left) => `بريميوم مفعّل. حق الواجهة المجانية: ${left ? "1" : "0"}`,
    useShowcase: "استخدم حق الواجهة",
    storeInfo: "معلومات المتجر",
    wd: "أيام الأسبوع", we: "نهاية الأسبوع", ship: "وقت الشحن", ret: "سياسة الإرجاع",
    none: "لا توجد إعلانات بعد.",
    view: "عرض", takeShowcase: "تمييز",
    payTitle: "بيانات الدفع", process: "العملية", price: "المبلغ", freeRight: "حق مجاني",
    iban: "IBAN", accName: "اسم الحساب", papara: "Papara",
    payNote: "بعد التحويل البنكي/التحويل الإلكتروني، ارفع الإيصال. اكتب اسم المستخدم في الملاحظة.",
    uploadReceipt: "ارفع الإيصال",
    settingsTitle: "الإعدادات", phone: "الهاتف", address: "العنوان", avatar: "الصورة",
    save: "حفظ", saveHint: "لن يبدأ الرفع حتى تضغط حفظ.",
    pwdNow: "كلمة المرور الحالية", pwdNew: "كلمة مرور جديدة", pwdNew2: "تأكيد كلمة المرور الجديدة", updatePwd: "تحديث كلمة المرور",
    show: "إظهار", hide: "إخفاء",
    mustLogin: "يجب تسجيل الدخول.", joined: "الانضمام", city: "المدينة", showcase: "الواجهة",
    legal: ["الشركة","من نحن","اتصال","الخصوصية","اشعار KVKK","الشروط","البيع عن بُعد","التسليم والإرجاع","ملفات تعريف الارتباط","إرشادات المجتمع","سلع محظورة"],
  },
  de: {
    brand: "Üreten Eller",
    navHome: "Startseite",
    navPost: "Anzeige aufgeben",
    navProfile: "Profil",
    sellerSettings: "Verkäufer-Einstellungen",
    tabs: { urunler: "Produkte", deger: "Bewertungen", hakkinda: "Über", kargo: "Versand & Rückgabe", para: "$$$" },
    msg: "Nachricht", follow: "Folgen", share: "Teilen", report: "Melden",
    premium: "Premium",
    goPremium: "Zu Premium wechseln",
    premiumHint: "Premium wird nach Admin-Freigabe aktiviert.",
    premiumActive: (left) => `Premium aktiv. Kostenloses Schaufensterrecht: ${left ? "1" : "0"}`,
    useShowcase: "Schaufensterrecht nutzen",
    storeInfo: "Shop-Infos",
    wd: "Wochentage", we: "Wochenende", ship: "Versandzeit", ret: "Rückgaberichtlinie",
    none: "Noch keine Anzeigen.",
    view: "Ansehen", takeShowcase: "Hervorheben",
    payTitle: "Zahlungsdaten", process: "Vorgang", price: "Betrag", freeRight: "Gratisrecht",
    iban: "IBAN", accName: "Kontoinhaber", papara: "Papara",
    payNote: "Nach Überweisung Beleg hochladen. Schreibe deinen Benutzernamen in die Notiz.",
    uploadReceipt: "Beleg hochladen",
    settingsTitle: "Einstellungen", phone: "Telefon", address: "Adresse", avatar: "Avatar",
    save: "Speichern", saveHint: "Upload startet erst nach „Speichern”.",
    pwdNow: "Aktuelles Passwort", pwdNew: "Neues Passwort", pwdNew2: "Neues Passwort (Wiederholung)", updatePwd: "Passwort aktualisieren",
    show: "Anzeigen", hide: "Verbergen",
    mustLogin: "Bitte anmelden.", joined: "Beigetreten", city: "Stadt", showcase: "Schaufenster",
    legal: ["Unternehmen","Über uns","Kontakt","Datenschutz","KVKK","Nutzungsbedingungen","Fernabsatz","Lieferung & Rückgabe","Cookies","Community","Verbotene Artikel"],
  },
};

const SUPPORTED = ["tr", "en", "ar", "de"];

/* ------------------------------ Helpers ------------------------------ */
const fmtDate = (s) => (s ? new Date(s).toLocaleDateString() : "");
const cls = (...a) => a.filter(Boolean).join(" ");
const isRTL = (lang) => lang === "ar";

/* ------------------------------- Component ---------------------------- */
export default function SellerProfile() {
  const app = useMemo(() => ensureApp(), []);
  const auth = useMemo(() => getAuth(app), [app]);
  const db = useMemo(() => getFirestore(app), [app]);
  const st = useMemo(() => getStorage(app), [app]);

  const [lang, setLang] = useState("tr");
  const t = useMemo(() => STR[lang], [lang]);

  const [uid, setUid] = useState(null);
  const [me, setMe] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [activeTab, setActiveTab] = useState("urunler");

  const [showPay, setShowPay] = useState(null); // {type:'premium'|'showcase', listingId?, price}
  const [showSettings, setShowSettings] = useState(false);

  // settings
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);

  // password change
  const [pwdNow, setPwdNow] = useState("");
  const [pwdNew, setPwdNew] = useState("");
  const [pwdNew2, setPwdNew2] = useState("");
  const [visNow, setVisNow] = useState(false);
  const [visNew, setVisNew] = useState(false);
  const [visNew2, setVisNew2] = useState(false);

  useEffect(() => {
    const off = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setUid(null);
        setMe(null);
        setListings([]);
        setLoading(false);
        return;
      }
      setUid(u.uid);
      try {
        // users/{uid}
        const uref = doc(db, "users", u.uid);
        let snap = await getDoc(uref);
        if (!snap.exists()) {
          await setDoc(uref, {
            email: u.email || "",
            displayName: u.displayName || "Üreten Eller Satıcısı",
            username: u.email ? u.email.split("@")[0] : "user" + u.uid.slice(0, 6),
            city: "",
            phone: "",
            address: "",
            avatarUrl: "/avatar.svg",
            joinedAt: new Date().toISOString(),
            premium: { active: false, since: null, freeShowcaseUsed: false, approved: false },
            stats: { listings: 0, rating: 0, responseHours: 1 },
          });
          snap = await getDoc(uref);
        }
        const userDoc = { id: u.uid, ...snap.data() };
        setMe(userDoc);
        setPhone(userDoc.phone || "");
        setAddress(userDoc.address || "");

        // listings
        const qy = query(collection(db, "listings"), where("seller_id", "==", u.uid));
        const lsn = await getDocs(qy);
        let arr = lsn.docs.map((d) => ({ id: d.id, ...d.data() }));
        arr.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        setListings(arr);
        setLoading(false);
      } catch (e) {
        setErr(String(e?.message || e));
        setLoading(false);
      }
    });
    return () => off();
  }, [auth, db]);

  const isPremium = !!me?.premium?.approved && !!me?.premium?.active;
  const freeShowcaseLeft = isPremium && !me?.premium?.freeShowcaseUsed;

  async function handleAvatarSave() {
    try {
      if (!uid) return;
      let avatarUrl = me?.avatarUrl || "/avatar.svg";
      if (avatarFile) {
        const rf = ref(st, `avatars/${uid}.jpg`);
        await uploadBytes(rf, avatarFile);
        avatarUrl = await getDownloadURL(rf);
      }
      await updateDoc(doc(db, "users", uid), {
        phone: phone || "",
        address: address || "",
        avatarUrl,
      });
      const snap = await getDoc(doc(db, "users", uid));
      setMe({ id: uid, ...snap.data() });
      setAvatarFile(null);
      alert(lang === "tr" ? "Bilgiler kaydedildi." : lang === "ar" ? "تم الحفظ." : lang === "de" ? "Gespeichert." : "Saved.");
    } catch (e) {
      alert("Hata / Error: " + (e?.message || e));
    }
  }

  async function handlePasswordChange() {
    try {
      if (!auth.currentUser?.email) {
        alert("Oturum türü desteklenmiyor (email yok).");
        return;
      }
      if (!pwdNow || !pwdNew || !pwdNew2) {
        alert("Şifre alanları eksik.");
        return;
      }
      if (pwdNew !== pwdNew2) {
        alert("Yeni şifreler aynı değil.");
        return;
      }
      const cred = EmailAuthProvider.credential(auth.currentUser.email, pwdNow);
      await reauthenticateWithCredential(auth.currentUser, cred);
      await updatePassword(auth.currentUser, pwdNew);
      setPwdNow(""); setPwdNew(""); setPwdNew2("");
      alert(lang === "tr" ? "Şifre güncellendi." : lang === "ar" ? "تم تحديث كلمة المرور." : lang === "de" ? "Passwort aktualisiert." : "Password updated.");
    } catch (e) {
      alert((lang === "tr" ? "Şifre güncellenemedi: " : "Password update failed: ") + (e?.message || e));
    }
  }

  async function uploadReceipt(file, payload) {
    if (!uid || !file) return;
    const rf = ref(st, `receipts/${uid}/${Date.now()}_${file.name}`);
    await uploadBytes(rf, file);
    const url = await getDownloadURL(rf);

    const payRef = doc(collection(db, "payments"));
    await setDoc(payRef, {
      user_id: uid,
      type: payload.type, // premium | showcase
      listing_id: payload.listingId || null,
      amount: payload.amount,
      currency: "TRY",
      created_at: new Date().toISOString(),
      status: "pending",
      username: me?.username || "",
      receipt_url: url,
      note: payload.note || "",
    });
    return url;
  }

  function openPremiumModal() {
    setShowPay({ type: "premium", price: PREMIUM_PRICE });
  }
  function openShowcaseModal(listingId) {
    const price = isPremium ? (freeShowcaseLeft ? 0 : SHOWCASE_PRICE_PREMIUM) : SHOWCASE_PRICE_STANDARD;
    setShowPay({ type: "showcase", listingId, price });
  }
  async function submitPayment(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const file = fd.get("receipt");
    if (!file || !file.name) {
      alert(lang === "tr" ? "Dekont yükleyin." : "Upload a receipt.");
      return;
    }
    const username = me?.username || "";
    const note = `${showPay.type.toUpperCase()} • user:${username}`;
    await uploadReceipt(file, { type: showPay.type, listingId: showPay.listingId, amount: showPay.price, note });

    if (showPay.type === "showcase" && freeShowcaseLeft && showPay.price === 0) {
      await updateDoc(doc(db, "users", uid), { "premium.freeShowcaseUsed": true });
      const snap = await getDoc(doc(db, "users", uid));
      setMe({ id: uid, ...snap.data() });
    }
    alert(lang === "tr" ? "Dekont yüklendi. Onay bekliyor." : lang === "ar" ? "تم رفع الإيصال. بانتظار الموافقة." : lang === "de" ? "Beleg hochgeladen. Wartet auf Freigabe." : "Receipt uploaded. Pending approval.");
    setShowPay(null);
  }

  if (loading) return <div style={{ padding: 16 }}>Loading… {err && <small style={{ color: "crimson" }}>Error: {err}</small>}</div>;
  if (!uid) return <div style={{ padding: 16 }}>{t.mustLogin} <Link href="/login">Login</Link></div>;

  return (
    <div lang={lang} dir={isRTL(lang) ? "rtl" : "ltr"}>

      {/* Header */}
      <header className="hdr">
        <Link className="brand" href="/">
          <img src="/logo.png" width={36} height={36} alt="logo" />
          <strong>{t.brand.toUpperCase()}</strong>
        </Link>
        <nav className="hdrNav">
          <Link href="/portal/seller/">{t.navHome}</Link>
          <Link href="/portal/seller/post/">{t.navPost}</Link>
          <Link href="/portal/seller/profile/" className="active">{t.navProfile}</Link>
          <select aria-label="Language" value={lang} onChange={(e) => setLang(e.target.value)}>
            {SUPPORTED.map((k) => <option key={k} value={k}>{k.toUpperCase()}</option>)}
          </select>
        </nav>
      </header>

      {/* Profile Card */}
      <section className={cls("profileCard", isPremium && "gold")}>
        <div className="left">
          <div
            className={cls("avatarWrap", isPremium && "gold")}
            style={{ backgroundImage: `url(${me?.avatarUrl || "/avatar.svg"})` }}
          />
          <div className="info">
            <div className="name">
              {me?.displayName || (lang === "en" ? "Seller" : lang === "ar" ? "البائع" : lang === "de" ? "Verkäufer:in" : "Satıcı")}
              {isPremium && <span className="badge" title="Verified">✔</span>}
            </div>
            <div className="user">@{me?.username}</div>
            <div className="meta">
              <span>{me?.city || t.city}</span>
              <span>{t.joined}: {fmtDate(me?.joinedAt)}</span>
              <span>{t.showcase}: {listings.filter((l) => l.featured).length}</span>
            </div>
            <div className="quick">
              <button className="ghost">{t.msg}</button>
              <button className="ghost">{t.follow}</button>
              <button className="ghost">{t.share}</button>
              <button className="ghost">{t.report}</button>
            </div>
          </div>
        </div>

        <div className="right">
          <h3>{t.sellerSettings}</h3>
          <div className="tabs">
            <button className="tab active">Profil</button>
            <button className="tab" onClick={() => setShowSettings(true)}>{t.settingsTitle}</button>
          </div>

          <div className="premium">
            <div className="ttl">{t.premium}</div>
            {isPremium ? (
              <div className="pRow">
                <div>{t.premiumActive(freeShowcaseLeft)}</div>
                <button className="btn" onClick={() => openShowcaseModal(null)}>{t.useShowcase}</button>
              </div>
            ) : (
              <div className="pRow">
                <button className="btn" onClick={openPremiumModal}>{t.goPremium}</button>
                <div className="hint">{t.premiumHint}</div>
              </div>
            )}
          </div>

          <div className="shop">
            <div className="ttl">{t.storeInfo}</div>
            <table className="tbl"><tbody>
              <tr><td>{t.wd}</td><td>09.00 – 16.00</td></tr>
              <tr><td>{t.we}</td><td>10.00 – 16.00</td></tr>
              <tr><td>{t.ship}</td><td>1.5 – 3</td></tr>
              <tr><td>{t.ret}</td><td>14</td></tr>
            </tbody></table>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="listings">
        <div className="tabs2">
          <button className={activeTab === "urunler" ? "on" : ""} onClick={() => setActiveTab("urunler")}>{t.tabs.urunler}</button>
          <button className={activeTab === "deger" ? "on" : ""} onClick={() => setActiveTab("deger")}>{t.tabs.deger}</button>
          <button className={activeTab === "hakkinda" ? "on" : ""} onClick={() => setActiveTab("hakkinda")}>{t.tabs.hakkinda}</button>
          <button className={activeTab === "kargo" ? "on" : ""} onClick={() => setActiveTab("kargo")}>{t.tabs.kargo}</button>
          <button className={activeTab === "para" ? "on" : ""} onClick={() => setActiveTab("para")}>{t.tabs.para}</button>
        </div>

        {activeTab === "urunler" && (
          <div className="grid">
            {listings.length === 0 && <div className="empty">{t.none}</div>}
            {listings.map((it, i) => (
              <article key={it.id} className="card">
                <div className="thumb" style={{ backgroundImage: `url(${it.images?.[0] || "/logo.png"})` }}>
                  {it.featured && <span className="badge">★</span>}
                </div>
                <div className="body">
                  <div className="title">{it.title || "—"}</div>
                  <div className="meta">
                    <span>#{3838 + i}</span>
                    <span>{it.price ? `₺${it.price}` : ""}</span>
                  </div>
                  <div className="act">
                    <button className="btn ghost" onClick={() => openShowcaseModal(it.id)}>{t.takeShowcase}</button>
                    <button className="btn">{t.view}</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {activeTab === "deger" && (<div className="empty">—</div>)}
        {activeTab === "hakkinda" && (<div className="empty">—</div>)}
        {activeTab === "kargo" && (
          <table className="tbl" style={{ background: "#fff", borderRadius: 12 }}>
            <tbody>
              <tr><td>{t.ship}</td><td>1.5 – 3</td></tr>
              <tr><td>{t.ret}</td><td>14</td></tr>
            </tbody>
          </table>
        )}
        {activeTab === "para" && (
          <div className="payBox" style={{ background: "#fff", borderRadius: 12 }}>
            <div className="row"><b>{t.premium}</b><span>₺{PREMIUM_PRICE}</span></div>
            <div className="row"><b>Vitrin (Premium)</b><span>₺{SHOWCASE_PRICE_PREMIUM}</span></div>
            <div className="row"><b>Vitrin (Standart)</b><span>₺{SHOWCASE_PRICE_STANDARD}</span></div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="legal">
        <div className="inner">
          <nav className="links">
            <Link href="/legal/kurumsal">{t.legal[0]}</Link>
            <Link href="/legal/hakkimizda">{t.legal[1]}</Link>
            <Link href="/legal/iletisim">{t.legal[2]}</Link>
            <Link href="/legal/gizlilik">{t.legal[3]}</Link>
            <Link href="/legal/kvkk-aydinlatma">{t.legal[4]}</Link>
            <Link href="/legal/kullanim-sartlari">{t.legal[5]}</Link>
            <Link href="/legal/mesafeli-satis-sozlesmesi">{t.legal[6]}</Link>
            <Link href="/legal/teslimat-iade">{t.legal[7]}</Link>
            <Link href="/legal/cerez-politikasi">{t.legal[8]}</Link>
            <Link href="/legal/topluluk-kurallari">{t.legal[9]}</Link>
            <Link href="/legal/yasakli-urunler">{t.legal[10]}</Link>
          </nav>
          <div className="copy">© 2025 {t.brand}</div>
        </div>
      </footer>

      {/* ÖDEME MODAL */}
      {showPay && (
        <div className="modal" role="dialog" aria-modal="true">
          <div className="sheet">
            <div className="mHd">
              <div className="mTtl">{t.payTitle}</div>
              <button className="x" onClick={() => setShowPay(null)}>✕</button>
            </div>
            <div className="mBd">
              <div className="payBox">
                <div className="row"><b>{t.process}</b><span>{showPay.type === "premium" ? t.premium : "Vitrin"}</span></div>
                <div className="row"><b>{t.price}</b><span>{showPay.price === 0 ? t.freeRight : `₺${showPay.price}`}</span></div>
                <div className="row"><b>{t.iban}</b><span className="mono">{IBAN}</span></div>
                <div className="row"><b>{t.accName}</b><span>{ACCOUNT_NAME}</span></div>
                <div className="row"><b>{t.papara}</b><span>{PAPARA}</span></div>
                <div className="sub">{t.payNote}</div>
              </div>
              <form className="receipt" onSubmit={submitPayment}>
                <input name="receipt" type="file" accept="image/*,application/pdf" required />
                <button className="btn big" type="submit">{t.uploadReceipt}</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* AYARLAR MODAL */}
      {showSettings && (
        <div className="modal" role="dialog" aria-modal="true">
          <div className="sheet">
            <div className="mHd">
              <div className="mTtl">{t.settingsTitle}</div>
              <button className="x" onClick={() => setShowSettings(false)}>✕</button>
            </div>
            <div className="mBd">
              {/* Profil Bilgileri */}
              <div className="form">
                <label>{t.phone}
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="05xx…" />
                </label>
                <label>{t.address}
                  <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={3} />
                </label>
                <label>{t.avatar}
                  <input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} />
                </label>
                <div className="rowBtns">
                  <button className="btn" onClick={handleAvatarSave} type="button">{t.save}</button>
                </div>
                <div className="sub">{t.saveHint}</div>
              </div>

              {/* Şifre Değiştir */}
              <div className="form">
                <label>{t.pwdNow}
                  <div className="pwdRow">
                    <input
                      type={visNow ? "text" : "password"}
                      value={pwdNow}
                      onChange={(e) => setPwdNow(e.target.value)}
                      placeholder="•••••••"
                    />
                    <button type="button" className="eye" onClick={() => setVisNow(v => !v)}>{visNow ? t.hide : t.show}</button>
                  </div>
                </label>
                <label>{t.pwdNew}
                  <div className="pwdRow">
                    <input
                      type={visNew ? "text" : "password"}
                      value={pwdNew}
                      onChange={(e) => setPwdNew(e.target.value)}
                      placeholder="•••••••"
                    />
                    <button type="button" className="eye" onClick={() => setVisNew(v => !v)}>{visNew ? t.hide : t.show}</button>
                  </div>
                </label>
                <label>{t.pwdNew2}
                  <div className="pwdRow">
                    <input
                      type={visNew2 ? "text" : "password"}
                      value={pwdNew2}
                      onChange={(e) => setPwdNew2(e.target.value)}
                      placeholder="•••••••"
                    />
                    <button type="button" className="eye" onClick={() => setVisNew2(v => !v)}>{visNew2 ? t.hide : t.show}</button>
                  </div>
                </label>
                <div className="rowBtns">
                  <button className="btn ghost" onClick={handlePasswordChange} type="button">{t.updatePwd}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
