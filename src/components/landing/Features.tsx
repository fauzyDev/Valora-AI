/**
 * Features.tsx
 *
 * Menampilkan fitur-fitur utama Velora AI, seperti AI Chat, analisis file,
 * penyimpanan riwayat, dan kemampuan generasi konten.
 */

/**
 * Features.tsx
 *
 * Seksi pada landing page yang menampilkan fitur-fitur utama Velora AI.
 * Berisi elemen UI informatif yang menjelaskan kapabilitas platform.
 * Dokumentasi ditulis dalam Bahasa Indonesia.
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, FileUp, History, Sparkles } from 'lucide-react';

export default function Features() {
  return (
    <section className="py-20 px-8 max-w-[1440px] mx-auto">
      <div className="text-center mb-16">
        <h2 className="font-space text-4xl md:text-[40px] font-semibold text-white mb-4 tracking-tight">Master Every Workflow</h2>
        <p className="font-sans text-[16px] text-[#c7c4d7] max-w-xl mx-auto">A comprehensive suite of tools designed to handle everything from creative brainstorming to technical execution.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* AI Chat */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="md:col-span-2 glass-panel p-8 rounded-2xl group hover:border-indigo-500/50 transition-all duration-500 overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 p-12 bg-indigo-500/10 blur-[100px] pointer-events-none"></div>
          <div className="bg-indigo-500/10 p-4 rounded-xl w-fit mb-6">
            <MessageSquare className="text-indigo-400 w-8 h-8" />
          </div>
          <h3 className="font-space text-[24px] font-medium text-white mb-2">AI Chat</h3>
          <p className="text-[#c7c4d7] mb-6 max-w-md">Engage in nuanced, context-aware conversations. Our models understand deep context, technical constraints, and creative intent.</p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-[10px] font-semibold border border-indigo-500/20 uppercase tracking-wider">Multi Model</span>
            <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-[10px] font-semibold border border-purple-500/20 uppercase tracking-wider">Streaming</span>
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-[10px] font-semibold border border-cyan-500/20 uppercase tracking-wider">Context-Aware</span>
          </div>
        </motion.div>

        {/* File Analysis */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-8 rounded-2xl group hover:border-cyan-500/50 transition-all duration-500 relative overflow-hidden"
        >
          <div className="bg-cyan-500/10 p-4 rounded-xl w-fit mb-6">
            <FileUp className="text-cyan-400 w-8 h-8" />
          </div>
          <h3 className="font-space text-[24px] font-medium text-white mb-2">File Analysis</h3>
          <p className="text-[#c7c4d7]">Upload PDFs, docs, or images. Get instant summaries, data extraction, and detailed insights.</p>
        </motion.div>

        {/* Save History */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-8 rounded-2xl group hover:border-emerald-500/50 transition-all duration-500 relative overflow-hidden"
        >
           <div className="bg-emerald-500/10 p-4 rounded-xl w-fit mb-6">
            <History className="text-emerald-400 w-8 h-8" />
          </div>
          <h3 className="font-space text-[24px] font-medium text-white mb-2">Save History</h3>
          <p className="text-[#c7c4d7]">Your workspace, synchronized. Access previous chats and generated content from any device, anytime.</p>
        </motion.div>

         {/* Generation */}
         <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="md:col-span-2 glass-panel p-8 rounded-2xl group hover:border-purple-500/50 transition-all duration-500 overflow-hidden relative"
        >
          <div className="absolute -bottom-20 -right-20 p-20 bg-purple-500/10 blur-[100px] pointer-events-none"></div>
          <div className="bg-purple-500/10 p-4 rounded-xl w-fit mb-6">
            <Sparkles className="text-purple-400 w-8 h-8" />
          </div>
          <h3 className="font-space text-[24px] font-medium text-white mb-2">Smart Generation</h3>
          <p className="text-[#c7c4d7] mb-6">From boilerplate code to full marketing strategies, Velora AI generates production-ready assets tailored to your brand voice.</p>
          <div className="w-full bg-black/30 rounded-lg p-4 border border-white/5 font-mono text-xs text-purple-200/80">
            <p className="mb-1 text-purple-400">{`// Generating landing page hero...`}</p>
            <p className="mb-1">{`<section class="hero glass-morphism">`}</p>
            <p className="mb-1">{`  <h1>Revolutionize your output</h1>`}</p>
            <p className="animate-pulse">_</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
