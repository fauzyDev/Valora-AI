# Dokumentasi API Routes

Repository ini menggunakan Next.js Route Handlers untuk menangani logika sisi server.

## 1. Chat Processing (`/api/chat`)
**File**: `src/app/api/chat/route.ts`

Endpoint ini bertanggung jawab untuk memproses pesan masuk, menangani lampiran, dan menyiapkan konteks untuk AI.

- **Metode**: `POST`
- **Tugas Utama**:
  - Menerima `messages` dan `attachments`.
  - Jika ada lampiran:
    - Mengunduh file dari Supabase Storage.
    - Mengekstrak teks (PDF, Word, TXT, dll.).
    - Melakukan *chunking* teks jika terlalu panjang.
    - Menambahkan konten teks ke dalam pesan sistem sebagai konteks.
  - Meneruskan data yang telah diproses ke endpoint `/api/data`.

## 2. AI Streaming & Data Handling (`/api/data`)
**File**: `src/app/api/data/route.ts`

Endpoint inti yang berinteraksi langsung dengan model AI dan mengelola persistensi data.

- **Metode**: `POST`
- **Fitur Utama**:
  - **Rate Limiting**: Menggunakan Redis untuk membatasi jumlah permintaan per pengguna.
  - **Deduplikasi**: Mekanisme penguncian (locking) untuk mencegah pemrosesan ganda pada pesan yang sama.
  - **Caching**: Menyimpan respons AI di Redis untuk permintaan identik guna menghemat token.
  - **Streaming**: Menggunakan `TransformStream` untuk mengirim respons AI secara real-time ke klien.
  - **Persistensi**: Menyimpan pesan akhir ke database Supabase setelah streaming selesai.

## Keamanan & Middleware
Semua route API dilindungi oleh middleware Next.js (`src/middleware.ts`) yang memeriksa autentikasi pengguna melalui Supabase Auth sebelum mengizinkan akses.
