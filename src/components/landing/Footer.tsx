/**
 * Footer.tsx
 *
 * Komponen footer global untuk landing page. Menampilkan link kebijakan,
 * informasi hak cipta, dan branding kecil untuk Velora AI.
 */

'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full py-12 border-t border-white/5 bg-black/40 backdrop-blur-md relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-center px-12 gap-6 max-w-[1440px] mx-auto">
        <div className="text-[18px] font-bold text-white/90 font-space tracking-tight">
            Velora AI
        </div>
        <div className="flex items-center gap-8">
          <a className="font-space text-[12px] uppercase tracking-widest text-[#e5e2e1]/40 hover:text-cyan-400 transition-colors opacity-80 hover:opacity-100" href="#">Privacy</a>
          <a className="font-space text-[12px] uppercase tracking-widest text-[#e5e2e1]/40 hover:text-cyan-400 transition-colors opacity-80 hover:opacity-100" href="#">Terms</a>
          <a className="font-space text-[12px] uppercase tracking-widest text-[#e5e2e1]/40 hover:text-cyan-400 transition-colors opacity-80 hover:opacity-100" href="#">Status</a>
        </div>
        <div className="font-space text-[12px] uppercase tracking-widest text-emerald-400">
            © {new Date().getFullYear()} Velora AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
