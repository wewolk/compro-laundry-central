# Setup Vercel KV Database

## Langkah-langkah:

### 1. Buka Vercel Dashboard
- Pergi ke https://vercel.com/dashboard
- Pilih project **LandingPage_CentralLaudry**

### 2. Buat KV Database
- Klik tab **Storage**
- Klik **Create Database**
- Pilih **KV (Redis)**
- Beri nama: `central-laundry-db`
- Pilih region: **Singapore (sin1)** (terdekat Indonesia)
- Klik **Create**

### 3. Hubungkan ke Project
- Setelah KV dibuat, klik **Connect to Project**
- Pilih project **LandingPage_CentralLaudry**
- Klik **Connect**
- Environment variables otomatis terisi:
  - `KV_REST_API_URL`
  - `KV_REST_API_TOKEN`
  - `KV_REST_API_READ_ONLY_TOKEN`

### 4. Redeploy
- Klik **Deployments** tab
- Klik **Redeploy** pada deployment terakhir
- Tunggu sampai selesai

### 5. Seed Data Awal
- Buka website: `https://your-domain.vercel.app/admin/login`
- Login dengan password: `admin123`
- Data otomatis ter-seed dari `data/content.json` ke KV

### 6. Ganti Password Admin!
- Setelah login pertama, langsung ke **Pengaturan**
- Ubah password dari `admin123` ke password baru

---

## Cara Kerja:
- **Development (localhost)**: Data disimpan di `data/content.json`
- **Production (Vercel)**: Data disimpan di Vercel KV (Redis cloud)
- Saat pertama kali diakses, data dari JSON file otomatis di-seed ke KV
- Semua perubahan admin tersimpan permanen di cloud

## Troubleshooting:
- Jika data tidak muncul, coba redeploy dari Vercel Dashboard
- Jika lupa password, bisa reset via WhatsApp (fitur lupa password)
- Untuk reset manual, edit `data/content.json` dan redeploy
