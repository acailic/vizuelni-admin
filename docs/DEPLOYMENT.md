# Deployment Guide / Водич за распоређивање

Complete guide to deploying Vizualni Admin to various platforms.

---

## 📋 Table of Contents

- [Before You Deploy](#before-you-deploy)
- [GitHub Pages (Recommended)](#github-pages)
- [Runtime Modes](#runtime-modes)
  - [Static Export (GitHub Pages)](#static-export-github-pages)
  - [Full App (Next.js Server)](#full-app-nextjs-server)
- [Environment Variables](#environment-variables)
  - [Complete Reference](#complete-reference)
  - [Environment Variable Security](#environment-variable-security)
- [Caching Strategy](#caching-strategy)
  - [Multi-Level Cache Architecture](#multi-level-cache-architecture)
  - [L1: Memory Cache](#l1-memory-cache)
  - [L2: IndexedDB Cache](#l2-indexedb-cache)
  - [L3: Network/API Layer](#l3-networkapi-layer)
  - [Cache Promotion Flow](#cache-promotion-flow)
  - [Cache Configuration Defaults](#cache-configuration-defaults)
  - [Cache Usage in Application](#cache-usage-in-application)
  - [Cache Statistics](#cache-statistics)
  - [Deployment Considerations for Caching](#deployment-considerations-for-caching)
  - [Cache Troubleshooting](#cache-troubleshooting)
  - [Browser Storage Constraints](#browser-storage-constraints)
- [Hosting Constraints](#hosting-constraints)
  - [Static Export (GitHub Pages) Constraints](#static-export-github-pages-constraints)
  - [Full App (Server Mode) Constraints](#full-app-server-mode-constraints)
- [Docker Deployment](#docker-deployment)
- [Cloud Platforms](#cloud-platforms)
  - [Vercel](#vercel)
  - [Heroku](#heroku)
  - [AWS (EC2)](#aws-ec2)
  - [Google Cloud Platform (Cloud Run)](#google-cloud-platform-cloud-run)
- [Database Setup](#database-setup)
- [SSL/HTTPS](#sslhttps)
- [Monitoring and Logging](#monitoring-and-logging)
- [Performance Optimization](#performance-optimization)
- [Security Checklist](#security-checklist)
- [Backup Strategy](#backup-strategy)
- [Scaling](#scaling)
- [Troubleshooting](#troubleshooting)
  - [Static Export (GitHub Pages) Issues](#static-export-github-pages-issues)
  - [Full App (Server Mode) Issues](#full-app-server-mode-issues)
  - [Docker-Specific Issues](#docker-specific-issues)
  - [Performance Issues](#performance-issues)
  - [Environment Variable Issues](#environment-variable-issues)
  - [Caching Issues](#caching-issues)
  - [Platform-Specific Issues](#platform-specific-issues)
  - [Getting Help](#getting-help)
- [Support](#support)

---

## Before You Deploy

### Checklist

- [ ] Update `package.json` version
- [ ] Test your build locally: `yarn build`
- [ ] Review environment variables
- [ ] Check responsive design
- [ ] Test all interactive features

### Build Commands

```bash
# Standard build
yarn build

# Static export (for GitHub Pages)
NEXT_PUBLIC_BASE_PATH=/your-repo-name yarn build:static

# Optimized build
yarn build:optimized

# Build for production with analysis
yarn build:analyze
```

---

## GitHub Pages (Recommended) / GitHub Pages (Препоручено)

### Automatic Deployment (Easiest)

1. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` and `/ (root)`
   - Save

2. **Push to Main**

   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

3. **Wait for Deployment**
   - GitHub Actions will automatically build and deploy
   - Visit: `https://username.github.io/vizualni-admin/`

### Manual Deployment

```bash
# Build for GitHub Pages
NEXT_PUBLIC_BASE_PATH=/vizualni-admin yarn build:gh-pages

# Deploy using gh-pages CLI
npm install -g gh-pages
cd app/out
gh-pages -d . -b gh-pages
```

### Local Testing for GitHub Pages

```bash
# Build and serve locally
yarn build:gh-pages-local
yarn serve:gh-pages

# Visit http://localhost:3000/vizualni-admin/
```

---

## Runtime Modes

### Static Export (GitHub Pages)

In static export mode, the application is pre-rendered at build time and
deployed as static HTML/CSS/JS files. This mode is used for GitHub Pages
deployment.

**Constraints:**

- No API routes or server-side functionality
- No database-backed features (PostgreSQL/Prisma not available)
- No GraphQL API endpoints
- Client-side data fetching only
- No server-side authentication
- Static asset serving only

**Available Features:**

- All chart visualizations (D3-based)
- Client-side data fetching from data.gov.rs API
- Multi-level caching (L1 memory + L2 IndexedDB)
- All UI components and demos
- Localization (sr/en)
- Export functionality

**Environment Variables:**

```bash
# Required for static export
NODE_ENV=production
NEXT_PUBLIC_BASE_PATH=/vizualni-admin  # GitHub Pages repository name
NEXT_TELEMETRY_DISABLED=1
STORYBOOK_DISABLE_TELEMETRY=1

# App Configuration (optional, has defaults)
NEXT_PUBLIC_APP_NAME=Vizualni Admin
NEXT_PUBLIC_DEFAULT_LOCALE=sr
NEXT_PUBLIC_SUPPORTED_LOCALES=sr,en

# Feature Flags (optional)
NEXT_PUBLIC_ENABLE_MAPS=true          # Enable/disable map features
NEXT_PUBLIC_ENABLE_EXPORT=true        # Enable/disable export functionality

# External APIs (optional)
DATA_GOV_RS_API_URL=https://data.gov.rs/api/1
DATA_GOV_RS_API_KEY=                  # API key for write operations (optional)
NEXT_PUBLIC_MAPTILER_STYLE_KEY=       # Maptiler API key (optional)

# SEO (optional)
PREVENT_SEARCH_BOTS=false             # Set to true to prevent indexing
```

### Full App (Next.js Server)

In full app mode, the application runs on a Next.js server with full server-side
capabilities.

**Capabilities:**

- API routes and server-side rendering
- GraphQL API with Apollo Server
- PostgreSQL database via Prisma
- Server-side authentication (NextAuth.js)
- SPARQL endpoint integration
- All static export features plus server-side features

**Environment Variables:**

```bash
# Required for production
NODE_ENV=production

# Server Configuration
PORT=3000                             # Server port (default: 3000)

# App Configuration
NEXT_PUBLIC_APP_NAME=Vizualni Admin
NEXT_PUBLIC_DEFAULT_LOCALE=sr
NEXT_PUBLIC_SUPPORTED_LOCALES=sr,en

# Database (required for full app mode)
DATABASE_URL=postgres://user:pass@host:5432/vizualni_admin

# Authentication (required for production)
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-secret-key-here  # Generate with: openssl rand -base64 32

# ADFS Authentication (optional)
ADFS_ISSUER=https://adfs.example.com
ADFS_ID=your-client-id
ADFS_SECRET=your-client-secret
ADFS_PROFILE_URL=https://profile.example.com

# GraphQL & SPARQL Endpoints
NEXT_PUBLIC_ENDPOINT=http://localhost:8870/sparql
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:4000/graphql
WHITELISTED_DATA_SOURCES=["Prod","Prod-uncached","Int","Int-uncached","Test","Test-uncached"]

# External APIs
DATA_GOV_RS_API_URL=https://data.gov.rs/api/1
DATA_GOV_RS_API_KEY=your-api-key      # For write operations

# Maps
NEXT_PUBLIC_MAPTILER_STYLE_KEY=your-maptiler-key
NEXT_PUBLIC_VECTOR_TILE_URL=https://world.vectortiles.geo.admin.ch

# Feature Flags
NEXT_PUBLIC_ENABLE_MAPS=true
NEXT_PUBLIC_ENABLE_EXPORT=true

# SEO
PREVENT_SEARCH_BOTS=false

# Telemetry
NEXT_TELEMETRY_DISABLED=1
STORYBOOK_DISABLE_TELEMETRY=1

# Monitoring (optional)
SENTRY_DSN=your-sentry-dsn            # Error tracking
SENTRY_IGNORE_API_RESOLUTION_ERROR=1
```

## Environment Variables

### Complete Reference

#### Required for Static Export (GitHub Pages)

```bash
NODE_ENV=production
NEXT_PUBLIC_BASE_PATH=/vizualni-admin  # Must match repository name
```

#### Required for Full App (Server Mode)

```bash
NODE_ENV=production
DATABASE_URL=postgres://user:pass@host:5432/vizualni_admin
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-secret-key-here
```

#### Optional Variables

**Application Configuration:**

- `NEXT_PUBLIC_APP_NAME` - Application name (default: "Vizualni Admin")
- `NEXT_PUBLIC_DEFAULT_LOCALE` - Default locale code (default: "sr")
- `NEXT_PUBLIC_SUPPORTED_LOCALES` - Comma-separated locales (default: "sr,en")
- `PORT` - Server port for full app mode (default: 3000)

**API Endpoints:**

- `DATA_GOV_RS_API_URL` - Serbian Open Data Portal API (default:
  https://data.gov.rs/api/1)
- `DATA_GOV_RS_API_KEY` - API key for write operations to data.gov.rs
- `NEXT_PUBLIC_ENDPOINT` - SPARQL endpoint for RDF queries (default:
  http://localhost:8870/sparql)
- `NEXT_PUBLIC_GRAPHQL_ENDPOINT` - GraphQL API endpoint (default:
  http://localhost:4000/graphql)
- `WHITELISTED_DATA_SOURCES` - JSON array of allowed data sources (default:
  ["Prod"])

**Maps & Visualization:**

- `NEXT_PUBLIC_MAPTILER_STYLE_KEY` - Maptiler API key for map tiles
- `NEXT_PUBLIC_VECTOR_TILE_URL` - Vector tile server URL
- `NEXT_PUBLIC_ENABLE_MAPS` - Enable/disable map features (default: true)
- `NEXT_PUBLIC_ENABLE_EXPORT` - Enable/disable export functionality (default:
  true)

**Authentication:**

- `NEXTAUTH_URL` - Canonical URL of your NextAuth.js deployment
- `NEXTAUTH_SECRET` - Secret key for NextAuth.js session encryption
- `ADFS_ISSUER` - ADFS server URL for enterprise authentication
- `ADFS_ID` - ADFS client ID
- `ADFS_SECRET` - ADFS client secret
- `ADFS_PROFILE_URL` - ADFS user profile URL

**SEO & Metadata:**

- `PREVENT_SEARCH_BOTS` - Prevent search engine indexing (default: false)

**Telemetry:**

- `NEXT_TELEMETRY_DISABLED` - Disable Next.js telemetry (recommended: 1)
- `STORYBOOK_DISABLE_TELEMETRY` - Disable Storybook telemetry (recommended: 1)

**Monitoring (Optional):**

- `SENTRY_DSN` - Sentry DSN for error tracking
- `SENTRY_IGNORE_API_RESOLUTION_ERROR` - Ignore API resolution errors in Sentry

### Environment Variable Security

**Best Practices:**

1. Never commit `.env` files to version control
2. Use different values for development, staging, and production
3. Rotate secrets regularly
4. Use `openssl rand -base64 32` to generate secure `NEXTAUTH_SECRET`
5. Store secrets in platform-specific secret managers (GitHub Secrets, AWS
   Secrets Manager, etc.)

**Platform-Specific Setup:**

- **GitHub Pages**: Use repository secrets in GitHub Actions
- **Vercel**: Use environment variables in project settings
- **Docker**: Pass secrets via `docker run -e` or docker-compose secrets
- **AWS**: Use AWS Secrets Manager or Parameter Store
- **Heroku**: Use `heroku config:set`

## Caching Strategy

### Multi-Level Cache Architecture

The application implements a three-tier caching strategy to optimize performance
and reduce API calls:

```
User Request → L1 (Memory) → L2 (IndexedDB) → L3 (Network/API)
```

### L1: Memory Cache

**Storage:** JavaScript `Map` object in browser memory

**Configuration:**

- **Max Size:** 50MB (`CACHE_CONFIG.L1_MAX_SIZE`)
- **Max Entries:** 1,000 entries (`CACHE_CONFIG.L1_MAX_ENTRIES`)
- **Default TTL:** 5 minutes (`CACHE_CONFIG.DEFAULT_TTL`)

**Eviction Policy:**

- LRU (Least Recently Used) with hit tracking
- Entries sorted by (hits ASC, timestamp ASC)
- Least-recently-used entries with fewest hits are evicted first
- Automatic eviction when size limit is exceeded

**Behavior:**

- Fastest cache layer (in-memory access)
- Entries expire after `timestamp + ttl` milliseconds
- Expired entries removed on access (not proactively)
- Memory reclaimed when expired entries are accessed

**Use Cases:**

- Frequently accessed datasets
- Chart configurations
- User session data

### L2: IndexedDB Cache

**Storage:** Browser's IndexedDB persistent storage

**Configuration:**

- **Database Name:** `vizualni-admin-multi-cache`
- **Object Store:** `cache` (keyPath: `key`)
- **Max Size:** 200MB (`CACHE_CONFIG.L2_MAX_SIZE`)
- **Max Entries:** 10,000 entries (`CACHE_CONFIG.L2_MAX_ENTRIES`)

**Data Structure:**

```typescript
{
  key: string,      // Cache key
  data: any,        // Cached data
  timestamp: number, // Creation timestamp
  ttl: number       // Time-to-live in milliseconds
}
```

**Behavior:**

- Persists across browser sessions
- Same TTL-based expiration as L1
- Expired entries return `null` on retrieval
- No automatic cleanup of expired entries
- Silent error handling (falls back to network on failure)

**Use Cases:**

- Large datasets that don't fit in memory
- Data that should persist across sessions
- API responses from external sources

### L3: Network/API Layer

**Storage:** Remote data sources

**Endpoints:**

- `DATA_GOV_RS_API_URL` - Serbian Open Data Portal API
- `NEXT_PUBLIC_ENDPOINT` - SPARQL endpoint for RDF queries
- `NEXT_PUBLIC_GRAPHQL_ENDPOINT` - GraphQL API endpoint

**Behavior:**

- Slowest layer (network latency)
- Responses stored in both L1 and L2 after fetch
- Automatic cache promotion (L2 → L1) on cache hit

### Cache Promotion Flow

When data is retrieved from L2 (IndexedDB):

1. Data is retrieved from IndexedDB
2. TTL is checked (expired entries return `null`)
3. Valid data is promoted to L1 memory cache
4. Statistics record both L2 hit and subsequent L1 hit

### Cache Configuration Defaults

**Implementation:**
`/home/nistrator/Documents/github/vizualni-admin/app/lib/cache/cache-config.ts`

```typescript
const CACHE_CONFIG = {
  // Size limits
  L1_MAX_SIZE: 50 * 1024 * 1024, // 50MB
  L1_MAX_ENTRIES: 1000,
  L2_MAX_SIZE: 200 * 1024 * 1024, // 200MB
  L2_MAX_ENTRIES: 10000,

  // TTL presets
  DEFAULT_TTL: 5 * 60 * 1000, // 5 minutes
  SHORT_TTL: 1 * 60 * 1000, // 1 minute
  LONG_TTL: 60 * 60 * 1000, // 1 hour

  // Performance tuning
  CHUNK_SIZE: 5000, // Records per chunk
  MAX_CONCURRENT_LOADS: 3, // Parallel fetch limit
  MAX_MEMORY: 500 * 1024 * 1024, // 500MB total memory
  WARNING_THRESHOLD: 0.8, // 80% warning threshold
};
```

### Cache Usage in Application

**useDataCache Hook** **Implementation:**
`/home/nistrator/Documents/github/vizualni-admin/app/hooks/use-data-cache.ts`

**Features:**

- Per-key caching with configurable TTL
- Memory and IndexedDB layer control
- Cache invalidation and manual cache setting
- Callbacks for cache hits/misses
- Loading and error states

**API:**

```typescript
const { data, loading, error, fromCache, cacheSource,
        invalidate, setCache, clearCache } = useDataCache(
  fetcher: () => Promise<T>,
  options: {
    key: string,                     // Unique cache key
    ttl?: number,                    // Default: 5 minutes
    useIndexedDB?: boolean,          // Default: true
    useMemory?: boolean,             // Default: true
    forceRefresh?: boolean,          // Default: false
    onCacheHit?: (source) => void,   // Callback on cache hit
    onCacheMiss?: () => void         // Callback on cache miss
  }
);
```

**Cache Priority:**

1. Check L1 memory cache (if `useMemory: true`)
2. Check L2 IndexedDB cache (if `useIndexedDB: true`)
3. Fetch from network using `fetcher`
4. Store result in enabled cache layers

### Cache Statistics

**MultiLevelCache Stats:**

```typescript
{
  l1: { hits, misses, size, entries },
  l2: { hits, misses, entries },
  l3: { hits },
  totalHits,
  totalMisses,
  hitRate  // Percentage: (hits / total) * 100
}
```

**useDataCache Stats:**

```typescript
{
  (memoryEntries, // Number of entries in memory cache
    memorySize, // Current memory usage in bytes
    memoryLimit, // 50MB limit
    memoryUsagePercent); // (size / limit) * 100
}
```

### Deployment Considerations for Caching

**Static Export (GitHub Pages):**

- All caching is client-side (browser-based)
- No server-side caching available
- IndexedDB cache persists across sessions
- Memory cache resets on page reload
- No cache warming or pre-population

**Full App (Server Mode):**

- Client-side caching still applies
- Additional server-side caching possible (not implemented yet)
- Can implement Redis or similar for server-side caching
- Database query caching available via Prisma

### Cache Troubleshooting

**High Memory Usage:**

- Reduce `L1_MAX_SIZE` in cache config
- Reduce `DEFAULT_TTL` to expire entries faster
- Implement manual cache clearing for large datasets

**Stale Data:**

- Reduce TTL for frequently changing data
- Use `forceRefresh: true` in `useDataCache` hook
- Implement manual cache invalidation on data updates

**IndexedDB Errors:**

- IndexedDB errors are silently caught
- Application falls back to network fetch
- Check browser compatibility (IndexedDB requires modern browser)
- Ensure sufficient browser storage quota

**Cache Misses:**

- Check cache key consistency
- Verify TTL is not too short
- Ensure cache layers are enabled (L1/L2)
- Check browser console for cache statistics

### Browser Storage Constraints

**IndexedDB Limits:**

- Chrome/Edge: ~60% of free disk space
- Firefox: ~50% of free disk space
- Safari: ~1GB (may prompt user for permission)
- Mobile browsers: Varies widely

**Mitigation Strategies:**

- Implement graceful degradation when storage quota exceeded
- Use LRU eviction to manage cache size
- Provide user feedback for storage errors
- Fallback to network-only mode if needed

## Hosting Constraints

### Static Export (GitHub Pages) Constraints

**Technical Limitations:**

- No server-side rendering (SSR)
- No API routes or server-side endpoints
- No server-side authentication
- No database connectivity
- No GraphQL API (Apollo Server requires Node.js runtime)
- No server-side file operations

**Build Constraints:**

- Must use `output: "export"` in Next.js config
- `NEXT_PUBLIC_BASE_PATH` must match repository name
- `trailingSlash: true` required for proper routing
- `images.unoptimized: true` required (no Next.js Image Optimization API)
- Static export only works in production mode

**Deployment Constraints:**

- Automatic deployment on push to `main` branch
- Build time: ~5-10 minutes (depending on GitHub Actions queue)
- No custom domain SSL (uses GitHub Pages SSL)
- Limited to GitHub Pages infrastructure
- No server-side environment variables at runtime

**Feature Availability:** | Feature | Available | Notes |
|---------|-----------|-------| | Chart visualizations | ✅ | All D3-based
charts work | | Client-side data fetching | ✅ | data.gov.rs API integration | |
Multi-level caching | ✅ | L1 memory + L2 IndexedDB | | Localization | ✅ |
sr/en locales supported | | Export functionality | ✅ | PNG/SVG export works | |
Maps | ⚠️ | Requires Maptiler API key | | API routes | ❌ | Server-side only | |
Database features | ❌ | Server-side only | | GraphQL API | ❌ | Server-side
only | | Authentication | ❌ | Server-side only |

### Full App (Server Mode) Constraints

**Server Requirements:**

- Node.js 18+ (as specified in package.json)
- PostgreSQL database (for full features)
- Minimum 512MB RAM (1GB recommended)
- Minimum 1GB disk space (2GB recommended)

**Network Requirements:**

- External API access (data.gov.rs, SPARQL endpoints)
- HTTPS for production (required for NextAuth.js)
- CORS configuration for cross-origin requests

**Scaling Considerations:**

- Horizontal scaling requires shared session storage (Redis)
- Database connection pooling recommended for high traffic
- CDN recommended for static assets (images, fonts, JS/CSS)
- Load balancer required for multi-instance deployments

**Feature Availability:** | Feature | Available | Notes |
|---------|-----------|-------| | Chart visualizations | ✅ | All D3-based
charts | | Client-side data fetching | ✅ | data.gov.rs API integration | |
Multi-level caching | ✅ | L1 memory + L2 IndexedDB | | Localization | ✅ |
sr/en locales | | Export functionality | ✅ | PNG/SVG export | | Maps | ✅ |
Requires Maptiler API key | | API routes | ✅ | Full Next.js API routes | |
Database features | ✅ | PostgreSQL via Prisma | | GraphQL API | ✅ | Apollo
Server | | Authentication | ✅ | NextAuth.js + ADFS |

## Docker Deployment

### Build the Image

```bash
docker build -t vizualni-admin:latest .
```

### Run the Container

```bash
docker run -d \
  --name vizualni-admin \
  -p 3000:3000 \
  -e DATABASE_URL="postgres://user:pass@host:5432/db" \
  -e NEXTAUTH_SECRET="your-secret-here" \
  -e NEXTAUTH_URL="https://your-domain.com" \
  vizualni-admin:latest
```

### Docker Compose

Create a `docker-compose.production.yml`:

```yaml
version: "3.8"

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgres://postgres:password@db:5432/vizualni_admin
      NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
      NEXTAUTH_URL: ${NEXTAUTH_URL}
      DATA_GOV_RS_API_KEY: ${DATA_GOV_RS_API_KEY}
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: vizualni_admin
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    restart: unless-stopped

volumes:
  postgres_data:
```

Deploy:

```bash
docker-compose -f docker-compose.production.yml up -d
```

## Cloud Platforms

### Vercel

1. Install Vercel CLI:

   ```bash
   npm i -g vercel
   ```

2. Deploy:

   ```bash
   vercel
   ```

3. Set environment variables in Vercel dashboard

4. Connect PostgreSQL database (use Vercel Postgres or external provider)

### Heroku

1. Create a new Heroku app:

   ```bash
   heroku create vizualni-admin
   ```

2. Add PostgreSQL addon:

   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

3. Set environment variables:

   ```bash
   heroku config:set NEXTAUTH_SECRET="your-secret"
   heroku config:set NEXTAUTH_URL="https://your-app.herokuapp.com"
   ```

4. Deploy:
   ```bash
   git push heroku main
   ```

### AWS (EC2)

1. Launch an EC2 instance (Ubuntu 22.04 recommended)

2. Install dependencies:

   ```bash
   sudo apt update
   sudo apt install -y nodejs npm postgresql
   npm install -g yarn pm2
   ```

3. Clone and build:

   ```bash
   git clone https://github.com/acailic/vizualni-admin.git
   cd vizualni-admin
   yarn install
   yarn build
   ```

4. Start with PM2:

   ```bash
   pm2 start yarn --name "vizualni-admin" -- start
   pm2 save
   pm2 startup
   ```

5. Set up Nginx reverse proxy (optional)

### Google Cloud Platform (Cloud Run)

1. Build and push to Container Registry:

   ```bash
   gcloud builds submit --tag gcr.io/PROJECT_ID/vizualni-admin
   ```

2. Deploy to Cloud Run:

   ```bash
   gcloud run deploy vizualni-admin \
     --image gcr.io/PROJECT_ID/vizualni-admin \
     --platform managed \
     --region europe-west1 \
     --allow-unauthenticated
   ```

3. Add Cloud SQL PostgreSQL database

4. Set environment variables in Cloud Run console

## Database Setup

### PostgreSQL on Production

1. Create database:

   ```sql
   CREATE DATABASE vizualni_admin;
   CREATE USER vizualni_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE vizualni_admin TO vizualni_user;
   ```

2. Run migrations:
   ```bash
   yarn db:migrate
   ```

### Managed PostgreSQL Services

Consider using managed services:

- **Heroku Postgres** - Easy setup, good for small-medium apps
- **AWS RDS** - Scalable, enterprise-grade
- **Google Cloud SQL** - Integrated with GCP
- **DigitalOcean Managed Databases** - Simple and affordable
- **Supabase** - Modern, open-source alternative

## SSL/HTTPS

### Let's Encrypt with Nginx

1. Install Certbot:

   ```bash
   sudo apt install certbot python3-certbot-nginx
   ```

2. Obtain certificate:

   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

3. Auto-renewal:
   ```bash
   sudo certbot renew --dry-run
   ```

## Monitoring and Logging

### Application Monitoring

Consider these services:

- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **New Relic** - Performance monitoring
- **DataDog** - Infrastructure monitoring

### Log Management

- **Docker logs**: `docker logs vizualni-admin`
- **PM2 logs**: `pm2 logs vizualni-admin`
- **Cloud platform logs**: Use platform-specific logging

## Performance Optimization

### Caching

1. Enable Redis for caching:

   ```env
   REDIS_URL=redis://localhost:6379
   ```

2. Configure CDN for static assets (CloudFlare, AWS CloudFront)

### Build Optimization

```bash
# Analyze bundle size
yarn build
npx @next/bundle-analyzer
```

## Security Checklist

- [ ] Use strong `NEXTAUTH_SECRET`
- [ ] Enable HTTPS in production
- [ ] Set `NODE_ENV=production`
- [ ] Restrict database access
- [ ] Enable rate limiting
- [ ] Keep dependencies updated
- [ ] Use environment variables for secrets
- [ ] Enable CORS only for trusted domains
- [ ] Regular security audits

## Backup Strategy

### Database Backups

1. Automated PostgreSQL backups:

   ```bash
   pg_dump -U vizualni_user vizualni_admin > backup_$(date +%Y%m%d).sql
   ```

2. Schedule with cron:
   ```
   0 2 * * * /path/to/backup-script.sh
   ```

### Configuration Backups

- Keep `.env` files in secure, encrypted storage
- Document all environment variables
- Maintain infrastructure-as-code (Terraform, CloudFormation)

## Scaling

### Horizontal Scaling

- Deploy multiple app instances behind a load balancer
- Use stateless sessions (database-backed sessions)
- Share Redis instance across app instances

### Vertical Scaling

- Increase server resources (CPU, RAM)
- Optimize PostgreSQL configuration
- Use database connection pooling (PgBouncer)

## Troubleshooting

### Static Export (GitHub Pages) Issues

**Build Fails in GitHub Actions:**

**Symptom:** Workflow fails during build step **Solutions:**

- Check Node.js version (must be 18+, currently using 22)
- Verify yarn.lock is committed and up-to-date
- Ensure all dependencies are available in registry
- Check for environment variable issues in workflow file

**404 Errors After Deployment:**

**Symptom:** Pages return 404 when navigating **Solutions:**

- Verify `NEXT_PUBLIC_BASE_PATH` matches repository name
- Check that `trailingSlash: true` is set in next.config.js
- Ensure `output: "export"` is set for production builds
- Verify all pages are included in build output

**Images Not Loading:**

**Symptom:** Image assets return 404 or fail to load **Solutions:**

- Confirm `images.unoptimized: true` in next.config.js (required for static
  export)
- Check image paths are relative to base path
- Verify images are in `app/public/` directory
- Use `<Image>` component with `unoptimized` prop or standard `<img>` tags

**Environment Variables Not Working:**

**Symptom:** Features that depend on env vars don't work **Solutions:**

- Remember only `NEXT_PUBLIC_*` variables are available in browser
- Server-side variables don't work in static export
- Add required variables to GitHub Actions workflow
- Rebuild and redeploy after changing env vars

**Large Bundle Size:**

**Symptom:** Slow initial page load **Solutions:**

- Run `yarn build:analyze` to identify large dependencies
- Use dynamic imports for code splitting
- Remove unused dependencies
- Enable gzip/brotli compression (automatic on GitHub Pages)

### Full App (Server Mode) Issues

**Database Connection Errors:**

**Symptom:** `Error: connect ECONNREFUSED` or similar **Solutions:**

- Verify `DATABASE_URL` is correct and includes password
- Check PostgreSQL is running and accessible
- Verify firewall rules allow connections
- Ensure database exists and user has permissions
- Test connection: `psql $DATABASE_URL`

**Authentication Fails:**

**Symptom:** NextAuth.js redirects or errors **Solutions:**

- Verify `NEXTAUTH_URL` matches deployment domain (include protocol)
- Ensure `NEXTAUTH_SECRET` is set and consistent
- Check HTTPS is enabled (required for production auth)
- Verify callback URLs in OAuth provider settings
- Check for cookie domain mismatches

**API Routes Return 404:**

**Symptom:** `/api/*` endpoints return 404 **Solutions:**

- Verify deployment is not static export mode
- Check API files are in `app/pages/api/` directory
- Ensure `output: "export"` is NOT set
- Restart server after adding new routes

**Memory Leaks:**

**Symptom:** Server memory usage increases over time **Solutions:**

- Monitor with `node --inspect` and Chrome DevTools
- Check for unclosed database connections
- Verify cache eviction is working (L1/L2)
- Implement connection pooling for database
- Set up automatic restarts (PM2, Docker restart policy)

**Slow API Response Times:**

**Symptom:** API endpoints take >5 seconds to respond **Solutions:**

- Enable database query logging to identify slow queries
- Add database indexes on frequently queried columns
- Implement response caching where appropriate
- Use CDN for static assets
- Enable compression (gzip/brotli)
- Consider horizontal scaling with load balancer

### Docker-Specific Issues

**Container Exits Immediately:**

**Symptom:** Docker container starts then exits **Solutions:**

- Check logs: `docker logs vizualni-admin`
- Verify environment variables are passed correctly
- Ensure port 3000 is not already in use
- Check HEALTHCHECK configuration in Dockerfile
- Verify database is accessible from container

**Permission Errors:**

**Symptom:** EACCES or EPERM errors in logs **Solutions:**

- Check file permissions in mounted volumes
- Run container with appropriate user (not root)
- Verify database socket permissions
- Check write permissions for cache directories

### Performance Issues

**High CPU Usage:**

**Solutions:**

- Profile with `npm run build:analyze`
- Optimize large data processing operations
- Implement pagination for large datasets
- Use Web Workers for CPU-intensive tasks
- Cache expensive computations

**Slow Initial Load:**

**Solutions:**

- Implement code splitting with dynamic imports
- Lazy load routes and components
- Optimize bundle size (remove unused dependencies)
- Use CDN for static assets
- Enable compression (gzip/brotli)
- Implement service worker for caching

**Memory Issues:**

**Solutions:**

- Reduce L1 cache size in cache config
- Implement data pagination
- Use streaming for large datasets
- Clear IndexedDB cache periodically
- Monitor memory usage with browser DevTools

### Environment Variable Issues

**Variables Not Available:**

**Solutions:**

- Verify variable names match exactly (case-sensitive)
- For browser access, use `NEXT_PUBLIC_*` prefix
- Rebuild after changing environment variables
- Check platform-specific env var configuration
- Verify no trailing whitespace in values

**Next.js Build Errors:**

**Symptom:** Build fails with "Module not found" or similar **Solutions:**

- Clear Next.js cache: `rm -rf app/.next`
- Clear node_modules and reinstall: `rm -rf node_modules && yarn install`
- Check for missing dependencies in package.json
- Verify Node.js version matches requirements
- Check for circular dependencies

### Caching Issues

**Stale Data Displayed:**

**Solutions:**

- Reduce cache TTL in cache config
- Implement cache invalidation on data updates
- Use `forceRefresh: true` in `useDataCache` hook
- Clear browser cache and IndexedDB
- Implement cache warming for critical data

**Cache Not Working:**

**Solutions:**

- Check browser console for cache statistics
- Verify IndexedDB is enabled in browser
- Check for browser storage quota issues
- Ensure cache layers are enabled (L1/L2)
- Verify cache keys are consistent

**High Memory Usage from Cache:**

**Solutions:**

- Reduce `L1_MAX_SIZE` in cache config
- Reduce `DEFAULT_TTL` to expire entries faster
- Implement manual cache clearing for large datasets
- Monitor cache hit rates to adjust sizing
- Consider disabling L2 cache for large datasets

### Platform-Specific Issues

**Vercel Deployment:**

**Common Issues:**

- Function execution timeout (max 10 seconds on free tier)
- Build fails due to missing environment variables
- API routes timeout

**Solutions:**

- Optimize slow operations
- Add environment variables in project settings
- Implement incremental static regeneration (ISR)
- Use edge functions for faster response

**Heroku Deployment:**

**Common Issues:**

- Application crashes due to memory limits
- Database connection errors
- Slow startup times

**Solutions:**

- Upgrade to paid tier for more RAM
- Verify DATABASE_URL is set correctly
- Implement health checks for proper startup
- Use Heroku Redis for session storage

**AWS Deployment:**

**Common Issues:**

- Load balancer health check failures
- Database connection timeouts
- High EC2 costs

**Solutions:**

- Configure proper health check endpoints
- Use RDS for managed database
- Implement auto-scaling groups
- Use reserved instances for cost savings

### Getting Help

**Before Asking for Help:**

1. Check logs (browser console, server logs, Docker logs)
2. Verify environment variables are set correctly
3. Check GitHub Issues for similar problems
4. Review this troubleshooting guide
5. Test in local environment first

**Useful Resources:**

- Next.js Documentation: https://nextjs.org/docs
- GitHub Issues: https://github.com/acailic/vizualni-admin/issues
- Project Documentation: `/home/nistrator/Documents/github/vizualni-admin/docs/`

**Information to Include When Asking for Help:**

- Deployment platform (GitHub Pages, Vercel, Docker, etc.)
- Runtime mode (static export or full app)
- Error messages and stack traces
- Relevant environment variables (sanitized)
- Steps to reproduce the issue
- Browser and Node.js versions

## Support

For deployment issues:

- Check [GitHub Issues](https://github.com/acailic/vizualni-admin/issues)
- Review [documentation](README.md)
- Contact the maintainers
