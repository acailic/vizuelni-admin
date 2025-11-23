import { memo } from "react";

import { useIsEditingAnnotation } from "@/charts/shared/annotation-utils";
import { useChartConfigFilters } from "@/config-utils";
export const ChartScatterplotVisualization = (props) => {
    return <ChartDataWrapper {...props} Component={ChartScatterplot}/>;
};
const ChartScatterplot = memo((props) => {
    const { chartConfig, dimensions, dimensionsById } = props;
    const { fields, interactiveFiltersConfig } = chartConfig;
    const filters = useChartConfigFilters(chartConfig);
    const isEditingAnnotation = useIsEditingAnnotation();
    return (<ScatterplotChart {...props}>
      <ChartContainer>
        <ChartSvg>
          <AxisWidthLinear />
          <AxisHeightLinear />
          <AxisWidthLinearDomain />
          <AxisHeightLinearDomain />
          <Scatterplot />
          <InteractionVoronoi />
        </ChartSvg>
        <Ruler />
        {isEditingAnnotation ? (<HoverAnnotationDot />) : (<Tooltip type="single"/>)}
      </ChartContainer>
      <Annotations />
      {(fields.animation || fields.segment) && (<ChartControlsContainer>
          {fields.animation && (<TimeSlider filters={filters} dimensions={dimensions} {...fields.animation}/>)}
          {fields.segment && (<LegendColor dimensionsById={dimensionsById} chartConfig={chartConfig} symbol="circle" interactive={interactiveFiltersConfig.legend.active} showTitle={fields.segment.showTitle}/>)}
        </ChartControlsContainer>)}
    </ScatterplotChart>);
});
