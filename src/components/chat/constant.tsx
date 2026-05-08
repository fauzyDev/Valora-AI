/**
 * constant.tsx
 *
 * Konstanta dan mock data ringan yang digunakan oleh UI chat, seperti
 * daftar navigasi dan inisialisasi pesan kosong.
 */

import { ChatIcon, HistoryIcon, SettingsIcon } from "@/components/chat/icons";

interface NavItem {
  icon: React.ReactNode;
  label: string;
}

export const NAV_ITEMS: NavItem[] = [
  { icon: <ChatIcon />, label: "Project Alpha" },
  { icon: <HistoryIcon />, label: "Market Research" },
  { icon: <SettingsIcon />, label: "Design System" },
];

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  time?: string;
  isStreaming?: boolean;
}

export const INITIAL_MESSAGES: Message[] = [];
