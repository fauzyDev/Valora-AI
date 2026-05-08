/**
 * not-found.tsx
 *
 * Halaman 404 kustom. Menunjukkan halaman error ketika rute tidak ditemukan
 * dan menyediakan tombol untuk kembali ke halaman utama atau mencari.
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, Ghost } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-md w-full glass-panel p-8 rounded-[40px] text-center space-y-8 relative z-10">
        <div className="relative">
          <h1 className="text-[120px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-white/20 to-transparent select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-indigo-600/10 rounded-full flex items-center justify-center border border-indigo-500/20 animate-bounce">
              <Ghost className="w-12 h-12 text-indigo-400" />
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-white tracking-tight">Page Not Found</h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-70 mx-auto">
            The page you're looking for has vanished into the digital void.
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <Link href="/" className="w-full">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white gap-3 h-12 border-none rounded-2xl shadow-xl shadow-indigo-500/20 text-base font-semibold transition-all hover:scale-[1.02] active:scale-95">
              <Home className="w-5 h-5" />
              Return to Velora
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            className="w-full text-slate-400 hover:text-white hover:bg-white/5 h-12 gap-3 rounded-2xl"
          >
            <Search className="w-5 h-5" />
            Try Searching
          </Button>
        </div>
      </div>
    </div>
  );
}
