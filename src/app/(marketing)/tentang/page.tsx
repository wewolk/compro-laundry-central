import Image from "next/image";
import Navbar from "@/components/Navbar";

const WA_LINK =
  "https://wa.me/6285181840082?text=Halo%20Central%20Laundry%20Express,%20saya%20ingin%20bertanya.";

export default function TentangKamiPage() {
  return (
    <>
      <Navbar />

      {/* About Hero */}
      <section style={{ backgroundColor: "var(--bg-light)" }}>
        <div className="container">
          <div className="about-hero">
            <div className="about-hero-content">
              <span className="about-hero-badge">Cerita Kami</span>
              <h1 className="about-hero-title">
                Inovasi Kebersihan
                <br />
                untuk Gaya Hidup
                <br />
                Modern
              </h1>
              <p className="about-hero-desc">
                Kami bukan sekadar jasa laundry. Kami adalah mitra kenyamanan
                Anda dalam menjaga kebersihan pakaian dengan standar profesional
                yang tak tertandingi.
              </p>
            </div>

            <div className="about-hero-image-wrapper">
              <Image
                src="/hero_laundry.png"
                alt="Central Laundry Express Store"
                fill
                sizes="50vw"
                style={{ objectFit: "cover" }}
                priority
              />
              <div className="about-hero-exp-badge">
                <span className="about-exp-number">10+</span>
                <span className="about-exp-text">
                  Tahun
                  <br />
                  Pengalaman
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Story + Stats */}
      <section className="about-story-section">
        <div className="container">
          <div className="about-story-header">
            <h2 className="about-story-title">
              Tentang Central Laundry Express
            </h2>
            <p className="about-story-text">
              Didirikan di jantung kota yang sibuk, Central Laundry Express
              lahir dari keinginan untuk mendefinisikan ulang pengalaman
              laundry. Kami memahami bahwa waktu adalah aset paling berharga
              bagi kaum profesional urban. Sejak awal, komitmen kami adalah
              menghadirkan layanan yang tidak hanya &quot;bersih&quot;, tetapi
              juga memberikan rasa tenang melalui proses yang transparan,
              teknologi terkini, dan kepedulian terhadap detail terkecil setiap
              helai benang.
            </p>
          </div>

          <div className="about-stats-row">
            <div className="about-stat-card">
              <div className="about-stat-number">15k+</div>
              <div className="about-stat-label">Pelanggan Puas</div>
            </div>
            <div className="about-stat-card">
              <div className="about-stat-number">500+</div>
              <div className="about-stat-label">Ton Cucian/Bulan</div>
            </div>
            <div className="about-stat-card">
              <div className="about-stat-number">24/7</div>
              <div className="about-stat-label">Dukungan Layanan</div>
            </div>
            <div className="about-stat-card">
              <div className="about-stat-number">99%</div>
              <div className="about-stat-label">Akurasi Pengantaran</div>
            </div>
          </div>
        </div>
      </section>

      {/* Visi & Misi */}
      <section className="visi-misi-section">
        <div className="container">
          <div className="visi-misi-grid">
            <div className="visi-card">
              <h3 className="visi-card-title">Visi Kami</h3>
              <p className="visi-card-text">
                Menjadi standar emas layanan laundry di Indonesia yang
                mengintegrasikan teknologi modern dengan pelayanan humanis,
                menciptakan kehidupan yang lebih bersih dan efisien bagi setiap
                keluarga.
              </p>
            </div>

            <div className="misi-card">
              <h3 className="misi-card-title">Misi Kami</h3>
              <ul className="misi-list">
                <li className="misi-item">
                  <span className="misi-bullet">✓</span>
                  <span>
                    Memberikan kualitas pencucian premium dengan teknologi ramah
                    lingkungan.
                  </span>
                </li>
                <li className="misi-item">
                  <span className="misi-bullet">✓</span>
                  <span>
                    Menjamin ketepatan waktu melalui sistem logistik
                    terintegrasi.
                  </span>
                </li>
                <li className="misi-item">
                  <span className="misi-bullet">✓</span>
                  <span>
                    Terus berinovasi dalam kemudahan transaksi dan transparansi
                    proses.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Nilai-Nilai Utama */}
      <section className="values-section">
        <div className="container">
          <div className="values-header">
            <h2 className="values-title">Nilai-Nilai Utama Kami</h2>
            <p className="values-subtitle">
              Pilar yang membangun kepercayaan Anda setiap hari.
            </p>
          </div>

          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h4 className="value-name">Higienis</h4>
              <p className="value-desc">
                Setiap helai pakaian diproses dengan air bersih dan sterilisasi
                tingkat tinggi.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h4 className="value-name">Tepat Waktu</h4>
              <p className="value-desc">
                Sistem manajemen waktu &quot;Express&quot; yang memastikan Anda
                selalu tepat pada waktunya.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <h4 className="value-name">Transparan</h4>
              <p className="value-desc">
                Lacak status cucian Anda secara real-time melalui aplikasi atau
                WhatsApp.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <h4 className="value-name">Ramah</h4>
              <p className="value-desc">
                Tim CS kami siap melayani dengan senyuman dan solusi terbaik
                untuk Anda.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Perjalanan Kami - Timeline */}
      <section className="timeline-section">
        <div className="container">
          <div className="timeline-header">
            <h2 className="timeline-title">Perjalanan Kami</h2>
          </div>

          <div className="timeline-container">
            {/* 2014 - Left */}
            <div className="timeline-item left">
              <div className="timeline-dot"></div>
              <div className="timeline-card">
                <div className="timeline-year">2014</div>
                <div className="timeline-milestone">Awal Mula</div>
                <p className="timeline-desc">
                  Membuka outlet pertama di pusat kota dengan konsep laundry
                  mandiri higienis.
                </p>
              </div>
            </div>

            {/* 2018 - Right */}
            <div className="timeline-item right">
              <div className="timeline-dot"></div>
              <div className="timeline-card">
                <div className="timeline-year">2018</div>
                <div className="timeline-milestone">Digitalisasi</div>
                <p className="timeline-desc">
                  Meluncurkan sistem tracking laundry berbasis QR Code untuk
                  pelanggan setia.
                </p>
              </div>
            </div>

            {/* 2024 - Left */}
            <div className="timeline-item left">
              <div className="timeline-dot"></div>
              <div className="timeline-card">
                <div className="timeline-year">2024</div>
                <div className="timeline-milestone">Express Hub</div>
                <p className="timeline-desc">
                  Pembukaan pusat pemrosesan berkapasitas besar dengan mesin
                  industri ramah lingkungan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fasilitas & Teknologi */}
      <section className="facilities-section">
        <div className="container">
          <div className="facilities-header">
            <div>
              <h2 className="facilities-title">Fasilitas & Teknologi</h2>
              <p className="facilities-desc">
                Kami berinvestasi pada peralatan terbaik untuk memastikan pakaian
                Anda dirawat dengan standar tertinggi.
              </p>
            </div>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="facilities-btn">
              Lihat Selengkapnya
            </a>
          </div>

          <div className="facilities-grid">
            <div className="facility-card">
              <div className="facility-image-wrapper">
                <Image
                  src="/hero_laundry.png"
                  alt="Mesin Kapasitas Besar"
                  fill
                  sizes="33vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="facility-info">
                <h4 className="facility-name">Mesin Kapasitas Besar</h4>
                <p className="facility-desc">
                  Mampu memproses hingga 20kg per mesin untuk efisiensi
                  maksimal.
                </p>
              </div>
            </div>

            <div className="facility-card">
              <div className="facility-image-wrapper">
                <Image
                  src="/hero_laundry.png"
                  alt="Deterjen Premium"
                  fill
                  sizes="33vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="facility-info">
                <h4 className="facility-name">Deterjen Premium</h4>
                <p className="facility-desc">
                  Formula khusus ramah lingkungan yang aman untuk kulit
                  sensitif.
                </p>
              </div>
            </div>

            <div className="facility-card">
              <div className="facility-image-wrapper">
                <Image
                  src="/hero_laundry.png"
                  alt="Penyetrikaan Uap"
                  fill
                  sizes="33vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="facility-info">
                <h4 className="facility-name">Penyetrikaan Uap</h4>
                <p className="facility-desc">
                  Menghilangkan kerutan tanpa merusak serat kain halus Anda.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tim Profesional - Single photo from gallery, editable via admin */}
      <section className="team-section">
        <div className="container">
          <div className="team-header">
            <h2 className="team-title">Tim Profesional Kami</h2>
            <p className="team-subtitle">
              Orang-orang di balik kesegaran pakaian Anda.
            </p>
          </div>

          <div className="team-single-wrapper">
            <div className="team-photo-rect">
              <Image
                src="/hero_laundry.png"
                alt="Tim Profesional Central Laundry Express"
                fill
                sizes="100vw"
                style={{ objectFit: "cover" }}
              />
            </div>
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