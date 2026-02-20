import { describe, it, expect } from "vitest";
import { computeDiff } from "@/lib/diff/engine";

describe("computeDiff — engine", () => {
    it("handles two identical strings (no changes)", () => {
        const result = computeDiff({ original: "hello\nworld\n", modified: "hello\nworld\n" });
        expect(result.stats.added).toBe(0);
        expect(result.stats.removed).toBe(0);
        expect(result.stats.unchanged).toBe(2);
    });

    it("handles two empty strings", () => {
        const result = computeDiff({ original: "", modified: "" });
        expect(result.stats.total).toBe(0);
        expect(result.chunks).toHaveLength(0);
    });

    it("handles original being empty (pure addition)", () => {
        const result = computeDiff({ original: "", modified: "line1\nline2\n" });
        expect(result.stats.added).toBe(2);
        expect(result.stats.removed).toBe(0);
        expect(result.stats.unchanged).toBe(0);
    });

    it("handles modified being empty (pure deletion)", () => {
        const result = computeDiff({ original: "line1\nline2\n", modified: "" });
        expect(result.stats.added).toBe(0);
        expect(result.stats.removed).toBe(2);
        expect(result.stats.unchanged).toBe(0);
    });

    it("detects a single changed line", () => {
        const result = computeDiff({
            original: "hello\nworld\n",
            modified: "hello\nearth\n",
        });
        expect(result.stats.added).toBe(1);
        expect(result.stats.removed).toBe(1);
        expect(result.stats.unchanged).toBe(1);
    });

    it("handles complete replacement", () => {
        const result = computeDiff({
            original: "foo\nbar\nbaz\n",
            modified: "alpha\nbeta\ngamma\n",
        });
        expect(result.stats.added).toBe(3);
        expect(result.stats.removed).toBe(3);
        expect(result.stats.unchanged).toBe(0);
    });

    it("assigns correct line counts", () => {
        const result = computeDiff({
            original: "a\nb\n",
            modified: "a\nb\nc\n",
        });
        expect(result.originalLineCount).toBe(2);
        expect(result.modifiedLineCount).toBe(3);
    });

    it("produces correct total stats", () => {
        const result = computeDiff({
            original: "keep\nremove\n",
            modified: "keep\nadd1\nadd2\n",
        });
        expect(result.stats.total).toBe(result.stats.added + result.stats.removed + result.stats.unchanged);
    });

    it("ignores leading/trailing whitespace when flag is set", () => {
        // jsdiff ignoreWhitespace trims lines for comparison, so lines that
        // differ only in leading/trailing whitespace are treated as unchanged.
        const result = computeDiff({
            original: "  hello\n",
            modified: "hello\n",  // same content, no leading spaces
            ignoreWhitespace: true,
        });
        // With ignoreWhitespace, trimmed values match → treated as unchanged
        expect(result.stats.removed).toBe(0);
        expect(result.stats.added).toBe(0);
        expect(result.stats.unchanged).toBe(1);
    });

    it("detects whitespace differences when flag is not set", () => {
        const result = computeDiff({
            original: "hello world\n",
            modified: "hello  world\n",  // extra space
        });
        expect(result.stats.added + result.stats.removed).toBeGreaterThan(0);
    });
});
