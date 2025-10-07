// pages/portal/seller/index.jsx
"use client";
import React, { useEffect, useMemo, useState } from "react";
import Head from "next/head";

// küçük yardımcılar
const uid = () => Math.random().toString(36).slice(2, 9);
const slugify = (s = "") =>
  s.toString().toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

export default function SellerPortal() {
  const [authed, setAuthed] = useState(false);
  const [ads, setAds] = useState([]);
  const [tab, setTab] = useState("new"); // new | my | orders | payouts | profile
  const [msg, setMsg] = useState("");

  // form
  const [title, setTitle] = useState("");
  const [cat, setCat] = useState("");
  const [price, setPrice] = useState("");
  const [img, setImg] = useState("");
  const [desc, setDesc] = useState("");

  // giriş kontrolü (home’daki mantıkla aynı: localStorage.authed === "1")
  useEffect(() => {
    if (typeof window === "undefined") return;
    setAuthed(localStorage.getItem("authed") === "1");
    try {
      const local = JSON.parse(localStorage.getItem("ads") || "[]");
      setAds(Array.isArray(local) ? local : []);
    } catch {
      setAds([]);
    }
  }, []);

  // ilan kaydet (geçici: localStorage + public/ads.json yerine)
  function saveAd(e) {
    e.preventDefault();
    setMsg("");
    if (!title || !cat) {
      setMsg("Başlık ve kategori zorunludur.");
      return;
    }
    const ad = {
      id: uid(),
      slug: slugify(title),
      title,
      cat,
      price,
      img,
      desc,
      created_at: new Date().toISOString(),
      status: "active",
    };
    const next = [ad, ...ads];
    setAds(next);
    try {
      localStorage.setItem("ads", JSON.stringify(next));
      setMsg("İlan taslak olarak kaydedildi (tarayıcı hafızası).");
    } catch {
      setMsg("Kaydetme sırasında hata (localStorage).");
    }
    // formu sıfırla
    setTitle(""); setCat(""); setPrice(""); setImg(""); setDesc("");
    setTab("my");
  }

  function removeAd(id) {
    const next = ads.filter(a => a.id !== id);
    setAds(next);
    try { localStorage.setItem("ads", JSON.stringify(next)); } catch {}
  }

  function go(href) { window.location.href = href; }

  // basit stiller
  const css = `
    :root { --ink:#0f172a; --line:#e5e7eb; --muted:#475569; }
    body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial,sans-serif;color:var(--ink)}
    .wrap{max-width:1100px;margin:0 auto;padding:18px 16px}
    .topbar{display:flex;gap:10px;align-items:center;justify-content:space-between;margin-bottom:12px}
    .brand{display:flex;gap:8px;align-items:center}
    .brand img{border-radius:12px}
    .tabs{display:flex;gap:8px;flex-wrap:wrap}
    .tab{padding:10px 12px;border:1px solid var(--line);background:#fff;border-radius:10px;cursor:pointer;font-weight:700}
    .tab.active{background:#111827;color:#fff;border-color:#111827}
    .note{margin:8px 0 12px;color:var(--muted);font-size:14px}
    .grid{display:grid;gap:14px;grid-template-columns:1.2fr .8fr}
    @media (max-width:880px){ .grid{grid-template-columns:1fr} }
    .card{background:#fff;border:1px solid var(--line);border-radius:14px;box-shadow:0 6px 18px rgba(0,0,0,.05)}
    .card .hd{padding:10px 12px;border-bottom:1px solid var(--line);font-weight:800}
    .card .bd{padding:12px}
    label span{display:block;font-size:13px;color:#334155;margin-bottom:4px}
    input,textarea,select{width:100%;padding:12px;border-radius:12px;border:1px solid var(--line);background:#fff;font-size:15px}
    .row{display:grid;gap:10px;grid-template-columns:1fr 1fr}
    @media (max-width:520px){ .row{grid-template-columns:1fr} }
    .actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}
    .primary{padding:10px 14px;border-radius:10px;border:1px solid #111827;background:#111827;color:#fff;font-weight:800;cursor:pointer}
    .ghost{padding:10px 14px;border-radius:10px;border:1px solid var(--line);background:#fff;font-weight:700;cursor:pointer}
    .list{display:grid;gap:10px}
    .ad{display:grid;grid-template-columns:88px 1fr auto;gap:10px;align-items:center;border:1px solid var(--line);border-radius:12px;padding:8px}
    .thumb{width:88px;height:66px;background:#f1f5f9;border-radius:8px;background-size:cover;background-position:center}
    .meta{font-size:13px;color:var(--muted)}
    .price{font-weight:800}
    .danger{border:1px solid #fecaca;background:#fee2e2;color:#991b1b;border-radius:10px;padding:8px 10px}
    .ok{border:1px solid #a5f3fc;background:#ecfeff;color:#0e7490;border-radius:10px;padding:8px 10px}
  `;

  if (!authed) {
    return (
      <main className="wrap">
        <Head><title>Üreten El Portalı • Giriş Gerekli</title></Head>
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <div className="topbar">
          <div className="brand">
            <img src="/logo.png" alt="" width="40" height="40" />
            <strong>Üreten El Portalı</strong>
          </div>
          <div>
            <button className="ghost" onClick={() => go("/")}>Ana sayfa</button>
            <button className="primary" onClick={() => go("/login?role=seller")}>Giriş / Kayıt</button>
          </div>
        </div>
        <div className="card">
          <div className="hd">Erişim Kısıtlı</div>
          <div className="bd">
            <p className="note">Bu alana erişmek için önce <b>Giriş</b> yapmalısınız. (Test için /login sayfasında giriş yaptığınızda tarayıcıya <code>authed=1</code> kaydedilir.)</p>
            <div className="actions">
              <button className="primary" onClick={() => go("/login?role=seller")}>Giriş Yap</button>
              <button className="ghost" onClick={() => go("/")}>Ana sayfa</button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="wrap">
      <Head><title>Üreten El Portalı • Panel</title></Head>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* Üst çubuk */}
      <div className="topbar">
        <div className="brand">
          <img src="/logo.png" alt="" width="40" height="40" />
          <strong>Üreten El Portalı</strong>
        </div>
        <div className="tabs">
          {["new","my","orders","payouts","profile"].map(k => (
            <button key={k} className={`tab ${tab===k?"active":""}`} onClick={()=>setTab(k)}>
              {k==="new" && "Yeni İlan"}
              {k==="my" && "İlanlarım"}
              {k==="orders" && "Siparişler"}
              {k==="payouts" && "Ödemeler"}
              {k==="profile" && "Profil"}
            </button>
          ))}
          <button className="ghost" onClick={() => go("/")}>Ana sayfa</button>
        </div>
      </div>

      {/* İçerik */}
      {tab === "new" && (
        <div className="grid">
          <div className="card">
            <div className="hd">Yeni İlan Oluştur</div>
            <div className="bd">
              {msg && <div className={/hata|error|zorunlu/i.test(msg) ? "danger" : "ok"}>{msg}</div>}
              <form onSubmit={saveAd}>
                <label><span>Başlık *</span>
                  <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Örn: Ev Yapımı Mantı 1 kg" required/>
                </label>
                <div className="row" style={{marginTop:10}}>
                  <label><span>Kategori *</span>
                    <input value={cat} onChange={e=>setCat(e.target.value)} placeholder="Örn: Yemekler" required/>
                  </label>
                  <label><span>Fiyat</span>
                    <input value={price} onChange={e=>setPrice(e.target.value)} placeholder="Örn: 250 TL"/>
                  </label>
                </div>
                <label style={{marginTop:10}}><span>Görsel (URL)</span>
                  <input value={img} onChange={e=>setImg(e.target.value)} placeholder="https://... (isteğe bağlı)"/>
                </label>
                <label style={{marginTop:10}}><span>Açıklama</span>
                  <textarea rows={4} value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Ürününüzü anlatın (içerik, teslimat, vb.)"/>
                </label>
                <div className="actions">
                  <button className="primary" type="submit">Kaydet</button>
                  <button className="ghost" type="button" onClick={()=>{setTitle("");setCat("");setPrice("");setImg("");setDesc("");setMsg("");}}>Temizle</button>
                </div>
                <p className="note">Not: Şimdilik ilanlar <b>tarayıcı hafızasına</b> kaydedilir. Anasayfa “Son 20 İlan” bölümünde görünür.</p>
              </form>
            </div>
          </div>

          <div className="card">
            <div className="hd">İpucu</div>
            <div className="bd">
              <ul style={{margin:"0 0 0 18px", padding:0}}>
                <li>Gerçek ödeme & mesajlaşma daha sonra eklenecek.</li>
                <li>Görsel için Cloudinary URL’si girebilirsiniz.</li>
                <li>“İlanlarım” sekmesinden silebilirsiniz.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {tab === "my" && (
        <div className="card">
          <div className="hd">İlanlarım ({ads.length})</div>
          <div className="bd">
            {!ads.length ? (
              <p className="note">Henüz ilan yok. “Yeni İlan” sekmesinden ekleyin.</p>
            ) : (
              <div className="list">
                {ads.map(a => (
                  <div className="ad" key={a.id}>
                    <div className="thumb" style={a.img ? {backgroundImage:`url(${a.img})`} : undefined} />
                    <div>
                      <div style={{fontWeight:800}}>{a.title}</div>
                      <div className="meta">{a.cat} • <span className="price">{a.price || "-"}</span></div>
                    </div>
                    <div style={{display:"flex",gap:8}}>
                      <button className="ghost" onClick={()=>go(`/ads/${a.slug || a.id}`)}>Görüntüle</button>
                      <button className="danger" onClick={()=>removeAd(a.id)}>Sil</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "orders" && (
        <div className="card">
          <div className="hd">Siparişler</div>
          <div className="bd">
            <p className="note">Bu sayfa ileride gerçek siparişleri gösterecek. Şimdilik örnek veri yok.</p>
          </div>
        </div>
      )}

      {tab === "payouts" && (
        <div className="card">
          <div className="hd">Ödemeler</div>
          <div className="bd">
            <p className="note">Banka bilgileri ve bekleyen/ödenen tutarlar burada listelenecek.</p>
          </div>
        </div>
      )}

      {tab === "profile" && (
        <div className="card">
          <div className="hd">Profil</div>
          <div className="bd">
            <p className="note">Profil düzenleme daha sonra eklenecek. Çıkış yapmak isterseniz:</p>
            <div className="actions">
              <button
                className="ghost"
                onClick={() => { localStorage.removeItem("authed"); setAuthed(false); go("/"); }}
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
