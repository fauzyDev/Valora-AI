/**
 * ChatHistoryList.tsx
 *
 * Komponen yang mengelompokkan dan menampilkan daftar chat berdasarkan
 * rentang waktu (Today, Yesterday, Last 7 Days, Older). Memungkinkan
 * pencarian judul chat dan pemilihan sesi aktif.
 */

"use client";

import { FC } from "react";
import { ChatSession } from "@/components/chat/types";
import { ChatItem } from "./ChatItem";

interface ChatHistoryListProps {
  chatList: ChatSession[];
  activeChatId: string | null;
  searchTerm: string;
  onSelectChat: (id: string) => void;
  onRenameChat: (id: string, newTitle: string) => void;
  onDeleteChat: (id: string) => void;
}

type GroupedChats = {
  Today: ChatSession[];
  Yesterday: ChatSession[];
  "Last 7 Days": ChatSession[];
  Older: ChatSession[];
};

export const ChatHistoryList: FC<ChatHistoryListProps> = ({
  chatList,
  activeChatId,
  searchTerm,
  onSelectChat,
  onRenameChat,
  onDeleteChat,
}) => {
  const filtered = chatList.filter((chat) =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groups: GroupedChats = {
    Today: [],
    Yesterday: [],
    "Last 7 Days": [],
    Older: [],
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const last7Days = new Date(today);
  last7Days.setDate(last7Days.getDate() - 7);

  filtered.forEach((chat) => {
    const updatedAt = new Date(chat.updatedAt);
    updatedAt.setHours(0, 0, 0, 0);

    if (updatedAt.getTime() === today.getTime()) {
      groups.Today.push(chat);
    } else if (updatedAt.getTime() === yesterday.getTime()) {
      groups.Yesterday.push(chat);
    } else if (updatedAt >= last7Days) {
      groups["Last 7 Days"].push(chat);
    } else {
      groups.Older.push(chat);
    }
  });

  // Sort each group by date descending
  Object.values(groups).forEach((group) => {
    group.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  });

  const groupedChats = groups;

  const hasChats = chatList.length > 0;
  const hasSearchResults = Object.values(groupedChats).some((group) => group.length > 0);

  if (!hasChats) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-slate-500 text-sm">
        <p>No conversations yet</p>
      </div>
    );
  }

  if (searchTerm && !hasSearchResults) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-slate-500 text-sm">
        <p>No results found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {(Object.entries(groupedChats) as [keyof GroupedChats, ChatSession[]][]).map(
        ([label, chats]) => {
          if (chats.length === 0) return null;

          return (
            <div key={label} className="space-y-1">
              <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                {label}
              </h3>
              <div className="space-y-0.5">
                {chats.map((chat) => (
                  <ChatItem
                    key={chat.id}
                    session={chat}
                    isActive={activeChatId === chat.id}
                    onClick={() => onSelectChat(chat.id)}
                    onRename={onRenameChat}
                    onDelete={onDeleteChat}
                  />
                ))}
              </div>
            </div>
          );
        }
      )}
    </div>
  );
};
