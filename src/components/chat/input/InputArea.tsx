"use client";

/**
 * InputArea.tsx
 *
 * Komponen input untuk mengetik pesan, mengedit pesan, dan melampirkan file.
 * Semua komentar dan dokumentasi ditulis dalam Bahasa Indonesia.
 *
 * Props:
 * - onSend(text, files?): fungsi dipanggil saat mengirim pesan.
 * - isTyping: boolean yang menandakan AI sedang mengetik (menonaktifkan pengiriman).
 * - editingValue, isEditing: untuk mode edit pesan.
 * - onEditConfirm, onCancelEdit: callback untuk konfirmasi atau pembatalan edit.
 *
 * Fitur utama:
 * - Mengatur tinggi textarea secara dinamis sesuai konten.
 * - Validasi lampiran (hanya PDF/DOC/DOCX) dan menampilkan pratinjau file.
 * - Penanganan pengiriman pesan, pembatalan edit, dan shortcut keyboard.
 */

import { useState, useRef, useEffect, memo, ChangeEvent, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AttachIcon, SendIcon } from "@/components/chat/icons";
import { X, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AttachedFile {
  file: File;
  preview: string;
}

interface InputAreaProps {
  onSend: (text: string, files?: File[]) => void;
  isTyping: boolean;
  editingValue?: string;
  isEditing?: boolean;
  onEditConfirm?: (newContent: string) => void;
  onCancelEdit?: () => void;
  isDemo?: boolean;
}

/**
 * InputArea
 *
 * Komponen utama untuk area input chat. Menangani state lokal seperti teks
 * yang diketik, list file terlampir, serta interaksi pengguna (kirim, edit, dll.).
 */
function InputAreaComponent({ 
  onSend, 
  isTyping, 
  editingValue, 
  isEditing, 
  onEditConfirm, 
  onCancelEdit,
  isDemo = false
}: InputAreaProps) {

  const [value, setValue] = useState("");
  const [files, setFiles] = useState<AttachedFile[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // When editing starts, populate the input with the message content
  useEffect(() => {
    if (isEditing && editingValue !== undefined) {
      setValue(editingValue);
      // Focus and move cursor to end
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.style.height = "auto";
          textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px";
        }
      }, 50);
    }
  }, [isEditing, editingValue]);

  /**
   * handleSend
   *
   * Mengirim isi pesan saat tombol kirim ditekan atau Enter tanpa Shift.
   * - Menolak pengiriman jika teks kosong dan tidak ada file terlampir.
   * - Jika sedang mengedit, memanggil `onEditConfirm` jika tersedia.
   */
  const handleSend = () => {
    if ((!value.trim() && files.length === 0) || isTyping) return;

    if (isEditing && onEditConfirm) {
      onEditConfirm(value.trim());
    } else {
      onSend(value.trim(), files.map(f => f.file));
    }

    // Reset state setelah mengirim
    setValue("");
    setFiles([]);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  /**
   * handleKeyDown
   *
   * Menangani input keyboard pada textarea:
   * - Enter tanpa Shift -> kirim pesan
   * - Escape -> batalkan edit (jika dalam mode edit)
   */
  const handleKeyDown = (e: KeyboardEvent) => {

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }

    // Cancel editing with Escape
    if (e.key === "Escape" && isEditing && onCancelEdit) {
      e.preventDefault();
      onCancelEdit();
      setValue("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
  };

  const handleFileClick = () => {
    if (isDemo) {
        toast.error("Pro Feature", { description: "Fitur upload file hanya tersedia pada versi Pro. Silakan Sign In untuk mencoba." });
        return;
    }
    fileInputRef.current?.click();
  };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const validFiles: File[] = [];
    let hasInvalid = false;

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const fileName = file.name.toLowerCase();
      if (fileName.endsWith('.pdf') || fileName.endsWith('.doc') || fileName.endsWith('.docx')) {
        validFiles.push(file);
      } else {
        hasInvalid = true;
      }
    }

    if (hasInvalid) {
      toast.error("Format tidak didukung", { description: "Hanya dapat mengupload file PDF dan DOCS." });
    }

    if (validFiles.length > 0) {
      const newFiles: AttachedFile[] = validFiles.map(file => ({
        file,
        preview: "" 
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }
    
    e.target.value = ""; // Reset input
    };

  const removeFile = (index: number) => {
    setFiles(prev => {
      const updated = [...prev];
      if (updated[index].preview) URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleCancelEdit = () => {
    if (onCancelEdit) {
      onCancelEdit();
      setValue("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    }
  };

  const canSend = (value.trim() || files.length > 0) && !isTyping;

  return (
    <div className="w-full space-y-2.5">
      {/* Editing indicator banner */}
      {isEditing && (
        <div className="flex items-center gap-2 px-3.5 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-sm text-indigo-300 font-medium">
          <span className="flex-1">Editing message — press Enter to send, Escape to cancel</span>
          <Button
            onClick={handleCancelEdit}
            className="p-1 hover:bg-indigo-500/20 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      <div className="relative bg-slate-900/70 backdrop-blur-md border border-slate-700/60 rounded-2xl px-2 sm:px-3.5 py-2 sm:py-2.5 shadow-xl shadow-black/40 focus-within:border-indigo-500/50 focus-within:shadow-lg focus-within:shadow-indigo-500/20 transition-all duration-300 hover:border-slate-600/80">
        
        {/* File Previews */}
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 pb-3 pt-1 px-1">
            {files.map((file, i) => {
              const fileExt = file.file.name.split('.').pop()?.toUpperCase() || "FILE";
              const isPdf = fileExt === "PDF";
              
              return (
                <div key={i} className="relative group flex items-center gap-2.5 sm:gap-3 bg-slate-800/90 border border-slate-700 rounded-xl p-2 sm:pl-2.5 sm:pr-4 sm:py-2 hover:bg-slate-800 transition-colors w-fit max-w-full shadow-sm">
                  <div className={cn(
                    "w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 shadow-inner", 
                    isPdf ? "bg-[#f44336] text-white" : "bg-blue-600 text-white"
                  )}>
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="flex flex-col justify-center min-w-0 max-w-30 sm:max-w-55">
                    <span className="text-xs sm:text-sm font-semibold text-slate-200 truncate leading-tight mb-0.5">
                      {file.file.name}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium leading-none">
                      {fileExt}
                    </span>
                  </div>
                  <Button
                    onClick={() => removeFile(i)}
                    className="absolute -top-2 -right-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-full p-1 text-slate-300 transition-colors shadow-md z-10"
                  >
                    <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            multiple 
            accept=".pdf,.docx"
            className="hidden" 
          />
          
          <Tooltip>
            <TooltipTrigger
              onClick={handleFileClick}
              type="button"
              disabled={isDemo}
              className={cn(
                  "text-slate-500 hover:text-slate-300 hover:bg-white/10 shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-lg transition-all duration-200 active:scale-95 flex items-center justify-center",
                  isDemo && "opacity-40 cursor-not-allowed hover:bg-transparent"
              )}
            >
              <AttachIcon />
            </TooltipTrigger>

            <TooltipContent className="bg-slate-800 border-slate-700 text-slate-200 text-xs font-medium">
              {isDemo ? "Pro Feature: Upload available in full version" : "Attach files"}
            </TooltipContent>
          </Tooltip>

          <Textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={isEditing ? "Edit your message..." : "Ask Velora AI anything..."}
            rows={1}
            className={cn(
              "flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-slate-100 placeholder:text-slate-500 py-1.5 sm:py-2 px-1 resize-none text-sm md:text-base min-h-8 sm:min-h-9 max-h-24 sm:max-h-28 overflow-y-auto shadow-none font-medium",
              isEditing && "placeholder:text-indigo-400/60"
            )}
          />

          <Button
            size="icon"
            onClick={handleSend}
            disabled={!canSend}
            className={cn(
              "w-8 h-8 sm:w-9 sm:h-9 rounded-lg transition-all duration-300 shrink-0 flex-shrink-0 active:scale-95",
              canSend
                ? "bg-gradient-to-br from-indigo-600 to-cyan-500 hover:shadow-lg hover:shadow-indigo-500/40 text-white font-semibold"
                : "bg-slate-700 text-slate-500 opacity-50 cursor-not-allowed"
            )}
          >
            <SendIcon className="w-4 h-4" />
          </Button> 
        </div>
      </div>

      <p className="text-center text-xs text-slate-500 font-medium opacity-50 px-2">
        Velora AI can make mistakes. Always verify important information.
      </p>
    </div>
  );
}

export const InputArea = memo(InputAreaComponent);