"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface SidebarItem {
  /** Website section label (matches navbar) */
  label: string;
  /** Label shown in sidebar */
  display: string;
  /** SVG line icon */
  icon: React.ReactNode;
  /** Website page URL */
  href: string;
  /** Admin sub-pages to edit this section */
  children: { label: string; href: string }[];
}

const sidebarItems: SidebarItem[] = [
  {
    label: "Beranda",
    display: "Beranda",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    href: "/",
    children: [
      { label: "Hero Slider", href: "/admin" },
      { label: "Paket Layanan", href: "/admin/paket" },
    ],
  },
  {
    label: "Layanan",
    display: "Layanan",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
        <line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
    href: "/layanan",
    children: [
      { label: "Paket", href: "/admin/paket" },
      { label: "Kiloan", href: "/admin/kiloan" },
      { label: "Satuan Premium & Dry Clean", href: "/admin/layanan" },
    ],
  },
  {
    label: "Galeri",
    display: "Galeri",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
    ),
    href: "/galeri",
    children: [
      { label: "Foto & Video", href: "/admin/galeri" },
    ],
  },
  {
    label: "Tentang Kami",
    display: "Tentang Kami",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    href: "/tentang",
    children: [
      { label: "Fasilitas & Tim", href: "/admin/tentang" },
    ],
  },
  {
    label: "Kontak",
    display: "Kontak",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
    href: "/kontak",
    children: [
      { label: "Alamat & Lokasi", href: "/admin/kontak" },
      { label: "WhatsApp & Instagram", href: "/admin/settings" },
    ],
  },
  {
    label: "Pengaturan",
    display: "Pengaturan",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
    href: "#",
    children: [
      { label: "Keamanan & Password", href: "/admin/settings" },
    ],
  },
  {
    label: "Panduan",
    display: "Panduan",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
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
  const [openGroups, setOpenGroups] = useState<string[]>(() => {
    for (const item of sidebarItems) {
      if (item.children.some((c) => pathname === c.href)) return [item.label];
    }
    return ["Beranda"]; // Default open
  });

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
          <p style={{
            fontSize: "10px",
            fontWeight: 700,
            color: "rgba(255,255,255,0.35)",
            textTransform: "uppercase",
            letterSpacing: "1px",
            padding: "4px 16px 8px",
            opacity: (isMobile ? mobileMenuOpen : sidebarOpen) ? 1 : 0,
            transition: "opacity 0.3s ease 0.1s",
          }}>
            Edit Bagian Website
          </p>
          {sidebarItems.map((item, index) => {
            const expanded = openGroups.includes(item.label);
            const revealed = isMobile ? mobileMenuOpen : sidebarOpen;
            // Highlight group if we're on one of its child admin pages
            const isGroupActive = item.children.some((c) => pathname === c.href);
            const itemStyle = {
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: 600,
              color: isGroupActive ? "white" : "rgba(255,255,255,0.7)",
              background: isGroupActive ? "rgba(96,165,250,0.2)" : "transparent",
              textDecoration: "none",
              transition: "all 0.2s",
              whiteSpace: "nowrap" as const,
              opacity: revealed ? 1 : 0,
              transform: revealed ? "translateX(0)" : "translateX(-20px)",
              transitionDelay: `${revealed ? 0.05 * index + 0.15 : 0}s`,
              cursor: "pointer",
            };

            return (
              <div key={item.label}>
                {/* Menu item: click toggles dropdown */}
                <button
                  type="button"
                  onClick={() => toggleGroup(item.label)}
                  aria-expanded={expanded}
                  style={{
                    ...itemStyle,
                    width: "100%",
                    border: "none",
                    textAlign: "left",
                  }}
                >
                  {item.icon}
                  <span>{item.display}</span>
                </button>

                {/* Sub-menu: appears below the main menu item */}
                {expanded && revealed && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                      paddingTop: "4px",
                      paddingLeft: "28px",
                    }}
                  >
                    {item.children.map((child) => {
                      const isChildActive = pathname === child.href;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => isMobile && setMobileMenuOpen(false)}
                          style={{
                            padding: "10px 14px",
                            borderRadius: "8px",
                            fontSize: "13px",
                            fontWeight: isChildActive ? 700 : 500,
                            color: isChildActive ? "#60a5fa" : "rgba(255,255,255,0.6)",
                            background: isChildActive ? "rgba(96,165,250,0.15)" : "transparent",
                            textDecoration: "none",
                            whiteSpace: "nowrap",
                            transition: "background 0.15s ease",
                          }}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
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
          background: "#085F80",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontSize: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: isMobile
            ? "opacity 0.3s ease, left 0.3s ease"
            : "left 0.3s ease",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          opacity: (isMobile && mobileMenuOpen) ? 0 : 1,
          pointerEvents: (isMobile && mobileMenuOpen) ? "none" : "auto",
        }}
      >
        {isMobile
          ? "☰"
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
