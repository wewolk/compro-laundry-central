"use client";

import { useContent, PageHeader, SaveButton, Card, InputField, TextareaField } from "../_components";

export default function KontakAdminPage() {
  const { content, loading, saving, message, saveContent } = useContent();

  if (loading || !content) return <p style={{ padding: "40px", color: "#64748b" }}>Memuat data...</p>;

  const s = content.settings;

  const update = (field: string, value: string) => {
    saveContent({ ...content, settings: { ...s, [field]: value } });
  };

  const updateHours = (field: string, value: string) => {
    saveContent({ ...content, settings: { ...s, operationalHours: { ...s.operationalHours, [field]: value } } });
  };

  return (
    <>
      <PageHeader title="📍 Kontak & Lokasi" subtitle="Edit informasi kontak, alamat, dan peta lokasi" />
      <SaveButton onClick={() => saveContent(content)} saving={saving} message={message} />

      <div style={{ display: "grid", gap: "24px", marginTop: "24px" }}>
        <Card>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#085F80", marginBottom: "16px" }}>Informasi Kontak</h3>
          <InputField label="Alamat Outlet" value={s.address} onChange={(v) => update("address", v)} />
          <InputField label="Email" value={s.email} onChange={(v) => update("email", v)} />
          <InputField label="Nomor WhatsApp" value={s.waNumber} onChange={(v) => update("waNumber", v)} />
          <InputField label="Link WhatsApp (wa.me)" value={s.waLink} onChange={(v) => update("waLink", v)} />
        </Card>

        <Card>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#085F80", marginBottom: "16px" }}>Jam Operasional</h3>
          <InputField label="Senin - Sabtu" value={s.operationalHours.weekdays} onChange={(v) => updateHours("weekdays", v)} />
          <InputField label="Minggu" value={s.operationalHours.weekend} onChange={(v) => updateHours("weekend", v)} />
        </Card>

        <Card>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#085F80", marginBottom: "16px" }}>Peta & Maps</h3>
          <InputField label="Link Google Maps (untuk Petunjuk Arah)" value={s.mapLink} onChange={(v) => update("mapLink", v)} />
          <TextareaField label="Embed URL Google Maps (iframe src)" value={s.mapEmbedUrl} onChange={(v) => update("mapEmbedUrl", v)} rows={3} />
          {s.mapEmbedUrl && (
            <div style={{ marginTop: "16px", borderRadius: "12px", overflow: "hidden", height: "300px" }}>
              <iframe src={s.mapEmbedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
