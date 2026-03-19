# Bug Fixes Log - vizualni-admin

**Started:** 2026-03-19 **Method:** TDD approach for each fix

## Fix Progress

| ID      | Severity | Title                                       | Status                         |
| ------- | -------- | ------------------------------------------- | ------------------------------ |
| BUG-001 | Critical | Command Injection in Python Runner          | ✅ Fixed                       |
| BUG-002 | Critical | Path Traversal in Temp File Creation        | ✅ Fixed                       |
| BUG-003 | Critical | Mocked Prisma Client in Production          | ✅ Fixed                       |
| BUG-004 | Critical | Unsafe Type Assertion (filters.tsx)         | ✅ Fixed                       |
| BUG-005 | Critical | Unsafe Type Assertions (configurator-state) | ✅ Fixed                       |
| BUG-006 | Critical | Race Condition in Data Source Store         | ✅ Fixed                       |
| BUG-007 | High     | Vulnerable serialize-javascript             | Pending                        |
| BUG-008 | High     | Vulnerable rollup                           | Pending                        |
| BUG-009 | High     | Development Auth Bypass                     | Pending                        |
| BUG-010 | High     | Middleware Disabled                         | Pending                        |
| BUG-011 | High     | Stale Closure in Configurator               | Pending                        |
| BUG-012 | High     | Unhandled Promise Rejection                 | Pending                        |
| BUG-013 | High     | Event Listener Not Removed                  | Pending                        |
| BUG-014 | High     | No Timeout on Fetch Calls                   | Pending                        |
| BUG-015 | High     | Command Injection in Subprocess             | ✅ Fixed (merged with BUG-002) |

---

## Fix Details

### BUG-001: Command Injection in Python Runner ✅

**File:** `app/lib/python-runner.ts` **Fix:** Replaced `exec` with `spawn` for
safer command execution. Added argument validation to reject shell
metacharacters.

### BUG-002: Path Traversal in Temp File Creation ✅

**File:** `app/pages/api/insights/analyze.ts` **Fix:**

- Replaced `exec` with `spawn` for safer command execution
- Added input validation for locale (whitelist) and maxInsights (bounds check)
- Used `os.tmpdir()` and `crypto.randomBytes()` for secure temp file creation
- Added proper cleanup in finally block

### BUG-003: Mocked Prisma Client in Production ✅

**File:** `app/db/client.ts` **Fix:** Added `createPrismaClient()` async
function for proper database initialization when DATABASE_URL is set. Added
`hasDatabase` export for conditional logic.

### BUG-004: Unsafe Type Assertion (filters.tsx) ✅

**File:** `app/configurator/components/filters.tsx:314` **Fix:** Replaced
`sortFilterValues(group as any)` with properly typed tuple return type
`[string, HierarchyValue[]]`.

### BUG-005: Unsafe Type Assertions (configurator-state) ✅

**File:** `app/configurator/configurator-state/index.tsx` **Fix:**

- Imported `LayoutDashboardFreeCanvas` type
- Rewrote `isLayoutingFreeCanvas` to use proper type narrowing with
  `"layout" in s` check
- Removed `as any` from field access by using explicit type assertion

### BUG-006: Race Condition in Data Source Store ✅

**File:** `app/stores/data-source.ts` **Fix:** Added `routerSubscriptions`
WeakMap to track and cleanup router event subscriptions when the store is
recreated.
