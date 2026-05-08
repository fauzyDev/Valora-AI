/**
 * @file chat-service.ts
 * @description Layanan tingkat data untuk operasi chat yang berinteraksi dengan Supabase.
 */

import { createClient } from "@/utils/supabase/client";
import { ChatSession, Message, Attachment } from "@/components/chat/types";

/**
 * chatService
 * @description Objek yang berisi kumpulan fungsi untuk operasi database terkait chat.
 */
export const chatService = {
  /**
   * Mengambil daftar semua sesi chat untuk pengguna yang sedang login.
   * 
   * @returns {Promise<ChatSession[]>} Array sesi chat.
   */
  async fetchChats(): Promise<ChatSession[]> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("chats")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching chats:", error);
      throw error;
    }

    return data.map((chat) => ({
      ...chat,
      updatedAt: new Date(chat.updated_at),
      messages: [],
    })) as ChatSession[];
  },

  /**
   * Mengambil semua pesan untuk sebuah sesi chat tertentu, termasuk lampirannya.
   * 
   * @param {string} chatId ID unik sesi chat.
   * @returns {Promise<Message[]>} Array pesan dalam urutan kronologis.
   */
  async fetchMessages(chatId: string): Promise<Message[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("messages")
      .select(`
        *,
        attachments (*)
      `)
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }

    return data as Message[];
  },

  /**
   * Membuat sesi chat baru untuk pengguna saat ini.
   * Juga memastikan record profile user tersedia di database.
   * 
   * @param {string} title Judul sesi chat.
   * @returns {Promise<ChatSession>} Sesi chat yang baru dibuat.
   */
  async createChat(title: string): Promise<ChatSession> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // Pastikan record profil ada untuk menghindari kegagalan foreign key
    await supabase.from("profiles").upsert({
      id: user.id,
      full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
      avatar_url: user.user_metadata?.avatar_url,
    }, { onConflict: 'id' });

    const { data, error } = await supabase
      .from("chats")
      .insert({
        user_id: user.id,
        title: title || "New Chat",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating chat:", error);
      throw error;
    }

    return {
      ...data,
      updatedAt: new Date(data.updated_at),
      messages: [],
    } as ChatSession;
  },

  /**
   * Menambahkan pesan baru ke dalam sesi chat.
   * 
   * @param {string} chatId ID sesi chat.
   * @param {"user" | "assistant"} role Peran pengirim pesan.
   * @param {string} content Isi pesan teks.
   * @param {Partial<Attachment>[]} [attachments] Array lampiran (opsional).
   * @returns {Promise<Message>} Pesan yang berhasil disimpan.
   */
  async createMessage(chatId: string, role: "user" | "assistant", content: string, attachments?: Partial<Attachment>[]): Promise<Message> {
    const supabase = createClient();
    
    // 1. Simpan pesan
    const { data: message, error: msgError } = await supabase
      .from("messages")
      .insert({
        chat_id: chatId,
        role,
        content,
      })
      .select()
      .single();

    if (msgError) {
      console.error("Error creating message:", msgError);
      throw msgError;
    }

    // 2. Simpan lampiran jika ada
    if (attachments && attachments.length > 0) {
      const attachmentsToInsert = attachments.map(attr => ({
        message_id: message.id,
        file_url: attr.file_url,
        file_type: attr.file_type,
        file_name: attr.file_name,
        file_size_bytes: attr.file_size_bytes,
      }));

      const { error: attrError } = await supabase
        .from("attachments")
        .insert(attachmentsToInsert);

      if (attrError) {
        console.error("Error creating attachments:", attrError);
      }
    }

    // 3. Perbarui timestamp updated_at pada chat
    await supabase
      .from("chats")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", chatId);

    return message as Message;
  },

  /**
   * Menghapus seluruh sesi chat beserta pesan-pesannya (via cascade delete).
   * 
   * @param {string} chatId ID sesi chat yang akan dihapus.
   */
  async deleteChat(chatId: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.from("chats").delete().eq("id", chatId);
    if (error) {
      console.error("Error deleting chat:", error);
      throw error;
    }
  },

  /**
   * Mengganti judul sesi chat.
   * 
   * @param {string} chatId ID sesi chat.
   * @param {string} title Judul baru.
   */
  async renameChat(chatId: string, title: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from("chats")
      .update({ title })
      .eq("id", chatId);
    
    if (error) {
      console.error("Error renaming chat:", error);
      throw error;
    }
  },
};
