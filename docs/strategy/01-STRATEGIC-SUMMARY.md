# Strategic Summary

> **Framework-driven analysis: Blue Ocean, JTBD, Wardley Mapping, Market Sizing, Competitive Positioning, Defensibility**

---

## 1. Blue Ocean Strategy

### The Strategic Reframe

```
FROM: "A React charting library with Serbian localization"
TO:   "The canonical interface for Serbian government data"
```

### ERRC Grid (Eliminate-Reduce-Raise-Create)

|               | Action                       | Rationale                                            |
| ------------- | ---------------------------- | ---------------------------------------------------- |
| **ELIMINATE** | US data residency            | Serbian government data must stay in Serbia/EU       |
|               | Complex licensing tiers      | Government clients need simple, predictable pricing  |
|               | Manual Serbian data setup    | data.gov.rs integration should be zero-config        |
|               | English-only documentation   | Serbian citizens need Serbian-language resources     |
| **REDUCE**    | Learning curve               | Non-technical government staff need quick onboarding |
|               | Setup time                   | 5 minutes to first chart, not 5 hours                |
|               | Cost                         | €5K/year vs €12K+ for Tableau/Power BI               |
|               | Feature complexity           | Focus on common use cases, not edge cases            |
| **RAISE**     | Serbian language quality     | Native Cyrillic + Latin, not Google Translate        |
|               | Data sovereignty             | Option to host entirely within Serbia                |
|               | Government alignment         | Procurement-ready, institutional trust               |
|               | Accessibility                | WCAG 2.1 AA baseline, not afterthought               |
| **CREATE**    | Pre-configured data.gov.rs   | 3,412 datasets ready to visualize                    |
|               | 174 municipalities GeoJSON   | Serbian administrative boundaries included           |
|               | Cyrillic-native UX           | Built for Serbian script from day one                |
|               | Government partnership model | Free pilot, then enterprise support                  |

### Strategy Canvas

| Factor                  | Tableau | Power BI | Observable | Vizuelni Admin |
| ----------------------- | ------- | -------- | ---------- | -------------- |
| Price                   | Low     | Medium   | Medium     | **High Value** |
| Serbian Language        | Low     | Low      | Low        | **High**       |
| Cyrillic Support        | Low     | Low      | Low        | **High**       |
| data.gov.rs Integration | Low     | Low      | Low        | **High**       |
| Serbian Regions         | Low     | Low      | Low        | **High**       |
| Data Sovereignty        | Low     | Low      | Low        | **High**       |
| Learning Curve          | Medium  | Medium   | Low        | **High**       |
| Government Alignment    | Low     | Low      | Low        | **High**       |

**Blue Ocean Created**: A "Government Data Sovereignty" value curve that doesn't compete on features or price, but on Serbian-specific integration and institutional trust.

---

## 2. Jobs-to-be-Done Framework

### Five Customer Segments

#### 2.1 Journalist

**Job Statement**: "When I need to illustrate a story about government spending or demographics, I want to quickly create accurate, publishable visualizations, so I can meet my deadline and inform citizens."

| Dimension               | Description                                            |
| ----------------------- | ------------------------------------------------------ |
| **Situation**           | Breaking news, investigative report, deadline pressure |
| **Motivation**          | Inform public, build credibility, meet deadline        |
| **Outcome**             | Publishable chart in <30 minutes, data-backed claims   |
| **Hiring Criteria**     | Speed, accuracy, embeddable, citation-ready            |
| **Firing Criteria**     | Slow, requires coding, ugly output, no Serbian         |
| **Willingness to Pay**  | Low (€0-29/mo) — newsroom budget constraints           |
| **Usage Frequency**     | Weekly to daily during active stories                  |
| **Data Sophistication** | Medium — understands data but not a statistician       |
| **Language Needs**      | Serbian primary, English for international stories     |

#### 2.2 Business Owner

**Job Statement**: "When I'm analyzing market opportunities or preparing investor presentations, I want to visualize economic and demographic data about Serbian regions, so I can make informed business decisions."

| Dimension               | Description                                                   |
| ----------------------- | ------------------------------------------------------------- |
| **Situation**           | Market analysis, investor pitch, strategic planning           |
| **Motivation**          | Reduce business risk, identify opportunities                  |
| **Outcome**             | Professional charts for presentations, data-driven decisions  |
| **Hiring Criteria**     | Professional output, export options, regional data            |
| **Firing Criteria**     | Limited data, unprofessional appearance, no export            |
| **Willingness to Pay**  | Medium (€49-99/mo) — business ROI justified                   |
| **Usage Frequency**     | Monthly to quarterly                                          |
| **Data Sophistication** | Medium — business intelligence focus                          |
| **Language Needs**      | Serbian primary, may need English for international investors |

#### 2.3 Researcher

**Job Statement**: "When I'm conducting academic research on Serbian society or economy, I want to access and visualize longitudinal government data, so I can publish rigorous, reproducible analysis."

| Dimension               | Description                                                           |
| ----------------------- | --------------------------------------------------------------------- |
| **Situation**           | Thesis, paper, grant proposal, policy analysis                        |
| **Motivation**          | Academic credibility, reproducibility, publication                    |
| **Outcome**             | Publication-ready figures, reproducible methodology                   |
| **Hiring Criteria**     | Data accuracy, export formats, reproducibility                        |
| **Firing Criteria**     | Data gaps, black-box processing, no citation support                  |
| **Willingness to Pay**  | Low (€0-29/mo) — academic budget, but institutional licenses possible |
| **Usage Frequency**     | Project-based, intensive during research phases                       |
| **Data Sophistication** | High — statistical expertise, methodology focus                       |
| **Language Needs**      | English for international publication, Serbian for local              |

#### 2.4 NGO Worker

**Job Statement**: "When I'm advocating for policy change or writing grant reports, I want to visualize social issues with government data, so I can build compelling cases for funding and reform."

| Dimension               | Description                                           |
| ----------------------- | ----------------------------------------------------- |
| **Situation**           | Grant application, advocacy campaign, donor report    |
| **Motivation**          | Social impact, donor accountability, policy influence |
| **Outcome**             | Compelling visualizations for non-technical audiences |
| **Hiring Criteria**     | Ease of use, storytelling features, shareable         |
| **Firing Criteria**     | Complex interface, requires training, expensive       |
| **Willingness to Pay**  | Low (€0-29/mo) — grant-funded, budget constraints     |
| **Usage Frequency**     | Project-based, quarterly reports                      |
| **Data Sophistication** | Low to Medium — focused on communication              |
| **Language Needs**      | Serbian primary, English for international donors     |

#### 2.5 Government Official

**Job Statement**: "When I'm preparing reports for parliament or public communications, I want to create official visualizations from our agency's data, so I can fulfill transparency requirements and communicate effectively with citizens."

| Dimension               | Description                                                   |
| ----------------------- | ------------------------------------------------------------- |
| **Situation**           | Parliamentary report, public dashboard, policy presentation   |
| **Motivation**          | Compliance, public trust, institutional credibility           |
| **Outcome**             | Official, accessible visualizations for public consumption    |
| **Hiring Criteria**     | Accessibility compliance, data sovereignty, procurement-ready |
| **Firing Criteria**     | Non-compliant, foreign servers, complex procurement           |
| **Willingness to Pay**  | High (€5K+/year) — institutional budget, value on compliance  |
| **Usage Frequency**     | Ongoing — dashboards, regular reports                         |
| **Data Sophistication** | Variable — often delegated to staff                           |
| **Language Needs**      | Serbian only — official communications                        |

---

## 3. Wardley Map

### Value Chain Components

```
                    GENESIS          CUSTOM           PRODUCT          COMMODITY
                         |                |                |                |
    Citizen Understanding ●────────────────┼────────────────┼────────────────┤
                         |                |                |                |
    Visual Insights      ●────────────────┼────────────────┼────────────────┤
                         |                |                |                |
    ┌───────────────────┐│                │                │                │
    │  Chart Engine     │●────────────────┼────────────────┼────────────────┤
    │  (Recharts+D3)    ││                │                │                │
    └───────────────────┘│                │                │                │
                         │                │                │                │
    ┌───────────────────┐│                │                │                │
    │  Configurator     ││●───────────────┼────────────────┼────────────────┤
    │  (Serbian-first)  │││               │                │                │
    └───────────────────┘││               │                │                │
                         ││               │                │                │
    ┌───────────────────┐││               │                │                │
    │  GeoJSON Boundaries││●──────────────┼────────────────┼────────────────┤
    │  (174 Municipalities)││              │                │                │
    └───────────────────┘││               │                │                │
                         ││               │                │                │
    ┌───────────────────┐││               │                │                │
    │  Data Transform   │││●──────────────┼────────────────┼────────────────┤
    │  (Serbian formats)││││              │                │                │
    └───────────────────┘│││              │                │                │
                         │││              │                │                │
    ┌───────────────────┐│││              │                │                │
    │  data.gov.rs API  ││││●─────────────┼────────────────┼────────────────┤
    │  Connectors       │││││             │                │                │
    └───────────────────┘││││             │                │                │
                         ││││             │                │                │
    ┌───────────────────┐││││             │                │                │
    │  Next.js Runtime  │││││●────────────┼────────────────┼────────────────┤
    └───────────────────┘│││││            │                │                │
                         │││││            │                │                │
    ┌───────────────────┐│││││            │                │                │
    │  PostgreSQL/Prisma││││││●───────────┼────────────────┼────────────────┤
    └───────────────────┘││││││           │                │                │
                         ▼▼▼▼▼▼           ▼                ▼                ▼
```

### Value Creation Analysis

| Component                        | Evolution Stage | Value Source                                              |
| -------------------------------- | --------------- | --------------------------------------------------------- |
| **data.gov.rs Connectors**       | Custom          | Unique integration — competitors must build from scratch  |
| **Serbian GeoJSON Boundaries**   | Custom          | Curated 174 municipalities — months of work to replicate  |
| **Cyrillic-native Configurator** | Custom          | Built for Serbian from day one — not retrofitted          |
| **Serbian Data Transform**       | Custom          | Date/number formats, locale-aware — competitors miss this |
| **Chart Engine**                 | Product         | Recharts+D3 — commodity with Serbian customization        |
| **Next.js Runtime**              | Commodity       | Standard framework — no differentiation                   |
| **PostgreSQL/Prisma**            | Commodity       | Standard persistence — no differentiation                 |

**Strategic Insight**: Value is concentrated in the **Custom** layer — data.gov.rs integration, Serbian boundaries, Cyrillic UX. These are expensive to replicate and create switching costs.

---

## 4. TAM/SAM/SOM Market Sizing

### Total Addressable Market (TAM)

**Definition**: Western Balkans government + civic data visualization market

| Segment               | Estimate  | Rationale                          |
| --------------------- | --------- | ---------------------------------- |
| Serbia Government     | €15M      | ~200 agencies, avg €75K/tool       |
| Serbia Private Sector | €10M      | Banks, consultancies, NGOs         |
| Croatia               | €8M       | EU member, higher digital maturity |
| Bosnia & Herzegovina  | €5M       | Fragmented market                  |
| Montenegro            | €3M       | Small but accessible               |
| North Macedonia       | €5M       | EU candidate, growing              |
| Albania               | €4M       | Emerging market                    |
| **TAM Total**         | **~€50M** | Conservative estimate              |

### Serviceable Addressable Market (SAM)

**Definition**: Serbian organizations actively using government data

| Segment             | Count     | Avg Value | Total    |
| ------------------- | --------- | --------- | -------- |
| Government Agencies | 50 active | €50K      | €2.5M    |
| Municipalities      | 174       | €10K      | €1.7M    |
| Media Organizations | 20        | €5K       | €0.1M    |
| NGOs/Think Tanks    | 30        | €5K       | €0.15M   |
| Universities        | 10        | €10K      | €0.1M    |
| Private Companies   | 50        | €10K      | €0.5M    |
| **SAM Total**       |           |           | **~€5M** |

### Serviceable Obtainable Market (SOM)

**Definition**: Year 1 realistic capture with current resources

| Revenue Stream      | Year 1 Target   | Rationale                                    |
| ------------------- | --------------- | -------------------------------------------- |
| Enterprise Licenses | 10 × €5K = €50K | 3-5 agencies + 5-7 large orgs                |
| SaaS Subscriptions  | €20K            | 500 users × €40 ARPU                         |
| Grant Funding       | €50K            | UNDP, EU, USAID                              |
| Services            | €6K             | Training, consulting                         |
| **SOM Total**       | **€126K**       | Matches STRATEGIC_SUCCESS_PLAN.md projection |

### Growth Trajectory

| Year   | SOM   | Growth Driver                                |
| ------ | ----- | -------------------------------------------- |
| Year 1 | €126K | Foundation: pilots, grants, early adopters   |
| Year 2 | €290K | Expansion: government contracts, SaaS growth |
| Year 3 | €400K | Scale: regional expansion, enterprise deals  |

---

## 5. Competitive Positioning Map

### 2×2 Positioning Matrix

```
                              SERBIAN SPECIALIZATION
                                    HIGH
                                      │
              ┌───────────────────────┼───────────────────────┐
              │                       │                       │
              │    LOCAL CONSULTANTS  │   VIZUELNI ADMIN      │
              │    (custom builds)    │       SRBIJE ★        │
              │                       │                       │
              │    • High cost        │    • Serbian-first    │
              │    • Slow delivery    │    • data.gov.rs      │
              │    • Not scalable     │    • Affordable       │
              │                       │    • Self-serve       │
    LOW ──────┼───────────────────────┼───────────────────────┼────── HIGH
   EASE       │                       │                       │    EASE
   OF USE     │    OBSERVABLE         │    TABLEAU PUBLIC     │    OF USE
              │    POWER BI           │    GOOGLE DATA STUDIO │
              │                       │                       │
              │    • Low cost         │    • Easy start       │
              │    • Flexible         │    • Free/cheap       │
              │    • Requires coding  │    • No Serbian       │
              │    • No Serbian data  │    • US servers       │
              │                       │                       │
              └───────────────────────┼───────────────────────┘
                                      │
                                    LOW
```

### SWOT Analysis

|              | **Positive**                               | **Negative**                             |
| ------------ | ------------------------------------------ | ---------------------------------------- |
| **Internal** | **Strengths**                              | **Weaknesses**                           |
|              | • Serbian-first design                     | • Solo developer (bus factor = 1)        |
|              | • data.gov.rs integration                  | • Limited marketing budget               |
|              | • 174 municipalities GeoJSON               | • No sales team                          |
|              | • WCAG 2.1 AA compliant                    | • 28 features = tech debt risk           |
|              | • Open source credibility                  | • Limited brand recognition              |
|              | • Government procurement-ready             |                                          |
| **External** | **Opportunities**                          | **Threats**                              |
|              | • EU accession pressure for transparency   | • Big tech entering government space     |
|              | • UNDP/EU/USAID grant funding              | • Economic downturn reducing budgets     |
|              | • Regional expansion (Croatia, Bosnia)     | • data.gov.rs API changes                |
|              | • Growing open data movement               | • Political changes affecting priorities |
|              | • COVID accelerated digital transformation | • Competitor copying features            |

---

## 6. Defensibility & Moat Analysis

### 6.1 Switching Costs

| Cost Type                | Description                                            | Strength   |
| ------------------------ | ------------------------------------------------------ | ---------- |
| **Data Integration**     | data.gov.rs API connectors, caching, normalization     | High       |
| **Saved Configurations** | Charts, dashboards, filters stored in platform         | Medium     |
| **Team Workflows**       | Shared workspaces, permissions, collaboration patterns | Medium     |
| **Training Investment**  | Staff trained on platform, documentation               | Low-Medium |
| **Embed Ecosystem**      | Charts embedded in external sites, newsletters         | Medium     |

**Quantification**: Estimated 6-12 months of work to replicate data.gov.rs integration depth. Migration cost for 10 saved dashboards: ~40 hours.

### 6.2 Network Effects

| Effect Type   | Description                                    | Current Strength   |
| ------------- | ---------------------------------------------- | ------------------ |
| **Direct**    | More users = more feedback = better product    | Weak (early stage) |
| **Data**      | More charts = more templates = easier start    | Weak (building)    |
| **Embed**     | More embeds = more visibility = more users     | Weak               |
| **Community** | More contributors = more features = more users | Weak               |

**Strategy to Strengthen**:

1. Launch community template gallery (Feature 38)
2. Encourage embed sharing with attribution
3. Build contributor recognition program
4. Create "visualization of the month" showcase

### 6.3 Unique Data Assets

| Asset                           | Creation Cost | Replication Difficulty           |
| ------------------------------- | ------------- | -------------------------------- |
| **174 Municipalities GeoJSON**  | ~160 hours    | High — requires GIS expertise    |
| **Cyrillic/Latin Translations** | ~80 hours     | Medium — translation work        |
| **data.gov.rs Schema Mapping**  | ~200 hours    | High — requires domain knowledge |
| **Curated Dataset Library**     | Ongoing       | Medium — curation effort         |
| **Serbian Date/Number Formats** | ~20 hours     | Low — well-documented            |

**Total Replacement Cost**: ~460+ hours (11+ weeks of full-time work)

### 6.4 Compounding Advantages

| Advantage                    | How It Compounds                                           |
| ---------------------------- | ---------------------------------------------------------- |
| **Government Relationships** | Each partnership builds credibility for the next           |
| **Institutional Trust**      | Compliance track record reduces procurement friction       |
| **Community Contributions**  | Each contribution reduces maintenance burden               |
| **Dataset Curation**         | Each curated dataset increases platform value              |
| **Documentation**            | Better docs = lower support burden = more development time |

### 6.5 Moat Summary

| Moat Type                  | Strength (1-5) | Durability                       |
| -------------------------- | -------------- | -------------------------------- |
| **Switching Costs**        | 3              | Medium — increases with adoption |
| **Network Effects**        | 2              | Low now, potential to grow       |
| **Unique Assets**          | 4              | High — expensive to replicate    |
| **Compounding Advantages** | 3              | High — builds over time          |
| **Brand/Trust**            | 2              | Medium — early stage             |

**Overall Moat Rating**: **3/5** (Moderate)

**Key Gap**: Network effects are weak. Priority should be building community features (template gallery, sharing, contributions) to strengthen this moat.

---

## 7. Strategic Implications

### Priority Investments

1. **Strengthen Network Effects** (Feature 38: Chart Showcase Gallery)
2. **Deepen Switching Costs** (Feature 32: User Dashboard with saved workflows)
3. **Expand Unique Assets** (Feature 37: Serbian Data Library)
4. **Build Government Relationships** (Pilot Partner Playbook execution)

### Competitive Response Preparedness

| If Competitor...        | Response                                            |
| ----------------------- | --------------------------------------------------- |
| Adds Serbian support    | Emphasize data.gov.rs integration depth             |
| Lowers price            | Emphasize total cost of ownership (setup, training) |
| Targets government      | Emphasize procurement track record, compliance      |
| Builds similar features | Accelerate network effects (community, templates)   |

### Success Metrics

| Metric                              | Year 1 Target | Year 3 Target |
| ----------------------------------- | ------------- | ------------- |
| Government Partnerships             | 3             | 15            |
| Saved Charts (switching cost proxy) | 500           | 5,000         |
| Community Templates                 | 10            | 100           |
| Embed Instances                     | 50            | 500           |
| NPS Score                           | 30+           | 50+           |

---

_Source Documents: [COMPETITIVE_ANALYSIS.md](../COMPETITIVE_ANALYSIS.md), [LONG_TERM_PLAN.md](../LONG_TERM_PLAN.md), [ARCHITECTURE.md](../ARCHITECTURE.md), [PLATFORM_RESEARCH.md](../PLATFORM_RESEARCH.md)_

_Last Updated: 2026-03-16_
