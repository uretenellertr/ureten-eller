// AUTH GUARD (yalnızca girişliyken erişilsin)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

// Giriş YOKSA yönleneceğin sayfa (landing)
const AUTH = "/index.html"; // istersen "/" da yapabilirsin

const firebaseConfig = {
  apiKey: "AIzaSyCd9GjP6CDA8i4XByhXDHyESy-g_DHVwvQ",
  authDomain: "ureteneller-ecaac.firebaseapp.com",
  projectId: "ureteneller-ecaac",
  storageBucket: "ureteneller-ecaac.firebasestorage.app",
  messagingSenderId: "368042877151",
  appId: "1:368042877151:web:ee0879fc4717928079c96a",
  measurementId: "G-BJHKN8V4RQ"
};

// İlk anda FOUC engelle (sayfayı sakla); .hidden { display:none } stilin olsun
try { document.body.classList.add("hidden"); } catch (_) {}

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (!user) {
    // giriş yok → index'e gönder
    location.replace(AUTH);
    return;
  }
  // giriş var → sayfayı göster
  try { document.body.classList.remove("hidden"); } catch (_) {}
});

// (İsteğe bağlı) Çıkış butonu: id="logoutBtn"
document.addEventListener("click", async (e) => {
  const b = e.target.closest("#logoutBtn");
  if (!b) return;
  try {
    await signOut(auth);
    // çıkıştan sonra landing'e gönder
    location.replace(AUTH);
  } catch (err) {
    alert("Çıkış yapılamadı: " + (err?.code || err?.message || err));
  }
});
