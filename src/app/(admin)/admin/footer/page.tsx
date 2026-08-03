"use client";

import { useState } from "react";
import { useContent, PageHeader, SaveButton, Card, InputField, TextareaField } from "../_components";

export default function FooterAdminPage() {
  const { content, loading, saving, dirty, message, updateContent, saveContent } = useContent();
  const [newMenu, setNewMenu] = useState({ label: "", href: "" });

  if (loading || !content) return <p style={{ padding: "40px", color: "#64748b" }}>Memuat data...</p>;

  const footer = content.footer;

  const updateField = (field: string, value: string) => {
    updateContent({ ...content, footer: { ...footer, [field]: value } });
  };

  const addMenuItem = () => {
    if (!newMenu.label.trim() || !newMenu.href.trim()) return;
    const updated = {
      ...content,
      footer: { ...footer, menuItems: [...footer.menuItems, { label: newMenu.label, href: newMenu.href }] },
    };
    updateContent(updated);
    setNewMenu({ label: "", href: "" });
  };

  const removeMenuItem = (index: number) => {
    const updated = {
      ...content,
      footer: { ...footer, menuItems: footer.menuItems.filter((_, i) => i !== index) },
    };
    updateContent(updated);
  };

  const updateMenuItem = (index: number, field: string, value: string) => {
    const updated = {
      ...content,
      footer: {
        ...footer,
        menuItems: footer.menuItems.map((item, i) => i === index ? { ...item, [field]: value } : item),
      },
    };
    updateContent(updated);
  };

  return (
    <>
      <PageHeader title="🦶 Kelola Footer" subtitle="Edit footer yang tampil di semua halaman website" />
      <SaveButton onClick={() => saveContent()} saving={saving} message={message} dirty={dirty} />

      <div style={{ display: "grid", gap: "24px", marginTop: "24px" }}>
        <Card>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#085F80", marginBottom: "16px" }}>Informasi Brand</h3>
          <InputField label="Nama Brand" value={footer.brandName} onChange={(v) => updateField("brandName", v)} />
          <TextareaField label="Deskripsi" value={footer.description} onChange={(v) => updateField("description", v)} rows={3} />
          <InputField label="Copyright" value={footer.copyright} onChange={(v) => updateField("copyright", v)} />
        </Card>

        <Card>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#085F80", marginBottom: "16px" }}>
            Menu Utama (Konsisten di Semua Halaman)
          </h3>
          <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "16px" }}>
            ⚠️ Menu ini akan tampil sama di footer semua halaman. Perubahan di sini otomatis menyesuaikan.
          </p>
          {footer.menuItems.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "12px", alignItems: "center" }}>
              <input
                value={item.label}
                onChange={(e) => updateMenuItem(i, "label", e.target.value)}
                placeholder="Label"
                style={{ flex: 1, padding: "10px 14px", border: "2px solid #e2e8f0", borderRadius: "10px", fontSize: "14px", outline: "none" }}
              />
              <input
                value={item.href}
                onChange={(e) => updateMenuItem(i, "href", e.target.value)}
                placeholder="/layanan"
                style={{ flex: 1, padding: "10px 14px", border: "2px solid #e2e8f0", borderRadius: "10px", fontSize: "14px", outline: "none" }}
              />
              <button
                onClick={() => removeMenuItem(i)}
                style={{ padding: "10px 16px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "10px", fontWeight: 600, cursor: "pointer" }}
              >
                🗑️
              </button>
            </div>
          ))}
          <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
            <input
              value={newMenu.label}
              onChange={(e) => setNewMenu({ ...newMenu, label: e.target.value })}
              placeholder="Label baru"
              style={{ flex: 1, padding: "10px 14px", border: "2px dashed #cbd5e1", borderRadius: "10px", fontSize: "14px", outline: "none" }}
            />
            <input
              value={newMenu.href}
              onChange={(e) => setNewMenu({ ...newMenu, href: e.target.value })}
              placeholder="/halaman-baru"
              style={{ flex: 1, padding: "10px 14px", border: "2px dashed #cbd5e1", borderRadius: "10px", fontSize: "14px", outline: "none" }}
            />
            <button
              onClick={addMenuItem}
              style={{ padding: "10px 16px", background: "#16a34a", color: "white", border: "none", borderRadius: "10px", fontWeight: 600, cursor: "pointer" }}
            >
              ➕
            </button>
          </div>
        </Card>
      </div>
    </>
  );
}
