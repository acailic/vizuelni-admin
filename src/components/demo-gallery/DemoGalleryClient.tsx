'use client';

import { useDeferredValue, useMemo, useState, useTransition } from 'react';
import { ArrowUpDown, Search } from 'lucide-react';

import type {
  FeaturedExampleConfig,
  ShowcaseCategory,
} from '@/lib/examples/types';
import type { Locale } from '@/lib/i18n/config';
import { CategoryFilterBar } from './CategoryFilterBar';
import { DemoGalleryModalEnhanced } from './DemoGalleryModalEnhanced';
import { FeaturedSection } from './FeaturedSection';
import { GalleryStats } from './GalleryStats';
import { VisualizationCard } from './VisualizationCard';
import {
  getDerivedVisualizationMeta,
  getFeaturedExamples,
  type GalleryPanel,
  type GallerySortOption,
} from './galleryUtils';

interface DemoGalleryClientProps {
  examples: FeaturedExampleConfig[];
  locale: Locale;
  labels: {
    title: string;
    subtitle: string;
    resultsSectionTitle: string;
    resultsSummaryAll: string;
    resultsSummaryFiltered: string;
    empty: string;
    openExample: string;
    preview: string;
    open: string;
    embed: string;
    embedCopied: string;
    previewLoading: string;
    previewUnavailable: string;
    previewFailed: string;
    categories: Record<string, string>;
    featuredTitle: string;
    featuredDescription: string;
    statsTotal: string;
    statsShown: string;
    statsCategory: string;
    statsTrust: string;
    statsTrustValue: string;
    controlsTitle: string;
    categoryHeading: string;
    sortByLabel: string;
    sortRecommended: string;
    searchPlaceholder?: string;
    sortNewest?: string;
    sortPopular: string;
    sortAlphabetical?: string;
    metadataLabel: string;
    officialLabel: string;
    trustedSourceLabel: string;
    updatedLabel: string;
    modal: {
      close: string;
      viewData: string;
      hideData: string;
      showingRows: string;
      tableCaption: string;
      initialViewData: string;
      initialViewCode: string;
    };
  };
}

export function DemoGalleryClient({
  examples,
  locale,
  labels,
}: DemoGalleryClientProps) {
  const [activeCategory, setActiveCategory] = useState<
    ShowcaseCategory | 'all'
  >('all');
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [sortBy, setSortBy] = useState<GallerySortOption>('recommended');
  const [isPending, startTransition] = useTransition();
  const [selectedExample, setSelectedExample] =
    useState<FeaturedExampleConfig | null>(null);
  const [selectedPanel, setSelectedPanel] = useState<GalleryPanel>('overview');

  const filteredExamples = useMemo(() => {
    let result = examples;

    if (activeCategory !== 'all') {
      result = result.filter((example) => example.category === activeCategory);
    }

    if (deferredSearchQuery.trim()) {
      const query = deferredSearchQuery.toLowerCase();
      result = result.filter((example) => {
        const localeKey =
          locale === 'en' ? 'en' : locale === 'sr-Latn' ? 'lat' : 'sr';
        const title = example.title[localeKey]?.toLowerCase() ?? '';
        const description = example.description[localeKey]?.toLowerCase() ?? '';
        const tags = example.tags?.join(' ').toLowerCase() ?? '';
        const source = example.dataSource?.toLowerCase() ?? '';

        return (
          title.includes(query) ||
          description.includes(query) ||
          tags.includes(query) ||
          source.includes(query)
        );
      });
    }

    if (sortBy === 'alphabetical') {
      result = [...result].sort((a, b) => {
        const localeKey =
          locale === 'en' ? 'en' : locale === 'sr-Latn' ? 'lat' : 'sr';
        return (a.title[localeKey] ?? '').localeCompare(
          b.title[localeKey] ?? ''
        );
      });
    } else if (sortBy === 'popular') {
      result = [...result].sort(
        (a, b) =>
          getDerivedVisualizationMeta(b, locale).popularityScore -
          getDerivedVisualizationMeta(a, locale).popularityScore
      );
    } else if (sortBy === 'recommended') {
      result = [...result].sort((a, b) => {
        const aMeta = getDerivedVisualizationMeta(a, locale);
        const bMeta = getDerivedVisualizationMeta(b, locale);
        if (aMeta.featuredRank !== bMeta.featuredRank) {
          if (aMeta.featuredRank === -1) return 1;
          if (bMeta.featuredRank === -1) return -1;
          return aMeta.featuredRank - bMeta.featuredRank;
        }
        return bMeta.popularityScore - aMeta.popularityScore;
      });
    } else {
      result = [...result].sort((a, b) => {
        const aDate = a.lastUpdated ? new Date(a.lastUpdated).getTime() : 0;
        const bDate = b.lastUpdated ? new Date(b.lastUpdated).getTime() : 0;
        return bDate - aDate;
      });
    }

    return result;
  }, [activeCategory, deferredSearchQuery, examples, locale, sortBy]);

  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<ShowcaseCategory | 'all', number>> = {
      all: examples.length,
    };

    examples.forEach((example) => {
      if (!example.category) {
        return;
      }
      counts[example.category] = (counts[example.category] ?? 0) + 1;
    });

    return counts;
  }, [examples]);

  const featuredExamples = useMemo(
    () => getFeaturedExamples(examples),
    [examples]
  );
  const activeCategoryLabel =
    labels.categories[activeCategory] ?? activeCategory;

  const openExample = (
    example: FeaturedExampleConfig,
    panel: GalleryPanel = 'overview'
  ) => {
    setSelectedPanel(panel);
    setSelectedExample(example);
  };

  const closeExample = () => {
    setSelectedExample(null);
    setSelectedPanel('overview');
  };

  const handleCategoryChange = (category: ShowcaseCategory | 'all') => {
    startTransition(() => {
      setActiveCategory(category);
    });
  };

  const handleSearchChange = (query: string) => {
    startTransition(() => {
      setSearchQuery(query);
    });
  };

  const handleSortChange = (sort: GallerySortOption) => {
    startTransition(() => {
      setSortBy(sort);
    });
  };

  return (
    <div className='space-y-8'>
      <section className='space-y-5 rounded-[2.25rem] border border-slate-200 bg-[linear-gradient(180deg,rgba(250,251,252,0.95),rgba(255,255,255,1))] p-6 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.42)]'>
        <div>
          <p className='text-sm font-semibold uppercase tracking-[0.2em] text-gov-primary'>
            {labels.title}
          </p>
          <h1 className='mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950'>
            {labels.title}
          </h1>
          <p className='mt-3 max-w-3xl text-base leading-7 text-slate-600'>
            {labels.subtitle}
          </p>
        </div>

        <GalleryStats
          total={examples.length}
          shown={filteredExamples.length}
          categoryLabel={activeCategoryLabel}
          searchQuery={searchQuery}
          labels={{
            total: labels.statsTotal,
            shown: labels.statsShown,
            category: labels.statsCategory,
            trust: labels.statsTrust,
            trustValue: labels.statsTrustValue,
            results:
              locale === 'sr-Cyrl'
                ? 'приказано'
                : locale === 'sr-Latn'
                  ? 'prikazano'
                  : 'shown',
          }}
        />
      </section>

      <FeaturedSection
        examples={featuredExamples}
        locale={locale}
        labels={{
          title: labels.featuredTitle,
          description: labels.featuredDescription,
          openExample: labels.openExample,
          previewLoading: labels.previewLoading,
          previewUnavailable: labels.previewUnavailable,
          previewFailed: labels.previewFailed,
          preview: labels.preview,
          open: labels.open,
          embed: labels.embed,
          embedCopied: labels.embedCopied,
          metadataLabel: labels.metadataLabel,
          officialLabel: labels.officialLabel,
          trustedSourceLabel: labels.trustedSourceLabel,
          updatedLabel: labels.updatedLabel,
        }}
        onOpenExample={openExample}
      />

      <CategoryFilterBar
        activeCategory={activeCategory}
        counts={categoryCounts}
        onCategoryChange={handleCategoryChange}
        locale={locale}
        labels={labels.categories}
        heading={labels.categoryHeading}
      />

      <section
        className='rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_-36px_rgba(15,23,42,0.35)]'
        role='region'
        aria-labelledby='demo-gallery-results-title'
        aria-busy={isPending}
        aria-live='polite'
      >
        <div className='mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
          <div>
            <p className='text-sm font-semibold uppercase tracking-[0.18em] text-slate-500'>
              {labels.controlsTitle}
            </p>
            <h2
              id='demo-gallery-results-title'
              className='mt-2 text-2xl font-semibold text-slate-950'
            >
              {activeCategoryLabel} · {filteredExamples.length}
            </h2>
            <p className='mt-1 text-sm text-slate-600'>
              {examples.length} / {filteredExamples.length}
            </p>
          </div>
          <div className='flex flex-col gap-3 lg:items-end'>
            <div className='relative w-full max-w-md'>
              <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
              <input
                type='search'
                placeholder={
                  labels.searchPlaceholder ?? 'Search visualizations...'
                }
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className='w-full rounded-full border border-slate-300 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-gov-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-primary/20'
                aria-label={labels.searchPlaceholder ?? 'Search visualizations'}
              />
            </div>
            <div className='flex flex-wrap items-center gap-2'>
              <span className='inline-flex items-center gap-2 text-sm font-medium text-slate-600'>
                <ArrowUpDown className='h-4 w-4' />
                {labels.sortByLabel}
              </span>
              {(
                [
                  ['recommended', labels.sortRecommended],
                  ['newest', labels.sortNewest ?? 'Newest'],
                  ['popular', labels.sortPopular],
                  ['alphabetical', labels.sortAlphabetical ?? 'A–Z'],
                ] as Array<[GallerySortOption, string]>
              ).map(([value, label]) => (
                <button
                  key={value}
                  type='button'
                  onClick={() => handleSortChange(value)}
                  className={`rounded-full border px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gov-primary/20 focus:ring-offset-2 ${
                    sortBy === value
                      ? 'border-gov-primary bg-gov-primary text-white'
                      : 'border-slate-300 bg-slate-50 text-slate-700 hover:border-slate-400 hover:bg-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredExamples.length === 0 ? (
          <div className='rounded-[1.6rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center text-slate-600'>
            {labels.empty}
          </div>
        ) : (
          <div
            className={`grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 ${
              isPending ? 'opacity-80' : ''
            }`}
          >
            {filteredExamples.map((example) => (
              <VisualizationCard
                key={example.id}
                example={example}
                locale={locale}
                onOpenExample={openExample}
                labels={{
                  openExample: labels.openExample,
                  previewLoading: labels.previewLoading,
                  previewUnavailable: labels.previewUnavailable,
                  previewFailed: labels.previewFailed,
                  preview: labels.preview,
                  open: labels.open,
                  embed: labels.embed,
                  embedCopied: labels.embedCopied,
                  metadataLabel: labels.metadataLabel,
                  officialLabel: labels.officialLabel,
                  trustedSourceLabel: labels.trustedSourceLabel,
                  updatedLabel: labels.updatedLabel,
                }}
              />
            ))}
          </div>
        )}
      </section>

      <DemoGalleryModalEnhanced
        example={selectedExample}
        isOpen={!!selectedExample}
        onClose={closeExample}
        locale={locale}
        initialPanel={selectedPanel}
        labels={labels.modal}
      />
    </div>
  );
}
