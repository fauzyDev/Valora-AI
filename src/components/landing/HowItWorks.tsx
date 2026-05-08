/**
 * HowItWorks.tsx
 *
 * Seksi yang menjelaskan alur penggunaan Velora AI dalam tiga langkah.
 * Menggunakan animasi ringan via `framer-motion` dan ikon dari `lucide-react`.
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Upload, Rocket } from 'lucide-react';

export default function HowItWorks() {
  return (
    <section className="py-20 px-8 max-w-[1440px] mx-auto">
      <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
        <div className="max-w-2xl">
          <span className="font-space text-[12px] font-semibold uppercase tracking-[0.2em] text-secondary mb-4 block">The Process</span>
          <h2 className="font-space text-4xl md:text-[56px] font-semibold text-white tracking-tight">Three Steps to Mastery</h2>
        </div>
        <p className="font-sans text-[16px] text-on-surface-variant max-w-xs">Simplicity is the ultimate sophistication. Velora AI removes the friction between thought and result.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative group"
        >
          <div className="font-space text-7xl font-bold text-white/5 absolute -top-10 -left-4 pointer-events-none">01</div>
          <div className="glass-panel p-10 rounded-2xl border-t-2 border-t-[#c0c1ff]/30 h-full relative z-10">
            <BrainCircuit className="text-[#c0c1ff] mb-6 w-8 h-8" />
            <h4 className="font-space text-[24px] font-medium text-white mb-4">Ask Anything</h4>
            <p className="text-on-surface-variant">Type your prompt in natural language. No complex syntax required—our AI understands nuance.</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="relative group mt-0 md:mt-12"
        >
          <div className="font-space text-7xl font-bold text-white/5 absolute -top-10 -left-4 pointer-events-none">02</div>
          <div className="glass-panel p-10 rounded-2xl border-t-2 border-t-[#4cd7f6]/30 h-full relative z-10">
            <Upload className="text-[#4cd7f6] mb-6 w-8 h-8" />
            <h4 className="font-space text-[24px] font-medium text-white mb-4">Upload Context</h4>
            <p className="text-[#c7c4d7]">Enhance the conversation with your own files. Velora will analyze them instantly to provide specific answers.</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="relative group mt-0 md:mt-24"
        >
          <div className="font-space text-7xl font-bold text-white/5 absolute -top-10 -left-4 pointer-events-none">03</div>
          <div className="glass-panel p-10 rounded-2xl border-t-2 border-t-[#ddb7ff]/30 h-full relative z-10">
            <Rocket className="text-[#ddb7ff] mb-6 w-8 h-8" />
            <h4 className="font-space text-[24px] font-medium text-white mb-4">Get Response</h4>
            <p className="text-[#c7c4d7]">Receive high-fidelity responses, formatted content, or executable code in seconds.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
