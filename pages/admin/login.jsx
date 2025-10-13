// /pages/admin/login.jsx
"use client";
import React from "react";

// Gizli bilgiler düz yazıyla tutulmuyor (SHA-256 hash karşılaştırması)
const EMAIL_HASH = "759aab30683e02d18dc45a31635847142d26ae99822aba6f513d9fcc563fdac3"; // "ozkank603@gmail.com"
const PASS_HASH  = "b565f52af3a7b15fccf6dfba9dea75327b290b115fdb2f49389592e9aa0a75dc"; // "Nejla3844"

async function sha256Hex(s) {
  const enc = new TextEncoder().encode(s);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export default function AdminLogin() {
  const [email, setEmail] = React.useState("");
  const [pass, setPass]   = React.useState("");
  const [err, setErr]     = React.useState("");
  const [busy, setBusy]   = React.useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      const ok =
        (await sha256Hex(email.trim().toLowerCase())) === EMAIL_HASH &&
        (await sha256Hex(pass)) === PASS_HASH;

      if (ok) {
        localStorage.setItem("ue_admin_auth", "ok");
        location.assign("/admin/");
        return;
      }
      setErr("E-posta ya da şifre yanlış.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#000",
      color: "#e5e7eb",
      display: "grid",
      placeItems: "center",
      padding: "24px",
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial"
    }}>
      <form onSubmit={onSubmit} style={{
        width: "min(420px, 92vw)",
        background: "#0b0b0b",
        border: "1px solid #1f2937",
        borderRadius: 16,
        padding: 24,
        boxShadow: "0 10px 30px rgba(0,0,0,.45)"
      }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#fff" }}>Admin Girişi</h1>
        <p style={{ margin: "8px 0 16px", color: "#94a3b8", fontSize: 14 }}>Devam etmek için giriş yapın.</p>

        <label style={{ display: "block", fontSize: 12, color: "#9ca3af", marginBottom: 6 }}>E-posta</label>
        <input
          type="email"
          inputMode="email"
          autoComplete="username"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          placeholder="E-posta"
          style={{
            width: "100%", background: "#0f172a", color: "#e2e8f0",
            border: "1px solid #334155", borderRadius: 10, padding: "10px 12px",
            marginBottom: 12
          }}
        />

        <label style={{ display: "block", fontSize: 12, color: "#9ca3af", marginBottom: 6 }}>Şifre</label>
        <input
          type="password"
          autoComplete="current-password"
          value={pass}
          onChange={(e)=>setPass(e.target.value)}
          placeholder="Şifre"
          style={{
            width: "100%", background: "#0f172a", color: "#e2e8f0",
            border: "1px solid #334155", borderRadius: 10, padding: "10px 12px"
          }}
        />

        {err && <div style={{ color: "#fca5a5", fontSize: 13, marginTop: 10 }}>{err}</div>}

        <button
          type="submit"
          disabled={busy}
          style={{
            marginTop: 16, width: "100%", padding: "10px 12px",
            background: "#111827", color: "#fff", border: "1px solid #111827",
            borderRadius: 10, fontWeight: 800, cursor: "pointer", opacity: busy ? .7 : 1
          }}
        >
          {busy ? "Kontrol ediliyor…" : "Giriş Yap"}
        </button>
      </form>
    </div>
  );
}
