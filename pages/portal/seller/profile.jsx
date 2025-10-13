// pages/portal/seller/profile.jsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

/* ======================= Firebase (modular) ======================= */
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
  serverTimestamp,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

/* --- Firebase config (BUCKET DÜZGÜN) --- */
const firebaseConfig = {
  apiKey: "AIzaSyCd9GjP6CDA8i4XByhXDHyESy-g_DHVwvQ",
  authDomain: "ureteneller-ecaac.firebaseapp.com",
  projectId: "ureteneller-ecaac",
  storageBucket: "ureteneller-ecaac.appspot.com",
  messagingSenderId: "368042877151",
  appId: "1:368042877151:web:ee0879fc4717928079c96a",
  measurementId: "G-BJHKN8V4RQ",
};
function ensureApp() {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

/* ======================= Sabitler ======================= */
const IBAN = "TR590082900009491868461105";
const ACCOUNT_NAME = "Nejla Karataş";
const PAPARA = "Papara Ticari";
const PREMIUM_PRICE = 1999;
const SHOWCASE_PRICE_PREMIUM = 100;
const SHOWCASE_PRICE_STANDARD = 199;

const SUPPORTED = ["tr", "en", "ar", "de"];
const LOCALE_LABEL = { tr: "Türkçe", en: "English", ar: "العربية", de: "Deutsch" };

/* ======================= Çok Dilli Metinler ======================= */
const STR = {
  tr: {
    brand: "Üreten Eller",
    sellerSettings: "Ayarlar",
    tabs: { urunler: "Ürünler", deger: "Değerlendirmeler", hakkinda: "Hakkında", kargo: "Kargo & İade" },
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
    verified: "Onaylı Satıcı",
  },
  en: {
    brand: "Üreten Eller",
    sellerSettings: "Settings",
    tabs: { urunler: "Products", deger: "Reviews", hakkinda: "About", kargo: "Shipping & Returns" },
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
    verified: "Verified Seller",
  },
  ar: {
    brand: "Üreten Eller",
    sellerSettings: "الإعدادات",
    tabs: { urunler: "المنتجات", deger: "التقييمات", hakkinda: "حول", kargo: "الشحن والإرجاع" },
    msg: "أرسل رسالة", follow: "تابع", share: "شارك", report: "أبلغ",
    premium: "بريميوم",
    goPremium: "الترقية إلى بريميوم",
    premiumHint: "يُفعَّل بريميوم بعد موافقة المشرف.",
    premiumActive: (left) => `بريميوم فعّال. حق العرض المجاني: ${left ? "1" : "0"}`,
    useShowcase: "استخدم حق العرض",
    storeInfo: "معلومات المتجر",
    wd: "أيام الأسبوع", we: "عطلة نهاية الأسبوع", ship: "مدة الشحن", ret: "سياسة الإرجاع",
    none: "لا توجد إعلانات بعد.",
    view: "عرض", takeShowcase: "إبراز",
    payTitle: "بيانات الدفع", process: "العملية", price: "المبلغ", freeRight: "حق مجاني",
    iban: "IBAN", accName: "اسم الحساب", papara: "Papara",
    payNote: "بعد التحويل/الحوالة، ارفع إيصال الدفع. اكتب اسم المستخدم في الملاحظة.",
    uploadReceipt: "ارفع الإيصال",
    settingsTitle: "الإعدادات", phone: "الهاتف", address: "العنوان", avatar: "الصورة",
    save: "حفظ", saveHint: "لن يبدأ الرفع حتى تضغط «حفظ».",
    pwdNow: "كلمة المرور الحالية", pwdNew: "كلمة مرور جديدة", pwdNew2: "تأكيد كلمة المرور", updatePwd: "تحديث كلمة المرور",
    show: "إظهار", hide: "إخفاء",
    mustLogin: "يجب تسجيل الدخول.", joined: "انضم", city: "المدينة", showcase: "الواجهة",
    verified: "بائع موثوق",
  },
  de: {
    brand: "Üreten Eller",
    sellerSettings: "Einstellungen",
    tabs: { urunler: "Produkte", deger: "Bewertungen", hakkinda: "Über", kargo: "Versand & Rückgabe" },
    msg: "Nachricht", follow: "Folgen", share: "Teilen", report: "Melden",
    premium: "Premium",
    goPremium: "Zu Premium wechseln",
    premiumHint: "Premium wird nach Admin-Freigabe aktiviert.",
    premiumActive: (left) => `Premium aktiv. Kostenloses Schaufensterrecht: ${left ? "1" : "0"}`,
    useShowcase: "Schaufensterrecht nutzen",
    storeInfo: "Shop-Infos",
    wd: "Wochentage", we: "Wochenende", ship: "Versanddauer", ret: "Rückgaberichtlinie",
    none: "Noch keine Anzeigen.",
    view: "Ansehen", takeShowcase: "Hervorheben",
    payTitle: "Zahlungsdetails", process: "Vorgang", price: "Betrag", freeRight: "Gratisrecht",
    iban: "IBAN", accName: "Kontoinhaber", papara: "Papara",
    payNote: "Nach Überweisung/SEPA den Beleg hochladen. Nutzernamen in den Verwendungszweck.",
    uploadReceipt: "Beleg hochladen",
    settingsTitle: "Einstellungen", phone: "Telefon", address: "Adresse", avatar: "Avatar",
    save: "Speichern", saveHint: "Upload startet erst nach Klick auf „Speichern“.",
    pwdNow: "Aktuelles Passwort", pwdNew: "Neues Passwort", pwdNew2: "Neues Passwort (Wdh.)", updatePwd: "Passwort aktualisieren",
    show: "Zeigen", hide: "Verbergen",
    mustLogin: "Bitte anmelden.", joined: "Beitritt", city: "Stadt", showcase: "Schaufenster",
    verified: "Verifizierte:r Verkäufer:in",
  },
};

/* ======================= Yardımcılar ======================= */
const fmtDate = (ts) => {
  try {
    if (!ts) return "-";
    const d = typeof ts?.toDate === "function" ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("tr-TR", { year: "numeric", month: "short", day: "2-digit" });
  } catch {
    return "-";
  }
};

/* ======================= Ana Bileşen ======================= */
export default function SellerProfile() {
  const app = ensureApp();
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);

  const [lang, setLang] = useState("tr");
  const t = useMemo(() => STR[lang], [lang]);

  const [me, setMe] = useState(null);          // Firebase auth user
  const [user, setUser] = useState(null);      // Firestore users/{uid}
  const [listings, setListings] = useState([]);// Kullanıcı ilanları
  const [tab, setTab] = useState("urunler");   // urunler|deger|hakkinda|kargo

  const [msg, setMsg] = useState("");

  // Ayarlar paneli
  const [openSettings, setOpenSettings] = useState(false);
  const [showPwdCard, setShowPwdCard] = useState(false);

  // Profil alanları
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);

  // Premium/Ödeme modalı
  const [openPay, setOpenPay] = useState(false);
  const [receiptFile, setReceiptFile] = useState(null);

  // Şifre
  const [pwdNow, setPwdNow] = useState("");
  const [pwdNew1, setPwdNew1] = useState("");
  const [pwdNew2, setPwdNew2] = useState("");
  const [showPwd, setShowPwd] = useState({ now: false, n1: false, n2: false });

  // Kimlik & veri çek
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setMe(u || null);
      if (!u) {
        setUser(null);
        setListings([]);
        return;
      }
      // users/{uid}
      const ud = await getDoc(doc(db, "users", u.uid));
      let data = ud.exists() ? ud.data() : {
        display_name: u.displayName || (u.email ? u.email.split("@")[0] : "user"),
        city: "-",
        created_at: serverTimestamp(),
        is_premium: false,
        premium_until: null,
        showcase_free_left: 0,
      };
      if (!ud.exists()) {
        await setDoc(doc(db, "users", u.uid), data, { merge: true });
      }
      setUser({ uid: u.uid, ...data });
      setPhone(data.phone || "");
      setAddress(data.address || "");

      // ilanlar
      const qs = await getDocs(query(collection(db, "listings"), where("seller_uid", "==", u.uid)));
      setListings(qs.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [auth, db]);

  // Premium hesaplama: is_premium && premium_until gelecekte
  const premiumUntilMs =
    user?.premium_until?.toMillis?.() ??
    (typeof user?.premium_until === "number" ? user.premium_until : 0);
  const isPremium = Boolean(user?.is_premium) && premiumUntilMs > Date.now();
  const showcaseFreeLeft = Number(user?.showcase_free_left ?? 0);

  // Görünen ad/city/join date
  const displayName = user?.display_name || me?.displayName || (me?.email ? me.email.split("@")[0] : "@");
  const city = user?.city || "-";
  const joinedTxt = user?.created_at ? fmtDate(user.created_at) : "-";

  // Avatar yükleme
  const onAvatarPick = (e) => setAvatarFile(e.target.files?.[0] || null);
  const uploadAvatar = async () => {
    try {
      if (!me) return setMsg(t.mustLogin);
      if (!avatarFile) return setMsg("Dosya seçilmedi.");

      const avatarRef = ref(storage, `avatars/${me.uid}.jpg`);
      await uploadBytes(avatarRef, avatarFile, { contentType: avatarFile.type });
      const url = await getDownloadURL(avatarRef);
      await updateDoc(doc(db, "users", me.uid), { avatar_url: url });
      setMsg("Avatar güncellendi.");
      setAvatarFile(null);
    } catch (e) {
      setMsg("Avatar yüklenemedi: " + (e?.message || e));
    }
  };

  // Profil kaydet (telefon/adres)
  const saveProfile = async () => {
    try {
      if (!me) return setMsg(t.mustLogin);
      await updateDoc(doc(db, "users", me.uid), {
        phone: phone || "",
        address: address || "",
      });
      setMsg("Profil güncellendi.");
    } catch (e) {
      setMsg("Profil hatası: " + (e?.message || e));
    }
  };

  // Şifre değiştir
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      if (!me) return setMsg(t.mustLogin);
      if (!pwdNow || !pwdNew1 || !pwdNew2) return setMsg("Şifre alanları eksik.");
      if (pwdNew1 !== pwdNew2) return setMsg("Yeni şifreler aynı değil.");

      const cred = EmailAuthProvider.credential(me.email, pwdNow);
      await reauthenticateWithCredential(me, cred);
      await updatePassword(me, pwdNew1);

      setPwdNow(""); setPwdNew1(""); setPwdNew2("");
      setMsg("Şifre güncellendi.");
    } catch (e) {
      setMsg("Şifre hatası: " + (e?.message || e));
    }
  };

  // Premium ödeme/dekont
  const uploadReceipt = async () => {
    try {
      if (!me) return setMsg(t.mustLogin);
      if (!receiptFile) return setMsg("Dekont seçilmedi.");
      const key = Date.now();
      const rRef = ref(storage, `receipts/${me.uid}/${key}_${receiptFile.name}`);
      await uploadBytes(rRef, receiptFile, { contentType: receiptFile.type });
      const url = await getDownloadURL(rRef);

      await setDoc(doc(collection(db, "payments")), {
        user_id: me.uid,
        type: "premium",
        amount: PREMIUM_PRICE,
        currency: "TRY",
        created_at: serverTimestamp(),
        file_url: url,
        status: "pending",
      });

      setMsg("Dekont yüklendi. Admin onayı bekleniyor.");
      setReceiptFile(null);
      setOpenPay(false);
    } catch (e) {
      setMsg("Dekont hatası: " + (e?.message || e));
    }
  };

  // Vitrin haklarını sadece gösteriyoruz (işlem akışını admin/purchase’a bağlayabilirsin)
  const takeShowcase = async (listingId) => {
    try {
      if (!me) return setMsg(t.mustLogin);
      // Demo: sadece mesaj
      if (isPremium && showcaseFreeLeft > 0) {
        setMsg("Ücretsiz vitrin hakkınız kullanılacak (demo).");
      } else {
        setMsg(
          isPremium
            ? `Ücretli vitrin: ₺${SHOWCASE_PRICE_PREMIUM} (demo)`
            : `Ücretli vitrin: ₺${SHOWCASE_PRICE_STANDARD} (demo)`
        );
      }
    } catch (e) {
      setMsg("Vitrin hatası: " + (e?.message || e));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Üst bar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-200">
        <div className="mx-auto max-w-5xl px-4 py-2 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 no-underline text-inherit">
            <img src="/logo.png" width={28} height={28} alt="logo" />
            <strong>{STR[lang].brand}</strong>
          </Link>
          <div className="flex items-center gap-2">
            <select
              aria-label="Language"
              className="border rounded-md px-2 py-1"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
            >
              {SUPPORTED.map((k) => (
                <option key={k} value={k}>{LOCALE_LABEL[k]}</option>
              ))}
            </select>
            <button className="btn" onClick={() => setOpenSettings(true)}>{t.sellerSettings}</button>
          </div>
        </div>
      </header>

      {/* Profil header */}
      <section className="mx-auto max-w-5xl px-4 py-4">
        <div className="flex gap-4 items-start">
          <div className={`w-20 h-20 rounded-full overflow-hidden ${isPremium ? "ring-4 ring-yellow-500" : "border"}`}>
            <img
              src={user?.avatar_url || "/avatar.svg"}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-extrabold m-0">
                {displayName || "@"}
              </h1>
              {isPremium && (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full"
                      style={{ background: "#fef3c7", border: "1px solid #f59e0b", color: "#92400e" }}>
                  ✨ {t.verified}
                </span>
              )}
            </div>
            <div className="text-sm text-gray-600 mt-1 flex gap-4 flex-wrap">
              <span>{t.city}: {city}</span>
              <span>{t.joined}: {joinedTxt}</span>
              <span>{t.showcase}: {Number(listings?.filter(l => l.is_showcase).length || 0)}</span>
            </div>

            <div className="flex gap-2 mt-3 flex-wrap">
              <button className="btn">{t.msg}</button>
              <button className="btn">{t.follow}</button>
              <button className="btn">{t.share}</button>
              <button className="btn">{t.report}</button>

              {/* Premium alanı */}
              {isPremium ? (
                <span className="text-sm font-bold inline-flex items-center gap-2 ml-2">
                  ⭐ {t.premium} — {t.premiumActive(showcaseFreeLeft > 0)}
                </span>
              ) : (
                <>
                  <button className="btn-amber" onClick={() => setOpenPay(true)}>{t.goPremium}</button>
                  <span className="text-sm text-gray-600">{t.premiumHint}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <nav className="mx-auto max-w-5xl px-4">
        <div className="border-b border-gray-200 -mb-px flex gap-2">
          {["urunler","deger","hakkinda","kargo"].map((k) => (
            <button
              key={k}
              className={`px-3 py-2 font-bold border-b-2 ${tab===k ? "border-gray-900" : "border-transparent text-gray-500"}`}
              onClick={() => setTab(k)}
            >
              {t.tabs[k]}
            </button>
          ))}
        </div>
      </nav>

      {/* Tab içerikleri */}
      <main className="mx-auto max-w-5xl px-4 py-4">
        {tab === "urunler" && (
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {listings?.length ? listings.map((ad) => (
              <article key={ad.id} className="ad">
                <div className="thumb" style={{ backgroundImage: `url(${ad.cover_url || "/avatar.svg"})` }}>
                  {ad.is_showcase && <span className="badge">{t.showcase}</span>}
                </div>
                <div className="body">
                  <div className="title">{ad.title || "İlan"}</div>
                  <div className="meta">
                    <span>₺{ad.price ?? "-"}</span>
                    <span>#{3838 + (ad.seq || 0)}</span>
                  </div>
                </div>
                <div className="p-2">
                  <button className="view w-full">{t.view}</button>
                  <button className="btn w-full mt-1" onClick={() => takeShowcase(ad.id)}>
                    {t.takeShowcase}
                  </button>
                </div>
              </article>
            )) : <div className="empty">{t.none}</div>}
          </div>
        )}

        {tab === "deger" && (
          <div className="text-sm text-gray-600">{t.none}</div>
        )}

        {tab === "hakkinda" && (
          <div className="space-y-2">
            <div className="font-extrabold">{t.storeInfo}</div>
            <div className="text-sm text-gray-700">
              <div>{t.wd}: 09.00 – 16.00</div>
              <div>{t.we}: 10.00 – 16.00</div>
              <div>{t.ship}: 1.5 – 3 iş günü</div>
              <div>{t.ret}: Geçerlidir</div>
            </div>
          </div>
        )}

        {tab === "kargo" && (
          <div className="text-sm text-gray-700">
            <p>Standart kargo koşulları geçerlidir. İade talebi için mesaj gönderebilirsiniz.</p>
          </div>
        )}
      </main>

      {/* Alt hukuk linkleri */}
      <footer className="legal">
        <div className="inner">
          <div className="ttl">Kurumsal</div>
          <nav className="links" aria-label="Kurumsal">
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
            <Link href="/legal" className="homeLink">Tüm Legal</Link>
          </nav>
          <div className="copy">© 2025 Üreten Eller</div>
        </div>
      </footer>

      {/* ----- Ayarlar Paneli (küçük, 2 sütun, şifre içeride) ----- */}
      {openSettings && (
        <div className="modalOverlay" onClick={()=>setOpenSettings(false)}>
          <div className="settingsSheet bg-white p-3" onClick={(e)=>e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-extrabold m-0">{t.settingsTitle}</h3>
              <button className="btn" onClick={()=>setOpenSettings(false)}>✕</button>
            </div>

            <div className="settingsGrid">
              {/* Avatar */}
              <div className="col-span-1">
                <label className="font-semibold block mb-1">{t.avatar}</label>
                <input type="file" accept="image/*" onChange={onAvatarPick}/>
                <button className="btn mt-2" onClick={uploadAvatar} disabled={!avatarFile}>
                  {t.save}
                </button>
              </div>

              {/* Telefon */}
              <div className="col-span-1">
                <label className="font-semibold block mb-1">{t.phone}</label>
                <input type="tel" value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="+90..." />
              </div>

              {/* Adres */}
              <div className="col-span-1 md:col-span-2">
                <label className="font-semibold block mb-1">{t.address}</label>
                <textarea rows={3} value={address} onChange={(e)=>setAddress(e.target.value)} />
              </div>

              <div className="col-span-1 md:col-span-2">
                <button className="btn-amber" onClick={saveProfile}>{t.save}</button>
                <div className="text-sm text-gray-500 mt-1">{t.saveHint}</div>
              </div>

              {/* Şifre kartı */}
              <div className="col-span-1 md:col-span-2">
                <button className="pwdToggleBtn" onClick={()=>setShowPwdCard(v=>!v)}>
                  🔒 {t.updatePwd}
                </button>
                {showPwdCard && (
                  <div className="pwdCard mt-2">
                    <form onSubmit={handlePasswordChange}>
                      <div className="grid gap-2 md:grid-cols-2">
                        <div>
                          <label className="block font-semibold mb-1">{t.pwdNow}</label>
                          <div className="flex">
                            <input
                              type={showPwd.now ? "text" : "password"}
                              value={pwdNow}
                              onChange={(e)=>setPwdNow(e.target.value)}
                              className="flex-1"
                            />
                            <button type="button" className="btn ml-2" onClick={()=>setShowPwd(s=>({...s,now:!s.now}))}>
                              {showPwd.now?t.hide:t.show}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block font-semibold mb-1">{t.pwdNew}</label>
                          <div className="flex">
                            <input
                              type={showPwd.n1 ? "text" : "password"}
                              value={pwdNew1}
                              onChange={(e)=>setPwdNew1(e.target.value)}
                              className="flex-1"
                            />
                            <button type="button" className="btn ml-2" onClick={()=>setShowPwd(s=>({...s,n1:!s.n1}))}>
                              {showPwd.n1?t.hide:t.show}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block font-semibold mb-1">{t.pwdNew2}</label>
                          <div className="flex">
                            <input
                              type={showPwd.n2 ? "text" : "password"}
                              value={pwdNew2}
                              onChange={(e)=>setPwdNew2(e.target.value)}
                              className="flex-1"
                            />
                            <button type="button" className="btn ml-2" onClick={()=>setShowPwd(s=>({...s,n2:!s.n2}))}>
                              {showPwd.n2?t.hide:t.show}
                            </button>
                          </div>
                        </div>
                      </div>
                      <button className="btn-amber mt-3" type="submit">{t.updatePwd}</button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----- Premium Ödeme Modalı ----- */}
      {openPay && (
        <div className="modalOverlay" onClick={()=>setOpenPay(false)}>
          <div className="settingsSheet bg-white p-3" onClick={(e)=>e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-extrabold m-0">{t.payTitle}</h3>
              <button className="btn" onClick={()=>setOpenPay(false)}>✕</button>
            </div>
            <div className="text-sm">
              <div className="grid gap-2">
                <div><b>{t.process}:</b> Premium (1 yıl)</div>
                <div><b>{t.price}:</b> ₺{PREMIUM_PRICE}</div>
                <div><b>{t.iban}:</b> {IBAN}</div>
                <div><b>{t.accName}:</b> {ACCOUNT_NAME}</div>
                <div><b>{t.papara}:</b> {PAPARA}</div>
              </div>
              <p className="mt-2">{t.payNote}</p>
              <div className="mt-2">
                <input type="file" accept="image/*,.pdf" onChange={(e)=>setReceiptFile(e.target.files?.[0]||null)} />
                <button className="btn-amber ml-2" onClick={uploadReceipt} disabled={!receiptFile}>
                  {t.uploadReceipt}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast benzeri küçük mesaj */}
      {msg && (
        <div
          onClick={()=>setMsg("")}
          style={{
            position:"fixed", left:"50%", bottom:20, transform:"translateX(-50%)",
            background:"#111827", color:"#fff", padding:"8px 12px", borderRadius:12, zIndex:80,
            cursor:"pointer"
          }}
          aria-live="polite"
        >
          {msg}
        </div>
      )}
    </div>
  );
}
