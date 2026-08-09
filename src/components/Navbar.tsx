"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSiteContent } from "@/hooks/useContent";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { content } = useSiteContent();

  const brandName = content?.dashboard?.brandName ?? "Central Laundry Express";
  const navItems = content?.dashboard?.navItems ?? [
    { label: "Beranda", href: "/" },
    { label: "Layanan", href: "/layanan" },
    { label: "Tentang Kami", href: "/tentang" },
    { label: "Galeri", href: "/galeri" },
    { label: "Kontak", href: "/kontak" },
  ];

  return (
    <header className="header">
      <div className="container nav-container">
        <Link href="/" className="logo">
          {brandName}
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-menu">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${pathname === item.href ? "active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            backgroundColor: "white",
            zIndex: 99,
            display: "flex",
            flexDirection: "column",
            padding: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "40px",
            }}
          >
            <span className="logo">{brandName}</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: "32px",
                color: "var(--text-dark)",
                lineHeight: 1,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              &times;
            </button>
          </div>
          <nav
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              fontSize: "20px",
              fontWeight: 600,
            }}
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  color:
                    pathname === item.href
                      ? "var(--primary)"
                      : "var(--text-dark)",
                  textDecoration: "none",
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
