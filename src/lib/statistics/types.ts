// src/lib/statistics/types.ts
export interface ChartStatistics {
  total: number;
  perMonthAverage: number;
  dashboards: number;
}

export interface ViewStatistics {
  total: number;
  perMonthAverage: number;
  previews: number;
}

export interface PopularChart {
  id: string;
  title: string;
  thumbnail: string | null;
  views: number;
  createdAt: Date;
  createdBy: string | null;
}

export interface DatasetStatistics {
  total: number;
  usedInCharts: number;
  organizations: number;
}

export interface StatisticsResponse {
  charts: ChartStatistics;
  views: ViewStatistics;
  popularCharts: {
    allTime: PopularChart[];
    last30Days: PopularChart[];
  };
  datasets: DatasetStatistics;
}
