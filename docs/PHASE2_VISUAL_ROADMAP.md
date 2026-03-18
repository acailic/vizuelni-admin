# Phase 2 Visual Roadmap

**Visual overview of the 12-month expansion plan**

---

## 📅 Timeline Overview

```
2026
┌─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
│   MAR   │   APR   │   MAY   │   JUN   │   JUL   │   AUG   │
├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│ Feature │ Feature │ Feature │ Feature │ Feature │ Feature │
│   39    │   40    │   41    │   41    │   41    │   42    │
│         │         │         │         │         │         │
│Tutorial │  Maps   │Dashboards│Dashboards│Dashboards│ Export │
└─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘

┌─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
│   SEP   │   OCT   │   NOV   │   DEC   │   JAN   │   FEB   │
├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│ Feature │ Feature │  Polish │  Test   │ Deploy  │ Review  │
│   43    │   43    │         │         │         │         │
│         │         │         │         │         │         │
│Compare  │ Compare │  Bug    │  UAT    │ Staging │ Launch  │
│  Tools  │  Tools  │  Fixes  │         │         │         │
└─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘
```

---

## 🎯 Feature Dependencies

```
Feature 39 (Tutorials)
    ↓
Feature 40 (Geographic Viz)
    ↓
Feature 41 (Real-time Dashboards)
    ↓
Feature 42 (PDF/PowerPoint Export)
    ↓
Feature 43 (Comparison Tools)
```

---

## 📊 Resource Allocation

```
Team Size: 6 people

┌─────────────────────────────────────────────────────┐
│ 2 Full-stack Developers  ████████████████  33%     │
│ 1 Frontend Specialist    ████████        17%       │
│ 1 Data Engineer          ████████        17%       │
│ 1 QA Engineer            ████████        17%       │
│ 1 Technical Writer       ████████        17%       │
└─────────────────────────────────────────────────────┘
```

---

## 🏗️ Architecture Overview

```
┌──────────────────────────────────────────────────────┐
│                  User Interface                       │
├──────────────────────────────────────────────────────┤
│  Tutorials  │  Maps  │  Dashboards  │  Export  │  Compare │
├──────────────────────────────────────────────────────┤
│              Component Layer                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐             │
│  │ Overlay  │ │  Map     │ │ Widget   │             │
│  │ Highlight│ │  Controls│ │ Renderer │             │
│  └──────────┘ └──────────┘ └──────────┘             │
├──────────────────────────────────────────────────────┤
│              Business Logic Layer                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐             │
│  │ Tutorial │ │  Geo     │ │ Refresh  │             │
│  │ Validator│ │  Manager │ │ Manager  │             │
│  └──────────┘ └──────────┘ └──────────┘             │
├──────────────────────────────────────────────────────┤
│              Data Layer                               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐             │
│  │ Progress │ │  GeoJSON │ │ WebSocket│             │
│  │ Tracker  │ │  Data    │ │  Client  │             │
│  └──────────┘ └──────────┘ └──────────┘             │
├──────────────────────────────────────────────────────┤
│              External Services                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐             │
│  │data.gov.rs│ │  CDN    │ │  Export  │             │
│  │   API    │ │ Geo Data│ │ Services │             │
│  └──────────┘ └──────────┘ └──────────┘             │
└──────────────────────────────────────────────────────┘
```

---

## 📈 Success Metrics Dashboard

### Feature 39: Tutorials

- Completion Rate: **> 60%**
- User Satisfaction: **> 4.5/5**
- Support Reduction: **> 30%**

### Feature 40: Geographic Viz

- Municipalities: **174/174 ✓**
- Load Time: **< 2s**
- Name Matching: **100%**
- Election Accuracy: **100%**

### Feature 41: Real-time Dashboards

- Update Latency: **< 500ms**
- Widget Support: **10+ widgets**
- Alert Delivery: **< 5s**
- Uptime: **> 99.5%**

### Feature 42: Export

- Success Rate: **> 98%**
- PDF Generation: **< 10s** (20 pages)
- PPTX Generation: **< 15s** (20 slides)
- Template Consistency: **100%**

### Feature 43: Comparison

- Calculation Time: **< 3s**
- Municipality Limit: **50+**
- Normalization Accuracy: **100%**

---

## 🎓 Learning Paths Overview

### Citizen Explorer (15 min)

- ✓ Tutorial 1: First Data Exploration (5 min)
- ✓ Tutorial 2: Creating Your First Chart (5 min)
- ✓ Tutorial 3: Geographic Data Basics (5 min)
- **Badge:** 🏅 Data Explorer

### Developer Quickstart (30 min)

- ✓ Tutorial 1: Installation & Setup (5 min)
- ✓ Tutorial 2: First Chart Component (10 min)
- ✓ Tutorial 3: Geographic Maps (10 min)
- ✓ Tutorial 4: data.gov.rs Connection (5 min)
- **Badge:** 🏅 Developer

### Government Integration (45 min)

- ✓ Tutorial 1: Creating Dashboards (15 min)
- ✓ Tutorial 2: Export & Sharing (15 min)
- ✓ Tutorial 3: Accessibility (15 min)
- **Badge:** 🏅 Government User

### Data Journalism (60 min)

- ✓ Tutorial 1: Finding Stories (15 min)
- ✓ Tutorial 2: Building Data Story (30 min)
- ✓ Tutorial 3: Embedding in Articles (15 min)
- **Badge:** 🏅 Data Journalist

---

## 🗺️ Geographic Data Structure

```
Serbia Geographic Hierarchy
│
├── Country (1)
│   └── Republic of Serbia
│
├── Provinces (2)
│   ├── Vojvodina
│   └── Kosovo and Metohija
│
├── Districts (26)
│   ├── Grad Beograd
│   ├── Južnobački
│   ├── Sremski
│   └── ... (23 more)
│
└── Municipalities (174)
    ├── Beograd (Stari grad, Vračar, ...)
    ├── Novi Sad
    ├── Niš
    └── ... (171 more)
```

**Data Sources:**

- GeoJSON boundaries
- Population statistics
- Economic indicators
- Election results

---

## 🔄 Real-time Data Flow

```
┌─────────────┐
│ Data Source │ (data.gov.rs, custom APIs)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ WebSocket   │ Real-time connection
│   Server    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Client    │ Browser WebSocket
│ Connection  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Dashboard  │ Auto-updating widgets
│  Widgets    │
└─────────────┘

Fallback: HTTP Polling (every 30s)
```

---

## 📄 Export Workflow

```
User Creates Visualization
         │
         ▼
┌─────────────────┐
│ Export Dialog   │
│ • PDF Report    │
│ • PowerPoint    │
│ • PNG/SVG       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Configure       │
│ • Title         │
│ • Template      │
│ • Options       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Generate        │
│ • Multi-page    │
│ • Charts        │
│ • Tables        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Download        │
│ • PDF file      │
│ • PPTX file     │
└─────────────────┘
```

---

## 📊 Comparison Analysis Flow

```
Select Comparison Type
         │
    ┌────┴────┐
    │         │
    ▼         ▼
Year-over-Year  Municipality
    │              │
    ▼              ▼
┌─────────┐  ┌──────────┐
│Select   │  │Select    │
│Years    │  │Municipal.│
└────┬────┘  └─────┬────┘
     │             │
     ▼             ▼
┌─────────┐  ┌──────────┐
│Select   │  │Select    │
│Metrics  │  │Metrics   │
└────┬────┘  └─────┬────┘
     │             │
     └──────┬──────┘
            │
            ▼
    ┌───────────────┐
    │ Visualize     │
    │ • Line Chart  │
    │ • Table       │
    │ • Radar Chart │
    │ • Difference  │
    └───────┬───────┘
            │
            ▼
    ┌───────────────┐
    │ Export        │
    │ • PDF Report  │
    │ • PPTX        │
    └───────────────┘
```

---

## ⚠️ Risk Mitigation

### HIGH RISK

- **Real-time Data Reliability**
  - Mitigation: Fallback to polling
  - Mitigation: Retry logic
  - Mitigation: Connection monitoring

- **Geographic Data Accuracy**
  - Mitigation: Official sources
  - Mitigation: Data versioning
  - Mitigation: Validation checks

### MEDIUM RISK

- **Performance (174 municipalities)**
  - Mitigation: Lazy loading
  - Mitigation: Data simplification

- **Large Export Timeouts**
  - Mitigation: Chunked exports
  - Mitigation: Progress indicators

### LOW RISK

- **Tutorial Engagement**
  - Mitigation: Incentives & badges

- **Comparison Complexity**
  - Mitigation: Templates & defaults

---

## 📅 Sprint Schedule

```
Sprint 1-2  (Mar): Feature 39 - Tutorial Framework
Sprint 3-4  (Mar-Apr): Feature 39 - Tutorial Content
Sprint 5-6  (Apr-May): Feature 40 - Municipal Maps
Sprint 7-8  (May): Feature 40 - Election Maps
Sprint 9-11 (May-Jul): Feature 41 - Dashboards
Sprint 12-13 (Jul-Aug): Feature 42 - Export
Sprint 14-16 (Aug-Oct): Feature 43 - Comparison
Sprint 17-18 (Oct-Nov): Polish & Bug Fixes
Sprint 19-20 (Nov-Dec): Testing & UAT
Sprint 21-22 (Dec-Jan): Deployment
Sprint 23-24 (Jan-Feb): Launch & Review
```

---

**Last Updated:** 2026-03-17  
**Version:** 1.0
