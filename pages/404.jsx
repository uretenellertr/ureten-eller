// pages/404.jsx
"use client";
import React from "react";
import Head from "next/head";

export default function NotFound() {
  const go = (href) => { window.location.href = href; };

  return (
    <main className="wrap">
      <Head>
        <title>404 • Sayfa Bulunamadı</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="box">
        <img src="/logo.png" alt="Üreten Eller" width="72" height="72" className="logo" />
        <h1>404</h1>
        <p className="lead">Bu sayfayı bulamadık.</p>
        <div className="row">
          <button className="primary" onClick={() => go("/")}>Ana sayfa</button>
          <button className="ghost" onClick={() => go("/login")}>Giriş / Kayıt</button>
        </div>
        <small className="hint">Adres çubuğunu kontrol edin ya da ana sayfaya dönün.</small>
      </div>

      <style jsx>{`
        :root { --ink:#0f172a; --muted:#475569; --line:#e5e7eb; }
        html, body { height: 100%; }
        body {
          margin: 0;
          color: var(--ink);
          font-family: system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial, sans-serif;
          background: linear-gradient(120deg, #ff80ab, #a78bfa, #60a5fa, #34d399);
          background-attachment: fixed;
          display: flex;
          min-height: 100vh;
        }
        .wrap {
          margin: 0 auto;
          padding: 24px 16px;
          display: grid;
          place-items: center;
          min-height: 100vh;
          width: 100%;
          max-width: 980px;
        }
        .box {
          background: rgba(255,255,255,.96);
          border: 1px solid var(--line);
          border-radius: 18px;
          box-shadow: 0 12px 36px rgba(0,0,0,.12);
          padding: 24px 20px;
          text-align: center;
          width: 100%;
          max-width: 560px;
        }
        .logo { border-radius: 16px; box-shadow: 0 8px 24px rgba(0,0,0,.12); }
        h1 { margin: 10px 0 6px; font-size: 40px; }
        .lead { margin: 0 0 12px; color: var(--muted); font-size: 16px; }
        .row { display: flex; gap: 10px; justify-content: center; margin-top: 8px; flex-wrap: wrap; }
        .primary { padding: 12px 16px; border-radius: 12px; border: 1px solid #111827; background: #111827; color: #fff; font-weight: 800; cursor: pointer; }
        .ghost { padding: 12px 16px; border-radius: 12px; border: 1px solid var(--line); background: #fff; color: #0f172a; font-weight: 700; cursor: pointer; }
        .hint { display: block; margin-top: 10px; color: var(--muted); }
        @media (max-width:520px){ h1{font-size:32px} }
      `}</style>
    </main>
  );
}
