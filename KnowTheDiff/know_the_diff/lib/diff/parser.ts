/**
 * DiffVault diff parser — converts raw jsdiff Change[] into our typed DiffResult.
 *
 * Separation of concerns:
 *   - engine.ts   → calls jsdiff (knows about the algorithm)
 *   - parser.ts   → transforms raw output into our domain types (knows about our types)
 *   - types.ts    → defines the types (knows about neither)
 */
import type { Change } from "diff";
import { diffChars } from "diff";
import type { DiffChunk, DiffLine, DiffResult, DiffStats } from "./types";

/**
 * Splits a `Change.value` string into individual lines.
 * jsdiff includes the trailing newline in the value, so we split on '\n'
 * and filter out the ghost empty string at the end.
 *
 * @param value - The raw change value from jsdiff
 * @returns Array of line content strings (without trailing newlines)
 */
function splitIntoLines(value: string): string[] {
    // Split on newline, then drop the trailing empty string from "a\nb\n".split('\n')
    const lines = value.split("\n");
    if (lines[lines.length - 1] === "") lines.pop();
    return lines;
}

/**
 * Parses a raw jsdiff `Change[]` array into our typed `DiffResult`.
 *
 * Key engineering insight: jsdiff groups consecutive same-type lines into one
 * Change object. We need to "explode" each Change into individual DiffLines
 * and assign correct left/right line numbers as we go.
 *
 * @param changes - Raw output from jsdiff's `diffLines()`
 * @returns A fully typed DiffResult
 */
export function parseDiffChanges(changes: Change[]): DiffResult {
    const chunks: DiffChunk[] = [];
    const stats: DiffStats = { added: 0, removed: 0, unchanged: 0, total: 0 };

    let leftLineNumber = 1;   // tracks the current line number in the original file
    let rightLineNumber = 1;  // tracks the current line number in the modified file

    // We always emit chunks even if there's only one type — the UI can decide
    // whether to collapse unchanged sections.
    for (const change of changes) {
        const lines = splitIntoLines(change.value);
        const diffLines_: DiffLine[] = [];

        if (change.removed) {
            for (const content of lines) {
                diffLines_.push({
                    type: "removed",
                    content,
                    lineNumber: { left: leftLineNumber++, right: null },
                });
                stats.removed++;
            }
        } else if (change.added) {
            for (const content of lines) {
                diffLines_.push({
                    type: "added",
                    content,
                    lineNumber: { left: null, right: rightLineNumber++ },
                });
                stats.added++;
            }
        } else {
            // Unchanged block
            for (const content of lines) {
                diffLines_.push({
                    type: "unchanged",
                    content,
                    lineNumber: { left: leftLineNumber++, right: rightLineNumber++ },
                });
                stats.unchanged++;
            }
        }

        if (diffLines_.length > 0) {
            chunks.push({
                lines: diffLines_,
                isUnchanged: !change.added && !change.removed,
            });
        }
    }

    stats.total = stats.added + stats.removed + stats.unchanged;

    return {
        chunks,
        stats,
        originalLineCount: stats.removed + stats.unchanged,
        modifiedLineCount: stats.added + stats.unchanged,
    };
}

/**
 * Computes a character-level diff between two strings (typically two versions
 * of the same line). Used for highlighting the specific characters that changed
 * within a modified line pair.
 *
 * @param oldLine - The removed line content
 * @param newLine - The added line content
 * @returns Array of `{ added?: boolean; removed?: boolean; value: string }` segments
 */
export function computeInlineCharDiff(
    oldLine: string,
    newLine: string,
): { value: string; added?: boolean; removed?: boolean }[] {
    return diffChars(oldLine, newLine);
}
