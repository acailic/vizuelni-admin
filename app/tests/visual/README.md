# Visual Regression Testing for Core Charts

This directory contains visual regression tests for the core chart components in
vizualni-admin. The tests use Playwright to capture screenshots of chart
components and compare them against baseline images to detect visual
regressions.

## Overview

Visual regression tests ensure that chart components render correctly across:

- **Different scenarios**: Normal data, single point, empty data, edge cases
- **Different viewports**: Desktop, laptop, tablet, mobile
- **Different locales**: English (en), Serbian Latin (sr-Latn), Serbian Cyrillic
  (sr-Cyrl)
- **Different themes**: Light mode and dark mode
- **Interactive states**: Tooltips, hover effects

## Test Structure

```
app/tests/visual/
├── chart-test-utils.tsx          # Shared test utilities and fixtures
├── line-chart.visual.test.tsx    # LineChart visual tests
├── bar-chart.visual.test.tsx     # BarChart visual tests
├── column-chart.visual.test.tsx  # ColumnChart visual tests
├── area-chart.visual.test.tsx    # AreaChart visual tests
├── pie-chart.visual.test.tsx     # PieChart visual tests
├── global-setup.ts               # Global test setup
├── global-teardown.ts            # Global test teardown
└── README.md                     # This file
```

## Supported Charts

The visual regression suite covers the following core chart components:

1. **LineChart** - Line charts with optional area fill
2. **BarChart** - Horizontal bar charts
3. **ColumnChart** - Vertical bar charts
4. **AreaChart** - Area charts with stacking options
5. **PieChart** - Pie and donut charts

## Prerequisites

- Node.js (v18 or higher)
- Yarn package manager
- Playwright browsers installed

## Installation

```bash
# Install dependencies
yarn install

# Install Playwright browsers
npx playwright install
```

## First-Time Setup

**IMPORTANT**: Visual regression tests require baseline screenshots to compare
against. On a fresh checkout, you must generate baselines before running tests.

### Generate initial baselines

```bash
# Generate all baselines (required on first checkout)
yarn test:visual:baseline

# Or use the Playwright command directly
npx playwright test --config=playwright.visual.config.ts --update-snapshots
```

This will create baseline images in `app/tests/visual/__screenshots__/`.

### Verify tests pass after baseline generation

```bash
yarn test:visual
```

**Note**: Baseline images are tracked in git. After generating baselines, commit
them so CI and other developers have the reference images.

## Running Tests

### Run all visual tests

```bash
yarn test:visual
```

### Run specific chart tests

```bash
# Run only LineChart tests
npx playwright test --config=playwright.visual.config.ts line-chart

# Run only BarChart tests
npx playwright test --config=playwright.visual.config.ts bar-chart

# Run specific test file
npx playwright test --config=playwright.visual.config.ts app/tests/visual/line-chart.visual.test.tsx
```

### Run tests for specific viewport

```bash
# Run only mobile viewport tests
npx playwright test --config=playwright.visual.config.ts --project=chrome-mobile

# Run only desktop viewport tests
npx playwright test --config=playwright.visual.config.ts --project=chrome-desktop
```

### Run tests in debug mode

```bash
# Run with headed browser to see tests running
npx playwright test --config=playwright.visual.config.ts --headed

# Run with debug mode to step through tests
npx playwright test --config=playwright.visual.config.ts --debug
```

## Updating Baselines

When you make intentional changes to chart components that affect their
appearance, you'll need to update the baseline screenshots.

### Update all baselines

```bash
npx playwright test --config=playwright.visual.config.ts --update-snapshots
```

### Update specific chart baselines

```bash
# Update only LineChart baselines
npx playwright test --config=playwright.visual.config.ts line-chart --update-snapshots

# Update specific test baseline
npx playwright test --config=playwright.visual.config.ts app/tests/visual/line-chart.visual.test.tsx --update-snapshots
```

## Reviewing Test Results

### HTML Report

After running tests, view the HTML report:

```bash
npx playwright show-report playwright-visual-report
```

The HTML report includes:

- Screenshot comparisons (baseline vs. actual)
- Diff images highlighting differences
- Test execution details
- Failure information

### JSON Report

Results are also available in JSON format:

```bash
cat playwright-visual-results.json
```

### JUnit Report

For CI integration:

```bash
cat playwright-visual-results.xml
```

## Baseline Storage

Baseline screenshots are stored in:

```
app/tests/visual/
├── __screenshots__/
│   ├── line-chart-normal-desktop.png
│   ├── line-chart-multi-series-desktop.png
│   ├── bar-chart-normal-desktop.png
│   └── ...
```

**Important notes:**

- Baseline PNG files in the root of `__screenshots__/` are tracked in git
- Subdirectories inside `__screenshots__/` are ignored (for test artifacts)
- Tests will **fail** in CI without committed baselines
- Always commit baseline updates when making intentional visual changes

## Configuration

The visual test configuration is defined in `playwright.visual.config.ts`:

- **Test directory**: `./app/tests/visual`
- **Test pattern**: `**/*.visual.{test,spec}.{js,ts,jsx,tsx}`
- **Timeout**: 30 seconds per test
- **Retries**: 2 attempts
- **Reporters**: HTML, JSON, JUnit

### Projects (Configurations)

The test suite runs across multiple projects:

- `chrome-desktop` - Desktop viewport (1280x720)
- `chrome-mobile` - Mobile viewport (393x851)
- `chrome-tablet` - Tablet viewport (1024x1366)
- `firefox-desktop` - Firefox desktop
- `safari-desktop` - Safari desktop
- `chrome-desktop-dark` - Dark mode
- `chrome-desktop-high-contrast` - High contrast mode
- `chrome-desktop-rtl` - RTL layout

## Writing New Tests

To add a new visual test:

1. **Create test file** with `.visual.test.tsx` extension
2. **Import utilities** from `chart-test-utils.tsx`
3. **Use test.describe** to organize tests
4. **Set viewport** using `page.setViewportSize()`
5. **Render chart** using `renderChart()` helper
6. **Wait for stability** using `waitForChartStability()`
7. **Assert screenshot** using `expect(page).toHaveScreenshot()`

Example:

```typescript
import { test, expect } from "@playwright/test";
import {
  chartTestScenarios,
  getScreenshotName,
  renderChart,
  viewports,
  waitForChartStability,
} from "./chart-test-utils";

test.describe("MyChart Visual Regression", () => {
  test("should render correctly", async ({ page }) => {
    await page.setViewportSize(viewports.desktop);

    await renderChart(page, "line", testData, {
      xAxis: "category",
      yAxis: "value",
      animated: false,
      showTooltip: false,
    });

    await waitForChartStability(page);

    await expect(page).toHaveScreenshot(
      getScreenshotName("line", "normal", "desktop")
    );
  });
});
```

## Test Data Fixtures

Test data is available in `chart-test-utils.tsx`:

- `testDataFixtures.normal` - Standard multi-point data
- `testDataFixtures.singlePoint` - Single data point
- `testDataFixtures.empty` - Empty array
- `testDataFixtures.large` - Large dataset (50-100 points)
- `testDataFixtures.withNegatives` - Data with negative values
- `testDataFixtures.withZeros` - Data with zeros
- `testDataFixtures.timeSeries` - Time series data
- `testDataFixtures.pieData` - Pie chart categorical data

## CI Integration

### GitHub Actions

Visual tests run automatically on pull requests. Configuration is in
`.github/workflows/`:

```yaml
- name: Run visual tests
  run: yarn test:visual

- name: Upload visual test results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: visual-test-results
    path: playwright-visual-results/
```

### Failure Behavior

- Tests that fail due to visual differences will:
  1. Save the actual screenshot
  2. Generate a diff image
  3. Mark the test as failed in CI
  4. Create artifacts for review

## Best Practices

### 1. Disable Animations

Always disable animations for consistent screenshots:

```typescript
await renderChart(page, "line", data, config, {
  animated: false,
  showTooltip: false,
});
```

### 2. Wait for Stability

Use `waitForChartStability()` to ensure rendering is complete:

```typescript
await waitForChartStability(page);
await expect(page).toHaveScreenshot(...);
```

### 3. Descriptive Names

Use descriptive screenshot names:

```typescript
getScreenshotName("line", "normal", "desktop", "en", "light");
// => "line-normal-desktop-en-light"
```

### 4. Test Scenarios

Test all important scenarios:

- Normal data
- Edge cases (empty, single point, large datasets)
- Interactive states (tooltips, hover)
- Responsive breakpoints
- Localization
- Theming

### 5. Baseline Updates

When updating baselines:

1. Run tests locally first to review changes
2. Update baselines only for intentional changes
3. Commit new baselines with the code changes
4. Document visual changes in PR description

## Troubleshooting

### Tests are flaky

If tests fail intermittently:

1. Increase wait time for stability
2. Check for async rendering issues
3. Ensure animations are disabled
4. Verify consistent viewport sizes

### Baselines don't match

If baselines consistently fail:

1. Review the diff images to understand changes
2. Determine if changes are intentional or bugs
3. Update baselines if changes are intentional
4. Fix component if changes are unintentional

### Can't find test page

Ensure the test page exists:

```bash
app/pages/test/charts/[type].tsx
```

This page is required for rendering charts in tests.

### Port conflicts

If port 3000 is already in use:

```bash
# Kill existing process
lsof -ti:3000 | xargs kill

# Or use a different port
E2E_BASE_URL=http://localhost:3001 yarn test:visual
```

## Contributing

When adding new chart components:

1. Create visual test file following naming convention
2. Add test scenarios for all major use cases
3. Test across viewports, locales, and themes
4. Generate initial baselines
5. Update this README with new chart information

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Screenshot Testing](https://playwright.dev/docs/screenshots)
- [Chart Components](../../exports/charts/)
- [Test Utilities](./chart-test-utils.tsx)

## License

BSD-3-Clause - See project LICENSE file for details.
