"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useSiteContent } from "@/hooks/useContent";


const WA_LINK =
  "https://wa.me/6285181840082?text=Halo%20Central%20Laundry%20Express,%20saya%20ingin%20memesan%20layanan%20laundry.";

export default function LayananPage() {
  const { content } = useSiteContent();
  const kiloan = content?.kiloan ?? [];

  const renderIcon = (iconType: string) => {
    switch (iconType) {
      case "lightning":
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        );
      case "clock2":
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4l3 3" />
          </svg>
        );
      default:
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        );
    }
  };
  return (
    <>
      <Navbar />

      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Beranda</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-current">Layanan Kami</span>
          </div>
          <h1 className="page-hero-title">
            Kebersihan Maksimal,
            <br />
            Waktu Minimal.
          </h1>
          <p className="page-hero-desc">
            Solusi laundry profesional untuk gaya hidup modern Anda. Kami
            memberikan perawatan terbaik untuk setiap helai kain Anda.
          </p>
        </div>
      </section>

      {/* Laundry Kiloan */}
      <section className="kiloan-section">
        <div className="container">
          <div className="kiloan-header">
            <h2 className="kiloan-title">Laundry Kiloan</h2>
            <div className="kiloan-accent-line"></div>
            <p className="kiloan-desc">
              Sangat cocok untuk kebutuhan harian rumah tangga dan{" "}
              <span>profesional yang sibuk.</span>
            </p>
          </div>

          <div className="kiloan-cards">
            {kiloan.map((item) => (
              <div key={item.id} className={`kiloan-card ${item.isPopular ? "popular" : ""}`}>
                {item.isPopular && <span className="kiloan-popular-badge">POPULER</span>}
                <div className={`kiloan-card-icon ${item.isPopular ? "accent" : item.iconType === "clock2" ? "muted" : ""}`}>
                  {renderIcon(item.iconType)}
                </div>
                <div>
                  <h3 className="kiloan-card-title">{item.name}</h3>
                  <p className="kiloan-card-desc">{item.description}</p>
                </div>
                <ul className="kiloan-card-features">
                  {item.features.map((f, i) => (
                    <li key={i} className="kiloan-card-feature">
                      <span className="kiloan-check">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="kiloan-wa-btn">
                  Pesan via WA
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Laundry Satuan Premium */}
      <section className="satuan-section">
        <div className="container">
          <div className="satuan-header">
            <h2 className="satuan-title">Laundry Satuan Premium</h2>
            <p className="satuan-desc">
              Penanganan khusus untuk item kesayangan Anda dengan teknik cuci yang disesuaikan dengan jenis bahan.
            </p>
          </div>

          {/* Big Image Cards */}
          <div className="satuan-big-grid">
            {/* Card 1 — Jas, Kemeja, Gaun */}
            <div className="satuan-image-card" style={{ gridColumn: "1" }}>
              <Image src="/hero_laundry.png" alt="Jas, Kemeja & Gaun" fill sizes="33vw" style={{ objectFit: "cover" }} />
              <div className="satuan-image-overlay"></div>
              <div className="satuan-image-info">
                <span className="satuan-image-badge">Pakaian Premium</span>
                <p className="satuan-image-name">Jas, Kemeja & Gaun</p>
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="satuan-image-btn">
                  Lihat Detail →
                </a>
              </div>
            </div>

            {/* Card 2 — Perlengkapan Tidur */}
            <div className="satuan-image-card">
              <Image src="/hero_laundry.png" alt="Perlengkapan Tidur" fill sizes="33vw" style={{ objectFit: "cover" }} />
              <div className="satuan-image-overlay"></div>
              <div className="satuan-image-info">
                <p className="satuan-image-name">Perlengkapan Tidur</p>
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="satuan-image-btn">
                  Pesan →
                </a>
              </div>
            </div>

            {/* Card 3 — Home Decor */}
            <div className="satuan-image-card">
              <Image src="/hero_laundry.png" alt="Home Decor" fill sizes="33vw" style={{ objectFit: "cover" }} />
              <div className="satuan-image-overlay"></div>
              <div className="satuan-image-info">
                <p className="satuan-image-name">Home Decor</p>
                <p className="satuan-image-price" style={{ marginBottom: 4 }}>Gorden, Karpet & Taplak</p>
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="satuan-image-btn">
                  Pesan →
                </a>
              </div>
            </div>
          </div>

          {/* Small Info Cards */}
          <div className="satuan-small-grid">
            {/* Sepatu & Tas */}
            <div className="satuan-info-card">
              <div className="satuan-info-icon">🥿</div>
              <div>
                <h4 className="satuan-info-title">Sepatu & Tas</h4>
                <p className="satuan-info-desc">
                  Deep cleaning untuk menjaga material kulit, suede, dan kanvas tetap awet.
                </p>
              </div>
            </div>

            {/* Baby Gears */}
            <div className="satuan-info-card">
              <div className="satuan-info-icon">🍼</div>
              <div>
                <h4 className="satuan-info-title">Baby Gears</h4>
                <p className="satuan-info-desc">
                  Pembersihan stroller dan carseat dengan deterjen khusus yang aman untuk bayi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dry Clean Professional */}
      <section className="dryclean-section">
        <div className="container">
          <div className="dryclean-card">
            <div className="dryclean-content">
              <div>
                <span className="dryclean-badge">
                  ✦ PREMIUM SERVICE
                </span>
                <h2 className="dryclean-title">Dry Clean Professional</h2>
                <p className="dryclean-desc">
                  Untuk bahan sensitif seperti wol, sutra, cashmere, dan busana berpoyet tinggi. Kami menggunakan proses pembersihan tanpa air untuk menjaga integritas serat kain Anda.
                </p>
              </div>
              <ul className="dryclean-features">
                <li className="dryclean-feature">
                  <span className="dryclean-star">★</span>Quality Control 3 lapis
                </li>
                <li className="dryclean-feature">
                  <span className="dryclean-star">★</span>Solvent ramah lingkungan
                </li>
                <li className="dryclean-feature">
                  <span className="dryclean-star">★</span>Packaging eksklusif
                </li>
              </ul>
              <div className="dryclean-actions">
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="dryclean-btn-primary">
                  Konsultasi Bahan
                </a>
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="dryclean-btn-outline">
                  Info Lengkap
                </a>
              </div>
            </div>

            <div className="dryclean-image-wrapper">
              <Image
                src="/hero_laundry.png"
                alt="Dry Clean Professional"
                fill
                sizes="50vw"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Layanan Antar Jemput */}
      <section className="pickup-section">
        <div className="container">
          <div className="pickup-header">
            <h2 className="pickup-title">Layanan Antar Jemput</h2>
            <p className="pickup-desc">
              Malas keluar rumah? Tim kami siap menjemput cucian kotor Anda dan mengantarkannya kembali dalam keadaan bersih sempurna.
            </p>
          </div>

          <div className="pickup-cards">
            {/* Card 1 */}
            <div className="pickup-card">
              <div className="pickup-card-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <h3 className="pickup-card-title">Area Jangkauan</h3>
              <p className="pickup-card-desc">
                Melayani area pusat kota dan sekitarnya (Radius 10km).
              </p>
            </div>

            {/* Card 2 */}
            <div className="pickup-card">
              <div className="pickup-card-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13" rx="2" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </div>
              <h3 className="pickup-card-title">Free Ongkir</h3>
              <p className="pickup-card-desc">
                Gratis biaya antar jemput untuk laundry di atas 5kg atau transaksi minimal Rp 100rb.
              </p>
            </div>

            {/* Card 3 */}
            <div className="pickup-card">
              <div className="pickup-card-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h3 className="pickup-card-title">Jadwal Fleksibel</h3>
              <p className="pickup-card-desc">
                Pilih jam jemput pagi, siang, atau sore sesuai kenyamanan Anda.
              </p>
            </div>
          </div>

          {/* Social Proof CTA Bar */}
          <div className="pickup-cta-row">
            <div className="pickup-social-proof">
              <div className="pickup-avatars">
                <div className="pickup-avatar">BP</div>
                <div className="pickup-avatar">SL</div>
                <div className="pickup-avatar">RN</div>
                <div className="pickup-avatar pickup-avatar-orange">+</div>
              </div>
              <div className="pickup-proof-text">
                <span className="pickup-proof-strong">500+ Pelanggan Puas</span>
                <span className="pickup-proof-sub">Bergabunglah dengan pelanggan tetap kami sekarang.</span>
              </div>
            </div>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="pickup-jemput-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.37 5.017L2 22l5.135-1.348a9.929 9.929 0 004.877 1.28h.004c5.505 0 9.989-4.478 9.99-9.986 0-2.67-1.037-5.178-2.924-7.065A9.923 9.923 0 0012.012 2zm5.735 14.127c-.247.697-1.206 1.272-1.662 1.372-.44.097-.98.156-3.03-.7-2.623-1.096-4.31-3.766-4.44-3.94-.13-.171-1.05-1.401-1.05-2.673 0-1.272.664-1.897.9-.214.237-.317.525-.397.7-.397.176 0 .348.003.5.033.16.03.356-.062.554.416.2.483.684 1.665.743 1.785.06.12.1.26.02.42-.08.16-.12.26-.24.4-.12.14-.25.31-.36.42-.12.12-.25.25-.1.51.15.26.66 1.09 1.41 1.76.97.865 1.79 1.134 2.05 1.264.26.13.41.11.56-.06.15-.17.65-.75.82-.99.17-.25.35-.21.58-.12.24.09 1.5.71 1.76.84.26.13.43.2.5.31.06.11.06.66-.19 1.357z" />
              </svg>
              Jemput Sekarang
            </a>
          </div>
        </div>
      </section>


      {/* Floating WA Button */}
      <a
        href={WA_LINK}
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
