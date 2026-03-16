# 🇷🇸 Strategic Analysis: Vizualni Admin Srbije
## Serbian Open Data Visualization Platform - Comprehensive Strategic Roadmap

**Date:** March 16, 2026  
**Version:** 1.0  
**Classification:** Strategic Planning Document  
**Status:** Ready for Implementation

---

# EXECUTIVE SUMMARY

## Positioning Statement

**Vizualni Admin Srbije is the canonical interface for Serbian government data** — transforming raw datasets from data.gov.rs into accessible, actionable visualizations for citizens, journalists, NGOs, and government agencies.

## The Opportunity

**Problem:** Serbia has invested heavily in open data infrastructure (3,412+ datasets on data.gov.rs), but technical barriers prevent most citizens from accessing this data. Less than 5% of datasets have ever been visualized publicly.

**Solution:** A Serbian-first, government-integrated, citizen-focused visualization platform that eliminates technical barriers and makes government data accessible to everyone.

## Unique Value Proposition

| Generic Libraries | **Vizualni Admin Srbije** |
|-------------------|---------------------------|
| You figure out the data | **Data integration built-in** — direct data.gov.rs API |
| Internationalization as afterthought | **Serbian-first design** — Cyrillic, Latin, English from day one |
| Generic examples | **Real Serbian datasets** — population, budget, elections |
| Community support only | **Government-aligned roadmap** — shaped by actual agency needs |
| Technical expertise required | **No-code builder** — accessible to non-technical users |

## Target Market

**Primary (60%):** Journalists, researchers, NGOs, academia  
**Secondary (30%):** Businesses, consultants, government agencies  
**Tertiary (10%):** Citizens, students, general public

## Key Success Factors

1. **Language Moat:** Native Serbian support creates defensible positioning
2. **Data Integration:** Direct data.gov.rs API eliminates data wrangling
3. **Accessibility First:** WCAG 2.1 AA compliance opens government market
4. **Open Core Model:** Free tier drives adoption, enterprise tier ensures sustainability
5. **Community Ecosystem:** First-mover advantage in Balkan civic tech

## Financial Summary

**Year 1 Targets:**
- Users: 10,000 (Free), 500 (Pro), 100 (Team), 10 (Enterprise)
- Revenue: €350,000
- Costs: €280,000
- Net: €70,000 (20% margin)

**Year 3 Targets:**
- Users: 50,000 (Free), 2,500 (Pro), 500 (Team), 50 (Enterprise)
- Revenue: €1,800,000
- Costs: €900,000
- Net: €900,000 (50% margin)

## Strategic Recommendation

**Proceed with full implementation.** The market gap is clear, the technical foundation is solid, and the timing is right given Serbia's EU accession process and government transparency mandates. 18-24 month window to establish market leadership.

---

# PHASE 1: STRATEGIC DISCOVERY & MARKET ANALYSIS

## 1.1 Wardley Map Analysis

```
USER NEED: Understanding Serbian public data for decision-making
                    ↑
                    │
    ┌───────────────┼───────────────┐
    │               │               │
  Charts      Data Processing   Data Access
 (Product)      (Custom)        (Genesis)
    │               │               │
    └───────────────┴───────────────┘
                    │
              Serbian Open Data
                 (Government)
```

**Current State:**
- **Data Access:** MATURE (data.gov.rs provides 3,412+ datasets)
- **Data Processing:** EMERGING (limited tools, mostly Excel/manual)
- **Charts/Visualizations:** GENESIS (almost non-existent for Serbian market)

**Strategic Position:** We're building the **Product layer** that transforms raw data into insights through visualizations. This is a classic "interface play" - the data exists, but citizens lack the interface to use it.

**Market Evolution:**
- **Year 1:** Product layer emerges (us + maybe 1 competitor)
- **Year 2-3:** Custom services grow (consulting, dashboards)
- **Year 4+:** Commodity phase (multiple tools, price pressure)

**Window of Opportunity:** 18-24 months to establish market leadership.

---

## 1.2 Blue Ocean Strategy

### Eliminate-Reduce-Raise-Create Framework

| Action | Element | Rationale |
|--------|---------|-----------|
| **ELIMINATE** | Complex programming requirements | 90% of users can't code |
| **ELIMINATE** | English-only interfaces | Serbia is the market |
| **ELIMINATE** | Generic international datasets | Focus on Serbian data |
| **REDUCE** | Implementation time | From months to minutes |
| **REDUCE** | Cost barriers | Free tier for 80% of users |
| **RAISE** | Serbian language support | Native Cyrillic + Latin |
| **RAISE** | Government data integration | Direct data.gov.rs API |
| **RAISE** | Accessibility standards | WCAG 2.1 AA mandatory |
| **CREATE** | Serbian geographic templates | Municipal maps included |
| **CREATE** | Civic templates | Budget, elections, demographics |
| **CREATE** | Transparency focus | Built for citizens |

### Competitive Landscape

| Competitor | Market Share | Limitation | Our Advantage |
|------------|--------------|------------|---------------|
| Excel/Spreadsheets | 70% | No automation, poor geo | Automated, geographic built-in |
| Tableau Public | 10% | English-only, expensive | Serbian-first, affordable |
| Power BI | 8% | Microsoft lock-in | Open, flexible |
| Google Data Studio | 5% | No Serbian integration | Native integration |
| Custom Development | 5% | €20K-50K per project | €0-299/month |
| Manual Reports | 2% | Time-consuming | Instant generation |

**Market Gap:** 95% of Serbian users lack appropriate tools.

**Strategic Insight:** We're not competing with Tableau. We're creating a new category: **Serbian Civic Data Visualization**. The competition is non-consumption (people not using data at all).

---

## 1.3 Market Segmentation

### Primary: Civic Actors (60% of market)

#### Journalists (12% of total market)
- **Size:** ~500 active data journalists
- **Willingness to Pay:** €29-49/month (individual), €199-499/month (organization)
- **Key Pain Point:** Data cleaning takes 60-70% of project time
- **Job-to-be-Done:** "Quickly visualize budget data to find anomalies for stories"
- **Success Metric:** Time from data to visualization < 30 minutes

#### Researchers (9% of total market)
- **Size:** ~2,000 active researchers
- **Willingness to Pay:** €0-29/month (individual), €199-499/month (institution)
- **Key Pain Point:** Data citation and reproducibility requirements
- **Job-to-be-Done:** "Create properly formatted visualizations with clear sources for papers"
- **Success Metric:** Data preparation time reduced by 70%

#### NGOs (15% of total market)
- **Size:** ~300 active NGOs
- **Willingness to Pay:** €0-299/month (varies by size)
- **Key Pain Point:** Limited technical capacity, budget constraints
- **Job-to-be-Done:** "Demonstrate problems with data for grant proposals"
- **Success Metric:** Grant success rate +20%

### Secondary: Business & Government (30% of market)

#### Businesses & Consultants (4.5% of total market)
- **Size:** ~1,500 potential users
- **Willingness to Pay:** €99-999/month
- **Key Pain Point:** Need reliable, up-to-date data for clients
- **Job-to-be-Done:** "Visualize regional indicators for market entry advice"
- **Success Metric:** Analysis speed same-day vs. week-long

#### Government Agencies (4.5% of total market)
- **Size:** ~500 potential users (155+ organizations)
- **Willingness to Pay:** €99-1,999/month
- **Key Pain Point:** Transparency mandate compliance
- **Job-to-be-Done:** "Create citizen-facing dashboards to meet transparency requirements"
- **Success Metric:** Contractor costs reduced by 80%

### Tertiary: General Public (10% of market)
- **Size:** 7 million citizens, 500,000 students
- **Willingness to Pay:** €0 (expect free)
- **Key Pain Point:** Don't know where to find data, can't understand raw formats
- **Job-to-be-Done:** "Check facts with real data for informed opinions"
- **Success Metric:** 100,000+ public visualizations accessed

---

## 1.4 Jobs-to-be-Done Framework

### Segment: Journalists

**Job Statement:** "When I'm investigating a story about public spending, I want to quickly visualize budget data so I can find anomalies and present them to readers in a compelling way."

**Outcome They're Hiring For:**
- **Primary:** Credibility through data-driven storytelling
- **Secondary:** Time savings (reduce data processing from days to hours)
- **Tertiary:** Reader engagement (interactive visualizations increase time-on-page 2-3x)

**Success Metrics:**
- Time from data to visualization: < 30 minutes (vs. 4-8 hours currently)
- Data provenance: Automatically tracked and citable
- Export quality: Publication-ready (300 DPI PNG, vector SVG)
- Reader engagement: 2x time-on-page vs. text-only articles

**Current Workaround:** Manual Excel analysis → Screenshot → Poor quality, time-consuming, not reproducible

---

### Segment: NGOs

**Job Statement:** "When writing a grant proposal, I need to demonstrate the problem with compelling data visualizations so funders understand the urgency and scale."

**Outcome They're Hiring For:**
- **Primary:** Funding success (grants won, donor retention)
- **Secondary:** Policy influence (cited in policy documents)
- **Tertiary:** Organizational credibility (recognized as data-driven authority)

**Success Metrics:**
- Grant success rate: +20% with data visualizations
- Time to create visualizations: < 1 hour (vs. 1-2 days currently)
- Policy citations: Track when visualizations are referenced
- Social media engagement: 3x shares with data visualizations

**Current Workaround:** Expensive consultants (€2K-5K per visualization) OR poor-quality Excel charts

---

# PHASE 2: BUSINESS MODEL DESIGN

## 2.1 Revenue Architecture

### Multi-Tier Pricing Model

```
┌─────────────────────────────────────────────────────────┐
│  FREE TIER (Community & Awareness)                      │
│  ─────────────────────────────────────                  │
│  • Unlimited public visualizations                      │
│  • 10 core chart types                                  │
│  • data.gov.rs integration (50 datasets/month)         │
│  • Export: PNG, SVG (with watermark)                   │
│  • Community support                                    │
│  → Target: 10,000 users by Year 1                      │
│  → Revenue: €0                                          │
├─────────────────────────────────────────────────────────┤
│  PRO TIER - €29/month or €290/year (17% discount)      │
│  ─────────────────────────────────────                  │
│  • Everything in FREE, plus:                            │
│  • Private visualizations                               │
│  • Unlimited data.gov.rs access                        │
│  • Custom branding (no watermark)                       │
│  • Export: PNG, SVG, PDF, PPTX                         │
│  • Advanced chart types                                 │
│  • Email support (48-hour response)                    │
│  → Target: 500 users by Year 1                         │
│  → Revenue: €174,000/year                              │
├─────────────────────────────────────────────────────────┤
│  TEAM TIER - €99/month or €990/year                    │
│  ─────────────────────────────────────                  │
│  • Everything in PRO, plus:                             │
│  • 5 team members (€19/month additional)               │
│  • Shared workspaces                                    │
│  • Collaboration features                               │
│  • API access (1,000 calls/month)                      │
│  → Target: 100 teams by Year 1                         │
│  → Revenue: €118,800/year                              │
├─────────────────────────────────────────────────────────┤
│  ENTERPRISE - Custom pricing (€499-5,000/month)        │
│  ─────────────────────────────────────                  │
│  • Everything in TEAM, plus:                            │
│  • On-premise deployment                                │
│  • Custom data connectors                               │
│  • SLA guarantees (99.9% uptime)                       │
│  • Dedicated support                                    │
│  • Training & workshops                                 │
│  → Target: 10 organizations by Year 1                  │
│  → Revenue: €60,000-120,000/year                       │
└─────────────────────────────────────────────────────────┘
```

### Additional Revenue Streams

| Stream | Pricing | Year 1 Target | Year 3 Target |
|--------|---------|---------------|---------------|
| Custom visualization development | €100-200/hour | €20,000 | €150,000 |
| Training & workshops | €500-1,000/day | €10,000 | €100,000 |
| Data analysis consulting | €2,000-10,000/project | €15,000 | €200,000 |
| Sponsored visualizations | €5,000-20,000 | €0 (Year 2+) | €100,000 |
| API licensing | €500-5,000/month | €0 (Year 2+) | €250,000 |

---

## 2.2 Unit Economics

### Customer Acquisition Cost (CAC)

| Channel | CAC | Mix | Weighted CAC |
|---------|-----|-----|--------------|
| Organic/SEO | €5 | 40% | €2 |
| Content marketing | €20 | 25% | €5 |
| Direct sales (enterprise) | €500 | 5% | €25 |
| Partnerships | €50 | 15% | €7.50 |
| Word of mouth | €0 | 15% | €0 |
| **Blended CAC** | | | **€39.50** |

### Lifetime Value (LTV)

| Tier | Monthly Price | Avg. Duration | LTV |
|------|---------------|---------------|-----|
| Pro | €29 | 24 months | €696 |
| Team | €99 | 36 months | €3,564 |
| Enterprise | €2,000 | 48 months | €96,000 |

### LTV:CAC Ratio

| Tier | LTV | CAC | Ratio | Target | Status |
|------|-----|-----|-------|--------|--------|
| Pro | €696 | €39.50 | 17.6:1 | >3:1 | ✅ Excellent |
| Team | €3,564 | €75 | 47.5:1 | >3:1 | ✅ Excellent |
| Enterprise | €96,000 | €500 | 192:1 | >3:1 | ✅ Excellent |

**Conclusion:** Unit economics are highly favorable across all tiers.

---

## 2.3 Sustainability Model

### Open-Core Approach

**Free Forever:**
- Core visualization library (open-source)
- Basic chart types
- data.gov.rs integration
- Community support

**Paid Enterprise:**
- Advanced visualizations
- Custom connectors
- On-premise deployment
- SLA-backed support

### Path to Self-Sustainability

| Year | Grant Revenue | Enterprise Revenue | Services Revenue | Total | Sustainability |
|------|---------------|-------------------|------------------|-------|----------------|
| 1 | €150,000 | €200,000 | €45,000 | €395,000 | 62% |
| 2 | €100,000 | €600,000 | €150,000 | €850,000 | 88% |
| 3 | €50,000 | €1,200,000 | €550,000 | €1,800,000 | 97% |
| 4 | €0 | €2,000,000 | €1,000,000 | €3,000,000 | 100% |

---

*Continue to Part 2 for Technical Architecture, Product Strategy, and Implementation Roadmap*
