import type { EmbedLang, EmbedTheme } from "@/lib/embed-url";

export const UI_ONLY_PARAMS = new Set(["theme", "lang", "width", "height"]);
export const CHART_PARAMS = new Set(["type", "dataset", "dataSource"]);
export const EMBED_LAYOUT_PARAMS = [
  "removeBorder",
  "optimizeSpace",
  "removeMoreOptionsButton",
  "removeLabelsInteractivity",
  "removeFootnotes",
  "removeFilters",
] as const;

export type EmbedLayoutParam = (typeof EMBED_LAYOUT_PARAMS)[number];

export const DEFAULT_LAYOUT_PARAMS: Record<EmbedLayoutParam, boolean> = {
  removeBorder: false,
  optimizeSpace: false,
  removeMoreOptionsButton: false,
  removeLabelsInteractivity: false,
  removeFootnotes: false,
  removeFilters: false,
};

export const FORM_MANAGED_PARAMS = new Set([
  ...UI_ONLY_PARAMS,
  ...CHART_PARAMS,
  ...EMBED_LAYOUT_PARAMS,
]);

interface EmbedPassthroughOptions {
  chartType: string;
  dataset: string;
  dataSource: string;
  layoutParams: Record<EmbedLayoutParam, boolean>;
  resolvedQuery: Record<string, string>;
}

export const buildEmbedPassthroughParams = ({
  chartType,
  dataset,
  dataSource,
  layoutParams,
  resolvedQuery,
}: EmbedPassthroughOptions) => {
  const additionalParams = Object.fromEntries(
    Object.entries(resolvedQuery)
      .filter(([key]) => !FORM_MANAGED_PARAMS.has(key))
      .filter(
        ([, value]) => value !== undefined && value !== null && value !== ""
      )
  );

  const fromForm: Record<string, string> = {
    ...additionalParams,
  };

  if (chartType.trim() !== "") {
    fromForm.type = chartType.trim();
  }
  if (dataset.trim() !== "") {
    fromForm.dataset = dataset.trim();
  }
  if (dataSource.trim() !== "") {
    fromForm.dataSource = dataSource.trim();
  }

  EMBED_LAYOUT_PARAMS.forEach((param) => {
    if (layoutParams[param]) {
      fromForm[param] = "true";
    }
  });

  return fromForm;
};

export const resolveEmbedStateFromQuery = (
  resolvedQuery: Record<string, string>,
  defaultLang: EmbedLang
) => {
  const lang =
    resolvedQuery.lang === "en" || resolvedQuery.lang === "sr"
      ? resolvedQuery.lang
      : defaultLang;
  const theme =
    resolvedQuery.theme === "light" || resolvedQuery.theme === "dark"
      ? resolvedQuery.theme
      : ("light" as EmbedTheme);

  return {
    width: resolvedQuery.width?.trim() || "100%",
    height: resolvedQuery.height?.trim() || "520px",
    theme,
    lang,
    chartType: resolvedQuery.type?.trim() || "line",
    dataset: resolvedQuery.dataset ?? "",
    dataSource: resolvedQuery.dataSource ?? "",
    layoutParams: {
      removeBorder: resolvedQuery.removeBorder === "true",
      optimizeSpace: resolvedQuery.optimizeSpace === "true",
      removeMoreOptionsButton: resolvedQuery.removeMoreOptionsButton === "true",
      removeLabelsInteractivity:
        resolvedQuery.removeLabelsInteractivity === "true",
      removeFootnotes: resolvedQuery.removeFootnotes === "true",
      removeFilters: resolvedQuery.removeFilters === "true",
    } satisfies Record<EmbedLayoutParam, boolean>,
  };
};

export const buildIframeSnippet = ({
  iframeSrc,
  width,
  height,
  removeBorder,
}: {
  iframeSrc: string;
  width: string;
  height: string;
  removeBorder: boolean;
}) => {
  const borderStyle = removeBorder
    ? "border: 0;"
    : "border: 1px solid rgba(15, 23, 42, 0.16);";

  return `<iframe
  src="${iframeSrc}"
  style="width: ${width}; height: ${height}; ${borderStyle}"
  loading="lazy"
  referrerpolicy="no-referrer"
></iframe>`;
};
