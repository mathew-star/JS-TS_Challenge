/**
 * Custom hook for reading a File from the browser using the FileReader API.
 *
 * FileReader is the browser-native way to read local file contents without
 * sending them to a server. It works asynchronously via events (not Promises),
 * so this hook wraps it in a Promise-based, state-managed API.
 */
"use client";

import { useState, useCallback } from "react";
import { MAX_FILE_SIZE_BYTES } from "@/lib/constants";
import { getFileExtension, isSupportedFileType, formatBytes } from "@/lib/utils";

type UploadStatus = "idle" | "reading" | "success" | "error";

interface UseFileUploadReturn {
    status: UploadStatus;
    error: string | null;
    fileName: string | null;
    fileExtension: string;
    /** Read a File object and return its text content */
    readFile: (file: File) => Promise<string | null>;
    /** Reset the hook state back to idle */
    reset: () => void;
}

/**
 * Provides a typed, stateful wrapper around the browser FileReader API.
 *
 * @returns Object with status, error, fileName, and a `readFile` async function
 *
 * @example
 * const { status, error, readFile } = useFileUpload();
 * const text = await readFile(file);
 */
export function useFileUpload(): UseFileUploadReturn {
    const [status, setStatus] = useState<UploadStatus>("idle");
    const [error, setError] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [fileExtension, setFileExtension] = useState<string>(".txt");

    const reset = useCallback(() => {
        setStatus("idle");
        setError(null);
        setFileName(null);
        setFileExtension(".txt");
    }, []);

    const readFile = useCallback(async (file: File): Promise<string | null> => {
        // ── Validation ──────────────────────────────────────────────────────────
        if (!isSupportedFileType(file.name)) {
            const ext = getFileExtension(file.name) || "(none)";
            setError(`Unsupported file type: "${ext}". Please upload a text-based file.`);
            setStatus("error");
            return null;
        }

        if (file.size > MAX_FILE_SIZE_BYTES) {
            setError(
                `File too large: ${formatBytes(file.size)}. Maximum allowed size is ${formatBytes(MAX_FILE_SIZE_BYTES)}.`,
            );
            setStatus("error");
            return null;
        }

        // ── Read the file ───────────────────────────────────────────────────────
        setStatus("reading");
        setError(null);
        setFileName(file.name);
        setFileExtension(getFileExtension(file.name));

        return new Promise<string | null>((resolve) => {
            const reader = new FileReader();

            reader.onload = (event) => {
                const content = event.target?.result;
                if (typeof content === "string") {
                    setStatus("success");
                    resolve(content);
                } else {
                    setError("Failed to read file as text.");
                    setStatus("error");
                    resolve(null);
                }
            };

            reader.onerror = () => {
                setError("An error occurred while reading the file.");
                setStatus("error");
                resolve(null);
            };

            // readAsText reads the File as a UTF-8 string
            reader.readAsText(file);
        });
    }, []);

    return { status, error, fileName, fileExtension, readFile, reset };
}
