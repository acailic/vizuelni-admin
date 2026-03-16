# Strategic Plan 2026: Vizuelni Admin Srbije

**Comprehensive Analysis Using Business Frameworks**

---

## Executive Summary

### Current State

**Vizuelni Admin Srbije** is a production-ready open-source platform for Serbian government data visualization with:

- **28 implemented features** across core visualization, data integration, and accessibility
- **9 chart types**: Line, Bar, Column, Area, Pie, Scatter, Map, Combo, Table
- **3 locales**: Serbian Cyrillic, Serbian Latin, English
- **3,412+ datasets** integrated via data.gov.rs API
- **174 municipalities** with GeoJSON boundaries for geographic visualization
- **WCAG 2.1 AA compliance** for accessibility

### Strategic Positioning

```
FROM: "A React charting library with Serbian localization"
TO:   "The canonical interface for Serbian government data"
```

### Key Numbers

| Metric                 | Current | Year 1 Target | Year 3 Target |
| ---------------------- | ------- | ------------- | ------------- |
| GitHub Stars           | ~100    | 500           | 5,000         |
| Enterprise Customers   | 0       | 3             | 15            |
| Revenue                | €0      | €126,000      | €400,000      |
| Documented Deployments | 5       | 10            | 200           |

### Three-Tier Value Proposition

1. **Civic Impact (Primary)**: Making government data accessible to every Serbian citizen
2. **Technical Excellence (Secondary)**: Government-grade reliability with developer-friendly simplicity
3. **Ecosystem Leadership (Tertiary)**: The standard for Balkan government data visualization

---

## Section 0: Document Overview

### Purpose

This document consolidates existing strategic documentation into a rigorous, framework-driven analysis to guide Vizuelni Admin Srbije's growth from 2026-2029.

### Scope

- Market analysis and competitive positioning
- Business model and revenue architecture
- Technical architecture and scaling strategy
- Product definition and prioritization
- Implementation roadmap with sprint planning
- Risk analysis and go-to-market strategy

### Frameworks Applied

| Framework                  | Application            | Section |
| -------------------------- | ---------------------- | ------- |
| Blue Ocean Strategy (ERRC) | Market positioning     | 1.1     |
| Jobs-to-be-Done            | User segments          | 1.2     |
| Wardley Mapping            | Value chain evolution  | 1.3     |
| TAM/SAM/SOM                | Market sizing          | 1.4     |
| Value Proposition Canvas   | Customer profiles      | 2.3     |
| RICE Scoring               | Feature prioritization | 4.1     |
| Probability-Impact Matrix  | Risk assessment        | 6.2     |

### Source Documents

This plan synthesizes:

- `docs/STRATEGIC_SUCCESS_PLAN.md` — Revenue projections, distribution channels
- `docs/FAILURE_MODE_ANALYSIS.md` — 8 failure modes, 3 black swans
- `docs/COMPETITIVE_ANALYSIS.md` — Feature comparison, cost analysis
- `docs/GRANT_APPLICATION_FRAMEWORK.md` — 12+ funding sources
- `docs/ARCHITECTURE.md` — System design, caching, plugin system
- `docs/PLATFORM_RESEARCH.md` — data.gov.rs analysis (3,412 datasets)
- `docs/LONG_TERM_PLAN.md` — 4-phase product roadmap
- `docs/PILOT_PARTNER_PLAYBOOK.md` — Onboarding, SLA, success metrics
- `docs/LAUNCH_MATERIALS.md` — Product Hunt, press materials
- `recipes/inputs/feature-29-38` — Feature specifications

---

## Section 1: Strategic Discovery & Market Analysis

### 1.1 Blue Ocean Strategy: ERRC Grid

Based on competitive analysis against Tableau, Power BI, Google Data Studio, and Observable.

| Action        | Element                        | Rationale                                            |
| ------------- | ------------------------------ | ---------------------------------------------------- |
| **Eliminate** | US data residency requirements | Serbian government data should never leave Serbia/EU |
| **Eliminate** | Complex enterprise licensing   | Confusing tiers create friction; simplify to 3 tiers |
| **Eliminate** | Manual Serbian data setup      | Pre-configure all data.gov.rs integration            |
| **Reduce**    | Learning curve                 | Target 5 min to first chart vs. days for competitors |
| **Reduce**    | Setup time                     | Zero-config StackBlitz demo, no installation         |
| **Reduce**    | Cost                           | €5K/yr vs. €11K+ for Tableau equivalent              |
| **Raise**     | Serbian language quality       | Native Cyrillic/Latin support, not afterthought      |
| **Raise**     | Data sovereignty               | Option for Serbia-only hosting, no US CLOUD Act      |
| **Raise**     | Government alignment           | Built for Serbian public sector requirements         |
| **Create**    | Pre-configured data.gov.rs     | Direct API integration, 3,412+ datasets ready        |
| **Create**    | 174 municipalities GeoJSON     | Serbian administrative boundaries built-in           |
| **Create**    | Cyrillic-native experience     | Full interface in Serbian Cyrillic                   |

#### Strategy Canvas

```
Factor                    Vizuelni   Tableau   Power BI   Google   Observable
──────────────────────────────────────────────────────────────────────────────
Serbian Language            ●●●●●      ●○○○○     ●○○○○     ●○○○○    ○○○○○
Cyrillic Support            ●●●●●      ●●○○○     ●●○○○     ●●○○○    ●○○○○
data.gov.rs Integration     ●●●●●      ○○○○○     ○○○○○     ○○○○○    ○○○○○
Serbian Regions             ●●●●●      ○○○○○     ○○○○○     ○○○○○    ○○○○○
Data Sovereignty            ●●●●●      ●○○○○     ●○○○○     ●○○○○    ●○○○○
Learning Curve (easy)       ●●●●●      ●●○○○     ●●●○○     ●●●●○    ●○○○○
Cost (low)                  ●●●●●      ●○○○○     ●●●○○     ●●●●●    ●●●●○
Advanced Analytics          ●●●○○      ●●●●●     ●●●●○     ●●●○○    ●●●●●
Chart Variety               ●●●●○      ●●●●●     ●●●●○     ●●●○○    ●●●●●
Community Size              ●○○○○      ●●●●●     ●●●●●     ●●●●○    ●●●○○
```

### 1.2 Jobs-to-be-Done Framework

Formalized from `docs/LONG_TERM_PLAN.md` audience analysis.

#### Segment 1: Citizens

**Job Statement:** When I want to understand how my government works, I want to see visual data about budgets and services, so I can make informed decisions as a voter and taxpayer.

| Element             | Description                                                            |
| ------------------- | ---------------------------------------------------------------------- |
| **Situation**       | Curious about government spending, service quality, or policy outcomes |
| **Motivation**      | Transparency and accountability                                        |
| **Outcome**         | Informed civic participation                                           |
| **Hiring Criteria** | Free, no registration, mobile-friendly, Serbian language               |
| **Firing Criteria** | Complex interface, English-only, requires download                     |

#### Segment 2: Journalists

**Job Statement:** When I'm investigating a government story, I want to quickly visualize official data, so I can include compelling graphics in my article without waiting for a developer.

| Element             | Description                                            |
| ------------------- | ------------------------------------------------------ |
| **Situation**       | Deadline pressure, need credible data visualization    |
| **Motivation**      | Reader engagement, story credibility                   |
| **Outcome**         | Published article with professional visualization      |
| **Hiring Criteria** | Export to PNG/PDF, embed code, data source attribution |
| **Firing Criteria** | Watermarks, no export, requires coding                 |

#### Segment 3: Government Officials

**Job Statement:** When I need to present data to stakeholders or the public, I want to create professional dashboards, so I can communicate clearly without hiring external consultants.

| Element             | Description                                                 |
| ------------------- | ----------------------------------------------------------- |
| **Situation**       | Budget presentations, public reports, inter-agency meetings |
| **Motivation**      | Transparency compliance, professional communication         |
| **Outcome**         | Approved budget, public trust, successful project           |
| **Hiring Criteria** | Serbian hosting, official branding, support in Serbian      |
| **Firing Criteria** | US servers, English support, no SLA                         |

#### Segment 4: Researchers

**Job Statement:** When I'm analyzing Serbian demographic or economic trends, I want to access and visualize official data, so I can include reproducible charts in my publications.

| Element             | Description                                        |
| ------------------- | -------------------------------------------------- |
| **Situation**       | Academic research, policy analysis, grant reports  |
| **Motivation**      | Publication quality, reproducibility               |
| **Outcome**         | Peer-reviewed paper, policy recommendation         |
| **Hiring Criteria** | Data export, API access, citation-ready exports    |
| **Firing Criteria** | Proprietary formats, no API, subscription required |

#### Segment 5: Developers

**Job Statement:** When I'm building an application that needs data visualization, I want React components that work with Serbian data, so I can ship faster without building from scratch.

| Element             | Description                                            |
| ------------------- | ------------------------------------------------------ |
| **Situation**       | Building dashboards, reports, or data products         |
| **Motivation**      | Development speed, maintainability                     |
| **Outcome**         | Shipped feature, happy users                           |
| **Hiring Criteria** | TypeScript, npm package, good docs, active maintenance |
| **Firing Criteria** | JavaScript-only, poor docs, abandoned project          |

### 1.3 Wardley Map

Value chain evolution from commodity to custom.

```
Evolution →
Genesis          Custom           Product          Commodity
    │               │                │                 │
    │    ┌──────────┴──────────┐     │                 │
    │    │   AI-Powered       │     │                 │
    │    │   Insights         │     │                 │
    │    └────────────────────┘     │                 │
    │                               │                 │
    │         ┌─────────────────────┴──────────┐      │
    │         │   Natural Language Chart      │      │
    │         │   Creation                    │      │
    │         └───────────────────────────────┘      │
    │                               │                 │
    │    ┌──────────────────────────┴──────────┐      │
    │    │   Custom Chart Plugins             │      │
    │    │   (Plugin System)                   │      │
    │    └─────────────────────────────────────┘      │
    │                    ┌────────────────────────────┴────────┐
    │                    │   Chart Configurator               │
    │                    │   (Visual Builder)                 │
    │                    └─────────────────────────────────────┘
    │          ┌───────────────────────────────────────┴───────┐
    │          │   Chart Rendering Engine                    │
    │          │   (Recharts + D3 + Leaflet)                 │
    │          └──────────────────────────────────────────────┘
    │                    ┌────────────────────────────────────┴────────┐
    │                    │   Data Transformation Layer                │
    │                    │   (Normalization, Aggregation)             │
    │                    └─────────────────────────────────────────────┘
    │          ┌───────────────────────────────────────┴───────┐
    │          │   Data Connectors                          │
    │          │   (data.gov.rs, CSV, JSON)                 │
    │          └─────────────────────────────────────────────┘
    │                    ┌────────────────────────────────────┴────────┐
    │                    │   data.gov.rs API                         │
    │                    │   (3,412 datasets)                        │
    │                    └─────────────────────────────────────────────┘
    ▼
User
   │
   └──▶ Citizen Understanding
```

**Evolution Analysis:**

| Component       | Stage     | Movement    | Strategy                            |
| --------------- | --------- | ----------- | ----------------------------------- |
| data.gov.rs API | Commodity | Stable      | Cache aggressively, handle failures |
| Data Connectors | Product   | → Commodity | Standardize, add more sources       |
| Chart Rendering | Product   | Stable      | Maintain, optimize performance      |
| Configurator    | Product   | → Commodity | Simplify UX, add templates          |
| Plugin System   | Custom    | → Product   | Document API, encourage ecosystem   |
| AI Insights     | Genesis   | → Custom    | Research, prototype, differentiate  |

### 1.4 TAM/SAM/SOM Market Sizing

#### Total Addressable Market (TAM)

**Western Balkans Government Data Visualization**

| Country         | Population | Gov Agencies | Est. Market |
| --------------- | ---------- | ------------ | ----------- |
| Serbia          | 6.6M       | 155+         | €15M        |
| Croatia         | 3.9M       | 100+         | €12M        |
| Bosnia          | 3.5M       | 50+          | €8M         |
| Slovenia        | 2.1M       | 80+          | €10M        |
| Montenegro      | 0.6M       | 30+          | €3M         |
| North Macedonia | 2.1M       | 40+          | €2M         |
| **Total**       | **18.8M**  | **455+**     | **€50M**    |

**TAM: €50M** (Western Balkans government + civic data visualization market)

#### Serviceable Addressable Market (SAM)

**Serbian Organizations Using Government Data**

| Segment               | Count   | Avg. Budget | Market Size |
| --------------------- | ------- | ----------- | ----------- |
| Government Agencies   | 155     | €15K/yr     | €2.3M       |
| Media Organizations   | 50      | €5K/yr      | €250K       |
| NGOs & Think Tanks    | 100     | €3K/yr      | €300K       |
| Academic Institutions | 30      | €10K/yr     | €300K       |
| Private Sector        | 200     | €10K/yr     | €2M         |
| **Total**             | **535** |             | **€5.15M**  |

**SAM: €5M** (Serbian organizations actively using government data)

#### Serviceable Obtainable Market (SOM)

**Year 1 Realistic Capture**

| Segment                 | Target | Price    | Revenue   |
| ----------------------- | ------ | -------- | --------- |
| Enterprise Licenses     | 3      | €5K/yr   | €15K      |
| Agency Licenses         | 5      | €2K/yr   | €10K      |
| Training Services       | 10     | €500/day | €5K       |
| Custom Development      | 50 hrs | €100/hr  | €5K       |
| Grants (EU, UNDP, etc.) | 2      | €50K avg | €100K     |
| **Total Year 1**        |        |          | **€135K** |

**SOM: €50K** (licenses) + **€100K** (grants) = **€150K Year 1**

**Conservative:** €100K | **Base:** €150K | **Optimistic:** €200K

### 1.5 Competitive Positioning Map

#### 2×2 Positioning Diagram

```
                        Serbian Specialization
                              HIGH
                                │
                                │
         ┌──────────────────────┼──────────────────────┐
         │                      │                      │
         │    Vizuelni Admin    │     Custom           │
         │    Srbije ●          │     Development      │
         │                      │         ●            │
    HIGH │                      │                      │ LOW
  Ease   ├──────────────────────┼──────────────────────┤
   of    │                      │                      │ Ease
   Use   │     Google Data      │     Tableau          │ of
         │     Studio ●         │         ●            │ Use
         │                      │                      │
    LOW  │     Power BI         │     Observable       │ HIGH
         │         ●            │         ●            │
         │                      │                      │
         └──────────────────────┼──────────────────────┘
                                │
                                │
                              LOW
```

#### SWOT Analysis

|              | **Strengths**                                                                                                                                              | **Weaknesses**                                                                                                                                  |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Internal** | • Serbian-first design<br>• data.gov.rs integration<br>• Open source (MIT)<br>• WCAG 2.1 AA compliant<br>• Full Cyrillic support<br>• 28 features complete | • Small community<br>• Single developer<br>• Limited marketing<br>• No sales team<br>• Regional focus limits scale                              |
| **External** | **Opportunities**                                                                                                                                          | **Threats**                                                                                                                                     |
|              | • EU accession pressure<br>• Serbia digital transformation<br>• Grant funding available<br>• Media partnership interest<br>• Regional expansion            | • Big tech entry (Google/Microsoft)<br>• data.gov.rs changes<br>• Political changes<br>• Economic instability<br>• Competitor with more funding |

---

## Section 2: Business Model Design

### 2.1 Revenue Architecture

#### Open-Core Model

```
┌─────────────────────────────────────────────────────────────┐
│                      OPEN CORE MODEL                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              FREE TIER (Forever)                     │   │
│  │  • Core visualization library                        │   │
│  │  • Basic chart types (9 types)                       │   │
│  │  • data.gov.rs integration                           │   │
│  │  • Community support                                 │   │
│  │  • Documentation & tutorials                         │   │
│  │  • 5 private charts                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                 │
│                           ▼                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              PAID TIERS                              │   │
│  │                                                      │   │
│  │  Municipal    Agency      Enterprise                 │   │
│  │  €1K/yr       €2K/yr      €5K/yr                    │   │
│  │  ────────     ────────    ─────────                 │   │
│  │  3 seats      5 seats     Unlimited                  │   │
│  │  Basic        Priority    SLA support                │   │
│  │  support      support     On-premise option          │   │
│  │               Custom      SSO integration            │   │
│  │               branding    Training included          │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                 │
│                           ▼                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              SERVICES                                │   │
│  │  • Training: €500/day                                │   │
│  │  • Custom Development: €100/hour                     │   │
│  │  • Implementation: €2K/week                          │   │
│  │  • Support Contract: €10K/year                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Revenue Streams

| Stream            | Price    | Year 1         | Year 2          | Year 3          |
| ----------------- | -------- | -------------- | --------------- | --------------- |
| **Licenses**      |          |                |                 |                 |
| Municipal         | €1K/yr   | 5 × €1K = €5K  | 15 × €1K = €15K | 30 × €1K = €30K |
| Agency            | €2K/yr   | 3 × €2K = €6K  | 10 × €2K = €20K | 20 × €2K = €40K |
| Enterprise        | €5K/yr   | 2 × €5K = €10K | 8 × €5K = €40K  | 15 × €5K = €75K |
| **Services**      |          |                |                 |                 |
| Training          | €500/day | €5K            | €20K            | €40K            |
| Development       | €100/hr  | €10K           | €30K            | €50K            |
| Support           | €10K/yr  | €0             | €10K            | €30K            |
| **Grants**        |          |                |                 |                 |
| EU/UNDP/USAID     | €50-500K | €100K          | €150K           | €100K           |
| **Total Revenue** |          | **€136K**      | **€285K**       | **€365K**       |

### 2.2 Unit Economics

#### Customer Acquisition Cost (CAC) by Channel

| Channel                 | Activities                  | Cost/Year | Customers | CAC    |
| ----------------------- | --------------------------- | --------- | --------- | ------ |
| **Government Outreach** | Events, meetings, demos     | €10K      | 5         | €2,000 |
| **Media Partnerships**  | Press, content, training    | €5K       | 10        | €500   |
| **Academic**            | University talks, materials | €2K       | 10        | €200   |
| **Community/SEO**       | Content, docs, GitHub       | €5K       | 25        | €200   |
| **Paid Ads**            | LinkedIn, Google            | €10K      | 20        | €500   |

#### Lifetime Value (LTV) by Segment

| Segment          | License | Avg. Retention | LTV  | Expansion       |
| ---------------- | ------- | -------------- | ---- | --------------- |
| **Municipality** | €1K/yr  | 3 years        | €3K  | +€1K training   |
| **Agency**       | €2K/yr  | 3 years        | €6K  | +€2K services   |
| **Enterprise**   | €5K/yr  | 4 years        | €20K | +€5K support    |
| **Media**        | €2K/yr  | 2 years        | €4K  | +€1K training   |
| **Academic**     | €2K/yr  | 5 years        | €10K | +€2K consulting |

#### LTV:CAC Ratios

| Segment          | LTV  | CAC    | LTV:CAC  | Payback   |
| ---------------- | ---- | ------ | -------- | --------- |
| **Enterprise**   | €20K | €2,000 | 10:1 ✅  | 4 months  |
| **Agency**       | €6K  | €500   | 12:1 ✅  | 3 months  |
| **Academic**     | €10K | €200   | 50:1 ✅  | <1 month  |
| **Municipality** | €3K  | €2,000 | 1.5:1 ⚠️ | 24 months |
| **Media**        | €4K  | €500   | 8:1 ✅   | 3 months  |

**Target LTV:CAC: 3:1 minimum**

#### Three Scenarios

| Scenario         | Year 1 Revenue | Year 2 Revenue | Year 3 Revenue | Assumptions                             |
| ---------------- | -------------- | -------------- | -------------- | --------------------------------------- |
| **Conservative** | €100K          | €180K          | €280K          | 2 enterprise, 5 agencies, €80K grants   |
| **Base**         | €136K          | €285K          | €365K          | 3 enterprise, 10 agencies, €100K grants |
| **Optimistic**   | €200K          | €400K          | €500K          | 5 enterprise, 15 agencies, €150K grants |

### 2.3 Value Proposition Canvas

#### Customer Profile: Government Agency

| **Jobs**                                                                                                                                                            | **Pains**                                                                                                                                                       | **Gains**                                                                                                                                         |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| • Publish transparency reports<br>• Create budget visualizations<br>• Meet EU compliance requirements<br>• Communicate with citizens<br>• Train staff on data tools | • Complex existing tools<br>• No Serbian language support<br>• Data sovereignty concerns<br>• Limited IT budget<br>• Staff turnover<br>• Procurement complexity | • Professional government branding<br>• Serbian support available<br>• Easy staff onboarding<br>• Compliance documentation<br>• Predictable costs |

| **Products**                                                                                                                    | **Pain Relievers**                                                                                                                         | **Gain Creators**                                                                                         |
| ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| • Visual chart builder<br>• Pre-configured datasets<br>• Export to PDF/PNG<br>• Serbian geographic data<br>• WCAG accessibility | • 5 min to first chart<br>• Native Serbian interface<br>• EU/Serbia hosting option<br>• €2K/year pricing<br>• Government procurement ready | • Serbian government branding<br>• Training included<br>• Compliance documentation<br>• Fixed annual cost |

---

#### Customer Profile: Media Organization

| **Jobs**                                                                                                                                              | **Pains**                                                                                                             | **Gains**                                                                                                          |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| • Create data journalism graphics<br>• Meet publication deadlines<br>• Build reader trust<br>• Cover government stories<br>• Create shareable content | • Tight deadlines<br>• No developer available<br>• Data access difficult<br>• Tools not localized<br>• Limited budget | • Quick turnaround<br>• Professional graphics<br>• Source attribution<br>• Embed capabilities<br>• Mobile-friendly |

| **Products**                                                                                                                     | **Pain Relievers**                                                                                                             | **Gain Creators**                                                                                   |
| -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| • Quick chart creation<br>• data.gov.rs integration<br>• Export/embed options<br>• Citation-ready exports<br>• No-code interface | • Charts in minutes not days<br>• Direct data access<br>• One-click embed<br>• Serbian language ready<br>• Free tier available | • Professional data journalism<br>• Credible sources<br>• Social media ready<br>• Reader engagement |

---

#### Customer Profile: NGO/Think Tank

| **Jobs**                                                                                                                          | **Pains**                                                                                                                           | **Gains**                                                                                                |
| --------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| • Produce policy reports<br>• Visualize research findings<br>• Apply for grants<br>• Advocate for change<br>• Engage stakeholders | • Limited technical capacity<br>• Tight budgets<br>• Need credible data<br>• Report formatting requirements<br>• Donor expectations | • Professional reports<br>• Credible visualizations<br>• Grant-ready outputs<br>• Stakeholder engagement |

| **Products**                                                                                                       | **Pain Relievers**                                                                                       | **Gain Creators**                                                      |
| ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| • Report-ready exports<br>• Official data sources<br>• Custom branding<br>• Accessibility compliance<br>• Training | • No developer needed<br>• Free tier for NGOs<br>• Official data attribution<br>• Professional templates | • Grant-compliant outputs<br>• Stakeholder trust<br>• Policy influence |

---

#### Customer Profile: Academic Institution

| **Jobs**                                                                                                                                | **Pains**                                                                                                                        | **Gains**                                                                                          |
| --------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| • Publish research<br>• Teach data literacy<br>• Create course materials<br>• Support student projects<br>• Collaborate internationally | • Budget constraints<br>• Student skill levels vary<br>• Need reproducibility<br>• Citation requirements<br>• Software licensing | • Educational pricing<br>• Easy student onboarding<br>• Reproducible outputs<br>• Citation support |

| **Products**                                                                                      | **Pain Relievers**                                                                         | **Gain Creators**                                                                                   |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| • Academic pricing<br>• Tutorial materials<br>• API access<br>• Export options<br>• Documentation | • Free for teaching<br>• Student-friendly UX<br>• Open data access<br>• Proper attribution | • Research-ready tools<br>• Student skill development<br>• Publication quality<br>• Reproducibility |

---

### 2.4 Pricing Sensitivity

#### Serbian Municipal Budget Analysis

| Municipality Type                   | Avg. Budget | IT Budget | Viz Tool Budget | Affordability    |
| ----------------------------------- | ----------- | --------- | --------------- | ---------------- |
| **Large City** (Belgrade, Novi Sad) | €500M+      | €5M+      | €10-50K         | €5K: ✅ Easy     |
| **Medium City** (50-200K pop)       | €50-100M    | €500K-1M  | €5-15K          | €5K: ✅ Easy     |
| **Small Municipality** (<50K pop)   | €5-20M      | €50-200K  | €1-5K           | €2K: ✅ Feasible |
| **Rural Municipality** (<10K pop)   | €1-5M       | €10-50K   | €500-2K         | €1K: ⚠️ Stretch  |

#### Proposed Tiered Pricing

| Tier           | Price     | Target                    | Rationale                        |
| -------------- | --------- | ------------------------- | -------------------------------- |
| **Municipal**  | €1,000/yr | Small municipalities      | Within reach of smallest budgets |
| **Agency**     | €2,000/yr | Government agencies, NGOs | Standard government procurement  |
| **Enterprise** | €5,000/yr | Ministries, large orgs    | Includes premium features        |

#### PPP-Adjusted Competitor Comparison

| Solution        | US Price | PPP-Adjusted (Serbia) | Our Price              |
| --------------- | -------- | --------------------- | ---------------------- |
| Tableau Desktop | $840/yr  | ~€350                 | €2,000 (Agency)        |
| Power BI Pro    | $120/yr  | ~€50                  | €2,000 (more features) |
| Observable Team | $300/yr  | ~€125                 | Free tier available    |

**Note:** Our pricing reflects the value of Serbian-specific features, not just PPP adjustment.

### 2.5 Grant Pipeline

#### Probability-Weighted Grant Revenue

| Funder                     | Program               | Amount | Probability | Timeline | Weighted |
| -------------------------- | --------------------- | ------ | ----------- | -------- | -------- |
| **EU Digital Europe**      | Digital Citizenship   | €200K  | 25%         | Q3 2026  | €50K     |
| **UNDP Serbia**            | Democratic Governance | €75K   | 40%         | Q2 2026  | €30K     |
| **USAID Serbia**           | Good Governance       | €100K  | 30%         | Q4 2026  | €30K     |
| **Open Society**           | Information Program   | €50K   | 35%         | Q2 2026  | €17.5K   |
| **NED**                    | Democracy Grants      | €75K   | 25%         | Q3 2026  | €18.75K  |
| **Innovation Fund Serbia** | Tech Development      | €25K   | 50%         | Q1 2026  | €12.5K   |
| **Rockefeller**            | Data & Tech           | €150K  | 15%         | Q4 2026  | €22.5K   |
| **Ford Foundation**        | Just Tech             | €100K  | 20%         | Q3 2026  | €20K     |

**Total Weighted Pipeline: €201.25K**

#### Cash Flow Projection

| Quarter          | Grants       | Licenses | Services | Total        | Cumulative |
| ---------------- | ------------ | -------- | -------- | ------------ | ---------- |
| **Q1 2026**      | €12.5K       | €5K      | €2K      | €19.5K       | €19.5K     |
| **Q2 2026**      | €47.5K       | €5K      | €5K      | €57.5K       | €77K       |
| **Q3 2026**      | €91.25K      | €10K     | €8K      | €109.25K     | €186.25K   |
| **Q4 2026**      | €72.5K       | €10K     | €5K      | €87.5K       | €273.75K   |
| **Year 1 Total** | **€223.75K** | **€30K** | **€20K** | **€273.75K** |            |

---

## Section 3: Technical Architecture

### 3.1 Architecture Decision Records (ADRs)

#### ADR-001: Next.js 14 App Router

**Status:** Accepted (2024)

**Context:**

- Need server-side rendering for SEO and performance
- Require file-based routing with internationalization
- Must support both static export and full server deployment

**Decision:**
Use Next.js 14 with App Router (`src/app/[locale]/`) as the primary framework.

**Alternatives Considered:**
| Alternative | Rejected Because |
|-------------|------------------|
| Create React App | No SSR, limited i18n |
| Vite + React Router | Less integrated i18n support |
| Remix | Smaller ecosystem, less Next.js tooling |

**Consequences:**

- ✅ Built-in i18n routing via next-intl
- ✅ Server components for performance
- ✅ Static export capability for GitHub Pages
- ⚠️ App Router is newer, some patterns still evolving
- ⚠️ Requires careful handling of client/server boundaries

---

#### ADR-002: Recharts + D3 + Leaflet for Visualization

**Status:** Accepted (2024)

**Context:**

- Need 9+ chart types with customization
- Geographic visualization for Serbian regions
- Balance between ease-of-use and flexibility

**Decision:**

- **Recharts**: Primary charts (bar, line, area, pie, scatter)
- **D3**: Custom visualizations and chart enhancements
- **Leaflet**: Interactive maps with Serbian GeoJSON

**Alternatives Considered:**
| Alternative | Rejected Because |
|-------------|------------------|
| Chart.js | Less React-native, limited customization |
| Plotly.js | Larger bundle, complex React integration |
| Victory | Smaller community, less chart variety |
| Pure D3 | Steeper learning curve, more code |

**Consequences:**

- ✅ Recharts: Simple React integration, good defaults
- ✅ D3: Unlimited customization for special cases
- ✅ Leaflet: Proven mapping with GeoJSON support
- ⚠️ Multiple libraries increase bundle size
- ⚠️ Team needs expertise in multiple systems

---

#### ADR-003: Prisma with SQLite (dev) / PostgreSQL (prod)

**Status:** Accepted (2024)

**Context:**

- Need type-safe database access
- Support local development without infrastructure
- Scale to production with proper database

**Decision:**
Use Prisma ORM with SQLite for development and PostgreSQL for production.

**Alternatives Considered:**
| Alternative | Rejected Because |
|-------------|------------------|
| Raw SQL | No type safety, more boilerplate |
| TypeORM | More complex, less intuitive API |
| Drizzle | Less mature, smaller ecosystem |
| MongoDB | Not ideal for relational chart data |

**Consequences:**

- ✅ Zero-config local development (SQLite)
- ✅ Type-safe queries with TypeScript
- ✅ Easy migrations and schema management
- ✅ Same codebase works in both environments
- ⚠️ Some PostgreSQL features not available in SQLite
- ⚠️ Need to handle database switching in deployment

---

#### ADR-004: NextAuth v4 with JWT Sessions

**Status:** Accepted (2024)

**Context:**

- Need authentication for saved charts and user features
- Support multiple OAuth providers
- Serbian government users may prefer email/password

**Decision:**
Use NextAuth.js v4 with JWT session strategy (30-day max age).

**Configuration:**

```typescript
// src/lib/auth/auth-options.ts
session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 }
providers: [GitHub, Google, Credentials]
```

**Alternatives Considered:**
| Alternative | Rejected Because |
|-------------|------------------|
| Auth0 | Cost, external dependency |
| Supabase Auth | Lock-in to Supabase ecosystem |
| Custom JWT | More code, security risks |
| Session-based auth | Requires sticky sessions |

**Consequences:**

- ✅ Multiple provider options
- ✅ JWT works with static deployment
- ✅ Built-in CSRF protection
- ⚠️ JWT cannot be revoked before expiration
- ⚠️ Limited session metadata

---

#### ADR-005: Zustand for State Management

**Status:** Accepted (2024)

**Context:**

- Need client-side state for chart configurator
- Want simple, TypeScript-friendly API
- Avoid Redux complexity

**Decision:**
Use Zustand for cross-component client state management.

**Stores:**

- `src/stores/chart-config-store.ts` — Chart configuration state
- `src/stores/ui-store.ts` — UI state (sidebar, modals)

**Alternatives Considered:**
| Alternative | Rejected Because |
|-------------|------------------|
| Redux Toolkit | More boilerplate, steeper learning curve |
| Jotai | Smaller ecosystem |
| React Context | Re-renders, less performant |
| MobX | More complex mental model |

**Consequences:**

- ✅ Minimal boilerplate
- ✅ TypeScript-first design
- ✅ Works well with React Query
- ⚠️ No built-in devtools (Redux has better tooling)
- ⚠️ Team needs to learn Zustand patterns

---

#### ADR-006: next-intl for Internationalization

**Status:** Accepted (2024)

**Context:**

- Must support Serbian Cyrillic, Serbian Latin, and English
- Need server-side and client-side translation
- URL-based locale routing

**Decision:**
Use next-intl with three locales: `sr-Cyrl`, `sr-Latn`, `en`.

**Configuration:**

```typescript
// src/lib/i18n/config.ts
locales: ['sr-Cyrl', 'sr-Latn', 'en'];
defaultLocale: 'sr-Cyrl';
```

**Alternatives Considered:**
| Alternative | Rejected Because |
|-------------|------------------|
| next-i18next | More complex setup |
| react-intl | Less Next.js integration |
| Custom solution | Reinventing the wheel |

**Consequences:**

- ✅ Native App Router support
- ✅ Server and client components
- ✅ Automatic locale detection
- ⚠️ Requires maintaining 3 translation files
- ⚠️ Some strings may not translate well

---

#### ADR-007: 3-Tier Caching Strategy

**Status:** Accepted (2024)

**Context:**

- data.gov.rs API has rate limits
- Need fast response times for charts
- Support offline capability

**Decision:**
Implement 3-tier caching: L1 (Memory) → L2 (IndexedDB) → L3 (Network).

**Configuration:**

```typescript
// src/lib/cache/cache-config.ts
L1_MAX_SIZE: 50MB, L1_MAX_ENTRIES: 1000, DEFAULT_TTL: 5min
L2_MAX_SIZE: 200MB, L2_MAX_ENTRIES: 10000
```

**Alternatives Considered:**
| Alternative | Rejected Because |
|-------------|------------------|
| Memory only | Lost on refresh, no persistence |
| Service Worker | More complex, harder to debug |
| LocalStorage | Synchronous, blocks main thread |
| No caching | API rate limits, slow UX |

**Consequences:**

- ✅ Fast repeated access (L1)
- ✅ Persists across sessions (L2)
- ✅ Works offline with cached data
- ⚠️ Cache invalidation complexity
- ⚠️ IndexedDB has browser compatibility edge cases

---

#### ADR-008: Dual Deployment (Static + Server)

**Status:** Accepted (2024)

**Context:**

- GitHub Pages deployment requires static export
- Full features (auth, database) need server deployment
- Some users want self-hosted option

**Decision:**
Support both static export (GitHub Pages) and full server deployment (Vercel, Docker).

**Implementation:**

- Static: `next build` with static export, client-side data fetching
- Server: Full Next.js with API routes, Prisma, authentication

**Alternatives Considered:**
| Alternative | Rejected Because |
|-------------|------------------|
| Static only | No auth, no database features |
| Server only | No free hosting option |
| Separate codebases | Maintenance burden |

**Consequences:**

- ✅ Free hosting option (GitHub Pages)
- ✅ Full features when needed
- ✅ Self-hosted option for government
- ⚠️ Feature parity management
- ⚠️ Different testing requirements

---

### 3.2 Scaling Tiers

| Users      | Infrastructure         | Database           | Caching            | Est. Monthly Cost |
| ---------- | ---------------------- | ------------------ | ------------------ | ----------------- |
| **0-1K**   | Single Vercel instance | SQLite/Neon Free   | Memory + IndexedDB | €0-20             |
| **1K-5K**  | Vercel Pro + CDN       | PostgreSQL (Neon)  | Add Redis          | €50-100           |
| **5K-20K** | Horizontal scaling     | DB replication     | Redis cluster      | €200-500          |
| **20K+**   | Kubernetes/containers  | Sharded PostgreSQL | CDN + Redis        | €1K+              |

### 3.3 Monitoring & Observability

| Layer           | Tool          | Purpose                     | Status            |
| --------------- | ------------- | --------------------------- | ----------------- |
| **Application** | Sentry        | Error tracking, performance | Configured in env |
| **Analytics**   | Plausible     | Privacy-focused analytics   | Implemented       |
| **Performance** | Web Vitals    | Core metrics tracking       | Built-in Next.js  |
| **Uptime**      | Health checks | Availability monitoring     | Simple endpoint   |
| **Logs**        | Vercel Logs   | Request/response logs       | Platform provided |

---

## Section 4: Product Definition

### 4.1 RICE Scoring for Features 29-38

**Formula:** RICE = (Reach × Impact × Confidence) / Effort

| Feature                         | Reach (users/qtr) | Impact (0.25-3) | Confidence (%) | Effort (weeks) | RICE Score |
| ------------------------------- | ----------------- | --------------- | -------------- | -------------- | ---------- |
| **F29: App Shell Foundation**   | 5,000             | 3 (massive)     | 100%           | 1              | 1,500      |
| **F30: Homepage Landing**       | 5,000             | 2 (high)        | 90%            | 1              | 900        |
| **F31: Gallery Page**           | 3,000             | 2 (high)        | 90%            | 2              | 270        |
| **F32: User Dashboard**         | 1,000             | 2 (high)        | 85%            | 2              | 85         |
| **F37: Serbian Data Library**   | 4,000             | 2.5 (very high) | 95%            | 2              | 475        |
| **F38: Chart Showcase Gallery** | 4,000             | 2 (high)        | 90%            | 2              | 360        |
| **F33: PWA**                    | 2,000             | 1.5 (medium)    | 80%            | 1              | 240        |
| **F35: Advanced Search**        | 3,000             | 1.5 (medium)    | 75%            | 2              | 169        |
| **F36: PDF Reports**            | 1,500             | 1.5 (medium)    | 85%            | 1.5            | 128        |
| **F34: Notifications**          | 500               | 1 (low)         | 80%            | 1.5            | 27         |

**Priority Order:**

1. F29: App Shell Foundation (RICE: 1,500) — **Critical path**
2. F30: Homepage Landing (RICE: 900)
3. F37: Serbian Data Library (RICE: 475)
4. F38: Chart Showcase Gallery (RICE: 360)
5. F31: Gallery Page (RICE: 270)
6. F33: PWA (RICE: 240)
7. F35: Advanced Search (RICE: 169)
8. F36: PDF Reports (RICE: 128)
9. F32: User Dashboard (RICE: 85)
10. F34: Notifications (RICE: 27)

### 4.2 Dataset Prioritization

Top 10 data.gov.rs datasets to curate, scored by public interest, data quality, viz potential, and political neutrality.

| Rank | Dataset                        | Category     | Interest | Quality | Viz | Neutral | Total |
| ---- | ------------------------------ | ------------ | -------- | ------- | --- | ------- | ----- |
| 1    | **Population by Municipality** | Demographics | 5        | 5       | 5   | 5       | 20    |
| 2    | **Budget Execution**           | Finance      | 5        | 4       | 5   | 3       | 17    |
| 3    | **Employment Statistics**      | Economy      | 5        | 4       | 4   | 4       | 17    |
| 4    | **Birth/Death Rates**          | Demographics | 4        | 5       | 5   | 5       | 19    |
| 5    | **Migration Statistics**       | Demographics | 5        | 4       | 4   | 3       | 16    |
| 6    | **Healthcare Resources**       | Health       | 4        | 4       | 4   | 4       | 16    |
| 7    | **Education Enrollment**       | Education    | 4        | 4       | 4   | 5       | 17    |
| 8    | **Road Accidents**             | Transport    | 4        | 4       | 4   | 4       | 16    |
| 9    | **Environmental Indicators**   | Environment  | 4        | 3       | 4   | 4       | 15    |
| 10   | **Tourism Statistics**         | Economy      | 3        | 4       | 4   | 5       | 16    |

### 4.3 Visualization Templates

5 pre-configured template definitions for common use cases.

#### Template 1: Budget Transparency

```yaml
name: Budget Transparency
chart_types: [Sankey, Treemap, Stacked Bar]
data_sources: [Budget Execution, Revenue by Category]
color_palette: Government Blue (#0D4077)
features:
  - Year-over-year comparison
  - Category drill-down
  - Per capita calculation
export: [PDF, PNG, Embed]
```

#### Template 2: Population Statistics

```yaml
name: Population Statistics
chart_types: [Population Pyramid, Line Chart, Choropleth Map]
data_sources: [Census, Birth/Death Rates, Migration]
color_palette: Demographics Blue
features:
  - Age group breakdown
  - Regional comparison
  - Trend over time
export: [PDF, PNG, Embed]
```

#### Template 3: Healthcare Dashboard

```yaml
name: Healthcare Dashboard
chart_types: [Bar Chart, Line Chart, Map]
data_sources: [Healthcare Resources, Hospital Beds, Doctors]
color_palette: Healthcare Green
features:
  - Regional comparison
  - EU benchmark
  - Time series
export: [PDF, PNG, Embed]
```

#### Template 4: Economic Indicators

```yaml
name: Economic Indicators
chart_types: [Combo Chart (Line + Bar), Table]
data_sources: [GDP, Employment, Inflation]
color_palette: Economy Amber
features:
  - Dual Y-axis
  - Multiple indicators
  - Quarterly/Annual toggle
export: [PDF, PNG, Excel, Embed]
```

#### Template 5: Election Results

```yaml
name: Election Results
chart_types: [Choropleth Map, Stacked Bar, Pie]
data_sources: [Election Results by Municipality]
color_palette: Political Party Colors
features:
  - Geographic visualization
  - Party comparison
  - Turnout overlay
export: [PDF, PNG, Embed]
```

### 4.4 User Journey Maps

#### Persona 1: Citizen (Ana)

```
DISCOVER          EXPLORE           CREATE           SHARE            RETURN
    │                │                 │                │                 │
    ▼                ▼                 ▼                ▼                 ▼
┌────────┐      ┌────────┐       ┌────────┐       ┌────────┐       ┌────────┐
│Google  │─────▶│Browse  │──────▶│View    │──────▶│Share   │──────▶│Check   │
│Search  │      │Home    │       │Chart   │       │Link    │       │Updates │
└────────┘      └────────┘       └────────┘       └────────┘       └────────┘
    │                │                 │                │                 │
    │                │                 │                │                 │
    ▼                ▼                 ▼                ▼                 ▼
 Landing Page    Featured       Interactive       Copy URL         Newsletter
 w/ Serbian     Charts         Chart with        or Embed         or Bookmark
 Data Stats     Filter         Tooltips          Code
```

**Key Metrics:**

- Time to first chart: < 30 seconds
- Bounce rate: < 40%
- Return rate: 20%

---

#### Persona 2: Journalist (Milan)

```
DISCOVER          EXPLORE           CREATE           SHARE            RETURN
    │                │                 │                │                 │
    ▼                ▼                 ▼                ▼                 ▼
┌────────┐      ┌────────┐       ┌────────┐       ┌────────┐       ┌────────┐
│Press   │─────▶│Search  │──────▶│Create  │──────▶│Export  │──────▶│Create  │
│Release │      │Dataset │       │Chart   │       │PNG/PDF │       │Series  │
└────────┘      └────────┘       └────────┘       └────────┘       └────────┘
    │                │                 │                │                 │
    │                │                 │                │                 │
    ▼                ▼                 ▼                ▼                 ▼
 Media          Keyword        Configurator      Download         Dashboard
 Mention        Search         w/ Templates      w/ Attribution   w/ Saved
```

**Key Metrics:**

- Time to publishable chart: < 10 minutes
- Export success rate: > 95%
- Attribution compliance: 100%

---

#### Persona 3: Government Official (Jelena)

```
DISCOVER          EXPLORE           CREATE           SHARE            RETURN
    │                │                 │                │                 │
    ▼                ▼                 ▼                ▼                 ▼
┌────────┐      ┌────────┐       ┌────────┐       ┌────────┐       ┌────────┐
│Internal│─────▶│Browse  │──────▶│Create  │──────▶│Publish │──────▶│Update  │
│Training│      │Agency  │       │Dashboard│      │to Web  │       │Reports │
└────────┘      │Data    │       └────────┘       └────────┘       └────────┘
    │           └────────┘             │                │                 │
    │                │                 │                │                 │
    ▼                ▼                 ▼                ▼                 ▼
 Workshop       Pre-loaded      Dashboard        Embed on         Scheduled
 Materials      Templates       Builder          Agency Site      Reports
```

**Key Metrics:**

- Training completion: 100%
- Dashboard adoption: > 80% of trainees
- Report generation: Weekly

---

#### Persona 4: Developer (Nikola)

```
DISCOVER          EXPLORE           CREATE           SHARE            RETURN
    │                │                 │                │                 │
    ▼                ▼                 ▼                ▼                 ▼
┌────────┐      ┌────────┐       ┌────────┐       ┌────────┐       ┌────────┐
│GitHub  │─────▶│Docs &  │──────▶│Integrate│──────▶│Deploy  │──────▶│Contribute│
│Trending│      │Examples│       │Library │       │to Prod │       │Back     │
└────────┘      └────────┘       └────────┘       └────────┘       └────────┘
    │                │                 │                │                 │
    │                │                 │                │                 │
    ▼                ▼                 ▼                ▼                 ▼
 npm            StackBlitz      TypeScript       CI/CD            PR with
 Download       Demo            Integration      Pipeline         Feature
```

**Key Metrics:**

- Time to first integration: < 1 hour
- Documentation satisfaction: > 4.5/5
- GitHub stars: > 500 Year 1

---

## Section 5: Implementation Roadmap

### 5.1 Sprint Plan (12 Sprints × 2 Weeks)

#### Sprint 1-2: Foundation (Weeks 1-4)

| Sprint | Feature              | Tasks                        | Owner |
| ------ | -------------------- | ---------------------------- | ----- |
| **S1** | App Shell Foundation | Sidebar, Header, Navigation  | Dev   |
| **S2** | Homepage Landing     | Hero, Stats, Getting Started | Dev   |

**Dependency:** App Shell is critical path — all subsequent features depend on it.

#### Sprint 3-4: Data & Showcase (Weeks 5-8)

| Sprint | Feature                | Tasks                                    | Owner |
| ------ | ---------------------- | ---------------------------------------- | ----- |
| **S3** | Serbian Data Library   | Dataset registry, Browse integration     | Dev   |
| **S4** | Chart Showcase Gallery | Showcase components, Landing integration | Dev   |

**Parallel Track:** Can run S3 and S4 in parallel with 2 developers.

#### Sprint 5-6: Discovery (Weeks 9-12)

| Sprint | Feature              | Tasks                               | Owner |
| ------ | -------------------- | ----------------------------------- | ----- |
| **S5** | Gallery Page         | Public gallery, Chart detail, Embed | Dev   |
| **S6** | Gallery Page (cont.) | Search, Filters, Pagination         | Dev   |

#### Sprint 7-8: User Features (Weeks 13-16)

| Sprint | Feature                | Tasks                      | Owner |
| ------ | ---------------------- | -------------------------- | ----- |
| **S7** | User Dashboard         | My Charts, Tabs, Actions   | Dev   |
| **S8** | User Dashboard (cont.) | Delete, Edit, Empty states | Dev   |

#### Sprint 9-10: Enhancement (Weeks 17-20)

| Sprint  | Feature         | Tasks                             | Owner |
| ------- | --------------- | --------------------------------- | ----- |
| **S9**  | Advanced Search | Faceted search, Autocomplete      | Dev   |
| **S10** | PWA             | Service worker, Manifest, Offline | Dev   |

#### Sprint 11-12: Polish (Weeks 21-24)

| Sprint  | Feature       | Tasks                       | Owner |
| ------- | ------------- | --------------------------- | ----- |
| **S11** | PDF Reports   | Report template, Export API | Dev   |
| **S12** | Notifications | Bell, Panel, API            | Dev   |

#### Dependency Graph

```
F29 App Shell ─────────────────────────────────────────────────────────┐
    │                                                                   │
    ├──▶ F30 Homepage ──▶ F38 Showcase ──▶ F31 Gallery                 │
    │                                                                   │
    └──▶ F37 Data Library ──▶ F35 Search                               │
                                                                        │
F32 Dashboard (independent, can run parallel)                           │
                                                                        │
F33 PWA ──▶ F36 PDF Reports                                            │
                                                                        │
F34 Notifications (independent) ◀──────────────────────────────────────┘
```

### 5.2 KPI Dashboard

Consolidated from `STRATEGIC_SUCCESS_PLAN.md` and `FAILURE_MODE_ANALYSIS.md`.

#### Product Metrics

| KPI                 | Q1 Target | Q2 Target | Q3 Target | Q4 Target |
| ------------------- | --------- | --------- | --------- | --------- |
| Charts Created      | 100       | 250       | 500       | 1,000     |
| Public Charts       | 50        | 150       | 300       | 500       |
| Datasets Visualized | 20        | 50        | 100       | 200       |

#### Growth Metrics

| KPI                | Q1 Target | Q2 Target | Q3 Target | Q4 Target |
| ------------------ | --------- | --------- | --------- | --------- |
| GitHub Stars       | 200       | 300       | 400       | 500       |
| npm Downloads/week | 200       | 500       | 750       | 1,000     |
| Unique Visitors    | 1,000     | 3,000     | 5,000     | 10,000    |

#### Revenue Metrics

| KPI                  | Q1 Target | Q2 Target | Q3 Target | Q4 Target |
| -------------------- | --------- | --------- | --------- | --------- |
| Enterprise Customers | 0         | 1         | 2         | 3         |
| Agency Customers     | 1         | 2         | 3         | 5         |
| Grant Revenue        | €12.5K    | €47.5K    | €91K      | €72K      |

#### Quality Metrics

| KPI                 | Target     | Measurement      |
| ------------------- | ---------- | ---------------- |
| Lighthouse Score    | > 90       | Weekly automated |
| Uptime              | > 99.5%    | Monthly          |
| Bug Resolution Time | < 48 hours | Per incident     |
| User Satisfaction   | > 4/5      | Quarterly survey |

### 5.3 Resource Model

#### Solo Developer Reality

| Resource             | Availability | Notes                   |
| -------------------- | ------------ | ----------------------- |
| **Core Developer**   | 40 hrs/week  | Full-time equivalent    |
| **Contract Support** | 10 hrs/week  | Design, QA as needed    |
| **Community**        | Variable     | Contributions, feedback |

#### Effort Estimates per Feature

| Feature            | Dev Hours     | Weeks        | Complexity |
| ------------------ | ------------- | ------------ | ---------- |
| F29: App Shell     | 40            | 1            | Medium     |
| F30: Homepage      | 40            | 1            | Low        |
| F31: Gallery       | 80            | 2            | Medium     |
| F32: Dashboard     | 80            | 2            | Medium     |
| F33: PWA           | 40            | 1            | Medium     |
| F34: Notifications | 60            | 1.5          | Medium     |
| F35: Search        | 80            | 2            | High       |
| F36: PDF Reports   | 60            | 1.5          | Medium     |
| F37: Data Library  | 80            | 2            | Medium     |
| F38: Showcase      | 80            | 2            | Medium     |
| **Total**          | **640 hours** | **16 weeks** |            |

**With Buffer (20%):** 768 hours / 19 weeks

**Realistic Timeline:** 24 weeks (6 months) accounting for:

- Context switching
- Bug fixes
- Documentation
- Community support
- Meetings and coordination

---

## Section 6: Risk Analysis & Go-to-Market

### 6.1 Enhanced Risk Register

Updated from `docs/FAILURE_MODE_ANALYSIS.md` with quantified financial impact.

| ID      | Risk                    | Prob | Impact   | Financial Impact    | Mitigation                   | Owner    |
| ------- | ----------------------- | ---- | -------- | ------------------- | ---------------------------- | -------- |
| FM-1    | data.gov.rs shutdown    | 10%  | Critical | €50K revenue loss   | Cache all data, alt sources  | Tech     |
| FM-2    | No agency adoption Y1   | 30%  | Critical | €100K revenue loss  | Pivot to media/NGO           | Product  |
| FM-3    | Free competitor         | 25%  | High     | €75K revenue loss   | Differentiate on sovereignty | Strategy |
| FM-4    | Grant failure           | 50%  | High     | €100K funding gap   | Diversify revenue            | Director |
| FM-5    | Key dev leaves          | 20%  | Critical | 3-month delay       | Documentation, redundancy    | HR       |
| FM-6    | Security breach         | 5%   | Critical | €50K+ liability     | Security audits, monitoring  | Security |
| FM-7    | Political change        | 15%  | High     | €50K revenue impact | Diversify customers          | Director |
| FM-8    | Performance issues      | 30%  | Medium   | €20K user churn     | Scaling plan, monitoring     | Tech     |
| **NEW** | Tech debt accumulation  | 40%  | Medium   | 20% velocity loss   | Maintenance sprints          | Tech     |
| **NEW** | Next.js major migration | 20%  | Medium   | 2-week delay        | Gradual upgrades             | Tech     |

### 6.2 5×5 Probability-Impact Matrix

```
                        IMPACT
                 Low    Medium   High    Critical
                ────────────────────────────────────
         High  │        FM-8              FM-4      │
               │                                 FM-2│
    PROB       ├────────────────────────────────────┤
         Med   │        NEW   FM-3   FM-7          │
               │              NEW                   │
               ├────────────────────────────────────┤
         Low   │                      FM-1   FM-5  │
               │                      FM-6         │
               ├────────────────────────────────────┤
         V.Low │                                   │
               │              BS-1  BS-2  BS-3     │
               └────────────────────────────────────┘

Legend:
FM-1: data.gov.rs shutdown
FM-2: No adoption
FM-3: Free competitor
FM-4: Grant failure
FM-5: Key dev leaves
FM-6: Security breach
FM-7: Political change
FM-8: Performance issues
NEW: Tech debt, Next.js migration
BS-1/2/3: Black swan events
```

### 6.3 Go-to-Market Strategy

#### Phase 0: Pre-Launch (Weeks 1-4)

**Activities:**

- Complete interactive tutorials
- Record 5 video walkthroughs (Serbian + English)
- Create "Getting Started" guide for non-developers
- Prepare Product Hunt launch materials
- Draft press release for Serbian tech media

**Deliverables:**

- [ ] Interactive tutorial complete
- [ ] Video walkthroughs published
- [ ] Press kit ready
- [ ] Product Hunt submission ready

**Source:** `docs/LAUNCH_MATERIALS.md`

#### Phase 1: Soft Launch (Weeks 5-12)

**Activities:**

- Recruit 5 pilot partners
- Begin government outreach
- Launch Product Hunt campaign
- Publish first case studies

**Pilot Partner Targets:**
| Type | Count | Value |
|------|-------|-------|
| Government Agency | 2 | Reference |
| Media Organization | 2 | Case study |
| NGO | 1 | Case study |

**Success Metrics:**

- 5 pilot partners onboarded
- 2 case studies published
- 100 Product Hunt upvotes

**Source:** `docs/PILOT_PARTNER_PLAYBOOK.md`

#### Phase 2: Growth (Months 4-12)

**Activities:**

- Conference presentations (Webiz, DUMP, SINFO)
- Grant applications (EU, UNDP, USAID)
- Academic partnerships
- Media partnership expansion

**Targets:**
| Activity | Count | Impact |
|----------|-------|--------|
| Conferences | 3 | Brand awareness |
| Grants Applied | 5 | €100K+ potential |
| University Partners | 2 | Talent pipeline |
| Media Partners | 3 | Content distribution |

#### Phase 3: Scale (Year 2+)

**Activities:**

- Regional expansion (Croatia, Slovenia, Bosnia)
- Enterprise sales motion
- "Balkan Open Data Visualization Alliance"
- Regional conference in Belgrade

**Expansion Criteria:**

- 500+ GitHub stars
- 3+ enterprise customers
- €100K+ annual revenue
- Self-sustaining operations

### 6.4 Financial Contingency

#### Cash Runway Analysis

| Burn Rate | Runway with €50K | Runway with €100K | Runway with €150K |
| --------- | ---------------- | ----------------- | ----------------- |
| €2K/month | 25 months        | 50 months         | 75 months         |
| €4K/month | 12 months        | 25 months         | 37 months         |
| €6K/month | 8 months         | 16 months         | 25 months         |

#### Decision Gates

| Scenario         | Trigger                                                | Action                                      |
| ---------------- | ------------------------------------------------------ | ------------------------------------------- |
| **Pivot**        | < €20K revenue + < 3 customers by Month 12             | Focus on media/NGO, reduce enterprise focus |
| **Scale**        | > €100K revenue + > 5 enterprise customers by Month 12 | Hire additional developer                   |
| **Seek Funding** | Strong traction + expansion opportunity                | Raise €250K seed round                      |
| **Sustain**      | €50-100K revenue + stable growth                       | Continue solo, build community              |

---

## Appendix A: Key Metrics Summary

| Category    | Metric           | Current | Y1 Target | Y3 Target |
| ----------- | ---------------- | ------- | --------- | --------- |
| **Product** | Features         | 28      | 38        | 50+       |
|             | Chart Types      | 9       | 9         | 12+       |
|             | Datasets         | 3,412   | 3,500+    | 5,000+    |
| **Growth**  | GitHub Stars     | ~100    | 500       | 5,000     |
|             | npm Downloads/wk | ~50     | 1,000     | 20,000    |
|             | Deployments      | 5       | 10        | 200       |
| **Revenue** | Customers        | 0       | 8         | 15        |
|             | ARR              | €0      | €136K     | €365K     |
|             | Grant Funding    | €0      | €100K     | €100K     |

---

## Appendix B: Next Actions

### Immediate (Next 30 Days)

- [ ] Complete Feature 29 (App Shell Foundation)
- [ ] Complete Feature 30 (Homepage Landing)
- [ ] Submit first grant application (Innovation Fund Serbia)
- [ ] Identify 5 pilot partner candidates
- [ ] Record first video walkthrough

### Short-term (30-90 Days)

- [ ] Complete Features 31-34
- [ ] Onboard 2 pilot partners
- [ ] Launch Product Hunt campaign
- [ ] Publish first case study
- [ ] Submit EU Digital Europe grant

### Medium-term (90-180 Days)

- [ ] Complete Features 35-38
- [ ] Achieve 500 GitHub stars
- [ ] Secure 3 enterprise customers
- [ ] Establish university partnership
- [ ] Present at 2 conferences

---

## Appendix C: Document References

| Document               | Path                                  | Purpose                           |
| ---------------------- | ------------------------------------- | --------------------------------- |
| Strategic Success Plan | `docs/STRATEGIC_SUCCESS_PLAN.md`      | Revenue projections, distribution |
| Failure Mode Analysis  | `docs/FAILURE_MODE_ANALYSIS.md`       | Risk assessment                   |
| Competitive Analysis   | `docs/COMPETITIVE_ANALYSIS.md`        | Market positioning                |
| Grant Framework        | `docs/GRANT_APPLICATION_FRAMEWORK.md` | Funding strategy                  |
| Architecture           | `docs/ARCHITECTURE.md`                | Technical design                  |
| Platform Research      | `docs/PLATFORM_RESEARCH.md`           | data.gov.rs analysis              |
| Long Term Plan         | `docs/LONG_TERM_PLAN.md`              | Product roadmap                   |
| Pilot Playbook         | `docs/PILOT_PARTNER_PLAYBOOK.md`      | Partner onboarding                |
| Launch Materials       | `docs/LAUNCH_MATERIALS.md`            | Product Hunt, press               |
| Feature Specs          | `recipes/inputs/feature-*.md`         | Implementation details            |

---

_Strategic Plan 2026 — Vizuelni Admin Srbije_
_Version 1.0 — March 2026_
_Contact: opendata@ite.gov.rs_
