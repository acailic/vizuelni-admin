# Analytics Setup Guide for Vizuelni Admin Srbije

**Last Updated:** March 2026

This guide sets up privacy-focused analytics to track demo usage without compromising user privacy.

---

## Analytics Strategy

### What We Track

- Page views and user flows
- Popular datasets and visualizations
- Chart type preferences
- Export actions
- Geographic distribution (country level only)

### What We DON'T Track

- Personal information
- IP addresses (anonymized)
- Individual user behavior across sessions
- Any data that could identify specific users

---

## Option 1: Plausible Analytics (RECOMMENDED)

**Why Plausible:**

- GDPR compliant by design
- No cookies required
- Open source
- Lightweight (< 1KB script)
- Simple dashboard

### Setup Steps

#### 1. Create Plausible Account

```bash
# Option A: Use Plausible Cloud (€9/month for 10K pageviews)
# Visit: https://plausible.io

# Option B: Self-host (free, requires server)
docker run -d -p 8000:8000 plausible/analytics:latest
```

#### 2. Add Plausible to Next.js

```typescript
// src/app/layout.tsx or src/components/Analytics.tsx

import Script from 'next/script';

export function Analytics() {
  return (
    <Script
      defer
      data-domain="vizuelni-admin-srbije.rs"
      src="https://plausible.io/js/script.js"
    />
  );
}
```

#### 3. Add to Root Layout

```typescript
// src/app/layout.tsx
import { Analytics } from '@/components/Analytics';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Custom Events to Track

```typescript
// src/lib/analytics.ts

export function trackChartCreated(chartType: string, datasetId: string) {
  if (typeof window !== 'undefined' && (window as any).plausible) {
    (window as any).plausible('Chart Created', {
      props: {
        chartType,
        datasetId,
      },
    });
  }
}

export function trackChartExported(format: string, chartType: string) {
  if (typeof window !== 'undefined' && (window as any).plausible) {
    (window as any).plausible('Chart Exported', {
      props: {
        format,
        chartType,
      },
    });
  }
}

export function trackDatasetViewed(datasetId: string, source: string) {
  if (typeof window !== 'undefined' && (window as any).plausible) {
    (window as any).plausible('Dataset Viewed', {
      props: {
        datasetId,
        source, // 'browse' | 'search' | 'direct'
      },
    });
  }
}

export function trackEmbedGenerated(chartId: string) {
  if (typeof window !== 'undefined' && (window as any).plausible) {
    (window as any).plausible('Embed Generated', {
      props: {
        chartId,
      },
    });
  }
}
```

---

## Option 2: Umami Analytics (FREE SELF-HOSTED)

**Why Umami:**

- 100% free and open source
- Self-hosted (full data control)
- Simple installation
- GDPR compliant

### Setup Steps

#### 1. Deploy Umami

```bash
# Using Docker
docker run -d --name umami \
  -p 3001:3000 \
  -e DATABASE_URL=postgresql://user:pass@db:5432/umami \
  ghcr.io/umami-software/umami:postgresql-latest

# Or use Vercel/Railway one-click deploy
# https://umami.is/docs/install
```

#### 2. Add Umami to Next.js

```typescript
// src/components/Analytics.tsx
import Script from 'next/script';

export function Analytics() {
  return (
    <>
      <Script
        async
        src="https://your-umami-instance.com/script.js"
        data-website-id="your-website-id"
      />
    </>
  );
}
```

---

## Option 3: Vercel Analytics (IF HOSTED ON VERCEL)

**Why Vercel Analytics:**

- Free tier included
- Zero configuration
- Privacy-focused
- Integrated with Vercel dashboard

### Setup Steps

#### 1. Install Package

```bash
npm install @vercel/analytics
```

#### 2. Add to Layout

```typescript
// src/app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

---

## Implementation: Add Analytics Hooks

### Create Analytics Module

```typescript
// src/lib/analytics/index.ts

type EventName =
  | 'page_view'
  | 'chart_created'
  | 'chart_exported'
  | 'dataset_viewed'
  | 'embed_generated'
  | 'search_performed'
  | 'filter_applied';

interface EventProperties {
  chartType?: string;
  datasetId?: string;
  format?: string;
  source?: string;
  query?: string;
  filterType?: string;
}

// Analytics provider abstraction
class AnalyticsService {
  private enabled: boolean;
  private provider: 'plausible' | 'umami' | 'vercel' | 'none';

  constructor() {
    this.enabled = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true';
    this.provider =
      (process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER as any) || 'none';
  }

  track(name: EventName, properties?: EventProperties) {
    if (!this.enabled) return;

    switch (this.provider) {
      case 'plausible':
        this.trackPlausible(name, properties);
        break;
      case 'umami':
        this.trackUmami(name, properties);
        break;
      case 'vercel':
        // Vercel tracks automatically
        break;
    }
  }

  private trackPlausible(name: string, properties?: EventProperties) {
    if (typeof window !== 'undefined' && (window as any).plausible) {
      (window as any).plausible(name, { props: properties });
    }
  }

  private trackUmami(name: string, properties?: EventProperties) {
    if (typeof window !== 'undefined' && (window as any).umami) {
      (window as any).umami.track(name, properties);
    }
  }
}

export const analytics = new AnalyticsService();

// Convenience functions
export function trackChartCreated(chartType: string, datasetId: string) {
  analytics.track('chart_created', { chartType, datasetId });
}

export function trackChartExported(format: string, chartType?: string) {
  analytics.track('chart_exported', { format, chartType });
}

export function trackDatasetViewed(datasetId: string, source: string) {
  analytics.track('dataset_viewed', { datasetId, source });
}

export function trackEmbedGenerated(chartId: string) {
  analytics.track('embed_generated', { chartId });
}

export function trackSearch(query: string) {
  analytics.track('search_performed', { query });
}
```

### Add to Components

```typescript
// src/components/configurator/ConfiguratorShell.tsx

import { trackChartCreated, trackChartExported } from '@/lib/analytics';

export function ConfiguratorShell({ ... }) {
  const handleChartCreate = (config: ChartConfig) => {
    // Existing chart creation logic
    ...

    // Track analytics
    trackChartCreated(config.type, config.dataset_id);
  };

  const handleExport = (format: string) => {
    // Existing export logic
    ...

    // Track analytics
    trackChartExported(format, chartConfig.type);
  };

  return ( ... );
}
```

```typescript
// src/app/[locale]/browse/BrowseClient.tsx

import { trackDatasetViewed, trackSearch } from '@/lib/analytics';

export function BrowseClient({ ... }) {
  const handleDatasetSelect = (dataset: BrowseDataset) => {
    trackDatasetViewed(dataset.id, 'browse');
    router.push(`/${locale}/create?dataset=${dataset.id}`);
  };

  const handleSearch = (query: string) => {
    trackSearch(query);
    // Existing search logic
  };

  return ( ... );
}
```

---

## Environment Variables

Add to `.env.local`:

```bash
# Analytics Configuration
NEXT_PUBLIC_ANALYTICS_ENABLED=true
NEXT_PUBLIC_ANALYTICS_PROVIDER=plausible  # or 'umami' or 'vercel'

# Plausible (if using)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=vizuelni-admin-srbije.rs

# Umami (if using)
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-website-id
NEXT_PUBLIC_UMAMI_URL=https://your-umami-instance.com
```

---

## Dashboard Metrics to Monitor

### Key Performance Indicators (KPIs)

| Metric               | Description          | Target (Month 3) |
| -------------------- | -------------------- | ---------------- |
| **MAU**              | Monthly Active Users | 500              |
| **Charts Created**   | Total visualizations | 2,000            |
| **Export Rate**      | % of charts exported | 30%              |
| **Embed Rate**       | % of charts embedded | 10%              |
| **Dataset Coverage** | Unique datasets used | 50               |

### User Flow Tracking

```
Home Page
    ↓ (40%)
Browse Page
    ↓ (25%)
Dataset Detail
    ↓ (20%)
Create Chart
    ↓ (15%)
Export/Embed
```

### Popular Content

Track which:

- Datasets are most viewed
- Chart types are most created
- Export formats are preferred
- Languages are used (Cyrillic vs Latin vs English)

---

## Privacy Compliance

### GDPR Requirements Met

- [x] No cookies used
- [x] IP addresses anonymized
- [x] No cross-site tracking
- [x] No personal data collected
- [x] Data stored in EU (if using EU Plausible)

### Cookie Banner (NOT REQUIRED)

Because we use privacy-first analytics that don't require cookies, no cookie banner is needed. However, include a privacy notice:

```typescript
// src/components/PrivacyNotice.tsx

export function PrivacyNotice() {
  return (
    <div className="text-xs text-gray-500">
      We use privacy-focused analytics that don't track personal information.
      <a href="/privacy" className="underline">Learn more</a>
    </div>
  );
}
```

---

## Reporting Template

### Weekly Metrics Report

```markdown
# Vizuelni Admin Srbije - Weekly Analytics Report

**Week of:** [DATE]

## Traffic

- Page Views: [X]
- Unique Visitors: [X]
- Avg. Session Duration: [X] min

## Engagement

- Charts Created: [X]
- Charts Exported: [X]
- Datasets Viewed: [X]
- Searches Performed: [X]

## Top Content

1. [Most viewed dataset]
2. [Most created chart type]
3. [Most exported format]

## Insights

- [Key observation 1]
- [Key observation 2]

## Actions

- [ ] [Action item from data]
```

---

## Implementation Checklist

- [ ] Choose analytics provider (Plausible recommended)
- [ ] Create account/set up self-hosted instance
- [ ] Add analytics component to layout
- [ ] Create analytics utility module
- [ ] Add tracking to key user actions:
  - [ ] Chart creation
  - [ ] Chart export
  - [ ] Dataset viewing
  - [ ] Search
  - [ ] Embed generation
- [ ] Set up weekly reporting
- [ ] Create dashboard for real-time monitoring
- [ ] Document analytics in privacy policy

---

## Cost Comparison

| Provider            | Cost               | Data Ownership | Self-Host Option |
| ------------------- | ------------------ | -------------- | ---------------- |
| Plausible Cloud     | €9/mo (10K pv)     | Yours          | Yes              |
| Plausible Self-host | Free (server cost) | Yours          | Yes              |
| Umami               | Free (server cost) | Yours          | Yes              |
| Vercel Analytics    | Free tier          | Yours          | No               |
| Google Analytics    | Free               | Google's       | No               |

**Recommendation:** Start with Vercel Analytics (free, zero-config) or Plausible Cloud (€9/mo, better privacy story for government grants).

---

_Update this guide when adding new tracking events or changing providers._
