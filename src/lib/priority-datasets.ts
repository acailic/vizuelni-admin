import type { Locale } from '@/lib/i18n/config';
import type { BrowseSearchParams } from '@/types/browse';

export interface PriorityDatasetPreset {
  id: string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  searchParams: Partial<BrowseSearchParams>;
}

export const PRIORITY_DATASET_PRESETS: PriorityDatasetPreset[] = [
  {
    id: 'public-administration',
    title: {
      'sr-Cyrl': 'Управа и становништво',
      'sr-Latn': 'Uprava i stanovništvo',
      en: 'Administration and population',
    },
    description: {
      'sr-Cyrl': 'Регистри, локална управа и административни скупови података.',
      'sr-Latn': 'Registri, lokalna uprava i administrativni skupovi podataka.',
      en: 'Registers, local administration, and operational public datasets.',
    },
    searchParams: {
      topic: 'uprava',
      page: 1,
    },
  },
  {
    id: 'health',
    title: {
      'sr-Cyrl': 'Здравље',
      'sr-Latn': 'Zdravlje',
      en: 'Health',
    },
    description: {
      'sr-Cyrl': 'Јавно здравље, лекови и здравствени индикатори.',
      'sr-Latn': 'Javno zdravlje, lekovi i zdravstveni indikatori.',
      en: 'Public health, medicines, and healthcare indicators.',
    },
    searchParams: {
      topic: 'zdravlje',
      page: 1,
    },
  },
  {
    id: 'environment',
    title: {
      'sr-Cyrl': 'Животна средина',
      'sr-Latn': 'Životna sredina',
      en: 'Environment',
    },
    description: {
      'sr-Cyrl': 'Квалитет ваздуха, отпад и просторни еколошки подаци.',
      'sr-Latn': 'Kvalitet vazduha, otpad i prostorni ekološki podaci.',
      en: 'Air quality, waste, and environmental monitoring datasets.',
    },
    searchParams: {
      topic: 'zivotna-sredina',
      page: 1,
    },
  },
  {
    id: 'mobility',
    title: {
      'sr-Cyrl': 'Саобраћај и мобилност',
      'sr-Latn': 'Saobraćaj i mobilnost',
      en: 'Mobility and transport',
    },
    description: {
      'sr-Cyrl': 'Саобраћајне незгоде, јавни превоз и кретање.',
      'sr-Latn': 'Saobraćajne nezgode, javni prevoz i kretanje.',
      en: 'Traffic safety, transit, and mobility data.',
    },
    searchParams: {
      topic: 'mobilnost',
      page: 1,
    },
  },
  {
    id: 'budget',
    title: {
      'sr-Cyrl': 'Буџети и финансије',
      'sr-Latn': 'Budžeti i finansije',
      en: 'Budgets and finance',
    },
    description: {
      'sr-Cyrl':
        'Локални буџети и табеларни финансијски скупови за брзо графиковање.',
      'sr-Latn':
        'Lokalni budžeti i tabelarni finansijski skupovi za brzo grafikovanje.',
      en: 'Local budgets and structured financial datasets that chart well.',
    },
    searchParams: {
      q: 'budzet',
      format: 'csv',
      page: 1,
    },
  },
];
