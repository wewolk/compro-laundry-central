"use client";

import { useState } from "react";
import { useContent, PageHeader, SaveButton, Card, InputField, TextareaField } from "../_components";

export default function KiloanPage() {
  const { content, loading, saving, dirty, message, updateContent, saveContent } = useContent();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "", features: "", iconType: "clock", isPopular: false });

  if (loading || !content) return <p style={{ padding: "40px", color: "#64748b" }}>Memuat data...</p>;

  const kiloan = content.kiloan;

  const resetForm = () => {
    setForm({ name: "", description: "", features: "", iconType: "clock", isPopular: false });
    setEditingId(null);
  };

  const handleAdd = () => {
    if (!form.name.trim()) return;
    const id = form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + "-" + Date.now();
    const updated = {
      ...content,
      kiloan: [...kiloan, {
        id,
        name: form.name,
        description: form.description,
        features: form.features.split(",").map((f) => f.trim()).filter(Boolean),
        iconType: form.iconType,
        isPopular: form.isPopular,
      }],
    };
    updateContent(updated);
    resetForm();
  };

  const handleEdit = (id: string) => {
    const item = kiloan.find((k) => k.id === id);
    if (!item) return;
    setEditingId(id);
    setForm({
      name: item.name,
      description: item.description,
      features: item.features.join(", "),
      iconType: item.iconType,
      isPopular: item.isPopular,
    });
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    const updated = {
      ...content,
      kiloan: kiloan.map((k) =>
        k.id === editingId
          ? { ...k, name: form.name, description: form.description, features: form.features.split(",").map((f) => f.trim()).filter(Boolean), iconType: form.iconType, isPopular: form.isPopular }
          : k
      ),
    };
    updateContent(updated);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (!confirm("Yakin hapus layanan kiloan ini? Perubahan baru permanen setelah klik Simpan.")) return;
    updateContent({ ...content, kiloan: kiloan.filter((k) => k.id !== id) });
  };

  return (
    <>
      <PageHeader title="🧺 Kelola Laundry Kiloan" subtitle="CRUD kartu layanan kiloan di halaman Layanan" />
      <SaveButton onClick={() => saveContent()} saving={saving} message={message} dirty={dirty} />

      <Card style={{ marginTop: "24px", marginBottom: "24px", border: editingId ? "2px solid #085F80" : "2px dashed #cbd5e1" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#085F80", marginBottom: "16px" }}>
          {editingId ? "✏️ Edit Layanan Kiloan" : "➕ Tambah Layanan Kiloan"}
        </h3>
        <InputField label="Nama Layanan" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Contoh: Layanan Premium" />
        <TextareaField label="Deskripsi" value={form.description} onChange={(v) => setForm({ ...form, description: v })} rows={2} />
        <InputField label="Fitur (pisahkan dengan koma)" value={form.features} onChange={(v) => setForm({ ...form, features: v })} placeholder="Estimasi: 1 Hari, Pewangi Premium" />
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Ikon</label>
          <select value={form.iconType} onChange={(e) => setForm({ ...form, iconType: e.target.value })} style={{ padding: "10px 14px", border: "2px solid #e2e8f0", borderRadius: "10px", fontSize: "14px", width: "100%" }}>
            <option value="clock">🕐 Jam</option>
            <option value="lightning">⚡ Kilat</option>
            <option value="clock2">🕑 Jam 2</option>
            <option value="shield">🛡️ Perisai</option>
            <option value="star">⭐ Bintang</option>
          </select>
        </div>
        <div style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
          <input type="checkbox" id="isPopularKiloan" checked={form.isPopular} onChange={(e) => setForm({ ...form, isPopular: e.target.checked })} />
          <label htmlFor="isPopularKiloan" style={{ fontSize: "14px", color: "#475569" }}>Tandai sebagai Populer</label>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          {editingId ? (
            <>
              <button onClick={handleSaveEdit} style={{ padding: "10px 24px", background: "#085F80", color: "white", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}>Simpan Edit</button>
              <button onClick={resetForm} style={{ padding: "10px 24px", background: "#e2e8f0", color: "#475569", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}>Batal</button>
            </>
          ) : (
            <button onClick={handleAdd} style={{ padding: "10px 24px", background: "#16a34a", color: "white", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}>➕ Tambah</button>
          )}
        </div>
      </Card>

      <div style={{ display: "grid", gap: "16px" }}>
        {kiloan.map((item) => (
          <Card key={item.id} style={{ border: item.isPopular ? "2px solid #9e3f05" : "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: "18px", fontWeight: 700, color: "#085F80", marginBottom: "4px" }}>
                  {item.name} {item.isPopular && <span style={{ fontSize: "12px", background: "#9e3f05", color: "white", padding: "2px 10px", borderRadius: "20px", marginLeft: "8px" }}>POPULER</span>}
                </h4>
                <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "8px" }}>{item.description}</p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {item.features.map((f, i) => (
                    <li key={i} style={{ fontSize: "13px", color: "#475569", marginBottom: "2px" }}>✓ {f}</li>
                  ))}
                </ul>
              </div>
              <div style={{ display: "flex", gap: "8px", marginLeft: "16px" }}>
                <button onClick={() => handleEdit(item.id)} style={{ padding: "8px 16px", background: "#dbeafe", color: "#1e40af", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>✏️ Edit</button>
                <button onClick={() => handleDelete(item.id)} style={{ padding: "8px 16px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>🗑️ Hapus</button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
