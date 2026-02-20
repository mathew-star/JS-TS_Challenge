/**
 * DiffVault diff engine — wraps jsdiff with our typed API.
 
 */
import { diffLines, type Change } from "diff";
import type { DiffInput, DiffResult } from "./types";
import { parseDiffChanges } from "./parser";

/**
 * Computes a line-by-line diff between two text strings.
 *
 * Internally uses jsdiff's `diffLines()` which runs the Myers Diff Algorithm.
 * The Myers algorithm finds the *shortest edit script* — the minimum number of
 * add/remove operations needed to transform the original into the modified text.
 *
 * @param input - An object with `original`, `modified`, and optional `ignoreWhitespace`
 * @returns A fully typed `DiffResult` with chunks, stats, and line counts
 */
export function computeDiff(input: DiffInput): DiffResult {
    const { original, modified, ignoreWhitespace = false } = input;

    // diffLines returns Change[], where each Change object represents a run of
    // consecutive lines that are all added, all removed, or all unchanged.
    const changes: Change[] = diffLines(original, modified, {
        ignoreWhitespace,
        // newlineIsToken: false means trailing newlines are part of the value,
        // not separate tokens — this keeps line counts predictable.
        newlineIsToken: false,
    });

    return parseDiffChanges(changes);
}
