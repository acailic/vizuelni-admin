'use client';

import { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import type { Locale } from '@/lib/i18n/config';
import {
  SEARCH_SUGGESTIONS,
  LIFE_TOPICS,
  getLocalizedSuggestionLabel,
  getLocalizedTopicLabel,
} from '@/lib/insight-explorer';

interface InsightHeroProps {
  locale: Locale;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onTopicSelect: (topicId: string | null) => void;
  selectedTopic: string | null;
}

const LABELS = {
  eyebrow: {
    'sr-Cyrl': 'Званични каталог data.gov.rs',
    'sr-Latn': 'Zvanični katalog data.gov.rs',
    en: 'Official data.gov.rs catalog',
  },
  headline: {
    'sr-Cyrl': 'Шта желите да сазнате?',
    'sr-Latn': 'Šta želite da saznate?',
    en: 'What would you like to discover?',
  },
  searchPlaceholder: {
    'sr-Cyrl': 'Претражите каталог...',
    'sr-Latn': 'Pretražite katalog...',
    en: 'Search the catalog...',
  },
  suggestions: {
    'sr-Cyrl': 'Предлози',
    'sr-Latn': 'Predlozi',
    en: 'Suggestions',
  },
  topics: {
    'sr-Cyrl': 'Или изаберите тему',
    'sr-Latn': 'Ili izaberite temu',
    en: 'Or pick a topic',
  },
} as const;

export function InsightHero({
  locale,
  searchQuery,
  onSearchChange,
  onTopicSelect,
  selectedTopic,
}: InsightHeroProps) {
  const [inputValue, setInputValue] = useState(searchQuery);

  const handleSearch = () => onSearchChange(inputValue);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <section className='rounded-[2rem] bg-gradient-to-br from-gov-primary via-gov-secondary to-[#0C1E42] px-8 py-12 text-white shadow-xl'>
      <p className='text-xs font-semibold uppercase tracking-[0.2em] text-white/70'>
        {LABELS.eyebrow[locale]}
      </p>
      <h1 className='mt-4 text-4xl font-bold tracking-tight sm:text-5xl'>
        {LABELS.headline[locale]}
      </h1>

      <div className='mt-8 flex max-w-2xl gap-3'>
        <div className='relative flex-1'>
          <Search className='absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400' />
          <input
            type='text'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={LABELS.searchPlaceholder[locale]}
            className='w-full rounded-2xl border border-white/20 bg-white/10 py-4 pl-12 pr-4 text-white placeholder-white/50 backdrop-blur-sm focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20'
            aria-label={LABELS.searchPlaceholder[locale]}
          />
        </div>
        <button
          onClick={handleSearch}
          className='rounded-2xl bg-serbia-red px-8 py-4 font-semibold transition hover:bg-red-700'
        >
          {locale === 'sr-Cyrl'
            ? 'Претражи'
            : locale === 'sr-Latn'
              ? 'Pretraži'
              : 'Search'}
        </button>
      </div>

      <div className='mt-6'>
        <p className='text-xs font-semibold uppercase tracking-[0.15em] text-white/60'>
          <Sparkles className='mr-1.5 inline h-3.5 w-3.5' />
          {LABELS.suggestions[locale]}
        </p>
        <div className='mt-3 flex flex-wrap gap-2'>
          {SEARCH_SUGGESTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setInputValue(s.query);
                onSearchChange(s.query);
              }}
              className='rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm transition hover:border-white/40 hover:bg-white/20'
            >
              {s.icon} {getLocalizedSuggestionLabel(s, locale)}
            </button>
          ))}
        </div>
      </div>

      <div className='mt-8'>
        <p className='text-xs font-semibold uppercase tracking-[0.15em] text-white/60'>
          {LABELS.topics[locale]}
        </p>
        <div className='mt-3 flex flex-wrap gap-3'>
          {LIFE_TOPICS.map((topic) => (
            <button
              key={topic.id}
              onClick={() =>
                onTopicSelect(selectedTopic === topic.id ? null : topic.id)
              }
              className={`rounded-2xl border px-5 py-3 text-sm font-medium transition ${
                selectedTopic === topic.id
                  ? 'border-white/40 bg-white/20'
                  : 'border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/10'
              }`}
            >
              <span className='mr-2'>{topic.icon}</span>
              {getLocalizedTopicLabel(topic, locale)}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
