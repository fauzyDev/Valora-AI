/**
 * utils.ts
 *
 * Utilitas kecil untuk helper CSS classnames.
 * - `cn(...)` adalah helper yang menggabungkan kelas menggunakan `clsx`
 *   lalu menyatukannya dengan `tailwind-merge` untuk menghilangkan
 *   duplikasi/konflik kelas Tailwind.
 *
 * Semua dokumentasi disediakan dalam Bahasa Indonesia.
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
