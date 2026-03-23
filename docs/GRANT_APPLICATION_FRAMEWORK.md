# Grant Application Framework

**Reusable templates for funding Vizualni Admin Srbije**

---

## Target Grants

### Priority 1: EU Digital Europe Programme

**Program:** Digital Europe Programme - Digital Citizenship

**Funding Amount:** €100,000 - €500,000

**Deadline:** [Check current calls]

**Match:** Excellent - digital transformation, open government, citizen participation

**Application URL:** https://digital-strategy.ec.europa.eu/en/activities/digital-programme

### Priority 2: UNDP Serbia Innovation Fund

**Program:** UNDP Serbia - Democratic Governance and Human Rights

**Funding Amount:** €50,000 - €100,000

**Deadline:** [Check current calls]

**Match:** Excellent - democratic governance, civil society, transparency

**Application URL:** https://www.undp.org/serbia

### Priority 3: USAID Serbia

**Program:** USAID Serbia - Good Governance

**Funding Amount:** €100,000+

**Deadline:** Rolling applications

**Match:** Good - good governance, civil society, media development

**Application URL:** https://www.usaid.gov/serbia

### Secondary Targets

| Organization                     | Program               | Amount    | Focus                        |
| -------------------------------- | --------------------- | --------- | ---------------------------- |
| Open Society Foundations         | Information Program   | €50-100K  | Transparency, open data      |
| National Endowment for Democracy | Democracy Grants      | €50-150K  | Democratic development       |
| Rockefeller Foundation           | Data & Tech           | €100-500K | Data for social good         |
| Ford Foundation                  | Just Tech             | €100-300K | Technology for justice       |
| Luminate                         | Data & Digital Rights | €50-200K  | Transparency, accountability |
| European Journalism Centre       | News Innovators       | €20-50K   | Data journalism              |
| Google.org                       | Impact Challenge      | €100-500K | Civic technology             |
| Microsoft Airband Initiative     | Digital Skills        | €50-150K  | Digital inclusion            |

---

## Common Grant Sections

### Executive Summary Template

```markdown
# Executive Summary

**Project Name:** Vizualni Admin Srbije — The Canonical Interface for Serbian
Government Data

**Organization:** [Your Organization Name]

**Requested Amount:** €[Amount] over [Duration] months

**One-Line Summary:** An open-source platform that transforms Serbian
government data into accessible visualizations, empowering citizens,
journalists, and agencies to understand and use public data.

**The Problem:** Serbia has invested heavily in open data infrastructure
(3,412+ datasets on data.gov.rs), but technical barriers prevent most citizens
from accessing this data. Less than 5% of datasets have been publicly
visualized or analyzed.

**The Solution:** Vizualni Admin Srbije provides:

- A no-code visual chart builder for non-technical users
- React component libraries for developers
- Direct integration with data.gov.rs
- Native Serbian language support (Cyrillic, Latin, English)
- WCAG 2.1 AA accessibility compliance

**Impact to Date:**

- [x] GitHub stars
- [Y] documented deployments
- [Z] active contributors

**Goals for Grant Period:**

- [Goal 1]
- [Goal 2]
- [Goal 3]

**Sustainability:** The project uses an open-core model with free core
functionality and paid enterprise features, ensuring long-term viability.
```

---

### Problem Statement Template

```markdown
# Problem Statement

## The Transparency Gap

Serbia has made significant progress in open government data. The official
portal, data.gov.rs, hosts over 3,412 datasets from 155 government
organizations. This represents a substantial investment in transparency
infrastructure.

However, a critical gap exists between data availability and data accessibility:

### The Numbers

- **3,412+ datasets** available on data.gov.rs
- **Less than 5%** have ever been publicly visualized
- **Most citizens** cannot access or understand raw data formats (CSV, JSON, XML)
- **No Serbian-specific tools** exist for government data visualization

### The Barriers

**Technical Barriers:**

- Raw data requires programming skills to process
- Existing visualization tools lack Serbian language support
- Geographic data for Serbian regions is fragmented
- No standardized approach to data.gov.rs integration

**Language Barriers:**

- International tools prioritize English
- Serbian Cyrillic support is rare
- Serbian Latin support is inconsistent
- Government data uses both scripts

**Accessibility Barriers:**

- Most tools are not WCAG compliant
- Government data should be accessible to all citizens, including those with
  disabilities
- Current solutions fail accessibility requirements

### The Consequences

**For Citizens:**

- Cannot understand how tax money is spent
- Cannot track government performance
- Cannot make informed decisions

**For Journalists:**

- Reduced investigative capacity
- Time spent on data processing instead of analysis
- Limited ability to communicate findings visually

**For Government Agencies:**

- Data remains unused despite publication
- Transparency mandates unmet
- No citizen engagement with open data

**For Democracy:**

- Reduced accountability
- Limited civic participation
- Weakened trust in institutions

## Why Existing Solutions Don't Work

| Solution                   | Limitation                                      |
| -------------------------- | ----------------------------------------------- |
| Generic charting libraries | Require developer expertise, no Serbian support |
| International platforms    | No data.gov.rs integration, language barriers   |
| Custom development         | Too expensive for most organizations            |
| Spreadsheet tools          | Limited visualization, no geographic support    |
| Current government tools   | Outdated, inaccessible, fragmented              |

## The Opportunity

Serbia's EU accession process creates pressure for transparency. The government
has invested in data infrastructure. What's missing is the **interface** between
data and citizens.
```

---

### Solution Description Template

````markdown
# Solution: Vizualni Admin Srbije

## Overview

Vizualni Admin Srbije is an open-source platform that bridges the gap between
raw government data and citizen understanding. It provides the canonical
interface for Serbian government data visualization.

## Core Components

### 1. Visual Chart Builder (No-Code)

**Target Users:** Journalists, NGO staff, researchers, citizens

**Features:**

- Drag-and-drop interface
- Automatic chart type suggestions
- Real-time preview
- One-click export (PDF, PNG, embed code)
- Serbian government color palette

**How it Works:**

1. User selects dataset from data.gov.rs or uploads their own
2. System analyzes data and suggests visualization types
3. User customizes appearance and labels
4. User exports or shares visualization

### 2. Developer Libraries

**Target Users:** Developers, IT departments, technical staff

**Packages:**

- `@vizualni/core` — Framework-agnostic visualization primitives
- `@vizualni/react` — React components for web applications
- `@vizualni/charts` — Chart configuration and validation
- `@vizualni/data` — Data preparation utilities
- `@vizualni/geo-data` — Serbian geographic data (GeoJSON)
- `@vizualni/connectors` — Data source connectors

**Example Usage:**

```typescript
import { BarChart } from '@vizualni/react';
import { serbiaPopulation } from '@vizualni/geo-data/sample-data';

<BarChart
  data={serbiaPopulation}
  x="region"
  y="population"
  title="Популација по регионима"
  locale="sr-Cyrl"
/>
```
````

### 3. data.gov.rs Integration

**Features:**

- Direct API connection to Serbia's open data portal
- Dataset search and discovery
- Automatic data format conversion
- Data quality indicators

### 4. Serbian Language Support

**Features:**

- Native support for Serbian Cyrillic, Serbian Latin, and English
- Geographic name matching across all scripts ("Београд" = "Belgrade" = "Beograd")
- UI localization
- Documentation in all three languages

### 5. Geographic Visualization

**Features:**

- Built-in GeoJSON for all Serbian regions, districts, and municipalities
- Choropleth maps
- Regional comparison tools
- Export to interactive and static formats

### 6. Accessibility Compliance

**Features:**

- WCAG 2.1 AA compliance by default
- Screen reader support
- Keyboard navigation
- High contrast mode
- Reduced motion support

## Technical Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User Interface                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Visual Builder│  │ React SDK    │  │ Web App      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
├─────────────────────────────────────────────────────────────┤
│                     Core Libraries                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ @vizualni/   │  │ @vizualni/   │  │ @vizualni/   │      │
│  │ core         │  │ charts       │  │ data         │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
├─────────────────────────────────────────────────────────────┤
│                     Data Layer                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ data.gov.rs  │  │ geo-data     │  │ connectors   │      │
│  │ API          │  │ (GeoJSON)    │  │ (CSV, JSON)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Current Status

**Completed:**

- [x] Core visualization library
- [x] React component library
- [x] data.gov.rs integration
- [x] Serbian geographic data
- [x] Multi-language support
- [x] Documentation

**In Progress:**

- [ ] Interactive tutorials
- [ ] Visual chart builder
- [ ] Export functionality

**Planned:**

- [ ] Real-time dashboards
- [ ] Geographic visualizations (elections, budgets)
- [ ] Mobile application

````

---

### Impact Metrics Template

```markdown
# Impact Measurement

## Theory of Change

````

INPUTS → ACTIVITIES → OUTPUTS → OUTCOMES → IMPACT

Open-source → Development → Visualizations → Increased → Transparent
platform → and → created, → citizen → and

- funding → deployment → datasets used → engagement → accountable
  government

```

## Key Performance Indicators

### Output Metrics (Quantifiable)

| Category          | Metric                          | Year 1 Target | Year 2 Target |
| ----------------- | ------------------------------- | ------------- | ------------- |
| **Adoption**      | GitHub stars                    | 500           | 2,000         |
|                   | npm weekly downloads            | 1,000         | 5,000         |
|                   | Documented deployments          | 10            | 50            |
| **Usage**         | Visualizations created          | 500           | 2,000         |
|                   | Unique visitors to dashboards   | 5,000         | 20,000        |
|                   | Datasets visualized             | 50            | 200           |
| **Community**     | Active contributors             | 5             | 20            |
|                   | Community members (Discord)     | 100           | 500           |
| **Partnerships**  | Government agency adoptions     | 3             | 10            |
|                   | Media organization partnerships | 2             | 5             |
|                   | Academic partnerships           | 2             | 5             |

### Outcome Metrics (Qualitative)

| Category              | Metric                          | Measurement Method          |
| --------------------- | ------------------------------- | --------------------------- |
| **Transparency**      | Data accessibility improvement  | Before/after surveys        |
| **Civic Engagement**  | Citizen understanding of data   | User surveys, case studies  |
| **Media Capacity**    | Data journalism quality         | Content analysis            |
| **Government Impact** | Transparency mandate compliance | Agency reports              |

### Impact Metrics (Long-term)

| Category          | Indicator                                    | Year 3 Target |
| ----------------- | -------------------------------------------- | ------------- |
| **Democratic**    | Citizens reporting improved understanding    | 70%+          |
| **Media**         | Journalists using platform for investigations| 20+ stories   |
| **Government**    | Agencies meeting transparency mandates       | 80%+          |
| **Regional**      | Neighboring countries adopting platform      | 3 countries   |

## Measurement Framework

### Data Collection

- **Automated:** GitHub analytics, npm downloads, website analytics
- **Quarterly:** User surveys, partner feedback, community polls
- **Annual:** Impact assessment, case study development

### Reporting

- **Monthly:** Internal metrics dashboard
- **Quarterly:** Progress report to funders
- **Annual:** Comprehensive impact report

### Success Definition

**Year 1 Success:**
- Recognized as the go-to tool for Serbian government data visualization
- 3+ government agency partnerships established
- Active community of contributors and users

**Year 3 Success:**
- Self-sustaining platform with regional expansion
- Influence on EU open data policy
- Model for other Balkan countries
```

---

### Budget Template

```markdown
# Budget Proposal

## Summary

| Category             | Year 1   | Year 2   | Year 3   | Total    |
| -------------------- | -------- | -------- | -------- | -------- |
| Personnel            | €[X]     | €[X]     | €[X]     | €[X]     |
| Development          | €[X]     | €[X]     | €[X]     | €[X]     |
| Infrastructure       | €[X]     | €[X]     | €[X]     | €[X]     |
| Community & Events   | €[X]     | €[X]     | €[X]     | €[X]     |
| Marketing & Outreach | €[X]     | €[X]     | €[X]     | €[X]     |
| **TOTAL**            | **€[X]** | **€[X]** | **€[X]** | **€[X]** |

## Detailed Breakdown

### Personnel (€[X]/year)

| Role               | % Time | Annual Cost |
| ------------------ | ------ | ----------- |
| Technical Lead     | 50%    | €[X]        |
| Frontend Developer | 100%   | €[X]        |
| Backend Developer  | 50%    | €[X]        |
| Community Manager  | 50%    | €[X]        |
| **Subtotal**       |        | **€[X]**    |

### Development (€[X]/year)

| Item                    | Cost     |
| ----------------------- | -------- |
| Feature development     | €[X]     |
| Bug fixes & maintenance | €[X]     |
| Security audits         | €[X]     |
| Accessibility audits    | €[X]     |
| Testing infrastructure  | €[X]     |
| **Subtotal**            | **€[X]** |

### Infrastructure (€[X]/year)

| Item                    | Cost     |
| ----------------------- | -------- |
| Cloud hosting (AWS/GCP) | €[X]     |
| Domain & SSL            | €[X]     |
| Monitoring & analytics  | €[X]     |
| CI/CD services          | €[X]     |
| **Subtotal**            | **€[X]** |

### Community & Events (€[X]/year)

| Item                | Cost     |
| ------------------- | -------- |
| Community platform  | €[X]     |
| Virtual meetups     | €[X]     |
| Annual conference   | €[X]     |
| Contributor rewards | €[X]     |
| **Subtotal**        | **€[X]** |

### Marketing & Outreach (€[X]/year)

| Item                    | Cost     |
| ----------------------- | -------- |
| Website & documentation | €[X]     |
| Video production        | €[X]     |
| Partnership travel      | €[X]     |
| Press & media           | €[X]     |
| **Subtotal**            | **€[X]** |

## Sustainability Plan

### Revenue Diversification (Year 2+)

| Source               | Year 2   | Year 3   |
| -------------------- | -------- | -------- |
| Enterprise licenses  | €[X]     | €[X]     |
| Training & workshops | €[X]     | €[X]     |
| Custom development   | €[X]     | €[X]     |
| Support contracts    | €[X]     | €[X]     |
| **Total Revenue**    | **€[X]** | **€[X]** |

### Path to Self-Sustainability

- **Year 1:** 100% grant-funded
- **Year 2:** 70% grant, 30% revenue
- **Year 3:** 40% grant, 60% revenue
- **Year 4+:** Self-sustaining
```

---

### Sustainability Plan Template

```markdown
# Sustainability Plan

## Long-Term Vision

Vizualni Admin Srbije will become the standard for Serbian government data
visualization, maintained by a sustainable ecosystem of:

1. **Open-source community** — Ongoing contributions and maintenance
2. **Enterprise customers** — Paid features and support
3. **Government partnerships** — Implementation and support contracts
4. **Grant funding** — Strategic growth and innovation

## Open-Core Model

### Free Tier (Forever)

- Core visualization library
- Basic chart types
- data.gov.rs integration
- Community support
- Documentation and tutorials

### Enterprise Tier (Paid)

| Feature                 | Agency License | Enterprise License |
| ----------------------- | -------------- | ------------------ |
| Price                   | €2,000/year    | €5,000/year        |
| Advanced visualizations | ✓              | ✓                  |
| Custom data connectors  | ✓              | ✓                  |
| On-premise deployment   | -              | ✓                  |
| SLA-backed support      | -              | ✓                  |
| Training workshops      | 1 included     | Unlimited          |
| Seats                   | Up to 5        | Unlimited          |

### Services (Paid)

| Service                 | Price        |
| ----------------------- | ------------ |
| Training workshop       | €500/day     |
| Custom development      | €100/hour    |
| Implementation support  | €2,000/week  |
| Annual support contract | €10,000/year |

## Community Sustainability

### Contributor Pipeline

1. **Users** — Report bugs, request features
2. **Contributors** — Submit PRs, improve docs
3. **Maintainers** — Review PRs, guide development
4. **Core Team** — Strategic direction, major features

### University Partnerships

- Student internships for development
- Research collaborations for innovation
- Course integration for talent pipeline

### Government Partnerships

- Implementation support contracts
- Training and capacity building
- Custom feature development

## Financial Projections

| Year | Grant Revenue | Enterprise Revenue | Services Revenue | Total    | Sustainability |
| ---- | ------------- | ------------------ | ---------------- | -------- | -------------- |
| 1    | €150,000      | €6,000             | €20,000          | €176,000 | 15%            |
| 2    | €100,000      | €40,000            | €50,000          | €190,000 | 47%            |
| 3    | €50,000       | €100,000           | €100,000         | €250,000 | 80%            |
| 4    | €0            | €200,000           | €150,000         | €350,000 | 100%           |

## Risk Mitigation

| Risk                    | Mitigation                                   |
| ----------------------- | -------------------------------------------- |
| Grant funding gaps      | Diversified revenue streams                  |
| Contributor burnout     | University pipeline, paid maintainers        |
| Government adoption lag | Media and NGO adoption first                 |
| Technical debt          | Dedicated maintenance sprints                |
| Competition             | Serbian-specific integration, community moat |

## Exit Strategy

If the project becomes unsustainable:

1. **Code remains open-source** — MIT license ensures perpetual availability
2. **Documentation preserved** — All materials publicly archived
3. **Community fork option** — Active contributors can take over maintenance
4. **Data preservation** — All geographic data and connectors preserved
```

---

## Application Timeline

### 8-Week Application Process

| Week | Activity                                                       |
| ---- | -------------------------------------------------------------- |
| 1    | Research funder priorities, review past awards                 |
| 2    | Draft problem statement and solution description               |
| 3    | Develop budget and sustainability plan                         |
| 4    | Gather supporting materials (letters of support, case studies) |
| 5    | Complete full application draft                                |
| 6    | Internal review and revision                                   |
| 7    | External review (partner, mentor)                              |
| 8    | Final revision and submission                                  |

---

## Supporting Materials Checklist

- [ ] Organization registration documents
- [ ] Financial statements (2 years)
- [ ] Letters of support from:
  - [ ] Government agencies
  - [ ] Media organizations
  - [ ] Academic institutions
  - [ ] NGO partners
- [ ] Case studies (if available)
- [ ] Team bios and CVs
- [ ] Technical architecture diagram
- [ ] Project timeline/Gantt chart
- [ ] Risk assessment matrix

---

## Post-Application

### If Successful

1. **Acknowledge** within 24 hours
2. **Review** grant agreement carefully
3. **Set up** reporting schedule
4. **Establish** project management system
5. **Communicate** to community and partners

### If Unsuccessful

1. **Request** feedback from funder
2. **Analyze** gaps and weaknesses
3. **Revise** application for next round or different funder
4. **Maintain** momentum with existing resources

---

**Questions?** Open a GitHub Issue: https://github.com/acailic/vizualni-admin/issues
