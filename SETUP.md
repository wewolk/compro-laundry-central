# Setup: Neon Postgres + ImageKit

## 1. Environment variables (`.env.local`)

```
DATABASE_URL="postgresql://<user>:<pass>@<host>.neon.tech/neondb?sslmode=require&channel_binding=require"

NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/cloyptjl8"
IMAGEKIT_PUBLIC_KEY="public_xxxxxxxxxxxxxxxxxxxx"
IMAGEKIT_PRIVATE_KEY="private_xxxxxxxxxxxxxxxxxxxx"

AUTH_SECRET="string-acak-panjang"
```

Kunci ImageKit diambil di https://imagekit.io/dashboard → Developer Options → API Keys.
Di Vercel, isi keempat variabel ini di Project Settings → Environment Variables.

## 2. Database

Tabel dibuat otomatis saat request pertama (`ensureSchema()` di `src/lib/db.ts`):

```sql
CREATE TABLE site_content (
  key        TEXT PRIMARY KEY,
  data       JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Seluruh konten situs disimpan sebagai satu dokumen JSONB dengan
key `central-laundry-content`. Kalau tabel masih kosong, isinya di-seed
otomatis dari `data/content.json`.

`data/content.json` sekarang hanya dipakai sebagai seed awal — sesudah
seed, sumber kebenaran adalah database.

## 3. Upload gambar

`POST /api/upload` mengirim file ke ImageKit (folder `/central-laundry`)
dan mengembalikan URL absolut `https://ik.imagekit.io/cloyptjl8/...`.
Tidak ada lagi tulis ke `public/uploads` (tidak persist di Vercel).

`next.config.ts` sudah mengizinkan `ik.imagekit.io/cloyptjl8/**` untuk
`next/image`.

## 4. Login admin

Password awal: `admin123` — otomatis di-hash (PBKDF2) saat login pertama.
Segera ganti lewat menu Pengaturan.
