# StackBlitz Demo Setup

> **Try Vizuelni Admin Srbije in your browser - no installation required**

This guide sets up a working demo environment on StackBlitz so users can try the platform immediately.

---

## Quick Start

### Option 1: One-Click Demo (Recommended)

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/your-org/vizuelni-admin-srbije-demo)

Opens a fully configured demo with:

- Sample Serbian datasets
- Pre-built example charts
- Interactive playground
- No sign-in required

### Option 2: Manual Setup

```bash
# 1. Create new StackBlitz project
# Visit: https://stackblitz.com/new

# 2. Select "Next.js" template

# 3. Add dependencies in package.json:
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "recharts": "^2.10.0",
    "@tanstack/react-table": "^8.11.0"
  }
}
```

---

## Demo Configuration

### stackblitz.json

```json
{
  "name": "vizuelni-admin-srbije-demo",
  "description": "Визуелни Административни Подаци Србије - Demo",
  "template": "nextjs",
  "startCommand": "npm run dev",
  "installCommand": "npm install",
  "openFiles": ["app/page.tsx", "app/demo/README.md"]
}
```

### Demo Data Files

#### data/sample-budget.csv

```csv
region,year,budget_millions
Град Београд,2024,150.5
Јужнобачки,2024,45.2
Сремски,2024,32.1
Новосадски,2024,28.9
```

#### data/sample-population.csv

```csv
municipality,population_2021,area_km2
Београд,1385000,3222
Нови Сад,260000,129
Ниш,185000,596
Крагујевац,150000,835
```

---

## Demo Features

### 1. Quick Chart Creator

```tsx
// app/demo/page.tsx
'use client';

import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const sampleData = [
  { name: 'Београд', value: 1385000 },
  { name: 'Нови Сад', value: 260000 },
  { name: 'Ниш', value: 185000 },
  { name: 'Крагујевац', value: 150000 },
];

export default function DemoPage() {
  const [data] = useState(sampleData);

  return (
    <div className='p-8'>
      <h1 className='text-2xl font-bold mb-4'>Визуелни Admin Србије - Demo</h1>

      <div className='h-[400px] w-full border rounded-lg p-4'>
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />
            <Bar dataKey='value' fill='#2563eb' />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className='mt-4 text-gray-600'>
        This is a live demo. Try editing the data in the code!
      </p>
    </div>
  );
}
```

### 2. Interactive Playground

```tsx
// app/demo/playground/page.tsx
'use client';

import { useState } from 'react';

export default function PlaygroundPage() {
  const [input, setInput] = useState(`name,value
Београд,1385000
Нови Сад,260000
Ниш,185000`);

  const [chartType, setChartType] = useState('bar');

  const parsedData = input
    .split('\n')
    .slice(1)
    .map((line) => {
      const [name, value] = line.split(',');
      return { name, value: parseInt(value) };
    });

  return (
    <div className='p-8 grid grid-cols-2 gap-8'>
      <div>
        <h2 className='font-bold mb-2'>Edit Data (CSV)</h2>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className='w-full h-64 font-mono p-2 border rounded'
        />

        <h2 className='font-bold mt-4 mb-2'>Chart Type</h2>
        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
          className='border rounded p-2'
        >
          <option value='bar'>Bar Chart</option>
          <option value='line'>Line Chart</option>
          <option value='pie'>Pie Chart</option>
        </select>
      </div>

      <div>
        <h2 className='font-bold mb-2'>Preview</h2>
        {/* Chart renders here */}
        <div className='h-64 border rounded flex items-center justify-center'>
          Chart Type: {chartType}
          <br />
          Data Points: {parsedData.length}
        </div>
      </div>
    </div>
  );
}
```

---

## Demo Scenarios

### Scenario 1: Budget Visualization

**Goal:** Show budget distribution by region

**Steps:**

1. Click "Open in StackBlitz"
2. Navigate to `/demo/budget`
3. See pre-built chart
4. Modify values in CSV
5. Watch chart update live

### Scenario 2: Population Comparison

**Goal:** Compare population across cities

**Steps:**

1. Navigate to `/demo/population`
2. Interactive bar chart
3. Hover for details
4. Click regions to filter

### Scenario 3: Custom Data Upload

**Goal:** Visualize your own data

**Steps:**

1. Navigate to `/demo/playground`
2. Paste CSV data
3. Select chart type
4. See instant visualization

---

## Embedding Demo in Documentation

### HTML Embed

```html
<iframe
  src="https://stackblitz.com/github/your-org/vizuelni-admin-srbije-demo?embed=1&file=app/page.tsx"
  width="100%"
  height="500"
  frameborder="0"
></iframe>
```

### Markdown Link

```markdown
[![Open Demo](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/your-org/vizuelni-admin-srbije-demo)
```

---

## Demo Limitations

| Feature         | StackBlitz Demo | Full Platform       |
| --------------- | --------------- | ------------------- |
| Sample data     | ✅ Included     | ✅ + Your data      |
| Chart types     | 3 basic         | 15+ types           |
| Geographic maps | ❌ Limited      | ✅ Full Serbia      |
| PDF Export      | ❌ No           | ✅ Yes              |
| Save charts     | ❌ Session only | ✅ Persistent       |
| Authentication  | ❌ None         | ✅ Full OAuth       |
| API access      | ❌ Mock data    | ✅ Real data.gov.rs |

---

## Demo Repository Structure

```
vizuelni-admin-srbije-demo/
├── app/
│   ├── page.tsx              # Landing page
│   ├── demo/
│   │   ├── page.tsx          # Main demo
│   │   ├── budget/page.tsx   # Budget example
│   │   ├── population/       # Population example
│   │   └── playground/       # Interactive playground
│   └── layout.tsx
├── data/
│   ├── sample-budget.csv
│   ├── sample-population.csv
│   └── sample-regions.json
├── components/
│   ├── Chart.tsx
│   └── DataTable.tsx
├── package.json
├── stackblitz.json
└── README.md
```

---

## Creating Your Demo

### Step 1: Fork Repository

```bash
# Fork on GitHub, then:
git clone https://github.com/YOUR-USERNAME/vizuelni-admin-srbije-demo
cd vizuelni-admin-srbije-demo
```

### Step 2: Configure StackBlitz

Create `.stackblitzrc`:

```json
{
  "startCommand": "npm run dev",
  "installDependencies": true,
  "openFile": "app/demo/page.tsx"
}
```

### Step 3: Add Demo Data

Place sample CSV files in `/data`:

- Keep files small (< 100KB)
- Use Serbian data examples
- Include Cyrillic text

### Step 4: Test Locally

```bash
npm install
npm run dev
# Visit http://localhost:3000/demo
```

### Step 5: Deploy to StackBlitz

1. Push to GitHub
2. Visit: `https://stackblitz.com/github/YOUR-USERNAME/vizuelni-admin-srbije-demo`
3. Verify everything works
4. Share the link!

---

## Troubleshooting Demo Issues

### "Demo won't load"

**Cause:** Large dependencies or slow connection

**Solution:**

```json
// package.json - minimize dependencies
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "recharts": "^2.10.0"
    // Only essential packages
  }
}
```

### "Charts not rendering"

**Cause:** Missing ResponsiveContainer or height

**Solution:**

```tsx
// Always wrap charts
<div style={{ height: '400px', width: '100%' }}>
  <ResponsiveContainer>{/* Chart here */}</ResponsiveContainer>
</div>
```

### "Cyrillic text shows as boxes"

**Cause:** Font not loaded

**Solution:**

```css
/* app/globals.css */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap');

body {
  font-family: 'Noto Sans', sans-serif;
}
```

---

## Analytics & Tracking

Track demo usage with:

```typescript
// lib/analytics.ts
export function trackDemoEvent(action: string, metadata?: object) {
  // Plausible, Fathom, or similar
  plausible('demo_interaction', {
    props: { action, ...metadata },
  });
}

// Usage
trackDemoEvent('chart_created', { type: 'bar', dataPoints: 5 });
```

---

## Next Steps

1. **Try the demo:** [stackblitz.com/...](https://stackblitz.com/github/your-org/vizuelni-admin-srbije-demo)
2. **Read tutorials:** [Tutorials Guide](./TUTORIALS_GUIDE.md)
3. **Join community:** [Community Infrastructure](./COMMUNITY_INFRASTRUCTURE.md)
4. **Start building:** [Chart Plugin Guide](./CHART_PLUGIN_GUIDE.md)

---

_Demo last updated: March 2026_
