// docs/admin/js/admin-guard.js (teşhisli sürüm)
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
    console.log("[guard] uid:", u.uid);
    const ref = doc(db, "users", u.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      return goLogin(`Yetki kontrolü: users/${u.uid} bulunamadı (doküman yok).`);
    }

    const data = snap.data() || {};
    console.log("[guard] user doc:", data);

    // role alanı hem 'role' olarak hem de yanlış isimlerde olabilir diye defansif okuma
    const roleRaw = data.role ?? data.Role ?? data.ROLE ?? "";
    const role = typeof roleRaw === "string" ? roleRaw.toLowerCase() : "";

    if (role !== "admin") {
      return goLogin(`Yetki yok: role="${role}". users/${u.uid} içindeki 'role' alanını "admin" yap.`);
    }

    // geçti
    document.body.dataset.ready = "1";
    console.log("[guard] OK: admin erişimi verildi.");
  } catch (e) {
    console.error("[guard] hata:", e);
    // Firestore izin hatası vb. gerçek mesajı göster
    return goLogin(`Yetki kontrol hatası: ${e?.code || ""} ${e?.message || e}`);
  }
});

// Çıkış butonu (varsa)
document.getElementById("logoutBtn")?.addEventListener("click", async () => {
  await signOut(auth).catch(()=>{});
  location.href = "./index.html";
});
