# Embed Builder QA Fixes Design

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to
> implement this plan task-by-task.

**Goal:** Fix embed builder UX issues - layout options not reflecting in
generated code, and parameter propagation inconsistencies.

**Architecture:** Direct fixes in 2 existing files - no new abstractions needed.

**Tech Stack:** React, Next.js, TypeScript

---

## Problem Statement

### Issue 1: Layout Options UX Mismatch

- **Remove border:** Toggling adds `removeBorder=true` to URL params but the
  generated snippet always shows `border: 0;` making it appear redundant
- **Optimize space:** Adds `optimizeSpace=true` to params but iframe height
  stays at default 520px, so the option appears to do nothing

### Issue 2: Parameter Propagation Inconsistency

- `dataSource` sometimes missing from generated embed URL after editing inputs
- Likely a state update timing bug in parameter generation

---

## Design

### Fix 1: Optimize Space Height Reduction

**File:** `app/lib/embed-generator.ts`

Modify `buildIframeSnippet` to handle `optimizeSpace`:

```ts
export const buildIframeSnippet = ({
  iframeSrc,
  width,
  height,
  removeBorder,
  optimizeSpace,
}: {
  iframeSrc: string;
  width: string;
  height: string;
  removeBorder: boolean;
  optimizeSpace: boolean;
}) => {
  const borderStyle = removeBorder
    ? "border: 0;"
    : "border: 1px solid rgba(15, 23, 42, 0.16);";

  // Reduce height when optimizeSpace is true and height is default
  const effectiveHeight =
    optimizeSpace && height === "520px" ? "320px" : height;

  return `<iframe
  src="${iframeSrc}"
  style="width: ${width}; height: ${effectiveHeight}; ${borderStyle}"
  loading="lazy"
  referrerpolicy="no-referrer"
></iframe>`;
};
```

### Fix 2: Ensure Parameter Propagation on State Change

**File:** `app/pages/embed/index.tsx`

The current `passthroughParams` useMemo has correct dependencies, but we need to
ensure the call site passes `optimizeSpace` to the snippet builder.

Update the `iframeSnippet` useMemo call:

```ts
const iframeSnippet = useMemo(
  () =>
    buildIframeSnippet({
      iframeSrc,
      width: effectiveWidth,
      height: effectiveHeight,
      removeBorder: effectiveLayoutParams.removeBorder,
      optimizeSpace: effectiveLayoutParams.optimizeSpace,
    }),
  [
    effectiveHeight,
    effectiveLayoutParams.removeBorder,
    effectiveLayoutParams.optimizeSpace,
    effectiveWidth,
    iframeSrc,
  ]
);
```

---

## Tasks

### Task 1: Update buildIframeSnippet to handle optimizeSpace

**Files:**

- Modify: `app/lib/embed-generator.ts`

**Step 1: Add optimizeSpace parameter to buildIframeSnippet**

Add `optimizeSpace: boolean` to the function signature and implement height
reduction logic.

**Step 2: Update tests**

Update `app/__tests__/unit/embed-generator.test.ts` to test the new behavior.

### Task 2: Update embed page to pass optimizeSpace

**Files:**

- Modify: `app/pages/embed/index.tsx`

**Step 1: Pass optimizeSpace to buildIframeSnippet**

Update the `iframeSnippet` useMemo to include `optimizeSpace` parameter.

---

## Verification

1. Run unit tests: `yarn vitest run app/__tests__/unit/embed-generator.test.ts`
2. Type check: `npx tsc --noEmit`
3. Manual testing: Toggle layout options in embed builder and verify generated
   code changes
