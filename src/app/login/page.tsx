/**
 * login/page.tsx
 *
 * Halaman login yang menyediakan autentikasi OAuth via Supabase (Google).
 * Mengandung UI untuk memulai proses login dan menampilkan pesan error
 * bila autentikasi gagal.
 */

"use client";

import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { SparkleIcon } from "@/components/chat/icons";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginContent() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex items-center justify-center p-4" style={{ fontFamily: "Manrope, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
      `}</style>
      
      <div className="w-full max-w-md space-y-8 text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-indigo-400 mb-8 hover:opacity-80 transition-opacity">
          <SparkleIcon />
          <span className="font-extrabold text-white text-3xl tracking-tighter">VeloraAI</span>
        </Link>

        <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 md:p-12 backdrop-blur-3xl shadow-2xl space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-white tracking-tight">Welcome Back</h1>
            <p className="text-slate-400 font-medium">Log in to continue your journey with Velora AI.</p>
          </div>

          {/* Show error message if auth failed */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-300 font-medium">
              {error === "auth-code-error"
                ? "Authentication failed. Please try again."
                : `Error: ${error}`}
            </div>
          )}

          <Button 
            onClick={handleLogin}
            className="w-full h-14 bg-white text-slate-900 hover:bg-slate-100 font-bold text-lg rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-white/5"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </Button>

          <p className="text-slate-500 text-sm font-medium">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>

        <div className="pt-4">
          <Link href="/" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
