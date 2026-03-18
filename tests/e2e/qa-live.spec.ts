import { test, expect, type Page } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';
const IS_STATIC_QA =
  BASE_URL.includes('github.io') || process.env.STATIC_QA === 'true';

async function waitForPageReady(page: Page) {
  await page.waitForLoadState('domcontentloaded', { timeout: 30000 });
  await page.waitForTimeout(1500);
}

function watchPage(page: Page) {
  const consoleErrors: string[] = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  return { consoleErrors };
}

function extractNumericValue(text: string) {
  const digits = text.replace(/[^\d]/g, '');
  return Number.parseInt(digits, 10);
}

test.describe('QA Live - GitHub Pages Smoke', () => {
  test('QA-001: Homepage loads and exposes the public shell', async ({
    page,
  }) => {
    const telemetry = watchPage(page);

    await page.goto(`${BASE_URL}/sr-Cyrl/`);
    await waitForPageReady(page);

    await expect(page).toHaveTitle(/Визуелни Админ|Vizuelni Admin/i);
    await expect(page.locator('h1')).toContainText(/подаци|data/i);

    if (IS_STATIC_QA) {
      expect(await page.locator('a[href*="/login"]').count()).toBe(0);
      expect(await page.locator('a[href*="/profile"]').count()).toBe(0);
      expect(await page.locator('a[href*="/gallery"]').count()).toBe(0);
    }

    expect(telemetry.consoleErrors).toEqual([]);
  });

  test('QA-002: Data catalog loads live results from data.gov.rs', async ({
    page,
  }) => {
    const telemetry = watchPage(page);

    await page.goto(`${BASE_URL}/sr-Cyrl/data/`);
    await waitForPageReady(page);

    const resultsLocator = page
      .locator('text=/резултата у каталогу|datasets found/i')
      .first();
    await expect(resultsLocator).toBeVisible({ timeout: 20000 });

    const resultsText = (await resultsLocator.textContent()) || '';
    const datasetCount = extractNumericValue(resultsText);
    expect(datasetCount).toBeGreaterThan(100);

    const datasetButtons = page.locator(
      'main.container-custom section button h2'
    );
    await expect(datasetButtons.first()).toBeVisible({ timeout: 10000 });
    expect(await datasetButtons.count()).toBeGreaterThan(0);

    expect(telemetry.consoleErrors).toEqual([]);
  });

  test('QA-003: Demo gallery hydrates chart previews', async ({ page }) => {
    const telemetry = watchPage(page);

    await page.goto(`${BASE_URL}/sr-Cyrl/demo-gallery/`);
    await waitForPageReady(page);

    const cards = page.locator('button[aria-haspopup="dialog"]');
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeGreaterThan(20);

    await page.waitForTimeout(2000);

    const renderedCharts = page.locator(
      '.recharts-wrapper svg, svg.recharts-surface'
    );
    expect(await renderedCharts.count()).toBeGreaterThan(0);
    expect(telemetry.consoleErrors).toEqual([]);
  });

  test('QA-004: Demo gallery modal opens and closes via keyboard', async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/sr-Cyrl/demo-gallery/`);
    await waitForPageReady(page);

    await page.locator('button[aria-haspopup="dialog"]').first().click();

    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('h2, [role="heading"]').first()).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });

  test('QA-005: Accessibility statement stays reachable', async ({ page }) => {
    await page.goto(`${BASE_URL}/sr-Cyrl/accessibility/`);
    await waitForPageReady(page);

    await expect(page.locator('body')).toContainText(/WCAG|приступач/i);
  });

  test('QA-006: Locale routes remain available', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/`);
    await waitForPageReady(page);
    await expect(page.locator('body')).toContainText(/government|data/i);

    await page.goto(`${BASE_URL}/sr-Latn/`);
    await waitForPageReady(page);
    await expect(page.locator('body')).toContainText(/vladini|podaci/i);
  });
});
