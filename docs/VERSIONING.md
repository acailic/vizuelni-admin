# Versioning Strategy

**How Vizualni Admin Srbije manages releases, breaking changes, and long-term stability**

---

## Version Scheme

We follow [Semantic Versioning 2.0.0](https://semver.org/) with Serbian government stability requirements.

### Version Format: `MAJOR.MINOR.PATCH`

| Component | When It Changes                    | Example           |
| --------- | ---------------------------------- | ----------------- |
| **MAJOR** | Breaking changes                   | `1.0.0` → `2.0.0` |
| **MINOR** | New features, backwards compatible | `1.0.0` → `1.1.0` |
| **PATCH** | Bug fixes, backwards compatible    | `1.0.0` → `1.0.1` |

### Pre-release Versions

```
1.1.0-alpha.1    # Internal testing
1.1.0-beta.1     # Public testing with partners
1.1.0-rc.1       # Release candidate, final validation
1.1.0            # Stable release
```

---

## Package Versioning

### Monorepo Packages

All packages share the same version for consistency:

```json
{
  "@vizualni/core": "0.1.0",
  "@vizualni/react": "0.1.0",
  "@vizualni/charts": "0.1.0",
  "@vizualni/geo-data": "0.1.0",
  "@vizualni/connectors": "0.1.0",
  "@vizualni/sample-data": "0.1.0"
}
```

**Rationale:** Simplifies dependency management for government agencies with strict approval processes.

---

## Stability Classifications

### Stable APIs (Tier 1)

**Guarantee:** No breaking changes within major version

| Component                 | Status    | Since |
| ------------------------- | --------- | ----- |
| `SerbiaMap` props         | ✅ Stable | 0.1.0 |
| `DataGovRsConnector`      | ✅ Stable | 0.1.0 |
| Color scales              | ✅ Stable | 0.1.0 |
| Geographic data structure | ✅ Stable | 0.1.0 |
| Chart configuration       | ✅ Stable | 0.1.0 |

**Migration:** Breaking changes require major version bump + 6-month deprecation notice

### Beta APIs (Tier 2)

**Expectation:** May change, but with migration path

| Component                 | Status  | Target Stable |
| ------------------------- | ------- | ------------- |
| `@vizualni/templates`     | 🟡 Beta | 1.0.0         |
| `@vizualni/export`        | 🟡 Beta | 1.0.0         |
| Real-time dashboards      | 🟡 Beta | 1.1.0         |
| Custom region aggregation | 🟡 Beta | 1.0.0         |

**Migration:** Breaking changes announced in release notes, migration guide provided

### Experimental APIs (Tier 3)

**Expectation:** May be removed or significantly changed

| Component                | Status          | Notes            |
| ------------------------ | --------------- | ---------------- |
| AI-powered insights      | 🔬 Experimental | Research phase   |
| Natural language queries | 🔬 Experimental | Research phase   |
| Mobile SDK               | 🔬 Experimental | Exploring demand |

**Usage:** Not recommended for production without fallback plan

---

## Breaking Change Policy

### What Constitutes a Breaking Change

**Definitely Breaking:**

- Removing or renaming exported functions/components
- Changing function signatures (parameter order, required params)
- Changing component prop names or types
- Removing component props
- Changing default behavior without opt-in
- Requiring new dependencies without migration
- Changing GeoJSON structure or IDs

**Not Breaking (Backwards Compatible):**

- Adding new optional props
- Adding new exported functions
- Adding new color scales or chart types
- Improving performance
- Fixing bugs (even if behavior changes)
- Adding new geographic levels
- Internal refactoring

### Breaking Change Process

```
Announcement (T-6 months)
    ↓
Deprecation Warning (T-3 months)
    ↓
Release Candidate (T-1 month)
    ↓
Major Version Release (T-0)
    ↓
Migration Support (T+3 months)
```

### Example: Removing a Prop

**Version 1.x (Current):**

```typescript
<SerbiaMap
  data={data}
  oldProp={value}  // Works but shows deprecation warning
  newProp={value}  // Recommended
/>
```

**Deprecation Warning:**

```
Warning: `oldProp` is deprecated and will be removed in v2.0.0.
Use `newProp` instead. See: https://vizuelni-admin.rs/migration/v2
```

**Version 2.0.0:**

```typescript
<SerbiaMap
  data={data}
  newProp={value}  // Only this works
/>
// oldProp causes TypeScript error + runtime warning
```

---

## Geographic Data Updates

### Administrative Boundary Changes

Serbian administrative divisions change rarely but can:

1. **Municipality mergers/splits** - Every 5-10 years
2. **District boundary adjustments** - Very rare
3. **Name changes** - Occasionally

### Handling Updates

| Change Type      | Version Impact | Migration                       |
| ---------------- | -------------- | ------------------------------- |
| New municipality | MINOR          | Automatic                       |
| Name change      | PATCH          | Both names supported for 1 year |
| Boundary change  | MINOR          | GeoJSON versioned by year       |
| Removed region   | MAJOR          | Requires code changes           |

### GeoJSON Versioning

```typescript
import { getGeoData } from '@vizualni/geo-data';

// Default: latest version
const current = getGeoData('districts');

// Specific year (for historical consistency)
const historical = getGeoData('districts', { year: 2022 });
```

Available years: `2022`, `2024`, `latest`

---

## data.gov.rs API Changes

### Monitoring

We actively monitor data.gov.rs for changes:

- **Weekly:** Automated API health checks
- **Monthly:** Schema validation against documented structure
- **Quarterly:** Full integration test suite

### Response to Changes

| Change Type        | Our Response            | Timeline                       |
| ------------------ | ----------------------- | ------------------------------ |
| New dataset        | Add connector           | < 2 weeks                      |
| New fields         | Update types            | < 1 week                       |
| Field renamed      | Deprecation + new field | < 2 weeks                      |
| Endpoint removed   | Breaking change notice  | ASAP + 3 months                |
| API version change | Major version bump      | Aligned with their deprecation |

### Compatibility Matrix

| Vizualni Version | data.gov.rs API      | Support Status |
| ---------------- | -------------------- | -------------- |
| 0.1.x            | v1 (current)         | ✅ Active      |
| 1.0.x            | v1, v2 (if released) | ✅ Active      |
| 2.0.x            | v2+                  | Future         |

---

## Release Schedule

### Regular Releases

| Type      | Frequency | Content                          |
| --------- | --------- | -------------------------------- |
| **Patch** | As needed | Bug fixes, minor improvements    |
| **Minor** | Monthly   | New features, enhancements       |
| **Major** | Annually  | Breaking changes, major features |

### Release Calendar 2026

| Version | Target Date    | Focus                    |
| ------- | -------------- | ------------------------ |
| 0.2.0   | April 2026     | Geographic enhancements  |
| 0.3.0   | May 2026       | Export improvements      |
| 1.0.0   | June 2026      | Stable release, API lock |
| 1.1.0   | September 2026 | Template library         |
| 1.2.0   | December 2026  | Performance optimization |

### LTS (Long-Term Support)

Starting with v1.0.0:

- **LTS releases:** 1.0.x, 2.0.x, 3.0.x
- **Support duration:** 18 months
- **Support scope:** Security fixes, critical bugs, data.gov.rs compatibility
- **Non-LTS releases:** 6 months support

---

## Migration Guides

### When Major Versions Release

Every major version includes:

1. **MIGRATION-vX.md** - Step-by-step guide
2. **Codemods** - Automated fixes where possible
3. **Compatibility mode** - Temporary backwards compatibility

### Example: Migrating 0.x → 1.0

```bash
# 1. Update packages
npm install @vizualni/core@1 @vizualni/react@1

# 2. Run codemod for renamed props
npx @vizualni/codemod v1-prop-renames

# 3. Check for deprecated APIs
npx @vizualni/doctor

# 4. Test with compatibility mode
ENABLE_COMPAT_0x=1 npm test

# 5. Remove compatibility mode
npm test
```

---

## Deprecation Notices

### Current Deprecations (0.1.x → 1.0.0)

| API                       | Deprecated | Removal | Replacement              |
| ------------------------- | ---------- | ------- | ------------------------ |
| `SerbiaMap.regionIdField` | 0.1.0      | 1.0.0   | `SerbiaMap.idField`      |
| `connector.fetch()`       | 0.1.0      | 1.0.0   | `connector.getDataset()` |
| `colorPalette` prop       | 0.1.0      | 1.0.0   | `colorScale`             |

### Checking for Deprecated Usage

```bash
# CLI check
npx @vizualni/doctor --check-deprecations

# Programmatic
import { checkDeprecations } from '@vizualni/core';
const issues = checkDeprecations();
```

---

## Support Policy

### Version Support Matrix

| Version | Released | Bug Fixes    | Security     | End of Life |
| ------- | -------- | ------------ | ------------ | ----------- |
| 0.1.x   | Mar 2026 | ✅ Until 1.0 | ✅ Until 1.0 | June 2026   |
| 1.0.x   | Jun 2026 | ✅ 18 months | ✅ 18 months | Dec 2027    |
| 1.1.x   | Sep 2026 | ✅ 6 months  | ✅ 12 months | Sep 2027    |

### Government Agency Support

For government agencies with extended approval cycles:

1. **Extended LTS:** 24 months (vs 18 standard)
2. **Advance notice:** 12 months before EOL (vs 6 standard)
3. **Migration support:** Dedicated support channel
4. **Compatibility testing:** Access to pre-release versions

Contact: opendata@ite.gov.rs for agency support agreements

---

## Changelog

Every release includes a CHANGELOG.md entry following [Keep a Changelog](https://keepachangelog.com/):

```markdown
## [0.2.0] - 2026-04-15

### Added

- Support for municipality-level maps
- PDF export with Serbian fonts

### Changed

- Improved color scale performance by 40%

### Deprecated

- `regionIdField` prop (use `idField`)

### Fixed

- Region name matching for Latin script variations

### Security

- Updated dependencies to address CVE-2026-XXXXX
```

---

## Notification Channels

### Stay Informed

| Channel                    | What You'll Receive                   |
| -------------------------- | ------------------------------------- |
| **GitHub Releases**        | All version announcements             |
| **npm**                    | Version updates                       |
| **Email list**             | Breaking changes, security advisories |
| **Discord #announcements** | Release summaries                     |

Subscribe: opendata@ite.gov.rs with subject "SUBSCRIBE VERSIONS"

---

## Questions?

**Version compatibility:** opendata@ite.gov.rs
**Migration assistance:** discord.gg/vizualni-admin
**Enterprise support:** Contact for SLA-backed support agreements
