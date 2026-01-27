import { DiffOp } from "../Types/index";

function build_lcs(str1: string, str2: string) {
  const m = str1.length;
  const n = str2.length;

  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));



  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp;


}


function extract_lcs(str1: string, str2: string, dp: number[][]): string {

  let i = str1.length;
  let j = str2.length;


  const result: string[] = [];

  while (i > 0 && j > 0) {
    if (str1[i - 1] === str2[j - 1]) {
      result.push(str1[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  return result.reverse().join("");
}




function diff_using_lcs(oldStr: string, newStr: string, lcs: string): DiffOp[] {
  let i = 0, j = 0, k = 0;
  const ops: DiffOp[] = [];

  while (k < lcs.length) {
    const anchor = lcs[k];

    while (oldStr[i] !== anchor) {
      ops.push({ type: "remove", value: oldStr[i++] });
    }

    while (newStr[j] !== anchor) {
      ops.push({ type: "add", value: newStr[j++] });
    }

    ops.push({ type: "equal", value: anchor });
    i++;
    j++;
    k++;
  }

  while (i < oldStr.length) {
    ops.push({ type: "remove", value: oldStr[i++] });
  }

  while (j < newStr.length) {
    ops.push({ type: "add", value: newStr[j++] });
  }

  return ops;
}


export default function diff(oldStr: string, newStr: string): DiffOp[] {
  const dp = build_lcs(oldStr, newStr);
  const lcs = extract_lcs(oldStr, newStr, dp);
  return diff_using_lcs(oldStr, newStr, lcs);
}

