 # src/lib/services/storage-service.ts

 [Lihat sumber](src/lib/services/storage-service.ts)

 Ringkasan:

 Service untuk mengunggah dan menghapus file di Supabase Storage. Mengemas path dan URL hasil unggahan.

 Ekspor:

 - `uploadFile` — unggah file ke bucket tertentu.
 - `deleteFile` — hapus file dari storage.
# src/lib/services/storage-service.ts

[Lihat sumber](src/lib/services/storage-service.ts)

Ringkasan:

Layanan helper untuk operasi penyimpanan pada Supabase Storage (bucket `dons`). Menyediakan fungsi upload dan delete.

Ekspor:

- `storageService` — objek berisi `uploadFile(file, path)` dan `deleteFile(path)`.
