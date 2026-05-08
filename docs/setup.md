# Panduan Setup & Instalasi Lokal

Ikuti langkah-langkah di bawah ini untuk menyiapkan lingkungan pengembangan MIKOCHAT-AI di mesin lokal Anda.

## Prasyarat

Sebelum memulai, pastikan Anda telah menginstal:

- **Bun**: Runtime JavaScript yang cepat (rekomendasi). [Instal Bun](https://bun.sh/).
- **Git**: Untuk kloning repository.

## 1. Kloning Repository

```bash
git clone https://github.com/fauzyDev/MIKOCHAT-AI.git
cd MIKOCHAT-AI
```

## 2. Instalasi Dependensi

Gunakan Bun untuk menginstal semua paket yang diperlukan:

```bash
bun install
```

## 3. Konfigurasi Variabel Lingkungan

Buat file `.env.local` di root direktori dan isi dengan nilai berikut:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google Gemini AI
SECRET_GEMINI_API_KEY=your_gemini_api_key

# OpenRouter (Opsional untuk model tambahan)
OPENROUTER_API_KEY=your_openrouter_api_key

# Upstash Redis (Opsional tapi direkomendasikan)
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

# Keamanan
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 4. Persiapan Database (Supabase)

Aplikasi ini memerlukan skema database tertentu. Pastikan tabel berikut tersedia di database Supabase Anda:

1. **profiles**: Menyimpan informasi pengguna.
2. **chats**: Menyimpan sesi percakapan.
3. **messages**: Menyimpan detail pesan (user & AI).

Anda dapat menemukan migrasi SQL di folder `supabase/migrations` jika tersedia, atau ikuti struktur kolom yang didefinisikan dalam `src/lib/services/chat-service.ts`.

## 5. Menjalankan Aplikasi

Jalankan server pengembangan:

```bash
bun dev
```

Aplikasi sekarang dapat diakses di `http://localhost:3000`.

## Perintah Lain yang Berguna

- `bun run build`: Membangun aplikasi untuk produksi.
- `bun run start`: Menjalankan aplikasi yang sudah dibangun.
- `bun run lint`: Menjalankan pengecekan linter.
