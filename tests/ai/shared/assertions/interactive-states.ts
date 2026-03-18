/**
 * Interactive state assertions
 */

import { expect } from 'vitest';
import type { Page } from '@playwright/test';
import { commonSelectors } from '../page-objects/common.po';

export async function assertButtonReady(
  page: Page,
  selector: string,
  label?: string
): Promise<void> {
  const button = page.locator(selector).first();
  const buttonLabel = label ? ` "${label}"` : '';

  await expect(button, `Button${buttonLabel} should be visible`).toBeVisible();

  const isDisabled = await button.isDisabled().catch(() => false);
  expect(isDisabled, `Button${buttonLabel} should not be disabled`).toBe(false);
}

export async function waitForLoadingComplete(
  page: Page,
  timeout = 15000
): Promise<void> {
  const loadingLocator = page.locator(commonSelectors.loading);
  const count = await loadingLocator.count().catch(() => 0);

  if (count > 0) {
    await loadingLocator.first().waitFor({ state: 'hidden', timeout });
  }
  await page.waitForTimeout(300);
}

export async function assertElementDisabled(
  page: Page,
  selector: string
): Promise<void> {
  const element = page.locator(selector).first();
  const isDisabled =
    (await element.isDisabled().catch(() => false)) ||
    (await element.getAttribute('aria-disabled')) === 'true';

  expect(isDisabled, `Element "${selector}" should be disabled`).toBe(true);
}

export async function assertElementEnabled(
  page: Page,
  selector: string
): Promise<void> {
  const element = page.locator(selector).first();
  const isDisabled =
    (await element.isDisabled().catch(() => false)) ||
    (await element.getAttribute('aria-disabled')) === 'true';

  expect(isDisabled, `Element "${selector}" should be enabled`).toBe(false);
}

export async function assertEmptyState(
  page: Page,
  expectedMessage?: string
): Promise<void> {
  const emptyLocator = page.locator(commonSelectors.empty);
  await expect(
    emptyLocator.first(),
    'Empty state should be visible'
  ).toBeVisible();

  if (expectedMessage) {
    const text = await emptyLocator.first().textContent();
    expect(text?.toLowerCase().includes(expectedMessage.toLowerCase())).toBe(
      true
    );
  }
}

export async function assertErrorState(
  page: Page,
  expectedMessage?: string
): Promise<void> {
  const errorLocator = page.locator(commonSelectors.error);
  await expect(
    errorLocator.first(),
    'Error state should be visible'
  ).toBeVisible();

  if (expectedMessage) {
    const text = await errorLocator.first().textContent();
    expect(text?.toLowerCase().includes(expectedMessage.toLowerCase())).toBe(
      true
    );
  }
}

export async function assertLoadingState(page: Page): Promise<void> {
  const loadingLocator = page.locator(commonSelectors.loading);
  await expect(
    loadingLocator.first(),
    'Loading state should be visible'
  ).toBeVisible();
}