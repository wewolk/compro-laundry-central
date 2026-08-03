"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import HeroSlider from "@/components/HeroSlider";
import GalleryMedia from "@/components/GalleryMedia";
import StaticMap from "@/components/StaticMap";
import { OUTLET_LOCATION } from "@/lib/location";
import { useSiteContent } from "@/hooks/useContent";

const FALLBACK_HERO = "/hero_laundry.png";
const MAX_HERO_SLIDES = 5;
const MAX_GALLERY_PREVIEW = 4;
const VIDEO_EXTENSIONS = /\.(mp4|webm|mov|m4v)(\?.*)?$/i;


export default function Home() {
  const [activeTab, setActiveTab] = useState<"foto" | "video">("foto");
  const { content } = useSiteContent();
  const paket = content?.paket ?? [];
  const settings = content?.settings;
  const waNumber = settings?.waNumber ?? "0851-8184-0082";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LaundryService",
    name: "Central Laundry Express",
    description:
      "Laundry express Purbalingga dengan layanan antar jemput, cuci kiloan, cuci setrika, dan perawatan pakaian higienis.",
    telephone: waNumber,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Purbalingga",
      addressRegion: "Jawa Tengah",
      addressCountry: "ID",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: OUTLET_LOCATION.lat,
      longitude: OUTLET_LOCATION.lng,
    },
    areaServed: ["Klampok", "Kalimanah", "Purbalingga", "Bobotsari", "Kutasari", "Karangmoncol", "Kaligondang", "Mrebet", "Bukateja", "Padamara", "Kertanegara", "Kemangkon", "Karanganyar", "Kalibagor", "Bojongsari", "Karangjambu"],
    serviceType: ["Laundry kiloan", "Cuci setrika", "Antar jemput laundry", "Laundry express"],
    openingHours: ["Mo-Sa 07:00-20:00", "Su 09:00-17:00"],
    hasMap: settings?.mapLink || OUTLET_LOCATION.mapLink,
    url: "/",
  };


  const heroImages = Array.from(
    new Set(
      (content?.gallery ?? [])
        .filter((item) => item.type === "image" && item.src)
        .map((item) => item.src)
    )
  ).slice(0, MAX_HERO_SLIDES);
  const slides = heroImages.length > 0 ? heroImages : [FALLBACK_HERO];

  // Beranda shows a 4-item teaser of the gallery, split by the active tab
  const wantedType = activeTab === "video" ? "video" : "image";
  const visibleMedia = (content?.gallery ?? [])
    .map((item) => ({
      ...item,
      // A row flagged as video but holding a placeholder image is really a photo
      type: item.type === "video" && !VIDEO_EXTENSIONS.test(item.src) ? "image" : item.type,
    }))
    .filter((item) => item.type === wantedType && item.src)
    .slice(0, MAX_GALLERY_PREVIEW);

  return (
    <>
      <Navbar />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero Section */}
      <section id="beranda" className="hero">
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="hero-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-8h-2v6h2V8z"/>
              </svg>
              Express 1 Hari Sampai!
            </div>
            <h1 className="hero-title">
              Central Laundry Express - Cucian Bersih, <span className="accent">Hidup Lebih Praktis!</span>
            </h1>
            <p className="hero-desc">
              Nikmati layanan laundry profesional dengan standar higienis tinggi. Kami menjemput pakaian kotor Anda dan mengembalikannya dalam keadaan bersih, harum, dan rapi.
            </p>
            <div className="hero-actions">
              <a
                href="https://wa.me/6285181840082?text=Halo%20Central%20Laundry%20Express,%20saya%20ingin%20memesan%20layanan%20laundry."
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                {/* WhatsApp Icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.37 5.017L2 22l5.135-1.348a9.929 9.929 0 004.877 1.28h.004c5.505 0 9.989-4.478 9.99-9.986 0-2.67-1.037-5.178-2.924-7.065A9.923 9.923 0 0012.012 2zm5.735 14.127c-.247.697-1.206 1.272-1.662 1.372-.44.097-.98.156-3.03-.7-2.623-1.096-4.31-3.766-4.44-3.94-.13-.171-1.05-1.401-1.05-2.673 0-1.272.664-1.897.9-.214.237-.317.525-.397.7-.397.176 0 .348.003.5.033.16.03.356-.062.554.416.2.483.684 1.665.743 1.785.06.12.1.26.02.42-.08.16-.12.26-.24.4-.12.14-.25.31-.36.42-.12.12-.25.25-.1.51.15.26.66 1.09 1.41 1.76.97.865 1.79 1.134 2.05 1.264.26.13.41.11.56-.06.15-.17.65-.75.82-.99.17-.25.35-.21.58-.12.24.09 1.5.71 1.76.84.26.13.43.2.5.31.06.11.06.66-.19 1.357z"/>
                </svg>
                WhatsApp Sekarang
              </a>
              <a
                href="tel:+6285181840082"
                className="btn btn-outline"
              >
                {/* Phone Icon */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                Hubungi Kami
              </a>
            </div>
          </div>
          <div className="hero-image-container">
            <div className="hero-image-wrapper">
              <HeroSlider images={slides} alt="Staf Central Laundry Express" />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us / Features Section */}
      <section id="layanan" className="features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Mengapa Memilih Kami?</h2>
            <div className="section-line"></div>
          </div>
          
          <div className="features-grid">
            {/* Feature 1 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper feature-icon-1">
                {/* Truck Icon */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13" rx="2" ry="2" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </div>
              <h3 className="feature-title">Antar-Jemput</h3>
              <p className="feature-desc">
                Hemat waktu dan tenaga. Kurir kami siap jemput dan antar laundry Anda sampai depan pintu.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper feature-icon-2">
                {/* Lightning Bolt */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <h3 className="feature-title">Ekspres 1 Hari</h3>
              <p className="feature-desc">
                Butuh cepat? Layanan kilat kami memastikan pakaian Anda siap dalam hitungan jam.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper feature-icon-3">
                {/* Shield / Sanitizer */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 className="feature-title">Higienis</h3>
              <p className="feature-desc">
                Menggunakan deterjen ramah lingkungan dan proses pencucian anti-bakteri standar medis.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper feature-icon-4">
                {/* Scale / Cash / Receipt */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <h3 className="feature-title">Harga Transparan</h3>
              <p className="feature-desc">
                Tanpa biaya tersembunyi. Timbang di depan mata dengan nota digital yang akurat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* List Paket Section */}
      <section id="tentang" className="pricing">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Pilihan Paket Kami</h2>
            <p className="pricing-subtitle">Pilih paket laundry yang sesuai dengan kebutuhan Anda.</p>
            <div className="section-line"></div>
          </div>

          <h3 className="pricing-category-title">Layanan Kiloan (Cuci Lipat / Cuci Setrika)</h3>
          
          <div className="pricing-grid">
            {paket.map((item) => (
              <div key={item.id} className={`pricing-card ${item.isPopular ? "popular" : ""}`}>
                {item.isPopular && <span className="popular-badge">TERPOPULER</span>}
                <h4 className="pricing-name">{item.name}</h4>
                <ul className="pricing-features">
                  {item.features.map((f, i) => (
                    <li key={i} className="pricing-feature-item">
                      <span className="pricing-feature-icon">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* List Layanan Satuan */}
          <div className="pricing-table-container">
            <table className="pricing-table">
              <thead>
                <tr>
                  <th>Jenis Layanan</th>
                  <th>Keterangan</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="item-name">Pakaian (Kemeja/Kaos)</td>
                  <td>Cuci & Setrika</td>
                </tr>
                <tr>
                  <td className="item-name">Bedding (Sprei Set)</td>
                  <td>Higienis UV</td>
                </tr>
                <tr>
                  <td className="item-name">Sepatu (Sneakers/Leather)</td>
                  <td>Deep Cleaning</td>
                </tr>
                <tr>
                  <td className="item-name">Tas / Backpack</td>
                  <td>Treatment Khusus</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="galeri" className="gallery">
        <div className="container">
          <div className="section-header">
            <div className="gallery-title-wrapper">
              <h2 className="section-title">Galeri Hasil Kerja</h2>
              <p className="gallery-subtitle">
                Lihat bagaimana kami merawat pakaian dan barang berharga Anda dengan sepenuh hati.
              </p>
            </div>
            <div className="gallery-tabs">
              <button
                className={`gallery-tab ${activeTab === "foto" ? "active" : ""}`}
                onClick={() => setActiveTab("foto")}
              >
                Foto
              </button>
              <button
                className={`gallery-tab ${activeTab === "video" ? "active" : ""}`}
                onClick={() => setActiveTab("video")}
              >
                Video
              </button>
            </div>
          </div>

          {visibleMedia.length > 0 ? (
            <div className="gallery-grid">
              {[0, 1, 2].map((colIndex) => {
                const column = visibleMedia.filter((_, i) => i % 3 === colIndex);
                if (column.length === 0) return null;
                // Middle column runs as one tall item to keep the mosaic rhythm
                const height = colIndex === 1 && column.length === 1 ? "484px" : "230px";
                return (
                  <div key={colIndex} className="gallery-column">
                    {column.map((item) => (
                      <div key={item.id} className="gallery-item" style={{ height }}>
                        <GalleryMedia
                          src={item.src}
                          alt={item.alt}
                          type={item.type}
                          poster={item.poster}
                        />
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "350px",
                border: "2px dashed rgba(255,255,255,0.2)",
                borderRadius: "16px",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginBottom: "16px", opacity: 0.7 }}>
                  <polygon points="23 7 16 12 23 17 23 7"/>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                </svg>
                <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.8)" }}>
                  {activeTab === "video"
                    ? "Video Dokumentasi Layanan Segera Hadir"
                    : "Foto Dokumentasi Segera Hadir"}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Cara Order Section */}
      <section id="cara-order" className="steps">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Cara Order Mudah</h2>
            <p className="pricing-subtitle">Hanya 4 langkah simpel untuk pakaian bersih kembali.</p>
            <div className="section-line"></div>
          </div>

          <div className="steps-grid-wrapper">
            <div className="steps-line"></div>
            <div className="steps-grid">
              {/* Step 1 */}
              <div className="step-card">
                <div className="step-number">1</div>
                <h3 className="step-title">Pesan via WA</h3>
                <p className="step-desc">Hubungi kami melalui WhatsApp untuk info jadwal jemput.</p>
              </div>
              {/* Step 2 */}
              <div className="step-card">
                <div className="step-number">2</div>
                <h3 className="step-title">Kami Jemput</h3>
                <p className="step-desc">Kurir datang ke lokasi Anda, timbang, dan beri nota digital.</p>
              </div>
              {/* Step 3 */}
              <div className="step-card">
                <div className="step-number">3</div>
                <h3 className="step-title">Proses Cuci</h3>
                <p className="step-desc">Laundry diproses dengan standar kebersihan tinggi dan parfum premium.</p>
              </div>
              {/* Step 4 */}
              <div className="step-card">
                <div className="step-number">4</div>
                <h3 className="step-title">Antar & Selesai</h3>
                <p className="step-desc">Cucian bersih diantar kembali ke pintu rumah Anda!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Kata Pelanggan Setia</h2>
            <div className="section-line"></div>
          </div>

          <div className="testimonials-grid">
            {/* Card 1 */}
            <div className="testimonial-card">
              <div>
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                  ))}
                </div>
                <p className="testimonial-text">
                  &ldquo;Layanan ekspresnya juara! Baju kantor ketinggalan dicuci, pagi ditaruh sore sudah rapi dan wangi banget.&rdquo;
                </p>
              </div>
              <div className="testimonial-user">
                <div className="user-avatar">BP</div>
                <div>
                  <h4 className="user-name">Budi Pratama</h4>
                  <p className="user-role">Karyawan Swasta</p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="testimonial-card">
              <div>
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                  ))}
                </div>
                <p className="testimonial-text">
                  &ldquo;Nge-laundry di sini hemat waktu banget buat jadwal kuliah yang padat. Diambil pagi, sore sudah bisa dipakai lagi.&rdquo;
                </p>
              </div>
              <div className="testimonial-user">
                <div className="user-avatar">
                  <Image
                    src="/testimoni_firman.jpg"
                    alt="Firman Maulana"
                    width={48}
                    height={48}
                  />
                </div>
                <div>
                  <h4 className="user-name">Firman Maulana</h4>
                  <p className="user-role">Mahasiswa</p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="testimonial-card">
              <div>
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                  ))}
                </div>
                <p className="testimonial-text">
                  &ldquo;Sebagai anak kuliahan, laundry kiloan di sini penyelamat banget. Harganya ramah kantong mahasiswa, cucian selalu wangi dan rapi tiap diambil.&rdquo;
                </p>
              </div>
              <div className="testimonial-user">
                <div className="user-avatar">
                  <Image
                    src="/testimoni_naufal.jpg"
                    alt="Naufal Maulana Izzuddin"
                    width={48}
                    height={48}
                  />
                </div>
                <div>
                  <h4 className="user-name">Naufal Maulana Izzuddin</h4>
                  <p className="user-role">Mahasiswa</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location & Contact Section */}
      <section id="kontak" className="contact-location">
        <div className="container">
          <div className="contact-grid">
            <div>
              <h2 className="section-title" style={{ textAlign: "left" }}>Lokasi & Kontak</h2>
              
              <div className="contact-info-list">
                <div className="contact-info-item">
                  <div className="contact-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div className="contact-details">
                    <span className="contact-label">Alamat Outlet</span>
                    <span className="contact-value">Jl. Utama No. 123, Central Business District, Jakarta Selatan</span>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div className="contact-details">
                    <span className="contact-label">Jam Operasional</span>
                    <span className="contact-value">Setiap Hari: 07:00 - 21:00 WIB</span>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div className="contact-details">
                    <span className="contact-label">Telepon / WhatsApp</span>
                    <span className="contact-value">0851-8184-0082</span>
                  </div>
                </div>
              </div>

              <a
                href="https://maps.google.com/?q=Central+Business+District+Jakarta+Selatan"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ padding: "12px 24px" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                  <line x1="9" y1="3" x2="9" y2="18" />
                  <line x1="15" y1="6" x2="15" y2="21" />
                </svg>
                Petunjuk Arah
              </a>
            </div>

            <div>
              <StaticMap
                lat={OUTLET_LOCATION.lat}
                lng={OUTLET_LOCATION.lng}
                href={settings?.mapLink || OUTLET_LOCATION.mapLink}
                label={OUTLET_LOCATION.name}
                className="map-placeholder"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner Section */}
      <section className="cta-banner">
        <div className="container">
          <h2 className="cta-title">Siap Memberikan Kesegaran untuk Pakaian Anda?</h2>
          <p className="cta-desc">
            Klik tombol di bawah untuk memesan via WhatsApp. Layanan profesional kami hanya sejarak jempol!
          </p>
          <div className="cta-actions">
            <a
              href="https://wa.me/6285181840082?text=Halo%20Central%20Laundry%20Express,%20saya%20ingin%20memesan%20layanan%20laundry."
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.37 5.017L2 22l5.135-1.348a9.929 9.929 0 004.877 1.28h.004c5.505 0 9.989-4.478 9.99-9.986 0-2.67-1.037-5.178-2.924-7.065A9.923 9.923 0 0012.012 2zm5.735 14.127c-.247.697-1.206 1.272-1.662 1.372-.44.097-.98.156-3.03-.7-2.623-1.096-4.31-3.766-4.44-3.94-.13-.171-1.05-1.401-1.05-2.673 0-1.272.664-1.897.9-.214.237-.317.525-.397.7-.397.176 0 .348.003.5.033.16.03.356-.062.554.416.2.483.684 1.665.743 1.785.06.12.1.26.02.42-.08.16-.12.26-.24.4-.12.14-.25.31-.36.42-.12.12-.25.25-.1.51.15.26.66 1.09 1.41 1.76.97.865 1.79 1.134 2.05 1.264.26.13.41.11.56-.06.15-.17.65-.75.82-.99.17-.25.35-.21.58-.12.24.09 1.5.71 1.76.84.26.13.43.2.5.31.06.11.06.66-.19 1.357z"/>
              </svg>
              Pesan via WhatsApp
            </a>
            <span style={{ fontSize: "16px", color: "white", opacity: 0.8 }}>Atau Hubungi:</span>
            <a href="tel:+6285181840082" className="cta-phone-link">
              0851-8184-0082
            </a>
          </div>
        </div>
      </section>

      {/* Local SEO Content */}
      <section style={{ backgroundColor: "var(--bg-white)" }}>
        <div className="container" style={{ padding: "32px 0 12px" }}>
          <div className="section-header" style={{ marginBottom: "18px" }}>
            <h2 className="section-title">Laundry Purbalingga yang Cepat, Bersih, dan Praktis</h2>
            <div className="section-line"></div>
          </div>
          <div style={{ maxWidth: "900px", color: "var(--text-muted)", lineHeight: 1.8, fontSize: "16px" }}>
            <p style={{ marginBottom: "14px" }}>
              Central Laundry Express hadir sebagai pilihan jasa laundry Purbalingga untuk Anda yang ingin hasil bersih tanpa repot. Kami melayani laundry kiloan, cuci setrika, dan perawatan pakaian dengan proses yang higienis, rapi, dan cepat selesai.
            </p>
            <p style={{ marginBottom: "14px" }}>
              Cocok untuk warga rumah tangga, anak kos, pekerja sibuk, hingga kebutuhan usaha yang membutuhkan layanan antar jemput laundry Purbalingga. Pakaian Anda ditangani dengan standar yang nyaman dipakai sehari-hari, harum, dan tetap terawat.
            </p>
            <p>
              Jika Anda mencari laundry Purbalingga yang responsif, mudah dihubungi, dan siap membantu kebutuhan cuci harian maupun item khusus, silakan pesan lewat WhatsApp atau lihat halaman layanan kami untuk informasi paket lengkap.
            </p>
          </div>
        </div>
      </section>


      {/* Floating WhatsApp Widget */}
      <a
        href="https://wa.me/6285181840082?text=Halo%20Central%20Laundry%20Express,%20saya%20ingin%20memesan%20layanan%20laundry."
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="Chat WhatsApp"
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.37 5.017L2 22l5.135-1.348a9.929 9.929 0 004.877 1.28h.004c5.505 0 9.989-4.478 9.99-9.986 0-2.67-1.037-5.178-2.924-7.065A9.923 9.923 0 0012.012 2zm5.735 14.127c-.247.697-1.206 1.272-1.662 1.372-.44.097-.98.156-3.03-.7-2.623-1.096-4.31-3.766-4.44-3.94-.13-.171-1.05-1.401-1.05-2.673 0-1.272.664-1.897.9-.214.237-.317.525-.397.7-.397.176 0 .348.003.5.033.16.03.356-.062.554.416.2.483.684 1.665.743 1.785.06.12.1.26.02.42-.08.16-.12.26-.24.4-.12.14-.25.31-.36.42-.12.12-.25.25-.1.51.15.26.66 1.09 1.41 1.76.97.865 1.79 1.134 2.05 1.264.26.13.41.11.56-.06.15-.17.65-.75.82-.99.17-.25.35-.21.58-.12.24.09 1.5.71 1.76.84.26.13.43.2.5.31.06.11.06.66-.19 1.357z"/>
        </svg>
      </a>
    </>
  );
}

