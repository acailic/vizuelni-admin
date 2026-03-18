# QA Test Report: Vizualni Admin GitHub Pages

## https://acailic.github.io/vizualni-admin/sr-Cyrl/

---

## 📋 Executive Summary

**Repository:** `acailic/vizualni-admin`  
**Description:** Tool for visualizing Serbian Open Government Data 🇷🇸  
**Tech Stack:** Next.js 14+, TypeScript, Prisma (SQLite), NextAuth  
**License:** MIT

**⚠️ Critical Finding:** The GitHub Pages site is currently **not accessible** (504 Gateway Timeout). This may indicate deployment issues or static export problems.

---

## 🔒 Security Analysis: Features to HIDE on Static GitHub Pages

Since GitHub Pages serves static files with **NO backend**, **NO database**, and **NO authentication**, the following features should be hidden/disabled:

### 1. **Authentication System (CRITICAL)**

```
❌ Hide: Login/Signup buttons
❌ Hide: User profile menus
❌ Hide: Password reset flows
❌ Hide: OAuth provider buttons (Google, GitHub, etc.)
❌ Hide: Session management UI
```

**Why:** Static pages cannot verify credentials or manage sessions. Any authentication UI would be non-functional and confusing to users.

### 2. **Database-Dependent Features**

```
❌ Hide: "Save Chart" functionality
❌ Hide: "My Charts" / Dashboard
❌ Hide: Chart publishing workflow
❌ Hide: Notification system
❌ Hide: User-specific settings
```

**Why:** These features require Prisma/SQLite database which doesn't exist on GitHub Pages.

### 3. **Server-Side API Routes**

```
❌ Hide/Disable: /api/* routes
❌ Hide: Server-side data fetching
❌ Hide: Real-time data updates
❌ Hide: Rate limiting features
❌ Hide: Server-side caching
```

### 4. **Environment-Dependent Features**

```
❌ Hide: Sentry error tracking (requires DSN)
❌ Hide: Redis caching
❌ Hide: Slack webhooks
❌ Hide: AI testing features (Stagehand, LLM)
```

---

## ✅ Features to KEEP on Static GitHub Pages

These features work without a backend:

| Feature               | Works on Static? | Notes                 |
| --------------------- | ---------------- | --------------------- |
| Chart visualization   | ✅ Yes           | Client-side only      |
| data.gov.rs API calls | ✅ Yes           | Direct browser-to-API |
| Language switching    | ✅ Yes           | i18n is client-side   |
| Export to PNG/SVG     | ✅ Yes           | Client-side canvas    |
| Dark mode             | ✅ Yes           | CSS/JS only           |
| Example datasets      | ✅ Yes           | Pre-built into bundle |
| Documentation         | ✅ Yes           | Static content        |

---

## 🛠️ Recommended Static Build Configuration

### 1. Environment Variables for Static Export

```env
# .env.production for GitHub Pages
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_STATIC_MODE=true
NEXT_PUBLIC_DATABASE_ENABLED=false
NEXT_PUBLIC_AUTH_ENABLED=false
NEXT_PUBLIC_SAVE_ENABLED=false
NEXT_PUBLIC_DEFAULT_LOCALE=sr-Cyrl
NEXT_PUBLIC_SITE_URL=https://acailic.github.io/vizualni-admin/
```

### 2. Next.js Static Export Config

```javascript
// next.config.js
const nextConfig = {
  output: 'export',
  basePath: '/vizualni-admin',
  trailingSlash: true,
  images: {
    unoptimized: true, // Required for static export
  },
};
```

### 3. Conditional Feature Rendering

```typescript
// Example: Hide auth UI in static mode
{!process.env.NEXT_PUBLIC_STATIC_MODE && (
  <AuthenticationMenu />
)}

{process.env.NEXT_PUBLIC_DEMO_MODE && (
  <DemoModeBanner message="This is a demo - charts cannot be saved" />
)}
```

---

## 🧪 Test Cases for Static Deployment

| Test ID | Test Case                 | Expected Result        | Status     |
| ------- | ------------------------- | ---------------------- | ---------- |
| TC-001  | Page loads without errors | All resources load     | ❓ Timeout |
| TC-002  | Language switch works     | sr-Cyrl ↔ sr-Latn ↔ en | ⏳ Pending |
| TC-003  | Charts render correctly   | Visual output matches  | ⏳ Pending |
| TC-004  | No auth UI visible        | Login/Signup hidden    | ⏳ Pending |
| TC-005  | Export works              | PNG download works     | ⏳ Pending |
| TC-006  | API calls work            | data.gov.rs responds   | ⏳ Pending |
| TC-007  | Dark mode toggle          | Theme persists         | ⏳ Pending |
| TC-008  | No console errors         | Clean console          | ⏳ Pending |
| TC-009  | Mobile responsive         | Touch-friendly         | ⏳ Pending |
| TC-010  | Accessibility             | WCAG 2.1 AA            | ⏳ Pending |

---

## 🐛 Issues Found

### Critical Issues

1. **[P0] Site Not Accessible** - 504 Gateway Timeout
   - GitHub Pages may not have static files deployed
   - Check if `npm run export` or `next build` generated `/out` folder
   - Verify GitHub Actions workflow for deployment

### High Priority

2. **[P1] No Conditional Static Mode** - App may try to use database features
3. **[P1] API Routes Not Available** - Static export cannot include /api/\*

### Medium Priority

4. **[P2] Demo Mode Not Configured** - Users may expect save functionality
5. **[P2] Missing Base Path** - Asset paths may be wrong for subdirectory

---

## 📊 Data Visualization Suggestions for Serbian Open Data Portal

Based on the project's goal and available data.gov.rs datasets:

### 1. **Demographics Dashboard**

```
Dataset: Population by municipality
Charts: Population pyramid, growth rate, density map
Update: Annual
```

### 2. **Economic Indicators**

```
Dataset: GDP by region, unemployment, inflation
Charts: Time series, regional comparison, sector breakdown
Update: Monthly/Quarterly
```

### 3. **Health Statistics**

```
Dataset: Hospital capacity, disease incidence, vaccination rates
Charts: Trend lines, regional heatmap, facility map
Update: Monthly
```

### 4. **Education Metrics**

```
Dataset: Student enrollment, school counts, literacy rates
Charts: Bar charts, trend analysis, regional comparison
Update: Annual
```

### 5. **Environmental Data**

```
Dataset: Air quality, water quality, waste management
Charts: Time series, geographic heatmaps, compliance indicators
Update: Daily/Monthly
```

### 6. **Public Finance**

```
Dataset: Budget execution, public debt, tax revenue
Charts: Treemap, waterfall, trend analysis
Update: Quarterly
```

### 7. **Transportation**

```
Dataset: Road accidents, vehicle registrations, public transit
Charts: Trend lines, geographic distribution, mode comparison
Update: Monthly
```

---

## 🔧 Recommended Fixes

### Immediate Actions

1. **Fix Deployment Pipeline**

   ```yaml
   # .github/workflows/deploy.yml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [main]
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
         - run: npm ci
         - run: npm run build:static
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./out
   ```

2. **Add Static Export Script**

   ```json
   // package.json
   {
     "scripts": {
       "build:static": "next build && next export",
       "export": "next export"
     }
   }
   ```

3. **Feature Flags Implementation**
   ```typescript
   // src/lib/features.ts
   export const features = {
     auth: !process.env.NEXT_PUBLIC_STATIC_MODE,
     saveCharts: process.env.NEXT_PUBLIC_DATABASE_ENABLED === 'true',
     notifications: process.env.NEXT_PUBLIC_DATABASE_ENABLED === 'true',
   };
   ```

---

## 📈 Success Metrics

| Metric               | Target | How to Measure |
| -------------------- | ------ | -------------- |
| Page Load Time       | < 3s   | Lighthouse     |
| Accessibility Score  | > 90   | Lighthouse     |
| Mobile Performance   | > 80   | Lighthouse     |
| Error Rate           | 0%     | Console logs   |
| User Completion Rate | > 80%  | Analytics      |

---

## Conclusion

The Vizualni Admin project has excellent potential for Serbian government data visualization. However, for successful GitHub Pages deployment:

1. **Implement static export** with proper configuration
2. **Hide all authentication/database UI** in static mode
3. **Add feature flags** to gracefully degrade functionality
4. **Fix deployment pipeline** to generate static files

Once these issues are addressed, the site will provide valuable data visualization tools for Serbian citizens without requiring any backend infrastructure.

---

_Report generated: 2025-03-13_
_Repository: https://github.com/acailic/vizualni-admin_
