// src/lib/feedback/types.ts

export interface EmailTemplate {
  to: string;
  subject: string;
  body: string;
}

export type FeedbackType = 'bug' | 'feature';

export interface FeedbackLabels {
  foundBug: string;
  reportBugDescription: string;
  reportBug: string;
  newFeature: string;
  featureDescription: string;
  submit: string;
}

export function generateMailtoLink(template: EmailTemplate): string {
  const subject = encodeURIComponent(template.subject);
  const body = encodeURIComponent(template.body);
  return `mailto:${template.to}?subject=${subject}&body=${body}`;
}
