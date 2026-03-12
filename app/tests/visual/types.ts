/**
 * Type definitions for Visual Regression Testing
 *
 * This file provides TypeScript types and interfaces used throughout
 * the visual regression test suite.
 */

import type { Page } from "@playwright/test";

/**
 * Test configuration for rendering charts
 */
export interface ChartTestConfig {
  /** X-axis data key */
  xAxis: string;
  /** Y-axis data key(s) */
  yAxis: string | string[];
  /** Chart color (hex format) */
  color?: string;
  /** Chart title */
  title?: string;
  /** Series keys for multi-series charts */
  seriesKeys?: string[];
  /** Additional chart-specific options */
  [key: string]: any;
}

/**
 * Rendering options for chart tests
 */
export interface ChartRenderOptions {
  /** Disable animations for consistent screenshots */
  animated?: boolean;
  /** Show tooltip on hover */
  showTooltip?: boolean;
  /** Chart height in pixels */
  height?: number;
  /** Chart width (responsive by default) */
  width?: number | "100%";
  /** Locale for formatting */
  locale?: string;
  /** Chart title override */
  title?: string;
}

/**
 * Viewport configuration
 */
export interface ViewportConfig {
  width: number;
  height: number;
}

/**
 * Test scenario configuration
 */
export interface TestScenario {
  data: Record<string, string | number>[];
  config: ChartTestConfig;
}

/**
 * Screenshot configuration
 */
export interface ScreenshotOptions {
  /** Full page screenshot */
  fullPage?: boolean;
  /** Clip to specific region */
  clip?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  /** Maximum difference in pixels */
  maxDiffPixels?: number;
  /** Threshold for pixel difference (0-1) */
  threshold?: number;
}

/**
 * Test result summary
 */
export interface TestResults {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  failures: TestFailure[];
}

/**
 * Test failure details
 */
export interface TestFailure {
  test: string;
  expected: string;
  actual: string;
  diff: string;
  reason: string;
}

/**
 * Chart type supported by visual tests
 */
export type ChartType = "line" | "bar" | "column" | "area" | "pie";

/**
 * Viewport name for testing
 */
export type ViewportName =
  | "desktop"
  | "laptop"
  | "tablet"
  | "mobile"
  | "mobileLarge";

/**
 * Locale for testing
 */
export type TestLocale = "en" | "sr-Latn" | "sr-Cyrl";

/**
 * Theme for testing
 */
export type TestTheme = "light" | "dark";

/**
 * Test suite configuration
 */
export interface TestSuiteConfig {
  /** Chart types to test */
  charts: ChartType[];
  /** Viewports to test */
  viewports: ViewportName[];
  /** Locales to test */
  locales: TestLocale[];
  /** Themes to test */
  themes: TestTheme[];
  /** Whether to run interactive tests */
  includeInteractiveTests: boolean;
  /** Whether to run edge case tests */
  includeEdgeCases: boolean;
}

/**
 * Visual test context
 */
export interface VisualTestContext {
  /** Playwright page instance */
  page: Page;
  /** Current viewport */
  viewport: ViewportConfig;
  /** Current locale */
  locale: TestLocale;
  /** Current theme */
  theme: TestTheme;
  /** Current chart type */
  chartType: ChartType;
}

/**
 * Baseline comparison result
 */
export interface BaselineComparison {
  /** Whether images match */
  matches: boolean;
  /** Number of different pixels */
  diffPixels: number;
  /** Percentage difference */
  diffPercentage: number;
  /** Path to diff image */
  diffImage?: string;
  /** Path to actual image */
  actualImage: string;
  /** Path to baseline image */
  baselineImage: string;
}

/**
 * Test data fixture
 */
export interface TestDataFixture {
  name: string;
  data: Record<string, string | number>[];
  description?: string;
}

/**
 * Chart test scenario
 */
export interface ChartTestScenario {
  name: string;
  data: Record<string, string | number>[];
  config: ChartTestConfig;
  options?: ChartRenderOptions;
  description?: string;
}

/**
 * Visual test assertion options
 */
export interface VisualAssertionOptions {
  /** Maximum allowed different pixels */
  maxDiffPixels?: number;
  /** Threshold for pixel difference (0-1) */
  threshold?: number;
  /** Whether to create diff image */
  createDiff?: boolean;
  /** Custom comparison method */
  customDiffConfig?: {
    /** Comparison algorithm */
    algorithm?: "pixelmatch" | "ssim" | "mse";
    /** Color sensitivity */
    red?: number;
    green?: number;
    blue?: number;
    alpha?: number;
    /** Antialiasing sensitivity */
    antialiasing?: boolean;
  };
}

/**
 * Screenshot naming options
 */
export interface ScreenshotNamingOptions {
  chartType: ChartType;
  scenario: string;
  viewport: ViewportName;
  locale?: TestLocale;
  theme?: TestTheme;
  variant?: string;
}

/**
 * Test run configuration
 */
export interface TestRunConfig {
  /** Whether to update baselines */
  updateBaselines: boolean;
  /** Whether to run in headed mode */
  headed: boolean;
  /** Whether to run in debug mode */
  debug: boolean;
  /** Test timeout in milliseconds */
  timeout: number;
  /** Number of retries */
  retries: number;
  /** Worker count */
  workers: number;
}

/**
 * Extended Playwright assertions for visual testing
 */
export interface VisualAssertions {
  /** Assert screenshot matches baseline */
  toMatchScreenshot(
    name: string,
    options?: VisualAssertionOptions
  ): Promise<void>;

  /** Assert element screenshot matches baseline */
  toMatchElementScreenshot(
    selector: string,
    name: string,
    options?: VisualAssertionOptions
  ): Promise<void>;

  /** Assert page screenshot matches baseline */
  toMatchPageScreenshot(
    name: string,
    options?: VisualAssertionOptions
  ): Promise<void>;
}

/**
 * Visual test helpers
 */
export interface VisualTestHelpers {
  /** Render a chart component */
  renderChart(
    type: ChartType,
    data: Record<string, string | number>[],
    config: ChartTestConfig,
    options?: ChartRenderOptions
  ): Promise<void>;

  /** Take stable screenshot */
  takeStableScreenshot(
    name: string,
    options?: ScreenshotOptions
  ): Promise<void>;

  /** Compare with baseline */
  expectMatchesBaseline(
    name: string,
    options?: VisualAssertionOptions
  ): Promise<void>;

  /** Wait for chart stability */
  waitForStability(): Promise<void>;

  /** Set viewport */
  setViewport(viewport: ViewportConfig): Promise<void>;

  /** Set theme */
  setTheme(theme: TestTheme): Promise<void>;

  /** Set locale */
  setLocale(locale: TestLocale): Promise<void>;
}

/**
 * Module augmentations
 */
declare module "@playwright/test" {
  interface Matchers<R> {
    toMatchScreenshot(name: string, options?: VisualAssertionOptions): R;
    toMatchElementScreenshot(
      selector: string,
      name: string,
      options?: VisualAssertionOptions
    ): R;
    toMatchPageScreenshot(name: string, options?: VisualAssertionOptions): R;
  }
}

/**
 * Global test configuration
 */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      VISUAL_TESTING?: string;
      SCREENSHOT_DIR?: string;
      BASELINE_DIR?: string;
      DIFF_DIR?: string;
      UPDATE_BASELINES?: string;
    }
  }

  interface Window {
    testChartConfig?: {
      type: ChartType;
      data: Record<string, string | number>[];
      config: ChartTestConfig;
      options: ChartRenderOptions;
    };
  }
}

export {};
