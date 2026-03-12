/**
 * Visual Regression Tests for ColumnChart Component
 *
 * Tests ColumnChart rendering across various scenarios:
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

test.describe("ColumnChart Visual Regression", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test/charts/column");
  });

  test.describe("Desktop Viewport", () => {
    test("should render normal data correctly", async ({ page }) => {
      await page.setViewportSize(viewports.desktop);

      await renderChart(page, "column", chartTestScenarios.column.normal.data, {
        ...chartTestScenarios.column.normal.config,
        animated: false,
        showTooltip: false,
      });

      await waitForChartStability(page);

      await expect(page).toHaveScreenshot(
        getScreenshotName("column", "normal", "desktop")
      );
    });

    test("should render with labels", async ({ page }) => {
      await page.setViewportSize(viewports.desktop);

      await renderChart(page, "column", chartTestScenarios.column.normal.data, {
        ...chartTestScenarios.column.normal.config,
        showLabels: true,
        animated: false,
        showTooltip: false,
      });

      await waitForChartStability(page);

      await expect(page).toHaveScreenshot(
        getScreenshotName("column", "with-labels", "desktop")
      );
    });

    test("should render multi-series correctly", async ({ page }) => {
      await page.setViewportSize(viewports.desktop);

      await renderChart(
        page,
        "column",
        chartTestScenarios.column.multiSeries.data,
        {
          ...chartTestScenarios.column.multiSeries.config,
          animated: false,
          showTooltip: false,
        }
      );

      await waitForChartStability(page);

      await expect(page).toHaveScreenshot(
        getScreenshotName("column", "multi-series", "desktop")
      );
    });

    test("should render single point correctly", async ({ page }) => {
      await page.setViewportSize(viewports.desktop);

      await renderChart(
        page,
        "column",
        chartTestScenarios.column.singlePoint.data,
        {
          ...chartTestScenarios.column.singlePoint.config,
          animated: false,
          showTooltip: false,
        }
      );

      await waitForChartStability(page);

      await expect(page).toHaveScreenshot(
        getScreenshotName("column", "single-point", "desktop")
      );
    });

    test("should handle empty data gracefully", async ({ page }) => {
      await page.setViewportSize(viewports.desktop);

      await renderChart(page, "column", chartTestScenarios.column.empty.data, {
        ...chartTestScenarios.column.empty.config,
        animated: false,
        showTooltip: false,
      });

      await waitForChartStability(page);

      await expect(page).toHaveScreenshot(
        getScreenshotName("column", "empty", "desktop")
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

        await renderChart(
          page,
          "column",
          chartTestScenarios.column.normal.data,
          {
            ...chartTestScenarios.column.normal.config,
            animated: false,
            showTooltip: false,
          }
        );

        await waitForChartStability(page);

        await expect(page).toHaveScreenshot(
          getScreenshotName("column", "normal", name)
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
          "column",
          chartTestScenarios.column.normal.data,
          {
            ...chartTestScenarios.column.normal.config,
            animated: false,
            showTooltip: false,
          },
          { locale }
        );

        await waitForChartStability(page);

        await expect(page).toHaveScreenshot(
          getScreenshotName("column", "normal", "desktop", locale)
        );
      });
    }
  });

  test.describe("Theme Variations", () => {
    test("should render correctly in dark mode", async ({ page }) => {
      await page.setViewportSize(viewports.desktop);
      await setTheme(page, "dark");

      await renderChart(page, "column", chartTestScenarios.column.normal.data, {
        ...chartTestScenarios.column.normal.config,
        animated: false,
        showTooltip: false,
      });

      await waitForChartStability(page);

      await expect(page).toHaveScreenshot(
        getScreenshotName("column", "normal", "desktop", "en", "dark")
      );
    });

    test("should render correctly in light mode", async ({ page }) => {
      await page.setViewportSize(viewports.desktop);
      await setTheme(page, "light");

      await renderChart(page, "column", chartTestScenarios.column.normal.data, {
        ...chartTestScenarios.column.normal.config,
        animated: false,
        showTooltip: false,
      });

      await waitForChartStability(page);

      await expect(page).toHaveScreenshot(
        getScreenshotName("column", "normal", "desktop", "en", "light")
      );
    });
  });

  test.describe("Interactive States", () => {
    test("should show tooltip on hover", async ({ page }) => {
      await page.setViewportSize(viewports.desktop);

      await renderChart(page, "column", chartTestScenarios.column.normal.data, {
        ...chartTestScenarios.column.normal.config,
        animated: false,
        showTooltip: true,
      });

      await waitForChartStability(page);

      // Hover over bar
      await page.locator(".bar-0").first().hover();
      await page.waitForTimeout(300);

      await expect(page).toHaveScreenshot(
        getScreenshotName("column", "tooltip-hover", "desktop")
      );
    });
  });

  test.describe("Edge Cases", () => {
    test("should handle large dataset", async ({ page }) => {
      await page.setViewportSize(viewports.desktop);

      const largeData = Array.from({ length: 50 }, (_, i) => ({
        category: `Category ${i + 1}`,
        value: 50 + ((i * 37) % 200),
      }));

      await renderChart(page, "column", largeData, {
        xAxis: "category",
        yAxis: "value",
        color: "#f59e0b",
        title: "Column Chart - Large Dataset",
        animated: false,
        showTooltip: false,
      });

      await waitForChartStability(page);

      await expect(page).toHaveScreenshot(
        getScreenshotName("column", "large-dataset", "desktop")
      );
    });

    test("should handle data with negative values", async ({ page }) => {
      await page.setViewportSize(viewports.desktop);

      const dataWithNegatives = [
        { category: "A", value: 100 },
        { category: "B", value: -50 },
        { category: "C", value: 75 },
        { category: "D", value: -25 },
        { category: "E", value: 120 },
      ];

      await renderChart(page, "column", dataWithNegatives, {
        xAxis: "category",
        yAxis: "value",
        color: "#f59e0b",
        title: "Column Chart - Negative Values",
        animated: false,
        showTooltip: false,
      });

      await waitForChartStability(page);

      await expect(page).toHaveScreenshot(
        getScreenshotName("column", "negative-values", "desktop")
      );
    });
  });
});
