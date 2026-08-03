"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useSiteContent } from "@/hooks/useContent";
import StaticMap from "@/components/StaticMap";
import { OUTLET_LOCATION } from "@/lib/location";

export default function KontakPage() {
  const { content } = useSiteContent();
  const settings = content?.settings;
  const waLink = settings?.waLink ?? "https://wa.me/6285181840082";
  const mapLink = settings?.mapLink || OUTLET_LOCATION.mapLink;

  return (
    <>
      <Navbar />

      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Beranda</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-current">Hubungi Kami</span>
          </div>
          <h1 className="page-hero-title">Hubungi Kami</h1>
          <p className="page-hero-desc">
            Punya pertanyaan atau ingin memesan layanan antar jemput? Tim kami
            siap melayani Anda kapan saja.
          </p>
        </div>
      </section>

      {/* Contact Layout */}
      <section style={{ backgroundColor: "var(--bg-white)" }}>
        <div className="container">
          <div className="contact-layout">
            {/* Info Panel */}
            <div className="contact-info-panel">
              <div>
                <h2 className="contact-page-title">Informasi Kontak</h2>
                <p className="contact-page-desc">
                  Silakan hubungi kami melalui salah satu saluran di bawah ini. Kami akan membalas pesan Anda sesegera mungkin.
                </p>
              </div>

              <div className="contact-methods">
                {/* WhatsApp */}
                <div className="contact-method-card">
                  <div className="contact-method-icon">💬</div>
                  <div>
                    <h3 className="contact-method-title">WhatsApp Resmi</h3>
                    <p className="contact-method-value">
                      {settings?.waNumber ?? "+62 851-8184-0082"}
                    </p>
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-method-link"
                    >
                      Kirim Pesan WhatsApp →
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="contact-method-card">
                  <div className="contact-method-icon">✉️</div>
                  <div>
                    <h3 className="contact-method-title">Surel (Email)</h3>
                    <p className="contact-method-value">
                      {settings?.email ?? "hello@centrallaundry.id"}
                    </p>
                    <a
                      href={`mailto:${settings?.email ?? "hello@centrallaundry.id"}`}
                      className="contact-method-link"
                    >
                      Kirim Email →
                    </a>
                  </div>
                </div>

                {/* Alamat */}
                <div className="contact-method-card">
                  <div className="contact-method-icon">📍</div>
                  <div>
                    <h3 className="contact-method-title">Alamat Outlet</h3>
                    <p className="contact-method-value">
                      {settings?.address ?? "Jl. Sudirman No. 45, Jakarta Pusat"}
                    </p>
                    <a
                      href={mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-method-link"
                    >
                      Buka di Google Maps →
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Panel */}
            <div className="contact-map-panel">
              <div className="contact-map-card">
                <h3 className="contact-map-title">Peta Lokasi</h3>
                <div className="contact-map-iframe-wrapper">
                  <StaticMap
                    lat={OUTLET_LOCATION.lat}
                    lng={OUTLET_LOCATION.lng}
                    href={mapLink}
                    label={OUTLET_LOCATION.name}
                  />
                </div>
                <a
                  href={mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-directions-btn"
                >
                  Petunjuk Arah
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Floating WA Button */}
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="Chat WhatsApp"
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.37 5.017L2 22l5.135-1.348a9.929 9.929 0 004.877 1.28h.004c5.505 0 9.989-4.478 9.99-9.986 0-2.67-1.037-5.178-2.924-7.065A9.923 9.923 0 0012.012 2zm5.735 14.127c-.247.697-1.206 1.272-1.662 1.372-.44.097-.98.156-3.03-.7-2.623-1.096-4.31-3.766-4.44-3.94-.13-.171-1.05-1.401-1.05-2.673 0-1.272.664-1.897.9-.214.237-.317.525-.397.7-.397.176 0 .348.003.5.033.16.03.356-.062.554.416.2.483.684 1.665.743 1.785.06.12.1.26.02.42-.08.16-.12.26-.24.4-.12.14-.25.31-.36.42-.12.12-.25.25-.1.51.15.26.66 1.09 1.41 1.76.97.865 1.79 1.134 2.05 1.264.26.13.41.11.56-.06.15-.17.65-.75.82-.99.17-.25.35-.21.58-.12.24.09 1.5.71 1.76.84.26.13.43.2.5.31.06.11.06.66-.19 1.357z" />
        </svg>
      </a>
    </>
  );
}
