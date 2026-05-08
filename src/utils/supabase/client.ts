/**
 * utils/supabase/client.ts
 *
 * Helper untuk membuat instance Supabase di sisi browser (client).
 * Menggunakan `createBrowserClient` agar autentikasi dapat berjalan di
 * kode client-side seperti komponen yang memanggil Supabase langsung.
 */

import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
