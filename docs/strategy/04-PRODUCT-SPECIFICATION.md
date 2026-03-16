# Product Specification

> **RICE Scoring for Features 29-38, Dataset Prioritization, Visualization Templates, User Journey Maps**

---

## 1. RICE Scoring for Features 29-38

### RICE Formula

```
RICE Score = (Reach × Impact × Confidence) / Effort
```

- **Reach**: Users affected per quarter (0-10,000)
- **Impact**: 0.25 (minimal) → 3 (massive)
- **Confidence**: 50% (low) → 100% (high)
- **Effort**: Person-weeks (1-12)

### Feature Scores

| Feature | Name                   | Reach  | Impact | Confidence | Effort | RICE      | Rank |
| ------- | ---------------------- | ------ | ------ | ---------- | ------ | --------- | ---- |
| **29**  | App Shell Foundation   | 10,000 | 3.0    | 100%       | 2      | **1,500** | 1    |
| **30**  | Homepage Landing       | 10,000 | 2.0    | 90%        | 1.5    | **1,200** | 2    |
| **38**  | Chart Showcase Gallery | 5,000  | 2.0    | 90%        | 2      | **450**   | 3    |
| **31**  | Gallery Page           | 3,000  | 2.0    | 90%        | 1.5    | **360**   | 4    |
| **37**  | Serbian Data Library   | 2,000  | 2.5    | 85%        | 2      | **213**   | 5    |
| **32**  | User Dashboard         | 1,000  | 2.0    | 90%        | 1      | **180**   | 6    |
| **35**  | Advanced Search        | 2,000  | 1.5    | 70%        | 3      | **70**    | 7    |
| **33**  | PWA                    | 500    | 1.5    | 80%        | 1.5    | **40**    | 8    |
| **36**  | PDF Reports            | 300    | 1.0    | 80%        | 1.5    | **16**    | 9    |
| **34**  | Notifications          | 200    | 0.5    | 70%        | 1.5    | **5**     | 10   |

### Score Analysis

| Tier                      | Features       | Strategy                  |
| ------------------------- | -------------- | ------------------------- |
| **Critical (RICE > 300)** | 29, 30, 38, 31 | Implement first, high ROI |
| **High (RICE 100-300)**   | 37, 32         | Implement in Phase 2      |
| **Medium (RICE 50-100)**  | 35, 33         | Phase 3 or parallel track |
| **Low (RICE < 50)**       | 36, 34         | Nice-to-have, defer       |

### Dependency Graph

```
Feature 29 (App Shell) ──┬──► Feature 30 (Homepage)
                         ├──► Feature 31 (Gallery)
                         ├──► Feature 32 (Dashboard)
                         └──► Feature 35 (Search)

Feature 37 (Data Library) ──► Feature 38 (Showcase Gallery)

Feature 33 (PWA) ──► Feature 36 (PDF Reports) [offline caching]

Feature 34 (Notifications) ──► [Independent]
```

---

## 2. Dataset Prioritization

### Top 10 data.gov.rs Datasets to Curate

Scored by: **Public Interest (1-5)** × **Data Quality (1-5)** × **Viz Potential (1-5)** × **Political Neutrality (1-5)**

| Rank | Dataset                    | Category     | Public | Quality | Viz | Neutral | Score   | Priority |
| ---- | -------------------------- | ------------ | ------ | ------- | --- | ------- | ------- | -------- |
| 1    | Population by Municipality | Demographics | 5      | 4       | 5   | 5       | **100** | P1       |
| 2    | Budget Execution           | Finance      | 5      | 4       | 4   | 4       | **80**  | P1       |
| 3    | Birth/Death Statistics     | Demographics | 4      | 5       | 5   | 5       | **100** | P1       |
| 4    | GDP by Region              | Economy      | 4      | 4       | 4   | 4       | **64**  | P1       |
| 5    | Employment by Sector       | Economy      | 4      | 4       | 4   | 4       | **64**  | P2       |
| 6    | Healthcare Capacity        | Health       | 4      | 3       | 4   | 5       | **60**  | P2       |
| 7    | Education Enrollment       | Education    | 3      | 4       | 4   | 5       | **60**  | P2       |
| 8    | Migration Balance          | Demographics | 4      | 4       | 5   | 4       | **80**  | P2       |
| 9    | Energy Production          | Environment  | 3      | 4       | 4   | 5       | **60**  | P3       |
| 10   | Crime Statistics           | Security     | 4      | 3       | 3   | 3       | **36**  | P3       |

### Curated Dataset Library (Feature 37)

**Already integrated (from serbia_deep_insights.py):**

| ID                           | Dataset                      | Chart Type       | Category     |
| ---------------------------- | ---------------------------- | ---------------- | ------------ |
| serbia-population-pyramid    | Population Pyramid 2024      | Bar (Pyramid)    | Demographics |
| serbia-birth-rates           | Birth Rate Decline 1950-2024 | Line             | Demographics |
| serbia-fertility-rates       | Fertility vs Replacement     | Line + Reference | Demographics |
| serbia-natural-change        | Births vs Deaths 2015-2024   | Combo            | Demographics |
| serbia-population-decline    | Population Trend 1991-2024   | Area             | Demographics |
| serbia-diaspora-destinations | Diaspora by Country          | Bar (Horizontal) | Migration    |
| serbia-migration-balance     | Migration Balance 2015-2024  | Line             | Migration    |

### Data Quality Indicators

| Indicator     | Weight | Measurement            |
| ------------- | ------ | ---------------------- |
| Completeness  | 30%    | % of fields populated  |
| Freshness     | 25%    | Days since last update |
| Consistency   | 20%    | Format uniformity      |
| Accuracy      | 15%    | Spot-check validation  |
| Documentation | 10%    | Metadata richness      |

---

## 3. Visualization Templates

### Template 1: Budget Transparency

**Use Case**: Government budget visualization for transparency portals

```typescript
const budgetTransparencyTemplate = {
  id: 'budget-transparency',
  name: {
    en: 'Budget Transparency',
    'sr-Cyrl': 'Транспарентност буџета',
    'sr-Latn': 'Transparentnost budžeta',
  },
  chartType: 'sankey', // or 'treemap'
  colorPalette: 'serbian-government',
  config: {
    showPercentages: true,
    showLegends: true,
    interactiveTooltips: true,
    drillDownEnabled: true,
  },
  suggestedData: {
    source: 'Treasury Department',
    format: 'hierarchical',
    levels: ['Ministry', 'Program', 'Activity'],
  },
};
```

**Suggested Datasets**: Budget Execution, Revenue by Source, Expenditure by Category

---

### Template 2: Population Statistics

**Use Case**: Demographic analysis for research and policy

```typescript
const populationStatisticsTemplate = {
  id: 'population-statistics',
  name: {
    en: 'Population Statistics',
    'sr-Cyrl': 'Статистика становништва',
    'sr-Latn': 'Statistika stanovništva',
  },
  chartType: 'combo', // pyramid + time series
  colorPalette: 'demographic',
  config: {
    showYearSelector: true,
    showRegionComparison: true,
    animateTransition: true,
    showMedianLine: true,
  },
  subCharts: [
    { type: 'pyramid', field: 'age-sex-distribution' },
    { type: 'line', field: 'population-trend' },
    { type: 'bar', field: 'regional-comparison' },
  ],
};
```

**Suggested Datasets**: Population by Municipality, Birth/Death Statistics, Migration Balance

---

### Template 3: Healthcare Dashboard

**Use Case**: Healthcare capacity and utilization monitoring

```typescript
const healthcareDashboardTemplate = {
  id: 'healthcare-dashboard',
  name: {
    en: 'Healthcare Dashboard',
    'sr-Cyrl': 'Здравствени панел',
    'sr-Latn': 'Zdravstveni panel',
  },
  chartType: 'dashboard',
  colorPalette: 'healthcare',
  layout: {
    columns: 3,
    rows: 2,
    widgets: [
      {
        position: [0, 0],
        size: [2, 1],
        type: 'kpi',
        metrics: ['beds', 'doctors', 'nurses'],
      },
      {
        position: [0, 1],
        size: [1, 1],
        type: 'bar',
        metric: 'capacity-by-region',
      },
      {
        position: [1, 1],
        size: [1, 1],
        type: 'line',
        metric: 'utilization-trend',
      },
      {
        position: [2, 0],
        size: [1, 2],
        type: 'map',
        metric: 'facility-distribution',
      },
    ],
  },
};
```

**Suggested Datasets**: Healthcare Capacity, Hospital Admissions, Vaccination Rates

---

### Template 4: Economic Indicators

**Use Case**: Economic monitoring for policy and investment decisions

```typescript
const economicIndicatorsTemplate = {
  id: 'economic-indicators',
  name: {
    en: 'Economic Indicators',
    'sr-Cyrl': 'Економски показатељи',
    'sr-Latn': 'Ekonomski pokazatelji',
  },
  chartType: 'combo',
  colorPalette: 'economic',
  config: {
    dualYAxis: true,
    showTrendLine: true,
    enableComparison: true,
    comparisonMode: 'year-over-year',
  },
  indicators: [
    { name: 'GDP Growth', yAxis: 'left', format: 'percent' },
    { name: 'Unemployment', yAxis: 'right', format: 'percent' },
    { name: 'Inflation', yAxis: 'right', format: 'percent' },
  ],
};
```

**Suggested Datasets**: GDP by Region, Employment by Sector, Trade Balance

---

### Template 5: Election Results (Choropleth Map)

**Use Case**: Election results visualization with geographic context

```typescript
const electionResultsTemplate = {
  id: 'election-results',
  name: {
    en: 'Election Results',
    'sr-Cyrl': 'Резултати избора',
    'sr-Latn': 'Rezultati izbora',
  },
  chartType: 'choropleth',
  colorPalette: 'political',
  config: {
    geoLevel: 'municipality', // or 'district'
    showWinnerHighlight: true,
    showTurnoutOverlay: false,
    enableZoom: true,
    showTooltip: true,
  },
  mapData: {
    type: 'serbia-municipalities', // 174 municipalities
    projection: 'mercator',
  },
};
```

**Suggested Datasets**: Election Results by Municipality, Voter Turnout, Party Support

---

## 4. User Journey Maps

### 4.1 Journalist Journey

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  DISCOVER   │───►│   EXPLORE   │───►│   CREATE    │───►│   SHARE     │───►│   RETURN    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
     │                  │                  │                  │                  │
     ▼                  ▼                  ▼                  ▼                  ▼
  Google search      Browse gallery     Select template    Export PNG         Bookmark page
  News tip           Filter by topic    Customize labels   Copy embed code    Subscribe to
  Press release      Preview charts     Add annotations    Share on social    data updates
                     Check data source  Adjust colors      Download data      Set notification

  TIME: 2 min         TIME: 5 min        TIME: 15 min       TIME: 2 min        TIME: Ongoing

  EMOTION: Curious    EMOTION: Engaged   EMOTION: Focused   EMOTION: Satisfied EMOTION: Loyal

  TOUCHPOINTS:        TOUCHPOINTS:       TOUCHPOINTS:       TOUCHPOINTS:       TOUCHPOINTS:
  - Homepage hero     - Gallery page     - Chart builder    - Export modal     - Email digest
  - Showcase section  - Search filters   - Configurator     - Share buttons    - Notifications
  - SEO landing       - Dataset cards    - Preview          - Embed generator  - Dashboard
```

**Pain Points**:

- Finding the right dataset quickly
- Understanding data methodology
- Exporting publication-quality images
- Citing data sources correctly

**Opportunities**:

- Quick-start templates for common story types
- Auto-generated citations
- One-click export with attribution
- Dataset quality indicators

---

### 4.2 Government Official Journey

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  DISCOVER   │───►│   EXPLORE   │───►│   CREATE    │───►│   SHARE     │───►│   RETURN    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
     │                  │                  │                  │                  │
     ▼                  ▼                  ▼                  ▼                  ▼
  Internal request    Browse by theme    Load agency data   Publish to portal  Update dashboard
  Compliance mandate  View examples      Configure access   Generate report    Track metrics
  Budget planning     Compare years      Set permissions    Share with team    Archive versions

  TIME: 1 day         TIME: 1 hour       TIME: 2 hours      TIME: 30 min       TIME: Weekly

  EMOTION: Obligated  EMOTION: Cautious  EMOTION: Focused   EMOTION: Relieved  EMOTION: Confident

  TOUCHPOINTS:        TOUCHPOINTS:       TOUCHPOINTS:       TOUCHPOINTS:       TOUCHPOINTS:
  - Internal memo     - Agency gallery   - Data connector   - Publish button   - Dashboard
  - Procurement       - Template library - Configurator     - Export PDF       - Reports
  - Compliance doc    - Documentation    - Preview          - Share link       - Archive
```

**Pain Points**:

- Complex procurement requirements
- Data security concerns
- Compliance with accessibility standards
- Internal approval workflows

**Opportunities**:

- Pre-approved procurement package
- On-premise deployment option
- WCAG compliance documentation
- Audit trail for changes

---

### 4.3 Business Owner Journey

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  DISCOVER   │───►│   EXPLORE   │───►│   CREATE    │───►│   SHARE     │───►│   RETURN    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
     │                  │                  │                  │                  │
     ▼                  ▼                  ▼                  ▼                  ▼
  Market research     Search by region   Select chart type  Export to PPT      Set alerts
  Investment due      Compare regions    Add company data   Share with team    Update reports
  diligence           Download raw data  Customize branding Present to board    Track changes

  TIME: 30 min        TIME: 1 hour       TIME: 45 min       TIME: 15 min       TIME: Monthly

  EMOTION: Opportunistic EMOTION: Analytical EMOTION: Professional EMOTION: Prepared EMOTION: Proactive

  TOUCHPOINTS:        TOUCHPOINTS:       TOUCHPOINTS:       TOUCHPOINTS:       TOUCHPOINTS:
  - Search engine     - Browse page      - Chart builder    - Export options   - Dashboard
  - Industry report   - Dataset cards    - Branding tools   - Download         - Notifications
  - Peer referral     - Data preview     - Preview          - Share link       - Reports
```

**Pain Points**:

- Limited business-oriented datasets
- Need for regional granularity
- Branding customization
- Export to presentation tools

**Opportunities**:

- Business-focused data curation
- Custom branding (Pro/Team tiers)
- PowerPoint/Keynote export
- API access for integration

---

### 4.4 NGO Worker Journey

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  DISCOVER   │───►│   EXPLORE   │───►│   CREATE    │───►│   SHARE     │───►│   RETURN    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
     │                  │                  │                  │                  │
     ▼                  ▼                  ▼                  ▼                  ▼
  Grant requirement   Browse by topic    Use template       Share on social   Update materials
  Advocacy campaign   Find supporting    Customize for      Include in report  Track engagement
  Donor reporting     evidence           audience           Create embed      Measure impact

  TIME: 2 hours       TIME: 3 hours      TIME: 1 hour       TIME: 30 min       TIME: Quarterly

  EMOTION: Motivated  EMOTION: Hopeful   EMOTION: Creative  EMOTION: Impactful EMOTION: Accountable

  TOUCHPOINTS:        TOUCHPOINTS:       TOUCHPOINTS:       TOUCHPOINTS:       TOUCHPOINTS:
  - Grant guidelines  - Topic gallery    - Templates        - Social buttons   - Dashboard
  - Peer orgs         - Data cards       - Simple builder   - Embed code       - Reports
  - Training          - Examples         - Preview          - Citation         - Analytics
```

**Pain Points**:

- Limited time and budget
- Need for compelling visuals
- Grant compliance requirements
- Impact measurement

**Opportunities**:

- Free/low-cost tier for NGOs
- Advocacy-focused templates
- Grant-compliant exports
- Impact tracking dashboard

---

## 5. Feature Implementation Summary

### Phase 1: Foundation (Sprints 1-4)

| Sprint | Features       | Key Deliverables             |
| ------ | -------------- | ---------------------------- |
| 1      | 29 (App Shell) | Sidebar, Header, Navigation  |
| 2      | 30 (Homepage)  | Hero, Stats, Getting Started |
| 3      | 31 (Gallery)   | Gallery page, Chart cards    |
| 4      | 38 (Showcase)  | Showcase section, Templates  |

### Phase 2: Core Features (Sprints 5-8)

| Sprint | Features          | Key Deliverables             |
| ------ | ----------------- | ---------------------------- |
| 5      | 37 (Data Library) | Serbian datasets integration |
| 6      | 32 (Dashboard)    | User chart management        |
| 7      | 35 (Search)       | Advanced search, filters     |
| 8      | 33 (PWA)          | Offline support, install     |

### Phase 3: Enhancements (Sprints 9-12)

| Sprint | Features           | Key Deliverables       |
| ------ | ------------------ | ---------------------- |
| 9      | 36 (PDF Reports)   | Report generation      |
| 10     | 34 (Notifications) | Notification system    |
| 11     | Polish             | Bug fixes, performance |
| 12     | Launch prep        | Final testing, docs    |

---

## 6. Success Metrics by Feature

| Feature          | Primary Metric             | Target | Secondary Metrics               |
| ---------------- | -------------------------- | ------ | ------------------------------- |
| 29 App Shell     | Navigation completion rate | 95%    | Time to navigate, sidebar usage |
| 30 Homepage      | CTA click-through rate     | 30%    | Bounce rate, time on page       |
| 31 Gallery       | Charts viewed per session  | 3+     | Gallery-to-detail conversion    |
| 32 Dashboard     | Return rate (weekly)       | 40%    | Charts created per user         |
| 33 PWA           | Install rate               | 10%    | Offline usage, push opt-in      |
| 34 Notifications | Open rate                  | 25%    | Click-through rate              |
| 35 Search        | Search success rate        | 70%    | Query refinement rate           |
| 36 PDF Reports   | Exports per month          | 100    | Report shares                   |
| 37 Data Library  | Dataset usage rate         | 50%    | Charts per dataset              |
| 38 Showcase      | Template usage             | 40%    | Edit click rate                 |

---

_Source Documents: [recipes/inputs/feature-29-38-_.md](../../recipes/inputs/), [src/data/demo-gallery/](../../src/data/demo-gallery/)\*

_Last Updated: 2026-03-16_
