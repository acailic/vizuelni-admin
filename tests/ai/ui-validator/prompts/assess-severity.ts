export function buildSeverityAssessmentPrompt(input: {
  issueDescription: string;
  pagePath: string;
  taskName?: string;
  criticalElements: string[];
}): string {
  return `Assess severity for this UI issue.

Issue: ${input.issueDescription}
Page: ${input.pagePath}
Affected task: ${input.taskName || 'unknown'}
Critical elements: ${input.criticalElements.join(', ') || 'none'}

Use:
- critical when the task is blocked
- warning when the experience is degraded but task completion is still possible
- info for polish issues`;
}
