/**
 * @file rate-limiter.ts
 * @description Implementasi rate limiter terdistribusi menggunakan Redis (Upstash)
 * dengan fallback ke memori lokal jika Redis tidak tersedia.
 */

import { redis } from "./redis";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// Fallback store untuk memori lokal (jika Redis mati atau tidak dikonfigurasi)
const localStore = new Map<string, RateLimitEntry>();
const CLEANUP_INTERVAL = 60_000;
let lastCleanup = Date.now();

function cleanupLocalStore() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  if (localStore.size > 5000) {
    localStore.clear();
    return;
  }

  for (const [key, entry] of localStore) {
    if (now > entry.resetTime) {
      localStore.delete(key);
    }
  }
}

/**
 * Memeriksa apakah sebuah pengenal (IP/User ID) telah melebihi batas.
 * Menggunakan Redis INCR + EXPIRE untuk presisi di lingkungan terdistribusi.
 */
export async function checkRateLimit(
  identifier: string, 
  limit: number = 10, 
  windowMs: number = 60000
): Promise<{
  success: boolean;
  remaining: number;
  reset: number;
}> {
  const now = Date.now();
  const key = `ratelimit:${identifier}`;

  // 1. Coba menggunakan Redis jika tersedia
  if (redis) {
    try {
      const current = await redis.incr(key);
      
      // Jika ini request pertama (count == 1), atur waktu kedaluwarsa
      if (current === 1) {
        await redis.pexpire(key, windowMs);
      }

      const pttl = await redis.pttl(key);
      const resetTime = pttl > 0 ? now + pttl : now + windowMs;

      return {
        success: current <= limit,
        remaining: Math.max(0, limit - current),
        reset: resetTime,
      };
    } catch (error) {
      console.error("[Velora AI] Redis Rate Limiter Error, falling back to local memory:", error);
      // Lanjut ke fallback di bawah jika Redis gagal
    }
  }

  // 2. Fallback ke Memori Lokal (untuk serverless instance tunggal atau saat Redis down)
  cleanupLocalStore();
  
  const existing = localStore.get(identifier);

  if (!existing || now > existing.resetTime) {
    localStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });

    return {
      success: true,
      remaining: limit - 1,
      reset: now + windowMs,
    };
  }

  existing.count++;
  const isAllowed = existing.count <= limit;
  
  return {
    success: isAllowed,
    remaining: Math.max(0, limit - existing.count),
    reset: existing.resetTime,
  };
}

