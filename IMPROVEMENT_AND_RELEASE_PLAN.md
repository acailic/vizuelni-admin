# Vizualni Admin - Comprehensive Improvement & Release Plan

**Objective**: Transform vizualni-admin into a production-ready, client-friendly npm package with rich Serbian dataset integration and amplifier-powered knowledge synthesis capabilities.

**Timeline**: 8 weeks (January 2025 - February 2025)
**Current Version**: 0.1.0-beta.1
**Target Version**: 1.0.0 (stable release)

---

## Executive Summary

This plan outlines the pathway from the current beta state to a stable 1.0.0 release that clients can confidently use for Serbian open data visualization. The improvements focus on:

1. **Real Dataset Integration** - Expanding from 4 working datasets to 50+ across all categories
2. **Client Experience** - Creating intuitive onboarding, configuration, and customization workflows
3. **Package Quality** - Professional npm package with proper versioning, documentation, and support
4. **Performance** - Optimizing for large datasets (100K+ rows) with progressive loading
5. **Amplifier Integration** - Leveraging knowledge synthesis for automated dataset discovery and insights

---

## Phase 1: Foundation & Analysis (Week 1-2)

### 1.1 Current State Assessment

**Completed Features** ✅:
- Serbian/English bilingual UI
- uData API integration (migrated from CKAN)
- Excel/CSV/JSON parsing
- 15 demo categories defined
- GitHub Pages deployment
- Tutorial system
- Storybook component library

**Working Demos** (4/15):
- ✅ Air Quality (PM10, PM2.5 data)
- ✅ Environment (air quality focus)
- ⚠️ Digital (limited data)
- ⚠️ Economy (limited data)

**Missing/Incomplete** (11/15):
- ❌ Budget (no datasets connected)
- ❌ Demographics (no datasets connected)
- ❌ Education (dataset IDs listed but not tested)
- ❌ Employment (no datasets connected)
- ❌ Energy (sample data only)
- ❌ Healthcare (no datasets connected)
- ❌ Transport (no datasets connected)
- ❌ Climate (no datasets connected)
- ❌ Social Media (showcase only, not data-driven)
- ❌ Presentation modes (static samples)
- ❌ Dynamic category routing

### 1.2 Gap Analysis for Client Readiness

| Requirement | Current State | Target State | Priority |
|------------|---------------|--------------|----------|
| Dataset Coverage | 4/15 categories | 15/15 categories with real data | HIGH |
| Data Freshness | Manual dataset selection | Automatic discovery + updates | HIGH |
| Client Onboarding | None | Step-by-step wizard | HIGH |
| Configuration | Code-level only | GUI + config files | HIGH |
| Error Handling | Basic | Comprehensive with recovery | MEDIUM |
| Performance (100K rows) | Untested | <2s render time | MEDIUM |
| Embedding | Basic iframe | Rich embed with customization | MEDIUM |
| Documentation | Technical dev docs | Client-facing guides + videos | HIGH |
| Package Exports | Minimal | Full component library | LOW |
| Type Safety | Partial | 100% TypeScript coverage | LOW |

---

## Phase 2: Dataset Integration & Validation (Week 2-4)

### 2.1 Automated Dataset Discovery

**Goal**: Build amplifier-powered dataset discovery system that automatically finds, validates, and ranks datasets for each category.

**Implementation**:

```bash
# New amplifier tool: Dataset Discovery CLI
amplifier/scenarios/dataset_discovery/
├── discover_datasets.py          # Main discovery engine
├── data_quality_scorer.py        # Quality validation
├── dataset_ranker.py              # Relevance ranking
├── category_matcher.py            # Category assignment
└── README.md                      # Usage guide
```

**Features**:
1. **Query Expansion**: Use amplifier knowledge synthesis to expand search terms
   - Example: "budget" → ["budžet", "javne finansije", "prihodi", "rashodi", "državni budžet"]
   - Handles Serbian diacritics, synonyms, and domain-specific terminology

2. **Quality Scoring**: Evaluate datasets on:
   - Data completeness (% non-null values)
   - Temporal coverage (date ranges, frequency)
   - Format quality (CSV/JSON preferred over XLS)
   - Metadata richness (descriptions, tags, documentation)
   - Update frequency (last modified, update schedule)
   - Organization reputation (government agencies ranked higher)

3. **Automatic Validation**:
   - Download sample data (first 1000 rows)
   - Parse and validate structure
   - Check for required columns (dates, numeric values)
   - Test with visualization components
   - Generate preview charts

4. **Ranking Algorithm**:
   ```python
   score = (
       relevance_score * 0.3 +      # Keyword matching
       quality_score * 0.3 +         # Data quality metrics
       popularity_score * 0.2 +      # Download/view counts
       freshness_score * 0.2         # Recent updates
   )
   ```

### 2.2 Category-Specific Dataset Goals

| Category | Target Datasets | Search Strategy | Data Sources |
|----------|----------------|-----------------|--------------|
| Budget | 5 datasets | Tags: `budzet`, `javne-finansije`<br>Keywords: Budget line items, revenues, expenditures | Ministry of Finance |
| Demographics | 10 datasets | Tags: `stanovnistvo`, `demografija`<br>Keywords: Population census, age structure, migration | Statistical Office |
| Education | 8 datasets | Tags: `obrazovanje`, `skole`<br>Keywords: Enrollment, schools, students, teachers | Ministry of Education |
| Employment | 6 datasets | Tags: `zapošljavanje`, `tržište-rada`<br>Keywords: Unemployment, jobs, wages, labor force | Employment Bureau |
| Energy | 5 datasets | Tags: `energija`, `struja`<br>Keywords: Power generation, consumption, renewables | Ministry of Energy |
| Healthcare | 7 datasets | Tags: `zdravstvo`, `bolnice`<br>Keywords: Hospitals, patients, diseases, resources | Healthcare Institute |
| Transport | 5 datasets | Tags: `saobraćaj`, `transport`<br>Keywords: Traffic, public transport, accidents | Traffic Authority |
| Climate | 8 datasets | Tags: `klima`, `vreme`<br>Keywords: Temperature, precipitation, climate change | Meteorology Service |
| Environment | 10 datasets (expand) | Tags: `životna-sredina`, `zagađenje`<br>Keywords: Air quality, water, waste, biodiversity | Environmental Agency |
| Digital | 5 datasets | Tags: `digitalizacija`, `internet`<br>Keywords: Internet usage, digital services, connectivity | Telecom Regulator |
| Economy | 8 datasets | Tags: `ekonomija`, `GDP`<br>Keywords: GDP, inflation, trade, investments | National Bank |
| Social Media | N/A | Showcase category (social sharing features) | - |

**Total Target**: 77+ unique datasets across 11 data categories

### 2.3 Dataset Validation Pipeline

```python
# amplifier/scenarios/dataset_validation/validate_pipeline.py

class DatasetValidationPipeline:
    """
    Multi-stage validation for discovered datasets
    """

    def __init__(self, dataset_id: str, category: str):
        self.dataset_id = dataset_id
        self.category = category
        self.validation_results = {}

    async def run_full_validation(self):
        """Run all validation stages"""
        stages = [
            self.validate_accessibility,
            self.validate_format,
            self.validate_schema,
            self.validate_data_quality,
            self.validate_visualization_compatibility,
            self.generate_preview
        ]

        for stage in stages:
            result = await stage()
            if not result.passed:
                return ValidationResult(
                    passed=False,
                    stage_failed=stage.__name__,
                    error=result.error
                )

        return ValidationResult(passed=True)
```

**Output**: `app/lib/demos/validated-datasets.json`

```json
{
  "budget": [
    {
      "id": "abc123...",
      "title": "Budžet Republike Srbije 2024",
      "score": 0.95,
      "quality_metrics": {
        "completeness": 0.98,
        "temporal_coverage": "2020-2024",
        "format": "CSV",
        "last_updated": "2024-11-15"
      },
      "preview_chart": "https://example.com/preview.png",
      "recommended": true
    }
  ]
}
```

### 2.4 Continuous Dataset Monitoring

**Setup**: GitHub Actions workflow to run discovery weekly

```yaml
# .github/workflows/dataset-discovery.yml
name: Dataset Discovery & Validation

on:
  schedule:
    - cron: '0 0 * * 0'  # Every Sunday
  workflow_dispatch:      # Manual trigger

jobs:
  discover:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Dataset Discovery
        run: |
          python amplifier/scenarios/dataset_discovery/discover_datasets.py \
            --categories all \
            --min-score 0.7 \
            --output app/lib/demos/validated-datasets.json

      - name: Create PR with Updates
        if: ${{ success() }}
        uses: peter-evans/create-pull-request@v5
        with:
          title: "🔄 Weekly Dataset Discovery Update"
          body: "Automated dataset discovery found new or updated datasets"
          branch: dataset-updates
```

---

## Phase 3: Client Experience & Onboarding (Week 3-5)

### 3.1 Installation Wizard

**Goal**: Transform from developer-first to client-first experience.

**New First-Time User Flow**:

```tsx
// app/pages/onboarding/index.tsx

export default function OnboardingWizard() {
  const steps = [
    {
      id: 'welcome',
      title: 'Dobrodošli u Vizualni Admin',
      component: <WelcomeStep />
    },
    {
      id: 'language',
      title: 'Izaberite jezik / Choose Language',
      component: <LanguageSelection />
    },
    {
      id: 'categories',
      title: 'Koje kategorije podataka vas interesuju?',
      component: <CategorySelection />
    },
    {
      id: 'datasets',
      title: 'Pregledajte preporučene skupove podataka',
      component: <DatasetBrowser />
    },
    {
      id: 'customize',
      title: 'Prilagodite izgled',
      component: <ThemeCustomization />
    },
    {
      id: 'deploy',
      title: 'Spremno za korišćenje',
      component: <DeploymentOptions />
    }
  ];

  return <StepperWizard steps={steps} />;
}
```

**Features**:
- Language selection (Serbian/English)
- Category interest picker (multi-select)
- Dataset preview and selection
- Color theme customization (light/dark/custom)
- Deployment options (local dev, GitHub Pages, custom domain)
- Generated configuration file (`vizualni-admin.config.json`)

### 3.2 Configuration System

**Move from code to config**:

```json
// vizualni-admin.config.json
{
  "project": {
    "name": "My Vizualni Admin Instance",
    "language": "sr",
    "theme": "dark"
  },
  "categories": {
    "enabled": ["budget", "environment", "healthcare"],
    "featured": ["environment"]
  },
  "datasets": {
    "autoDiscovery": true,
    "manualIds": {
      "budget": ["abc123..."],
      "environment": ["def456..."]
    }
  },
  "visualization": {
    "defaultChartType": "line",
    "colorPalette": "custom",
    "customColors": ["#FF6B6B", "#4ECDC4", "#45B7D1"]
  },
  "features": {
    "embedding": true,
    "export": true,
    "sharing": true,
    "tutorials": true
  },
  "deployment": {
    "basePath": "/vizualni-admin",
    "customDomain": "data.example.rs"
  }
}
```

**Configuration UI** (`/config`):
- Visual editor for all settings
- Live preview of changes
- Import/export configurations
- Reset to defaults
- Validation and error hints

### 3.3 Client Dashboard

**New Landing Page** (`/dashboard`):

```tsx
// app/pages/dashboard/index.tsx

export default function ClientDashboard() {
  return (
    <DashboardLayout>
      <WelcomeCard />
      <QuickStats />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <CategoryOverview />
        </Grid>
        <Grid item xs={12} md={6}>
          <RecentVisualizations />
        </Grid>
        <Grid item xs={12} md={6}>
          <DatasetHealth />
        </Grid>
        <Grid item xs={12} md={6}>
          <QuickActions />
        </Grid>
      </Grid>

      <TutorialCarousel />
    </DashboardLayout>
  );
}
```

**Dashboard Components**:
- **Welcome Card**: Personalized greeting, quick tips
- **Quick Stats**: Visualizations created, datasets connected, last update
- **Category Overview**: Enabled categories with health indicators
- **Recent Visualizations**: Last 5 created charts with thumbnails
- **Dataset Health**: Status of connected datasets (online, stale, error)
- **Quick Actions**: Create visualization, explore datasets, customize theme
- **Tutorial Carousel**: Context-sensitive help and tips

---

## Phase 4: Package Quality & Distribution (Week 4-6)

### 4.1 NPM Package Structure

**Current Issues**:
- Beta version (0.1.0-beta.1)
- Minimal exports (only dist files)
- No usage examples
- No TypeScript definitions for config
- No CLI tools

**Improvements**:

```
@acailic/vizualni-admin/
├── dist/                          # Compiled outputs
│   ├── acailic-vizualni-admin.cjs.js
│   ├── acailic-vizualni-admin.esm.js
│   ├── acailic-vizualni-admin.cjs.d.ts
│   └── acailic-vizualni-admin.esm.d.ts
├── bin/                           # CLI tools
│   ├── vizualni-admin            # Main CLI
│   ├── va-init                   # Project initializer
│   ├── va-discover               # Dataset discovery
│   └── va-build                  # Build & deploy
├── components/                    # React component exports
│   ├── charts/                   # All chart components
│   ├── dashboard/                # Dashboard components
│   └── index.ts                  # Barrel export
├── config/                        # Configuration utilities
│   ├── schema.json               # JSON schema for validation
│   ├── defaults.ts               # Default configuration
│   └── validator.ts              # Config validation
├── types/                         # TypeScript definitions
│   ├── config.d.ts
│   ├── dataset.d.ts
│   └── index.d.ts
├── locales/                       # Translation files
│   ├── sr/
│   └── en/
├── examples/                      # Usage examples
│   ├── basic/
│   ├── custom-theme/
│   ├── embedded/
│   └── github-pages/
├── docs/                          # Client documentation
│   ├── getting-started.md
│   ├── configuration.md
│   ├── embedding.md
│   └── api-reference.md
├── README.md                      # Main package README
├── CHANGELOG.md                   # Version history
├── LICENSE                        # BSD-3-Clause
└── package.json                   # Package manifest
```

### 4.2 CLI Tools

**`vizualni-admin` CLI**:

```bash
# Initialize new project
npx @acailic/vizualni-admin init my-project
cd my-project
npm start

# Discover datasets for a category
vizualni-admin discover --category budget --min-score 0.8

# Validate configuration
vizualni-admin validate config.json

# Build for production
vizualni-admin build --target github-pages

# Deploy to GitHub Pages
vizualni-admin deploy --platform github-pages
```

**Implementation**:

```typescript
// bin/vizualni-admin.ts

import { Command } from 'commander';
import { initCommand } from './commands/init';
import { discoverCommand } from './commands/discover';
import { validateCommand } from './commands/validate';
import { buildCommand } from './commands/build';

const program = new Command();

program
  .name('vizualni-admin')
  .description('CLI tools for Vizualni Admin')
  .version('1.0.0');

program
  .command('init <project-name>')
  .description('Initialize a new Vizualni Admin project')
  .option('-t, --template <name>', 'Use a template', 'default')
  .option('-l, --language <lang>', 'Default language', 'sr')
  .action(initCommand);

program
  .command('discover')
  .description('Discover datasets from data.gov.rs')
  .option('-c, --category <name>', 'Category to search')
  .option('--min-score <number>', 'Minimum quality score', '0.7')
  .option('-o, --output <file>', 'Output file', 'datasets.json')
  .action(discoverCommand);

// ... more commands

program.parse();
```

### 4.3 Component Library Exports

**Export all reusable components**:

```typescript
// components/index.ts

// Chart Components
export { LineChart } from './charts/LineChart';
export { BarChart } from './charts/BarChart';
export { PieChart } from './charts/PieChart';
export { MapChart } from './charts/MapChart';
export { ScatterPlot } from './charts/ScatterPlot';
export { Heatmap } from './charts/Heatmap';

// Dashboard Components
export { DashboardLayout } from './dashboard/DashboardLayout';
export { CategoryCard } from './dashboard/CategoryCard';
export { DatasetPreview } from './dashboard/DatasetPreview';
export { QuickStats } from './dashboard/QuickStats';

// Utility Components
export { DataLoader } from './utils/DataLoader';
export { ChartExporter } from './utils/ChartExporter';
export { EmbedCode } from './utils/EmbedCode';
export { ThemeSwitcher } from './utils/ThemeSwitcher';

// Types
export type {
  ChartConfig,
  Dataset,
  VisualizationConfig,
  ThemeConfig
} from '../types';
```

**Usage Example**:

```tsx
// Client's app
import { LineChart, DashboardLayout, DataLoader } from '@acailic/vizualni-admin';

function MyApp() {
  return (
    <DashboardLayout>
      <DataLoader datasetId="abc123">
        {(data) => (
          <LineChart
            data={data}
            xField="date"
            yField="value"
            title="My Chart"
          />
        )}
      </DataLoader>
    </DashboardLayout>
  );
}
```

### 4.4 Versioning & Release Process

**Semantic Versioning**:
- **1.0.0**: First stable release
- **1.x.0**: New features (backward compatible)
- **1.0.x**: Bug fixes
- **2.0.0**: Breaking changes

**Release Checklist**:

```markdown
# Release Checklist for v1.0.0

## Pre-release
- [ ] All tests passing (unit, integration, e2e)
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version bumped in package.json
- [ ] Breaking changes documented
- [ ] Migration guide written (if breaking changes)
- [ ] Examples updated and tested
- [ ] TypeScript types validated
- [ ] Bundle size checked (<500KB gzipped)
- [ ] Performance benchmarks met

## Release
- [ ] Create git tag (v1.0.0)
- [ ] Build npm package (`yarn build:npm`)
- [ ] Publish to npm (`yarn release:npm`)
- [ ] Create GitHub release with notes
- [ ] Update documentation site
- [ ] Announce on social media

## Post-release
- [ ] Monitor npm download stats
- [ ] Watch for issues/bug reports
- [ ] Update roadmap
- [ ] Plan next minor version (v1.1.0)
```

**Automated Release** (GitHub Actions):

```yaml
# .github/workflows/release.yml
name: Release Package

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'

      - name: Install Dependencies
        run: yarn install --frozen-lockfile

      - name: Run Tests
        run: yarn test

      - name: Build Package
        run: yarn build:npm

      - name: Publish to npm
        run: yarn release:npm
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

      - name: Create GitHub Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          body_path: CHANGELOG.md
```

---

## Phase 5: Performance Optimization (Week 5-6)

### 5.1 Large Dataset Handling

**Problem**: Current implementation loads entire datasets into memory, causing:
- Slow initial render (>5s for 100K rows)
- Memory overflow on large datasets (>1M rows)
- Browser freezing during processing

**Solution**: Progressive loading and virtualization

```typescript
// app/hooks/use-progressive-data.ts

export function useProgressiveData(datasetId: string, options = {}) {
  const [data, setData] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const {
    chunkSize = 5000,        // Load 5000 rows at a time
    initialChunks = 2,       // Load first 10K rows immediately
    priority = 'viewport'    // Prioritize visible data
  } = options;

  useEffect(() => {
    const loader = new ProgressiveDataLoader({
      datasetId,
      chunkSize,
      onProgress: (percent) => setProgress(percent),
      onChunk: (chunk) => setData(prev => [...prev, ...chunk])
    });

    loader.start();

    return () => loader.cancel();
  }, [datasetId]);

  return { data, progress, isLoading };
}
```

**Virtualization** (for large tables):

```tsx
// app/components/VirtualizedTable.tsx
import { FixedSizeList } from 'react-window';

export function VirtualizedTable({ data, columns }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      {columns.map(col => (
        <span key={col.field}>{data[index][col.field]}</span>
      ))}
    </div>
  );

  return (
    <FixedSizeList
      height={600}
      itemCount={data.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
```

### 5.2 Chart Rendering Optimization

**WebGL for Large Datasets**:

```tsx
// app/charts/optimized/LargeDataChart.tsx
import { ScatterplotLayer } from '@deck.gl/layers';
import { DeckGL } from '@deck.gl/react';

export function LargeDataScatterPlot({ data }) {
  const layer = new ScatterplotLayer({
    id: 'scatter-plot',
    data,
    getPosition: d => [d.x, d.y],
    getRadius: d => d.size,
    getFillColor: d => [255, 0, 0],
    pickable: true,
    radiusScale: 1,
    radiusMinPixels: 1,
    radiusMaxPixels: 100
  });

  return (
    <DeckGL
      initialViewState={{ zoom: 10 }}
      controller={true}
      layers={[layer]}
    />
  );
}
```

**Performance Targets**:

| Dataset Size | Initial Render | Interaction | Memory Usage |
|-------------|----------------|-------------|--------------|
| <10K rows | <500ms | <16ms (60fps) | <50MB |
| 10K-100K rows | <2s | <33ms (30fps) | <200MB |
| 100K-1M rows | <5s | <66ms (15fps) | <500MB |
| >1M rows | Progressive | Streaming | Virtualized |

### 5.3 Caching Strategy

**Multi-Level Cache**:

```typescript
// app/lib/cache/multi-level-cache.ts

export class MultiLevelCache {
  private memory = new Map();
  private indexedDB = new IndexedDBCache();
  private serviceWorker = new SWCache();

  async get(key: string) {
    // L1: Memory cache (fastest, volatile)
    if (this.memory.has(key)) {
      return this.memory.get(key);
    }

    // L2: IndexedDB (fast, persistent)
    const fromIDB = await this.indexedDB.get(key);
    if (fromIDB) {
      this.memory.set(key, fromIDB);
      return fromIDB;
    }

    // L3: Service Worker (network + cache)
    const fromSW = await this.serviceWorker.get(key);
    if (fromSW) {
      this.memory.set(key, fromSW);
      await this.indexedDB.set(key, fromSW);
      return fromSW;
    }

    return null;
  }
}
```

**Cache Invalidation**:
- Time-based: Dataset cache expires after 24 hours
- Event-based: Manual refresh by user
- Version-based: API version changes
- Size-based: LRU eviction when cache >100MB

### 5.4 Bundle Size Optimization

**Current bundle**: ~2.5MB (uncompressed)
**Target**: <1MB (uncompressed), <300KB (gzipped)

**Strategies**:
1. **Code Splitting**:
   ```tsx
   // Lazy load chart components
   const LineChart = lazy(() => import('./charts/LineChart'));
   const BarChart = lazy(() => import('./charts/BarChart'));
   ```

2. **Tree Shaking**:
   ```json
   // package.json
   {
     "sideEffects": false
   }
   ```

3. **Dynamic Imports**:
   ```typescript
   // Load D3 modules on demand
   async function loadD3Scale() {
     const { scaleLinear } = await import('d3-scale');
     return scaleLinear();
   }
   ```

4. **Bundle Analysis**:
   ```bash
   # Analyze bundle composition
   yarn build --analyze

   # Output: Interactive bundle map
   # Identify large dependencies for replacement
   ```

---

## Phase 6: Amplifier Integration (Week 6-7)

### 6.1 Knowledge Synthesis for Dataset Insights

**Goal**: Use amplifier's knowledge synthesis to automatically generate insights from datasets.

**New Feature**: Auto-generated Insights Panel

```python
# amplifier/scenarios/dataset_insights/generate_insights.py

class DatasetInsightGenerator:
    """
    Uses Claude Code SDK to generate natural language insights
    from dataset analysis
    """

    def __init__(self, dataset_id: str):
        self.dataset_id = dataset_id
        self.data = self.load_dataset()
        self.stats = self.compute_statistics()

    async def generate_insights(self) -> List[Insight]:
        """Generate 3-5 key insights from dataset"""

        # Statistical analysis
        trends = self.detect_trends()
        anomalies = self.detect_anomalies()
        correlations = self.find_correlations()

        # Use Claude to synthesize natural language
        prompt = f"""
        Analyze this Serbian dataset and provide 3-5 key insights in Serbian:

        Dataset: {self.data['title']}
        Time Period: {self.stats['date_range']}

        Trends: {trends}
        Anomalies: {anomalies}
        Correlations: {correlations}

        Focus on:
        1. Most significant trend
        2. Notable anomalies or outliers
        3. Correlation between variables
        4. Policy implications
        5. Future projections (if applicable)

        Format as JSON array with: { "title", "description", "severity", "recommendation" }
        """

        insights = await claude_code_sdk.generate(prompt)
        return insights
```

**UI Integration**:

```tsx
// app/components/insights/InsightsPanel.tsx

export function InsightsPanel({ datasetId }) {
  const { insights, isLoading } = useDatasetInsights(datasetId);

  return (
    <Card>
      <CardHeader>
        <Icon>💡</Icon>
        <Title>AI Uvidi (AI Insights)</Title>
      </CardHeader>

      <CardContent>
        {insights.map(insight => (
          <InsightCard key={insight.id}>
            <InsightTitle severity={insight.severity}>
              {insight.title}
            </InsightTitle>
            <InsightDescription>
              {insight.description}
            </InsightDescription>
            {insight.recommendation && (
              <Recommendation>
                <strong>Preporuka:</strong> {insight.recommendation}
              </Recommendation>
            )}
          </InsightCard>
        ))}
      </CardContent>
    </Card>
  );
}
```

### 6.2 Automated Dataset Summarization

**Feature**: Generate executive summaries for all datasets

```python
# amplifier/scenarios/dataset_summary/summarize.py

class DatasetSummarizer:
    """
    Creates concise summaries of datasets for quick understanding
    """

    async def summarize(self, dataset_id: str) -> Summary:
        dataset = await self.fetch_dataset(dataset_id)

        prompt = f"""
        Create a 2-3 sentence summary of this dataset in Serbian:

        Title: {dataset['title']}
        Description: {dataset['description']}
        Organization: {dataset['organization']}
        Tags: {', '.join(dataset['tags'])}
        Temporal Coverage: {dataset['temporal_coverage']}

        The summary should:
        - Explain what the dataset contains
        - Mention the time period covered
        - Highlight the data source/organization
        - Be accessible to non-technical users
        """

        summary = await claude_code_sdk.generate(prompt)
        return summary
```

**Display in Dataset Browser**:

```tsx
// app/components/datasets/DatasetCard.tsx

export function DatasetCard({ dataset }) {
  const summary = useDatasetSummary(dataset.id);

  return (
    <Card>
      <CardMedia
        component="img"
        image={dataset.preview_image}
        alt={dataset.title}
      />
      <CardContent>
        <Typography variant="h6">{dataset.title}</Typography>

        {/* AI-generated summary */}
        <Typography variant="body2" color="text.secondary">
          {summary || dataset.description}
        </Typography>

        <Chip label={dataset.organization} size="small" />
        <Chip label={dataset.temporal_coverage} size="small" />
      </CardContent>
      <CardActions>
        <Button size="small">Prikaži (View)</Button>
        <Button size="small">Izvezi (Export)</Button>
      </CardActions>
    </Card>
  );
}
```

### 6.3 Natural Language Queries

**Feature**: Ask questions about data in natural language

```tsx
// app/components/queries/NaturalLanguageQuery.tsx

export function NaturalLanguageQuery({ datasetId }) {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState(null);

  const handleSubmit = async () => {
    // Send query to amplifier backend
    const response = await fetch('/api/nl-query', {
      method: 'POST',
      body: JSON.stringify({ datasetId, query })
    });

    const result = await response.json();
    setAnswer(result);
  };

  return (
    <Box>
      <TextField
        fullWidth
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Pitajte bilo šta o podacima... (Ask anything about the data...)"
        helperText="Primer: 'Koji grad ima najveće zagađenje vazduha?'"
      />
      <Button onClick={handleSubmit}>Postavite pitanje</Button>

      {answer && (
        <AnswerCard>
          <Typography variant="h6">Odgovor:</Typography>
          <Typography>{answer.text}</Typography>

          {/* Show relevant visualization */}
          {answer.chart && (
            <ChartPreview data={answer.chart} />
          )}
        </AnswerCard>
      )}
    </Box>
  );
}
```

**Backend Implementation**:

```python
# amplifier/scenarios/nl_query/query_engine.py

class NaturalLanguageQueryEngine:
    """
    Answers natural language questions about datasets
    """

    async def answer_query(
        self,
        dataset_id: str,
        query: str,
        language: str = 'sr'
    ) -> QueryAnswer:
        # Load dataset
        data = await self.load_dataset(dataset_id)

        # Analyze query to determine intent
        intent = await self.classify_intent(query)
        # "comparison", "trend", "ranking", "aggregation", etc.

        # Generate appropriate analysis
        if intent == 'ranking':
            result = self.compute_ranking(data, query)
        elif intent == 'trend':
            result = self.analyze_trend(data, query)
        elif intent == 'comparison':
            result = self.compare_entities(data, query)

        # Generate natural language answer
        answer = await self.generate_answer(query, result, language)

        # Create visualization
        chart = self.create_chart(intent, result)

        return QueryAnswer(
            text=answer,
            chart=chart,
            confidence=0.95
        )
```

**Example Queries**:
- "Koji grad ima najbolji kvalitet vazduha?" → Ranking chart
- "Kako se menjao budžet za obrazovanje kroz vreme?" → Trend line chart
- "Uporedi nezaposlenost Beograda i Novog Sada" → Comparison bar chart
- "Šta je prosečna temperatura u junu?" → Aggregation result

---

## Phase 7: Documentation & Tutorials (Week 7-8)

### 7.1 Client-Facing Documentation

**Documentation Site Structure**:

```
docs/
├── getting-started/
│   ├── installation.md
│   ├── quick-start.md
│   ├── first-visualization.md
│   └── deployment.md
├── guides/
│   ├── configuration.md
│   ├── dataset-discovery.md
│   ├── customization.md
│   ├── embedding.md
│   └── troubleshooting.md
├── tutorials/
│   ├── budget-dashboard.md
│   ├── environmental-monitoring.md
│   ├── healthcare-analytics.md
│   └── custom-theme.md
├── api-reference/
│   ├── components.md
│   ├── hooks.md
│   ├── utilities.md
│   └── cli.md
├── examples/
│   ├── basic-usage/
│   ├── advanced-customization/
│   ├── github-pages-deployment/
│   └── embedded-widget/
└── faq.md
```

**Video Tutorials** (Serbian with English subtitles):
1. "Početak sa Vizualni Admin" (Getting Started) - 5 min
2. "Kreiranje prve vizualizacije" (Creating Your First Visualization) - 8 min
3. "Pronalaženje i dodavanje skupova podataka" (Finding and Adding Datasets) - 10 min
4. "Prilagođavanje izgleda i teme" (Customizing Appearance) - 7 min
5. "Ugrađivanje vizualizacija u veb sajtove" (Embedding Visualizations) - 6 min
6. "Objavljivanje na GitHub Pages" (Deploying to GitHub Pages) - 12 min

### 7.2 Interactive Tutorials

**In-App Tutorial System**:

```tsx
// app/components/tutorials/InteractiveTutorial.tsx

export function InteractiveTutorial({ tutorialId }) {
  const tutorial = TUTORIALS[tutorialId];
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const steps = [
    {
      target: '#dataset-selector',
      content: 'Izaberite skup podataka koji želite da vizualizujete',
      action: 'click'
    },
    {
      target: '#chart-type-picker',
      content: 'Odaberite tip grafikona koji najbolje predstavlja vaše podatke',
      action: 'select'
    },
    {
      target: '#customize-button',
      content: 'Prilagodite boje, naslove i druge opcije',
      action: 'click'
    },
    {
      target: '#preview-chart',
      content: 'Pogledajte kako će izgledati vaša vizualizacija',
      action: 'view'
    },
    {
      target: '#save-button',
      content: 'Sačuvajte vizualizaciju ili je podelite',
      action: 'click'
    }
  ];

  return (
    <Joyride
      steps={steps}
      run={!completed}
      continuous
      showSkipButton
      stepIndex={currentStep}
      callback={handleTutorialCallback}
    />
  );
}
```

### 7.3 Example Projects

**Starter Templates**:

```bash
# Available templates
npx @acailic/vizualni-admin init my-project --template basic
npx @acailic/vizualni-admin init my-project --template government
npx @acailic/vizualni-admin init my-project --template ngo
npx @acailic/vizualni-admin init my-project --template researcher
```

**Template Configurations**:

1. **Basic**: Minimal setup for quick start
   - Default theme
   - 3 sample categories (budget, environment, demographics)
   - Simple dashboard

2. **Government**: For government agencies
   - Official theme (government colors)
   - All categories enabled
   - Advanced analytics dashboard
   - Accessibility features emphasized

3. **NGO**: For non-profit organizations
   - Clean, modern theme
   - Focus on social issues (healthcare, education, environment)
   - Social sharing features
   - Storytelling components

4. **Researcher**: For academic research
   - Scientific theme
   - Advanced statistical analysis tools
   - Export to academic formats (CSV, Excel, LaTeX tables)
   - Citation generator

---

## Phase 8: Testing & Quality Assurance (Week 7-8)

### 8.1 Testing Strategy

**Test Coverage Targets**:
- Unit tests: 80%+ coverage
- Integration tests: Key user flows
- E2E tests: Critical paths
- Visual regression: All chart types
- Accessibility: WCAG 2.1 AA compliance
- Performance: Load time <3s

**Test Structure**:

```
tests/
├── unit/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   └── lib/
├── integration/
│   ├── dataset-loading.test.ts
│   ├── chart-rendering.test.ts
│   └── configuration.test.ts
├── e2e/
│   ├── user-flows/
│   │   ├── create-visualization.spec.ts
│   │   ├── onboarding.spec.ts
│   │   └── dataset-discovery.spec.ts
│   └── scenarios/
│       ├── government-user.spec.ts
│       └── researcher-user.spec.ts
├── visual/
│   ├── charts/
│   └── dashboards/
└── performance/
    ├── large-datasets.test.ts
    └── bundle-size.test.ts
```

### 8.2 Automated Testing Pipeline

```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  unit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: yarn install
      - run: yarn test
      - uses: codecov/codecov-action@v3

  integration:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: yarn install
      - run: yarn test:integration

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: yarn install
      - run: yarn playwright install
      - run: yarn e2e

  accessibility:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: yarn install
      - run: yarn test:a11y

  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: yarn install
      - run: yarn build
      - run: yarn test:performance
```

### 8.3 Quality Gates

**Pre-Merge Checklist**:
- ✅ All tests passing
- ✅ Code coverage ≥80%
- ✅ No TypeScript errors
- ✅ ESLint passing
- ✅ Prettier formatting applied
- ✅ Bundle size <1MB
- ✅ Lighthouse score >90
- ✅ Accessibility score 100%
- ✅ No security vulnerabilities (Snyk)
- ✅ Documentation updated

---

## Phase 9: Launch & Marketing (Week 8)

### 9.1 Launch Checklist

**Technical**:
- [ ] Version 1.0.0 published to npm
- [ ] Documentation site live
- [ ] GitHub repository public
- [ ] GitHub Pages demo live
- [ ] All examples working
- [ ] CLI tools tested

**Content**:
- [ ] Launch blog post (Serbian + English)
- [ ] Video tutorials published
- [ ] Social media posts prepared
- [ ] Press release (Serbian media)
- [ ] Community outreach (developer forums)

**Support**:
- [ ] GitHub Discussions enabled
- [ ] Issue templates created
- [ ] Contributing guidelines
- [ ] Code of conduct
- [ ] Support email set up

### 9.2 Marketing Strategy

**Target Audiences**:
1. **Government Agencies**: Ministry departments, local governments
2. **NGOs**: Transparency organizations, civic tech groups
3. **Journalists**: Data journalists, investigative reporters
4. **Researchers**: Universities, research institutes
5. **Developers**: Web developers, data visualization specialists

**Channels**:
- **LinkedIn**: Professional network (government officials, NGOs)
- **Twitter/X**: Tech community, journalists
- **GitHub**: Developer community
- **Hacker News**: Tech enthusiasts
- **Serbian tech forums**: Local developer community
- **Data journalism networks**: GIJN, BIRN

**Launch Content**:

```markdown
# Launch Blog Post Outline

## Title (Serbian)
"Vizualni Admin 1.0: Alat otvorenog koda za vizualizaciju srpskih otvorenih podataka"

## Title (English)
"Vizualni Admin 1.0: Open-Source Tool for Serbian Open Data Visualization"

## Content Sections
1. Problem Statement
   - Open data is hard to understand
   - Existing tools not tailored for Serbian data
   - Barrier to transparency and accountability

2. Solution
   - Vizualni Admin makes data accessible
   - Built specifically for data.gov.rs
   - Free, open-source, easy to use

3. Key Features
   - 77+ pre-validated datasets
   - 11 visualization categories
   - Bilingual (Serbian/English)
   - AI-powered insights
   - Embeddable charts
   - GitHub Pages deployment

4. Use Cases
   - Government transparency dashboards
   - Journalistic investigations
   - Academic research
   - Citizen engagement

5. Call to Action
   - Try the demo
   - Install via npm
   - Contribute on GitHub
   - Join community discussions
```

---

## Success Metrics

### Technical Metrics
| Metric | Baseline | Target (1.0) | Target (1.5) |
|--------|----------|--------------|--------------|
| npm downloads/month | 0 | 100 | 500 |
| GitHub stars | 5 | 50 | 200 |
| Active forks | 0 | 10 | 30 |
| Contributors | 1 | 5 | 15 |
| Issues resolved | - | 90%+ | 95%+ |

### Dataset Metrics
| Category | Current | Target |
|----------|---------|--------|
| Validated datasets | 4 | 77+ |
| Categories covered | 4/15 | 15/15 |
| Dataset freshness | Static | Weekly updates |
| Data quality score | N/A | >0.7 average |

### User Metrics
| Metric | Target (3 months) | Target (6 months) |
|--------|------------------|------------------|
| Active users | 50 | 200 |
| Visualizations created | 500 | 2000 |
| Embedded charts | 100 | 500 |
| Tutorial completions | 200 | 800 |

### Community Metrics
| Metric | Target |
|--------|--------|
| Blog posts/articles | 10+ |
| Conference presentations | 2+ |
| Workshop attendees | 100+ |
| Partner organizations | 5+ |

---

## Risk Management

### Technical Risks
| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| data.gov.rs API changes | Medium | High | Monitoring, version pinning, fallbacks |
| Performance issues with large datasets | Medium | Medium | Progressive loading, optimization |
| Browser compatibility | Low | Medium | Polyfills, testing matrix |
| Security vulnerabilities | Low | High | Automated scanning, security reviews |

### Adoption Risks
| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Limited user adoption | Medium | High | Marketing, outreach, partnerships |
| Competition from proprietary tools | Low | Medium | Emphasize open-source, free, customizable |
| Low data quality on data.gov.rs | High | Medium | Data validation, quality scoring |
| Language barrier (non-Serbian speakers) | Low | Low | English documentation, internationalization |

---

## Timeline

### Week 1-2: Foundation
- Current state analysis
- Dataset discovery setup
- Validation pipeline

### Week 3-4: Datasets
- Discover 77+ datasets
- Validate all categories
- Create fallback data

### Week 5: Client Experience
- Onboarding wizard
- Configuration system
- Dashboard

### Week 6: Package & Performance
- npm package improvements
- CLI tools
- Performance optimization

### Week 7: Integration & Docs
- Amplifier integration
- Documentation
- Tutorials

### Week 8: Testing & Launch
- Full test suite
- Quality assurance
- Launch

---

## Budget Estimate

### Development Costs (in hours)
| Phase | Estimated Hours | Cost (@$50/hr) |
|-------|----------------|----------------|
| Dataset integration | 60h | $3,000 |
| Client experience | 40h | $2,000 |
| Package quality | 30h | $1,500 |
| Performance optimization | 40h | $2,000 |
| Amplifier integration | 50h | $2,500 |
| Documentation | 40h | $2,000 |
| Testing | 40h | $2,000 |
| **Total** | **300h** | **$15,000** |

### Infrastructure Costs (annual)
| Service | Cost |
|---------|------|
| GitHub Pages hosting | Free |
| npm package hosting | Free |
| Domain name (optional) | $15/year |
| Documentation hosting (Vercel) | Free |
| CI/CD (GitHub Actions) | Free (public repo) |
| **Total** | **$15/year** |

### Marketing Costs
| Item | Cost |
|------|------|
| Video production | $500 |
| Social media ads | $200 |
| Conference fees | $300 |
| **Total** | **$1,000** |

### Grand Total
- **Initial Development**: $15,000
- **Annual Operations**: $1,015
- **Total Year 1**: $16,015

---

## Next Steps (Immediate Actions)

1. **Set up dataset discovery pipeline** (Week 1)
   ```bash
   cd amplifier/scenarios
   mkdir dataset_discovery
   # Implement discovery engine
   ```

2. **Create validation scripts** (Week 1)
   ```bash
   # Test all current datasets
   node scripts/validate-datasets.js
   ```

3. **Design onboarding wizard** (Week 2)
   ```bash
   # Sketch wireframes
   # Create React components
   ```

4. **Start documentation site** (Week 2)
   ```bash
   mkdir docs-site
   npx create-next-app docs --template docs
   ```

5. **Set up CI/CD** (Week 1)
   ```yaml
   # Create .github/workflows/
   # Add test, build, deploy pipelines
   ```

---

## Conclusion

This comprehensive plan transforms vizualni-admin from a technical proof-of-concept to a production-ready, client-friendly tool for Serbian open data visualization. The focus on real datasets, user experience, and amplifier-powered insights will make this a valuable resource for government transparency, journalistic investigations, and civic engagement.

**Key Differentiators**:
- ✅ Built specifically for Serbian data.gov.rs
- ✅ Free and open-source (vs. proprietary tools)
- ✅ AI-powered insights (unique feature)
- ✅ Bilingual support (Serbian/English)
- ✅ Easy deployment (GitHub Pages, npm)
- ✅ Active maintenance and community

**Long-Term Vision**:
- Become the de facto tool for Serbian open data visualization
- Expand to other Balkan countries (Bosnia, Montenegro, North Macedonia)
- Partner with transparency organizations
- Integrate with government reporting systems
- Educational resource for data literacy

---

**Version**: 1.0
**Last Updated**: 2025-01-27
**Status**: Ready for Implementation
