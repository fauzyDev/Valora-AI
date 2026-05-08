# src/app/api/data/route.ts

[Lihat sumber](src/app/api/data/route.ts)

Ringkasan:

Endpoint API yang menangani rate-limiting, caching (Redis), deduplikasi (locks), dan streaming respons AI kembali ke klien.

Ekspor:

- `POST(req)` — handler POST untuk memproses permintaan AI.
