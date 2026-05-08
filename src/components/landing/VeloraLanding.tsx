/**
 * VeloraLanding.tsx
 *
 * Halaman landing utama aplikasi. Menggabungkan beberapa bagian seperti Header,
 * Hero, Features, HowItWorks, CTA, dan Footer menjadi satu layout
 * presentasi untuk pengunjung.
 *
 * Semua dokumentasi disajikan dalam Bahasa Indonesia.
 */

'use client';

import React from 'react';
import Header from './Header';
import Hero from './Hero';
import Features from './Features';
import HowItWorks from './HowItWorks';
import CTA from './CTA';
import Footer from './Footer';

export default function VeloraLanding() {
  return (
    <>
      {/* Background Elements */}
      <div className="fixed inset-0 bg-grid pointer-events-none z-0"></div>
      <div className="fixed inset-0 mesh-gradient-1 pointer-events-none z-0"></div>

      <Header />
      
      <main className="relative z-10 w-full overflow-hidden">
        <Hero />
        <Features />
        <HowItWorks />
        <CTA />
      </main>

      <Footer />
    </>
  );
}
