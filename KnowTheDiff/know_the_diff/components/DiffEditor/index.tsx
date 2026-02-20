'use client';

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { TextEditor } from "./TextEditor";
import { FileUploader } from "./FileUploader";
import { useDiffEditor } from "@/hooks/useDiff";
import { computeDiffAction } from "@/app/actions/diff";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

type EditorTab = "text" | "file";

export default function DiffEditorPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<EditorTab>("text");
  const [fileExtension, setFileExtension] = useState<string>(".txt");

  const {
    originalText,
    modifiedText,
    isLoading,
    error,
    compareTexts,
    setTexts,
    reset,
  } = useDiffEditor();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!originalText && !modifiedText) return;
    await compareTexts(originalText, modifiedText, {
      fileExtension,
      serverCompute: computeDiffAction,
    });
    router.push("/diff");
  };

  const handleOriginalLoaded = (content: string, ext: string) => {
    setTexts(content, modifiedText);
    if (ext) setFileExtension(ext);
  };

  const handleModifiedLoaded = (content: string, ext: string) => {
    setTexts(originalText, content);
    if (ext) setFileExtension(ext);
  };

  const handleReset = () => {
    reset();
    setFileExtension(".txt");
  };

  const hasContent = !!(originalText || modifiedText);

  return (
    <div className="min-h-screen bg-background text-foreground font-['Geist_Mono',_monospace] overflow-hidden">
      {/* Ambient background — subtle in light, stronger in dark */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px] opacity-30 dark:opacity-60" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[100px] opacity-20 dark:opacity-50" />
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 39px, currentColor 39px, currentColor 40px),
              repeating-linear-gradient(90deg, transparent, transparent 39px, currentColor 39px, currentColor 40px)`,
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="block w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <span className="block w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <span className="block w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            </div>
            <span className="text-xs text-muted-foreground tracking-[0.2em] uppercase">diffvault.app</span>
          </div>

          <div className="flex items-end justify-between mt-6">
            <div>
              <h1 className="text-[2.8rem] font-bold leading-none tracking-[-0.04em] bg-gradient-to-br from-foreground via-foreground/90 to-foreground/40 bg-clip-text text-transparent">
                New Comparison
              </h1>
              <p className="mt-2 text-sm text-muted-foreground tracking-wide">
                Paste text or upload files — large inputs are computed server-side.
              </p>
            </div>

            <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground border border-border rounded-full px-4 py-1.5 bg-muted/50">
              <span className="block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Engine ready
            </div>
          </div>
        </motion.div>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden shadow-xl"
        >
          {/* Tab bar */}
          <div className="flex border-b border-border bg-muted/30">
            {(["text", "file"] as EditorTab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "relative flex-1 px-6 py-3.5 text-xs font-medium tracking-[0.12em] uppercase transition-colors duration-200",
                  activeTab === tab
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-muted"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {tab === "text" ? (
                    <>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="opacity-70">
                        <rect x="1" y="2" width="10" height="1.5" rx="0.75" fill="currentColor"/>
                        <rect x="1" y="5.25" width="7" height="1.5" rx="0.75" fill="currentColor"/>
                        <rect x="1" y="8.5" width="8.5" height="1.5" rx="0.75" fill="currentColor"/>
                      </svg>
                      Text input
                    </>
                  ) : (
                    <>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="opacity-70">
                        <path d="M2 1.5C2 1.22 2.22 1 2.5 1H7L10 4V10.5C10 10.78 9.78 11 9.5 11H2.5C2.22 11 2 10.78 2 10.5V1.5Z" stroke="currentColor" strokeWidth="1.2" fill="none"/>
                        <path d="M7 1V4H10" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" fill="none"/>
                      </svg>
                      File upload
                    </>
                  )}
                </span>
              </button>
            ))}
          </div>

          {/* Form */}
          <form className="p-6 flex flex-col gap-5" onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                {activeTab === "text" ? (
                  <TextEditor
                    originalText={originalText}
                    modifiedText={modifiedText}
                    onChangeOriginal={(value) => setTexts(value, modifiedText)}
                    onChangeModified={(value) => setTexts(originalText, value)}
                  />
                ) : (
                  <FileUploader
                    onOriginalLoaded={handleOriginalLoaded}
                    onModifiedLoaded={handleModifiedLoaded}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs text-destructive font-mono"
                >
                  <span className="text-destructive mr-2">✗</span>{error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer actions */}
            <div className="flex items-center justify-between border-t border-border pt-4 mt-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted/50 font-mono text-[10px]">⌘K</kbd>
                <span>for commands</span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors tracking-wide rounded-lg hover:bg-muted/50 border border-transparent hover:border-border"
                >
                  Reset
                </button>

                <motion.button
                  type="submit"
                  disabled={isLoading || !hasContent}
                  whileHover={{ scale: hasContent ? 1.02 : 1 }}
                  whileTap={{ scale: hasContent ? 0.98 : 1 }}
                  className={cn(
                    "relative flex items-center gap-2.5 px-6 py-2 text-xs font-semibold tracking-[0.08em] uppercase rounded-lg transition-all duration-200 overflow-hidden",
                    hasContent && !isLoading
                      ? "bg-emerald-500 text-white hover:bg-emerald-600 dark:shadow-[0_0_24px_rgba(74,222,128,0.3)]"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  )}
                >
                  {isLoading && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/10 to-transparent"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {isLoading ? (
                      <>
                        <svg className="animate-spin w-3 h-3" viewBox="0 0 12 12" fill="none">
                          <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="20" strokeDashoffset="8" strokeLinecap="round"/>
                        </svg>
                        Computing…
                      </>
                    ) : (
                      <>
                        Compare
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </>
                    )}
                  </span>
                </motion.button>
              </div>
            </div>
          </form>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-6 flex items-center gap-6 text-[11px] text-muted-foreground tracking-wide"
        >
          {[
            { label: "Max file size", value: "5 MB" },
            { label: "Formats", value: "txt, js, ts, py, json, md…" },
            { label: "Algorithm", value: "Myers diff" },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="opacity-70">—</span>
              <span>{label}: <span className="opacity-90">{value}</span></span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}