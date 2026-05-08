/**
 * @file redis.ts
 * @description Helper Redis wrapper menggunakan Upstash untuk caching, rate limiting, dan deduplikasi.
 */

import { Redis } from '@upstash/redis';
import crypto from 'crypto';

// Inisialisasi klien Redis hanya jika variabel lingkungan tersedia
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

export const redis = redisUrl && redisToken ? new Redis({
  url: redisUrl,
  token: redisToken,
}) : null;

/**
 * Menghasilkan cache key yang konsisten berdasarkan pesan pengguna, riwayat, dan lampiran.
 * 
 * @param {string} message Pesan teks utama.
 * @param {any[]} [history=[]] Riwayat percakapan.
 * @param {any[]} [attachments=[]] Lampiran file.
 * @returns {string} Hash SHA-256 sebagai kunci cache.
 */
export function generateCacheKey(message: string, history: any[] = [], attachments: any[] = []): string {
  const payload = JSON.stringify({ message, history, attachments });
  return crypto.createHash('sha256').update(payload).digest('hex');
}

/**
 * Mengambil respons AI yang tersimpan di cache.
 * 
 * @param {string} key Kunci cache hasil generateCacheKey.
 * @returns {Promise<string | null>} Respons yang dicache atau null jika tidak ada.
 */
export async function getCachedResponse(key: string): Promise<string | null> {
  if (!redis) return null;
  try {
    const cached = await redis.get<string>(key);
    return cached;
  } catch (error) {
    console.error("Redis get error:", error);
    return null;
  }
}

/**
 * Menyimpan respons AI ke dalam cache.
 * 
 * @param {string} key Kunci cache.
 * @param {string} value Isi respons AI yang akan disimpan.
 * @param {number} [ttlSeconds=3600] Waktu hidup cache dalam detik (default 1 jam).
 */
export async function setCachedResponse(key: string, value: string, ttlSeconds: number = 3600): Promise<void> {
  if (!redis) return;
  try {
    await redis.set(key, value, { ex: ttlSeconds });
  } catch (error) {
    console.error("Redis set error:", error);
  }
}

/**
 * Mekanisme penguncian (locking) untuk mencegah pemrosesan ganda pada permintaan yang sama.
 * Menggunakan perintah SET NX (Set if Not Exists).
 * 
 * @param {string} key Kunci permintaan.
 * @param {number} [lockTtlSeconds=60] Durasi penguncian maksimal dalam detik.
 * @returns {Promise<boolean | null>} True jika berhasil mendapatkan kunci, false jika sudah terkunci, null jika Redis error.
 */
export async function acquireLock(key: string, lockTtlSeconds: number = 60): Promise<boolean | null> {
  if (!redis) return false;
  try {
    const lockKey = `lock:${key}`;
    const result = await redis.set(lockKey, "1", { nx: true, ex: lockTtlSeconds });
    return result === "OK";
  } catch (error) {
    console.error("Redis acquire lock error:", error);
    return null; // Mengembalikan null agar API Route tahu ini error (Fail-Open)
  }
}

/**
 * Melepaskan kunci setelah proses selesai.
 * 
 * @param {string} key Kunci permintaan.
 */
export async function releaseLock(key: string): Promise<void> {
  if (!redis) return;
  try {
    const lockKey = `lock:${key}`;
    await redis.del(lockKey);
  } catch (error) {
    console.error("Redis release lock error:", error);
  }
}

/**
 * Menunggu hasil respons dari cache dengan polling jika permintaan sedang dikunci oleh proses lain.
 * 
 * @param {string} key Kunci permintaan.
 * @param {number} [maxWaitMs=5000] Waktu tunggu maksimal dalam milidetik.
 * @param {number} [pollIntervalMs=500] Interval pengecekan ulang.
 * @returns {Promise<string | null>} Respons dari cache atau null jika timeout.
 */
export async function waitForCachedResponse(key: string, maxWaitMs: number = 5000, pollIntervalMs: number = 500): Promise<string | null> {
  if (!redis) return null;
  
  const startTime = Date.now();
  while (Date.now() - startTime < maxWaitMs) {
    const cached = await getCachedResponse(key);
    if (cached) return cached;
    
    const lockKey = `lock:${key}`;
    const isLocked = await redis.exists(lockKey);
    if (!isLocked) {
      // Kunci sudah dilepas tapi cache kosong? Mungkin proses sebelumnya gagal.
      break;
    }
    
    await new Promise(resolve => setTimeout(resolve, pollIntervalMs));
  }
  
  return null;
}
