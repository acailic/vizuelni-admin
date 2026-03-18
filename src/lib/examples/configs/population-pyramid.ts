import type { FeaturedExampleConfig } from '../types';

// Population pyramid data in wide format (male/female columns per age group)
const populationPyramidData = [
  { ageGroup: '0-4', male: 165000, female: 157000 },
  { ageGroup: '5-9', male: 172000, female: 164000 },
  { ageGroup: '10-14', male: 178000, female: 170000 },
  { ageGroup: '15-19', male: 185000, female: 177000 },
  { ageGroup: '20-24', male: 192000, female: 186000 },
  { ageGroup: '25-29', male: 198000, female: 193000 },
  { ageGroup: '30-34', male: 205000, female: 201000 },
  { ageGroup: '35-39', male: 212000, female: 208000 },
  { ageGroup: '40-44', male: 218000, female: 215000 },
  { ageGroup: '45-49', male: 225000, female: 222000 },
  { ageGroup: '50-54', male: 198000, female: 205000 },
  { ageGroup: '55-59', male: 175000, female: 185000 },
  { ageGroup: '60-64', male: 155000, female: 168000 },
  { ageGroup: '65-69', male: 128000, female: 145000 },
  { ageGroup: '70-74', male: 98000, female: 118000 },
  { ageGroup: '75-79', male: 72000, female: 92000 },
  { ageGroup: '80+', male: 58000, female: 85000 },
];

export const populationPyramidConfig: FeaturedExampleConfig = {
  id: 'population-pyramid',
  title: {
    sr: 'Пирамида становништва',
    lat: 'Piramida stanovništva',
    en: 'Population Pyramid',
  },
  description: {
    sr: 'Расподела становништва према старосним групама и полу',
    lat: 'Raspodela stanovništva prema starosnim grupama i polu',
    en: 'Population distribution by age groups and gender',
  },
  datasetId: 'serbian-population-pyramid',
  resourceUrl: '',
  chartConfig: {
    type: 'population-pyramid',
    title: 'Population Pyramid',
    x_axis: { field: 'ageGroup', type: 'category', label: 'Age Group' },
    y_axis: { field: 'male', type: 'linear', label: 'Male' },
    options: {
      showGrid: true,
      showLegend: true,
      grouping: 'grouped',
      pyramidMaleField: 'male',
      pyramidFemaleField: 'female',
      colors: ['#0D4077', '#C6363C'],
    },
  },
  inlineData: {
    observations: populationPyramidData,
    dimensions: [
      {
        key: 'ageGroup',
        label: 'Age Group',
        type: 'categorical',
        values: populationPyramidData.map((d) => d.ageGroup),
        cardinality: populationPyramidData.length,
      },
    ],
    measures: [
      {
        key: 'male',
        label: 'Male',
        min: 58000,
        max: 225000,
        hasNulls: false,
      },
      {
        key: 'female',
        label: 'Female',
        min: 85000,
        max: 222000,
        hasNulls: false,
      },
    ],
    metadataColumns: [],
    columns: ['ageGroup', 'male', 'female'],
    rowCount: populationPyramidData.length,
    source: { format: 'json', name: 'Population Pyramid' },
  },
  category: 'demographics',
  tags: ['demographics', 'population', 'age', 'gender'],
  featured: true,
  dataSource: 'РЗС - Републички завод за статистику',
  lastUpdated: '2024-12-01',
};
