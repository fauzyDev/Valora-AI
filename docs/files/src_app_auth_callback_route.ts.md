# src/app/auth/callback/route.ts

[Lihat sumber](src/app/auth/callback/route.ts)

Ringkasan:

Route handler untuk callback OAuth (Google). Menukar `code` menjadi session Supabase dan mengarahkan pengguna kembali ke aplikasi.

Ekspor:

- `GET(request)` — handler GET untuk callback OAuth.
