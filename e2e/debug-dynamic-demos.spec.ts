import { test, expect } from "@playwright/test";

const BASE_URL = "https://acailic.github.io/vizualni-admin";

test.describe("Debug Dynamic Demo Pages", () => {
  test("check air-quality page chart rendering", async ({ page }) => {
    // Capture console messages
    const consoleMessages: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error" || msg.type() === "warning") {
        consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
      }
    });

    await page.goto(`${BASE_URL}/demos/air-quality`, {
      waitUntil: "networkidle",
    });
    await page.waitForTimeout(4000); // Wait for dynamic content

    // Check page content
    const pageContent = await page.evaluate(() => {
      const body = document.body;

      // Check for alert/warning messages
      const alerts = Array.from(
        document.querySelectorAll('[role="alert"], .MuiAlert-root')
      ).map((el) => el.textContent);

      // Check for chart containers
      const chartContainers = document.querySelectorAll(
        '[class*="ChartContainer"], [class*="chart"], svg'
      );

      // Check for loading states
      const loadingElements = document.querySelectorAll(
        '[class*="loading"], [class*="Loading"], [class*="skeleton"]'
      );

      return {
        alerts,
        chartContainerCount: chartContainers.length,
        loadingCount: loadingElements.length,
        bodyText: body.innerText.substring(0, 500),
        hasError:
          body.innerText.includes("error") ||
          body.innerText.includes("Error") ||
          body.innerText.includes("greška"),
      };
    });

    console.log("Page content:", JSON.stringify(pageContent, null, 2));

    // Check for any SVG elements
    const svgInfo = await page.evaluate(() => {
      const svgs = document.querySelectorAll("svg");
      return Array.from(svgs).map((svg) => ({
        width: svg.getAttribute("width"),
        height: svg.getAttribute("height"),
        id: svg.id,
        className: svg.className,
        childCount: svg.children.length,
      }));
    });

    console.log("SVG elements:", JSON.stringify(svgInfo, null, 2));

    // Take screenshot
    await page.screenshot({ path: "debug-air-quality.png", fullPage: true });

    // Print console messages
    if (consoleMessages.length > 0) {
      console.log("\n=== Console Messages ===");
      consoleMessages.forEach((msg) => console.log(msg));
    }
  });

  test("check economy page chart rendering", async ({ page }) => {
    await page.goto(`${BASE_URL}/demos/economy`, { waitUntil: "networkidle" });
    await page.waitForTimeout(4000);

    const pageContent = await page.evaluate(() => {
      const body = document.body;
      const alerts = Array.from(
        document.querySelectorAll('[role="alert"], .MuiAlert-root')
      ).map((el) => el.textContent);
      const svgs = document.querySelectorAll("svg");

      return {
        alerts,
        svgCount: svgs.length,
        bodyText: body.innerText.substring(0, 500),
      };
    });

    console.log("Economy page:", JSON.stringify(pageContent, null, 2));
    await page.screenshot({ path: "debug-economy.png", fullPage: true });
  });

  test("check demographics page chart rendering", async ({ page }) => {
    await page.goto(`${BASE_URL}/demos/demographics`, {
      waitUntil: "networkidle",
    });
    await page.waitForTimeout(4000);

    const pageContent = await page.evaluate(() => {
      const body = document.body;
      const alerts = Array.from(
        document.querySelectorAll('[role="alert"], .MuiAlert-root')
      ).map((el) => el.textContent);
      const svgs = document.querySelectorAll("svg");

      return {
        alerts,
        svgCount: svgs.length,
        bodyText: body.innerText.substring(0, 500),
      };
    });

    console.log("Demographics page:", JSON.stringify(pageContent, null, 2));
    await page.screenshot({ path: "debug-demographics.png", fullPage: true });
  });
});
