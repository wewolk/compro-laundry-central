"use client";

import { useState } from "react";
import { useContent, PageHeader, SaveButton, Card, InputField } from "../_components";

export default function GaleriAdminPage() {
  const { content, loading, saving, message, saveContent, uploadImage } = useContent();
  const [uploading, setUploading] = useState(false);

  if (loading || !content) return <p style={{ padding: "40px", color: "#64748b" }}>Memuat data...</p>;

  const gallery = content.gallery;

  const handleImageUpload = async (id: number, file: File) => {
    setUploading(true);
    const url = await uploadImage(file);
    if (url) {
      const updated = {
        ...content,
        gallery: gallery.map((g) => g.id === id ? { ...g, src: url } : g),
      };
      saveContent(updated);
    }
    setUploading(false);
  };

  const updateAlt = (id: number, alt: string) => {
    const updated = {
      ...content,
      gallery: gallery.map((g) => g.id === id ? { ...g, alt } : g),
    };
    saveContent(updated);
  };

  const addGalleryItem = () => {
    const maxId = gallery.reduce((max, g) => Math.max(max, g.id), 0);
    const updated = {
      ...content,
      gallery: [...gallery, { id: maxId + 1, src: "/hero_laundry.png", alt: "Foto Baru", category: "proses-pencucian", type: "image" }],
    };
    saveContent(updated);
  };

  const removeGalleryItem = (id: number) => {
    if (!confirm("Yakin hapus foto ini?")) return;
    const updated = { ...content, gallery: gallery.filter((g) => g.id !== id) };
    saveContent(updated);
  };

  const categories = [
    { value: "proses-pencucian", label: "Proses Pencucian" },
    { value: "penyetrikaan", label: "Penyetrikaan" },
    { value: "antar-jemput", label: "Antar-Jemput" },
    { value: "fasilitas", label: "Fasilitas" },
    { value: "tim-kami", label: "Tim Kami" },
  ];

  return (
    <>
      <PageHeader title="🖼️ Kelola Galeri" subtitle="Upload dan edit foto galeri. Foto akan menyesuaikan 3 layout (kecil, sedang, lebar)." />
      <SaveButton onClick={() => saveContent(content)} saving={saving} message={message} />

      <button
        onClick={addGalleryItem}
        style={{ marginTop: "16px", padding: "12px 24px", background: "#16a34a", color: "white", border: "none", borderRadius: "10px", fontWeight: 600, cursor: "pointer", marginBottom: "24px" }}
      >
        ➕ Tambah Foto Baru
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
        {gallery.map((item) => (
          <Card key={item.id}>
            <div style={{ position: "relative", borderRadius: "12px", overflow: "hidden", marginBottom: "16px", background: "#f1f5f9" }}>
              <img
                src={item.src}
                alt={item.alt}
                style={{ width: "100%", height: "180px", objectFit: "cover", display: "block" }}
              />
              <label style={{
                position: "absolute", bottom: "8px", right: "8px",
                padding: "6px 14px", background: "rgba(0,0,0,0.7)", color: "white",
                borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer",
              }}>
                📷 Ganti Foto
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(item.id, file);
                  }}
                />
              </label>
            </div>
            <InputField label="Deskripsi Foto (Alt)" value={item.alt} onChange={(v) => updateAlt(item.id, v)} />
            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Kategori</label>
              <select
                value={item.category}
                onChange={(e) => {
                  const updated = { ...content, gallery: gallery.map((g) => g.id === item.id ? { ...g, category: e.target.value } : g) };
                  saveContent(updated);
                }}
                style={{ width: "100%", padding: "10px 14px", border: "2px solid #e2e8f0", borderRadius: "10px", fontSize: "14px", boxSizing: "border-box" }}
              >
                {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "12px" }}>
              💡 Ukuran foto: kecil (33vw), sedang (50vw), lebar (100vw) — otomatis responsif
            </p>
            <button
              onClick={() => removeGalleryItem(item.id)}
              style={{ width: "100%", padding: "10px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}
            >
              🗑️ Hapus
            </button>
          </Card>
        ))}
      </div>
      {uploading && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", padding: "32px", borderRadius: "16px", fontSize: "18px", fontWeight: 600 }}>Uploading...</div>
        </div>
      )}
    </>
  );
}
