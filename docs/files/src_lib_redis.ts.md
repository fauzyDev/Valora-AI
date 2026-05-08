 # src/lib/redis.ts

 [Lihat sumber](src/lib/redis.ts)

 Ringkasan:

 Inisialisasi client Upstash Redis (opsional) dan utilitas caching serta locking yang dipakai oleh route API untuk deduplikasi dan cache hasil AI.

 Ekspor:

 - Fungsi caching: `getCachedResponse`, `setCachedResponse`.
 - Fungsi lock: `acquireLock`, `releaseLock`, `waitForCachedResponse`.
# src/lib/redis.ts

[Lihat sumber](src/lib/redis.ts)

Ringkasan:

Helper Upstash Redis untuk caching, lock, dan polling respons. Menginisialisasi client jika variabel environment tersedia.

Ekspor:

- `redis` — instance Redis atau `null` jika konfigurasi tidak lengkap.
- `generateCacheKey(message, history)` — membuat hash key untuk caching.
- `getCachedResponse`, `setCachedResponse`, `acquireLock`, `releaseLock`, `waitForCachedResponse`.
