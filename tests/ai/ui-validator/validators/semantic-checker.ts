import type { Stagehand } from '@browserbasehq/stagehand';

import type { ResolvedUiValidatorPage } from '../config';
import type { DiscoveredTask } from '../schemas/task.schema';
import type { ViewportConfig } from '../schemas/issue.schema';
import { getActivePage } from '../../fixtures/test-helpers';
import type { IssueCandidate } from '../core/issue-collector';
import type { ValidatorResult } from './visual-inspector';

function findBlockingTask(
  tasks: DiscoveredTask[],
  pagePath: string
): string | null {
  return tasks.find((task) => task.page === pagePath)?.id ?? null;
}

export async function runSemanticChecker(input: {
  stagehand: Stagehand;
  pageConfig: ResolvedUiValidatorPage;
  tasks: DiscoveredTask[];
  viewport: ViewportConfig;
}): Promise<ValidatorResult> {
  const page = await getActivePage(input.stagehand);
  const snapshot = await page.evaluate(() => {
    const bodyText = document.body.innerText || '';
    const normalized = bodyText.toLowerCase();
    const inputs = Array.from(
      document.querySelectorAll('input, select, textarea')
    );
    const unlabeledInputs = inputs.filter((input) => {
      const element = input as HTMLInputElement;
      const id = element.id;
      const hasLabel = id ? document.querySelector(`label[for="${id}"]`) : null;
      return (
        !hasLabel &&
        !element.getAttribute('aria-label') &&
        !element.getAttribute('aria-labelledby')
      );
    }).length;

    const unnamedButtons = Array.from(
      document.querySelectorAll('button')
    ).filter((button) => {
      const accessibleText =
        button.textContent?.trim() || button.getAttribute('aria-label');
      return !accessibleText;
    }).length;

    const untranslatedSignals = [
      'translation missing',
      'undefined',
      'null',
      'todo',
      'lorem ipsum',
    ].filter((token) => normalized.includes(token));

    const emptyDataSignals = [
      'no data',
      'nema podataka',
      'нема података',
      'failed to load',
      'грешка',
    ].filter((token) => normalized.includes(token));

    const chartLikeElements = document.querySelectorAll(
      'svg, canvas, table, [class*="chart"], [class*="preview"]'
    ).length;

    return {
      bodyText,
      untranslatedSignals,
      emptyDataSignals,
      unlabeledInputs,
      unnamedButtons,
      chartLikeElements,
      htmlLang: document.documentElement.lang,
    };
  });

  let checksRun = 4;
  let passedChecks = 0;
  const issues: IssueCandidate[] = [];

  if (snapshot.untranslatedSignals.length === 0) {
    passedChecks += 1;
  } else {
    issues.push({
      category: 'data',
      subcategory: 'i18n',
      source: 'semantic-checker',
      page: input.pageConfig.path,
      viewport: input.viewport,
      expected: 'Visible UI copy should be translated and production-ready.',
      actual: `Detected placeholder or untranslated content: ${snapshot.untranslatedSignals.join(', ')}.`,
      confidence: 0.73,
    });
  }

  if (
    !(snapshot.chartLikeElements > 0 && snapshot.emptyDataSignals.length > 0)
  ) {
    passedChecks += 1;
  } else {
    issues.push({
      category: 'data',
      source: 'semantic-checker',
      page: input.pageConfig.path,
      viewport: input.viewport,
      expected:
        'Data-driven views should render real content rather than empty-state failure text.',
      actual: `Detected data-empty signals while data containers are present: ${snapshot.emptyDataSignals.join(', ')}.`,
      task_blocked: findBlockingTask(input.tasks, input.pageConfig.path),
      affectsDataIntegrity: true,
      confidence: 0.89,
    });
  }

  if (snapshot.unlabeledInputs === 0 && snapshot.unnamedButtons === 0) {
    passedChecks += 1;
  } else {
    issues.push({
      category: 'layout',
      subcategory: 'accessibility',
      source: 'semantic-checker',
      page: input.pageConfig.path,
      viewport: input.viewport,
      expected: 'Form fields and buttons should expose an accessible name.',
      actual: `Found ${snapshot.unlabeledInputs} unlabeled input(s) and ${snapshot.unnamedButtons} unnamed button(s).`,
      confidence: 0.84,
    });
  }

  if (snapshot.htmlLang) {
    passedChecks += 1;
  } else {
    issues.push({
      category: 'layout',
      subcategory: 'accessibility',
      source: 'semantic-checker',
      page: input.pageConfig.path,
      viewport: input.viewport,
      expected: 'The document root should define a language attribute.',
      actual: 'The HTML element does not expose a lang attribute.',
      confidence: 0.81,
    });
  }

  return { issues, checksRun, passedChecks };
}
