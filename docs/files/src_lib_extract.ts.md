 # src/lib/extract.ts

 [Lihat sumber](src/lib/extract.ts)

 Ringkasan:

 Fungsi untuk mengekstrak teks dari file (PDF, DOCX) menggunakan `pdfjs-dist` dan `mammoth` serta normalisasi teks.

 Ekspor:

 - `extractText` — ekstraksi teks dari buffer/file.
# src/lib/extract.ts

[Lihat sumber](src/lib/extract.ts)

Ringkasan:

Fungsi ekstraksi teks dari PDF, DOCX, dan TXT menggunakan `pdfjs-dist` dan `mammoth`.

Ekspor:

- `extractText(buffer: Buffer, fileType: string): Promise<string>`
