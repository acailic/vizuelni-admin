# Data Journalism Toolkit

**Templates and workflows for investigative journalism with Serbian government data**

---

## Overview

This toolkit provides pre-built templates, workflows, and best practices for data journalists using Vizualni Admin Srbije to investigate and report on Serbian government data.

### Who This Is For

- **Investigative journalists** — Uncovering patterns in government data
- **Data journalists** — Creating visualizations for stories
- **Reporters** — Quick turnaround data-driven graphics
- **Editors** — Understanding data journalism workflows
- **News organizations** — Building data journalism capacity

---

## Quick Start Templates

### Template 1: Budget Analysis

**Purpose**: Investigate government spending patterns

**Use When**: Covering annual budgets, ministry allocations, regional spending

```typescript
import { BudgetAnalysisTemplate } from '@vizualni/templates';

function BudgetStory() {
  return (
    <BudgetAnalysisTemplate
      // Required: Dataset source
      datasetId="budget-2024"
      sourceUrl="https://data.gov.rs/dataset/budget-2024"

      // Comparison options
      compareYears={[2022, 2023, 2024]}
      normalizeBy="per_capita"  // or "total", "percentage"

      // Visualization options
      chartType="grouped-bar"  // or "treemap", "sankey"
      geoLevel="districts"     // for regional breakdown

      // Publication options
      citationStyle="apa"
      includeDownloadButton={true}
      embedEnabled={true}
    />
  );
}
```

**What it produces**:

- 📊 Grouped bar chart comparing years
- 🗺️ Regional map of per-capita spending
- 📈 Year-over-year change calculation
- 📋 Citation-ready data table

---

### Template 2: Election Results

**Purpose**: Visualize election data by region

**Use When**: Covering elections, tracking political trends

```typescript
import { ElectionResultsTemplate } from '@vizualni/templates';

function ElectionCoverage() {
  return (
    <ElectionResultsTemplate
      // Required: Election identifier
      electionId="parliamentary-2024"

      // Display options
      mapView="municipalities"  // or "districts"
      showPercentages={true}
      showWinners={true}

      // Comparison
      compareWith="parliamentary-2022"

      // Features
      showTurnout={true}
      showInvalidBallots={true}

      // Export
      exportFormats={['png', 'svg', 'embed']}
    />
  );
}
```

**What it produces**:

- 🗺️ Choropleth map by winning party
- 📊 Vote percentage breakdown
- 📈 Turnout analysis
- 🔄 Historical comparison

---

### Template 3: Demographic Trends

**Purpose**: Analyze population and demographic changes

**Use When**: Census coverage, migration stories, aging population

```typescript
import { DemographicTrendsTemplate } from '@vizualni/templates';

function DemographicStory() {
  return (
    <DemographicTrendsTemplate
      // Data source
      datasetId="population-census"

      // Time range
      years={[2011, 2022]}  // Census years

      // Metrics to visualize
      metrics={[
        'total_population',
        'age_distribution',
        'migration_balance',
        'urban_rural_split'
      ]}

      // Geographic breakdown
      geoLevel="municipalities"

      // Analysis features
      showTrendline={true}
      highlightOutliers={true}
      calculateChange={true}
    />
  );
}
```

**What it produces**:

- 📈 Population change over time
- 🗺️ Regional demographic maps
- 📊 Age pyramid comparison
- 📍 Migration flow visualization

---

### Template 4: Performance Tracking

**Purpose**: Monitor government KPIs over time

**Use When**: Accountability journalism, promise tracking

```typescript
import { PerformanceTrackingTemplate } from '@vizualni/templates';

function AccountabilityStory() {
  return (
    <PerformanceTrackingTemplate
      // KPIs to track
      indicators={[
        'unemployment_rate',
        'gdp_growth',
        'foreign_investment',
        'infrastructure_projects'
      ]}

      // Time period
      startDate="2020-01-01"
      endDate="2024-12-31"
      frequency="monthly"

      // Targets (optional)
      targets={{
        unemployment_rate: { value: 8, date: '2024-12-31' },
        gdp_growth: { value: 3.5, date: '2024-12-31' }
      }}

      // Visualization
      showBaseline={true}
      showTarget={true}
      showProgress={true}
    />
  );
}
```

**What it produces**:

- 📊 KPI dashboard with trends
- ✅ Target achievement status
- 📈 Progress indicators
- 📋 Summary statistics

---

## Workflow: Budget Investigation

### Step 1: Define Your Question

**Good questions**:

- "Are budget allocations proportional to population?"
- "Which ministries received the largest increases?"
- "How has infrastructure spending changed over 5 years?"

**Bad questions**:

- "Show me the budget" (too vague)
- "Is the budget fair?" (subjective, not data-driven)

### Step 2: Gather Data

**Primary source**: data.gov.rs

```typescript
import { DataGovRsConnector } from '@vizualni/connectors';

async function gatherBudgetData() {
  const connector = new DataGovRsConnector();

  // Search for relevant datasets
  const datasets = await connector.search('буџет министарство', {
    organization: 'ministry-of-finance',
    format: 'CSV',
    year: [2022, 2023, 2024],
  });

  // Load and merge multiple years
  const data2022 = await connector.getDataset(datasets[0].id);
  const data2023 = await connector.getDataset(datasets[1].id);
  const data2024 = await connector.getDataset(datasets[2].id);

  return { data2022, data2023, data2024 };
}
```

**Verify data quality**:

- Check for missing values
- Verify totals match official figures
- Document any data cleaning performed

### Step 3: Analyze

**Common analyses**:

**Per-capita calculation**:

```typescript
function calculatePerCapita(budgetData, populationData) {
  return budgetData.map((item) => ({
    ...item,
    perCapita: item.amount / populationData[item.region],
  }));
}
```

**Year-over-year change**:

```typescript
function calculateChange(current, previous) {
  return current.map((item) => {
    const prev = previous.find((p) => p.category === item.category);
    return {
      ...item,
      change: item.amount - prev.amount,
      changePercent: ((item.amount - prev.amount) / prev.amount) * 100,
    };
  });
}
```

**Outlier detection**:

```typescript
function findOutliers(data, field) {
  const values = data.map((d) => d[field]);
  const mean = values.reduce((a, b) => a + b) / values.length;
  const std = Math.sqrt(
    values.reduce((a, b) => a + Math.pow(b - mean, 2)) / values.length
  );

  return data.filter((d) => Math.abs(d[field] - mean) > 2 * std);
}
```

### Step 4: Visualize

**Choose the right chart**:

| Story Type       | Best Visualization          |
| ---------------- | --------------------------- |
| Comparison       | Grouped bar chart           |
| Distribution     | Treemap                     |
| Change over time | Line chart with annotations |
| Geographic       | Choropleth map              |
| Part-to-whole    | Sankey diagram              |

**Example**: Regional budget comparison

```typescript
import { BarChart, SerbiaMap } from '@vizualni/react';

function BudgetComparison({ data }) {
  return (
    <div className="visualization-container">
      <h2>Буџетска средства по регионима</h2>

      <div className="charts">
        <SerbiaMap
          data={data}
          geoLevel="districts"
          colorField="perCapita"
          colorScale="blues"
          title="Средства по глави становника"
        />

        <BarChart
          data={data}
          x="region"
          y="perCapita"
          title="Поређење по окрузима"
          horizontal={true}
          highlightTop={3}
        />
      </div>

      <DataSource>
        Извор: Министарство финансија, data.gov.rs
        Датум преузимања: {new Date().toLocaleDateString('sr')}
      </DataSource>
    </div>
  );
}
```

### Step 5: Fact-Check

**Before publication**:

- [ ] Verify totals with official sources
- [ ] Cross-reference with other datasets
- [ ] Check calculations manually for sample
- [ ] Have another journalist review methodology
- [ ] Contact relevant ministry for comment

### Step 6: Publish with Context

**Required elements**:

1. **Methodology note**: Explain how analysis was performed
2. **Data source**: Link to original dataset
3. **Download option**: Let readers verify themselves
4. **Caveats**: Note any limitations or data quality issues

**Example methodology box**:

```markdown
## Методологија

**Извор података**: Министарство финансија Републике Србије,
објављено на data.gov.rs

**Период**: Фискалне године 2022-2024

**Метод**: Средства по глави становника израчуната дељењем
укупних средстава са бројем становника према попису 2022.

**Ограничења**: Подаци не укључују интервентна трошења.

**Верификација**: Укупни износи су упоређени са званичним
буџетским извештајима.
```

---

## Citation Guidelines

### In-Text Citation

**Serbian**:

> Према подацима Министарства финансија (2024), буџетска средства
> по глави становника крећу се од X до Y динара.

**English**:

> According to Ministry of Finance data (2024), per capita budget
> allocations range from X to Y dinars.

### Figure Captions

**Format**:

```
Слика 1: [Опис]. Извор: [Институција], data.gov.rs.
Визуелизација: Визуелни Административни Подаци Србије.
```

**Example**:

```
Слика 1: Буџетска средства по окрузима у 2024. години,
приказана по глави становника. Извор: Министарство финансија,
data.gov.rs. Визуелизација: Визуелни Административни Подаци Србије.
```

### Full Reference

**APA (Serbian)**:

> Министарство финансија Републике Србије. (2024). Буџет Републике
> Србије за 2024. годину [Скуп података]. data.gov.rs.
> https://data.gov.rs/dataset/budget-2024

**MLA (Serbian)**:

> "Буџет Републике Србије за 2024. годину." Министарство финансија,
> data.gov.rs, 2024, data.gov.rs/dataset/budget-2024.

---

## Common Story Types

### 1. Accountability Story

**Template**: "Did [entity] deliver on [promise]?"

**Data needed**:

- Baseline metrics
- Current metrics
- Target/stated goal

**Visualization**: Progress tracker with baseline and target lines

**Example**:

> "Влада је обећала смањење незапослености на 8% до краја 2024.
> Према најновијим подацима, стопа износи X%."

### 2. Comparative Story

**Template**: "How does [region/entity] compare to [peers]?"

**Data needed**:

- Comparable metrics across entities
- Population/economic context

**Visualization**: Ranked bar chart with highlight

**Example**:

> "Београд добија X динара по глави становника, што је Y% више
> од националног просека."

### 3. Trend Story

**Template**: "How has [metric] changed over time?"

**Data needed**:

- Time series data (monthly/yearly)
- Context for significant events

**Visualization**: Line chart with event annotations

**Example**:

> "Стопа незапослености пала је за X процентних поена од 2020,
> али раст и даље заостаје за регионалним просеком."

### 4. Geographic Story

**Template**: "Where is [phenomenon] most/least prevalent?"

**Data needed**:

- Regional breakdown
- Geographic context

**Visualization**: Choropleth map

**Example**:

> "Највећа концентрација [феномен] је у [регион], док је
> [регион] најмање погођен."

---

## Data Quality Checklist

### Before Using Any Dataset

- [ ] **Source verified**: Is this from an official source?
- [ ] **Date checked**: When was data last updated?
- [ ] **Methodology understood**: How was data collected?
- [ ] **Completeness verified**: Are there missing values?
- [ ] **Consistency checked**: Do totals match known figures?
- [ ] **Documentation read**: Are there known limitations?

### Red Flags

⚠️ **Don't use if**:

- No publication date or update frequency
- Methodology is unclear or missing
- Significant unexplained gaps
- Totals don't match official reports
- Dataset contradicts other reliable sources

### When in Doubt

1. Contact the publishing organization
2. Cross-reference with alternative sources
3. Note limitations prominently in your story
4. Consider whether the story can wait for clarification

---

## Ethical Guidelines

### Do's

✅ **Do**:

- Verify data before publication
- Cite sources prominently
- Provide methodology transparency
- Allow readers to download raw data
- Contact affected parties for comment
- Correct errors promptly and publicly

### Don'ts

❌ **Don't**:

- Cherry-pick data to support a narrative
- Present correlation as causation
- Hide methodology or data sources
- Ignore data that contradicts your story
- Publish without fact-checking
- Use data out of context

---

## Partner Organizations

### Media Partnerships

**Tier 1 Partners** (Free Pro Access):

- BIRN (Balkan Investigative Reporting Network)
- CINS (Center for Investigative Journalism of Serbia)
- KRIK (Crime and Corruption Reporting Network)
- TV N1
- Radio Free Europe/Radio Liberty

**Benefits**:

- Unlimited visualizations
- Priority support
- Custom templates
- Training sessions

### How to Partner

1. Open a GitHub Issue: https://github.com/acailic/vizualni-admin/issues
2. Provide organization details
3. Sign partnership agreement
4. Receive access credentials

---

## Training Resources

### Online Courses

1. **Introduction to Data Journalism** (2 hours)
   - Finding data on data.gov.rs
   - Basic analysis techniques
   - Creating first visualizations

2. **Advanced Investigation Techniques** (4 hours)
   - Complex data analysis
   - Statistical methods
   - Visualization best practices

3. **Ethics and Methodology** (2 hours)
   - Ethical frameworks
   - Citation standards
   - Fact-checking workflows

### Workshops

**Monthly workshops** in Belgrade:

- Basic data journalism
- Advanced visualization
- Specific tool training

**Regional workshops** (quarterly):

- Novi Sad
- Niš
- Kragujevac

Check https://github.com/acailic/vizualni-admin/issues for schedule.

---

## Support

### Technical Support

- **GitHub Issues**: https://github.com/acailic/vizualni-admin/issues
- **Response time**: 24 hours (business days)
- **Languages**: Serbian (Cyrillic/Latin), English

### Community

- **Discord**: discord.gg/vizualni-admin
- **Channel**: #data-journalism
- **Office hours**: Thursdays 14:00-16:00 CET

---

**Questions?** Open a GitHub Issue: https://github.com/acailic/vizualni-admin/issues
