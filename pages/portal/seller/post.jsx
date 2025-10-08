"use client";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

/**
 * File path (Next.js pages router):
 *   /pages/portal/seller/post.jsx
 *
 * TAM ENTEGRASYON (Demo değil):
 *  - Supabase insert: listings + listing_photos
 *  - Cloudinary unsigned upload (env ile)
 *  - RLS uyumlu: seller_auth_id = auth.uid(), status='pending' (admin onayı)
 *  - Pro/Standart kota kontrolü (istemci tarafı guard)
 *  - Responsive (mobil/tablet/masaüstü)
 *  - Kategori → Alt kategori bağımlı menü
 *  - İl (81 il) dropdown; İlçe manuel metin
 *  - Tahmini kargo teslim süresi (gün)
 *  - En fazla 5 foto (yükleme ve önizleme)
 *
 * Gerekli env (Next public):
 *  - NEXT_PUBLIC_SUPABASE_URL
 *  - NEXT_PUBLIC_SUPABASE_ANON_KEY
 *  - NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
 *  - NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET  (Cloudinary'de imzasız preset)
 */

/* ---------------------------- Supabase yardımcı ---------------------------- */
let sb = null;
function getSupabase() {
  if (sb) return sb;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || (typeof window !== "undefined" ? window.__SUPABASE_URL__ : "");
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || (typeof window !== "undefined" ? window.__SUPABASE_ANON__ : "");
  if (!url || !key) return null;
  sb = createClient(url, key);
  return sb;
}

/* ---------------------------- Cloudinary yardımcı ---------------------------- */
const CLD = {
  cloud: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
};
async function uploadToCloudinary(file) {
  if (!CLD.cloud || !CLD.preset) throw new Error("Cloudinary env eksik");
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", CLD.preset);
  fd.append("folder", "ureteneller/listings");
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLD.cloud}/upload`, {
    method: "POST",
    body: fd,
  });
  if (!res.ok) throw new Error("Cloudinary yükleme hatası");
  const data = await res.json();
  return data.secure_url;
}

/* ---------------------------- Veri: Kategoriler (TR) ---------------------------- */
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

/* ---------------------------- Veri: Türkiye 81 İl ---------------------------- */
const TR_CITIES = [
  "Adana","Adıyaman","Afyonkarahisar","Ağrı","Amasya","Ankara","Antalya","Artvin","Aydın","Balıkesir","Bilecik","Bingöl","Bitlis","Bolu","Burdur","Bursa","Çanakkale","Çankırı","Çorum","Denizli","Diyarbakır","Edirne","Elazığ","Erzincan","Erzurum","Eskişehir","Gaziantep","Giresun","Gümüşhane","Hakkari","Hatay","Isparta","Mersin","İstanbul","İzmir","Kars","Kastamonu","Kayseri","Kırklareli","Kırşehir","Kocaeli","Konya","Kütahya","Malatya","Manisa","Kahramanmaraş","Mardin","Muğla","Muş","Nevşehir","Niğde","Ordu","Rize","Sakarya","Samsun","Siirt","Sinop","Sivas","Tekirdağ","Tokat","Trabzon","Tunceli","Şanlıurfa","Uşak","Van","Yozgat","Zonguldak","Aksaray","Bayburt","Karaman","Kırıkkale","Batman","Şırnak","Bartın","Ardahan","Iğdır","Yalova","Karabük","Kilis","Osmaniye","Düzce"
];

export default function SellerPostPage() {
  const router = useRouter();
  const supa = getSupabase();

  // Kullanıcı & kota bilgisi
  const [me, setMe] = useState(null);           // { id, email }
  const [profile, setProfile] = useState(null); // public.users kaydı
  const [limits, setLimits] = useState({ isPro:false, canPost:true, reason:"", showcaseLeft:0, activeCount:0 });

  // Form state
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
    images: [], // { file, url }
  });

  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // 0..100 (yaklaşık)

  // Alt kategori listesi (seçili kategoriye bağlı)
  const subs = useMemo(() => {
    const c = CATS_TR.find((x) => x.title === form.category);
    return c ? c.subs : [];
  }, [form.category]);

  // Görsel ekleme (max 5)
  const onPickImages = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const remain = Math.max(0, 5 - form.images.length);
    const slice = files.slice(0, remain);
    const mapped = slice.map((file) => ({ file, url: URL.createObjectURL(file) }));
    setForm((f) => ({ ...f, images: [...f.images, ...mapped] }));
    e.target.value = ""; // aynı dosyayı tekrar seçebilmek için
  };
  const removeImg = (idx) => setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));

  // Basit doğrulama (istemci)
  const [errors, setErrors] = useState({});
  const validate = useCallback(() => {
    const err = {};
    if (!form.title.trim()) err.title = "Zorunlu";
    if (!form.description.trim()) err.description = "Zorunlu";
    if (!form.category) err.category = "Seçiniz";
    if (subs.length && !form.subcategory) err.subcategory = "Seçiniz";
    if (!form.price || Number(form.price) <= 0) err.price = "Geçersiz";
    if (!form.city) err.city = "Seçiniz";
    if (!form.district.trim()) err.district = "Zorunlu";
    if (!form.shipDays || Number(form.shipDays) <= 0) err.shipDays = "Geçersiz";
    if (!form.images.length) err.images = "En az 1 görsel yükleyiniz";

    // İletişim/veri kaçak basit filtresi — DB tarafındaki check_listing_text'i destekler
    const txt = `${form.title} ${form.description}`.toLowerCase();
    const emailRe = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;
    const waRe = /(whatsapp|wa\.me|whats\s*app|\bwp\b)/i;
    const phoneDigits = txt.replace(/\D/g, "");
    const phoneLooksLike = /(\+?90|0)?5\d{9}/.test(phoneDigits) || /(\+?90|0)?[2-9]\d{9}/.test(phoneDigits);
    if (emailRe.test(txt) || waRe.test(txt) || phoneLooksLike) err.description = (err.description? err.description+"; ":"")+"İletişim paylaşımı yasak";

    setErrors(err);
    return Object.keys(err).length === 0;
  }, [form, subs.length]);

  // Taslak kaydet (localStorage)
  const saveDraft = () => {
    const data = { ...form, images: [] }; // blob URL'leri kaydetmiyoruz
    try { localStorage.setItem("sellerPostDraft", JSON.stringify(data)); alert("Taslak kaydedildi (yalnızca bu cihazda)."); } catch {}
  };
  useEffect(() => {
    try { const raw = localStorage.getItem("sellerPostDraft"); if (raw) setForm((f) => ({ ...f, ...JSON.parse(raw) })); } catch {}
  }, []);

  /* ---------------------------- Auth + Profil + Kota ---------------------------- */
  useEffect(() => {
    (async () => {
      if (!supa) return;
      const { data: { user } } = await supa.auth.getUser();
      if (!user) { router.replace("/login"); return; }
      setMe({ id: user.id, email: user.email });

      // profil
      const { data: prof } = await supa
        .from("users")
        .select("auth_user_id, role, premium_until")
        .eq("auth_user_id", user.id)
        .maybeSingle();
      setProfile(prof || null);

      // kota hesabı (istemci guard)
      const isPro = !!(prof?.premium_until && new Date(prof.premium_until) > new Date());
      let showcaseLeft = isPro ? 1 : 0;

      // son 30 gün / aktif+pending ilan sayısı
      const since = new Date(Date.now() - 30*24*3600*1000).toISOString();
      const { data: myActive } = await supa
        .from("listings")
        .select("id, is_showcase, status, created_at")
        .eq("seller_auth_id", user.id)
        .in("status", ["pending","active"]) // onay bekleyen + yayında
        .gte("created_at", since);

      const activeCount = (myActive || []).length;
      if (isPro) {
        // vitrin kullanımı var mı?
        const usedShowcase = (myActive || []).some(x => x.is_showcase === true);
        showcaseLeft = usedShowcase ? 0 : 1;
      }

      let canPost = true; let reason = "";
      if (!isPro && activeCount >= 1) { canPost = false; reason = "Standart üyeler ayda 1 ilan verebilir (30 gün)."; }

      setLimits({ isPro, canPost, reason, showcaseLeft, activeCount });
    })();
  }, [supa, router]);

  /* ---------------------------- Gönderim ---------------------------- */
  const onSubmit = async () => {
    if (!validate()) { window.scrollTo({ top:0, behavior:"smooth" }); return; }
    if (!limits.canPost) { alert(limits.reason || "Kota sebebiyle şu an ilan veremezsiniz."); return; }
    if (!supa || !me) { alert("Bağlantı hatası"); return; }

    try {
      setSubmitting(true); setUploadProgress(5);

      // DB tarafındaki ek kontrol fonksiyonu (hata atarsa göstereceğiz)
      try { await supa.rpc('check_listing_text', { p_title: form.title, p_desc: form.description }); } catch(e) { throw e; }

      // 1) İLAN kaydı (status=pending)
      const payload = {
        seller_auth_id: me.id,
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category || null,
        subcategory: form.subcategory || null,
        price: Number(form.price),
        currency: form.currency || 'TRY',
        city: form.city || null,
        district: form.district.trim() || null,
        ship_days: Number(form.shipDays),
        is_showcase: !!(limits.isPro && form.isShowcase && limits.showcaseLeft > 0),
        status: 'pending',
      };

      const { data: ins, error: insErr } = await supa.from('listings').insert(payload).select('id').single();
      if (insErr) throw insErr;
      const listingId = ins.id;

      // 2) FOTO yükleme (Cloudinary) + listing_photos insert
      for (let i=0; i<form.images.length; i++) {
        const f = form.images[i].file;
        const url = await uploadToCloudinary(f);
        setUploadProgress(10 + Math.round(((i+1)/form.images.length)*70));
        await supa.from('listing_photos').insert({ listing_id: listingId, url, order: i });
      }

      setUploadProgress(90);

      // 3) Başarılı → yönlendir / bilgilendir
      setUploadProgress(100);
      alert('İlan onaya gönderildi. Admin onayından sonra yayınlanacak.');
      router.replace(`/ads/${listingId}`);
    } catch (e) {
      console.error(e);
      const msg = e?.message || String(e);
      alert(`Kayıt sırasında hata: ${msg}`);
    } finally {
      setSubmitting(false); setUploadProgress(0);
    }
  };

  return (
    <>
      <Head>
        <title>İlan Ver – Üreten Eller</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* ÜST BAR (basit) */}
      <header className="topbar">
        <div className="brand" onClick={() => router.push("/portal/seller")}>
          <img src="/logo.png" width="32" height="32" alt="logo" />
          <span>Üreten Eller</span>
        </div>
        <div className="actions">
          <button className="ghost" onClick={() => router.back()}>Geri</button>
        </div>
      </header>

      {/* SAYFA BAŞLIĞI */}
      <section className="hero">
        <h1>İlan Ver</h1>
        <p className="muted">Premium: 15 ilan + 1 vitrin. Standart: ayda 1 ilan. Her ilan 30 gün yayında.</p>
        {!limits.canPost && (
          <div className="warn">{limits.reason}</div>
        )}
      </section>

      {/* FORM CARD */}
      <main className="wrap">
        <div className="card">
          <div className="grid">
            {/* Sol sütun */}
            <div className="col">
              <div className="field">
                <label>Başlık <span>*</span></label>
                <input type="text" value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} placeholder="Örn: El yapımı makrome duvar süsü" />
                {errors.title && <div className="err">{errors.title}</div>}
              </div>

              <div className="field">
                <label>Açıklama <span>*</span></label>
                <textarea rows={6} value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} placeholder="Ürün detayları, ölçüler, malzeme, bakım, kişiselleştirme..." />
                {errors.description && <div className="err">{errors.description}</div>}
              </div>

              <div className="row2">
                <div className="field">
                  <label>Ana Kategori <span>*</span></label>
                  <select value={form.category} onChange={(e)=>setForm({...form,category:e.target.value, subcategory:""})}>
                    <option value="">Seçiniz...</option>
                    {CATS_TR.map((c, i) => <option key={i} value={c.title}>{c.icon} {c.title}</option>)}
                  </select>
                  {errors.category && <div className="err">{errors.category}</div>}
                </div>
                <div className="field">
                  <label>Alt Kategori {subs.length ? <span>*</span> : <em className="soft">(opsiyonel)</em>}</label>
                  <select value={form.subcategory} onChange={(e)=>setForm({...form,subcategory:e.target.value})} disabled={!subs.length}>
                    <option value="">{subs.length?"Seçiniz...":"Önce kategori seçiniz"}</option>
                    {subs.map((s, i) => <option key={i} value={s}>{s}</option>)}
                  </select>
                  {errors.subcategory && <div className="err">{errors.subcategory}</div>}
                </div>
              </div>

              <div className="row3">
                <div className="field">
                  <label>Fiyat (₺) <span>*</span></label>
                  <input type="number" inputMode="decimal" min="0" step="0.01" value={form.price} onChange={(e)=>setForm({...form,price:e.target.value})} placeholder="Örn: 249.90" />
                  {errors.price && <div className="err">{errors.price}</div>}
                </div>
                <div className="field">
                  <label>İl <span>*</span></label>
                  <select value={form.city} onChange={(e)=>setForm({...form,city:e.target.value})}>
                    <option value="">Seçiniz...</option>
                    {TR_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.city && <div className="err">{errors.city}</div>}
                </div>
                <div className="field">
                  <label>İlçe <span>*</span></label>
                  <input type="text" value={form.district} onChange={(e)=>setForm({...form,district:e.target.value})} placeholder="Örn: Kadıköy" />
                  {errors.district && <div className="err">{errors.district}</div>}
                </div>
              </div>

              <div className="row2">
                <div className="field">
                  <label>Tahmini Teslim Süresi (gün) <span>*</span></label>
                  <input type="number" min="1" max="60" value={form.shipDays} onChange={(e)=>setForm({...form,shipDays:e.target.value})} placeholder="Örn: 7" />
                  {errors.shipDays && <div className="err">{errors.shipDays}</div>}
                </div>

                <div className="field">
                  <label>Vitrin (PRO)</label>
                  <div className="toggleLine">
                    <input id="vitrin" type="checkbox" checked={form.isShowcase} onChange={(e)=>setForm({...form,isShowcase:e.target.checked})} disabled={!limits.isPro || limits.showcaseLeft <= 0} />
                    <label htmlFor="vitrin" className="soft"> {limits.isPro ? (limits.showcaseLeft>0?"Kullanılabilir":"Bu ay vitrin hakkı dolu") : "Yalnız Premium üyeler"}</label>
                  </div>
                </div>
              </div>

              <div className="field">
                <label>Fotoğraflar (en fazla 5) <span>*</span></label>
                <div className="uploader" onClick={()=>document.getElementById("imgpick")?.click()}>
                  <input id="imgpick" type="file" accept="image/*" multiple onChange={onPickImages} style={{ display:"none" }} />
                  <div className="drop">Görsel eklemek için tıklayın veya dosya bırakın</div>
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
                <button className="ghost" type="button" onClick={saveDraft}>Taslak Kaydet</button>
                <button className="primary" type="button" onClick={onSubmit} disabled={submitting}>
                  {submitting ? `Gönderiliyor… ${uploadProgress}%` : 'Onaya Gönder'}
                </button>
              </div>
            </div>

            {/* Sağ sütun */}
            <aside className="aside">
              <div className="mini">
                <h3>Yayın Kuralları</h3>
                <ul>
                  <li>İlanlar <b>30 gün</b> yayında kalır. Süre dolunca <b>"Süre uzat"</b> ile +30 gün.</li>
                  <li>Premium: aynı anda <b>15 ilan</b> + <b>1 vitrin</b>.</li>
                  <li>Standart: <b>ayda 1 ilan</b>.</li>
                  <li>İletişim paylaşımı (tel/e‑posta/WhatsApp) ve uygunsuz kelimeler <b>yasaktır</b>.</li>
                  <li>İlanlar önce <b>admin onayı</b>na düşer (status='pending').</li>
                </ul>
              </div>

              <div className="mini">
                <h3>Öneriler</h3>
                <ul>
                  <li>Kapakta yatay oranlı (4:3) net fotoğraf kullanın.</li>
                  <li>Fiyat, ölçü ve teslim süresini açık yazın.</li>
                  <li>Alt kategori seçmek aramalarda görünürlüğü artırır.</li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* STYLES */}
      <style jsx>{`
        :root{ --ink:#0f172a; --muted:#475569; --line:rgba(0,0,0,.10); }
        body{background:#fff}
        .topbar{position:sticky;top:0;z-index:20;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 14px;background:rgba(255,255,255,.96);backdrop-filter:blur(8px);border-bottom:1px solid var(--line)}
        .brand{display:flex;align-items:center;gap:8px;font-weight:900;cursor:pointer}
        .ghost{border:1px solid var(--line);background:#fff;border-radius:10px;padding:8px 12px;font-weight:700;cursor:pointer}
        .primary{border:1px solid #111827;background:#111827;color:#fff;border-radius:10px;padding:10px 14px;font-weight:800;cursor:pointer}
        .warn{margin-top:8px;padding:10px;border:1px solid #f59e0b;background:#fffbeb;border-radius:10px;color:#92400e}
        .hero{max-width:1100px;margin:12px auto 0;padding:0 16px}
        .hero h1{margin:6px 0 4px}
        .muted{color:var(--muted);margin:0 0 10px}
        .wrap{max-width:1100px;margin:0 auto;padding:0 16px 24px}
        .card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;box-shadow:0 8px 24px rgba(0,0,0,.06);padding:14px}
        .grid{display:grid;gap:16px;grid-template-columns:1fr;}
        @media(min-width:980px){ .grid{grid-template-columns:2fr 1fr;} }
        .col{display:flex;flex-direction:column;gap:12px}
        .aside{display:flex;flex-direction:column;gap:12px}
        .mini{border:1px solid #e5e7eb;border-radius:12px;padding:12px}
        .mini h3{margin:0 0 6px}
        .field{display:flex;flex-direction:column;gap:6px}
        .field label{font-weight:800}
        .field label span{color:#dc2626}
        .soft{color:#6b7280;font-style:normal;font-weight:600}
        input[type="text"], input[type="number"], select, textarea{border:1px solid #e5e7eb;border-radius:10px;padding:10px;outline:none;font-size:14px}
        textarea{resize:vertical}
        .row2{display:grid;gap:12px;grid-template-columns:1fr;}
        .row3{display:grid;gap:12px;grid-template-columns:1fr;}
        @media(min-width:700px){ .row2{grid-template-columns:1fr 1fr;} .row3{grid-template-columns:1fr 1fr 1fr;} }
        .err{color:#dc2626;font-size:12px}
        .toggleLine{display:flex;align-items:center;gap:8px}
        .uploader{border:1px dashed #cbd5e1;border-radius:12px;padding:10px;background:#f8fafc;cursor:pointer}
        .drop{text-align:center;color:#475569;font-size:14px;margin-bottom:8px}
        .thumbs{display:grid;gap:10px;grid-template-columns:repeat(auto-fill,minmax(90px,1fr))}
        .thumb{position:relative;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;background:#fff}
        .thumb img{width:100%;height:90px;object-fit:cover;display:block}
        .thumb .rm{position:absolute;top:4px;right:4px;border:none;background:rgba(0,0,0,.65);color:#fff;border-radius:999px;width:22px;height:22px;cursor:pointer}
        .ph{display:grid;place-items:center;border:1px dashed #e5e7eb;border-radius:10px;height:90px;color:#94a3b8;font-weight:900;font-size:20px;background:#fff}
        .actionsRow{display:flex;gap:8px;justify-content:flex-end;margin-top:6px}
      `}</style>
    </>
  );
}
