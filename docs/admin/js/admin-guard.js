// docs/admin/js/admin-guard.js
import { auth, db } from "./firebase-init.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const goLogin = async (msg) => {
  if (msg) alert(msg);
  await signOut(auth).catch(()=>{});
  location.replace("./index.html");
};

onAuthStateChanged(auth, async (u) => {
  if (!u) return goLogin("Oturum bulunamadı.");
  try {
    const ref = doc(db, "users", u.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return goLogin(`users/${u.uid} bulunamadı.`);
    const role = (snap.data().role || "").toLowerCase();
    if (role !== "admin") return goLogin(`Yetki yok: role="${role}"`);
    // ✅ Admin onaylandı
    document.body.dataset.ready = "1";
    // Paneli başlatması için olay yayınla
    window.dispatchEvent(new CustomEvent("admin-ready"));
  } catch (e) {
    return goLogin(`Yetki kontrol hatası: ${e?.code||""} ${e?.message||e}`);
  }
});

// Çıkış
document.getElementById("logoutBtn")?.addEventListener("click", async () => {
  await signOut(auth).catch(()=>{});
  location.href = "./index.html";
});
