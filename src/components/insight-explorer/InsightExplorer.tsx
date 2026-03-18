'use client';

import type { Locale } from '@/lib/i18n/config';
import { useInsightExplorer } from '@/hooks/useInsightExplorer';
import {
  InsightHero,
  CitizenDatasetList,
  TrustFooter,
} from '@/components/insight-explorer';
import { DatasetPreviewPanel } from './DatasetPreviewPanel';

interface InsightExplorerProps {
  locale: Locale;
}

export function InsightExplorer({ locale }: InsightExplorerProps) {
  const explorer = useInsightExplorer({ locale });

  return (
    <div className='space-y-8'>
      <InsightHero
        locale={locale}
        searchQuery={explorer.searchQuery}
        onSearchChange={explorer.setSearchQuery}
        onTopicSelect={explorer.setSelectedTopic}
        selectedTopic={explorer.selectedTopic}
      />

      <div className='grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,420px)]'>
        <CitizenDatasetList
          locale={locale}
          datasets={explorer.datasets}
          isLoading={explorer.datasetsLoading}
          error={explorer.datasetsError}
          totalDatasets={explorer.totalDatasets}
          selectedDatasetId={explorer.selectedDataset?.id ?? null}
          onSelectDataset={explorer.selectDataset}
          onClearFilters={explorer.clearFilters}
        />

        <DatasetPreviewPanel
          locale={locale}
          dataset={explorer.selectedDataset}
          observations={explorer.previewData}
          isLoading={explorer.previewLoading}
          error={explorer.previewError}
        />
      </div>

      <TrustFooter locale={locale} />
    </div>
  );
}
