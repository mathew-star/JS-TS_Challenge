"use server";

import { computeDiff } from "@/lib/diff/engine";
import type { DiffResult } from "@/lib/diff/types";
import { API_DIFF_MAX_INPUT_BYTES } from "@/lib/constants";

/**
 * Server Action: compute a line diff on the server.
 * Use this for large inputs to avoid blocking the client and to stay within
 * server payload limits (API_DIFF_MAX_INPUT_BYTES).
 *
 * @param original - Original text
 * @param modified - Modified text
 * @param ignoreWhitespace - If true, treat whitespace-only changes as unchanged
 * @returns DiffResult or throws on validation/error
 */
export async function computeDiffAction(
  original: string,
  modified: string,
  ignoreWhitespace: boolean = false,
): Promise<DiffResult> {
  if (typeof original !== "string" || typeof modified !== "string") {
    throw new Error("original and modified must be strings.");
  }

  const size =
    Buffer.byteLength(original, "utf8") + Buffer.byteLength(modified, "utf8");
  if (size > API_DIFF_MAX_INPUT_BYTES) {
    throw new Error(
      `Inputs are too large (${(size / 1024 / 1024).toFixed(2)} MB). Maximum combined size is ${(API_DIFF_MAX_INPUT_BYTES / 1024 / 1024).toFixed(2)} MB.`,
    );
  }

  return computeDiff({ original, modified, ignoreWhitespace });
}
