/**
 * ChatItem.tsx
 *
 * Representasi baris percakapan di daftar history. Menyediakan UI untuk
 * menampilkan judul sesi, serta aksi edit dan hapus.
 */

"use client";

import { FC, useState, useRef, useEffect, memo } from "react";
import { ChatSession } from "@/components/chat/types";
import { MessageSquare, Pencil, Trash2, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatItemProps {
  session: ChatSession;
  isActive: boolean;
  onClick: () => void;
  onRename: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
}

export const ChatItem: FC<ChatItemProps> = memo(({ session, isActive, onClick, onRename, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(session.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSaveRename = () => {
    if (editTitle.trim() && editTitle !== session.title) {
      onRename(session.id, editTitle.trim());
    } else {
      setEditTitle(session.title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSaveRename();
    if (e.key === "Escape") {
      setEditTitle(session.title);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
        "bg-white/10 ring-1 ring-indigo-500/50"
      )}>
        <MessageSquare className="w-4 h-4 text-indigo-400 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSaveRename}
          className="flex-1 bg-transparent outline-none text-slate-200 border-none p-0 h-auto min-w-0"
        />
        <div className="flex gap-1 shrink-0">
          <button onMouseDown={(e) => { e.preventDefault(); handleSaveRename(); }} className="text-emerald-400 hover:text-emerald-300">
            <Check className="w-4 h-4" />
          </button>
          <button onMouseDown={(e) => { e.preventDefault(); setEditTitle(session.title); setIsEditing(false); }} className="text-slate-400 hover:text-slate-300">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-all duration-200",
        isActive 
          ? "bg-indigo-500/20 text-indigo-100 font-medium" 
          : "text-slate-300 hover:bg-white/5"
      )}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <MessageSquare className={cn("w-4 h-4 shrink-0", isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-300")} />
        <span className="truncate text-left leading-relaxed">
          {session.title}
        </span>
      </div>

      <div className={cn(
        "flex items-center gap-1 shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity",
        isActive && "opacity-100"
      )}>
        <div 
          role="button"
          tabIndex={0}
          onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
          className="p-1 text-slate-400 hover:text-indigo-300 rounded hover:bg-white/10"
        >
          <Pencil className="w-3.5 h-3.5" />
        </div>
        <div 
          role="button"
          tabIndex={0}
          onClick={(e) => { e.stopPropagation(); onDelete(session.id); }}
          className="p-1 text-slate-400 hover:text-rose-400 rounded hover:bg-white/10"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </div>
      </div>
    </button>
  );
});

ChatItem.displayName = "ChatItem";
