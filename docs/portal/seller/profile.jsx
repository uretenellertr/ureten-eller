"use client";
import React, {useEffect, useMemo, useState, useRef, useCallback} from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

/* ---------- SUPABASE ---------- */
let _sb=null;
function sb(){
  if(_sb) return _sb;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if(!url || !key) return null;
  _sb = createClient(url, key);
  return _sb;
}

/* ---------- DİL ---------- */
const SUPPORTED = ["tr","en","ar","de"];
const LBL = {
  tr: {
    brand:"Üreten Eller",
    profile:"Profil",
    settings:"Ayarlar",
    save:"Kaydet",
    changePwd:"Şifre Değiştir",
    avatar:"Profil Resmi",
    upload:"Yükle",
    listings:"İlanlarım",
    pending:"Onay Bekleyen",
    live:"Yayında",
    expired:"Süresi Biten",
    orders:"Siparişler",
    reviews:"Yorumlar",
    showcase:"Vitrine Al",
    removeShowcase:"Vitrinden Çıkar",
    renew:"Süre Uzat",
    edit:"Düzenle",
    delete:"Sil",
    confirm:"Onayla",
    reject:"Reddet",
    msgBuyer:"Alıcıya Mesaj",
    price:"Fiyat",
    status:"Durum",
    createdAt:"Oluşturulma",
    empty:"Kayıt yok.",
    proBadge:"Onaylı Satıcı",
    showcaseInfoTitle:"Vitrine Alma",
    showcaseInfoTxt:"Normal üye: 250 TL/ay. PRO: 1 ilan ücretsiz, fazlası 100 TL/ay.",
    payNow:"Ödeme Yap",
    cancel:"İptal",
    notif:"Bildiriler",
    messages:"Mesajlar",
    home:"Ana Sayfa",
    legal:"Kurumsal",
    proEnds:"PRO bitiş",
    lang:"Dil",
    name:"Ad Soyad",
    email:"E-posta",
    pwdOld:"Mevcut Şifre",
    pwdNew:"Yeni Şifre",
    pwdAgain:"Yeni Şifre (tekrar)",
    saved:"Kaydedildi.",
    err:"Bir hata oluştu.",
    rating:"Puan",
    comment:"Yorum",
    translateFail:"Çeviri yok",
    showAll:"Tümünü Göster",
  },
  en: {
    brand:"Ureten Eller",
    profile:"Profile",
    settings:"Settings",
    save:"Save",
    changePwd:"Change Password",
    avatar:"Avatar",
    upload:"Upload",
    listings:"My Listings",
    pending:"Pending",
    live:"Live",
    expired:"Expired",
    orders:"Orders",
    reviews:"Reviews",
    showcase:"Showcase",
    removeShowcase:"Remove Showcase",
    renew:"Renew",
    edit:"Edit",
    delete:"Delete",
    confirm:"Confirm",
    reject:"Reject",
    msgBuyer:"Message Buyer",
    price:"Price",
    status:"Status",
    createdAt:"Created",
    empty:"No records.",
    proBadge:"Verified Seller",
    showcaseInfoTitle:"Showcase",
    showcaseInfoTxt:"Normal: 250 TRY/month. PRO: 1 free, next are 100 TRY/month.",
    payNow:"Pay Now",
    cancel:"Cancel",
    notif:"Notifications",
    messages:"Messages",
    home:"Home",
    legal:"Corporate",
    proEnds:"PRO ends",
    lang:"Language",
    name:"Full Name",
    email:"Email",
    pwdOld:"Current Password",
    pwdNew:"New Password",
    pwdAgain:"New Password (again)",
    saved:"Saved.",
    err:"Something went wrong.",
    rating:"Rating",
    comment:"Comment",
    translateFail:"No translation",
    showAll:"Show All",
  },
  ar: {
    brand:"أُنتِج بالأيادي",
    profile:"الملف",
    settings:"الإعدادات",
    save:"حفظ",
    changePwd:"تغيير كلمة السر",
    avatar:"الصورة",
    upload:"رفع",
    listings:"إعلاناتي",
    pending:"قيد الموافقة",
    live:"قيد العرض",
    expired:"منتهي",
    orders:"الطلبات",
    reviews:"التقييمات",
    showcase:"واجهة",
    removeShowcase:"إزالة من الواجهة",
    renew:"تجديد",
    edit:"تعديل",
    delete:"حذف",
    confirm:"تأكيد",
    reject:"رفض",
    msgBuyer:"مراسلة المشتري",
    price:"السعر",
    status:"الحالة",
    createdAt:"الإنشاء",
    empty:"لا يوجد بيانات.",
    proBadge:"بائع موثّق",
    showcaseInfoTitle:"الواجهة",
    showcaseInfoTxt:"العادي: 250 ليرة/شهر. بريميوم: إعلان واحد مجاني، والباقي 100 ليرة/شهر.",
    payNow:"ادفع الآن",
    cancel:"إلغاء",
    notif:"الإشعارات",
    messages:"الرسائل",
    home:"الرئيسية",
    legal:"المعلومات المؤسسية",
    proEnds:"انتهاء بريميوم",
    lang:"اللغة",
    name:"الاسم الكامل",
    email:"البريد",
    pwdOld:"كلمة السر الحالية",
    pwdNew:"كلمة سر جديدة",
    pwdAgain:"تأكيد كلمة السر",
    saved:"تم الحفظ.",
    err:"حدث خطأ.",
    rating:"التقييم",
    comment:"تعليق",
    translateFail:"لا ترجمة",
    showAll:"عرض الكل",
  },
  de: {
    brand:"Ureten Eller",
    profile:"Profil",
    settings:"Einstellungen",
    save:"Speichern",
    changePwd:"Passwort ändern",
    avatar:"Profilbild",
    upload:"Hochladen",
    listings:"Meine Inserate",
    pending:"Ausstehend",
    live:"Live",
    expired:"Abgelaufen",
    orders:"Bestellungen",
    reviews:"Bewertungen",
    showcase:"Vitrine",
    removeShowcase:"Aus Vitrine",
    renew:"Verlängern",
    edit:"Bearbeiten",
    delete:"Löschen",
    confirm:"Bestätigen",
    reject:"Ablehnen",
    msgBuyer:"Käufer anschreiben",
    price:"Preis",
    status:"Status",
    createdAt:"Erstellt",
    empty:"Keine Daten.",
    proBadge:"Verifizierter Verkäufer",
    showcaseInfoTitle:"Vitrine",
    showcaseInfoTxt:"Normal: 250 TRY/Monat. PRO: 1 gratis, weitere 100 TRY/Monat.",
    payNow:"Jetzt zahlen",
    cancel:"Abbrechen",
    notif:"Mitteilungen",
    messages:"Nachrichten",
    home:"Start",
    legal:"Unternehmen",
    proEnds:"PRO endet",
    lang:"Sprache",
    name:"Name",
    email:"E-Mail",
    pwdOld:"Aktuelles Passwort",
    pwdNew:"Neues Passwort",
    pwdAgain:"Neues Passwort (wiederholen)",
    saved:"Gespeichert.",
    err:"Fehler.",
    rating:"Bewertung",
    comment:"Kommentar",
    translateFail:"Keine Übersetzung",
    showAll:"Alle anzeigen",
  },
};
function useLang(){
  const [lang,setLang] = useState("tr");
  useEffect(()=>{
    const saved = typeof window!=="undefined" ? localStorage.getItem("lang") : null;
    if(saved && SUPPORTED.includes(saved)) setLang(saved);
  },[]);
  useEffect(()=>{
    if(typeof document!=="undefined"){
      document.documentElement.lang = lang;
      document.documentElement.dir = lang==="ar" ? "rtl" : "ltr";
    }
    localStorage.setItem("lang", lang);
  },[lang]);
  const t = useMemo(()=> LBL[lang] || LBL.tr, [lang]);
  return {lang,setLang,t};
}

/* ---------- YARDIMCILAR ---------- */
const fmt = (d)=> d? new Date(d).toLocaleString() : "";
const money = (v,cur="TRY") => (v!=null ? `${v} ${cur}` : "-");
const yesNo = (b)=> b? "✓" : "—";

/* ---------- SAYFA ---------- */
export default function SellerProfile(){
  const {lang,setLang,t} = useLang();
  const supa = sb();
  const router = useRouter();
  const [me,setMe]=useState(null);
  const [proUntil,setProUntil]=useState(null);
  const [isPro,setIsPro]=useState(false);
  const [tab,setTab]=useState("live"); // pending | live | expired | orders | reviews | settings
  const [err,setErr]=useState("");
  const [ok,setOk]=useState("");

  // profil state
  const [fullName,setFullName]=useState("");
  const [email,setEmail]=useState("");
  const [avatar,setAvatar]=useState(""); // url
  const audioRef = useRef(null);

  // İlan state’leri
  const [pending,setPending]=useState([]);
  const [live,setLive]=useState([]);
  const [expired,setExpired]=useState([]);

  // Siparişler
  const [orders,setOrders]=useState([]);

  // Yorumlar
  const [reviews,setReviews]=useState([]);
  const [showAllReviews,setShowAllReviews]=useState(false);

  // Init: user + profile
  useEffect(()=>{
    let alive=true;
    (async()=>{
      try{
        if(!supa){ setErr("Supabase env eksik"); return; }
        const { data:{ user } } = await supa.auth.getUser();
        if(!alive) return;
        if(!user){ router.push("/login"); return; }
        setMe(user);
        // kendi profil satırı
        const { data: row } = await supa.from("users")
          .select("email,full_name,premium_until,avatar_url")
          .eq("auth_user_id", user.id).single();
        setEmail(row?.email || user.email || "");
        setFullName(row?.full_name || "");
        setAvatar(row?.avatar_url || "/logo.png");
        const pu = row?.premium_until ? new Date(row.premium_until) : null;
        setProUntil(pu); setIsPro(!!pu && pu>new Date());
      }catch(e){ setErr(e?.message||t.err); }
    })();
    return ()=>{ alive=false };
  },[supa]);

  // İlan & Sipariş & Yorumlar fetch
  const loadData = useCallback(async ()=>{
    try{
      if(!me) return;
      // listings
      const fields = "id,title,price,currency,status,is_showcase,created_at,expires_at,city,district";
      const { data:lp } = await supa.from("listings").select(fields)
        .eq("seller_auth_id", me.id).eq("status","pending").order("created_at",{ascending:false});
      const { data:ll } = await supa.from("listings").select(fields)
        .eq("seller_auth_id", me.id).eq("status","active").order("created_at",{ascending:false});
      const { data:le } = await supa.from("listings").select(fields)
        .eq("seller_auth_id", me.id).eq("status","expired").order("created_at",{ascending:false});
      setPending(lp||[]); setLive(ll||[]); setExpired(le||[]);

      // orders (son 50)
      const ofields = "id,buyer_auth_id,total_amount,currency,status,created_at";
      const { data:oo } = await supa.from("orders").select(ofields)
        .eq("seller_auth_id", me.id).order("created_at",{ascending:false}).limit(50);
      setOrders(oo||[]);

      // reviews (son 20)
      // Tablo varsayımı: reviews(id, listing_id, reviewer_auth_id, rating int, comment text, created_at, lang)
      const rfields = "id,listing_id,reviewer_auth_id,rating,comment,created_at,lang";
      const { data:rr } = await supa.from("reviews").select(rfields)
        .eq("seller_auth_id", me.id).order("created_at",{ascending:false}).limit(showAllReviews?200:20);
      setReviews(rr||[]);
    }catch(e){ setErr(e?.message||t.err); }
  },[supa,me,showAllReviews,t.err]);

  useEffect(()=>{ loadData(); },[loadData]);

  // Vitrine Alma modalı
  const [showPay,setShowPay]=useState(false);
  const [payFor,setPayFor]=useState(null); // listing row
  function openShowcase(l){
    // PRO ise 1 ilan ücretsiz (kontrolü backend’de de tetikleyici ile zorlayın)
    if(isPro){
      // ücretsiz hakkı var mı kontrol için RPC opsiyonel; yoksa direkt set
      setPayFor({ ...l, amount: l.is_showcase ? 0 : 0 });
      // PRO’da 1 ücretsiz → doğrudan aç/kapat isteği
      toggleShowcase(l);
    }else{
      setPayFor({ ...l, amount: 250 }); // normal 250 TL/ay
      setShowPay(true);
    }
  }

  async function toggleShowcase(l){
    try{
      setErr(""); setOk("");
      const to = !l.is_showcase;
      // PRO değil ve açmak istiyorsa ücret iste
      if(to && !isPro){
        setPayFor({ ...l, amount: 250 });
        setShowPay(true);
        return;
      }
      const { error } = await supa.from("listings")
        .update({ is_showcase: to }).eq("id", l.id);
      if(error) throw error;
      setOk(t.saved);
      await loadData();
    }catch(e){ setErr(e?.message||t.err); }
  }

  function goPay(){
    if(!payFor) return;
    const amt = payFor.amount || 0;
    setShowPay(false);
    // sahte ödeme yönlendirmesi
    router.push(`/portal/seller/pay?vitrin=${payFor.id}&amount=${amt}`);
  }

  // İlan işlemleri
  async function renew(listingId){
    try{
      setErr(""); setOk("");
      // expires_at +30 gün
      const { data } = await supa.from("listings").select("expires_at").eq("id",listingId).single();
      const base = data?.expires_at ? new Date(data.expires_at) : new Date();
      const next = new Date(base > new Date() ? base : new Date());
      next.setDate(next.getDate()+30);
      const { error } = await supa.from("listings").update({ expires_at: next.toISOString(), status:"active" }).eq("id",listingId);
      if(error) throw error;
      setOk(t.saved);
      await loadData();
    }catch(e){ setErr(e?.message||t.err); }
  }
  async function delListing(listingId){
    try{
      setErr(""); setOk("");
      const { error } = await supa.from("listings").delete().eq("id",listingId);
      if(error) throw error;
      setOk(t.saved);
      await loadData();
    }catch(e){ setErr(e?.message||t.err); }
  }
  function editListing(listingId){
    router.push(`/portal/seller/post?edit=${listingId}`);
  }

  // Sipariş işlemleri (seller tarafı)
  async function orderConfirm(id){
    try{
      setErr(""); setOk("");
      const { error } = await supa.from("orders").update({ status:"seller_confirmed", seller_confirmed_at: new Date().toISOString() }).eq("id",id);
      if(error) throw error;
      setOk(t.saved);
      await loadData();
    }catch(e){ setErr(e?.message||t.err); }
  }
  async function orderReject(id){
    try{
      setErr(""); setOk("");
      const { error } = await supa.from("orders").update({ status:"seller_rejected" }).eq("id",id);
      if(error) throw error;
      setOk(t.saved);
      await loadData();
    }catch(e){ setErr(e?.message||t.err); }
  }
  function orderMsgBuyer(buyerId){
    router.push(`/portal/seller/messages?with=${buyerId}`);
  }

  // Ayarlar: avatar + ad + dil + şifre
  async function saveProfile(){
    try{
      setErr(""); setOk("");
      const upd = { full_name: fullName };
      if(avatar) upd.avatar_url = avatar;
      await supa.from("users").update(upd).eq("auth_user_id", me.id);
      setOk(t.saved);
    }catch(e){ setErr(e?.message||t.err); }
  }
  async function changePassword(oldp, newp){
    try{
      setErr(""); setOk("");
      const { error } = await supa.auth.updateUser({ password: newp });
      if(error) throw error;
      setOk(t.saved);
    }catch(e){ setErr(e?.message||t.err); }
  }
  async function onPickAvatar(e){
    const f = e.target.files?.[0]; if(!f) return;
    try{
      // public upload hedefi: Cloudinary önerilir; burada Supabase storage örneği
      const fileName = `avatars/${me.id}_${Date.now()}.${f.name.split(".").pop()}`;
      const up = await supa.storage.from("public").upload(fileName, f, { upsert:true });
      if(up?.error) throw up.error;
      const { data:pub } = supa.storage.from("public").getPublicUrl(fileName);
      setAvatar(pub.publicUrl);
      setOk(t.saved);
    }catch(e){ setErr(e?.message||t.err); }
  }

  // Yorum çevirisi
  async function translate(txt){
    try{
      const { data, error } = await supa.rpc("translate_text", { p_text: txt, p_to: lang });
      if(error || !data) return txt;
      return data;
    }catch{ return txt; }
  }

  // Alt bar navigasyonu
  function goHome(){ router.push("/portal/seller"); }
  function goMsgs(){ router.push("/portal/seller/messages"); }
  function goNotifs(){ router.push("/portal/seller/notifications"); }

  return (
    <>
      <Head>
        <title>{t.brand} – {t.profile}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <audio ref={audioRef} src="/notify.wav" preload="auto" />

      <header className="top">
        <div className="left">
          <img className={`avatar ${isPro?"gold":""}`} src={avatar||"/logo.png"} alt="avatar" />
          <div>
            <div className="name">
              {fullName || t.profile}
              {isPro && <span className="badge" title={t.proBadge}>✔</span>}
            </div>
            <div className="muted">{t.email}: {email||"-"}</div>
            {isPro && <div className="muted">{t.proEnds}: {proUntil?fmt(proUntil):"-"}</div>}
          </div>
        </div>
        <div className="right">
          <select value={lang} onChange={(e)=>setLang(e.target.value)} aria-label={t.lang}>
            {SUPPORTED.map(k=><option key={k} value={k}>{k.toUpperCase()}</option>)}
          </select>
          <button className="ghost" onClick={()=>setTab("settings")}>{t.settings}</button>
          <button className="danger" onClick={async()=>{ try{ await supa.auth.signOut(); }catch{}; router.push("/login"); }}>Çıkış</button>
        </div>
      </header>

      <main className="wrap">
        <div className="tabs">
          <button className={tab==="pending"?"on":""} onClick={()=>setTab("pending")}>{t.pending}</button>
          <button className={tab==="live"?"on":""} onClick={()=>setTab("live")}>{t.live}</button>
          <button className={tab==="expired"?"on":""} onClick={()=>setTab("expired")}>{t.expired}</button>
          <button className={tab==="orders"?"on":""} onClick={()=>setTab("orders")}>{t.orders}</button>
          <button className={tab==="reviews"?"on":""} onClick={()=>setTab("reviews")}>{t.reviews}</button>
          <button className={tab==="settings"?"on":""} onClick={()=>setTab("settings")}>{t.settings}</button>
        </div>

        {err && <div className="alert bad">{err}</div>}
        {ok && <div className="alert good">{ok}</div>}

        {tab==="pending" && (
          <section className="card">
            <h2>{t.pending}</h2>
            <TableListings rows={pending} t={t} onEdit={editListing} onDel={delListing} onRenew={renew} onShowcase={openShowcase} isPro={isPro} />
          </section>
        )}
        {tab==="live" && (
          <section className="card">
            <h2>{t.live}</h2>
            <TableListings rows={live} t={t} onEdit={editListing} onDel={delListing} onRenew={renew} onShowcase={openShowcase} isPro={isPro} />
          </section>
        )}
        {tab==="expired" && (
          <section className="card">
            <h2>{t.expired}</h2>
            <TableListings rows={expired} t={t} onEdit={editListing} onDel={delListing} onRenew={renew} onShowcase={openShowcase} isPro={isPro} />
          </section>
        )}

        {tab==="orders" && (
          <section className="card">
            <h2>{t.orders}</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th><th>Buyer</th><th>{t.price}</th><th>{t.status}</th><th>{t.createdAt}</th><th></th>
                </tr>
              </thead>
              <tbody>
                {(orders||[]).map(o=>(
                  <tr key={o.id}>
                    <td>#{o.id}</td>
                    <td><code>{o.buyer_auth_id}</code></td>
                    <td>{money(o.total_amount,o.currency)}</td>
                    <td>{o.status}</td>
                    <td>{fmt(o.created_at)}</td>
                    <td className="row">
                      <button className="btn" onClick={()=>orderConfirm(o.id)}>{t.confirm}</button>
                      <button className="ghost" onClick={()=>orderReject(o.id)}>{t.reject}</button>
                      <button className="ghost" onClick={()=>orderMsgBuyer(o.buyer_auth_id)}>{t.msgBuyer}</button>
                    </td>
                  </tr>
                ))}
                {!orders?.length && <tr><td colSpan={6} className="muted">{t.empty}</td></tr>}
              </tbody>
            </table>
          </section>
        )}

        {tab==="reviews" && (
          <section className="card">
            <h2>{t.reviews}</h2>
            <div className="reviews">
              {(reviews||[]).map((r)=>(
                <ReviewItem key={r.id} r={r} lang={lang} t={t} translate={translate} />
              ))}
              {!reviews?.length && <div className="muted">{t.empty}</div>}
            </div>
            {reviews?.length>0 && (
              <div className="row" style={{marginTop:10}}>
                <button className="ghost" onClick={()=>setShowAllReviews(v=>!v)}>{t.showAll}</button>
              </div>
            )}
          </section>
        )}

        {tab==="settings" && (
          <section className="card">
            <h2>{t.settings}</h2>
            <div className="grid2">
              <div className="field">
                <label>{t.name}</label>
                <input className="input" value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="Ad Soyad" />
              </div>
              <div className="field">
                <label>{t.email}</label>
                <input className="input" value={email} disabled />
              </div>
            </div>
            <div className="field" style={{marginTop:10}}>
              <label>{t.avatar}</label>
              <div className="row">
                <img src={avatar||"/logo.png"} alt="pp" width="56" height="56" className={`avatar ${isPro?"gold":""}`} />
                <input type="file" accept="image/*" onChange={onPickAvatar} />
              </div>
            </div>
            <div className="row" style={{marginTop:10}}>
              <button className="btn" onClick={saveProfile}>{t.save}</button>
            </div>

            <hr className="sep" />

            <h3>{t.changePwd}</h3>
            <PasswordForm onSubmit={changePassword} t={t} />
          </section>
        )}
      </main>

      {/* Vitrin ödeme modalı */}
      {showPay && payFor && (
        <div className="modal">
          <div className="modalCard">
            <h3>✨ {t.showcaseInfoTitle}</h3>
            <div className="muted" style={{marginBottom:8}}>{t.showcaseInfoTxt}</div>
            <div style={{fontWeight:900,marginBottom:8}}>#{payFor.id} – {payFor.title}</div>
            <div style={{fontSize:18,marginBottom:12}}>{money(payFor.amount,"TRY")}</div>
            <div className="row">
              <button className="btn" onClick={goPay}>{t.payNow}</button>
              <button className="ghost" onClick={()=>setShowPay(false)}>{t.cancel}</button>
            </div>
          </div>
        </div>
      )}

      <footer className="dock">
        <button onClick={goHome}>{t.home}</button>
        <button onClick={goMsgs}>{t.messages}</button>
        <button onClick={goNotifs}>{t.notif}</button>
        <span className="legal">{t.legal}</span>
      </footer>

      <footer className="legalbar">
        <div className="inner">
          <nav>
            <a href="/legal/kurumsal">Kurumsal</a>
            <a href="/legal/hakkimizda">Hakkımızda</a>
            <a href="/legal/iletisim">İletişim</a>
            <a href="/legal/gizlilik">Gizlilik</a>
            <a href="/legal/kvkk-aydinlatma">KVKK</a>
            <a href="/legal/kullanim-sartlari">Kullanım Şartları</a>
            <a href="/legal/mesafeli-satis-sozlesmesi">Mesafeli Satış</a>
            <a href="/legal/teslimat-iade">Teslimat & İade</a>
            <a href="/legal/cerez-politikasi">Çerez</a>
            <a href="/legal/topluluk-kurallari">Topluluk</a>
            <a href="/legal/yasakli-urunler">Yasaklı Ürünler</a>
          </nav>
          <div className="copy">© {new Date().getFullYear()} {LBL.tr.brand}</div>
        </div>
      </footer>

      <style jsx>{`
        :root{ --bg:#000; --ink:#fff; --muted:#e5e7eb; --line:#222; --accent:#d4a373; --glow: rgba(212,163,115,.35); }
        html,body,#__next{height:100%}
        body{margin:0;background:var(--bg);color:var(--ink);font-family:system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial,sans-serif}

        .top{position:sticky;top:0;z-index:40;display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center;padding:12px 16px;border-bottom:2px solid var(--accent);background:#000;box-shadow:0 0 0 1px var(--accent) inset, 0 0 14px var(--glow)}
        .left{display:flex;gap:12px;align-items:center}
        .right{display:flex;gap:8px;align-items:center}
        .name{font-weight:900;font-size:18px}
        .badge{display:inline-block;margin-left:6px;background:var(--accent);color:#000;border-radius:8px;padding:2px 6px;font-size:12px;font-weight:900}

        .avatar{width:56px;height:56px;border-radius:999px;border:2px solid #333;object-fit:cover}
        .avatar.gold{border:3px solid var(--accent); box-shadow:0 0 0 1px var(--accent) inset, 0 0 14px var(--glow)}

        .wrap{max-width:1150px;margin:16px auto;padding:0 16px;display:grid;gap:16px}
        .tabs{display:flex;gap:8px;flex-wrap:wrap}
        .tabs button{all:unset;cursor:pointer;padding:10px 12px;border-radius:12px;border:2px solid var(--accent);background:rgba(255,255,255,.03);box-shadow:0 0 0 1px var(--accent) inset, 0 0 12px var(--glow)}
        .tabs button.on{background:var(--accent);color:#000;font-weight:900}

        .card{border:2px solid var(--accent);border-radius:18px;padding:16px;background:#000;box-shadow:0 0 0 1px var(--accent) inset, 0 0 18px var(--glow)}
        .grid2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        @media (max-width:900px){ .grid2{grid-template-columns:1fr} }

        .table{width:100%;border-collapse:separate;border-spacing:0;color:#fff}
        .table th{background:#0b0b0b;border-bottom:2px solid var(--accent);text-align:left;padding:10px 12px}
        .table td{padding:10px 12px;border-bottom:1px solid #111}
        .row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}

        .btn{border:2px solid var(--accent);background:#000;color:#fff;padding:8px 12px;border-radius:12px;font-weight:900;cursor:pointer;box-shadow:0 0 0 1px var(--accent) inset, 0 0 12px var(--glow)}
        .ghost{border:2px solid var(--accent);background:transparent;color:#fff;padding:8px 12px;border-radius:12px;cursor:pointer}
        .danger{border:2px solid var(--accent);background:#000;color:#fff;padding:8px 12px;border-radius:12px;cursor:pointer}
        .input, input, textarea, select{border:2px solid var(--accent);background:#000;color:#fff;border-radius:12px;padding:10px 12px;outline:none;box-shadow:0 0 0 1px var(--accent) inset, 0 0 10px var(--glow)}
        select option{background:#000;color:#fff}

        .alert{padding:10px 12px;border-radius:12px}
        .alert.bad{background:#2a0f0f;border:2px solid #7f1d1d}
        .alert.good{background:#0f2a1a;border:2px solid #1d7f5a}

        .sep{border:none;border-top:2px dashed #333;margin:16px 0}

        .modal{position:fixed;inset:0;background:rgba(0,0,0,.6);display:grid;place-items:center;z-index:60}
        .modalCard{background:#000;color:#fff;border:2px solid var(--accent);border-radius:16px;padding:16px;box-shadow:0 0 0 1px var(--accent) inset, 0 0 18px var(--glow);max-width:420px;width:92%}

        .reviews{display:grid;gap:10px}
        .review{border:2px solid var(--accent);border-radius:14px;padding:10px;background:#000}

        .dock{position:fixed;bottom:0;left:0;right:0;background:#000;border-top:2px solid var(--accent);display:flex;gap:8px;justify-content:center;align-items:center;padding:8px;z-index:50;box-shadow:0 0 0 1px var(--accent) inset, 0 0 14px var(--glow)}
        .dock button{all:unset;cursor:pointer;color:#fff;padding:8px 12px;border-radius:10px;border:2px solid var(--accent)}

        .legalbar{margin-top:28px;background:#0b0b0b;color:#e2e8f0;border-top:2px solid var(--accent)}
        .legalbar .inner{max-width:1150px;margin:0 auto;padding:12px 16px}
        .legalbar nav{display:flex;gap:10px;flex-wrap:wrap}
        .legalbar a{color:#e2e8f0;text-decoration:none;border-bottom:1px dotted #aaa}
        .copy{margin-top:6px;font-size:12px;color:#94a3b8}
      `}</style>
    </>
  );
}

/* -------- Alt Bileşenler -------- */
function TableListings({rows,t,onEdit,onDel,onRenew,onShowcase,isPro}){
  return (
    <table className="table">
      <thead>
        <tr>
          <th>ID</th><th>Başlık</th><th>Konum</th><th>{t.price}</th><th>Vitrin</th><th>{t.status}</th><th>{t.createdAt}</th><th></th>
        </tr>
      </thead>
      <tbody>
        {(rows||[]).map(l=>(
          <tr key={l.id}>
            <td>#{l.id}</td>
            <td>{l.title}</td>
            <td>{l.city} {l.district?`/ ${l.district}`:""}</td>
            <td>{money(l.price,l.currency)}</td>
            <td>{yesNo(l.is_showcase)}</td>
            <td>{l.status}</td>
            <td>{fmt(l.created_at)}</td>
            <td className="row">
              <button className="btn" onClick={()=>onEdit(l.id)}>{t.edit}</button>
              <button className="ghost" onClick={()=>onRenew(l.id)}>{t.renew}</button>
              <button className="ghost" onClick={()=>onShowcase(l)}>{l.is_showcase? t.removeShowcase : t.showcase}</button>
              <button className="ghost" onClick={()=>onDel(l.id)}>{t.delete}</button>
            </td>
          </tr>
        ))}
        {(!rows || rows.length===0) && <tr><td colSpan={8} className="muted">{t.empty}</td></tr>}
      </tbody>
    </table>
  );
}

function PasswordForm({onSubmit,t}){
  const [a,setA]=useState(""),[b,setB]=useState(""),[c,setC]=useState(""),[info,setInfo]=useState("");
  async function go(){
    setInfo("");
    if(!b || b!==c){ setInfo("Şifreler uyuşmuyor"); return; }
    try{ await onSubmit(a,b); setA(""); setB(""); setC(""); setInfo(t.saved); }catch{ setInfo(t.err); }
  }
  return (
    <>
      <div className="grid2">
        <div className="field"><label>{t.pwdOld}</label><input className="input" type="password" value={a} onChange={e=>setA(e.target.value)} /></div>
        <div className="field"><label>{t.pwdNew}</label><input className="input" type="password" value={b} onChange={e=>setB(e.target.value)} /></div>
      </div>
      <div className="field" style={{marginTop:8}}><label>{t.pwdAgain}</label><input className="input" type="password" value={c} onChange={e=>setC(e.target.value)} /></div>
      <div className="row" style={{marginTop:8}}><button className="btn" onClick={go}>{t.save}</button>{info && <span className="muted">{info}</span>}</div>
    </>
  );
}

function ReviewItem({r,lang,t,translate}){
  const [txt,setTxt]=useState(r.comment||"");
  useEffect(()=>{
    let alive=true;
    (async()=>{
      const t0 = await translate(r.comment||"");
      if(alive) setTxt(t0);
    })();
    return ()=>{ alive=false };
  },[r.comment,lang,translate]);
  return (
    <div className="review">
      <div className="row" style={{justifyContent:"space-between"}}>
        <div>
          <b>#{r.listing_id}</b> • <span>{t.rating}: {r.rating||"-"}</span>
        </div>
        <div className="muted">{fmt(r.created_at)}</div>
      </div>
      <div style={{marginTop:6}}>{txt || t.translateFail}</div>
    </div>
  );
}
