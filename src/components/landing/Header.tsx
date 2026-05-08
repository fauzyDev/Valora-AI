/**
 * Header.tsx
 *
 * Komponen header untuk landing page. Menyediakan branding singkat dan tombol
 * navigasi menuju area chat. Dirender sebagai client component.
 */

'use client';

import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-[0_0_20px_rgba(99,102,241,0.1)]">
      <div className="flex items-center justify-between px-8 py-4 max-w-[1440px] mx-auto">
        <div className="text-2xl font-bold tracking-tighter text-white bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 font-space">
          Velora AI
        </div>
        <div className="flex items-center gap-4">
          <Link href="/chat">
            <button className="font-space text-sm tracking-wide bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white font-semibold px-6 py-2 rounded-lg hover:scale-105 active:scale-95 transition-all duration-300 glow-primary cursor-pointer">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
