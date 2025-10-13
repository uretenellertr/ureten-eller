"use client";
import React, { useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";

/* =========================================================
   ÜRETEN ELLER – Satıcı Profili (pages/portal/seller/profile.jsx)
   Özellikler (tamamı istemci tarafı – Firestore index gerektirmez):
   - Auth: aktif kullanıcı bilgisi
   - Firestore: users/{uid}, listings (seller_id==uid), payments (dekont)
   - Storage: avatars/{uid}.jpg , receipts/{uid}/...
   - Premium: 1 ücretsiz Vitrin hakkı. Ek hak: Premium=₺100, Standart=₺199
   - Premium üyelik: ₺1999 – dekont yükle, admin onayıyla aktif olur
   - Onaylı satıcı: gold çerçeve + rozet (admin onayı sonrası)
   - Ayarlar: Adres / Telefon / Avatar değişikliği, Şifre güncelleme
   - İlan No gösterimi: 3838 + sıra numarası (salt görsel)
   ========================================================= */

/* ------------------------------ Firebase ------------------------------ */
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, onAuthStateChanged, updatePassword } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
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
const PAPARA = "Papara Ticari"; // bilgilendirme etiketi
const PREMIUM_PRICE = 1999;
const SHOWCASE_PRICE_PREMIUM = 100;
const SHOWCASE_PRICE_STANDARD = 199;

/* ------------------------------ Yardımcılar ---------------------------- */
const fmtDate = (s) => (s ? new Date(s).toLocaleDateString() : "");
const cls = (...a) => a.filter(Boolean).join(" ");

/* ------------------------------- Bileşen ------------------------------- */
export default function SellerProfile() {
  const app = useMemo(() => ensureApp(), []);
  const auth = useMemo(() => getAuth(app), [app]);
  const db = useMemo(() => getFirestore(app), [app]);
  const st = useMemo(() => getStorage(app), [app]);

  const [uid, setUid] = useState(null);
  const [me, setMe] = useState(null); // users/{uid}
  const [listings, setListings] = useState([]);
  const [activeTab, setActiveTab] = useState("urunler");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [showPay, setShowPay] = useState(null); // { type: 'premium'|'showcase', listingId?, price }
  const [showSettings, setShowSettings] = useState(false);

  // Ayarlar formu
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [newPass, setNewPass] = useState("");

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
            avatarUrl: u.photoURL || "/avatar.svg",
            joinedAt: new Date().toISOString(),
            premium: { active: false, since: null, freeShowcaseUsed: false, approved: false },
            stats: { listings: 0, rating: 0, responseHours: 1 },
          });
          snap = await getDoc(uref);
        }
        const userDoc = { id: u.uid, ...snap.data() };
        setMe(userDoc);
        setAddress(userDoc.address || "");
        setPhone(userDoc.phone || "");

        // listings of seller
        const qy = query(
          collection(db, "listings"),
          where("seller_id", "==", u.uid),
          where("seller_id", "==", u.uid)
        ); // orderBy kaldırıldı (indeks gerektirmesin diye)
        const lsn = await getDocs(qy);
        let arr = lsn.docs.map((d) => ({ id: d.id, ...d.data() }));
        // istemci tarafı sıralama (yeniden indeks istemesin)
        arr.sort((a,b)=> new Date(b.created_at||0) - new Date(a.created_at||0));
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
      alert("Bilgiler kaydedildi.");
    } catch (e) {
      alert("Hata: " + (e?.message || e));
    }
  }

  async function handlePasswordChange() {
    try {
      if (!newPass) return;
      await updatePassword(auth.currentUser, newPass);
      setNewPass("");
      alert("Şifre güncellendi.");
    } catch (e) {
      alert("Şifre güncellenemedi. Lütfen tekrar giriş yapın: " + (e?.message || e));
    }
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
      alert("Dekont yükleyin.");
      return;
    }
    const username = me?.username || "";
    const note = `${showPay.type.toUpperCase()} ödemesi • kullanıcı: ${username}`;
    await uploadReceipt(file, { type: showPay.type, listingId: showPay.listingId, amount: showPay.price, note });

    if (showPay.type === "showcase" && freeShowcaseLeft && showPay.price === 0) {
      // ücretsiz hakkı kullanıldı olarak işaretle (admin ayrıca vitrine alır)
      await updateDoc(doc(db, "users", uid), { "premium.freeShowcaseUsed": true });
      const snap = await getDoc(doc(db, "users", uid));
      setMe({ id: uid, ...snap.data() });
    }
    alert("Dekont yüklendi. Admin onayından sonra aktif olacaktır.");
    setShowPay(null);
  }

  if (loading) return <div style={{ padding: 16 }}>Yükleniyor… {err && <small style={{color:'crimson'}}>Hata: {err}</small>}</div>;
  if (!uid) return (
    <div style={{ padding: 16 }}>
      Giriş yapmalısınız. <Link href="/login">Giriş</Link>
    </div>
  );

  const t = TR; // bu sayfa TR odaklı

  return (
    <div className="page">
      {/* Üst */}
      <header className="hdr">
        <Link className="brand" href="/">
          <img src="/logo.png" width={36} height={36} alt="logo" />
          <strong>ÜRETEN ELLER</strong>
        </Link>
        <nav className="hdrNav">
          <Link href="/portal/seller/">Ana Sayfa</Link>
          <Link href="/portal/seller/post/">İlan Ver</Link>
          <Link href="/portal/seller/profile/" className="active">Profil</Link>
        </nav>
      </header>

      {/* Profil Kartı */}
      <section className={cls("profileCard", isPremium && "gold")}>
        <div className="left">
          <div className={cls("avatarWrap", isPremium && "gold")}
               style={{ backgroundImage: `url(${me?.avatarUrl || "/avatar.svg"})` }} />
          <div className="info">
            <div className="name">
              {me?.displayName || "Satıcı"}
              {isPremium && <span className="badge" title="Onaylı Satıcı">✔ Onaylı</span>}
            </div>
            <div className="user">@{me?.username}</div>
            <div className="meta">
              <span>{me?.city || "Şehir"}</span>
              <span>Katılım: {fmtDate(me?.joinedAt)}</span>
              <span>Vitrin: {listings.filter((l) => l.featured).length}</span>
            </div>
            <div className="quick">
              <button className="ghost">Mesaj Gönder</button>
              <button className="ghost">Takip Et</button>
              <button className="ghost">Paylaş</button>
              <button className="ghost">Şikayet Et</button>
            </div>
          </div>
        </div>
        <div className="right">
          <h3>Satıcı Ayarları</h3>
          <div className="tabs">
            <button className="tab active">Profil</button>
            <button className="tab" onClick={() => setShowSettings(true)}>Ayarlar</button>
          </div>

          {/* Premium Panel */}
          <div className="premium">
            <div className="ttl">Premium</div>
            {isPremium ? (
              <div className="pRow">
                <div>Premium aktif. Ücretsiz vitrin hakkı: {freeShowcaseLeft ? "1" : "0"}</div>
                <button className="btn" onClick={() => openShowcaseModal(null)}>Vitrin Hakkı Kullan</button>
              </div>
            ) : (
              <div className="pRow">
                <button className="btn" onClick={openPremiumModal}>Premium'a Geç</button>
                <div className="hint">Premium admin onayıyla verilir.</div>
              </div>
            )}
          </div>

          {/* Mağaza Bilgileri */}
          <div className="shop">
            <div className="ttl">Mağaza Bilgileri</div>
            <table className="tbl">
              <tbody>
                <tr><td>Hafta içi</td><td>09.00 – 16.00</td></tr>
                <tr><td>Hafta sonu</td><td>10.00 – 16.00</td></tr>
                <tr><td>Kargo süresi</td><td>1.5 – 3 iş günü</td></tr>
                <tr><td>İade politikası</td><td>Geçerlidir</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* İlanlar */}
      <section className="listings">
        <div className="tabs2">
          <button className={activeTab==='urunler'?'on':''} onClick={()=>setActiveTab('urunler')}>Ürünler</button>
          <button className={activeTab==='deger'?'on':''} onClick={()=>setActiveTab('deger')}>Değerlendirmeler</button>
          <button className={activeTab==='hakkinda'?'on':''} onClick={()=>setActiveTab('hakkinda')}>Hakkında</button>
          <button className={activeTab==='kargo'?'on':''} onClick={()=>setActiveTab('kargo')}>Kargo & İade</button>
          <button className={activeTab==='para'?'on':''} onClick={()=>setActiveTab('para')}>$$$</button>
        </div>

        {activeTab==='urunler' && (
          <div className="grid">
            {listings.length === 0 && <div className="empty">Henüz ilan yok.</div>}
            {listings.map((it, i) => (
              <article key={it.id} className="card">
                <div className="thumb" style={{ backgroundImage: `url(${it.images?.[0] || "/logo.png"})` }}>
                  {it.featured && <span className="badge">Vitrin</span>}
                </div>
                <div className="body">
                  <div className="title">{it.title || "İlan"}</div>
                  <div className="meta">
                    <span>İlan No: {3838 + i}</span>
                    <span>Yayında</span>
                  </div>
                  <div className="act">
                    <button className="btn ghost" onClick={() => openShowcaseModal(it.id)}>Vitrine Al</button>
                    <button className="btn">Görüntüle</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
        {activeTab==='deger' && (<div className="empty">Değerlendirme yok.</div>)}
        {activeTab==='hakkinda' && (<div className="empty">Satıcı hakkında bilgi eklenmemiş.</div>)}
        {activeTab==='kargo' && (
          <table className="tbl" style={{background:'#fff',borderRadius:12}}>
            <tbody>
              <tr><td>Kargo süresi</td><td>1.5 – 3 iş günü</td></tr>
              <tr><td>İade politikası</td><td>14 gün</td></tr>
            </tbody>
          </table>
        )}
        {activeTab==='para' && (
          <div className="payBox" style={{background:'#fff',borderRadius:12}}>
            <div className="row"><b>Premium</b><span>₺{PREMIUM_PRICE}</span></div>
            <div className="row"><b>Vitrin (Premium)</b><span>₺{SHOWCASE_PRICE_PREMIUM}</span></div>
            <div className="row"><b>Vitrin (Standart)</b><span>₺{SHOWCASE_PRICE_STANDARD}</span></div>
            <div className="sub">Ödeme için Premium/Vitrine Al butonlarını kullanın.</div>
          </div>
        )}
      </section>

      {/* Alt – Legal */}
      <footer className="legal">
        <div className="inner">
          <nav className="links">
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
          </nav>
          <div className="copy">© 2025 Üreten Eller</div>
        </div>
      </footer>

      {/* ÖDEME MODAL */}
      {showPay && (
        <div className="modal" role="dialog" aria-modal="true">
          <div className="sheet">
            <div className="mHd">
              <div className="mTtl">Ödeme Bilgileri</div>
              <button className="x" onClick={() => setShowPay(null)}>✕</button>
            </div>

            <div className="mBd">
              <div className="payBox">
                <div className="row"><b>İşlem</b><span>{showPay.type === "premium" ? "Premium Üyelik" : "Vitrin"}</span></div>
                <div className="row"><b>Tutar</b><span>{showPay.price === 0 ? "Ücretsiz hak" : `₺${showPay.price}`}</span></div>
                <div className="row"><b>IBAN</b><span className="mono">{IBAN}</span></div>
                <div className="row"><b>Hesap Adı</b><span>{ACCOUNT_NAME}</span></div>
                <div className="row"><b>Papara</b><span>{PAPARA}</span></div>
                <div className="sub">Havale/EFT sonrası dekontu aşağıdan yükleyin. Açıklamaya kullanıcı adınızı yazın.</div>
              </div>

              <form className="receipt" onSubmit={submitPayment}>
                <input name="receipt" type="file" accept="image/*,application/pdf" required />
                <button className="btn big" type="submit">Dekontu Yükle</button>
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
              <div className="mTtl">Ayarlar</div>
              <button className="x" onClick={() => setShowSettings(false)}>✕</button>
            </div>
            <div className="mBd">
              <div className="form">
                <label>Telefon
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="05xx…" />
                </label>
                <label>Adres
                  <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={3} />
                </label>
                <label>Avatar
                  <input id="avatarInput" type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} />
                </label>
                <div className="rowBtns">
                  <button className="btn" onClick={handleAvatarSave} type="button">Kaydet</button>
                </div>
                <div className="sub">"Kaydet"e basmadan yükleme başlamaz.</div>
              </div>

              <div className="form">
                <label>Yeni Şifre
                  <input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} placeholder="•••••••" />
                </label>
                <div className="rowBtns">
                  <button className="btn ghost" onClick={handlePasswordChange} type="button">Şifreyi Güncelle</button>
                </div>
                <div className="sub">Şifre güncelleme başarısız olursa tekrar giriş yapmanız istenebilir.</div>
              </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        :root{ --ink:#0f172a; --muted:#475569; --line:rgba(0,0,0,.08); --gold:#d4af37; }
        .page{min-height:100dvh;background:#fafafa}
        .hdr{position:sticky;top:0;z-index:40;display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:#fff;border-bottom:1px solid var(--line)}
        .brand{display:flex;gap:8px;align-items:center;text-decoration:none;color:inherit}
        .hdrNav{display:flex;gap:10px}
        .hdrNav a{padding:8px 10px;border-radius:10px;border:1px solid transparent;text-decoration:none;color:inherit}
        .hdrNav a.active{border-color:#111827;background:#111827;color:#fff}

        .profileCard{max-width:1100px;margin:14px auto;display:grid;grid-template-columns:1.3fr .9fr;gap:14px;padding:14px}
        @media (max-width:900px){ .profileCard{grid-template-columns:1fr} }
        .profileCard.gold{border:2px solid var(--gold);border-radius:18px;background:linear-gradient(180deg,rgba(212,175,55,.06),#fff)}
        .left{display:flex;gap:12px;background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:12px}
        .avatarWrap{width:120px;height:120px;border-radius:16px;background:#f1f5f9;background-size:cover;background-position:center;border:2px solid #e5e7eb}
        .avatarWrap.gold{box-shadow:0 0 0 3px var(--gold) inset}
        .info{display:flex;flex-direction:column;gap:6px}
        .name{font-weight:900;font-size:20px;display:flex;align-items:center;gap:8px}
        .badge{background:var(--gold);color:#000;padding:4px 8px;border-radius:999px;font-weight:800;font-size:12px}
        .user{color:var(--muted)}
        .meta{display:flex;gap:10px;color:var(--muted);font-size:13px}
        .quick{display:flex;gap:8px;flex-wrap:wrap;margin-top:6px}
        .ghost{border:1px solid #111827;background:#fff;border-radius:10px;padding:8px 12px;font-weight:700;cursor:pointer}

        .right{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:12px}
        .tabs{display:flex;gap:8px;margin:6px 0 8px}
        .tab{border:1px solid #e5e7eb;background:#fff;border-radius:10px;padding:6px 10px;font-weight:700}
        .tab.active{border-color:#111827}
        .premium{border:1px dashed #e5e7eb;border-radius:14px;padding:10px;margin-bottom:10px}
        .premium .ttl{font-weight:900;margin-bottom:6px}
        .pRow{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
        .btn{border:1px solid #111827;background:#111827;color:#fff;border-radius:10px;padding:8px 12px;font-weight:800;cursor:pointer}
        .btn.big{padding:10px 16px}
        .btn.ghost{background:#fff;color:#111827}
        .hint{color:var(--muted);font-size:13px}
        .shop{border:1px solid #e5e7eb;border-radius:14px;padding:10px}
        .shop .ttl{font-weight:900;margin-bottom:6px}
        .tbl{width:100%;border-collapse:collapse}
        .tbl td{border-top:1px solid #f1f5f9;padding:8px}

        .listings{max-width:1100px;margin:0 auto 20px;padding:0 14px}
        .tabs2{display:flex;gap:10px;margin-bottom:10px}
        .tabs2 button{border:1px solid #e5e7eb;background:#fff;border-radius:10px;padding:8px 12px;font-weight:800}
        .tabs2 .on{border-color:#111827}
        .grid{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}
        .card{border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;background:#fff;display:flex;flex-direction:column;box-shadow:0 8px 22px rgba(0,0,0,.06)}
        .thumb{aspect-ratio:4/3;background:#f1f5f9;background-size:cover;background-position:center;position:relative}
        .badge{position:absolute;top:8px;left:8px;background:#111827;color:#fff;font-size:12px;padding:4px 8px;border-radius:999px}
        .body{padding:10px}
        .title{font-weight:900;margin:0 0 6px}
        .meta{display:flex;justify-content:space-between;color:#475569;font-size:13px}
        .act{display:flex;gap:8px;margin-top:8px}
        .empty{padding:18px;border:1px dashed #e5e7eb;border-radius:14px;text-align:center;color:#475569}

        .legal{background:#0b0b0b;color:#f8fafc;border-top:1px solid rgba(255,255,255,.12);margin-top:14px}
        .inner{max-width:1100px;margin:0 auto;padding:12px 16px}
        .links{display:flex;flex-wrap:wrap;gap:10px}
        .links a{color:#e2e8f0;font-size:13px;padding:6px 8px;border-radius:8px;text-decoration:none}
        .links a:hover{background:rgba(255,255,255,.08);color:#fff}
        .copy{margin-top:6px;font-size:12px;color:#cbd5e1}

        .modal{position:fixed;inset:0;background:rgba(0,0,0,.4);display:grid;place-items:center;padding:14px;z-index:50}
        .sheet{background:#fff;max-width:520px;width:100%;border-radius:16px;border:1px solid #e5e7eb;overflow:hidden}
        .mHd{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border-bottom:1px solid #e5e7eb}
        .mTtl{font-weight:900}
        .x{background:transparent;border:none;font-size:18px;cursor:pointer}
        .mBd{padding:12px;display:grid;gap:12px}
        .payBox{border:1px solid #e5e7eb;border-radius:12px;padding:10px}
        .row{display:flex;justify-content:space-between;gap:10px;margin:6px 0}
        .mono{font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace}
        .sub{font-size:13px;color:#475569}
        .receipt{display:flex;gap:8px;align-items:center;flex-wrap:wrap}

        .form{border:1px solid #e5e7eb;border-radius:12px;padding:10px}
        .form label{display:grid;gap:6px;margin-bottom:8px}
        .form input,.form textarea{border:1px solid #e5e7eb;border-radius:10px;padding:8px}
        .rowBtns{display:flex;gap:8px}
      `}</style>
    </div>
  );
}

const TR = {
  // (ileride çoklu dil istenirse bu yapı genişletilir)
};
