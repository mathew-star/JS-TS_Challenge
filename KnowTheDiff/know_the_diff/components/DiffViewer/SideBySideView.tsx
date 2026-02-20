'use client';

import type { DiffResult } from "@/lib/diff/types";
import { DiffLine } from "./DiffLine";

interface SideBySideViewProps {
  result: DiffResult;
}

/**
 * Renders a side-by-side (split) diff view, similar to GitHub's split diff.
 */
export function SideBySideView({ result }: SideBySideViewProps) {
  if (result.chunks.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
        No differences found — both inputs are identical.
      </div>
    );
  }

  return (
    <div className="overflow-auto rounded-xl border border-border bg-card shadow-sm">
      <div className="min-w-0 font-mono text-[13px]">
      {result.chunks.map((chunk, chunkIndex) =>
        chunk.lines.map((line, lineIndex) => (
          <DiffLine
            key={`${chunkIndex}-${lineIndex}`}
            line={line}
            variant="split"
          />
        )),
      )}
      </div>
    </div>
  );
}

