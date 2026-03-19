# Functional Bug Analysis Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Systematically identify, document, and fix all functional bugs in the Vizuelni Admin Srbije codebase.

**Architecture:** Four-phase approach: automated discovery → systematic code review → documentation → prioritized fixes using TDD.

**Tech Stack:** Next.js 14, TypeScript, Zustand, Prisma, Jest, Playwright

---

## File Structure

### Created Files
- `docs/bug-analysis-2026-03-19.md` - Main bug report (Markdown)
- `docs/bug-analysis-2026-03-19.json` - Structured bug data (JSON)

### Review Areas (Priority Order)
| Priority | Area | Key Files |
|----------|------|-----------|
| 1 | Charts | `src/components/charts/**/*.tsx` (47 files) |
| 2 | State Management | `src/stores/*.ts` (5 files) |
| 3 | Authentication | `src/lib/auth/auth-options.ts`, `src/lib/db/charts.ts` |
| 4 | Data Pipeline | `src/lib/data/*.ts`, `src/lib/api/*.ts` |
| 5 | Localization | `src/lib/i18n/*.ts`, `src/lib/i18n/locales/**/*.json` |

---

## Phase 1: Automated Discovery

### Task 1.1: TypeScript Type Check

**Files:**
- Review: All `*.ts`, `*.tsx` files
- Output: Capture to `docs/bug-analysis-tsc-output.txt`

- [ ] **Step 1: Run TypeScript compiler**

Run: `npx tsc --noEmit 2>&1 | tee docs/bug-analysis-tsc-output.txt`
Expected: List of type errors or "No errors found"

- [ ] **Step 2: Parse output for actionable issues**

Extract errors that indicate:
- Type mismatches (potential runtime bugs)
- Null/undefined handling issues
- Incorrect type assertions

- [ ] **Step 3: Document findings**

Add each type error as potential bug candidate to working notes.

---

### Task 1.2: ESLint Code Quality Check

**Files:**
- Review: All `*.ts`, `*.tsx` files
- Output: Capture to `docs/bug-analysis-eslint-output.txt`

- [ ] **Step 1: Run ESLint**

Run: `npx eslint . 2>&1 | tee docs/bug-analysis-eslint-output.txt`
Expected: List of lint errors/warnings or clean output

- [ ] **Step 2: Filter for functional issues**

Focus on rules that indicate bugs:
- `@typescript-eslint/no-unnecessary-condition` - dead code paths
- `react-hooks/exhaustive-deps` - stale closures
- `@typescript-eslint/no-floating-promises` - unhandled async

- [ ] **Step 3: Document findings**

Add each relevant lint issue as potential bug candidate.

---

### Task 1.3: Test Suite Execution

**Files:**
- Review: `tests/**/*.test.ts` (25 unit test files)
- Output: Capture to `docs/bug-analysis-jest-output.txt`

- [ ] **Step 1: Run Jest tests**

Run: `npm test 2>&1 | tee docs/bug-analysis-jest-output.txt`
Expected: Test results with pass/fail counts

- [ ] **Step 2: Analyze failures**

For each failing test:
- Document as potential regression bug
- Note if test reveals actual code bug vs test bug

- [ ] **Step 3: Check coverage gaps**

Run: `npm test -- --coverage --coverageReporters=text-summary 2>&1 | tee -a docs/bug-analysis-jest-output.txt`
Expected: Coverage percentage summary

---

### Task 1.4: Dead Code Analysis

**Files:**
- Review: All source files
- Output: Capture to `docs/bug-analysis-knip-output.txt`

- [ ] **Step 1: Run knip for unused exports**

Run: `npx knip 2>&1 | tee docs/bug-analysis-knip-output.txt`
Expected: List of unused exports, dependencies, files

- [ ] **Step 2: Identify dead code paths**

Focus on:
- Unused exported functions (may indicate incomplete features)
- Unused dependencies (potential bloat or missing usage)

- [ ] **Step 3: Document findings**

Note dead code that may indicate unfinished or broken features.

---

## Phase 2: Systematic Code Review

### Task 2.1: Charts Review (Priority 1)

**Files:**
- Review: `src/components/charts/**/*.tsx` (48 files)
- Focus: Rendering logic, state handling, edge cases

- [ ] **Step 1: Review ChartRenderer.tsx**

File: `src/components/charts/ChartRenderer.tsx`

Check for:
- Missing chart type handling
- Undefined data handling
- Error propagation

- [ ] **Step 2: Review individual chart components**

Files to review (high priority):
- `src/components/charts/line/LineChart.tsx`
- `src/components/charts/bar/BarChart.tsx`
- `src/components/charts/column/ColumnChart.tsx`
- `src/components/charts/pie/PieChart.tsx`
- `src/components/charts/map/MapChart.tsx`

Check for:
- Empty data array handling
- Null/undefined prop handling
- Incorrect data transformations

- [ ] **Step 3: Review ChartBuilder and Configurator**

Files:
- `src/components/charts/ChartBuilder.tsx`
- `src/components/charts/CreateChartWorkspace.tsx`

Check for:
- State mutation bugs
- Invalid state transitions
- Missing validation

- [ ] **Step 4: Review shared components**

Files:
- `src/components/charts/shared/ExportMenu.tsx`
- `src/components/charts/shared/ChartErrorBoundary.tsx`
- `src/components/charts/shared/FilterPills.tsx`

Check for:
- Error handling gaps
- Missing edge case handling

- [ ] **Step 5: Document chart bugs**

For each bug found, record:
- File and line number
- Current behavior
- Expected behavior
- Severity

---

### Task 2.2: State Management Review (Priority 2)

**Files:**
- Review: `src/stores/*.ts` (5 files)
- Focus: Zustand stores, persistence, hydration

- [ ] **Step 1: Review configurator store**

File: `src/stores/configurator.ts`

Check for:
- SSR hydration mismatches
- Stale state after navigation
- Invalid state transitions

- [ ] **Step 2: Review interactive-filters store**

File: `src/stores/interactive-filters.ts`

Check for:
- Filter state corruption
- Missing filter reset logic
- Incorrect filter combination handling

- [ ] **Step 3: Review animation stores**

Files:
- `src/stores/animation.ts`
- `src/stores/animation-settings.ts`

Check for:
- Animation state persistence issues
- Global vs local state conflicts

- [ ] **Step 4: Review dashboard store**

File: `src/stores/dashboard.ts`

Check for:
- Layout state corruption
- Widget position bugs

- [ ] **Step 5: Document state management bugs**

Record all findings with severity classification.

---

### Task 2.3: Authentication Review (Priority 3)

**Files:**
- Review: `src/lib/auth/auth-options.ts`, `src/lib/db/charts.ts`
- Focus: Session handling, ownership, permissions

- [ ] **Step 1: Review auth configuration**

File: `src/lib/auth/auth-options.ts`

Check for:
- Session validation gaps
- Provider configuration issues
- Callback error handling

- [ ] **Step 2: Review chart ownership**

File: `src/lib/db/charts.ts`

Check for:
- Ownership bypass potential
- Missing authorization checks
- Race conditions in CRUD

- [ ] **Step 3: Review Prisma repository**

File: `src/lib/db/chart-repository-prisma.ts`

Check for:
- Transaction handling
- Error propagation
- Soft delete logic

- [ ] **Step 4: Document authentication bugs**

Record all findings with severity classification.

---

### Task 2.4: Data Pipeline Review (Priority 4)

**Files:**
- Review: `src/lib/data/*.ts`, `src/lib/api/*.ts`
- Focus: Loaders, transformers, API integrations

- [ ] **Step 1: Review data loaders**

File: `src/lib/data/loader.ts`

Check for:
- Empty dataset handling
- Parse error handling
- Memory issues with large datasets

- [ ] **Step 2: Review data transforms**

File: `src/lib/data/transforms.ts`

Check for:
- Invalid input handling
- Data type coercion bugs
- Missing null checks

- [ ] **Step 3: Review API clients**

Files:
- `src/lib/api/datagov-client.ts`
- `src/lib/api/browse.ts`

Check for:
- Network error handling
- Timeout handling
- Rate limiting edge cases

- [ ] **Step 4: Review join logic**

Files:
- `src/lib/data/join.ts`
- `src/lib/data/infer-join.ts`

Check for:
- Mismatched key handling
- Empty result handling
- Performance edge cases

- [ ] **Step 5: Document data pipeline bugs**

Record all findings with severity classification.

---

### Task 2.5: Localization Review (Priority 5)

**Files:**
- Review: `src/lib/i18n/*.ts`, `src/lib/i18n/locales/**/*.json`
- Focus: i18n completeness, date/number formatting

- [ ] **Step 1: Review i18n configuration**

File: `src/lib/i18n/config.ts`

Check for:
- Missing locale handling
- Fallback behavior

- [ ] **Step 2: Check translation completeness**

Run: Compare keys across:
- `src/lib/i18n/locales/en/common.json`
- `src/lib/i18n/locales/lat/common.json`
- `src/lib/i18n/locales/sr/common.json`
- `public/locales/sr-Cyrl.json`

Check for:
- Missing keys in any locale
- Placeholder mismatches

- [ ] **Step 3: Review date/number formatting**

Files using date-fns or Intl:
- Search for `formatDate`, `formatNumber`, `Intl.`

Check for:
- Serbian locale support
- Fallback for unsupported locales

- [ ] **Step 4: Document localization bugs**

Record all findings with severity classification.

---

## Phase 3: Bug Documentation

### Task 3.1: Create Bug Report Structure

**Files:**
- Create: `docs/bug-analysis-2026-03-19.md`

- [ ] **Step 1: Create markdown report header**

```markdown
# Functional Bug Analysis Report

**Date:** 2026-03-19
**Repository:** vizuelni-admin-srbije
**Focus:** Functional correctness

## Summary

| Severity | Count | Fixed |
|----------|-------|-------|
| Critical | 0 | 0 |
| High | 0 | 0 |
| Medium | 0 | 0 |
| Low | 0 | 0 |

## Bug Details
```

- [ ] **Step 2: Commit initial structure**

```bash
git add docs/bug-analysis-2026-03-19.md
git commit -m "docs: initialize bug analysis report"
```

---

### Task 3.2: Document Each Bug

**Files:**
- Modify: `docs/bug-analysis-2026-03-19.md`

For each bug discovered, add entry:

```markdown
### BUG-001: [Bug Title]

**Severity:** Critical|High|Medium|Low
**Component:** Charts|State|Auth|Data|i18n
**File:** `path/to/file.ts:123`

**Current Behavior:**
Description of what currently happens.

**Expected Behavior:**
Description of what should happen.

**Root Cause:**
Analysis of why this happens.

**Reproduction:**
1. Step one
2. Step two
3. Observe incorrect behavior

**Fix Status:** Pending|In Progress|Fixed
```

- [ ] **Step 1: Add all discovered bugs to report**

Iterate through findings from Phase 1 and 2, adding each bug.

- [ ] **Step 2: Update summary counts**

Update the summary table with accurate counts.

- [ ] **Step 3: Commit bug documentation**

```bash
git add docs/bug-analysis-2026-03-19.md
git commit -m "docs: document N functional bugs"
```

---

### Task 3.3: Create Structured JSON

**Files:**
- Create: `docs/bug-analysis-2026-03-19.json`

- [ ] **Step 1: Create JSON structure**

```json
{
  "analysis": {
    "date": "2026-03-19",
    "repository": "vizuelni-admin-srbije",
    "focus": "functional-correctness"
  },
  "summary": {
    "critical": 0,
    "high": 0,
    "medium": 0,
    "low": 0,
    "total": 0
  },
  "bugs": []
}
```

- [ ] **Step 2: Add bug entries**

For each bug in the markdown report, add JSON entry:

```json
{
  "id": "BUG-001",
  "title": "Bug Title",
  "severity": "high",
  "component": "charts",
  "file": "src/components/charts/ChartRenderer.tsx",
  "line": 123,
  "status": "pending"
}
```

- [ ] **Step 3: Commit JSON file**

```bash
git add docs/bug-analysis-2026-03-19.json
git commit -m "docs: add structured bug data"
```

---

## Phase 4: Prioritized Fixes

### Task 4.1: Fix Critical Bugs

For each Critical bug, follow this template:

**Files:**
- Modify: Bug's source file
- Create/Modify: Test file for bug

- [ ] **Step 1: Create fix branch**

```bash
git checkout -b fix/BUG-XXX-brief-description
```

- [ ] **Step 2: Write failing test**

Create test that demonstrates the bug:

```typescript
// tests/unit/path/to/test.test.ts
describe('BUG-XXX: Bug description', () => {
  it('should handle edge case correctly', () => {
    // Arrange
    const input = /* problematic input */;

    // Act
    const result = functionUnderTest(input);

    // Assert
    expect(result).toBe(expectedOutput);
  });
});
```

- [ ] **Step 3: Run test to verify failure**

Run: `npm test -- tests/unit/path/to/test.test.ts`
Expected: FAIL

- [ ] **Step 4: Implement minimal fix**

Make the smallest change to fix the bug.

- [ ] **Step 5: Run test to verify pass**

Run: `npm test -- tests/unit/path/to/test.test.ts`
Expected: PASS

- [ ] **Step 6: Run full test suite**

Run: `npm test`
Expected: All tests pass

- [ ] **Step 7: Update bug status**

Update `docs/bug-analysis-2026-03-19.md` and `.json` with fix status.

- [ ] **Step 8: Commit fix**

```bash
git add .
git commit -m "fix(component): brief description (BUG-XXX)

- What was wrong
- How it was fixed
- Test added

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

- [ ] **Step 9: Merge to main**

```bash
git checkout main
git merge fix/BUG-XXX-brief-description
```

**Repeat for each Critical bug.**

---

### Task 4.2: Fix High Bugs

Follow the same template as Task 4.1 for each High severity bug.

- [ ] **Complete all High severity bug fixes**

---

### Task 4.3: Fix Medium Bugs (Time Permitting)

Follow the same template as Task 4.1 for each Medium severity bug.

- [ ] **Complete Medium severity bug fixes as time allows**

---

### Task 4.4: Final Validation

**Files:**
- Review: All modified files

- [ ] **Step 1: Run full test suite**

Run: `npm test`
Expected: All tests pass

- [ ] **Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Update final bug report**

Update summary with fixed counts:

```markdown
## Summary

| Severity | Count | Fixed |
|----------|-------|-------|
| Critical | X | X |
| High | Y | Y |
| Medium | Z | N |
| Low | N | 0 |
```

- [ ] **Step 4: Commit final report**

```bash
git add docs/bug-analysis-2026-03-19.md docs/bug-analysis-2026-03-19.json
git commit -m "docs: complete functional bug analysis

- X Critical bugs fixed
- Y High bugs fixed
- Z Medium bugs documented
- N Low bugs documented for backlog"
```

---

## Deliverables Checklist

- [ ] `docs/bug-analysis-tsc-output.txt` - TypeScript errors
- [ ] `docs/bug-analysis-eslint-output.txt` - ESLint issues
- [ ] `docs/bug-analysis-jest-output.txt` - Test results
- [ ] `docs/bug-analysis-knip-output.txt` - Dead code analysis
- [ ] `docs/bug-analysis-2026-03-19.md` - Main bug report
- [ ] `docs/bug-analysis-2026-03-19.json` - Structured bug data
- [ ] All Critical bugs fixed with tests
- [ ] All High bugs fixed with tests
- [ ] Full test suite passing
- [ ] TypeScript compilation clean
