"use client";

import { useState } from "react";
import { useContent, PageHeader, Card, InputField } from "../_components";

export default function SettingsPage() {
  const { content, loading, saving, message, saveContent } = useContent();
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [pwMessage, setPwMessage] = useState({ text: "", type: "" });
  const [pwLoading, setPwLoading] = useState(false);

  if (loading || !content) return <p style={{ padding: "40px", color: "#64748b" }}>Memuat data...</p>;

  const s = content.settings;

  const update = (field: string, value: string) => {
    saveContent({ ...content, settings: { ...s, [field]: value } });
  };

  const handleChangePassword = async () => {
    setPwMessage({ text: "", type: "" });

    if (!currentPw || !newPw) {
      setPwMessage({ text: "❌ Semua field harus diisi", type: "error" });
      return;
    }
    if (newPw.length > 10) {
      setPwMessage({ text: "❌ Password maksimal 10 karakter", type: "error" });
      return;
    }
    if (!/^[a-zA-Z0-9]+$/.test(newPw)) {
      setPwMessage({ text: "❌ Password hanya boleh huruf dan angka", type: "error" });
      return;
    }

    setPwLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      });
      const data = await res.json();
      if (data.success) {
        setPwMessage({ text: "✅ Password berhasil diubah!", type: "success" });
        setCurrentPw("");
        setNewPw("");
      } else {
        setPwMessage({ text: `❌ ${data.error}`, type: "error" });
      }
    } catch {
      setPwMessage({ text: "❌ Terjadi kesalahan", type: "error" });
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <>
      <PageHeader title="⚙️ Pengaturan" subtitle="Atur link WhatsApp, Instagram, dan keamanan akun" />

      <div style={{ display: "grid", gap: "24px", marginTop: "24px" }}>
        <Card>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#25D366", marginBottom: "16px" }}>💬 WhatsApp</h3>
          <InputField label="Nomor WhatsApp" value={s.waNumber} onChange={(v) => update("waNumber", v)} placeholder="0851-8184-0082" />
          <InputField label="Link WhatsApp (wa.me)" value={s.waLink} onChange={(v) => update("waLink", v)} placeholder="https://wa.me/6285181840082?text=..." />
          <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "8px" }}>
            💡 Link ini akan digunakan di semua tombol WhatsApp di website
          </p>
        </Card>

        <Card>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#E1306C", marginBottom: "16px" }}>📸 Instagram</h3>
          <InputField label="Link Instagram" value={s.instagramUrl} onChange={(v) => update("instagramUrl", v)} placeholder="https://instagram.com/central.laundry" />
          <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "8px" }}>
            💡 Link ini akan digunakan di ikon Instagram di footer
          </p>
        </Card>

        <Card>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#085F80", marginBottom: "16px" }}>📧 Email</h3>
          <InputField label="Alamat Email" value={s.email} onChange={(v) => update("email", v)} placeholder="hello@centrallaundry.id" />
        </Card>

        {/* Change Password */}
        <Card style={{ border: "2px solid #fef3c7" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#92400e", marginBottom: "8px" }}>🔒 Ubah Password</h3>
          <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "20px" }}>
            Password maksimal 10 karakter. Hanya huruf (besar/kecil) dan angka.
          </p>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>
              Password Saat Ini
            </label>
            <input
              type="password"
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              placeholder="Masukkan password lama"
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "2px solid #e2e8f0",
                borderRadius: "10px",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#085F80")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>
              Password Baru
            </label>
            <input
              type="text"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 10))}
              placeholder="Maks 10 karakter, huruf & angka"
              maxLength={10}
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "2px solid #e2e8f0",
                borderRadius: "10px",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#085F80")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            />
            <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
              Contoh: Admin123, Rahasia1, abc123
            </p>
          </div>

          <button
            onClick={handleChangePassword}
            disabled={pwLoading || !currentPw || !newPw}
            style={{
              padding: "12px 28px",
              background: pwLoading || !currentPw || !newPw ? "#94a3b8" : "#9e3f05",
              color: "white",
              border: "none",
              borderRadius: "30px",
              fontSize: "14px",
              fontWeight: 700,
              cursor: pwLoading || !currentPw || !newPw ? "not-allowed" : "pointer",
            }}
          >
            {pwLoading ? "Menyimpan..." : "🔒 Ubah Password"}
          </button>

          {pwMessage.text && (
            <p style={{
              marginTop: "12px",
              fontSize: "14px",
              fontWeight: 600,
              color: pwMessage.type === "success" ? "#16a34a" : "#ef4444",
              padding: "10px",
              background: pwMessage.type === "success" ? "#f0fdf4" : "#fef2f2",
              borderRadius: "8px",
            }}>
              {pwMessage.text}
            </p>
          )}
        </Card>
      </div>
    </>
  );
}
