'use client';

import type { DiffLine as DiffLineType } from "@/lib/diff/types";
import { cn } from "@/lib/utils";

type DiffLineVariant = "unified" | "split";

interface DiffLineProps {
  line: DiffLineType;
  variant: DiffLineVariant;
}

/**
 * Renders a single diff line with consistent styling.
 *
 * In unified mode, both line numbers and content appear in one row.
 * In split mode, content is rendered into left/right panes depending
 * on whether the line was added, removed, or unchanged.
 */
export function DiffLine({ line, variant }: DiffLineProps) {
  const { type, content, lineNumber } = line;

  const bgClass =
    type === "added"
      ? "bg-emerald-500/10 dark:bg-emerald-500/15"
      : type === "removed"
        ? "bg-rose-500/10 dark:bg-rose-500/15"
        : "bg-background";

  const textClass =
    type === "added"
      ? "text-emerald-800 dark:text-emerald-200"
      : type === "removed"
        ? "text-rose-800 dark:text-rose-200"
        : "text-foreground";

  const marker = type === "added" ? "+" : type === "removed" ? "-" : " ";

  if (variant === "unified") {
    return (
      <div
        className={cn(
          "flex min-h-[28px] items-stretch border-b border-border/50 text-[13px] leading-relaxed",
          bgClass,
        )}
      >
        <span className="w-14 shrink-0 border-r border-border/50 bg-muted/30 px-2 py-1.5 text-right text-muted-foreground select-none tabular-nums">
          {lineNumber.left ?? ""}
        </span>
        <span className="w-14 shrink-0 border-r border-border/50 bg-muted/30 px-2 py-1.5 text-right text-muted-foreground select-none tabular-nums">
          {lineNumber.right ?? ""}
        </span>
        <span className="w-7 shrink-0 border-r border-border/50 px-2 py-1.5 text-center select-none text-muted-foreground">
          {marker}
        </span>
        <span className={cn("min-w-0 flex-1 px-3 py-1.5 whitespace-pre-wrap break-words", textClass)}>
          {content}
        </span>
      </div>
    );
  }

  // Split (side-by-side) variant
  const leftShowsContent = type === "removed" || type === "unchanged";
  const rightShowsContent = type === "added" || type === "unchanged";

  return (
    <div className="flex min-h-[28px] border-b border-border/50 text-[13px] leading-relaxed">
      {/* Left pane */}
      <div
        className={cn(
          "flex w-1/2 min-w-0 items-stretch border-r border-border/50",
          leftShowsContent && type === "removed" && bgClass,
          leftShowsContent && type === "unchanged" && "bg-background",
        )}
      >
        <span className="w-14 shrink-0 border-r border-border/50 bg-muted/30 px-2 py-1.5 text-right text-muted-foreground select-none tabular-nums">
          {lineNumber.left ?? ""}
        </span>
        <span className="w-7 shrink-0 border-r border-border/50 px-2 py-1.5 text-center select-none text-muted-foreground">
          {type === "removed" ? "−" : type === "unchanged" ? " " : ""}
        </span>
        <span
          className={cn(
            "min-w-0 flex-1 px-3 py-1.5 whitespace-pre-wrap break-words",
            leftShowsContent ? textClass : "text-muted-foreground",
          )}
        >
          {leftShowsContent ? content : ""}
        </span>
      </div>

      {/* Right pane */}
      <div
        className={cn(
          "flex w-1/2 min-w-0 items-stretch",
          rightShowsContent && type === "added" && bgClass,
          rightShowsContent && type === "unchanged" && "bg-background",
        )}
      >
        <span className="w-14 shrink-0 border-r border-border/50 bg-muted/30 px-2 py-1.5 text-right text-muted-foreground select-none tabular-nums">
          {lineNumber.right ?? ""}
        </span>
        <span className="w-7 shrink-0 border-r border-border/50 px-2 py-1.5 text-center select-none text-muted-foreground">
          {type === "added" ? "+" : type === "unchanged" ? " " : ""}
        </span>
        <span
          className={cn(
            "min-w-0 flex-1 px-3 py-1.5 whitespace-pre-wrap break-words",
            rightShowsContent ? textClass : "text-muted-foreground",
          )}
        >
          {rightShowsContent ? content : ""}
        </span>
      </div>
    </div>
  );
}

