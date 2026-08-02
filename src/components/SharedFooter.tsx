"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSiteContent } from "@/hooks/useContent";

export default function SharedFooter() {
  const pathname = usePathname();
  const { content } = useSiteContent();

  const footer = content?.footer ?? {
    brandName: "Central Laundry Express",
    description: "Memuat...",
    menuItems: [],
    copyright: "\u00a9 2024 Central Laundry Express",
  };

  const settings = content?.settings ?? {
    waLink: "#",
    instagramUrl: "#",
    operationalHours: { weekdays: "Memuat...", weekend: "Memuat..." },
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              {footer.brandName}
            </Link>
            <p className="footer-desc">{footer.description}</p>
            <div className="social-links">
              <a
                href={settings.waLink}
                className="social-link"
                aria-label="WhatsApp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.37 5.017L2 22l5.135-1.348a9.929 9.929 0 004.877 1.28h.004c5.505 0 9.989-4.478 9.99-9.986 0-2.67-1.037-5.178-2.924-7.065A9.923 9.923 0 0012.012 2zm5.735 14.127c-.247.697-1.206 1.272-1.662 1.372-.44.097-.98.156-3.03-.7-2.623-1.096-4.31-3.766-4.44-3.94-.13-.171-1.05-1.401-1.05-2.673 0-1.272.664-1.897.9-.214.237-.317.525-.397.7-.397.176 0 .348.003.5.033.16.03.356-.062.554.416.2.483.684 1.665.743 1.785.06.12.1.26.02.42-.08.16-.12.26-.24.4-.12.14-.25.31-.36.42-.12.12-.25.25-.1.51.15.26.66 1.09 1.41 1.76.97.865 1.79 1.134 2.05 1.264.26.13.41.11.56-.06.15-.17.65-.75.82-.99.17-.25.35-.21.58-.12.24.09 1.5.71 1.76.84.26.13.43.2.5.31.06.11.06.66-.19 1.357z" />
                </svg>
              </a>
              <a
                href={settings.instagramUrl}
                className="social-link"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-links-col">
            <span className="footer-links-title">Menu Utama</span>
            <ul className="footer-links">
              {footer.menuItems.map((item) => (
                <li className="footer-link" key={item.href}>
                  <Link
                    href={item.href}
                    style={{
                      color: pathname === item.href ? "var(--accent)" : undefined,
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-links-col">
            <span className="footer-links-title">Jam Operasional</span>
            <ul className="footer-links">
              <li style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>
                {settings.operationalHours.weekdays}
              </li>
              <li style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>
                {settings.operationalHours.weekend}
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="copyright">{footer.copyright}</span>
          <button
            onClick={scrollToTop}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "none",
              cursor: "pointer",
              color: "rgba(255,255,255,0.7)",
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "13px",
              transition: "background 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
          >
            ↑ Kembali ke Atas
          </button>
        </div>
      </div>
    </footer>
  );
}
