"use client";
import React from "react";
export default function AdminHome(){
  // Local admin login kontrolü: /admin/login başarılıysa "ok" yazar
  if (typeof window !== "undefined" && localStorage.getItem("ue_admin_auth") !== "ok") {
    if (typeof window !== "undefined") window.location.replace("/admin/login/");
    return null;
  }
  return (
    <div style={{maxWidth:720,margin:"60px auto",padding:24,fontFamily:"system-ui"}}>
      <h1 style={{fontSize:28,fontWeight:800,margin:0}}>Admin Home</h1>
      <p style={{color:"#475569"}}>Giriş başarılı. Burası admin ana sayfa.</p>
    </div>
  );
}
