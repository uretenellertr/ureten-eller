import { auth, db } from "./firebase-init.js";
import {
  onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import {
  doc, getDoc
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const logoutBtn = document.getElementById("logoutBtn");
logoutBtn?.addEventListener("click", async () => {
  await signOut(auth);
  location.href = "./index.html";
});

async function ensureAdmin(user) {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  const role = snap.exists() ? (snap.data().role || "") : "";
  if (role !== "admin") throw new Error("Yetki yok");
}

onAuthStateChanged(auth, async (u) => {
  if (!u) { location.replace("./index.html"); return; }
  try {
    await ensureAdmin(u);
    document.body.dataset.ready = "1";
  } catch {
    alert("Bu sayfaya erişim izniniz yok.");
    await signOut(auth);
    location.replace("./index.html");
  }
});
