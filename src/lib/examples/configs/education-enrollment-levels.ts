import { parseDatasetContent } from '@/lib/data/loader';
import type { FeaturedExampleConfig } from '../types';

import educationRaw from '@/data/serbian-education.json';

const educationDataset = parseDatasetContent(JSON.stringify(educationRaw), {
  format: 'json',
  datasetId: 'serbian-education',
});

export const educationEnrollmentLevelsConfig: FeaturedExampleConfig = {
  id: 'education-enrollment-levels',
  title: {
    sr: 'Образовни нивои',
    lat: 'Obrazovni nivoi',
    en: 'Education Levels',
  },
  description: {
    sr: 'Број ученика и студената по нивоима образовања',
    lat: 'Broj učenika i studenata po nivoima obrazovanja',
    en: 'Number of students by education level',
  },
  datasetId: 'serbian-education',
  resourceUrl: '',
  chartConfig: {
    type: 'pie',
    title: 'Students by Education Level',
    x_axis: { field: 'level', type: 'category', label: 'Education Level' },
    y_axis: { field: 'students', type: 'linear', label: 'Students' },
    options: {
      paletteId: 'government',
      showLegend: true,
      showLabels: true,
      showPercentages: true,
    },
  },
  inlineData: educationDataset,
  category: 'society',
  tags: ['education', 'students', 'schools', 'enrollment'],
  featured: true,
  dataSource: 'МПНТР - Министарство просвете',
  lastUpdated: '2024-12-01',
};
