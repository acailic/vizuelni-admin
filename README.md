# Vizualni Admin

**Turn Serbian government data into shareable visualizations.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black.svg)](https://nextjs.org/)

A Next.js application for visualizing data from [data.gov.rs](https://data.gov.rs) — Serbia's open data portal. Create charts, maps, and dashboards from 3,400+ public datasets.

**Live demo**: [acailic.github.io/vizualni-admin](https://acailic.github.io/vizualni-admin/)

---

## Quick Start

```bash
# Clone
git clone https://github.com/acailic/vizualni-admin.git
cd vizualni-admin

# Install
npm install

# Run
npm run dev
```

Open [localhost:3000](http://localhost:3000).

**Try without installing**: [StackBlitz](https://stackblitz.com/github/acailic/vizualni-admin)

---

## The Golden Path

**1. Browse datasets** → Find data from data.gov.rs
**2. Create a chart** → Line, bar, pie, map, table
**3. Share or embed** → PDF, PNG, iframe embed

[See it in action →](https://acailic.github.io/vizualni-admin/)

---

## Features

- **Serbian-first**: Cyrillic, Latin, and English support
- **8+ chart types**: Line, bar, pie, scatter, map, table, combo, radar
- **data.gov.rs integration**: Direct API access to 3,400+ datasets
- **Geographic maps**: GeoJSON for all Serbian regions and municipalities
- **Accessible**: WCAG 2.1 AA compliant
- **Export**: PDF, PNG, PowerPoint

---

## Using as a Library

```bash
npm install @vizualni/core @vizualni/react
```

```tsx
import { BarChart } from '@vizualni/react';

function PopulationChart({ data }) {
  return (
    <BarChart
      data={data}
      x="region"
      y="population"
      locale="sr-Cyrl"
    />
  );
}
```

---

## Monorepo Structure

```
packages/
├── core/        # Framework-agnostic primitives
├── react/       # React components
├── charts/      # Chart configuration
├── data/        # Data utilities
├── geo-data/    # Serbian GeoJSON
└── connectors/  # data.gov.rs, CSV, JSON

src/
├── app/         # Next.js App Router
├── components/  # React components
└── lib/         # Utilities
```

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

**Good first issues**: [github.com/acailic/vizualni-admin/issues](https://github.com/acailic/vizualni-admin/issues)

---

## Documentation

- [Getting Started](./docs/GETTING-STARTED.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [API Reference](./docs/api-reference/)
- [Deployment](./docs/DEPLOYMENT_GUIDE.md)

---

## License

MIT. See [LICENSE](./LICENSE).

---

## Data Sources

- [data.gov.rs](https://data.gov.rs) — Open Data Portal of Serbia
- [Statistical Office of Serbia](https://www.stat.gov.rs)
