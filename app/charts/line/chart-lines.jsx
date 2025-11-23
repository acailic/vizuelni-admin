import { memo } from "react";

import { useIsEditingAnnotation } from "@/charts/shared/annotation-utils";
import { shouldShowBrush } from "@/charts/shared/brush";
import { useLimits } from "@/config-utils";
import { hasChartConfigs, useConfiguratorState, } from "@/configurator/configurator-state";
export const ChartLinesVisualization = (props) => {
    return <ChartDataWrapper {...props} Component={ChartLines}/>;
};
const ChartLines = memo((props) => {
    var _a;
    const { chartConfig, dimensions, measures, dimensionsById } = props;
    const { fields, interactiveFiltersConfig } = chartConfig;
    const [{ dashboardFilters }] = useConfiguratorState(hasChartConfigs);
    const limits = useLimits({
        chartConfig,
        dimensions,
        measures,
    });
    const isEditingAnnotation = useIsEditingAnnotation();
    return (<LineChart {...props} limits={limits}>
      <ChartContainer>
        <ChartSvg>
          <AxisHeightLinear />
          <AxisHideXOverflowRect />
          <AxisTime />
          <AxisTimeDomain />
          <Lines dotSize={"showDots" in chartConfig.fields.y &&
            "showDotsSize" in chartConfig.fields.y &&
            chartConfig.fields.y.showDots
            ? chartConfig.fields.y.showDotsSize
            : undefined}/>
          <ErrorWhiskers />
          <VerticalLimits {...limits}/>
          {isEditingAnnotation ? (<InteractionVoronoi />) : (<InteractionHorizontal />)}
          {shouldShowBrush(interactiveFiltersConfig, dashboardFilters === null || dashboardFilters === void 0 ? void 0 : dashboardFilters.timeRange) && <BrushTime />}
        </ChartSvg>
        <Ruler />
        {isEditingAnnotation ? <HoverAnnotationDot /> : <HoverDotMultiple />}
        <Tooltip type={fields.segment ? "multiple" : "single"}/>
      </ChartContainer>
      <Annotations />
      {(fields.segment || limits.limits.length > 0) && (<ChartControlsContainer>
          <LegendColor dimensionsById={dimensionsById} chartConfig={chartConfig} symbol="line" interactive={interactiveFiltersConfig.legend.active} showTitle={(_a = fields.segment) === null || _a === void 0 ? void 0 : _a.showTitle} limits={limits}/>
        </ChartControlsContainer>)}
    </LineChart>);
});
