/**
 * @file router.ts
 * @description Orchestrator utama untuk sistem AI Velora.
 *
 * Satu entry point yang menangani:
 *   1. Deteksi kompleksitas prompt (termasuk multi-turn awareness)
 *   2. Pemilihan model yang tepat
 *   3. Streaming dengan fallback otomatis
 *
 * API routes cukup memanggil `routeAndStream()` — semua logika
 * routing dan fallback ditangani secara internal.
 */

import { detectComplexity } from "./detect";
import { MODELS } from "./models";
import { streamWithFallback } from "./fallback";
import { ChatMessage } from "./providers/gemini";

/**
 * Entry point utama untuk mendapatkan stream respons AI.
 *
 * Mendeteksi kompleksitas prompt secara otomatis, memilih model
 * yang optimal, dan menjalankan streaming dengan fallback.
 *
 * @param message Pesan pengguna (sudah termasuk konteks dokumen jika ada).
 * @param history Riwayat percakapan sebelumnya.
 * @param hasAttachments Apakah permintaan ini memiliki lampiran file.
 * @returns ReadableStream<Uint8Array> berisi respons AI.
 */
export async function routeAndStream(
  message: string,
  history: ChatMessage[] = [],
  hasAttachments: boolean = false
): Promise<ReadableStream<Uint8Array>> {
  const startTime = Date.now();

  // 1. Deteksi kompleksitas (dengan panjang history untuk multi-turn awareness)
  const complexity = detectComplexity(message, hasAttachments, history.length);

  // 2. Pilih model berdasarkan kompleksitas
  const selectedModel = MODELS[complexity];

  const routingMs = Date.now() - startTime;
  console.log(
    `[Velora AI] Routing: complexity=${complexity} → model=${selectedModel.name} (${selectedModel.id}) [${routingMs}ms]`
  );

  // 3. Stream dengan fallback otomatis
  return streamWithFallback(message, history, selectedModel.id);
}
