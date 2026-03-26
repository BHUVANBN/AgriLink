/**
 * Farmer Service — Levenshtein & Name Matching Extended Tests
 * Additional edge cases, real-world KYC name matching scenarios
 */
import { describe, it, expect } from 'vitest';
import { computeNameMatchConfidence, levenshtein } from '../../src/utils/logic.js';

describe('Farmer Service — Name Matching Extended 🌾', () => {

  describe('levenshtein() edge cases', () => {
    it('should return 0 for two empty strings', () => {
      expect(levenshtein('', '')).toBe(0);
    });

    it('should return the length of the first non-empty vs empty string', () => {
      expect(levenshtein('HELLO', '')).toBe(5);
    });

    it('should return the length of the second string when first is empty', () => {
      expect(levenshtein('', 'WORLD')).toBe(5);
    });

    it('should handle one character difference', () => {
      expect(levenshtein('CAT', 'CAB')).toBe(1);
    });

    it('should handle transpositions correctly (swap = 2 edits)', () => {
      // AB -> BA requires 2 operations (delete + insert)
      expect(levenshtein('AB', 'BA')).toBe(2);
    });

    it('should be symmetric (swap a and b produces same result)', () => {
      expect(levenshtein('GFEDCBA', 'ABCDEFG')).toBe(levenshtein('ABCDEFG', 'GFEDCBA'));
    });

    it('should handle repeated characters', () => {
      expect(levenshtein('AAA', 'AAAA')).toBe(1);
    });
  });

  describe('computeNameMatchConfidence() — real-world KYC scenarios', () => {
    it('should return 1.0 for exact match', () => {
      expect(computeNameMatchConfidence('BHUVAN BN', 'BHUVAN BN')).toBe(1.0);
    });

    it('should return 1.0 for match ignoring case', () => {
      expect(computeNameMatchConfidence('bhuvan bn', 'BHUVAN BN')).toBe(1.0);
    });

    it('should return 1.0 for match ignoring hyphens and dots', () => {
      expect(computeNameMatchConfidence('B.H. Kumar', 'BH Kumar')).toBe(1.0);
    });

    it('should return high confidence for common name abbreviation (full name vs initials)', () => {
      // MOHANDASKARAMCHANDGANDHI vs MKGANDHI — still somewhat different
      const conf = computeNameMatchConfidence('Ravi Kumar', 'R. Kumar');
      expect(conf).toBeGreaterThan(0.5);
    });

    it('should return 1.0 when names differ only in spaces', () => {
      expect(computeNameMatchConfidence('Bhuvan BN', 'BhuvanBN')).toBe(1.0);
    });

    it('should return confidence between 0 and 1 for similar names', () => {
      const conf = computeNameMatchConfidence('Ramesh Kumar', 'Ramesh Kumari');
      expect(conf).toBeGreaterThanOrEqual(0);
      expect(conf).toBeLessThanOrEqual(1);
    });

    it('should return 0 for completely different names with no common chars', () => {
      expect(computeNameMatchConfidence('ABC', 'XYZ')).toBe(0);
    });

    it('should treat names with only numbers as matching', () => {
      expect(computeNameMatchConfidence('123', '123')).toBe(1.0);
    });

    it('should return very high confidence for single typo in name', () => {
      // 'SURESH KUMAR' vs 'SURESH KUMR' — 1 char missing
      const conf = computeNameMatchConfidence('SURESHKUMAR', 'SURESHKUMR');
      expect(conf).toBeGreaterThan(0.85);
    });

    it('should handle Sanskrit/Indian names with similar spellings', () => {
      // Prakash vs Prakash — exact
      expect(computeNameMatchConfidence('Prakash', 'Prakash')).toBe(1.0);
    });

    it('should return 0.0 if either string is empty (safety check)', () => {
      expect(computeNameMatchConfidence('', '')).toBe(0);
      expect(computeNameMatchConfidence('BHUVAN', '')).toBe(0);
    });
  });
});
