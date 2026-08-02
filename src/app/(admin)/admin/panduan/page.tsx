"use client";

import { PageHeader, Card } from "../_components";

interface Section {
  id: string;
  title: string;
  intro?: string;
  steps: string[];
  note?: string;
}

const sections: Section[] = [
  {
    id: "memulai",
    title: "🚀 Memulai",
    intro:
      "Panel ini dipakai untuk mengubah isi website tanpa menyentuh kode. Semua perubahan langsung tampil di website setelah disimpan.",
    steps: [
      "Pilih menu di sidebar sesuai bagian yang mau diubah.",
      "Ubah isi kolom yang tersedia.",
      "Klik tombol 💾 Simpan Perubahan di bagian bawah halaman.",
      "Buka 🌐 Lihat Website di bawah sidebar untuk memeriksa hasilnya.",
    ],
    note: "Perubahan tidak tersimpan otomatis. Kalau pindah halaman sebelum menyimpan, isian akan hilang.",
  },
  {
    id: "paket",
    title: "📦 Kelola Paket & Kiloan",
    intro:
      "Menu Paket mengatur kartu harga di beranda. Menu Kiloan mengatur daftar layanan cuci kiloan.",
    steps: [
      "Klik ➕ Tambah untuk membuat paket baru.",
      "Isi nama paket dan daftar fitur — satu fitur per baris.",
      "Centang Paling Populer untuk memberi tanda khusus pada satu paket.",
      "Gunakan 🗑️ untuk menghapus paket yang tidak dipakai.",
    ],
    note: "Sebaiknya tampilkan 3–4 paket saja supaya beranda tetap mudah dibaca.",
  },
  {
    id: "galeri",
    title: "🖼️ Galeri & Slider Beranda",
    intro:
      "Foto pada menu Galeri dipakai di dua tempat: galeri di beranda dan slider foto besar di bagian paling atas beranda.",
    steps: [
      "Klik ➕ Tambah Foto Baru lalu pilih 📷 Ganti Foto untuk mengunggah gambar.",
      "Isi keterangan foto (alt) agar website ramah pembaca layar dan mesin pencari.",
      "Pilih kategori supaya foto tersusun rapi di galeri.",
      "Atur urutan foto — foto pertama menjadi slide pertama di beranda.",
    ],
    note:
      "Slider beranda memakai maksimal 5 foto pertama yang bertipe gambar. Foto ke-6 dan seterusnya tetap tampil di galeri, tapi tidak masuk slider. Foto yang sama tidak akan muncul dua kali sebagai slide.",
  },
  {
    id: "kontak",
    title: "📍 Kontak & Peta",
    intro:
      "Menu Kontak & Lokasi mengatur alamat, jam operasional, dan peta yang tampil di beranda.",
    steps: [
      "Isi alamat lengkap dan jam operasional.",
      "Untuk peta: buka Google Maps, cari lokasi, klik Bagikan → Sematkan peta, lalu salin URL di dalam src=\"...\".",
      "Tempel URL tersebut ke kolom Map Embed URL.",
      "Isi juga Map Link agar tombol Petunjuk Arah membuka aplikasi peta.",
    ],
    note:
      "Kalau Map Embed URL dikosongkan, beranda otomatis menampilkan kotak placeholder, bukan halaman error.",
  },
  {
    id: "keamanan",
    title: "🔒 Keamanan & Password",
    intro:
      "Password admin disimpan dalam bentuk hash, jadi tidak bisa dibaca siapa pun — termasuk lewat halaman ini.",
    steps: [
      "Ganti password di menu ⚙️ Pengaturan, bagian Ubah Password.",
      "Password maksimal 10 karakter, hanya huruf dan angka.",
      "Kalau lupa password, gunakan tautan Lupa Password di halaman login — kode verifikasi dikirim via WhatsApp.",
      "Selalu klik 🚪 Keluar setelah selesai, terutama di komputer bersama.",
    ],
    note:
      "Jangan bagikan kode verifikasi ke siapa pun. Kode hanya berlaku 5 menit.",
  },
];

export default function PanduanPage() {
  return (
    <div>
      <PageHeader
        title="Panduan Penggunaan"
        subtitle="Langkah praktis mengelola isi website Central Laundry Express."
      />

      {/* Daftar isi */}
      <Card style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#085F80", marginBottom: "12px" }}>
          Daftar Isi
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              style={{
                padding: "7px 14px",
                background: "#f1f5f9",
                border: "1px solid #e2e8f0",
                borderRadius: "30px",
                fontSize: "13px",
                fontWeight: 600,
                color: "#475569",
                textDecoration: "none",
              }}
            >
              {section.title}
            </a>
          ))}
        </div>
      </Card>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {sections.map((section) => (
          <Card key={section.id} style={{ scrollMarginTop: "24px" }}>
            <h2
              id={section.id}
              style={{
                fontSize: "19px",
                fontWeight: 800,
                color: "#085F80",
                marginBottom: "8px",
                scrollMarginTop: "24px",
              }}
            >
              {section.title}
            </h2>

            {section.intro && (
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.7, marginBottom: "16px" }}>
                {section.intro}
              </p>
            )}

            <ol style={{ paddingLeft: "20px", margin: 0, display: "flex", flexDirection: "column", gap: "9px" }}>
              {section.steps.map((step, i) => (
                <li key={i} style={{ fontSize: "14px", color: "#334155", lineHeight: 1.65 }}>
                  {step}
                </li>
              ))}
            </ol>

            {section.note && (
              <p
                style={{
                  marginTop: "16px",
                  padding: "12px 14px",
                  background: "#fff7ed",
                  borderLeft: "3px solid #9e3f05",
                  borderRadius: "8px",
                  fontSize: "13px",
                  color: "#7c2d12",
                  lineHeight: 1.6,
                }}
              >
                <strong>Catatan:</strong> {section.note}
              </p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
