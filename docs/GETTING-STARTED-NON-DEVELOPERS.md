# Getting Started for Non-Developers

**Explore Serbian Government Data Without Writing Code**

---

## Welcome

Здраво! Welcome to Vizualni Admin Srbije. This guide will help you explore and
visualize Serbian government data even if you've never written a line of code.

**What You'll Learn:**

- How to find datasets on data.gov.rs
- How to create visualizations using our visual builder
- How to share your findings with others

**Time Required:** 15-30 minutes

---

## What You Can Do

### For Journalists

- Visualize budget allocations and spending trends
- Create maps showing regional disparities
- Track government performance over time
- Export publication-ready graphics

### For Government Staff

- Create citizen-facing transparency dashboards
- Generate reports with visual data
- Compare performance across regions
- Monitor key performance indicators

### For Citizens

- Understand how your tax money is spent
- Explore demographic data about your region
- Compare services across municipalities
- Track election results and political trends

### For Researchers

- Access clean, structured government data
- Create visualizations for papers and presentations
- Perform comparative analysis across time periods
- Export data for statistical software

---

## Quick Start: Your First Visualization

### Step 1: Open the Platform

1. Go to [vizuelni-admin.rs](https://vizuelni-admin.rs) (or your local installation)
2. Click **"Gallery"** to see existing visualizations
3. Or click **"Create"** to start a new one

### Step 2: Choose a Dataset

You have several options:

**Option A: Browse Popular Datasets**

We've pre-loaded popular datasets:

| Dataset              | Description           | Good For               |
| -------------------- | --------------------- | ---------------------- |
| Population by Region | Demographic data      | Maps, comparisons      |
| Budget 2024          | Government spending   | Bar charts, pie charts |
| Unemployment Rate    | Employment statistics | Time series, maps      |
| Election Results     | Voting data           | Maps, comparisons      |
| Environmental Data   | Air quality, waste    | Time series, trends    |

**Option B: Search data.gov.rs**

1. Click **"Search data.gov.rs"**
2. Type your topic (e.g., "запосленост" for employment)
3. Browse results
4. Click **"Use this dataset"**

**Option C: Upload Your Own Data**

1. Click **"Upload CSV/Excel"**
2. Select your file
3. We'll automatically detect columns and suggest chart types

### Step 3: Create Your Visualization

The chart builder will guide you:

1. **Select Chart Type**
   - **Bar Chart** — Compare categories (e.g., budget by ministry)
   - **Line Chart** — Show trends over time (e.g., unemployment rate)
   - **Pie Chart** — Show parts of whole (e.g., budget allocation)
   - **Map** — Geographic data (e.g., population by region)
   - **Table** — Detailed data view

2. **Map Your Data**

   Drag columns to the right places:
   - **X-Axis** — Categories or time periods
   - **Y-Axis** — The values you want to show
   - **Color** — Group related data (optional)

3. **Customize Appearance**
   - Add a title in Serbian or English
   - Choose colors (Serbian government palette available)
   - Add labels and legends
   - Adjust axis formatting

4. **Preview and Adjust**

   See your visualization update in real-time as you make changes.

### Step 4: Save and Share

1. **Save** your visualization to your account
2. **Download** as PNG, PDF, or SVG for reports
3. **Share** with a link or embed code
4. **Export data** as CSV for further analysis

---

## Understanding Serbian Geographic Data

### Geographic Levels

Serbia is organized into several administrative levels:

```
Србија (Serbia)
├── Аутономне Покрајине (Autonomous Provinces)
│   ├── Војводина (Vojvodina)
│   └── Косово и Метохија (Kosovo and Metohija)
├── Окрузи (Districts) — 25 total
│   ├── Град Београд (City of Belgrade)
│   ├── Јужнобачки округ
│   ├── Нишавски округ
│   └── ...
└── Општине (Municipalities) — 174 total
```

### Creating Maps

1. Select **"Geographic Map"** as chart type
2. Choose your geographic level:
   - **Country** — All of Serbia
   - **Districts** — 25 districts + Belgrade
   - **Municipalities** — All 174 municipalities
3. Select the data column with region names
4. The system automatically matches:
   - "Београд" = "Belgrade" = "Beograd"
   - Cyrillic, Latin, and English all work

### Map Customization

- **Color Scale** — Sequential (light to dark) or diverging (two colors)
- **Legend** — Show value ranges or percentiles
- **Missing Data** — Choose how to handle regions without data
- **Tooltips** — What information shows on hover

---

## Working with data.gov.rs

### What is data.gov.rs?

[data.gov.rs](https://data.gov.rs) is Serbia's official open data portal with:

- **3,412+ datasets** from government organizations
- **6,589+ resources** (files, APIs, documentation)
- **155+ organizations** publishing data

### How to Find Data

1. **Browse by Category**
   - Economy and Finance
   - Environment
   - Health
   - Education
   - Transport
   - Government

2. **Search by Keyword**
   - Try both Cyrillic and Latin scripts
   - Use specific terms (e.g., "бруто домаћи производ" for GDP)
   - Combine terms for better results

3. **Filter by Organization**
   - Републички завод за статистику (Statistical Office)
   - Министарство финансија (Ministry of Finance)
   - Народна банка Србије (National Bank)

### Data Quality Tips

Not all datasets are created equal. Look for:

- ✅ Recent update dates
- ✅ Clear documentation
- ✅ Machine-readable formats (CSV, JSON)
- ✅ Consistent column names
- ❌ Scanned PDFs (not usable)
- ❌ Incomplete data

---

## Common Tasks

### Compare Budgets Across Years

1. Load budget datasets for multiple years
2. Create a grouped bar chart
3. Use years as groups, ministries as categories
4. Add percentage change calculations

### Show Regional Disparities

1. Load data with regional breakdown
2. Create a choropleth map
3. Use diverging color scale (red to green)
4. Highlight the median value

### Track Trends Over Time

1. Load time-series data (monthly, quarterly, yearly)
2. Create a line chart
3. Add trend lines for clarity
4. Include key events as annotations

### Create a Dashboard

1. Create multiple visualizations
2. Arrange them in a grid layout
3. Add text boxes for context
4. Share as a single link

---

## Export Options

### For Publications

**PNG Image**

- Best for web and social media
- Transparent background available
- High resolution (2x, 3x)

**PDF Document**

- Best for reports and printing
- Vector graphics (no quality loss)
- Include data source attribution

**SVG Graphic**

- Best for further editing
- Scalable without quality loss
- Editable in Illustrator, Inkscape

### For Presentations

**PowerPoint Export**

- Direct export to slides
- Editable charts in PowerPoint
- Automatic sizing

### For Further Analysis

**CSV Data**

- Raw data export
- Clean, structured format
- Import into Excel, SPSS, R

### For Websites

**Embed Code**

```html
<iframe
  src="https://vizuelni-admin.rs/embed/your-chart-id"
  width="800"
  height="500"
></iframe>
```

**React Component**

For developers embedding in React applications.

---

## Tips for Better Visualizations

### Choose the Right Chart Type

| Data Relationship | Best Chart Types           |
| ----------------- | -------------------------- |
| Part-to-whole     | Pie, Donut, Treemap        |
| Comparison        | Bar, Column, Grouped Bar   |
| Change over time  | Line, Area, Slope          |
| Distribution      | Histogram, Box Plot        |
| Geographic        | Choropleth Map, Bubble Map |
| Correlation       | Scatter Plot, Bubble Chart |

### Use Color Wisely

- **Serbian Government Colors** — Blue (#0D4077), Red (#C6363C)
- **Categorical** — Distinct colors for each category
- **Sequential** — Light to dark for values
- **Diverging** — Two colors from a midpoint

### Make It Accessible

- Ensure sufficient contrast (we check automatically)
- Don't rely only on color to convey meaning
- Add text labels for key values
- Provide data tables for screen readers

### Tell a Story

- Start with a clear title
- Add context in annotations
- Highlight key insights
- Cite your data sources

---

## Troubleshooting

### "My data won't load"

- Check file format (CSV, Excel, JSON)
- Ensure column headers exist
- Remove special characters from headers
- Check for empty rows at the top

### "The map shows empty regions"

- Check region name spelling
- Try both Cyrillic and Latin scripts
- Verify the geographic level matches your data

### "Chart looks wrong"

- Verify data types (numbers vs. text)
- Check for null/empty values
- Ensure you've mapped columns correctly

### "Export is not working"

- Try a different browser
- Disable popup blockers
- Check file size limits

---

## Getting Help

### Documentation

- [Interactive Tutorials](./INTERACTIVE_TUTORIALS.md)
- [Chart Type Guide](./VISUALIZATION_GUIDE.md)
- [FAQ](./FAQ.md)

### Community

- **Discord:** [Join our community](https://discord.gg/vizualni-admin)
- **GitHub Discussions:** Ask questions, share work
- **GitHub Issues:** https://github.com/acailic/vizualni-admin/issues

### Training

We offer free training sessions for:

- Government agencies
- Journalism organizations
- Academic institutions
- NGOs

Open a GitHub issue at https://github.com/acailic/vizualni-admin/issues to schedule.

---

## Example Workflows

### Budget Analysis (15 minutes)

1. Search for "буџет" on data.gov.rs
2. Load the latest budget dataset
3. Create a pie chart showing allocation by ministry
4. Create a bar chart comparing to previous year
5. Export as PDF for your report

### Election Results Map (20 minutes)

1. Load election results data
2. Create a choropleth map by municipality
3. Color by winning party
4. Add hover details showing vote percentages
5. Share embed code with your newsroom

### Unemployment Trends (10 minutes)

1. Load unemployment statistics
2. Create a line chart over time
3. Add regional comparison lines
4. Highlight significant changes
5. Export PNG for social media

---

## Next Steps

After completing this guide, you're ready to:

1. **Explore the Gallery** — See what others have created
2. **Try Advanced Features** — Combine multiple datasets
3. **Join the Community** — Share your work and learn from others
4. **Request Features** — Tell us what you need

---

## Glossary

| Term               | Definition                                         |
| ------------------ | -------------------------------------------------- |
| **Dataset**        | A collection of related data (like a spreadsheet)  |
| **Visualization**  | A visual representation of data (chart, map, etc.) |
| **Choropleth Map** | A map with regions colored by data values          |
| **Time Series**    | Data collected over time (daily, monthly, yearly)  |
| **CSV**            | Comma-Separated Values — a common data format      |
| **data.gov.rs**    | Serbia's official open data portal                 |
| **Embed**          | To include a visualization on another website      |

---

## Feedback

Help us improve this guide!

- Was something unclear?
- Did you get stuck?
- What would you like to learn next?

GitHub Issues: https://github.com/acailic/vizualni-admin/issues

---

<div align="center">

**Happy Visualizing!**

**Срећно визуелизовање!**

_Every citizen deserves to understand their government._

</div>
