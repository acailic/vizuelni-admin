import { memo } from "react";

import { shouldShowBrush } from "@/charts/shared/brush";
import { hasChartConfigs } from "@/configurator";
import { useConfiguratorState } from "@/src";
export const ChartComboLineDualVisualization = (props) => {
    return <ChartDataWrapper {...props} Component={ChartComboLineDual}/>;
};
const ChartComboLineDual = memo((props) => {
    const { chartConfig } = props;
    const { interactiveFiltersConfig } = chartConfig;
    const [{ dashboardFilters }] = useConfiguratorState(hasChartConfigs);
    return (<ComboLineDualChart {...props}>
      <ChartContainer>
        <ChartSvg>
          <AxisHeightLinearDual orientation="left"/>
          <AxisHeightLinearDual orientation="right"/>
          <AxisTime />
          <AxisTimeDomain />
          <ComboLineDual />
          <InteractionHorizontal />
          {shouldShowBrush(interactiveFiltersConfig, dashboardFilters === null || dashboardFilters === void 0 ? void 0 : dashboardFilters.timeRange) && <BrushTime />}
        </ChartSvg>
        <HoverDotMultiple />
        <Ruler />
        <Tooltip type="multiple"/>
      </ChartContainer>
    </ComboLineDualChart>);
});
