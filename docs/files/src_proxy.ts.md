 # src/proxy.ts

 [Lihat sumber](src/proxy.ts)

 Ringkasan:

 Proxy utilitas untuk meneruskan permintaan ke layanan eksternal (digunakan untuk route yang memerlukan proxied requests atau pengamanan kunci API).

 Ekspor:

 - `proxyFetch` — wrapper fetch yang menambahkan header dan validasi.
# src/proxy.ts

[Lihat sumber](src/proxy.ts)

Ringkasan:

Middleware proxy yang meneruskan request ke helper `updateSession` untuk menyelaraskan sesi Supabase. Menyertakan konfigurasi `matcher` untuk mengecualikan file statis/asset.

Ekspor:

- `proxy(request)` — fungsi middleware.
- `config` — objek konfigurasi `matcher` untuk middleware Next.js.
