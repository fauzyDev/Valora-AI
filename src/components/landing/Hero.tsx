/**
 * Hero.tsx
 *
 * Bagian hero landing page yang menampilkan judul, deskripsi singkat,
 * dan CTA (tombol) untuk memulai atau menonton demo.
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="pt-35 pb-20 px-8 max-w-360 mx-auto flex flex-col items-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8"
      >
        <span className="w-2 h-2 rounded-full bg-[#4cd7f6] shadow-[0_0_8px_rgba(76,215,246,0.6)]"></span>
        <span className="font-space text-[12px] font-semibold uppercase tracking-widest text-[#c7c4d7]">NEXT-GEN INTELLIGENCE IS HERE</span>
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="font-space text-5xl md:text-[72px] text-white mb-4 leading-[1.1] max-w-4xl font-bold tracking-tight"
      >
        Your Intelligent <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c0c1ff] via-[#4cd7f6] to-[#ddb7ff]">AI Workspace</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="font-sans text-lg md:text-[18px] text-[#c7c4d7] max-w-2xl mb-8 leading-relaxed"
      >
        Empower your productivity with Velora AI. Chat with sophisticated models, analyze complex files, preserve your history, and generate high-quality content instantly.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-wrap items-center justify-center gap-4 mb-20"
      >
        <Link href="/chat">
          <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white font-space text-[24px] font-semibold glow-primary hover:scale-105 transition-all duration-300 cursor-pointer">
            Get Started Free
          </button>
        </Link>
        <Link href="/demo">
          <button className="px-8 py-4 rounded-xl glass-panel text-white font-space text-[24px] font-medium hover:bg-white/10 transition-all duration-300 flex items-center gap-2 cursor-pointer">
            <PlayCircle className="w-6 h-6" />
            Watch Demo
          </button>
        </Link>
      </motion.div>

      {/* Mockup */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="relative w-full max-w-5xl group"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-cyan-500/20 to-purple-500/20 rounded-2xl blur-2xl group-hover:opacity-75 transition duration-1000"></div>
        <div className="relative glass-panel rounded-2xl overflow-hidden shadow-2xl border border-white/20">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border-b border-white/10">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/40"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/40"></div>
            </div>
            <div className="flex-1 text-center">
              <span className="text-[10px] uppercase tracking-widest text-white/40">velora-ai-workspace-v4.0.app</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
