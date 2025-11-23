import { memo } from "react";

import { useIsEditingAnnotation } from "@/charts/shared/annotation-utils";
import { useLimits } from "@/config-utils";
export const ChartAreasVisualization = (props) => {
    return <ChartDataWrapper {...props} Component={ChartAreas}/>;
};
const ChartAreas = memo((props) => {
    var _a;
    const { chartConfig, dimensions, measures, dimensionsById } = props;
    const { fields, interactiveFiltersConfig } = chartConfig;
    const limits = useLimits({
        chartConfig,
        dimensions,
        measures,
    });
    const isEditingAnnotation = useIsEditingAnnotation();
    return (<AreaChart {...props} limits={limits}>
      <ChartContainer>
        <ChartSvg>
          <AxisHeightLinear />
          <AxisHideXOverflowRect />
          <AxisTime />
          <AxisTimeDomain />
          <Areas />
          <VerticalLimits {...limits}/>
          {isEditingAnnotation ? (<InteractionVoronoi />) : (<InteractionHorizontal />)}
          {interactiveFiltersConfig.timeRange.active && <BrushTime />}
        </ChartSvg>
        {isEditingAnnotation ? (<HoverAnnotationDot />) : (<Tooltip type={fields.segment ? "multiple" : "single"}/>)}
        <Ruler />
      </ChartContainer>
      <Annotations />
      {(fields.segment || limits.limits.length > 0) && (<ChartControlsContainer>
          <LegendColor chartConfig={chartConfig} symbol="square" interactive={interactiveFiltersConfig.legend.active} showTitle={(_a = fields.segment) === null || _a === void 0 ? void 0 : _a.showTitle} dimensionsById={dimensionsById} limits={limits}/>
        </ChartControlsContainer>)}
    </AreaChart>);
});
