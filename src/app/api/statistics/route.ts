import { NextResponse } from 'next/server';
import {
  getChartStatistics,
  getViewStatistics,
  getPopularCharts,
  getDatasetStatistics,
} from '@/lib/statistics/queries';
import {
  isStaticExportBuild,
  staticExportApiUnavailable,
} from '@/lib/next/static-export';

export async function GET() {
  if (isStaticExportBuild) {
    return staticExportApiUnavailable();
  }

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      charts,
      views,
      popularChartsAllTime,
      popularChartsLast30Days,
      datasets,
    ] = await Promise.all([
      getChartStatistics(),
      getViewStatistics(),
      getPopularCharts(25),
      getPopularCharts(25, thirtyDaysAgo),
      getDatasetStatistics(),
    ]);

    return NextResponse.json({
      charts,
      views,
      popularCharts: {
        allTime: popularChartsAllTime,
        last30Days: popularChartsLast30Days,
      },
      datasets,
    });
  } catch (error) {
    console.error('Failed to fetch statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
