/**
 * loading.tsx
 *
 * Komponen fallback loading untuk halaman workspace/chat.
 */

export default function Loading() {
  return (
    <div className="dark bg-slate-950 text-slate-200 min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 animate-pulse">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="text-sm text-slate-400 font-medium animate-pulse">Loading workspace...</p>
      </div>
    </div>
  );
}
