export function buildTaskDiscoveryPrompt(input: {
  pageName: string;
  pagePath: string;
  pageUrl: string;
  domSummary: string;
  explicitSpecSummary: string;
  maxDepth: number;
}): string {
  return `You are exploring a web application to discover realistic user tasks.

Current page name: ${input.pageName}
Configured page path: ${input.pagePath}
Current page URL: ${input.pageUrl}
Discovery max depth: ${input.maxDepth}

DOM summary:
${input.domSummary}

Explicit critical expectations:
${input.explicitSpecSummary}

Return a JSON array of 1 to 4 task objects matching the DiscoveredTask schema.
Rules:
- Use concise task names.
- Keep steps practical and sequential.
- Prefer CSS selectors when they are obvious from the page structure; otherwise use short descriptions.
- Include the critical UI elements required for each task.
- Use the configured page path "${input.pagePath}" for the page field.
- Confidence must be between 0 and 1.
- Do not invent flows that are not visible from this page.`;
}
