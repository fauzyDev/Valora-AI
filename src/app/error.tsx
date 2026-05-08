/**
 * error.tsx
 *
 * Komponen fallback untuk error pada tingkat aplikasi. Menangani
 * exception yang tidak tertangani dan memberikan opsi untuk mencoba ulang
 * atau kembali ke beranda.
 */

"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full glass-panel p-8 rounded-3xl text-center space-y-6 border border-red-500/20">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">Something went wrong!</h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            An unexpected error occurred. Please try again or return to the homepage.
          </p>
        </div>

        {error.digest && (
          <div className="p-3 bg-black/40 rounded-xl border border-white/5 font-mono text-[10px] text-slate-500 break-all">
            Error ID: {error.digest}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button 
            onClick={() => reset()}
            className="flex-1 bg-white/5 hover:bg-white/10 text-white border-white/10 gap-2 h-11"
            variant="outline"
          >
            <RefreshCcw className="w-4 h-4" />
            Try again
          </Button>
          <Link href="/" className="flex-1">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white gap-2 h-11 border-none shadow-lg shadow-indigo-500/20">
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
