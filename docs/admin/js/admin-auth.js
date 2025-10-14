import { auth } from "./firebase-init.js";
import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

const form = document.getElementById("loginForm");
const errEl = document.getElementById("err");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  errEl.textContent = "";

  const email = (document.getElementById("email")?.value || "").trim();
  const password = document.getElementById("password")?.value || "";

  try {
    await signInWithEmailAndPassword(auth, email, password);
    location.href = "./panel.html";
  } catch (err) {
    errEl.textContent = err?.message || "Giriş başarısız.";
  }
});

// Otomatik yönlendirme kaldırıldı; giriş yalnızca form ile yapılır.
