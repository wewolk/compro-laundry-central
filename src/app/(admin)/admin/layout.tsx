"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface SidebarItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

const sidebarItems: SidebarItem[] = [
  { label: "📦 Paket", href: "/admin/paket" },
  { label: "🧺 Kiloan", href: "/admin/kiloan" },
  { label: "📍 Kontak & Lokasi", href: "/admin/kontak" },
  { label: "🖼️ Galeri", href: "/admin/galeri" },
  { label: "⚙️ Pengaturan (WA/IG)", href: "/admin/settings" },
  { label: "🦶 Footer", href: "/admin/footer" },
  {
    label: "📖 Panduan",
    href: "/admin/panduan",
    children: [
      { label: "Memulai", href: "/admin/panduan#memulai" },
      { label: "Kelola Paket & Kiloan", href: "/admin/panduan#paket" },
      { label: "Galeri & Slider Beranda", href: "/admin/panduan#galeri" },
      { label: "Kontak & Peta", href: "/admin/panduan#kontak" },
      { label: "Keamanan & Password", href: "/admin/panduan#keamanan" },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Groups expanded in the sidebar; the active group starts open.
  const [openGroups, setOpenGroups] = useState<string[]>(() =>
    pathname.startsWith("/admin/panduan") ? ["/admin/panduan"] : []
  );

  const toggleGroup = (href: string) =>
    setOpenGroups((current) =>
      current.includes(href)
        ? current.filter((item) => item !== href)
        : [...current, href]
    );

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // If on login page, don't show admin layout
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    // Use replace to prevent back button from returning to admin
    router.replace("/admin/login");
    // Force hard navigation to clear all client state
    window.location.href = "/admin/login";
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const sidebarWidth = isMobile ? "280px" : (sidebarOpen ? "260px" : "60px");

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f1f5f9" }}>
      {/* Mobile Backdrop Overlay */}
      {isMobile && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 49,
            opacity: mobileMenuOpen ? 1 : 0,
            pointerEvents: mobileMenuOpen ? "auto" : "none",
            transition: "opacity 0.3s ease",
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: isMobile ? "280px" : sidebarWidth,
          background: "linear-gradient(180deg, #0a1628 0%, #0f2035 100%)",
          color: "white",
          transition: isMobile
            ? "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.35s ease"
            : "width 0.3s ease",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          zIndex: 50,
          overflow: "hidden",
          ...(isMobile
            ? {
                transform: mobileMenuOpen ? "translateX(0)" : "translateX(-100%)",
                boxShadow: mobileMenuOpen ? "4px 0 24px rgba(0,0,0,0.3)" : "none",
              }
            : {}),
        }}
      >
        {/* Logo area */}
        <div style={{
          padding: "24px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          opacity: (isMobile ? mobileMenuOpen : sidebarOpen) ? 1 : 0,
          transform: (isMobile ? mobileMenuOpen : sidebarOpen) ? "translateX(0)" : "translateX(-20px)",
          transition: "opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s",
        }}>
          <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#60a5fa", whiteSpace: "nowrap" }}>
            Admin Panel
          </h2>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginTop: "4px" }}>
            Central Laundry Express
          </p>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: "4px", overflowY: "auto" }}>
          {sidebarItems.map((item, index) => {
            const isActive = pathname === item.href;
            const expanded = openGroups.includes(item.href);
            const revealed = isMobile ? mobileMenuOpen : sidebarOpen;
            const itemStyle = {
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: 600,
              color: isActive ? "white" : "rgba(255,255,255,0.7)",
              background: isActive ? "rgba(96,165,250,0.2)" : "transparent",
              textDecoration: "none",
              transition: "all 0.2s",
              whiteSpace: "nowrap" as const,
              opacity: revealed ? 1 : 0,
              transform: revealed ? "translateX(0)" : "translateX(-20px)",
              transitionDelay: `${revealed ? 0.05 * index + 0.15 : 0}s`,
            };

            if (!item.children) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => isMobile && setMobileMenuOpen(false)}
                  style={itemStyle}
                >
                  {item.label}
                </Link>
              );
            }

            return (
              <div key={item.href}>
                <div style={{ display: "flex", alignItems: "stretch", gap: "2px" }}>
                  <Link
                    href={item.href}
                    onClick={() => isMobile && setMobileMenuOpen(false)}
                    style={{ ...itemStyle, flex: 1 }}
                  >
                    {item.label}
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleGroup(item.href)}
                    aria-expanded={expanded}
                    aria-label={expanded ? `Tutup submenu ${item.label}` : `Buka submenu ${item.label}`}
                    style={{
                      width: "34px",
                      border: "none",
                      borderRadius: "10px",
                      background: "transparent",
                      color: "rgba(255,255,255,0.6)",
                      cursor: "pointer",
                      fontSize: "11px",
                      opacity: revealed ? 1 : 0,
                      transition: "opacity 0.3s ease, transform 0.2s ease",
                      transform: expanded ? "rotate(0deg)" : "rotate(-90deg)",
                    }}
                  >
                    ▼
                  </button>
                </div>

                {expanded && revealed && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                      marginTop: "2px",
                      marginLeft: "18px",
                      paddingLeft: "10px",
                      borderLeft: "1px solid rgba(255,255,255,0.15)",
                    }}
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => isMobile && setMobileMenuOpen(false)}
                        style={{
                          padding: "9px 12px",
                          borderRadius: "8px",
                          fontSize: "13px",
                          fontWeight: 500,
                          color: "rgba(255,255,255,0.6)",
                          textDecoration: "none",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div style={{
          padding: "16px 12px",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          opacity: (isMobile ? mobileMenuOpen : sidebarOpen) ? 1 : 0,
          transform: (isMobile ? mobileMenuOpen : sidebarOpen) ? "translateX(0)" : "translateX(-20px)",
          transition: "opacity 0.3s ease 0.2s, transform 0.3s ease 0.2s",
        }}>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "12px 16px",
              background: "rgba(239,68,68,0.15)",
              color: "#fca5a5",
              border: "none",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              textAlign: "left",
              transition: "background 0.2s",
            }}
          >
            🚪 Keluar
          </button>
          <Link
            href="/"
            target="_blank"
            style={{
              display: "block",
              marginTop: "8px",
              padding: "12px 16px",
              background: "rgba(255,255,255,0.05)",
              color: "rgba(255,255,255,0.6)",
              borderRadius: "10px",
              fontSize: "13px",
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            🌐 Lihat Website
          </Link>
        </div>
      </aside>

      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        style={{
          position: "fixed",
          top: "20px",
          left: isMobile
            ? "12px"
            : (sidebarOpen ? "248px" : "48px"),
          zIndex: 51,
          width: "36px",
          height: "36px",
          borderRadius: "10px",
          background: isMobile
            ? (mobileMenuOpen ? "#ef4444" : "#085F80")
            : "#085F80",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontSize: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: isMobile
            ? "background 0.3s ease, transform 0.2s ease"
            : "left 0.3s ease",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        }}
      >
        {isMobile
          ? (mobileMenuOpen ? "✕" : "☰")
          : (sidebarOpen ? "◀" : "▶")
        }
      </button>

      {/* Main content */}
      <main
        style={{
          flex: 1,
          marginLeft: isMobile ? "0" : (sidebarOpen ? "260px" : "60px"),
          padding: isMobile ? "24px 16px" : "32px",
          paddingTop: isMobile ? "72px" : "32px",
          transition: "margin-left 0.3s ease",
          minHeight: "100vh",
        }}
      >
        {children}
      </main>
    </div>
  );
}
