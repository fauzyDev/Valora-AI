/**
 * UserMessage.tsx
 *
 * Komponen yang merender pesan dari pengguna. Menyediakan aksi seperti
 * copy, edit, dan menampilkan lampiran file jika ada.
 */

import { FC, useState, memo } from "react";
import { Copy, Check, Edit2, FileText } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UserMessageProps {
  content: string;
  time?: string;
  attachments?: { file_name: string, file_type: string }[];
  onEdit?: (newContent: string) => void;
}

const UserMessageComponent: FC<UserMessageProps> = ({ content, time, attachments, onEdit }) => {
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

  const handleEdit = () => {
    if (onEdit) {
      onEdit(content);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className={cn(
        "max-w-[85%] sm:max-w-[75%] md:max-w-[70%] w-fit min-w-fit bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-lg shadow-indigo-600/30 backdrop-blur-sm flex flex-col gap-3"
      )}>
        {attachments && attachments.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {attachments.map((file, i) => {
              const fileExt = file.file_name.split('.').pop()?.toUpperCase() || "FILE";
              const isPdf = fileExt === "PDF";
              
              return (
                <div key={i} className="flex items-center gap-2.5 sm:gap-3 bg-slate-900/60 border border-slate-700/50 rounded-xl p-2 sm:pl-2.5 sm:pr-4 sm:py-2 w-fit max-w-full shadow-sm">
                  <div className={cn(
                    "w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 shadow-inner", 
                    isPdf ? "bg-[#f44336] text-white" : "bg-blue-600 text-white"
                  )}>
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="flex flex-col justify-center min-w-0 max-w-[120px] sm:max-w-[200px]">
                    <span className="text-xs sm:text-sm font-semibold text-slate-200 truncate leading-tight mb-0.5">
                      {file.file_name}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium leading-none">
                      {fileExt}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {content && <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-medium w-max max-w-full">{content}</p>}
      </div>

      {/* Action Buttons - always visible */}
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
        <button
          onClick={handleEdit}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white text-xs font-medium transition-colors duration-200"
        >
          <Edit2 className="w-3.5 h-3.5" />
          Edit
        </button>
      </div>

      {time && (
        <span className="text-xs text-slate-500 font-medium px-2">
          {time}
        </span>
      )}
    </div>
  );
};

export const UserMessage = memo(UserMessageComponent);