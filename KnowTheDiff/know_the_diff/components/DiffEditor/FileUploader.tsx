'use client';

import type { ChangeEvent, DragEvent } from "react";
import { useState } from "react";
import { useFileUpload } from "@/hooks/useFileUpload";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface FileUploaderProps {
  onOriginalLoaded: (content: string, extension: string) => void;
  onModifiedLoaded: (content: string, extension: string) => void;
}

type UploadState = "idle" | "dragging" | "reading" | "success" | "error";

function DropZone({
  label,
  accent,
  upload,
  onFileLoaded,
}: {
  label: string;
  accent: "emerald" | "sky";
  upload: ReturnType<typeof useFileUpload>;
  onFileLoaded: (content: string, ext: string) => void;
}) {
  const [dragState, setDragState] = useState<"idle" | "over">("idle");

  const accentMap = {
    emerald: {
      dot: "bg-emerald-500",
      label: "text-emerald-500",
      border: {
        idle: "border-border",
        over: "border-emerald-500/40",
        success: "border-emerald-500/30",
        error: "border-destructive/50",
      },
      bg: {
        idle: "bg-card",
        over: "bg-emerald-500/5",
        success: "bg-emerald-500/5",
        error: "bg-destructive/10",
      },
      icon: "text-emerald-500",
      glow: "shadow-[0_0_30px_rgba(74,222,128,0.08)]",
    },
    sky: {
      dot: "bg-sky-500",
      label: "text-sky-500",
      border: {
        idle: "border-border",
        over: "border-sky-500/40",
        success: "border-sky-500/30",
        error: "border-destructive/50",
      },
      bg: {
        idle: "bg-card",
        over: "bg-sky-500/5",
        success: "bg-sky-500/5",
        error: "bg-destructive/10",
      },
      icon: "text-sky-500",
      glow: "shadow-[0_0_30px_rgba(56,189,248,0.08)]",
    },
  }[accent];

  const state: UploadState =
    upload.status === "reading"
      ? "reading"
      : upload.status === "success"
      ? "success"
      : upload.error
      ? "error"
      : dragState === "over"
      ? "dragging"
      : "idle";

  const borderClass = {
    idle: accentMap.border.idle,
    dragging: accentMap.border.over,
    reading: accentMap.border.over,
    success: accentMap.border.success,
    error: accentMap.border.error,
  }[state];

  const bgClass = {
    idle: accentMap.bg.idle,
    dragging: accentMap.bg.over,
    reading: accentMap.bg.over,
    success: accentMap.bg.success,
    error: accentMap.bg.error,
  }[state];

  const handleDrop = async (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragState("idle");
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const content = await upload.readFile(file);
    if (content !== null) onFileLoaded(content, upload.fileExtension);
  };

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const content = await upload.readFile(file);
    if (content !== null) onFileLoaded(content, upload.fileExtension);
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Label */}
      <div className="flex items-center gap-2 px-0.5">
        <span className={cn("block w-1.5 h-1.5 rounded-full", accentMap.dot)} />
        <span className={cn("text-[11px] font-semibold uppercase tracking-[0.14em]", accentMap.label)}>
          {label}
        </span>
      </div>

      {/* Drop area */}
      <label
        className={cn(
          "relative flex flex-col items-center justify-center min-h-[200px] rounded-xl border-2 border-dashed cursor-pointer transition-all duration-300",
          borderClass,
          bgClass,
          state === "dragging" && accentMap.glow,
          state === "success" && accentMap.glow,
        )}
        onDragOver={(e) => { e.preventDefault(); setDragState("over"); }}
        onDragLeave={() => setDragState("idle")}
        onDrop={handleDrop}
      >
        <input type="file" className="sr-only" onChange={handleChange} />

        <AnimatePresence mode="wait">
          {state === "reading" && (
            <motion.div
              key="reading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-3"
            >
              <svg className={cn("animate-spin w-8 h-8", accentMap.icon)} viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" strokeDasharray="40" strokeDashoffset="15" strokeLinecap="round" opacity="0.3"/>
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" strokeDasharray="10" strokeDashoffset="5" strokeLinecap="round"/>
              </svg>
              <span className="text-xs text-muted-foreground font-mono">Reading file…</span>
            </motion.div>
          )}

          {state === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.4, delay: 0.05 }}
                className={cn("w-12 h-12 rounded-full flex items-center justify-center border", accentMap.border.success, accentMap.bg.success)}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={accentMap.icon}>
                  <path d="M4 10.5l4.5 4.5 7.5-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
              <div className="text-center">
                <p className={cn("text-xs font-semibold font-mono", accentMap.icon)}>{upload.fileName}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Loaded · click to replace</p>
              </div>
            </motion.div>
          )}

          {state === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center border border-destructive/30 bg-destructive/10">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-destructive">
                  <path d="M8 3v6M8 11.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <p className="text-xs text-destructive font-mono text-center max-w-[180px]">{upload.error}</p>
            </motion.div>
          )}

          {(state === "idle" || state === "dragging") && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <motion.div
                animate={state === "dragging" ? { scale: 1.1, y: -4 } : { scale: 1, y: 0 }}
                transition={{ type: "spring", bounce: 0.3 }}
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center border transition-colors duration-200",
                  state === "dragging"
                    ? cn(accentMap.border.over, "bg-white/[0.06]")
                    : "border-border bg-muted/30"
                )}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={cn("transition-colors", state === "dragging" ? accentMap.icon : "text-muted-foreground")}>
                  <path d="M4 13.5V15.5C4 16.05 4.45 16.5 5 16.5H15C15.55 16.5 16 16.05 16 15.5V13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                  <path d="M10 3.5V12.5M10 3.5L7 6.5M10 3.5L13 6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>

              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  {state === "dragging" ? (
                    <span className={accentMap.icon}>Drop to upload</span>
                  ) : (
                    <>Drag & drop or <span className={accentMap.label}>browse</span></>
                  )}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">txt, js, ts, py, json, md, css, html…</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </label>
    </div>
  );
}

export function FileUploader({ onOriginalLoaded, onModifiedLoaded }: FileUploaderProps) {
  const originalUpload = useFileUpload();
  const modifiedUpload = useFileUpload();

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 md:grid-cols-2">
        <DropZone
          label="Original file"
          accent="emerald"
          upload={originalUpload}
          onFileLoaded={onOriginalLoaded}
        />
        <DropZone
          label="Modified file"
          accent="sky"
          upload={modifiedUpload}
          onFileLoaded={onModifiedLoaded}
        />
      </div>

      {(originalUpload.status === "success" || modifiedUpload.status === "success") && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-end"
        >
          <button
            type="button"
            onClick={() => {
              originalUpload.reset();
              modifiedUpload.reset();
            }}
            className="text-[11px] text-muted-foreground hover:text-foreground transition-colors tracking-wide font-mono"
          >
            ✕ Clear all files
          </button>
        </motion.div>
      )}
    </div>
  );
}