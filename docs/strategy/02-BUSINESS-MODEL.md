# Business Model

> **9-Block Business Model Canvas, Dual Revenue Architecture, Unit Economics, Value Proposition Canvas, Pricing, Grant Pipeline**

---

## 1. Business Model Canvas (9-Block)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                 KEY PARTNERS                                         │
│                                                                                      │
│  • data.gov.rs (Office for IT & eGovernment)                                        │
│  • Statistical Office of Republic of Serbia (RZS)                                   │
│  • Serbian academic institutions (FON, FTN, Singidunum)                             │
│  • Media organizations (BIRN, CINS, KRIK)                                           │
│  • International donors (UNDP, USAID, EU)                                           │
│  • Cloud providers (AWS, GCP, Hetzner)                                              │
│  • Open source community contributors                                                │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────┐  ┌─────────────────────────────────────────┐
│           KEY ACTIVITIES                │  │           KEY RESOURCES                 │
│                                         │  │                                         │
│  • Platform development                 │  │ • 28 implemented features               │
│  • data.gov.rs integration maintenance  │  │ • 174 municipalities GeoJSON            │
│  • Community building                   │  │ • Serbian translations (3 locales)      │
│  • Government relationship management   │  │ • data.gov.rs API connectors            │
│  • Documentation & tutorials            │  │ • Technical documentation               │
│  • Customer support                     │  │ • Brand recognition in Serbian market   │
└─────────────────────────────────────────┘  └─────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              VALUE PROPOSITIONS                                      │
│                                                                                      │
│  For Government Agencies:                                                            │
│  • Data sovereignty compliance (EU/Serbia hosting)                                  │
│  • Procurement-ready platform with WCAG 2.1 AA compliance                           │
│  • Direct data.gov.rs integration, no manual setup                                  │
│                                                                                      │
│  For Journalists/Media:                                                             │
│  • Quick visualization creation (< 30 min to publishable chart)                     │
│  • Native Serbian language support (Cyrillic + Latin)                               │
│  • Citation-ready exports with data provenance                                       │
│                                                                                      │
│  For Businesses/Researchers:                                                        │
│  • Professional visualizations for presentations and reports                        │
│  • Regional data access (174 municipalities)                                        │
│  • Self-service analytics without developer dependence                              │
│                                                                                      │
│  For NGOs/Civil Society:                                                            │
│  • Affordable access to government data visualization                               │
│  • Storytelling tools for advocacy campaigns                                        │
│  • Grant-compliant impact measurement                                               │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────┐  ┌─────────────────────────────────────────┐
│        CUSTOMER RELATIONSHIPS           │  │              CHANNELS                   │
│                                         │  │                                         │
│  • Self-service (SaaS tiers)            │  │ • Direct website (vizuelni.rs)          │
│  • Dedicated support (Enterprise)       │  │ • npm registry (@vizualni/*)            │
│  • Community forums & Discord           │  │ • GitHub (open source)                  │
│  • Training workshops                   │  │ • Government procurement portals        │
│  • Partner network (agencies, unis)     │  │ • Conference presentations              │
└─────────────────────────────────────────┘  └─────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              CUSTOMER SEGMENTS                                       │
│                                                                                      │
│  Primary:                                                                            │
│  1. Serbian government agencies (ministries, municipalities)                         │
│  2. Serbian media organizations (journalists, editors)                               │
│                                                                                      │
│  Secondary:                                                                          │
│  3. Businesses (banks, consultancies, startups)                                      │
│  4. NGOs and civil society organizations                                             │
│  5. Academic researchers and students                                                │
│                                                                                      │
│  Tertiary:                                                                           │
│  6. International organizations working in Serbia                                     │
│  7. Serbian diaspora                                                                 │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────┐  ┌─────────────────────────────────────────┐
│            COST STRUCTURE               │  │           REVENUE STREAMS               │
│                                         │  │                                         │
│  • Development (solo developer)         │  │ • SaaS subscriptions (€29-199/mo)       │
│  • Infrastructure (hosting, CDN)        │  │ • Enterprise licenses (€5K/year)        │
│  • Third-party services (analytics)     │  │ • Training services (€500/day)          │
│  • Marketing & outreach                 │  │ • Custom development (€100/hr)          │
│  • Legal & compliance                   │  │ • Grant funding (€50K-500K)             │
│  • Community operations                 │  │                                         │
└─────────────────────────────────────────┘  └─────────────────────────────────────────┘
```

---

## 2. Dual Revenue Architecture

### 2.1 Self-Service SaaS Tiers

| Tier             | Price   | Target User                      | Key Features                                                                                                                                                                      |
| ---------------- | ------- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Free**         | €0      | Students, citizens, casual users | • Public visualizations only<br>• 5 private charts<br>• Basic export (PNG, CSV)<br>• Community support<br>• Attribution required                                                  |
| **Pro**          | €29/mo  | Journalists, researchers, NGOs   | • Unlimited private charts<br>• All export formats (PNG, SVG, PDF, embed)<br>• Custom branding<br>• Priority email support<br>• Advanced chart types<br>• No attribution required |
| **Team**         | €99/mo  | Small teams, departments         | • Everything in Pro<br>• Up to 5 team members<br>• Shared workspaces<br>• API access<br>• Collaboration features<br>• Admin dashboard                                             |
| **Organization** | €199/mo | Larger organizations             | • Everything in Team<br>• Up to 20 members<br>• SSO integration<br>• White-label option<br>• Dedicated account manager<br>• Custom onboarding                                     |

### 2.2 Enterprise Sales

| License          | Price       | Target                   | Features                                                                                                                             |
| ---------------- | ----------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Agency**       | €2,000/year | Single government agency | • 5 seats<br>• Priority support<br>• On-premise option<br>• Training included (1 day)                                                |
| **Enterprise**   | €5,000/year | Large organizations      | • Unlimited seats<br>• SLA-backed support (99.9% uptime)<br>• On-premise deployment<br>• Custom integrations<br>• Unlimited training |
| **Municipality** | €1,000/year | Individual municipality  | • 3 seats<br>• Regional data focus<br>• Community support<br>• Training materials                                                    |

### 2.3 Services Revenue

| Service                     | Price        | Description                                |
| --------------------------- | ------------ | ------------------------------------------ |
| **Training Workshop**       | €500/day     | On-site or remote training for teams       |
| **Custom Development**      | €100/hour    | Feature development, integrations          |
| **Implementation Support**  | €2,000/week  | Full deployment assistance                 |
| **Annual Support Contract** | €10,000/year | Dedicated support engineer                 |
| **Data Curation**           | €50/dataset  | Custom dataset preparation and integration |

### 2.4 Bottom-Up Revenue Model

| Year | Free Users | Pro (€29) | Team (€99) | Org (€199) | Enterprise | Services | SaaS MRR | Total Revenue |
| ---- | ---------- | --------- | ---------- | ---------- | ---------- | -------- | -------- | ------------- |
| 1    | 500        | 50        | 10         | 2          | 3 × €5K    | €6K      | €3,050   | €126K         |
| 2    | 2,000      | 150       | 30         | 5          | 8 × €5K    | €20K     | €8,400   | €290K         |
| 3    | 5,000      | 400       | 80         | 15         | 15 × €5K   | €50K     | €22,450  | €400K         |

---

## 3. Unit Economics

### 3.1 SaaS Model Economics

| Metric                              | Calculation               | Value    |
| ----------------------------------- | ------------------------- | -------- |
| **Customer Acquisition Cost (CAC)** | Content + SEO + Community | ~€50     |
| • Content creation                  | 10 hrs/mo × €50/hr        | €500/mo  |
| • SEO tools                         | Ahrefs/SEMrush            | €100/mo  |
| • Community management              | 5 hrs/mo × €50/hr         | €250/mo  |
| • Signups per month                 |                           | ~50      |
| **CAC per customer**                | €850 / 50                 | **€17**  |
|                                     |                           |          |
| **Lifetime Value (LTV)**            | ARPU × Lifespan           |          |
| • Pro ARPU                          | €29/mo                    |          |
| • Average lifespan                  | 18 months                 |          |
| **LTV (Pro)**                       | €29 × 18                  | **€522** |
|                                     |                           |          |
| **LTV:CAC Ratio**                   | €522 / €17                | **31:1** |

**Note**: LTV:CAC of 31:1 is exceptionally high, indicating strong product-market fit potential. Industry benchmark is 3:1.

### 3.2 Enterprise Model Economics

| Metric                              | Calculation          | Value       |
| ----------------------------------- | -------------------- | ----------- |
| **Customer Acquisition Cost (CAC)** | Direct sales + demos | ~€2,000     |
| • Outreach (calls, emails)          | 20 hrs × €50/hr      | €1,000      |
| • Demo preparation                  | 8 hrs × €50/hr       | €400        |
| • Travel (if needed)                |                      | €300        |
| • Proposal/contract                 | 6 hrs × €50/hr       | €300        |
| **CAC per enterprise**              |                      | **€2,000**  |
|                                     |                      |             |
| **Lifetime Value (LTV)**            | ACV × Years          |             |
| • Enterprise ACV                    | €5,000/year          |             |
| • Average relationship              | 4 years              |             |
| **LTV (Enterprise)**                | €5,000 × 4           | **€20,000** |
|                                     |                      |             |
| **LTV:CAC Ratio**                   | €20,000 / €2,000     | **10:1**    |

### 3.3 Blended Analysis

| Scenario     | SaaS Customers | Enterprise | Blended CAC | Blended LTV | LTV:CAC |
| ------------ | -------------- | ---------- | ----------- | ----------- | ------- |
| Conservative | 30             | 2          | €150        | €2,850      | 19:1    |
| Base         | 62             | 3          | €112        | €3,370      | 30:1    |
| Optimistic   | 100            | 5          | €90         | €4,500      | 50:1    |

### 3.4 Payback Period

| Segment             | CAC    | MRR  | Payback  |
| ------------------- | ------ | ---- | -------- |
| Pro (€29/mo)        | €17    | €29  | <1 month |
| Team (€99/mo)       | €17    | €99  | <1 month |
| Enterprise (€5K/yr) | €2,000 | €417 | 5 months |

**Blended payback**: ~2 months (industry benchmark: 12-18 months)

### 3.5 Break-Even Analysis

| Cost Category                 | Monthly Cost |
| ----------------------------- | ------------ |
| Infrastructure (hosting, CDN) | €200         |
| Development time (solo)       | €3,000       |
| Tools & services              | €150         |
| Marketing                     | €500         |
| **Total Monthly Burn**        | **€3,850**   |

**Break-even SaaS MRR**: €3,850 (129 Pro customers, or 39 Team, or combination)

**Current trajectory**: Break-even at Month 18-24 with projected growth.

---

## 4. Value Proposition Canvas (5 Segments)

### 4.1 Government Agency

**Customer Profile:**
| Jobs | Pains | Gains |
|------|-------|-------|
| Publish transparency reports | Complex procurement processes | Citizen trust improvement |
| Create public dashboards | Limited technical staff | Compliance with EU standards |
| Respond to information requests | Data in multiple formats | Recognition for innovation |
| Track agency performance | Outdated visualization tools | Reduced support requests |
| Communicate with citizens | Language barriers (Cyrillic/Latin) | Positive media coverage |

**Value Map:**
| Products | Pain Relievers | Gain Creators |
|----------|----------------|---------------|
| WCAG-compliant visualizations | Procurement-ready pricing | Transparency mandate compliance |
| data.gov.rs integration | No technical expertise needed | EU accession alignment |
| Serbian language native | One platform, all data | Reduced IT burden |
| On-premise deployment | Training included | Institutional credibility |

### 4.2 Journalist / Media

**Customer Profile:**
| Jobs | Pains | Gains |
|------|-------|-------|
| Create visualizations under deadline | Limited time | Faster story publication |
| Verify data accuracy | Data access complexity | Credibility with sources |
| Publish across platforms | Tool learning curve | Reader engagement |
| Cite sources properly | Export format limitations | Award-winning graphics |
| Collaborate with editors | Serbian language issues | Social media sharing |

**Value Map:**
| Products | Pain Relievers | Gain Creators |
|----------|----------------|---------------|
| Quick chart builder | <30 min to publishable chart | Deadline reliability |
| Source attribution built-in | data.gov.rs direct link | Data journalism credibility |
| Multi-format export | No coding required | Professional appearance |
| Embed anywhere | Serbian language native | Audience trust |

### 4.3 Business Owner

**Customer Profile:**
| Jobs | Pains | Gains |
|------|-------|-------|
| Analyze market opportunities | Expensive BI tools | Competitive advantage |
| Prepare investor presentations | Data scattered across sources | Investor confidence |
| Make data-driven decisions | Limited Serbian data access | Risk reduction |
| Track regional performance | Generic tools miss local context | Market insights |
| Report to stakeholders | Manual chart creation | Professional output |

**Value Map:**
| Products | Pain Relievers | Gain Creators |
|----------|----------------|---------------|
| Regional data (174 municipalities) | All Serbian data in one place | Serbia-specific insights |
| Professional exports | Affordable vs Tableau/Power BI | Cost savings |
| Self-service analytics | No developer needed | Faster decisions |
| Custom branding | Quick setup | Professional presentations |

### 4.4 NGO Worker

**Customer Profile:**
| Jobs | Pains | Gains |
|------|-------|-------|
| Write grant proposals | Limited budget | Successful funding |
| Create advocacy materials | Complex tools | Policy impact |
| Report to donors | Time constraints | Donor satisfaction |
| Raise awareness | Data access barriers | Public engagement |
| Measure impact | Visualization skills gap | Credible evidence |

**Value Map:**
| Products | Pain Relievers | Gain Creators |
|----------|----------------|---------------|
| Affordable pricing (€29/mo) | Budget-friendly | Grant compliance |
| Easy-to-use interface | No training needed | Compelling advocacy |
| Impact measurement tools | Data storytelling made easy | Donor confidence |
| Grant-compliant exports | Quick turnaround | Policy influence |

### 4.5 Researcher / Academic

**Customer Profile:**
| Jobs | Pains | Gains |
|------|-------|-------|
| Conduct data analysis | Data cleaning burden | Publication acceptance |
| Create reproducible research | Tool licensing costs | Academic credibility |
| Publish findings | Citation requirements | Research impact |
| Teach data literacy | Student accessibility | Student engagement |
| Collaborate with peers | Version control challenges | Reproducibility |

**Value Map:**
| Products | Pain Relievers | Gain Creators |
|----------|----------------|---------------|
| Reproducible chart configs | Data provenance built-in | Publication-ready figures |
| Free tier for students | No licensing barriers | Teaching integration |
| Citation support | Serbian data accessible | Research efficiency |
| Open source option | Reproducibility by design | Academic credibility |

---

## 5. Pricing Sensitivity Analysis

### 5.1 Serbian Purchasing Power Context

| Metric                         | Value         | Implication                     |
| ------------------------------ | ------------- | ------------------------------- |
| Median monthly salary (Serbia) | ~€700         | €29/mo = 4% of income           |
| Government agency IT budget    | €10K-50K/year | €5K license is reasonable       |
| Municipality IT budget         | €5K-20K/year  | €1K license is affordable       |
| NGO project budget             | €20K-100K     | €29-99/mo is minor expense      |
| Startup runway concerns        | High          | Free tier critical for adoption |

### 5.2 Willingness-to-Pay by Segment

| Segment    | Price Sensitivity      | Optimal Price Point | Rationale             |
| ---------- | ---------------------- | ------------------- | --------------------- |
| Government | Low (budget available) | €5,000/year         | Procurement threshold |
| Enterprise | Low                    | €5,000/year         | Value-based pricing   |
| Journalist | Medium                 | €29-49/mo           | Individual budget     |
| NGO        | Medium                 | €29/mo              | Grant-funded          |
| Business   | Medium                 | €49-99/mo           | ROI justified         |
| Researcher | High                   | €0-29/mo            | Limited budget        |
| Student    | Very High              | €0                  | No budget             |

### 5.3 International Pricing Parity

| Market             | SaaS Pro | Enterprise   | Notes          |
| ------------------ | -------- | ------------ | -------------- |
| Serbia             | €29/mo   | €5,000/year  | Base pricing   |
| EU/Western Balkans | €39/mo   | €7,000/year  | Slight premium |
| International      | €49/mo   | €10,000/year | Full pricing   |

**Strategy**: Keep Serbian pricing affordable while capturing international value.

### 5.4 Competitive Pricing Comparison

| Solution              | Annual Cost | Per User        |
| --------------------- | ----------- | --------------- |
| Vizuelni (Pro)        | €348        | €29/mo          |
| Vizuelni (Team)       | €1,188      | €20/mo per user |
| Vizuelni (Enterprise) | €5,000      | Unlimited       |
| Tableau Desktop       | €840+       | €70+/mo         |
| Power BI Pro          | €120        | €10/mo          |
| Google Data Studio    | €0          | Free            |
| Observable Team       | €300        | €25/mo          |

**Positioning**: Vizuelni is competitive on price while offering unique Serbian value.

---

## 6. Grant Pipeline

### 6.1 Probability-Weighted Pipeline

| Funder             | Program               | Amount       | Probability | Timeline     | Expected Value |
| ------------------ | --------------------- | ------------ | ----------- | ------------ | -------------- |
| EU Digital Europe  | Digital Citizenship   | €100,000     | 30%         | Q2 2026      | €30,000        |
| UNDP Serbia        | Democratic Governance | €50,000      | 50%         | Q1 2026      | €25,000        |
| USAID Serbia       | Good Governance       | €100,000     | 20%         | Rolling      | €20,000        |
| Open Society       | Information Program   | €50,000      | 40%         | Q3 2026      | €20,000        |
| NED                | Democracy Grants      | €50,000      | 30%         | Q2 2026      | €15,000        |
| Luminate           | Data & Digital Rights | €50,000      | 25%         | Q4 2026      | €12,500        |
| Google.org         | Impact Challenge      | €100,000     | 15%         | Q3 2026      | €15,000        |
| **Total Pipeline** |                       | **€500,000** |             | **€137,500** |

### 6.2 Cash Flow Projection (Grants)

| Quarter | Expected Grants            | Cumulative |
| ------- | -------------------------- | ---------- |
| Q1 2026 | €25,000 (UNDP)             | €25,000    |
| Q2 2026 | €45,000 (EU + NED)         | €70,000    |
| Q3 2026 | €35,000 (OSF + Google)     | €105,000   |
| Q4 2026 | €32,500 (Luminate + USAID) | €137,500   |

### 6.3 Revenue Mix Evolution

| Year | Grants      | SaaS        | Enterprise  | Services   | Total |
| ---- | ----------- | ----------- | ----------- | ---------- | ----- |
| 1    | 70% (€88K)  | 15% (€19K)  | 12% (€15K)  | 3% (€4K)   | €126K |
| 2    | 35% (€100K) | 25% (€72K)  | 25% (€72K)  | 15% (€46K) | €290K |
| 3    | 15% (€60K)  | 40% (€160K) | 30% (€120K) | 15% (€60K) | €400K |

**Strategic Implication**: Grant dependency decreases from 70% to 15% over 3 years, achieving sustainability.

---

## 7. Financial Projections Summary

### 3-Year P&L Projection

|                     | Year 1    | Year 2    | Year 3    |
| ------------------- | --------- | --------- | --------- |
| **Revenue**         |           |           |           |
| SaaS Subscriptions  | €19K      | €72K      | €160K     |
| Enterprise Licenses | €15K      | €40K      | €75K      |
| Services            | €4K       | €28K      | €55K      |
| Grant Funding       | €88K      | €100K     | €60K      |
| **Total Revenue**   | **€126K** | **€240K** | **€350K** |
|                     |           |           |           |
| **Costs**           |           |           |           |
| Development         | €36K      | €36K      | €48K      |
| Infrastructure      | €2.4K     | €4K       | €6K       |
| Marketing           | €6K       | €12K      | €18K      |
| Tools & Services    | €2K       | €3K       | €4K       |
| **Total Costs**     | **€46K**  | **€55K**  | **€76K**  |
|                     |           |           |           |
| **Gross Margin**    | **€80K**  | **€185K** | **€274K** |
| **Margin %**        | 63%       | 77%       | 78%       |

### Key Assumptions

- Solo developer at €3K/month opportunity cost
- Infrastructure scales with usage
- Marketing budget increases with revenue
- Grant success rate ~30% weighted probability

---

_Source Documents: [STRATEGIC_SUCCESS_PLAN.md](../STRATEGIC_SUCCESS_PLAN.md), [GRANT_APPLICATION_FRAMEWORK.md](../GRANT_APPLICATION_FRAMEWORK.md)_

_Last Updated: 2026-03-16_
