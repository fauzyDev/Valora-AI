/**
 * CTA.tsx
 *
 * Call To Action pada akhir landing page yang mendorong pengguna untuk
 * memulai menggunakan Velora AI. Menyertakan tombol menuju `/chat`.
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CTA() {
  return (
    <section className="py-20 px-8 max-w-[1440px] mx-auto pb-32">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="glass-panel rounded-[2rem] p-12 md:p-20 text-center relative overflow-hidden border border-white/20"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-cyan-600/10 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#c0c1ff]/20 blur-[120px] pointer-events-none"></div>
        
        <div className="relative z-10">
          <h2 className="font-space text-4xl md:text-[56px] font-bold text-white mb-4 tracking-tight leading-tight">Ready to boost your productivity?</h2>
          <p className="font-sans text-[18px] text-[#c7c4d7] max-w-2xl mx-auto mb-8 leading-relaxed">
              Join thousands of creators, developers, and thinkers who are redefining what's possible with Velora AI.
          </p>
          <Link href="/chat">
            <button className="px-10 py-5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white font-space text-[24px] font-bold glow-primary hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer">
                Launch Velora AI
            </button>
          </Link>
          <p className="mt-4 text-[#c7c4d7]/60 font-space text-[12px] font-semibold uppercase tracking-widest">
            NO CREDIT CARD REQUIRED • FREE TIER AVAILABLE
          </p>
        </div>
      </motion.div>
    </section>
  );
}
