"use client"

/**
 * sonner.tsx
 *
 * Wrapper untuk `sonner` toast/notification component dengan tema dan ikon
 * yang disesuaikan untuk aplikasi. Semua dokumentasi menggunakan Bahasa
 * Indonesia.
 */

import { Toaster as Sonner } from "sonner";
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

type ToasterProps = React.ComponentProps<typeof Sonner>

/**
 * Toaster
 *
 * Komponen pembungkus untuk `sonner` Toaster yang menerapkan tema gelap,
 * ikon kustom, dan opsi toast default yang konsisten di seluruh aplikasi.
 *
 * Props: meneruskan semua props ke `sonner` Toaster
 * (`React.ComponentProps<typeof Sonner>`).
 *
 * Contoh penggunaan:
 * <Toaster />
 */
const Toaster = ({
  ...props
}: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4 text-emerald-500" />
        ),
        info: (
          <InfoIcon className="size-4 text-indigo-400" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4 text-amber-500" />
        ),
        error: (
          <OctagonXIcon className="size-4 text-red-500" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin text-indigo-400" />
        ),
      }}
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-[#0f172a]/90 group-[.toaster]:backdrop-blur-xl group-[.toaster]:text-slate-200 group-[.toaster]:border-white/10 group-[.toaster]:shadow-2xl group-[.toaster]:rounded-2xl",
          description: "group-[.toast]:text-slate-400",
          actionButton: "group-[.toast]:bg-indigo-600 group-[.toast]:text-white",
          cancelButton: "group-[.toast]:bg-white/5 group-[.toast]:text-slate-400",
        },
      }}
      {...props} />
  );
}

export { Toaster }

