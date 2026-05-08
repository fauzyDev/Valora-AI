/**
 * @file storage-service.ts
 * @description Layanan penyimpanan file yang berinteraksi dengan Supabase Storage.
 */

import { createClient } from "@/utils/supabase/client";

const BUCKET_NAME = "dons";

/**
 * storageService
 * @description Utilitas untuk operasi penyimpanan file pada Supabase Storage.
 */
export const storageService = {
  /**
   * Mengunggah file ke bucket Supabase Storage.
   * 
   * @param {File} file Objek file dari browser.
   * @param {string} path Jalur penyimpanan di dalam bucket.
   * @returns {Promise<{ path: string, url: string }>} Path file dan URL publiknya.
   */
  async uploadFile(file: File, path: string): Promise<{ path: string, url: string }> {
    const supabase = createClient();

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Storage upload error:", error);
      throw error;
    }

    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    return {
      path: data.path,
      url: urlData.publicUrl,
    };
  },

  /**
   * Menghapus file dari bucket Supabase Storage.
   * 
   * @param {string} path Jalur file yang akan dihapus.
   */
  async deleteFile(path: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);
    if (error) {
      console.error("Storage delete error:", error);
      throw error;
    }
  },
};
