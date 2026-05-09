/**
 * TypingIndicator.tsx
 *
 * Indikator animasi ketika AI sedang menghasilkan jawaban (typing).
 */

import { FC } from "react";

export const TypingIndicator: FC = () => {
  return (
    <div className="flex gap-3 max-w-[90%] md:max-w-[85%]">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 shrink-0 flex items-center justify-center border border-indigo-400/50 self-start shadow-lg shadow-indigo-500/30 flex-shrink-0">
        <svg className="w-4 h-4 text-white animate-pulse" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="flex items-center gap-2.5 px-4 py-3 bg-slate-800/40 border border-slate-700/50 rounded-2xl rounded-tl-sm shadow-lg shadow-slate-900/30 backdrop-blur-sm">
        <div className="flex gap-1.5 items-center">
          {[0, 0.15, 0.3].map((delay, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-indigo-400"
              style={{
                animation: `pulse 1.4s infinite`,
                animationDelay: `${delay}s`,
              }}
            />
          ))}
        </div>
        <span className="text-xs font-medium text-slate-400 ml-1">Velora is thinking...</span>
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
