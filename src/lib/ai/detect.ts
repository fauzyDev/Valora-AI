/**
 * @file detect.ts
 * @description Mendeteksi tingkat kompleksitas prompt pengguna secara otomatis.
 *
 * Menggunakan heuristik berbasis:
 *   - Panjang prompt
 *   - Kata kunci (coding, analisis, penalaran) — EN + ID
 *   - Keberadaan lampiran file
 *   - Panjang riwayat percakapan (multi-turn awareness)
 *   - Pola blok kode dan kode inline
 */

import { Complexity } from "./models";

/** Kata kunci yang mengindikasikan tugas coding/teknis */
const CODING_KEYWORDS = [
  // English
  "code", "function", "algorithm", "debug", "error", "bug",
  "implement", "refactor", "class", "component", "api",
  "database", "sql", "typescript", "javascript", "python",
  "react", "next.js", "css", "html", "regex", "deploy",
  "docker", "git", "test", "unit test", "webpack", "vite",
  "async", "promise", "callback", "recursion", "loop",
  // Indonesian
  "kode", "fungsi", "program", "galat", "komponen",
  "basis data", "uji coba", "variabel", "tipe data",
];

/** Kata kunci yang mengindikasikan tugas analisis/penalaran berat */
const ANALYSIS_KEYWORDS = [
  // English
  "analyze", "analysis", "compare", "evaluate", "review",
  "explain in detail", "step by step", "pros and cons",
  "architecture", "design pattern", "trade-off", "optimize",
  "performance", "security", "scalability", "migration",
  "strategy", "plan", "comprehensive", "in-depth",
  // Indonesian
  "analisis", "analisa", "bandingkan", "evaluasi", "tinjau",
  "jelaskan secara detail", "langkah demi langkah",
  "kelebihan dan kekurangan", "arsitektur", "strategi",
  "optimasi", "keamanan", "skalabilitas", "migrasi",
  "mendalam", "komprehensif", "rancang", "rencana",
];

/** Kata kunci yang mengindikasikan tugas sederhana/ringan */
const SIMPLE_KEYWORDS = [
  // English
  "hi", "hello", "hey", "thanks", "thank you", "ok", "yes", "no",
  "what is", "who is", "define", "translate", "convert",
  // Indonesian
  "halo", "hai", "terima kasih", "makasih", "oke", "ya", "tidak",
  "apa itu", "siapa", "definisi", "terjemahkan", "ubah",
];

/**
 * Menghitung berapa banyak kata kunci dari daftar yang muncul dalam teks.
 *
 * @param text Teks yang diperiksa (sudah di-lowercase).
 * @param keywords Daftar kata kunci untuk dicocokkan.
 * @returns Jumlah kecocokan.
 */
function countKeywordMatches(text: string, keywords: string[]): number {
  return keywords.reduce((count, kw) => {
    return count + (text.includes(kw) ? 1 : 0);
  }, 0);
}

/**
 * Mendeteksi apakah prompt mengandung pola kode (blok kode atau kode inline).
 *
 * @param text Teks prompt (case-insensitive).
 * @returns true jika pola kode ditemukan.
 */
function hasCodePatterns(text: string): boolean {
  // Blok kode fenced (```)
  if (text.includes("```")) return true;

  // Kode inline (`...`)
  const inlineCodePattern = /`[^`]+`/;
  if (inlineCodePattern.test(text)) return true;

  // Pola umum kode: arrow functions, import/export, kurung kurawal yang banyak
  const codeStructurePatterns = [
    /=>/,                        // arrow function
    /\bimport\s+\{/,            // ES import
    /\bexport\s+(default|const|function)/,  // ES export
    /\bconst\s+\w+\s*=/,        // const declaration
    /\blet\s+\w+\s*=/,          // let declaration
    /\bfunction\s+\w+\s*\(/,    // function declaration
    /\bif\s*\(.*\)\s*\{/,       // if statement
    /\bfor\s*\(.*\)\s*\{/,      // for loop
  ];

  return codeStructurePatterns.some((pattern) => pattern.test(text));
}

/**
 * Mendeteksi kompleksitas prompt berdasarkan konten dan konteks.
 *
 * @param prompt Teks prompt dari pengguna.
 * @param hasAttachments Apakah ada lampiran file (PDF/DOC).
 * @param historyLength Jumlah pesan dalam riwayat percakapan.
 * @returns Tingkat kompleksitas: "simple", "medium", atau "complex".
 */
export function detectComplexity(
  prompt: string,
  hasAttachments: boolean = false,
  historyLength: number = 0
): Complexity {
  const lower = prompt.toLowerCase().trim();
  const wordCount = lower.split(/\s+/).length;

  // Skor dimulai dari 0
  let score = 0;

  // --- Faktor 1: Panjang prompt ---
  if (wordCount <= 5)        score -= 2;  // sangat pendek
  else if (wordCount <= 20)  score += 0;  // normal
  else if (wordCount <= 80)  score += 2;  // agak panjang
  else if (wordCount <= 200) score += 4;  // panjang
  else                       score += 6;  // sangat panjang

  // --- Faktor 2: Kata kunci sederhana ---
  const simpleMatches = countKeywordMatches(lower, SIMPLE_KEYWORDS);
  if (simpleMatches > 0 && wordCount <= 10) {
    score -= 3;
  }

  // --- Faktor 3: Kata kunci coding ---
  const codingMatches = countKeywordMatches(lower, CODING_KEYWORDS);
  score += codingMatches * 2;

  // --- Faktor 4: Kata kunci analisis ---
  const analysisMatches = countKeywordMatches(lower, ANALYSIS_KEYWORDS);
  score += analysisMatches * 2;

  // --- Faktor 5: Keberadaan lampiran file ---
  if (hasAttachments) {
    score += 3; // Dokumen biasanya membutuhkan analisis lebih dalam
  }

  // --- Faktor 6: Pola kode (blok + inline) ---
  if (hasCodePatterns(lower)) {
    score += 3;
  }

  // --- Faktor 7: Panjang riwayat percakapan (multi-turn) ---
  // Percakapan panjang biasanya berarti tugas yang lebih kompleks
  if (historyLength > 20)      score += 3;
  else if (historyLength > 10) score += 2;
  else if (historyLength > 5)  score += 1;

  // --- Klasifikasi ---
  if (score <= 0)  return "simple";
  if (score <= 5)  return "medium";
  return "complex";
}
