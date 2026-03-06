import { test, expect } from "@playwright/test";

const BASE_URL = "https://acailic.github.io/vizualni-admin";

test.describe("Chart State Debug", () => {
  test("check playground chart rendering state", async ({ page }) => {
    // Capture console messages
    const consoleMessages: string[] = [];
    page.on("console", (msg) => {
      consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
    });

    // Navigate to playground
    await page.goto(`${BASE_URL}/demos/playground`, {
      waitUntil: "networkidle",
    });

    // Wait for charts to potentially load
    await page.waitForTimeout(3000);

    // Check localStorage state
    const localStorageData = await page.evaluate(() => {
      const playgroundState = localStorage.getItem("playground-state");
      return {
        playgroundState: playgroundState ? JSON.parse(playgroundState) : null,
        allKeys: Object.keys(localStorage),
      };
    });

    console.log(
      "LocalStorage state:",
      JSON.stringify(localStorageData, null, 2)
    );

    // Check if data is loaded in the store
    const zustandState = await page.evaluate(() => {
      // Try to get the zustand store state
      const stateEl = document.querySelector("[data-playground-state]");
      return {
        hasStateEl: !!stateEl,
        stateText: stateEl?.textContent || null,
      };
    });

    // Check SVG content
    const svgContent = await page.evaluate(() => {
      const svgs = document.querySelectorAll("svg");
      return Array.from(svgs).map((svg, i) => ({
        index: i,
        id: svg.id,
        width: svg.getAttribute("width"),
        height: svg.getAttribute("height"),
        hasChildren: svg.children.length > 0,
        childCount: svg.children.length,
        innerHTML: svg.innerHTML.substring(0, 200),
        // Check for D3-generated content
        hasPath: !!svg.querySelector("path"),
        hasCircle: !!svg.querySelector("circle"),
        hasLine: !!svg.querySelector("line"),
        hasAxis: !!svg.querySelector(".x-axis, .y-axis"),
      }));
    });

    console.log("SVG content:", JSON.stringify(svgContent, null, 2));

    // Check if the preview pane has content
    const previewPaneContent = await page.evaluate(() => {
      const previewPane =
        document.querySelector('[class*="PreviewPane"]') ||
        document.querySelector('[data-testid="preview-pane"]') ||
        document.querySelector("main paper") ||
        document.querySelector(".MuiPaper-root");

      if (!previewPane) return { found: false };

      return {
        found: true,
        text: previewPane.textContent?.substring(0, 100),
        hasNoData: previewPane.textContent?.includes("No data") || false,
        childCount: previewPane.children.length,
      };
    });

    console.log("Preview pane:", JSON.stringify(previewPaneContent, null, 2));

    // Get page content for analysis
    const pageContent = await page.content();
    const hasChartContainer = pageContent.includes("svg");
    const hasNoDataMessage = pageContent.includes("No data to display");

    console.log("\n=== Console Messages ===");
    consoleMessages.forEach((msg) => console.log(msg));

    // Log findings
    console.log("\n=== Findings ===");
    console.log("Has chart container (svg):", hasChartContainer);
    console.log("Has 'No data' message:", hasNoDataMessage);
    console.log("LocalStorage keys:", localStorageData.allKeys);
    console.log("Playground state exists:", !!localStorageData.playgroundState);

    if (localStorageData.playgroundState) {
      console.log(
        "Data in store:",
        localStorageData.playgroundState.state?.data?.length || 0,
        "items"
      );
    }

    // Check if the dynamic import loaded
    const dynamicImports = await page.evaluate(() => {
      return {
        hasLineChart: typeof (window as any).LineChart !== "undefined",
        hasD3: typeof (window as any).d3 !== "undefined",
        webpackChunks: (window as any).__webpack_chunks__ || "not available",
      };
    });

    console.log("Dynamic imports:", JSON.stringify(dynamicImports, null, 2));

    // Take screenshot for visual inspection
    await page.screenshot({
      path: "debug-playground-state.png",
      fullPage: true,
    });

    // Assertions
    expect(hasChartContainer).toBe(true);
  });
});
