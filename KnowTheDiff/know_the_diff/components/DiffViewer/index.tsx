'use client';

import { UnifiedView } from "./UnifiedView";
import { SideBySideView } from "./SideBySideView";
import { useDiffViewer } from "@/hooks/useDiff";
import { Button } from "@/components/ui/button";
import { langFromExtension } from "@/lib/utils";

/**
 * High-level DiffViewer component that:
 *   - Reads the diff result and view mode from the global store
 *   - Renders unified or side-by-side views
 *   - Shows basic statistics about the diff
 */
export default function DiffViewerPage() {
  const { diffResult, viewMode, setViewMode, fileExtension, stats } =
    useDiffViewer();

  if (!diffResult) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground shadow-sm">
          <p className="text-sm">No diff has been computed yet.</p>
          <p className="mt-1 text-xs">Use the header to start a new comparison.</p>
        </div>
      </div>
    );
  }

  const language = langFromExtension(fileExtension);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Diff result
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {viewMode === "unified" ? "Unified" : "Side-by-side"} view
            {language ? ` · ${language}` : ""}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {stats && (
            <div className="flex flex-wrap gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
              <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                +{stats.added}
              </span>
              <span className="rounded bg-rose-500/20 px-2 py-0.5 text-xs font-medium text-rose-700 dark:text-rose-400">
                −{stats.removed}
              </span>
              <span className="text-xs text-muted-foreground">
                {stats.unchanged} unchanged · {stats.total} total
              </span>
            </div>
          )}
          <div className="inline-flex rounded-lg border border-border bg-muted/30 p-0.5">
            <Button
              type="button"
              size="sm"
              variant={viewMode === "unified" ? "default" : "ghost"}
              className="rounded-md text-xs"
              onClick={() => setViewMode("unified")}
            >
              Unified
            </Button>
            <Button
              type="button"
              size="sm"
              variant={viewMode === "side-by-side" ? "default" : "ghost"}
              className="rounded-md text-xs"
              onClick={() => setViewMode("side-by-side")}
            >
              Side-by-side
            </Button>
          </div>
        </div>
      </header>

      {viewMode === "unified" ? (
        <UnifiedView result={diffResult} />
      ) : (
        <SideBySideView result={diffResult} />
      )}
    </div>
  );
}

