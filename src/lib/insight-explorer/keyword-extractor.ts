import type { Locale } from '@/lib/i18n/config';
import type {
  ExtractionPattern,
  ExtractedParams,
} from '@/types/insight-explorer';

const EXTRACTION_PATTERNS: ExtractionPattern[] = [
  {
    type: 'topic',
    patterns: {
      'sr-Cyrl': ['здравље', 'болница', 'медицина', 'лекари'],
      'sr-Latn': ['zdravlje', 'bolnica', 'medicina', 'lekari'],
      en: ['health', 'hospital', 'medicine', 'doctors'],
    },
    mapsTo: 'health',
  },
  {
    type: 'topic',
    patterns: {
      'sr-Cyrl': ['образовање', 'школа', 'факултет', 'студенти'],
      'sr-Latn': ['obrazovanje', 'škola', 'fakultet', 'studenti'],
      en: ['education', 'school', 'university', 'students'],
    },
    mapsTo: 'education',
  },
  {
    type: 'topic',
    patterns: {
      'sr-Cyrl': ['економија', 'привреда', 'компаније', 'посао'],
      'sr-Latn': ['ekonomija', 'privreda', 'kompanije', 'posao'],
      en: ['economy', 'business', 'companies', 'jobs'],
    },
    mapsTo: 'economy',
  },
  {
    type: 'topic',
    patterns: {
      'sr-Cyrl': ['саобраћај', 'криминал', 'полиција', 'безбедност'],
      'sr-Latn': ['saobraćaj', 'kriminal', 'policija', 'bezbednost'],
      en: ['traffic', 'crime', 'police', 'safety'],
    },
    mapsTo: 'safety',
  },
  {
    type: 'topic',
    patterns: {
      'sr-Cyrl': ['становништво', 'демографија', 'рођени', 'умрли'],
      'sr-Latn': ['stanovništvo', 'demografija', 'rođeni', 'umrli'],
      en: ['population', 'demographics', 'births', 'deaths'],
    },
    mapsTo: 'demographics',
  },
  {
    type: 'topic',
    patterns: {
      'sr-Cyrl': ['животна средина', 'екологија', 'загађење', 'клима'],
      'sr-Latn': ['životna sredina', 'ekologija', 'zagađenje', 'klima'],
      en: ['environment', 'ecology', 'pollution', 'climate'],
    },
    mapsTo: 'environment',
  },
  {
    type: 'location',
    patterns: {
      'sr-Cyrl': ['београд', 'beograd', 'bg'],
      'sr-Latn': ['beograd', 'beč', 'bg'],
      en: ['belgrade', 'beograd', 'bg'],
    },
    mapsTo: 'belgrade',
  },
  {
    type: 'location',
    patterns: {
      'sr-Cyrl': ['нови сад', 'војводина', 'ns'],
      'sr-Latn': ['novi sad', 'vojvodina', 'ns'],
      en: ['novi sad', 'vojvodina', 'ns'],
    },
    mapsTo: 'novi-sad',
  },
  {
    type: 'timeRange',
    patterns: {
      'sr-Cyrl': ['2024', 'ове године', 'годину'],
      'sr-Latn': ['2024', 'ove godine', 'godinu'],
      en: ['2024', 'this year', 'last year'],
    },
    mapsTo: '2024',
  },
  {
    type: 'timeRange',
    patterns: {
      'sr-Cyrl': ['2023', 'прошле године'],
      'sr-Latn': ['2023', 'prošle godine'],
      en: ['2023', 'last year'],
    },
    mapsTo: '2023',
  },
];

export function extractKeywords(
  query: string,
  locale: Locale
): ExtractedParams {
  const result: ExtractedParams = {};
  const lowerQuery = query.toLowerCase();
  const remainingTerms: string[] = [];
  const words = lowerQuery.split(/\s+/).filter((w) => w.length > 0);

  for (const word of words) {
    let matched = false;

    for (const pattern of EXTRACTION_PATTERNS) {
      const localePatterns = pattern.patterns[locale] ?? [];
      const allPatterns = [
        ...localePatterns,
        ...(pattern.patterns['sr-Latn'] ?? []),
        ...(pattern.patterns.en ?? []),
      ];

      for (const patternText of allPatterns) {
        const lowerPattern = patternText.toLowerCase();
        // For short words (1-2 chars), require exact match or pattern to be contained in word
        // For longer words, allow substring matching
        const isShortWord = word.length <= 2;
        const isExactMatch = lowerPattern === word;
        const patternInWord = word.includes(lowerPattern);
        const wordInPattern = lowerPattern.includes(word);

        const shouldMatch = isShortWord
          ? isExactMatch || patternInWord
          : patternInWord || wordInPattern;

        if (shouldMatch) {
          switch (pattern.type) {
            case 'topic':
              result.topic = pattern.mapsTo;
              break;
            case 'location':
              result.location = pattern.mapsTo;
              break;
            case 'timeRange':
              result.year = pattern.mapsTo;
              break;
          }
          matched = true;
          break;
        }
      }

      if (matched) break;
    }

    if (!matched && word.length > 2) {
      remainingTerms.push(word);
    }
  }

  if (remainingTerms.length > 0) {
    result.q = remainingTerms.join(' ');
  }

  return result;
}
