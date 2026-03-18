import type { DiscoveredTask } from '../schemas/task.schema';
import type {
  Issue,
  IssueCategory,
  IssueSeverity,
  IssueSource,
  ViewportConfig,
} from '../schemas/issue.schema';

export interface IssueCandidate {
  category: IssueCategory;
  source: IssueSource;
  page: string;
  expected: string;
  actual: string;
  element?: string;
  subcategory?: string;
  severity?: IssueSeverity;
  viewport?: ViewportConfig;
  task_blocked?: string | null;
  screenshot?: string | null;
  dom_snapshot?: string | null;
  suggestion?: string;
  confidence?: number;
  affectsDataIntegrity?: boolean;
}

function selectorMatches(candidate?: string, known?: string): boolean {
  if (!candidate || !known) {
    return false;
  }

  return (
    candidate === known ||
    candidate.includes(known) ||
    known.includes(candidate)
  );
}

export function determineSeverity(
  candidate: IssueCandidate,
  tasks: DiscoveredTask[]
): IssueSeverity {
  if (candidate.severity) {
    return candidate.severity;
  }

  if (candidate.task_blocked) {
    return 'critical';
  }

  const blockedTask = tasks.find((task) => {
    return (
      task.page === candidate.page &&
      task.criticalElements.some((selector) =>
        selectorMatches(candidate.element, selector)
      )
    );
  });

  if (blockedTask) {
    return 'critical';
  }

  if (
    candidate.category === 'interaction' ||
    candidate.affectsDataIntegrity ||
    candidate.subcategory === 'accessibility'
  ) {
    return 'warning';
  }

  return 'info';
}

function buildSuggestion(candidate: IssueCandidate): string | undefined {
  if (candidate.suggestion) {
    return candidate.suggestion;
  }

  if (candidate.category === 'interaction') {
    return 'Re-check the affected action flow and confirm the expected state change is wired correctly.';
  }

  if (candidate.category === 'data') {
    return 'Inspect the data-loading path, empty-state handling, and any upstream API responses for this page.';
  }

  return 'Review the layout and responsive styling for the affected selector and viewport.';
}

export class IssueCollector {
  private issues: Issue[] = [];

  constructor(private readonly tasks: DiscoveredTask[]) {}

  add(candidate: IssueCandidate): Issue {
    const severity = determineSeverity(candidate, this.tasks);
    const key = [
      candidate.source,
      candidate.page,
      candidate.viewport?.name ?? 'all',
      candidate.element ?? 'page',
      candidate.actual,
    ].join('::');

    const existing = this.issues.find((issue) => {
      const issueKey = [
        issue.source,
        issue.page,
        issue.viewport?.name ?? 'all',
        issue.element ?? 'page',
        issue.actual,
      ].join('::');

      return issueKey === key;
    });

    if (existing) {
      existing.screenshot = existing.screenshot ?? candidate.screenshot ?? null;
      existing.dom_snapshot =
        existing.dom_snapshot ?? candidate.dom_snapshot ?? null;
      existing.suggestion = existing.suggestion ?? buildSuggestion(candidate);
      existing.task_blocked =
        existing.task_blocked ?? candidate.task_blocked ?? null;
      existing.confidence = Math.max(
        existing.confidence ?? 0,
        candidate.confidence ?? 0
      );
      return existing;
    }

    const issue: Issue = {
      id: `ISS-${String(this.issues.length + 1).padStart(3, '0')}`,
      severity,
      category: candidate.category,
      subcategory: candidate.subcategory,
      source: candidate.source,
      task_blocked: candidate.task_blocked ?? null,
      page: candidate.page,
      element: candidate.element,
      viewport: candidate.viewport,
      expected: candidate.expected,
      actual: candidate.actual,
      screenshot: candidate.screenshot ?? null,
      dom_snapshot: candidate.dom_snapshot ?? null,
      suggestion: buildSuggestion(candidate),
      confidence: candidate.confidence,
    };

    this.issues.push(issue);
    return issue;
  }

  addMany(candidates: IssueCandidate[]): Issue[] {
    return candidates.map((candidate) => this.add(candidate));
  }

  getAll(): Issue[] {
    return [...this.issues];
  }
}
