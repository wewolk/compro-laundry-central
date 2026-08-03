"use client";

import { useContent, PageHeader, SaveButton, Card, InputField } from "../_components";

export default function KontakAdminPage() {
  const { content, loading, saving, dirty, message, updateContent, saveContent } = useContent();

  if (loading || !content) return <p style={{ padding: "40px", color: "#64748b" }}>Memuat data...</p>;

  const s = content.settings;

  const update = (field: string, value: string) => {
    updateContent({ ...content, settings: { ...s, [field]: value } });
  };

  const updateHours = (field: string, value: string) => {
    updateContent({ ...content, settings: { ...s, operationalHours: { ...s.operationalHours, [field]: value } } });
  };

  return (
    <>
      <PageHeader title="📍 Kontak & Lokasi" subtitle="Edit informasi kontak, alamat, dan peta lokasi. Klik Simpan setelah selesai." />
      <SaveButton onClick={() => saveContent()} saving={saving} message={message} dirty={dirty} />

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
          <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "-8px", marginBottom: "16px" }}>
            💡 Peta di website memakai gambar statis (tanpa iframe) yang selalu menunjuk outlet.
            Link ini hanya dipakai untuk tombol Petunjuk Arah saat peta diklik.
          </p>
        </Card>
      </div>
    </>
  );
}
