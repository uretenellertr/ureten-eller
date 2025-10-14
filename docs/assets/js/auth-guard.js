// AUTH GUARD (yalnızca girişliyken açılsın)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

const AUTH = "/auth.html";

const firebaseConfig = {
  apiKey: "AIzaSyCd9GjP6CDA8i4XByhXDHyESy-g_DHVwvQ",
  authDomain: "ureteneller-ecaac.firebaseapp.com",
  projectId: "ureteneller-ecaac",
  storageBucket: "ureteneller-ecaac.appspot.com", // (önerilen domain)
  messagingSenderId: "368042877151",
  appId: "1:368042877151:web:ee0879fc4717928079c96a",
  measurementId: "G-BJHKN8V4RQ"
};

try { document.body.classList.add("hidden"); } catch {}

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);

const goAuth = () => {
  const next = encodeURIComponent(location.pathname + location.search);
  location.replace(`${AUTH}?next=${next}`);
};

onAuthStateChanged(auth, (user) => {
  if (!user) { goAuth(); return; }
  try { document.body.classList.remove("hidden"); } catch {}
});

// Çıkış
document.addEventListener("click", async (e) => {
  const b = e.target.closest("#logoutBtn");
  if (!b) return;
  try { await signOut(auth); goAuth(); }
  catch (err) { alert("Çıkış yapılamadı: " + (err.code || err.message)); }
});
