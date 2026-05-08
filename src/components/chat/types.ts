/**
 * types.ts
 *
 * Tipe TypeScript untuk struktur data yang digunakan dalam chat:
 * - `Attachment` : representasi file yang dilampirkan pada pesan
 * - `Message`    : struktur pesan dalam percakapan
 * - `ChatSession`: sesi chat yang berisi metadata dan daftar pesan
 *
 * Semua dokumentasi dalam Bahasa Indonesia.
 */

export interface Attachment {
    id: string;
    message_id: string;
    file_url: string;
    file_type: string;
    file_name: string;
    file_size_bytes?: number;
    created_at?: string;
}

export interface Message {
    id: string;
    chat_id?: string;
    role: "user" | "assistant";
    content: string;
    time?: string;
    isStreaming?: boolean;
    attachments?: Attachment[];
    created_at?: string;
}

export interface ChatSession {
    id: string;
    user_id: string;
    title: string;
    updatedAt: Date;
    created_at?: string;
    messages: Message[];
}
