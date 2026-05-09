/**
 * SidebarNavItem.tsx
 *
 * Item navigasi kecil yang digunakan di sidebar (ikon + label).
 */

import { FC } from "react";
import { cn } from "@/lib/utils";

interface SidebarNavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

export const SidebarNavItem: FC<SidebarNavItemProps> = ({ icon, label, active = false }) => {
  return (
    <button
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-250 ease-out active:scale-95",
        active
          ? "bg-gradient-to-r from-indigo-600/60 to-cyan-600/40 text-cyan-200 border border-indigo-500/30 shadow-lg shadow-indigo-500/20"
          : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent hover:border-white/10"
      )}
    >
      <span className="shrink-0 w-4 h-4 flex items-center justify-center">{icon}</span>
      <span className="truncate">{label}</span>
    </button>
  );
}
