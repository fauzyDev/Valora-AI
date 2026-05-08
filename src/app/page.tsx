/**
 * app/page.tsx
 *
 * Halaman utama (root) yang merender komponen landing `VeloraLanding`.
 * Dokumentasi ini ditulis dalam Bahasa Indonesia.
 */

import VeloraLanding from '@/components/landing/VeloraLanding';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "VeloraAI | Home",
  description: "Experience the next generation of AI workspaces. High-performance chat, deep analysis, and seamless integration.",
};

export default function Page() {
  return <VeloraLanding />;
}
