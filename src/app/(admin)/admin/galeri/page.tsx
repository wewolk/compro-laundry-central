"use client";

import { useState } from "react";
import { useContent, PageHeader, SaveButton, Card, InputField } from "../_components";
import { MAX_VIDEO_BYTES, formatBytes } from "@/lib/media";

export default function GaleriAdminPage() {
  const { content, loading, saving, dirty, message, updateContent, saveContent, uploadFile } = useContent();
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  if (loading || !content) return <p style={{ padding: "40px", color: "#64748b" }}>Memuat data...</p>;

  const gallery = content.gallery;

  const handleMediaUpload = async (id: number, file: File) => {
    setUploadingId(id);
    setProgress(0);
    const result = await uploadFile(file, setProgress);
    if (result) {
      updateContent({
        ...content,
        gallery: gallery.map((g) =>
          g.id === id
            ? {
                ...g,
                src: result.url,
                type: result.kind,
                poster: result.kind === "video" ? result.poster : undefined,
                fileId: result.fileId,
              }
            : g
        ),
      });
    }
    setUploadingId(null);
    setProgress(0);
  };

  const updateItem = (id: number, patch: Partial<(typeof gallery)[number]>) => {
    updateContent({
      ...content,
      gallery: gallery.map((g) => (g.id === id ? { ...g, ...patch } : g)),
    });
  };

  const addGalleryItem = () => {
    const maxId = gallery.reduce((max, g) => Math.max(max, g.id), 0);
    updateContent({
      ...content,
      gallery: [...gallery, { id: maxId + 1, src: "/hero_laundry.png", alt: "Foto Baru", category: "proses-pencucian", type: "image" }],
    });
  };

  const removeGalleryItem = (id: number) => {
    if (!confirm("Yakin hapus media ini? Perubahan baru permanen setelah klik Simpan.")) return;
    updateContent({ ...content, gallery: gallery.filter((g) => g.id !== id) });
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
      <PageHeader
        title="🖼️ Kelola Galeri"
        subtitle="Upload foto atau video. Foto otomatis dikompres sebelum dikirim. Perubahan baru tersimpan setelah klik Simpan."
      />
      <SaveButton onClick={() => saveContent()} saving={saving} message={message} dirty={dirty} />

      <button
        onClick={addGalleryItem}
        style={{ marginTop: "16px", padding: "12px 24px", background: "#16a34a", color: "white", border: "none", borderRadius: "10px", fontWeight: 600, cursor: "pointer", marginBottom: "24px" }}
      >
        ➕ Tambah Media Baru
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
        {gallery.map((item) => (
          <Card key={item.id}>
            <div style={{ position: "relative", borderRadius: "12px", overflow: "hidden", marginBottom: "16px", background: "#f1f5f9" }}>
              {item.type === "video" ? (
                <video
                  src={item.src}
                  poster={item.poster}
                  controls
                  preload="metadata"
                  style={{ width: "100%", height: "180px", objectFit: "cover", display: "block", background: "#0f172a" }}
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element --
                   Admin preview of user uploads: arbitrary runtime paths that
                   next/image would need explicit remotePatterns for. */
                <img
                  src={item.src}
                  alt={item.alt}
                  style={{ width: "100%", height: "180px", objectFit: "cover", display: "block" }}
                />
              )}

              <span style={{
                position: "absolute", top: "8px", left: "8px",
                padding: "4px 10px", background: item.type === "video" ? "#7c3aed" : "#085F80",
                color: "white", borderRadius: "20px", fontSize: "11px", fontWeight: 700,
              }}>
                {item.type === "video" ? "🎬 VIDEO" : "📷 FOTO"}
              </span>

              <label style={{
                position: "absolute", bottom: "8px", right: "8px",
                padding: "6px 14px", background: "rgba(0,0,0,0.7)", color: "white",
                borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer",
              }}>
                📁 Ganti Media
                <input
                  type="file"
                  accept="image/*,video/mp4,video/webm,video/quicktime"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleMediaUpload(item.id, file);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>

            <InputField label="Deskripsi Media (Alt)" value={item.alt} onChange={(v) => updateItem(item.id, { alt: v })} />

            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Kategori</label>
              <select
                value={item.category}
                onChange={(e) => updateItem(item.id, { category: e.target.value })}
                style={{ width: "100%", padding: "10px 14px", border: "2px solid #e2e8f0", borderRadius: "10px", fontSize: "14px", boxSizing: "border-box" }}
              >
                {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>

            <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "12px" }}>
              💡 Foto dikompres otomatis (maks 1920px, WebP). Video maks {formatBytes(MAX_VIDEO_BYTES)}, format MP4/WebM/MOV.
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

      {uploadingId !== null && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", padding: "32px", borderRadius: "16px", minWidth: "280px", textAlign: "center" }}>
            <p style={{ fontSize: "16px", fontWeight: 700, color: "#085F80", marginBottom: "16px" }}>
              Mengunggah... {progress}%
            </p>
            <div style={{ height: "10px", background: "#e2e8f0", borderRadius: "999px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: "#16a34a", transition: "width 0.2s" }} />
            </div>
            <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "12px" }}>
              Jangan tutup halaman ini sampai selesai.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
