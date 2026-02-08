/**
 * Chart specifications for all chart types.
 *
 * This module contains main chart configuration UI specification object.
 * Each chart type (area, bar, column, line, map, pie, etc.) has
 * its own specification with encodings, filters, and options.
 *
 * Note: @ts-nocheck is used here because this is a complex specification object
 * with embedded functions that were originally in JavaScript. The typing is intentionally
 * loose to match the original implementation while still allowing TypeScript exports.
 *
 * @module chart-config-spec
 */

// @ts-nocheck

import { t } from "@lingui/macro";
import { schemeCategory10 } from "d3-scale-chromatic";
import lodashGet from "lodash/get";
import { setWith } from "lodash/setWith";

import { DEFAULT_SORTING } from "@/charts";
import {
  parseOptionalNumericVariable,
  parseStringVariable,
} from "@/charts/shared/chart-helpers";
import {
  getStackedXScale,
  getStackedYScale,
} from "@/charts/shared/stacked-helpers";
import type { ChartSegmentField } from "@/config-types";
import { makeMultiFilter } from "@/config-utils";
import { mapValueIrisToColor } from "@/configurator/components/ui-helpers";
import { isTemporalDimension } from "@/domain/data";
import { SEGMENT_ENABLED_COMPONENTS } from "@/domain/data";
import { getDefaultCategoricalPaletteId, getPalette } from "@/palettes";

import {
  onColorComponentScaleTypeChange,
  onColorComponentIdChange as onColorComponentIdChangeMap,
  disableStacked,
  defaultSegmentOnChange,
  ANIMATION_FIELD_SPEC,
  getNonStackedDomain,
  isMissingDataPresent,
} from "./chart-config-additional-helpers";
import {
  AREA_SEGMENT_SORTING,
  COLUMN_SEGMENT_SORTING,
  LINE_SEGMENT_SORTING,
  PIE_SEGMENT_SORTING,
} from "./chart-config-ui-constants";

const get = <T>(object: Record<string, T>, path: string): T | undefined =>
  lodashGet(object, path) as T;

const onMapFieldChange = (id, { chartConfig, dimensions, measures, field }) => {
  const fieldConfig = chartConfig.fields[field];
  const components = [...dimensions, ...measures];

  if (field === "areaLayer") {
    const component = components.find((d) => d.id === id);
    const colorComponent = fieldConfig.options.colorComponent;

    if (component && colorComponent && colorComponent.componentId) {
      const paletteId = getDefaultCategoricalPaletteId(
        component,
        colorComponent.paletteId || undefined
      );
      fieldConfig.options.colorComponent.colorMapping = mapValueIrisToColor({
        paletteId,
        dimensionValues: component.values,
      });
    }
  }

  if (field === "symbolLayer") {
    const component = components.find((d) => d.id === id);
    const colorComponent = fieldConfig.options.colorComponent;

    if (component && colorComponent && colorComponent.componentId) {
      const paletteId = getDefaultCategoricalPaletteId(
        component,
        colorComponent.paletteId || undefined
      );
      fieldConfig.options.colorComponent.colorMapping = mapValueIrisToColor({
        paletteId,
        dimensionValues: component.values,
      });
    }
  }
};

/**
 * Chart specifications for all supported chart types.
 *
 * Each chart type defines its encodings (x, y, segment, color, etc.),
 * interactive filters (legend, timeRange, animation), and available options.
 */
export const chartConfigOptionsUISpec = {
  area: {
    chartType: "area",
    encodings: [
      {
        field: "y",
        idAttributes: ["componentId"],
        optional: false,
        componentTypes: ["NumericalMeasure"],
        filters: false,
        onChange: (
          id: string,
          { chartConfig, measures }: { chartConfig: any; measures: any[] }
        ) => {
          const yMeasure = measures.find((d) => d.id === id);
          if (disableStacked(yMeasure)) {
            delete chartConfig.fields.segment;
          }
        },
        options: {
          colorPalette: {
            type: "single",
            paletteId: "schemaCategory10",
            color: schemeCategory10[0],
          },
          showValues: {
            getDisabledState: (chartConfig: any) => {
              return {
                disabled: !!chartConfig.fields.segment,
              };
            },
          },
          adjustScaleDomain: {
            getDefaultDomain: ({ chartConfig, observations }) => {
              const { segment } = chartConfig.fields;
              const getX = (o) => {
                const x = o[chartConfig.fields.x.componentId];
                return parseStringVariable(x);
              };
              const getY = (o) => {
                const y = o[chartConfig.fields.y.componentId] ?? null;
                return parseOptionalNumericVariable(y) ?? 0;
              };

              if (segment) {
                const yScale = getStackedYScale(observations, {
                  normalize:
                    chartConfig.interactiveFiltersConfig.calculation.type ===
                    "percent",
                  getX,
                  getY,
                });
                return yScale.domain() as [number, number];
              }

              return getNonStackedDomain(observations, getX);
            },
          },
          convertUnit: {},
        },
      },
      {
        field: "x",
        idAttributes: ["componentId"],
        optional: false,
        componentTypes: ["TemporalDimension", "TemporalEntityDimension"],
        filters: true,
      },
      {
        field: "segment",
        optional: true,
        idAttributes: ["componentId"],
        componentTypes: SEGMENT_ENABLED_COMPONENTS,
        filters: true,
        sorting: AREA_SEGMENT_SORTING,
        onChange: (id, options) => {
          const { chartConfig, dimensions, measures, selectedValues } = options;
          const components = [...dimensions, ...measures];
          const component = components.find((d) => d.id === id);
          const paletteId = getDefaultCategoricalPaletteId(
            component,
            chartConfig.fields.color && "paletteId" in chartConfig.fields.color
              ? chartConfig.fields.color.paletteId
              : undefined
          );
          const colorMapping = {
            id: component.id,
            mapping: mapValueIrisToColor({
              paletteId,
              dimensionValues: component ? component.values : selectedValues,
            }),
          };

          if (chartConfig.fields.segment) {
            (chartConfig.fields.segment as ChartSegmentField).componentId = id;
            (
              chartConfig.fields.segment as ChartSegmentField
            ).showValuesMapping = {};
          } else {
            chartConfig.fields.segment = {
              componentId: id,
              sorting: DEFAULT_SORTING,
              showValuesMapping: {},
            };
            chartConfig.fields.color = {
              type: "segment",
              paletteId: paletteId,
              colorMapping,
            };
          }

          if (!selectedValues.length || !component) {
            return;
          }

          const multiFilter = makeMultiFilter(
            selectedValues.map((d) => d.value)
          );
          const cube = chartConfig.cubes.find(
            (d) => d.iri === component.cubeIri
          );

          if (cube) {
            cube.filters[id] = multiFilter;
          }
        },
        onDelete: ({ chartConfig }) => {
          delete chartConfig.fields.y.customDomain;
        },
        getDisabledState: (chartConfig, components, data) => {
          const yId = chartConfig.fields.y.componentId;
          const yDimension = components.find((d) => d.id === yId);
          const disabledStacked = disableStacked(yDimension);

          if (disabledStacked) {
            return {
              disabled: true,
              warnMessage: t({
                id: "controls.segment.stacked.disabled-by-scale-type",
                message:
                  "Stacked layout can only be enabled if the vertical axis dimension has a ratio scale.",
              }),
            };
          }

          const missingDataPresent = isMissingDataPresent(
            chartConfig.fields.segment,
            data
          );
          const imputationType = chartConfig.fields.y.imputationType;
          const disabled = false;
          const warnMessage =
            missingDataPresent && (!imputationType || imputationType === "none")
              ? t({
                  id: "controls.section.imputation.explanation",
                  message:
                    "For this chart type, replacement values should be assigned to missing values. Decide on an imputation logic or switch to another chart type.",
                })
              : undefined;

          return {
            disabled,
            warnMessage,
          };
        },
        options: {
          calculation: {},
          colorPalette: {
            type: "single",
            paletteId: "category10",
            color: schemeCategory10[0],
          },
          imputation: {
            shouldShow: (chartConfig, data) => {
              return isMissingDataPresent(chartConfig.fields.segment, data);
            },
          },
          useAbbreviations: {},
        },
      },
    ],
    interactiveFilters: ["legend", "timeRange"],
  },

  bar: {
    chartType: "bar",
    encodings: [
      {
        field: "x",
        idAttributes: ["componentId"],
        optional: false,
        componentTypes: ["NumericalMeasure"],
        filters: false,
        onChange: (
          id: string,
          { chartConfig, measures }: { chartConfig: any; measures: any[] }
        ) => {
          const xMeasure = measures.find((d) => d.id === id);
          if (
            (chartConfig.fields.segment as ChartSegmentField | null)?.type ===
            "stacked"
          ) {
            const xMeasure = measures.find((d) => d.id === id);
            if (disableStacked(xMeasure)) {
              setWith(chartConfig, "fields.segment.type", "grouped", Object);
              if (chartConfig.interactiveFiltersConfig) {
                setWith(
                  chartConfig,
                  "interactiveFiltersConfig.calculation",
                  { active: false, type: "identity" },
                  Object
                );
              }
            }
          }
        },
        options: {
          colorPalette: {
            type: "single",
            paletteId: "category10",
            color: schemeCategory10[0],
          },
          showValues: {
            getDisabledState: (chartConfig: any) => {
              return {
                disabled: !!chartConfig.fields.segment,
              };
            },
          },
          adjustScaleDomain: {
            getDefaultDomain: ({ chartConfig, observations }) => {
              const { segment } = chartConfig.fields;
              const getX = (o) => {
                const x = o[chartConfig.fields.x.componentId];
                return parseStringVariable(x);
              };
              const getY = (o) => {
                const y = o[chartConfig.fields.y.componentId] ?? null;
                return parseOptionalNumericVariable(y) ?? 0;
              };

              if (segment && segment.type === "stacked") {
                const xScale = getStackedXScale(observations, {
                  normalize:
                    chartConfig.interactiveFiltersConfig.calculation.type ===
                    "percent",
                  getX,
                  getY,
                });
                return xScale.domain();
              }

              return getNonStackedDomain(observations, getX);
            },
          },
          convertUnit: {},
        },
      },
      {
        field: "y",
        idAttributes: ["componentId"],
        optional: false,
        componentTypes: ["NumericalMeasure"],
        filters: false,
        onChange: (
          id: string,
          { chartConfig, measures }: { chartConfig: any; measures: any[] }
        ) => {
          const yMeasure = measures.find((d) => d.id === id);
          if (chartConfig.fields.segment?.type === "stacked") {
            const yMeasure = measures.find((d) => d.id === id);
            if (disableStacked(yMeasure)) {
              setWith(chartConfig, "fields.segment.type", "grouped", Object);
              if (chartConfig.interactiveFiltersConfig) {
                setWith(
                  chartConfig,
                  "interactiveFiltersConfig.calculation",
                  { active: false, type: "identity" },
                  Object
                );
              }
            }
          }
        },
        options: {
          colorPalette: {
            type: "single",
            paletteId: "category10",
            color: schemeCategory10[0],
          },
          showValues: {
            getDisabledState: (chartConfig: any) => {
              return {
                disabled: !!chartConfig.fields.segment,
              };
            },
          },
          adjustScaleDomain: {
            getDefaultDomain: ({ chartConfig, observations }) => {
              const { segment } = chartConfig.fields;
              const getX = (o) => {
                const x = o[chartConfig.fields.x.componentId];
                return parseStringVariable(x);
              };
              const getY = (o) => {
                const y = o[chartConfig.fields.y.componentId] ?? null;
                return parseOptionalNumericVariable(y) ?? 0;
              };

              if (segment && segment.type === "stacked") {
                const yScale = getStackedYScale(observations, {
                  normalize:
                    chartConfig.interactiveFiltersConfig.calculation.type ===
                    "percent",
                  getX,
                  getY,
                });
                return yScale.domain() as [number, number];
              }

              return getNonStackedDomain(observations, getX);
            },
          },
          convertUnit: {},
        },
      },
      {
        field: "x",
        idAttributes: ["componentId"],
        optional: false,
        componentTypes: [
          "TemporalDimension",
          "TemporalEntityDimension",
          "NominalDimension",
          "OrdinalDimension",
          "GeoCoordinatesDimension",
          "GeoShapesDimension",
        ],
        filters: true,
        sorting: [
          { sortingType: "byAuto", sortingOrder: ["asc", "desc"] },
          { sortingType: "byMeasure", sortingOrder: ["asc", "desc"] },
          { sortingType: "byDimensionLabel", sortingOrder: ["asc", "desc"] },
        ],
        onChange: (id, { chartConfig, dimensions }) => {
          const component = dimensions.find((d) => d.id === id);
          if (!isTemporalDimension(component)) {
            setWith(
              chartConfig,
              "interactiveFiltersConfig.timeRange.active",
              false,
              Object
            );
          }
        },
        options: {
          useAbbreviations: {},
        },
      },
      {
        field: "segment",
        optional: true,
        idAttributes: ["componentId"],
        componentTypes: SEGMENT_ENABLED_COMPONENTS,
        filters: true,
        sorting: COLUMN_SEGMENT_SORTING,
        onChange: (id, options) => {
          const { chartConfig, dimensions, measures } = options;
          defaultSegmentOnChange(id, options);
          chartConfig.fields.y.showValues = false;
          delete chartConfig.fields.y.customDomain;
          const components = [...dimensions, ...measures];
          const segment = get(chartConfig, "fields.segment");
          const yComponent = components.find(
            (d) => d.id === chartConfig.fields.y.componentId
          );
          setWith(
            chartConfig,
            "fields.segment",
            {
              ...segment,
              type: disableStacked(yComponent) ? "grouped" : "stacked",
            },
            Object
          );
        },
        onDelete: ({ chartConfig }) => {
          delete chartConfig.fields.y.customDomain;
        },
        options: {
          calculation: {
            getDisabledState: (chartConfig: any) => {
              const grouped =
                (chartConfig.fields.segment as ChartSegmentField | null)
                  ?.type === "grouped";
              return {
                disabled: grouped,
                warnMessage: grouped
                  ? t({
                      id: "controls.calculation.disabled-by-grouped",
                      message:
                        "100% mode cannot be used with a grouped layout.",
                    })
                  : undefined,
              };
            },
          },
          chartSubType: {
            getValues: (chartConfig, dimensions) => {
              const yId = chartConfig.fields.y.componentId;
              const yDimension = dimensions.find((d) => d.id === yId);
              const disabledStacked = disableStacked(yDimension);
              return [
                {
                  value: "stacked",
                  disabled: disabledStacked,
                  warnMessage: disabledStacked
                    ? t({
                        id: "controls.segment.stacked.disabled-by-scale-type",
                        message:
                          "Stacked layout can only be enabled if the vertical axis dimension has a ratio scale.",
                      })
                    : undefined,
                },
                {
                  value: "grouped",
                  disabled: false,
                },
              ];
            },
          },
          onChange: (d, { chartConfig }) => {
            if (chartConfig.interactiveFiltersConfig && d === "grouped") {
              const path = "interactiveFiltersConfig.calculation";
              setWith(chartConfig, path, { active: false, type: "identity" });
            }
          },
          colorPalette: {
            type: "single",
            paletteId: "category10",
            color: schemeCategory10[0],
          },
          useAbbreviations: {},
        },
      },
    ],
    interactiveFilters: ["legend", "timeRange", "animation"],
  },

  line: {
    chartType: "line",
    encodings: [
      {
        field: "y",
        idAttributes: ["componentId"],
        optional: false,
        componentTypes: ["NumericalMeasure"],
        filters: false,
        options: {
          colorPalette: {
            type: "single",
            paletteId: "category10",
            color: schemeCategory10[0],
          },
          showValues: {
            getDisabledState: (chartConfig: any) => {
              return {
                disabled: !!chartConfig.fields.segment,
              };
            },
          },
          adjustScaleDomain: {
            getDefaultDomain: ({ chartConfig, observations }) => {
              const getY = (o) => {
                const y = o[chartConfig.fields.y.componentId];
                return parseStringVariable(y);
              };
              return getNonStackedDomain(observations, getY);
            },
          },
          convertUnit: {},
          showDots: {},
          showDotsSize: {},
        },
      },
      {
        idAttributes: ["componentId"],
        field: "x",
        optional: false,
        componentTypes: ["TemporalDimension", "TemporalEntityDimension"],
        filters: true,
      },
      {
        field: "segment",
        optional: true,
        idAttributes: ["componentId"],
        componentTypes: SEGMENT_ENABLED_COMPONENTS,
        filters: true,
        sorting: LINE_SEGMENT_SORTING,
        onChange: (id, options) => {
          const { chartConfig, dimensions, measures, selectedValues } = options;
          defaultSegmentOnChange(id, options);
          delete options.chartConfig.fields.y.customDomain;
        },
        onDelete: ({ chartConfig }) => {
          delete chartConfig.fields.y.customDomain;
        },
        options: {
          colorPalette: {
            type: "single",
            paletteId: "category10",
            color: schemeCategory10[0],
          },
          useAbbreviations: {},
        },
      },
    ],
    interactiveFilters: ["legend", "timeRange"],
  },

  map: {
    chartType: "map",
    encodings: [
      {
        idAttributes: [],
        field: "baseLayer",
        optional: true,
        componentTypes: [],
        filters: false,
      },
      {
        idAttributes: ["componentId", "color.componentId"],
        field: "areaLayer",
        optional: true,
        componentTypes: ["GeoShapesDimension"],
        exclusive: false,
        filters: true,
        onChange: onMapFieldChange,
        options: {
          colorComponent: {
            componentTypes: ["NumericalMeasure", "OrdinalMeasure"],
            optional: false,
            enableUseAbbreviations: true,
            onComponentIdChange: onColorComponentIdChangeMap,
            onScaleTypeChange: onColorComponentScaleTypeChange,
          },
          convertUnit: {},
        },
      },
      {
        idAttributes: ["componentId", "color.componentId"],
        field: "symbolLayer",
        optional: true,
        componentTypes: ["GeoCoordinatesDimension", "GeoShapesDimension"],
        exclusive: false,
        filters: true,
        onChange: onMapFieldChange,
        options: {
          colorComponent: {
            componentTypes: [
              "NumericalMeasure",
              "OrdinalMeasure",
              "GeoCoordinatesDimension",
              "GeoShapesDimension",
              "NominalDimension",
              "OrdinalDimension",
              "TemporalOrdinalDimension",
            ],
            optional: true,
            enableUseAbbreviations: true,
            onComponentIdChange: onColorComponentIdChangeMap,
            onScaleTypeChange: onColorComponentScaleTypeChange,
          },
          size: {
            componentTypes: ["NumericalMeasure"],
            optional: true,
          },
          convertUnit: {},
        },
      },
      {
        idAttributes: [],
        field: "customLayers",
        optional: true,
        componentTypes: [],
        filters: false,
      },
      ANIMATION_FIELD_SPEC,
    ],
    interactiveFilters: ["animation"],
  },

  pie: {
    chartType: "pie",
    encodings: [
      {
        idAttributes: ["componentId"],
        field: "y",
        optional: false,
        componentTypes: ["NumericalMeasure"],
        filters: false,
        options: {
          showValues: {},
          convertUnit: {},
        },
      },
      {
        idAttributes: ["componentId"],
        field: "segment",
        optional: false,
        componentTypes: SEGMENT_ENABLED_COMPONENTS,
        filters: true,
        sorting: PIE_SEGMENT_SORTING,
        onChange: defaultSegmentOnChange,
        options: {
          colorPalette: {
            type: "single",
            paletteId: "category10",
            color: schemeCategory10[0],
          },
          useAbbreviations: {},
        },
      },
      ANIMATION_FIELD_SPEC,
    ],
    interactiveFilters: ["legend", "animation"],
  },

  scatterplot: {
    chartType: "scatterplot",
    encodings: [
      {
        field: "x",
        idAttributes: ["componentId"],
        optional: false,
        componentTypes: ["NumericalMeasure"],
        filters: false,
        options: {
          convertUnit: {},
        },
      },
      {
        field: "y",
        idAttributes: ["componentId"],
        optional: false,
        componentTypes: ["NumericalMeasure"],
        filters: false,
        options: {
          convertUnit: {},
        },
      },
      {
        idAttributes: ["componentId"],
        field: "segment",
        optional: false,
        componentTypes: SEGMENT_ENABLED_COMPONENTS,
        filters: true,
        sorting: [
          { sortingType: "byAuto", sortingOrder: ["asc", "desc"] },
          { sortingType: "byMeasure", sortingOrder: ["asc", "desc"] },
          { sortingType: "byDimensionLabel", sortingOrder: ["asc", "desc"] },
        ],
        onChange: defaultSegmentOnChange,
        options: {
          colorPalette: {
            type: "single",
            paletteId: "category10",
            color: schemeCategory10[0],
          },
          useAbbreviations: {},
        },
      },
      ANIMATION_FIELD_SPEC,
    ],
    interactiveFilters: ["legend", "animation"],
  },

  table: {
    chartType: "table",
    encodings: [],
    interactiveFilters: [],
  },

  comboLineSingle: {
    chartType: "comboLineSingle",
    encodings: [
      {
        idAttributes: ["componentIds"],
        field: "y",
        optional: false,
        customComponent: true,
        componentTypes: ["NumericalMeasure"],
        filters: false,
        options: {
          componentIds: {
            onChange: (ids, { chartConfig }) => {
              const { fields } = chartConfig;
              const { color } = fields;
              const palette = getPalette({ paletteId: color.paletteId });
              const newColorMapping = Object.fromEntries(
                ids.map((id, i) => [id, color.colorMapping?.[id] ?? palette[i]])
              );
              chartConfig.fields.color.colorMapping = newColorMapping;
            },
          },
        },
      },
      {
        idAttributes: ["componentId"],
        field: "x",
        optional: false,
        componentTypes: ["TemporalDimension", "TemporalEntityDimension"],
        filters: true,
      },
      {
        idAttributes: ["componentId"],
        field: "segment",
        optional: true,
        componentTypes: SEGMENT_ENABLED_COMPONENTS,
        filters: true,
        sorting: [
          { sortingType: "byAuto", sortingOrder: ["asc", "desc"] },
          { sortingType: "byMeasure", sortingOrder: ["asc", "desc"] },
          { sortingType: "byDimensionLabel", sortingOrder: ["asc", "desc"] },
        ],
        onChange: (id, { chartConfig, dimensions }) => {
          const component = dimensions.find((d) => d.id === id);
          if (!isTemporalDimension(component)) {
            setWith(
              chartConfig,
              "interactiveFiltersConfig.timeRange.active",
              false,
              Object
            );
          }
        },
        options: {
          useAbbreviations: {},
        },
      },
    ],
    interactiveFilters: [],
  },

  comboLineDual: {
    chartType: "comboLineDual",
    encodings: [
      {
        field: "y",
        idAttributes: ["leftAxisComponentId", "rightAxisComponentId"],
        optional: false,
        customComponent: true,
        componentTypes: ["NumericalMeasure"],
        filters: false,
        options: {
          leftAxisComponentId: {
            onChange: (id, { chartConfig }) => {
              const { fields } = chartConfig;
              const { y, color } = fields;
              chartConfig.fields.color.colorMapping = {
                [id]: color.colorMapping[y.leftAxisComponentId],
                [y.rightAxisComponentId]:
                  color.colorMapping[y.rightAxisComponentId],
              };
            },
          },
          rightAxisComponentId: {
            onChange: (id, { chartConfig }) => {
              const { fields } = chartConfig;
              const { y, color } = fields;
              chartConfig.fields.color.colorMapping = {
                [y.leftAxisComponentId]:
                  color.colorMapping[y.leftAxisComponentId],
                [id]: color.colorMapping[y.rightAxisComponentId],
              };
            },
          },
        },
      },
      {
        idAttributes: ["componentId"],
        field: "x",
        optional: false,
        componentTypes: ["TemporalDimension", "TemporalEntityDimension"],
        filters: true,
      },
      {
        idAttributes: ["componentId"],
        field: "segment",
        optional: true,
        componentTypes: SEGMENT_ENABLED_COMPONENTS,
        filters: true,
        sorting: [
          { sortingType: "byAuto", sortingOrder: ["asc", "desc"] },
          { sortingType: "byMeasure", sortingOrder: ["asc", "desc"] },
          { sortingType: "byDimensionLabel", sortingOrder: ["asc", "desc"] },
        ],
        onChange: defaultSegmentOnChange,
        options: {
          colorPalette: {
            type: "single",
            paletteId: "category10",
            color: schemeCategory10[0],
          },
          useAbbreviations: {},
        },
      },
    ],
    interactiveFilters: [],
  },

  comboLineColumn: {
    chartType: "comboLineColumn",
    encodings: [
      {
        field: "y",
        optional: false,
        idAttributes: ["lineComponentId", "columnComponentId"],
        componentTypes: ["NumericalMeasure"],
        filters: false,
        options: {
          lineComponentId: {
            onChange: (id, { chartConfig }) => {
              const { fields } = chartConfig;
              const { y, color } = fields;
              const lineColor = color.colorMapping?.[id];
              const columnColor = color.colorMapping?.[id];
              chartConfig.fields.color.colorMapping =
                fields.y.lineAxisOrientation === "left"
                  ? {
                      [id]: lineColor,
                      [fields.y.columnComponentId]: columnColor,
                    }
                  : {
                      [fields.y.columnComponentId]: columnColor,
                      [id]: lineColor,
                    };
            },
          },
          columnComponentId: {
            onChange: (id, { chartConfig }) => {
              const { fields } = chartConfig;
              const { y, color } = fields;
              const lineColor = color.colorMapping?.[id];
              const columnColor =
                color.colorMapping?.[fields.y.columnComponentId];
              chartConfig.fields.color.colorMapping =
                fields.y.lineAxisOrientation === "left"
                  ? {
                      [id]: lineColor,
                      [fields.y.columnComponentId]: columnColor,
                    }
                  : {
                      [fields.y.columnComponentId]: columnColor,
                      [id]: lineColor,
                    };
            },
          },
          lineAxisOrientation: {
            onChange: (_, { chartConfig }) => {
              const { fields } = chartConfig;
              const { y, color } = fields;
              const lineAxisLeft = fields.y.lineAxisOrientation === "left";
              const firstId = lineAxisLeft
                ? fields.y.columnComponentId
                : fields.y.lineComponentId;
              const secondId = lineAxisLeft
                ? fields.y.lineComponentId
                : fields.y.columnComponentId;
              chartConfig.fields.color.colorMapping = {
                [firstId]: color.colorMapping[secondId],
                [secondId]: color.colorMapping[firstId],
              };
            },
          },
        },
      },
      {
        field: "x",
        idAttributes: ["componentId"],
        optional: false,
        componentTypes: ["TemporalDimension", "TemporalEntityDimension"],
        filters: true,
      },
      {
        field: "segment",
        optional: true,
        idAttributes: ["componentId"],
        componentTypes: SEGMENT_ENABLED_COMPONENTS,
        filters: true,
        sorting: [
          { sortingType: "byAuto", sortingOrder: ["asc", "desc"] },
          { sortingType: "byMeasure", sortingOrder: ["asc", "desc"] },
          { sortingType: "byDimensionLabel", sortingOrder: ["asc", "desc"] },
        ],
        onChange: defaultSegmentOnChange,
        options: {
          colorPalette: {
            type: "single",
            paletteId: "category10",
            color: schemeCategory10[0],
          },
          useAbbreviations: {},
        },
      },
    ],
    interactiveFilters: [],
  },
};
