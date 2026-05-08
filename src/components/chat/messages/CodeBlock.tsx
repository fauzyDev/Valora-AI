/**
 * CodeBlock.tsx
 *
 * Komponen untuk merender blok kode dengan highlight syntax menggunakan
 * `react-syntax-highlighter`. Menyediakan tombol untuk menyalin isi kode.
 */

"use client";

import React, { useState, memo } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { CopyIcon, CheckIcon } from "@/components/chat/icons";
import { Button } from "@/components/ui/button";

interface CodeBlockProps {
  language: string;
  value: string;
}

const CodeBlock: React.FC<CodeBlockProps> = memo(({ language, value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-6 rounded-lg overflow-hidden border border-white/10 bg-[#0d1117] shadow-xl transition-all duration-300 hover:border-indigo-500/30">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-white/5">
        <span className="text-[11px] font-mono font-medium tracking-wider text-slate-400 uppercase">
          {language || "text"}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-7 px-2 gap-1.5 text-[11px] font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200"
        >
          {copied ? (
            <span className="flex items-center gap-1.5">
              <CheckIcon />
              <span>Copied!</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <CopyIcon />
              <span>Copy</span>
            </span>
          )}
        </Button>
      </div>

      {/* Code Area */}
      <div className="overflow-x-auto custom-scrollbar">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          PreTag="div"
          customStyle={{
            margin: 0,
            padding: "1.25rem",
            background: "transparent",
            fontSize: "0.875rem",
            lineHeight: "1.6",
          }}
          codeTagProps={{
            style: {
              fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace)',
            },
          }}
        >
          {value}
        </SyntaxHighlighter>
      </div>
    </div>
  );
});

CodeBlock.displayName = "CodeBlock";

export default CodeBlock;
