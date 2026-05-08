# Library & Utilitas

Folder `src/lib` berisi logika bisnis inti, utilitas pemrosesan data, dan helper untuk layanan eksternal.

## 1. Pemrosesan File (`src/lib/extract.ts` & `src/lib/file.ts`)
- **`file.ts`**: Menangani pengunduhan file dari Supabase Storage.
- **`extract.ts`**: Menggunakan library `pdfjs-dist` dan `mammoth` untuk mengekstrak konten teks:
  - **PDF**: Mengekstrak teks dari setiap halaman secara iteratif.
  - **DOCX**: Mengonversi dokumen Word ke teks mentah.
  - **TXT/JSON/MD**: Membaca konten teks langsung.

## 2. Strategi Chunking (`src/lib/chunk.ts`)
Fungsi `chunkText` digunakan untuk membagi teks panjang menjadi bagian-bagian yang lebih kecil (chunks). Hal ini penting untuk:
- Menghindari batasan jumlah token pada model AI.
- Memungkinkan implementasi RAG (Retrieval-Augmented Generation) sederhana dengan memilih potongan teks yang paling relevan.

## 3. Konfigurasi Model AI (`src/lib/models.ts`)
Berisi daftar model yang didukung dari Google Gemini dan OpenRouter. Digunakan untuk:
- Memberikan metadata model (nama, provider, deskripsi) ke UI.
- Mengatur model default aplikasi.

## 4. Rate Limiting & Redis (`src/lib/redis.ts`, `src/lib/rate-limiter.ts`)
- **Redis**: Wrapper untuk Upstash Redis yang menyediakan fungsi caching respons AI, penguncian (locking) permintaan, dan polling status.
- **Rate Limiter**: Membatasi jumlah permintaan API per IP untuk menjaga stabilitas sistem.

## 5. Layanan Chat & Storage (`src/lib/services/`)
- **`chat-service.ts`**: Menangani operasi CRUD (Create, Read, Update, Delete) pada tabel chat dan pesan di Supabase.
- **`storage-service.ts`**: Menangani pengunggahan dan penghapusan file di Supabase Storage.
- **`ai-service.ts`**: Layanan terpadu untuk merutekan permintaan ke berbagai penyedia AI (Google/OpenRouter) dengan normalisasi riwayat pesan.

## 6. Supabase Utils (`src/utils/supabase/`)
- `server.ts`: Klien Supabase untuk Server Components dan API Routes.
- `client.ts`: Klien Supabase untuk Client Components.
- `middleware.ts`: Menangani manajemen sesi dan penyegaran token secara otomatis.
