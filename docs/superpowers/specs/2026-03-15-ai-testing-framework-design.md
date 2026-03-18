# AI-Enhanced Testing Framework Design

**Date:** 2026-03-15
**Status:** Approved

## Overview

Add AI-powered browser testing capabilities using Stagehand and fast scraping using Lightpanda, running in parallel with existing Playwright tests.

## Goals

1. **Improve test reliability** - Use AI-driven natural language selectors for dynamic/flaky UI elements
2. **Speed up data operations** - Use Lightpanda's direct API for fast page fetches and smoke tests
3. **Maintain stability** - Keep existing Playwright tests unchanged, add new capabilities incrementally

## Architecture

```
+-------------------------------------------------------------+
|                    Test Runner (npm scripts)                 |
+-------------------------------------------------------------+
|  test:e2e          |  test:ai           |  test:scrape      |
|  (Playwright)      |  (Stagehand)       |  (Lightpanda)     |
+--------------------+--------------------+-------------------+
|  tests/e2e/        |  tests/ai/         |  tests/scrape/    |
|  Chrome/Chromium   |  Chrome (CDP)      |  Direct API       |
+--------------------+--------------------+-------------------+
```

### Three Parallel Testing Tracks

1. **E2E (Playwright)** - Existing tests, unchanged for stability
2. **AI-driven (Stagehand)** - New tests with natural language selectors for complex/flaky flows
3. **Scraping (Lightpanda)** - Fast data fetch, snapshot capture, smoke tests

## Package Installation

### New Dependencies (devDependencies)

```bash
npm install -D @browserbasehq/stagehand
# @lightpanda/browser already installed
```

### New Configuration Files

```
tests/ai/stagehand.config.ts    - Stagehand settings
tests/scrape/lightpanda.ts      - Lightpanda helper utilities
```

### New npm Scripts

```json
{
  "test:ai": "stagehand test tests/ai/",
  "test:scrape": "tsx tests/scrape/",
  "test:all": "npm run test:e2e && npm run test:ai && npm run test:scrape"
}
```

### Environment Variables

Add to `.env.example`:

```
OPENAI_API_KEY=           # Required for Stagehand AI
BROWSERBASE_API_KEY=      # Optional: cloud browser (Browserbase)
```

## Stagehand Test Structure (AI-Driven)

### Directory Structure

```
tests/ai/
+-- stagehand.config.ts      # Stagehand configuration
+-- fixtures/
|   +-- test-helpers.ts      # Shared test utilities
+-- flows/
|   +-- create-chart.spec.ts # Chart creation flow with AI
|   +-- export-flow.spec.ts  # Export/embed flow
|   +-- search-browse.spec.ts# Search and browse flows
+-- assertions/
    +-- visual-checks.ts     # AI-powered visual assertions
```

### Test Pattern Example

```typescript
// tests/ai/flows/create-chart.spec.ts
import { Stagehand } from "@browserbasehq/stagehand";
import { z } from "zod";

test("create a bar chart from dataset", async () => {
  const stagehand = new Stagehand();
  await stagehand.init();

  await stagehand.page.goto("http://localhost:3001/sr-Latn/create");

  // AI-driven interaction - no fragile selectors
  await stagehand.act("select the first available dataset");
  await stagehand.act("choose bar chart type");
  await stagehand.act("click next to go to preview");

  // Extract structured data
  const result = await stagehand.extract(
    "get the chart title and data row count",
    z.object({ title: z.string(), rows: z.number() })
  );

  expect(result.title).toBeTruthy();
});
```

### Key Patterns

- `act()` - Natural language actions for dynamic content
- `extract()` - Structured data extraction for assertions
- `agent()` - Complex multi-step journeys

## Lightpanda Scraping Tests (Fast Data Fetch)

### Directory Structure

```
tests/scrape/
+-- lightpanda.ts           # Helper utilities
+-- snapshots/
|   +-- page-snapshots.ts   # Capture page HTML/JSON
+-- smoke/
|   +-- health-check.ts     # Quick app health tests
|   +-- data-fetch.ts       # Fast dataset retrieval
+-- benchmarks/
    +-- performance.ts      # Compare vs Chrome
```

### Helper Pattern

```typescript
// tests/scrape/lightpanda.ts
import { lightpanda } from "@lightpanda/browser";

export async function fetchPage(url: string) {
  return lightpanda.fetch(url, { dump: true });
}

export async function smokeTest(baseUrl: string) {
  const pages = [
    "/sr-Latn",
    "/sr-Latn/browse",
    "/sr-Latn/create"
  ];

  const results = await Promise.all(
    pages.map(p => fetchPage(`${baseUrl}${p}`))
  );

  return results.every(r => r.status === 200);
}
```

### Use Cases

- **Smoke tests** - Quick validation that pages load (no browser needed)
- **Data scraping** - Fetch dataset JSON for test fixtures
- **Performance benchmarks** - Compare fetch times vs Playwright
- **Snapshot capture** - Fast HTML capture for visual diff baselines

## Migration Strategy

### Phase 1: Setup (Day 1)

- Install `@browserbasehq/stagehand`
- Create directory structure and config files
- Add npm scripts
- Add environment variables to `.env.example`

### Phase 2: Pilot Stagehand Tests (Days 2-3)

- Identify 3-5 flaky/complex existing tests
- Create AI-driven equivalents in `tests/ai/`
- Compare reliability vs original Playwright tests

### Phase 3: Lightpanda Smoke Tests (Days 3-4)

- Create basic health checks using direct API
- Add to CI pipeline for fast feedback
- Benchmark performance vs Chrome

### Phase 4: Gradual Expansion (Ongoing)

- New complex flows → Stagehand
- New data/scrape needs → Lightpanda
- Existing tests → Migrate when selectors become fragile

**No breaking changes** - Existing Playwright tests remain untouched and continue running.

## Constraints

- Stagehand requires Playwright's browser automation (uses Chrome via CDP)
- Lightpanda direct API does not support CDP, so cannot be used with Stagehand
- Two separate browser systems run in parallel

## Success Criteria

1. Stagehand tests can handle dynamic UI changes without selector updates
2. Lightpanda smoke tests run 5x+ faster than Playwright equivalents
3. All three test tracks (e2e, ai, scrape) can run independently or together
4. No impact on existing Playwright test stability
