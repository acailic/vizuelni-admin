/**
 * Visual Regression Tests for BarChart Component
 *
 * Tests BarChart rendering across various scenarios:
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

test.describe("BarChart Visual Regression", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test/charts/bar");
  });

  test.describe("Desktop Viewport", () => {
    test("should render normal data correctly", async ({ page }) => {
      await page.setViewportSize(viewports.desktop);

      await renderChart(page, "bar", chartTestScenarios.bar.normal.data, {
        ...chartTestScenarios.bar.normal.config,
        animated: false,
        showTooltip: false,
      });

      await waitForChartStability(page);

      await expect(page).toHaveScreenshot(
        getScreenshotName("bar", "normal", "desktop")
      );
    });

    test("should render multi-series correctly", async ({ page }) => {
      await page.setViewportSize(viewports.desktop);

      await renderChart(page, "bar", chartTestScenarios.bar.multiSeries.data, {
        ...chartTestScenarios.bar.multiSeries.config,
        animated: false,
        showTooltip: false,
      });

      await waitForChartStability(page);

      await expect(page).toHaveScreenshot(
        getScreenshotName("bar", "multi-series", "desktop")
      );
    });

    test("should render single point correctly", async ({ page }) => {
      await page.setViewportSize(viewports.desktop);

      await renderChart(page, "bar", chartTestScenarios.bar.singlePoint.data, {
        ...chartTestScenarios.bar.singlePoint.config,
        animated: false,
        showTooltip: false,
      });

      await waitForChartStability(page);

      await expect(page).toHaveScreenshot(
        getScreenshotName("bar", "single-point", "desktop")
      );
    });

    test("should handle empty data gracefully", async ({ page }) => {
      await page.setViewportSize(viewports.desktop);

      await renderChart(page, "bar", chartTestScenarios.bar.empty.data, {
        ...chartTestScenarios.bar.empty.config,
        animated: false,
        showTooltip: false,
      });

      await waitForChartStability(page);

      await expect(page).toHaveScreenshot(
        getScreenshotName("bar", "empty", "desktop")
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

        await renderChart(page, "bar", chartTestScenarios.bar.normal.data, {
          ...chartTestScenarios.bar.normal.config,
          animated: false,
          showTooltip: false,
        });

        await waitForChartStability(page);

        await expect(page).toHaveScreenshot(
          getScreenshotName("bar", "normal", name)
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
          "bar",
          chartTestScenarios.bar.normal.data,
          {
            ...chartTestScenarios.bar.normal.config,
            animated: false,
            showTooltip: false,
          },
          { locale }
        );

        await waitForChartStability(page);

        await expect(page).toHaveScreenshot(
          getScreenshotName("bar", "normal", "desktop", locale)
        );
      });
    }
  });

  test.describe("Theme Variations", () => {
    test("should render correctly in dark mode", async ({ page }) => {
      await page.setViewportSize(viewports.desktop);
      await setTheme(page, "dark");

      await renderChart(page, "bar", chartTestScenarios.bar.normal.data, {
        ...chartTestScenarios.bar.normal.config,
        animated: false,
        showTooltip: false,
      });

      await waitForChartStability(page);

      await expect(page).toHaveScreenshot(
        getScreenshotName("bar", "normal", "desktop", "en", "dark")
      );
    });

    test("should render correctly in light mode", async ({ page }) => {
      await page.setViewportSize(viewports.desktop);
      await setTheme(page, "light");

      await renderChart(page, "bar", chartTestScenarios.bar.normal.data, {
        ...chartTestScenarios.bar.normal.config,
        animated: false,
        showTooltip: false,
      });

      await waitForChartStability(page);

      await expect(page).toHaveScreenshot(
        getScreenshotName("bar", "normal", "desktop", "en", "light")
      );
    });
  });

  test.describe("Interactive States", () => {
    test("should show tooltip on hover", async ({ page }) => {
      await page.setViewportSize(viewports.desktop);

      await renderChart(page, "bar", chartTestScenarios.bar.normal.data, {
        ...chartTestScenarios.bar.normal.config,
        animated: false,
        showTooltip: true,
      });

      await waitForChartStability(page);

      // Hover over bar
      await page.locator(".bar-0").first().hover();
      await page.waitForTimeout(300);

      await expect(page).toHaveScreenshot(
        getScreenshotName("bar", "tooltip-hover", "desktop")
      );
    });
  });

  test.describe("Edge Cases", () => {
    test("should handle large dataset", async ({ page }) => {
      await page.setViewportSize(viewports.desktop);

      const largeData = Array.from({ length: 50 }, (_, i) => ({
        category: `Category ${i}`,
        value: Math.floor(Math.random() * 200) + 50,
      }));

      await renderChart(page, "bar", largeData, {
        xAxis: "category",
        yAxis: "value",
        color: "#10b981",
        title: "Bar Chart - Large Dataset",
        animated: false,
        showTooltip: false,
      });

      await waitForChartStability(page);

      await expect(page).toHaveScreenshot(
        getScreenshotName("bar", "large-dataset", "desktop")
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

      await renderChart(page, "bar", dataWithNegatives, {
        xAxis: "category",
        yAxis: "value",
        color: "#10b981",
        showZeroLine: true,
        title: "Bar Chart - Negative Values",
        animated: false,
        showTooltip: false,
      });

      await waitForChartStability(page);

      await expect(page).toHaveScreenshot(
        getScreenshotName("bar", "negative-values", "desktop")
      );
    });
  });
});
