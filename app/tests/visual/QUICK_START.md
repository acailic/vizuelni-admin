# Visual Regression Testing - Quick Start Guide

This is a quick reference guide for running and working with visual regression
tests for core charts.

## Quick Commands

### Run Tests

```bash
# Run all visual tests
yarn test:visual

# Run with UI (interactive mode)
yarn test:visual:ui

# Run in debug mode
yarn test:visual:debug

# View test report
yarn test:visual:report
```

### Update Baselines

```bash
# Update all baselines
yarn test:visual:update

# Generate baselines for all tests
yarn test:visual:baseline

# Generate baselines for specific chart
yarn test:visual:baseline --chart=line

# Generate baselines for specific viewport
yarn test:visual:baseline --viewport=desktop
```

### Run Specific Tests

```bash
# Run only LineChart tests
npx playwright test --config=playwright.visual.config.ts line-chart

# Run only desktop viewport tests
npx playwright test --config=playwright.visual.config.ts --project=chrome-desktop

# Run specific test file
npx playwright test --config=playwright.visual.config.ts app/tests/visual/line-chart.visual.test.tsx
```

## Common Workflows

### 1. Creating New Visual Tests

1. Create test file in `app/tests/visual/`
2. Use `.visual.test.tsx` extension
3. Import utilities from `./chart-test-utils`
4. Write test scenarios
5. Run tests to generate baselines

Example:

```typescript
import { test, expect } from "@playwright/test";
import {
  renderChart,
  viewports,
  waitForChartStability,
} from "./chart-test-utils";

test("my new test", async ({ page }) => {
  await page.setViewportSize(viewports.desktop);
  await renderChart(page, "line", data, config);
  await waitForChartStability(page);
  await expect(page).toHaveScreenshot("my-test.png");
});
```

### 2. Updating Baselines After Changes

When you make intentional visual changes:

```bash
# 1. Run tests to see what changed
yarn test:visual

# 2. Review the HTML report
yarn test:visual:report

# 3. If changes are intentional, update baselines
yarn test:visual:update

# 4. Run tests again to verify
yarn test:visual
```

### 3. Debugging Failed Tests

```bash
# 1. Run in debug mode to see what's happening
yarn test:visual:debug

# 2. Run with headed browser
npx playwright test --config=playwright.visual.config.ts --headed

# 3. Run specific test
npx playwright test --config=playwright.visual.config.ts --grep="test name"
```

### 4. Checking Specific Scenarios

```bash
# Test only dark mode
npx playwright test --config=playwright.visual.config.ts --grep="dark"

# Test only mobile viewports
npx playwright test --config=playwright.visual.config.ts --project=chrome-mobile

# Test only locale variations
npx playwright test --config=playwright.visual.config.ts --grep="locale"
```

## Test Structure

Each chart test covers:

- **Data Scenarios**
  - Normal data (multiple points)
  - Single data point
  - Empty data
  - Large datasets
  - Edge cases (negatives, zeros)

- **Viewports**
  - Desktop (1280x720)
  - Laptop (1024x768)
  - Tablet (768x1024)
  - Mobile (375x667)

- **Locales**
  - English (en)
  - Serbian Latin (sr-Latn)
  - Serbian Cyrillic (sr-Cyrl)

- **Themes**
  - Light mode
  - Dark mode

- **Interactions**
  - Tooltip display
  - Hover states

## File Locations

```
app/tests/visual/
├── __screenshots__/           # Baseline images
├── chart-test-utils.tsx       # Test utilities
├── line-chart.visual.test.tsx # LineChart tests
├── bar-chart.visual.test.tsx  # BarChart tests
├── column-chart.visual.test.tsx # ColumnChart tests
├── area-chart.visual.test.tsx # AreaChart tests
├── pie-chart.visual.test.tsx  # PieChart tests
├── README.md                  # Full documentation
└── QUICK_START.md             # This file
```

## Tips & Tricks

### Consistent Screenshots

Always disable animations and tooltips for baseline screenshots:

```typescript
await renderChart(page, "line", data, config, {
  animated: false,
  showTooltip: false,
});
```

### Descriptive Names

Use descriptive screenshot names for clarity:

```typescript
getScreenshotName("line", "normal", "desktop", "en", "light");
// => "line-normal-desktop-en-light"
```

### Wait for Stability

Always wait for chart rendering to complete:

```typescript
await waitForChartStability(page);
await expect(page).toHaveScreenshot(...);
```

### Test Isolation

Each test should be independent and not rely on other tests.

## CI Integration

Visual tests run automatically on:

- Pull requests to main/develop
- Pushes to main/develop
- Manual workflow dispatch

Results are:

- Uploaded as artifacts
- Commented on PRs
- Available in HTML report

## Troubleshooting

### Tests fail locally but pass in CI

- Check for environment-specific rendering
- Ensure consistent viewport sizes
- Verify animations are disabled

### Baselines don't match after update

- Review diff images in HTML report
- Check if changes are intentional
- Update baselines only for intentional changes

### Tests are flaky

- Increase wait time for stability
- Check for async rendering issues
- Ensure tests are independent

## Resources

- [Full Documentation](./README.md)
- [Playwright Docs](https://playwright.dev/)
- [Chart Components](../../exports/charts/)
