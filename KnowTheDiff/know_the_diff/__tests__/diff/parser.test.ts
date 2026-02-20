import { describe, it, expect } from "vitest";
import type { Change } from "diff";
import { parseDiffChanges, computeInlineCharDiff } from "@/lib/diff/parser";

/** Helper: build a simple Change array for testing */
function makeChanges(items: { value: string; added?: boolean; removed?: boolean }[]): Change[] {
    return items.map(i => ({
        value: i.value,
        added: i.added ?? false,
        removed: i.removed ?? false,
        count: i.value.split("\n").filter(Boolean).length,
    }));
}

describe("parseDiffChanges — parser", () => {
    it("assigns correct left line numbers to removed lines", () => {
        const changes = makeChanges([
            { value: "line1\nline2\n", removed: true },
        ]);
        const result = parseDiffChanges(changes);
        const lines = result.chunks[0].lines;
        expect(lines[0].lineNumber.left).toBe(1);
        expect(lines[1].lineNumber.left).toBe(2);
        expect(lines[0].lineNumber.right).toBeNull();
    });

    it("assigns correct right line numbers to added lines", () => {
        const changes = makeChanges([
            { value: "line1\nline2\n", added: true },
        ]);
        const result = parseDiffChanges(changes);
        const lines = result.chunks[0].lines;
        expect(lines[0].lineNumber.right).toBe(1);
        expect(lines[1].lineNumber.right).toBe(2);
        expect(lines[0].lineNumber.left).toBeNull();
    });

    it("assigns both left and right line numbers to unchanged lines", () => {
        const changes = makeChanges([
            { value: "same\n" },
        ]);
        const result = parseDiffChanges(changes);
        const line = result.chunks[0].lines[0];
        expect(line.lineNumber.left).toBe(1);
        expect(line.lineNumber.right).toBe(1);
    });

    it("increments line numbers correctly across mixed changes", () => {
        // Simulates: original has lines 1+2 unchanged, then line 3 removed, then added
        const changes = makeChanges([
            { value: "keep1\nkeep2\n" },             // unchanged — left 1,2 / right 1,2
            { value: "old\n", removed: true },        // removed  — left 3
            { value: "new\n", added: true },          // added    — right 3
        ]);
        const result = parseDiffChanges(changes);
        const [unchangedChunk, removedChunk, addedChunk] = result.chunks;

        // Unchanged
        expect(unchangedChunk.lines[1].lineNumber.left).toBe(2);
        expect(unchangedChunk.lines[1].lineNumber.right).toBe(2);

        // Removed — left is 3, right is null
        expect(removedChunk.lines[0]).toMatchObject({
            type: "removed",
            lineNumber: { left: 3, right: null },
        });

        // Added — right is 3, left is null
        expect(addedChunk.lines[0]).toMatchObject({
            type: "added",
            lineNumber: { left: null, right: 3 },
        });
    });

    it("marks unchanged chunks with isUnchanged=true", () => {
        const changes = makeChanges([{ value: "same\n" }]);
        const result = parseDiffChanges(changes);
        expect(result.chunks[0].isUnchanged).toBe(true);
    });

    it("marks added chunks with isUnchanged=false", () => {
        const changes = makeChanges([{ value: "new\n", added: true }]);
        const result = parseDiffChanges(changes);
        expect(result.chunks[0].isUnchanged).toBe(false);
    });

    it("computes correct stats", () => {
        const changes = makeChanges([
            { value: "keep\n" },
            { value: "removed\n", removed: true },
            { value: "added\n", added: true },
        ]);
        const result = parseDiffChanges(changes);
        expect(result.stats).toMatchObject({ added: 1, removed: 1, unchanged: 1, total: 3 });
    });

    it("computes correct original and modified line counts", () => {
        const changes = makeChanges([
            { value: "keep\n" },             // unchanged: left=1, right=1
            { value: "old\n", removed: true },// removed: left=2
            { value: "new1\nnew2\n", added: true }, // added: right=2,3
        ]);
        const result = parseDiffChanges(changes);
        // original = unchanged (1) + removed (1) = 2
        // modified = unchanged (1) + added (2) = 3
        expect(result.originalLineCount).toBe(2);
        expect(result.modifiedLineCount).toBe(3);
    });
});

describe("computeInlineCharDiff — parser", () => {
    it("returns unchanged segments for identical strings", () => {
        const segments = computeInlineCharDiff("hello", "hello");
        expect(segments.every(s => !s.added && !s.removed)).toBe(true);
        expect(segments.map(s => s.value).join("")).toBe("hello");
    });

    it("detects a character change", () => {
        const segments = computeInlineCharDiff("cat", "bat");
        const removed = segments.filter(s => s.removed);
        const added = segments.filter(s => s.added);
        expect(removed.some(s => s.value === "c")).toBe(true);
        expect(added.some(s => s.value === "b")).toBe(true);
    });

    it("handles completely different strings", () => {
        const segments = computeInlineCharDiff("abc", "xyz");
        const hasAdditions = segments.some(s => s.added);
        const hasDeletions = segments.some(s => s.removed);
        expect(hasAdditions).toBe(true);
        expect(hasDeletions).toBe(true);
    });
});
