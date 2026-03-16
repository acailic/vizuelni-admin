import type { Stagehand } from '@browserbasehq/stagehand';

import type { ResolvedUiValidatorPage } from '../config';
import type { DiscoveredTask, TaskStep } from '../schemas/task.schema';
import type { ViewportConfig } from '../schemas/issue.schema';
import {
  getActivePage,
  navigateTo,
  performAction,
} from '../../fixtures/test-helpers';
import { TEST_CONFIG } from '../../stagehand.config';
import type { IssueCandidate } from '../core/issue-collector';
import type { ValidatorResult } from './visual-inspector';

function isSelectorLike(target: string): boolean {
  return (
    /^[.#\[]/.test(target) ||
    /^[a-z][a-z0-9-]*(?:[.#][a-z0-9_-]+)+$/i.test(target) ||
    target.includes('[') ||
    target.includes(':')
  );
}

function extractExpectedKeywords(value: string): string[] {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .filter((token) => token.length >= 4)
    .filter(
      (token) =>
        ![
          'page',
          'content',
          'visible',
          'after',
          'with',
          'that',
          'this',
          'from',
          'data',
          'interface',
          'should',
          'remain',
        ].includes(token)
    );
}

async function verifyStepHeuristically(
  stagehand: Stagehand,
  pageConfig: ResolvedUiValidatorPage,
  step: TaskStep
): Promise<{ success: boolean; actual: string; reason: string }> {
  const page = await getActivePage(stagehand);
  const currentUrl = page.url();
  const bodyText = ((await page
    .locator('body')
    .innerText()
    .catch(() => '')) ||
    (await page
      .locator('body')
      .textContent()
      .catch(() => '')) ||
    '') as string;
  const normalizedBody = bodyText.toLowerCase();
  const hasMain =
    (await page
      .locator('main')
      .count()
      .catch(() => 0)) > 0;
  const hasHeading =
    (await page
      .locator('h1, [role=\"heading\"]')
      .count()
      .catch(() => 0)) > 0;
  const visibleInteractiveCount =
    (await page
      .locator('button, a[href], input, select, textarea')
      .count()
      .catch(() => 0)) ?? 0;
  const hasErrorSignal = [
    'application error',
    'page could not be found',
    'internal server error',
    'failed to load',
  ].some((keyword) => normalizedBody.includes(keyword));

  if (step.action === 'navigate') {
    const targetPath = step.target.startsWith('/')
      ? step.target
      : pageConfig.path;
    const success =
      currentUrl.includes(
        targetPath === '/' ? pageConfig.locale : targetPath
      ) || currentUrl.includes(targetPath);

    return {
      success:
        success &&
        !hasErrorSignal &&
        bodyText.trim().length > 50 &&
        (hasMain || hasHeading),
      actual: success
        ? 'Navigation resolved to a populated page.'
        : `Current URL is ${currentUrl}.`,
      reason: hasErrorSignal
        ? 'The page body still contains an application error signal.'
        : 'Primary content landmarks remained visible after navigation.',
    };
  }

  if (step.expected_result.toLowerCase().includes('remains interactive')) {
    return {
      success: !hasErrorSignal && visibleInteractiveCount > 0,
      actual: `Found ${visibleInteractiveCount} interactive element(s) after the action.`,
      reason: hasErrorSignal
        ? 'An error signal appeared after the action.'
        : 'The page still exposes clickable or editable controls.',
    };
  }

  if (isSelectorLike(step.target)) {
    const locator = page.locator(step.target).first();
    const count = await locator.count().catch(() => 0);
    const visible =
      count > 0 ? await locator.isVisible().catch(() => false) : false;

    return {
      success: count > 0 && visible,
      actual:
        count > 0
          ? `Selector ${step.target} is still present${visible ? ' and visible' : ' but hidden'}.`
          : `Selector ${step.target} was not found after the action.`,
      reason: 'Selector-based verification was used for this step.',
    };
  }

  const keywords = extractExpectedKeywords(step.expected_result);
  const keywordHit =
    keywords.length === 0 ||
    keywords.some((keyword) => normalizedBody.includes(keyword));

  return {
    success: !hasErrorSignal && keywordHit && bodyText.trim().length > 50,
    actual: keywordHit
      ? 'Expected content keywords were found in the visible page text.'
      : `Visible page text did not include any of: ${keywords.join(', ') || 'n/a'}.`,
    reason: hasErrorSignal
      ? 'An application error signal was detected in the page text.'
      : 'Heuristic text verification was used for this step.',
  };
}

async function executeTaskStep(
  stagehand: Stagehand,
  pageConfig: ResolvedUiValidatorPage,
  step: TaskStep
): Promise<void> {
  const page = await getActivePage(stagehand);

  switch (step.action) {
    case 'navigate': {
      const targetPath = step.target.startsWith('/')
        ? step.target
        : pageConfig.path;
      await navigateTo(stagehand, targetPath, pageConfig.locale);
      return;
    }

    case 'wait': {
      const waitMs = Number.parseInt(step.target, 10);
      await page.waitForTimeout(Number.isFinite(waitMs) ? waitMs : 1000);
      return;
    }

    case 'click': {
      if (isSelectorLike(step.target)) {
        const locator: any = page.locator(step.target).first();
        if ((await locator.count()) > 0) {
          await locator.click();
          return;
        }
      }

      await performAction(stagehand, `Click ${step.target}.`);
      return;
    }

    case 'select': {
      if (isSelectorLike(step.target)) {
        const locator: any = page.locator(step.target).first();
        const tagName = await locator.evaluate(
          (element: Element) => element.tagName
        );

        if (tagName === 'SELECT') {
          const value = await locator.evaluate((element: Element) => {
            const select = element as HTMLSelectElement;
            const option = Array.from(select.options).find(
              (candidate) => candidate.value
            );
            return option?.value ?? '';
          });

          if (value) {
            await locator.selectOption(value);
            return;
          }
        }
      }

      await performAction(
        stagehand,
        `Select a valid option for ${step.target}.`
      );
      return;
    }

    case 'input': {
      if (isSelectorLike(step.target)) {
        const locator = page.locator(step.target).first();
        if ((await locator.count()) > 0) {
          await locator.fill('test');
          return;
        }
      }

      await performAction(
        stagehand,
        `Type a safe sample value into ${step.target}. Use "test" unless the field obviously requires another value.`
      );
      return;
    }
  }
}

export async function runBehaviorValidator(input: {
  stagehand: Stagehand;
  pageConfig: ResolvedUiValidatorPage;
  tasks: DiscoveredTask[];
  viewport: ViewportConfig;
}): Promise<ValidatorResult> {
  let checksRun = 0;
  let passedChecks = 0;
  const issues: IssueCandidate[] = [];

  for (const task of input.tasks) {
    await navigateTo(
      input.stagehand,
      input.pageConfig.normalizedPath,
      input.pageConfig.locale
    );
    const page = await getActivePage(input.stagehand);
    await page.waitForTimeout(
      TEST_CONFIG.pageLoadBuffer + TEST_CONFIG.animationBuffer
    );

    for (const step of task.steps) {
      checksRun += 1;

      try {
        await executeTaskStep(input.stagehand, input.pageConfig, step);
        await page.waitForTimeout(TEST_CONFIG.animationBuffer);
        const verification = await verifyStepHeuristically(
          input.stagehand,
          input.pageConfig,
          step
        );

        if (verification.success) {
          passedChecks += 1;
          continue;
        }

        issues.push({
          category: 'interaction',
          source: 'behavior-validator',
          page: input.pageConfig.path,
          viewport: input.viewport,
          element: step.target,
          expected: step.expected_result,
          actual: `${verification.actual} ${verification.reason}`.trim(),
          task_blocked: task.id,
          confidence: task.confidence,
        });
        break;
      } catch (error) {
        issues.push({
          category: 'interaction',
          source: 'behavior-validator',
          page: input.pageConfig.path,
          viewport: input.viewport,
          element: step.target,
          expected: step.expected_result,
          actual:
            error instanceof Error
              ? error.message
              : 'Interaction step failed unexpectedly.',
          task_blocked: task.id,
          confidence: task.confidence,
        });
        break;
      }
    }
  }

  return { issues, checksRun, passedChecks };
}
