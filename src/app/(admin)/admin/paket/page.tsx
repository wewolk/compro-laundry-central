"use client";

import { useState } from "react";
import { useContent, PageHeader, SaveButton, Card, InputField } from "../_components";

export default function PaketPage() {
  const { content, loading, saving, dirty, message, updateContent, saveContent } = useContent();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPaket, setNewPaket] = useState({ name: "", features: "", isPopular: false });

  if (loading || !content) return <p style={{ padding: "40px", color: "#64748b" }}>Memuat data...</p>;

  const paket = content.paket;

  const handleAdd = () => {
    if (!newPaket.name.trim()) return;
    const id = newPaket.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + "-" + Date.now();
    const updated = {
      ...content,
      paket: [...paket, {
        id,
        name: newPaket.name,
        features: newPaket.features.split(",").map((f) => f.trim()).filter(Boolean),
        isPopular: newPaket.isPopular,
      }],
    };
    updateContent(updated);
    setNewPaket({ name: "", features: "", isPopular: false });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Yakin hapus paket ini? Perubahan baru permanen setelah klik Simpan.")) return;
    const updated = { ...content, paket: paket.filter((p) => p.id !== id) };
    updateContent(updated);
  };

  const handleEdit = (id: string) => {
    const item = paket.find((p) => p.id === id);
    if (!item) return;
    setEditingId(id);
    setNewPaket({ name: item.name, features: item.features.join(", "), isPopular: item.isPopular });
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    const updated = {
      ...content,
      paket: paket.map((p) =>
        p.id === editingId
          ? { ...p, name: newPaket.name, features: newPaket.features.split(",").map((f) => f.trim()).filter(Boolean), isPopular: newPaket.isPopular }
          : p
      ),
    };
    updateContent(updated);
    setEditingId(null);
    setNewPaket({ name: "", features: "", isPopular: false });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewPaket({ name: "", features: "", isPopular: false });
  };

  return (
    <>
      <PageHeader title="📦 Kelola Paket" subtitle="Tambah, edit, atau hapus kartu paket di section &quot;Pilihan Paket Kami&quot;" />
      <SaveButton onClick={() => saveContent()} saving={saving} message={message} dirty={dirty} />

      {/* Form tambah/edit */}
      <Card style={{ marginTop: "24px", marginBottom: "24px", border: editingId ? "2px solid #085F80" : "2px dashed #cbd5e1" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#085F80", marginBottom: "16px" }}>
          {editingId ? "✏️ Edit Paket" : "➕ Tambah Paket Baru"}
        </h3>
        <InputField label="Nama Paket" value={newPaket.name} onChange={(v) => setNewPaket({ ...newPaket, name: v })} placeholder="Contoh: Paket Premium" />
        <InputField label="Fitur (pisahkan dengan koma)" value={newPaket.features} onChange={(v) => setNewPaket({ ...newPaket, features: v })} placeholder="Contoh: Estimasi 1 Hari, Parfum Premium, VIP" />
        <div style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
          <input type="checkbox" id="isPopular" checked={newPaket.isPopular} onChange={(e) => setNewPaket({ ...newPaket, isPopular: e.target.checked })} />
          <label htmlFor="isPopular" style={{ fontSize: "14px", color: "#475569" }}>Tandai sebagai Terpopuler</label>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          {editingId ? (
            <>
              <button onClick={handleSaveEdit} style={{ padding: "10px 24px", background: "#085F80", color: "white", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}>Simpan Edit</button>
              <button onClick={handleCancelEdit} style={{ padding: "10px 24px", background: "#e2e8f0", color: "#475569", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}>Batal</button>
            </>
          ) : (
            <button onClick={handleAdd} style={{ padding: "10px 24px", background: "#16a34a", color: "white", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}>➕ Tambah</button>
          )}
        </div>
      </Card>

      {/* Daftar paket */}
      <div style={{ display: "grid", gap: "16px" }}>
        {paket.map((item) => (
          <Card key={item.id} style={{ border: item.isPopular ? "2px solid #9e3f05" : "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h4 style={{ fontSize: "18px", fontWeight: 700, color: "#085F80", marginBottom: "8px" }}>
                  {item.name} {item.isPopular && <span style={{ fontSize: "12px", background: "#9e3f05", color: "white", padding: "2px 10px", borderRadius: "20px", marginLeft: "8px" }}>TERPOPULER</span>}
                </h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {item.features.map((f, i) => (
                    <li key={i} style={{ fontSize: "14px", color: "#475569", marginBottom: "4px" }}>✓ {f}</li>
                  ))}
                </ul>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
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
