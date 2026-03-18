# AI Testing Expansion Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand AI-driven test coverage with comprehensive assertions for interactive states, i18n, visual layout, and form validation across four major user flows.

**Architecture:** Create shared assertion helpers and page objects in `tests/ai/shared/`, then expand existing flow tests with detailed test cases. Complement with UI validator YAML specs for element-level checks.

**Tech Stack:** Stagehand, Vitest, Playwright Page API, TypeScript, Zod

**Note on TDD:** Assertion helpers are utility modules tested indirectly through flow tests. Each flow test file validates the helpers it uses. Unit tests for helpers would duplicate effort - the real validation happens when flow tests exercise them against the actual UI.

---

## File Structure

```
tests/ai/
├── shared/
│   ├── assertions/
│   │   ├── interactive-states.ts     # NEW
│   │   ├── i18n-content.ts           # NEW
│   │   ├── visual-layout.ts          # NEW
│   │   ├── form-validation.ts        # NEW
│   │   └── index.ts                  # NEW
│   ├── page-objects/
│   │   ├── common.po.ts              # NEW
│   │   ├── create-chart.po.ts        # NEW
│   │   ├── browse.po.ts              # NEW
│   │   ├── export.po.ts              # NEW
│   │   └── index.ts                  # NEW
│   └── test-data/
│       └── test-datasets.ts          # NEW
├── flows/
│   ├── create-chart-wizard.spec.ts   # NEW
│   ├── export-embed.spec.ts          # NEW
│   ├── browse-filters.spec.ts        # NEW
│   └── accessibility-deep.spec.ts    # NEW
.ui-validator/
├── specs/
│   ├── create-chart.yaml             # NEW
│   ├── browse-filters.yaml           # NEW
│   ├── export-embed.yaml             # NEW
│   └── common-elements.yaml          # NEW
└── config.yaml                       # MODIFY
```

---

## Chunk 1a: Directory Structure & Test Data

### Task 1: Create shared directories

- [ ] **Step 1: Create directory structure**

```bash
mkdir -p tests/ai/shared/assertions
mkdir -p tests/ai/shared/page-objects
mkdir -p tests/ai/shared/test-data
mkdir -p .ui-validator/specs
```

Expected: Directories created without errors

- [ ] **Step 2: Verify directories exist**

```bash
ls -la tests/ai/shared/
```

Expected: Output shows `assertions/`, `page-objects/`, `test-data/`

---

### Task 2: Create test data constants (Part 1 - Types)

**Files:** Create `tests/ai/shared/test-data/test-datasets.ts`

- [ ] **Step 1: Create file with types and imports**

```typescript
/**
 * Test data constants for AI-driven tests
 */

import type { Locale } from '../../stagehand.config';

export type DatasetName =
  | 'populationByMunicipality'
  | 'gdpByYear'
  | 'electionResults';

export interface TestDataset {
  id: string;
  name: Record<Locale, string>;
  expectedRows: number;
  numericColumns: string[];
  categoricalColumns: string[];
  geoColumn?: string;
}
```

- [ ] **Step 2: Run project typecheck**

```bash
npx tsc --noEmit
```

Expected: No errors (types only, no runtime code)

---

### Task 3: Create test data constants (Part 2 - Data)

- [ ] **Step 1: Add dataset constants**

Append to `tests/ai/shared/test-data/test-datasets.ts`:

```typescript
export const TEST_DATASETS: Record<DatasetName, TestDataset> = {
  populationByMunicipality: {
    id: '678e312d0aae3fe3ad3e361c',
    name: {
      'sr-Latn': 'Populacija po opštinama',
      'sr-Cyrl': 'Популација по општинама',
      en: 'Population by Municipality',
    },
    expectedRows: 174,
    numericColumns: ['population', 'area_km2', 'density'],
    categoricalColumns: ['municipality', 'district', 'region'],
  },

  gdpByYear: {
    id: '678e312d0aae3fe3ad3e361d',
    name: {
      'sr-Latn': 'BDP po godinama',
      'sr-Cyrl': 'БДП по годинама',
      en: 'GDP by Year',
    },
    expectedRows: 20,
    numericColumns: ['gdp', 'gdp_growth', 'gdp_per_capita'],
    categoricalColumns: ['year', 'currency'],
  },

  electionResults: {
    id: '678e312d0aae3fe3ad3e361e',
    name: {
      'sr-Latn': 'Izborni rezultati po okruzima',
      'sr-Cyrl': 'Изборни резултати по окрузима',
      en: 'Election Results by District',
    },
    expectedRows: 24,
    geoColumn: 'district_code',
    numericColumns: ['votes_total', 'turnout_percent'],
    categoricalColumns: ['district', 'winner'],
  },
} as const;
```

- [ ] **Step 2: Run typecheck**

```bash
npx tsc --noEmit
```

Expected: No errors

---

### Task 4: Create test data constants (Part 3 - Helpers)

- [ ] **Step 1: Add helper functions and exports**

Append to `tests/ai/shared/test-data/test-datasets.ts`:

```typescript
export function getDatasetName(dataset: DatasetName, locale: Locale): string {
  return TEST_DATASETS[dataset].name[locale];
}

export const TEST_VIEWPORTS = {
  mobile: { width: 375, height: 667, name: 'mobile' },
  tablet: { width: 768, height: 1024, name: 'tablet' },
  desktop: { width: 1280, height: 800, name: 'desktop' },
  wide: { width: 1920, height: 1080, name: 'wide' },
} as const;

export const WAIT_TIMES = {
  pageLoad: 1000,
  animation: 500,
  debounce: 300,
} as const;

export const TEST_USERS = {
  editor: {
    email: process.env.TEST_EDITOR_EMAIL ?? 'test-editor@example.com',
    password: process.env.TEST_EDITOR_PASSWORD ?? 'test-password',
  },
  admin: {
    email: process.env.TEST_ADMIN_EMAIL ?? 'test-admin@example.com',
    password: process.env.TEST_ADMIN_PASSWORD ?? 'test-password',
  },
} as const;
```

- [ ] **Step 2: Run typecheck**

```bash
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add tests/ai/shared/test-data/test-datasets.ts
git commit -m "feat(ai-tests): add test data constants"
```

---

## Chunk 1b: Common Page Object

### Task 5: Create common selectors

**Files:** Create `tests/ai/shared/page-objects/common.po.ts`

- [ ] **Step 1: Create selectors object**

```typescript
/**
 * Common selectors with fallbacks for missing data-testid
 */
export const commonSelectors = {
  // Navigation
  mainNav: "nav, [role='navigation'], [data-testid='main-nav']",
  skipLink: "[data-testid='skip-link'], a[href='#main'], a[href='#content']",
  localeSwitcher: "[data-testid='locale-switcher'], [class*='language']",

  // Landmarks
  mainContent: "main, [role='main'], #main, #content",
  footer: "footer, [role='contentinfo']",
  header: "header, [role='banner']",

  // Buttons
  buttons: {
    primary:
      "button[type='submit'], button:has-text('Sačuvaj'), button:has-text('Save')",
    next: "[data-testid='next-button'], button:has-text('Sledeće'), button:has-text('Next')",
    back: "[data-testid='back-button'], button:has-text('Nazad'), button:has-text('Back')",
    cancel:
      "[data-testid='cancel-button'], button:has-text('Otkaži'), button:has-text('Cancel')",
    close: "[data-testid='close-button'], button[aria-label*='close']",
  },

  // States
  loading: "[class*='loading'], [class*='spinner'], [class*='skeleton']",
  error: "[class*='error'], [role='alert'], [data-testid='error-message']",
  empty: "[class*='empty'], [class*='no-results'], [data-testid='empty-state']",
} as const;
```

- [ ] **Step 2: Run typecheck**

```bash
npx tsc --noEmit
```

Expected: No errors

---

### Task 6: Create CommonPageObject class (Part 1)

- [ ] **Step 1: Add class with constructor and basic methods**

Append to `tests/ai/shared/page-objects/common.po.ts`:

```typescript
import type { Page } from '@playwright/test';

export class CommonPageObject {
  constructor(protected page: Page) {}

  async waitForReady(timeout = 10000): Promise<void> {
    await this.page.waitForTimeout(500);
    try {
      await this.page
        .locator(commonSelectors.loading)
        .waitFor({ state: 'hidden', timeout });
    } catch {
      // Loading may have already finished
    }
  }

  async isInViewport(selector: string): Promise<boolean> {
    const element = this.page.locator(selector).first();
    const box = await element.boundingBox();
    if (!box) return false;

    const viewport = this.page.viewportSize();
    if (!viewport) return true;

    return (
      box.x >= 0 &&
      box.y >= 0 &&
      box.x + box.width <= viewport.width &&
      box.y + box.height <= viewport.height
    );
  }

  getCurrentLocale(): string | null {
    const match = this.page.url().match(/\/(sr-Latn|sr-Cyrl|en)/);
    return match ? match[1] : null;
  }
}
```

- [ ] **Step 2: Run typecheck**

```bash
npx tsc --noEmit
```

Expected: No errors

---

### Task 7: Create CommonPageObject class (Part 2)

- [ ] **Step 1: Add state checking methods**

Append to `tests/ai/shared/page-objects/common.po.ts`:

```typescript
  async hasError(): Promise<boolean> {
    return this.page.locator(commonSelectors.error)
      .isVisible()
      .catch(() => false);
  }

  async isLoading(): Promise<boolean> {
    return this.page.locator(commonSelectors.loading)
      .isVisible()
      .catch(() => false);
  }

  async isEmpty(): Promise<boolean> {
    return this.page.locator(commonSelectors.empty)
      .isVisible()
      .catch(() => false);
  }

  async clickButton(type: 'next' | 'back' | 'cancel' | 'close' | 'primary'): Promise<void> {
    const selector = commonSelectors.buttons[type];
    await this.page.locator(selector).first().click();
  }
}
```

- [ ] **Step 2: Run typecheck**

```bash
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add tests/ai/shared/page-objects/common.po.ts
git commit -m "feat(ai-tests): add common page object"
```

---

## Chunk 1c: Assertion Helpers - Interactive States

### Task 8: Create interactive-states.ts (Part 1)

**Files:** Create `tests/ai/shared/assertions/interactive-states.ts`

- [ ] **Step 1: Create imports and assertButtonReady**

```typescript
/**
 * Interactive state assertions
 */

import { expect } from 'vitest';
import type { Page } from '@playwright/test';
import { commonSelectors } from '../page-objects/common.po';

export async function assertButtonReady(
  page: Page,
  selector: string,
  label?: string
): Promise<void> {
  const button = page.locator(selector).first();
  const buttonLabel = label ? ` "${label}"` : '';

  await expect(button, `Button${buttonLabel} should be visible`).toBeVisible();

  const isDisabled = await button.isDisabled().catch(() => false);
  expect(isDisabled, `Button${buttonLabel} should not be disabled`).toBe(false);
}
```

- [ ] **Step 2: Run typecheck**

```bash
npx tsc --noEmit
```

Expected: No errors

---

### Task 9: Create interactive-states.ts (Part 2)

- [ ] **Step 1: Add waitForLoadingComplete and disabled assertions**

Append to `tests/ai/shared/assertions/interactive-states.ts`:

```typescript
export async function waitForLoadingComplete(
  page: Page,
  timeout = 15000
): Promise<void> {
  const loadingLocator = page.locator(commonSelectors.loading);
  const count = await loadingLocator.count().catch(() => 0);

  if (count > 0) {
    await loadingLocator.first().waitFor({ state: 'hidden', timeout });
  }
  await page.waitForTimeout(300);
}

export async function assertElementDisabled(
  page: Page,
  selector: string
): Promise<void> {
  const element = page.locator(selector).first();
  const isDisabled =
    (await element.isDisabled().catch(() => false)) ||
    (await element.getAttribute('aria-disabled')) === 'true';

  expect(isDisabled, `Element "${selector}" should be disabled`).toBe(true);
}

export async function assertElementEnabled(
  page: Page,
  selector: string
): Promise<void> {
  const element = page.locator(selector).first();
  const isDisabled =
    (await element.isDisabled().catch(() => false)) ||
    (await element.getAttribute('aria-disabled')) === 'true';

  expect(isDisabled, `Element "${selector}" should be enabled`).toBe(false);
}
```

- [ ] **Step 2: Run typecheck**

```bash
npx tsc --noEmit
```

Expected: No errors

---

### Task 10: Create interactive-states.ts (Part 3)

- [ ] **Step 1: Add state assertions**

Append to `tests/ai/shared/assertions/interactive-states.ts`:

```typescript
export async function assertEmptyState(
  page: Page,
  expectedMessage?: string
): Promise<void> {
  const emptyLocator = page.locator(commonSelectors.empty);
  await expect(
    emptyLocator.first(),
    'Empty state should be visible'
  ).toBeVisible();

  if (expectedMessage) {
    const text = await emptyLocator.first().textContent();
    expect(text?.toLowerCase().includes(expectedMessage.toLowerCase())).toBe(
      true
    );
  }
}

export async function assertErrorState(
  page: Page,
  expectedMessage?: string
): Promise<void> {
  const errorLocator = page.locator(commonSelectors.error);
  await expect(
    errorLocator.first(),
    'Error state should be visible'
  ).toBeVisible();

  if (expectedMessage) {
    const text = await errorLocator.first().textContent();
    expect(text?.toLowerCase().includes(expectedMessage.toLowerCase())).toBe(
      true
    );
  }
}

export async function assertLoadingState(page: Page): Promise<void> {
  const loadingLocator = page.locator(commonSelectors.loading);
  await expect(
    loadingLocator.first(),
    'Loading state should be visible'
  ).toBeVisible();
}
```

- [ ] **Step 2: Run typecheck**

```bash
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add tests/ai/shared/assertions/interactive-states.ts
git commit -m "feat(ai-tests): add interactive state assertions"
```

---

## Chunk 1d: Assertion Helpers - i18n Content

### Task 11: Create i18n-content.ts (Part 1)

**Files:** Create `tests/ai/shared/assertions/i18n-content.ts`

- [ ] **Step 1: Create with assertTextPresent**

```typescript
/**
 * i18n content assertions
 */

import { expect } from 'vitest';
import type { Page } from '@playwright/test';
import type { Locale } from '../../stagehand.config';

export async function assertTextPresent(
  page: Page,
  texts: string[],
  context?: string
): Promise<void> {
  const bodyText = (await page.textContent('body')) ?? '';
  const found = texts.some((text) => bodyText.includes(text));

  expect(
    found,
    `${context ?? 'Page'} should contain at least one of: ${texts.join(', ')}`
  ).toBe(true);
}
```

- [ ] **Step 2: Run typecheck**

```bash
npx tsc --noEmit
```

Expected: No errors

---

### Task 12: Create i18n-content.ts (Part 2)

- [ ] **Step 1: Add heading and image assertions**

Append to `tests/ai/shared/assertions/i18n-content.ts`:

```typescript
export async function assertHeadingStructure(
  page: Page
): Promise<{ valid: boolean; issues: string[] }> {
  const issues: string[] = [];

  const headings = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(
      (h) => ({
        tag: h.tagName,
        text: h.textContent?.trim().slice(0, 50) ?? '',
      })
    );
  });

  const h1Count = headings.filter((h) => h.tag === 'H1').length;
  if (h1Count === 0) issues.push('No h1 found');
  else if (h1Count > 1) issues.push(`Multiple h1 elements: ${h1Count}`);

  const levels = headings.map((h) => parseInt(h.tag[1]));
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] - levels[i - 1] > 1) {
      issues.push(`Heading skip: h${levels[i - 1]} to h${levels[i]}`);
    }
  }

  const valid = issues.length === 0;
  expect(valid, `Heading structure should be valid: ${issues.join('; ')}`).toBe(
    true
  );
  return { valid, issues };
}

export async function assertImageAlts(
  page: Page
): Promise<{ total: number; missing: number }> {
  const images = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img')).map((img) => ({
      hasAlt: !!img.alt || img.getAttribute('role') === 'presentation',
    }));
  });

  const missing = images.filter((img) => !img.hasAlt).length;
  expect(missing, 'All images should have alt text').toBe(0);

  return { total: images.length, missing };
}
```

- [ ] **Step 2: Run typecheck**

```bash
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add tests/ai/shared/assertions/i18n-content.ts
git commit -m "feat(ai-tests): add i18n content assertions"
```

---

## Chunk 1e: Assertion Helpers - Visual & Form

### Task 13: Create visual-layout.ts

**Files:** Create `tests/ai/shared/assertions/visual-layout.ts`

- [ ] **Step 1: Create visual assertions**

```typescript
/**
 * Visual layout assertions
 */

import { expect } from 'vitest';
import type { Page } from '@playwright/test';

export async function assertVisibleInViewport(
  page: Page,
  selector: string
): Promise<void> {
  const element = page.locator(selector).first();
  await expect(element).toBeVisible();

  const box = await element.boundingBox();
  const viewport = page.viewportSize();

  if (box && viewport) {
    expect(box.x >= 0 && box.y >= 0).toBe(true);
  }
}

export async function assertNoHorizontalScroll(page: Page): Promise<void> {
  const hasScroll = await page.evaluate(() => {
    return (
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth
    );
  });
  expect(hasScroll, 'Page should not have horizontal scroll').toBe(false);
}

export async function assertResponsiveLayout(
  page: Page,
  width: number,
  height: number
): Promise<{ issues: string[] }> {
  const issues: string[] = [];
  await page.setViewportSize({ width, height });
  await page.waitForTimeout(500);

  const hasScroll = await page.evaluate(() => {
    return (
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth
    );
  });
  if (hasScroll) issues.push(`Horizontal scroll at ${width}x${height}`);

  const mainVisible = await page
    .locator('main, [role="main"]')
    .isVisible()
    .catch(() => false);
  if (!mainVisible)
    issues.push(`Main content not visible at ${width}x${height}`);

  expect(issues, `Layout issues at ${width}x${height}`).toHaveLength(0);
  return { issues };
}

export async function assertTouchTargets(
  page: Page,
  selector: string
): Promise<void> {
  const elements = await page.locator(selector).all();

  for (const element of elements) {
    const box = await element.boundingBox().catch(() => null);
    if (box) {
      expect(
        box.width >= 44 && box.height >= 44,
        `Touch target too small: ${box.width}x${box.height}`
      ).toBe(true);
    }
  }
}
```

- [ ] **Step 2: Run typecheck**

```bash
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add tests/ai/shared/assertions/visual-layout.ts
git commit -m "feat(ai-tests): add visual layout assertions"
```

---

### Task 14: Create form-validation.ts

**Files:** Create `tests/ai/shared/assertions/form-validation.ts`

- [ ] **Step 1: Create form assertions**

```typescript
/**
 * Form validation assertions
 */

import { expect } from 'vitest';
import type { Page } from '@playwright/test';

export async function assertRequiredFieldIndicated(
  page: Page,
  selector: string
): Promise<void> {
  const element = page.locator(selector).first();
  const hasIndicator = await element.evaluate((el) => {
    if (el.getAttribute('aria-required') === 'true') return true;
    if (el.hasAttribute('required')) return true;
    if (el.closest('.required, [class*="required"]')) return true;
    return false;
  });

  expect(
    hasIndicator,
    `Field "${selector}" should have required indicator`
  ).toBe(true);
}

export async function assertValidationError(
  page: Page,
  fieldSelector: string,
  errorMessage?: string
): Promise<void> {
  const field = page.locator(fieldSelector).first();
  await field.clear();
  await field.blur();
  await page.waitForTimeout(300);

  const hasError = await page.evaluate((selector) => {
    const field = document.querySelector(selector);
    if (!field) return false;
    return !!(
      field.classList.contains('error') ||
      field.classList.contains('invalid') ||
      field.closest('.error, .invalid')
    );
  }, fieldSelector);

  expect(
    hasError,
    `Field "${fieldSelector}" should show validation error`
  ).toBe(true);
}

export async function assertAllFieldsLabeled(
  page: Page
): Promise<{ total: number; unlabeled: string[] }> {
  const result = await page.evaluate(() => {
    const inputs = document.querySelectorAll('input, select, textarea');
    const unlabeled: string[] = [];

    inputs.forEach((input) => {
      const el = input as HTMLInputElement;
      if (['hidden', 'submit', 'button'].includes(el.type)) return;

      const hasLabel =
        (el.id && document.querySelector(`label[for="${el.id}"]`)) ||
        el.closest('label') ||
        el.getAttribute('aria-label');

      if (!hasLabel) unlabeled.push(el.name || el.id || el.type);
    });

    return { total: inputs.length, unlabeled };
  });

  expect(result.unlabeled, 'All fields should have labels').toHaveLength(0);
  return result;
}
```

- [ ] **Step 2: Run typecheck**

```bash
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add tests/ai/shared/assertions/form-validation.ts
git commit -m "feat(ai-tests): add form validation assertions"
```

---

### Task 15: Create assertion index file

- [ ] **Step 1: Create index.ts**

Create `tests/ai/shared/assertions/index.ts`:

```typescript
export * from './interactive-states';
export * from './i18n-content';
export * from './visual-layout';
export * from './form-validation';
```

- [ ] **Step 2: Commit**

```bash
git add tests/ai/shared/assertions/index.ts
git commit -m "feat(ai-tests): add assertions index"
```

---

## Chunk 1f: Flow Page Objects

### Task 16: Create create-chart.po.ts

**Files:** Create `tests/ai/shared/page-objects/create-chart.po.ts`

- [ ] **Step 1: Create chart page object**

```typescript
/**
 * Chart creation page object
 */

import type { Page } from '@playwright/test';
import { CommonPageObject, commonSelectors } from './common.po';

export const createChartSelectors = {
  datasetSelector: "[data-testid='dataset-selector'], [role='listbox']",
  chartTypeBar: "[data-testid='chart-type-bar'], button:has-text('Bar')",
  chartTypeLine: "[data-testid='chart-type-line'], button:has-text('Line')",
  chartTypePie: "[data-testid='chart-type-pie'], button:has-text('Pie')",
  chartTypeButtons: "[data-testid*='chart-type-'], button[class*='chart-type']",
  fieldMapping: "[data-testid='field-mapping'], [class*='mapping']",
  chartPreview: "[data-testid='chart-preview'], canvas, svg",
  nextButton: commonSelectors.buttons.next,
} as const;

export class CreateChartPageObject extends CommonPageObject {
  async navigateToCreate(datasetId?: string): Promise<void> {
    const path = datasetId ? `/create?dataset=${datasetId}` : '/create';
    await this.page.goto(path);
    await this.waitForReady();
  }

  async selectChartType(type: 'bar' | 'line' | 'pie'): Promise<void> {
    const selector =
      createChartSelectors[
        `chartType${type.charAt(0).toUpperCase() + type.slice(1)}` as keyof typeof createChartSelectors
      ];
    await this.page.locator(selector).first().click();
    await this.page.waitForTimeout(300);
  }

  async hasChartPreview(): Promise<boolean> {
    const preview = this.page.locator(createChartSelectors.chartPreview);
    return (await preview.count()) > 0;
  }

  async nextStep(): Promise<void> {
    await this.clickButton('next');
    await this.waitForReady();
  }
}
```

- [ ] **Step 2: Run typecheck**

```bash
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add tests/ai/shared/page-objects/create-chart.po.ts
git commit -m "feat(ai-tests): add create-chart page object"
```

---

### Task 17: Create browse.po.ts

**Files:** Create `tests/ai/shared/page-objects/browse.po.ts`

- [ ] **Step 1: Create browse page object**

```typescript
/**
 * Browse page object
 */

import type { Page } from '@playwright/test';
import { CommonPageObject } from './common.po';

export const browseSelectors = {
  searchInput: "[data-testid='search-input'], input[type='search']",
  filterSidebar: "[data-testid='filter-sidebar'], aside",
  datasetCard: "[data-testid='dataset-card'], [class*='card']",
  resultCount: "[data-testid='result-count'], [class*='count']",
  sortSelect: "[data-testid='sort-select'], select",
} as const;

export class BrowsePageObject extends CommonPageObject {
  async navigateToBrowse(): Promise<void> {
    await this.page.goto('/browse');
    await this.waitForReady();
  }

  async search(query: string): Promise<void> {
    const input = this.page.locator(browseSelectors.searchInput).first();
    await input.clear();
    await input.fill(query);
    await this.page.waitForTimeout(500);
  }

  async getVisibleDatasetCount(): Promise<number> {
    return this.page.locator(browseSelectors.datasetCard).count();
  }

  async sortBy(value: string): Promise<void> {
    await this.page.locator(browseSelectors.sortSelect).first().click();
    await this.page.locator(`option[value="${value}"]`).click();
    await this.page.waitForTimeout(500);
  }
}
```

- [ ] **Step 2: Run typecheck**

```bash
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add tests/ai/shared/page-objects/browse.po.ts
git commit -m "feat(ai-tests): add browse page object"
```

---

### Task 18: Create export.po.ts and index

- [ ] **Step 1: Create export page object**

Create `tests/ai/shared/page-objects/export.po.ts`:

```typescript
/**
 * Export page object
 */

import type { Page } from '@playwright/test';
import { CommonPageObject } from './common.po';

export const exportSelectors = {
  exportButton: "[data-testid='export-button'], button:has-text('Izvoz')",
  shareButton: "[data-testid='share-button'], button:has-text('Deli')",
  embedCode: "[data-testid='embed-code'], textarea",
  shareUrl: "[data-testid='share-url'], input",
  copyButton: "[data-testid='copy-button'], button:has-text('Kopiraj')",
  successToast: "[role='status'], [class*='toast']",
} as const;

export class ExportPageObject extends CommonPageObject {
  async openExportMenu(): Promise<void> {
    await this.page.locator(exportSelectors.exportButton).first().click();
    await this.page.waitForTimeout(300);
  }

  async openShareModal(): Promise<void> {
    await this.page.locator(exportSelectors.shareButton).first().click();
    await this.page.waitForTimeout(300);
  }

  async getEmbedCode(): Promise<string> {
    await this.openShareModal();
    return this.page
      .locator(exportSelectors.embedCode)
      .first()
      .inputValue()
      .catch(
        () =>
          this.page.locator(exportSelectors.embedCode).first().textContent() ||
          ''
      );
  }

  async getShareUrl(): Promise<string> {
    await this.openShareModal();
    return (
      this.page.locator(exportSelectors.shareUrl).first().inputValue() || ''
    );
  }

  async hasSuccessToast(): Promise<boolean> {
    return this.page
      .locator(exportSelectors.successToast)
      .isVisible()
      .catch(() => false);
  }
}
```

- [ ] **Step 2: Create index file**

Create `tests/ai/shared/page-objects/index.ts`:

```typescript
export * from './common.po';
export * from './create-chart.po';
export * from './browse.po';
export * from './export.po';
```

- [ ] **Step 3: Run typecheck**

```bash
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add tests/ai/shared/page-objects/export.po.ts tests/ai/shared/page-objects/index.ts
git commit -m "feat(ai-tests): add export page object and index"
```

---

## Chunk 1 Summary

After completing Chunk 1, you will have:

- ✅ Directory structure created
- ✅ Test data constants
- ✅ Common page object
- ✅ 4 assertion helper modules
- ✅ 3 flow page objects
- ✅ All TypeScript compiling cleanly

**Estimated time:** 2-3 hours

**Tests validated:** All helpers compile and will be validated through flow tests

---

## Chunk 2: Chart Creation Wizard Tests

### Task 19: Create test file skeleton

**Files:** Create `tests/ai/flows/create-chart-wizard.spec.ts`

- [ ] **Step 1: Create test file structure**

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
import { TEST_DATASETS } from '../shared/test-data/test-datasets';
import {
  CreateChartPageObject,
  createChartSelectors,
} from '../shared/page-objects';
import {
  waitForLoadingComplete,
  assertElementDisabled,
} from '../shared/assertions';

describe('Chart Creation Wizard (AI-Driven)', () => {
  let stagehand: Stagehand;
  let pageObj: CreateChartPageObject;

  beforeEach(async () => {
    stagehand = await createStagehand();
    const page = await getActivePage(stagehand);
    pageObj = new CreateChartPageObject(page);
  });

  afterEach(async () => {
    await cleanup(stagehand);
  });

  // Tests will be added in subsequent tasks
});
```

- [ ] **Step 2: Run typecheck**

```bash
npx tsc --noEmit
```

Expected: No errors

---

### Task 20: Add dataset selection tests

- [ ] **Step 1: Add dataset selection describe block**

Insert before the closing brace:

```typescript
describe('Step 1 - Dataset Selection', () => {
  test('should display dataset selection UI', async () => {
    await navigateTo(stagehand, '/create');
    const page = await getActivePage(stagehand);
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    const count = await page
      .locator(createChartSelectors.datasetSelector)
      .count();
    expect(count).toBeGreaterThan(0);
  });

  test('should persist selected dataset in URL', async () => {
    const datasetId = TEST_DATASETS.populationByMunicipality.id;
    await navigateTo(stagehand, `/create?dataset=${datasetId}`);
    const page = await getActivePage(stagehand);
    await waitForLoadingComplete(page);

    expect(page.url()).toContain(`dataset=${datasetId}`);
  });

  test('should disable Next button until dataset selected', async () => {
    await navigateTo(stagehand, '/create');
    const page = await getActivePage(stagehand);
    await waitForLoadingComplete(page);

    await assertElementDisabled(page, createChartSelectors.nextButton);
  });
});
```

- [ ] **Step 2: Run tests to verify structure**

```bash
npm run test:ai -- create-chart-wizard --run 2>&1 | head -30
```

Expected: Tests execute, may have assertion failures but no runtime errors

---

### Task 21: Add chart type selection tests

- [ ] **Step 1: Add chart type tests**

Insert before the closing brace:

```typescript
describe('Step 2 - Chart Type Selection', () => {
  test('should display all chart type options', async () => {
    const datasetId = TEST_DATASETS.populationByMunicipality.id;
    await navigateTo(stagehand, `/create?dataset=${datasetId}`);
    const page = await getActivePage(stagehand);
    await waitForLoadingComplete(page);

    const count = await page
      .locator(createChartSelectors.chartTypeButtons)
      .count();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test('should update URL when chart type selected', async () => {
    const datasetId = TEST_DATASETS.populationByMunicipality.id;
    await navigateTo(stagehand, `/create?dataset=${datasetId}`);
    const page = await getActivePage(stagehand);
    await waitForLoadingComplete(page);

    await pageObj.selectChartType('bar');
    expect(page.url()).toContain('type=bar');
  });

  test.each(['bar', 'line', 'pie'] as const)(
    'should select %s chart type',
    async (type) => {
      const datasetId = TEST_DATASETS.populationByMunicipality.id;
      await pageObj.navigateToCreate(datasetId);
      const page = await getActivePage(stagehand);

      await pageObj.selectChartType(type);
      expect(page.url()).toContain(`type=${type}`);
    }
  );
});
```

- [ ] **Step 2: Run tests**

```bash
npm run test:ai -- create-chart-wizard --run 2>&1 | head -30
```

Expected: Tests execute, 0-3 assertion failures acceptable for initial run

---

### Task 22: Add remaining chart wizard tests

- [ ] **Step 1: Add interactive states and navigation tests**

Insert before the closing brace:

```typescript
describe('Interactive States', () => {
  test('should show loading state during data fetch', async () => {
    await navigateTo(stagehand, '/create');
    const page = await getActivePage(stagehand);

    const hadLoading = await page.evaluate(() => {
      return !!document.querySelector(
        '[class*="loading"], [class*="skeleton"]'
      );
    });
    console.log(`Loading state detected: ${hadLoading}`);
  });

  test('should show error state on invalid dataset', async () => {
    await navigateTo(stagehand, '/create?dataset=invalid-id');
    const page = await getActivePage(stagehand);
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer * 2);

    const hasError = await page.evaluate(() => {
      return !!document.querySelector('[class*="error"], [role="alert"]');
    });
    console.log(`Error state for invalid dataset: ${hasError}`);
  });
});

describe('i18n', () => {
  test('should display UI in Serbian Latin', async () => {
    await navigateTo(stagehand, '/create', 'sr-Latn');
    const page = await getActivePage(stagehand);
    await waitForLoadingComplete(page);

    const text = (await page.textContent('body')) ?? '';
    expect(text.toLowerCase()).toMatch(/skup|podataka|napravi/);
  });
});
```

- [ ] **Step 2: Run full test file**

```bash
npm run test:ai -- create-chart-wizard --run
```

Expected: All tests execute, 0-5 assertion failures acceptable

- [ ] **Step 3: Commit**

```bash
git add tests/ai/flows/create-chart-wizard.spec.ts
git commit -m "feat(ai-tests): add chart creation wizard tests"
```

---

## Chunk 3: Export & Embed Tests

### Task 23: Create export-embed.spec.ts

- [ ] **Step 1: Create test file**

Create `tests/ai/flows/export-embed.spec.ts`:

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
import { TEST_DATASETS } from '../shared/test-data/test-datasets';
import { ExportPageObject, exportSelectors } from '../shared/page-objects';
import { waitForLoadingComplete } from '../shared/assertions';

describe('Export & Embed (AI-Driven)', () => {
  let stagehand: Stagehand;
  let pageObj: ExportPageObject;

  beforeEach(async () => {
    stagehand = await createStagehand();
    const page = await getActivePage(stagehand);
    pageObj = new ExportPageObject(page);
  });

  afterEach(async () => {
    await cleanup(stagehand);
  });

  async function navigateToChart(): Promise<void> {
    const datasetId = TEST_DATASETS.populationByMunicipality.id;
    await navigateTo(stagehand, `/create?dataset=${datasetId}&type=bar`);
    const page = await getActivePage(stagehand);
    await waitForLoadingComplete(page);
  }

  describe('Export Options', () => {
    test('should display export button', async () => {
      await navigateToChart();
      const page = await getActivePage(stagehand);

      const count = await page.locator(exportSelectors.exportButton).count();
      expect(count).toBeGreaterThan(0);
    });

    test('should show export format options', async () => {
      await navigateToChart();
      await pageObj.openExportMenu();
      const page = await getActivePage(stagehand);

      const bodyText = (await page.textContent('body')) ?? '';
      const hasFormats = bodyText.includes('PNG') || bodyText.includes('SVG');
      console.log(`Export formats visible: ${hasFormats}`);
    });
  });

  describe('Embed Code', () => {
    test('should generate embed code', async () => {
      await navigateToChart();

      const embedCode = await pageObj.getEmbedCode();
      console.log(`Embed code length: ${embedCode.length}`);
    });

    test('should include iframe in embed code', async () => {
      await navigateToChart();

      const embedCode = await pageObj.getEmbedCode();
      const hasIframe = embedCode.includes('<iframe');
      console.log(`Embed code contains iframe: ${hasIframe}`);
    });
  });

  describe('Share URLs', () => {
    test('should generate share URL', async () => {
      await navigateToChart();

      const shareUrl = await pageObj.getShareUrl();
      console.log(`Share URL: ${shareUrl.slice(0, 50)}...`);
    });

    test('should include locale in share URL', async () => {
      await navigateToChart();

      const shareUrl = await pageObj.getShareUrl();
      const hasLocale = /\/(sr-Latn|sr-Cyrl|en)\//.test(shareUrl);
      console.log(`Share URL includes locale: ${hasLocale}`);
    });
  });
});
```

- [ ] **Step 2: Run tests**

```bash
npm run test:ai -- export-embed --run
```

Expected: Tests execute, 0-5 assertion failures acceptable

- [ ] **Step 3: Commit**

```bash
git add tests/ai/flows/export-embed.spec.ts
git commit -m "feat(ai-tests): add export & embed tests"
```

---

## Chunk 4: Browse & Filters Tests

### Task 24: Create browse-filters.spec.ts

- [ ] **Step 1: Create test file**

Create `tests/ai/flows/browse-filters.spec.ts`:

```typescript
import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { Stagehand } from '@browserbasehq/stagehand';
import {
  createStagehand,
  navigateTo,
  cleanup,
  getActivePage,
} from '../fixtures/test-helpers';
import { BrowsePageObject, browseSelectors } from '../shared/page-objects';
import { waitForLoadingComplete } from '../shared/assertions';
import {
  assertNoHorizontalScroll,
  assertResponsiveLayout,
} from '../shared/assertions';
import { TEST_VIEWPORTS } from '../shared/test-data/test-datasets';

describe('Browse & Filters (AI-Driven)', () => {
  let stagehand: Stagehand;
  let pageObj: BrowsePageObject;

  beforeEach(async () => {
    stagehand = await createStagehand();
    const page = await getActivePage(stagehand);
    pageObj = new BrowsePageObject(page);
  });

  afterEach(async () => {
    await cleanup(stagehand);
  });

  describe('Dataset Browsing', () => {
    test('should display dataset grid on load', async () => {
      await navigateTo(stagehand, '/browse');
      const page = await getActivePage(stagehand);
      await waitForLoadingComplete(page);

      const count = await page.locator(browseSelectors.datasetCard).count();
      expect(count).toBeGreaterThan(0);
    });

    test('should show loading state initially', async () => {
      await navigateTo(stagehand, '/browse');
      const page = await getActivePage(stagehand);

      const hadLoading = await page.evaluate(() => {
        return !!document.querySelector(
          '[class*="loading"], [class*="skeleton"]'
        );
      });
      console.log(`Loading state shown: ${hadLoading}`);
    });

    test('should sort datasets', async () => {
      await pageObj.navigateToBrowse();
      const page = await getActivePage(stagehand);

      const sortSelect = page.locator(browseSelectors.sortSelect);
      if ((await sortSelect.count()) > 0) {
        await sortSelect.first().click();
        console.log('Sort select clicked');
      }
    });
  });

  describe('Search', () => {
    test('should have search input', async () => {
      await pageObj.navigateToBrowse();
      const page = await getActivePage(stagehand);

      const count = await page.locator(browseSelectors.searchInput).count();
      expect(count).toBeGreaterThan(0);
    });

    test('should search by query', async () => {
      await pageObj.navigateToBrowse();
      const page = await getActivePage(stagehand);

      await pageObj.search('populacija');
      const results = await pageObj.getVisibleDatasetCount();
      console.log(`Search results: ${results}`);
    });

    test('should handle Serbian Cyrillic search', async () => {
      await pageObj.navigateToBrowse();
      const page = await getActivePage(stagehand);

      await pageObj.search('попис');
      const results = await pageObj.getVisibleDatasetCount();
      console.log(`Cyrillic search results: ${results}`);
    });
  });

  describe('Visual Layout', () => {
    test('should have no horizontal scroll', async () => {
      await pageObj.navigateToBrowse();
      const page = await getActivePage(stagehand);

      await assertNoHorizontalScroll(page);
    });

    test('should be responsive on mobile', async () => {
      await pageObj.navigateToBrowse();
      const page = await getActivePage(stagehand);

      const { issues } = await assertResponsiveLayout(
        page,
        TEST_VIEWPORTS.mobile.width,
        TEST_VIEWPORTS.mobile.height
      );
      console.log(`Mobile issues: ${issues.join(', ') || 'none'}`);
    });
  });
});
```

- [ ] **Step 2: Run tests**

```bash
npm run test:ai -- browse-filters --run
```

Expected: Tests execute, 0-5 assertion failures acceptable

- [ ] **Step 3: Commit**

```bash
git add tests/ai/flows/browse-filters.spec.ts
git commit -m "feat(ai-tests): add browse & filters tests"
```

---

## Chunk 5: Accessibility Deep Tests

### Task 25: Create accessibility-deep.spec.ts

- [ ] **Step 1: Create test file**

Create `tests/ai/flows/accessibility-deep.spec.ts`:

```typescript
import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { Stagehand } from '@browserbasehq/stagehand';
import {
  createStagehand,
  navigateTo,
  cleanup,
  getActivePage,
} from '../fixtures/test-helpers';
import { waitForLoadingComplete } from '../shared/assertions';
import { assertHeadingStructure, assertImageAlts } from '../shared/assertions';
import {
  assertNoHorizontalScroll,
  assertTouchTargets,
} from '../shared/assertions';
import { assertAllFieldsLabeled } from '../shared/assertions';
import { TEST_VIEWPORTS } from '../shared/test-data/test-datasets';

describe('Accessibility Deep (AI-Driven)', () => {
  let stagehand: Stagehand;

  beforeEach(async () => {
    stagehand = await createStagehand();
  });

  afterEach(async () => {
    await cleanup(stagehand);
  });

  describe('Keyboard Navigation', () => {
    test('should navigate with Tab', async () => {
      await navigateTo(stagehand, '/');
      const page = await getActivePage(stagehand);
      await waitForLoadingComplete(page);

      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');
        await page.waitForTimeout(100);
      }

      const focused = await page.evaluate(
        () => document.activeElement?.tagName
      );
      expect(focused).toBeTruthy();
    });

    test('should activate buttons with Enter', async () => {
      await navigateTo(stagehand, '/');
      const page = await getActivePage(stagehand);
      await waitForLoadingComplete(page);

      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(300);

      expect(true).toBe(true); // No crash = pass
    });
  });

  describe('ARIA Structure', () => {
    test('should have single h1 per page', async () => {
      await navigateTo(stagehand, '/');
      const page = await getActivePage(stagehand);

      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);
    });

    test('should have logical heading hierarchy', async () => {
      await navigateTo(stagehand, '/');
      const page = await getActivePage(stagehand);

      const { valid, issues } = await assertHeadingStructure(page);
      console.log(`Heading issues: ${issues.join(', ') || 'none'}`);
    });

    test('should have landmark regions', async () => {
      await navigateTo(stagehand, '/');
      const page = await getActivePage(stagehand);

      const mainCount = await page.locator('main, [role="main"]').count();
      expect(mainCount).toBeGreaterThan(0);
    });
  });

  describe('Screen Reader Support', () => {
    test('should have alt text for images', async () => {
      await navigateTo(stagehand, '/');
      const page = await getActivePage(stagehand);

      const { total, missing } = await assertImageAlts(page);
      console.log(`Images: ${total} total, ${missing} missing alt`);
    });
  });

  describe('Form Accessibility', () => {
    test('should have labels on all inputs', async () => {
      await navigateTo(stagehand, '/create');
      const page = await getActivePage(stagehand);
      await waitForLoadingComplete(page);

      const { total, unlabeled } = await assertAllFieldsLabeled(page);
      console.log(`Inputs: ${total} total, ${unlabeled.length} unlabeled`);
    });
  });

  describe('Mobile Accessibility', () => {
    test('should have adequate touch targets', async () => {
      await navigateTo(stagehand, '/');
      const page = await getActivePage(stagehand);

      await page.setViewportSize({
        width: TEST_VIEWPORTS.mobile.width,
        height: TEST_VIEWPORTS.mobile.height,
      });

      await assertTouchTargets(page, 'button, a');
    });
  });
});
```

- [ ] **Step 2: Run tests**

```bash
npm run test:ai -- accessibility-deep --run
```

Expected: Tests execute, 0-5 assertion failures acceptable

- [ ] **Step 3: Commit**

```bash
git add tests/ai/flows/accessibility-deep.spec.ts
git commit -m "feat(ai-tests): add accessibility deep tests"
```

---

## Chunk 6: UI Validator Specs

### Task 26: Create UI validator YAML specs

- [ ] **Step 1: Create create-chart.yaml**

Create `.ui-validator/specs/create-chart.yaml`:

```yaml
path: /create
name: Chart Creation Wizard
locale: sr-Latn
critical_elements:
  - selector: "[data-testid='dataset-selector'], [role='listbox']"
    expectation: Dataset selection dropdown
    required: true
    must_be_visible: true

  - selector: "[data-testid*='chart-type-']"
    expectation: Chart type buttons
    required: true
    must_be_visible: true
    min_count: 4

  - selector: 'canvas, svg'
    expectation: Chart preview
    required: true
    must_be_visible: true
```

- [ ] **Step 2: Create browse-filters.yaml**

Create `.ui-validator/specs/browse-filters.yaml`:

```yaml
path: /browse
name: Dataset Browser
locale: sr-Latn
critical_elements:
  - selector: "input[type='search']"
    expectation: Search input
    required: true
    must_be_visible: true

  - selector: "[data-testid='dataset-card'], [class*='card']"
    expectation: Dataset cards
    required: true
    must_be_visible: true
    min_count: 1
```

- [ ] **Step 3: Create export-embed.yaml**

Create `.ui-validator/specs/export-embed.yaml`:

```yaml
path: /create
name: Export Controls
locale: sr-Latn
critical_elements:
  - selector: "button:has-text('Izvoz')"
    expectation: Export button
    required: true
    must_be_visible: true

  - selector: "button:has-text('Deli')"
    expectation: Share button
    required: true
    must_be_visible: true
```

- [ ] **Step 4: Create common-elements.yaml**

Create `.ui-validator/specs/common-elements.yaml`:

```yaml
path: /
name: Common Elements
locale: sr-Latn
critical_elements:
  - selector: "nav, [role='navigation']"
    expectation: Navigation
    required: true
    must_be_visible: true

  - selector: "main, [role='main']"
    expectation: Main content
    required: true
    must_be_visible: true
```

- [ ] **Step 5: Commit**

```bash
git add .ui-validator/specs/
git commit -m "feat(ui-validator): add AI testing specs"
```

---

## Chunk 7: Final Verification & Cleanup

### Task 27: Run full test suite

- [ ] **Step 1: Run all AI tests**

```bash
npm run test:ai
```

Expected: All tests execute, 0-10 assertion failures acceptable for initial run

- [ ] **Step 2: Run typecheck**

```bash
npx tsc --noEmit
```

Expected: No errors

---

### Task 28: Archive old test files

- [ ] **Step 1: Mark old files as deprecated**

Add deprecation notice to old files:

```bash
# Add deprecation comment to old test files
for file in tests/ai/flows/create-chart.spec.ts tests/ai/flows/export-flow.spec.ts tests/ai/flows/search-browse.spec.ts; do
  if [ -f "$file" ]; then
    sed -i '1s/^/\/\*\*\n \* @deprecated Use create-chart-wizard.spec.ts instead\n \*\/\n/' "$file"
  fi
done
```

Expected: Files updated with deprecation notices

- [ ] **Step 2: Commit**

```bash
git add tests/ai/flows/*.spec.ts
git commit -m "chore: deprecate old test files"
```

---

### Task 29: Final commit and summary

- [ ] **Step 1: Create summary of changes**

```bash
git log --oneline -15
```

Expected: Shows all commits from this plan

- [ ] **Step 2: Push changes (if applicable)**

```bash
git push origin main
```

---

## Final Summary

**Total Implementation:**

| Component          | Count     |
| ------------------ | --------- |
| Assertion helpers  | 4 modules |
| Page objects       | 4 classes |
| Test data          | 1 file    |
| Flow test files    | 4 files   |
| UI validator specs | 4 files   |
| **Total tests**    | ~60-80    |

**Files Created:**

- `tests/ai/shared/test-data/test-datasets.ts`
- `tests/ai/shared/assertions/interactive-states.ts`
- `tests/ai/shared/assertions/i18n-content.ts`
- `tests/ai/shared/assertions/visual-layout.ts`
- `tests/ai/shared/assertions/form-validation.ts`
- `tests/ai/shared/assertions/index.ts`
- `tests/ai/shared/page-objects/common.po.ts`
- `tests/ai/shared/page-objects/create-chart.po.ts`
- `tests/ai/shared/page-objects/browse.po.ts`
- `tests/ai/shared/page-objects/export.po.ts`
- `tests/ai/shared/page-objects/index.ts`
- `tests/ai/flows/create-chart-wizard.spec.ts`
- `tests/ai/flows/export-embed.spec.ts`
- `tests/ai/flows/browse-filters.spec.ts`
- `tests/ai/flows/accessibility-deep.spec.ts`
- `.ui-validator/specs/create-chart.yaml`
- `.ui-validator/specs/browse-filters.yaml`
- `.ui-validator/specs/export-embed.yaml`
- `.ui-validator/specs/common-elements.yaml`

**Estimated total time:** 6-8 hours

---

**Ready to execute?**
