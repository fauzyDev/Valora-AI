/**
 * @file models.ts
 * @description Definisi model AI yang tersedia dan konfigurasi fallback chain.
 *
 * Tiga tier model:
 *   - simple         → cepat, biaya rendah (misal: Gemini Flash Lite)
 *   - medium         → kemampuan menengah (misal: Claude 3 Haiku)
 *   - complex        → penalaran terkuat, biaya lebih tinggi (misal: GPT-4o)
 */

/** Tingkat kompleksitas prompt yang terdeteksi */
export type Complexity = "simple" | "medium" | "complex";

export type AIProvider = "gemini" | "openrouter";

/** Metadata untuk sebuah model AI */
export interface AIModel {
  id: string;
  name: string;
  tier: Complexity;
  provider: AIProvider;
}

/**
 * Daftar model default per tier.
 */
export const MODELS: Record<Complexity, AIModel> = {
  simple: {
    id: "gemini-3.1-flash-lite-preview",
    name: "Gemini 3.1 Flash Lite",
    tier: "simple",
    provider: "gemini",
  },
  medium: {
    id: "gemini-3-flash-preview",
    name: "Gemini 3 Flash Preview",
    tier: "medium",
    provider: "gemini",
  },
  complex: {
    id: "openai/gpt-oss-120b:free",
    name: "GPT OSS 120b",
    tier: "complex",
    provider: "openrouter",
  },
};

export const ALL_MODELS: AIModel[] = [
  MODELS.simple,
  MODELS.medium,
  MODELS.complex,
  {
    id: "gemini-3-flash-preview",
    name: "Gemini 3 Flash Preview",
    tier: "medium",
    provider: "gemini",
  },
  {
    id: "openai/gpt-oss-120b:free",
    name: "Gemma 4 31b It",
    tier: "complex",
    provider: "openrouter",
  }
];

/**
 * Mendapatkan informasi model berdasarkan ID.
 */
export function getModelById(id: string): AIModel | undefined {
  return ALL_MODELS.find(m => m.id === id);
}

/**
 * Urutan fallback saat model gagal.
 * Menggabungkan provider OpenRouter dan Gemini.
 */
export const FALLBACK_CHAIN: string[] = [
  "openai/gpt-oss-120b:free",
  "gemini-3-flash-preview",
  "gemini-3.1-flash-lite-preview",
];

/**
 * Mendapatkan fallback chain yang dimulai dari model tertentu.
 *
 * @param startModelId Model awal yang dipilih oleh router.
 * @returns Array model ID untuk dicoba secara berurutan.
 */
export function getFallbackChain(startModelId: string): string[] {
  const startIndex = FALLBACK_CHAIN.indexOf(startModelId);

  // Jika model ditemukan, mulai dari situ; jika tidak, coba semua
  if (startIndex !== -1) {
    return FALLBACK_CHAIN.slice(startIndex);
  }
  return FALLBACK_CHAIN;
}
