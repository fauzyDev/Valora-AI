 # src/lib/file.ts

 [Lihat sumber](src/lib/file.ts)

 Ringkasan:

 Fungsi `downloadFile` dan utilitas terkait untuk mengambil berkas dari URL dan menyiapkannya untuk proses ekstraksi.

 Ekspor:

 - `downloadFile` — mengunduh file dan mengembalikan buffer/path.
# src/lib/file.ts

[Lihat sumber](src/lib/file.ts)

Ringkasan:

Utility untuk mengunduh file dari Supabase Storage dan mengembalikannya sebagai `Buffer`. Digunakan oleh proses ekstraksi/analisis file.

Ekspor:

- `downloadFile(path: string): Promise<Buffer>`
