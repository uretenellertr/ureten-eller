// pages/portal/customer/index.jsx
"use client";
import React, { useEffect, useMemo, useState } from "react";
import Head from "next/head";

const uid = () => Math.random().toString(36).slice(2, 10);

/* ----------------------------- HELPERS ----------------------------- */
function useAuthed() {
  const [authed, setAuthed] = useState(false);
  useEffect(() => { setAuthed(localStorage.getItem("authed") === "1"); }, []);
  return { authed, setAuthed };
}
function go(href) { window.location.href = href; }

/* ----------------------------- MAIN ----------------------------- */
export default function CustomerPortal() {
  const { authed, setAuthed } = useAuthed();
  const [tab, setTab] = useState("browse"); // browse | orders | messages | profile
  const [ads, setAds] = useState([]);

  // data stores (demo: localStorage)
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState({}); // { [adId]: { stars, text, at } }
  const [threads, setThreads] = useState({}); // { [adId]: [{id,text,at,from:'me'|'seller'}] }

  // load ads + local stores
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch("/ads.json", { cache: "no-store" });
        if (r.ok) {
          const data = await r.json();
          if (alive) setAds(Array.isArray(data) ? data.slice(0, 50) : []);
        } else throw 0;
      } catch {
        try {
          const local = JSON.parse(localStorage.getItem("ads") || "[]");
          if (alive) setAds(Array.isArray(local) ? local.slice(0, 50) : []);
        } catch { if (alive) setAds([]); }
      }
      try { setOrders(JSON.parse(localStorage.getItem("orders") || "[]")); } catch {}
      try { setReviews(JSON.parse(localStorage.getItem("reviews") || "{}")); } catch {}
      try { setThreads(JSON.parse(localStorage.getItem("threads") || "{}")); } catch {}
    })();
    return () => { alive = false; };
  }, []);

  // persist helpers
  const saveOrders = (next) => { setOrders(next); localStorage.setItem("orders", JSON.stringify(next)); };
  const saveReviews = (next) => { setReviews(next); localStorage.setItem("reviews", JSON.stringify(next)); };
  const saveThreads = (next) => { setThreads(next); localStorage.setItem("threads", JSON.stringify(next)); };

  // actions
  function placeOrder(ad) {
    const o = {
      id: uid(),
      adId: ad.id ?? ad.slug ?? uid(),
      title: ad.title || "Ürün",
      price: ad.price || "",
      img: ad.img || "",
      status: "hazırlanıyor", // hazırlanıyor -> kargoda -> teslim edildi
      created_at: new Date().toISOString(),
    };
    const next = [o, ...orders];
    saveOrders(next);
    alert("Sipariş verildi (demo). Mesajlaşma ve kargo takibi aktif.");
    setTab("orders");
  }

  function setStatus(orderId, status) {
    const next = orders.map(o => o.id === orderId ? { ...o, status } : o);
    saveOrders(next);
  }

  function sendMsg(adId, text) {
    if (!text.trim()) return;
    const t = { id: uid(), text, at: new Date().toISOString(), from: "me" };
    const next = { ...threads, [adId]: [t, ...(threads[adId] || [])] };
    saveThreads(next);
  }

  function rate(adId, stars, text) {
    const next = { ...reviews, [adId]: { stars, text: text || (reviews[adId]?.text || ""), at: new Date().toISOString() } };
    saveReviews(next);
  }

  // styles
  const css = `
    :root{--ink:#0f172a;--line:#e5e7eb;--muted:#475569}
    body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial,sans-serif;color:var(--ink)}
    .wrap{max-width:1100px;margin:0 auto;padding:18px 16px}
    .top{display:flex;gap:10px;align-items:center;justify-content:space-between;margin-bottom:12px}
    .brand{display:flex;gap:8px;align-items:center}
    .brand img{border-radius:12px}
    .tabs{display:flex;gap:8px;flex-wrap:wrap}
    .tab{padding:10px 12px;border:1px solid var(--line);background:#fff;border-radius:10px;cursor:pointer;font-weight:700}
    .tab.active{background:#111827;color:#fff;border-color:#111827}
    .ghost{padding:10px 12px;border-radius:10px;border:1px solid var(--line);background:#fff;font-weight:700;cursor:pointer}
    .primary{padding:10px 12px;border-radius:10px;border:1px solid #111827;background:#111827;color:#fff;font-weight:800;cursor:pointer}
    .note{margin:8px 0 12px;color:var(--muted);font-size:14px}
    .grid{display:grid;gap:14px;grid-template-columns:1fr 1fr}
    @media (max-width:880px){ .grid{grid-template-columns:1fr} }
    .cards{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(260px,1fr))}
    .card{background:#fff;border:1px solid var(--line);border-radius:14px;box-shadow:0 6px 18px rgba(0,0,0,.05);overflow:hidden}
    .hd{padding:10px 12px;border-bottom:1px solid var(--line);font-weight:800}
    .bd{padding:12px}
    .thumb{width:100%;aspect-ratio:4/3;background:#f1f5f9;background-size:cover;background-position:center}
    .title{margin:8px 0 6px;font-weight:800}
    .meta{display:flex;justify-content:space-between;color:var(--muted);font-size:13px}
    .row{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
    .star{font-size:20px;cursor:pointer}
    .star.off{opacity:.35}
    .msgbox{display:flex;gap:8px;margin-top:8px}
    .msgbox input{flex:1;padding:10px;border-radius:10px;border:1px solid var(--line)}
    .badge{display:inline-block;border:1px solid var(--line);border-radius:999px;padding:2px 8px;font-size:12px}
    .order{display:grid;grid-template-columns:88px 1fr auto;gap:10px;align-items:center;border:1px solid var(--line);border-radius:12px;padding:8px}
    .othumb{width:88px;height:66px;background:#f1f5f9;border-radius:8px;background-size:cover;background-position:center}
    .status{font-size:12px}
    .danger{border:1px solid #fecaca;background:#fee2e2;color:#991b1b;border-radius:10px;padding:8px 10px}
  `;

  if (!authed) {
    return (
      <main className="wrap">
        <Head><title>Müşteri Portalı • Giriş Gerekli</title></Head>
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <div className="top">
          <div className="brand">
            <img src="/logo.png" alt="" width="40" height="40" />
            <strong>Müşteri Portalı</strong>
          </div>
          <div>
            <button className="ghost" onClick={() => go("/")}>Ana sayfa</button>
            <button className="primary" onClick={() => go("/login?role=customer")}>Giriş / Kayıt</button>
          </div>
        </div>
        <div className="card">
          <div className="hd">Erişim Kısıtlı</div>
          <div className="bd">
            <p className="note">Bu alana erişmek için önce <b>Giriş</b> yapmalısınız. (Test için /login sayfasında giriş yaptığınızda tarayıcıya <code>authed=1</code> kaydedilir.)</p>
            <div className="row">
              <button className="primary" onClick={() => go("/login?role=customer")}>Giriş Yap</button>
              <button className="ghost" onClick={() => go("/")}>Ana sayfa</button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="wrap">
      <Head><title>Müşteri Portalı • Panel</title></Head>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* Top */}
      <div className="top">
        <div className="brand">
          <img src="/logo.png" alt="" width="40" height="40" />
          <strong>Müşteri Portalı</strong>
        </div>
        <div className="tabs">
          {["browse","orders","messages","profile"].map(k => (
            <button key={k} className={`tab ${tab===k?"active":""}`} onClick={()=>setTab(k)}>
              {k==="browse" && "İlanlar"}
              {k==="orders" && "Siparişlerim"}
              {k==="messages" && "Mesajlar"}
              {k==="profile" && "Profil"}
            </button>
          ))}
          <button className="ghost" onClick={() => go("/")}>Ana sayfa</button>
        </div>
      </div>

      {/* Browse */}
      {tab === "browse" && (
        <section>
          <div className="note">İlanlara puan verin ★ ve yorum yazın. “Sepete Ekle” demeden sipariş oluşturmaz.</div>
          <div className="cards">
            {ads.length === 0 ? (
              <div className="danger" style={{marginTop:8}}>Henüz ilan yok.</div>
            ) : ads.map((a, i) => {
              const adId = a.id ?? a.slug ?? String(i);
              const my = reviews[adId] || { stars: 0, text: "" };
              let stars = [1,2,3,4,5];
              return (
                <article key={adId} className="card">
                  <div className="thumb" style={a.img ? { backgroundImage: `url(${a.img})` } : undefined} />
                  <div className="bd">
                    <div className="title">{a.title || "İlan"}</div>
                    <div className="meta">
                      <span>{a.cat || a.category || "-"}</span>
                      <b>{a.price || ""}</b>
                    </div>

                    {/* Rating */}
                    <div className="row">
                      {stars.map(s => (
                        <span
                          key={s}
                          className={`star ${my.stars >= s ? "" : "off"}`}
                          onClick={() => rate(adId, s, my.text)}
                          role="button"
                          aria-label={`${s} yıldız`}
                        >★</span>
                      ))}
                      <span className="badge">{my.stars || 0}/5</span>
                    </div>

                    {/* Review text */}
                    <div className="row">
                      <input
                        type="text"
                        placeholder="Yorum yazın (görünür değildir, demo)"
                        defaultValue={my.text || ""}
                        onBlur={(e) => rate(adId, my.stars || 0, e.target.value)}
                      />
                    </div>

                    {/* Actions */}
                    <div className="row">
                      <button className="primary" onClick={() => placeOrder(a)}>Sepete Ekle</button>
                      <button className="ghost" onClick={() => go(a.url || `/ads/${a.slug || adId}`)}>İncele</button>
                    </div>

                    {/* Message to seller (demo thread) */}
                    <div className="msgbox">
                      <input id={`msg-${adId}`} placeholder="Satıcıya mesaj yaz (demo)" />
                      <button className="ghost" onClick={() => {
                        const el = document.getElementById(`msg-${adId}`);
                        if (el) { sendMsg(adId, el.value); el.value = ""; setTab("messages"); }
                      }}>Gönder</button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* Orders */}
      {tab === "orders" && (
        <section>
          <div className="card">
            <div className="hd">Siparişlerim ({orders.length})</div>
            <div className="bd">
              {!orders.length ? (
                <p className="note">Henüz sipariş yok.</p>
              ) : (
                orders.map(o => (
                  <div className="order" key={o.id}>
                    <div className="othumb" style={o.img ? { backgroundImage:`url(${o.img})` } : undefined} />
                    <div>
                      <div style={{fontWeight:800}}>{o.title}</div>
                      <div className="status">Durum: <b>{o.status}</b></div>
                      <div className="row" style={{marginTop:6}}>
                        <button className="ghost" onClick={() => alert("Ürünüm nerede? (demo): Tahmini teslimat 2-3 gün.")}>Ürünüm nerede?</button>
                        {o.status !== "kargoda" && <button className="ghost" onClick={() => setStatus(o.id, "kargoda")}>Kargoya verildi</button>}
                        {o.status !== "teslim edildi" && <button className="primary" onClick={() => setStatus(o.id, "teslim edildi")}>Teslim aldım</button>}
                      </div>
                    </div>
                    <div>
                      <span className="badge">{o.price || "-"}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      )}

      {/* Messages */}
      {tab === "messages" && (
        <section>
          <div className="card">
            <div className="hd">Mesajlar (demo)</div>
            <div className="bd">
              {Object.keys(threads).length === 0 ? (
                <p className="note">Henüz mesaj yok. “İlanlar” sekmesinden satıcıya yazabilirsiniz.</p>
              ) : (
                Object.entries(threads).map(([adId, arr]) => (
                  <div key={adId} style={{border:"1px solid var(--line)",borderRadius:12,padding:8,marginBottom:10}}>
                    <div style={{fontWeight:800, marginBottom:6}}>İlan #{adId}</div>
                    <div style={{display:"grid", gap:6}}>
                      {arr.map(m => (
                        <div key={m.id} style={{
                          background: m.from==="me" ? "#ecfeff" : "#f1f5f9",
                          border:"1px solid var(--line)", borderRadius:10, padding:"6px 8px"
                        }}>
                          <b>{m.from==="me" ? "Ben" : "Satıcı"}</b>: {m.text}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      )}

      {/* Profile */}
      {tab === "profile" && (
        <section>
          <div className="card">
            <div className="hd">Profil</div>
            <div className="bd">
              <p className="note">Gerçek profil ve ödeme bilgileri daha sonra eklenecek.</p>
              <div className="row">
                <button className="ghost" onClick={() => { localStorage.removeItem("authed"); setAuthed(false); go("/"); }}>
                  Çıkış Yap
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
