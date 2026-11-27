/**
 * Farmer Service - Internal Logic Helpers 🌾
 * Script-neutral normalization and multi-algorithm matching
 */

/** Score at/above which Aadhaar and RTC names are considered the same person. */
export const MATCH_THRESHOLD = 0.85;
/** Only an exact (normalised) full-name match may skip admin review. */
export const AUTO_APPROVE_THRESHOLD = 1.0;

const normalise = (v: string) => v.toUpperCase().replace(/[^\p{L}\p{N}]/gu, '');
const tokens = (v: string) => v.toUpperCase().split(/[\s.,]+/).map(normalise).filter(Boolean);

/**
 * Name match between Aadhaar and RTC owner name.
 *  1.0  → identical after normalisation (only case that can auto-approve)
 *  0.95 → every token of the shorter name appears in the longer one
 *         (initials / father's-name ordering differences)
 *  else → Levenshtein similarity
 *
 * The old rule returned 1.0 whenever one name was a *prefix* of the other,
 * so "RAM" auto-approved against "RAMESH KUMAR"'s land record.
 */
export function computeNameMatchConfidence(a: string, b: string): number {
  if (!a || !b) return 0;

  const normA = normalise(a);
  const normB = normalise(b);
  if (!normA || !normB) return 0;

  if (normA === normB) return 1.0;

  const ta = tokens(a);
  const tb = tokens(b);
  const [short, long] = ta.length <= tb.length ? [ta, tb] : [tb, ta];
  const meaningful = short.filter((t) => t.length >= 2);
  if (meaningful.length >= 2 && meaningful.every((t) => long.includes(t))) return 0.95;

  const maxLen = Math.max(normA.length, normB.length);
  const confidence = 1 - levenshtein(normA, normB) / maxLen;
  return Number(Math.min(confidence, 0.94).toFixed(4));
}

/** Pick the RTC co-owner whose name best matches the farmer's Aadhaar name. */
export function bestOwnerMatch(owners: string[], aadhaarName?: string | null): string | undefined {
  const list = owners.filter(Boolean);
  if (!list.length) return undefined;
  if (!aadhaarName) return list[0];
  return list
    .map((o) => ({ o, c: computeNameMatchConfidence(aadhaarName, o) }))
    .sort((x, y) => y.c - x.c)[0].o;
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
