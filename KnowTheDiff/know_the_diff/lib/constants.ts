/** App-wide constants. No magic numbers in component code. */

/** Maximum file size for file uploads (1 MB). */
export const MAX_FILE_SIZE_BYTES = 1_048_576; // 1 MB

/** Input size threshold for switching to the server-side API route (10 KB). */
export const LARGE_INPUT_THRESHOLD_BYTES = 10_240; // 10 KB

/** Maximum combined input size for the /api/diff endpoint (2× max file size). */
export const API_DIFF_MAX_INPUT_BYTES = MAX_FILE_SIZE_BYTES * 2;

/**
 * File extensions that the file uploader will accept as text-like.
 * This is deliberately broad: everything here is treated as UTF-8 text.
 */
export const SUPPORTED_FILE_EXTENSIONS = [
    ".txt",
    ".md",
    ".log",
    ".conf",
    ".ini",
    ".csv",
    ".tsv",
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".json",
    ".py",
    ".css",
    ".html",
    ".xml",
    ".yaml",
    ".yml",
    ".sh",
    ".bash",
    ".sql",
    ".env",
] as const;

/** Number of unchanged lines to keep visible around a changed chunk when collapsing. */
export const UNCHANGED_CONTEXT_LINES = 3;

/** Line count above which we virtualize the diff output. */
export const VIRTUALIZE_THRESHOLD_LINES = 300;

/** Height of a single rendered diff line (px), used for virtualizer itemSize. */
export const DIFF_LINE_HEIGHT_PX = 28;
