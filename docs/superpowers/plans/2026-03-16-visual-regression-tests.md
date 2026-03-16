# Visual Regression Integration Tests Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create AI-driven visual regression tests that detect when UI elements become invisible due to styling changes.

**Architecture:** Extend existing AI flow tests with a new `visual-regression.spec.ts` file using Stagehand. Reusable helper utilities perform semantic visibility checks (contrast ratios, z-index stacking, hidden elements).

**Tech Stack:** Stagehand, Vitest, Playwright Page API, TypeScript

---

## File Structure

```
tests/ai/
├── helpers/
│   ├── contrast-utils.ts    # WCAG color contrast calculations (NEW)
│   └── visual-checks.ts     # DOM visual validation functions (NEW)
└── flows/
    └── visual-regression.spec.ts  # Main test file (NEW)
```

---

## Chunk 1: Contrast Utilities

### Task 1: Create contrast-utils.ts with WCAG calculations

**Files:**

- Create: `tests/ai/helpers/contrast-utils.ts`
- Test: `tests/ai/helpers/contrast-utils.test.ts`

- [ ] **Step 1: Write failing tests for contrast utilities**

Create `tests/ai/helpers/contrast-utils.test.ts`:

```typescript
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
      // Serbian blue #0D4077
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

    test('should return ~4.5 for acceptable contrast', () => {
      // White text on Serbian blue background
      const ratio = getContrastRatio('#ffffff', '#0D4077');
      expect(ratio).toBeGreaterThan(4.5);
    });

    test('should return < 4.5 for poor contrast', () => {
      // Light gray on white
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test:ai -- contrast-utils.test`
Expected: FAIL - module not found

- [ ] **Step 3: Implement contrast-utils.ts**

Create `tests/ai/helpers/contrast-utils.ts`:

```typescript
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test:ai -- contrast-utils.test`
Expected: PASS - all 14 tests pass

- [ ] **Step 5: Commit**

```bash
git add tests/ai/helpers/contrast-utils.ts tests/ai/helpers/contrast-utils.test.ts
git commit -m "feat(tests): add WCAG contrast calculation utilities"
```

---

## Chunk 2: Visual Checks Helper

### Task 2: Create visual-checks.ts with DOM inspection functions

**Files:**

- Create: `tests/ai/helpers/visual-checks.ts`
- Uses: `tests/ai/helpers/contrast-utils.ts`

- [ ] **Step 1: Write the visual-checks.ts interface and types**

Create `tests/ai/helpers/visual-checks.ts` with type definitions:

```typescript
import type { Page } from 'playwright';
import type { Stagehand } from '@browserbasehq/stagehand';
import { getContrastRatio, meetsWCAGAA } from './contrast-utils';
import { getActivePage } from '../fixtures/test-helpers';

// Result type interfaces
export interface TextVisibilityResult {
  visibleTextElements: number;
  lowContrastElements: Array<{
    selector: string;
    text: string;
    textColor: string;
    bgColor: string;
    contrastRatio: number;
  }>;
  hiddenByOverflow: number;
}

export interface InteractiveElementsResult {
  totalButtons: number;
  visibleButtons: number;
  totalLinks: number;
  visibleLinks: number;
  totalInputs: number;
  visibleInputs: number;
  obscuredElements: Array<{
    selector: string;
    tagName: string;
    reason: string;
  }>;
}

export interface LayoutIntegrityResult {
  hasHorizontalScroll: boolean;
  viewportWidth: number;
  contentWidth: number;
  documentHeight: number;
  overflowElements: Array<{
    selector: string;
    overflowX: number;
    overflowY: number;
  }>;
}

export interface HiddenElementsResult {
  displayNone: number;
  visibilityHidden: number;
  opacityZero: number;
  offscreenElements: number;
  potentialZIndexIssues: Array<{
    selector: string;
    zIndex: number;
  }>;
}

export interface VisualCheckResult
  extends
    TextVisibilityResult,
    InteractiveElementsResult,
    LayoutIntegrityResult,
    HiddenElementsResult {}

// Helper to generate a simple selector for an element
function getSelector(element: Element): string {
  if (element.id) return `#${element.id}`;
  if (element.className && typeof element.className === 'string') {
    const classes = element.className
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .join('.');
    if (classes) return `${element.tagName.toLowerCase()}.${classes}`;
  }
  return element.tagName.toLowerCase();
}
```

- [ ] **Step 2: Implement checkTextVisibility function**

Add to `tests/ai/helpers/visual-checks.ts`:

```typescript
/**
 * Check text visibility and contrast on the page
 * Detects low-contrast text that may be hard to read
 */
export async function checkTextVisibility(
  page: Page
): Promise<TextVisibilityResult> {
  const result = await page.evaluate(() => {
    // Clear previous check data to prevent stale data
    (window as any).__visualCheckData = [];

    // Get all text-containing elements
    const textElements = document.querySelectorAll(
      'p, h1, h2, h3, h4, h5, h6, span, a, button, label, li, td, th, div'
    );

    let visibleCount = 0;
    let hiddenByOverflow = 0;

    textElements.forEach((el) => {
      // Skip empty elements
      const text = el.textContent?.trim();
      if (!text || text.length < 3) return;

      // Check if element is visible
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();

      if (
        style.display === 'none' ||
        style.visibility === 'hidden' ||
        style.opacity === '0'
      ) {
        return; // Skip hidden elements
      }

      if (rect.width === 0 || rect.height === 0) {
        hiddenByOverflow++;
        return;
      }

      visibleCount++;

      // Get text color
      const textColor = style.color;
      let bgColor = style.backgroundColor;

      // If background is transparent, traverse up to find actual background
      if (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
        let parent = el.parentElement;
        while (parent) {
          const parentStyle = window.getComputedStyle(parent);
          bgColor = parentStyle.backgroundColor;
          if (bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
            break;
          }
          parent = parent.parentElement;
        }
      }

      // Calculate contrast ratio (will be done in Node context)
      const selector = el.id
        ? `#${el.id}`
        : el.className && typeof el.className === 'string'
          ? `${el.tagName.toLowerCase()}.${el.className.split(' ')[0]}`
          : el.tagName.toLowerCase();

      // Store for contrast calculation
      (window as any).__visualCheckData =
        (window as any).__visualCheckData || [];
      (window as any).__visualCheckData.push({
        selector,
        text: text.substring(0, 50),
        textColor,
        bgColor,
        fontSize: parseFloat(style.fontSize),
        fontWeight: style.fontWeight,
      });
    });

    return {
      visibleTextElements: visibleCount,
      hiddenByOverflow,
      elementsData: (window as any).__visualCheckData || [],
    };
  });

  // Calculate contrast ratios in Node context
  const lowContrastElements = result.elementsData
    .map((el: any) => {
      const ratio = getContrastRatio(el.textColor, el.bgColor);
      const isLargeText =
        el.fontSize >= 18 || (el.fontSize >= 14 && el.fontWeight >= 700);

      return {
        selector: el.selector,
        text: el.text,
        textColor: el.textColor,
        bgColor: el.bgColor,
        contrastRatio: Math.round(ratio * 10) / 10,
        passesWCAGAA: meetsWCAGAA(ratio, isLargeText),
      };
    })
    .filter((el: any) => !el.passesWCAGAA);

  return {
    visibleTextElements: result.visibleTextElements,
    lowContrastElements,
    hiddenByOverflow: result.hiddenByOverflow,
  };
}
```

- [ ] **Step 3: Implement checkInteractiveElements function**

Add to `tests/ai/helpers/visual-checks.ts`:

```typescript
/**
 * Check that interactive elements are visible and not obscured
 */
export async function checkInteractiveElements(
  page: Page
): Promise<InteractiveElementsResult> {
  return page.evaluate(() => {
    const buttons = document.querySelectorAll('button');
    const links = document.querySelectorAll('a[href]');
    const inputs = document.querySelectorAll('input, select, textarea');

    const obscuredElements: Array<{
      selector: string;
      tagName: string;
      reason: string;
    }> = [];

    const checkVisibility = (el: Element, type: string): boolean => {
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();

      const selector = el.id
        ? `#${el.id}`
        : el.className && typeof el.className === 'string'
          ? `${el.tagName.toLowerCase()}.${el.className.split(' ')[0]}`
          : el.tagName.toLowerCase();

      // Check if hidden by CSS
      if (style.display === 'none') {
        obscuredElements.push({
          selector,
          tagName: type,
          reason: 'display: none',
        });
        return false;
      }
      if (style.visibility === 'hidden') {
        obscuredElements.push({
          selector,
          tagName: type,
          reason: 'visibility: hidden',
        });
        return false;
      }
      if (parseFloat(style.opacity) === 0) {
        obscuredElements.push({
          selector,
          tagName: type,
          reason: 'opacity: 0',
        });
        return false;
      }

      // Check if element has zero size
      if (rect.width === 0 || rect.height === 0) {
        obscuredElements.push({ selector, tagName: type, reason: 'zero size' });
        return false;
      }

      // Check if element is off-screen
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        // Not necessarily obscured, just not in viewport
        return true;
      }

      return true;
    };

    let visibleButtons = 0;
    let visibleLinks = 0;
    let visibleInputs = 0;

    buttons.forEach((btn) => {
      if (checkVisibility(btn, 'button')) visibleButtons++;
    });

    links.forEach((link) => {
      if (checkVisibility(link, 'link')) visibleLinks++;
    });

    inputs.forEach((input) => {
      if (checkVisibility(input, 'input')) visibleInputs++;
    });

    return {
      totalButtons: buttons.length,
      visibleButtons,
      totalLinks: links.length,
      visibleLinks,
      totalInputs: inputs.length,
      visibleInputs,
      obscuredElements,
    };
  });
}
```

- [ ] **Step 4: Implement checkLayoutIntegrity function**

Add to `tests/ai/helpers/visual-checks.ts`:

```typescript
/**
 * Check layout integrity - no horizontal scroll, overflow issues
 */
export async function checkLayoutIntegrity(
  page: Page
): Promise<LayoutIntegrityResult> {
  return page.evaluate(() => {
    const viewportWidth = window.innerWidth;
    const contentWidth = document.documentElement.scrollWidth;
    const documentHeight = document.documentElement.scrollHeight;

    const overflowElements: Array<{
      selector: string;
      overflowX: number;
      overflowY: number;
    }> = [];

    // Check for elements causing overflow
    document.querySelectorAll('*').forEach((el) => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);

      // Skip elements with overflow: hidden or auto (they handle their own overflow)
      if (style.overflowX === 'hidden' || style.overflowX === 'auto') return;

      if (rect.width > viewportWidth + 10) {
        // 10px tolerance
        const selector = el.id
          ? `#${el.id}`
          : el.className && typeof el.className === 'string'
            ? `${el.tagName.toLowerCase()}.${el.className.split(' ')[0]}`
            : el.tagName.toLowerCase();

        overflowElements.push({
          selector,
          overflowX: Math.round(rect.width - viewportWidth),
          overflowY: 0,
        });
      }
    });

    return {
      hasHorizontalScroll: contentWidth > viewportWidth + 10,
      viewportWidth,
      contentWidth,
      documentHeight,
      overflowElements: overflowElements.slice(0, 10), // Limit to top 10
    };
  });
}
```

- [ ] **Step 5: Implement checkHiddenElements function**

Add to `tests/ai/helpers/visual-checks.ts`:

```typescript
/**
 * Check for hidden/z-index issues
 */
export async function checkHiddenElements(
  page: Page
): Promise<HiddenElementsResult> {
  return page.evaluate(() => {
    let displayNone = 0;
    let visibilityHidden = 0;
    let opacityZero = 0;
    let offscreenElements = 0;
    const potentialZIndexIssues: Array<{ selector: string; zIndex: number }> =
      [];

    document.querySelectorAll('*').forEach((el) => {
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      const selector = el.id
        ? `#${el.id}`
        : el.className && typeof el.className === 'string'
          ? `${el.tagName.toLowerCase()}.${el.className.split(' ')[0]}`
          : el.tagName.toLowerCase();

      if (style.display === 'none') displayNone++;
      if (style.visibility === 'hidden') visibilityHidden++;
      if (parseFloat(style.opacity) === 0) opacityZero++;

      // Check for offscreen positioning
      if (style.position === 'absolute' || style.position === 'fixed') {
        if (
          rect.right < -100 ||
          rect.left > window.innerWidth + 100 ||
          rect.bottom < -100 ||
          rect.top > window.innerHeight + 100
        ) {
          offscreenElements++;
        }
      }

      // Check for high z-index elements that might cover content
      const zIndex = parseInt(style.zIndex, 10);
      if (zIndex > 1000 && rect.width > 0 && rect.height > 0) {
        potentialZIndexIssues.push({ selector, zIndex });
      }
    });

    return {
      displayNone,
      visibilityHidden,
      opacityZero,
      offscreenElements,
      potentialZIndexIssues: potentialZIndexIssues.slice(0, 10), // Limit to top 10
    };
  });
}
```

- [ ] **Step 6: Implement runFullVisualCheck function**

Add to `tests/ai/helpers/visual-checks.ts`:

```typescript
/**
 * Run all visual checks and return combined result
 */
export async function runFullVisualCheck(
  stagehand: Stagehand
): Promise<VisualCheckResult> {
  const page = await getActivePage(stagehand);

  const [textVisibility, interactiveElements, layoutIntegrity, hiddenElements] =
    await Promise.all([
      checkTextVisibility(page),
      checkInteractiveElements(page),
      checkLayoutIntegrity(page),
      checkHiddenElements(page),
    ]);

  return {
    ...textVisibility,
    ...interactiveElements,
    ...layoutIntegrity,
    ...hiddenElements,
  };
}
```

- [ ] **Step 7: Commit**

```bash
git add tests/ai/helpers/visual-checks.ts
git commit -m "feat(tests): add visual check helper utilities for DOM inspection"
```

---

## Chunk 3: Visual Regression Tests

### Task 3: Create visual-regression.spec.ts with all page tests

**Files:**

- Create: `tests/ai/flows/visual-regression.spec.ts`
- Uses: `tests/ai/helpers/visual-checks.ts`

- [ ] **Step 1: Create the test file with imports and setup**

Create `tests/ai/flows/visual-regression.spec.ts`:

```typescript
import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import {
  createStagehand,
  navigateTo,
  cleanup,
  getActivePage,
} from '../fixtures/test-helpers';
import { TEST_CONFIG } from '../stagehand.config';
import { runFullVisualCheck } from '../helpers/visual-checks';

/**
 * Visual Regression Tests
 * Detects when UI elements become invisible due to styling changes
 * Tests all public pages in sr-Cyrl locale (most complex Cyrillic rendering)
 *
 * Prerequisites: Dev server must be running at localhost:3000
 */
describe('Visual Regression (AI-Driven)', () => {
  let stagehand: Awaited<ReturnType<typeof createStagehand>>;

  beforeEach(async () => {
    stagehand = await createStagehand();
  });

  afterEach(async () => {
    await cleanup(stagehand);
  });

  const locale = 'sr-Cyrl';
```

- [ ] **Step 2: Add critical page tests**

Add to `tests/ai/flows/visual-regression.spec.ts`:

```typescript
// ========================================
// CRITICAL PAGES
// ========================================

test('homepage - all content visible', async () => {
  await navigateTo(stagehand, '/', locale);
  const page = await getActivePage(stagehand);
  await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

  const results = await runFullVisualCheck(stagehand);

  console.log('Homepage visual check:', {
    visibleText: results.visibleTextElements,
    lowContrast: results.lowContrastElements.length,
    visibleButtons: results.visibleButtons,
    hasHorizontalScroll: results.hasHorizontalScroll,
  });

  // No low-contrast text elements
  expect(results.lowContrastElements).toHaveLength(0);

  // No obscured interactive elements
  expect(results.obscuredElements).toHaveLength(0);

  // No horizontal scroll
  expect(results.hasHorizontalScroll).toBe(false);

  // Should have visible content
  expect(results.visibleTextElements).toBeGreaterThan(10);
});

test('browse page - all content visible', async () => {
  await navigateTo(stagehand, '/browse', locale);
  const page = await getActivePage(stagehand);
  await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer * 2); // Extra time for data loading

  const results = await runFullVisualCheck(stagehand);

  console.log('Browse visual check:', {
    visibleText: results.visibleTextElements,
    lowContrast: results.lowContrastElements.length,
    visibleButtons: results.visibleButtons,
    visibleLinks: results.visibleLinks,
  });

  expect(results.lowContrastElements).toHaveLength(0);
  expect(results.visibleButtons).toBeGreaterThan(0);
  expect(results.visibleLinks).toBeGreaterThan(0);
});

test('create page - all content visible', async () => {
  await navigateTo(stagehand, '/create', locale);
  const page = await getActivePage(stagehand);
  await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

  const results = await runFullVisualCheck(stagehand);

  console.log('Create visual check:', {
    visibleText: results.visibleTextElements,
    lowContrast: results.lowContrastElements.length,
    visibleInputs: results.visibleInputs,
    visibleButtons: results.visibleButtons,
  });

  expect(results.lowContrastElements).toHaveLength(0);
  expect(results.visibleInputs).toBeGreaterThan(0);
});
```

- [ ] **Step 3: Add high priority page tests**

Add to `tests/ai/flows/visual-regression.spec.ts`:

```typescript
// ========================================
// HIGH PRIORITY PAGES
// ========================================

test('gallery page - all content visible', async () => {
  await navigateTo(stagehand, '/gallery', locale);
  const page = await getActivePage(stagehand);
  await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

  const results = await runFullVisualCheck(stagehand);

  console.log('Gallery visual check:', {
    visibleText: results.visibleTextElements,
    lowContrast: results.lowContrastElements.length,
  });

  expect(results.lowContrastElements).toHaveLength(0);
});

test('charts page - all content visible', async () => {
  await navigateTo(stagehand, '/charts', locale);
  const page = await getActivePage(stagehand);
  await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

  const results = await runFullVisualCheck(stagehand);

  console.log('Charts visual check:', {
    visibleText: results.visibleTextElements,
    lowContrast: results.lowContrastElements.length,
  });

  expect(results.lowContrastElements).toHaveLength(0);
});
```

- [ ] **Step 4: Add medium priority page tests**

Add to `tests/ai/flows/visual-regression.spec.ts`:

```typescript
  // ========================================
  // MEDIUM PRIORITY PAGES
  // ========================================

  test('demo page - all content visible', async () => {
    await navigateTo(stagehand, '/demo', locale);
    const page = await getActivePage(stagehand);
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    const results = await runFullVisualCheck(stagehand);

    console.log('Demo visual check:', {
      visibleText: results.visibleTextElements,
      lowContrast: results.lowContrastElements.length,
    });

    expect(results.lowContrastElements).toHaveLength(0);
  });

  test('demo-gallery - all content visible', async () => {
    await navigateTo(stagehand, '/demo-gallery', locale);
    const page = await getActivePage(stagehand);
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    const results = await runFullVisualCheck(stagehand);

    console.log('Demo-gallery visual check:', {
      visibleText: results.visibleTextElements,
      lowContrast: results.lowContrastElements.length,
    });

    expect(results.lowContrastElements).toHaveLength(0);
  });

  test('statistics - all content visible', async () => {
    await navigateTo(stagehand, '/statistics', locale);
    const page = await getActivePage(stagehand);
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    const results = await runFullVisualCheck(stagehand);

    console.log('Statistics visual check:', {
      visibleText: results.visibleTextElements,
      lowContrast: results.lowContrastElements.length,
    });

    expect(results.lowContrastElements).toHaveLength(0);
  });

  test('accessibility - all content visible', async () => {
    await navigateTo(stagehand, '/accessibility', locale);
    const page = await getActivePage(stagehand);
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    const results = await runFullVisualCheck(stagehand);

    console.log('Accessibility visual check:', {
      visibleText: results.visibleTextElements,
      lowContrast: results.lowContrastElements.length,
    });

    expect(results.lowContrastElements).toHaveLength(0);
  });
});
```

- [ ] **Step 5: Run tests to verify they work**

Run: `npm run test:ai -- visual-regression --run`
Expected: Tests run against all 9 pages (some may fail if dev server not running)

- [ ] **Step 6: Commit**

```bash
git add tests/ai/flows/visual-regression.spec.ts
git commit -m "feat(tests): add visual regression tests for all public pages"
```

---

## Chunk 4: Final Verification

### Task 4: Verify all tests pass

- [ ] **Step 1: Ensure dev server is running**

Run: `npm run dev` (in background)

- [ ] **Step 2: Run all visual regression tests**

Run: `npm run test:ai -- visual-regression --run`
Expected: All 9 tests pass

- [ ] **Step 3: Verify test output shows visual check results**

Check console output for:

- `visibleTextElements` counts
- `lowContrastElements: []` (empty arrays)
- `hasHorizontalScroll: false`

- [ ] **Step 4: Final commit if needed**

```bash
git status
# If any changes, commit them
```

---

## Summary

| Task | Files Created                                 | Description                |
| ---- | --------------------------------------------- | -------------------------- |
| 1    | `contrast-utils.ts`, `contrast-utils.test.ts` | WCAG contrast calculations |
| 2    | `visual-checks.ts`                            | DOM inspection helpers     |
| 3    | `visual-regression.spec.ts`                   | 9 page tests               |
| 4    | -                                             | Verification               |

**Total: 4 files created (2 source + 1 test + 1 spec)**
