/**
 * Halaman chat utama
 *
 * File ini menyiapkan halaman `/chat` yang mengarahkan pengguna ke halaman
 * login jika belum ada user yang terautentikasi di Supabase. Jika user sudah
 * tersedia, komponen `VeloraAIChat` akan dirender.
 *
 * Semua dokumentasi menggunakan Bahasa Indonesia.
 */

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import VeloraAIChat from "@/components/VeloraAIChat";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workspace",
  description: "Chat with Velora AI - your high-performance intelligent workspace.",
};

/**
 * Page
 *
 * Fungsi halaman server-side yang memeriksa autentikasi user melalui Supabase.
 * - Jika tidak ada user, dilakukan redirect ke `/login`.
 * - Jika user ada, render `VeloraAIChat`.
 */
export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <VeloraAIChat />;
}

