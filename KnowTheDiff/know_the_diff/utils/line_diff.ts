import { DiffOp } from "../Types";

export type LineDiffOp = {
  type: "equal" | "add" | "remove" | "modify";
  lineNumber: number;
  content: string;
  oldLineNumber?: number; // for equal/remove
  newLineNumber?: number; // for equal/add
};
/*  
* here i will be using simple line comparison 
*
*  */
export function lineDiff(oldText: string, newText: string): LineDiffOp[] {
  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');

  // For now, simple line-by-line comparison
  const maxLines = Math.max(oldLines.length, newLines.length);
  const result: LineDiffOp[] = [];

  for (let i = 0; i < maxLines; i++) {
    const oldLine = oldLines[i];
    const newLine = newLines[i];

    if (oldLine === newLine) {
      result.push({
        type: "equal",
        lineNumber: i + 1,
        content: oldLine,
        oldLineNumber: i + 1,
        newLineNumber: i + 1
      });
    } else if (oldLine && newLine) {
      // Line modified - improve this later
      result.push({
        type: "remove",
        lineNumber: i + 1,
        content: oldLine,
        oldLineNumber: i + 1
      });
      result.push({
        type: "add",
        lineNumber: i + 1,
        content: newLine,
        newLineNumber: i + 1
      });
    } else if (oldLine) {
      result.push({
        type: "remove",
        lineNumber: i + 1,
        content: oldLine,
        oldLineNumber: i + 1
      });
    } else if (newLine) {
      result.push({
        type: "add",
        lineNumber: i + 1,
        content: newLine,
        newLineNumber: i + 1
      });
    }
  }

  return result;
}
