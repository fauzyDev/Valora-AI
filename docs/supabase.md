# Supabase Helpers

- [src/utils/supabase/client.ts](src/utils/supabase/client.ts): Membuat instance Supabase untuk penggunaan di sisi klien (`createBrowserClient`).
- [src/utils/supabase/server.ts](src/utils/supabase/server.ts): Membuat instance Supabase untuk lingkungan server/SSR dengan cookie store Next.js.
- [src/utils/supabase/middleware.ts](src/utils/supabase/middleware.ts): Middleware helper `updateSession` untuk menyinkronkan session Supabase pada request.

Pastikan variabel lingkungan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` tersedia untuk menjalankan fungsionalitas ini.
