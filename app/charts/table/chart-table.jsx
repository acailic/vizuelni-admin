import { memo } from "react";

import { shouldShowBrush } from "@/charts/shared/brush";
import { TABLE_TIME_RANGE_HEIGHT } from "@/charts/table/table";
import { hasChartConfigs, useConfiguratorState } from "@/configurator";
export const ChartTableVisualization = (props) => {
    const { observationQueryFilters } = props;
    return (<ChartDataWrapper {...props} observationQueryFilters={observationQueryFilters} Component={ChartTable}/>);
};
const ChartTable = memo(function ChartTable(props) {
    const { chartConfig } = props;
    const { interactiveFiltersConfig } = chartConfig;
    const [{ dashboardFilters }] = useConfiguratorState(hasChartConfigs);
    const showTimeBrush = shouldShowBrush(interactiveFiltersConfig, dashboardFilters === null || dashboardFilters === void 0 ? void 0 : dashboardFilters.timeRange);
    return (<TableChart {...props}>
      <ChartContainer>
        {showTimeBrush && (<svg style={{
                width: "100%",
                height: TABLE_TIME_RANGE_HEIGHT,
                minHeight: TABLE_TIME_RANGE_HEIGHT,
            }}>
            <BrushTime yOffset={10}/>
          </svg>)}
        <Table />
      </ChartContainer>
    </TableChart>);
});
