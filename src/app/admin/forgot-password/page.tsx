"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Step = "send" | "verify" | "reset";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("send");
  const [waLink, setWaLink] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Step 1: Generate code & get wa.me link
  const handleSendCode = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/forgot-password", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setWaLink(data.waLink);
        setStep("verify");
      } else {
        setError("Gagal membuat kode");
      }
    } catch {
      setError("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify code
  const handleVerifyCode = async () => {
    if (code.length !== 6) {
      setError("Kode harus 6 digit");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (data.success) {
        setResetToken(data.resetToken);
        setStep("reset");
        setError("");
      } else {
        setError(data.error || "Kode salah");
      }
    } catch {
      setError("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Set new password
  const handleResetPassword = async () => {
    setError("");
    if (!newPassword) {
      setError("Password tidak boleh kosong");
      return;
    }
    if (newPassword.length > 10) {
      setError("Password maksimal 10 karakter");
      return;
    }
    if (!/^[a-zA-Z0-9]+$/.test(newPassword)) {
      setError("Password hanya boleh huruf (besar/kecil) dan angka");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword, resetToken }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess("Password berhasil diubah! Mengalihkan ke halaman login...");
        setTimeout(() => router.replace("/admin/login"), 2000);
      } else {
        setError(data.error || "Gagal reset password");
      }
    } catch {
      setError("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #085F80 0%, #064b66 100%)",
    }}>
      <div style={{
        background: "white",
        borderRadius: "20px",
        padding: "48px",
        width: "100%",
        maxWidth: "440px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      }}>
        <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#085F80", marginBottom: "8px", textAlign: "center" }}>
          🔐 Lupa Password
        </h1>
        <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "32px", textAlign: "center" }}>
          Central Laundry Express
        </p>

        {/* Step 1: Send Code */}
        {step === "send" && (
          <div>
            <p style={{ fontSize: "14px", color: "#475569", marginBottom: "24px", lineHeight: 1.7, textAlign: "center" }}>
              Sistem akan mengirim kode verifikasi 6 digit ke WhatsApp admin Anda.
            </p>
            <button
              onClick={handleSendCode}
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                background: loading ? "#94a3b8" : "#25D366",
                color: "white",
                border: "none",
                borderRadius: "30px",
                fontSize: "16px",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.37 5.017L2 22l5.135-1.348a9.929 9.929 0 004.877 1.28h.004c5.505 0 9.989-4.478 9.99-9.986 0-2.67-1.037-5.178-2.924-7.065A9.923 9.923 0 0012.012 2z"/>
              </svg>
              {loading ? "Mengirim..." : "Kirim Kode ke WhatsApp"}
            </button>
          </div>
        )}

        {/* Step 2: Enter Code */}
        {step === "verify" && (
          <div>
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", padding: "16px", marginBottom: "24px" }}>
              <p style={{ fontSize: "13px", color: "#166534", marginBottom: "12px" }}>
                ✅ Klik tombol di bawah untuk membuka WhatsApp dan mendapatkan kode verifikasi:
              </p>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "12px",
                  background: "#25D366",
                  color: "white",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.37 5.017L2 22l5.135-1.348a9.929 9.929 0 004.877 1.28h.004c5.505 0 9.989-4.478 9.99-9.986 0-2.67-1.037-5.178-2.924-7.065A9.923 9.923 0 0012.012 2z"/>
                </svg>
                Buka WhatsApp & Lihat Kode
              </a>
              <p style={{ fontSize: "12px", color: "#64748b", marginTop: "8px", textAlign: "center" }}>
                Kode akan terlihat di pesan WhatsApp Anda
              </p>
            </div>

            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>
              Masukkan Kode Verifikasi (6 digit)
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              style={{
                width: "100%",
                padding: "14px 16px",
                border: "2px solid #e2e8f0",
                borderRadius: "10px",
                fontSize: "24px",
                fontWeight: 700,
                textAlign: "center",
                letterSpacing: "8px",
                outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#085F80")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            />
            <button
              onClick={handleVerifyCode}
              disabled={loading || code.length !== 6}
              style={{
                width: "100%",
                marginTop: "16px",
                padding: "14px",
                background: loading || code.length !== 6 ? "#94a3b8" : "#085F80",
                color: "white",
                border: "none",
                borderRadius: "30px",
                fontSize: "15px",
                fontWeight: 700,
                cursor: loading || code.length !== 6 ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Memverifikasi..." : "Verifikasi Kode"}
            </button>
            <button
              onClick={() => { setStep("send"); setError(""); setCode(""); }}
              style={{
                width: "100%",
                marginTop: "8px",
                padding: "12px",
                background: "transparent",
                color: "#64748b",
                border: "none",
                fontSize: "13px",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Kirim Ulang Kode
            </button>
          </div>
        )}

        {/* Step 3: New Password */}
        {step === "reset" && (
          <div>
            <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "12px", padding: "16px", marginBottom: "24px" }}>
              <p style={{ fontSize: "13px", color: "#1e40af" }}>
                ✅ Kode terverifikasi! Masukkan password baru Anda.
              </p>
            </div>

            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>
              Password Baru
            </label>
            <input
              type="text"
              value={newPassword}
              onChange={(e) => {
                const val = e.target.value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 10);
                setNewPassword(val);
              }}
              placeholder="Maks 10 karakter, huruf & angka"
              maxLength={10}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #e2e8f0",
                borderRadius: "10px",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#085F80")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            />
            <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px", marginBottom: "16px" }}>
              Maksimal 10 karakter. Hanya huruf (besar/kecil) dan angka. Contoh: Admin123
            </p>

            <button
              onClick={handleResetPassword}
              disabled={loading || !newPassword}
              style={{
                width: "100%",
                padding: "14px",
                background: loading || !newPassword ? "#94a3b8" : "#9e3f05",
                color: "white",
                border: "none",
                borderRadius: "30px",
                fontSize: "15px",
                fontWeight: 700,
                cursor: loading || !newPassword ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Menyimpan..." : "💾 Simpan Password Baru"}
            </button>
          </div>
        )}

        {/* Error & Success Messages */}
        {error && (
          <p style={{ color: "#ef4444", fontSize: "14px", marginTop: "16px", textAlign: "center", padding: "10px", background: "#fef2f2", borderRadius: "8px" }}>
            ❌ {error}
          </p>
        )}
        {success && (
          <p style={{ color: "#16a34a", fontSize: "14px", marginTop: "16px", textAlign: "center", padding: "10px", background: "#f0fdf4", borderRadius: "8px" }}>
            ✅ {success}
          </p>
        )}

        {/* Back to login */}
        <button
          onClick={() => router.replace("/admin/login")}
          style={{
            width: "100%",
            marginTop: "24px",
            padding: "12px",
            background: "transparent",
            color: "#64748b",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          ← Kembali ke Login
        </button>
      </div>
    </div>
  );
}
