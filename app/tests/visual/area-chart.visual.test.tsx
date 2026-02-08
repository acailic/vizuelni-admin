/**
 * Visual Regression Tests for AreaChart Component
 *
 * Tests AreaChart rendering across various scenarios:
 * - Normal data with multiple points
 * - Single data point
 * - Empty data
 * - Stacked mode
 * - Overlap mode
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

test.describe("AreaChart Visual Regression", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test/charts/area");
  });

  test.describe("Desktop Viewport", () => {
    test("should render normal data correctly", async ({ page }) => {
      await page.setViewportSize(viewports.desktop);

      await renderChart(page, "area", chartTestScenarios.area.normal.data, {
        ...chartTestScenarios.area.normal.config,
        animated: false,
        showTooltip: false,
      });

      await waitForChartStability(page);

      await expect(page).toHaveScreenshot(
        getScreenshotName("area", "normal", "desktop")
      );
    });

    test("should render with line stroke", async ({ page }) => {
      await page.setViewportSize(viewports.desktop);

      await renderChart(page, "area", chartTestScenarios.area.normal.data, {
        ...chartTestScenarios.area.normal.config,
        showLine: true,
        strokeWidth: 2,
        animated: false,
        showTooltip: false,
      });

      await waitForChartStability(page);

      await expect(page).toHaveScreenshot(
        getScreenshotName("area", "with-line", "desktop")
      );
    });

    test("should render stacked mode correctly", async ({ page }) => {
      await page.setViewportSize(viewports.desktop);

      await renderChart(page, "area", chartTestScenarios.area.stacked.data, {
        ...chartTestScenarios.area.stacked.config,
        animated: false,
        showTooltip: false,
      });

      await waitForChartStability(page);

      await expect(page).toHaveScreenshot(
        getScreenshotName("area", "stacked", "desktop")
      );
    });

    test("should render overlap mode correctly", async ({ page }) => {
      await page.setViewportSize(viewports.desktop);

      await renderChart(page, "area", chartTestScenarios.area.stacked.data, {
        xAxis: "category",
        yAxis: ["value", "value2"],
        stackMode: "overlap" as const,
        color: "#ef4444",
        title: "Area Chart - Overlap Mode",
        animated: false,
        showTooltip: false,
      });

      await waitForChartStability(page);

      await expect(page).toHaveScreenshot(
        getScreenshotName("area", "overlap", "desktop")
      );
    });

    test("should render single point correctly", async ({ page }) => {
      await page.setViewportSize(viewports.desktop);

      await renderChart(
        page,
        "area",
        chartTestScenarios.area.singlePoint.data,
        {
          ...chartTestScenarios.area.singlePoint.config,
          animated: false,
          showTooltip: false,
        }
      );

      await waitForChartStability(page);

      await expect(page).toHaveScreenshot(
        getScreenshotName("area", "single-point", "desktop")
      );
    });

    test("should handle empty data gracefully", async ({ page }) => {
      await page.setViewportSize(viewports.desktop);

      await renderChart(page, "area", chartTestScenarios.area.empty.data, {
        ...chartTestScenarios.area.empty.config,
        animated: false,
        showTooltip: false,
      });

      await waitForChartStability(page);

      await expect(page).toHaveScreenshot(
        getScreenshotName("area", "empty", "desktop")
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

        await renderChart(page, "area", chartTestScenarios.area.normal.data, {
          ...chartTestScenarios.area.normal.config,
          animated: false,
          showTooltip: false,
        });

        await waitForChartStability(page);

        await expect(page).toHaveScreenshot(
          getScreenshotName("area", "normal", name)
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
          "area",
          chartTestScenarios.area.normal.data,
          {
            ...chartTestScenarios.area.normal.config,
            animated: false,
            showTooltip: false,
          },
          { locale }
        );

        await waitForChartStability(page);

        await expect(page).toHaveScreenshot(
          getScreenshotName("area", "normal", "desktop", locale)
        );
      });
    }
  });

  test.describe("Theme Variations", () => {
    test("should render correctly in dark mode", async ({ page }) => {
      await page.setViewportSize(viewports.desktop);
      await setTheme(page, "dark");

      await renderChart(page, "area", chartTestScenarios.area.normal.data, {
        ...chartTestScenarios.area.normal.config,
        animated: false,
        showTooltip: false,
      });

      await waitForChartStability(page);

      await expect(page).toHaveScreenshot(
        getScreenshotName("area", "normal", "desktop", "en", "dark")
      );
    });

    test("should render correctly in light mode", async ({ page }) => {
      await page.setViewportSize(viewports.desktop);
      await setTheme(page, "light");

      await renderChart(page, "area", chartTestScenarios.area.normal.data, {
        ...chartTestScenarios.area.normal.config,
        animated: false,
        showTooltip: false,
      });

      await waitForChartStability(page);

      await expect(page).toHaveScreenshot(
        getScreenshotName("area", "normal", "desktop", "en", "light")
      );
    });
  });

  test.describe("Interactive States", () => {
    test("should show tooltip on hover", async ({ page }) => {
      await page.setViewportSize(viewports.desktop);

      await renderChart(page, "area", chartTestScenarios.area.normal.data, {
        ...chartTestScenarios.area.normal.config,
        animated: false,
        showTooltip: true,
      });

      await waitForChartStability(page);

      // Hover over area
      const chartArea = page.locator(".area-0").first();
      await chartArea.hover();
      await page.waitForTimeout(300);

      await expect(page).toHaveScreenshot(
        getScreenshotName("area", "tooltip-hover", "desktop")
      );
    });
  });

  test.describe("Edge Cases", () => {
    test("should handle large dataset", async ({ page }) => {
      await page.setViewportSize(viewports.desktop);

      const largeData = Array.from({ length: 100 }, (_, i) => ({
        category: `Point ${i + 1}`,
        value: 50 + ((i * 37) % 200),
      }));

      await renderChart(page, "area", largeData, {
        xAxis: "category",
        yAxis: "value",
        color: "#ef4444",
        title: "Area Chart - Large Dataset",
        animated: false,
        showTooltip: false,
      });

      await waitForChartStability(page);

      await expect(page).toHaveScreenshot(
        getScreenshotName("area", "large-dataset", "desktop")
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

      await renderChart(page, "area", dataWithNegatives, {
        xAxis: "category",
        yAxis: "value",
        color: "#ef4444",
        showZeroLine: true,
        title: "Area Chart - Negative Values",
        animated: false,
        showTooltip: false,
      });

      await waitForChartStability(page);

      await expect(page).toHaveScreenshot(
        getScreenshotName("area", "negative-values", "desktop")
      );
    });
  });
});
