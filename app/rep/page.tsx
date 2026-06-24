"use client";
import { useState, useEffect } from "react";

export default function RepDashboard() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0D1B2A",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Arial, sans-serif",
    }}>
      <div style={{ color: "white", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔐</div>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
          VerifyAI
        </h1>
        <p style={{ color: "#94A3B8", fontSize: 16 }}>
          Rep Dashboard Loading...
        </p>
      </div>
    </div>
  );
}