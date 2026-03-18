/**
 * @file query-processor.ts
 * @description Main query processing pipeline
 */

import { serbianNLP } from './serbian-nlp';

export type QueryIntent =
  | 'trend'
  | 'comparison'
  | 'distribution'
  | 'geographic'
  | 'ranking'
  | 'correlation'
  | 'aggregation'
  | 'filter';

export interface ProcessedQuery {
  original: string;
  language: 'sr-Cyrl' | 'sr-Latn' | 'en';
  intent: QueryIntent;
  entities: any;
  confidence: number;
}

export class QueryProcessor {
  async processQuery(input: string): Promise<ProcessedQuery> {
    const language = serbianNLP.detectLanguage(input);
    const intent = this.classifyIntent(input);
    const entities = serbianNLP.extractEntities(input);
    const confidence = 0.8;

    return { original: input, language, intent, entities, confidence };
  }

  private classifyIntent(text: string): QueryIntent {
    const lower = text.toLowerCase();
    if (lower.includes('тренд') || lower.includes('trend')) return 'trend';
    if (lower.includes('упореди') || lower.includes('compare'))
      return 'comparison';
    if (lower.includes('мапа') || lower.includes('map')) return 'geographic';
    return 'distribution';
  }
}

export const queryProcessor = new QueryProcessor();
