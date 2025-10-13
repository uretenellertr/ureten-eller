import React, { useEffect, useMemo, useState } from "react";

/**
 * ÜRETEN ELLER — PROFİL (KOYU TEMA, TEK DOSYA)
 * - Ayarlar: Avatar, Şehir, Şifre
 * - 4 dil (TR/EN/AR/DE) + RTL (AR)
 * - Mobil/Tablet/Desktop uyumlu
 * - Alt bar + legal
 * - Telefon / açık adres göstermez
 */

export default function SellerProfileDark() {
  /* ==== Dil & Yön ==== */
  const [lang, setLang] = useState("tr");
  const t = texts[lang] ?? texts.tr;
  const dir = lang === "ar" ? "rtl" : "ltr";

  /* ==== Profil (yerel) ==== */
  const [profile, setProfile] = useState(() => ({
    name: "Üreten Eller Satıcısı",
    username: "satici123",
    city: "",
    about: "",
    avatarUrl: "",
    badges: [],        // admin verir
    verified: false,   // admin verir
    premium: false,    // admin verir
    listings: [
      { id: 1, title: "El Örgüsü Oyuncak Bebek", status: "live" },
      { id: 2, title: "Yaprak Sarma (1 kg)", status: "pending" },
      { id: 3, title: "Gümüş Bileklik", status: "expired" },
      { id: 4, title: "Mantı (1 kg)", status: "live" },
    ],
    stats: { rating: null, ratingCount: 0 },
  }));

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const s = localStorage.getItem("ue_profile_dark");
        if (s) setProfile(JSON.parse(s));
        const L = localStorage.getItem("lang") || "tr";
        setLang(L);
      } catch {}
    }
  }, []);

  function saveProfile(next) {
    const merged = { ...profile, ...next };
    setProfile(merged);
    try { localStorage.setItem("ue_profile_dark", JSON.stringify(merged)); } catch {}
  }

  function onLangChange(e) {
    const L = e.target.value;
    setLang(L);
    try { localStorage.setItem("lang", L); } catch {}
  }

  /* ==== Sekmeler (İlanlar) ==== */
  const [tab, setTab] = useState("live"); // pending | live | expired
  const listings = Array.isArray(profile.listings) ? profile.listings : [];
  const filtered = listings.filter((it) =>
    tab === "pending" ? it.status === "pending" : tab === "live" ? it.status === "live" : it.status === "expired"
  );

  /* ==== Ayarlar Modalı ==== */
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState("profile"); // profile | security | location
  // Avatar
  const [avatarPreview, setAvatarPreview] = useState("");
  function onAvatarFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setAvatarPreview(url);
  }
  function saveAvatar() {
    if (avatarPreview) {
      saveProfile({ avatarUrl: avatarPreview });
      alert(t.saved);
      setAvatarPreview("");
    }
  }
  // Şehir
  const [cityDraft, setCityDraft] = useState("");
  useEffect(() => { setCityDraft(profile.city || ""); }, [showSettings]);
  function saveCity() {
    saveProfile({ city: cityDraft.trim() });
    alert(t.saved);
  }
  // Şifre
  const [pw, setPw] = useState({ current: "", next: "", again: "" });
  function changePassword(e) {
    e.preventDefault();
    if (!pw.current || !pw.next || !pw.again) { alert(t.fillAll); return; }
    if (pw.next !== pw.again) { alert(t.pwNoMatch); return; }
    if (pw.next.length < 6) { alert(t.pwTooShort); return; }
    // Gerçek backend yok: sadece başarı uyarısı
    setPw({ current: "", next: "", again: "" });
    alert(t.pwChanged);
  }

  return (
    <div dir={dir} className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#0b1224] to-[#070b18] text-slate-100">
      {/* Üst Şerit */}
      <header className="sticky top-0 z-20 bg-[#0b1224]/80 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center gap-3">
        {/* Avatar */}
        <div className={`relative shrink-0 ${profile.premium ? "goldRing" : ""}`}>
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-full grid place-items-center font-black text-lg bg-slate-800 text-slate-200">
              {initials(profile.name)}
            </div>
          )}
        </div>

        {/* Başlık */}
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-extrabold truncate">{profile.name || t.seller}</h1>
          <div className="text-slate-400 text-xs truncate">
            @{profile.username} {profile.city ? `· ${profile.city}` : ""}
          </div>
        </div>

        {/* Dil & Ayarlar */}
        <select
          aria-label={t.language}
          value={lang}
          onChange={onLangChange}
          className="border border-slate-700 text-slate-100 rounded-lg px-2 py-1 text-sm bg-[#0f172a]"
        >
          <option value="tr">TR</option>
          <option value="en">EN</option>
          <option value="ar">AR</option>
          <option value="de">DE</option>
        </select>

        <button className="btnPrimary ml-2" onClick={() => { setShowSettings(true); setSettingsTab("profile"); }}>
          {t.settings}
        </button>
      </header>

      {/* Banner */}
      <div className="mx-3 sm:mx-4 mt-3">
        <div className="rounded-2xl p-4 md:p-5 bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-rose-600 text-white shadow-xl">
          <div className="max-w-5xl mx-auto flex items-center gap-3">
            <div className="text-lg md:text-xl font-extrabold">{t.profileBanner}</div>
            {profile.verified && (
              <span className="ms-auto text-[11px] font-black bg-white/20 px-2 py-1 rounded-full">{t.verified}</span>
            )}
            {profile.premium && (
              <span className="text-[11px] font-black bg-white/20 px-2 py-1 rounded-full">{t.premium}</span>
            )}
          </div>
        </div>
      </div>

      {/* Gövde */}
      <main className="px-3 sm:px-4 py-4 pb-28 max-w-5xl mx-auto grid md:grid-cols-[300px,1fr] gap-6">
        {/* Sol Kartlar */}
        <aside className="md:sticky md:top-[76px] self-start space-y-4">
          {/* Hakkımda */}
          <section className="panel p-4">
            <div className="text-sm font-bold mb-2">{t.about}</div>
            <p className="text-slate-300 leading-6 whitespace-pre-wrap">
              {profile.about || t.aboutPlaceholder}
            </p>
          </section>

          {/* Rozetler */}
          <section className="panel p-4">
            <div className="text-sm font-bold mb-2">{t.badges}</div>
            <div className="flex flex-wrap gap-2">
              {profile.badges?.length ? (
                profile.badges.map((b, i) => (
                  <span key={i} className="text-[12px] bg-slate-800/70 border border-slate-700 px-2 py-1 rounded-full">{String(b)}</span>
                ))
              ) : (
                <span className="text-[12px] text-slate-400">{t.noBadges}</span>
              )}
            </div>
          </section>

          {/* Şikayet */}
          <section className="panel p-4">
            <button className="w-full btnDanger" onClick={() => alert(t.reported)}>{t.report}</button>
          </section>
        </aside>

        {/* Sağ İçerik */}
        <section className="space-y-6">
          {/* İlanlar Sekmesi */}
          <div className="panel p-4">
            <div className="flex items-center gap-2 flex-wrap">
              <button className={`btnGhost ${tab==='pending' ? 'ring-2 ring-rose-500' : ''}`} onClick={()=>setTab('pending')}>{t.pendingListings}</button>
              <button className={`btnGhost ${tab==='live' ? 'ring-2 ring-emerald-500' : ''}`} onClick={()=>setTab('live')}>{t.liveListings}</button>
              <button className={`btnGhost ${tab==='expired' ? 'ring-2 ring-amber-500' : ''}`} onClick={()=>setTab('expired')}>{t.expiredListings}</button>
            </div>

            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {filtered.length ? filtered.map((it) => (
                <div key={it.id} className="relative panel cardSmall p-2">
                  <div className="aspect-square rounded-lg bg-slate-800/60 border border-slate-700" />
                  <div className="mt-2 font-semibold text-[13px] truncate text-slate-100">{it.title}</div>
                </div>
              )) : (
                <div className="col-span-full text-slate-400 text-sm">{t.noListings}</div>
              )}
            </div>
          </div>

          {/* Puan & Yorum Özeti */}
          <div className="panel p-4" id="reviews">
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold">{t.rating}</div>
              <button className="btnGhost" onClick={()=>alert(t.showAllReviews)}>{t.reviews}</button>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Stars value={profile.stats.rating} />
              <div className="text-sm text-slate-300">{profile.stats.rating ? profile.stats.rating.toFixed(1) : "—"} ({profile.stats.ratingCount})</div>
            </div>
            <p className="mt-2 text-[12px] text-slate-400">{t.noSelfRate}</p>
          </div>
        </section>
      </main>

      {/* Legal Footer */}
      <footer className="border-t border-slate-800 bg-[#060a16] text-slate-400">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 flex flex-wrap gap-3 items-center text-[13px]">
          <a className="hover:underline" href="/legal/kurumsal">{t.corporate}</a>
          <a className="hover:underline" href="/legal/hakkimizda">{t.aboutUs}</a>
          <a className="hover:underline" href="/legal/iletisim">{t.contact}</a>
          <a className="hover:underline" href="/legal/gizlilik">{t.privacy}</a>
          <a className="hover:underline" href="/legal/kullanim-sartlari">{t.terms}</a>
          <a className="hover:underline" href="/legal/teslimat-iade">{t.shippingReturn}</a>
          <a className="hover:underline" href="/legal/cerez-politikasi">{t.cookies}</a>
          <span className="ml-auto opacity-80">© 2025 Üreten Eller</span>
        </div>
      </footer>

      {/* Alt Navigasyon */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0b1224]/90 backdrop-blur border-t border-slate-800 px-4 py-2 flex items-center justify-around z-20">
        <a href="/" className="navBtn">{t.home}</a>
        <a href="/portal/customer" className="navBtn">{t.messages}</a>
        <a href="/portal/seller" className="navBtn">{t.notifications}</a>
      </nav>

      {/* AYARLAR MODALI */}
      {showSettings && (
        <Modal onClose={()=>setShowSettings(false)} title={t.settings}>
          <div className="flex flex-wrap gap-2 text-sm mb-3">
            <button className={`btnGhost ${settingsTab==='profile'?'ring-2 ring-indigo-500':''}`} onClick={()=>setSettingsTab('profile')}>{t.profileTab}</button>
            <button className={`btnGhost ${settingsTab==='location'?'ring-2 ring-fuchsia-500':''}`} onClick={()=>setSettingsTab('location')}>{t.locationTab}</button>
            <button className={`btnGhost ${settingsTab==='security'?'ring-2 ring-rose-500':''}`} onClick={()=>setSettingsTab('security')}>{t.securityTab}</button>
          </div>

          {/* Profil (Avatar) */}
          {settingsTab === "profile" && (
            <div className="space-y-3">
              <div className="font-semibold">{t.changeAvatar}</div>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-800 border border-slate-700">
                  {avatarPreview || profile.avatarUrl ? (
                    <img src={avatarPreview || profile.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-slate-400">{initials(profile.name)}</div>
                  )}
                </div>
                <label className="btnGhost cursor-pointer">
                  {t.uploadNewPhoto}
                  <input type="file" accept="image/*" className="hidden" onChange={onAvatarFile} />
                </label>
                <button className="btnPrimary" onClick={saveAvatar} disabled={!avatarPreview}>{t.save}</button>
              </div>
            </div>
          )}

          {/* Konum (Şehir) */}
          {settingsTab === "location" && (
            <div className="space-y-3">
              <div className="font-semibold">{t.changeCity}</div>
              <input
                value={cityDraft}
                onChange={(e)=>setCityDraft(e.target.value)}
                className="w-full border border-slate-700 bg-[#0f172a] text-slate-100 rounded-lg px-3 py-2"
                placeholder={t.cityPlaceholder}
              />
              <div className="flex items-center justify-end">
                <button className="btnPrimary" onClick={saveCity}>{t.save}</button>
              </div>
            </div>
          )}

          {/* Güvenlik (Şifre) */}
          {settingsTab === "security" && (
            <form className="space-y-3" onSubmit={changePassword}>
              <div className="font-semibold">{t.changePassword}</div>
              <label className="block">
                <span className="text-[12px]">{t.currentPassword}</span>
                <input type="password" value={pw.current} onChange={(e)=>setPw({...pw, current:e.target.value})}
                  className="w-full mt-1 border border-slate-700 bg-[#0f172a] text-slate-100 rounded-lg px-3 py-2" />
              </label>
              <label className="block">
                <span className="text-[12px]">{t.newPassword}</span>
                <input type="password" value={pw.next} onChange={(e)=>setPw({...pw, next:e.target.value})}
                  className="w-full mt-1 border border-slate-700 bg-[#0f172a] text-slate-100 rounded-lg px-3 py-2" />
              </label>
              <label className="block">
                <span className="text-[12px]">{t.confirmPassword}</span>
                <input type="password" value={pw.again} onChange={(e)=>setPw({...pw, again:e.target.value})}
                  className="w-full mt-1 border border-slate-700 bg-[#0f172a] text-slate-100 rounded-lg px-3 py-2" />
              </label>
              <div className="flex items-center justify-end gap-2">
                <button type="button" className="btnGhost" onClick={()=>setPw({current:"",next:"",again:""})}>{t.cancel}</button>
                <button type="submit" className="btnPrimary">{t.updatePassword}</button>
              </div>
            </form>
          )}
        </Modal>
      )}

      {/* Stil */}
      <style>{`
        /* Butonlar */
        .btnPrimary{border:1px solid #4f46e5;background:#4f46e5;color:#fff;border-radius:12px;padding:8px 12px;font-weight:800}
        .btnGhost{border:1px solid #334155;background:#0b1224;color:#e2e8f0;border-radius:10px;padding:8px 10px;font-weight:700}
        .btnDanger{border:1px solid #7f1d1d;background:#991b1b;color:#fff;border-radius:12px;padding:10px 12px;font-weight:900}
        .navBtn{font-weight:800;padding:8px 12px;border-radius:10px;border:1px solid #334155;background:#0b1224;color:#e2e8f0}

        /* Kartlar */
        .panel{background:linear-gradient(180deg,rgba(17,24,39,.85),rgba(15,23,42,.9));border:1px solid rgba(148,163,184,.15);border-radius:16px;box-shadow:0 10px 24px -12px rgba(2,6,23,.4)}
        .cardSmall{transition:transform .15s ease, box-shadow .15s ease}
        .cardSmall:hover{transform:translateY(-2px);box-shadow:0 12px 24px -16px rgba(59,130,246,.35)}

        /* Premium çerçeve */
        .goldRing:before{content:"";position:absolute;inset:-3px;border-radius:9999px;padding:2px;background:conic-gradient(from 0deg,#f59e0b,#fde68a,#f59e0b);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude}
      `}</style>
    </div>
  );
}

/* ==== Modal ==== */
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>
      <div className="relative z-40 w-[min(640px,92vw)] panel p-4">
        <div className="flex items-center justify-between">
          <div className="text-lg font-extrabold">{title}</div>
          <button className="btnGhost" onClick={onClose}>✕</button>
        </div>
        <div className="mt-3 text-sm">{children}</div>
      </div>
    </div>
  );
}

/* ==== Yıldız ==== */
function Stars({ value }) {
  const v = typeof value === "number" ? Math.max(0, Math.min(5, value)) : 0;
  return (
    <div className="inline-flex items-center gap-1" aria-label="rating">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill={i + 1 <= Math.round(v) ? "currentColor" : "none"} stroke="currentColor" className={i + 1 <= Math.round(v) ? "text-amber-400" : "text-slate-600"}>
          <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}

/* ==== Yardımcılar ==== */
function initials(name) {
  if (!name) return "?";
  return name.split(" ").filter(Boolean).slice(0, 2).map((s) => s[0]).join("").toUpperCase();
}

/* ==== Metinler ==== */
const texts = {
  tr: {
    seller: "Satıcı",
    language: "Dil",
    settings: "Ayarlar",
    profileTab: "Profil",
    locationTab: "Konum",
    securityTab: "Güvenlik",
    changeAvatar: "Profil resmi",
    uploadNewPhoto: "Yeni fotoğraf yükle",
    save: "Kaydet",
    changeCity: "Şehri değiştir",
    cityPlaceholder: "Şehir",
    changePassword: "Şifre değiştir",
    currentPassword: "Mevcut şifre",
    newPassword: "Yeni şifre",
    confirmPassword: "Yeni şifre (tekrar)",
    updatePassword: "Şifreyi güncelle",
    fillAll: "Lütfen tüm alanları doldurun.",
    pwNoMatch: "Şifreler uyuşmuyor.",
    pwTooShort: "Şifre en az 6 karakter olmalı.",
    pwChanged: "Şifre güncellendi.",
    saved: "Kaydedildi.",
    profileBanner: "Satıcı Profiliniz",
    verified: "Onaylı Satıcı",
    premium: "Premium",
    about: "Hakkımda",
    aboutPlaceholder: "Kendinizi ve ürünlerinizi kısaca anlatın…",
    badges: "Güven Rozetleri",
    noBadges: "Rozet yok",
    report: "Şikayet et / Bildir",
    reported: "Şikayetiniz alındı.",
    pendingListings: "Onay Bekleyen",
    liveListings: "Yayında",
    expiredListings: "Süresi Biten",
    noListings: "Gösterilecek ilan yok.",
    rating: "Puan",
    reviews: "Yorumlar",
    noSelfRate: "Kendi kendine puan verilemez.",
    corporate: "Kurumsal",
    aboutUs: "Hakkımızda",
    contact: "İletişim",
    privacy: "Gizlilik",
    terms: "Kullanım Şartları",
    shippingReturn: "Teslimat & İade",
    cookies: "Çerez Politikası",
    home: "Ana Sayfa",
    messages: "Mesajlar",
    notifications: "Bildirimler",
  },
  en: {
    seller: "Seller",
    language: "Language",
    settings: "Settings",
    profileTab: "Profile",
    locationTab: "Location",
    securityTab: "Security",
    changeAvatar: "Profile photo",
    uploadNewPhoto: "Upload new photo",
    save: "Save",
    changeCity: "Change city",
    cityPlaceholder: "City",
    changePassword: "Change password",
    currentPassword: "Current password",
    newPassword: "New password",
    confirmPassword: "Confirm new password",
    updatePassword: "Update password",
    fillAll: "Please fill all fields.",
    pwNoMatch: "Passwords do not match.",
    pwTooShort: "Password must be at least 6 chars.",
    pwChanged: "Password updated.",
    saved: "Saved.",
    profileBanner: "Your Seller Profile",
    verified: "Verified Seller",
    premium: "Premium",
    about: "About",
    aboutPlaceholder: "Briefly describe yourself and your products…",
    badges: "Trust Badges",
    noBadges: "No badges",
    report: "Report",
    reported: "Your report has been received.",
    pendingListings: "Pending",
    liveListings: "Live",
    expiredListings: "Expired",
    noListings: "No listings to show.",
    rating: "Rating",
    reviews: "Reviews",
    noSelfRate: "Self-rating is not allowed.",
    corporate: "Corporate",
    aboutUs: "About Us",
    contact: "Contact",
    privacy: "Privacy",
    terms: "Terms",
    shippingReturn: "Shipping & Returns",
    cookies: "Cookie Policy",
    home: "Home",
    messages: "Messages",
    notifications: "Notifications",
  },
  ar: {
    seller: "البائع",
    language: "اللغة",
    settings: "الإعدادات",
    profileTab: "الملف",
    locationTab: "الموقع",
    securityTab: "الأمان",
    changeAvatar: "الصورة الشخصية",
    uploadNewPhoto: "تحميل صورة جديدة",
    save: "حفظ",
    changeCity: "تغيير المدينة",
    cityPlaceholder: "المدينة",
    changePassword: "تغيير كلمة المرور",
    currentPassword: "كلمة المرور الحالية",
    newPassword: "كلمة المرور الجديدة",
    confirmPassword: "تأكيد كلمة المرور",
    updatePassword: "تحديث كلمة المرور",
    fillAll: "يرجى تعبئة جميع الحقول.",
    pwNoMatch: "كلمتا المرور غير متطابقتين.",
    pwTooShort: "يجب أن تكون كلمة المرور 6 أحرف على الأقل.",
    pwChanged: "تم تحديث كلمة المرور.",
    saved: "تم الحفظ.",
    profileBanner: "ملف البائع",
    verified: "بائع موثّق",
    premium: "بريميوم",
    about: "نبذة",
    aboutPlaceholder: "عرّف نفسك ومنتجاتك بإيجاز…",
    badges: "شارات الثقة",
    noBadges: "لا توجد شارات",
    report: "إبلاغ",
    reported: "تم استلام البلاغ.",
    pendingListings: "بانتظار الموافقة",
    liveListings: "نشط",
    expiredListings: "منتهي",
    noListings: "لا توجد إعلانات.",
    rating: "التقييم",
    reviews: "المراجعات",
    noSelfRate: "لا يُسمح بالتقييم الذاتي.",
    corporate: "الشركة",
    aboutUs: "من نحن",
    contact: "اتصال",
    privacy: "الخصوصية",
    terms: "الشروط",
    shippingReturn: "الشحن والإرجاع",
    cookies: "سياسة الكوكيز",
    home: "الصفحة الرئيسية",
    messages: "الرسائل",
    notifications: "الإشعارات",
  },
  de: {
    seller: "Verkäufer",
    language: "Sprache",
    settings: "Einstellungen",
    profileTab: "Profil",
    locationTab: "Standort",
    securityTab: "Sicherheit",
    changeAvatar: "Profilbild",
    uploadNewPhoto: "Neues Foto hochladen",
    save: "Speichern",
    changeCity: "Stadt ändern",
    cityPlaceholder: "Stadt",
    changePassword: "Passwort ändern",
    currentPassword: "Aktuelles Passwort",
    newPassword: "Neues Passwort",
    confirmPassword: "Neues Passwort (Wdh.)",
    updatePassword: "Passwort aktualisieren",
    fillAll: "Bitte alle Felder ausfüllen.",
    pwNoMatch: "Passwörter stimmen nicht überein.",
    pwTooShort: "Mindestens 6 Zeichen.",
    pwChanged: "Passwort aktualisiert.",
    saved: "Gespeichert.",
    profileBanner: "Ihr Verkäuferprofil",
    verified: "Verifizierter Verkäufer",
    premium: "Premium",
    about: "Über mich",
    aboutPlaceholder: "Beschreiben Sie sich und Ihre Produkte kurz…",
    badges: "Vertrauensabzeichen",
    noBadges: "Keine Abzeichen",
    report: "Melden",
    reported: "Deine Meldung wurde erhalten.",
    pendingListings: "Ausstehend",
    liveListings: "Aktiv",
    expiredListings: "Abgelaufen",
    noListings: "Keine Anzeigen vorhanden.",
    rating: "Bewertung",
    reviews: "Bewertungen",
    noSelfRate: "Selbstbewertung ist nicht erlaubt.",
    corporate: "Unternehmen",
    aboutUs: "Über uns",
    contact: "Kontakt",
    privacy: "Datenschutz",
    terms: "Nutzungsbedingungen",
    shippingReturn: "Lieferung & Rückgabe",
    cookies: "Cookie-Richtlinie",
    home: "Startseite",
    messages: "Nachrichten",
    notifications: "Benachrichtigungen",
  },
};
