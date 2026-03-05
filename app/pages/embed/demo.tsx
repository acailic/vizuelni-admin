import Head from "next/head";
import Script from "next/script";

import {
  BarChart,
  ColumnChart,
  LineChart,
  PieChart,
} from "@/components/demos/charts";

function parseTheme(value: string | null): "light" | "dark" {
  return value === "dark" ? "dark" : "light";
}

function parseLang(value: string | null): "en" | "sr" {
  return value === "sr" ? "sr" : "en";
}

type EmbedChartType = "line" | "bar" | "column" | "pie";

function parseChartType(value: string | null): EmbedChartType {
  if (value === "bar" || value === "column" || value === "pie") {
    return value;
  }
  return "line";
}

const DATASETS: Record<string, Array<{ label: string; value: number }>> = {
  budget: [
    { label: "Q1", value: 128 },
    { label: "Q2", value: 141 },
    { label: "Q3", value: 136 },
    { label: "Q4", value: 152 },
  ],
  demographics: [
    { label: "0-14", value: 14 },
    { label: "15-24", value: 11 },
    { label: "25-44", value: 28 },
    { label: "45-64", value: 27 },
    { label: "65+", value: 20 },
  ],
  default: [
    { label: "2019", value: 72 },
    { label: "2020", value: 54 },
    { label: "2021", value: 63 },
    { label: "2022", value: 81 },
    { label: "2023", value: 90 },
    { label: "2024", value: 96 },
  ],
};

function getDataset(dataset: string | null) {
  if (dataset && DATASETS[dataset]) {
    return DATASETS[dataset];
  }
  return DATASETS.default;
}

export default function DemoEmbed() {
  const params = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : ""
  );
  const theme = parseTheme(params.get("theme"));
  const lang = parseLang(params.get("lang"));
  const chartType = parseChartType(params.get("type"));
  const dataset = params.get("dataset");
  const dataSource = params.get("dataSource");
  const data = getDataset(dataset);

  const background = theme === "dark" ? "#0b1220" : "#fff";
  const textColor = theme === "dark" ? "#e5e7eb" : "#111827";
  const accent = theme === "dark" ? "#60a5fa" : "#0ea5e9";

  const titleByType: Record<EmbedChartType, string> = {
    line:
      lang === "sr"
        ? "Linijski pregled podataka (demo)"
        : "Line data overview (demo)",
    bar:
      lang === "sr"
        ? "Stubičasti prikaz podataka (demo)"
        : "Bar data view (demo)",
    column:
      lang === "sr"
        ? "Kolonski prikaz podataka (demo)"
        : "Column data view (demo)",
    pie:
      lang === "sr"
        ? "Struktura podataka po segmentima (demo)"
        : "Segment distribution (demo)",
  };

  const chartTitle = titleByType[chartType];

  const footnote =
    lang === "sr"
      ? `Dataset: ${dataset || "demo"}${dataSource ? ` • Izvor: ${dataSource}` : ""}`
      : `Dataset: ${dataset || "demo"}${dataSource ? ` • Source: ${dataSource}` : ""}`;

  return (
    <>
      <Head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' https://cdn.jsdelivr.net/npm/@open-iframe-resizer/; style-src 'self' 'unsafe-inline'; frame-ancestors *;"
        />
      </Head>
      <Script
        type="module"
        src="https://cdn.jsdelivr.net/npm/@open-iframe-resizer/core@1.6.0/dist/index.js"
      />
      <div style={{ padding: 12, background, color: textColor }}>
        {chartType === "line" ? (
          <LineChart
            data={data}
            xKey="label"
            yKey="value"
            title={chartTitle}
            width={720}
            height={420}
            showTooltip
            showCrosshair
            color={accent}
            colors={[accent, "#22d3ee", "#a855f7", "#fbbf24"]}
          />
        ) : null}
        {chartType === "bar" ? (
          <BarChart
            data={data}
            xKey="label"
            yKey="value"
            title={chartTitle}
            width={720}
            height={420}
            color={accent}
          />
        ) : null}
        {chartType === "column" ? (
          <ColumnChart
            data={data}
            xKey="label"
            yKey="value"
            title={chartTitle}
            width={720}
            height={420}
            color={accent}
          />
        ) : null}
        {chartType === "pie" ? (
          <PieChart
            data={data}
            labelKey="label"
            valueKey="value"
            title={chartTitle}
            width={720}
            height={420}
            colors={[accent, "#22d3ee", "#a855f7", "#fbbf24", "#94a3b8"]}
          />
        ) : null}
        <div style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>
          {footnote}
        </div>
      </div>
    </>
  );
}
