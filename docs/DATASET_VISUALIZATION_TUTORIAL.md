# Dataset Visualization Tutorial

This is the simple version of the workflow.

Use it when you want to go from "I found a dataset" to "I have a clear chart" without thinking about internal architecture.

## What you are trying to do

You are making one decision at a time:

1. find a useful dataset
2. check what the data looks like
3. decide whether it is ready for a chart
4. make a first chart
5. improve it if needed

## Step 1: Find a dataset

Start with a question, not a chart type.

Good starting questions:

- How has inflation changed over time?
- Which regions have the highest unemployment?
- How is the budget split across ministries?

Then look for a dataset that matches that question.

In this project, dataset discovery usually starts in the browse flow or from curated demo datasets.

## Step 2: Open the dataset preview

Before you visualize anything, inspect the preview.

Look for:

- the column names
- the first few rows
- whether the file is CSV or JSON
- whether the values look complete and readable

You are trying to answer one basic question:

"Can I understand the structure of this data in 30 seconds?"

If the answer is no, do not jump into charting yet.

## Step 3: Decide if the dataset is chart-ready

Use these quick rules.

### Ready for direct visualization

The dataset is probably chart-ready if it has:

- one time column and one value column
- one category column and one value column
- an age column plus male and female values

Examples:

- `year` + `inflation_rate`
- `ministry` + `budget_amount`
- `age_group` + `male` + `female`

### Not ready yet

The dataset probably needs more work if:

- there is one column for every year
- the same category appears in many slightly different spellings
- the data is too detailed and should be grouped first
- the values you need are percentages, but the dataset only has raw counts

If this happens, transform the data before visualizing it.

## Step 4: Pick the first chart

Do not overthink the first version.

Use the most obvious match:

- time -> line chart
- category comparison -> bar or column chart
- part-to-whole -> pie only if there are very few categories
- geography -> map
- too many columns or unclear structure -> table

The first chart is a draft. Its job is to reveal whether the data and message match.

## Step 5: Transform the data if needed

Sometimes the dataset is useful, but not in the right shape.

Common fixes:

- group rows by region, year, or institution
- calculate percentages
- remove empty rows
- filter to one period or one category
- pivot the data so series become clearer

Simple rule:

- if the chart looks noisy, the data is often too raw
- if the chart looks misleading, the aggregation is often wrong

## Step 6: Check whether the chart is actually clear

Ask:

- is the title saying what the chart shows
- are the labels readable
- are the units obvious
- is the chosen chart easier to understand than a table
- does the chart answer the original question

If not, go back and fix the data shape or switch chart type.

## Example walkthrough

Question:

"How has inflation changed over time in Serbia?"

Workflow:

1. Find an inflation dataset.
2. Open the preview.
3. Confirm there is a date or year column and a numeric inflation field.
4. If yes, use a line chart.
5. If the dataset has separate columns per year instead, reshape it first.
6. Add a clear title and labels.
7. Check if the chart tells the story immediately.

## Best habits

- Start from the question.
- Preview before charting.
- Use direct visualization only when the structure is already clear.
- Transform when the dataset shape does not match the story.
- Treat a table as a valid result when a chart would confuse the user.

## One-line summary

The practical flow is:

```text
Find dataset -> Preview it -> Decide direct vs transform -> Make first chart -> Refine
```

If you follow that order, your charts will usually improve faster and break less often.
