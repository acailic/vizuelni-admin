import keyBy from "lodash/keyBy";

import { tableConfig, tableDimensions, tableMeasures, tableObservations, } from "@/docs/fixtures";
const meta = {
    title: "Charts / Charts / Data Table",
};
export default meta;
const DataTableStory = {
    render: () => {
        return (<InteractiveFiltersProvider chartConfigs={[tableConfig]}>
        <InteractiveFiltersChartProvider chartConfigKey={tableConfig.key}>
          <TableChart observations={tableObservations} dimensions={tableDimensions} dimensionsById={keyBy(tableDimensions, (d) => d.id)} measures={tableMeasures} measuresById={keyBy(tableMeasures, (d) => d.id)} chartConfig={tableConfig}>
            <ChartContainer>
              <Table />
            </ChartContainer>
          </TableChart>
        </InteractiveFiltersChartProvider>
      </InteractiveFiltersProvider>);
    },
};
export { DataTableStory as DataTable };
