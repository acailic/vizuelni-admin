export function buildVisualValidationPrompt(input: {
  pagePath: string;
  viewportName: string;
  domSummary: string;
  explicitSpecSummary: string;
  relevantTasksSummary: string;
}): string {
  return `You are validating the visual state of a web page.

Page: ${input.pagePath}
Viewport: ${input.viewportName}

DOM summary:
${input.domSummary}

Expected elements:
${input.explicitSpecSummary}

Relevant tasks:
${input.relevantTasksSummary}

Identify obvious visual problems such as missing expected sections, overflow, overlap, or misleading empty states. Respond internally only; downstream code converts findings into issues.`;
}
