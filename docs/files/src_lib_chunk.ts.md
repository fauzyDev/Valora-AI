 # src/lib/chunk.ts

 [Lihat sumber](src/lib/chunk.ts)

 Ringkasan:

 Algoritma untuk memecah teks menjadi chunk, menghitung relevansi, dan memilih chunk yang paling relevan untuk konteks prompt.

 Ekspor:

 - `chunkText`, `selectRelevantChunks`.
# src/lib/chunk.ts

[Lihat sumber](src/lib/chunk.ts)

Ringkasan:

Fungsi utilitas untuk memecah teks menjadi chunk (potongan) agar sesuai batas token model, serta memilih chunk relevan.

Ekspor:

- `chunkText(text: string, chunkSize?: number): string[]`
- `selectRelevantChunks(chunks: string[], limit?: number): string`
