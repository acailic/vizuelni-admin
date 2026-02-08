/**
 * Visual Regression Test Utilities for Charts
 *
 * Provides helper functions and fixtures for testing chart components
 * with visual regression across different scenarios and configurations.
 */

import { Page, expect } from "@playwright/test";

// Import chart components

import type { ChartData } from "@/exports/charts/types";

/**
 * Test data fixtures for different scenarios
 */
export const testDataFixtures = {
  // Normal data with multiple points
  normal: [
    { category: "Jan", value: 100, value2: 80 },
    { category: "Feb", value: 120, value2: 95 },
    { category: "Mar", value: 115, value2: 110 },
    { category: "Apr", value: 134, value2: 125 },
    { category: "May", value: 168, value2: 140 },
    { category: "Jun", value: 175, value2: 155 },
  ],

  // Single data point
  singlePoint: [{ category: "Jan", value: 100 }],

  // Empty data
  empty: [],

  // Large dataset
  large: Array.from({ length: 50 }, (_, i) => ({
    category: `Month ${i + 1}`,
    value: 50 + ((i * 37) % 200),
    value2: 50 + ((i * 53) % 200),
  })),

  // Data with negative values
  withNegatives: [
    { category: "Jan", value: 100 },
    { category: "Feb", value: -50 },
    { category: "Mar", value: 75 },
    { category: "Apr", value: -25 },
    { category: "May", value: 120 },
  ],

  // Data with zeros
  withZeros: [
    { category: "Jan", value: 100 },
    { category: "Feb", value: 0 },
    { category: "Mar", value: 120 },
    { category: "Apr", value: 0 },
    { category: "May", value: 85 },
  ],

  // Time series data
  timeSeries: [
    { year: "2019", value: 100 },
    { year: "2020", value: 120 },
    { year: "2021", value: 115 },
    { year: "2022", value: 140 },
    { year: "2023", value: 168 },
  ],

  // Pie chart data with categories
  pieData: [
    { category: "Product A", value: 300 },
    { category: "Product B", value: 150 },
    { category: "Product C", value: 100 },
    { category: "Product D", value: 50 },
    { category: "Product E", value: 25 },
  ],
};

/**
 * Viewport configurations for responsive testing
 */
export const viewports = {
  desktop: { width: 1280, height: 720 },
  laptop: { width: 1024, height: 768 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 667 },
  mobileLarge: { width: 414, height: 896 },
};

/**
 * Theme configurations
 */
export const themes = {
  light: "light",
  dark: "dark",
};

/**
 * Locale configurations for testing
 */
export const locales = {
  english: "en",
  serbianLatin: "sr-Latn",
  serbianCyrillic: "sr-Cyrl",
};

/**
 * Chart rendering options
 */
export interface RenderChartOptions {
  animated?: boolean;
  showTooltip?: boolean;
  height?: number;
  width?: number | "100%";
  locale?: string;
  title?: string;
}

/**
 * Renders a chart component and waits for it to be ready
 */
export async function renderChart(
  page: Page,
  chartType: "line" | "bar" | "column" | "area" | "pie",
  data: ChartData[],
  config: any,
  options: RenderChartOptions = {}
): Promise<void> {
  const {
    animated = false, // Disable animations for consistent screenshots
    showTooltip = false, // Disable tooltips for initial screenshots
    height = 400,
    width = "100%",
    locale = "en",
    title,
  } = options;

  // Set chart data before navigation so the test page can read it on first render.
  await page.addInitScript(
    ({ chartType, data, config, options }) => {
      (window as any).testChartConfig = {
        type: chartType,
        data,
        config,
        options,
      };
    },
    {
      chartType,
      data,
      config,
      options: { animated, showTooltip, height, width, locale, title },
    }
  );

  // Navigate to test page with chart component
  await page.goto(`/test/charts/${chartType}`);

  // Wait for chart to render
  await page.waitForSelector("[data-testid^='chart-']", { timeout: 5000 });
  await page.waitForTimeout(500); // Allow animations to settle
}

/**
 * Takes a screenshot with consistent styling and waits for stability
 */
export async function takeStableScreenshot(
  page: Page,
  name: string,
  options: {
    fullPage?: boolean;
    clip?: { x: number; y: number; width: number; height: number };
  } = {}
): Promise<void> {
  // Disable animations
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `,
  });

  // Wait for any remaining animations
  await page.waitForTimeout(300);

  // Take screenshot
  await page.screenshot({
    path: `screenshots/${name}.png`,
    ...options,
  });
}

/**
 * Compares screenshot with baseline
 */
export async function expectScreenshotToMatchBaseline(
  page: Page,
  baselineName: string,
  threshold?: number
): Promise<void> {
  const screenshot = await page.screenshot();

  expect(screenshot).toMatchSnapshot(`${baselineName}.png`, {
    maxDiffPixels: threshold || 100,
  });
}

/**
 * Test scenarios for each chart type
 */
export const chartTestScenarios = {
  // Line chart scenarios
  line: {
    normal: {
      data: testDataFixtures.normal,
      config: {
        xAxis: "category",
        yAxis: "value",
        color: "#6366f1",
        title: "Line Chart - Normal Data",
      },
    },
    multiSeries: {
      data: testDataFixtures.normal,
      config: {
        xAxis: "category",
        yAxis: ["value", "value2"],
        title: "Line Chart - Multi Series",
      },
    },
    singlePoint: {
      data: testDataFixtures.singlePoint,
      config: {
        xAxis: "category",
        yAxis: "value",
        title: "Line Chart - Single Point",
      },
    },
    empty: {
      data: testDataFixtures.empty,
      config: {
        xAxis: "category",
        yAxis: "value",
        title: "Line Chart - Empty Data",
      },
    },
  },

  // Bar chart scenarios
  bar: {
    normal: {
      data: testDataFixtures.normal,
      config: {
        xAxis: "category",
        yAxis: "value",
        color: "#10b981",
        title: "Bar Chart - Normal Data",
      },
    },
    multiSeries: {
      data: testDataFixtures.normal,
      config: {
        xAxis: "category",
        yAxis: ["value", "value2"],
        title: "Bar Chart - Multi Series",
      },
    },
    singlePoint: {
      data: testDataFixtures.singlePoint,
      config: {
        xAxis: "category",
        yAxis: "value",
        title: "Bar Chart - Single Point",
      },
    },
    empty: {
      data: testDataFixtures.empty,
      config: {
        xAxis: "category",
        yAxis: "value",
        title: "Bar Chart - Empty Data",
      },
    },
  },

  // Column chart scenarios
  column: {
    normal: {
      data: testDataFixtures.normal,
      config: {
        xAxis: "category",
        yAxis: "value",
        color: "#f59e0b",
        title: "Column Chart - Normal Data",
      },
    },
    multiSeries: {
      data: testDataFixtures.normal,
      config: {
        xAxis: "category",
        yAxis: ["value", "value2"],
        title: "Column Chart - Multi Series",
      },
    },
    singlePoint: {
      data: testDataFixtures.singlePoint,
      config: {
        xAxis: "category",
        yAxis: "value",
        title: "Column Chart - Single Point",
      },
    },
    empty: {
      data: testDataFixtures.empty,
      config: {
        xAxis: "category",
        yAxis: "value",
        title: "Column Chart - Empty Data",
      },
    },
  },

  // Area chart scenarios
  area: {
    normal: {
      data: testDataFixtures.normal,
      config: {
        xAxis: "category",
        yAxis: "value",
        color: "#ef4444",
        title: "Area Chart - Normal Data",
      },
    },
    stacked: {
      data: testDataFixtures.normal,
      config: {
        xAxis: "category",
        yAxis: ["value", "value2"],
        stackMode: "stack" as const,
        title: "Area Chart - Stacked",
      },
    },
    singlePoint: {
      data: testDataFixtures.singlePoint,
      config: {
        xAxis: "category",
        yAxis: "value",
        title: "Area Chart - Single Point",
      },
    },
    empty: {
      data: testDataFixtures.empty,
      config: {
        xAxis: "category",
        yAxis: "value",
        title: "Area Chart - Empty Data",
      },
    },
  },

  // Pie chart scenarios
  pie: {
    normal: {
      data: testDataFixtures.pieData,
      config: {
        xAxis: "category",
        yAxis: "value",
        title: "Pie Chart - Normal Data",
      },
    },
    donut: {
      data: testDataFixtures.pieData,
      config: {
        xAxis: "category",
        yAxis: "value",
        innerRadiusRatio: 0.6,
        title: "Donut Chart",
      },
    },
    singlePoint: {
      data: [testDataFixtures.pieData[0]],
      config: {
        xAxis: "category",
        yAxis: "value",
        title: "Pie Chart - Single Point",
      },
    },
    empty: {
      data: testDataFixtures.empty,
      config: {
        xAxis: "category",
        yAxis: "value",
        title: "Pie Chart - Empty Data",
      },
    },
  },
};

/**
 * Generates test name for screenshot
 */
export function getScreenshotName(
  chartType: string,
  scenario: string,
  viewport: string,
  locale: string = "en",
  theme: string = "light"
): string {
  return `${chartType}-${scenario}-${viewport}-${locale}-${theme}`;
}

/**
 * Wait for chart animations to complete
 */
export async function waitForChartStability(page: Page): Promise<void> {
  // Wait for D3 transitions to complete
  await page.waitForTimeout(1200);

  // Ensure no pending animations
  await page.evaluate(() => {
    const transitions = (window as any).d3?.transitions?.active?.() || 0;
    if (transitions > 0) {
      return new Promise((resolve) => setTimeout(resolve, 500));
    }
  });
}

/**
 * Set theme on the page
 */
export async function setTheme(
  page: Page,
  theme: "light" | "dark"
): Promise<void> {
  await page.evaluate((theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, theme);
}

/**
 * Set locale on the page
 */
export async function setLocale(page: Page, locale: string): Promise<void> {
  await page.evaluate((locale) => {
    document.documentElement.setAttribute("lang", locale);
  }, locale);
}
