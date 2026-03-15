# Interactive Tutorials

**Learn to visualize Serbian government data step by step**

---

## Tutorial Paths

Choose your path based on your goals and experience:

| Path                                                   | Duration | Best For                                |
| ------------------------------------------------------ | -------- | --------------------------------------- |
| [Citizen Explorer](#citizen-explorer-path)             | 15 min   | Non-developers who want to explore data |
| [Developer Quickstart](#developer-quickstart-path)     | 30 min   | Developers building visualizations      |
| [Government Integration](#government-integration-path) | 45 min   | Agency staff deploying dashboards       |
| [Data Journalism](#data-journalism-path)               | 60 min   | Journalists creating data stories       |

---

## Citizen Explorer Path

**Goal:** Explore Serbian government data without writing code.

### Tutorial 1: Your First Data Exploration (5 min)

**What you'll learn:** Navigate the platform and find datasets.

1. **Open the Gallery**

   Navigate to `/gallery` to see pre-built visualizations.

2. **Browse by Category**

   Categories include:
   - 📊 Demographics (population, age, gender)
   - 💰 Economy (GDP, unemployment, trade)
   - 🏛️ Government (budget, spending, elections)
   - 🏥 Health (hospitals, diseases, vaccination)
   - 🎓 Education (schools, enrollment, performance)
   - 🌍 Environment (air quality, waste, energy)

3. **Search for Data**

   Use the search bar to find specific topics:
   - "популација" (population)
   - "буџет" (budget)
   - "незапосленост" (unemployment)

4. **Interact with Visualizations**
   - Hover for details
   - Click to filter
   - Use the toolbar to download

**Try it:** [Open Gallery Demo →](/gallery)

---

### Tutorial 2: Creating Your First Chart (5 min)

**What you'll learn:** Use the visual chart builder.

1. **Start the Wizard**

   Click "Create Visualization" or navigate to `/wizard`.

2. **Choose a Dataset**

   Browse available datasets or paste a data.gov.rs URL.

3. **Select Chart Type**

   The wizard suggests chart types based on your data:
   - Time series → Line chart
   - Categories → Bar chart
   - Geographic → Map
   - Parts of whole → Pie chart

4. **Map Your Data**

   Drag columns to:
   - X-axis (categories, time)
   - Y-axis (values)
   - Color (grouping)
   - Size (bubble charts)

5. **Customize Appearance**
   - Title and labels
   - Colors (Serbian government palette available)
   - Legend position
   - Axis formatting

6. **Preview and Save**

   Preview your chart, then save or export.

**Try it:** [Start Chart Wizard →](/wizard)

---

### Tutorial 3: Understanding Serbian Geographic Data (5 min)

**What you'll learn:** Create choropleth maps of Serbia.

1. **Choose Map Visualization**

   Select "Geographic Map" in the wizard.

2. **Select Geographic Level**
   - 🌍 Country (all of Serbia)
   - 📍 Districts (25 districts + Belgrade)
   - 🏘️ Municipalities (174 municipalities)

3. **Match Your Data**

   The system automatically matches:
   - "Београд" = "Belgrade" = "Beograd"
   - Cyrillic, Latin, and English all work

4. **Configure the Map**
   - Color scale (sequential, diverging)
   - Legend (values, percentiles)
   - Missing data handling

**Try it:** [Open Map Demo →](/demo/serbia-map)

---

## Developer Quickstart Path

**Goal:** Build visualizations programmatically with React.

### Tutorial 1: Installation and Setup (5 min)

**Prerequisites:** Node.js 18+, npm or yarn

```bash
# Create a new project
npx create-next-app@14 my-serbia-viz
cd my-serbia-viz

# Install Vizualni packages
npm install @vizualni/react @vizualni/charts @vizualni/data @vizualni/geo-data

# Install peer dependencies
npm install recharts d3 leaflet react-leaflet
```

**Verify installation:**

```typescript
// app/page.tsx
import { BarChart } from '@vizualni/react';
import { serbiaPopulation } from '@vizualni/geo-data/sample-data';

export default function Home() {
  return (
    <BarChart
      data={serbiaPopulation}
      x="region"
      y="population"
      title="Population by Region"
    />
  );
}
```

---

### Tutorial 2: Your First Chart Component (10 min)

**What you'll learn:** Create a chart from scratch.

**Step 1: Prepare Your Data**

```typescript
// data/budget-2024.ts
export const budget2024 = [
  { category: 'Образовање', amount: 150000000, percent: 12.5 },
  { category: 'Здравство', amount: 180000000, percent: 15.0 },
  { category: 'Одбрана', amount: 120000000, percent: 10.0 },
  { category: 'Инфраструктура', amount: 200000000, percent: 16.7 },
  { category: 'Социјална заштита', amount: 140000000, percent: 11.7 },
  { category: 'Остало', amount: 410000000, percent: 34.1 },
];
```

**Step 2: Create the Chart**

```typescript
// components/BudgetChart.tsx
'use client';

import { BarChart } from '@vizualni/react';
import { budget2024 } from '@/data/budget-2024';

export function BudgetChart() {
  return (
    <BarChart
      data={budget2024}
      x="category"
      y="amount"
      title="Буџет Републике Србије 2024"
      subtitle="По категоријама (у РСД)"
      locale="sr-Cyrl"
      options={{
        colors: ['#0D4077'], // Serbian government blue
        valueFormatter: (value) => `${(value / 1000000).toFixed(0)}M`,
      }}
    />
  );
}
```

**Step 3: Add Interactivity**

```typescript
// components/InteractiveBudgetChart.tsx
'use client';

import { useState } from 'react';
import { BarChart } from '@vizualni/react';
import { budget2024 } from '@/data/budget-2024';

export function InteractiveBudgetChart() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleBarClick = (data: { category: string }) => {
    setSelectedCategory(data.category);
  };

  const selectedData = selectedCategory
    ? budget2024.filter((d) => d.category === selectedCategory)
    : budget2024;

  return (
    <div>
      <BarChart
        data={selectedData}
        x="category"
        y="amount"
        title="Буџет Републике Србије 2024"
        onClick={handleBarClick}
        options={{
          highlightOnHover: true,
          animationDuration: 300,
        }}
      />
      {selectedCategory && (
        <button onClick={() => setSelectedCategory(null)}>
          Прикажи све категорије
        </button>
      )}
    </div>
  );
}
```

---

### Tutorial 3: Creating Geographic Maps (10 min)

**What you'll learn:** Visualize data on Serbian maps.

**Step 1: Import Geographic Data**

```typescript
import { serbiaDistricts } from '@vizualni/geo-data';
import { ChoroplethMap } from '@vizualni/react';
```

**Step 2: Prepare Your Data**

```typescript
// data/unemployment-by-district.ts
export const unemploymentByDistrict = [
  { name: 'Београд', rate: 8.2 },
  { name: 'Јужнобачки', rate: 11.5 },
  { name: 'Сремски', rate: 13.2 },
  { name: 'Нови Сад', rate: 9.8 },
  { name: 'Нишавски', rate: 15.1 },
  { name: 'Рашки', rate: 18.3 },
  // ... all 25 districts
];
```

**Step 3: Create the Map**

```typescript
// components/UnemploymentMap.tsx
'use client';

import { ChoroplethMap } from '@vizualni/react';
import { serbiaDistricts } from '@vizualni/geo-data';
import { unemploymentByDistrict } from '@/data/unemployment-by-district';

export function UnemploymentMap() {
  return (
    <ChoroplethMap
      geo={serbiaDistricts}
      data={unemploymentByDistrict}
      geoKey="name" // Property in GeoJSON
      dataKey="name" // Property in your data
      valueKey="rate"
      title="Стопа незапослености по окрузима (%)"
      locale="sr-Cyrl"
      options={{
        colorScale: 'YlOrRd', // Yellow-Orange-Red
        domain: [5, 20], // Min and max values
        noDataColor: '#e0e0e0',
        legend: {
          title: 'Незапосленост (%)',
          position: 'bottom-right',
        },
      }}
    />
  );
}
```

**Step 4: Add Interactivity**

```typescript
// components/InteractiveMap.tsx
'use client';

import { useState } from 'react';
import { ChoroplethMap } from '@vizualni/react';
import { serbiaDistricts, findFeatureByName } from '@vizualni/geo-data';
import { unemploymentByDistrict } from '@/data/unemployment-by-district';

export function InteractiveMap() {
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  const hoveredData = hoveredDistrict
    ? unemploymentByDistrict.find((d) => d.name === hoveredDistrict)
    : null;

  return (
    <div className="relative">
      <ChoroplethMap
        geo={serbiaDistricts}
        data={unemploymentByDistrict}
        geoKey="name"
        dataKey="name"
        valueKey="rate"
        onHover={(feature) => setHoveredDistrict(feature?.properties?.name)}
        onClick={(feature) => setSelectedDistrict(feature?.properties?.name)}
        options={{
          highlightOnHover: true,
          selectedFeature: selectedDistrict,
        }}
      />

      {/* Tooltip */}
      {hoveredData && (
        <div className="absolute top-4 right-4 bg-white p-4 rounded shadow-lg">
          <h3 className="font-bold">{hoveredData.name}</h3>
          <p>Незапосленост: {hoveredData.rate}%</p>
        </div>
      )}

      {/* Detail Panel */}
      {selectedDistrict && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3>Детаљи за {selectedDistrict}</h3>
          {/* Additional details */}
        </div>
      )}
    </div>
  );
}
```

---

### Tutorial 4: Connecting to data.gov.rs (5 min)

**What you'll learn:** Fetch live data from Serbia's open data portal.

```typescript
// lib/data-gov-client.ts
import { DataGovClient } from '@vizualni/connectors';

export const dataGovClient = new DataGovClient({
  baseUrl: 'https://data.gov.rs/api/1',
  language: 'sr', // or 'en'
});

// Search datasets
export async function searchDatasets(query: string) {
  const results = await dataGovClient.searchDatasets({
    q: query,
    rows: 20,
  });
  return results;
}

// Get a specific dataset
export async function getDataset(id: string) {
  const dataset = await dataGovClient.getDataset(id);
  return dataset;
}

// Fetch dataset resources (CSV, JSON, etc.)
export async function getDatasetResources(id: string) {
  const resources = await dataGovClient.getDatasetResources(id);
  return resources;
}
```

**Example: Fetch and visualize population data**

```typescript
// components/LivePopulationChart.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { BarChart } from '@vizualni/react';
import { dataGovClient } from '@/lib/data-gov-client';

export function LivePopulationChart() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['population-dataset'],
    queryFn: () => dataGovClient.getDatasetResources('population-by-region'),
  });

  if (isLoading) return <div>Учитавање...</div>;
  if (error) return <div>Грешка при учитавању података</div>;

  return (
    <BarChart
      data={data}
      x="region"
      y="population"
      title="Популација по регионима"
      dataSource="data.gov.rs"
    />
  );
}
```

---

## Government Integration Path

**Goal:** Deploy dashboards for government agencies.

### Tutorial 1: Creating a Dashboard (15 min)

**What you'll learn:** Build a multi-chart dashboard.

```typescript
// app/dashboard/page.tsx
import { BarChart, LineChart, PieChart, ChoroplethMap } from '@vizualni/react';
import { serbiaDistricts } from '@vizualni/geo-data';
import {
  budgetData,
  populationTrend,
  categoryBreakdown,
  regionalData,
} from '@/data/agency-data';

export default function AgencyDashboard() {
  return (
    <div className="grid grid-cols-2 gap-6 p-6">
      {/* Header */}
      <div className="col-span-2">
        <h1>Контролна табла агенције</h1>
        <p>Последње ажурирање: {new Date().toLocaleDateString('sr-RS')}</p>
      </div>

      {/* KPI Cards */}
      <div className="col-span-2 grid grid-cols-4 gap-4">
        <KPICard title="Укупан буџет" value="1.2B РСД" change="+5%" />
        <KPICard title="Пројекти" value="156" change="+12" />
        <KPICard title="Запослени" value="423" change="-3" />
        <KPICard title="Ефикасност" value="87%" change="+2%" />
      </div>

      {/* Charts */}
      <div className="col-span-1">
        <BarChart
          data={budgetData}
          x="quarter"
          y="spent"
          title="Потрошња по кварталима"
        />
      </div>

      <div className="col-span-1">
        <LineChart
          data={populationTrend}
          x="year"
          y="value"
          title="Тренд индикатора"
        />
      </div>

      <div className="col-span-1">
        <PieChart
          data={categoryBreakdown}
          category="name"
          value="amount"
          title="Расподела по категоријама"
        />
      </div>

      <div className="col-span-1">
        <ChoroplethMap
          geo={serbiaDistricts}
          data={regionalData}
          title="Регионална дистрибуција"
        />
      </div>
    </div>
  );
}
```

---

### Tutorial 2: Export and Sharing (15 min)

**What you'll learn:** Export charts for reports and presentations.

```typescript
// components/ExportableChart.tsx
'use client';

import { useRef } from 'react';
import { BarChart, ExportButton } from '@vizualni/react';
import { toPdf, toPng, toSvg } from '@vizualni/export';

export function ExportableChart() {
  const chartRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = async () => {
    await toPdf(chartRef.current, {
      filename: 'serbia-budget-2024.pdf',
      title: 'Буџет Републике Србије 2024',
      author: 'Ваше име',
      locale: 'sr-Cyrl',
    });
  };

  const handleExportPNG = async () => {
    await toPng(chartRef.current, {
      filename: 'serbia-budget-2024.png',
      scale: 2, // High resolution
    });
  };

  const handleExportSVG = async () => {
    await toSvg(chartRef.current, {
      filename: 'serbia-budget-2024.svg',
    });
  };

  return (
    <div>
      <div ref={chartRef}>
        <BarChart
          data={budgetData}
          x="category"
          y="amount"
          title="Буџет Републике Србије 2024"
        />
      </div>

      <div className="flex gap-2 mt-4">
        <ExportButton onClick={handleExportPDF} format="pdf" />
        <ExportButton onClick={handleExportPNG} format="png" />
        <ExportButton onClick={handleExportSVG} format="svg" />
      </div>
    </div>
  );
}
```

---

### Tutorial 3: Accessibility Compliance (15 min)

**What you'll learn:** Ensure WCAG 2.1 AA compliance.

```typescript
// components/AccessibleChart.tsx
'use client';

import { BarChart } from '@vizualni/react';
import { budgetData } from '@/data/budget-data';

export function AccessibleChart() {
  return (
    <BarChart
      data={budgetData}
      x="category"
      y="amount"
      title="Буџет Републике Србије 2024"
      // Accessibility options
      options={{
        // Color contrast (WCAG AA minimum 4.5:1)
        colors: ['#0D4077', '#1E5A9E', '#3574B5', '#4C8ECC'],

        // Screen reader support
        ariaLabel: 'Графикон буџета по категоријама',
        ariaDescription:
          'Овај графикон приказује расподелу буџета по категоријама. Највећа категорија је образовање са 150 милиона РСД.',

        // Keyboard navigation
        tabIndex: 0,
        focusableDataPoints: true,

        // High contrast mode
        highContrastColors: ['#000000', '#1A1A1A', '#333333', '#4D4D4D'],

        // Reduced motion
        reducedMotion: true,

        // Text alternatives
        dataTable: true, // Shows data table below chart
      }}
    />
  );
}
```

---

## Data Journalism Path

**Goal:** Create compelling data stories for publication.

### Tutorial 1: Finding Stories in Data (15 min)

**What you'll learn:** Use data to uncover narratives.

**Step 1: Explore Multiple Datasets**

```typescript
// scripts/analyze-data.ts
import { dataGovClient } from '@vizualni/connectors';
import { classifyColumns, findAnomalies } from '@vizualni/data';

async function analyzeDataset(datasetId: string) {
  const data = await dataGovClient.getDatasetResources(datasetId);

  // Classify columns
  const { dimensions, measures, temporal, geographic } = classifyColumns(data);

  console.log('Dimensions:', dimensions); // Categories
  console.log('Measures:', measures); // Numeric values
  console.log('Temporal:', temporal); // Time columns
  console.log('Geographic:', geographic); // Location columns

  // Find anomalies
  const anomalies = findAnomalies(data, measures[0]);
  console.log('Potential story angles:', anomalies);

  return { dimensions, measures, anomalies };
}
```

**Step 2: Compare Over Time**

```typescript
// components/YearOverYearComparison.tsx
'use client';

import { useState } from 'react';
import { LineChart } from '@vizualni/react';
import { budgetData2023, budgetData2024 } from '@/data/budget';

export function YearOverYearComparison() {
  const [selectedCategory, setSelectedCategory] = useState('education');

  return (
    <div>
      <CategorySelector
        value={selectedCategory}
        onChange={setSelectedCategory}
      />

      <LineChart
        data={[budgetData2023, budgetData2024]}
        x="month"
        y="amount"
        series="year"
        title={`Поређење буџета за ${selectedCategory}`}
        options={{
          comparisonMode: true,
          showDifference: true,
          highlightChanges: true,
        }}
      />

      <div className="mt-4">
        <h3>Кључни налази:</h3>
        <ul>
          <li>Повећање за образовање: +15% у односу на 2023.</li>
          <li>Смањење за инфраструктуру: -8% у односу на 2023.</li>
        </ul>
      </div>
    </div>
  );
}
```

---

### Tutorial 2: Building a Data Story (30 min)

**What you'll learn:** Combine charts into a narrative.

```typescript
// app/stories/budget-2024/page.tsx
import { BarChart, LineChart, ChoroplethMap, Quote, Text } from '@vizualni/react';
import { serbiaDistricts } from '@vizualni/geo-data';

export default function BudgetStory() {
  return (
    <article className="max-w-4xl mx-auto">
      {/* Headline */}
      <header className="mb-8">
        <h1>Буџет Србије 2024: Где одлази ваш новац?</h1>
        <p className="text-gray-600">
          Анализа расподеле буџета по категоријама и регионима
        </p>
      </header>

      {/* Lead */}
      <Text variant="lead">
        Република Србија ће у 2024. години потрошити 1.2 милијарде евра. Наша
        анализа показује да се највећи део средстава усмерава на образовање и
        здравство, док инфраструктура добија мање него претходних година.
      </Text>

      {/* First visualization */}
      <section className="my-12">
        <h2>Како је подељен буџет?</h2>
        <BarChart
          data={budgetByCategory}
          x="category"
          y="amount"
          title="Буџет по категоријама 2024."
          options={{
            horizontal: true,
            sortByValue: true,
          }}
        />
        <Text variant="caption">
          Извор: Министарство финансија Републике Србије
        </Text>
      </section>

      {/* Quote */}
      <Quote author="Име Презиме" title="Економиста">
        Овај буџет показује фокус на социјалне програме, али питање је да ли
        је довољно уложено у инфраструктуру.
      </Quote>

      {/* Second visualization */}
      <section className="my-12">
        <h2>Како се буџет мењао кроз време?</h2>
        <LineChart
          data={budgetTrend}
          x="year"
          y="amount"
          series="category"
          title="Тренд буџета по категоријама (2019-2024)"
          options={{
            showTrendline: true,
            highlightLastPoint: true,
          }}
        />
      </section>

      {/* Third visualization - Geographic */}
      <section className="my-12">
        <h2>Где се највише улаже?</h2>
        <ChoroplethMap
          geo={serbiaDistricts}
          data={regionalSpending}
          title="Расподела буџета по окрузима"
        />
        <Text>
          Београд добија највећи део средстава, што је у складу са бројем
          становника. Међутим, по глави становника, војвођански окрузи
          добијају више од осталих делова земље.
        </Text>
      </section>

      {/* Conclusion */}
      <section className="my-12 p-6 bg-gray-100 rounded">
        <h2>Закључак</h2>
        <Text>
          Буџет за 2024. годину показује континуирано улагање у социјалне
          програме, док инфраструктура заостаје. Питање за јавну расправу:
          да ли је ова расподела оптимална за развој земље?
        </Text>
      </section>

      {/* Data sources */}
      <footer className="mt-12 text-sm text-gray-500">
        <h3>Извори података</h3>
        <ul>
          <li>Министарство финансија РС - Буџет за 2024. годину</li>
          <li>РЗС - Статистички годишњак 2023</li>
          <li>data.gov.rs - Отворени подаци</li>
        </ul>
      </footer>
    </article>
  );
}
```

---

### Tutorial 3: Embedding in Articles (15 min)

**What you'll learn:** Embed visualizations in external platforms.

**Option 1: Embed Code**

```html
<iframe
  src="https://vizuelni-admin.rs/embed/budget-2024"
  width="800"
  height="500"
  frameborder="0"
  title="Буџет Србије 2024"
></iframe>
```

**Option 2: React Component**

```typescript
// For React-based CMS (WordPress, etc.)
import { BudgetChart } from '@vizualni/react/embed';

<BudgetChart
  datasetId="budget-2024"
  locale="sr-Cyrl"
  interactive={true}
/>
```

**Option 3: Static Image with Data Link**

```typescript
import { BarChart } from '@vizualni/react';

<BarChart
  data={budgetData}
  x="category"
  y="amount"
  options={{
    showDataLink: true,
    dataUrl: 'https://data.gov.rs/dataset/budget-2024',
  }}
/>
```

---

## Troubleshooting

### Common Issues

**Chart not rendering:**

- Check that data is in the correct format
- Verify that x and y keys exist in your data
- Check browser console for errors

**Geographic map not showing:**

- Ensure GeoJSON is loaded correctly
- Verify that data keys match GeoJSON properties
- Check that region names are spelled correctly (Cyrillic/Latin)

**data.gov.rs connection failing:**

- Check your internet connection
- Verify the API endpoint is correct
- Check for CORS issues (use server-side fetching)

### Getting Help

- 📖 [Documentation](/docs)
- 💬 [Discord Community](https://discord.gg/vizualni-admin)
- 🐛 [Report Issues](https://github.com/your-org/vizuelni-admin-srbije/issues)
- 📧 [Email Support](mailto:opendata@ite.gov.rs)

---

## Next Steps

After completing these tutorials, you're ready to:

1. **Explore the API Reference** — Deep dive into all available options
2. **Join the Community** — Connect with other users and contributors
3. **Share Your Work** — Add your visualizations to the gallery
4. **Contribute** — Help improve the platform

**Ready to build?** [Start the Chart Wizard →](/wizard)
