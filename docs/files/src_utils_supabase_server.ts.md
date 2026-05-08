 # src/utils/supabase/server.ts

 [Lihat sumber](src/utils/supabase/server.ts)

 Ringkasan:

 Helper server-side untuk membuat klien Supabase yang terikat ke konteks server (menggunakan cookie dan environment variables). Digunakan di route dan server components.

 Ekspor:

 - `createServerSupabaseClient` — membuat instance Supabase untuk eksekusi server.
# src/utils/supabase/server.ts

[Lihat sumber](src/utils/supabase/server.ts)

Ringkasan:

Helper untuk membuat instance Supabase pada lingkungan server-side (SSR). Menggunakan cookie store Next.js untuk membaca cookie sesi.

Ekspor:

- `createClient()` — membuat dan mengembalikan instance Supabase server-side.
