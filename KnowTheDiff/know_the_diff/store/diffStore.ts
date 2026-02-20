/**
 * Global Zustand state store for DiffVault.
 *
 * Why Zustand over React Context?
 *   - No provider boilerplate — just import and use anywhere
 *   - Built-in selectors prevent unnecessary re-renders
 *   - First-class TypeScript support
 *   - Works seamlessly with Next.js client components
 */
import { create } from "zustand";
import type { DiffResult, ViewMode } from "@/lib/diff/types";
import { computeDiff } from "@/lib/diff/engine";
import { LARGE_INPUT_THRESHOLD_BYTES } from "@/lib/constants";

export interface DiffStore {
    // ── State ─────────────────────────────────────────────────────────────────
    originalText: string;
    modifiedText: string;
    diffResult: DiffResult | null;
    viewMode: ViewMode;
    isLoading: boolean;
    error: string | null;
    /** The file extension hint for syntax highlighting, e.g. ".ts" */
    fileExtension: string;

    // ── Actions ───────────────────────────────────────────────────────────────
    /** Update both text inputs without computing the diff yet. */
    setTexts: (original: string, modified: string) => void;

    /** Set both texts and immediately run the diff computation. */
    compareTexts: (
        original: string,
        modified: string,
        options?: {
            ignoreWhitespace?: boolean;
            fileExtension?: string;
            /** When provided and input is large, run diff on server via this action. */
            serverCompute?: (
                original: string,
                modified: string,
                ignoreWhitespace: boolean,
            ) => Promise<DiffResult>;
        },
    ) => Promise<void>;

    /** Toggle or set the current view mode. */
    setViewMode: (mode: ViewMode) => void;

    /** Reset all state back to initial values. */
    reset: () => void;
}

const initialState = {
    originalText: "",
    modifiedText: "",
    diffResult: null,
    viewMode: "unified" as ViewMode,
    isLoading: false,
    error: null,
    fileExtension: ".txt",
};

export const useDiffStore = create<DiffStore>()((set, get) => ({
    ...initialState,

    setTexts: (original, modified) => {
        set({ originalText: original, modifiedText: modified, error: null });
    },

    compareTexts: async (original, modified, options = {}) => {
        set({ isLoading: true, error: null, originalText: original, modifiedText: modified });

        if (options.fileExtension) {
            set({ fileExtension: options.fileExtension });
        }

        const size = new Blob([original, modified]).size;

        try {
            let diffResult: DiffResult;

            if (
                size > LARGE_INPUT_THRESHOLD_BYTES &&
                options.serverCompute
            ) {
                diffResult = await options.serverCompute(
                    original,
                    modified,
                    options.ignoreWhitespace ?? false,
                );
            } else {
                diffResult = computeDiff({
                    original,
                    modified,
                    ignoreWhitespace: options.ignoreWhitespace ?? false,
                });
            }

            set({ diffResult, isLoading: false });
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "An unexpected error occurred.";
            set({ error: errorMessage, isLoading: false, diffResult: null });
        }
    },

    setViewMode: (mode) => set({ viewMode: mode }),

    reset: () => set(initialState),
}));
