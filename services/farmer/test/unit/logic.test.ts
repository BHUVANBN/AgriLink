import { describe, it, expect } from 'vitest';
import { bestOwnerMatch, computeNameMatchConfidence, levenshtein } from '../../src/utils/logic.js';

describe('Farmer Service - Internal Logic 🌾', () => {
  describe('Levenshtein Distance', () => {
    it('should return 0 for identical strings', () => {
      expect(levenshtein('hello', 'hello')).toBe(0);
    });

    it('should return the correct distance for small edits', () => {
      expect(levenshtein('kitten', 'sitting')).toBe(3);
      expect(levenshtein('flaw', 'lawn')).toBe(2);
    });

    it('should return string length for empty comparisons', () => {
      expect(levenshtein('abc', '')).toBe(3);
      expect(levenshtein('', 'xyz')).toBe(3);
    });
  });

  describe('Name Match Confidence', () => {
    it('should return 1.0 for matching names (case insensitive)', () => {
      expect(computeNameMatchConfidence('Bhuvan B N', 'BHUVAN BN')).toBe(1.0);
    });

    it('should ignore special characters', () => {
      expect(computeNameMatchConfidence('Bhuvan-BN', 'BHUVAN B.N.')).toBe(1.0);
    });

    it('should NOT auto-approve prefix matches (security regression)', () => {
      // Previously 1.0 → a farmer named "Ram" auto-approved against "Ramesh Kumar"'s RTC
      expect(computeNameMatchConfidence('Bhuvan', 'Bhuva')).toBeLessThan(1.0);
      expect(computeNameMatchConfidence('Ram', 'Ramesh Kumar')).toBeLessThan(0.85);
    });

    it('should score reordered full names as a strong (non-auto) match', () => {
      const conf = computeNameMatchConfidence('Kumar Ramesh', 'Ramesh Kumar');
      expect(conf).toBe(0.95);
    });

    it('should return high confidence for genuine fuzzy mismatches', () => {
      const conf = computeNameMatchConfidence('Bhuvan', 'Bhuven');
      expect(conf).toBeCloseTo(0.833, 2); // 1 - 1/6
    });

    it('should return 0.0 for completely different names', () => {
      expect(computeNameMatchConfidence('ABC', 'XYZ')).toBe(0);
    });
  });
});

describe('bestOwnerMatch', () => {
  it('picks the co-owner matching the Aadhaar name, not just the first one', () => {
    expect(bestOwnerMatch(['Lakshmi Devi', 'Ramesh Kumar'], 'Ramesh Kumar')).toBe('Ramesh Kumar');
  });
  it('falls back to the first owner without an Aadhaar name', () => {
    expect(bestOwnerMatch(['A B', 'C D'], null)).toBe('A B');
    expect(bestOwnerMatch([], 'x')).toBeUndefined();
  });
});
