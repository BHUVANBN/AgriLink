/**
 * Farmer Service - Internal Logic Helpers 🌾
 * Script-neutral normalization and multi-algorithm matching
 */

export function computeNameMatchConfidence(a: string, b: string): number {
  if (!a || !b) return 0;

  // Normalize: Uppercase and remove all punctuation/whitespace (Preserves Kannada & Unicode letters)
  const normA = a.toUpperCase().replace(/[^\p{L}\p{N}]/gu, '');
  const normB = b.toUpperCase().replace(/[^\p{L}\p{N}]/gu, '');

  if (!normA || !normB) return 0;

  // 1. Exact or Prefix Match (Highest Confidence)
  // Industry Standard: If the record starts with the Aadhaar name, it's a valid match
  if (normB.startsWith(normA) || normA === normB) return 1.0;

  // 2. Fragment Match (If Aadhaar first name is found in RTC)
  const firstWordA = a.trim().split(/\s+/)[0].toUpperCase().replace(/[^\p{L}\p{N}]/gu, '');
  if (firstWordA.length >= 3 && normB.includes(firstWordA)) return 0.95;

  // 3. Fallback: Fuzzy Comparison (Levenshtein)
  const maxLen = Math.max(normA.length, normB.length);
  const edits = levenshtein(normA, normB);
  const confidence = 1 - edits / maxLen;
  
  return Number(confidence.toFixed(4));
}

export function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}
