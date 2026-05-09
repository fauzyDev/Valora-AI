/**
 * @file TopNav.tsx
 * @description Header navigasi untuk area chat. Menampilkan branding Velora AI
 * dan tombol menu mobile.
 */

import { FC, memo } from "react";
import { Bell, Sparkles } from "lucide-react";

interface TopNavProps {
  onToggleSidebar: () => void;
}

export const TopNav: FC<TopNavProps> = memo(({ onToggleSidebar }) => {
  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 z-40 flex justify-between items-center px-3 sm:px-5 md:px-8 h-16 bg-slate-950/60 backdrop-blur-lg border-b border-white/5 transition-all duration-300">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden text-slate-400 hover:text-white hover:bg-white/10 p-2 -ml-2 rounded-lg transition-all duration-200 active:scale-95"
          aria-label="Toggle sidebar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <span className="text-base font-bold tracking-tight text-white hidden md:inline">Velora AI</span>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Branding badge — replaces old model selector */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/50 border border-white/5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-xs font-medium text-slate-300">Velora AI</span>
        </div>
      </div>
    </header>
  );
});

TopNav.displayName = "TopNav";
