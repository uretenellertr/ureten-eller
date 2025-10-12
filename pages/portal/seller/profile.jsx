"use client";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

/* ---------------------------- FIREBASE ---------------------------- */
import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCd9GjP6CDA8i4XByhXDHyESy-g_DHVwvQ",
  authDomain: "ureteneller-ecaac.firebaseapp.com",
  projectId: "ureteneller-ecaac",
  storageBucket: "ureteneller-ecaac.firebasestorage.app",
  messagingSenderId: "368042877151",
  appId: "1:368042877151:web:ee0879fc4717928079c96a",
  measurementId: "G-BJHKN8V4RQ",
};
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);

/* ---------------------------- DİL / METİN ---------------------------- */
const SUPPORTED = ["tr", "en", "ar", "de"]; // RTL: ar
const L = {
  tr: {
    title: "Profil",
    pro: "PRO Üyelik",
    verified: "Onaylı Satıcı",
    upgrade: "Yükselt",
    manage: "Yönet",
    stats: { published: "Yayında", showcase: "Vitrin", pending: "Onay Bekleyen", expired: "Süresi Biten" },
    tabs: { overview: "Genel", listings: "İlanlarım", reviews: "Yorumlar", orders: "Siparişler", settings: "Ayarlar" },
    quick: { vacation: "Tatil Modu", confirmOrders: "Sipariş Onayları" },
    listings: {
      create: "Yeni İlan",
      empty: "Henüz ilan yok.",
      sections: { showcase: "✨ Vitrin", published: "🧺 Yayında", pending: "⏳ Onay Bekleyen", expired: "⌛ Süresi Biten" },
      actions: {
        feature: "Vitrine Yayınla",
        unfeature: "Vitrinden Kaldır",
        edit: "Düzenle",
        delete: "Sil",
        renew: "Süreyi Uzat",
      },
      badges: { pro: "PRO", verified: "Onaylı", pending: "Onay Bekliyor", expired: "Süresi Bitti" },
    },
    reviews: { avg: "Ortalama", onlyBuyers: "Yalnızca siparişi onaylanan müşteriler yorum/puan verebilir.", delete: "Sil" },
    orders: { awaiting: "Onay Bekleyen Teslimatlar", confirm: "Teslimatı Onayla", cancel: "İptal", empty: "Bekleyen sipariş yok." },
    settings: {
      profile: "Profil Bilgileri",
      name: "Ad Soyad",
      email: "E‑posta",
      phone: "Telefon",
      save: "Kaydet",
      saved: "Kaydedildi",
      address: "Adres Bilgisi",
      addressLine: "Adres",
      city: "Şehir",
      district: "İlçe",
      postal: "Posta Kodu",
      password: "Şifre",
      pwNoteGoogle: "Google ile giriş yaptığınız için şifre burada yönetilmiyor.",
      resetMail: "Sıfırlama E-postası Gönder",
      avatar: "Avatar / Profil Fotoğrafı",
      upload: "Yükle",
      resetAvatar: "Google Fotosuna Dön",
    },
    brand: "Üreten Eller",
    bottom: { home: "Ana Sayfa", messages: "Mesajlar", notifs: "Bildirimler" },
    legalBar: "Kurumsal",
    legal: {
      corporate: "Kurumsal",
      about: "Hakkımızda",
      contact: "İletişim",
      privacy: "Gizlilik",
      kvkk: "KVKK Aydınlatma",
      terms: "Kullanım Şartları",
      distance: "Mesafeli Satış",
      shippingReturn: "Teslimat & İade",
      cookies: "Çerez Politikası",
      rules: "Topluluk Kuralları",
      banned: "Yasaklı Ürünler",
      all: "Tüm Legal",
    },
  },
};

function useLang() {
  const [lang, setLang] = useState("tr");
  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved && SUPPORTED.includes(saved)) setLang(saved);
  }, []);
  useEffect(() => { localStorage.setItem("lang", lang); }, [lang]);
  const t = useMemo(() => L[lang] || L.tr, [lang]);
  return { lang, setLang, t };
}

  /* ---------------------------- Yardımcılar ---------------------------- */
 const GOLD = "linear-gradient(135deg,#f59e0b,#f97316,#fbbf24)";

 const isBrowser =
   typeof window !== "undefined" && typeof window.localStorage !== "undefined";
 function loadLocal(key, fallback) {
   if (!isBrowser) return fallback;
   try {
     const raw = window.localStorage.getItem(key);
     return raw === null ? fallback : JSON.parse(raw);
   } catch {
     return fallback;
   }
 }
 function saveLocal(key, v) {
  if (!isBrowser) return;
  try { window.localStorage.setItem(key, JSON.stringify(v)); } catch {}
}

/* ---------------------------- Ana Bileşen ---------------------------- */
export default function SellerProfilePage() {
  const router = useRouter();
  const { lang, setLang, t } = useLang();

  const [user, setUser] = useState(null);
  const [isPro, setIsPro] = useState(loadLocal("isPro", true));
  const [vacation, setVacation] = useState(loadLocal("vacation", false));
  const [avatar, setAvatar] = useState(loadLocal("avatar", ""));

  // İlanlar
  const [ads, setAds] = useState([]);

  // Siparişler (örnek)
  const [orders, setOrders] = useState(loadLocal("orders_waiting", [
    { id: "o1", title: "Ev Yapımı Mantı", buyer: "Ayşe K.", total: "₺240", date: Date.now() - 86400000 },
    { id: "o2", title: "Lavanta Kesesi", buyer: "Mehmet T.", total: "₺120", date: Date.now() - 3600 * 1000 * 15 },
  ]));

  // Yorumlar (örnek – herkese görünür, silme: yazar veya admin)
  const [reviews, setReviews] = useState(loadLocal("reviews", [
    { id: "r1", fromName: "Zeynep D.", fromEmail: "zeynep@example.com", stars: 5, text: "Harika paketleme ve hızlı teslim!", date: Date.now() - 5 * 86400000 },
    { id: "r2", fromName: "Ali V.", fromEmail: "ali@example.com", stars: 4, text: "Tatlılar çok lezzetliydi.", date: Date.now() - 10 * 86400000 },
  ]));
  const avgStars = reviews.length ? (reviews.reduce((s, r) => s + r.stars, 0) / reviews.length).toFixed(1) : "-";

  /* ---------------- Auth ---------------- */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) localStorage.setItem("authed", "1"); else localStorage.removeItem("authed");
      // Google ise bilgileri otomatik doldur
      if (u && u.providerData?.some((p) => p.providerId === GoogleAuthProvider.PROVIDER_ID)) {
        const base = {
          name: u.displayName || "",
          email: u.email || "",
          phone: u.phoneNumber || "",
        };
        const addr = loadLocal("address", null) ?? { addressLine: "", city: "", district: "", postal: "" };
        saveLocal("profile", { ...base });
        saveLocal("address", addr);
        if (!avatar && u.photoURL) setAvatar(u.photoURL);
      }
    });
    return () => unsub();
  }, [avatar]);

  /* ---------------- Ads load ---------------- */
  useEffect(() => {
    let alive = true;
    (async () => {
      // Önce yerel "myAds" varsa onu kullan
      const local = loadLocal("myAds", null);
      if (local) { setAds(decorateAds(local)); return; }
      try {
        const res = await fetch("/ads.json", { cache: "no-store" });
        if (res.ok) {
          const all = await res.json();
          const mine = decorateAds((all || []).slice(0, 9));
          if (alive) setAds(mine);
          saveLocal("myAds", mine);
          return;
        }
      } catch {}
      if (alive) setAds([]);
    })();
    return () => { alive = false; };
  }, []);

  const stats = useMemo(() => ({
    published: ads.filter((a) => a.status === "published").length,
    pending: ads.filter((a) => a.status === "pending").length,
    expired: ads.filter((a) => a.status === "expired").length,
    showcase: ads.filter((a) => a.isFeatured).length,
  }), [ads]);

  /* ---------------- Actions ---------------- */
  const updateAds = (fn) => setAds((prev) => { const next = fn([...prev]); saveLocal("myAds", next); return next; });

  const featureAd = (id, v) => updateAds((arr) => arr.map((a) => a.id === id ? { ...a, isFeatured: !!v } : a));
  const editAd = (id) => router.push(`/portal/seller/post?id=${encodeURIComponent(id)}`);
  const deleteAd = (id) => updateAds((arr) => arr.filter((a) => a.id !== id));
  const renewAd = (id) => updateAds((arr) => arr.map((a) => a.id === id ? { ...a, status: "published", expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30 } : a));

  const confirmOrder = (id) => {
    const left = orders.filter((o) => o.id !== id);
    setOrders(left); saveLocal("orders_waiting", left);
  };

  const deleteReview = (id) => {
    const me = user?.email || "";
    const isAdmin = loadLocal("role", "user") === "admin";
    const rv = reviews.find((r) => r.id === id);
    if (!rv) return;
    if (isAdmin || rv.fromEmail === me) {
      const next = reviews.filter((r) => r.id !== id);
      setReviews(next); saveLocal("reviews", next);
    } else {
      alert("Yalnızca yorumu yazan kişi veya admin silebilir.");
    }
  };

  const onToggleVacation = () => { const nv = !vacation; setVacation(nv); saveLocal("vacation", nv); };

  const onAvatarChange = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const data = reader.result;
      setAvatar(data); saveLocal("avatar", data);
      if (auth.currentUser) {
        try { await updateProfile(auth.currentUser, { photoURL: data }); } catch {}
      }
    };
    reader.readAsDataURL(file);
  };

  const onAvatarReset = async () => {
    if (user?.photoURL) { setAvatar(user.photoURL); saveLocal("avatar", user.photoURL); }
  };

  const onSaveProfile = () => {
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = user?.email || document.getElementById("email").value.trim();
    saveLocal("profile", { name, phone, email });
    alert(t.settings.saved);
  };

  const onSaveAddress = () => {
    const addressLine = document.getElementById("addressLine").value.trim();
    const city = document.getElementById("city").value.trim();
    const district = document.getElementById("district").value.trim();
    const postal = document.getElementById("postal").value.trim();
    saveLocal("address", { addressLine, city, district, postal });
    alert(t.settings.saved);
  };

  const onResetPassword = async () => {
    if (!user?.email) return alert("Hesap e‑postası bulunamadı.");
    try { await sendPasswordResetEmail(auth, user.email); alert("E‑posta gönderildi."); } catch { alert("Gönderilemedi."); }
  };

  // Varsayılan sekme
  const [tab, setTab] = useState("overview");

  // Form varsayılanları
  const prof = loadLocal("profile", { name: user?.displayName || "", email: user?.email || "", phone: "" });
  const addr = loadLocal("address", { addressLine: "", city: "", district: "", postal: "" });

  // Bölümlere ayrılmış ilanlar
  const showcaseAds = ads.filter((a) => a.isFeatured && a.status === "published");
  const publishedAds = ads.filter((a) => a.status === "published" && !a.isFeatured);
  const pendingAds = ads.filter((a) => a.status === "pending");
  const expiredAds = ads.filter((a) => a.status === "expired");

  return (
    <>
      <Head>
        <title>{t.brand} – {t.title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0b0b0b" />
      </Head>

      {/* TOPBAR */}
      <header className="topbar">
        <a className="brand" href="/">
          <img src="/logo.png" width="36" height="36" alt="logo" />
          <span>{t.brand}</span>
        </a>
        <div className="actions">
          <div className="leftActions">
            <button className="ghost" onClick={() => router.push("/portal/seller")}>{t.bottom.home}</button>
            <button className="ghost" onClick={() => router.push("/messages")}>{t.bottom.messages}</button>
            <button className="ghost" onClick={() => router.push("/notifications")}>{t.bottom.notifs}</button>
          </div>
          <select aria-label="Dil" value={lang} onChange={(e)=>setLang(e.target.value)}>
            {SUPPORTED.map(k => <option key={k} value={k}>{k.toUpperCase()}</option>)}
          </select>
        </div>
      </header>

      {/* KAFA ALANI */}
      <section className="hero">
        <div className="avatarWrap" style={{ background: isPro ? GOLD : undefined }}>
          <img className={isPro ? "avatar gold" : "avatar"} src={avatar || user?.photoURL || "/logo.png"} alt="avatar" />
        </div>
        <div className="info">
          <div className="nameRow">
            <h1 className="name">{prof.name || user?.displayName || "Satıcı"}</h1>
            {isPro && <span className="pill pro">{t.pro}</span>}
            <span className="pill verified">{t.verified}</span>
          </div>
          <div className="sub">
            <span>⭐ {avgStars} ({reviews.length})</span>
            <span>•</span>
            <span>{t.stats.published}: {stats.published}</span>
            <span>•</span>
            <span>{t.stats.showcase}: {stats.showcase}</span>
            <span>•</span>
            <span>{t.stats.pending}: {stats.pending}</span>
            <span>•</span>
            <span>{t.stats.expired}: {stats.expired}</span>
          </div>
          <div className="ctaRow">
            <button className="primary" onClick={() => setIsPro((x)=>{ saveLocal("isPro", !x); return !x; })}>{isPro ? t.manage : t.upgrade}</button>
            <label className="switch"><input type="checkbox" checked={vacation} onChange={onToggleVacation} /><span className="slider" /> {t.quick.vacation}</label>
          </div>
        </div>
      </section>

      {/* SEKME BAŞLIKLARI */}
      <nav className="tabs" role="tablist">
        {["overview","listings","reviews","orders","settings"].map((k) => (
          <button key={k} role="tab" aria-selected={tab===k} className={tab===k?"tab active":"tab"} onClick={()=>setTab(k)}>
            {t.tabs[k]}
          </button>
        ))}
      </nav>

      {/* İÇERİK */}
      <main className="wrap">
        {tab === "overview" && (
          <section className="panel">
            <h2>Genel Bakış</h2>
            <ul className="bullets">
              <li>PRO üyelerde avatar ve ilan çerçeveleri <b>altın</b>, ilanlarda <b>“{t.verified}”</b> rozeti görünür.</li>
              <li>Yeni ilanlar önce <b>admin onayına</b> düşer, onaylanınca yayına girer.</li>
              <li>PRO ise, seçtiğiniz ilanı <b>Vitrine</b> taşıyabilirsiniz.</li>
              <li>Süresi biten ilanlar <b>{t.listings.sections.expired}</b> bölümüne düşer; <b>{t.listings.actions.renew}</b> ile uzatabilirsiniz.</li>
              <li>Yorumlar herkese görünür; <b>yalnızca siparişi onaylanan müşteri</b> bir kez puan & yorum bırakabilir. Silme: yorum sahibi veya admin.</li>
            </ul>
          </section>
        )}

        {tab === "listings" && (
          <section className="panel">
            <div className="panelHead">
              <h2>{t.tabs.listings}</h2>
              <button className="primary" onClick={()=>router.push("/portal/seller/post")}>{t.listings.create}</button>
            </div>

            {/* Showcase */}
            <h3 className="secTitle">{t.listings.sections.showcase} <small>({showcaseAds.length})</small></h3>
            <div className="grid ads">
              {showcaseAds.length ? showcaseAds.map((a)=> (
                <AdCard key={a.id} a={a} isPro={isPro} onEdit={editAd} onDelete={deleteAd} onFeature={(v)=>featureAd(a.id, v)} canFeature />
              )) : <Empty text={t.listings.empty} />}
            </div>

            {/* Published */}
            <h3 className="secTitle">{t.listings.sections.published} <small>({publishedAds.length})</small></h3>
            <div className="grid ads">
              {publishedAds.length ? publishedAds.map((a)=> (
                <AdCard key={a.id} a={a} isPro={isPro} onEdit={editAd} onDelete={deleteAd} onFeature={(v)=>featureAd(a.id, v)} canFeature />
              )) : <Empty text={t.listings.empty} />}
            </div>

            {/* Pending */}
            <h3 className="secTitle">{t.listings.sections.pending} <small>({pendingAds.length})</small></h3>
            <div className="grid ads">
              {pendingAds.length ? pendingAds.map((a)=> (
                <AdCard key={a.id} a={a} isPro={isPro} onEdit={editAd} onDelete={deleteAd} pending />
              )) : <Empty text={t.listings.empty} />}
            </div>

            {/* Expired */}
            <h3 className="secTitle">{t.listings.sections.expired} <small>({expiredAds.length})</small></h3>
            <div className="grid ads">
              {expiredAds.length ? expiredAds.map((a)=> (
                <AdCard key={a.id} a={a} isPro={isPro} onEdit={editAd} onDelete={deleteAd} onRenew={()=>renewAd(a.id)} expired />
              )) : <Empty text={t.listings.empty} />}
            </div>
          </section>
        )}

        {tab === "reviews" && (
          <section className="panel">
            <h2>{t.tabs.reviews} – ⭐ {avgStars}</h2>
            <p className="muted">{t.reviews.onlyBuyers}</p>
            <div className="reviews">
              {reviews.length ? reviews.map((r)=> (
                <div key={r.id} className="review">
                  <div className="revHead">
                    <div className="stars" aria-label={`${r.stars} yıldız`}>{"★".repeat(r.stars)}{"☆".repeat(5 - r.stars)}</div>
                    <div className="who">{r.fromName}</div>
                    <div className="date">{new Date(r.date).toLocaleDateString()}</div>
                    <button className="ghost small" onClick={()=>deleteReview(r.id)}>{t.reviews.delete}</button>
                  </div>
                  <p className="txt">{r.text}</p>
                </div>
              )) : <Empty text="Henüz yorum yok." />}
            </div>
          </section>
        )}

        {tab === "orders" && (
          <section className="panel">
            <h2>{t.orders.awaiting}</h2>
            {orders.length ? (
              <div className="orders">
                {orders.map((o)=> (
                  <div key={o.id} className="order">
                    <div className="oMain">
                      <div className="oTitle">{o.title}</div>
                      <div className="oMeta">{o.buyer} • {new Date(o.date).toLocaleString()} • {o.total}</div>
                    </div>
                    <div className="oAct">
                      <button className="primary" onClick={()=>confirmOrder(o.id)}>{t.orders.confirm}</button>
                      <button className="ghost" onClick={()=>confirmOrder(o.id)}>{t.orders.cancel}</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Empty text={t.orders.empty} />
            )}
          </section>
        )}

        {tab === "settings" && (
          <section className="panel">
            <h2>{t.tabs.settings}</h2>

            <div className="settingsGrid">
              {/* Profil Bilgileri */}
              <div className="card">
                <h3>{t.settings.profile}</h3>
                <div className="formRow">
                  <label>{t.settings.name}</label>
                  <input id="name" defaultValue={prof.name || user?.displayName || ""} />
                </div>
                <div className="formRow">
                  <label>{t.settings.email}</label>
                  <input id="email" defaultValue={user?.email || prof.email || ""} disabled={!!user?.email} />
                </div>
                <div className="formRow">
                  <label>{t.settings.phone}</label>
                  <input id="phone" defaultValue={prof.phone || ""} />
                </div>
                <button className="primary" onClick={onSaveProfile}>{t.settings.save}</button>
              </div>

              {/* Adres */}
              <div className="card">
                <h3>{t.settings.address}</h3>
                <div className="formRow"><label>{t.settings.addressLine}</label><input id="addressLine" defaultValue={addr.addressLine} /></div>
                <div className="formGrid">
                  <div className="formRow"><label>{t.settings.city}</label><input id="city" defaultValue={addr.city} /></div>
                  <div className="formRow"><label>{t.settings.district}</label><input id="district" defaultValue={addr.district} /></div>
                  <div className="formRow"><label>{t.settings.postal}</label><input id="postal" defaultValue={addr.postal} /></div>
                </div>
                <button className="primary" onClick={onSaveAddress}>{t.settings.save}</button>
              </div>

              {/* Avatar */}
              <div className="card">
                <h3>{t.settings.avatar}</h3>
                <div className="avatarEdit">
                  <div className="avatarWrap small" style={{ background: isPro ? GOLD : undefined }}>
                    <img className={isPro ? "avatar gold" : "avatar"} src={avatar || user?.photoURL || "/logo.png"} alt="avatar" />
                  </div>
                  <div className="btns">
                    <label className="ghost" role="button">
                      {t.settings.upload}
                      <input type="file" accept="image/*" onChange={onAvatarChange} hidden />
                    </label>
                    <button className="ghost" onClick={onAvatarReset}>{t.settings.resetAvatar}</button>
                  </div>
                </div>
              </div>

              {/* Şifre */}
              <div className="card">
                <h3>{t.settings.password}</h3>
                {user?.providerData?.some((p) => p.providerId === GoogleAuthProvider.PROVIDER_ID) ? (
                  <p className="muted">{t.settings.pwNoteGoogle}</p>
                ) : (
                  <p className="muted">Şifrenizi sıfırlamak için e‑posta alabilirsiniz.</p>
                )}
                <button className="primary" onClick={onResetPassword}>{t.settings.resetMail}</button>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* ALT GEZİNME */}
      <nav className="bottombar" aria-label="Bottom Navigation">
        <button className="tabBtn" onClick={()=>router.push("/portal/seller")}><span>🏠</span><span>{t.bottom.home}</span></button>
        <button className="tabBtn" onClick={()=>router.push("/messages")}><span>💬</span><span>{t.bottom.messages}</span></button>
        <button className="tabBtn" onClick={()=>router.push("/notifications")}><span>🔔</span><span>{t.bottom.notifs}</span></button>
      </nav>

      {/* LEGAL FOOTER */}
      <footer className="legal">
        <div className="inner">
          <div className="ttl">{t.legalBar}</div>
          <nav className="links" aria-label={t.legalBar}>
            <a href="/legal/kurumsal">{t.legal.corporate}</a>
            <a href="/legal/hakkimizda">{t.legal.about}</a>
            <a href="/legal/iletisim">{t.legal.contact}</a>
            <a href="/legal/gizlilik">{t.legal.privacy}</a>
            <a href="/legal/kvkk-aydinlatma">{t.legal.kvkk}</a>
            <a href="/legal/kullanim-sartlari">{t.legal.terms}</a>
            <a href="/legal/mesafeli-satis-sozlesmesi">{t.legal.distance}</a>
            <a href="/legal/teslimat-iade">{t.legal.shippingReturn}</a>
            <a href="/legal/cerez-politikasi">{t.legal.cookies}</a>
            <a href="/legal/topluluk-kurallari">{t.legal.rules}</a>
            <a href="/legal/yasakli-urunler">{t.legal.banned}</a>
            <a href="/legal" className="homeLink">{t.legal.all}</a>
          </nav>
          <div className="copy">© {new Date().getFullYear()} {t.brand}</div>
        </div>
      </footer>

      {/* STYLES */}
      <style>{`
        :root{ --ink:#0f172a; --muted:#475569; --line:rgba(0,0,0,.08); }
        html,body{height:100%}
        body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial,sans-serif;color:var(--ink);
          background: radial-gradient(1200px 600px at 10% -10%, #ffe4e6, transparent),
                      radial-gradient(900px 500px at 90% -10%, #e0e7ff, transparent),
                      linear-gradient(120deg,#ff80ab,#a78bfa,#60a5fa,#34d399);
          background-attachment:fixed;}

        /* TOPBAR */
        .topbar{position:sticky;top:0;z-index:50;display:grid;grid-template-columns:1fr auto;gap:12px;align-items:center;
          padding:10px 14px;background:rgba(255,255,255,.92);backdrop-filter:blur(8px);border-bottom:1px solid var(--line)}
        .brand{display:flex;align-items:center;gap:8px;font-weight:900;text-decoration:none;color:inherit}
        .actions{display:flex;gap:10px;align-items:center}
        .leftActions{display:flex;gap:8px}
        .ghost{border:1px solid var(--line);background:#fff;border-radius:10px;padding:8px 12px;font-weight:700;cursor:pointer}
        .primary{border:1px solid #111827;background:#111827;color:#fff;border-radius:10px;padding:8px 12px;font-weight:800;cursor:pointer}
        select{border:1px solid var(--line);border-radius:10px;padding:6px 8px;background:#fff}

        /* HERO */
        .hero{display:flex;gap:16px;align-items:center;max-width:1100px;margin:12px auto 0;padding:0 16px}
        .avatarWrap{padding:3px;border-radius:999px;display:inline-grid;place-items:center}
        .avatarWrap.small{padding:2px}
        .avatar{width:92px;height:92px;border-radius:999px;display:block;border:3px solid #fff;box-shadow:0 8px 22px rgba(0,0,0,.15)}
        .avatar.gold{box-shadow:0 8px 28px rgba(249, 115, 22, .45)}
        .info{display:flex;flex-direction:column;gap:6px}
        .nameRow{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
        .name{margin:0;font-size:28px}
        .pill{border-radius:999px;padding:4px 10px;font-size:12px;font-weight:800;display:inline-flex;align-items:center;gap:6px}
        .pill.pro{background:linear-gradient(135deg,#f59e0b,#f97316,#fbbf24);color:#111827}
        .pill.verified{background:#10b981;color:#fff}
        .sub{display:flex;gap:8px;align-items:center;color:var(--muted);font-size:14px}
        .ctaRow{display:flex;gap:10px;align-items:center;flex-wrap:wrap}

        /* SWITCH */
        .switch{display:inline-flex;align-items:center;gap:8px;cursor:pointer;user-select:none}
        .switch input{display:none}
        .slider{width:38px;height:22px;border-radius:999px;background:#e5e7eb;position:relative;display:inline-block}
        .slider::after{content:"";position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:999px;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.2);transition:.2s}
        .switch input:checked + .slider{background:#111827}
        .switch input:checked + .slider::after{transform:translateX(16px)}

        /* TABS */
        .tabs{max-width:1100px;margin:10px auto 0;display:flex;gap:8px;padding:0 16px;flex-wrap:wrap}
        .tab{border:1px solid var(--line);background:#fff;border-radius:10px;padding:8px 12px;font-weight:800;cursor:pointer}
        .tab.active{background:#111827;border-color:#111827;color:#fff}

        /* WRAP */
        .wrap{max-width:1100px;margin:10px auto;padding:0 16px 16px}
        .panel{background:#fff;border:1px solid #e5e7eb;border-radius:16px;box-shadow:0 8px 22px rgba(0,0,0,.06);padding:14px}
        .panelHead{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}
        .bullets{margin:8px 0 0;padding-left:18px}

        /* ADS */
        .secTitle{margin:14px 2px 8px}
        .grid.ads{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}
        .ad{border:2px solid transparent;border-radius:16px;overflow:hidden;background:#fff;display:flex;flex-direction:column;box-shadow:0 8px 22px rgba(0,0,0,.06)}
        .ad.gold{border-image:linear-gradient(135deg,#f59e0b,#f97316,#fbbf24) 1}
        .thumb{aspect-ratio:4/3;background:#f1f5f9;background-size:cover;background-position:center;position:relative}
        .badge{position:absolute;top:8px;left:8px;background:#111827;color:#fff;font-size:12px;padding:4px 8px;border-radius:999px}
        .badge.green{background:#10b981}
        .badge.orange{background:#f59e0b;color:#111827}
        .badge.gray{background:#475569}
        .body{padding:10px}
        .title{font-weight:800;margin:0 0 6px}
        .meta{display:flex;justify-content:space-between;color:#475569;font-size:13px}
        .actions{display:flex;gap:6px;padding:0 10px 12px}
        .ghost.small{border:1px solid var(--line);background:#fff;border-radius:10px;padding:6px 10px;font-weight:700;cursor:pointer}

        .empty{padding:18px;border:1px dashed #e5e7eb;border-radius:14px;text-align:center;color:#475569}

        /* REVIEWS */
        .reviews{display:grid;gap:12px}
        .review{border:1px solid #e5e7eb;border-radius:14px;padding:10px;background:#fff}
        .revHead{display:flex;gap:10px;align-items:center}
        .stars{font-weight:800}
        .who{font-weight:700}
        .date{color:var(--muted);font-size:12px;margin-left:auto}
        .txt{margin:6px 0 0}

        /* ORDERS */
        .orders{display:grid;gap:10px}
        .order{border:1px solid #e5e7eb;border-radius:14px;padding:10px;background:#fff;display:flex;justify-content:space-between;align-items:center}
        .oTitle{font-weight:800}
        .oMeta{color:var(--muted);font-size:13px}
        .oAct{display:flex;gap:8px}

        /* SETTINGS */
        .settingsGrid{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(260px,1fr))}
        .card{border:1px solid #e5e7eb;border-radius:14px;padding:12px;background:#fff}
        .formRow{display:flex;flex-direction:column;gap:6px;margin:8px 0}
        .formGrid{display:grid;gap:8px;grid-template-columns:repeat(3,1fr)}
        .formRow input{border:1px solid #e5e7eb;border-radius:10px;padding:8px}
        .avatarEdit{display:flex;gap:12px;align-items:center}
        .btns{display:flex;gap:8px}

        /* BOTTOM BAR */
        .bottombar{position:sticky;bottom:0;z-index:40;display:grid;grid-template-columns:repeat(3,1fr);gap:6px;padding:6px;
          background:rgba(255,255,255,.94);backdrop-filter:blur(8px);border-top:1px solid var(--line)}
        .tabBtn{display:flex;flex-direction:column;align-items:center;gap:2px;padding:8px;border-radius:10px;border:1px solid transparent;background:transparent;cursor:pointer;font-weight:700}

        /* LEGAL */
        .legal{background:#0b0b0b;color:#f8fafc;border-top:1px solid rgba(255,255,255,.12);width:100vw;margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);margin-top:14px}
        .inner{max-width:1100px;margin:0 auto;padding:12px 16px}
        .ttl{font-weight:800;margin-bottom:6px}
        .links{display:flex;flex-wrap:wrap;gap:10px}
        .links a{color:#e2e8f0;font-size:13px;padding:6px 8px;border-radius:8px;text-decoration:none}
        .links a:hover{background:rgba(255,255,255,.08);color:#fff}
        .homeLink{margin-left:auto;font-weight:800}
        .copy{margin-top:6px;font-size:12px;color:#cbd5e1}

        @media (max-width:520px){ .formGrid{grid-template-columns:1fr 1fr;}
          .hero{flex-direction:column;align-items:flex-start}
          .name{font-size:24px}
        }
      `}</style>
    </>
  );
}

/* ---------------------------- Parçalar ---------------------------- */
function Empty({ text }) { return <div className="empty">{text}</div>; }

function AdCard({ a, isPro, onEdit, onDelete, onFeature, onRenew, pending, expired, canFeature }) {
  const label = pending ? "Onay Bekliyor" : expired ? "Süresi Bitti" : isPro && (a.isFeatured ? "Vitrinde" : "Yayında");
  return (
    <article className={isPro ? (a.isFeatured ? "ad gold" : "ad") : "ad"}>
      <div className="thumb" style={{ backgroundImage: a?.img ? `url(${a.img})` : undefined }}>
        {label && (
          <span className={`badge ${pending ? 'gray' : expired ? 'orange' : a.isFeatured ? 'green' : ''}`}>{label}</span>
        )}
        {isPro && <span className="badge" style={{ right: 8, left: 'auto' }}>PRO</span>}
      </div>
      <div className="body">
        <div className="title">{a.title}</div>
        <div className="meta"><span>{a.cat}</span><b>{a.price}</b></div>
      </div>
      <div className="actions">
        {canFeature && !pending && !expired && (
          a.isFeatured ? (
            <button className="ghost small" onClick={()=>onFeature(false)}>Vitrinden Kaldır</button>
          ) : (
            <button className="ghost small" onClick={()=>onFeature(true)}>Vitrine Yayınla</button>
          )
        )}
        {expired && <button className="ghost small" onClick={onRenew}>Süreyi Uzat</button>}
        <button className="ghost small" onClick={()=>onEdit(a.id)}>Düzenle</button>
        <button className="ghost small" onClick={()=>onDelete(a.id)}>Sil</button>
      </div>
    </article>
  );
}
