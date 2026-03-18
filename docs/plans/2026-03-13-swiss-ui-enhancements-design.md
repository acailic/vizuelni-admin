---
name: Swiss UI Enhancements
description: Add Swiss-inspired browse filters, statistics dashboard, and feedback system
type: feature
date: 2026-03-13
status: draft
---

# Swiss UI Enhancements Design Spec

## Overview

This feature adds three Swiss-inspired UI components to the Vizuelni Admin Srbije platform:

1. **Enhanced Browse** (Primary) - Faceted browse with theme categories, organizations, and filters
2. **Statistics Dashboard** - Public page showing platform engagement metrics
3. **Feedback System** - Bug report and feature request channels via email templates

Based on research of visualize.admin.ch (Swiss government visualization platform).

## Component 1: Enhanced Browse Page

### Overview

Transform `/browse` from a simple dataset list into a faceted browse experience with filter categories.

### UI Components

#### Theme Categories Panel

- Displays topic categories (e.g., Administration, Agriculture, Health)
- Shows count badges (e.g., "Administration 55")
- Collapsible sections with "Show all" expansion
- Click filters the dataset list

#### Organizations Panel

- Lists data source organizations
- Count badges per organization
- Collapsible with expansion

#### Term Sets Panel (Phase 2)

- Shows common dimensions/filters across datasets
- Count badges
- Can be implemented later

### Layout

```
┌─────────────────────────────────────────────────┐
│ Search: [________________] [Search]             │
│ ☐ Include draft datasets    Sort: [Newest ▼]   │
├──────────────┬──────────────────────────────────┤
│ THEMES       │                                  │
│ ├ Admin (55) │   Dataset Cards                  │
│ ├ Agri (86)  │   ┌────────────────────────┐     │
│ ├ Health(25) │   │ Dataset 1              │     │
│ └ ...        │   │ Description...         │     │
│              │   └────────────────────────┘     │
│ ORGS         │   ┌────────────────────────┐     │
│ ├ FOAG (49)  │   │ Dataset 2              │     │
│ ├ FOEN (48)  │   │ Description...         │     │
│ └ ...        │   └────────────────────────┘     │
└──────────────┴──────────────────────────┘
```

### Files to Create/Modify

| File                                           | Purpose                                              |
| ---------------------------------------------- | ---------------------------------------------------- |
| `src/app/[locale]/browse/page.tsx`             | Add sidebar layout to existing page                  |
| `src/components/browse/FilterSidebar.tsx`      | New sidebar wrapper (or enhance existing)            |
| `src/components/browse/ThemeFilter.tsx`        | Theme categories component (uses BrowseFacets)       |
| `src/components/browse/OrganizationFilter.tsx` | Organizations component (uses BrowseFacets)          |
| `src/lib/browse/filter-queries.ts`             | Server-side queries (extends existing)               |
| `src/types/browse.ts`                          | Add FilterSection type if needed                     |

### Data Model

Uses existing types from `src/types/browse.ts`:

```typescript
// Existing types - reuse these
interface BrowseSearchParams {
  q?: string;
  page?: number;
  pageSize?: number;
  organization?: string;
  topic?: string;
  sort?: string;
  // ... other existing fields
}

interface BrowseFacets {
  organizations: FacetOption[];
  topics: FacetOption[];
  formats: FacetOption[];
  frequencies: FacetOption[];
}

interface FacetOption {
  value: string;
  label: string;
  count?: number;
}
```

New types for sidebar display:

```typescript
interface FilterSection {
  title: string; // Localized
  type: 'theme' | 'organization';
  options: FacetOption[];
  expanded: boolean;
}
```

---

## Component 2: Statistics Dashboard

### Overview

New public `/statistics` page showing platform engagement metrics and popular charts.

### Metrics to Display

#### Chart Creation Statistics

- Total charts created by users
- Charts per month average
- Total dashboards count

#### View Statistics

- Total views (all time)
- Views per month average
- Preview counts

#### Most Popular Charts

- Top 25 charts (all time) with thumbnails, titles, view counts
- Top 25 charts (last 30 days) with same format
- Clickable to view the actual chart

#### Dataset Statistics

- Total datasets available
- Datasets used in charts
- Data source organizations count

### Layout

```
┌─────────────────────────────────────────────────┐
│ Statistics                                       │
├─────────────────────────────────────────────────┤
│ ┌───────────────┐ ┌───────────────┐             │
│ │ 3,360         │ │ 1,777,047     │             │
│ │ charts created│ │ total views   │             │
│ │ ~45/month     │ │ ~88,852/mo    │             │
│ └───────────────┘ └───────────────┘             │
├─────────────────────────────────────────────────┤
│ Most Popular Charts (All Time)                   │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐             │
│ │ Chart 1 │ │ Chart 2 │ │ Chart 3 │ ...         │
│ │ 15,432  │ │ 12,891  │ │ 9,234   │ views      │
│ └─────────┘ └─────────┘ └─────────┘             │
├─────────────────────────────────────────────────┤
│ Most Popular Charts (Last 30 Days)              │
│ [Same format as above]                          │
└─────────────────────────────────────────────────┘
```

### Files to Create

| File                                              | Purpose                           |
| ------------------------------------------------- | --------------------------------- |
| `src/app/[locale]/statistics/page.tsx`            | Statistics page                   |
| `src/components/statistics/StatCard.tsx`          | Metric display card               |
| `src/components/statistics/StatsOverview.tsx`     | Overview section with key metrics |
| `src/components/statistics/PopularChartsGrid.tsx` | Chart thumbnails grid             |
| `src/components/statistics/PopularChartCard.tsx`  | Individual chart card             |
| `src/lib/statistics/queries.ts`                   | Database queries for stats        |
| `src/lib/statistics/types.ts`                     | TypeScript types                  |
| `src/app/api/statistics/route.ts`                 | API endpoint for stats data       |

### API Response Schema

```typescript
interface StatisticsResponse {
  charts: {
    total: number;
    perMonthAverage: number;
    dashboards: number;
  };
  views: {
    total: number;
    perMonthAverage: number;
    previews: number;
  };
  popularCharts: {
    allTime: PopularChart[];
    last30Days: PopularChart[];
  };
  datasets: {
    total: number;
    usedInCharts: number;
    organizations: number;
  };
}

interface PopularChart {
  id: string;
  title: string;
  thumbnail: string | null;
  views: number;
  createdAt: string;
  createdBy: string | null;
}
```

---

## Component 3: Feedback System

### Overview

Add bug report and feature request channels via email templates, accessible from footer.

### UI Components

#### Footer Feedback Section

- "Found a bug?" link with pre-filled email template
- "New feature request" link with structured email template

#### Email Templates

Pre-filled `mailto:` links with structured templates:

**Bug Report Template:**

- Bug description
- Steps to reproduce
- Expected behavior
- Screenshots section
- Environment info (browser, version)
- Contact information

**Feature Request Template:**

- Problem description
- Proposed solution
- Alternatives considered
- Use cases and impact
- Contact information

### Layout (Footer Addition)

```
┌─────────────────────────────────────────────────┐
│ Further Information                              │
│ [Data Portal] [Tutorials] [Statistics]          │
├─────────────────────────────────────────────────┤
│ ┌──────────────────┐ ┌──────────────────┐       │
│ │ Found a bug?     │ │ New feature?     │       │
│ │ Report it so we  │ │ Submit requests  │       │
│ │ can fix it fast  │ │ to shape future  │       │
│ │ [Report a bug]   │ │ [Submit]         │       │
│ └──────────────────┘ └──────────────────┘       │
└─────────────────────────────────────────────────┘
```

### Localization

- All text in 3 locales (sr-Cyrl, sr-Latn, en)
- Email subject lines follow user's current locale
- Email body templates follow user's current locale (not fixed Serbian)
- Uses existing i18n pattern: `src/lib/i18n/locales/*.json` and `public/locales/*.json`

### Files to Create/Modify

| File                                        | Purpose                       |
| ------------------------------------------- | ----------------------------- |
| `src/components/layout/Footer.tsx`          | Add feedback section          |
| `src/components/layout/FeedbackSection.tsx` | Feedback cards component      |
| `src/lib/feedback/email-templates.ts`       | Email template generator      |
| `src/lib/feedback/types.ts`                 | TypeScript types              |
| `public/locales/sr-Cyrl/common.json`        | Serbian Cyrillic translations |
| `public/locales/sr-Latn/common.json`        | Serbian Latin translations    |
| `public/locales/en/common.json`             | English translations          |

### Email Template Structure

```typescript
interface EmailTemplate {
  to: string;
  subject: string;
  body: string;
}

function generateBugReportEmail(locale: Locale): EmailTemplate;
function generateFeatureRequestEmail(locale: Locale): EmailTemplate;
```

---

## Technical Implementation

### View Tracking Strategy

Uses existing `views` field on `SavedChart` model (no new model needed):

```prisma
model SavedChart {
  // ... existing fields
  views Int @default(0)
  // ... other fields
}
```

**Rationale:**
- The existing `views: Int` field provides total view counts
- Per-month averages calculated from `createdAt` date
- Avoids database bloat from individual view records
- SQLite-friendly approach (no high-volume write concerns)

**Future Enhancement (optional):**
If detailed analytics are needed later, add a `ChartView` model in PostgreSQL production environment with proper indexing.

### Database Queries

```typescript
// Statistics queries
async function getChartStatistics(): Promise<ChartStats>;
async function getViewStatistics(): Promise<ViewStats>;
async function getPopularCharts(
  limit: number,
  since?: Date
): Promise<PopularChart[]>;

// Browse queries
async function getCategoriesWithCounts(): Promise<BrowseCategory[]>;
async function getOrganizationsWithCounts(): Promise<BrowseCategory[]>;
```

### API Endpoints

| Endpoint                    | Method | Purpose                              |
| --------------------------- | ------ | ------------------------------------ |
| `/api/statistics`           | GET    | Returns all stats in single response |
| `/api/browse/categories`    | GET    | Returns theme categories with counts |
| `/api/browse/organizations` | GET    | Returns organizations with counts    |

---

## Goose Recipe Structure

### File: `recipes/inputs/feature-swiss-ui-enhancements.md`

```yaml
id: swiss-ui-enhancements
name: Swiss UI Enhancements
description: Add Swiss-inspired browse filters, statistics dashboard, and feedback system
priority: high

components:
  - name: enhanced-browse
    priority: primary
    estimated_files: 6
    files:
      - src/app/[locale]/browse/page.tsx
      - src/components/browse/ThemeFilter.tsx
      - src/components/browse/OrganizationFilter.tsx
      - src/components/browse/BrowseFilters.tsx
      - src/components/browse/BrowseSidebar.tsx
      - src/lib/browse/filter-categories.ts
      - src/lib/browse/filter-queries.ts

  - name: statistics-dashboard
    priority: secondary
    estimated_files: 7
    files:
      - src/app/[locale]/statistics/page.tsx
      - src/components/statistics/StatCard.tsx
      - src/components/statistics/StatsOverview.tsx
      - src/components/statistics/PopularChartsGrid.tsx
      - src/components/statistics/PopularChartCard.tsx
      - src/lib/statistics/queries.ts
      - src/lib/statistics/types.ts
      - src/app/api/statistics/route.ts

  - name: feedback-system
    priority: tertiary
    estimated_files: 5
    files:
      - src/components/layout/Footer.tsx
      - src/components/layout/FeedbackSection.tsx
      - src/lib/feedback/email-templates.ts
      - src/lib/feedback/types.ts
      - public/locales/*/common.json

dependencies:
  - Existing Prisma schema (SavedChart model with views field)
  - Existing i18n system (3 locales)
  - Existing data.gov.rs integration
  - Existing BrowseSearchParams and BrowseFacets types

testing_requirements:
  - Unit tests for statistics queries
  - Unit tests for browse filter queries
  - Integration tests for /api/statistics
  - Component tests for browse filters
  - Visual regression for new pages
```

---

## Implementation Phases

### Phase 1: Enhanced Browse (Primary)

1. Create browse filter types and queries
2. Build filter components (ThemeFilter, OrganizationFilter)
3. Integrate into browse page with sidebar layout
4. Add translations for all filter labels
5. Test filtering functionality

### Phase 2: Statistics Dashboard

1. Add ChartView model to Prisma schema (if needed)
2. Create statistics queries
3. Build statistics API endpoint
4. Create statistics page and components
5. Add translations
6. Test all metrics

### Phase 3: Feedback System

1. Create email template generator
2. Build FeedbackSection component
3. Integrate into Footer
4. Add translations for all 3 locales
5. Test email links

---

## Success Criteria

- [ ] Browse page shows theme categories with counts
- [ ] Browse page shows organizations with counts
- [ ] Filtering by theme/organization works correctly
- [ ] Statistics page displays all metrics accurately
- [ ] Popular charts grid shows top 25 charts
- [ ] Footer has bug report and feature request links
- [ ] Email templates are properly formatted
- [ ] All text localized in sr-Cyrl, sr-Latn, en
- [ ] All components pass accessibility checks
- [ ] All tests pass

---

## FilterSidebar Integration

### Existing Component

The existing `FilterSidebar.tsx` (if present) or browse filters will be enhanced with:

1. **New Sidebar Sections** - Add collapsible panels for themes and organizations
2. **Count Badges** - Display dataset counts from `BrowseFacets`
3. **Swiss-Style UI** - Collapsible sections with "Show all" expansion

### Integration Approach

```
BrowsePage
└── BrowseSidebar (new wrapper)
    ├── ThemeFilter (collapsible, uses BrowseFacets.topics)
    ├── OrganizationFilter (collapsible, uses BrowseFacets.organizations)
    └── [Existing filters if any]
```

---

## Translation Keys

### Browse Filters

```json
{
  "browse": {
    "filters": {
      "themes": "Теме | Teme | Themes",
      "organizations": "Организације | Organizacije | Organizations",
      "showAll": "Прикажи све | Prikaži sve | Show all",
      "includeDrafts": "Укључи нацрте | Uključi nacrte | Include drafts",
      "sortBy": "Сортирај по | Sortiraj po | Sort by",
      "newest": "Најновије | Najnovije | Newest",
      "popular": "Популарно | Popularno | Popular",
      "name": "Назив | Naziv | Name"
    }
  }
}
```

### Statistics Page

```json
{
  "statistics": {
    "title": "Статистике | Statistike | Statistics",
    "chartsCreated": "Креирано графикона | Kreirano grafikona | Charts created",
    "totalViews": "Укупно прегледа | Ukupno pregleda | Total views",
    "perMonthAverage": "~{{count}}/месечно | ~{{count}}/mesečno | ~{{count}}/month",
    "popularChartsAllTime": "Најпопуларнији графикони (икада) | Najpopularniji grafikoni (ikada) | Most Popular Charts (All Time)",
    "popularChartsLast30Days": "Најпопуларнији графикони (последњих 30 дана) | Najpopularniji grafikoni (poslednjih 30 dana) | Most Popular Charts (Last 30 Days)",
    "views": "прегледа | pregleda | views",
    "dashboards": "контролне табле | kontrolne table | dashboards",
    "datasetsUsed": "Коришћени скупови података | Korišćeni skupovi podataka | Datasets used"
  }
}
```

### Feedback System

```json
{
  "feedback": {
    "foundBug": "Пронашли сте грешку? | Pronašli ste grešku? | Found a bug?",
    "reportBugDescription": "Пријавите је да бисмо је брзо исправили | Prijavite je da bismo je brzo ispravili | Report it so we can fix it fast",
    "reportBug": "Пријави грешку | Prijavi grešku | Report a bug",
    "newFeature": "Нова функција? | Nova funkcija? | New feature?",
    "featureDescription": "Пошаљите предлоге да обликујете будућност | Pošaljite predloge da oblikujete budućnost | Submit requests to shape the future",
    "submit": "Пошаљи | Pošalji | Submit"
  }
}
```

---

## References

- Swiss Platform: https://visualize.admin.ch
- Swiss Browse Page: https://visualize.admin.ch/en/browse
- Swiss Statistics Page: https://visualize.admin.ch/en/statistics
