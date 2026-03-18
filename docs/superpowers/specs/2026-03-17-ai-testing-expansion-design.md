# AI Testing Expansion Design

**Date:** 2026-03-17
**Status:** Approved
**Goal:** Fill gaps in existing AI-driven test flows with detailed UI validation

## Overview

Expand the existing Stagehand-based AI testing infrastructure to provide comprehensive coverage of interactive states, text content/i18n, visual layout, and form validation UX across four major user flows.

## Architecture

### Directory Structure

```
tests/ai/
├── flows/
│   ├── create-chart-wizard.spec.ts   # Renamed & expanded
│   ├── export-embed.spec.ts          # Renamed & expanded
│   ├── browse-filters.spec.ts        # Renamed & expanded
│   ├── accessibility-deep.spec.ts    # Expanded
│   ├── chart-types.spec.ts           # Keep existing
│   ├── data-validation.spec.ts       # Keep existing
│   ├── responsive.spec.ts            # Keep existing
│   ├── visual-regression.spec.ts     # Keep existing
│   └── page-visibility.spec.ts       # Keep existing
├── shared/
│   ├── assertions/
│   │   ├── interactive-states.ts     # Loading, disabled, error, empty states
│   │   ├── i18n-content.ts           # Text presence, locale coverage
│   │   ├── visual-layout.ts          # Visibility, overlap, viewport integrity
│   │   └── form-validation.ts        # Required fields, errors, success
│   ├── page-objects/
│   │   ├── create-chart.po.ts        # Chart wizard selectors
│   │   ├── browse.po.ts              # Browse/filters selectors
│   │   ├── export.po.ts              # Export/embed selectors
│   │   └── common.po.ts              # Shared selectors
│   └── test-data/
│       └── test-datasets.ts          # Test dataset IDs and values
├── fixtures/
│   └── test-helpers.ts               # Existing
└── stagehand.config.ts               # Existing

.ui-validator/
├── specs/
│   ├── create-chart.yaml
│   ├── browse-filters.yaml
│   ├── export-embed.yaml
│   └── common-elements.yaml
└── config.yaml                       # Updated with new specs
```

### Key Principles

1. **Page Objects own selectors** - All CSS selectors and data-testid values in one place
2. **Assertions are reusable** - Common checks extracted to shared helpers
3. **Each flow file is self-contained** - Tests complete user journey
4. **UI Validator specs complement** - Element-level checks for critical pages

### Selector Strategy

The codebase currently lacks `data-testid` attributes on most components. Tests should use fallback selectors:

```typescript
// Example from existing tests - use multiple fallback patterns
const selectors = {
  // Preferred: data-testid (add during implementation)
  nextButton:
    "[data-testid='next-button'], button:has-text('Sledeće'), button:has-text('Next')",
  // Role-based fallback
  datasetSelector: "[data-testid='dataset-selector'], [role='listbox'], select",
  // Class-based fallback (last resort)
  chartPreview:
    "[data-testid='chart-preview'], [class*='preview'], canvas, svg",
};
```

**Implementation Note:** When adding tests, also add `data-testid` attributes to components for more reliable selection.

### File Migration Approach

| Original File           | New File                      | Approach                                 |
| ----------------------- | ----------------------------- | ---------------------------------------- |
| `create-chart.spec.ts`  | `create-chart-wizard.spec.ts` | Create new, keep original for comparison |
| `export-flow.spec.ts`   | `export-embed.spec.ts`        | Create new, deprecate original           |
| `search-browse.spec.ts` | `browse-filters.spec.ts`      | Create new, deprecate original           |
| `accessibility.spec.ts` | `accessibility-deep.spec.ts`  | Create new, keep original as basic check |

### Loading State Simulation

Tests simulate loading states through:

1. **Network interception**: Use Playwright's `page.route()` to delay responses
2. **Immediate check**: Verify loading UI appears before async completes
3. **Mock delays**: Add artificial delays to slow down fast operations

```typescript
// Example: Testing loading state
test('should show loading spinner during data fetch', async () => {
  // Delay the dataset API response
  await page.route('**/api/datasets**', async (route) => {
    await page.waitForTimeout(2000); // Simulate slow network
    route.continue();
  });

  await navigateTo(stagehand, '/browse');
  const page = getActivePage(stagehand);

  // Check loading UI appears
  const loadingVisible = await page
    .locator('[class*="loading"], [class*="skeleton"]')
    .isVisible();
  expect(loadingVisible).toBe(true);
});
```

---

## Shared Assertion Helpers

All assertion helpers use Playwright's `Page` type and follow a consistent pattern:

- Return `void` and throw on failure (Vitest-style assertions)
- Accept `page: Page` as first parameter
- Use `expect()` internally for clear error messages

### `interactive-states.ts`

```typescript
import type { Page } from '@playwright/test';

export const interactiveAssertions = {
  /** Asserts button is visible and not disabled. Throws on failure. */
  async assertButtonReady(page: Page, selector: string, label?: string): Promise<void>,

  /** Waits for all loading indicators to disappear. Throws on timeout. */
  async waitForLoadingComplete(page: Page, timeout?: number): Promise<void>,

  /** Asserts element has disabled state. Throws if enabled. */
  async assertElementDisabled(page: Page, selector: string): Promise<void>,

  /** Asserts empty state is visible with optional message check. */
  async assertEmptyState(page: Page, expectedMessage?: string): Promise<void>,

  /** Asserts error state is visible with optional message check. */
  async assertErrorState(page: Page, expectedMessage?: string): Promise<void>,

  /** Asserts element has visible focus indicator styling. */
  async assertFocusIndicator(page: Page, selector: string): Promise<void>,
}
```

### `i18n-content.ts`

```typescript
import type { Page } from '@playwright/test';
import type { Locale } from '../stagehand.config';

export const i18nAssertions = {
  /** Asserts at least one of the provided texts is present. */
  async assertTextPresent(page: Page, texts: string[], locale?: Locale): Promise<void>,

  /** Returns array of placeholder violations (TODO, Lorem ipsum, etc.). */
  async assertNoPlaceholders(page: Page): Promise<string[]>,

  /** Asserts heading hierarchy is valid. Returns issues array for debugging. */
  async assertHeadingStructure(page: Page): Promise<{ valid: boolean; issues: string[] }>,

  /** Asserts all images have appropriate alt text. Returns counts. */
  async assertImageAlts(page: Page): Promise<{ total: number; missing: number }>,

  /** Asserts locale switcher updates content to target locale. */
  async assertLocaleSwitch(page: Page, fromLocale: Locale, toLocale: Locale): Promise<void>,
}
```

### `visual-layout.ts`

```typescript
import type { Page } from '@playwright/test';

export const visualAssertions = {
  /** Asserts element is visible within viewport bounds. */
  async assertVisibleInViewport(page: Page, selector: string): Promise<void>,

  /** Asserts no horizontal scroll exists. */
  async assertNoHorizontalScroll(page: Page): Promise<void>,

  /** Returns array of selector pairs that overlap. */
  async assertNoOverlapping(page: Page, selectors: string[]): Promise<string[]>,

  /** Checks layout at specific viewport. Returns issues for debugging. */
  async assertResponsiveLayout(page: Page, width: number, height: number): Promise<{ issues: string[] }>,

  /** Returns contrast ratio and WCAG AA pass status. */
  async assertTextContrast(page: Page, selector: string): Promise<{ ratio: number; passes: boolean }>,
}
```

### `form-validation.ts`

```typescript
import type { Page } from '@playwright/test';

export const formAssertions = {
  /** Asserts required field has indicator (asterisk, aria-required, etc.). */
  async assertRequiredFieldIndicated(page: Page, selector: string): Promise<void>,

  /** Triggers validation and asserts error appears. */
  async assertValidationError(page: Page, fieldSelector: string, errorMessage?: string): Promise<void>,

  /** Asserts field shows valid/success state. */
  async assertValidationSuccess(page: Page, fieldSelector: string): Promise<void>,

  /** Returns count of inputs without associated labels. */
  async assertAllFieldsLabeled(page: Page): Promise<{ total: number; unlabeled: string[] }>,

  /** Asserts submit button is disabled until form is valid. */
  async assertSubmitDisabledUntilValid(page: Page, formSelector: string): Promise<void>,
}
```

---

## Test Data Definitions

### `test-data/test-datasets.ts`

```typescript
/**
 * Known test datasets from data.gov.rs
 * These IDs are stable and used across test suites
 */
export const TEST_DATASETS = {
  // Primary test dataset - has multiple numeric and categorical columns
  populationByMunicipality: {
    id: '678e312d0aae3fe3ad3e361c',
    name: 'Population by Municipality',
    expectedRows: 174, // 174 municipalities in Serbia
    numericColumns: ['population', 'area_km2', 'density'],
    categoricalColumns: ['municipality', 'district', 'region'],
  },

  // Secondary dataset - time series data
  gdpByYear: {
    id: '678e312d0aae3fe3ad3e361d',
    name: 'GDP by Year',
    expectedRows: 20,
    numericColumns: ['gdp', 'gdp_growth', 'gdp_per_capita'],
    categoricalColumns: ['year', 'currency'],
  },

  // Dataset for map visualization
  electionResults: {
    id: '678e312d0aae3fe3ad3e361e',
    name: 'Election Results by District',
    expectedRows: 24, // 24 districts
    geoColumn: 'district_code',
    numericColumns: ['votes_total', 'turnout_percent'],
    categoricalColumns: ['district', 'winner'],
  },
} as const;

/**
 * Test user credentials (for authenticated flows)
 * Uses environment variables in CI
 */
export const TEST_USERS = {
  editor: {
    email: process.env.TEST_EDITOR_EMAIL ?? 'test-editor@example.com',
    password: process.env.TEST_EDITOR_PASSWORD ?? 'test-password',
    role: 'EDITOR',
  },
  admin: {
    email: process.env.TEST_ADMIN_EMAIL ?? 'test-admin@example.com',
    password: process.env.TEST_ADMIN_PASSWORD ?? 'test-password',
    role: 'ADMIN',
  },
} as const;

/**
 * Viewport configurations for responsive testing
 */
export const TEST_VIEWPORTS = {
  mobile: { width: 375, height: 667, name: 'mobile' },
  mobileLandscape: { width: 667, height: 375, name: 'mobile-landscape' },
  tablet: { width: 768, height: 1024, name: 'tablet' },
  desktop: { width: 1280, height: 800, name: 'desktop' },
  wide: { width: 1920, height: 1080, name: 'wide' },
} as const;
```

---

## Flow Test Expansions

### Chart Creation Wizard (~35-40 tests)

**Step 1 - Dataset Selection:**

- Display dataset selection UI with search and categories
- Loading state while fetching datasets
- Filter datasets by search query
- Display dataset metadata
- Empty state for no matches
- Persist selected dataset in URL
- Disable "Next" until dataset selected
- Show dataset preview panel

**Step 2 - Chart Type Selection:**

- Display all available chart types
- Highlight recommended chart types
- Show disabled state for incompatible types
- Update URL param on selection
- Chart type description on hover
- Maintain selection on back navigation

**Step 3 - Field Mapping:**

- Display available data columns
- Auto-map recommended fields
- Validation error for required unmapped fields
- Real-time chart preview on field change
- Numeric vs categorical field validation
- Field preview values in dropdown
- Multi-measure selection for combo charts

**Step 4 - Customization & Preview:**

- Render chart preview with actual data
- Loading state while chart renders
- Filter pills display
- Dataset info footer with metadata
- Chart title/subtitle editing
- Color palette selection
- Legend visibility toggle
- Annotation placement

**Interactive States:**

- Loading spinner during data fetch
- Disabled navigation during async operations
- Error state on dataset load failure
- Empty state for empty datasets
- Form state preservation on back/forward

**i18n:**

- All UI text in selected locale
- Cyrillic text in form inputs
- Localized error messages
- Locale persistence across steps

**Form Validation:**

- Required field indicators
- Inline validation errors
- Disabled publish with invalid config
- Error clearing on correction

---

### Export & Embed (~25-30 tests)

**Export Options:**

- Export button/menu on chart preview
- Export format options (PNG, SVG, PDF)
- Loading state during export generation
- Download with correct filename format
- Large/complex chart handling
- Disable export while chart loading
- Include chart title in exported file

**Export Settings:**

- Resolution/scale options for PNG
- Chart dimensions in export
- Legend include/exclude settings
- Transparent background option

**Embed Code Generation:**

- Embed option in share menu
- Valid iframe embed code generation
- Responsive vs fixed size options
- Copy to clipboard functionality
- Success feedback after copy
- Embed preview
- Correct locale in embed URL

**Shareable URLs:**

- Shareable chart URL generation
- Chart configuration in URL
- Copy share URL to clipboard
- Special characters (Cyrillic) handling
- URL length limit validation

**Interactive States:**

- Loading spinner during export
- Disabled options while processing
- Error state on export failure
- Success toast after export

**Accessibility:**

- Accessible export button label
- Focus trap in export modal
- Screen reader announcements
- Keyboard navigation in menu

---

### Browse & Filters (~35-40 tests)

**Dataset Browsing:**

- Dataset grid/list on load
- Loading state while fetching
- Empty state when no datasets
- Dataset cards with metadata
- Pagination
- Infinite scroll
- Sort by name/date/popularity

**Filter Interactions:**

- Filter categories display
- Hierarchical geography filter
- Real-time results update
- Active filter badges
- Clear all filters
- URL filter persistence
- No results state
- Many options virtualization

**Search Functionality:**

- Search by title
- Search by description
- Serbian Cyrillic queries
- Serbian Latin queries
- Search suggestions/autocomplete
- Debounced input
- Result count display
- Clear search with Escape

**Dataset Detail View:**

- Navigate to detail on click
- Full dataset metadata
- Data preview table
- Create Chart action button
- Dataset source/attribution

**Interactive States:**

- Loading skeleton during fetch
- Disabled filter controls while loading
- Error state on fetch failure
- Hovered card highlighting
- Dropdown loading state

**Visual Layout:**

- Filter sidebar on desktop
- Collapsed drawer on mobile
- Grid alignment across breakpoints
- No horizontal overflow
- Sticky filter bar on scroll

**i18n:**

- Filter labels in current locale
- Dataset titles in Serbian
- Mixed script search handling
- Localized date formats

---

### Accessibility Deep (~40-45 tests)

**Keyboard Navigation:**

- Main menu Tab/Shift+Tab
- Buttons with Enter and Space
- Modals close with Escape
- Dropdown Arrow key navigation
- Focus trap in modals/dialogs
- Skip to main content link
- Data table keyboard navigation
- First element focus on load
- Focus return after modal close

**ARIA Structure:**

- Single h1 per page
- Logical heading hierarchy
- Landmark regions (main, nav, aside)
- aria-label on icon buttons
- aria-expanded on collapsibles
- aria-current on active nav
- aria-live for dynamic content
- role="alert" on errors
- Proper table headers

**Focus Management:**

- Visible focus indicators (3:1 contrast)
- No outline removal
- Focus on route change
- Focus on async content load
- :focus-visible styling

**Screen Reader Support:**

- Descriptive link text
- Alt text for informative images
- Empty alt for decorative images
- Inline form error announcements
- Fieldset/legend for grouped inputs
- aria-describedby linking
- Accessible chart data tables

**Color & Contrast:**

- 4.5:1 body text contrast
- 3:1 large text contrast
- 3:1 UI component contrast
- Not color-only information
- Colorblind-safe palettes
- Pattern overlays for charts

**Reduced Motion:**

- prefers-reduced-motion respect
- No auto-playing animations
- Pause control for animated charts
- No >3Hz flashing

**Form Accessibility:**

- Labels on all inputs
- aria-required on required fields
- Autocomplete attributes
- Error messages linked to inputs
- Autofill support for login

**Mobile Accessibility:**

- Touch targets 44x44px minimum
- Mobile viewport keyboard navigation (375x667)
- Mobile menu accessibility
- Responsive table alternatives
- Mobile form input zoom prevention (16px minimum font)

**Feature 17 - Time-Based Animation:**

- Pause/play controls accessible via keyboard
- Animation speed control has label
- prefers-reduced-motion pauses auto-play
- Screen reader announces animation state
- Focus trap in animation controls

**Feature 22 - Interactive Annotations:**

- Annotation markers keyboard accessible
- Annotation tooltips readable by screen readers
- aria-expanded on expandable annotations
- Annotation content in accessible name
- Click/touch targets meet 44px minimum

---

## UI Validator Specs

### `.ui-validator/specs/create-chart.yaml`

```yaml
path: /create
name: Chart Creation Wizard
locale: sr-Latn
critical_elements:
  - selector: "[data-testid='step-indicator']"
    expectation: Shows current wizard step
    required: true
    must_be_visible: true

  - selector: "[data-testid='dataset-selector'], [role='listbox']"
    expectation: Dataset selection dropdown
    required: true
    must_be_visible: true
    min_count: 1

  - selector: "[data-testid*='chart-type-']"
    expectation: Chart type selection buttons
    required: true
    must_be_visible: true
    min_count: 4

  - selector: "[data-testid='field-mapping'], [class*='mapping']"
    expectation: Field mapping configuration
    required: true
    must_be_visible: true

  - selector: "[data-testid='chart-preview'], canvas, svg"
    expectation: Live chart preview
    required: true
    must_be_visible: true

  - selector: "button:has-text('Sledeće'), button:has-text('Next')"
    expectation: Next step navigation
    required: true
    must_be_visible: true
```

### `.ui-validator/specs/browse-filters.yaml`

```yaml
path: /browse
name: Dataset Browser
locale: sr-Latn
critical_elements:
  - selector: "input[type='search'], [data-testid='search-input']"
    expectation: Dataset search field
    required: true
    must_be_visible: true

  - selector: "[data-testid='filter-sidebar'], aside"
    expectation: Filter options panel
    required: true
    must_be_visible: true

  - selector: "[data-testid='dataset-grid'], [class*='grid']"
    expectation: Dataset cards container
    required: true
    must_be_visible: true

  - selector: "[data-testid='active-filters'], [class*='filter-pills']"
    expectation: Shows currently applied filters
    required: false
    must_be_visible: false

  - selector: "[data-testid='sort-select'], select"
    expectation: Sorting options dropdown
    required: true
    must_be_visible: true
```

### `.ui-validator/specs/export-embed.yaml`

```yaml
path: /create
name: Export & Embed Controls
locale: sr-Latn
critical_elements:
  - selector: "[data-testid='export-button'], button:has-text('Izvoz')"
    expectation: Export action button
    required: true
    must_be_visible: true

  - selector: "[data-testid='share-button'], button:has-text('Deli')"
    expectation: Share/embed action button
    required: true
    must_be_visible: true

  - selector: "[data-testid='export-format-png'], [data-testid='export-format-svg']"
    expectation: Export format selection
    required: false
    must_be_visible: false

  - selector: "textarea, [data-testid='embed-code']"
    expectation: Generated embed code
    required: false
    must_be_visible: false
```

### `.ui-validator/specs/common-elements.yaml`

```yaml
path: /
name: Common Page Elements
locale: sr-Latn
critical_elements:
  - selector: "[data-testid='skip-link'], a[href='#main']"
    expectation: Skip to main content link
    required: true
    must_be_visible: false

  - selector: "nav, [role='navigation']"
    expectation: Primary navigation
    required: true
    must_be_visible: true

  - selector: "[data-testid='locale-switcher'], [class*='language']"
    expectation: Locale selection dropdown
    required: true
    must_be_visible: true

  - selector: "main, [role='main']"
    expectation: Main content region
    required: true
    must_be_visible: true

  - selector: "footer, [role='contentinfo']"
    expectation: Page footer with links
    required: true
    must_be_visible: true
```

---

## Implementation Order

### Phase 1: Foundation (Shared Helpers)

- Create directory structure
- Implement all four assertion helper modules
- Create common page object
- Create test data constants

### Phase 2: Chart Creation Wizard

- Create chart creation page object
- Implement all test categories
- Create UI validator spec

### Phase 3: Export & Embed

- Create export page object
- Implement all test categories
- Create UI validator spec

### Phase 4: Browse & Filters

- Create browse page object
- Implement all test categories
- Create UI validator spec

### Phase 5: Accessibility Deep

- Implement all accessibility test categories
- Create common elements UI validator spec

### Phase 6: Integration & Cleanup

- Update UI validator config
- Archive superseded test files
- Fix flaky tests
- Update documentation

---

## Estimated Totals

- **Total Tests:** ~140-160
- **New Files:** ~15
- **Modified Files:** ~4
