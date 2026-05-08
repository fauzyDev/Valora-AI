import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "standalone",

  // Security Headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ltuhnawjrqmvfgmrwacm.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    // Optimized for all devices from smallest mobile to 4K displays
    deviceSizes: [320, 420, 520, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  reactCompiler: true,

  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@base-ui/react",
      "sonner",
      "clsx",
      "tailwind-merge",
    ],
  },
 
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
