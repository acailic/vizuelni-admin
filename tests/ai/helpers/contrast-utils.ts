/**
 * WCAG 2.1 Color Contrast Utilities
 * Used for visual regression testing to detect low-contrast text
 */

/**
 * Parse CSS color string to RGB values
 * Supports: #hex, rgb(), rgba()
 */
export function parseColor(
  colorString: string
): { r: number; g: number; b: number } | null {
  if (!colorString || colorString === 'transparent') {
    return null;
  }

  const trimmed = colorString.trim().toLowerCase();

  // Hex format: #RGB or #RRGGBB
  if (trimmed.startsWith('#')) {
    const hex = trimmed.slice(1);
    if (hex.length === 3) {
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16),
      };
    }
    if (hex.length === 6) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
      };
    }
  }

  // rgb() or rgba() format
  const rgbMatch = trimmed.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1], 10),
      g: parseInt(rgbMatch[2], 10),
      b: parseInt(rgbMatch[3], 10),
    };
  }

  return null;
}

/**
 * Calculate relative luminance (WCAG 2.1 formula)
 * Returns value between 0 (black) and 1 (white)
 */
export function getRelativeLuminance(r: number, g: number, b: number): number {
  const sRGB = [r, g, b].map((c) => {
    const val = c / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}

/**
 * Calculate contrast ratio between two colors
 * Returns ratio like 4.5, 7.0, 21.0, etc.
 * Formula: (L1 + 0.05) / (L2 + 0.05) where L1 >= L2
 */
export function getContrastRatio(fgColor: string, bgColor: string): number {
  const fg = parseColor(fgColor);
  const bg = parseColor(bgColor);

  if (!fg || !bg) {
    return 1; // Default to no contrast if colors can't be parsed
  }

  const fgLuminance = getRelativeLuminance(fg.r, fg.g, fg.b);
  const bgLuminance = getRelativeLuminance(bg.r, bg.g, bg.b);

  const lighter = Math.max(fgLuminance, bgLuminance);
  const darker = Math.min(fgLuminance, bgLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG 2.1 AA standard
 * - Normal text: 4.5:1 minimum
 * - Large text (18pt+ or 14pt bold): 3:1 minimum
 */
export function meetsWCAGAA(ratio: number, isLargeText: boolean): boolean {
  const threshold = isLargeText ? 3 : 4.5;
  return ratio >= threshold;
}
