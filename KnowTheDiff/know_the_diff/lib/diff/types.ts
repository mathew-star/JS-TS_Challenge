/**
 * Core TypeScript types for the DiffVault diff engine.
 * Uses discriminated unions for exhaustive type-checking.
 */

// ─── Line-level types ────────────────────────────────────────────────────────

/**
 * The three possible states for a line in a diff.
 * Using a discriminated union ensures we can never mix up line types.
 */
export type DiffLineType = 'added' | 'removed' | 'unchanged';

/**
 * Represents a single line in a diff result.
 * Line numbers follow the rule: added lines have only `right`,
 * removed lines have only `left`, unchanged lines have both.
 */
export type DiffLine =
    | { type: 'added'; content: string; lineNumber: { left: null; right: number } }
    | { type: 'removed'; content: string; lineNumber: { left: number; right: null } }
    | { type: 'unchanged'; content: string; lineNumber: { left: number; right: number } };

// ─── Chunk-level types ────────────────────────────────────────────────────────

/**
 * A contiguous group of diff lines, used to group changes together.
 * Unchanged chunks can be collapsed in the UI.
 */
export interface DiffChunk {
    lines: DiffLine[];
    isUnchanged: boolean;
}

// ─── Statistics ───────────────────────────────────────────────────────────────

/**
 * Summary statistics for a diff operation.
 */
export interface DiffStats {
    added: number;
    removed: number;
    unchanged: number;
    total: number;
}

// ─── Top-level result ─────────────────────────────────────────────────────────

/**
 * The complete result of a diff computation.
 * This is the primary data structure flowing through the app.
 */
export interface DiffResult {
    chunks: DiffChunk[];
    stats: DiffStats;
    originalLineCount: number;
    modifiedLineCount: number;
}

// ─── View mode ────────────────────────────────────────────────────────────────

/** The two display modes available in the DiffViewer. */
export type ViewMode = 'unified' | 'side-by-side';

// ─── Input types ─────────────────────────────────────────────────────────────

/** Input to the diff engine. */
export interface DiffInput {
    original: string;
    modified: string;
    /** If true, treat whitespace-only changes as unchanged. */
    ignoreWhitespace?: boolean;
}
