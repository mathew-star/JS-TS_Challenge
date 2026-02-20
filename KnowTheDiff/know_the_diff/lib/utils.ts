import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SUPPORTED_FILE_EXTENSIONS } from "./constants";

/**
 * Merges Tailwind CSS class names, resolving conflicts intelligently.
 * Standard shadcn/ui helper.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a byte count into a human-readable string.
 * @param bytes - Number of bytes to format
 * @returns e.g. "1.2 MB", "456 KB", "32 B"
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1_048_576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1_048_576).toFixed(2)} MB`;
}

/**
 * Extracts the file extension (lowercase, including the dot) from a filename.
 * @param filename - The filename string, e.g. "App.tsx"
 * @returns The extension string, e.g. ".tsx", or "" if none
 */
export function getFileExtension(filename: string): string {
  const dot = filename.lastIndexOf(".");
  if (dot === -1) return "";
  return filename.slice(dot).toLowerCase();
}

/**
 * Checks whether a filename has a supported extension.
 * @param filename - The filename to validate
 */
export function isSupportedFileType(filename: string): boolean {
  const ext = getFileExtension(filename);
  return (SUPPORTED_FILE_EXTENSIONS as readonly string[]).includes(ext);
}

/**
 * Returns a syntax-highlight language hint from a file extension.
 * Used to pass the correct language to highlight.js.
 * @param ext - The file extension, e.g. ".tsx"
 */
export function langFromExtension(ext: string): string {
  const map: Record<string, string> = {
    ".js": "javascript", ".jsx": "javascript",
    ".ts": "typescript", ".tsx": "typescript",
    ".py": "python", ".json": "json",
    ".css": "css", ".html": "html",
    ".xml": "xml", ".md": "markdown",
    ".sh": "bash", ".bash": "bash",
    ".sql": "sql", ".yaml": "yaml",
    ".yml": "yaml", ".env": "bash",
  };
  return map[ext] ?? "plaintext";
}
