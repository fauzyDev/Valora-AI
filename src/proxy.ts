/**
 * proxy.ts
 *
 * Middleware proxy yang meneruskan request ke helper `updateSession` untuk
 * menyelaraskan sesi Supabase pada edge/middleware level. Konfigurasi
 * `matcher` mengabaikan file statis dan aset gambar.
 */

import { type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
