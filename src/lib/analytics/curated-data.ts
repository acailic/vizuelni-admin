import type { AnalyticsDomain, KPIMetric, YearDataset } from './types';

// 26 Serbian administrative districts (excluding Kosovo districts 26-30)
// Codes match the GeoJSON `properties.id` field
const DISTRICTS = [
  { code: '00', name: 'City of Belgrade', nameCyrl: 'Град Београд', nameLatn: 'Grad Beograd' },
  { code: '01', name: 'North Bačka', nameCyrl: 'Севернобачки', nameLatn: 'Severnobački' },
  { code: '02', name: 'Central Bačka', nameCyrl: 'Средњобачки', nameLatn: 'Srednjobački' },
  { code: '03', name: 'South Bačka', nameCyrl: 'Јужнобачки', nameLatn: 'Južnobački' },
  { code: '04', name: 'West Bačka', nameCyrl: 'Западнобачки', nameLatn: 'Zapadnobački' },
  { code: '05', name: 'North Banat', nameCyrl: 'Севернобанатски', nameLatn: 'Severnobanatski' },
  { code: '06', name: 'Central Banat', nameCyrl: 'Средњобанатски', nameLatn: 'Srednjobanatski' },
  { code: '07', name: 'South Banat', nameCyrl: 'Јужнобанатски', nameLatn: 'Južnobanatski' },
  { code: '08', name: 'Syrmia', nameCyrl: 'Сремски', nameLatn: 'Sremski' },
  { code: '09', name: 'Mačva', nameCyrl: 'Мачвански', nameLatn: 'Mačvanski' },
  { code: '10', name: 'Kolubara', nameCyrl: 'Колубарски', nameLatn: 'Kolubarski' },
  { code: '11', name: 'Podunavlje', nameCyrl: 'Подунавски', nameLatn: 'Podunavski' },
  { code: '12', name: 'Braničevo', nameCyrl: 'Браничевски', nameLatn: 'Braničevski' },
  { code: '13', name: 'Šumadija', nameCyrl: 'Шумадијски', nameLatn: 'Šumadijski' },
  { code: '14', name: 'Pomoravlje', nameCyrl: 'Поморавски', nameLatn: 'Pomoravski' },
  { code: '15', name: 'Bor', nameCyrl: 'Борски', nameLatn: 'Borski' },
  { code: '16', name: 'Zaječar', nameCyrl: 'Зајечарски', nameLatn: 'Zaječarski' },
  { code: '17', name: 'Raška', nameCyrl: 'Рашки', nameLatn: 'Raški' },
  { code: '18', name: 'Rasina', nameCyrl: 'Расински', nameLatn: 'Rasinski' },
  { code: '19', name: 'Toplica', nameCyrl: 'Топлички', nameLatn: 'Toplički' },
  { code: '20', name: 'Pirot', nameCyrl: 'Пиротски', nameLatn: 'Pirotski' },
  { code: '21', name: 'Jablanica', nameCyrl: 'Јабланички', nameLatn: 'Jablanički' },
  { code: '22', name: 'Nišava', nameCyrl: 'Нишавски', nameLatn: 'Nišavski' },
  { code: '23', name: 'Pčinja', nameCyrl: 'Пчињски', nameLatn: 'Pčinjski' },
  { code: '24', name: 'Zlatibor', nameCyrl: 'Златиборски', nameLatn: 'Zlatiborski' },
  { code: '25', name: 'Moravica', nameCyrl: 'Моравички', nameLatn: 'Moravički' },
];

// Population data (in thousands) — source pattern: RZS Census & estimates
const POPULATION_BY_YEAR: Record<number, number[]> = {
  2019: [1695, 183, 168, 648, 181, 141, 180, 283, 311, 280, 175, 196, 175, 280, 201, 120, 101, 302, 232, 93, 91, 217, 373, 168, 281, 200],
  2020: [1703, 181, 166, 645, 179, 139, 178, 280, 308, 277, 173, 194, 172, 277, 198, 118, 99, 298, 229, 91, 89, 214, 370, 165, 278, 197],
  2021: [1708, 179, 164, 640, 177, 137, 176, 277, 305, 273, 171, 192, 169, 274, 195, 116, 97, 294, 226, 89, 87, 211, 367, 163, 275, 194],
  2022: [1713, 177, 162, 634, 175, 135, 174, 274, 302, 270, 169, 190, 167, 271, 192, 114, 95, 290, 223, 87, 85, 208, 364, 160, 272, 191],
  2023: [1720, 175, 160, 630, 173, 133, 172, 271, 299, 267, 167, 188, 164, 268, 189, 112, 93, 286, 220, 85, 83, 205, 361, 158, 269, 188],
};

// GDP per capita (thousand RSD) — source pattern: RZS regional accounts
const GDP_BY_YEAR: Record<number, number[]> = {
  2019: [3150, 1420, 1280, 2080, 1180, 1190, 1210, 1320, 1580, 1020, 1350, 1240, 1150, 1580, 1020, 1980, 1080, 980, 1060, 890, 1020, 880, 1580, 760, 1120, 1280],
  2020: [3280, 1470, 1330, 2160, 1230, 1240, 1260, 1370, 1640, 1060, 1400, 1290, 1200, 1640, 1060, 2060, 1120, 1020, 1100, 930, 1060, 920, 1640, 800, 1170, 1330],
  2021: [3390, 1520, 1380, 2240, 1280, 1290, 1310, 1420, 1700, 1110, 1450, 1340, 1250, 1700, 1110, 2140, 1160, 1060, 1140, 970, 1100, 960, 1700, 840, 1220, 1380],
  2022: [3520, 1580, 1430, 2330, 1330, 1340, 1360, 1480, 1770, 1160, 1510, 1400, 1300, 1770, 1160, 2240, 1210, 1110, 1190, 1010, 1150, 1000, 1770, 880, 1280, 1440],
  2023: [3680, 1650, 1490, 2430, 1390, 1400, 1420, 1550, 1850, 1220, 1580, 1470, 1360, 1850, 1220, 2350, 1270, 1170, 1250, 1060, 1210, 1050, 1850, 930, 1350, 1510],
};

// Students per 10,000 population — source pattern: MPS enrollment data
const EDUCATION_BY_YEAR: Record<number, number[]> = {
  2019: [785, 580, 450, 740, 480, 420, 430, 490, 510, 430, 440, 460, 390, 590, 420, 380, 370, 520, 460, 350, 360, 400, 700, 420, 490, 510],
  2020: [790, 582, 452, 745, 481, 421, 432, 492, 513, 432, 442, 462, 392, 593, 422, 381, 371, 522, 462, 351, 362, 401, 704, 421, 492, 512],
  2021: [795, 584, 453, 750, 482, 422, 433, 494, 515, 434, 444, 464, 393, 596, 424, 382, 372, 524, 464, 352, 363, 402, 708, 423, 494, 514],
  2022: [800, 586, 455, 755, 483, 423, 435, 496, 518, 436, 446, 466, 394, 599, 426, 383, 373, 526, 466, 353, 365, 403, 712, 424, 496, 516],
  2023: [808, 588, 456, 760, 484, 424, 436, 498, 520, 438, 448, 468, 395, 602, 428, 384, 374, 528, 468, 354, 366, 404, 716, 426, 498, 518],
};

// Hospital beds per 10,000 population — source pattern: MZ health statistics
const HEALTH_BY_YEAR: Record<number, number[]> = {
  2019: [79, 48, 33, 62, 42, 38, 40, 45, 44, 36, 35, 38, 32, 65, 38, 36, 44, 41, 42, 30, 34, 38, 72, 35, 48, 52],
  2020: [80, 49, 33, 63, 42, 38, 40, 46, 45, 36, 35, 38, 32, 66, 38, 37, 44, 42, 42, 30, 34, 38, 73, 35, 49, 53],
  2021: [81, 49, 34, 64, 43, 39, 41, 46, 45, 37, 36, 39, 33, 67, 39, 37, 45, 42, 43, 31, 35, 39, 74, 36, 49, 53],
  2022: [82, 50, 34, 65, 43, 39, 41, 47, 46, 37, 36, 39, 33, 68, 39, 38, 45, 43, 43, 31, 35, 39, 75, 36, 50, 54],
  2023: [83, 50, 35, 66, 44, 40, 42, 47, 46, 38, 37, 40, 34, 69, 40, 38, 46, 43, 44, 32, 36, 40, 76, 37, 51, 55],
};

function buildDatasets(dataByYear: Record<number, number[]>): YearDataset[] {
  return [2019, 2020, 2021, 2022, 2023].map((year) => ({
    year,
    points: DISTRICTS.map((d, i) => ({
      code: d.code,
      name: d.name,
      nameCyrl: d.nameCyrl,
      nameLatn: d.nameLatn,
      value: dataByYear[year][i],
      year,
    })),
  }));
}

export const ANALYTICS_DOMAINS: AnalyticsDomain[] = [
  {
    id: 'demographics',
    metricLabel: 'Population',
    unit: 'thousands',
    datasets: buildDatasets(POPULATION_BY_YEAR),
  },
  {
    id: 'economy',
    metricLabel: 'GDP per Capita',
    unit: '000 RSD',
    datasets: buildDatasets(GDP_BY_YEAR),
  },
  {
    id: 'education',
    metricLabel: 'Students',
    unit: 'per 10,000',
    datasets: buildDatasets(EDUCATION_BY_YEAR),
  },
  {
    id: 'health',
    metricLabel: 'Hospital Beds',
    unit: 'per 10,000',
    datasets: buildDatasets(HEALTH_BY_YEAR),
  },
];

export const AVAILABLE_YEARS = [2019, 2020, 2021, 2022, 2023];

export function getDatasetForYear(
  domain: AnalyticsDomain,
  year: number
): YearDataset | undefined {
  return domain.datasets.find((d) => d.year === year);
}

// National KPI metrics — Serbia-level aggregate values (2022 vs 2023)
export const KPI_METRICS: KPIMetric[] = [
  {
    key: 'population',
    label: 'Population',
    value: 6833000,
    previousValue: 6853000,
    unit: 'people',
    currentYear: 2023,
    previousYear: 2022,
  },
  {
    key: 'gdp',
    label: 'GDP per Capita',
    value: 1654,
    previousValue: 1582,
    unit: '000 RSD',
    currentYear: 2023,
    previousYear: 2022,
  },
  {
    key: 'employment',
    label: 'Employment Rate',
    value: 50.2,
    previousValue: 49.6,
    unit: '%',
    currentYear: 2023,
    previousYear: 2022,
  },
  {
    key: 'districts',
    label: 'Districts',
    value: 25,
    previousValue: 25,
    unit: 'total',
    currentYear: 2023,
    previousYear: 2022,
  },
];
