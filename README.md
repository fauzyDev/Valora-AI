# Valora AI 🚀

MIKOCHAT-AI adalah platform percakapan cerdas berbasis AI yang dibangun dengan **Next.js 16**, mengintegrasikan model bahasa besar (LLM) **Google Gemini** untuk memberikan pengalaman chat yang responsif, cerdas, dan kaya fitur.

## ✨ Fitur Utama

- **Real-time AI Chat**: Respons streaming cepat menggunakan model Gemini terbaru.
- **Dukungan Lampiran Kaya**: Unggah dan analisis dokumen (PDF, Word, TXT) serta gambar secara langsung dalam percakapan.
- **Smart Context**: Sistem chunking dokumen otomatis untuk memberikan konteks yang relevan kepada AI.
- **Manajemen Riwayat Chat**: Simpan dan akses kembali percakapan Anda dengan integrasi **Supabase**.
- **Performa Tinggi**: Caching respons dan rate limiting menggunakan **Upstash Redis**.
- **UI Modern**: Desain elegan dengan **Tailwind CSS**, **Framer Motion**, dan dukungan Mode Gelap/Terang.

## 🛠️ Stack Teknologi

- **Frontend**: [Next.js](https://nextjs.org/), [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/)
- **AI Model**: [Google Generative AI (Gemini)](https://ai.google.dev/)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Caching & Rate Limiting**: [Upstash Redis](https://upstash.com/)
- **Animasi**: [Framer Motion](https://www.framer.com/motion/)
- **Runtime**: [Bun](https://bun.sh/)

## 🚀 Memulai Cepat

### Prasyarat
- [Bun](https://bun.sh/) terinstal di sistem Anda.
- Akun Google AI SDK (untuk API Key Gemini).
- Proyek Supabase dan Upstash Redis.

### Instalasi

1. Klon repository:
   ```bash
   git clone https://github.com/fauzyDev/MIKOCHAT-AI.git
   cd MIKOCHAT-AI
   ```

2. Instal dependensi:
   ```bash
   bun install
   ```

3. Konfigurasi variabel lingkungan:
   Salin `.env.local.example` ke `.env.local` dan isi nilai yang diperlukan.

4. Jalankan server pengembangan:
   ```bash
   bun dev
   ```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## 📚 Dokumentasi Lengkap

Untuk detail teknis lebih mendalam, silakan lihat folder `docs`:

- [Ringkasan Dokumentasi](docs/README.md)
- [Arsitektur Sistem](docs/architecture.md)
- [Panduan Setup Detail](docs/setup.md)
- [Dokumentasi API](docs/api.md)
- [Komponen Chat & Flow](docs/chat.md)

---
Dibuat oleh [Fauzy](https://github.com/fauzyDev)
