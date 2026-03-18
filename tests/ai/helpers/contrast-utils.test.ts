import { describe, test, expect } from 'vitest';
import {
  parseColor,
  getRelativeLuminance,
  getContrastRatio,
  meetsWCAGAA,
} from './contrast-utils';

describe('contrast-utils', () => {
  describe('parseColor', () => {
    test('should parse hex colors', () => {
      expect(parseColor('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
      expect(parseColor('#000000')).toEqual({ r: 0, g: 0, b: 0 });
      expect(parseColor('#0D4077')).toEqual({ r: 13, g: 64, b: 119 });
    });

    test('should parse rgb() format', () => {
      expect(parseColor('rgb(255, 255, 255)')).toEqual({
        r: 255,
        g: 255,
        b: 255,
      });
      expect(parseColor('rgb(13, 64, 119)')).toEqual({ r: 13, g: 64, b: 119 });
    });

    test('should parse rgba() format (ignoring alpha)', () => {
      expect(parseColor('rgba(255, 255, 255, 0.5)')).toEqual({
        r: 255,
        g: 255,
        b: 255,
      });
    });

    test('should return null for invalid colors', () => {
      expect(parseColor('invalid')).toBeNull();
      expect(parseColor('')).toBeNull();
      expect(parseColor('transparent')).toBeNull();
    });
  });

  describe('getRelativeLuminance', () => {
    test('should return 1 for white', () => {
      expect(getRelativeLuminance(255, 255, 255)).toBeCloseTo(1, 3);
    });

    test('should return 0 for black', () => {
      expect(getRelativeLuminance(0, 0, 0)).toBeCloseTo(0, 3);
    });

    test('should return intermediate values for colors', () => {
      const luminance = getRelativeLuminance(13, 64, 119);
      expect(luminance).toBeGreaterThan(0);
      expect(luminance).toBeLessThan(1);
    });
  });

  describe('getContrastRatio', () => {
    test('should return 21 for white on black', () => {
      const ratio = getContrastRatio('#ffffff', '#000000');
      expect(ratio).toBeCloseTo(21, 0);
    });

    test('should return 1 for same colors', () => {
      const ratio = getContrastRatio('#ffffff', '#ffffff');
      expect(ratio).toBeCloseTo(1, 0);
    });

    test('should return > 4.5 for acceptable contrast', () => {
      const ratio = getContrastRatio('#ffffff', '#0D4077');
      expect(ratio).toBeGreaterThan(4.5);
    });

    test('should return < 4.5 for poor contrast', () => {
      const ratio = getContrastRatio('#cccccc', '#ffffff');
      expect(ratio).toBeLessThan(4.5);
    });
  });

  describe('meetsWCAGAA', () => {
    test('should pass for 4.5:1 ratio on normal text', () => {
      expect(meetsWCAGAA(4.5, false)).toBe(true);
      expect(meetsWCAGAA(7, false)).toBe(true);
    });

    test('should fail for < 4.5:1 ratio on normal text', () => {
      expect(meetsWCAGAA(4.4, false)).toBe(false);
      expect(meetsWCAGAA(3, false)).toBe(false);
    });

    test('should pass for 3:1 ratio on large text', () => {
      expect(meetsWCAGAA(3, true)).toBe(true);
      expect(meetsWCAGAA(4.5, true)).toBe(true);
    });

    test('should fail for < 3:1 ratio on large text', () => {
      expect(meetsWCAGAA(2.9, true)).toBe(false);
    });
  });
});
