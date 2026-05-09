/**
 * layout.tsx
 *
 * Root layout untuk aplikasi Next.js. Mengatur metadata dasar, font,
 * dan pembungkus global seperti `TooltipProvider` dan `Toaster`.
 * Komentar-dokumentasi menggunakan Bahasa Indonesia.
 */

import { Inter, Geist, Space_Grotesk } from "next/font/google";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({
  subsets: ['latin'], 
  variable: '--font-sans',
  display: "swap"
});

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"], 
  variable: "--font-space-grotesk",
  display: "swap"
});

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: "swap" 
});

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = { 
  title: {
    default: "VeloraAI | The Next Generation of Intelligence",
    template: "%s | VeloraAI"
  },
  description: "Experience the future of AI chat with Velora AI. Fast, secure, and incredibly smart AI workspace for everyone.",
  keywords: ["AI Chat", "Velora AI", "Intelligence", "Generative AI", "AI Assistant"],
  authors: [{ name: "Velora Team" }],
  creator: "Velora AI",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://velora-ai-theta.vercel.app",
    title: "VeloraAI | The Next Generation of Intelligence",
    description: "Experience the future of AI chat with Velora AI. Fast, secure, and incredibly smart.",
    siteName: "VeloraAI",
  },
  twitter: {
    card: "summary_large_image",
    title: "VeloraAI | The Next Generation of Intelligence",
    description: "Experience the future of AI chat with Velora AI. Fast, secure, and incredibly smart.",
    creator: "@velora_ai",
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon-180x180.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={cn("dark text-foreground bg-background", geist.variable, spaceGrotesk.variable, inter.variable)} suppressHydrationWarning>
      <body className={cn(inter.className, "antialiased scroll-smooth overscroll-none min-h-screen bg-background")}>
        <TooltipProvider>
          {children}
          <Toaster position="top-center"/>
        </TooltipProvider>
      </body>
    </html>
  );
}
