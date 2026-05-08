 # src/lib/services/gemini.ts

 [Lihat sumber](src/lib/services/gemini.ts)

 Ringkasan:

 Wrapper untuk memanggil API Gemini (Google Generative AI). Menormalisasi history dan input menjadi format yang diperlukan model, serta menangani streaming respons.

 Ekspor:

 - `sendMessage` — mengirim prompt dan menerima stream hasil model.
# src/lib/services/gemini.ts

[Lihat sumber](src/lib/services/gemini.ts)

Ringkasan:

Wrapper untuk Google Generative AI (Gemini). Menyediakan fungsi `sendMessage(message, history?)` yang menormalisasi history dan mengirim permintaan streaming ke model.

Ekspor:

- `sendMessage(message: string, history?: ChatMessage[])` — kirim pesan ke model Gemini.
