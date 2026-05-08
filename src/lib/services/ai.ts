/**
 * @file services/ai.ts
 * @description Layanan utama untuk integrasi multi-model AI (Gemini, OpenRouter, dll).
 *
 * Menyediakan satu fungsi `streamChat()` sebagai entry point tunggal yang
 * menangani seluruh pipeline AI secara internal:
 *
 *   1. Ekstraksi teks dari lampiran file (PDF, DOCX, TXT)
 *   2. Chunking dan pemilihan konteks yang relevan
 *   3. Pembangunan prompt kontekstual
 *   4. Routing otomatis ke model Gemini yang tepat berdasarkan kompleksitas
 *   5. Streaming respons dengan fallback otomatis
 *
 * Pemanggil (API routes) cukup memanggil `streamChat()` — semua
 * kompleksitas internal ditangani secara transparan.
 *
 * Environment variable yang diperlukan:
 *   - `SECRET_GEMINI_API_KEY`
 */

import { routeAndStream } from "@/lib/ai/router";
import { buildContextualPrompt } from "@/lib/ai/prompt";
import { downloadFile } from "@/lib/file";
import { extractText } from "@/lib/extract";
import { chunkText, selectRelevantChunks } from "@/lib/chunk";

/** Re-export tipe ChatMessage agar consumer tidak perlu menjangkau ke internal */
export type { ChatMessage } from "@/lib/ai/providers/gemini";

/** Input lampiran file yang diterima dari API request */
export interface AttachmentInput {
  file_url?: string;
  path?: string;
  file_type?: string;
  file_name?: string;
}

/**
 * Memproses lampiran file: download → extract → chunk → select relevant.
 *
 * @param attachments Array lampiran file dari request.
 * @returns Teks konteks gabungan dari semua lampiran, atau string kosong.
 */
async function processAttachments(attachments: AttachmentInput[]): Promise<string> {
  if (!attachments || attachments.length === 0) return "";

  const extractionPromises = attachments.map(async (file) => {
    try {
      const filePath = file.path || file.file_url;
      if (!filePath) {
        console.warn(`[Valora AI] Skipping attachment without path: ${file.file_name}`);
        return "";
      }

      console.log(`[Valora AI] Processing attachment: ${file.file_name || filePath}`);

      const buffer = await downloadFile(filePath);
      const fullText = await extractText(buffer, file.file_type || "");
      const chunks = chunkText(fullText);
      return selectRelevantChunks(chunks, 3);
    } catch (err) {
      console.error(
        `[Valora AI] Failed to process file ${file.file_name || "unknown"}:`,
        err
      );
      return "";
    }
  });

  const extractedTexts = await Promise.all(extractionPromises);
  return extractedTexts.filter((t) => t !== "").join("\n\n---\n\n");
}

/**
 * Entry point utama untuk streaming respons AI.
 *
 * Menangani seluruh pipeline secara internal:
 * - Ekstraksi teks dari lampiran (jika ada)
 * - Pembangunan prompt kontekstual
 * - Routing ke model yang tepat berdasarkan kompleksitas
 * - Streaming dengan fallback otomatis
 *
 * @param message Pesan pengguna.
 * @param history Riwayat percakapan sebelumnya (opsional).
 * @param attachments Array lampiran file (opsional).
 * @returns ReadableStream<Uint8Array> berisi respons AI yang di-stream.
 *
 * @example
 * ```ts
 * const stream = await streamChat("Explain React hooks", history, []);
 * return new Response(stream, { headers: { "Content-Type": "text/plain" } });
 * ```
 */
export async function streamChat(
  message: string,
  history: { role: "user" | "assistant"; content: string }[] = [],
  attachments: AttachmentInput[] = []
): Promise<ReadableStream<Uint8Array>> {
  const startTime = Date.now();
  const hasAttachments = attachments.length > 0;

  // 1. Proses lampiran file (jika ada)
  let context = "";
  if (hasAttachments) {
    context = await processAttachments(attachments);
    console.log(
      `[Valora AI] Extracted context from ${attachments.length} file(s): ${context.length} chars`
    );
  }

  // 2. Bangun prompt kontekstual
  const finalPrompt = buildContextualPrompt(message, context);

  // 3. Route dan stream (deteksi → pemilihan model → fallback → streaming)
  const stream = await routeAndStream(finalPrompt, history, hasAttachments);

  const totalMs = Date.now() - startTime;
  console.log(`[Valora AI] Pipeline ready in ${totalMs}ms (streaming started)`);

  return stream;
}
