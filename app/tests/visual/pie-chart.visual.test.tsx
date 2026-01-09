/**
 * Visual Regression Tests for PieChart Component
 *
 * Tests PieChart rendering across various scenarios:
 * - Normal data with multiple categories
 * - Single data point
 * - Empty data
 * - Donut mode
 * - Different legend positions
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

test.describe("PieChart Visual Regression", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test/charts/pie");
  });

  test.describe("Desktop Viewport", () => {
    test("should render normal data correctly", async ({ page }) => {
      await page.setViewportSize(viewports.desktop);

      await renderChart(page, "pie", chartTestScenarios.pie.normal.data, {
        ...chartTestScenarios.pie.normal.config,
        animated: false,
        showTooltip: false,
      });

      await waitForChartStability(page);

      await expect(page).toHaveScreenshot(
        getScreenshotName("pie", "normal", "desktop")
      );
    });

    test("should render donut mode correctly", async ({ page }) => {
      await page.setViewportSize(viewports.desktop);

      await renderChart(page, "pie", chartTestScenarios.pie.donut.data, {
        ...chartTestScenarios.pie.donut.config,
        animated: false,
        showTooltip: false,
      });

      await waitForChartStability(page);

      await expect(page).toHaveScreenshot(
        getScreenshotName("pie", "donut", "desktop")
      );
    });

    test("should render with bottom legend", async ({ page }) => {
      await page.setViewportSize(viewports.desktop);

      await renderChart(page, "pie", chartTestScenarios.pie.normal.data, {
        xAxis: "category",
        yAxis: "value",
        color: "#6366f1",
        title: "Pie Chart - Bottom Legend",
        legendPosition: "bottom" as const,
        animated: false,
        showTooltip: false,
      });

      await waitForChartStability(page);

      await expect(page).toHaveScreenshot(
        getScreenshotName("pie", "bottom-legend", "desktop")
      );
    });

    test("should render with outside labels", async ({ page }) => {
      await page.setViewportSize(viewports.desktop);

      await renderChart(page, "pie", chartTestScenarios.pie.normal.data, {
        xAxis: "category",
        yAxis: "value",
        color: "#6366f1",
        title: "Pie Chart - Outside Labels",
        labelPosition: "outside" as const,
        animated: false,
        showTooltip: false,
      });

      await waitForChartStability(page);

      await expect(page).toHaveScreenshot(
        getScreenshotName("pie", "outside-labels", "desktop")
      );
    });

    test("should render single point correctly", async ({ page }) => {
      await page.setViewportSize(viewports.desktop);

      await renderChart(page, "pie", chartTestScenarios.pie.singlePoint.data, {
        ...chartTestScenarios.pie.singlePoint.config,
        animated: false,
        showTooltip: false,
      });

      await waitForChartStability(page);

      await expect(page).toHaveScreenshot(
        getScreenshotName("pie", "single-point", "desktop")
      );
    });

    test("should handle empty data gracefully", async ({ page }) => {
      await page.setViewportSize(viewports.desktop);

      await renderChart(page, "pie", chartTestScenarios.pie.empty.data, {
        ...chartTestScenarios.pie.empty.config,
        animated: false,
        showTooltip: false,
      });

      await waitForChartStability(page);

      await expect(page).toHaveScreenshot(
        getScreenshotName("pie", "empty", "desktop")
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

        await renderChart(page, "pie", chartTestScenarios.pie.normal.data, {
          ...chartTestScenarios.pie.normal.config,
          animated: false,
          showTooltip: false,
        });

        await waitForChartStability(page);

        await expect(page).toHaveScreenshot(
          getScreenshotName("pie", "normal", name)
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
          "pie",
          chartTestScenarios.pie.normal.data,
          {
            ...chartTestScenarios.pie.normal.config,
            animated: false,
            showTooltip: false,
          },
          { locale }
        );

        await waitForChartStability(page);

        await expect(page).toHaveScreenshot(
          getScreenshotName("pie", "normal", "desktop", locale)
        );
      });
    }
  });

  test.describe("Theme Variations", () => {
    test("should render correctly in dark mode", async ({ page }) => {
      await page.setViewportSize(viewports.desktop);
      await setTheme(page, "dark");

      await renderChart(page, "pie", chartTestScenarios.pie.normal.data, {
        ...chartTestScenarios.pie.normal.config,
        animated: false,
        showTooltip: false,
      });

      await waitForChartStability(page);

      await expect(page).toHaveScreenshot(
        getScreenshotName("pie", "normal", "desktop", "en", "dark")
      );
    });

    test("should render correctly in light mode", async ({ page }) => {
      await page.setViewportSize(viewports.desktop);
      await setTheme(page, "light");

      await renderChart(page, "pie", chartTestScenarios.pie.normal.data, {
        ...chartTestScenarios.pie.normal.config,
        animated: false,
        showTooltip: false,
      });

      await waitForChartStability(page);

      await expect(page).toHaveScreenshot(
        getScreenshotName("pie", "normal", "desktop", "en", "light")
      );
    });
  });

  test.describe("Interactive States", () => {
    test("should show tooltip on hover", async ({ page }) => {
      await page.setViewportSize(viewports.desktop);

      await renderChart(page, "pie", chartTestScenarios.pie.normal.data, {
        ...chartTestScenarios.pie.normal.config,
        animated: false,
        showTooltip: true,
      });

      await waitForChartStability(page);

      // Hover over slice
      const slice = page.locator(".slice").first();
      await slice.hover();
      await page.waitForTimeout(300);

      await expect(page).toHaveScreenshot(
        getScreenshotName("pie", "tooltip-hover", "desktop")
      );
    });

    test("should expand slice on hover", async ({ page }) => {
      await page.setViewportSize(viewports.desktop);

      await renderChart(page, "pie", chartTestScenarios.pie.normal.data, {
        ...chartTestScenarios.pie.normal.config,
        animated: false,
        showTooltip: false,
      });

      await waitForChartStability(page);

      // Hover over slice to trigger expansion
      const slice = page.locator(".slice").first();
      await slice.hover();
      await page.waitForTimeout(300);

      await expect(page).toHaveScreenshot(
        getScreenshotName("pie", "slice-expand", "desktop")
      );
    });
  });

  test.describe("Edge Cases", () => {
    test("should handle many categories", async ({ page }) => {
      await page.setViewportSize(viewports.desktop);

      const manyCategories = Array.from({ length: 15 }, (_, i) => ({
        category: `Category ${i + 1}`,
        value: 10 + ((i * 31) % 100),
      }));

      await renderChart(page, "pie", manyCategories, {
        xAxis: "category",
        yAxis: "value",
        color: "#6366f1",
        title: "Pie Chart - Many Categories",
        animated: false,
        showTooltip: false,
      });

      await waitForChartStability(page);

      await expect(page).toHaveScreenshot(
        getScreenshotName("pie", "many-categories", "desktop")
      );
    });

    test("should handle very small slice", async ({ page }) => {
      await page.setViewportSize(viewports.desktop);

      const dataWithSmallSlice = [
        { category: "Large", value: 500 },
        { category: "Medium", value: 300 },
        { category: "Small", value: 100 },
        { category: "Tiny", value: 5 },
      ];

      await renderChart(page, "pie", dataWithSmallSlice, {
        xAxis: "category",
        yAxis: "value",
        color: "#6366f1",
        title: "Pie Chart - Small Slice",
        animated: false,
        showTooltip: false,
      });

      await waitForChartStability(page);

      await expect(page).toHaveScreenshot(
        getScreenshotName("pie", "small-slice", "desktop")
      );
    });
  });
});
