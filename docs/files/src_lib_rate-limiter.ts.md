 # src/lib/rate-limiter.ts

 [Lihat sumber](src/lib/rate-limiter.ts)

 Ringkasan:

 Utilities untuk pembatasan laju (rate limiting), biasanya digunakan oleh API route untuk mencegah penyalahgunaan.

 Ekspor:

 - `rateLimiter` — fungsi/objek untuk memeriksa dan mencatat permintaan.
# src/lib/rate-limiter.ts

[Lihat sumber](src/lib/rate-limiter.ts)

Ringkasan:

Rate limiter sederhana berbasis memori (Map) untuk pengembangan. Tidak cocok untuk skala horizontal.

Ekspor:

- `checkRateLimit(identifier: string, limit?: number, windowMs?: number)` — memeriksa dan mengembalikan status rate limit.
