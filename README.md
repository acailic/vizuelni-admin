# Визуелни Административни Подаци Србије

**The Canonical Interface for Serbian Government Data**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black.svg)](https://nextjs.org/)
[![npm version](https://img.shields.io/npm/v/@vizualni/core.svg)](https://www.npmjs.com/package/@vizualni/core)

[**Српски (ћирилица)**](#српски) | [**Srpski (latinica)**](#srpski) | [**English**](#english)

---

## The Vision

**Every Serbian citizen should be able to understand their government through data.**

Serbia has invested heavily in open data infrastructure—3,412+ datasets from 155+ organizations on [data.gov.rs](https://data.gov.rs). Yet most citizens cannot access, understand, or use this data. The gap isn't the data—it's the tools.

**Vizualni Admin Srbije bridges that gap.**

We're building the canonical interface between raw government data and citizen understanding—a platform that transforms complex datasets into clear, accessible visualizations that anyone can create, share, and understand.

---

<a name="english"></a>

## Why This Matters

### The Problem

- **Transparency Gap**: Government data exists but remains inaccessible to most citizens
- **Technical Barriers**: Existing tools require developer expertise
- **Language Barriers**: International tools don't support Serbian languages
- **Fragmented Ecosystem**: No unified approach to Serbian government data visualization

### The Solution

A **Serbian-first, government-integrated, citizen-focused** visualization platform that:

| Generic Libraries                    | Vizualni Admin Srbije                                            |
| ------------------------------------ | ---------------------------------------------------------------- |
| You figure out the data              | **Data integration built-in** — direct data.gov.rs API           |
| Internationalization as afterthought | **Serbian-first design** — Cyrillic, Latin, English from day one |
| Generic examples                     | **Real Serbian datasets** — population, budget, elections        |
| Community support                    | **Government-aligned roadmap** — shaped by actual agency needs   |

---

## Three-Tier Value Proposition

### 🏛️ Civic Impact (Primary)

Making government data accessible to every Serbian citizen—transparency as infrastructure, not afterthought.

### ⚙️ Technical Excellence (Secondary)

Government-grade reliability with developer-friendly simplicity. TypeScript, WCAG 2.1 AA, comprehensive testing.

### 🌍 Ecosystem Leadership (Tertiary)

Setting the standard for Balkan government data visualization—building what others will follow.

---

## Quick Start

### Try It Now

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/acailic/vizualni-admin)

No installation required—experiment with Serbian government data visualization in your browser.

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/vizuelni-admin-srbije.git
cd vizuelni-admin-srbije

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the platform.

## Running on StackBlitz

This project is optimized for [StackBlitz](https://stackblitz.com), a browser-based development environment.

### Quick Start on StackBlitz

1. Open the project on StackBlitz
2. Wait for npm install to complete (skip the husky, prisma generate)
3. Run `npm run dev:stackblitz`
4. Open http://localhost:3001

### StackBlitz-Specific Configuration

- **Port**: 3001 (to avoid conflicts)
- **Memory**: 4GB allocated for Node.js
- **Database**: SQLite (file-based, no migrations needed)
- **Hot reload**: Enabled for faster development

### Troubleshooting

If you see memory errors:

- Close other browser tabs
- Run `npm run dev:stackblitz` again
- Check browser console for errors

### Using as a Library

```bash
# Core visualization primitives
npm install @vizualni/core

# React components
npm install @vizualni/react

# Serbian geographic data
npm install @vizualni/geo-data

# Data preparation utilities
npm install @vizualni/data

# Chart configuration
npm install @vizualni/charts
```

---

## Features

### 🎯 Multi-Language Support

Native support for Serbian Cyrillic, Serbian Latin, and English—not bolted on, built in.

### 📊 8+ Chart Types

Line, Bar, Column, Area, Pie, Scatterplot, Table, Combo, and Geographic maps—all configured for Serbian government data.

### 🔍 data.gov.rs Integration

Direct API integration with Serbia's official open data portal—access 3,412+ datasets instantly.

### 🗺️ Serbian Geographic Data

Built-in GeoJSON for all Serbian regions, districts, and municipalities. Create choropleth maps in minutes.

### ♿ Accessibility First

WCAG 2.1 AA compliant by default. Government data should be accessible to all citizens.

### ⚡ Production Ready

Next.js 14, React 18, TypeScript. Built for the scale and reliability government demands.

---

## Who This Is For

### Government Agencies

Transform your data into citizen-facing dashboards that meet transparency mandates. Free implementation support for first adopters.

### Data Journalists

The toolkit for investigating Serbian government data. Pre-built templates for budgets, elections, demographics.

### Research Institutions

Cite-ready visualizations with proper data provenance. Export to PDF, PowerPoint, or embed directly.

### NGOs & Civil Society

Make your advocacy data-driven. Visualize government performance, track promises, inform citizens.

### Students & Educators

Learn data visualization with real Serbian datasets. Course materials available for academic use.

---

## Monorepo Structure

```
vizuelni-admin-srbije/
├── packages/
│   ├── core/           # Framework-agnostic visualization primitives
│   ├── react/          # React bindings and components
│   ├── charts/         # Chart configuration schemas and validation
│   ├── data/           # Data preparation utilities
│   ├── geo-data/       # Serbian geographic data (GeoJSON)
│   ├── connectors/     # Data source connectors (data.gov.rs, CSV, JSON)
│   └── sample-data/    # Example Serbian government datasets
├── src/
│   ├── app/            # Next.js 14 App Router application
│   ├── components/     # React components
│   └── lib/            # Core libraries and utilities
├── docs/               # Comprehensive documentation
└── templates/          # StackBlitz and deployment templates
```

---

## Examples

### Population by Region

```typescript
import { BarChart } from '@vizualni/react';
import { serbiaPopulation } from '@vizualni/sample-data';

export function PopulationChart() {
  return (
    <BarChart
      data={serbiaPopulation}
      x="region"
      y="population"
      title="Population by Region (2024)"
      locale="sr-Cyrl"
    />
  );
}
```

### Budget Allocation Map

```typescript
import { ChoroplethMap } from '@vizualni/react';
import { serbiaDistricts } from '@vizualni/geo-data';
import { budget2024 } from '@vizualni/sample-data';

export function BudgetMap() {
  return (
    <ChoroplethMap
      geo={serbiaDistricts}
      data={budget2024}
      valueKey="allocation"
      title="2024 Budget Allocation by District"
      colorScheme="blues"
    />
  );
}
```

### Direct data.gov.rs Integration

```typescript
import { DataGovClient } from '@vizualni/connectors';

const client = new DataGovClient();

// Search datasets
const datasets = await client.searchDatasets({
  query: 'populacija',
  organization: 'republički-zavod-za-statistiku',
});

// Fetch and visualize
const data = await client.getDatasetResources(datasets[0].id);
```

---

## Documentation

- **[Getting Started](./docs/GETTING-STARTED.md)** — Your first visualization in 5 minutes
- **[API Reference](./docs/API_REFERENCE.md)** — Complete API documentation
- **[Architecture](./docs/ARCHITECTURE.md)** — Technical deep dive
- **[Data Connectors](./docs/DATA_CONNECTORS.md)** — Connecting to data sources
- **[Deployment Guide](./docs/DEPLOYMENT.md)** — Production deployment

---

## Contributing

We welcome contributions from developers, designers, translators, and domain experts.

**High-Value Contributor Profiles:**

- 🏛️ **Government Developers** — Real-world use cases, accessibility requirements
- 🎓 **Academic Researchers** — Statistical accuracy, novel visualizations
- 📰 **Data Journalists** — Edge cases, UX feedback, advocacy
- 🌍 **Serbian Diaspora** — Internationalization, best practices
- 💻 **Open Source Enthusiasts** — Bug fixes, documentation, features

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## Roadmap

### Phase 1: Foundation (Months 1-6)

- [x] Core visualization library
- [x] data.gov.rs integration
- [x] Multi-language support
- [ ] Interactive tutorials
- [ ] First government partnerships

### Phase 2: Expansion (Months 7-18)

- [ ] Geographic visualizations (municipal maps, election results)
- [ ] Real-time dashboards
- [ ] Export to PDF/PowerPoint
- [ ] Comparison tools (year-over-year, municipality-to-municipality)

### Phase 3: Leadership (Months 19-36)

- [ ] Regional expansion (Croatia, Slovenia, Bosnia, Montenegro)
- [ ] AI-powered insights and natural language queries
- [ ] Mobile-first dashboard builder
- [ ] Plugin marketplace

---

## Strategic Partnerships

We're actively seeking partnerships with:

**Government Agencies**

- Ministry of Public Administration and Local Self-Government
- Office for IT and eGovernment
- Statistical Office of the Republic of Serbia
- Cities of Belgrade, Novi Sad, Niš

**Academic Institutions**

- University of Belgrade (FON)
- University of Novi Sad
- Singidunum University

**Media Organizations**

- BIRN (Balkan Investigative Reporting Network)
- CINS (Center for Investigative Journalism of Serbia)
- KRIK (Crime and Corruption Reporting Network)

**Interested?** Contact us at opendata@ite.gov.rs

---

## Sustainability Model

**Open Core Approach:**

| Free                    | Enterprise                                               |
| ----------------------- | -------------------------------------------------------- |
| Core library            | Advanced visualizations (geographic, network, real-time) |
| Basic charts            | Custom data source connectors                            |
| data.gov.rs integration | On-premise deployment                                    |
| Community support       | SLA-backed support                                       |
|                         | Training and workshops                                   |

This ensures the project remains sustainable while keeping core functionality free and open.

---

## License

MIT License — use it for any purpose, including commercial applications.

See [LICENSE](./LICENSE) for details.

---

## Data Sources

- [data.gov.rs](https://data.gov.rs) — Open Data Portal of the Republic of Serbia
- [Statistical Office of the Republic of Serbia](https://www.stat.gov.rs) — Official statistics
- [API Documentation](https://data.gov.rs/api/1/swagger.json) — data.gov.rs API reference

---

## Connect

- **Email**: opendata@ite.gov.rs
- **Twitter**: [@kancelarijaITE](https://twitter.com/kancelarijaITE)
- **LinkedIn**: [Канцеларија за ИТ и еУправу](https://www.linkedin.com/company/kancelarija-ite/)
- **Discord**: [Join Community](https://discord.gg/vizualni-admin)

---

## Acknowledgments

Built with gratitude for:

- The Serbian government's commitment to open data
- The open source visualization community (Recharts, D3, Plotly)
- All contributors who believe transparency is infrastructure

---

<div align="center">

**Made with ❤️ for Serbia's Open Data Initiative**

_Transparency as infrastructure, not afterthought._

</div>

---

<a name="српски"></a>

## Српски (ћирилица)

**Канонско интерфејс за српске државне податке**

### Зашто ово важи

Србија је уложила у инфраструктуру отворених података — преко 3.412 скупова података из 155+ организација на data.gov.rs. Ипак, већина грађана не може да приступи, разуме или користи ове податке. Јаз није у подацима — јаз је у алатима.

**Визуелни Административни Подаци Србије премошћује тај јаз.**

### Карактеристике

- 🎯 **Вишеструки језици** — ћирилица, латиница, енглески
- 📊 **8+ типова графикона** — Линијски, стубасти, кружни, мапе...
- 🔍 **Интеграција са data.gov.rs** — Директан приступ 3.412+ скупова података
- 🗺️ **Географски подаци** — GeoJSON за све регионе и општине
- ♿ **Приступачност** — WCAG 2.1 AA компатибилно

### Брзи почетак

```bash
# Клонирајте репозиторијум
git clone https://github.com/your-org/vizuelni-admin-srbije.git

# Инсталирајте зависности
npm install

# Покрените развојни сервер
npm run dev
```

### За кога је ово

- 🏛️ **Државне институције** — Трансформишите податке у грађанима приступачне контролне табле
- 📰 **Новинари** — Комплетан алат за истраживање државних података
- 🎓 **Истраживачи** — Визуализације спремне за цитирање
- 🏢 **НВО** — Учини своје заговарање заснованим на подацима

---

<a name="srpski"></a>

## Srpski (latinica)

**Kanonski interfejs za srpske državne podatke**

### Zašto ovo važi

Srbija je uložila u infrastrukturu otvorenih podataka — preko 3.412 skupova podataka iz 155+ organizacija na data.gov.rs. Ipak, većina građana ne može da pristupi, razume ili koristi ove podatke. Jaz nije u podacima — jaz je u alatima.

**Vizuelni Administrativni Podaci Srbije premošćuje taj jaz.**

### Karakteristike

- 🎯 **Višestruki jezici** — ćirilica, latinica, engleski
- 📊 **8+ tipova grafikona** — Linijski, stubasti, kružni, mape...
- 🔍 **Integracija sa data.gov.rs** — Direktan pristup 3.412+ skupova podataka
- 🗺️ **Geografski podaci** — GeoJSON za sve regione i opštine
- ♿ **Pristupačnost** — WCAG 2.1 AA kompatibilno

### Brzi početak

```bash
# Klonirajte repozitorijum
git clone https://github.com/your-org/vizuelni-admin-srbije.git

# Instalirajte zavisnosti
npm install

# Pokrenite razvojni server
npm run dev
```

### Za koga je ovo

- 🏛️ **Državne institucije** — Transformišite podatke u građanima pristupačne kontrolne table
- 📰 **Novinari** — Kompletan alat za istraživanje državnih podataka
- 🎓 **Istraživači** — Vizualizacije spremne za citiranje
- 🏢 **NVO** — Učini svoje zagovaranje zasnovanim na podacima

---

<div align="center">

**🇷🇸 🇷🇸 🇷🇸**

_Every citizen deserves to understand their government._

</div>
