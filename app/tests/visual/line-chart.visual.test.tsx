/**
 * Visual Regression Tests for LineChart Component
 *
 * Tests LineChart rendering across various scenarios:
 * - Normal data with multiple points
 * - Single data point
 * - Empty data
 * - Multiple series
 * - Different locales
 * - Different viewports
 * - Dark/light themes
 */

import { test, expect } from "@playwright/test";

import {
  chartTestScenarios,
  getScreenshotName,
  renderChart,
  setLocale,
  setTheme,
  viewports,
  waitForChartStability,
} from "./chart-test-utils";

test.describe("LineChart Visual Regression", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to test page
    await page.goto("/test/charts/line");
  });

  test.describe("Desktop Viewport", () => {
    test("should render normal data correctly", async ({ page }) => {
      await page.setViewportSize(viewports.desktop);

      await renderChart(page, "line", chartTestScenarios.line.normal.data, {
        ...chartTestScenarios.line.normal.config,
        animated: false,
        showTooltip: false,
      });

      await waitForChartStability(page);

      await expect(page).toHaveScreenshot(
        getScreenshotName("line", "normal", "desktop")
      );
    });

    test("should render multi-series correctly", async ({ page }) => {
      await page.setViewportSize(viewports.desktop);

      await renderChart(
        page,
        "line",
        chartTestScenarios.line.multiSeries.data,
        {
          ...chartTestScenarios.line.multiSeries.config,
          animated: false,
          showTooltip: false,
        }
      );

      await waitForChartStability(page);

      await expect(page).toHaveScreenshot(
        getScreenshotName("line", "multi-series", "desktop")
      );
    });

    test("should render single point correctly", async ({ page }) => {
      await page.setViewportSize(viewports.desktop);

      await renderChart(
        page,
        "line",
        chartTestScenarios.line.singlePoint.data,
        {
          ...chartTestScenarios.line.singlePoint.config,
          animated: false,
          showTooltip: false,
        }
      );

      await waitForChartStability(page);

      await expect(page).toHaveScreenshot(
        getScreenshotName("line", "single-point", "desktop")
      );
    });

    test("should handle empty data gracefully", async ({ page }) => {
      await page.setViewportSize(viewports.desktop);

      await renderChart(page, "line", chartTestScenarios.line.empty.data, {
        ...chartTestScenarios.line.empty.config,
        animated: false,
        showTooltip: false,
      });

      await waitForChartStability(page);

      await expect(page).toHaveScreenshot(
        getScreenshotName("line", "empty", "desktop")
      );
    });
  });

  test.describe("Responsive Viewports", () => {
    const viewportTests = [
      { name: "laptop", viewport: viewports.laptop },
      { name: "tablet", viewport: viewports.tablet },
      { name: "mobile", viewport: viewports.mobile },
    ];

    for (const { name, viewport } of viewportTests) {
      test(`should render correctly on ${name}`, async ({ page }) => {
        await page.setViewportSize(viewport);

        await renderChart(page, "line", chartTestScenarios.line.normal.data, {
          ...chartTestScenarios.line.normal.config,
          animated: false,
          showTooltip: false,
        });

        await waitForChartStability(page);

        await expect(page).toHaveScreenshot(
          getScreenshotName("line", "normal", name)
        );
      });
    }
  });

  test.describe("Locale Variations", () => {
    const locales = ["en", "sr-Latn", "sr-Cyrl"] as const;

    for (const locale of locales) {
      test(`should render correctly for locale ${locale}`, async ({ page }) => {
        await page.setViewportSize(viewports.desktop);
        await setLocale(page, locale);

        await renderChart(
          page,
          "line",
          chartTestScenarios.line.normal.data,
          {
            ...chartTestScenarios.line.normal.config,
            animated: false,
            showTooltip: false,
          },
          { locale }
        );

        await waitForChartStability(page);

        await expect(page).toHaveScreenshot(
          getScreenshotName("line", "normal", "desktop", locale)
        );
      });
    }
  });

  test.describe("Theme Variations", () => {
    test("should render correctly in dark mode", async ({ page }) => {
      await page.setViewportSize(viewports.desktop);
      await setTheme(page, "dark");

      await renderChart(page, "line", chartTestScenarios.line.normal.data, {
        ...chartTestScenarios.line.normal.config,
        animated: false,
        showTooltip: false,
      });

      await waitForChartStability(page);

      await expect(page).toHaveScreenshot(
        getScreenshotName("line", "normal", "desktop", "en", "dark")
      );
    });

    test("should render correctly in light mode", async ({ page }) => {
      await page.setViewportSize(viewports.desktop);
      await setTheme(page, "light");

      await renderChart(page, "line", chartTestScenarios.line.normal.data, {
        ...chartTestScenarios.line.normal.config,
        animated: false,
        showTooltip: false,
      });

      await waitForChartStability(page);

      await expect(page).toHaveScreenshot(
        getScreenshotName("line", "normal", "desktop", "en", "light")
      );
    });
  });

  test.describe("Interactive States", () => {
    test("should show tooltip on hover", async ({ page }) => {
      await page.setViewportSize(viewports.desktop);

      await renderChart(page, "line", chartTestScenarios.line.normal.data, {
        ...chartTestScenarios.line.normal.config,
        animated: false,
        showTooltip: true,
      });

      await waitForChartStability(page);

      // Hover over data point
      await page.locator(".dot-0").first().hover();
      await page.waitForTimeout(300);

      await expect(page).toHaveScreenshot(
        getScreenshotName("line", "tooltip-hover", "desktop")
      );
    });
  });

  test.describe("Edge Cases", () => {
    test("should handle large dataset", async ({ page }) => {
      await page.setViewportSize(viewports.desktop);

      const largeData = Array.from({ length: 100 }, (_, i) => ({
        category: `Point ${i}`,
        value: Math.floor(Math.random() * 200) + 50,
      }));

      await renderChart(page, "line", largeData, {
        xAxis: "category",
        yAxis: "value",
        color: "#6366f1",
        title: "Line Chart - Large Dataset",
        animated: false,
        showTooltip: false,
      });

      await waitForChartStability(page);

      await expect(page).toHaveScreenshot(
        getScreenshotName("line", "large-dataset", "desktop")
      );
    });

    test("should handle data with negative values", async ({ page }) => {
      await page.setViewportSize(viewports.desktop);

      const dataWithNegatives = [
        { category: "Jan", value: 100 },
        { category: "Feb", value: -50 },
        { category: "Mar", value: 75 },
        { category: "Apr", value: -25 },
        { category: "May", value: 120 },
      ];

      await renderChart(page, "line", dataWithNegatives, {
        xAxis: "category",
        yAxis: "value",
        color: "#6366f1",
        showZeroLine: true,
        title: "Line Chart - Negative Values",
        animated: false,
        showTooltip: false,
      });

      await waitForChartStability(page);

      await expect(page).toHaveScreenshot(
        getScreenshotName("line", "negative-values", "desktop")
      );
    });
  });
});
