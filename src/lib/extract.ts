/**
 * @file extract.ts
 * @description Fungsi ekstraksi teks dari berbagai tipe file (PDF, DOCX, TXT).
 */

import mammoth from "mammoth";
import { extractText as extractPdfText } from "unpdf";

/**
 * Mengekstrak teks mentah dari Buffer file berdasarkan tipe filenya.
 * Mendukung format PDF, Word (DOCX), dan teks biasa (TXT/MD/JSON).
 * 
 * @param {Buffer} buffer Buffer data file yang akan diekstrak.
 * @param {string} fileType MIME type atau ekstensi file.
 * @returns {Promise<string>} Teks hasil ekstraksi.
 * @throws {Error} Jika tipe file tidak didukung atau ekstraksi gagal.
 */
export async function extractText(buffer: Buffer, fileType: string): Promise<string> {
    const type = fileType.toLowerCase();

    console.log(`[Velora AI] Extracting text for type: ${fileType}, buffer size: ${buffer.byteLength}`);
    
    // Penanganan file PDF
    if (type.includes("pdf") || type.endsWith(".pdf")) {
        if (buffer.byteLength > 5 * 1024 * 1024) { // 5MB limit
            console.warn(`[Velora AI] PDF file exceeded 5MB limit (${buffer.byteLength} bytes).`);
            throw new Error("File PDF terlalu besar (maks 5MB)");
        }

        try {
            const uint8Array = new Uint8Array(buffer);
            const { text } = await extractPdfText(uint8Array);
            const fullText = Array.isArray(text) ? text.join("\n") : (text || "");

            if (!fullText || !fullText.trim()) {
                console.warn("[Velora AI] PDF extraction returned empty text. Possibly an image-based PDF.");
                return "Ini adalah file PDF (mungkin berupa gambar/scan), teks tidak dapat diekstraksi secara langsung.";
            }

            return fullText
                .replace(/\n{3,}/g, "\n\n")
                .replace(/[ \t]+/g, " ")
                .trim();
        } catch (err) {
            console.error("[Velora AI] Unpdf extraction error:", err);
            throw new Error("Gagal membaca file PDF. Pastikan file tidak terenkripsi.");
        }
    }

    // Penanganan file Word (DOCX)
    if (
        type.includes("word") ||
        type.includes("docx") ||
        type.includes("officedocument.wordprocessingml.document") ||
        type.endsWith(".docx")
    ) {
        try {
            const result = await mammoth.extractRawText({ buffer });
            return result.value;
        } catch (err) {
            console.error("[Velora AI] Mammoth extraction error:", err);
            throw new Error("Gagal membaca file Word (.docx)");
        }
    }

    // Penanganan file Word lama (DOC) - Mammoth tidak mendukung, beri info
    if (type.includes("application/msword") || type.endsWith(".doc")) {
        throw new Error("Format .doc (Word lama) tidak didukung. Silakan simpan sebagai .docx atau .pdf.");
    }

    console.warn(`[Velora AI] Unsupported file type attempt: ${fileType}`);
    throw new Error(`Hanya mendukung file PDF dan DOCX. Tipe file ${fileType} tidak didukung.`);
}
