"use client";

import { useState } from "react";
import { useContent, PageHeader, SaveButton, Card, InputField, TextareaField } from "./_components";

const MAX_HERO_SLIDES = 5;

export default function DashboardAdminPage() {
  const { content, loading, saving, dirty, message, updateContent, saveContent, uploadFile } = useContent();
  const [uploadingSlide, setUploadingSlide] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  if (loading || !content) return <p style={{ padding: "40px", color: "#64748b" }}>Memuat data...</p>;

  const dashboard = content.dashboard;

  const updateDashboard = (field: string, value: string) => {
    updateContent({
      ...content,
      dashboard: { ...dashboard, [field]: value },
    });
  };

  // Hero Slides management
  const heroSlides = dashboard.heroSlides ?? ["/hero_laundry.png"];

  const handleSlideUpload = async (index: number, file: File) => {
    setUploadingSlide(index);
    setProgress(0);
    const result = await uploadFile(file, setProgress);
    if (result) {
      const updated = [...heroSlides];
      updated[index] = result.url;
      updateContent({
        ...content,
        dashboard: { ...dashboard, heroSlides: updated },
      });
    }
    setUploadingSlide(null);
    setProgress(0);
  };

  const addSlide = () => {
    if (heroSlides.length >= MAX_HERO_SLIDES) return;
    updateContent({
      ...content,
      dashboard: { ...dashboard, heroSlides: [...heroSlides, "/hero_laundry.png"] },
    });
  };

  const removeSlide = (index: number) => {
    if (!confirm("Yakin hapus foto ini?")) return;
    updateContent({
      ...content,
      dashboard: { ...dashboard, heroSlides: heroSlides.filter((_, i) => i !== index) },
    });
  };

  // Features management
  const features = dashboard.features ?? [];

  const updateFeature = (index: number, field: string, value: string) => {
    const updated = [...features];
    updated[index] = { ...updated[index], [field]: value };
    updateContent({
      ...content,
      dashboard: { ...dashboard, features: updated },
    });
  };

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Kelola tampilan utama website: hero, fitur, kontak, dan CTA banner."
      />
      <SaveButton onClick={() => saveContent()} saving={saving} message={message} dirty={dirty} />

      {/* Hero Slides Section */}
      <Card style={{ marginTop: "20px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#085F80", marginBottom: "8px" }}>
          Hero Slider (Foto Beranda)
        </h3>
        <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "16px" }}>
          Foto slider di bagian hero beranda. Maksimal {MAX_HERO_SLIDES} foto.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "12px" }}>
          {heroSlides.map((src, i) => (
            <div key={i} style={{ position: "relative", borderRadius: "10px", overflow: "hidden", background: "#f1f5f9", aspectRatio: "4/3" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`Slide ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <label style={{
                position: "absolute", bottom: "6px", left: "6px", right: "6px",
                padding: "6px 10px", background: "rgba(0,0,0,0.7)", color: "white",
                borderRadius: "6px", fontSize: "11px", fontWeight: 600, cursor: "pointer",
                textAlign: "center",
              }}>
                Ganti Foto
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleSlideUpload(i, file);
                    e.target.value = "";
                  }}
                />
              </label>
              {heroSlides.length > 1 && (
                <button
                  onClick={() => removeSlide(i)}
                  style={{
                    position: "absolute", top: "6px", right: "6px",
                    width: "24px", height: "24px", borderRadius: "50%",
                    background: "rgba(239,68,68,0.9)", color: "white",
                    border: "none", cursor: "pointer", fontSize: "14px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  x
                </button>
              )}
            </div>
          ))}
        </div>

        {heroSlides.length < MAX_HERO_SLIDES && (
          <button
            onClick={addSlide}
            style={{ marginTop: "12px", padding: "10px 20px", background: "#16a34a", color: "white", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer", fontSize: "13px" }}
          >
            + Tambah Foto ({heroSlides.length}/{MAX_HERO_SLIDES})
          </button>
        )}
      </Card>

      {/* Hero Text Section */}
      <Card style={{ marginTop: "20px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#085F80", marginBottom: "16px" }}>
          Teks Hero (Beranda)
        </h3>
        <InputField
          label="Badge Text"
          value={dashboard.heroBadge}
          onChange={(v) => updateDashboard("heroBadge", v)}
          placeholder="Express 2 Jam Selesai!"
        />
        <InputField
          label="Judul Hero (sebelum teks accent)"
          value={dashboard.heroTitle}
          onChange={(v) => updateDashboard("heroTitle", v)}
          placeholder="Central Laundry Express - Cucian Bersih, "
        />
        <InputField
          label="Judul Hero (teks accent/warna berbeda)"
          value={dashboard.heroTitleAccent}
          onChange={(v) => updateDashboard("heroTitleAccent", v)}
          placeholder="Hidup Lebih Praktis!"
        />
        <TextareaField
          label="Deskripsi Hero"
          value={dashboard.heroDesc}
          onChange={(v) => updateDashboard("heroDesc", v)}
          rows={3}
        />
      </Card>

      {/* Features Section */}
      <Card style={{ marginTop: "20px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#085F80", marginBottom: "8px" }}>
          Mengapa Memilih Kami?
        </h3>
        <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "16px" }}>
          Edit kartu fitur yang tampil di beranda.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
          {features.map((feat, i) => (
            <div key={i} style={{ padding: "16px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <InputField
                label={`Judul Fitur ${i + 1}`}
                value={feat.title}
                onChange={(v) => updateFeature(i, "title", v)}
                placeholder="Nama fitur"
              />
              <TextareaField
                label="Deskripsi"
                value={feat.desc}
                onChange={(v) => updateFeature(i, "desc", v)}
                rows={2}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* CTA Section */}
      <Card style={{ marginTop: "20px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#085F80", marginBottom: "16px" }}>
          CTA Banner (Ajakan WhatsApp)
        </h3>
        <InputField
          label="Judul CTA"
          value={dashboard.ctaTitle}
          onChange={(v) => updateDashboard("ctaTitle", v)}
          placeholder="Siap Memberikan Kesegaran untuk Pakaian Anda?"
        />
        <TextareaField
          label="Deskripsi CTA"
          value={dashboard.ctaDesc}
          onChange={(v) => updateDashboard("ctaDesc", v)}
          rows={2}
        />
        <InputField
          label="Nomor Telepon"
          value={dashboard.ctaPhone}
          onChange={(v) => updateDashboard("ctaPhone", v)}
          placeholder="0851-8184-0082"
        />
      </Card>

      {uploadingSlide !== null && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", padding: "32px", borderRadius: "16px", minWidth: "280px", textAlign: "center" }}>
            <p style={{ fontSize: "16px", fontWeight: 700, color: "#085F80", marginBottom: "16px" }}>
              Mengunggah... {progress}%
            </p>
            <div style={{ height: "10px", background: "#e2e8f0", borderRadius: "999px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: "#16a34a", transition: "width 0.2s" }} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}