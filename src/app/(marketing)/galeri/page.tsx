"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import GalleryMedia from "@/components/GalleryMedia";
import { useSiteContent } from "@/hooks/useContent";

const WA_LINK =
  "https://wa.me/6285181840082?text=Halo%20Central%20Laundry%20Express,%20saya%20ingin%20memesan%20layanan%20laundry.";

const VIDEO_EXTENSIONS = /\.(mp4|webm|mov|m4v)(\?.*)?$/i;

type MediaType = "all" | "image" | "video";
type Category = "semua" | "proses-pencucian" | "penyetrikaan" | "antar-jemput" | "fasilitas" | "tim-kami";

interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  type: string;
  category: string;
  poster?: string;
}

export default function GaleriPage() {
  const [mediaType, setMediaType] = useState<MediaType>("all");
  const [category, setCategory] = useState<Category>("semua");
  const { content } = useSiteContent();

  // Legacy rows can carry type "video" while still pointing at a placeholder
  // image, so the effective type is derived from the file itself.
  const galleryData: GalleryItem[] = (content?.gallery ?? []).map((item) => ({
    ...item,
    type: item.type === "video" && !VIDEO_EXTENSIONS.test(item.src) ? "image" : item.type,
  }));

  // Filter items based on selected level 1 and level 2 filters
  const filteredItems = galleryData.filter((item) => {
    const matchesType = mediaType === "all" ? true : item.type === mediaType;
    const matchesCategory =
      category === "semua" ? true : item.category === category;
    return matchesType && matchesCategory;
  });

  // Distribute items evenly across 3 columns
  const col1Items = filteredItems.filter((_, i) => i % 3 === 0);
  const col2Items = filteredItems.filter((_, i) => i % 3 === 1);
  const col3Items = filteredItems.filter((_, i) => i % 3 === 2);

  return (
    <>
      <Navbar />

      <section style={{ padding: "80px 0 60px", backgroundColor: "var(--bg-light)", textAlign: "center" }}>
        <div className="container">
          <span className="gallery-intro-badge">Visual Showroom</span>
          <h1 className="gallery-page-title">Galeri</h1>
          <p className="gallery-page-desc">
            Intip kesungguhan kami dalam menjaga kebersihan dan kualitas pakaian
            Anda melalui dokumentasi proses operasional harian kami.
          </p>

          {/* Level 1 Filter (All | Images | Videos) */}
          <div style={{ marginBottom: "16px" }}>
            <div className="gallery-level1-container">
              <button
                className={`gallery-level1-btn ${mediaType === "all" ? "active" : ""}`}
                onClick={() => setMediaType("all")}
              >
                All
              </button>
              <button
                className={`gallery-level1-btn ${mediaType === "image" ? "active" : ""}`}
                onClick={() => setMediaType("image")}
              >
                Images
              </button>
              <button
                className={`gallery-level1-btn ${mediaType === "video" ? "active" : ""}`}
                onClick={() => setMediaType("video")}
              >
                Videos
              </button>
            </div>
          </div>

          {/* Level 2 Filter (Categories) */}
          <div className="gallery-level2-container">
            {[
              { id: "semua", label: "Semua Kategori" },
              { id: "proses-pencucian", label: "Proses Pencucian" },
              { id: "penyetrikaan", label: "Penyetrikaan" },
              { id: "antar-jemput", label: "Antar-Jemput" },
              { id: "fasilitas", label: "Fasilitas" },
              { id: "tim-kami", label: "Tim Kami" },
            ].map((cat) => (
              <button
                key={cat.id}
                className={`gallery-level2-btn ${category === cat.id ? "active" : ""}`}
                onClick={() => setCategory(cat.id as Category)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Masonry-Style Columns */}
          <div className="gallery-masonry-cols">
            {[col1Items, col2Items, col3Items].map((column, colIndex) => (
              <div key={colIndex} className="gallery-masonry-col">
                {column.map((item) => (
                  <div key={item.id} className="gallery-card">
                    <div className="gallery-media-wrapper" style={{ aspectRatio: "1.4" }}>
                      <GalleryMedia
                        src={item.src}
                        alt={item.alt}
                        type={item.type}
                        poster={item.poster}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}
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
