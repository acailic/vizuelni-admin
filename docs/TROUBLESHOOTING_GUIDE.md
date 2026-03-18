# Troubleshooting Guide

> **Водич за решавање problema** | Complete error resolution guide

This guide helps you diagnose and fix common issues when working with Vizuelni Admin Srbije.

---

## Quick Reference

| Error Type           | Common Cause     | Quick Fix           |
| -------------------- | ---------------- | ------------------- |
| 403 from data.gov.rs | Rate limit       | Enable caching      |
| CSV parse error      | Encoding issue   | Use UTF-8           |
| Region not found     | Name mismatch    | Normalize names     |
| Chart not rendering  | Zero height      | Add explicit height |
| PDF font error       | Missing Cyrillic | Register fonts      |
| Session expired      | Token timeout    | Extend maxAge       |

---

## Data Source Errors

### Error: Failed to fetch from data.gov.rs (403)

**Cause:** Rate limit exceeded on data.gov.rs API.

**Solution:**

```typescript
// .env.local
API_CACHE_ENABLED = true;
API_CACHE_TTL = 600; // 10 minutes

// Or implement exponential backoff
import { DataGovClient } from '@/lib/api/datagov-client';

const client = new DataGovClient({
  retryAttempts: 5,
  retryDelay: 1000,
  timeout: 30000,
});
```

---

### Error: CSV parsing failed - malformed data

**Cause:** Inconsistent columns or encoding issues.

**Solution:**

```typescript
import { parseCSV } from '@/lib/parsers/csv-parser';

const result = await parseCSV(file, {
  skipEmptyLines: true,
  encoding: 'utf-8',
  onRowError: (error, row) => {
    console.warn(`Row ${row}: ${error.message}`);
    return 'skip';
  },
});
```

**Common CSV Issues:**

| Issue              | Symptom                     | Fix                         |
| ------------------ | --------------------------- | --------------------------- |
| BOM header         | Weird chars in first column | Use `encoding: 'utf-8-bom'` |
| Mixed delimiters   | Random parsing errors       | Specify `delimiter: ';'`    |
| Serbian characters | Garbled č, ć, š, ž, đ       | Ensure UTF-8 encoding       |

---

### Error: Region name not found

**Cause:** Region name doesn't match standardized naming.

**Solution:**

```typescript
import { RegionMatcher } from '@/lib/geo/region-matcher';

const matcher = new RegionMatcher('sr-Cyrl');
const normalized = matcher.normalize('Београд');
// Returns: 'beograd'

// Fuzzy matching for approximate names
const match = matcher.fuzzyMatch('Beograde', { threshold: 0.8 });
// Returns: { key: 'beograd', confidence: 0.95 }
```

---

### Error: data.gov.rs timeout

**Diagnostic:**

```bash
curl -I https://data.gov.rs/api/1/
nslookup data.gov.rs
```

**Solution:**

```typescript
const client = new DataGovClient({
  timeout: 60000, // 60 seconds
});
```

---

## Authentication & Authorization

### Error: Session expired

**Solution:**

```typescript
// auth-options.ts
export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 90, // 90 days
  },
};
```

---

### Error: 403 Forbidden

**Debug:**

```typescript
const session = await getServerSession(authOptions);
console.log('User role:', session?.user?.role);
```

**Role Hierarchy:**

| Role     | Permissions                                |
| -------- | ------------------------------------------ |
| `user`   | View public charts, create personal charts |
| `editor` | All user + edit shared charts              |
| `admin`  | Full access                                |

---

### Error: OAuth callback failed

**Check:**

```bash
# .env.local must match OAuth provider settings
NEXTAUTH_URL=http://localhost:3000

# Required env vars
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
```

---

## Chart Rendering Issues

### Error: Chart container has zero height

**Solution:**

```tsx
// ✅ Explicit height
<div className="h-[400px]">
  <LineChart data={data} />
</div>

// ✅ Aspect ratio
<div className="aspect-[16/9] w-full">
  <LineChart data={data} />
</div>
```

---

### Error: Invalid data format

**Fix by Chart Type:**

```typescript
// LineChart
const lineData = [
  { x: '2024-01', y: 100 },
  { x: '2024-02', y: 150 },
];

// BarChart
const barData = [
  { category: 'Beograd', value: 1.4 },
  { category: 'Novi Sad', value: 0.3 },
];

// PieChart
const pieData = [
  { name: 'Budget', value: 45 },
  { name: 'Education', value: 30 },
];
```

---

### Warning: Performance degraded with 10,000+ points

**Solutions:**

```typescript
// Aggregation
import { aggregateData } from '@/lib/charts/aggregation';
const aggregated = aggregateData(rawData, {
  method: 'avg',
  bucketSize: 100,
});

// Sampling
import { sampleData } from '@/lib/charts/sampling';
const sampled = sampleData(rawData, {
  method: 'lttb',
  maxPoints: 1000,
});
```

---

## Geographic Data Problems

### Error: GeoJSON for Kosovo not available

**Disclaimer:**

> ⚠️ **Ограничење података**
> Some visualizations may not include Kosovo and Metohija data due to availability constraints. This is not a political statement.

**Workaround:**

```typescript
const serbiaOnly = await getGeoData({
  exclude: ['kosovo-metohija'],
  fallbackToNationalAverage: true,
});
```

---

### Error: Region boundary mismatch

**Solution:**

```bash
npm run update-geo-data
```

---

## Export & PDF Issues

### Error: PDF font not found

**Solution:**

```typescript
import { registerFonts } from '@/lib/export/pdf-fonts';

await registerFonts({
  latin: '/fonts/Inter-Regular.ttf',
  cyrillic: '/fonts/Inter-Cyrillic.ttf',
});
```

---

### Error: Export timeout

**Solutions:**

```typescript
const pdf = await exportToPDF(chart, {
  timeout: 120000,
  quality: 'medium',
  rasterizeCharts: true,
  dpi: 150,
});
```

---

## Performance Problems

### Warning: Page load exceeds 3 seconds

**Solutions:**

```tsx
// Lazy load
const HeavyChart = dynamic(() => import('@/components/charts/HeavyChart'), {
  loading: () => <ChartSkeleton />,
});
```

```typescript
// Tree shake
import debounce from 'lodash/debounce'; // ✅
// NOT: import _ from 'lodash'; // ❌
```

---

### Error: Memory exceeds 512MB

**Solution:**

```typescript
import { parseCSVStream } from '@/lib/parsers/csv-stream';

const data = await parseCSVStream(largeFile, {
  batchSize: 1000,
  onBatch: (batch) => processBatch(batch),
});
```

---

## Browser Compatibility

### Supported Browsers

| Browser | Min Version | Notes              |
| ------- | ----------- | ------------------ |
| Chrome  | 90+         | Full support       |
| Firefox | 88+         | Full support       |
| Safari  | 15+         | Requires polyfills |
| Edge    | 90+         | Full support       |

### Error: Clipboard API not available

**Solution:**

```typescript
async function copyToClipboard(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
  } else {
    // Fallback
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
}
```

---

## Deployment Issues

### Error: NEXTAUTH_SECRET not set

**Solution:**

```bash
openssl rand -base64 32
# Add to .env.production
NEXTAUTH_SECRET=your-generated-secret
NEXTAUTH_URL=https://your-domain.com
```

---

### Error: Database connection failed

**Solution:**

```bash
# Check permissions
chmod 644 prisma/dev.db

# Verify path
echo $DATABASE_URL
```

---

### Error: JavaScript heap out of memory

**Solution:**

```bash
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

---

## Getting Help

### Before Reporting

1. Check this guide
2. Search [GitHub Issues](https://github.com/your-org/vizuelni-admin-srbije/issues)
3. Gather info:

```bash
node --version
npm --version
npm run type-check
npm run build 2>&1 | head -100
```

### Bug Report Template

```
**Steps to reproduce:**
1.
2.

**Expected:**

**Actual:**

**Environment:**
- OS:
- Node:
- Browser:

**Logs:**
```

---

## Contact

- **GitHub Issues:** [Report a bug](https://github.com/your-org/vizuelni-admin-srbije/issues)
- **Email:** opendata@ite.gov.rs
