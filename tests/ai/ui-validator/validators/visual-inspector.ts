import type { Stagehand } from '@browserbasehq/stagehand';

import type {
  ResolvedUiValidationSpec,
  ResolvedUiValidatorPage,
} from '../config';
import type { DiscoveredTask } from '../schemas/task.schema';
import type { ViewportConfig } from '../schemas/issue.schema';
import { getActivePage } from '../../fixtures/test-helpers';
import type { IssueCandidate } from '../core/issue-collector';

export interface ValidatorResult {
  issues: IssueCandidate[];
  checksRun: number;
  passedChecks: number;
}

function findBlockingTask(
  tasks: DiscoveredTask[],
  pagePath: string,
  selector?: string
): string | null {
  if (!selector) {
    return null;
  }

  const task = tasks.find((candidate) => {
    return (
      candidate.page === pagePath &&
      candidate.criticalElements.some(
        (criticalElement) =>
          criticalElement === selector ||
          criticalElement.includes(selector) ||
          selector.includes(criticalElement)
      )
    );
  });

  return task?.id ?? null;
}

async function inspectSpecElement(
  page: Awaited<ReturnType<typeof getActivePage>>,
  spec: ResolvedUiValidationSpec,
  viewport: ViewportConfig,
  tasks: DiscoveredTask[]
): Promise<ValidatorResult> {
  let checksRun = 0;
  let passedChecks = 0;
  const issues: IssueCandidate[] = [];

  for (const criticalElement of spec.critical_elements) {
    checksRun += 1;

    const locator = page.locator(criticalElement.selector);
    const count = await locator.count();
    const first = count > 0 ? locator.first() : null;
    const isVisible = first
      ? await first.isVisible().catch(() => false)
      : false;
    const textContent = first
      ? ((await first.textContent().catch(() => null)) ?? '').trim()
      : '';

    const countTooLow =
      criticalElement.min_count !== undefined &&
      count < criticalElement.min_count;
    const countTooHigh =
      criticalElement.max_count !== undefined &&
      count > criticalElement.max_count;
    const missingText =
      criticalElement.text_contains &&
      !textContent
        .toLowerCase()
        .includes(criticalElement.text_contains.toLowerCase());

    const failed =
      count === 0 ||
      (criticalElement.must_be_visible && !isVisible) ||
      countTooLow ||
      countTooHigh ||
      !!missingText;

    if (!failed) {
      passedChecks += 1;
      continue;
    }

    issues.push({
      category: 'layout',
      source: 'visual-inspector',
      page: spec.path,
      element: criticalElement.selector,
      viewport,
      expected: criticalElement.expectation,
      actual:
        count === 0
          ? 'Expected selector was not found in the DOM.'
          : countTooLow
            ? `Found ${count} matching element(s), below the required minimum of ${criticalElement.min_count}.`
            : countTooHigh
              ? `Found ${count} matching element(s), above the allowed maximum of ${criticalElement.max_count}.`
              : missingText
                ? `Visible content did not include "${criticalElement.text_contains}".`
                : 'Element exists but is not visibly rendered.',
      task_blocked: findBlockingTask(
        tasks,
        spec.path,
        criticalElement.selector
      ),
      confidence: 0.84,
    });
  }

  return { issues, checksRun, passedChecks };
}

export async function runVisualInspector(input: {
  stagehand: Stagehand;
  pageConfig: ResolvedUiValidatorPage;
  specs: ResolvedUiValidationSpec[];
  tasks: DiscoveredTask[];
  viewport: ViewportConfig;
}): Promise<ValidatorResult> {
  const page = await getActivePage(input.stagehand);
  let visualChecksRun = 4;
  let metrics: {
    visibleTextElements: number;
    hiddenByOverflow: number;
    lowContrastElements: Array<{
      selector: string;
      text: string;
      contrastRatio: number;
    }>;
    obscuredElements: Array<{
      selector: string;
      tagName: string;
      reason: string;
    }>;
    hasHorizontalScroll: boolean;
    viewportWidth: number;
    contentWidth: number;
    overflowElements: Array<{
      selector: string;
      overflowX: number;
      overflowY: number;
    }>;
    potentialZIndexIssues: Array<{ selector: string; zIndex: number }>;
    visibleButtons: number;
    visibleLinks: number;
    visibleInputs: number;
  };

  try {
    metrics = await page.evaluate(() => {
      const getSelector = (el: Element) => {
        const className =
          typeof (el as HTMLElement).className === 'string'
            ? (el as HTMLElement).className
            : (el.getAttribute('class') ?? '');

        return el.id
          ? `#${el.id}`
          : className
            ? `${el.tagName.toLowerCase()}.${className.split(' ')[0]}`
            : el.tagName.toLowerCase();
      };

      const textElements = document.querySelectorAll(
        'p, h1, h2, h3, h4, h5, h6, span, a, button, label, li, td, th, div'
      );
      let visibleTextElements = 0;
      let hiddenByOverflow = 0;

      textElements.forEach((element) => {
        const text = element.textContent?.trim();
        if (!text || text.length < 3) {
          return;
        }

        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();

        if (
          style.display === 'none' ||
          style.visibility === 'hidden' ||
          style.opacity === '0'
        ) {
          return;
        }

        if (rect.width === 0 || rect.height === 0) {
          hiddenByOverflow += 1;
          return;
        }

        visibleTextElements += 1;
      });

      const overflowElements: Array<{
        selector: string;
        overflowX: number;
        overflowY: number;
      }> = [];

      document.querySelectorAll('*').forEach((element) => {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);

        if (style.overflowX === 'hidden' || style.overflowX === 'auto') {
          return;
        }

        if (rect.width > window.innerWidth + 10) {
          overflowElements.push({
            selector: getSelector(element),
            overflowX: Math.round(rect.width - window.innerWidth),
            overflowY: 0,
          });
        }
      });

      const obscuredElements: Array<{
        selector: string;
        tagName: string;
        reason: string;
      }> = [];

      const interactiveElements = document.querySelectorAll(
        'button, a[href], input, select, textarea'
      );
      let visibleButtons = 0;
      let visibleLinks = 0;
      let visibleInputs = 0;

      interactiveElements.forEach((element) => {
        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        const selector = getSelector(element);
        const tagName = element.tagName.toLowerCase();

        if (style.display === 'none') {
          obscuredElements.push({ selector, tagName, reason: 'display: none' });
          return;
        }

        if (style.visibility === 'hidden') {
          obscuredElements.push({
            selector,
            tagName,
            reason: 'visibility: hidden',
          });
          return;
        }

        if (parseFloat(style.opacity) === 0) {
          obscuredElements.push({ selector, tagName, reason: 'opacity: 0' });
          return;
        }

        if (rect.width === 0 || rect.height === 0) {
          obscuredElements.push({ selector, tagName, reason: 'zero size' });
          return;
        }

        if (tagName === 'button') {
          visibleButtons += 1;
        } else if (tagName === 'a') {
          visibleLinks += 1;
        } else {
          visibleInputs += 1;
        }
      });

      const potentialZIndexIssues: Array<{ selector: string; zIndex: number }> =
        [];
      document.querySelectorAll('*').forEach((element) => {
        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        const zIndex = parseInt(style.zIndex, 10);

        if (zIndex > 1000 && rect.width > 0 && rect.height > 0) {
          potentialZIndexIssues.push({
            selector: getSelector(element),
            zIndex,
          });
        }
      });

      return {
        visibleTextElements,
        hiddenByOverflow,
        lowContrastElements: [],
        obscuredElements: obscuredElements.slice(0, 10),
        hasHorizontalScroll:
          document.documentElement.scrollWidth > window.innerWidth + 10,
        viewportWidth: window.innerWidth,
        contentWidth: document.documentElement.scrollWidth,
        overflowElements: overflowElements.slice(0, 10),
        potentialZIndexIssues: potentialZIndexIssues.slice(0, 10),
        visibleButtons,
        visibleLinks,
        visibleInputs,
      };
    });
  } catch (error) {
    visualChecksRun = 0;
    metrics = {
      visibleTextElements: 0,
      hiddenByOverflow: 0,
      lowContrastElements: [],
      obscuredElements: [],
      hasHorizontalScroll: false,
      viewportWidth: input.viewport.width,
      contentWidth: input.viewport.width,
      overflowElements: [],
      potentialZIndexIssues: [],
      visibleButtons: 0,
      visibleLinks: 0,
      visibleInputs: 0,
    };
  }

  let checksRun = visualChecksRun;
  let passedChecks = 0;
  const issues: IssueCandidate[] = [];

  if (visualChecksRun > 0 && metrics.lowContrastElements.length === 0) {
    passedChecks += 1;
  } else if (visualChecksRun > 0) {
    issues.push(
      ...metrics.lowContrastElements.slice(0, 5).map((element) => ({
        category: 'layout' as const,
        subcategory: 'accessibility',
        source: 'visual-inspector' as const,
        page: input.pageConfig.path,
        element: element.selector,
        viewport: input.viewport,
        expected: 'Text contrast should meet WCAG AA requirements.',
        actual: `Contrast ratio is ${element.contrastRatio}:1 for visible text "${element.text}".`,
        confidence: 0.92,
      }))
    );
  }

  if (
    visualChecksRun > 0 &&
    !metrics.hasHorizontalScroll &&
    metrics.overflowElements.length === 0
  ) {
    passedChecks += 1;
  } else if (visualChecksRun > 0) {
    issues.push({
      category: 'layout',
      source: 'visual-inspector',
      page: input.pageConfig.path,
      viewport: input.viewport,
      expected:
        'Page content should fit the viewport without horizontal scrolling.',
      actual: metrics.hasHorizontalScroll
        ? `Document width is ${metrics.contentWidth}px for a ${metrics.viewportWidth}px viewport.`
        : 'One or more elements overflow the viewport width.',
      element: metrics.overflowElements[0]?.selector,
      confidence: 0.88,
    });
  }

  if (visualChecksRun > 0 && metrics.obscuredElements.length === 0) {
    passedChecks += 1;
  } else if (visualChecksRun > 0) {
    issues.push(
      ...metrics.obscuredElements.slice(0, 5).map((element) => ({
        category: 'layout' as const,
        source: 'visual-inspector' as const,
        page: input.pageConfig.path,
        viewport: input.viewport,
        element: element.selector,
        expected: 'Interactive elements should remain visible and operable.',
        actual: `${element.tagName} is obscured because ${element.reason}.`,
        task_blocked: findBlockingTask(
          input.tasks,
          input.pageConfig.path,
          element.selector
        ),
        confidence: 0.87,
      }))
    );
  }

  if (
    visualChecksRun > 0 &&
    metrics.hiddenByOverflow === 0 &&
    metrics.potentialZIndexIssues.length === 0
  ) {
    passedChecks += 1;
  } else if (visualChecksRun > 0) {
    issues.push({
      category: 'layout',
      source: 'visual-inspector',
      page: input.pageConfig.path,
      viewport: input.viewport,
      expected:
        'Visible content should not be clipped or hidden behind high z-index layers.',
      actual:
        metrics.hiddenByOverflow > 0
          ? `${metrics.hiddenByOverflow} text element(s) appear clipped or collapsed.`
          : `Potential overlay detected with z-index ${metrics.potentialZIndexIssues[0]?.zIndex}.`,
      element: metrics.potentialZIndexIssues[0]?.selector,
      confidence: 0.78,
    });
  }

  for (const spec of input.specs) {
    const specResult = await inspectSpecElement(
      page,
      spec,
      input.viewport,
      input.tasks
    );
    checksRun += specResult.checksRun;
    passedChecks += specResult.passedChecks;
    issues.push(...specResult.issues);
  }

  return {
    issues,
    checksRun,
    passedChecks,
  };
}
