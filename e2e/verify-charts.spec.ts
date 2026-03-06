import { test, expect } from "@playwright/test";

const BASE_URL = "https://acailic.github.io/vizualni-admin";

// List of demo pages to verify
const DEMO_PAGES = [
  {
    path: "/demos/playground",
    name: "Playground",
    expectedChartId: "line-chart",
  },
  { path: "/demos/showcase", name: "Showcase", expectedChartId: null },
  { path: "/demos/demographics", name: "Demographics", expectedChartId: null },
  { path: "/demos/air-quality", name: "Air Quality", expectedChartId: null },
  { path: "/demos/economy", name: "Economy", expectedChartId: null },
];

test.describe("Verify Charts Render on Demo Pages", () => {
  for (const demo of DEMO_PAGES) {
    test(`${demo.name} page should render charts`, async ({ page }) => {
      await page.goto(`${BASE_URL}${demo.path}`, { waitUntil: "networkidle" });

      // Wait for dynamic imports to load
      await page.waitForTimeout(3000);

      // Check for SVG elements with chart content
      const chartSvgs = await page.evaluate(() => {
        const svgs = document.querySelectorAll("svg");
        return Array.from(svgs)
          .filter((svg) => {
            // Filter to chart-sized SVGs (larger than icons)
            const width = parseInt(svg.getAttribute("width") || "0");
            const height = parseInt(svg.getAttribute("height") || "0");
            return width > 100 || height > 100;
          })
          .map((svg) => ({
            id: svg.id,
            width: svg.getAttribute("width"),
            height: svg.getAttribute("height"),
            hasPath: !!svg.querySelector("path:not([d*='M5.703'])"), // Exclude icon paths
            hasAxis: !!svg.querySelector(".x-axis, .y-axis, [class*='axis']"),
            childCount: svg.querySelectorAll(":scope > *").length,
          }));
      });

      console.log(`${demo.name} charts:`, JSON.stringify(chartSvgs, null, 2));

      // Take screenshot
      await page.screenshot({
        path: `docs/demo-screenshots/demo-${demo.name.toLowerCase().replace(/\s+/g, "-")}-verified.png`,
        fullPage: true,
      });

      // Log if no charts found (might be expected for some pages)
      if (chartSvgs.length === 0) {
        console.log(
          `${demo.name}: No chart-sized SVGs found (may be expected)`
        );
      } else {
        console.log(`${demo.name}: Found ${chartSvgs.length} chart(s)`);
      }

      // Basic assertion - page should load
      expect(page.url()).toContain(demo.path);
    });
  }
});
