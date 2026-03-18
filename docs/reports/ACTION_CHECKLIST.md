# Immediate Action Checklist

## 🔴 Critical - Do Today

### 1. Fix Dependency Vulnerabilities

```bash
cd /home/nistrator/vizuelni-admin-srbije
npm audit fix --force
npm update @auth/core eslint-config-next ajv cookie
```

**Why:** Multiple packages have known security vulnerabilities  
**Risk:** DoS attacks, input validation bypass  
**Time:** 5 minutes

### 2. Fix Test Suite

```bash
npm install -D @playwright/test@latest
npx playwright install
npm test
```

**Why:** 70/99 test suites failing  
**Risk:** No regression detection  
**Time:** 10 minutes

### 3. Add CSRF to Remaining Routes

**Files to update:**

- `src/app/api/browse/preview/route.ts`
- `src/app/api/reports/generate/route.ts`

**Add this line at the start of POST handlers:**

```typescript
const csrfError = validateCsrf(request);
if (csrfError) return csrfError;
```

**Why:** CSRF attacks possible  
**Risk:** Unauthorized actions  
**Time:** 5 minutes

---

## ✅ Completed Fixes (Already Implemented)

1. ✅ Rate limiting middleware created
2. ✅ Gallery route authentication added
3. ✅ Chart operations made atomic
4. ✅ Notifications role check optimized
5. ✅ View counter made atomic
6. ✅ Proxy endpoint secured
7. ✅ Charts route rate limited
8. ✅ Auth options enhanced with role management

---

## 🟠 High Priority - This Week

### 4. Add Comprehensive Unit Tests

**Files needing tests:**

- `src/lib/api/rate-limit.ts`
- `src/lib/api/datagov-client.ts`
- `src/lib/data/loader.ts`
- `src/lib/charts/registry.ts`
- `src/lib/embed/generate-embed-code.ts`

**Time:** 2-3 days

### 5. Fix Accessibility Issues

- Add proper alt text to PDF images (or document limitation)
- Add ARIA labels where missing
- Test keyboard navigation

**Time:** 1 day

### 6. Add Error Boundaries

**Components needing error boundaries:**

- Dashboard
- Browse pages
- Configurator wizard
- Gallery

**Time:** 4 hours

---

## 🟡 Medium Priority - This Month

### 7. Performance Optimization

- Add database indexes
- Implement query caching
- Optimize bundle size
- Add performance monitoring

**Time:** 1 week

### 8. Security Enhancements

- Content Security Policy headers
- CORS configuration review
- Audit logging
- Security monitoring setup

**Time:** 1 week

### 9. Documentation

- API documentation updates
- Security policy documentation
- Deployment guide updates

**Time:** 2-3 days

---

## Verification Commands

After completing actions, run these to verify:

```bash
# 1. Check for TypeScript errors
npm run type-check

# 2. Run linter
npm run lint

# 3. Run tests
npm test

# 4. Build the project
npm run build

# 5. Check for vulnerabilities
npm audit

# 6. Run E2E tests
npm run test:e2e
```

---

## Success Criteria

- [ ] Zero critical security vulnerabilities
- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Build succeeds
- [ ] E2E tests passing
- [ ] Rate limiting active on all endpoints
- [ ] CSRF protection on all POST routes

---

## Support

For questions about implemented fixes:

- See `docs/reports/IMPLEMENTATION_SUMMARY_2026-03-15.md`
- See `docs/reports/EXECUTIVE_SUMMARY_2026-03-15.md`
- Review modified files in git history

---

**Last Updated:** March 15, 2026  
**Status:** 8/12 critical fixes completed
