// pages/portal/seller/profile.jsx
"use client";

/**
 * ÜRETEN ELLER – Satıcı Profili (client-only)
 * - 4 dil (tr/en/ar/de)
 * - Premium: ₺1999; admin onayı sonrası altın çerçeve, “Onaylı Satıcı” rozeti
 * - Vitrin: Premium 1 ücretsiz; ek vitrin Premium=₺100 / Standart=₺199
 * - Ödeme modalı: IBAN + Papara, dekont (payments.user_id)
 * - Ayarlar: telefon, adres, avatar (avatars/{uid}.jpg)
 * - Şifre: mevcut + yeni(2x) + görünürlük butonu
 */

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth, onAuthStateChanged,
  EmailAuthProvider, reauthenticateWithCredential, updatePassword,
} from "firebase/auth";
import {
  getFirestore, doc, getDoc, setDoc, updateDoc,
  collection, query, where, getDocs,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// --- Firebase Config (bucket DÜZELTİLDİ) ---
const firebaseConfig = {
  apiKey: "AIzaSyCd9GjP6CDA8i4XByhXDHyESy-g_DHVwvQ",
  authDomain: "ureteneller-ecaac.firebaseapp.com",
  projectId: "ureteneller-ecaac",
  storageBucket: "ureteneller-ecaac.appspot.com", // <-- doğru bucket
  messagingSenderId: "368042877151",
  appId: "1:368042877151:web:ee0879fc4717928079c96a",
  measurementId: "G-BJHKN8V4RQ",
};
function app() { return getApps().length ? getApp() : initializeApp(firebaseConfig); }
const appInstance = app();
const auth = getAuth(appInstance);
const db = getFirestore(appInstance);
const storage = getStorage(appInstance);

// --- mount & date helpers ---
const useMounted = () => { const [m,setM]=React.useState(false); React.useEffect(()=>setM(true),[]); return m; };
const formatDate = (ts) => { try { if(!ts) return "-"; const d=new Date(ts); const y=d.getFullYear(); const m=String(d.getMonth()+1).padStart(2,"0"); const da=String(d.getDate()).padStart(2,"0"); return `${y}-${m}-${da}`;} catch { return "-"; }};

// Sabitler
const IBAN = "TR590082900009491868461105";
const ACCOUNT_NAME = "Nejla Karataş";
const PAPARA = "Papara (ticari)";
const PREMIUM_PRICE = 1999;
const SHOWCASE_PRICE_PREMIUM = 100;
const SHOWCASE_PRICE_STANDARD = 199;

// Diller
const STR = {
  tr:{brand:"Üreten Eller",navHome:"Ana Sayfa",navPost:"İlan Ver",navProfile:"Profil",sellerSettings:"Satıcı Ayarları",
      tabs:{urunler:"Ürünler",deger:"Değerlendirmeler",hakkinda:"Hakkında",kargo:"Kargo & İade",para:"$$$"},
      msg:"Mesaj Gönder",follow:"Takip Et",share:"Paylaş",report:"Şikayet Et",
      premium:"Premium",goPremium:"Premium'a Geç",premiumHint:"Premium admin onayıyla verilir.",
      premiumActive:(l)=>`Premium aktif. Ücretsiz vitrin hakkı: ${l?"1":"0"}`,useShowcase:"Vitrin Hakkı Kullan",
      storeInfo:"Mağaza Bilgileri",wd:"Hafta içi",we:"Hafta sonu",ship:"Kargo süresi",ret:"İade politikası",
      none:"Henüz ilan yok.",view:"Görüntüle",takeShowcase:"Vitrine Al",
      payTitle:"Ödeme Bilgileri",process:"İşlem",price:"Tutar",freeRight:"Ücretsiz hak",
      iban:"IBAN",accName:"Hesap Adı",papara:"Papara",
      payNote:"Havale/EFT sonrası dekontu yükleyin. Açıklamaya kullanıcı adınızı yazın.",
      uploadReceipt:"Dekontu Yükle",
      settingsTitle:"Ayarlar",phone:"Telefon",address:"Adres",avatar:"Avatar",
      save:"Kaydet",saveHint:'"Kaydet"e basmadan yükleme başlamaz.',
      pwdNow:"Mevcut Şifre",pwdNew:"Yeni Şifre",pwdNew2:"Yeni Şifre (tekrar)",updatePwd:"Şifreyi Güncelle",
      show:"Göster",hide:"Gizle",mustLogin:"Giriş yapmalısınız.",joined:"Katılım",city:"Şehir",showcase:"Vitrin",
      approvedSeller:"Onaylı Satıcı",hours:{wd:"09.00 – 16.00",we:"10.00 – 16.00"},shipWindow:"1.5 – 3 iş günü",retPolicy:"Geçerlidir"},
  en:{brand:"Üreten Eller",navHome:"Home",navPost:"Post Listing",navProfile:"Profile",sellerSettings:"Seller Settings",
      tabs:{urunler:"Products",deger:"Reviews",hakkinda:"About",kargo:"Shipping & Returns",para:"$$$"},
      msg:"Message",follow:"Follow",share:"Share",report:"Report",
      premium:"Premium",goPremium:"Go Premium",premiumHint:"Premium is enabled after admin approval.",
      premiumActive:(l)=>`Premium active. Free showcase right: ${l?"1":"0"}`,useShowcase:"Use Showcase Right",
      storeInfo:"Store Info",wd:"Weekdays",we:"Weekend",ship:"Shipping time",ret:"Return policy",
      none:"No listings yet.",view:"View",takeShowcase:"Feature",
      payTitle:"Payment Details",process:"Process",price:"Amount",freeRight:"Free right",
      iban:"IBAN",accName:"Account Name",papara:"Papara",
      payNote:"After wire/EFT, upload the receipt. Write your username in the note.",
      uploadReceipt:"Upload Receipt",
      settingsTitle:"Settings",phone:"Phone",address:"Address",avatar:"Avatar",
      save:"Save",saveHint:"Upload won't start until you press Save.",
      pwdNow:"Current Password",pwdNew:"New Password",pwdNew2:"New Password (repeat)",updatePwd:"Update Password",
      show:"Show",hide:"Hide",mustLogin:"You must sign in.",joined:"Joined",city:"City",showcase:"Showcase",
      approvedSeller:"Verified Seller",hours:{wd:"09.00 – 16.00",we:"10.00 – 16.00"},shipWindow:"1.5 – 3 business days",retPolicy:"Applicable"},
  ar:{brand:"Üreten Eller",navHome:"الرئيسية",navPost:"أضف إعلانًا",navProfile:"الملف الشخصي",sellerSettings:"إعدادات البائع",
      tabs:{urunler:"المنتجات",deger:"التقييمات",hakkinda:"حول",kargo:"الشحن والإرجاع",para:"$$$"},
      msg:"إرسال رسالة",follow:"متابعة",share:"مشاركة",report:"إبلاغ",
      premium:"بريميوم",goPremium:"الترقية إلى بريميوم",premiumHint:"يتم التفعيل بعد موافقة المشرف.",
      premiumActive:(l)=>`البريميوم مفعل. حق الواجهة المجانية: ${l?"1":"0"}`,useShowcase:"استخدم حق الواجهة",
      storeInfo:"معلومات المتجر",wd:"أيام الأسبوع",we:"عطلة الأسبوع",ship:"مدة الشحن",ret:"سياسة الإرجاع",
      none:"لا توجد إعلانات بعد.",view:"عرض",takeShowcase:"إبراز",
      payTitle:"بيانات الدفع",process:"العملية",price:"المبلغ",freeRight:"حق مجاني",
      iban:"IBAN",accName:"اسم الحساب",papara:"Papara",
      payNote:"بعد التحويل، ارفع إيصال الدفع. اكتب اسم المستخدم في الملاحظة.",
      uploadReceipt:"رفع الإيصال",
      settingsTitle:"الإعدادات",phone:"الهاتف",address:"العنوان",avatar:"الصورة",
      save:"حفظ",saveHint:"لن يبدأ الرفع حتى تضغط حفظ.",
      pwdNow:"كلمة المرور الحالية",pwdNew:"كلمة مرور جديدة",pwdNew2:"تأكيد كلمة المرور",updatePwd:"تحديث كلمة المرور",
      show:"إظهار",hide:"إخفاء",mustLogin:"يجب أن تسجّل الدخول.",joined:"انضم",city:"المدينة",showcase:"الواجهة",
      approvedSeller:"بائع موثوق",hours:{wd:"09.00 – 16.00",we:"10.00 – 16.00"},shipWindow:"1.5 – 3 أيام عمل",retPolicy:"سارية"},
  de:{brand:"Üreten Eller",navHome:"Start",navPost:"Anzeige aufgeben",navProfile:"Profil",sellerSettings:"Verkäufer-Einstellungen",
      tabs:{urunler:"Produkte",deger:"Bewertungen",hakkinda:"Über",kargo:"Versand & Rückgabe",para:"$$$"},
      msg:"Nachricht",follow:"Folgen",share:"Teilen",report:"Melden",
      premium:"Premium",goPremium:"Zu Premium wechseln",premiumHint:"Premium wird nach Admin-Freigabe aktiviert.",
      premiumActive:(l)=>`Premium aktiv. Kostenloses Schaufenster-Recht: ${l?"1":"0"}`,useShowcase:"Schaufenster-Recht nutzen",
      storeInfo:"Shop-Infos",wd:"Wochentage",we:"Wochenende",ship:"Versandzeit",ret:"Rückgabe",
      none:"Noch keine Anzeigen.",view:"Ansehen",takeShowcase:"Hervorheben",
      payTitle:"Zahlungsdaten",process:"Vorgang",price:"Betrag",freeRight:"Gratisrecht",
      iban:"IBAN",accName:"Kontoname",papara:"Papara",
      payNote:"Nach Überweisung den Beleg hochladen. Nutzernamen in die Notiz schreiben.",
      uploadReceipt:"Beleg hochladen",
      settingsTitle:"Einstellungen",phone:"Telefon",address:"Adresse",avatar:"Avatar",
      save:"Speichern",saveHint:"Upload startet erst nach „Speichern“.",
      pwdNow:"Aktuelles Passwort",pwdNew:"Neues Passwort",pwdNew2:"Neues Passwort (Wiederholen)",updatePwd:"Passwort aktualisieren",
      show:"Anzeigen",hide:"Verbergen",mustLogin:"Bitte anmelden.",joined:"Beitritt",city:"Stadt",showcase:"Schaufenster",
      approvedSeller:"Verifizierte/r Verkäufer/in",hours:{wd:"09.00 – 16.00",we:"10.00 – 16.00"},shipWindow:"1.5 – 3 Werktage",retPolicy:"Gültig"},
};
const SUPPORTED=["tr","en","ar","de"]; const LOCALE_LABEL={tr:"Türkçe",en:"English",ar:"العربية",de:"Deutsch"};
const isRTL=(l)=>l==="ar";
const adNo=(i)=>3838+i;

export default function SellerProfilePage(){
  const mounted = useMounted();
  const [lang,setLang]=useState("tr");
  const t = useMemo(()=>STR[lang], [lang]);

  const [user,setUser]=useState(null);
  const [loading,setLoading]=useState(true);
  const [profile,setProfile]=useState(null);
  const [listings,setListings]=useState([]);
  const [isPremium,setIsPremium]=useState(false);
  const [premiumApproved,setPremiumApproved]=useState(false);
  const [freeShowcaseLeft,setFreeShowcaseLeft]=useState(0);

  const [phone,setPhone]=useState("");
  const [address,setAddress]=useState("");
  const [avatarURL,setAvatarURL]=useState("");
  const [avatarFile,setAvatarFile]=useState(null);
  const [avatarKey,setAvatarKey]=useState(Date.now().toString()); // input reset için

  const [pwdOld,setPwdOld]=useState("");
  const [pwdNew,setPwdNew]=useState("");
  const [pwdNew2,setPwdNew2]=useState("");
  const [visOld,setVisOld]=useState(false);
  const [visNew,setVisNew]=useState(false);
  const [visNew2,setVisNew2]=useState(false);

  const [activeTab,setActiveTab]=useState("urunler");
  const [openPay,setOpenPay]=useState(false);
  const [payKind,setPayKind]=useState("premium"); // premium | showcase
  const [receipt,setReceipt]=useState(null);

  const [msg,setMsg]=useState("");

  useEffect(()=>{
    const off = onAuthStateChanged(auth, async(u)=>{
      setUser(u);
      if(!u){ setLoading(false); return; }

      const uref=doc(db,"users",u.uid);
      const snap=await getDoc(uref);
      let data=snap.exists()?snap.data():null;
      if(!data){
        data={ uid:u.uid, email:u.email||"", username:(u.email||"").split("@")[0]||"",
          city:"", joinedAt:Date.now(), phone:"", address:"",
          premium:false, premiumApproved:false, freeShowcaseLeft:0, avatarURL:"" };
        await setDoc(uref,data,{merge:true});
      }
      setProfile(data);
      setIsPremium(!!data.premium);
      setPremiumApproved(!!data.premiumApproved);
      setFreeShowcaseLeft(Number(data.freeShowcaseLeft||0));
      setPhone(data.phone||""); setAddress(data.address||""); setAvatarURL(data.avatarURL||"");

      const q=query(collection(db,"listings"), where("seller_id","==",u.uid));
      const qs=await getDocs(q);
      const arr=[]; qs.forEach(d=>arr.push({id:d.id,...d.data()})); setListings(arr);

      setLoading(false);
    });
    return ()=>off();
  },[]);

  async function saveSettings(){
    if(!user) return;
    const uref=doc(db,"users",user.uid);
    const updates = { phone,address };
    try{
      if(avatarFile){
        const sref=ref(storage,`avatars/${user.uid}.jpg`);
        await uploadBytes(sref,avatarFile);
        const url=await getDownloadURL(sref);
        updates.avatarURL=url;
        setAvatarURL(url);
        setAvatarFile(null);
        setAvatarKey(Date.now().toString()); // input temizle
      }
      await updateDoc(uref,updates);
      setMsg("✔ Ayarlar kaydedildi.");
    }catch(e){ setMsg("Hata: "+(e?.message||e)); }
  }

  async function changePassword(){
    if(!user) return;
    if(!pwdOld||!pwdNew||!pwdNew2){ setMsg("Lütfen tüm şifre alanlarını doldurun."); return; }
    if(pwdNew.length<6){ setMsg("Yeni şifre en az 6 karakter olmalı."); return; }
    if(pwdNew!==pwdNew2){ setMsg("Yeni şifreler aynı değil."); return; }
    try{
      const cred=EmailAuthProvider.credential(user.email||"",pwdOld);
      await reauthenticateWithCredential(user,cred);
      await updatePassword(user,pwdNew);
      setMsg("✔ Şifre güncellendi."); setPwdOld(""); setPwdNew(""); setPwdNew2("");
    }catch(e){ setMsg("Şifre güncelleme hatası: "+(e?.message||e)); }
  }

  function openPremiumModal(){ setPayKind("premium"); setOpenPay(true); }
  function openShowcaseModal(){ setPayKind("showcase"); setOpenPay(true); }

  // payments -> user_id (security rules ile uyumlu)
  async function uploadReceipt(){
    if(!user||!receipt) return;
    try{
      const name=`${Date.now()}_${receipt.name}`;
      const sref=ref(storage,`receipts/${user.uid}/${name}`);
      await uploadBytes(sref,receipt);
      const url=await getDownloadURL(sref);

      await setDoc(doc(collection(db,"payments")),{
        user_id:user.uid, // önemli
        uid:user.uid,
        kind:payKind,
        amount: payKind==="premium" ? PREMIUM_PRICE : (isPremium?SHOWCASE_PRICE_PREMIUM:SHOWCASE_PRICE_STANDARD),
        receiptURL:url,
        createdAt:Date.now(),
        username: profile?.username || (user.email||"").split("@")[0] || ""
      });

      setMsg("✔ Dekont yüklendi. Admin onayını bekleyin.");
      setOpenPay(false); setReceipt(null);
    }catch(e){ setMsg("Dekont yükleme hatası: "+(e?.message||e)); }
  }

  async function useFreeShowcase(){
    if(!user||!premiumApproved||freeShowcaseLeft<=0) return;
    try{
      const uref=doc(db,"users",user.uid);
      await updateDoc(uref,{ freeShowcaseLeft:freeShowcaseLeft-1 });
      setFreeShowcaseLeft(x=>Math.max(0,x-1));
      setMsg("✔ Ücretsiz vitrin hakkı kullanıldı.");
    }catch(e){ setMsg("Hata: "+(e?.message||e)); }
  }

  const dir=isRTL(lang)?"rtl":"ltr";
  if(!mounted) return <div style={{minHeight:200}}/>;
  if(loading) return <div className="listings" style={{paddingTop:24}}><div className="empty">Yükleniyor...</div></div>;
  if(!user) return (
    <div className="listings" style={{paddingTop:24}}>
      <div className="empty">{t.mustLogin}</div>
      <div style={{marginTop:10}}><Link className="btn" href="/login">Login</Link></div>
    </div>
  );

  const username = profile?.username || (user.email?user.email.split("@")[0]:"user");
  const city = profile?.city || "-";
  const joined = formatDate(profile?.joinedAt);
  const avatar = (avatarURL && avatarURL.startsWith("http")) ? avatarURL : "/avatar.svg";
  const gold = !!profile?.premiumApproved;

  return (
    <div lang={lang} dir={dir}>
      <header className="hdr">
        <Link className="brand" href="/"><img src="/logo.png" width={28} height={28} alt="logo"/><strong>{t.brand}</strong></Link>
        <nav className="hdrNav">
          <Link href="/" className="ghost">{t.navHome}</Link>
          <Link href="/portal/seller/post" className="ghost">{t.navPost}</Link>
          <Link href="/portal/seller/profile" className="ghost active">{t.navProfile}</Link>
          <select aria-label="Language" value={lang} onChange={(e)=>setLang(e.target.value)}>
            {SUPPORTED.map(k=><option key={k} value={k}>{LOCALE_LABEL[k]}</option>)}
          </select>
        </nav>
      </header>

      <section className={`profileCard ${gold?"gold":""}`}>
        <div className="left">
          <div className={`avatarWrap ${gold?"gold":""}`} style={{backgroundImage:`url(${avatar})`}}/>
          <div className="info">
            <div className="name">
              <span>@{username}</span>
              {gold && <span className="badge">★ {t.approvedSeller}</span>}
            </div>
            <div className="user">{t.city}: {city}</div>
            <div className="meta"><span>{t.joined}: {joined}</span><span>{t.showcase}: {freeShowcaseLeft}</span></div>
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
          <div className="premium">
            <div className="ttl">{t.premium}</div>
            <div className="pRow">
              {!isPremium && (<><button className="btn big" onClick={openPremiumModal}>{t.goPremium}</button><span className="hint">{t.premiumHint}</span></>)}
              {isPremium && (<>
                <span className="hint">{t.premiumActive(freeShowcaseLeft>0)}</span>
                {gold && freeShowcaseLeft>0 && <button className="btn" onClick={useFreeShowcase}>{t.useShowcase}</button>}
                <button className="btn ghost" onClick={openShowcaseModal}>{t.takeShowcase}</button>
              </>)}
            </div>
          </div>

          <div className="shop">
            <div className="ttl">{t.storeInfo}</div>
            <table className="tbl"><tbody>
              <tr><td>{t.wd}</td><td>09.00 – 16.00</td></tr>
              <tr><td>{t.we}</td><td>10.00 – 16.00</td></tr>
              <tr><td>{t.ship}</td><td>1.5 – 3</td></tr>
              <tr><td>{t.ret}</td><td>✔</td></tr>
            </tbody></table>
          </div>
        </div>
      </section>

      <section className="listings">
        <div className="tabs2">
          {["urunler","deger","hakkinda","kargo","para"].map(k=>(
            <button key={k} className={activeTab===k?"on":""} onClick={()=>setActiveTab(k)}>{t.tabs[k]}</button>
          ))}
        </div>

        {activeTab==="urunler" && (
          <div className="grid">
            {listings.length===0 && <div className="empty">{t.none}</div>}
            {listings.map((ad,i)=>(
              <article key={ad.id} className="card">
                <div className="thumb" style={{backgroundImage:`url(${ad.image||"/avatar.svg"})`}}>
                  <span className="badge">#{adNo(i)}</span>
                </div>
                <div className="body">
                  <h3 className="title">{ad.title||"İlan"}</h3>
                  <div className="meta"><span>{(ad.price||0)+" ₺"}</span><span>{ad.city||city||"-"}</span></div>
                  <div className="act">
                    <Link href={`/ad/${ad.id}`} className="btn">{t.view}</Link>
                    <button className="btn ghost" onClick={openShowcaseModal}>{t.takeShowcase}</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {activeTab==="deger" && (<div className="empty">Henüz değerlendirme yok.</div>)}
        {activeTab==="hakkinda" && (<div className="form"><div className="sub">Satıcı hakkında kısa bilgi.</div></div>)}
        {activeTab==="kargo" && (<div className="form"><div className="sub">{t.ship}: 1.5 – 3 — {t.ret}: ✔</div></div>)}
        {activeTab==="para" && (
          <div className="form">
            <div className="sub">Premium: ₺{PREMIUM_PRICE} — Showcase: Premium ₺{SHOWCASE_PRICE_PREMIUM}, Standart ₺{SHOWCASE_PRICE_STANDARD}</div>
            <div className="rowBtns" style={{marginTop:8}}>
              {!isPremium && <button className="btn" onClick={openPremiumModal}>{t.goPremium}</button>}
              <button className="btn ghost" onClick={openShowcaseModal}>{t.takeShowcase}</button>
            </div>
          </div>
        )}
      </section>

      <section className="listings" style={{marginTop:8}}>
        <h3 style={{margin:"8px 0"}}>{t.settingsTitle}</h3>
        <div className="grid">
          <div className="form">
            <label className="form">
              <div style={{fontWeight:800,marginBottom:6}}>{t.avatar}</div>
              <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
                <img src={avatar} alt="avatar" width={64} height={64} style={{borderRadius:12,border:"1px solid var(--line)",objectFit:"cover"}} />
                <input key={avatarKey} type="file" accept="image/*" onChange={(e)=>setAvatarFile(e.target.files?.[0]||null)} />
              </div>
            </label>
            <label className="form"><div style={{fontWeight:800,marginBottom:6}}>{t.phone}</div>
              <input type="text" value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="+90..." />
            </label>
            <label className="form"><div style={{fontWeight:800,marginBottom:6}}>{t.address}</div>
              <textarea rows={3} value={address} onChange={(e)=>setAddress(e.target.value)} />
            </label>
            <div className="rowBtns"><button className="btn" onClick={saveSettings}>{t.save}</button><span className="sub">{t.saveHint}</span></div>
          </div>

          <div className="form">
            <label className="form"><div style={{fontWeight:800,marginBottom:6}}>{t.pwdNow}</div>
              <div className="pwdRow">
                <input type={visOld?"text":"password"} value={pwdOld} onChange={(e)=>setPwdOld(e.target.value)} />
                <button className="eye" onClick={()=>setVisOld(v=>!v)}>{visOld?t.hide:t.show}</button>
              </div>
            </label>
            <label className="form"><div style={{fontWeight:800,marginBottom:6}}>{t.pwdNew}</div>
              <div className="pwdRow">
                <input type={visNew?"text":"password"} value={pwdNew} onChange={(e)=>setPwdNew(e.target.value)} />
                <button className="eye" onClick={()=>setVisNew(v=>!v)}>{visNew?t.hide:t.show}</button>
              </div>
            </label>
            <label className="form"><div style={{fontWeight:800,marginBottom:6}}>{t.pwdNew2}</div>
              <div className="pwdRow">
                <input type={visNew2?"text":"password"} value={pwdNew2} onChange={(e)=>setPwdNew2(e.target.value)} />
                <button className="eye" onClick={()=>setVisNew2(v=>!v)}>{visNew2?t.hide:t.show}</button>
              </div>
            </label>
            <div className="rowBtns"><button className="btn" onClick={changePassword}>{t.updatePwd}</button></div>
          </div>
        </div>
      </section>

      {openPay && (
        <div className="modal" onClick={()=>setOpenPay(false)}>
          <div className="sheet" onClick={(e)=>e.stopPropagation()}>
            <div className="mHd"><div className="mTtl">{t.payTitle}</div><button className="x" onClick={()=>setOpenPay(false)}>✕</button></div>
            <div className="mBd">
              <div className="payBox">
                <div className="row"><strong>{t.process}</strong><span className="mono">{payKind==="premium"?"Premium":"Showcase"}</span></div>
                <div className="row"><strong>{t.price}</strong><span className="mono">
                  {payKind==="premium" ? `₺${PREMIUM_PRICE}` : (isPremium?`₺${SHOWCASE_PRICE_PREMIUM}`:`₺${SHOWCASE_PRICE_STANDARD}`)}
                </span></div>
                <div className="row"><strong>{t.iban}</strong><span className="mono">{IBAN}</span></div>
                <div className="row"><strong>{t.accName}</strong><span className="mono">{ACCOUNT_NAME}</span></div>
                <div className="row"><strong>{t.papara}</strong><span className="mono">{IBAN} – {ACCOUNT_NAME} – {PAPARA}</span></div>
                <div className="sub" style={{marginTop:6}}>{t.payNote}</div>
              </div>
              <div className="receipt">
                <input type="file" accept="image/*,application/pdf" onChange={(e)=>setReceipt(e.target.files?.[0]||null)} />
                <button className="btn" onClick={uploadReceipt}>{t.uploadReceipt}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="legal">
        <div className="inner">
          <div className="links">
            <Link href="/legal/kurumsal">Kurumsal</Link><Link href="/legal/hakkimizda">Hakkımızda</Link>
            <Link href="/legal/iletisim">İletişim</Link><Link href="/legal/gizlilik">Gizlilik</Link>
            <Link href="/legal/kvkk-aydinlatma">KVKK</Link><Link href="/legal/kullanim-sartlari">Kullanım Şartları</Link>
            <Link href="/legal/mesafeli-satis-sozlesmesi">Mesafeli Satış</Link><Link href="/legal/teslimat-iade">Teslimat & İade</Link>
            <Link href="/legal/cerez-politikasi">Çerez</Link><Link href="/legal/topluluk-kurallari">Topluluk</Link>
            <Link href="/legal/yasakli-urunler">Yasaklı Ürünler</Link>
          </div>
          <div className="copy">© 2025 {t.brand}</div>
        </div>
      </footer>

      {msg && (
        <div style={{position:"fixed",bottom:16,left:"50%",transform:"translateX(-50%)",background:"#111827",color:"#fff",
          border:"1px solid #000",padding:"8px 12px",borderRadius:12,zIndex:80}} onClick={()=>setMsg("")}>{msg}</div>
      )}
    </div>
  );
}
