# Visual Regression Integration Tests Design

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create AI-driven visual regression tests that detect when UI elements become invisible due to styling changes (like white text on white backgrounds).

**Architecture:** Extend existing AI flow tests with a new `visual-regression.spec.ts` file using Stagehand. Reusable helper utilities perform semantic visibility checks (contrast ratios, z-index stacking, hidden elements) rather than pixel comparison.

**Tech Stack:** Stagehand, Vitest, existing test infrastructure in `tests/ai/`

---

## Scope

### Pages to Test (9 public pages)

| Page          | Route            | Priority |
| ------------- | ---------------- | -------- |
| Home          | `/`              | Critical |
| Browse        | `/browse`        | Critical |
| Create        | `/create`        | Critical |
| Gallery       | `/gallery`       | High     |
| Charts        | `/charts`        | High     |
| Demo          | `/demo`          | Medium   |
| Demo Gallery  | `/demo-gallery`  | Medium   |
| Statistics    | `/statistics`    | Medium   |
| Accessibility | `/accessibility` | Medium   |

### Excluded Pages

- `/login` - Authentication page
- `/profile` - Requires authentication
- `/dashboard` - Requires authentication
- `/v/[id]` - Dynamic visualization pages (covered by other tests)

### Locale

- Test with **sr-Cyrl only** (most complex Cyrillic rendering, catches font/encoding issues)

---

## Visual Properties to Validate

### 1. Text Visibility

- Contrast ratio between text and background (WCAG 2.1 AA: 4.5:1 normal, 3:1 large)
- Detect white-on-white, dark-on-dark issues
- Check for text hidden by overflow/clipping

### 2. Interactive Elements

- Buttons are visible and not obscured
- Links are visible and clickable
- Form inputs are visible
- No elements covered by z-index stacking issues

### 3. Layout Integrity

- No horizontal scroll on standard viewport
- No elements overflowing viewport
- Proper spacing between elements

### 4. Hidden/Truncated Content

- Elements with `display: none` that shouldn't be hidden
- Elements with `visibility: hidden`
- Elements with `opacity: 0`
- Elements positioned off-screen
- Z-index stacking issues where elements are covered

---

## File Structure

```
tests/ai/
├── flows/
│   └── visual-regression.spec.ts    # Main test file (NEW)
└── helpers/
    ├── visual-checks.ts             # Reusable visual validation utilities (NEW)
    └── contrast-utils.ts            # Contrast ratio calculations (NEW)
```

---

## Helper Utilities

### `tests/ai/helpers/contrast-utils.ts`

WCAG 2.1 color contrast calculations.

```typescript
/**
 * Parse CSS color string to RGB values
 */
export function parseColor(
  colorString: string
): { r: number; g: number; b: number } | null;

/**
 * Calculate relative luminance (WCAG formula)
 */
export function getRelativeLuminance(r: number, g: number, b: number): number;

/**
 * Calculate contrast ratio between two colors
 * Returns ratio like 4.5, 7.0, etc.
 */
export function getContrastRatio(fgColor: string, bgColor: string): number;

/**
 * Check if contrast ratio meets WCAG 2.1 AA
 * - Normal text: 4.5:1
 * - Large text (18pt+ or 14pt bold): 3:1
 */
export function meetsWCAGAA(ratio: number, isLargeText: boolean): boolean;
```

### `tests/ai/helpers/visual-checks.ts`

Core visual validation functions using Playwright's page.evaluate().

```typescript
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

/**
 * Check text visibility and contrast on the page
 */
export async function checkTextVisibility(
  page: Page
): Promise<TextVisibilityResult>;

/**
 * Check that interactive elements are visible and not obscured
 */
export async function checkInteractiveElements(
  page: Page
): Promise<InteractiveElementsResult>;

/**
 * Check layout integrity - no horizontal scroll, overflow issues
 */
export async function checkLayoutIntegrity(
  page: Page
): Promise<LayoutIntegrityResult>;

/**
 * Check for hidden/z-index issues
 */
export async function checkHiddenElements(
  page: Page
): Promise<HiddenElementsResult>;

/**
 * Run all visual checks and return combined result
 */
export async function runFullVisualCheck(
  stagehand: Stagehand
): Promise<VisualCheckResult>;
```

---

## Test Implementation

### `tests/ai/flows/visual-regression.spec.ts`

```typescript
import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { Stagehand } from '@browserbasehq/stagehand';
import {
  createStagehand,
  navigateTo,
  cleanup,
  getActivePage,
} from '../fixtures/test-helpers';
import { TEST_CONFIG } from '../stagehand.config';
import { runFullVisualCheck } from '../helpers/visual-checks';

describe('Visual Regression (AI-Driven)', () => {
  let stagehand: Stagehand;

  beforeEach(async () => {
    stagehand = await createStagehand();
  });

  afterEach(async () => {
    await cleanup(stagehand);
  });

  const locale = 'sr-Cyrl';

  // Critical pages
  test('homepage - all content visible', async () => {
    await navigateTo(stagehand, '/', locale);
    const page = await getActivePage(stagehand);
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    const results = await runFullVisualCheck(stagehand);

    console.log('Homepage visual check:', results);
    expect(results.lowContrastElements).toHaveLength(0);
    expect(results.obscuredElements).toHaveLength(0);
    expect(results.hasHorizontalScroll).toBe(false);
  });

  test('browse page - all content visible', async () => {
    await navigateTo(stagehand, '/browse', locale);
    const page = await getActivePage(stagehand);
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    const results = await runFullVisualCheck(stagehand);

    console.log('Browse visual check:', results);
    expect(results.lowContrastElements).toHaveLength(0);
    expect(results.visibleButtons).toBeGreaterThan(0);
  });

  test('create page - all content visible', async () => {
    await navigateTo(stagehand, '/create', locale);
    const page = await getActivePage(stagehand);
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    const results = await runFullVisualCheck(stagehand);

    console.log('Create visual check:', results);
    expect(results.visibleInputs).toBeGreaterThan(0);
  });

  // High priority pages
  test('gallery page - all content visible', async () => {
    await navigateTo(stagehand, '/gallery', locale);
    const page = await getActivePage(stagehand);
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    const results = await runFullVisualCheck(stagehand);
    console.log('Gallery visual check:', results);
    expect(results.lowContrastElements).toHaveLength(0);
  });

  test('charts page - all content visible', async () => {
    await navigateTo(stagehand, '/charts', locale);
    const page = await getActivePage(stagehand);
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    const results = await runFullVisualCheck(stagehand);
    console.log('Charts visual check:', results);
    expect(results.lowContrastElements).toHaveLength(0);
  });

  // Medium priority pages
  test('demo page - all content visible', async () => {
    await navigateTo(stagehand, '/demo', locale);
    const page = await getActivePage(stagehand);
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    const results = await runFullVisualCheck(stagehand);
    console.log('Demo visual check:', results);
    expect(results.lowContrastElements).toHaveLength(0);
  });

  test('demo-gallery - all content visible', async () => {
    await navigateTo(stagehand, '/demo-gallery', locale);
    const page = await getActivePage(stagehand);
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    const results = await runFullVisualCheck(stagehand);
    console.log('Demo-gallery visual check:', results);
    expect(results.lowContrastElements).toHaveLength(0);
  });

  test('statistics - all content visible', async () => {
    await navigateTo(stagehand, '/statistics', locale);
    const page = await getActivePage(stagehand);
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    const results = await runFullVisualCheck(stagehand);
    console.log('Statistics visual check:', results);
    expect(results.lowContrastElements).toHaveLength(0);
  });

  test('accessibility - all content visible', async () => {
    await navigateTo(stagehand, '/accessibility', locale);
    const page = await getActivePage(stagehand);
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    const results = await runFullVisualCheck(stagehand);
    console.log('Accessibility visual check:', results);
    expect(results.lowContrastElements).toHaveLength(0);
  });
});
```

---

## Running the Tests

```bash
# Run all visual regression tests
npm run test:ai -- visual-regression

# Run specific test
npm run test:ai -- visual-regression --grep "homepage"

# Run with verbose output
npm run test:ai -- visual-regression --reporter=verbose
```

---

## Success Criteria

1. All 9 public pages have passing visual regression tests
2. Tests detect low-contrast text (WCAG 2.1 AA violations)
3. Tests detect obscured interactive elements
4. Tests detect horizontal scroll/overflow issues
5. Tests run in under 2 minutes total
6. False positive rate under 5%
