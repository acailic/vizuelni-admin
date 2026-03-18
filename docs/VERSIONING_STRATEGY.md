# Versioning Strategy

> **Политика верзија и измена** | Version policy and deprecation handling

This document outlines how Vizuelni Admin Srbije manages versions, breaking changes, and deprecations.

---

## Versioning Philosophy

We follow **Semantic Versioning 2.0** with government-specific considerations:

```
MAJOR.MINOR.PATCH

MAJOR: Breaking changes (requires migration)
MINOR: New features (backward compatible)
PATCH: Bug fixes (backward compatible)
```

### Version Components

| Component | Increment When                               | Example       |
| --------- | -------------------------------------------- | ------------- |
| **MAJOR** | API breaking changes, data format changes    | 1.x → 2.0     |
| **MINOR** | New features, new chart types, new endpoints | 1.0 → 1.1     |
| **PATCH** | Bug fixes, performance improvements          | 1.0.0 → 1.0.1 |

---

## API Versioning

### URL-Based Versioning (Current)

```
/api/v1/charts/          # Version 1 API
/api/v2/charts/          # Version 2 API (future)
```

### Header-Based Versioning (Optional)

```http
GET /api/charts/ HTTP/1.1
Accept: application/vnd.vizuelni.v1+json
```

### Deprecation Timeline

```
v1 Released ──▶ v2 Released ──▶ v1 Deprecated ──▶ v1 Sunset
   │                │                │                 │
   │                │                │                 └─ API returns 410
   │                │                └─ Warning headers, docs updated
   │                └─ v1 still supported for 12 months
   └─ v1 is current
```

---

## Breaking Changes Policy

### What Constitutes a Breaking Change?

| Category            | Breaking                  | Non-Breaking           |
| ------------------- | ------------------------- | ---------------------- |
| **API Endpoints**   | Remove/rename endpoint    | Add new endpoint       |
| **Request Fields**  | Remove required field     | Add optional field     |
| **Response Fields** | Remove field, change type | Add new field          |
| **Chart Types**     | Remove chart type         | Add new chart type     |
| **Data Formats**    | Change CSV structure      | Add new format support |
| **Authentication**  | Change auth method        | Add new auth option    |

### Breaking Change Examples

```typescript
// ❌ BREAKING: Removing field
// Old
interface Chart {
  id: string;
  title: string;
  data: any[];
}

// New
interface Chart {
  id: string;
  data: any[]; // title removed - BREAKING!
}

// ✅ NON-BREAKING: Adding optional field
interface Chart {
  id: string;
  title: string;
  data: any[];
  description?: string; // New optional field - OK
}
```

---

## Deprecation Process

### Phase 1: Announcement (T-12 months)

```markdown
## Deprecation Notice

**Component:** Chart Export API v1
**Announced:** March 2026
**Sunset Date:** March 2027

**Reason:** Performance improvements require API restructuring

**Migration Guide:** [Link to migration guide]

**Support:** Full support until sunset date
```

### Phase 2: Warning Period (T-6 months)

```http
HTTP/1.1 200 OK
Deprecation: true
Sunset: Sat, 15 Mar 2027 00:00:00 GMT
Link: </docs/migration/export-v2>; rel="sunset"
```

### Phase 3: Sunset (T-0)

```http
HTTP/1.1 410 Gone
Content-Type: application/json

{
  "error": "API v1 sunset",
  "message": "This endpoint has been removed. Please migrate to v2.",
  "migration_guide": "https://docs.vizuelni.rs/migration/export-v2"
}
```

---

## Component Versioning

### Frontend Components

```json
// package.json
{
  "name": "vizuelni-admin-srbije",
  "version": "1.2.3",
  "versionSuffix": "-beta.1" // For pre-releases
}
```

**Release Channels:**
| Channel | Version Pattern | Use Case |
|---------|-----------------|----------|
| Stable | `1.2.3` | Production |
| Beta | `1.2.3-beta.1` | Testing |
| Alpha | `1.2.3-alpha.1` | Internal |
| RC | `1.2.3-rc.1` | Pre-release |

### API Endpoints

```
/api/v1/  → Current stable (1.x)
/api/v2/  → Next major (when released)
/api/beta/ → Experimental features
```

### Chart Schema Versioning

```typescript
// Chart data includes version
interface ChartData {
  schemaVersion: '1.0' | '1.1' | '2.0';
  // ... chart data
}

// Version migration
function migrateChartData(data: unknown, targetVersion: string): ChartData {
  const version = data.schemaVersion || '1.0';

  if (version === '1.0' && targetVersion === '1.1') {
    return migrateV1ToV1_1(data);
  }

  return data;
}
```

---

## Data Format Versioning

### CSV/Excel Schema

When data formats change:

```typescript
// v1 schema
const v1Columns = ['region', 'value', 'year'];

// v2 schema (added category)
const v2Columns = ['region', 'value', 'year', 'category'];

// Migration
function migrateCSV(data: string[], fromVersion: string): string[] {
  if (fromVersion === '1.0') {
    // Add empty category column
    return data.map(
      (row, i) => (i === 0 ? row + ',category' : row + ',') // Empty category for old data
    );
  }
  return data;
}
```

### GeoJSON Versioning

```json
{
  "type": "FeatureCollection",
  "metadata": {
    "version": "2024.03",
    "source": "data.gov.rs",
    "lastUpdated": "2024-03-15"
  },
  "features": [...]
}
```

**Update Policy:**

- GeoJSON updated annually (March)
- Version in format: `YYYY.MM`
- Breaking changes require new file (not replacement)

---

## External Dependency Versioning

### data.gov.rs API Changes

**Monitoring:**

```typescript
// lib/api/datagov-monitor.ts
export async function checkDataGovVersion(): Promise<VersionStatus> {
  const response = await fetch('https://data.gov.rs/api/1/status');
  const { version, deprecated, sunset } = await response.json();

  return {
    current: version,
    deprecated: deprecated || [],
    sunsetDates: sunset || {},
  };
}
```

**Response Plan:**

1. Monitor data.gov.rs announcements
2. Test against new API versions
3. Update integration within 3 months
4. Provide migration path for users

### Third-Party Libraries

**Policy:**

- Update dependencies monthly
- Security updates within 48 hours
- Major version bumps require testing period

```json
// package.json
{
  "dependencies": {
    "next": "^14.0.0", // Minor/patch updates OK
    "recharts": "~2.10.0", // Only patch updates
    "d3": "7.8.5" // Pinned (breaking changes common)
  }
}
```

---

## Migration Guides

### Required Structure

````markdown
# Migration Guide: v1 to v2

## Overview

- **Release Date:** [Date]
- **Breaking Changes:** [Count]
- **Migration Time:** [Estimated hours]

## Quick Start

1. [First step]
2. [Second step]
3. [Third step]

## Breaking Changes

### 1. [Change Name]

**Before (v1):**

```typescript
// Old code
```
````

**After (v2):**

```typescript
// New code
```

**Impact:** [Description]

### 2. [Change Name]

...

## Deprecations

- [Deprecated feature] → [Replacement]

## Removed Features

- [Removed feature] → [Alternative]

## New Features

- [New feature description]

## Testing Your Migration

[Steps to verify migration successful]

````

### Example: Export API v1 → v2

```markdown
# Export API v1 → v2 Migration

## Breaking Changes

### Export options renamed

**v1:**
```typescript
exportToPDF(chart, {
  quality: 'high',
  size: 'A4'
});
````

**v2:**

```typescript
exportToPDF(chart, {
  resolution: 'high', // renamed from 'quality'
  pageSize: 'A4', // renamed from 'size'
});
```

## Migration Steps

1. Update export function calls
2. Replace `quality` with `resolution`
3. Replace `size` with `pageSize`
4. Test exports

## Automated Migration

```bash
npx vizuelni-migrate export-v1-to-v2 ./src
```

````

---

## Version Support Policy

### Active Support

| Version | Status | Support Until | Notes |
|---------|--------|---------------|-------|
| 1.x | Active | March 2028 | Current major version |
| 0.x | End of Life | March 2026 | No longer supported |

### Support Levels

| Level | Description | Duration |
|-------|-------------|----------|
| **Active** | Full support, new features, bug fixes | Current version |
| **Maintenance** | Security fixes only | 12 months after next major |
| **End of Life** | No support | After maintenance period |

### Long-Term Support (LTS)

For government deployments:
- LTS versions: 12 months extended support
- Security patches: 24 months
- Migration assistance: Available

---

## Changelog Format

### CHANGELOG.md

```markdown
# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] - 2026-03-15

### Added
- New pie chart variant with 3D effect
- Export to SVG format
- Serbian Latin locale improvements

### Changed
- Improved chart rendering performance by 40%

### Deprecated
- `exportToImage()` will be removed in v2.0. Use `exportToPNG()`.

### Fixed
- Cyrillic text rendering in PDF exports
- Region matching for district names with diacritics

### Security
- Updated dependencies to fix CVE-2026-12345

## [1.1.0] - 2026-02-01

### Added
- Geographic visualization for all 174 municipalities
- data.gov.rs integration

[... previous versions ...]
````

---

## Release Process

### Pre-Release Checklist

- [ ] Update version in package.json
- [ ] Update CHANGELOG.md
- [ ] Run full test suite
- [ ] Update documentation
- [ ] Create migration guide (if breaking)
- [ ] Tag release in Git
- [ ] Deploy to staging
- [ ] Smoke test staging
- [ ] Deploy to production
- [ ] Announce release

### Release Channels

```bash
# Stable release
npm run release

# Beta release
npm run release:beta

# Hotfix
npm run release:patch
```

---

## Communication Plan

### Release Announcements

**Channels:**

1. GitHub Releases
2. Email to registered users
3. In-app notification
4. Documentation update
5. Social media (Twitter, LinkedIn)

**Announcement Template:**

```markdown
# Release v1.2.0

**Release Date:** March 15, 2026

## Highlights

- [Key feature 1]
- [Key feature 2]

## Breaking Changes

⚠️ [Summary of breaking changes, if any]

## Upgrade Instructions

[Link to migration guide]

## Full Changelog

[Link to CHANGELOG.md]
```

---

## Rollback Plan

### Automatic Rollback Triggers

- Error rate > 5% in first hour
- Response time > 2x baseline
- User-reported critical bugs

### Rollback Process

```bash
# 1. Identify issue
npm run monitor:errors

# 2. Decision: Rollback?
# If yes:

# 3. Revert deployment
kubectl rollout undo deployment/vizuelni-api

# 4. Verify rollback
npm run smoke-test

# 5. Communicate
# Post incident report within 24 hours
```

---

## Questions?

For versioning questions:

- **GitHub Issues:** [Link]
- **Email:** support@vizuelni.rs
- **Documentation:** [Link]

---

_Version Strategy v1.0 - March 2026_
