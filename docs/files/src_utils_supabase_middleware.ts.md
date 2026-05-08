 # src/utils/supabase/middleware.ts

 [Lihat sumber](src/utils/supabase/middleware.ts)

 Ringkasan:

 Middleware untuk menyisipkan session Supabase ke request/response (SSR) sehingga route dan halaman server dapat mengakses user session secara konsisten.

 Ekspor:

 - `middleware` — fungsi middleware Next.js untuk sinkronisasi session.
# src/utils/supabase/middleware.ts

[Lihat sumber](src/utils/supabase/middleware.ts)

Ringkasan:

Middleware helper yang menyinkronkan session Supabase pada request masuk. Digunakan oleh `proxy` untuk menjaga session konsisten antara edge/middleware dan server.

Ekspor:

- `updateSession(request)` — memperbarui session dan mengembalikan `NextResponse`.
