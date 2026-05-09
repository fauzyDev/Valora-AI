/**
 * @file providers/openrouter.ts
 * @description Wrapper bersih untuk OpenRouter SDK.
 *
 * Menyediakan fungsi `createOpenRouterStream` yang menerima model ID,
 * pesan, riwayat, dan system instruction, lalu mengembalikan ReadableStream
 * teks standar.
 */

import { OpenRouter } from "@openrouter/sdk";
import { ChatMessage } from "./gemini";

const apiKey = process.env.SECRET_OPENROUTER_API_KEY;

if (!apiKey) {
  console.warn("[Velora AI] WARNING: OPENROUTER_API_KEY is not set.");
}

const openRouter = apiKey
  ? new OpenRouter({
      apiKey,
      httpReferer: "https://velora-ai.local",
      appTitle: "Velora AI",
    })
  : null;

/**
 * Menormalisasi riwayat chat ke format yang diharapkan OpenRouter (OpenAI-compatible).
 *
 * @param history Array pesan riwayat chat.
 * @param message Pesan user terbaru.
 * @param systemInstruction System instruction.
 * @returns Array of messages.
 */
function formatHistory(history: ChatMessage[], message: string, systemInstruction: string) {
  const formatted: Array<{ role: string; content: string }> = [];

  if (systemInstruction) {
    formatted.push({ role: "system", content: systemInstruction });
  }

  for (const msg of history) {
    formatted.push({ role: msg.role, content: msg.content || " " });
  }

  formatted.push({ role: "user", content: message });

  return formatted;
}

/**
 * Membuat ReadableStream dari respons streaming OpenRouter.
 *
 * @param modelId ID model OpenRouter yang akan digunakan.
 * @param message Pesan pengguna saat ini.
 * @param history Riwayat percakapan sebelumnya.
 * @param systemInstruction System instruction untuk kepribadian AI.
 * @returns ReadableStream<Uint8Array> berisi potongan teks respons.
 * @throws Error jika API key tidak tersedia atau model gagal.
 */
export async function createOpenRouterStream(
  modelId: string,
  message: string,
  history: ChatMessage[] = [],
  systemInstruction: string
): Promise<ReadableStream<Uint8Array>> {
  if (!openRouter) {
    throw new Error("OpenRouter API key is not configured.");
  }

  const messages = formatHistory(history, message, systemInstruction);
  const encoder = new TextEncoder();

  const completionStream = await openRouter.chat.send({
    chatRequest: {
      model: modelId,
      messages: messages as any,
      stream: true,
    }
  });

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of completionStream) {
          const text = chunk.choices?.[0]?.delta?.content;
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close();
      }
    },
  });
}
