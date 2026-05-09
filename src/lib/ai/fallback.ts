/**
 * @file fallback.ts
 * @description Mekanisme fallback otomatis untuk streaming AI.
 *
 * Jika model yang dipilih gagal (error, rate limit, timeout),
 * sistem akan secara transparan beralih ke model berikutnya
 * dalam fallback chain tanpa sepengetahuan pengguna.
 *
 * Fitur:
 *   - Timeout per model (default 30 detik)
 *   - Kategorisasi error terstruktur
 *   - Logging detail untuk debugging
 */

import { getFallbackChain, getModelById } from "./models";
import { createGeminiStream, ChatMessage } from "./providers/gemini";
import { createOpenRouterStream } from "./providers/openrouter";
import { buildSystemInstruction } from "./prompt";

/** Timeout default per model dalam milidetik */
const MODEL_TIMEOUT_MS = 30_000;

/** Kategori error untuk logging yang lebih jelas */
type ErrorCategory = "rate_limit" | "timeout" | "server_error" | "unknown";

/**
 * Mengkategorisasi error berdasarkan pesan atau propertinya.
 */
function categorizeError(err: Error): ErrorCategory {
  const msg = err.message.toLowerCase();

  if (msg.includes("429") || msg.includes("rate limit") || msg.includes("quota")) {
    return "rate_limit";
  }
  if (msg.includes("timeout") || msg.includes("aborted") || msg.includes("deadline")) {
    return "timeout";
  }
  if (msg.includes("500") || msg.includes("503") || msg.includes("server") || msg.includes("internal")) {
    return "server_error";
  }
  return "unknown";
}

/**
 * Membungkus promise dengan timeout.
 * Jika promise tidak selesai dalam durasi yang ditentukan, akan di-reject.
 *
 * @param promise Promise yang akan dibungkus.
 * @param timeoutMs Batas waktu dalam milidetik.
 * @param modelId ID model untuk pesan error.
 * @returns Promise yang sama, tetapi dengan batas waktu.
 */
function withTimeout<T>(promise: Promise<T>, timeoutMs: number, modelId: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timeout after ${timeoutMs}ms for model ${modelId}`));
    }, timeoutMs);

    promise
      .then((result) => {
        clearTimeout(timer);
        resolve(result);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

/**
 * Mencoba mendapatkan stream dari model dalam fallback chain.
 * Jika model pertama gagal, otomatis mencoba model berikutnya.
 *
 * @param message Pesan pengguna.
 * @param history Riwayat percakapan.
 * @param startModelId Model awal yang dipilih oleh router.
 * @param timeoutMs Batas waktu per model (default: 30 detik).
 * @returns ReadableStream<Uint8Array> dari model yang berhasil merespons.
 * @throws Error jika semua model dalam chain gagal.
 */
export async function streamWithFallback(
  message: string,
  history: ChatMessage[] = [],
  startModelId: string,
  timeoutMs: number = MODEL_TIMEOUT_MS
): Promise<ReadableStream<Uint8Array>> {
  const chain = getFallbackChain(startModelId);
  const systemInstruction = buildSystemInstruction();
  let lastError: Error | null = null;

  for (let i = 0; i < chain.length; i++) {
    const modelId = chain[i];
    const isLastModel = i === chain.length - 1;
    const modelInfo = getModelById(modelId);

    try {
      console.log(
        `[Velora AI] Trying model: ${modelId}${i > 0 ? ` (fallback #${i})` : ""}`
      );

      // Pastikan model Info ditemukan
      if (!modelInfo) {
        throw new Error(`Model info not found for ID: ${modelId}`);
      }

      let streamPromise: Promise<ReadableStream<Uint8Array>>;
      if (modelInfo.provider === "openrouter") {
        streamPromise = createOpenRouterStream(modelId, message, history, systemInstruction);
      } else {
        streamPromise = createGeminiStream(modelId, message, history, systemInstruction);
      }

      const stream = await withTimeout(
        streamPromise,
        timeoutMs,
        modelId
      );

      console.log(`[Velora AI] ✓ Success with model: ${modelId}`);
      return stream;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      const category = categorizeError(lastError);

      console.warn(
        `[Velora AI] ✗ Model ${modelId} failed [${category}]: ${lastError.message}`
      );

      if (!isLastModel) {
        console.log(`[Velora AI] → Falling back to next model...`);
      }
      // Lanjut ke model berikutnya
    }
  }

  // Semua model gagal
  const category = lastError ? categorizeError(lastError) : "unknown";
  let userFriendlyMessage = "Maaf, semua layanan AI sedang sibuk saat ini. Silakan coba beberapa saat lagi.";

  if (category === "rate_limit") {
    userFriendlyMessage = "Batas penggunaan (quota) AI telah tercapai. Mohon tunggu sejenak sebelum mencoba lagi.";
  } else if (category === "timeout") {
    userFriendlyMessage = "Koneksi ke layanan AI terputus karena terlalu lama merespons. Silakan coba lagi.";
  } else if (category === "server_error") {
    userFriendlyMessage = "Layanan AI sedang mengalami gangguan teknis (High Demand). Mohon tunggu beberapa menit.";
  }

  throw new Error(userFriendlyMessage);
}
