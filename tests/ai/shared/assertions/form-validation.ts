/**
 * Form validation assertions
 */

import { expect } from 'vitest';
import type { Page } from '@playwright/test';

export async function assertRequiredFieldIndicated(
  page: Page,
  selector: string
): Promise<void> {
  const element = page.locator(selector).first();
  const hasIndicator = await element.evaluate((el) => {
    if (el.getAttribute('aria-required') === 'true') return true;
    if (el.hasAttribute('required')) return true;
    if (el.closest('.required, [class*="required"]')) return true;
    return false;
  });

  expect(
    hasIndicator,
    `Field "${selector}" should have required indicator`
  ).toBe(true);
}

export async function assertValidationError(
  page: Page,
  fieldSelector: string,
  errorMessage?: string
): Promise<void> {
  const field = page.locator(fieldSelector).first();
  await field.clear();
  await field.blur();
  await page.waitForTimeout(300);

  const hasError = await page.evaluate((selector) => {
    const field = document.querySelector(selector);
    if (!field) return false;
    return !!(
      field.classList.contains('error') ||
      field.classList.contains('invalid') ||
      field.closest('.error, .invalid')
    );
  }, fieldSelector);

  expect(
    hasError,
    `Field "${fieldSelector}" should show validation error`
  ).toBe(true);
}

export async function assertAllFieldsLabeled(
  page: Page
): Promise<{ total: number; unlabeled: string[] }> {
  const result = await page.evaluate(() => {
    const inputs = document.querySelectorAll('input, select, textarea');
    const unlabeled: string[] = [];

    inputs.forEach((input) => {
      const el = input as HTMLInputElement;
      if (['hidden', 'submit', 'button'].includes(el.type)) return;

      const hasLabel =
        (el.id && document.querySelector(`label[for="${el.id}"]`)) ||
        el.closest('label') ||
        el.getAttribute('aria-label');

      if (!hasLabel) unlabeled.push(el.name || el.id || el.type);
    });

    return { total: inputs.length, unlabeled };
  });

  expect(result.unlabeled, 'All fields should have labels').toHaveLength(0);
  return result;
}