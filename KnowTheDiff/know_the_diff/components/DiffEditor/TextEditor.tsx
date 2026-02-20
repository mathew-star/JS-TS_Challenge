'use client';

import type { ChangeEvent } from "react";
import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface TextEditorProps {
  originalText: string;
  modifiedText: string;
  onChangeOriginal: (value: string) => void;
  onChangeModified: (value: string) => void;
}

function CharCount({ text }: { text: string }) {
  const lines = text ? text.split("\n").length : 0;
  const chars = text.length;
  if (!chars) return null;
  return (
    <span className="text-[10px] text-muted-foreground font-mono tabular-nums">
      {lines}L · {chars}C
    </span>
  );
}

function EditorPane({
  label,
  value,
  placeholder,
  onChange,
  accent,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  accent: "emerald" | "sky";
}) {
  const [focused, setFocused] = useState(false);

  const accentStyles = {
    emerald: {
      dot: "bg-[#4ade80]",
      ring: "ring-[#4ade80]/20",
      border: "border-[#4ade80]/20",
      label: "text-[#4ade80]",
      glow: "shadow-[0_0_0_1px_rgba(74,222,128,0.15),0_0_20px_rgba(74,222,128,0.05)]",
    },
    sky: {
      dot: "bg-[#38bdf8]",
      ring: "ring-[#38bdf8]/20",
      border: "border-[#38bdf8]/20",
      label: "text-[#38bdf8]",
      glow: "shadow-[0_0_0_1px_rgba(56,189,248,0.15),0_0_20px_rgba(56,189,248,0.05)]",
    },
  }[accent];

  return (
    <div className="flex-1 flex flex-col gap-2 min-w-0">
      {/* Label row */}
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-2">
          <span className={cn("block w-1.5 h-1.5 rounded-full", accentStyles.dot)} />
          <span className={cn("text-[11px] font-semibold uppercase tracking-[0.14em]", accentStyles.label)}>
            {label}
          </span>
        </div>
        <CharCount text={value} />
      </div>

      {/* Textarea container */}
      <motion.div
        animate={focused ? { scale: 1 } : { scale: 1 }}
        className={cn(
          "relative rounded-xl border bg-card transition-all duration-200 overflow-hidden",
          focused
            ? cn("border-border", accentStyles.glow)
            : "border-border/70 hover:border-border"
        )}
      >
        {/* Line numbers */}
        {value && (
          <div
            className="absolute top-0 left-0 bottom-0 w-10 border-r border-border bg-muted/30 flex flex-col pt-3 overflow-hidden pointer-events-none select-none"
            aria-hidden
          >
            {value.split("\n").slice(0, 60).map((_, i) => (
              <div
                key={i}
                className="text-[10px] text-muted-foreground font-mono text-right pr-2.5 leading-[1.625rem]"
              >
                {i + 1}
              </div>
            ))}
          </div>
        )}

        <textarea
          value={value}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          spellCheck={false}
          className={cn(
            "block w-full min-h-[260px] resize-y bg-transparent text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none leading-[1.625rem]",
            "px-3 py-3 transition-all duration-150",
            value ? "pl-12" : "pl-3"
          )}
        />

        {/* Empty state hint */}
        {!value && (
          <div className="absolute bottom-3 right-3 pointer-events-none">
            <div className="text-[10px] text-muted-foreground/50 font-mono">
              {label === "Original" ? "v1" : "v2"}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export function TextEditor({
  originalText,
  modifiedText,
  onChangeOriginal,
  onChangeModified,
}: TextEditorProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <EditorPane
        label="Original"
        value={originalText}
        placeholder="Paste the original version here…"
        onChange={onChangeOriginal}
        accent="emerald"
      />

      {/* Divider with diff arrow */}
      <div className="hidden md:flex flex-col items-center justify-center gap-2 pt-8 shrink-0">
        <div className="w-px flex-1 bg-gradient-to-b from-transparent via-border to-transparent" />
        <div className="flex items-center justify-center w-7 h-7 rounded-full border border-border bg-muted/50">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-muted-foreground">
            <path d="M3 6h6M7 4l2 2-2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="w-px flex-1 bg-gradient-to-b from-transparent via-border to-transparent" />
      </div>

      <EditorPane
        label="Modified"
        value={modifiedText}
        placeholder="Paste the modified version here…"
        onChange={onChangeModified}
        accent="sky"
      />
    </div>
  );
}