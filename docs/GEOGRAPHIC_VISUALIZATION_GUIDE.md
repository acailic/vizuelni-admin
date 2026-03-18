# Geographic Visualization Guide

**Complete guide to creating maps with Serbian geographic data**

---

## Overview

Vizualni Admin Srbije includes comprehensive geographic data for Serbia, enabling you to create choropleth maps, regional comparisons, and geographic visualizations without external data sources.

### What's Included

| Level          | Count | Description                     |
| -------------- | ----- | ------------------------------- |
| Country        | 1     | Republic of Serbia              |
| Provinces      | 2     | Vojvodina, Kosovo and Metohija  |
| Districts      | 26    | 25 districts + City of Belgrade |
| Municipalities | 174   | All Serbian municipalities      |

### Features

- ✅ GeoJSON for all levels
- ✅ Automatic name matching (Cyrillic, Latin, English)
- ✅ Multiple map projections
- ✅ Interactive tooltips
- ✅ Color scale customization
- ✅ Export to PNG, SVG, PDF

---

## Quick Start

### Basic Map

```typescript
import { SerbiaMap } from '@vizualni/react';

function SimpleMap() {
  const data = [
    { name: 'Београд', value: 1.68 },
    { name: 'Јужнобачки', value: 0.62 },
    { name: 'Нишавски', value: 0.38 },
    // ... more districts
  ];

  return (
    <SerbiaMap
      data={data}
      geoLevel="districts"
      colorField="value"
      title="Стопа раста по окрузима"
    />
  );
}
```

### Result

A choropleth map of Serbia with districts colored by value.

---

## Geographic Levels

### Country Level

**Use when**: Showing national statistics, single values

```typescript
<SerbiaMap
  geoLevel="country"
  data={[{ name: 'Србија', value: 6.6 }]}
  title="Стопа раста БДП-а"
/>
```

### Province Level

**Use when**: Comparing Vojvodina vs Central Serbia

```typescript
<SerbiaMap
  geoLevel="provinces"
  data={[
    { name: 'Војводина', value: 1.9 },
    { name: 'Централна Србија', value: 4.7 }
  ]}
/>
```

### District Level (Most Common)

**Use when**: Regional comparisons, most analyses

```typescript
<SerbiaMap
  geoLevel="districts"
  data={districtData}
  colorField="value"
/>
```

**District list**:

```
Град Београд
Сремски
Јужнобачки
Севернобачки
Средњобанатски
Севернобанатски
Јужнобанатски
Браничевски
Подунавски
Шумадијски
Рашки
Моравички
Златиборски
Колубарски
Мачвански
Рашка
Расински
Нишавски
Топлички
Јабланички
Пчињски
Пиротски
Зајечарски
Борски
Браничевски
Подунавски
```

### Municipality Level

**Use when**: Detailed local analysis

```typescript
<SerbiaMap
  geoLevel="municipalities"
  data={municipalityData}
  colorField="value"
  showLabels={false}  // 174 labels is too many
/>
```

**Note**: Municipality maps are more complex and may require:

- Higher zoom level
- Hidden labels
- Simplified color scales

---

## Name Matching

### Automatic Matching

The platform automatically matches region names across scripts:

```typescript
// All of these work:
{ name: 'Београд', value: 100 }      // Cyrillic
{ name: 'Beograd', value: 100 }       // Latin
{ name: 'Belgrade', value: 100 }      // English
```

### Name Normalization

```typescript
import { normalizeRegionName } from '@vizualni/geo-data';

// All return the same normalized name
normalizeRegionName('Београд'); // 'beograd'
normalizeRegionName('Beograd'); // 'beograd'
normalizeRegionName('Belgrade'); // 'beograd'
```

### Handling Mismatches

```typescript
import { SerbiaMap, RegionMatcher } from '@vizualni/react';

function MapWithMatching() {
  const rawData = [
    { region: 'Belgrade', value: 100 },
    { region: 'Novi Sad', value: 50 }
  ];

  // Auto-match to known names
  const matcher = new RegionMatcher('districts');
  const matchedData = rawData.map(item => ({
    ...item,
    name: matcher.match(item.region) || item.region
  }));

  return (
    <SerbiaMap
      data={matchedData}
      geoLevel="districts"
      colorField="value"
      onUnmatchedRegions={(regions) => {
        console.warn('Unmatched regions:', regions);
      }}
    />
  );
}
```

---

## Color Scales

### Sequential (Single Hue)

**Use when**: Values go from low to high

```typescript
<SerbiaMap
  data={data}
  colorScale="blues"  // or 'reds', 'greens', 'purples'
  colorField="value"
/>
```

**Available scales**:

- `blues` — Light blue to dark blue
- `reds` — Light red to dark red
- `greens` — Light green to dark green
- `purples` — Light purple to dark purple
- `grays` — Light gray to dark gray

### Diverging (Two Hues)

**Use when**: Values deviate from a midpoint

```typescript
<SerbiaMap
  data={data}
  colorScale="red-blue"
  colorField="value"
  colorScaleCenter={0}  // Midpoint
/>
```

**Available scales**:

- `red-blue` — Red (negative) to blue (positive)
- `red-green` — Red (low) to green (high)
- `purple-orange` — Purple (low) to orange (high)

### Custom Colors

```typescript
<SerbiaMap
  data={data}
  colorScale="custom"
  colorScaleColors={['#f7fbff', '#6baed6', '#08306b']}
  colorField="value"
/>
```

### Quantile vs Quantize

**Quantile** (equal count per bucket):

```typescript
<SerbiaMap
  data={data}
  colorScaleType="quantile"
  colorScaleBuckets={5}
/>
```

Use when: Data has outliers, want equal representation

**Quantize** (equal value ranges):

```typescript
<SerbiaMap
  data={data}
  colorScaleType="quantize"
  colorScaleBuckets={5}
/>
```

Use when: Data is evenly distributed, want interpretable ranges

---

## Interactivity

### Tooltips

```typescript
<SerbiaMap
  data={data}
  tooltipTemplate={(region) => `
    <strong>${region.name}</strong><br/>
    Вредност: ${region.value.toLocaleString('sr')}<br/>
    Ранг: ${region.rank} од ${region.total}
  `}
/>
```

### Click Handlers

```typescript
function InteractiveMap() {
  const [selected, setSelected] = useState(null);

  return (
    <>
      <SerbiaMap
        data={data}
        onRegionClick={(region) => {
          setSelected(region);
        }}
        highlightRegion={selected?.name}
      />

      {selected && (
        <div className="details">
          <h3>{selected.name}</h3>
          <p>Вредност: {selected.value}</p>
        </div>
      )}
    </>
  );
}
```

### Zoom and Pan

```typescript
<SerbiaMap
  data={data}
  zoomable={true}
  initialZoom={1}
  minZoom={0.5}
  maxZoom={5}
  onZoomChange={(zoom) => {
    console.log('Zoom level:', zoom);
  }}
/>
```

---

## Handling Missing Data

### Default Behavior

Regions without data are shown in gray.

### Custom Missing Data Style

```typescript
<SerbiaMap
  data={data}
  missingDataColor="#e0e0e0"
  missingDataLabel="Нема података"
/>
```

### Excluding Regions

```typescript
<SerbiaMap
  data={data}
  excludeRegions={['Косово и Метохија']}  // If data unavailable
/>
```

---

## Advanced Features

### Comparison Maps

```typescript
function ComparisonMap({ data2022, data2024 }) {
  const [view, setView] = useState<'side-by-side' | 'difference'>('difference');

  if (view === 'difference') {
    const diffData = data2022.map((d, i) => ({
      name: d.name,
      value: data2024[i].value - d.value
    }));

    return (
      <SerbiaMap
        data={diffData}
        colorScale="red-blue"
        colorScaleCenter={0}
        title="Промена 2022-2024"
      />
    );
  }

  return (
    <div className="side-by-side">
      <SerbiaMap data={data2022} title="2022" />
      <SerbiaMap data={data2024} title="2024" />
    </div>
  );
}
```

### Animation Over Time

```typescript
function AnimatedMap({ yearlyData }) {
  const [year, setYear] = useState(2020);

  return (
    <div>
      <SerbiaMap
        data={yearlyData[year]}
        colorScale="blues"
        colorScaleDomain={[0, 100]}  // Fixed scale for consistency
      />

      <Slider
        min={2020}
        max={2024}
        value={year}
        onChange={setYear}
      />
    </div>
  );
}
```

### Custom Regions

```typescript
import { createCustomRegions } from '@vizualni/geo-data';

const customRegions = createCustomRegions([
  {
    name: 'Војводина',
    members: ['Сремски', 'Јужнобачки', 'Севернобачки', ...]
  },
  {
    name: 'Шумадија и Западна Србија',
    members: ['Шумадијски', 'Моравички', 'Златиборски', ...]
  },
  {
    name: 'Јужна и Источна Србија',
    members: ['Нишавски', 'Јабланички', 'Зајечарски', ...]
  },
  {
    name: 'Београд',
    members: ['Град Београд']
  }
]);

<SerbiaMap
  data={data}
  customRegions={customRegions}
  geoLevel="custom"
/>
```

---

## Export Options

### PNG Export

```typescript
const mapRef = useRef();

async function exportPNG() {
  const blob = await mapRef.current.exportPNG({
    scale: 2,  // 2x resolution
    background: '#ffffff'
  });

  // Download
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'serbia-map.png';
  a.click();
}

<SerbiaMap ref={mapRef} {...props} />
```

### SVG Export

```typescript
async function exportSVG() {
  const svg = await mapRef.current.exportSVG();

  // Download
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'serbia-map.svg';
  a.click();
}
```

### PDF Export

```typescript
import { exportToPDF } from '@vizualni/export';

async function exportPDF() {
  await exportToPDF(mapRef.current, {
    title: 'Мапа Србије',
    source: 'data.gov.rs',
    format: 'A4',
    orientation: 'portrait',
  });
}
```

---

## Best Practices

### Do's

✅ **Do**:

- Use consistent color scales across comparisons
- Include a legend with clear labels
- Provide context in tooltips
- Test with real data before finalizing
- Consider colorblind accessibility

### Don'ts

❌ **Don't**:

- Use more than 7 color buckets
- Compare maps with different scales
- Hide missing data without explanation
- Use diverging scales for positive-only data
- Forget to cite your data source

### Accessibility

```typescript
<SerbiaMap
  data={data}
  // Colorblind-friendly palette
  colorScale="viridis"  // Works for most color vision deficiencies

  // Screen reader support
  accessible={true}
  ariaLabel="Мапа Србије приказује вредности по окрузима"

  // High contrast mode
  highContrast={true}

  // Reduced motion
  reducedMotion={true}
/>
```

---

## Common Issues

### Issue: Region Not Coloring

**Cause**: Name mismatch

**Solution**:

```typescript
import { debugRegionMatching } from '@vizualni/geo-data';

// Log unmatched regions
debugRegionMatching(data, 'districts');
```

### Issue: Colors Look Wrong

**Cause**: Outliers skewing the scale

**Solution**:

```typescript
<SerbiaMap
  data={data}
  colorScaleType="quantile"  // Better for outliers
  // Or clamp values
  colorScaleDomain={[0, 100]}  // Cap at 100
/>
```

### Issue: Labels Overlapping

**Cause**: Too many regions at current zoom

**Solution**:

```typescript
<SerbiaMap
  data={data}
  showLabels={false}  // Hide labels
  tooltipTemplate={...}  // Show in tooltip instead
/>
```

---

## Examples

### Example 1: Population Density

```typescript
import { SerbiaMap } from '@vizualni/react';
import { populationDensity } from '@vizualni/sample-data';

function PopulationDensityMap() {
  return (
    <SerbiaMap
      data={populationDensity}
      geoLevel="districts"
      colorField="density"
      colorScale="blues"
      colorScaleType="quantile"
      colorScaleBuckets={5}
      title="Густина насељености по окрузима (ст./км²)"
      tooltipTemplate={(r) => `
        <strong>${r.name}</strong><br/>
        Густина: ${r.density} ст./км²<br/>
        Популација: ${r.population.toLocaleString('sr')}
      `}
    />
  );
}
```

### Example 2: Election Results

```typescript
function ElectionMap({ results }) {
  const partyColors = {
    'SNS': '#0D4077',
    'SPS': '#C6363C',
    'SRS': '#1E3A5F',
    'other': '#808080'
  };

  return (
    <SerbiaMap
      data={results}
      geoLevel="municipalities"
      colorField="winner"
      colorScale="categorical"
      colorScaleColors={partyColors}
      title="Победничка странка по општинама"
      showLabels={false}
    />
  );
}
```

### Example 3: Budget Per Capita

```typescript
function BudgetPerCapitaMap({ budget, population }) {
  const data = budget.map(b => ({
    name: b.district,
    value: b.amount / population[b.district]
  }));

  return (
    <SerbiaMap
      data={data}
      geoLevel="districts"
      colorField="value"
      colorScale="greens"
      colorScaleType="quantize"
      colorScaleBuckets={6}
      title="Буџетска средства по глави становника (динари)"
      numberFormat={{
        style: 'currency',
        currency: 'RSD',
        maximumFractionDigits: 0
      }}
    />
  );
}
```

---

## Kosovo and Metohija Data Handling

### Important Notice

**Косово и Метохија (Kosovo and Metohija)** is an integral part of the Republic of Serbia under Serbian law and international law (UN Security Council Resolution 1244). This platform includes geographic data for the entire territory of Serbia, including Kosovo and Metohija.

### Data Availability

| Data Type          | Status           | Notes                                       |
| ------------------ | ---------------- | ------------------------------------------- |
| GeoJSON boundaries | ✅ Available     | Full administrative divisions               |
| Population data    | ⚠️ Limited       | Pre-1999 census data, estimates for current |
| Economic data      | ⚠️ Limited       | Official Serbian statistics                 |
| Real-time data     | ❌ Not available | No current data collection infrastructure   |

### Recommended Approaches

**1. Include with disclaimer:**

```typescript
<SerbiaMap
  data={data}
  geoLevel="districts"
  footnote="Напомена: Подаци за Косово и Метохију су ограничени или процењени."
/>
```

**2. Exclude from visualization:**

```typescript
<SerbiaMap
  data={data}
  excludeRegions={['Косово и Метохија', 'Косовскомитровачки округ', 'Пећки округ', 'Призренски округ', 'Приштински округ', 'Гњилански округ']}
  footnote="Напомена: Приказ не укључује податке за Косово и Метохију."
/>
```

**3. Show with "no data" styling:**

```typescript
<SerbiaMap
  data={data}
  missingDataColor="#e0e0e0"
  missingDataLabel="Подаци недоступни"
  // Regions without data automatically show in gray
/>
```

### Administrative Divisions Included

The Kosovo and Metohija autonomous province includes 5 districts and 29 municipalities:

**Districts (Окрузи):**

- Косовскомитровачки округ (Kosovska Mitrovica District)
- Пећки округ (Peć District)
- Призренски округ (Prizren District)
- Приштински округ (Priština District)
- Гњилански округ (Gnjilane District)

### Legal and Ethical Considerations

1. **Serbian Government Use:** Always include Kosovo and Metohija in official visualizations
2. **International Publications:** Add appropriate disclaimer about data sources and territorial status
3. **Data Journalism:** Cite specific data sources and their limitations
4. **Academic Research:** Note methodology for any estimates used

### Citation Template

```markdown
**Извор података:** [институција], [датум]
**Напомена:** Подаци за Косово и Метохију су [ограничени/процењени/из [извора]].
**Правни статус:** Према УНС Резолуцији 1244, Косово и Метохија су саставни део Републике Србије.
```

---

## API Reference

### SerbiaMap Props

| Prop                | Type                                                          | Default       | Description             |
| ------------------- | ------------------------------------------------------------- | ------------- | ----------------------- |
| `data`              | `RegionData[]`                                                | Required      | Array of region data    |
| `geoLevel`          | `'country' \| 'provinces' \| 'districts' \| 'municipalities'` | `'districts'` | Geographic level        |
| `colorField`        | `string`                                                      | `'value'`     | Field to color by       |
| `colorScale`        | `string`                                                      | `'blues'`     | Color scale name        |
| `colorScaleType`    | `'quantile' \| 'quantize' \| 'linear'`                        | `'quantile'`  | Scale type              |
| `colorScaleBuckets` | `number`                                                      | `5`           | Number of color buckets |
| `colorScaleDomain`  | `[number, number]`                                            | Auto          | Min/max values          |
| `title`             | `string`                                                      | -             | Map title               |
| `tooltipTemplate`   | `(region) => string`                                          | Default       | Custom tooltip          |
| `showLabels`        | `boolean`                                                     | `true`        | Show region labels      |
| `zoomable`          | `boolean`                                                     | `false`       | Enable zoom             |
| `onRegionClick`     | `(region) => void`                                            | -             | Click handler           |
| `onRegionHover`     | `(region) => void`                                            | -             | Hover handler           |
| `missingDataColor`  | `string`                                                      | `'#e0e0e0'`   | Color for missing data  |
| `accessible`        | `boolean`                                                     | `true`        | Accessibility mode      |

---

**Questions?** Contact: opendata@ite.gov.rs
