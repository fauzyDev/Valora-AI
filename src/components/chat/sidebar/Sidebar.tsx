/**
 * Sidebar.tsx
 *
 * Komponen sidebar untuk navigasi sesi chat. Menyediakan tombol pembuatan
 * chat baru, pencarian, daftar riwayat percakapan, serta footer dengan
 * kontrol pengguna.
 */

import { FC, useState } from "react";
import { SidebarFooter } from "./SidebarFooter";
import { ChatHistoryList } from "./ChatHistoryList";
import { ChatSession } from "@/components/chat/types";
import { AddIcon } from "@/components/chat/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BrainCircuit, Search } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  chatList: ChatSession[];
  activeChatId: string | null;
  onCreateChat: () => void;
  onSelectChat: (id: string) => void;
  onRenameChat: (id: string, newTitle: string) => void;
  onDeleteChat: (id: string) => void;
  isDemo?: boolean;
}

export const Sidebar: FC<SidebarProps> = ({ 
  isOpen, 
  onClose,
  chatList,
  activeChatId,
  onCreateChat,
  onSelectChat,
  onRenameChat,
  onDeleteChat,
  isDemo = false
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "w-64 border-r border-white/10 bg-slate-900/50 backdrop-blur-xl h-screen fixed left-0 top-0 flex flex-col z-50 transition-transform duration-300 ease-in-out shadow-2xl shadow-black/50",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Header - Improved spacing */}
        <div className="px-4 py-5 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 flex-shrink-0">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-bold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-cyan-400">
                Velora AI
              </h1>
              <p className="text-[9px] text-indigo-400 tracking-widest uppercase font-semibold mt-0.5 opacity-75">
                Pro Edition
              </p>
            </div>
          </div>
        </div>

        {/* New Chat Button & Search - Sticky area (Hidden in Demo) */}
        {!isDemo && (
          <div className="p-4 space-y-3 border-b border-white/5 shrink-0">
            <Button 
              onClick={onCreateChat}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white gap-2 font-semibold h-9 rounded-lg shadow-lg shadow-indigo-500/30 transition-all duration-300 border border-indigo-400/30 hover:border-indigo-300/50 hover:shadow-indigo-500/50 active:scale-95"
            >
              <AddIcon />
              New Chat
            </Button>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search chats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-9 pr-3 py-1.5 border border-white/10 rounded-lg leading-5 bg-black/20 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 sm:text-sm transition-all"
              />
            </div>
          </div>
        )}

        {/* Chat History / Demo CTA */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-2 py-4">
          {isDemo ? (
            <div className="px-2 py-4 space-y-6">
              <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-center space-y-3">
                <BrainCircuit className="w-8 h-8 text-indigo-400 mx-auto opacity-50" />
                <h3 className="text-sm font-bold text-white leading-tight">Unlock Full Features</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Sign in to save your chat history, analyze documents, and get unlimited AI access.
                </p>
              </div>

              <div className="space-y-2">
                <p className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Guest Mode</p>
                <Button 
                  onClick={() => window.location.href = "/login"}
                  className="w-full bg-white text-slate-900 hover:bg-slate-100 gap-3 font-bold h-10 rounded-xl transition-all duration-300 shadow-xl active:scale-95 group"
                >
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Sign In With Google
                </Button>
              </div>
            </div>
          ) : (
            <ChatHistoryList 
              chatList={chatList}
              activeChatId={activeChatId}
              searchTerm={searchTerm}
              onSelectChat={onSelectChat}
              onRenameChat={onRenameChat}
              onDeleteChat={onDeleteChat}
            />
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-white/5">
          <SidebarFooter isDemo={isDemo} />
        </div>
      </aside>
    </>
  );
}
