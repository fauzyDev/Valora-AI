/**
 * SidebarFooter.tsx
 *
 * Bagian footer pada sidebar yang menampilkan informasi user saat ini
 * dan tombol logout. Komponen ini berjalan di client.
 */

"use client";

import { FC, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogoutIcon } from "@/components/chat/icons";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { BrainCircuit } from "lucide-react";

interface SidebarFooterProps {
  isDemo?: boolean;
}

export const SidebarFooter: FC<SidebarFooterProps> = ({ isDemo = false }) => {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    if (isDemo) return;
    let isMounted = true;
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (isMounted) setUser(user);
    };
    getUser();
    return () => {
      isMounted = false;
    };
  }, [supabase.auth, isDemo]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleSignIn = () => {
    router.push("/login");
  };

  if (isDemo) {
    return (
      <div className="px-3 py-4 space-y-3 border-t border-white/5">
        <button 
          onClick={handleSignIn}
          className="w-full flex items-center gap-3 px-3 py-2 text-indigo-400 hover:text-white hover:bg-indigo-500/10 transition-all duration-250 rounded-lg text-xs font-medium cursor-pointer active:scale-95"
        >
          <BrainCircuit className="w-4 h-4" />
          <span className="truncate">Sign In to Save</span>
        </button>

        <div className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-800/20 border border-white/5 cursor-default mt-4 opacity-75">
          <Avatar className="border border-slate-700/50 w-8 h-8 shrink-0">
            <AvatarFallback className="bg-slate-700 text-slate-400 font-bold text-xs uppercase">
              GS
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 overflow-hidden">
            <p className="text-slate-300 font-semibold text-xs leading-tight truncate">
              Guest User
            </p>
            <p className="text-slate-600 text-[10px] truncate">Viewing Demo Mode</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="px-3 py-4 space-y-3 border-t border-white/5">
      {/* Footer links */}
      <div className="space-y-1">
        <button 
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-250 rounded-lg text-xs font-medium cursor-pointer active:scale-95"
        >
          <LogoutIcon />
          <span className="truncate">Logout</span>
        </button>
      </div>

      {/* User profile - Premium card */}
      <div className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-800/40 border border-white/8 cursor-pointer hover:bg-slate-800/60 hover:border-indigo-500/30 transition-all duration-300 mt-4">
        <Avatar className="border border-indigo-500/30 w-8 h-8 shrink-0">
          <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name} />
          <AvatarFallback className="bg-indigo-600/30 text-indigo-300 font-bold text-xs uppercase">
            {user.user_metadata?.full_name?.substring(0, 2) || user.email?.substring(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 overflow-hidden">
          <p className="text-white font-semibold text-xs leading-tight truncate">
            {user.user_metadata?.full_name || "User"}
          </p>
          <p className="text-slate-500 text-xs truncate">{user.email}</p>
        </div>
      </div>
    </div>
  );
}

