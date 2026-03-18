'use client';

import { ResponsiveContainer, Sankey, Tooltip } from 'recharts';

import { getChartColors } from '@/components/charts/shared/chart-data';
import { getSankeyData } from '@/components/charts/shared/sankey-data';
import { createChartFormatters } from '@/components/charts/shared/chart-formatters';
import { ChartFrame } from '@/components/charts/shared/ChartFrame';
import type { ChartRendererComponentProps } from '@/types';

export function SankeyChart({
  config,
  data,
  height = 400,
  locale,
  filterBar,
  previewMode = false,
}: ChartRendererComponentProps) {
  const graph = getSankeyData(data, config);
  const colors = getChartColors(config);
  const { formatNumber } = createChartFormatters(locale);

  if (!graph.nodes.length || !graph.links.length) {
    return (
      <ChartFrame
        title={config.title}
        description={config.description}
        filterBar={filterBar}
        height={height}
        emptyMessage='No linked flow data available for this sankey chart.'
        previewMode={previewMode}
      />
    );
  }

  return (
    <ChartFrame
      title={config.title}
      description={config.description}
      filterBar={filterBar}
      height={height}
      previewMode={previewMode}
    >
      <ResponsiveContainer width='100%' height='100%'>
        <Sankey
          data={graph}
          nodePadding={24}
          margin={{ top: 12, right: 24, bottom: 12, left: 24 }}
          node={{ stroke: colors[0], strokeWidth: 0.5 }}
          link={{
            stroke: colors[1] ?? colors[0],
            fill: 'none',
            strokeOpacity: 0.28,
          }}
        >
          <Tooltip
            formatter={(value) =>
              typeof value === 'number' ? formatNumber(value) : String(value)
            }
          />
        </Sankey>
      </ResponsiveContainer>
    </ChartFrame>
  );
}
