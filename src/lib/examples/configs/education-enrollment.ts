import type { FeaturedExampleConfig } from '../types';

export const educationEnrollmentConfig: FeaturedExampleConfig = {
  id: 'education-enrollment',
  title: {
    sr: 'Упис у образовање',
    lat: 'Upis u obrazovanje',
    en: 'Education Enrollment',
  },
  description: {
    sr: 'Стопа уписа у основне, средње и факултетске школе',
    lat: 'Stopa upisa u osnovne, srednje i fakultetske škole',
    en: 'Enrollment rates in primary, secondary and university education',
  },
  datasetId: 'education-enrollment',
  resourceUrl: '/data/education-enrollment.csv',
  category: 'demographics',
  chartConfig: {
    type: 'area',
    title: 'Education Enrollment',
    x_axis: { field: 'year', type: 'category', label: 'Year' },
    y_axis: {
      field: 'university',
      type: 'linear',
      label: 'University Enrollment (%)',
    },
    options: { paletteId: 'government', showLegend: true, showGrid: true },
  },
  tags: ['education', 'enrollment', 'students', 'schools'],
  dataSource: 'Ministry of Education of the Republic of Serbia',
  lastUpdated: '2024-06-01',
};
