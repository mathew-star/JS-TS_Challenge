/**
 * Custom hook that provides a clean, stable interface to the diff store.
 * Components should use this hook rather than `useDiffStore` directly —
 * it selects only the fields they need, preventing unnecessary re-renders.
 */
"use client";

import { useDiffStore } from "@/store/diffStore";
import type { ViewMode } from "@/lib/diff/types";

/**
 * Hook for the diff editor (input page).
 * Provides actions and current input state.
 */
export function useDiffEditor() {
    const originalText = useDiffStore((s) => s.originalText);
    const modifiedText = useDiffStore((s) => s.modifiedText);
    const isLoading = useDiffStore((s) => s.isLoading);
    const error = useDiffStore((s) => s.error);
    const compareTexts = useDiffStore((s) => s.compareTexts);
    const setTexts = useDiffStore((s) => s.setTexts);
    const reset = useDiffStore((s) => s.reset);

    return { originalText, modifiedText, isLoading, error, compareTexts, setTexts, reset };
}

/**
 * Hook for the diff viewer (output page).
 * Provides the computed result and view mode state.
 */
export function useDiffViewer() {
    const diffResult = useDiffStore((s) => s.diffResult);
    const viewMode = useDiffStore((s) => s.viewMode);
    const fileExtension = useDiffStore((s) => s.fileExtension);
    const setViewMode = useDiffStore((s) => s.setViewMode);
    const isLoading = useDiffStore((s) => s.isLoading);
    const stats = diffResult?.stats ?? null;

    return { diffResult, viewMode, fileExtension, setViewMode, isLoading, stats };
}

/**
 * Hook that checks if a diff result exists (for redirect logic on the /diff page).
 */
export function useDiffExists(): boolean {
    return useDiffStore((s) => s.diffResult !== null);
}
