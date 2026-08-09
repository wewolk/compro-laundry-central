"use client";

import { useState } from "react";
import { useContent, PageHeader, SaveButton, Card, InputField, TextareaField } from "../_components";

export default function TentangAdminPage() {
  const { content, loading, saving, dirty, message, updateContent, saveContent, uploadFile } = useContent();
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  if (loading || !content) return <p style={{ padding: "40px", color: "#64748b" }}>Memuat data...</p>;

  const facilities = content.facilities ?? { title: "Fasilitas & Teknologi", desc: "", cards: [] };
  const team = content.team ?? { title: "Tim Profesional Kami", subtitle: "", imageSrc: "/hero_laundry.png", imageAlt: "Tim Profesional" };

  // === Facilities ===
  const updateFacilities = (field: string, value: string) => {
    updateContent({ ...content, facilities: { ...facilities, [field]: value } });
  };

  const updateFacilityCard = (id: number, patch: Partial<(typeof facilities.cards)[number]>) => {
    updateContent({
      ...content,
      facilities: { ...facilities, cards: facilities.cards.map((c) => (c.id === id ? { ...c, ...patch } : c)) },
    });
  };

  const handleFacilityUpload = async (id: number, file: File) => {
    setUploadingId(`fac-${id}`);
    setProgress(0);
    const result = await uploadFile(file, setProgress);
    if (result) updateFacilityCard(id, { src: result.url });
    setUploadingId(null);
    setProgress(0);
  };

  const addFacilityCard = () => {
    const maxId = facilities.cards.reduce((max, c) => Math.max(max, c.id), 0);
    updateContent({
      ...content,
      facilities: { ...facilities, cards: [...facilities.cards, { id: maxId + 1, src: "/hero_laundry.png", alt: "Fasilitas Baru", name: "Fasilitas Baru", desc: "Deskripsi fasilitas baru." }] },
    });
  };

  const removeFacilityCard = (id: number) => {
    if (!confirm("Yakin hapus kartu fasilitas ini?")) return;
    updateContent({ ...content, facilities: { ...facilities, cards: facilities.cards.filter((c) => c.id !== id) } });
  };

  // === Team ===
  const updateTeam = (field: string, value: string) => {
    updateContent({ ...content, team: { ...team, [field]: value } });
  };

  const handleTeamUpload = async (file: File) => {
    setUploadingId("team");
    setProgress(0);
    const result = await uploadFile(file, setProgress);
    if (result) updateTeam("imageSrc", result.url);
    setUploadingId(null);
    setProgress(0);
  };

  return (
    <>
      <PageHeader title="Kelola Tentang Kami" subtitle="Edit Fasilitas & Teknologi dan Tim Profesional." />
      <SaveButton onClick={() => saveContent()} saving={saving} message={message} dirty={dirty} />

      {/* Facilities Section */}
      <Card style={{ marginTop: "20px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#085F80", marginBottom: "8px" }}>
          Fasilitas & Teknologi
        </h3>
        <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "16px" }}>
          Edit foto dan deskripsi kartu fasilitas.
        </p>

        <InputField label="Judul Section" value={facilities.title} onChange={(v) => updateFacilities("title", v)} />
        <TextareaField label="Deskripsi Section" value={facilities.desc} onChange={(v) => updateFacilities("desc", v)} rows={2} />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px", marginTop: "16px" }}>
          {facilities.cards.map((card) => (
            <div key={card.id} style={{ padding: "16px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <div style={{ position: "relative", borderRadius: "10px", overflow: "hidden", marginBottom: "12px", aspectRatio: "16/10", background: "#f1f5f9" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={card.src} alt={card.alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <label style={{
                  position: "absolute", bottom: "6px", left: "6px", right: "6px",
                  padding: "6px 10px", background: "rgba(0,0,0,0.7)", color: "white",
                  borderRadius: "6px", fontSize: "11px", fontWeight: 600, cursor: "pointer", textAlign: "center",
                }}>
                  Ganti Foto
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFacilityUpload(card.id, f); e.target.value = ""; }} />
                </label>
              </div>
              <InputField label="Nama Fasilitas" value={card.name} onChange={(v) => updateFacilityCard(card.id, { name: v })} />
              <TextareaField label="Deskripsi" value={card.desc} onChange={(v) => updateFacilityCard(card.id, { desc: v })} rows={2} />
              <button onClick={() => removeFacilityCard(card.id)} style={{ width: "100%", padding: "8px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer", fontSize: "13px" }}>
                Hapus
              </button>
            </div>
          ))}
        </div>
        <button onClick={addFacilityCard} style={{ marginTop: "12px", padding: "10px 20px", background: "#16a34a", color: "white", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer", fontSize: "13px" }}>
          + Tambah Fasilitas
        </button>
      </Card>

      {/* Team Section */}
      <Card style={{ marginTop: "20px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#085F80", marginBottom: "8px" }}>
          Tim Profesional Kami
        </h3>
        <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "16px" }}>
          Edit foto dan deskripsi tim.
        </p>

        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 300px" }}>
            <InputField label="Judul" value={team.title} onChange={(v) => updateTeam("title", v)} />
            <TextareaField label="Deskripsi / Subtitle" value={team.subtitle} onChange={(v) => updateTeam("subtitle", v)} rows={2} />
          </div>

          <div style={{ flex: "0 0 280px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "8px" }}>Foto Tim</label>
            <div style={{ position: "relative", borderRadius: "10px", overflow: "hidden", aspectRatio: "16/9", background: "#f1f5f9" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={team.imageSrc} alt={team.imageAlt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <label style={{
                position: "absolute", bottom: "6px", left: "6px", right: "6px",
                padding: "6px 10px", background: "rgba(0,0,0,0.7)", color: "white",
                borderRadius: "6px", fontSize: "11px", fontWeight: 600, cursor: "pointer", textAlign: "center",
              }}>
                Ganti Foto
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleTeamUpload(f); e.target.value = ""; }} />
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
