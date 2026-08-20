"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Check if already logged in
  useEffect(() => {
    // Clear any cached admin state
    fetch("/api/content").then(() => {});
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        // Use replace so back button won't go back to login
        router.replace("/admin/paket");
      } else {
        setError("Password salah!");
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
        maxWidth: "400px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      }}>
        <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#085F80", marginBottom: "8px", textAlign: "center" }}>
          Admin Panel
        </h1>
        <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "32px", textAlign: "center" }}>
          Central Laundry Express
        </p>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#1e293b", marginBottom: "8px" }}>
              Password Admin
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password..."
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  paddingRight: "44px",
                  border: "2px solid #e2e8f0",
                  borderRadius: "10px",
                  fontSize: "15px",
                  outline: "none",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#085F80")}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "#94a3b8",
                  padding: "4px",
                }}
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          {error && (
            <p style={{ color: "#ef4444", fontSize: "14px", marginBottom: "16px", textAlign: "center" }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: loading ? "#94a3b8" : "#9e3f05",
              color: "white",
              border: "none",
              borderRadius: "30px",
              fontSize: "16px",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}
          >
            {loading ? "Masuk..." : "Masuk"}
          </button>
          <div style={{ marginTop: "16px", textAlign: "center" }}>
            <a
              href="/admin/forgot-password"
              style={{ color: "#085F80", fontSize: "14px", fontWeight: 600, textDecoration: "none" }}
            >
              🔑 Lupa Password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}