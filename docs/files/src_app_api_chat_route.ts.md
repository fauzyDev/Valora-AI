# src/app/api/chat/route.ts

[Lihat sumber](src/app/api/chat/route.ts)

Ringkasan:

Endpoint streaming untuk chat yang mendukung pemrosesan lampiran: download -> extract -> chunk -> select relevant chunks -> kirim ke model Gemini dan stream hasil kembali ke klien.

Ekspor:

- `POST(req)` — handler POST untuk menerima `message`, `history`, `attachments`, dan `chatId`.
