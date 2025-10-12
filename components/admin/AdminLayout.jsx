// /components/admin/AdminLayout.jsx
"use client";
import React from "react";
import Link from "next/link";

export default function AdminLayout({ children, role="owner" }) {
  return (
    <div style={{display:"grid",gridTemplateColumns:"240px 1fr",minHeight:"100vh"}}>
      <aside style={{background:"#0b0b0b",color:"#fff",padding:16}}>
        <h2 style={{marginTop:0}}>Admin</h2>
        <nav style={{display:"grid",gap:8}}>
          <Link href="/admin" style={{color:"#e2e8f0"}}>Ön Panel</Link>
          <Link href="/admin/users" style={{color:"#e2e8f0"}}>Kullanıcılar</Link>
          <Link href="/admin/listings" style={{color:"#e2e8f0"}}>İlanlar</Link>
          <Link href="/admin/orders" style={{color:"#e2e8f0"}}>Siparişler</Link>
          <Link href="/admin/support" style={{color:"#e2e8f0"}}>Canlı Destek</Link>
          <Link href="/admin/moderation" style={{color:"#e2e8f0"}}>Moderatör</Link>
        </nav>
        <div style={{marginTop:16,fontSize:12,opacity:.8}}>Rol: {role}</div>
      </aside>
      <section style={{padding:16,background:"#f8fafc"}}>{children}</section>
    </div>
  );
}
