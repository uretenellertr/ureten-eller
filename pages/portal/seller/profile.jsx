import React, {useEffect, useMemo, useState} from "react";

/**
 * SELLER PROFILE — Rev 2 (per latest notes)
 * - İletişim (Ad Soyad / Telefon / Açık Adres) avatarın YANINDA
 * - "Şikayet et / Bildir" misafir dahil herkes görür
 * - Premium Ol butonu ÖDEME MODALI açar (IBAN/Papara + kopyala + uyarı)
 * - Onay Bekleyen / Yayında / Süresi Biten: butonlar TAB açar (sayfa içi)
 * - Üst bardaki semboller kaldırıldı, renkli banner eklendi
 * - Dil (TR / EN / AR / DE) ve RTL destekli
 * - Admin/Mod: Verified & Premium toggle → localStorage
 */

export default function SellerProfile(){
  const [profile, setProfile] = useState({});
  const [lang, setLang] = useState("tr");
  const [tab, setTab] = useState("live"); // pending | live | expired
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  // Premium form state
  const [paymentForm, setPaymentForm] = useState({fullName: '', phone:'', address:'', username:'', file:null});
  const [paymentErrors, setPaymentErrors] = useState({});

  useEffect(()=>{
    if(typeof window!=="undefined"){
      try{
        const s = localStorage.getItem("ue_profile");
        setProfile(s? JSON.parse(s) : {});
      }catch{}
      const L = localStorage.getItem("lang") || "tr";
      setLang(L);
    }
  },[]);

  const dir = lang === "ar" ? "rtl" : "ltr";
  const t = texts[lang] || texts.tr;

  // helpers
  const val = (v) => (v===0 || v ? String(v) : "—");
  const initials = (name) => {
    if(!name) return "?";
    return name.split(" ").filter(Boolean).slice(0,2).map(s=>s[0]).join("").toUpperCase();
  };

  const isPremium = !!profile.premium;
  const isVerified = !!profile.verified;
  const role = (typeof window!=="undefined" && (localStorage.getItem("role")||"user")).toLowerCase();
  const isStaff = ["admin","moderator","mod"].includes(role);

  const stats = profile.stats || {};
  const rating = typeof stats.rating === "number" ? stats.rating : null;
  const ratingCount = stats.ratingCount || 0;
  const totalSales = stats.totalSales || 0;

  const delivery = profile.delivery || { cities: [], etaDays: null, fee: null, pickup: false };
  const returns = Array.isArray(profile.returns) ? profile.returns : [];

  // Contact & payment & listings helpers
  const fullName = profile.fullName || profile.displayName || profile.name;
  const phone = profile.phone || "—";
  const address = profile.address || (profile.city && profile.district ? `${profile.city}, ${profile.district}` : "—");

  const payments = profile.payments || {};
  const IBAN = payments.iban || "TR590082900009491868461105";
  const accountName = payments.accountName || "Nejla Kavuncu";
  const papara = payments.papara || "Nejla Kavuncu";

  const listings = Array.isArray(profile.listings) ? profile.listings : [];
  const ownerView = isStaff || role==='seller';

  const live = listings.filter(it=>it.status==='live');
  const pending = listings.filter(it=>it.status==='pending');
  const expired = listings.filter(it=>it.status==='expired');
  const currentListings = tab==='pending' ? pending : (tab==='live' ? live : expired);

  function saveProfile(next){
    const merged = { ...profile, ...next };
    try{ localStorage.setItem("ue_profile", JSON.stringify(merged)); }catch{}
    setProfile(merged);
  }

  function onLangChange(e){
    const L = e.target.value;
    setLang(L);
    try{ localStorage.setItem("lang", L); 
  }

  // Prefill premium form when modal opens
  useEffect(()=>{
    if(showPremiumModal){
      setPaymentForm({
        fullName: fullName || '',
        phone: phone || '',
        address: address || '',
        username: (profile.username || profile.name || ''),
        file: null
      });
      setPaymentErrors({});
    }
  }, [showPremiumModal]);

  function handlePFChange(e){
    setPaymentForm({...paymentForm, [e.target.name]: e.target.value});
  }
  function handlePFFile(e){
    setPaymentForm({...paymentForm, file: e.target.files?.[0] || null});
  }
  function submitPremium(){
    const errs = {};
    if(!paymentForm.fullName) errs.fullName = true;
    if(!paymentForm.phone) errs.phone = true;
    if(!paymentForm.address) errs.address = true;
    if(!paymentForm.username) errs.username = true;
    if(!paymentForm.file) errs.file = true;
    setPaymentErrors(errs);
    if(Object.keys(errs).length){ alert(t.missingInfo); return; }
    try{
      const payload = { ...paymentForm, fileName: paymentForm.file?.name, fileType: paymentForm.file?.type, date: new Date().toISOString() };
      localStorage.setItem("ue_premium_request", JSON.stringify(payload));
      alert(t.sentForReview);
      setShowPremiumModal(false);
    }catch{
      alert(t.saveError);
    }
  }catch{}
  }

  return (
    <div dir={dir} className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50 to-amber-50 text-slate-900">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200 px-4 py-3 flex items-center gap-3">
        {/* Avatar */}
        <div className={`relative shrink-0 ${isPremium?"goldFrame":""}`}>
          <div className={`w-12 h-12 rounded-full grid place-items-center font-black text-lg bg-slate-200`}>{initials(profile.displayName || profile.name)}</div>
        </div>

        {/* Title block */}
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-extrabold truncate">{val(profile.displayName || profile.name)}</h1>
          <div className="text-slate-600 text-sm truncate">{[val(profile.city), profile.district?`/${profile.district}`:""] .join("")}</div>
        </div>

        {/* Language selector */}
        <label className="sr-only" htmlFor="langSel">{t.language}</label>
        <select id="langSel" value={lang} onChange={onLangChange} className="border border-slate-300 rounded-lg px-2 py-1 text-sm bg-white">
          <option value="tr">TR</option>
          <option value="en">EN</option>
          <option value="ar">AR</option>
          <option value="de">DE</option>
        </select>

        {/* Premium button opens PAYMENT MODAL */}
        {!isPremium && (
          <button onClick={()=>setShowPremiumModal(true)} className="ml-2 btnPremium">{t.completePremium}</button>
        )}

        {/* Home */}
        
      </header>

      {/* Decorative banner */}
      <div className="mx-3 sm:mx-4 mt-3">
        <div className="rounded-2xl p-4 md:p-5 bg-gradient-to-r from-rose-500 via-fuchsia-500 to-amber-400 text-white shadow-lg">
          <div className="max-w-5xl mx-auto flex items-center gap-3">
            <div className="text-lg md:text-xl font-extrabold">{t.profileBanner}</div>
            {isVerified && <span className="ms-auto text-xs font-black bg-white/20 px-2 py-1 rounded-full">{t.verified}</span>}
          </div>
        </div>
      </div>

      {/* Body */}
      <main className="px-3 sm:px-4 py-4 pb-28 max-w-5xl mx-auto grid md:grid-cols-[300px,1fr] gap-6">
        {/* Left column */}
        <aside className="md:sticky md:top-[72px] self-start space-y-4">
          {/* Avatar & Contact card (contact NEXT TO avatar) */}
          <section className="panel p-4">
            <div className="flex items-start gap-3">
              <div className={`relative ${isPremium?"goldFrameLg":""}`}>
                <div className="w-20 h-20 rounded-2xl grid place-items-center text-2xl font-black bg-slate-200">
                  {initials(profile.displayName || profile.name)}
                </div>
              </div>
              <div className="flex-1">
                {isVerified && (
                  <div className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 inline-flex items-center gap-1 rounded-full px-2 py-0.5">
                    {t.verified}
                  </div>
                )}
                <div className="mt-2 text-sm text-slate-700 leading-5">
                  <div><b>{t.memberSince}:</b> {val(profile.joinedAt)}</div>
                  <div><b>{t.sales}:</b> {totalSales>0? totalSales : "0"}</div>
                </div>

                {/* CONTACT right beside avatar */}
                <div className="mt-3 text-sm leading-5">
                  <div className="font-semibold mb-1">{t.contactInfo}</div>
                  <div><b>{t.fullName}:</b> {val(fullName)}</div>
                  <div><b>{t.username}:</b> {val(profile.username)}</div>
                  <div><b>{t.phone}:</b> <a href={`tel:${phone}`} className="hover:underline">{val(phone)}</a></div>
                  <div><b>{t.openAddress}:</b> <span className="whitespace-pre-wrap">{val(address)}</span></div>
                </div>
              </div>
            </div>
            {/* Label under avatar when verified */}
            {isVerified && (
              <div className="mt-3 text-center text-[12px] font-extrabold text-emerald-700">{t.verified}</div>
            )}

            <div className="mt-4 text-sm">
              <div className="font-semibold mb-1">{t.badges}</div>
              <div className="flex flex-wrap gap-2">
                {(profile.badges||[]).length? (profile.badges||[]).map((b,i)=> (
                  <span key={i} className="text-xs bg-white/70 border border-slate-200 px-2 py-1 rounded-full">{String(b)}</span>
                )) : (
                  <span className="text-xs text-slate-500">{t.noBadges}</span>
                )}
              </div>
            </div>
          </section>

          {/* Owner shortcuts (open tabs) */}
          {ownerView && (
            <section className="panel p-4 space-y-2">
              <div className="text-sm font-bold mb-2">{t.myStore}</div>
              <div className="grid grid-cols-3 gap-2">
                <button type="button" className={`btnGhost ${tab==='pending'?'ring-2 ring-rose-400':''}`} onClick={()=>setTab('pending')}>{t.pendingListings}</button>
                <button type="button" className={`btnGhost ${tab==='live'?'ring-2 ring-emerald-400':''}`} onClick={()=>setTab('live')}>{t.liveListings}</button>
                <button type="button" className={`btnGhost ${tab==='expired'?'ring-2 ring-amber-400':''}`} onClick={()=>setTab('expired')}>{t.expiredListings}</button>
              </div>
            </section>
          )}

          {/* Admin / Moderator Panel */}
          {isStaff && (
            <section className="panel p-4 space-y-3">
              <div className="text-sm font-extrabold">{t.adminPanel}</div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={isVerified} onChange={(e)=>saveProfile({ verified: e.target.checked })} />
                <span>{t.grantVerified}</span>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={isPremium} onChange={(e)=>saveProfile({ premium: e.target.checked })} />
                <span>{t.grantPremium}</span>
              </label>
              <button className="btnPrimary" onClick={()=>alert(t.saved)}>{t.save}</button>
              <p className="text-xs text-slate-500">{t.adminHint}</p>
            </section>
          )}

          {/* Report — visible to guests too */}
          <section className="panel p-4">
            <button className="w-full btnDanger">{t.report}</button>
          </section>
        </aside>

        {/* Right column */}
        <section className="space-y-6">
          {/* Listings Manager with tabs */}
          {ownerView && (
            <div id="sellerPanel" className="panel p-4">
              <div className="flex items-center gap-2">
                <button type="button" className={`btnGhost ${tab==='pending'?'ring-2 ring-rose-400':''}`} onClick={()=>setTab('pending')}>{t.pendingListings}</button>
                <button type="button" className={`btnGhost ${tab==='live'?'ring-2 ring-emerald-400':''}`} onClick={()=>setTab('live')}>{t.liveListings}</button>
                <button type="button" className={`btnGhost ${tab==='expired'?'ring-2 ring-amber-400':''}`} onClick={()=>setTab('expired')}>{t.expiredListings}</button>
              </div>
              <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
                {currentListings?.length ? currentListings.map((it,idx)=> (
                  <div key={idx} className="relative panel p-3">
                    <div className="aspect-[4/3] bg-slate-100 rounded-lg"></div>
                    <div className="mt-2 font-semibold text-sm truncate">{it.title || "İlan"}</div>
                    {/* Aksiyonlar ILAN ÜSTÜNDE */}
                    <div className="absActions">
                      <a className="pill" href={`/portal/seller/extend?id=${it.id||idx}`}>{t.extend}</a>
                      <a className="pill" href={`/portal/seller/edit?id=${it.id||idx}`}>{t.edit}</a>
                      <a className="pill danger" href={`/portal/seller/delete?id=${it.id||idx}`}>{t.delete}</a>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full text-slate-500 text-sm">{t.noListings}</div>
                )}
              </div>
            </div>
          )}

          {/* Bio */}
          <div className="panel p-4">
            <div className="text-sm font-bold mb-2">{t.about}</div>
            <p className="text-slate-800 leading-6 whitespace-pre-wrap">{val(profile.bio)}</p>
          </div>

          {/* Work mode & Delivery */}
          <div className="panel p-4 grid sm:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-bold mb-1">{t.customOrder}</div>
              <div className="text-slate-800">{profile.acceptsCustom? t.customYes: t.customNo}</div>
            </div>
            <div>
              <div className="text-sm font-bold mb-1">{t.delivery}</div>
              <div className="text-slate-800 text-sm">
                <div><b>{t.cities}:</b> {delivery.cities && delivery.cities.length ? delivery.cities.join(", ") : "—"}</div>
                <div><b>{t.eta}:</b> {delivery.etaDays ? `${delivery.etaDays} ${t.day}` : "—"}</div>
                <div><b>{t.fee}:</b> {delivery.fee ?? "—"}</div>
                <div><b>{t.pickup}:</b> {delivery.pickup? t.yes: t.no}</div>
              </div>
            </div>
          </div>

          {/* Returns */}
          <div className="panel p-4">
            <div className="text-sm font-bold mb-2">{t.returns}</div>
            {returns.length ? (
              <ul className="list-disc ms-5 text-slate-800 space-y-1">
                {returns.map((r,i)=> <li key={i}>{String(r)}</li>)}
              </ul>
            ) : (
              <div className="text-slate-500 text-sm">{t.noReturns}</div>
            )}
          </div>

          {/* Rating & Reviews */}
          <div className="panel p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold">{t.rating}</div>
              <a className="btnGhost" href="#reviews">{t.reviews}</a>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Stars value={rating} />
              <div className="text-sm text-slate-700">{rating? rating.toFixed(1) : "—"} ({ratingCount})</div>
            </div>
            <p className="mt-2 text-xs text-slate-500">{t.noSelfRate}</p>
          </div>

          {/* Showcase (public) */}
          <div className="panel p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold">{t.showcase}</div>
              {ownerView && <a href="/portal/seller/post" className="btnPrimary">{t.newListing}</a>}
            </div>
            <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
              {listings.length ? listings.map((it,idx)=> (
                <div key={idx} className="relative panel p-3">
                  <div className="aspect-[4/3] bg-slate-100 rounded-lg"></div>
                  <div className="mt-2 font-semibold text-sm truncate">{it.title || "İlan"}</div>
                  {ownerView && (
                    <div className="absActions">
                      <a className="pill" href={`/portal/seller/extend?id=${it.id||idx}`}>{t.extend}</a>
                      <a className="pill" href={`/portal/seller/edit?id=${it.id||idx}`}>{t.edit}</a>
                      <a className="pill danger" href={`/portal/seller/delete?id=${it.id||idx}`}>{t.delete}</a>
                    </div>
                  )}
                </div>
              )) : (
                <div className="col-span-full text-slate-500 text-sm">{t.noListings}</div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Legal footer */}
      <footer className="mt-8 border-t border-slate-200 bg-black text-slate-100">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 flex flex-wrap gap-3 items-center text-sm">
          <a className="hover:underline" href="/legal/kurumsal">{t.corporate}</a>
          <a className="hover:underline" href="/legal/hakkimizda">{t.aboutUs}</a>
          <a className="hover:underline" href="/legal/iletisim">{t.contact}</a>
          <a className="hover:underline" href="/legal/gizlilik">{t.privacy}</a>
          <a className="hover:underline" href="/legal/kullanim-sartlari">{t.terms}</a>
          <a className="hover:underline" href="/legal/teslimat-iade">{t.shippingReturn}</a>
          <a className="hover:underline" href="/legal/cerez-politikasi">{t.cookies}</a>
          <a className="ml-auto opacity-80">© 2025 Üreten Eller</a>
        </div>
      </footer>

      {/* Fixed bottom bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-slate-200 px-4 py-2 flex items-center justify-around z-20">
        <a href="/" className="navBtn">{t.home}</a>
        <a href="/portal/customer" className="navBtn">{t.messages}</a>
        <a href="/portal/seller" className="navBtn">{t.notifications}</a>
      </nav>

      {/* PREMIUM PAYMENT MODAL */}
      {showPremiumModal && (
        <div className="fixed inset-0 z-30 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={()=>setShowPremiumModal(false)}></div>
          <div className="relative z-40 w-[min(560px,92vw)] panel p-4">
            <div className="flex items-center justify-between">
              <div className="text-lg font-extrabold">{t.payment}</div>
              <button className="btnGhost" onClick={()=>setShowPremiumModal(false)}>✕</button>
            </div>
            <form className="mt-2 text-sm space-y-3" onSubmit={(e)=>{e.preventDefault(); submitPremium();}}>
              <div><b>{t.payNow}:</b></div>
              <div className="grid gap-2">
                <label className="block">
                  <span className="text-xs font-bold">{t.fullName}</span>
                  <input name="fullName" value={paymentForm.fullName} onChange={handlePFChange} className={`w-full mt-1 border rounded-lg px-3 py-2 ${paymentErrors.fullName? 'border-red-500':'border-slate-300'}`} placeholder="Ad Soyad" />
                </label>
                <label className="block">
                  <span className="text-xs font-bold">{t.username}</span>
                  <input name="username" value={paymentForm.username} onChange={handlePFChange} className={`w-full mt-1 border rounded-lg px-3 py-2 ${paymentErrors.username? 'border-red-500':'border-slate-300'}`} placeholder="kullaniciadi" />
                </label>
                <label className="block">
                  <span className="text-xs font-bold">{t.phone}</span>
                  <input name="phone" value={paymentForm.phone} onChange={handlePFChange} className={`w-full mt-1 border rounded-lg px-3 py-2 ${paymentErrors.phone? 'border-red-500':'border-slate-300'}`} placeholder="05xx xxx xx xx" />
                </label>
                <label className="block">
                  <span className="text-xs font-bold">{t.openAddress}</span>
                  <textarea name="address" value={paymentForm.address} onChange={handlePFChange} className={`w-full mt-1 border rounded-lg px-3 py-2 ${paymentErrors.address? 'border-red-500':'border-slate-300'}`} rows={3} placeholder="Açık adres" />
                </label>
                <div className="text-xs text-slate-600">{t.paymentNote} <b>{t.paymentUserHint}</b></div>
              </div>

              <div className="pt-2 border-t">
                <div className="font-semibold mb-1">{t.transferInfo}</div>
                <div><b>{t.bankTransfer}:</b> <span className="break-all">{IBAN}</span></div>
                <div><b>{t.accountName}:</b> {accountName}</div>
                <div><b>{t.papara}:</b> {papara}</div>
                <div className="flex gap-2 mt-2">
                  <button type="button" className="btnGhost" onClick={()=>navigator.clipboard?.writeText(IBAN).then(()=>alert(t.copied))}>{t.copy} IBAN</button>
                  <button type="button" className="btnGhost" onClick={()=>navigator.clipboard?.writeText(papara).then(()=>alert(t.copied))}>{t.copy} Papara</button>
                </div>
              </div>

              <label className="block pt-2 border-t">
                <span className="text-xs font-bold">{t.uploadReceipt}</span>
                <input type="file" accept="image/*,.pdf" onChange={handlePFFile} className={`block mt-1 ${paymentErrors.file? 'text-red-600':'text-slate-700'}`} />
                {paymentForm.file && <div className="text-xs mt-1">{paymentForm.file.name}</div>}
              </label>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" className="btnGhost" onClick={()=>setShowPremiumModal(false)}>{t.cancel}</button>
                <button type="submit" className="btnPremium">{t.completePremium}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        /* Buttons */
        .btnPrimary{border:1px solid #111827;background:#111827;color:#fff;border-radius:12px;padding:8px 12px;font-weight:800}
        .btnGhost{border:1px solid rgba(0,0,0,.12);background:#fff;border-radius:10px;padding:8px 10px;font-weight:700}
        .btnDestructive{border:1px solid #991b1b;background:#fee2e2;color:#991b1b;border-radius:10px;padding:8px 10px;font-weight:800}
        .btnDanger{border:1px solid #991b1b;background:#991b1b;color:#fff;border-radius:12px;padding:10px 12px;font-weight:900}
        .btnPremium{border:1px solid #f59e0b;background:linear-gradient(180deg,#fde68a,#f59e0b);color:#111827;border-radius:12px;padding:8px 12px;font-weight:900}
        .navBtn{font-weight:800;padding:8px 12px;border-radius:10px;border:1px solid rgba(0,0,0,.1)}

        /* Panels */
        .panel{background:linear-gradient(180deg,rgba(255,255,255,.95),rgba(255,255,255,.85));border:1px solid rgba(15,23,42,.08);border-radius:16px;box-shadow:0 10px 24px -12px rgba(15,23,42,.15)}

        /* Ornate golden frames for premium */
        .goldFrame:before{content:"";position:absolute;inset:-4px;border-radius:9999px;padding:2px;background:conic-gradient(from 0deg,#f59e0b,#fde68a,#f59e0b);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude}
        .goldFrameLg:before{content:"";position:absolute;inset:-6px;border-radius:16px;padding:3px;background:conic-gradient(from 0deg,#f59e0b,#fde68a,#f59e0b);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude}

        /* Card actions */
        .absActions{position:absolute;top:8px;right:8px;display:flex;gap:6px}
        .pill{background:#fff;border:1px solid rgba(0,0,0,.12);border-radius:9999px;padding:4px 8px;font-size:12px;font-weight:800}
        .pill.danger{border-color:#991b1b;color:#991b1b;background:#fee2e2}
      `}</style>
    </div>
  );
}

function Stars({value}){
  const v = typeof value === "number" ? Math.max(0, Math.min(5, value)) : 0;
  return (
    <div className="inline-flex items-center gap-1" aria-label="rating">
      {Array.from({length:5}).map((_,i)=> (
        <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill={i+1<=Math.round(v)?"currentColor":"none"} stroke="currentColor" className={i+1<=Math.round(v)?"text-amber-500":"text-slate-300"}>
          <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
      ))}
    </div>
  );
}

const texts = {
  tr: {
    language: "Dil",
    profileBanner: "Satıcı Profiliniz",
    verified: "Onaylı Satıcı",
    memberSince: "Mağazaya Katılım",
    sales: "Toplam Satış",
    contactInfo: "İletişim",
    fullName: "Ad Soyad",
    username: "Kullanıcı Adı",
    phone: "Telefon",
    openAddress: "Açık Adres",
    badges: "Güven Rozetleri",
    noBadges: "Rozet yok",
    myStore: "Mağazam",
    pendingListings: "Onay Bekleyen",
    liveListings: "Yayında",
    expiredListings: "Süresi Biten",
    adminPanel: "Yönetici Paneli",
    grantVerified: "Onaylı satıcı ver",
    grantPremium: "Premium ver",
    save: "Kaydet",
    saved: "Kaydedildi",
    adminHint: "Bu ayarlar yalnızca yerel olarak saklanır.",
    report: "Şikayet et / Bildir",
    about: "Hakkımda",
    customOrder: "Kişiye özel sipariş",
    customYes: "Alıyorum",
    customNo: "Almıyorum",
    delivery: "Teslimat",
    cities: "Şehirler",
    eta: "Tahmini Süre",
    day: "gün",
    fee: "Kargo Ücreti",
    pickup: "Elden Teslim",
    yes: "Evet",
    no: "Hayır",
    returns: "İade / Değişim Kuralları",
    noReturns: "Belirtilmedi.",
    rating: "Puan",
    reviews: "Yorumlar",
    noSelfRate: "Kendi kendine puan verilemez.",
    showcase: "Vitrin",
    newListing: "Yeni İlan",
    noListings: "Gösterilecek ilan yok.",
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
    payment: "Ödeme",
    payNow: "Ödeme Yap",
    paymentNote: "Ödeme yapmadan önce siparişi oluşturunuz. Lütfen açıklama kısmına kullanıcı adınızı ve profil bilgilerinizi yazın.",
    paymentUserHint: "(kullanıcı adınız)",
    bankTransfer: "Havale/EFT",
    accountName: "Hesap Adı",
    papara: "Papara",
    copy: "Kopyala",
    uploadReceipt: "Dekont Yükle",
    cancel: "Vazgeç",
    completePremium: "Premium Tamamla",
    missingInfo: "Lütfen gerekli alanları doldurun.",
    sentForReview: "Başvurunuz alındı. Yönetici incelemesine gönderildi.",
    saveError: "Kaydedilemedi, lütfen tekrar deneyin.",
    transferInfo: "Havale Bilgileri"
  },
  en: {
    language: "Language",
    profileBanner: "Your Seller Profile",
    verified: "Verified Seller",
    memberSince: "Member Since",
    sales: "Total Sales",
    contactInfo: "Contact",
    fullName: "Full Name",
    username: "Username",
    phone: "Phone",
    openAddress: "Address",
    badges: "Trust Badges",
    noBadges: "No badges",
    myStore: "My Store",
    pendingListings: "Pending",
    liveListings: "Live",
    expiredListings: "Expired",
    adminPanel: "Admin Panel",
    grantVerified: "Grant verified",
    grantPremium: "Grant premium",
    save: "Save",
    saved: "Saved",
    adminHint: "These settings are stored locally only.",
    report: "Report",
    about: "About",
    customOrder: "Custom orders",
    customYes: "Accepting",
    customNo: "Not accepting",
    delivery: "Delivery",
    cities: "Cities",
    eta: "ETA",
    day: "day",
    fee: "Shipping Fee",
    pickup: "Pickup",
    yes: "Yes",
    no: "No",
    returns: "Return / Exchange Rules",
    noReturns: "Not specified.",
    rating: "Rating",
    reviews: "Reviews",
    noSelfRate: "Self‑rating is not allowed.",
    showcase: "Showcase",
    newListing: "New Listing",
    noListings: "No listings to show.",
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
    payment: "Payment",
    payNow: "Pay Now",
    paymentNote: "Create your order before paying. Please add your username and profile info in the description.",
    paymentUserHint: "(your username)",
    bankTransfer: "Bank Transfer",
    accountName: "Account Name",
    papara: "Papara",
    copy: "Copy",
    uploadReceipt: "Upload Receipt",
    cancel: "Cancel",
    completePremium: "Complete Premium",
    missingInfo: "Please fill the required fields.",
    sentForReview: "Submission received. Sent to admin for review.",
    saveError: "Could not save, please try again.",
    transferInfo: "Transfer Info"
  },
  ar: {
    language: "اللغة",
    profileBanner: "ملف البائع",
    verified: "بائع موثّق",
    memberSince: "عضو منذ",
    sales: "إجمالي المبيعات",
    contactInfo: "التواصل",
    fullName: "الاسم الكامل",
    username: "اسم المستخدم",
    phone: "الهاتف",
    openAddress: "العنوان",
    badges: "شارات الثقة",
    noBadges: "لا توجد شارات",
    myStore: "متجري",
    pendingListings: "بانتظار الموافقة",
    liveListings: "نشط",
    expiredListings: "منتهي",
    adminPanel: "لوحة المشرف",
    grantVerified: "منح التوثيق",
    grantPremium: "منح بريميوم",
    save: "حفظ",
    saved: "تم الحفظ",
    adminHint: "يتم حفظ هذه الإعدادات محليًا فقط.",
    report: "إبلاغ",
    about: "نبذة",
    customOrder: "طلبات خاصة",
    customYes: "مقبول",
    customNo: "غير مقبول",
    delivery: "التسليم",
    cities: "المدن",
    eta: "المدة المتوقعة",
    day: "يوم",
    fee: "رسوم الشحن",
    pickup: "الاستلام",
    yes: "نعم",
    no: "لا",
    returns: "سياسة الإرجاع/الاستبدال",
    noReturns: "غير محدد.",
    rating: "التقييم",
    reviews: "المراجعات",
    noSelfRate: "لا يسمح بالتقييم الذاتي.",
    showcase: "المعرض",
    newListing: "إعلان جديد",
    noListings: "لا توجد إعلانات.",
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
    payment: "الدفع",
    payNow: "ادفع الآن",
    paymentNote: "يُرجى إنشاء الطلب قبل الدفع. أضف اسم المستخدم ومعلومات ملفك في الوصف.",
    paymentUserHint: "(اسم المستخدم)",
    bankTransfer: "حوالة بنكية",
    accountName: "اسم الحساب",
    papara: "Papara",
    copy: "نسخ",
    uploadReceipt: "رفع إيصال",
    cancel: "إلغاء",
    completePremium: "إكمال البريميوم",
    missingInfo: "يرجى ملء الحقول المطلوبة.",
    sentForReview: "تم الاستلام وأُرسل للمشرف.",
    saveError: "تعذر الحفظ، حاول مرة أخرى.",
    transferInfo: "معلومات الحوالة"
  },
  de: {
    language: "Sprache",
    profileBanner: "Ihr Verkäuferprofil",
    verified: "Verifizierter Verkäufer",
    memberSince: "Mitglied seit",
    sales: "Gesamtverkäufe",
    contactInfo: "Kontakt",
    fullName: "Vollständiger Name",
    username: "Benutzername",
    phone: "Telefon",
    openAddress: "Adresse",
    badges: "Vertrauensabzeichen",
    noBadges: "Keine Abzeichen",
    myStore: "Mein Shop",
    pendingListings: "Ausstehend",
    liveListings: "Aktiv",
    expiredListings: "Abgelaufen",
    adminPanel: "Adminbereich",
    grantVerified: "Verifiziert vergeben",
    grantPremium: "Premium vergeben",
    save: "Speichern",
    saved: "Gespeichert",
    adminHint: "Diese Einstellungen werden nur lokal gespeichert.",
    report: "Melden",
    about: "Über mich",
    customOrder: "Sonderbestellungen",
    customYes: "Ja",
    customNo: "Nein",
    delivery: "Lieferung",
    cities: "Städte",
    eta: "Lieferzeit",
    day: "Tag",
    fee: "Versandkosten",
    pickup: "Abholung",
    yes: "Ja",
    no: "Nein",
    returns: "Rückgabe / Umtausch",
    noReturns: "Nicht angegeben.",
    rating: "Bewertung",
    reviews: "Bewertungen",
    noSelfRate: "Selbstbewertung ist nicht erlaubt.",
    showcase: "Schaufenster",
    newListing: "Neue Anzeige",
    noListings: "Keine Anzeigen vorhanden.",
    corporate: "Unternehmen",
    aboutUs: "Über uns",
    contact: "Kontakt",
    privacy: "Datenschutz",
    terms: "Nutzungsbedingungen",
    shippingReturn: "Lieferung & Rückgabe",
    cookies: "Cookie‑Richtlinie",
    home: "Startseite",
    messages: "Nachrichten",
    notifications: "Benachrichtigungen",
    payment: "Zahlung",
    payNow: "Jetzt zahlen",
    paymentNote: "Bitte Bestellung vor der Zahlung anlegen. Fügen Sie Benutzername und Profilinfo in die Beschreibung ein.",
    paymentUserHint: "(Ihr Benutzername)",
    bankTransfer: "Überweisung",
    accountName: "Kontoinhaber",
    papara: "Papara",
    copy: "Kopieren",
    uploadReceipt: "Beleg hochladen",
    cancel: "Abbrechen",
    completePremium: "Premium abschließen",
    missingInfo: "Bitte Pflichtfelder ausfüllen.",
    sentForReview: "Eingang bestätigt. An Admin gesendet.",
    saveError: "Speichern fehlgeschlagen, bitte erneut versuchen.",
    transferInfo: "Überweisungsdaten"
  }
};
