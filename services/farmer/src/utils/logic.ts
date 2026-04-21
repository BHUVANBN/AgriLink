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

/**
 * Robustly parses land extent strings from Bhoomi/RTC
 * Handles formats like: "2.34.0", "2-34-0", "1.025 Ha", "1.025"
 */
export function parseExtentToAcres(raw: string): number {
  if (!raw) return 0;
  const s = String(raw).toLowerCase();
  
  // 1. Hectares (Ha) -> Acres conversion
  if (s.includes('ha')) {
    const m = s.match(/([\d.]+)/);
    return m ? parseFloat((parseFloat(m[1]) * 2.47105).toFixed(3)) : 0;
  }
  
  // 2. Acres-Guntas-Annas (Common in KA RTCs)
  // Standard: 1 Acre = 40 Guntas, 1 Gunta = 16 Annas
  const parts = s.split(/[-.]/).filter(p => p.trim() !== '');
  if (parts.length >= 2) {
    const a = parseFloat(parts[0]) || 0;
    const g = parseFloat(parts[1]) || 0;
    const an = parseFloat(parts[2]) || 0;
    return parseFloat((a + (g / 40) + (an / 640)).toFixed(3));
  }
  
  // 3. Fallback: simple numeric acres
  const numMatch = s.match(/[\d.]+/);
  return numMatch ? parseFloat(parseFloat(numMatch[0]).toFixed(3)) : 0;
}
