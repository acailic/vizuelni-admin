export interface RegionDataPoint {
  code: string; // district id from GeoJSON, e.g. "00"
  name: string; // English name
  nameCyrl: string; // Serbian Cyrillic name
  nameLatn: string; // Serbian Latin name
  value: number;
  year: number;
}

export interface YearDataset {
  year: number;
  points: RegionDataPoint[];
}

export type DomainId = 'demographics' | 'economy' | 'education' | 'health';

export interface AnalyticsDomain {
  id: DomainId;
  metricLabel: string;
  unit: string;
  datasets: YearDataset[];
}

export interface KPIMetric {
  key: string;
  label: string;
  value: number;
  previousValue: number;
  unit: string;
  currentYear: number;
  previousYear: number;
}
