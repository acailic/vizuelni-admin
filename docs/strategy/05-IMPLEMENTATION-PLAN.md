# Implementation Plan

> **Sprint Plan (12 Sprints), KPI Dashboard, Resource Model, Risk Register with Financial Impact, Financial Contingency**

---

## 1. Sprint Plan (12 Two-Week Sprints)

### Overview

| Phase             | Sprints | Features               | Focus                                      |
| ----------------- | ------- | ---------------------- | ------------------------------------------ |
| **Foundation**    | 1-4     | 29, 30, 31, 38         | App Shell, Homepage, Gallery, Showcase     |
| **Core Features** | 5-8     | 37, 32, 35, 33         | Data Library, Dashboard, Search, PWA       |
| **Enhancements**  | 9-12    | 36, 34, Polish, Launch | PDF Reports, Notifications, Polish, Launch |

### Sprint Details

#### Sprint 1: App Shell Foundation (Feature 29)

**Duration**: 2 weeks | **Effort**: 2 person-weeks

| Week | Tasks                                                                   | Deliverables                                  |
| ---- | ----------------------------------------------------------------------- | --------------------------------------------- |
| 1    | Create AppShell component, Sidebar navigation, Sidebar state management | Collapsible sidebar with logo and 4 nav items |
| 2    | AppHeader with search, Language switcher, User menu                     | Header with all components integrated         |

**Acceptance Criteria**:

- [ ] Sidebar renders with logo and 4 nav items
- [ ] Sidebar collapses/expands with toggle
- [ ] Active nav item is highlighted
- [ ] State persists across page reloads

---

#### Sprint 2: Homepage Landing (Feature 30)

**Duration**: 2 weeks | **Effort**: 1.5 person-weeks

| Week | Tasks                                                  | Deliverables                  |
| ---- | ------------------------------------------------------ | ----------------------------- |
| 1    | HeroSection component, QuickStats component            | Hero with CTAs, stats section |
| 2    | GettingStartedGuide component, Integrate with page.tsx | Complete homepage             |

**Acceptance Criteria**:

- [ ] Hero section with title, subtitle, CTAs
- [ ] Quick stats show dataset/chart counts
- [ ] Getting started guide with 3 steps
- [ ] All CTAs link correctly

---

#### Sprint 3: Gallery Page (Feature 31)

**Duration**: 2 weeks | **Effort**: 1.5 person-weeks

| Week | Tasks                                           | Deliverables                         |
| ---- | ----------------------------------------------- | ------------------------------------ |
| 1    | GalleryPage, GalleryFilterBar, GalleryChartCard | Gallery with filters and cards       |
| 2    | Chart detail page, EmbedCodeGenerator           | Detail page with embed functionality |

**Acceptance Criteria**:

- [ ] Gallery page with filter bar and grid
- [ ] Search filters by title
- [ ] Chart type and sort filters work
- [ ] Detail page with embed generator

---

#### Sprint 4: Chart Showcase Gallery (Feature 38)

**Duration**: 2 weeks | **Effort**: 2 person-weeks

| Week | Tasks                                                                | Deliverables                    |
| ---- | -------------------------------------------------------------------- | ------------------------------- |
| 1    | Extend types, Create data files, Showcase examples                   | 5 showcase datasets and configs |
| 2    | ShowcaseCard, ShowcaseGrid, TemplatesPanel, Landing page integration | Showcase section on homepage    |

**Acceptance Criteria**:

- [ ] Showcase section on landing page
- [ ] Category filter pills work
- [ ] "Edit" button navigates to configurator
- [ ] Templates panel in configurator

---

#### Sprint 5: Serbian Data Library (Feature 37)

**Duration**: 2 weeks | **Effort**: 2 person-weeks

| Week | Tasks                                                 | Deliverables                |
| ---- | ----------------------------------------------------- | --------------------------- |
| 1    | Types, Registry, Converter, Data files                | 7 demographics datasets     |
| 2    | SerbianDataLibrary component, Create page integration | Data library in Browse page |

**Acceptance Criteria**:

- [ ] Serbian datasets in Browse page
- [ ] 7 demographics datasets available
- [ ] "Create Chart" loads dataset in configurator
- [ ] i18n supported

---

#### Sprint 6: User Dashboard (Feature 32)

**Duration**: 2 weeks | **Effort**: 1 person-week

| Week | Tasks                                      | Deliverables                    |
| ---- | ------------------------------------------ | ------------------------------- |
| 1    | Dashboard page, My Charts tab, Chart cards | Dashboard with chart management |
| 2    | Edit/Delete functionality, Empty states    | Complete dashboard              |

**Acceptance Criteria**:

- [ ] Dashboard requires authentication
- [ ] My Charts shows all user's charts
- [ ] Edit/Delete buttons work
- [ ] Empty state shows when no charts

---

#### Sprint 7: Advanced Search (Feature 35)

**Duration**: 2 weeks | **Effort**: 3 person-weeks

| Week | Tasks                                         | Deliverables               |
| ---- | --------------------------------------------- | -------------------------- |
| 1    | Search API, SearchBar with autocomplete       | Enhanced search bar        |
| 2    | FilterPanel, SearchResults, Faceted filtering | Complete search experience |

**Acceptance Criteria**:

- [ ] Full-text search across datasets
- [ ] Faceted filtering works
- [ ] Search suggestions appear
- [ ] Active filters shown as pills

---

#### Sprint 8: Progressive Web App (Feature 33)

**Duration**: 2 weeks | **Effort**: 1.5 person-weeks

| Week | Tasks                                        | Deliverables    |
| ---- | -------------------------------------------- | --------------- |
| 1    | Manifest.json, Service worker, PWA meta tags | Installable app |
| 2    | Install prompt component, Offline fallback   | Complete PWA    |

**Acceptance Criteria**:

- [ ] Lighthouse PWA score ≥ 90
- [ ] App installable on mobile
- [ ] Basic offline functionality
- [ ] Charts load from cache

---

#### Sprint 9: PDF Report Generation (Feature 36)

**Duration**: 2 weeks | **Effort**: 1.5 person-weeks

| Week | Tasks                                   | Deliverables        |
| ---- | --------------------------------------- | ------------------- |
| 1    | Install dependencies, PDFReportTemplate | PDF template        |
| 2    | API endpoint, Export button integration | Complete PDF export |

**Acceptance Criteria**:

- [ ] Export single chart as PDF
- [ ] PDF includes chart, title, metadata
- [ ] Download works in all browsers

---

#### Sprint 10: Notification System (Feature 34)

**Duration**: 2 weeks | **Effort**: 1.5 person-weeks

| Week | Tasks                                 | Deliverables             |
| ---- | ------------------------------------- | ------------------------ |
| 1    | Prisma model migration, API endpoints | Notification backend     |
| 2    | NotificationBell, NotificationPanel   | Complete notification UI |

**Acceptance Criteria**:

- [ ] Notification bell in header
- [ ] Badge shows unread count
- [ ] Mark as read works
- [ ] Notifications link to pages

---

#### Sprint 11: Polish & Bug Fixes

**Duration**: 2 weeks | **Effort**: 2 person-weeks

| Week | Tasks                                         | Deliverables              |
| ---- | --------------------------------------------- | ------------------------- |
| 1    | Performance optimization, Accessibility audit | Optimized, accessible app |
| 2    | Bug fixes, Documentation updates              | Stable, documented app    |

**Focus Areas**:

- Performance (Lighthouse score > 90)
- Accessibility (WCAG 2.1 AA compliance)
- Cross-browser testing
- Mobile responsiveness

---

#### Sprint 12: Launch Preparation

**Duration**: 2 weeks | **Effort**: 2 person-weeks

| Week | Tasks                                   | Deliverables                |
| ---- | --------------------------------------- | --------------------------- |
| 1    | Production deployment, Monitoring setup | Live production environment |
| 2    | Launch materials, Support documentation | Launch-ready platform       |

**Launch Checklist**:

- [ ] Production deployment complete
- [ ] DNS configured
- [ ] SSL certificates valid
- [ ] Monitoring active (Sentry, Plausible)
- [ ] Support documentation published
- [ ] Launch announcements prepared

---

## 2. KPI Dashboard

### Product Metrics

| Metric               | Definition                 | Year 1 Target | Year 2 Target | Year 3 Target |
| -------------------- | -------------------------- | ------------- | ------------- | ------------- |
| **MAU**              | Monthly Active Users       | 500           | 2,000         | 5,000         |
| **Charts Created**   | Total visualizations       | 500           | 2,500         | 10,000        |
| **Embeds**           | Charts embedded externally | 50            | 250           | 1,000         |
| **Dataset Coverage** | data.gov.rs datasets used  | 50            | 200           | 500           |

### Growth Metrics

| Metric                 | Definition                 | Year 1 Target | Year 2 Target | Year 3 Target |
| ---------------------- | -------------------------- | ------------- | ------------- | ------------- |
| **Signups**            | New user registrations     | 200           | 1,000         | 3,000         |
| **Activation Rate**    | Signups who create chart   | 40%           | 50%           | 60%           |
| **Retention (Week 4)** | Users active after 4 weeks | 20%           | 30%           | 40%           |
| **NPS**                | Net Promoter Score         | 30            | 40            | 50            |

### Revenue Metrics

| Metric               | Definition                | Year 1 Target | Year 2 Target | Year 3 Target |
| -------------------- | ------------------------- | ------------- | ------------- | ------------- |
| **MRR**              | Monthly Recurring Revenue | €1,500        | €6,000        | €15,000       |
| **Paying Customers** | Total paid subscriptions  | 30            | 100           | 300           |
| **ARPU**             | Average Revenue Per User  | €50/mo        | €60/mo        | €50/mo        |
| **Enterprise Deals** | Annual contracts          | 3             | 8             | 15            |

### Quality Metrics

| Metric                | Definition                | Target | Alert Threshold |
| --------------------- | ------------------------- | ------ | --------------- |
| **Uptime**            | Platform availability     | 99.5%  | <99%            |
| **P95 Response Time** | 95th percentile load time | <1s    | >3s             |
| **Error Rate**        | Application errors        | <0.1%  | >1%             |
| **Lighthouse Score**  | Performance rating        | >90    | <70             |

### Community Metrics

| Metric                  | Definition             | Year 1 Target | Year 2 Target | Year 3 Target |
| ----------------------- | ---------------------- | ------------- | ------------- | ------------- |
| **GitHub Stars**        | Repository stars       | 500           | 2,000         | 5,000         |
| **Contributors**        | Code contributors      | 5             | 20            | 50            |
| **Community Templates** | Shared chart templates | 10            | 50            | 200           |
| **Discord Members**     | Community server       | 100           | 500           | 1,500         |

### Quarterly KPI Review Schedule

| Quarter | Review Date | Focus                                 |
| ------- | ----------- | ------------------------------------- |
| Q1 2026 | April 1     | Foundation metrics, early adoption    |
| Q2 2026 | July 1      | Growth metrics, feature adoption      |
| Q3 2026 | October 1   | Revenue metrics, partnership progress |
| Q4 2026 | January 1   | Year 1 review, Year 2 planning        |

---

## 3. Resource Model

### Solo Developer Reality

**Available Time**: ~40 hours/week (full-time equivalent)

| Activity            | Hours/Week | Percentage |
| ------------------- | ---------- | ---------- |
| Feature Development | 24         | 60%        |
| Bug Fixes & Support | 8          | 20%        |
| Documentation       | 4          | 10%        |
| Meetings & Planning | 4          | 10%        |

### Feature Effort Estimates

| Feature           | Effort (weeks) | Development Hours |
| ----------------- | -------------- | ----------------- |
| 29: App Shell     | 2              | 80                |
| 30: Homepage      | 1.5            | 60                |
| 31: Gallery       | 1.5            | 60                |
| 32: Dashboard     | 1              | 40                |
| 33: PWA           | 1.5            | 60                |
| 34: Notifications | 1.5            | 60                |
| 35: Search        | 3              | 120               |
| 36: PDF Reports   | 1.5            | 60                |
| 37: Data Library  | 2              | 80                |
| 38: Showcase      | 2              | 80                |
| **Total**         | **17.5**       | **700**           |

### Timeline with Realistic Buffer

| Phase       | Features       | Weeks  | Buffer | Total  |
| ----------- | -------------- | ------ | ------ | ------ |
| Foundation  | 29, 30, 31, 38 | 7      | 1      | 8      |
| Core        | 37, 32, 35, 33 | 8      | 2      | 10     |
| Enhancement | 36, 34, Polish | 4      | 1      | 5      |
| Launch      | Prep           | 1      | 0      | 1      |
| **Total**   |                | **20** | **4**  | **24** |

### Resource Constraints

| Constraint     | Impact          | Mitigation                        |
| -------------- | --------------- | --------------------------------- |
| Solo developer | Slower progress | Prioritize ruthlessly             |
| No designer    | UI quality risk | Use design system, Swiss patterns |
| No QA          | Bug risk        | Automated tests, E2E tests        |
| No marketing   | Slow growth     | Content marketing, community      |

### Scaling Triggers

| Trigger   | Action                   | Timeline  |
| --------- | ------------------------ | --------- |
| 1,000 MAU | Consider contractor help | Month 6-9 |
| €3K MRR   | Hire junior developer    | Month 12  |
| 5,000 MAU | Full team (3-4 people)   | Year 2    |
| €15K MRR  | Team expansion, office   | Year 3    |

---

## 4. Enhanced Risk Register with Financial Impact

### Risk Quantification

| ID      | Risk                   | Probability | Impact   | Financial Impact             | Risk Score |
| ------- | ---------------------- | ----------- | -------- | ---------------------------- | ---------- |
| FM-1    | data.gov.rs shutdown   | 10%         | Critical | €50K lost revenue            | €5K        |
| FM-2    | No agency adoption     | 30%         | Critical | €100K opportunity cost       | €30K       |
| FM-3    | Free competitor        | 25%         | High     | €50K revenue loss            | €12.5K     |
| FM-4    | Grant failure          | 50%         | High     | €88K lost funding            | €44K       |
| FM-5    | Key dev leaves         | 20%         | Critical | €30K replacement + 3mo delay | €6K        |
| FM-6    | Security breach        | 5%          | Critical | €100K+ liability             | €5K        |
| FM-7    | Political change       | 15%         | High     | €30K lost contracts          | €4.5K      |
| FM-8    | Performance issues     | 30%         | Medium   | €10K infrastructure + churn  | €3K        |
| **New** | Tech debt accumulation | 60%         | Medium   | €20K refactoring cost        | €12K       |
| **New** | Next.js major version  | 40%         | Medium   | €15K migration effort        | €6K        |

**Total Expected Risk Exposure**: €128K

### New Risks (Post-28 Features)

#### FM-9: Tech Debt Accumulation

**Probability**: High (60%) | **Impact**: Medium | **Financial Impact**: €20K

**Context**: 28 features implemented without dedicated refactoring time.

**Mitigation**:

- Allocate 20% of each sprint to tech debt
- Quarterly architecture reviews
- Automated code quality gates

#### FM-10: Next.js Major Version Migration

**Probability**: Medium (40%) | **Impact**: Medium | **Financial Impact**: €15K

**Context**: Next.js 15+ may require migration from App Router patterns.

**Mitigation**:

- Monitor Next.js releases
- Avoid experimental features
- Document migration path early

---

## 5. 5×5 Probability-Impact Matrix

```
                              IMPACT
                    │ Negligible │ Minor │ Moderate │ Major │ Catastrophic
                    │    (1)     │  (2)  │   (3)    │  (4)  │     (5)
         ───────────┼────────────┼───────┼──────────┼───────┼─────────────
         Almost     │            │       │          │       │
         Certain    │            │       │          │ FM-8  │
         (5)        │            │       │          │ (30%) │
         ───────────┼────────────┼───────┼──────────┼───────┼─────────────
         Likely     │            │ FM-9  │ FM-10    │ FM-4  │
         (4)        │            │(60%)  │ (40%)    │ (50%) │
PROB     ───────────┼────────────┼───────┼──────────┼───────┼─────────────
         Possible   │            │ FM-3  │ FM-2     │       │
         (3)        │            │(25%)  │ (30%)    │       │
         ───────────┼────────────┼───────┼──────────┼───────┼─────────────
         Unlikely   │            │ FM-7  │ FM-5     │       │
         (2)        │            │(15%)  │ (20%)    │       │
         ───────────┼────────────┼───────┼──────────┼───────┼─────────────
         Rare       │            │       │ FM-1     │ FM-6  │
         (1)        │            │       │ (10%)    │ (5%)  │
         ───────────┴────────────┴───────┴──────────┴───────┴─────────────

         Risk Levels:
         🔴 Critical (Red):     Immediate action required
         🟠 High (Orange):       Active mitigation needed
         🟡 Medium (Yellow):     Monitor and plan
         🟢 Low (Green):         Accept or transfer
```

### Risk Heat Map

| Risk Level  | Score Range | Count | Total Exposure |
| ----------- | ----------- | ----- | -------------- |
| 🔴 Critical | 15-25       | 2     | €36K           |
| 🟠 High     | 10-14       | 3     | €61K           |
| 🟡 Medium   | 5-9         | 4     | €27.5K         |
| 🟢 Low      | 1-4         | 1     | €3K            |

---

## 6. Financial Contingency

### Cash Runway Analysis

| Burn Rate            | Current Cash | Runway    |
| -------------------- | ------------ | --------- |
| €3K/month (lean)     | €50K         | 16 months |
| €5K/month (moderate) | €50K         | 10 months |
| €8K/month (growth)   | €50K         | 6 months  |

### Decision Gates

| Gate       | Trigger                        | Decision                    | Timeline        |
| ---------- | ------------------------------ | --------------------------- | --------------- |
| **Gate A** | Month 6, <100 MAU              | Pivot to media/NGO focus    | Review Month 6  |
| **Gate B** | Month 9, €0 enterprise revenue | Double down on SaaS         | Review Month 9  |
| **Gate C** | Month 12, <€3K MRR             | Seek funding or partnership | Review Month 12 |
| **Gate D** | Month 18, >€5K MRR             | Scale team                  | Review Month 18 |

### Scenario Planning

#### Scenario 1: Conservative (30% probability)

- Grant success: 20% (€20K)
- Enterprise adoption: 1-2 (€5-10K)
- SaaS growth: Slow
- **Year 1 Revenue**: €50K
- **Action**: Lean operations, focus on product-market fit

#### Scenario 2: Base (50% probability)

- Grant success: 50% (€88K)
- Enterprise adoption: 3 (€15K)
- SaaS growth: Moderate
- **Year 1 Revenue**: €126K
- **Action**: Execute roadmap, prepare for scaling

#### Scenario 3: Optimistic (20% probability)

- Grant success: 80% (€140K)
- Enterprise adoption: 5 (€25K)
- SaaS growth: Strong
- **Year 1 Revenue**: €200K+
- **Action**: Accelerate roadmap, hire early

### Break-Even Analysis

| Metric                    | Value                        |
| ------------------------- | ---------------------------- |
| Monthly Burn              | €3,850                       |
| SaaS ARPU (Pro)           | €29                          |
| Enterprise ARPU           | €5,000                       |
| Break-even SaaS customers | 133 (Pro only)               |
| Break-even Enterprise     | 1 per month                  |
| Break-even blended        | 60 SaaS + 1 Enterprise/month |

**Projected Break-Even**: Month 18-24 (base scenario)

### Emergency Fund

| Purpose                  | Amount   | Trigger                       |
| ------------------------ | -------- | ----------------------------- |
| Technical emergency      | €5K      | Security breach, data loss    |
| Opportunity fund         | €10K     | Unexpected partnership, event |
| Runway buffer            | €15K     | Revenue shortfall             |
| **Total Emergency Fund** | **€30K** |                               |

---

## 7. Escalation Protocol

### Trigger Thresholds

| Indicator          | Yellow     | Red               | Escalation                 |
| ------------------ | ---------- | ----------------- | -------------------------- |
| data.gov.rs uptime | 95-99%     | <95%              | Immediate technical review |
| MAU growth         | 0-10%      | Negative          | Product review             |
| Grant rejection    | 2 in a row | 3 in a row        | Funding strategy review    |
| Team stability     | N/A        | Key person leaves | Emergency hiring           |
| Performance (p95)  | 1-3s       | >3s               | Infrastructure review      |

### Escalation Contacts

| Level | Contact        | Response Time |
| ----- | -------------- | ------------- |
| L1    | Tech Lead      | 4 hours       |
| L2    | Product Owner  | 24 hours      |
| L3    | Director/Board | 48 hours      |

---

## 8. Summary

### Key Milestones

| Date    | Milestone           | Deliverable            |
| ------- | ------------------- | ---------------------- |
| Week 4  | Foundation Complete | App Shell, Homepage    |
| Week 8  | Gallery + Showcase  | Public-facing features |
| Week 16 | Core Features       | Dashboard, Search, PWA |
| Week 20 | All Features        | PDF, Notifications     |
| Week 24 | Launch              | Production ready       |

### Success Criteria

**Year 1 Success**:

- ✅ 500+ MAU
- ✅ 500 charts created
- ✅ 3 enterprise customers
- ✅ €126K total revenue
- ✅ 500 GitHub stars

**Year 3 Success**:

- ✅ 5,000+ MAU
- ✅ Self-sustaining (no grant dependency)
- ✅ Regional expansion begun
- ✅ 15 enterprise customers

---

_Source Documents: [FAILURE_MODE_ANALYSIS.md](../FAILURE_MODE_ANALYSIS.md), [STRATEGIC_SUCCESS_PLAN.md](../STRATEGIC_SUCCESS_PLAN.md), [recipes/inputs/feature-29-38-_.md](../../recipes/inputs/)\*

_Last Updated: 2026-03-16_
