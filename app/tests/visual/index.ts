/**
 * Visual Regression Test Suite for Core Charts
 *
 * This file exports and aggregates all visual regression tests for the
 * core chart components. Each chart is tested across multiple scenarios
 * including different data sizes, viewports, locales, and themes.
 *
 * Charts covered:
 * - LineChart
 * - BarChart
 * - ColumnChart
 * - AreaChart
 * - PieChart
 */

// Re-export all test utilities
export * from "./chart-test-utils";

// Test files are automatically discovered by Playwright
// based on the pattern: **/*.visual.{test,spec}.{js,ts,jsx,tsx}
