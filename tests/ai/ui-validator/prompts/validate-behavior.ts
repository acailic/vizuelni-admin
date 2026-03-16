export function buildBehaviorValidationPrompt(input: {
  pagePath: string;
  taskName: string;
  taskDescription: string;
  stepTarget: string;
  expectedResult: string;
}): string {
  return `You are validating whether a browser interaction succeeded.

Page: ${input.pagePath}
Task: ${input.taskName}
Task description: ${input.taskDescription}
Step target: ${input.stepTarget}
Expected result: ${input.expectedResult}

Judge the CURRENT page state only. Return success true only if the expected result is clearly visible now.`;
}
