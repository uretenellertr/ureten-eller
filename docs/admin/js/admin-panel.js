import { db } from "./firebase-init.js";
import {
  collection, query, where, orderBy, limit, getDocs, doc, updateDoc
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

/* Dashboard metrikleri (örnek, hızlı sorgular) */
async function loadMetrics() {
  const qs = await Promise.all([
    getDocs(query(collection(db,"users"), limit(1))),      // sadece count göstermek için basit yaklaşım
    getDocs(query(collection(db,"listings"), where("status","==","approved"), limit(1))),
    getDocs(query(collection(db,"listings"), where("status","==","pending"), limit(1))),
    getDocs(query(collection(db,"orders"), where("state","in",["open","shipping"]), limit(1))),
  ]);
  document.getElementById("mUsers").textContent    = qs[0].size >= 0 ? "≈" : "—";
  document.getElementById("mListings").textContent = qs[1].size >= 0 ? "≈" : "—";
  document.getElementById("mPending").textContent  = qs[2].size >= 0 ? "≈" : "—";
  document.getElementById("mOrders").textContent   = qs[3].size >= 0 ? "≈" : "—";
}

/* Kullanıcılar */
const usersBody = document.getElementById("usersBody");
const qUser = document.getElementById("qUser");
const btnReloadUsers = document.getElementById("btnReloadUsers");

async function loadUsers() {
  usersBody.innerHTML = `<tr><td colspan="6">Yükleniyor…</td></tr>`;
  // Basit liste: son eklenenler
  const snap = await getDocs(query(collection(db,"users"), orderBy("createdAt","desc")));
  const term = (qUser.value || "").toLowerCase();
  const rows = [];
  snap.forEach(d => {
    const u = d.data();
    const full = `${u.fullName||""}`.toLowerCase();
    const mail = `${u.email||""}`.toLowerCase();
    const city = `${u.city||""}`.toLowerCase();
    if (term && !(full.includes(term) || mail.includes(term) || city.includes(term))) return;
    rows.push(`
      <tr>
        <td>${u.fullName||"-"}</td>
        <td>${u.email||"-"}</td>
        <td>${u.role||"-"}</td>
        <td>${u.city||"-"}</td>
        <td>${u.isPro ? "PRO" : "-"}</td>
        <td>
          <button class="btn-sm" data-act="make-admin" data-id="${d.id}">Admin</button>
          <button class="btn-sm" data-act="toggle-pro" data-id="${d.id}">${u.isPro?"PRO İptal":"PRO Ver"}</button>
          <button class="btn-sm" data-act="ban" data-id="${d.id}">${u.banned?"Ban Kaldır":"Banla"}</button>
        </td>
      </tr>
    `);
  });
  usersBody.innerHTML = rows.join("") || `<tr><td colspan="6">Kayıt yok.</td></tr>`;
}

usersBody?.addEventListener("click", async (e) => {
  const btn = e.target.closest("button[data-act]");
  if (!btn) return;
  const id = btn.dataset.id;
  const act = btn.dataset.act;
  const ref = doc(db,"users",id);
  if (act==="make-admin"){
    await updateDoc(ref,{ role:"admin" });
  } else if (act==="toggle-pro"){
    const tr = btn.closest("tr");
    const isPro = btn.textContent.includes("İptal");
    await updateDoc(ref,{ isPro: !isPro });
  } else if (act==="ban"){
    const isBan = btn.textContent.includes("Kaldır");
    await updateDoc(ref,{ banned: !isBan });
  }
  await loadUsers();
});

btnReloadUsers?.addEventListener("click", loadUsers);
qUser?.addEventListener("input", loadUsers);

/* İlanlar (özet) */
const listingFilter = document.getElementById("listingFilter");
const listingsBody = document.getElementById("listingsBody");
const btnReloadListings = document.getElementById("btnReloadListings");

async function loadListings() {
  listingsBody.innerHTML = `<tr><td colspan="6">Yükleniyor…</td></tr>`;
  const st = listingFilter.value;
  const snap = await getDocs(query(collection(db,"listings"), where("status","==",st), orderBy("createdAt","desc")));
  const rows = [];
  snap.forEach(d=>{
    const l = d.data();
    rows.push(`
      <tr>
        <td>${l.title||"-"}</td>
        <td>${l.sellerName||"-"}</td>
        <td>${l.status||"-"}</td>
        <td>${l.featured?"Vitrin":"-"}</td>
        <td>${l.createdAt?.toDate?.().toLocaleString?.()||"-"}</td>
        <td>
          <button class="btn-sm" data-l="${d.id}" data-act="approve">Onayla</button>
          <button class="btn-sm" data-l="${d.id}" data-act="reject">Reddet</button>
          <button class="btn-sm" data-l="${d.id}" data-act="feature">${l.featured?"Vitrinden İndir":"Vitrine Al"}</button>
          <button class="btn-sm" data-l="${d.id}" data-act="delete">Sil</button>
        </td>
      </tr>
    `);
  });
  listingsBody.innerHTML = rows.join("") || `<tr><td colspan="6">Kayıt yok.</td></tr>`;
}

listingsBody?.addEventListener("click", async (e)=>{
  const b = e.target.closest("button[data-act]");
  if(!b) return;
  const ref = doc(db,"listings", b.dataset.l);
  const act = b.dataset.act;
  if (act==="approve") await updateDoc(ref,{ status:"approved" });
  if (act==="reject")  await updateDoc(ref,{ status:"rejected" });
  if (act==="feature"){
    // toggle
    const snap = await getDocs(query(collection(db,"listings"), where("__name__","==",b.dataset.l)));
    snap.forEach(async d=>{
      const cur = !!d.data().featured;
      await updateDoc(ref,{ featured: !cur });
    });
  }
  if (act==="delete"){ await updateDoc(ref,{ deleted:true, status:"deleted" }); }
  await loadListings();
});

btnReloadListings?.addEventListener("click", loadListings);
listingFilter?.addEventListener("change", loadListings);

/* Siparişler/Mesajlar/Bildirimler/Raporlar/Ayarlar: basit demo uçları */
document.getElementById("btnSendNotif")?.addEventListener("click", ()=>{
  const t = document.getElementById("nTitle").value.trim();
  const b = document.getElementById("nBody").value.trim();
  const s = document.getElementById("nSegment").value;
  if(!t||!b){ document.getElementById("nInfo").textContent="Başlık ve mesaj zorunlu."; return; }
  document.getElementById("nInfo").textContent=`(Örnek) ${s} segmentine bildirim kuyruğa alındı.`;
});

document.getElementById("btnReindex")?.addEventListener("click", ()=>{
  document.getElementById("sInfo").textContent="Arama indeksi yenileme başlatıldı (örnek).";
});
document.getElementById("btnPurge")?.addEventListener("click", ()=>{
  document.getElementById("sInfo").textContent="Önbellek temizlendi (örnek).";
});
document.getElementById("btnBackup")?.addEventListener("click", ()=>{
  document.getElementById("sInfo").textContent="JSON dışa aktarma hazır (örnek).";
});

/* ilk yük */
loadMetrics();
loadUsers();
loadListings();
