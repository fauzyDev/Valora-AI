/**
 * @file rate-limiter.ts
 * @description Implementasi rate limiter sederhana berbasis memori (Map).
 * Catatan: Gunakan Redis untuk lingkungan produksi dengan skala horizontal.
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitEntry>();

// Pembersihan berkala entri yang kedaluwarsa untuk mencegah kebocoran memori
const CLEANUP_INTERVAL = 60_000; // 1 menit
let lastCleanup = Date.now();

/**
 * Menghapus entri rate limit yang sudah melewati waktu reset.
 */
function cleanupExpiredEntries() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;

  lastCleanup = now;

  // Mencegah memory leak dengan membatasi ukuran Map jika diserang ribuan IP (Fail-Open Best Effort)
  if (store.size > 5000) {
    store.clear();
    return;
  }

  for (const [key, entry] of store) {
    if (now > entry.resetTime) {
      store.delete(key);
    }
  }
}

/**
 * Memeriksa apakah sebuah pengenal (misal: IP atau User ID) telah melebihi batas permintaan.
 * Default: 5 permintaan per menit.
 * 
 * @param {string} identifier Pengenal unik untuk subjek yang dibatasi.
 * @param {number} [limit=5] Jumlah maksimal permintaan dalam jendela waktu.
 * @param {number} [windowMs=60000] Durasi jendela waktu dalam milidetik.
 * @returns {{ success: boolean, remaining: number, reset: number }} Objek status rate limit.
 */
export function checkRateLimit(identifier: string, limit: number = 5, windowMs: number = 60000): {
  success: boolean;
  remaining: number;
  reset: number;
} {
  const now = Date.now();

  cleanupExpiredEntries();
  
  const existing = store.get(identifier);

  // Jika entri belum ada atau sudah kedaluwarsa, buat entri baru
  if (!existing || now > existing.resetTime) {
    store.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });

    return {
      success: true,
      remaining: limit - 1,
      reset: now + windowMs,
    };
  }

  // Tambah hit count
  existing.count++;

  const isAllowed = existing.count <= limit;
  
  return {
    success: isAllowed,
    remaining: Math.max(0, limit - existing.count),
    reset: existing.resetTime,
  };
}
