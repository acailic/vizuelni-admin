import { memo } from "react";

import { shouldShowBrush } from "@/charts/shared/brush";
import { hasChartConfigs } from "@/configurator";
import { useConfiguratorState } from "@/src";
export const ChartComboLineSingleVisualization = (props) => {
    return <ChartDataWrapper {...props} Component={ChartComboLineSingle}/>;
};
const ChartComboLineSingle = memo((props) => {
    const { chartConfig } = props;
    const { interactiveFiltersConfig } = chartConfig;
    const [{ dashboardFilters }] = useConfiguratorState(hasChartConfigs);
    return (<ComboLineSingleChart {...props}>
        <ChartContainer>
          <ChartSvg>
            <AxisHeightLinear /> <AxisTime /> <AxisTimeDomain />
            <ComboLineSingle />
            <InteractionHorizontal />
            {shouldShowBrush(interactiveFiltersConfig, dashboardFilters === null || dashboardFilters === void 0 ? void 0 : dashboardFilters.timeRange) && <BrushTime />}
          </ChartSvg>
          <HoverDotMultiple />
          <Ruler />
          <Tooltip type="multiple"/>
        </ChartContainer>
      </ComboLineSingleChart>);
});
