# Arsitektur Komponen Chat

Sistem chat MIKOCHAT-AI dirancang untuk menjadi modular, responsif, dan mampu menangani pembaruan real-time dengan lancar.

## Hirarki Komponen Utama

### 1. Kontainer Utama (`src/components/VeloraAIChat.tsx`)
Inilah "otak" dari UI chat. Komponen ini mengelola:
- Status percakapan saat ini (`activeChatId`).
- Daftar pesan dalam sesi aktif.
- Logika pengiriman pesan dan penanganan streaming AI.
- Koordinasi antara Sidebar, Navigasi Atas, dan Area Pesan.

### 2. Sidebar (`src/components/chat/sidebar/Sidebar.tsx`)
Menampilkan riwayat percakapan pengguna.
- `ChatHistoryList`: Memuat daftar chat dari Supabase.
- `ChatItem`: Komponen individual untuk setiap sesi chat dengan opsi hapus/edit judul.

### 3. Area Input (`src/components/chat/input/InputArea.tsx`)
Komponen kompleks untuk interaksi pengguna:
- **Auto-resize**: Textarea yang membesar sesuai konten.
- **Attachment Support**: Menangani pemilihan file dan pratinjau sebelum diunggah.
- **Shortcut**: Dukungan `Enter` untuk kirim dan `Shift + Enter` untuk baris baru.

### 4. Renderer Pesan
- `AIMessage.tsx`: Merender respons dari AI. Menggunakan `MarkdownRenderer` untuk memformat teks.
- `UserMessage.tsx`: Merender pesan pengguna dan menampilkan lampiran file yang terkait.
- `MarkdownRenderer.tsx`: Menggunakan `react-markdown` dengan dukungan sintaks GitHub Flavored Markdown (GFM).
- `CodeBlock.tsx`: Memberikan penyorotan sintaks (syntax highlighting) dan tombol salin untuk blok kode.

## Alur Data Chat (Data Flow)

1. **Input**: Pengguna mengetik pesan dan (opsional) mengunggah file.
2. **Kirim**: Pesan ditambahkan ke UI secara optimis (optimistic update).
3. **Proses**: Permintaan dikirim ke `/api/chat`. File diproses dan dikirim sebagai konteks ke AI.
4. **Streaming**: Respons AI diterima dalam potongan-potongan kecil (chunks) dan diperbarui di UI secara real-time.
5. **Selesai**: Setelah streaming berakhir, pesan lengkap disimpan ke database Supabase.

## Fitur UI Khusus
- **Smart Scroll**: Secara otomatis menggulir ke bawah saat pesan baru masuk, kecuali jika pengguna sedang menggulir ke atas secara manual.
- **Typing Indicator**: Animasi halus saat AI sedang memproses permintaan.
- **Responsive Layout**: Sidebar yang dapat disembunyikan pada perangkat seluler.
