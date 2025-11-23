import { memo } from "react";

import { shouldShowBrush } from "@/charts/shared/brush";
import { hasChartConfigs } from "@/configurator";
import { useConfiguratorState } from "@/src";
export const ChartComboLineColumnVisualization = (props) => {
    return <ChartDataWrapper {...props} Component={ChartComboLineColumn}/>;
};
const ChartComboLineColumn = memo((props) => {
    const { chartConfig } = props;
    const { interactiveFiltersConfig } = chartConfig;
    const [{ dashboardFilters }] = useConfiguratorState(hasChartConfigs);
    return (<ComboLineColumnChart {...props}>
        <ChartContainer>
          <ChartSvg>
            <AxisHeightLinearDual orientation="left"/>
            <AxisHeightLinearDual orientation="right"/>
            <AxisWidthBand />
            <ComboLineColumn />
            <InteractionTemporalColumns />
            {shouldShowBrush(interactiveFiltersConfig, dashboardFilters === null || dashboardFilters === void 0 ? void 0 : dashboardFilters.timeRange) && <BrushTime />}
          </ChartSvg>
          <HoverDotMultiple />
          <Ruler rotate/>
          <Tooltip type="multiple"/>
        </ChartContainer>
      </ComboLineColumnChart>);
});
