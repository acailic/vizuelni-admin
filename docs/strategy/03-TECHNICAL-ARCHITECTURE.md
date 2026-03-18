# Technical Architecture

> **Architecture Decision Records (ADRs), Visualization Engine Evaluation, System Diagram, Scaling Tiers, Monitoring & Observability**

---

## 1. Architecture Decision Records (ADRs)

### ADR-001: Next.js 14 App Router

**Status**: Accepted (February 2024)

**Context**:

- Need a React framework for SSR/SSG with strong TypeScript support
- Must support 3 locales (sr-Cyrl, sr-Latn, en) with clean routing
- Static export capability required for GitHub Pages deployment
- API routes needed for database-backed features

**Decision**:
Use Next.js 14 with App Router (`src/app/[locale]/` structure).

**Alternatives Considered**:
| Alternative | Pros | Cons | Why Rejected |
|-------------|------|------|--------------|
| Pages Router | Mature, stable | Less intuitive routing | App Router has better i18n patterns |
| Remix | Good DX | Smaller ecosystem | Next.js has larger community |
| Vite + React Router | Fast builds | No built-in SSR | Needed SSR for SEO |
| Astro | Great for content | React integration complex | Heavy React interactivity needs |

**Consequences**:

- ✅ Clean locale routing via `[locale]` dynamic segment
- ✅ Server components reduce client bundle
- ✅ Built-in SEO optimization
- ⚠️ App Router still evolving (some APIs unstable)
- ⚠️ Static export requires careful planning

**Evidence**: `next.config.ts`, `src/app/[locale]/`, `package.json`

---

### ADR-002: Recharts + D3.js + Leaflet for Visualization

**Status**: Accepted (February 2024)

**Context**:

- Need 9+ chart types (bar, line, area, pie, scatter, table, map, choropleth, combo)
- Must support Cyrillic text rendering
- Accessibility (WCAG 2.1 AA) required
- Bundle size matters for performance

**Decision**:
Use Recharts for standard charts, D3.js for custom visualizations, and Leaflet for maps.

**Visualization Engine Evaluation Matrix**:

| Criterion             | D3.js        | Recharts    | Chart.js   | ECharts       | Observable Plot |
| --------------------- | ------------ | ----------- | ---------- | ------------- | --------------- |
| **Flexibility**       | ★★★★★        | ★★★☆☆       | ★★☆☆☆      | ★★★★☆         | ★★★★☆           |
| **Learning Curve**    | Steep        | Easy        | Easy       | Medium        | Medium          |
| **Bundle Size**       | 93KB         | 85KB        | 65KB       | 320KB         | 45KB            |
| **Serbian Text**      | ✅ Good      | ✅ Good     | ⚠️ Issues  | ✅ Good       | ✅ Good         |
| **Map Support**       | ✅ Excellent | ❌ None     | ❌ None    | ✅ Good       | ⚠️ Limited      |
| **Accessibility**     | ⚠️ Manual    | ✅ Built-in | ⚠️ Manual  | ⚠️ Manual     | ⚠️ Manual       |
| **React Integration** | ⚠️ Wrapper   | ✅ Native   | ⚠️ Wrapper | ⚠️ Wrapper    | ⚠️ Wrapper      |
| **Customization**     | ★★★★★        | ★★★☆☆       | ★★☆☆☆      | ★★★★☆         | ★★★★☆           |
| **Community**         | Large        | Large       | Large      | Large (China) | Growing         |
| **Maintenance**       | Active       | Active      | Active     | Active        | Active          |

**Why Recharts + D3 + Leaflet**:

- Recharts: Fast development, good React integration, built-in accessibility
- D3: Unmatched flexibility for custom visualizations (choropleth, sankey)
- Leaflet: Lightweight, proven for geographic visualization

**Alternatives Considered**:
| Alternative | Pros | Cons | Why Rejected |
|-------------|------|------|--------------|
| Chart.js | Small bundle | Limited chart types, weak map support | Doesn't meet requirements |
| ECharts | Rich features | Large bundle (320KB), China-focused | Bundle size concern |
| Observable Plot | Modern API | Less mature, limited map support | Risk of gaps |
| Visx | Low-level control | High development effort | Too much boilerplate |

**Consequences**:

- ✅ Fast development with Recharts for standard charts
- ✅ Full customization with D3 when needed
- ✅ Proven map rendering with Leaflet
- ⚠️ Three dependencies increase complexity
- ⚠️ D3 has steep learning curve for contributors

**Evidence**: `package.json` (recharts: ^2.12.0, d3: ^7.8.5, leaflet: ^1.9.4)

---

### ADR-003: Prisma with SQLite (dev) / PostgreSQL (prod)

**Status**: Accepted (February 2024)

**Context**:

- Need type-safe database access
- Local development should be zero-config
- Production needs reliability and scalability
- Must support user authentication (NextAuth.js)

**Decision**:
Use Prisma ORM with SQLite for development, PostgreSQL for production.

**Alternatives Considered**:
| Alternative | Pros | Cons | Why Rejected |
|-------------|------|------|--------------|
| Drizzle | Lightweight, fast | Less mature, fewer features | Prisma has better tooling |
| TypeORM | Mature | Complex, decorator-heavy | Prisma has cleaner DX |
| Raw SQL | Maximum control | No type safety | Too much boilerplate |
| MongoDB | Flexible schema | Not relational fit | Relational data model needed |

**Consequences**:

- ✅ Type-safe database queries
- ✅ Easy schema migrations
- ✅ SQLite for zero-config local dev
- ✅ PostgreSQL for production reliability
- ⚠️ Two database engines to test
- ⚠️ Prisma client regeneration step required

**Evidence**: `prisma/schema.prisma`, `docker-compose.yml`

---

### ADR-004: NextAuth.js v4 with JWT Strategy

**Status**: Accepted (February 2024)

**Context**:

- Need user authentication for saved charts
- Multiple providers (GitHub, Google, credentials)
- Session persistence across deployments
- GDPR-compliant session handling

**Decision**:
Use NextAuth.js v4 with JWT session strategy (30-day max age).

**Alternatives Considered**:
| Alternative | Pros | Cons | Why Rejected |
|-------------|------|------|--------------|
| Auth0 | Full-featured | Cost, external dependency | Self-hosted preferred |
| Clerk | Modern DX | Cost, external dependency | Self-hosted preferred |
| Supabase Auth | Good DX | Lock-in to Supabase | Flexibility needed |
| Custom JWT | Full control | Security risks | Too much responsibility |
| Database sessions | Revocable | Scalability concerns | JWT simpler for static export |

**Consequences**:

- ✅ Multiple OAuth providers supported
- ✅ Credentials provider for email/password
- ✅ JWT works with static export
- ✅ Prisma adapter for user persistence
- ⚠️ Sessions not immediately revocable
- ⚠️ JWT secret must be secured

**Evidence**: `src/lib/auth/auth-options.ts`, `package.json` (next-auth: ^4.24.7)

---

### ADR-005: Zustand for State Management

**Status**: Accepted (February 2024)

**Context**:

- Need cross-component state for chart configurator
- Local state insufficient for complex interactions
- Redux is overkill for our needs
- Must work with React 18+ and Next.js 14

**Decision**:
Use Zustand for global state management.

**Alternatives Considered**:
| Alternative | Pros | Cons | Why Rejected |
|-------------|------|------|--------------|
| Redux Toolkit | Mature, devtools | Boilerplate, complexity | Overkill for our needs |
| Jotai | Minimal | Less intuitive API | Zustand simpler |
| Recoil | Facebook backing | Unstable future | Project uncertainty |
| React Context | Built-in | Re-render issues | Performance concerns |

**Consequences**:

- ✅ Minimal boilerplate
- ✅ TypeScript support
- ✅ Works with SSR
- ✅ Devtools available
- ⚠️ No time-travel debugging (vs Redux)

**Evidence**: `src/stores/*.ts`, `package.json` (zustand: ^4.5.1)

---

### ADR-006: next-intl for Internationalization

**Status**: Accepted (February 2024)

**Context**:

- Must support 3 locales: sr-Cyrl, sr-Latn, en
- Serbian has two scripts (Cyrillic and Latin)
- Need server and client component support
- SEO-friendly locale routing required

**Decision**:
Use next-intl for internationalization with 3 configured locales.

**Alternatives Considered**:
| Alternative | Pros | Cons | Why Rejected |
|-------------|------|------|--------------|
| next-i18next | Mature | Pages Router focused | App Router support limited |
| react-intl | Industry standard | Complex setup | next-intl simpler |
| Custom routing | Full control | Reinventing wheel | Maintenance burden |

**Consequences**:

- ✅ Clean locale routing (`/sr-Cyrl/`, `/sr-Latn/`, `/en/`)
- ✅ Server and client component support
- ✅ Built-in date/number formatting
- ✅ TypeScript integration
- ⚠️ Translation files must be kept in sync

**Evidence**: `src/lib/i18n/config.ts`, `package.json` (next-intl: ^3.11.0)

---

### ADR-007: Three-Tier Caching (Memory / IndexedDB / Network)

**Status**: Accepted (March 2024)

**Context**:

- data.gov.rs API has rate limits
- Large datasets should be cached locally
- Offline capability needed for PWA
- Performance critical for user experience

**Decision**:
Implement three-tier caching: L1 (Memory), L2 (IndexedDB), L3 (Network).

**Cache Architecture**:

```
Request → L1 Memory Cache (50MB, 1000 entries, 5min TTL)
           ↓ Miss
         L2 IndexedDB (200MB, 10000 entries, 1hr TTL)
           ↓ Miss
         L3 Network (data.gov.rs API)
           ↓ Response
         Store in L1 + L2
```

**Alternatives Considered**:
| Alternative | Pros | Cons | Why Rejected |
|-------------|------|------|--------------|
| Memory only | Simple | Lost on refresh | Not persistent |
| LocalStorage | Persistent | 5-10MB limit | Too small for data |
| Service Worker | Full offline | Complex setup | IndexedDB simpler |
| React Query only | Good caching | Memory only | No persistence |

**Consequences**:

- ✅ Fast repeated access
- ✅ Offline capability
- ✅ Reduced API calls
- ⚠️ Cache invalidation complexity
- ⚠️ IndexedDB browser compatibility

**Evidence**: `src/lib/cache/`, `src/lib/api/datagov-client.ts`

---

### ADR-008: Dual Deployment (Static + Server)

**Status**: Accepted (February 2024)

**Context**:

- Need GitHub Pages deployment (free hosting)
- Also need server features (database, API routes)
- Different environments have different requirements
- Must support both deployment modes

**Decision**:
Support dual deployment: static export (GitHub Pages) and full server (Vercel, Docker).

**Deployment Modes**:
| Mode | Features | Use Case |
|------|----------|----------|
| Static Export | Client-only, no DB | Demo, documentation, simple sites |
| Full Server | DB, API routes, auth | Production, user accounts |

**Alternatives Considered**:
| Alternative | Pros | Cons | Why Rejected |
|-------------|------|------|--------------|
| Server only | Full features | No free hosting | Cost concern |
| Static only | Free hosting | No user features | Missing requirements |
| Separate apps | Clean separation | Duplicate code | Maintenance burden |

**Consequences**:

- ✅ Free demo hosting (GitHub Pages)
- ✅ Full features in production
- ✅ Same codebase for both
- ⚠️ Conditional feature enabling complexity
- ⚠️ Build configuration complexity

**Evidence**: `next.config.ts`, `Dockerfile`, `docker-compose.yml`

---

## 2. System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                    PRESENTATION LAYER                               │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐                  │
│  │   Next.js SSR    │  │   Static Export  │  │    PWA Shell     │                  │
│  │   (Full Server)  │  │  (GitHub Pages)  │  │   (Feature 33)   │                  │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘                  │
│           │                     │                     │                             │
│  ┌────────┴─────────────────────┴─────────────────────┴─────────────────────────┐  │
│  │                           React Components                                     │  │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐  │  │
│  │  │  Charts    │ │ Configurator│ │   Maps     │ │  Filters   │ │   Export   │  │  │
│  │  │(Recharts/  │ │(Interactive)│ │ (Leaflet)  │ │(Hierarchical│ │(PNG/PDF/   │  │  │
│  │  │  D3)       │ │             │ │            │ │  Tree)     │ │  Embed)    │  │  │
│  │  └────────────┘ └────────────┘ └────────────┘ └────────────┘ └────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                      API LAYER                                      │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐                  │
│  │   REST Routes    │  │   GraphQL API    │  │   Auth API       │                  │
│  │  /api/charts/*   │  │  /api/graphql    │  │  /api/auth/*     │                  │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘                  │
│           │                     │                     │                             │
└───────────┼─────────────────────┼─────────────────────┼─────────────────────────────┘
            │                     │                     │
            ▼                     ▼                     ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                     SERVICE LAYER                                   │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐                  │
│  │  Chart Service   │  │  Data Transform  │  │   Auth Service   │                  │
│  │  (CRUD, share)   │  │  (normalization) │  │  (NextAuth.js)   │                  │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘                  │
│           │                     │                     │                             │
│  ┌────────┴─────────────────────┴─────────────────────┴─────────────────────────┐  │
│  │                           State Management (Zustand)                          │  │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐                 │  │
│  │  │Chart Config│ │   Filters  │ │    UI      │ │  Map State │                 │  │
│  │  └────────────┘ └────────────┘ └────────────┘ └────────────┘                 │  │
│  └───────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                       DATA LAYER                                    │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐                  │
│  │  Prisma Client   │  │  Multi-Level     │  │  data.gov.rs     │                  │
│  │  (ORM)           │  │  Cache           │  │  Client          │                  │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘                  │
│           │                     │                     │                             │
└───────────┼─────────────────────┼─────────────────────┼─────────────────────────────┘
            │                     │                     │
            ▼                     ▼                     ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                   INTEGRATION LAYER                                 │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐                  │
│  │  PostgreSQL      │  │  IndexedDB       │  │  data.gov.rs     │                  │
│  │  (Production)    │  │  (Browser Cache) │  │  (External API)  │                  │
│  │  SQLite (Dev)    │  │  Memory Cache    │  │                  │                  │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘                  │
│                                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### Component Annotations

| Component       | Technology         | Scaling Strategy    | Failure Mode       | Recovery             |
| --------------- | ------------------ | ------------------- | ------------------ | -------------------- |
| **Next.js App** | Next.js 14         | Horizontal (Vercel) | 502 errors         | Auto-restart         |
| **Charts**      | Recharts + D3      | Client-side         | Render failure     | Fallback to table    |
| **Maps**        | Leaflet            | Client-side         | Tile load failure  | Fallback to static   |
| **API Routes**  | Next.js API        | Horizontal          | 500 errors         | Retry with backoff   |
| **Prisma**      | ORM                | Connection pooling  | Connection timeout | Retry logic          |
| **PostgreSQL**  | 15.x               | Read replicas       | DB unavailable     | Graceful degradation |
| **Cache**       | Memory + IndexedDB | Client-side         | Cache miss         | Network fetch        |
| **data.gov.rs** | External API       | Client cache        | API down           | Cached data          |

---

## 3. Scaling Tiers

### Tier 1: 0-1K Users (Current)

| Component      | Configuration       | Monthly Cost  |
| -------------- | ------------------- | ------------- |
| **Hosting**    | Vercel Pro          | €20           |
| **Database**   | Vercel Postgres     | €0 (included) |
| **CDN**        | Vercel Edge Network | €0 (included) |
| **Monitoring** | Sentry Team         | €26           |
| **Analytics**  | Plausible           | €9            |
| **Total**      |                     | **€55/month** |

**Capacity**: 1,000 MAU, 10,000 page views

### Tier 2: 1K-5K Users

| Component      | Configuration         | Monthly Cost   |
| -------------- | --------------------- | -------------- |
| **Hosting**    | Vercel Pro            | €20            |
| **Database**   | Neon Pro (PostgreSQL) | €19            |
| **Cache**      | Upstash Redis         | €10            |
| **CDN**        | Cloudflare Pro        | €20            |
| **Monitoring** | Sentry Team           | €26            |
| **Analytics**  | Plausible             | €9             |
| **Total**      |                       | **€104/month** |

**Capacity**: 5,000 MAU, 50,000 page views

### Tier 3: 5K-20K Users

| Component      | Configuration           | Monthly Cost   |
| -------------- | ----------------------- | -------------- |
| **Hosting**    | Vercel Enterprise       | €150           |
| **Database**   | Neon Pro + Read Replica | €69            |
| **Cache**      | Upstash Redis Pro       | €50            |
| **CDN**        | Cloudflare Pro          | €20            |
| **Monitoring** | Sentry Business         | €84            |
| **Analytics**  | Plausible               | €9             |
| **Total**      |                         | **€382/month** |

**Capacity**: 20,000 MAU, 200,000 page views

### Tier 4: 20K+ Users

| Component         | Configuration            | Monthly Cost   |
| ----------------- | ------------------------ | -------------- |
| **Hosting**       | Self-hosted (Hetzner)    | €100           |
| **Database**      | PostgreSQL cluster       | €150           |
| **Cache**         | Redis cluster            | €50            |
| **CDN**           | Cloudflare Business      | €200           |
| **Monitoring**    | Self-hosted (Prometheus) | €50            |
| **Load Balancer** | HAProxy                  | €30            |
| **Total**         |                          | **€580/month** |

**Capacity**: 100,000+ MAU, unlimited page views

---

## 4. Monitoring & Observability

### 4.1 Application Monitoring (Sentry)

**Implementation**: Already configured in environment

```typescript
// sentry.client.config.ts
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

**Monitored Metrics**:

- JavaScript errors (client and server)
- Performance traces (page loads, API calls)
- User sessions (replay on error)
- Release health (crash rate by version)

### 4.2 Analytics (Plausible)

**Implementation**: Already integrated

```typescript
// Analytics via @vercel/analytics and Plausible
import { Analytics } from '@vercel/analytics/react';
```

**Tracked Events**:
| Event | Category | Purpose |
|-------|----------|---------|
| `chart_created` | Product | Feature usage |
| `chart_exported` | Product | Export popularity |
| `dataset_loaded` | Data | Dataset usage |
| `sign_up` | Growth | Conversion |
| `subscription_start` | Revenue | MRR tracking |

### 4.3 Performance Monitoring (Web Vitals)

**Implementation**: Built-in Next.js support

```typescript
// app/layout.tsx
export { reportWebVitals } from 'next/web-vitals';
```

**Tracked Metrics**:
| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| LCP (Largest Contentful Paint) | < 2.5s | > 4s |
| FID (First Input Delay) | < 100ms | > 300ms |
| CLS (Cumulative Layout Shift) | < 0.1 | > 0.25 |
| TTFB (Time to First Byte) | < 600ms | > 1.5s |
| INP (Interaction to Next Paint) | < 200ms | > 500ms |

### 4.4 Uptime Monitoring

**Implementation**: Simple health check endpoint

```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
  });
}
```

**Check Frequency**: Every 5 minutes via UptimeRobot (free tier)

### 4.5 Security & Compliance

**GDPR Compliance**:

- No cookies without consent
- Data stored in EU (Vercel/Hetzner)
- User data export available
- Account deletion supported

**Serbian Data Protection**:

- Aligned with Serbian Law on Personal Data Protection
- Option for Serbia-only hosting (Hetzner Belgrade)
- Government procurement compliant

**Security Headers**:

```typescript
// next.config.ts
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=()' },
];
```

---

## 5. Data Model

### Entity Relationship Diagram

```
┌──────────────────┐       ┌──────────────────┐
│       User       │       │   SavedChart     │
├──────────────────┤       ├──────────────────┤
│ id (PK)          │───┐   │ id (PK)          │
│ name             │   │   │ title            │
│ email (unique)   │   │   │ description      │
│ password         │   │   │ config (JSON)    │
│ role             │   │   │ datasetIds (JSON)│
│ createdAt        │   │   │ thumbnail        │
│ updatedAt        │   │   │ chartType        │
└──────────────────┘   │   │ status           │
        │              │   │ views            │
        │              │   │ userId (FK)──────┘
        │              │   │ createdAt        │
        │              │   │ updatedAt        │
        │              │   │ publishedAt      │
        │              │   └──────────────────┘
        │              │
        │              │   ┌──────────────────┐
        │              └───│  Notification    │
        │                  ├──────────────────┤
        │                  │ id (PK)          │
        │                  │ userId (FK)──────┘
        │                  │ type             │
        │                  │ title            │
        │                  │ message          │
        │                  │ read             │
        │                  │ actionUrl        │
        │                  │ createdAt        │
        │                  └──────────────────┘
        │
        │              ┌──────────────────┐
        └──────────────│    Account       │
                       ├──────────────────┤
                       │ id (PK)          │
                       │ userId (FK)      │
                       │ provider         │
                       │ providerAccountId│
                       │ access_token     │
                       │ refresh_token    │
                       └──────────────────┘
```

### Key Indexes

| Table         | Index             | Purpose                 |
| ------------- | ----------------- | ----------------------- |
| charts        | status, createdAt | Dashboard filtering     |
| charts        | userId, status    | User's chart list       |
| charts        | chartType         | Gallery filtering       |
| notifications | userId            | User notification inbox |
| notifications | read              | Unread count            |

---

## 6. Deployment Checklist

### Pre-Deployment

- [ ] Environment variables configured (DATABASE_URL, NEXTAUTH_SECRET, etc.)
- [ ] Database migrations run (`prisma migrate deploy`)
- [ ] Sentry DSN configured
- [ ] Analytics ID configured
- [ ] Domain DNS configured

### Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

### Deployment (Docker)

```bash
# Build image
docker build -t vizuelni-admin .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL=postgresql://... \
  -e NEXTAUTH_SECRET=... \
  vizuelni-admin
```

### Post-Deployment

- [ ] Health check passes (`/api/health`)
- [ ] Authentication works (login flow)
- [ ] Charts render correctly
- [ ] Analytics events firing
- [ ] Error tracking working

---

_Source Documents: [ARCHITECTURE.md](../ARCHITECTURE.md), [package.json](../../package.json), [prisma/schema.prisma](../../prisma/schema.prisma)_

_Last Updated: 2026-03-16_
