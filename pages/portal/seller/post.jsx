"use client";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

/**
 * FILE: /pages/portal/seller/post.jsx
 * Seller → İlan Ver (renkli tasarım + legal footer + dil devamlılığı)
 * — Supabase (listings, listing_photos) + Cloudinary upload
 * — Kota: Standart(30 günde 1), Pro(15 + 1 vitrin)
 * — 81 il dropdown, ilçe manuel, teslim süresi (gün) zorunlu
 * — Küfür/iletişim engeli: check_listing_text RPC
 */

/* ---------------------------- Supabase & Cloudinary ---------------------------- */
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = typeof window !== "undefined" && SUPABASE_URL && SUPABASE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

async function uploadToCloudinary(file) {
  if (!CLOUD_NAME || !UPLOAD_PRESET) throw new Error("Cloudinary env eksik");
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", UPLOAD_PRESET);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: "POST", body: fd });
  if (!res.ok) throw new Error("Cloudinary yükleme hatası");
  const json = await res.json();
  return json.secure_url;
}

/* ---------------------------- Dil (localStorage'dan devam) ---------------------------- */
const SUPPORTED = ["tr","en","ar","de"];
const LBL = {
  tr: {
    brand: "Üreten Eller",
    postTitle: "İlan Ver",
    subtitle: "Premium: 15 ilan + 1 vitrin. Standart: ayda 1 ilan. Her ilan 30 gün yayında.",
    back: "Geri",
    required: "Zorunlu",
    select: "Seçiniz...",
    chooseCat: "Önce kategori seçiniz",
    invalid: "Geçersiz",
    draft: "Taslak Kaydet",
    send: "Onaya Gönder",
    premiumNeeded: "Premium gerekli",
    oneRight: "1 hak",
    rules: "Yayın Kuralları",
    tips: "Öneriler",
    rulesList: [
      "İlanlar 30 gün yayında kalır. Süre dolunca \"Süre uzat\" ile +30 gün.",
      "Premium: aynı anda 15 ilan + 1 vitrin.",
      "Standart: ayda 1 ilan.",
      "Yasaklı/küfürlü kelimeler ve iletişim (tel/e‑posta/WhatsApp) yasaktır.",
      "İlanlar önce admin onayına düşer.",
    ],
    tipsList: [
      "Kapakta 4:3 oranlı net bir fotoğraf kullanın.",
      "Fiyat, ölçü ve teslim süresini açık yazın.",
      "Alt kategori seçmek aramalarda görünürlüğü artırır.",
    ],
    fields: {
      title: "Başlık",
      desc: "Açıklama",
      cat: "Ana Kategori",
      sub: "Alt Kategori",
      price: "Fiyat (₺)",
      city: "İl",
      district: "İlçe",
      ship: "Tahmini Teslim Süresi (gün)",
      showcase: "Vitrin (PRO)",
      photos: "Fotoğraflar (en fazla 5)",
      photosHelp: "Görsel eklemek için tıklayın veya dosya bırakın",
    },
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
  en: {
    brand: "Ureten Eller",
    postTitle: "Post Listing",
    subtitle: "Premium: 15 listings + 1 showcase. Standard: 1 per month. Listings live 30 days.",
    back: "Back",
    required: "Required",
    select: "Select...",
    chooseCat: "Choose category first",
    invalid: "Invalid",
    draft: "Save Draft",
    send: "Submit for Review",
    premiumNeeded: "Premium required",
    oneRight: "1 slot",
    rules: "Publishing Rules",
    tips: "Tips",
    rulesList: [
      "Listings stay live for 30 days. Extend +30 with 'Extend'.",
      "Premium: up to 15 listings + 1 showcase.",
      "Standard: 1 per month.",
      "Profanity/contact info (phone/email/WhatsApp) is forbidden.",
      "All listings are reviewed by admin first.",
    ],
    tipsList: [
      "Use a clear 4:3 cover image.",
      "State price, size and lead time clearly.",
      "Picking a subcategory helps search.",
    ],
    fields: {
      title: "Title",
      desc: "Description",
      cat: "Category",
      sub: "Subcategory",
      price: "Price (₺)",
      city: "City",
      district: "District",
      ship: "Estimated Lead Time (days)",
      showcase: "Showcase (PRO)",
      photos: "Photos (max 5)",
      photosHelp: "Click or drop images to upload",
    },
    legalBar: "Corporate",
    legal: {
      corporate: "Corporate",
      about: "About",
      contact: "Contact",
      privacy: "Privacy",
      kvkk: "KVKK Notice",
      terms: "Terms of Use",
      distance: "Distance Sales",
      shippingReturn: "Shipping & Returns",
      cookies: "Cookie Policy",
      rules: "Community Rules",
      banned: "Prohibited Products",
      all: "All Legal",
    },
  },
};

function useLang() {
  const [lang, setLang] = useState("tr");
  useEffect(() => {
    try {
      const saved = localStorage.getItem("lang");
      if (saved && SUPPORTED.includes(saved)) setLang(saved);
    } catch {}
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);
  const t = useMemo(() => LBL[lang] || LBL.tr, [lang]);
  return { lang, t };
}

/* ---------------------------- Kategoriler & 81 İl ---------------------------- */
const CATS_TR = [
  { icon: "🍲", title: "Yemekler", subs: ["Ev yemekleri","Börek-çörek","Çorba","Zeytinyağlı","Pilav-makarna","Et-tavuk","Kahvaltılık","Meze","Dondurulmuş","Çocuk öğünleri","Diyet/vegan/gf"] },
  { icon: "🎂", title: "Pasta & Tatlı", subs: ["Yaş pasta","Kek-cupcake","Kurabiye","Şerbetli","Sütlü","Cheesecake","Diyet tatlı","Çikolata/şekerleme","Doğum günü setleri"] },
  { icon: "🫙", title: "Reçel • Turşu • Sos", subs: ["Reçel-marmelat","Pekmez","Turşu","Domates/biber sos","Acı sos","Salça","Sirke","Konserve"] },
  { icon: "🌾", title: "Yöresel / Kışlık", subs: ["Erişte","Tarhana","Yufka","Mantı","Kurutulmuş sebze-meyve","Salça","Sirke","Konserve"] },
  { icon: "🥗", title: "Diyet / Vegan / Glutensiz", subs: ["Fit tabaklar","Vegan yemekler","GF unlu mamuller","Şekersiz tatlı","Keto ürün","Protein atıştırmalık"] },
  { icon: "💍", title: "Takı", subs: ["Bileklik","Kolye","Küpe","Yüzük","Halhal","Broş","Setler","İsimli/kişiye özel","Makrome","Doğal taş","Reçine","Tel sarma"] },
  { icon: "👶", title: "Bebek & Çocuk", subs: ["Hayvan/bebek figürleri","Çıngırak","Diş kaşıyıcı örgü","Bez oyuncak/kitap","Montessori oyuncak","Setler","Örgü patik-bere","Bebek battaniyesi","Önlük-ağız bezi","Lohusa seti","Saç aksesuarı","El emeği kıyafet"] },
  { icon: "🧶", title: "Örgü / Triko", subs: ["Hırka","Kazak","Atkı-bere","Panço","Şal","Çorap","Bebek takımı","Yelek","Kırlent-örtü"] },
  { icon: "✂️", title: "Dikiş / Terzilik", subs: ["Paça/onarım","Fermuar değişimi","Perde dikişi","Nevresim-yastık","Masa örtüsü","Özel dikim","Kostüm"] },
  { icon: "🧵", title: "Makrome & Dekor", subs: ["Duvar süsü","Saksı askısı","Anahtarlık","Avize","Amerikan servis/runner","Sepet","Raf/duvar dekoru"] },
  { icon: "🏠", title: "Ev Dekor & Aksesuar", subs: ["Keçe işleri","Kırlent","Kapı süsü","Tepsi süsleme","Çerçeve","Rüya kapanı","Tablo"] },
  { icon: "🕯️", title: "Mum & Kokulu Ürünler", subs: ["Soya/balmumu mum","Kokulu taş","Oda spreyi","Tütsü","Jel mum","Hediye seti"] },
  { icon: "🧼", title: "Doğal Sabun & Kozmetik", subs: ["Zeytinyağlı sabun","Bitkisel sabunlar","Katı şampuan","Dudak balmı","Krem/merhem","Banyo tuzu","Lavanta kesesi"] },
  { icon: "🧸", title: "Amigurumi & Oyuncak (dekoratif)", subs: ["Anahtarlık","Magnet","Koleksiyon figürü","Dekor bebek/karakter","İsimli amigurumi"] },
];

const TR_CITIES = [
  "Adana","Adıyaman","Afyonkarahisar","Ağrı","Amasya","Ankara","Antalya","Artvin","Aydın","Balıkesir","Bilecik","Bingöl","Bitlis","Bolu","Burdur","Bursa","Çanakkale","Çankırı","Çorum","Denizli","Diyarbakır","Edirne","Elazığ","Erzincan","Erzurum","Eskişehir","Gaziantep","Giresun","Gümüşhane","Hakkari","Hatay","Isparta","Mersin","İstanbul","İzmir","Kars","Kastamonu","Kayseri","Kırklareli","Kırşehir","Kocaeli","Konya","Kütahya","Malatya","Manisa","Kahramanmaraş","Mardin","Muğla","Muş","Nevşehir","Niğde","Ordu","Rize","Sakarya","Samsun","Siirt","Sinop","Sivas","Tekirdağ","Tokat","Trabzon","Tunceli","Şanlıurfa","Uşak","Van","Yozgat","Zonguldak","Aksaray","Bayburt","Karaman","Kırıkkale","Batman","Şırnak","Bartın","Ardahan","Iğdır","Yalova","Karabük","Kilis","Osmaniye","Düzce"
];

export default function SellerPostPage() {
  const router = useRouter();
  const { t } = useLang();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    subcategory: "",
    price: "",
    currency: "TRY",
    city: "",
    district: "",
    shipDays: "",
    isShowcase: false,
    images: [],
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [proInfo, setProInfo] = useState({ isPro: false, isAdmin: false });

  const subs = useMemo(() => {
    const c = CATS_TR.find((x) => x.title === form.category);
    return c ? c.subs : [];
  }, [form.category]);

  const onPickImages = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const remain = Math.max(0, 5 - form.images.length);
    const slice = files.slice(0, remain);
    const mapped = slice.map((file) => ({ file, url: URL.createObjectURL(file) }));
    setForm((f) => ({ ...f, images: [...f.images, ...mapped] }));
    e.target.value = "";
  };
  const removeImg = (idx) => setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));

  const validate = useCallback(() => {
    const err = {};
    if (!form.title.trim()) err.title = t.required;
    if (!form.description.trim()) err.description = t.required;
    if (!form.category) err.category = t.select;
    if (subs.length && !form.subcategory) err.subcategory = t.select;
    if (!form.price || Number(form.price) <= 0) err.price = t.invalid;
    if (!form.city) err.city = t.select;
    if (!form.district.trim()) err.district = t.required;
    if (!form.shipDays || Number(form.shipDays) <= 0) err.shipDays = t.invalid;
    if (!form.images.length) err.images = t.required;
    setErrors(err);
    return Object.keys(err).length === 0;
  }, [form, subs.length, t]);

  const saveDraft = () => {
    const data = { ...form, images: [] };
    try { localStorage.setItem("sellerPostDraft", JSON.stringify(data)); alert("Taslak kaydedildi."); } catch {}
  };
  useEffect(() => {
    try { const raw = localStorage.getItem("sellerPostDraft"); if (raw) setForm((f) => ({ ...f, ...JSON.parse(raw) })); } catch {}
  }, []);

  useEffect(() => {
    (async () => {
      if (!supabase) return;
      const { data: usr } = await supabase.auth.getUser();
      const uid = usr?.user?.id;
      if (!uid) return;
      const { data: me } = await supabase.from("users").select("role,premium_until").eq("auth_user_id", uid).single();
      const isPro = !!(me?.premium_until && new Date(me.premium_until) > new Date());
      const isAdmin = me?.role === "admin";
      setProInfo({ isPro, isAdmin });
    })();
  }, []);

  const submitForApproval = async () => {
    if (!validate()) { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    if (!supabase) { alert("Supabase env eksik"); return; }
    setSubmitting(true);
    try {
      const { data: usr, error: auErr } = await supabase.auth.getUser();
      if (auErr) throw auErr;
      const uid = usr?.user?.id; if (!uid) throw new Error("Giriş gerekli");

      // Kota (son 30 gün)
      const since = new Date(Date.now() - 30*24*60*60*1000).toISOString();
      const { count: last30 } = await supabase
        .from("listings").select("id", { head: true, count: "exact" })
        .eq("seller_auth_id", uid).gte("created_at", since);
      if (!proInfo.isPro && (last30 || 0) >= 1) { alert("Standart üyelik: 30 günde 1 ilan."); return; }

      if (proInfo.isPro) {
        const { count: live } = await supabase.from("listings").select("id", { head:true, count:"exact" })
          .eq("seller_auth_id", uid).in("status", ["pending","active"]);
        if ((live || 0) >= 15) { alert("Pro limit: 15 ilan."); return; }
        if (form.isShowcase) {
          const { count: vit } = await supabase.from("listings").select("id", { head:true, count:"exact" })
            .eq("seller_auth_id", uid).in("status", ["pending","active"]).eq("is_showcase", true);
          if ((vit || 0) >= 1) { alert("Vitrin hakkınız zaten kullanıldı."); return; }
        }
      }

      // Metin kontrol
      const { error: txtErr } = await supabase.rpc("check_listing_text", { p_title: form.title, p_desc: form.description });
      if (txtErr) throw txtErr;

      // Kaydet
      const payload = {
        seller_auth_id: uid,
        title: form.title.trim(), description: form.description.trim(),
        category: form.category || null, subcategory: form.subcategory || null,
        price: Number(form.price), currency: form.currency || "TRY",
        city: form.city, district: form.district.trim(), ship_days: Number(form.shipDays),
        is_showcase: !!(proInfo.isPro && form.isShowcase), status: "pending",
      };
      const { data: ins, error: insErr } = await supabase.from("listings").insert([payload]).select("id").single();
      if (insErr) throw insErr; const listingId = ins.id;

      // Fotoğraflar
      const rows = [];
      for (let i=0; i<form.images.length; i++) {
        const url = await uploadToCloudinary(form.images[i].file);
        rows.push({ listing_id: listingId, url, order: i+1 });
      }
      if (rows.length) {
        const { error: phErr } = await supabase.from("listing_photos").insert(rows);
        if (phErr) throw phErr;
      }

      alert("İlan onaya gönderildi. Admin onayınca yayına alınacak.");
      router.push("/portal/seller");
    } catch (e) {
      console.error(e); alert(e?.message || "Hata oluştu");
    } finally { setSubmitting(false); }
  };

  return (
    <>
      <Head>
        <title>{t.brand} – {t.postTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* ÜST BAR */}
      <header className="topbar">
        <div className="brand" onClick={() => router.push("/portal/seller")}>
          <img src="/logo.png" width="34" height="34" alt="logo" />
          <span>{t.brand}</span>
        </div>
        <div className="actions">
          <button className="ghost" onClick={() => router.back()}>{t.back}</button>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <h1 className="heroTitle">{t.postTitle}</h1>
        <p className="subtitle">{t.subtitle}</p>
      </section>

      {/* FORM */}
      <main className="wrap">
        <div className="card accent">
          <div className="grid">
            <div className="col">
              <div className="field">
                <label>{t.fields.title} <span>*</span></label>
                <input type="text" value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} placeholder="Örn: El yapımı makrome duvar süsü" />
                {errors.title && <div className="err">{errors.title}</div>}
              </div>

              <div className="field">
                <label>{t.fields.desc} <span>*</span></label>
                <textarea rows={6} value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} placeholder="Ürün detayları, ölçüler, malzeme, bakım..." />
                {errors.description && <div className="err">{errors.description}</div>}
              </div>

              <div className="row2">
                <div className="field">
                  <label>{t.fields.cat} <span>*</span></label>
                  <select value={form.category} onChange={(e)=>setForm({...form,category:e.target.value,subcategory:""})}>
                    <option value="">{t.select}</option>
                    {CATS_TR.map((c,i)=>(<option key={i} value={c.title}>{c.icon} {c.title}</option>))}
                  </select>
                  {errors.category && <div className="err">{errors.category}</div>}
                </div>
                <div className="field">
                  <label>{t.fields.sub} {subs.length ? <span>*</span> : <em className="soft">(opsiyonel)</em>}</label>
                  <select value={form.subcategory} onChange={(e)=>setForm({...form,subcategory:e.target.value})} disabled={!subs.length}>
                    <option value="">{subs.length ? t.select : t.chooseCat}</option>
                    {subs.map((s,i)=>(<option key={i} value={s}>{s}</option>))}
                  </select>
                  {errors.subcategory && <div className="err">{errors.subcategory}</div>}
                </div>
              </div>

              <div className="row3">
                <div className="field">
                  <label>{t.fields.price} <span>*</span></label>
                  <input type="number" min="0" step="0.01" value={form.price} onChange={(e)=>setForm({...form,price:e.target.value})} placeholder="Örn: 249.90" />
                  {errors.price && <div className="err">{errors.price}</div>}
                </div>
                <div className="field">
                  <label>{t.fields.city} <span>*</span></label>
                  <select value={form.city} onChange={(e)=>setForm({...form,city:e.target.value})}>
                    <option value="">{t.select}</option>
                    {TR_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.city && <div className="err">{errors.city}</div>}
                </div>
                <div className="field">
                  <label>{t.fields.district} <span>*</span></label>
                  <input type="text" value={form.district} onChange={(e)=>setForm({...form,district:e.target.value})} placeholder="Örn: Kadıköy" />
                  {errors.district && <div className="err">{errors.district}</div>}
                </div>
              </div>

              <div className="row2">
                <div className="field">
                  <label>{t.fields.ship} <span>*</span></label>
                  <input type="number" min="1" max="60" value={form.shipDays} onChange={(e)=>setForm({...form,shipDays:e.target.value})} placeholder="Örn: 7" />
                  {errors.shipDays && <div className="err">{errors.shipDays}</div>}
                </div>
                <div className="field">
                  <label>{t.fields.showcase}</label>
                  <div className="toggleLine">
                    <input id="vitrin" type="checkbox" checked={form.isShowcase} onChange={(e)=>setForm({...form,isShowcase:e.target.checked})} disabled={!proInfo.isPro} />
                    <label htmlFor="vitrin" className="soft">{proInfo.isPro ? t.oneRight : t.premiumNeeded}</label>
                  </div>
                </div>
              </div>

              <div className="field">
                <label>{t.fields.photos} <span>*</span></label>
                <div className="uploader" onClick={()=>document.getElementById("imgpick")?.click()}>
                  <input id="imgpick" type="file" accept="image/*" multiple onChange={onPickImages} style={{display:"none"}} />
                  <div className="drop">{t.fields.photosHelp}</div>
                  <div className="thumbs">
                    {form.images.map((im, idx) => (
                      <div className="thumb" key={idx}>
                        <img src={im.url} alt={`img-${idx}`} />
                        <button type="button" className="rm" onClick={() => removeImg(idx)} aria-label="Sil">×</button>
                      </div>
                    ))}
                    {Array.from({ length: Math.max(0, 5 - form.images.length) }).map((_, i) => (
                      <div className="ph" key={`ph-${i}`}>+</div>
                    ))}
                  </div>
                </div>
                {errors.images && <div className="err">{errors.images}</div>}
              </div>

              <div className="actionsRow">
                <button className="ghost" type="button" onClick={saveDraft} disabled={submitting}>{t.draft}</button>
                <button className="primary" type="button" onClick={submitForApproval} disabled={submitting}>{submitting?"Gönderiliyor...":t.send}</button>
              </div>
            </div>

            <aside className="aside">
              <div className="mini">
                <h3>✨ {t.rules}</h3>
                <ul>{t.rulesList.map((li, i)=>(<li key={i}>{li}</li>))}</ul>
              </div>
              <div className="mini">
                <h3>💡 {t.tips}</h3>
                <ul>{t.tipsList.map((li, i)=>(<li key={i}>{li}</li>))}</ul>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* LEGAL FOOTER (siyah şerit) */}
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

      <style jsx>{`
        :root{ --ink:#0f172a; --muted:#475569; --line:rgba(0,0,0,.10); }
        body{background:
          radial-gradient(1100px 500px at 12% -10%, #ffe4e6, transparent),
          radial-gradient(900px 480px at 88% -10%, #e0e7ff, transparent),
          linear-gradient(120deg,#ff80ab,#a78bfa,#60a5fa,#34d399); background-attachment:fixed;}

        .topbar{position:sticky;top:0;z-index:30;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 14px;
          background:rgba(255,255,255,.92);backdrop-filter:blur(8px);border-bottom:1px solid var(--line)}
        .brand{display:flex;align-items:center;gap:8px;font-weight:900;cursor:pointer}
        .ghost{border:1px solid var(--line);background:#fff;border-radius:12px;padding:10px 12px;font-weight:700;cursor:pointer}
        .primary{border:none;background:linear-gradient(135deg,#111827,#4f46e5,#06b6d4);color:#fff;border-radius:12px;padding:12px 16px;font-weight:900;cursor:pointer;box-shadow:0 8px 22px rgba(0,0,0,.18)}

        .hero{max-width:1100px;margin:14px auto 0;padding:0 16px;text-align:center}
        .heroTitle{margin:6px 0 2px;font-size:40px;letter-spacing:.2px;text-shadow:0 8px 28px rgba(0,0,0,.15)}
        .subtitle{margin:0;color:#1f2937;font-weight:600}

        .wrap{max-width:1100px;margin:14px auto;padding:0 16px 40px}
        .card{background:#fff;border:1px solid #e5e7eb;border-radius:18px;box-shadow:0 12px 30px rgba(0,0,0,.10);padding:16px}
        .accent{position:relative}
        .accent:before{content:"";position:absolute;inset:-2px;z-index:-1;border-radius:20px;background:linear-gradient(135deg,#ff80ab,#a78bfa,#60a5fa,#34d399)}

        .grid{display:grid;gap:16px;grid-template-columns:1fr}
        @media(min-width:980px){ .grid{grid-template-columns:2fr 1fr;} }
        .col{display:flex;flex-direction:column;gap:12px}
        .aside{display:flex;flex-direction:column;gap:12px}
        .mini{border:1px solid #e5e7eb;border-radius:14px;padding:12px;background:#fafafa}
        .mini h3{margin:0 0 6px}
        ul{margin:6px 0 0;padding-left:18px}
        li{margin:4px 0}

        .field{display:flex;flex-direction:column;gap:6px}
        .field label{font-weight:900}
        .field label span{color:#dc2626}
        .soft{color:#6b7280;font-style:normal;font-weight:600}
        input[type="text"], input[type="number"], select, textarea{border:1px solid #e5e7eb;border-radius:12px;padding:12px;font-size:14px;outline:none;background:#fff}
        textarea{resize:vertical}
        .row2{display:grid;gap:12px;grid-template-columns:1fr}
        .row3{display:grid;gap:12px;grid-template-columns:1fr}
        @media(min-width:700px){ .row2{grid-template-columns:1fr 1fr} .row3{grid-template-columns:1fr 1fr 1fr} }
        .err{color:#dc2626;font-size:12px}
        .toggleLine{display:flex;align-items:center;gap:8px}

        .uploader{border:2px dashed #cbd5e1;border-radius:14px;padding:12px;background:linear-gradient(0deg,#fff, #f8fafc)}
        .drop{text-align:center;color:#475569;font-size:14px;margin-bottom:8px}
        .thumbs{display:grid;gap:10px;grid-template-columns:repeat(auto-fill,minmax(100px,1fr))}
        .thumb{position:relative;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;background:#fff}
        .thumb img{width:100%;height:100px;object-fit:cover;display:block}
        .thumb .rm{position:absolute;top:4px;right:4px;border:none;background:rgba(0,0,0,.65);color:#fff;border-radius:999px;width:24px;height:24px;cursor:pointer;font-size:16px}
        .ph{display:grid;place-items:center;border:2px dashed #e5e7eb;border-radius:12px;height:100px;color:#94a3b8;font-weight:900;font-size:22px;background:#fff}
        .actionsRow{display:flex;gap:10px;justify-content:flex-end;margin-top:6px}

        /* Footer (siyah şerit) */
        .legal{background:#0b0b0b;color:#f8fafc;border-top:1px solid rgba(255,255,255,.12);width:100vw;margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);margin-top:20px}
        .inner{max-width:1100px;margin:0 auto;padding:14px 16px}
        .ttl{font-weight:800;margin-bottom:8px}
        .links{display:flex;flex-wrap:wrap;gap:10px}
        .links a{color:#e2e8f0;font-size:13px;padding:6px 8px;border-radius:8px;text-decoration:none}
        .links a:hover{background:rgba(255,255,255,.08);color:#fff}
        .homeLink{margin-left:auto;font-weight:800}
        .copy{margin-top:8px;font-size:12px;color:#cbd5e1}
      `}</style>
    </>
  );
}
