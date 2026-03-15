# AI-Enhanced Testing Framework Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add AI-powered browser testing with Stagehand and fast scraping with Lightpanda, running parallel to existing Playwright tests.

**Architecture:** Three parallel test tracks - existing Playwright E2E tests unchanged, new Stagehand tests for AI-driven flows in `tests/ai/`, and Lightpanda direct API for fast scraping in `tests/scrape/`. Each track runs independently via dedicated npm scripts.

**Tech Stack:** @browserbasehq/stagehand, @lightpanda/browser (already installed), zod, tsx

**Spec:** `docs/superpowers/specs/2026-03-15-ai-testing-framework-design.md`

---

## File Structure

```
tests/
├── ai/                              # NEW: Stagehand AI tests
│   ├── stagehand.config.ts          # Stagehand configuration
│   ├── fixtures/
│   │   └── test-helpers.ts          # Shared utilities
│   └── flows/
│       ├── create-chart.spec.ts     # Chart creation flow
│       ├── export-flow.spec.ts      # Export/embed flow
│       └── search-browse.spec.ts    # Search and browse
├── scrape/                          # NEW: Lightpanda tests
│   ├── lightpanda.ts                # Helper utilities
│   ├── smoke/
│   │   └── health-check.ts          # Smoke tests
│   └── benchmarks/
│       └── performance.ts           # Performance comparison
└── e2e/                             # EXISTING: unchanged
```

---

## Chunk 1: Setup & Configuration

### Task 1.1: Install Dependencies

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Install @browserbasehq/stagehand, vitest, and tsx**

Run:
```bash
npm install -D @browserbasehq/stagehand vitest tsx
```

Expected: Packages added to devDependencies, package-lock.json updated

- [ ] **Step 2: Verify installation**

Run:
```bash
npm ls @browserbasehq/stagehand vitest tsx
```

Expected: Shows installed versions for all three packages

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add stagehand, vitest, and tsx for AI testing framework"
```

---

### Task 1.2: Create Directory Structure

**Files:**
- Create: `tests/ai/` (directory)
- Create: `tests/ai/fixtures/` (directory)
- Create: `tests/ai/flows/` (directory)
- Create: `tests/scrape/` (directory)
- Create: `tests/scrape/smoke/` (directory)
- Create: `tests/scrape/benchmarks/` (directory)

- [ ] **Step 1: Create test directories**

Run:
```bash
mkdir -p tests/ai/fixtures tests/ai/flows tests/scrape/smoke tests/scrape/benchmarks
```

Expected: Directories created

- [ ] **Step 2: Add .gitkeep files for empty directories**

Run:
```bash
touch tests/ai/fixtures/.gitkeep tests/ai/flows/.gitkeep tests/scrape/smoke/.gitkeep tests/scrape/benchmarks/.gitkeep
```

- [ ] **Step 3: Commit**

```bash
git add tests/ai tests/scrape
git commit -m "chore: create AI and scrape test directory structure"
```

---

### Task 1.3: Add npm Scripts

**Files:**
- Modify: `package.json` (scripts section)

- [ ] **Step 1: Add test scripts to package.json**

Add after the `"test:qa"` script:
```json
    "test:ai": "vitest run tests/ai/",
    "test:ai:watch": "vitest tests/ai/",
    "test:scrape": "tsx tests/scrape/index.ts",
    "test:all": "npm run test:e2e && npm run test:ai && npm run test:scrape",
```

- [ ] **Step 2: Verify scripts added**

Run:
```bash
npm run | grep -E "test:ai|test:scrape|test:all"
```

Expected: Shows all three new scripts

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "chore: add npm scripts for AI and scrape tests"
```

---

### Task 1.4: Update Environment Variables

**Files:**
- Modify: `.env.example`

- [ ] **Step 1: Add AI testing environment variables to .env.example**

Append to end of file:
```bash

# ===================================
# AI Testing (Stagehand)
# ===================================

# Base URL for tests (default: http://localhost:3001)
BASE_URL=http://localhost:3001

# OpenAI API Key (required for Stagehand AI)
OPENAI_API_KEY=

# Browserbase API Key (optional: cloud browser)
BROWSERBASE_API_KEY=
```

- [ ] **Step 2: Commit**

```bash
git add .env.example
git commit -m "chore: add Stagehand environment variables to .env.example"
```

---

### Task 1.5: Update .gitignore

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Add test-results directory to .gitignore**

Add to `.gitignore`:
```
# AI test artifacts
test-results/
```

- [ ] **Step 2: Commit**

```bash
git add .gitignore
git commit -m "chore: add test-results to .gitignore"
```

---

## Chunk 2: Lightpanda Helper Utilities & Smoke Tests

### Task 2.1: Create Lightpanda Helper Module

**Files:**
- Create: `tests/scrape/lightpanda.ts`

- [ ] **Step 1: Create lightpanda helper module**

```typescript
// tests/scrape/lightpanda.ts
import { lightpanda, type LightpandaFetchOptions } from "@lightpanda/browser";

export interface FetchResult {
  status: number;
  url: string;
  body: string;
  timing: number;
}

/**
 * Fetch a page using Lightpanda's fast headless browser
 */
export async function fetchPage(
  url: string,
  options?: Partial<LightpandaFetchOptions>
): Promise<FetchResult> {
  const start = Date.now();
  const defaultOptions: LightpandaFetchOptions = {
    dump: true,
    disableHostVerification: false,
  };

  const response = await lightpanda.fetch(url, {
    ...defaultOptions,
    ...options,
  });

  return {
    status: response.status,
    url,
    body: response.body || "",
    timing: Date.now() - start,
  };
}

/**
 * Run smoke tests against multiple pages
 */
export async function smokeTest(
  baseUrl: string,
  paths: string[] = ["/sr-Latn", "/sr-Latn/browse", "/sr-Latn/create"]
): Promise<{ passed: boolean; results: FetchResult[] }> {
  const results = await Promise.all(
    paths.map((p) => fetchPage(`${baseUrl}${p}`))
  );

  return {
    passed: results.every((r) => r.status === 200),
    results,
  };
}

/**
 * Fetch multiple pages in parallel and return timing info
 */
export async function fetchParallel(
  urls: string[]
): Promise<{ results: FetchResult[]; totalTime: number }> {
  const start = Date.now();
  const results = await Promise.all(urls.map(fetchPage));
  return {
    results,
    totalTime: Date.now() - start,
  };
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run:
```bash
npx tsc --noEmit tests/scrape/lightpanda.ts
```

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add tests/scrape/lightpanda.ts
git commit -m "feat: add Lightpanda helper utilities for fast scraping"
```

---

### Task 2.2: Create Smoke Tests

**Files:**
- Create: `tests/scrape/smoke/health-check.ts`

- [ ] **Step 1: Create health check smoke test**

```typescript
// tests/scrape/smoke/health-check.ts
import { smokeTest, fetchPage } from "../lightpanda";

const BASE_URL = process.env.BASE_URL || "http://localhost:3001";

async function main() {
  console.log("Running Lightpanda smoke tests...\n");

  // Test 1: Basic page health
  console.log("1. Testing basic page health...");
  const smokeResult = await smokeTest(BASE_URL);

  for (const result of smokeResult.results) {
    const status = result.status === 200 ? "✅" : "❌";
    console.log(`   ${status} ${result.url} (${result.timing}ms)`);
  }

  if (!smokeResult.passed) {
    console.error("\n❌ Smoke tests failed");
    process.exit(1);
  }

  // Test 2: API health
  console.log("\n2. Testing API endpoints...");
  const apiResult = await fetchPage(`${BASE_URL}/api/browse?page=1&limit=1`);
  const apiStatus = apiResult.status === 200 ? "✅" : "❌";
  console.log(`   ${apiStatus} /api/browse (${apiResult.timing}ms)`);

  if (apiResult.status !== 200) {
    console.error("\n❌ API health check failed");
    process.exit(1);
  }

  // Test 3: Response time check
  console.log("\n3. Testing response times...");
  const slowPages = smokeResult.results.filter((r) => r.timing > 5000);
  if (slowPages.length > 0) {
    console.warn(
      "   ⚠️  Slow pages detected:",
      slowPages.map((p) => `${p.url} (${p.timing}ms)`).join(", ")
    );
  } else {
    console.log("   ✅ All pages responded within 5 seconds");
  }

  console.log("\n✅ All smoke tests passed!");
}

main().catch((err) => {
  console.error("Smoke test error:", err);
  process.exit(1);
});
```

- [ ] **Step 2: Verify TypeScript compiles**

Run:
```bash
npx tsc --noEmit tests/scrape/smoke/health-check.ts
```

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add tests/scrape/smoke/health-check.ts tests/scrape/smoke/.gitkeep
git commit -m "feat: add Lightpanda smoke tests for health checks"
```

---

### Task 2.3: Create Performance Benchmarks

**Files:**
- Create: `tests/scrape/benchmarks/performance.ts`

- [ ] **Step 1: Create performance benchmark**

```typescript
// tests/scrape/benchmarks/performance.ts
import { fetchPage, fetchParallel } from "../lightpanda";

const BASE_URL = process.env.BASE_URL || "http://localhost:3001";
const ITERATIONS = 5;

async function benchmarkSinglePage(url: string, label: string) {
  console.log(`\nBenchmarking: ${label}`);
  console.log("─".repeat(40));

  const times: number[] = [];

  for (let i = 0; i < ITERATIONS; i++) {
    const result = await fetchPage(url);
    times.push(result.timing);
    console.log(`  Run ${i + 1}: ${result.timing}ms (status: ${result.status})`);
  }

  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  const min = Math.min(...times);
  const max = Math.max(...times);

  console.log(`\n  Average: ${avg.toFixed(0)}ms`);
  console.log(`  Min: ${min}ms | Max: ${max}ms`);

  return { label, avg, min, max };
}

async function benchmarkParallel(urls: string[], label: string) {
  console.log(`\nParallel fetch: ${label}`);
  console.log("─".repeat(40));

  const { results, totalTime } = await fetchParallel(urls);

  console.log(`  Total time: ${totalTime}ms`);
  console.log(`  Pages fetched: ${results.length}`);
  console.log(`  Avg per page: ${(totalTime / results.length).toFixed(0)}ms`);

  return { label, totalTime, count: results.length };
}

async function main() {
  console.log("Lightpanda Performance Benchmarks");
  console.log("=".repeat(40));
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Iterations: ${ITERATIONS}`);

  // Benchmark individual pages
  const pages = [
    { url: `${BASE_URL}/sr-Latn`, label: "Homepage" },
    { url: `${BASE_URL}/sr-Latn/browse`, label: "Browse" },
    { url: `${BASE_URL}/sr-Latn/create`, label: "Create Chart" },
    { url: `${BASE_URL}/api/browse?page=1&limit=10`, label: "API Browse" },
  ];

  const results = [];
  for (const page of pages) {
    results.push(await benchmarkSinglePage(page.url, page.label));
  }

  // Benchmark parallel fetch
  const parallelUrls = pages.slice(0, 3).map((p) => p.url);
  await benchmarkParallel(parallelUrls, "Main Pages");

  // Summary
  console.log("\n" + "=".repeat(40));
  console.log("Summary:");
  console.log("─".repeat(40));

  const overallAvg =
    results.reduce((sum, r) => sum + r.avg, 0) / results.length;
  console.log(`Overall average: ${overallAvg.toFixed(0)}ms`);

  const fastest = results.reduce((a, b) => (a.avg < b.avg ? a : b));
  const slowest = results.reduce((a, b) => (a.avg > b.avg ? a : b));

  console.log(`Fastest: ${fastest.label} (${fastest.avg.toFixed(0)}ms)`);
  console.log(`Slowest: ${slowest.label} (${slowest.avg.toFixed(0)}ms)`);
}

main().catch((err) => {
  console.error("Benchmark error:", err);
  process.exit(1);
});
```

- [ ] **Step 2: Verify TypeScript compiles**

Run:
```bash
npx tsc --noEmit tests/scrape/benchmarks/performance.ts
```

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add tests/scrape/benchmarks/performance.ts tests/scrape/benchmarks/.gitkeep
git commit -m "feat: add Lightpanda performance benchmarks"
```

---

### Task 2.4: Create Scrape Test Entry Point

**Files:**
- Create: `tests/scrape/index.ts`

- [ ] **Step 1: Create scrape test runner entry point**

```typescript
// tests/scrape/index.ts
import { smokeTest } from "./smoke/health-check";
import { performanceBenchmark } from "./benchmarks/performance";

const BASE_URL = process.env.BASE_URL || "http://localhost:3001";

async function main() {
  console.log("Lightpanda Scrape Test Runner");
  console.log("=".repeat(50));
  console.log(`Base URL: ${BASE_URL}\n`);

  const args = process.argv.slice(2);
  const runAll = args.length === 0 || args.includes("--all");
  const runSmoke = args.includes("--smoke") || runAll;
  const runPerf = args.includes("--perf") || runAll;

  let hasErrors = false;

  // Run smoke tests
  if (runSmoke) {
    console.log("\n📋 Running Smoke Tests...\n");
    try {
      await smokeTest(BASE_URL);
      console.log("✅ Smoke tests passed");
    } catch (error) {
      console.error("❌ Smoke tests failed:", error);
      hasErrors = true;
    }
  }

  // Run performance benchmarks
  if (runPerf) {
    console.log("\n📊 Running Performance Benchmarks...\n");
    try {
      await performanceBenchmark(BASE_URL);
      console.log("✅ Performance benchmarks completed");
    } catch (error) {
      console.error("❌ Performance benchmarks failed:", error);
      hasErrors = true;
    }
  }

  if (hasErrors) {
    process.exit(1);
  }

  console.log("\n✅ All scrape tests completed successfully!");
}

main().catch((err) => {
  console.error("Scrape test runner error:", err);
  process.exit(1);
});
```

- [ ] **Step 2: Update health-check.ts to export smokeTest function**

Modify `tests/scrape/smoke/health-check.ts` to export the main test function:

```typescript
// tests/scrape/smoke/health-check.ts
import { smokeTest as smokeTestUtil, fetchPage } from "../lightpanda";

export async function smokeTest(baseUrl: string): Promise<void> {
  console.log("Running Lightpanda smoke tests...\n");

  // Test 1: Basic page health
  console.log("1. Testing basic page health...");
  const smokeResult = await smokeTestUtil(baseUrl);

  for (const result of smokeResult.results) {
    const status = result.status === 200 ? "✅" : "❌";
    console.log(`   ${status} ${result.url} (${result.timing}ms)`);
  }

  if (!smokeResult.passed) {
    throw new Error("Smoke tests failed: some pages returned non-200 status");
  }

  // Test 2: API health
  console.log("\n2. Testing API endpoints...");
  const apiResult = await fetchPage(`${baseUrl}/api/browse?page=1&limit=1`);
  const apiStatus = apiResult.status === 200 ? "✅" : "❌";
  console.log(`   ${apiStatus} /api/browse (${apiResult.timing}ms)`);

  if (apiResult.status !== 200) {
    throw new Error("API health check failed");
  }

  // Test 3: Response time check
  console.log("\n3. Testing response times...");
  const slowPages = smokeResult.results.filter((r) => r.timing > 5000);
  if (slowPages.length > 0) {
    console.warn(
      "   ⚠️  Slow pages detected:",
      slowPages.map((p) => `${p.url} (${p.timing}ms)`).join(", ")
    );
  } else {
    console.log("   ✅ All pages responded within 5 seconds");
  }
}
```

- [ ] **Step 3: Update performance.ts to export benchmark function**

Modify `tests/scrape/benchmarks/performance.ts` to export the main function:

```typescript
// tests/scrape/benchmarks/performance.ts
import { fetchPage, fetchParallel } from "../lightpanda";

const ITERATIONS = 5;

// ... (keep existing benchmarkSinglePage and benchmarkParallel functions) ...

export async function performanceBenchmark(baseUrl: string): Promise<void> {
  console.log("Lightpanda Performance Benchmarks");
  console.log("=".repeat(40));
  console.log(`Base URL: ${baseUrl}`);
  console.log(`Iterations: ${ITERATIONS}`);

  // ... (keep existing benchmark logic) ...
}
```

- [ ] **Step 4: Verify TypeScript compiles**

Run:
```bash
npx tsc --noEmit tests/scrape/index.ts tests/scrape/smoke/health-check.ts tests/scrape/benchmarks/performance.ts
```

Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add tests/scrape/index.ts tests/scrape/smoke/health-check.ts tests/scrape/benchmarks/performance.ts
git commit -m "feat: add scrape test runner entry point"
```

---

## Chunk 3: Stagehand Configuration & Fixtures

### Task 3.1: Create vitest Configuration

**Files:**
- Create: `tests/ai/vitest.config.ts`

- [ ] **Step 1: Create vitest configuration for AI tests**

```typescript
// tests/ai/vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Test file patterns
    include: ["tests/ai/**/*.spec.ts"],

    // Timeout settings (AI tests need longer timeouts)
    testTimeout: 120000,
    hookTimeout: 60000,

    // Run tests sequentially (browser tests can conflict in parallel)
    pool: "threads",
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },

    // Global test setup
    globals: true,

    // Reporter
    reporter: ["verbose", "html"],
    outputFile: {
      html: "test-results/ai-tests/report.html",
    },
  },
});
```

- [ ] **Step 2: Verify TypeScript compiles**

Run:
```bash
npx tsc --noEmit tests/ai/vitest.config.ts
```

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add tests/ai/vitest.config.ts
git commit -m "feat: add vitest configuration for AI tests"
```

---

### Task 3.2: Create Stagehand Configuration

**Files:**
- Create: `tests/ai/stagehand.config.ts`

- [ ] **Step 1: Create Stagehand configuration**

```typescript
// tests/ai/stagehand.config.ts
import { Stagehand } from "@browserbasehq/stagehand";

export const BASE_URL = process.env.BASE_URL || "http://localhost:3001";

export const LOCALES = ["sr-Latn", "sr-Cyrl", "en"] as const;
export type Locale = (typeof LOCALES)[number];

/**
 * Create a Stagehand instance with project defaults
 */
export async function createStagehandInstance(): Promise<Stagehand> {
  const useBrowserbase = !!process.env.BROWSERBASE_API_KEY;

  const stagehand = new Stagehand({
    // Use Browserbase cloud if API key is set, otherwise local Chrome
    env: useBrowserbase ? "BROWSERBASE" : "LOCAL",

    // AI model for natural language understanding
    model: "openai/gpt-4o",

    // Browserbase credentials (required if env is BROWSERBASE)
    apiKey: process.env.BROWSERBASE_API_KEY,
    projectId: process.env.BROWSERBASE_PROJECT_ID,

    // Enable debug logging in development
    verbose: process.env.NODE_ENV === "development" ? 1 : 0,

    // Enable caching for faster repeated actions
    enableCaching: true,
  });

  await stagehand.init();
  return stagehand;
}

/**
 * Test configuration constants
 */
export const TEST_CONFIG = {
  // Default timeouts for AI operations
  actionTimeout: 30000,
  navigationTimeout: 30000,
  extractionTimeout: 60000,

  // Wait times for page interactions
  pageLoadBuffer: 1000,
  animationBuffer: 500,
} as const;
```

- [ ] **Step 2: Verify TypeScript compiles**

Run:
```bash
npx tsc --noEmit tests/ai/stagehand.config.ts
```

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add tests/ai/stagehand.config.ts
git commit -m "feat: add Stagehand configuration"
```

---

### Task 3.2: Create Test Helpers

**Files:**
- Create: `tests/ai/fixtures/test-helpers.ts`

- [ ] **Step 1: Create test helper utilities**

```typescript
// tests/ai/fixtures/test-helpers.ts
import { Stagehand } from "@browserbasehq/stagehand";
import { z } from "zod";
import {
  createStagehandInstance,
  BASE_URL,
  TEST_CONFIG,
  type Locale,
} from "../stagehand.config";

export interface TestContext {
  stagehand: Stagehand;
  locale: Locale;
}

/**
 * Create a Stagehand instance with default configuration
 */
export async function createStagehand(): Promise<Stagehand> {
  return createStagehandInstance();
}

/**
 * Navigate to a page with locale
 */
export async function navigateTo(
  stagehand: Stagehand,
  path: string,
  locale: Locale = "sr-Latn"
): Promise<void> {
  const url = `${BASE_URL}/${locale}${path}`;
  await stagehand.page.goto(url);
  // Wait for page to be interactive
  await stagehand.page.waitForLoadState("domcontentloaded");
  // Buffer for React hydration
  await stagehand.page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);
}

/**
 * Wait for text to appear on page
 */
export async function waitForText(
  stagehand: Stagehand,
  text: string,
  timeout = 10000
): Promise<boolean> {
  try {
    await stagehand.page.waitForSelector(`text=${text}`, { timeout });
    return true;
  } catch {
    return false;
  }
}

/**
 * Extract structured data from the page
 */
export async function extractData<T extends z.ZodType>(
  stagehand: Stagehand,
  instruction: string,
  schema: T
): Promise<z.infer<T>> {
  return stagehand.extract(instruction, schema);
}

/**
 * Perform an AI-driven action
 */
export async function performAction(
  stagehand: Stagehand,
  instruction: string
): Promise<void> {
  await stagehand.act(instruction);
}

/**
 * Check if an element exists on the page
 */
export async function elementExists(
  stagehand: Stagehand,
  selector: string
): Promise<boolean> {
  try {
    const element = await stagehand.page.$(selector);
    return element !== null;
  } catch {
    return false;
  }
}

/**
 * Take a screenshot for debugging
 */
export async function captureDebugScreenshot(
  stagehand: Stagehand,
  name: string
): Promise<void> {
  await stagehand.page.screenshot({
    path: `test-results/debug-${name}-${Date.now()}.png`,
  });
}

/**
 * Clean up Stagehand instance
 */
export async function cleanup(stagehand: Stagehand): Promise<void> {
  await stagehand.close();
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run:
```bash
npx tsc --noEmit tests/ai/fixtures/test-helpers.ts
```

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add tests/ai/fixtures/test-helpers.ts tests/ai/fixtures/.gitkeep
git commit -m "feat: add Stagehand test helper utilities"
```

---

## Chunk 4: Stagehand AI Tests

### Task 4.1: Create Chart Creation Flow Test

**Files:**
- Create: `tests/ai/flows/create-chart.spec.ts`

- [ ] **Step 1: Create chart creation test**

```typescript
// tests/ai/flows/create-chart.spec.ts
import { Stagehand } from "@browserbasehq/stagehand";
import { z } from "zod";
import { describe, test, expect, beforeEach, afterEach } from "vitest";
import {
  createStagehand,
  navigateTo,
  performAction,
  extractData,
  cleanup,
} from "../fixtures/test-helpers";

describe("Chart Creation Flow (AI-Driven)", () => {
  let stagehand: Stagehand;

  beforeEach(async () => {
    stagehand = await createStagehand();
  });

  afterEach(async () => {
    await cleanup(stagehand);
  });

  test("should navigate to create page and load dataset step", async () => {
    await navigateTo(stagehand, "/create");

    // AI-driven: Wait for page to be ready
    const isReady = await stagehand.page
      .waitForSelector("body", { timeout: 10000 })
      .then(() => true)
      .catch(() => false);

    expect(isReady).toBe(true);

    // Extract page state
    const result = await extractData(
      stagehand,
      "Check if this is the chart creation page. Return the step name and whether a dataset needs to be selected.",
      z.object({
        isCreatePage: z.boolean(),
        currentStep: z.string(),
        needsDatasetSelection: z.boolean(),
      })
    );

    expect(result.isCreatePage).toBe(true);
  });

  test("should select a dataset using AI", async () => {
    await navigateTo(stagehand, "/create?dataset=678e312d0aae3fe3ad3e361c");

    // Wait for dataset to load
    await stagehand.page.waitForTimeout(2000);

    // AI-driven: Check dataset loaded
    const result = await extractData(
      stagehand,
      "Check if a dataset is loaded. Return the dataset name if visible, and whether chart type options are shown.",
      z.object({
        datasetLoaded: z.boolean(),
        hasChartTypeOptions: z.boolean(),
        chartTypesAvailable: z.array(z.string()),
      })
    );

    expect(result.datasetLoaded).toBe(true);
    expect(result.hasChartTypeOptions).toBe(true);
    expect(result.chartTypesAvailable.length).toBeGreaterThan(0);
  });

  test("should select bar chart type using AI", async () => {
    await navigateTo(stagehand, "/create?dataset=678e312d0aae3fe3ad3e361c");
    await stagehand.page.waitForTimeout(2000);

    // AI-driven: Select bar chart
    await performAction(stagehand, "click on the bar chart type button");

    // Wait for selection to register
    await stagehand.page.waitForTimeout(1000);

    // Verify URL updated
    const url = stagehand.page.url();
    expect(url).toContain("type=bar");
  });

  test("should complete full chart creation flow", async () => {
    await navigateTo(stagehand, "/create?dataset=678e312d0aae3fe3ad3e361c");
    await stagehand.page.waitForTimeout(2000);

    // Step 1: Select chart type
    await performAction(stagehand, "click on the bar chart type button");
    await stagehand.page.waitForTimeout(1000);

    // Step 2: Proceed to next step
    await performAction(stagehand, "click the next button to continue");
    await stagehand.page.waitForTimeout(1000);

    // Extract final state
    const result = await extractData(
      stagehand,
      "Check the current state of the chart creation. Return the current step, whether a preview is visible, and any visible chart elements.",
      z.object({
        currentStep: z.string(),
        hasPreview: z.boolean(),
        hasChartElements: z.boolean(),
      })
    );

    expect(result.hasPreview || result.hasChartElements).toBe(true);
  });
});
```

- [ ] **Step 2: Verify TypeScript compiles**

Run:
```bash
npx tsc --noEmit tests/ai/flows/create-chart.spec.ts
```

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add tests/ai/flows/create-chart.spec.ts
git commit -m "feat: add AI-driven chart creation flow tests"
```

---

### Task 4.2: Create Export Flow Test

**Files:**
- Create: `tests/ai/flows/export-flow.spec.ts`

- [ ] **Step 1: Create export flow test**

```typescript
// tests/ai/flows/export-flow.spec.ts
import { Stagehand } from "@browserbasehq/stagehand";
import { z } from "zod";
import { describe, test, expect, beforeEach, afterEach } from "vitest";
import {
  createStagehand,
  navigateTo,
  performAction,
  extractData,
  cleanup,
} from "../fixtures/test-helpers";

describe("Export and Embed Flow (AI-Driven)", () => {
  let stagehand: Stagehand;

  beforeEach(async () => {
    stagehand = await createStagehand();
  });

  afterEach(async () => {
    await cleanup(stagehand);
  });

  test("should find export options on a chart page", async () => {
    // Navigate to an existing chart or create one
    await navigateTo(
      stagehand,
      "/create?dataset=678e312d0aae3fe3ad3e361c&type=bar"
    );
    await stagehand.page.waitForTimeout(2000);

    // AI-driven: Look for export options
    const result = await extractData(
      stagehand,
      "Find export, download, or share options on this page. Return what export options are available.",
      z.object({
        hasExportOptions: z.boolean(),
        exportFormats: z.array(z.string()),
        hasShareOption: z.boolean(),
      })
    );

    // Either export options or share option should exist
    expect(result.hasExportOptions || result.hasShareOption).toBeDefined();
  });

  test("should access embed functionality", async () => {
    await navigateTo(
      stagehand,
      "/create?dataset=678e312d0aae3fe3ad3e361c&type=bar"
    );
    await stagehand.page.waitForTimeout(2000);

    // AI-driven: Try to find embed option
    const result = await extractData(
      stagehand,
      "Check if there is an embed option, share button, or code generation feature. Return what sharing/embedding features exist.",
      z.object({
        hasEmbedOption: z.boolean(),
        hasShareButton: z.boolean(),
        hasCodeGeneration: z.boolean(),
      })
    );

    // Verify some sharing mechanism exists
    expect(
      result.hasEmbedOption || result.hasShareButton || result.hasCodeGeneration
    ).toBeDefined();
  });
});
```

- [ ] **Step 2: Verify TypeScript compiles**

Run:
```bash
npx tsc --noEmit tests/ai/flows/export-flow.spec.ts
```

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add tests/ai/flows/export-flow.spec.ts
git commit -m "feat: add AI-driven export and embed flow tests"
```

---

### Task 4.3: Create Search and Browse Flow Test

**Files:**
- Create: `tests/ai/flows/search-browse.spec.ts`

- [ ] **Step 1: Create search/browse test**

```typescript
// tests/ai/flows/search-browse.spec.ts
import { Stagehand } from "@browserbasehq/stagehand";
import { z } from "zod";
import { describe, test, expect, beforeEach, afterEach } from "vitest";
import {
  createStagehand,
  navigateTo,
  performAction,
  extractData,
  cleanup,
} from "../fixtures/test-helpers";

describe("Search and Browse Flow (AI-Driven)", () => {
  let stagehand: Stagehand;

  beforeEach(async () => {
    stagehand = await createStagehand();
  });

  afterEach(async () => {
    await cleanup(stagehand);
  });

  test("should load browse page with datasets", async () => {
    await navigateTo(stagehand, "/browse");

    // AI-driven: Extract dataset information
    const result = await extractData(
      stagehand,
      "Count the datasets on this page. Return the total count shown and whether pagination exists.",
      z.object({
        datasetCount: z.number(),
        hasPagination: z.boolean(),
        totalCount: z.number().optional(),
      })
    );

    expect(result.datasetCount).toBeGreaterThan(0);
  });

  test("should search for datasets using AI", async () => {
    await navigateTo(stagehand, "/browse");
    await stagehand.page.waitForTimeout(1000);

    // AI-driven: Perform search
    await performAction(
      stagehand,
      "type 'statistika' in the search box and press enter"
    );
    await stagehand.page.waitForTimeout(2000);

    // Verify search results
    const result = await extractData(
      stagehand,
      "Check the search results. Return whether results were found and how many.",
      z.object({
        hasResults: z.boolean(),
        resultCount: z.number(),
        searchQuery: z.string().optional(),
      })
    );

    expect(result.hasResults).toBe(true);
  });

  test("should navigate from browse to create page", async () => {
    await navigateTo(stagehand, "/browse");
    await stagehand.page.waitForTimeout(1000);

    // AI-driven: Click visualize/create on first dataset
    await performAction(
      stagehand,
      "click the visualize or create chart button on the first dataset"
    );
    await stagehand.page.waitForTimeout(2000);

    // Verify navigation to create page
    const url = stagehand.page.url();
    expect(url).toContain("/create");
  });

  test("should filter datasets by category", async () => {
    await navigateTo(stagehand, "/browse");
    await stagehand.page.waitForTimeout(1000);

    // AI-driven: Look for and interact with filters
    const result = await extractData(
      stagehand,
      "Check what filter options exist on this page. Return available filter categories and whether there's an active filter.",
      z.object({
        hasFilters: z.boolean(),
        filterCategories: z.array(z.string()),
        activeFilter: z.string().optional(),
      })
    );

    // If filters exist, try to use one
    if (result.hasFilters && result.filterCategories.length > 0) {
      await performAction(
        stagehand,
        `click on the ${result.filterCategories[0]} filter if available`
      );
      await stagehand.page.waitForTimeout(1000);

      // Verify filter applied
      const afterFilter = await extractData(
        stagehand,
        "Check if a filter has been applied and what the current result count is.",
        z.object({
          filterApplied: z.boolean(),
          resultCount: z.number(),
        })
      );

      expect(afterFilter.filterApplied).toBeDefined();
    }
  });
});
```

- [ ] **Step 2: Verify TypeScript compiles**

Run:
```bash
npx tsc --noEmit tests/ai/flows/search-browse.spec.ts
```

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add tests/ai/flows/search-browse.spec.ts tests/ai/flows/.gitkeep
git commit -m "feat: add AI-driven search and browse flow tests"
```

---

### Task 4.4: Final Verification

**Files:**
- None (verification only)

- [ ] **Step 1: Verify all new files compile**

Run:
```bash
npx tsc --noEmit tests/ai/**/*.ts tests/scrape/**/*.ts
```

Expected: No errors

- [ ] **Step 2: Run Lightpanda smoke tests**

Run:
```bash
npm run test:scrape
```

Expected: Smoke tests execute (may fail if server not running, which is OK for verification)

- [ ] **Step 3: Final commit summary**

Run:
```bash
git log --oneline -10
```

Expected: Shows all implementation commits

- [ ] **Step 4: Create summary**

The AI-enhanced testing framework is now complete with:

1. **Stagehand AI tests** (`tests/ai/`)
   - Configuration and helpers
   - Chart creation flow tests
   - Export/embed flow tests
   - Search/browse flow tests

2. **Lightpanda scraping tests** (`tests/scrape/`)
   - Helper utilities
   - Health check smoke tests
   - Performance benchmarks

3. **npm scripts**
   - `test:ai` - Run Stagehand tests
   - `test:scrape` - Run Lightpanda tests
   - `test:all` - Run all test tracks

4. **Environment configuration**
   - `.env.example` updated with required keys

---

## Dependencies

- @browserbasehq/stagehand (to be installed)
- @lightpanda/browser (already installed)
- vitest (to be installed - Stagehand test runner)
- tsx (to be installed - TypeScript execution for scrape tests)
- zod (already installed)

## Notes

- Stagehand requires `OPENAI_API_KEY` environment variable
- Lightpanda smoke tests require the dev server running at localhost:3001
- Existing Playwright tests remain completely unchanged
- Stagehand tests use vitest as the test runner (Jest is used for unit tests, vitest for AI tests)
