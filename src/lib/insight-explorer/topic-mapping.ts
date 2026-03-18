import type { Locale } from '@/lib/i18n/config';
import type { LifeTopic } from '@/types/insight-explorer';

export const LIFE_TOPICS: LifeTopic[] = [
  {
    id: 'health',
    icon: '❤️',
    label: {
      'sr-Cyrl': 'Здравље',
      'sr-Latn': 'Zdravlje',
      en: 'Health',
    },
    description: {
      'sr-Cyrl': 'Болнице, апотеке, лекари, здравствени сервиси',
      'sr-Latn': 'Bolnice, apoteke, lekari, zdravstveni servisi',
      en: 'Hospitals, pharmacies, doctors, health services',
    },
    datasetCount: 12,
    dataGovTopics: ['zdravstvo', 'zdravstvena-zaštita'],
  },
  {
    id: 'education',
    icon: '📚',
    label: {
      'sr-Cyrl': 'Образовање',
      'sr-Latn': 'Obrazovanje',
      en: 'Education',
    },
    description: {
      'sr-Cyrl': 'Школе, факултети, ученици, образовни програми',
      'sr-Latn': 'Škole, fakulteti, učenici, obrazovni programi',
      en: 'Schools, universities, students, educational programs',
    },
    datasetCount: 8,
    dataGovTopics: ['obrazovanje', 'nauka'],
  },
  {
    id: 'economy',
    icon: '💼',
    label: {
      'sr-Cyrl': 'Економија',
      'sr-Latn': 'Ekonomija',
      en: 'Economy',
    },
    description: {
      'sr-Cyrl': 'Посао, привреда, компаније, запосленост',
      'sr-Latn': 'Posao, privreda, kompanije, zaposlenost',
      en: 'Jobs, business, companies, employment',
    },
    datasetCount: 15,
    dataGovTopics: ['ekonomija', 'privreda', 'tržište-rada'],
  },
  {
    id: 'safety',
    icon: '🚔',
    label: {
      'sr-Cyrl': 'Безбедност',
      'sr-Latn': 'Bezbednost',
      en: 'Safety',
    },
    description: {
      'sr-Cyrl': 'Саобраћај, криминал, полиција, хитна помоћ',
      'sr-Latn': 'Saobraćaj, kriminal, policija, hitna pomoć',
      en: 'Traffic, crime, police, emergency services',
    },
    datasetCount: 10,
    dataGovTopics: ['bezbednost', 'saobraćaj', 'unutrašnji-poslovi'],
  },
  {
    id: 'demographics',
    icon: '👥',
    label: {
      'sr-Cyrl': 'Становништво',
      'sr-Latn': 'Stanovništvo',
      en: 'Population',
    },
    description: {
      'sr-Cyrl': 'Рођени, умрли, пресељење, старосна структура',
      'sr-Latn': 'Rođeni, umrli, preseljenje, starosna struktura',
      en: 'Births, deaths, migration, age structure',
    },
    datasetCount: 6,
    dataGovTopics: ['stanovništvo', 'demografija'],
  },
  {
    id: 'environment',
    icon: '🌿',
    label: {
      'sr-Cyrl': 'Животна средина',
      'sr-Latn': 'Životna sredina',
      en: 'Environment',
    },
    description: {
      'sr-Cyrl': 'Загађење, климатске промене, отпад, природа',
      'sr-Latn': 'Zagađenje, klimatske promene, otpad, priroda',
      en: 'Pollution, climate change, waste, nature',
    },
    datasetCount: 7,
    dataGovTopics: ['životna-sredina', 'ekologija'],
  },
];

export function getTopicById(id: string): LifeTopic | undefined {
  return LIFE_TOPICS.find((topic) => topic.id === id);
}

export function getTopicsForDataGovTopic(dataGovTopic: string): LifeTopic[] {
  return LIFE_TOPICS.filter((topic) =>
    topic.dataGovTopics.includes(dataGovTopic)
  );
}

export function getLocalizedTopicLabel(
  topic: LifeTopic,
  locale: Locale
): string {
  return topic.label[locale] ?? topic.label.en;
}
