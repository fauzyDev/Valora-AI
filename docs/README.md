# Pusat Dokumentasi Velora AI

Selamat datang di pusat dokumentasi teknis Velora AI. Dokumen-dokumen di bawah ini memberikan penjelasan mendalam tentang arsitektur, implementasi, dan penggunaan repository ini.

## Daftar Dokumen

- **[Arsitektur Sistem](architecture.md)**: Gambaran tingkat tinggi tentang bagaimana seluruh sistem bekerja sama.
- **[Panduan Setup & Instalasi](setup.md)**: Instruksi detail untuk menyiapkan lingkungan pengembangan lokal.
- **[Komponen Chat & Flow](chat.md)**: Penjelasan tentang hirarki komponen UI chat dan logika streaming.
- **[Dokumentasi API Routes](api.md)**: Detail teknis tentang endpoint API `/api/chat` dan `/api/data`.
- **[Layanan & Integrasi](services.md)**: Bagaimana kami menggunakan Gemini AI, Supabase, dan Redis.
- **[Library & Utilitas](lib.md)**: Penjelasan tentang fungsi utilitas untuk pemrosesan file, chunking, dan lainnya.
- **[Komponen UI Dasar](ui.md)**: Dokumentasi komponen UI generik (Shadcn UI).
- **[Landing Page](landing.md)**: Dokumentasi untuk halaman beranda dan pemasaran.

## Struktur Direktori Utama

- `src/app`: Definisi route dan halaman Next.js.
- `src/components`: Komponen React yang dapat digunakan kembali.
- `src/lib`: Logika bisnis, klien layanan, dan utilitas.
- `src/utils`: Helper spesifik untuk Supabase dan middleware.
- `supabase`: Migrasi database dan konfigurasi edge functions.

---
*Catatan: Dokumentasi ini selalu diperbarui seiring dengan perkembangan kode sumber.*
