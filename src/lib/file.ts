/**
 * @file file.ts
 * @description Utility untuk mengunduh file dari Supabase Storage.
 */

import { createClient } from "@/utils/supabase/server";

const BUCKET_NAME = "dons"; // Sesuai dengan konfigurasi bucket Supabase

/**
 * Mengunduh file dari bucket Supabase Storage dan mengubahnya menjadi Buffer.
 * 
 * @param {string} path Jalur relatif file di dalam bucket.
 * @returns {Promise<Buffer>} Data file dalam bentuk Buffer.
 * @throws {Error} Jika pengunduhan gagal atau file tidak ditemukan.
 */
export async function downloadFile(path: string): Promise<Buffer> {
    const supabase = await createClient();
    
    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .download(path);

    if (error) {
        console.error("Error downloading file from Supabase:", error);
        throw new Error(`Failed to download file: ${error.message}`);
    }

    if (!data) {
        throw new Error("File not found or empty");
    }

    const arrayBuffer = await data.arrayBuffer();
    return Buffer.from(arrayBuffer);
}
