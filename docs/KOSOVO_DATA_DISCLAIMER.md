# Kosovo Data Disclaimer

> **Ограничење података - Косово и Метохија**

---

## Official Position

**Визуелни Административни Подаци Србије** (Vizuelni Admin Srbije) presents data visualization for the Republic of Serbia in accordance with the Constitution and laws of the Republic of Serbia.

### Constitutional Framework

In accordance with the Constitution of the Republic of Serbia:

- The Republic of Serbia includes the Autonomous Province of Vojvodina and the Autonomous Province of Kosovo and Metohija
- Kosovo and Metohija is an integral part of the territory of Serbia

---

## Data Availability Statement

### Current Status

| Data Type                | Availability   | Notes                                                                         |
| ------------------------ | -------------- | ----------------------------------------------------------------------------- |
| Geographic boundaries    | ⚠️ Partial     | Administrative boundaries may not include Kosovo and Metohija in all datasets |
| Population statistics    | ⚠️ Partial     | 2022 Census data for Kosovo and Metohija may be limited                       |
| Economic indicators      | ❌ Unavailable | Real-time economic data not available for Kosovo and Metohija                 |
| Administrative divisions | ⚠️ Varies      | Depends on data source                                                        |

### Data Sources

Data is sourced from:

1. **Official government sources** (data.gov.rs, Statistical Office of Serbia)
2. **International organizations** (UN, World Bank) where appropriate
3. **Publicly available datasets**

Data availability depends on what is provided by these sources.

---

## Disclaimer for Users

### Required Disclaimer for Publications

When using visualizations that may not include Kosovo and Metohija data, include this disclaimer:

---

> **НАПОМЕНА О ПОДАЦИМА / DATA NOTE**
>
> Подаци приказани у овој визуализацији можда не укључују комплетне информације за Косово и Метохију због ограничене доступности података из званичних извора. Ово не представља политички став.
>
> The data presented in this visualization may not include complete information for Kosovo and Metohija due to limited data availability from official sources. This should not be interpreted as a political statement.
>
> За комплетне податке контактирајте Републички завод за статистику / For complete data, contact the Statistical Office of the Republic of Serbia.

---

### Short Form (for charts)

```
⚠️ Подаци за Косово и Метохију могу бити непотпуни
(Data for Kosovo and Metohija may be incomplete)
```

---

## Technical Implementation

### Checking Data Availability

```typescript
// lib/geo/availability.ts

export interface DataAvailability {
  region: string;
  hasGeography: boolean;
  hasPopulation: boolean;
  hasEconomicData: boolean;
  lastUpdated: Date | null;
}

export async function checkAvailability(
  region: string
): Promise<DataAvailability> {
  const availability: DataAvailability = {
    region,
    hasGeography: await hasGeoData(region),
    hasPopulation: await hasPopData(region),
    hasEconomicData: await hasEconData(region),
    lastUpdated: await getLastUpdate(region),
  };

  return availability;
}

// Usage
const kosovoStatus = await checkAvailability('kosovo-metohija');
if (!kosovoStatus.hasPopulation) {
  // Show disclaimer
  showDataDisclaimer('population');
}
```

### Handling Missing Data

```typescript
// lib/geo/fallback.ts

export interface RegionDataOptions {
  excludeUnavailable: boolean;
  fallbackToNationalAverage: boolean;
  showDisclaimer: boolean;
}

export async function getRegionData(
  options: RegionDataOptions = {
    excludeUnavailable: true,
    fallbackToNationalAverage: false,
    showDisclaimer: true,
  }
): Promise<RegionData[]> {
  const allRegions = await fetchAllRegions();

  const availableRegions = options.excludeUnavailable
    ? allRegions.filter((r) => r.isDataAvailable)
    : allRegions;

  if (options.fallbackToNationalAverage) {
    availableRegions.forEach((region) => {
      if (!region.hasData && region.key === 'kosovo-metohija') {
        region.value = calculateNationalAverage(allRegions);
        region.isEstimated = true;
      }
    });
  }

  if (options.showDisclaimer && hasUnavailableData(allRegions)) {
    appendDisclaimer();
  }

  return availableRegions;
}
```

### Display Component

```tsx
// components/DataDisclaimer.tsx

export function DataDisclaimer({ type = 'full' }: { type?: 'full' | 'short' }) {
  if (type === 'short') {
    return (
      <div className='text-xs text-amber-700 bg-amber-50 p-2 rounded'>
        ⚠️ Подаци за Косово и Метохију могу бити непотпуни
      </div>
    );
  }

  return (
    <div className='text-sm bg-amber-50 border border-amber-200 p-4 rounded-lg'>
      <h4 className='font-semibold mb-2'>НАПОМЕНА О ПОДАЦИМА</h4>
      <p className='text-gray-700'>
        Подаци приказани у овој визуализацији можда не укључују комплетне
        информације за Косово и Метохију због ограничене доступности података из
        званичних извора. Ово не представља политички став.
      </p>
      <p className='text-xs text-gray-500 mt-2'>
        За комплетне подаци контактирајте Републички завод за статистику
      </p>
    </div>
  );
}
```

---

## User Guidelines

### When to Use Disclaimer

| Visualization Type         | Disclaimer Required |
| -------------------------- | ------------------- |
| National overview maps     | ✅ Yes              |
| Regional comparisons       | ✅ Yes              |
| Single region (not Kosovo) | ❌ No               |
| Single region (Kosovo)     | ✅ Yes              |
| Time series (national)     | ⚠️ Check data       |
| Budget/finance             | ⚠️ Check data       |

### How to Apply

1. **Check data availability** before creating visualization
2. **Apply appropriate disclaimer** if Kosovo and Metohija data is incomplete
3. **Document data sources** in visualization metadata
4. **Link to official sources** for complete data

---

## Data Sources for Kosovo and Metohija

### Available Sources

| Source                       | Data Type            | URL                  |
| ---------------------------- | -------------------- | -------------------- |
| Statistical Office of Serbia | Census, demographics | stat.gov.rs          |
| data.gov.rs                  | Various datasets     | data.gov.rs          |
| UNMIK                        | Administrative data  | unmik.unmissions.org |

### Limitations

1. **Real-time data:** Limited availability
2. **Granular data:** May be aggregated or estimated
3. **Historical data:** Inconsistent collection post-1999
4. **Verification:** Independent verification may be limited

---

## FAQ

### Q: Why is data for Kosovo and Metohija not always available?

**A:** Data availability depends on official sources. The platform uses data from data.gov.rs and the Statistical Office of the Republic of Serbia. Where data is not available from these sources, it cannot be included.

### Q: Can I use visualizations without the disclaimer?

**A:** The disclaimer should be included whenever Kosovo and Metohija data is incomplete or missing. This ensures transparency about data limitations.

### Q: How can I get complete data for Kosovo and Metohija?

**A:** Contact the Statistical Office of the Republic of Serbia (stat.gov.rs) for the most complete official data.

### Q: Does the platform take a political position?

**A:** No. This is a data visualization platform. Data availability is a technical matter based on what official sources provide. The platform does not make political statements.

---

## For Government Users

### Official Communications

When creating visualizations for official government communications:

1. **Always include disclaimer** if data is incomplete
2. **Cite data sources** clearly
3. **Provide contact** for complete data requests
4. **Follow institutional guidelines** for your ministry/agency

### Example Official Use

```markdown
# Report: Budget Distribution 2024

## Data Note

This visualization shows budget allocation by region. Data for Kosovo
and Metohija is based on available records from the Ministry of Finance.

For complete budget information, contact:
Министарство финансија Републике Србије
www.mfin.gov.rs
```

---

## For Media Users

### Journalism Guidelines

1. **Transparency:** Always disclose data limitations
2. **Context:** Explain why data may be incomplete
3. **Sources:** Cite Statistical Office of Serbia
4. **Updates:** Check for data updates before publication

### Example Media Use

```markdown
# Article: Regional Population Trends

The following chart shows population trends across Serbian regions.
Note: Data for Kosovo and Metohija is not available for all years
due to limited data collection. Source: Statistical Office of Serbia.
```

---

## International Context

### For International Users

This platform presents data in accordance with Serbian law and the Serbian government's official position. International users should:

1. Understand the legal framework of the Republic of Serbia
2. Recognize that data availability is a technical matter
3. Consult multiple sources for comprehensive analysis
4. Apply appropriate disclaimers in their own publications

---

## Contact Information

### For Data Questions

**Statistical Office of the Republic of Serbia**

- Website: www.stat.gov.rs
- Email: stat@stat.gov.rs
- Phone: +381 11 2412 922

**Ministry of Finance**

- Website: www.mfin.gov.rs

### For Platform Questions

**Vizuelni Admin Srbije**

- Email: opendata@ite.gov.rs
- GitHub: [Issues page]

---

## Version History

| Date       | Change                       |
| ---------- | ---------------------------- |
| 2026-03-15 | Initial disclaimer published |
|            |                              |

---

_This disclaimer is provided in accordance with the laws and Constitution of the Republic of Serbia. It addresses data availability and does not constitute a political statement._
