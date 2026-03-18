# Chart Types Guide for Serbian Open Data

This guide helps you choose the right chart type for visualizing Serbian government data from data.gov.rs.

## Quick Reference

| Data Pattern      | Recommended Chart   | Example Use Case                       |
| ----------------- | ------------------- | -------------------------------------- |
| Part-to-whole     | Pie, Donut, Treemap | Budget allocation by sector            |
| Comparison        | Bar, Column         | Population by region                   |
| Trend over time   | Line, Area          | GDP growth quarterly                   |
| Distribution      | Histogram, Box Plot | Income distribution                    |
| Correlation       | Scatter Plot        | Healthcare spending vs life expectancy |
| Geographic        | Choropleth Map      | Vaccination rates by district          |
| Composition       | Stacked Bar, Area   | Export sectors over time               |
| Multi-dimensional | Radar, Parallel     | Regional development indicators        |

## Chart Types in Detail

### 1. Column & Bar Charts

**Best for**: Comparing values across categories

```
Use when:
- Comparing values across regions (Belgrade, Vojvodina, etc.)
- Showing rankings (top 10 municipalities by population)
- Part-to-whole with few categories (3-7 items)

Examples:
- Population by city (column)
- Hospital beds per 1000 residents by region (column)
- Budget allocation by ministry (horizontal bar)
```

**Serbian Data Examples**:

- `serbian-population.json` - Population by city
- `serbian-hospital-capacity.json` - Healthcare capacity by region
- `serbian-vaccination.json` - Vaccination coverage by district

### 2. Line Charts

**Best for**: Trends over time

```
Use when:
- Showing changes over time (monthly, quarterly, yearly)
- Comparing multiple series on same time axis
- Highlighting patterns or anomalies

Examples:
- GDP growth over quarters
- Inflation rate monthly trend
- Air quality index daily readings
```

**Serbian Data Examples**:

- `serbian-time-series.json` - Quarterly GDP
- `serbian-inflation.json` - Monthly inflation rate
- `serbian-air-quality.json` - Daily AQI readings
- `serbian-road-accidents.json` - Monthly accident trends

### 3. Pie & Donut Charts

**Best for**: Proportions of a whole

```
Use when:
- Showing composition (sum = 100%)
- Few categories (3-7)
- One data series only

Avoid when:
- Categories are similar in size
- More than 7 categories
- Need to compare multiple groups
```

**Serbian Data Examples**:

- `serbian-gdp-sectors.json` - GDP by economic sector
- `serbian-education.json` - Students by education level

### 4. Area Charts

**Best for**: Cumulative values over time

```
Use when:
- Showing volume over time
- Comparing part-to-whole trends
- Stacked composition changes

Examples:
- Export composition by sector over years
- Energy consumption by source over time
```

### 5. Scatter Plots

**Best for**: Correlation between two variables

```
Use when:
- Exploring relationships between variables
- Showing clusters or outliers
- Large number of data points

Examples:
- Healthcare spending vs life expectancy
- Population density vs GDP per capita
```

### 6. Maps (Choropleth)

**Best for**: Geographic data distribution

```
Use when:
- Data varies by geographic region
- Showing spatial patterns
- Comparing across districts/municipalities

Examples:
- Population density by district
- Vaccination rates by municipality
- Unemployment by region
```

**Serbian Data Examples**:

- `serbian-population-density.json` - Density by district
- `serbian-vaccination.json` - Coverage by district

## Serbian-Specific Considerations

### Geographic Levels

1. **Regions** (5): Belgrade, Vojvodina, Šumadija, West Serbia, East Serbia, South Serbia
2. **Districts** (25): Okruzi - Use for choropleth maps
3. **Municipalities** (174): Opštine - Detailed local data

### Language Support

Always provide labels in all three supported locales:

- **sr-Cyrl**: Serbian Cyrillic (default)
- **sr-Latn**: Serbian Latin
- **en**: English

### Color Palette

Use the government palette for consistency:

- Primary Blue: `#0D4077`
- Secondary Blue: `#1a5290`, `#4B90F5`
- Accent Red: `#C6363C` (use sparingly)
- Neutrals: Slate scale for backgrounds

## Data Sources

### data.gov.rs Categories

| Category     | Datasets                | Best Charts        |
| ------------ | ----------------------- | ------------------ |
| Demographics | Population, migration   | Bar, Map, Line     |
| Economy      | GDP, inflation, trade   | Line, Treemap, Bar |
| Health       | Hospitals, vaccinations | Map, Bar, Line     |
| Education    | Schools, enrollment     | Pie, Bar           |
| Environment  | Air/water quality       | Line, Map          |
| Finance      | Budget, revenue         | Treemap, Waterfall |
| Transport    | Accidents, vehicles     | Line, Heatmap      |

## Example Datasets in This Project

The following example datasets are included:

### Demographics

- `serbian-population.json` - Population by city
- `serbian-population-pyramid.json` - Age/gender distribution
- `serbian-population-density.json` - Density by district

### Economy

- `serbian-gdp.json` - GDP by region
- `serbian-gdp-sectors.json` - GDP by economic sector
- `serbian-time-series.json` - Quarterly GDP trend
- `serbian-inflation.json` - Monthly inflation rate
- `serbian-unemployment.json` - Unemployment by region
- `serbian-budget-execution.json` - Budget revenue/expenditure

### Healthcare

- `serbian-hospital-capacity.json` - Hospital resources by region
- `serbian-vaccination.json` - Vaccination coverage by district

### Education

- `serbian-education.json` - Students by education level

### Environment

- `serbian-air-quality.json` - Daily AQI by city
- `serbian-energy-consumption.json` - Energy usage trends

### Transport

- `serbian-road-accidents.json` - Monthly accidents by region

## Further Reading

- [Visualization Best Practices](../VISUALIZATION_GUIDE.md)
- [API Reference](../api-reference/)
- [Serbian Data Integration](./serbian-data.md)

---

_Based on QA documentation from `docs/guides/qa/`_
