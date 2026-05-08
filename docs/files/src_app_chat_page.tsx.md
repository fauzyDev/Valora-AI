# src/app/chat/page.tsx

[Lihat sumber](src/app/chat/page.tsx)

Ringkasan:

Halaman workspace/chat. Memeriksa autentikasi pengguna melalui Supabase server-side dan merender `VeloraAIChat` jika user sudah login. Jika tidak, redirect ke `/login`.

Ekspor:

- `metadata` — metadata halaman.
- Default export: `Page()` — fungsi server-side yang memeriksa session.
