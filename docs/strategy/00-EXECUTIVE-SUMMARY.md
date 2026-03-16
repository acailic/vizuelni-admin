# Strategic Plan: Vizuelni Admin Srbije

## Executive Summary

**Vision**: Become the canonical interface for Serbian government data — empowering citizens through transparency.

**Mission**: Make every Serbian citizen able to understand their government through data.

**Strategic Positioning**: Not another generic charting library — a Serbian-first platform with built-in data.gov.rs integration.

---

## Current State

| Metric               | Value                                                            |
| -------------------- | ---------------------------------------------------------------- |
| Features Implemented | 28                                                               |
| Chart Types          | 9 (Bar, Line, Area, Pie, Scatter, Table, Map, Choropleth, Combo) |
| Locales              | 3 (sr-Cyrl, sr-Latn, en)                                         |
| Data Source          | data.gov.rs (3,412+ datasets, 155 organizations)                 |
| Authentication       | Full (NextAuth.js v4, GitHub/Google/Credentials)                 |
| Accessibility        | WCAG 2.1 AA compliant                                            |
| Tech Stack           | Next.js 14, TypeScript, Prisma, Recharts, D3, Leaflet            |

---

## Three-Year Trajectory

| Year | Enterprise Customers | Total Revenue | GitHub Stars |
| ---- | -------------------- | ------------- | ------------ |
| 1    | 3                    | €126,000      | 500          |
| 2    | 8                    | €290,000      | 2,000        |
| 3    | 15                   | €400,000      | 5,000        |

**Revenue Mix Evolution**: Year 1 (70% grants, 20% SaaS, 10% enterprise) → Year 3 (20% grants, 50% SaaS, 30% enterprise)

---

## Deliverables Index

This strategic plan comprises **7 core documents** plus this executive summary:

| #      | Document                                                 | Purpose                                                                                   |
| ------ | -------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **01** | [Strategic Summary](./01-STRATEGIC-SUMMARY.md)           | Blue Ocean, JTBD, Wardley Map, TAM/SAM/SOM, Competitive Positioning, Defensibility        |
| **02** | [Business Model](./02-BUSINESS-MODEL.md)                 | 9-Block BMC, Dual Revenue Architecture, Unit Economics, Value Proposition Canvas, Pricing |
| **03** | [Technical Architecture](./03-TECHNICAL-ARCHITECTURE.md) | ADRs, Viz Engine Evaluation, System Diagram, Scaling Tiers, Monitoring                    |
| **04** | [Product Specification](./04-PRODUCT-SPECIFICATION.md)   | RICE Scoring, Dataset Prioritization, Visualization Templates, User Journeys              |
| **05** | [Implementation Plan](./05-IMPLEMENTATION-PLAN.md)       | Sprint Plan, KPIs, Resource Model, Risk Register, Financial Contingency                   |
| **06** | [Go-to-Market Strategy](./06-GO-TO-MARKET.md)            | 4-Phase GTM, Partnerships, Launch Plan, Marketing Channels                                |
| **07** | [Serbian Market Specifics](./07-SERBIAN-MARKET.md)       | Localization, Regulatory Landscape, Cultural Factors, Government Relations                |

---

## Key Strategic Insights

### Differentiation

| Generic Libraries                    | Vizuelni Admin Srbije            |
| ------------------------------------ | -------------------------------- |
| You figure out the data              | Data integration built-in        |
| Internationalization as afterthought | Serbian-first design             |
| Generic examples                     | Real Serbian government datasets |
| Community support                    | Government-aligned roadmap       |

### Market Opportunity

- **TAM**: Western Balkans government + civic data visualization (~€50M)
- **SAM**: Serbian organizations using government data (~€5M)
- **SOM**: Year 1 addressable (10 orgs × €5K enterprise + self-service SaaS)

### Competitive Moat

1. **Switching Costs**: data.gov.rs integration depth, saved charts, configured dashboards
2. **Network Effects**: Shared visualizations, community templates, embed ecosystem
3. **Unique Assets**: Curated Serbian datasets, 174 municipalities GeoJSON, Cyrillic translations
4. **Compounding Advantages**: Government relationships, institutional trust, community contributions

---

## Critical Path

**Features 29-38** (App Shell → PWA → Notifications → Search → PDF → Data Library → Gallery) represent the foundation for public launch. Estimated **24 weeks** for solo developer implementation.

**Key Dependencies**:

- Feature 29 (App Shell) is critical path for all UI features
- Feature 33 (PWA) enables offline-first government use cases
- Feature 37 (Serbian Data Library) differentiates from generic tools

---

## Success Definition

**Year 1**: Recognized as the go-to tool for Serbian government data visualization with 500+ GitHub stars, 3 government partnerships, and €100,000 in funding/revenue.

**Year 3**: Self-sustaining platform with regional expansion (3+ countries), 5,000+ GitHub stars, and influence on EU open data policy.

**Ultimate Vision**: Every Serbian citizen can understand their government through data — transparency as infrastructure, not afterthought.

---

## Source Documents

This strategic plan consolidates and formalizes analysis from:

- `docs/STRATEGIC_SUCCESS_PLAN.md` — Revenue projections, distribution channels
- `docs/COMPETITIVE_ANALYSIS.md` — Feature comparison, cost analysis
- `docs/FAILURE_MODE_ANALYSIS.md` — Risk register, black swans
- `docs/GRANT_APPLICATION_FRAMEWORK.md` — Funding pipeline
- `docs/ARCHITECTURE.md` — System design
- `docs/LONG_TERM_PLAN.md` — Product roadmap
- `docs/PLATFORM_RESEARCH.md` — data.gov.rs analysis
- `docs/LAUNCH_MATERIALS.md` — Product Hunt copy
- `docs/PILOT_PARTNER_PLAYBOOK.md` — Onboarding guide
- `recipes/inputs/feature-29-38-*.md` — Feature specifications

---

_Last Updated: 2026-03-16_
