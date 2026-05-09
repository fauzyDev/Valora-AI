/**
 * @file providers/gemini.ts
 * @description Wrapper bersih untuk Google Generative AI SDK.
 *
 * Menyediakan satu fungsi `createGeminiStream` yang menerima model ID,
 * pesan, riwayat, dan system instruction, lalu mengembalikan ReadableStream
 * teks standar.
 */

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const apiKey = process.env.SECRET_GEMINI_API_KEY;

if (!apiKey) {
  console.warn("[Velora AI] WARNING: SECRET_GEMINI_API_KEY is not set.");
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

/** Format pesan chat standar */
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/** Safety settings yang konsisten */
const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

/**
 * Menormalisasi riwayat chat ke format yang diharapkan Gemini.
 * Gemini mengharuskan peran yang bergantian: user → model → user → model.
 *
 * @param history Array pesan riwayat chat.
 * @returns Riwayat yang sudah diformat untuk Gemini SDK.
 */
function formatHistory(history: ChatMessage[]) {
  const formatted = [];
  let lastRole: string | null = null;

  for (const msg of history) {
    const role = msg.role === "assistant" ? "model" : "user";

    if (role === lastRole && formatted.length > 0) {
      // Gabungkan pesan berturut-turut dari peran yang sama
      formatted[formatted.length - 1].parts[0].text += "\n\n" + msg.content;
      continue;
    }

    formatted.push({
      role,
      parts: [{ text: msg.content || " " }],
    });
    lastRole = role;
  }

  // Gemini sendMessageStream mengirim pesan 'user', jadi history harus
  // diakhiri dengan pesan 'model' agar peran tetap bergantian
  if (formatted.length > 0 && formatted[formatted.length - 1].role === "user") {
    formatted.pop();
  }

  return formatted;
}

/**
 * Membuat ReadableStream dari respons streaming Gemini.
 *
 * @param modelId ID model Gemini yang akan digunakan.
 * @param message Pesan pengguna saat ini.
 * @param history Riwayat percakapan sebelumnya.
 * @param systemInstruction System instruction untuk kepribadian AI.
 * @returns ReadableStream<Uint8Array> berisi potongan teks respons.
 * @throws Error jika API key tidak tersedia atau model gagal.
 */
export async function createGeminiStream(
  modelId: string,
  message: string,
  history: ChatMessage[] = [],
  systemInstruction: string
): Promise<ReadableStream<Uint8Array>> {
  if (!genAI) {
    throw new Error("Gemini API key is not configured.");
  }

  const model = genAI.getGenerativeModel({
    model: modelId,
    systemInstruction,
    safetySettings: SAFETY_SETTINGS,
  });

  const formattedHistory = formatHistory(history);
  const encoder = new TextEncoder();

  // Pilih mode: chat (dengan history) atau single message
  const result = formattedHistory.length > 0
    ? await model.startChat({ history: formattedHistory }).sendMessageStream(message)
    : await model.generateContentStream(message);

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of result.stream) {
          const text = chunk.text();
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
