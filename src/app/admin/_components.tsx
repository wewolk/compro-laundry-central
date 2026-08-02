"use client";

import { useState, useEffect, useCallback } from "react";

export interface SiteContent {
  settings: {
    waLink: string;
    waNumber: string;
    instagramUrl: string;
    email: string;
    address: string;
    mapLink: string;
    mapEmbedUrl: string;
    operationalHours: { weekdays: string; weekend: string };
  };
  paket: { id: string; name: string; features: string[]; isPopular: boolean }[];
  kiloan: { id: string; name: string; description: string; features: string[]; iconType: string; isPopular: boolean }[];
  footer: {
    brandName: string;
    description: string;
    menuItems: { label: string; href: string }[];
    copyright: string;
  };
  gallery: { id: number; src: string; alt: string; category: string; type: string }[];
}

export function useContent() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch("/api/content");
      const data = await res.json();
      setContent(data);
    } catch {
      setMessage({ text: "Gagal memuat data", type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => { if (!cancelled) setContent(data); })
      .catch(() => { if (!cancelled) setMessage({ text: "Gagal memuat data", type: "error" }); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const saveContent = async (newContent: SiteContent) => {
    setSaving(true);
    setMessage({ text: "", type: "" });
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newContent),
      });
      if (res.ok) {
        setContent(newContent);
        setMessage({ text: "✅ Berhasil disimpan!", type: "success" });
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      } else {
        setMessage({ text: "❌ Gagal menyimpan", type: "error" });
      }
    } catch {
      setMessage({ text: "❌ Gagal menyimpan", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) return data.url;
      setMessage({ text: `❌ ${data.error}`, type: "error" });
      return null;
    } catch {
      setMessage({ text: "❌ Gagal upload", type: "error" });
      return null;
    }
  };

  return { content, loading, saving, message, saveContent, uploadImage, setMessage };
}

// Reusable UI components
export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ marginBottom: "32px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#085F80", marginBottom: "8px" }}>{title}</h1>
      {subtitle && <p style={{ fontSize: "15px", color: "#64748b" }}>{subtitle}</p>}
    </div>
  );
}

export function SaveButton({ onClick, saving, message }: { onClick: () => void; saving: boolean; message: { text: string; type: string } }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "24px" }}>
      <button
        onClick={onClick}
        disabled={saving}
        style={{
          padding: "12px 32px",
          background: saving ? "#94a3b8" : "#9e3f05",
          color: "white",
          border: "none",
          borderRadius: "30px",
          fontSize: "15px",
          fontWeight: 700,
          cursor: saving ? "not-allowed" : "pointer",
        }}
      >
        {saving ? "Menyimpan..." : "💾 Simpan Perubahan"}
      </button>
      {message.text && (
        <span style={{ fontSize: "14px", fontWeight: 600, color: message.type === "success" ? "#16a34a" : "#ef4444" }}>
          {message.text}
        </span>
      )}
    </div>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: "white",
      borderRadius: "16px",
      padding: "24px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      border: "1px solid #e2e8f0",
      ...style,
    }}>
      {children}
    </div>
  );
}

export function InputField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "10px 14px",
          border: "2px solid #e2e8f0",
          borderRadius: "10px",
          fontSize: "14px",
          outline: "none",
          transition: "border-color 0.2s",
          boxSizing: "border-box",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#085F80")}
        onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
      />
    </div>
  );
}

export function TextareaField({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        style={{
          width: "100%",
          padding: "10px 14px",
          border: "2px solid #e2e8f0",
          borderRadius: "10px",
          fontSize: "14px",
          outline: "none",
          resize: "vertical",
          fontFamily: "inherit",
          boxSizing: "border-box",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#085F80")}
        onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
      />
    </div>
  );
}
