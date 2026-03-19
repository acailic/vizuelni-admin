# Bug Analysis Report - vizualni-admin

**Generated:** 2026-03-19 **Analyzer:** Claude Opus 4.6 **Method:** Layered
Multi-Pass Analysis

## Executive Summary

A comprehensive bug analysis of the vizualni-admin repository identified **53
issues** across 4 categories:

| Severity    | Count | Description                            |
| ----------- | ----- | -------------------------------------- |
| 🔴 Critical | 6     | Security exploits, data loss potential |
| 🟠 High     | 19    | Major feature failures, security risks |
| 🟡 Medium   | 19    | Feature degradation, poor UX           |
| 🟢 Low      | 9     | Code quality, maintainability          |

## Critical Issues (Immediate Action Required)

### 1. Command Injection in Python Runner

- **File:** `app/lib/python-runner.ts:95`
- **Category:** Security
- **Risk:** Remote code execution if attacker controls input
- **Fix:** Use `child_process.spawn` with strict input validation

### 2. Path Traversal in Temp File Creation

- **File:** `app/pages/api/insights/analyze.ts:26-47`
- **Category:** Security/Integration
- **Risk:** Arbitrary file write outside temp directory
- **Fix:** Validate input data, use secure temp file creation

### 3. Mocked Prisma Client in Production

- **File:** `app/db/client.ts:31-41`
- **Category:** Integration
- **Risk:** No database persistence in production
- **Fix:** Implement proper Prisma client for production

### 4-7. Unsafe Type Assertions (as any)

- **Files:**
  - `app/configurator/components/filters.tsx:314`
  - `app/configurator/configurator-state/index.tsx:246-247, 301`
  - `app/graphql/hooks.ts:611`
- **Category:** Type Safety
- **Risk:** Runtime errors, bypassed type checking
- **Fix:** Properly type parameters or create type guards

### 8. Race Condition in Data Source Store

- **File:** `app/stores/data-source.ts:133`
- **Category:** Logic
- **Risk:** Memory leaks, state corruption
- **Fix:** Add cleanup logic for router event listeners

## High Priority Issues

### Dependency Vulnerabilities

- `serialize-javascript ≤7.0.2` - RCE vulnerability (CVE GHSA-5c6j-r48x-rmvq)
- `rollup ≥4.0.0 <4.59.0` - Path traversal (CVE-2026-27606)

### Authentication

- Development auth bypass in `app/pages/api/auth/[...nextauth].ts:32-47`
- Middleware disabled in `app/middleware.ts:346-348`

### Missing Error Handling

- `app/configurator/components/configurator.tsx:223` - Unhandled promise
- `app/lib/dataset-service.ts:32-44` - No timeout on fetch calls
- `app/hooks/use-dataset-insights.ts:200-213` - No timeout/retry

### Resource Leaks

- `app/hooks/use-keyboard-navigation.ts:74` - Event listener not removed
- `app/utils/use-screenshot.ts:103` - DOM elements not cleaned

### Type Safety

- Multiple `@ts-ignore` comments hiding type errors
- Non-null assertions (`!`) without proper checks

## Medium Priority Issues

### Cache Issues

- Silent cache failures in `app/lib/cache/multi-level-cache.ts:287-289`
- Aggressive cache cleanup in `app/hooks/use-data-cache.ts:385-387`

### Missing Validation

- No locale validation in `app/pages/api/statistics/summary.ts:9-10`
- Missing input validation at API boundaries

### State Management

- Stale closure in `app/configurator/configurator-state/context.tsx:302`
- Empty useEffect dependency array

## Low Priority Issues

- Dynamic code execution in chart components
- Console.log used for error logging
- Generic type constraints too permissive
- Hardcoded array indices

## Recommendations

1. **Immediate:** Fix command injection and path traversal vulnerabilities
2. **This Week:** Update vulnerable dependencies (serialize-javascript, rollup)
3. **This Week:** Enable middleware for route protection
4. **This Sprint:** Replace `as any` with proper types
5. **Ongoing:** Add comprehensive error handling and input validation

## Files Requiring Most Attention

1. `app/lib/python-runner.ts` - Command injection
2. `app/pages/api/insights/analyze.ts` - Path traversal
3. `app/db/client.ts` - Production database
4. `app/configurator/configurator-state/index.tsx` - Multiple type issues
5. `app/middleware.ts` - Disabled protection
