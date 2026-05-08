/**
 * AIMessage.tsx
 *
 * Komponen yang merender pesan dari model AI. Mendukung streaming teks
 * (progressive update) dan aksi seperti menyalin isi pesan.
 */

import { FC, useState, memo } from "react";
import { Sparkles, Copy, Check } from "lucide-react";
import MarkdownRenderer from "./MarkdownRenderer";
import { toast } from "sonner";

interface AIMessageProps {
  content: string;
  isStreaming?: boolean;
}

const AIMessageComponent: FC<AIMessageProps> = ({ content, isStreaming }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success("Message copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy message");
    }
  };

  return (
    <div className="flex gap-3 md:gap-4 max-w-[90%] md:max-w-[85%] group">
      {/* AI avatar */}
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 shrink-0 flex items-center justify-center border border-indigo-400/50 self-start mt-1 shadow-lg shadow-indigo-500/30 flex-shrink-0">
        <Sparkles className="w-4 h-4 text-white" />
      </div> 

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl rounded-tl-sm p-4 md:p-5 shadow-lg shadow-slate-900/30 backdrop-blur-sm">
          <MarkdownRenderer content={content} isStreaming={isStreaming} />
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white text-xs font-medium transition-colors duration-200"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export const AIMessage = memo(AIMessageComponent);
