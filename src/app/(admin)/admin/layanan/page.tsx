"use client";

import { useState } from "react";
import { useContent, PageHeader, SaveButton, Card, InputField, TextareaField } from "../_components";

export default function LayananAdminPage() {
  const { content, loading, saving, dirty, message, updateContent, saveContent, uploadFile } = useContent();
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  if (loading || !content) return <p style={{ padding: "40px", color: "#64748b" }}>Memuat data...</p>;

  const satuan = content.satuan ?? { bigCards: [], smallCards: [] };
  const dryClean = content.dryClean ?? { badge: "PREMIUM SERVICE", title: "Dry Clean Professional", desc: "", features: [], imageSrc: "/hero_laundry.png", imageAlt: "Dry Clean Professional" };

  // === Satuan Big Cards ===
  const updateBigCard = (id: number, patch: Partial<(typeof satuan.bigCards)[number]>) => {
    updateContent({
      ...content,
      satuan: { ...satuan, bigCards: satuan.bigCards.map((c) => (c.id === id ? { ...c, ...patch } : c)) },
    });
  };

  const handleBigCardUpload = async (id: number, file: File) => {
    setUploadingId(`big-${id}`);
    setProgress(0);
    const result = await uploadFile(file, setProgress);
    if (result) updateBigCard(id, { src: result.url });
    setUploadingId(null);
    setProgress(0);
  };

  const addBigCard = () => {
    const maxId = satuan.bigCards.reduce((max, c) => Math.max(max, c.id), 0);
    updateContent({
      ...content,
      satuan: { ...satuan, bigCards: [...satuan.bigCards, { id: maxId + 1, src: "/hero_laundry.png", alt: "Item Baru", name: "Item Baru" }] },
    });
  };

  const removeBigCard = (id: number) => {
    if (!confirm("Yakin hapus kartu ini?")) return;
    updateContent({ ...content, satuan: { ...satuan, bigCards: satuan.bigCards.filter((c) => c.id !== id) } });
  };

  // === Satuan Small Cards ===
  const updateSmallCard = (id: number, patch: Partial<(typeof satuan.smallCards)[number]>) => {
    updateContent({
      ...content,
      satuan: { ...satuan, smallCards: satuan.smallCards.map((c) => (c.id === id ? { ...c, ...patch } : c)) },
    });
  };

  const addSmallCard = () => {
    const maxId = satuan.smallCards.reduce((max, c) => Math.max(max, c.id), 0);
    updateContent({
      ...content,
      satuan: { ...satuan, smallCards: [...satuan.smallCards, { id: maxId + 1, icon: "✨", title: "Layanan Baru", desc: "Deskripsi layanan baru." }] },
    });
  };

  const removeSmallCard = (id: number) => {
    if (!confirm("Yakin hapus item ini?")) return;
    updateContent({ ...content, satuan: { ...satuan, smallCards: satuan.smallCards.filter((c) => c.id !== id) } });
  };

  // === Dry Clean ===
  const updateDryClean = (field: string, value: string) => {
    updateContent({ ...content, dryClean: { ...dryClean, [field]: value } });
  };

  const updateDryCleanFeature = (index: number, value: string) => {
    const updated = [...dryClean.features];
    updated[index] = value;
    updateContent({ ...content, dryClean: { ...dryClean, features: updated } });
  };

  const addDryCleanFeature = () => {
    updateContent({ ...content, dryClean: { ...dryClean, features: [...dryClean.features, "Fitur baru"] } });
  };

  const removeDryCleanFeature = (index: number) => {
    updateContent({ ...content, dryClean: { ...dryClean, features: dryClean.features.filter((_, i) => i !== index) } });
  };

  const handleDryCleanImageUpload = async (file: File) => {
    setUploadingId("dryclean");
    setProgress(0);
    const result = await uploadFile(file, setProgress);
    if (result) updateDryClean("imageSrc", result.url);
    setUploadingId(null);
    setProgress(0);
  };

  return (
    <>
      <PageHeader title="Kelola Layanan" subtitle="Edit Laundry Satuan Premium dan Dry Clean Professional." />
      <SaveButton onClick={() => saveContent()} saving={saving} message={message} dirty={dirty} />

      {/* Big Image Cards */}
      <Card style={{ marginTop: "20px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#085F80", marginBottom: "8px" }}>
          Kartu Gambar Besar
        </h3>
        <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "16px" }}>
          Kartu foto besar di bagian Laundry Satuan Premium.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
          {satuan.bigCards.map((card) => (
            <div key={card.id} style={{ padding: "16px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <div style={{ position: "relative", borderRadius: "10px", overflow: "hidden", marginBottom: "12px", aspectRatio: "4/3", background: "#f1f5f9" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={card.src} alt={card.alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <label style={{
                  position: "absolute", bottom: "6px", left: "6px", right: "6px",
                  padding: "6px 10px", background: "rgba(0,0,0,0.7)", color: "white",
                  borderRadius: "6px", fontSize: "11px", fontWeight: 600, cursor: "pointer", textAlign: "center",
                }}>
                  Ganti Foto
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleBigCardUpload(card.id, f); e.target.value = ""; }} />
                </label>
              </div>
              <InputField label="Nama Item" value={card.name} onChange={(v) => updateBigCard(card.id, { name: v })} />
              <InputField label="Badge (opsional)" value={card.badge ?? ""} onChange={(v) => updateBigCard(card.id, { badge: v })} placeholder="Pakaian Premium" />
              <InputField label="Subteks (opsional)" value={card.subtext ?? ""} onChange={(v) => updateBigCard(card.id, { subtext: v })} placeholder="Gorden, Karpet & Taplak" />
              <button onClick={() => removeBigCard(card.id)} style={{ width: "100%", padding: "8px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer", fontSize: "13px" }}>
                Hapus
              </button>
            </div>
          ))}
        </div>
        <button onClick={addBigCard} style={{ marginTop: "12px", padding: "10px 20px", background: "#16a34a", color: "white", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer", fontSize: "13px" }}>
          + Tambah Kartu Gambar
        </button>
      </Card>

      {/* Small Info Cards (CRUD) */}
      <Card style={{ marginTop: "20px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#085F80", marginBottom: "8px" }}>
          Item Layanan Kecil
        </h3>
        <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "16px" }}>
          Sepatu & Tas, Baby Gears, dll. Bisa ditambah/hapus.
        </p>

        {satuan.smallCards.map((card) => (
          <div key={card.id} style={{ padding: "16px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "12px" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <InputField label="Icon (emoji)" value={card.icon} onChange={(v) => updateSmallCard(card.id, { icon: v })} placeholder="👞" />
                <InputField label="Judul" value={card.title} onChange={(v) => updateSmallCard(card.id, { title: v })} />
                <TextareaField label="Deskripsi" value={card.desc} onChange={(v) => updateSmallCard(card.id, { desc: v })} rows={2} />
              </div>
              <button onClick={() => removeSmallCard(card.id)} style={{ marginTop: "28px", padding: "8px 14px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer", fontSize: "13px" }}>
                Hapus
              </button>
            </div>
          </div>
        ))}
        <button onClick={addSmallCard} style={{ marginTop: "4px", padding: "10px 20px", background: "#16a34a", color: "white", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer", fontSize: "13px" }}>
          + Tambah Item
        </button>
      </Card>

      {/* Dry Clean Professional */}
      <Card style={{ marginTop: "20px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#085F80", marginBottom: "8px" }}>
          Dry Clean Professional
        </h3>
        <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "16px" }}>
          Edit deskripsi, foto, dan fitur layanan dry clean.
        </p>

        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 300px" }}>
            <InputField label="Badge" value={dryClean.badge} onChange={(v) => updateDryClean("badge", v)} placeholder="PREMIUM SERVICE" />
            <InputField label="Judul" value={dryClean.title} onChange={(v) => updateDryClean("title", v)} />
            <TextareaField label="Deskripsi" value={dryClean.desc} onChange={(v) => updateDryClean("desc", v)} rows={4} />

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "8px" }}>Fitur</label>
              {dryClean.features.map((f, i) => (
                <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                  <input type="text" value={f} onChange={(e) => updateDryCleanFeature(i, e.target.value)} style={{ flex: 1, padding: "8px 12px", border: "2px solid #e2e8f0", borderRadius: "8px", fontSize: "14px" }} />
                  <button onClick={() => removeDryCleanFeature(i)} style={{ padding: "8px 12px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}>✕</button>
                </div>
              ))}
              <button onClick={addDryCleanFeature} style={{ padding: "8px 16px", background: "#16a34a", color: "white", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer", fontSize: "13px" }}>
                + Tambah Fitur
              </button>
            </div>
          </div>

          <div style={{ flex: "0 0 200px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "8px" }}>Foto</label>
            <div style={{ position: "relative", borderRadius: "10px", overflow: "hidden", aspectRatio: "3/4", background: "#f1f5f9" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={dryClean.imageSrc} alt={dryClean.imageAlt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <label style={{
                position: "absolute", bottom: "6px", left: "6px", right: "6px",
                padding: "6px 10px", background: "rgba(0,0,0,0.7)", color: "white",
                borderRadius: "6px", fontSize: "11px", fontWeight: 600, cursor: "pointer", textAlign: "center",
              }}>
                Ganti Foto
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleDryCleanImageUpload(f); e.target.value = ""; }} />
              </label>
            </div>
          </div>
        </div>
      </Card>

      {uploadingId && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", padding: "32px", borderRadius: "16px", minWidth: "280px", textAlign: "center" }}>
            <p style={{ fontSize: "16px", fontWeight: 700, color: "#085F80", marginBottom: "16px" }}>Mengunggah... {progress}%</p>
            <div style={{ height: "10px", background: "#e2e8f0", borderRadius: "999px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: "#16a34a", transition: "width 0.2s" }} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
