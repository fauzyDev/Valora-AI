# Layanan & Integrasi Eksternal

MIKOCHAT-AI mengandalkan beberapa layanan cloud untuk memberikan pengalaman pengguna yang kaya dan performa yang optimal.

## 1. Google Gemini AI

Google Gemini adalah mesin kecerdasan utama aplikasi. Kami menggunakan model **Gemini 2.0 Flash** untuk kecepatan respons yang luar biasa dan **Gemini 1.5 Pro** untuk pemrosesan dokumen yang kompleks.

- **Streaming**: Menggunakan SDK `@google/generative-ai` untuk streaming respons.
- **Normalisasi Riwayat**: Pesan dikonversi menjadi format `parts: [{ text: "..." }]` dengan peran `user` dan `model`.
- **Context Injection**: Teks yang diekstrak dari dokumen disematkan langsung ke dalam prompt untuk memberikan kemampuan tanya-jawab dokumen (RAG).

## 2. OpenRouter Integration

OpenRouter memberikan akses ke berbagai model LLM lainnya melalui satu API terpadu yang kompatibel dengan format OpenAI.

- **Model Tersedia**: Claude 3.5 Sonnet, GPT-4o, Llama 3.1, dll.
- **Streaming SSE**: Menangani Server-Sent Events untuk memberikan respons kata-per-kata di UI.
- **Konfigurasi**: Memerlukan `OPENROUTER_API_KEY` dan header `HTTP-Referer`.

## 3. Supabase (Database & Storage)

- **PostgreSQL**: Database relasional untuk menyimpan profil pengguna, sesi chat, pesan, dan metadata lampiran.
- **Storage**: Bucket khusus (`dons`) digunakan untuk menyimpan file fisik.
- **Auth**: Integrasi autentikasi pihak ketiga dan email, dengan manajemen sesi melalui Cookie (SSR).

## 4. Upstash Redis (Caching & Security)

- **Rate Limiting**: Membatasi penggunaan API untuk mencegah lonjakan biaya dan penyalahgunaan.
- **Idempotency Lock**: Menggunakan Redis untuk memastikan satu prompt pengguna tidak memicu dua proses LLM yang bersamaan.
- **Persistent Cache**: Menyimpan respons akhir dari AI. Jika pengguna lain (atau pengguna yang sama) menanyakan hal yang identik, respons diambil langsung dari Redis dalam hitungan milidetik.
