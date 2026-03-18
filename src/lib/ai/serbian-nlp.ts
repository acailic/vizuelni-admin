/**
 * @file serbian-nlp.ts
 * @description Serbian language processing utilities
 */

export interface Entity {
  type: 'region' | 'measure' | 'time' | 'dataset' | 'filter';
  text: string;
  normalized: string;
  confidence: number;
}

export class SerbianNLP {
  private vocabulary: Map<string, string>;
  private regionVariants: Map<string, string[]>;

  constructor() {
    this.vocabulary = new Map();
    this.regionVariants = new Map();
    this.initializeVocabulary();
  }

  private initializeVocabulary() {
    // Regions with case variations
    this.regionVariants.set('belgrade', [
      'Београд',
      'Београду',
      'Београда',
      'Beograd',
      'Beogradu',
      'Belgrade',
    ]);
    this.regionVariants.set('novi-sad', [
      'Нови Сад',
      'Новом Саду',
      'Novi Sad',
      'Novom Sadu',
    ]);
    this.regionVariants.set('nis', ['Ниш', 'Нишу', 'Niš', 'Nis', 'Nišu']);
    this.regionVariants.set('vojvodina', [
      'Војводина',
      'Војводини',
      'Vojvodina',
      'Vojvodini',
    ]);

    // Measures
    this.vocabulary.set('незапосленост', 'unemployment_rate');
    this.vocabulary.set('nezaposlenost', 'unemployment_rate');
    this.vocabulary.set('популација', 'population');
    this.vocabulary.set('populacija', 'population');
    this.vocabulary.set('буџет', 'budget');
    this.vocabulary.set('budžet', 'budget');
    this.vocabulary.set('просечна плата', 'average_salary');
    this.vocabulary.set('prosečna plata', 'average_salary');
  }

  normalizeWord(word: string): string {
    const lowerWord = word.toLowerCase().trim();
    if (this.vocabulary.has(lowerWord)) {
      return this.vocabulary.get(lowerWord)!;
    }
    for (const [normalized, variants] of this.regionVariants.entries()) {
      if (variants.some((v) => v.toLowerCase() === lowerWord)) {
        return normalized;
      }
    }
    return lowerWord;
  }

  detectLanguage(text: string): 'sr-Cyrl' | 'sr-Latn' | 'en' {
    const cyrillicPattern = /[а-шА-Ш]/;
    const latinPattern = /[šđčćžŠĐČĆŽ]/;

    if (cyrillicPattern.test(text)) return 'sr-Cyrl';
    if (latinPattern.test(text)) return 'sr-Latn';
    return 'en';
  }

  extractEntities(text: string): Entity[] {
    const entities: Entity[] = [];

    // Extract regions
    for (const [normalized, variants] of this.regionVariants.entries()) {
      for (const variant of variants) {
        if (text.includes(variant)) {
          entities.push({
            type: 'region',
            text: variant,
            normalized,
            confidence: 0.9,
          });
          break;
        }
      }
    }

    // Extract measures
    for (const [term, normalized] of this.vocabulary.entries()) {
      if (text.toLowerCase().includes(term.toLowerCase())) {
        entities.push({
          type: 'measure',
          text: term,
          normalized,
          confidence: 0.85,
        });
      }
    }

    return entities;
  }
}

export const serbianNLP = new SerbianNLP();
