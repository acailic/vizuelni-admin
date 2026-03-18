# Demo Gallery Design Spec

> **Goal:** Build a comprehensive demo gallery page showcasing all 28 chart visualizations with real Serbian government data, organized by category tabs.

> **Architecture:** New standalone page at `/[locale]/demo-gallery` with tabbed category interface, static preview cards that open full charts in modals with data tables.

> **Tech Stack:** Next.js 14, TypeScript, existing ChartRenderer component, Tailwind CSS

---

## Overview

A comprehensive demo gallery showcasing all available chart types with real Serbian government data. Users can browse 28 pre-built visualizations organized by category, preview charts, and view underlying data.

## User Stories

1. As a user, I want to browse all available chart examples in one place
2. As a user, I want to filter charts by category (Demographics, Healthcare, Economy, Migration, Society)
3. As a user, I want to click a chart to see it larger with the raw data
4. As a user, I want the gallery to be accessible in all three locales (sr-Cyrl, sr-Latn, en)

## Page Structure

**Route:** `/[locale]/demo-gallery`

```
┌─────────────────────────────────────────────────────────────┐
│  Header: "Serbia Data Gallery" / "Галерија података Србије"  │
│  Subtitle: "28 interactive visualizations with real data"    │
├─────────────────────────────────────────────────────────────┤
│  [All] [Demographics] [Healthcare] [Economy] [Migration] [Society]  │
├─────────────────────────────────────────────────────────────┤
│  Responsive grid of chart preview cards                      │
│  (4 columns on desktop, 2 on tablet, 1 on mobile)            │
└─────────────────────────────────────────────────────────────┘
```

## Category Tabs

| Tab | Count | Charts |
|-----|-------|--------|
| All | 28 | Everything |
| Demographics | 6 | Population pyramid, birth rates, fertility, natural change, population decline, age distribution |
| Healthcare | 7 | Cancer incidence, cancer by sex, cancer mortality, cancer trends, healthcare workers, screening rates, survival rates |
| Economy | 5 | GDP growth, inflation, industrial production, wages, employment/unemployment |
| Migration | 4 | Diaspora destinations, migration balance, immigration trends, emigration trends |
| Society | 6 | Education levels, tourism, crime statistics, vital statistics, labour market, regional disparities |

## Components

### DemoGalleryPage
- Server component at `src/app/[locale]/demo-gallery/page.tsx`
- Loads locale messages and renders DemoGalleryClient

### DemoGalleryClient
- Client component with tab state and modal state
- Renders category tabs and chart grid

### DemoGalleryCard
- Props: `example`, `locale`, `onClick`
- 200px preview with ChartRenderer (previewMode)
- Shows title, category badge
- Clickable to open modal

### DemoGalleryModal
- Props: `example`, `isOpen`, `onClose`, `locale`
- Full-size chart (500px)
- Collapsible data table showing raw values
- Close button

## Data Source

### Data Files
Create `src/data/demo-gallery/` with category-based JSON files:

```
src/data/demo-gallery/
├── demographics/
│   ├── population-pyramid.json
│   ├── birth-rates.json
│   ├── fertility-rates.json
│   ├── natural-change.json
│   ├── population-decline.json
│   └── age-distribution.json
├── healthcare/
│   ├── cancer-incidence.json
│   ├── cancer-by-sex.json
│   ├── cancer-mortality.json
│   ├── cancer-trends.json
│   ├── healthcare-workers.json
│   ├── screening-rates.json
│   └── survival-rates.json
├── economy/
│   ├── gdp-growth.json
│   ├── inflation.json
│   ├── industrial-production.json
│   ├── wages.json
│   └── employment.json
├── migration/
│   ├── diaspora-destinations.json
│   ├── migration-balance.json
│   ├── immigration-trends.json
│   └── emigration-trends.json
└── society/
    ├── education-levels.json
    ├── tourism.json
    ├── crime-statistics.json
    ├── vital-statistics.json
    ├── labour-market.json
    └── regional-disparities.json
```

### Chart Configurations
Create `src/lib/examples/demo-gallery-examples.ts`:
- Imports all data files
- Creates FeaturedExampleConfig for each chart
- Exports `demoGalleryExamples` array
- Exports helper functions: `getExamplesByCategory()`, `getExampleById()`

## Data Mappings

### From Python Scripts to TypeScript

| Python Chart | TypeScript ID | Category | Chart Type |
|--------------|---------------|----------|------------|
| Population Pyramid | serbia-population-pyramid | demographics | bar |
| Birth Rate Decline | serbia-birth-rates | demographics | line |
| Fertility Rate | serbia-fertility-rates | demographics | line |
| Natural Change | serbia-natural-change | demographics | bar |
| Population Decline | serbia-population-decline | demographics | line |
| Age Distribution | serbia-age-distribution | demographics | pie |
| Cancer Incidence | serbia-cancer-incidence | healthcare | bar |
| Cancer by Sex | serbia-cancer-by-sex | healthcare | bar |
| Cancer Mortality | serbia-cancer-mortality | healthcare | bar |
| Cancer Trends | serbia-cancer-trends | healthcare | line |
| Healthcare Workers | serbia-healthcare-workers | healthcare | bar |
| Screening Rates | serbia-screening-rates | healthcare | bar |
| Survival Rates | serbia-survival-rates | healthcare | bar |
| GDP Growth | serbia-gdp-growth | economy | line |
| Inflation | serbia-inflation | economy | line |
| Industrial Production | serbia-industrial-production | economy | line |
| Wages | serbia-wages | economy | bar |
| Employment | serbia-employment | economy | line |
| Diaspora Destinations | serbia-diaspora-destinations | migration | bar |
| Migration Balance | serbia-migration-balance | migration | bar |
| Immigration Trends | serbia-immigration-trends | migration | line |
| Emigration Trends | serbia-emigration-trends | migration | line |
| Education Levels | serbia-education-levels | society | bar |
| Tourism | serbia-tourism | society | line |
| Crime Statistics | serbia-crime-statistics | society | bar |
| Vital Statistics | serbia-vital-statistics | society | line |
| Labour Market | serbia-labour-market | society | bar |
| Regional Disparities | serbia-regional-disparities | society | bar |

## i18n Keys

Add to all locale files:

```json
{
  "demoGallery": {
    "title": "Serbia Data Gallery / Галерија података Србије / Galerija podataka Srbije",
    "subtitle": "28 interactive visualizations with real data / ...",
    "categories": {
      "all": "All / Све / Sve",
      "demographics": "Demographics / Демографија / Demografija",
      "healthcare": "Healthcare / Здравство / Zdravstvo",
      "economy": "Economy / Економија / Ekonomija",
      "migration": "Migration / Миграција / Migracija",
      "society": "Society / Друштво / Društvo"
    },
    "modal": {
      "close": "Close / Затвори / Zatvori",
      "viewData": "View Data / Погледај податке / Pogledaj podatke",
      "hideData": "Hide Data / Сакриј податке / Sakrij podatke"
    }
  }
}
```

## Navigation

Add link to sidebar navigation:
- Icon: 📊 (chart icon)
- Label: "Demo Gallery" / "Демо галерија" / "Demo galerija"
- Path: `/[locale]/demo-gallery`

## File Structure

### New Files
```
src/app/[locale]/demo-gallery/
└── page.tsx                    # Server component

src/components/demo-gallery/
├── DemoGalleryClient.tsx       # Tab state, modal state
├── DemoGalleryCard.tsx         # Preview card
├── DemoGalleryModal.tsx        # Full chart + data table
├── DemoGalleryTabs.tsx         # Category tabs
└── index.ts                    # Barrel exports

src/lib/examples/
└── demo-gallery-examples.ts    # All 28 chart configs

src/data/demo-gallery/
├── demographics/               # 6 JSON files
├── healthcare/                 # 7 JSON files
├── economy/                    # 5 JSON files
├── migration/                  # 4 JSON files
└── society/                    # 6 JSON files
```

### Modified Files
```
src/lib/i18n/locales/en/common.json    # Add demoGallery keys
src/lib/i18n/locales/sr/common.json    # Add demoGallery keys
src/lib/i18n/locales/lat/common.json   # Add demoGallery keys
src/components/layout/Sidebar.tsx      # Add demo gallery nav link
```

## Acceptance Criteria

- [ ] Demo gallery page accessible at `/[locale]/demo-gallery`
- [ ] All 6 category tabs work correctly
- [ ] All 28 charts render in preview mode
- [ ] Clicking a chart opens modal with full chart
- [ ] Modal shows collapsible data table
- [ ] All labels localized in sr-Cyrl, sr-Latn, en
- [ ] Navigation link added to sidebar
- [ ] TypeScript compiles without errors
- [ ] Build passes

## Dependencies

- Reuses existing ChartRenderer component
- Reuses existing FeaturedExampleConfig type (with extended ShowcaseCategory)
- Reuses existing CategoryBadge component
- No new external dependencies
