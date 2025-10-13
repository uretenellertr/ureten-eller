import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

/* =========================================================
   ÜRETEN ELLER – Satıcı Profili (pages/portal/seller/profile.jsx)
   TAM BAĞLI SÜRÜM (tüm butonlar aktif)
   - Firebase Auth: aktif kullanıcı
   - Firestore: users/{uid}, listings (seller_id==uid), reviews, payments, reports
   - Storage: receipts/* dekont yükleme
   - Vitrin ücretleri: Premium → ₺100, Standart → ₺249
   - Premium üyelik: ₺1999 / yıl (admin onayı gerekir)
   - Siyah legal footer ve mobil alt bar mevcut
   - Sahte veri YOK: her şey Auth/Firestore'dan
   ========================================================= */

/* ------------------------------ Firebase ------------------------------ */
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCd9GjP6CDA8i4XByhXDHyESy-g_DHVwvQ",
  authDomain: "ureteneller-ecaac.firebaseapp.com",
  projectId: "ureteneller-ecaac",
  storageBucket: "ureteneller-ecaac.firebasestorage.app",
  messagingSenderId: "368042877151",
  appId: "1:368042877151:web:ee0879fc4717928079c96a",
  measurementId: "G-BJHKN8V4RQ",
};

function ensureFirebase() {
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);
  return { app, auth, db, storage };
}

/* ------------------------------ Utils & UI ------------------------------ */
const cn = (...xs) => xs.filter(Boolean).join(" ");
const TRY = new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 });

function tsToMs(ts) {
  if (!ts) return null;
  if (typeof ts === "number") return ts;
  if (typeof ts === "string") return Date.parse(ts);
  if (ts?.seconds) return ts.seconds * 1000 + Math.floor((ts.nanoseconds || 0) / 1e6);
  const d = new Date(ts);
  return d.getTime();
}

function daysLeft(listing) {
  const now = Date.now();
  const base =
    (listing?.expires_at && tsToMs(listing.expires_at)) ||
    (listing?.published_at && tsToMs(listing.published_at) + 30 * 24 * 3600 * 1000) ||
    (listing?.created_at && tsToMs(listing.created_at) + 30 * 24 * 3600 * 1000);
  if (!base) return null;
  return Math.ceil((base - now) / (24 * 3600 * 1000));
}

function CopyButton({ text, label = "Kopyala", className = "" }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      onClick={async () => {
        try { await navigator.clipboard.writeText(text); setOk(true); setTimeout(()=>setOk(false), 1500); } catch(e){}
      }}
      className={cn("px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-50 active:scale-[.98]", className)}
    >
      {ok ? "Kopyalandı" : label}
    </button>
  );
}

function Badge({ children, tone = "gray" }) {
  const palette = {
    gray: "bg-gray-100 text-gray-700",
    gold: "bg-amber-100 text-yellow-800 border border-yellow-300",
    green: "bg-emerald-100 text-emerald-800 border border-emerald-200",
  };
  return <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", palette[tone])}>{children}</span>;
}

/* Toast */
function useToast() {
  const [msg, setMsg] = useState("");
  const [open, setOpen] = useState(false);
  const show = (m) => { setMsg(m); setOpen(true); setTimeout(()=>setOpen(false), 1800); };
  const node = open ? (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[70] bg-gray-900 text-white px-3 py-2 rounded-lg text-sm shadow">{msg}</div>
  ) : null;
  return { show, node };
}

/* ------------------------------ Modals ------------------------------ */
function PaymentModal({ open, onClose, kind, isPremiumUser, listing, uid }) {
  const { db, storage } = useMemo(() => ensureFirebase(), []);
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  if (!open) return null;

  const title = kind === "premium" ? "Premium Üyelik Ödemesi" : "Vitrine Taşı Ödemesi";
  const amount = kind === "premium" ? 1999 : (isPremiumUser ? 100 : 249);

  async function handleSend() {
    setErr("");
    if (!file) { setErr("Lütfen dekont yükleyin."); return; }
    try {
      setSubmitting(true);
      const ext = (file.name?.split(".").pop() || "bin");
      const path = `receipts/${uid}/${kind}-${Date.now()}.${ext}`;
      const r = sRef(storage, path);
      await uploadBytes(r, file);
      const url = await getDownloadURL(r);
      await addDoc(collection(db, "payments"), {
        user_id: uid,
        type: kind,
        listing_id: listing?.id || null,
        amount,
        currency: "TRY",
        method: "IBAN/Papara",
        iban: "TR590082900009491868461105",
        account_name: "Nejla Karataş",
        receipt_url: url,
        status: "pending_admin",
        created_at: serverTimestamp(),
      });
      setDone(true);
    } catch (e) {
      console.error(e);
      setErr("Kaydedilemedi. Lütfen tekrar deneyin.");
    } finally { setSubmitting(false); }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/40">
      <div className="w-full md:max-w-2xl bg-white rounded-t-2xl md:rounded-2xl shadow-xl">
        <div className="p-5 border-b">
          <div className="text-lg font-semibold">{title}</div>
          <div className="text-sm text-gray-500">Admin onayıyla aktif olacaktır.</div>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border bg-gray-50">
              <div className="text-sm text-gray-500 mb-2">Ödeme Bilgileri</div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <div className="font-medium">Tutar</div>
                  <div className="font-semibold">{TRY.format(amount)}</div>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-medium">IBAN</div>
                    <div className="font-mono text-sm">TR590082900009491868461105</div>
                  </div>
                  <CopyButton text="TR590082900009491868461105" />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-medium">Hesap Adı</div>
                    <div className="text-sm">Nejla Karataş</div>
                  </div>
                </div>
                <div>
                  <div className="font-medium">Papara</div>
                  <div className="text-sm">IBAN ile havale/EFT yapabilirsiniz.</div>
                </div>
                <div className="text-xs text-gray-500">Açıklama: <span className="font-mono">URETENELLER {kind.toUpperCase()} + kullanıcı UID</span></div>
              </div>
            </div>

            <div className="p-4 rounded-xl border">
              {done ? (
                <div className="text-emerald-700">
                  <div className="font-semibold mb-1">Dekont yüklendi.</div>
                  Admin onayından sonra {kind === "premium" ? "Premium" : "Vitrin"} aktif edilecektir.
                </div>
              ) : (
                <>
                  <div className="text-sm text-gray-500 mb-2">Dekont yükleyin (PDF/JPG/PNG)</div>
                  <input type="file" accept="image/*,application/pdf" onChange={(e)=>setFile(e.target.files?.[0]||null)} className="block w-full text-sm" />
                  {err && <div className="text-red-600 text-sm mt-2">{err}</div>}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="p-5 flex items-center justify-between gap-3 border-t">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border hover:bg-gray-50">Kapat</button>
          {!done && (
            <button onClick={handleSend} disabled={submitting || !file} className="px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50">
              {submitting ? "Yükleniyor…" : "Dekontu Gönder"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ReportModal({ open, onClose, sellerId, reporterId }) {
  const { db } = useMemo(()=>ensureFirebase(), []);
  const [reason, setReason] = useState("fraud");
  const [desc, setDesc] = useState("");
  const [sending, setSending] = useState(false);
  const [ok, setOk] = useState(false);

  if (!open) return null;

  async function submit() {
    try {
      setSending(true);
      await addDoc(collection(db, "reports"), {
        seller_id: sellerId,
        reporter_id: reporterId || null,
        reason,
        description: desc || null,
        created_at: serverTimestamp(),
        status: "open",
      });
      setOk(true);
    } catch(e) {
      console.error(e);
    } finally { setSending(false); }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/40">
      <div className="w-full md:max-w-lg bg-white rounded-t-2xl md:rounded-2xl shadow-xl">
        <div className="p-5 border-b">
          <div className="text-lg font-semibold">Şikayet Et</div>
        </div>
        <div className="p-5 space-y-3">
          {ok ? (
            <div className="text-emerald-700">Şikayetiniz alındı. İncelenecektir.</div>
          ) : (
            <>
              <label className="block text-sm">Sebep</label>
              <select value={reason} onChange={(e)=>setReason(e.target.value)} className="w-full border rounded-lg px-3 py-2">
                <option value="fraud">Dolandırıcılık şüphesi</option>
                <option value="abuse">Hakaret / kötü davranış</option>
                <option value="prohibited">Yasaklı ürün</option>
                <option value="other">Diğer</option>
              </select>
              <label className="block text-sm mt-2">Açıklama (isteğe bağlı)</label>
              <textarea value={desc} onChange={(e)=>setDesc(e.target.value)} className="w-full border rounded-lg px-3 py-2 min-h-[100px]" placeholder="Kısa açıklama…" />
            </>
          )}
        </div>
        <div className="p-5 flex items-center justify-between gap-3 border-t">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border hover:bg-gray-50">Kapat</button>
          {!ok && <button onClick={submit} disabled={sending} className="px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50">Gönder</button>}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ Listing Card ------------------------------ */
function ListingCard({ item, isOwner, onVitrine }) {
  const dleft = daysLeft(item);
  const expired = dleft !== null && dleft < 0;
  const pending = item?.status === "pending";
  return (
    <div className="relative group rounded-xl border overflow-hidden bg-white shadow-sm">
      {item?.vitrine && <div className="absolute left-2 top-2 z-10"><Badge tone="gold">Vitrinde</Badge></div>}
      {pending && <div className="absolute right-2 top-2 z-10"><Badge>Onay bekliyor</Badge></div>}
      <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
        {item?.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.cover_url} alt={item?.title||"ilan"} className="w-full h-full object-cover group-hover:scale-[1.02] transition" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Görsel yok</div>
        )}
      </div>
      <div className="p-3">
        <div className="font-medium line-clamp-1">{item?.title || "Başlık"}</div>
        <div className="text-sm text-gray-500 mt-0.5">{item?.price ? TRY.format(item.price) : ""}</div>
        <div className="text-xs mt-2 text-gray-500">{expired ? "Süresi doldu" : dleft === null ? '' : `Süre: ${dleft} gün`}</div>
        {isOwner && !item?.vitrine && !pending && !expired && (
          <button onClick={()=>onVitrine(item)} className="mt-3 w-full px-3 py-2 rounded-lg border border-amber-300 text-amber-800 hover:bg-amber-50">Vitrine Taşı</button>
        )}
      </div>
    </div>
  );
}

/* ------------------------------ Main Page ------------------------------ */
export default function SellerProfilePage(){
  const { auth } = useMemo(() => ensureFirebase(), []);
  const [uid, setUid] = useState(null);
  const [me, setMe] = useState(null);
  const [listings, setListings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState("urunler");
  const [payKind, setPayKind] = useState(null); // 'premium' | 'vitrine' | null
  const [payListing, setPayListing] = useState(null);
  const [reportOpen, setReportOpen] = useState(false);

  const { show, node: toast } = useToast();

  useEffect(() => {
    const stop = onAuthStateChanged(auth, async (u) => {
      if (!u) { setUid(null); setMe(null); setListings([]); setReviews([]); setLoading(false); return; }
      setUid(u.uid);
      const db = ensureFirebase().db;
      // users/{uid}
      const snap = await getDoc(doc(db, "users", u.uid));
      setMe(snap.exists() ? snap.data() : { email: u.email, full_name: u.displayName, avatar_url: u.photoURL });
      // listings
      const qL = query(collection(db, "listings"), where("seller_id", "==", u.uid), orderBy("created_at", "desc"));
      const unsubL = onSnapshot(qL, (qs) => {
        const rows = []; qs.forEach((d)=> rows.push({ id: d.id, ...d.data() })); setListings(rows); setLoading(false);
      }, ()=> setLoading(false));
      // reviews
      const qR = query(collection(db, "reviews"), where("seller_id", "==", u.uid), orderBy("created_at", "desc"));
      const unsubR = onSnapshot(qR, (qs)=>{
        const rs = []; qs.forEach((d)=> rs.push({ id: d.id, ...d.data() })); setReviews(rs);
      });
      return () => { unsubL(); unsubR(); };
    });
    return () => stop();
  }, [auth]);

  const isPremium = !!me?.premium;
  const verified = !!me?.verified;

  async function doShare(){
    try {
      const data = { title: "Üreten Eller", text: me?.store_name || me?.full_name || "Satıcı", url: typeof window!=="undefined" ? window.location.href : "" };
      if (navigator.share) { await navigator.share(data); }
      else { await navigator.clipboard.writeText(data.url); show("Bağlantı kopyalandı"); }
    } catch(e) { /* kullanıcı iptal edebilir */ }
  }

  return (
    <div className="min-h-screen bg-[#faf9f7] text-gray-900">
      {/* Topbar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/portal/seller" className="font-semibold text-amber-700 hover:text-amber-800">ÜRETEN ELLER</Link>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/portal/seller" className="px-3 py-1.5 rounded-lg border hover:bg-gray-50">Ana sayfaya dön</Link>
          </div>
        </div>
      </header>

      {/* Header profile block */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-start gap-5">
          <div className={cn("relative w-28 h-28 rounded-full overflow-hidden border", isPremium ? "ring-4 ring-yellow-500" : "") }>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={me?.avatar_url || "/avatar.svg"} alt="avatar" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold truncate">{me?.full_name || me?.store_name || me?.email || "Profil"}</h1>
              {verified && <Badge tone="green">Onaylı Satıcı</Badge>}
              {isPremium && <Badge tone="gold">Premium</Badge>}
            </div>
            <div className="mt-1 text-sm text-gray-600 space-x-3">
              {me?.handle && <span>@{me.handle}</span>}
              {me?.city && <span>• {me.city}</span>}
              {me?.created_at && <span>• Katılma: {new Date(tsToMs(me.created_at)).toLocaleDateString("tr-TR")}</span>}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Link href={`/portal/seller/messages`} className="px-3 py-2 rounded-lg border hover:bg-gray-50">Mesaj Gönder</Link>
              <button onClick={doShare} className="px-3 py-2 rounded-lg border hover:bg-gray-50">Paylaş</button>
              <button onClick={()=>setReportOpen(true)} className="px-3 py-2 rounded-lg border hover:bg-gray-50">Şikayet Et</button>
              <CopyButton text={uid||""} label="UID Kopyala" className="ml-2" />
            </div>
          </div>

          {/* Right side – settings shortcuts */}
          <div className="hidden lg:block w-[380px] shrink-0">
            <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
              <div className="px-4 pt-4">
                <div className="flex items-center gap-4 border-b pb-3">
                  <Link href="/portal/seller?tab=profile" className="px-3 py-2 rounded-md border border-gray-300 text-sm hover:bg-gray-50">Profil</Link>
                  <Link href="/portal/seller?tab=contact" className="px-3 py-2 rounded-md border border-gray-300 text-sm hover:bg-gray-50">İletişim</Link>
                  <Link href="/portal/seller?tab=security" className="px-3 py-2 rounded-md border border-gray-300 text-sm hover:bg-gray-50">Güvenlik</Link>
                  <Link href="/portal/seller?tab=payments" className="px-3 py-2 rounded-md border border-gray-300 text-sm hover:bg-gray-50">Ödemeler</Link>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">Premium</div>
                  <div className="text-sm font-medium">{isPremium ? "Aktif" : "Pasif"}</div>
                </div>
                <button onClick={()=>setPayKind("premium")} className="w-full mt-2 px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700">Premium'a Geç</button>
                <div className="text-xs text-gray-500">Premium admin tarafından verilir. Ödeme dekontunu yükleyin.</div>
                <div className="mt-3">
                  <div className="text-sm font-medium mb-1">Mağaza Bilgileri</div>
                  <div className="text-xs text-gray-600">Kargo & iade, çalışma saatleri ve SSS'yi hesap ayarlarından düzenleyin.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-6 border-b">
          {[
            {k:"urunler", t:"Ürünler"},
            {k:"deger", t:"Değerlendirmeler"},
            {k:"hakkinda", t:"Hakkında"},
            {k:"kargo", t:"Kargo & iade"},
            {k:"sss", t:"SSS"},
          ].map(x=> (
            <button key={x.k} onClick={()=>setTab(x.k)} className={cn("px-1 py-3", tab===x.k?"-mb-px border-b-2 border-amber-600 font-medium":"text-gray-500 hover:text-gray-800")}>{x.t}</button>
          ))}
        </div>
      </section>

      {/* Tab contents */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        {tab === "urunler" && (
          loading ? (
            <div className="text-center text-gray-500">Yükleniyor…</div>
          ) : listings.length === 0 ? (
            <div className="text-center text-gray-500">Henüz ilan yok.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {listings.map((it)=> (
                <ListingCard key={it.id} item={it} isOwner={true} onVitrine={(l)=>{ setPayListing(l); setPayKind("vitrine"); }} />
              ))}
            </div>
          )
        )}

        {tab === "deger" && (
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="text-gray-500">Henüz değerlendirme yok.</div>
            ) : (
              reviews.map((r)=> (
                <div key={r.id} className="rounded-xl border bg-white p-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">{r.buyer_name || "Alıcı"}</span>
                    {r.verified && <Badge tone="green">Doğrulanmış alışveriş</Badge>}
                    <span className="text-gray-500">• {new Date(tsToMs(r.created_at)).toLocaleDateString("tr-TR")}</span>
                  </div>
                  <div className="mt-1">{"★".repeat(r.rating||0)}{"☆".repeat(5-(r.rating||0))}</div>
                  <div className="text-sm text-gray-700 mt-2 whitespace-pre-line">{r.text}</div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "hakkinda" && (
          <div className="rounded-xl border bg-white p-4 space-y-3">
            <div><span className="text-sm text-gray-500">Mağaza adı</span><div className="font-medium">{me?.store_name || me?.full_name || me?.email}</div></div>
            <div><span className="text-sm text-gray-500">Konum</span><div>{me?.city || "—"}{me?.district?`, ${me.district}`:""}</div></div>
            <div>
              <span className="text-sm text-gray-500">Mağaza hakkında</span>
              <div className="whitespace-pre-line mt-1">{me?.about || "Satıcı henüz bilgi eklemedi."}</div>
            </div>
            {me?.store_hours && (
              <div>
                <span className="text-sm text-gray-500">Çalışma saatleri</span>
                <div className="mt-1 whitespace-pre-line">{me.store_hours}</div>
              </div>
            )}
          </div>
        )}

        {tab === "kargo" && (
          <div className="rounded-xl border bg-white p-4 space-y-3">
            <div className="text-sm text-gray-500">Kargo süreci</div>
            <div className="whitespace-pre-line">{me?.shipping_policy || "Satıcı henüz kargo & iade bilgisi eklemedi."}</div>
          </div>
        )}

        {tab === "sss" && (
          <div className="space-y-3">
            {Array.isArray(me?.faq) && me.faq.length > 0 ? (
              me.faq.map((qa, i)=> (
                <details key={i} className="rounded-xl border bg-white p-4">
                  <summary className="font-medium cursor-pointer">{qa.q}</summary>
                  <div className="mt-2 text-sm text-gray-700 whitespace-pre-line">{qa.a}</div>
                </details>
              ))
            ) : (
              <div className="rounded-xl border bg-white p-4 text-gray-500">SSS eklenmemiş.</div>
            )}
          </div>
        )}
      </section>

      {/* Bottom mobile tabbar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t">
        <div className="max-w-7xl mx-auto grid grid-cols-4 text-center">
          <Link href="/portal/seller" className="py-2 text-sm">Ana sayfa</Link>
          <Link href="/portal/seller/messages" className="py-2 text-sm">Mesajlar</Link>
          <Link href="/portal/seller/notifications" className="py-2 text-sm">Bildirimler</Link>
          <Link href="/portal/seller/profile" className="py-2 text-sm font-medium text-amber-700">Ben</Link>
        </div>
      </nav>

      {/* Legal black footer */}
      <footer className="mt-10 bg-black text-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-sm">
          <div className="space-x-4 whitespace-nowrap overflow-x-auto">
            <Link href="/legal/kurumsal" className="hover:text-white">Kurumsal</Link>
            <Link href="/legal/hakkimizda" className="hover:text-white">Hakkımızda</Link>
            <Link href="/legal/iletisim" className="hover:text-white">İletişim</Link>
            <Link href="/legal/gizlilik" className="hover:text-white">Gizlilik</Link>
            <Link href="/legal/kvkk-aydinlatma" className="hover:text-white">KVKK Aydınlatma</Link>
          </div>
          <div className="space-x-4 whitespace-nowrap overflow-x-auto">
            <Link href="/legal/kullanim-sartlari" className="hover:text-white">Kullanım Şartları</Link>
            <Link href="/legal/mesafeli-satis-sozlesmesi" className="hover:text-white">Mesafeli Satış</Link>
            <Link href="/legal/teslimat-iade" className="hover:text-white">Teslimat & İade</Link>
            <Link href="/legal/cerez-politikasi" className="hover:text-white">Çerez</Link>
            <Link href="/legal/topluluk-kurallari" className="hover:text-white">Topluluk Kuralları</Link>
            <Link href="/legal/yasakli-urunler" className="hover:text-white">Yasaklı Ürünler</Link>
          </div>
          <div className="text-right text-gray-400">© {new Date().getFullYear()} Üreten Eller</div>
        </div>
      </footer>

      {/* Modals */}
      <PaymentModal open={!!payKind && payKind === "premium"} onClose={()=>{ setPayKind(null); setPayListing(null); }} kind="premium" isPremiumUser={isPremium} listing={null} uid={uid} />
      <PaymentModal open={!!payKind && payKind === "vitrine"} onClose={()=>{ setPayKind(null); setPayListing(null); }} kind="vitrine" isPremiumUser={isPremium} listing={payListing} uid={uid} />
      <ReportModal open={reportOpen} onClose={()=>setReportOpen(false)} sellerId={uid} reporterId={uid} />
      {toast}
    </div>
  );
}
