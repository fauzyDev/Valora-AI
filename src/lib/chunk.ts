/**
 * @file chunk.ts
 * @description Utilitas untuk memecah teks menjadi potongan (chunks) agar dapat dikirim ke
 * model AI yang memiliki batas token.
 */

/**
 * Memecah teks panjang menjadi array potongan teks yang lebih kecil.
 * 
 * @param {string} text Teks mentah yang akan dipecah.
 * @param {number} [chunkSize=2000] Ukuran karakter maksimal untuk setiap potongan.
 * @returns {string[]} Array string yang berisi potongan-potongan teks.
 */
export function chunkText(text: string, chunkSize: number = 2000): string[] {
    if (!text) return [];
    
    // Telah dihapus: text.replace(/\s+/g, ' ') karena memblokir event loop (ReDoS) untuk teks besar
    const chunks: string[] = [];
    for (let i = 0; i < text.length; i += chunkSize) {
        chunks.push(text.slice(i, i + chunkSize));
    }
    
    return chunks;
}

/**
 * Memilih sejumlah potongan teks pertama yang relevan untuk dikirim sebagai konteks.
 * 
 * @param {string[]} chunks Array potongan teks hasil dari chunkText.
 * @param {number} [limit=5] Jumlah maksimal potongan yang akan diambil.
 * @returns {string} Gabungan teks dari potongan-potongan terpilih.
 */
export function selectRelevantChunks(chunks: string[], limit: number = 5): string {
    // Implementasi sederhana: mengambil N potongan pertama
    return chunks.slice(0, limit).join("\n\n---\n\n");
}
