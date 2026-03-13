import { notFound } from 'next/navigation'

import { ConfiguratorShell } from '@/components/configurator'
import { getDatasetDetailData, isAllowedPreviewHost, isPreviewableFormat } from '@/lib/api/browse'
import { convertToParsedDataset, getDatasetById, isSerbianDataset } from '@/lib/data/serbian-datasets'
import { getMessages, resolveLocale } from '@/lib/i18n/messages'

export default async function CreatePage({
  params,
  searchParams,
}: {
  params: { locale: string }
  searchParams: Record<string, string | string[] | undefined>
}) {
  const locale = resolveLocale(params.locale)
  if (locale !== params.locale) {
    notFound()
  }

  const messages = getMessages(locale)
  
  // Get URL params
  const datasetId = Array.isArray(searchParams.dataset)
    ? searchParams.dataset[0]
    : searchParams.dataset

  const resourceId = Array.isArray(searchParams.resource)
    ? searchParams.resource[0]
    : searchParams.resource

  // If dataset is pre-selected from browse, load it
  if (datasetId) {
    // Check if it's a Serbian dataset from our library
    if (isSerbianDataset(datasetId)) {
      const serbianDataset = getDatasetById(datasetId)
      if (serbianDataset) {
        const parsedDataset = convertToParsedDataset(serbianDataset, locale)
        const titleKey = locale === 'sr-Cyrl' ? 'sr' : locale === 'sr-Latn' ? 'lat' : 'en'
        const datasetTitle = serbianDataset.title[titleKey as keyof typeof serbianDataset.title] || serbianDataset.title.en

        return (
          <ConfiguratorShell
            locale={locale}
            labels={{
              steps: messages.charts.configurator.steps,
              stepIndicator: messages.charts.configurator.stepIndicator,
              backToBrowse: messages.charts.configurator.backToBrowse,
              next: messages.charts.configurator.next || messages.common.next,
              previous: messages.charts.configurator.previous || messages.common.previous,
              finish: messages.charts.configurator.finish || messages.common.save,
              preview: messages.charts.configurator.preview,
              previewBreakpoints: messages.charts.configurator.previewBreakpoints,
              loadingDataset:
                messages.charts.configurator.loading_dataset || messages.common.loading,
              loadError: messages.charts.configurator.load_error || messages.common.error,
            }}
            preselectedDatasetId={datasetId}
            preselectedDatasetTitle={datasetTitle}
            preselectedOrganizationName={serbianDataset.source.name}
            preselectedParsedDataset={parsedDataset}
            initialConfig={{
              type: serbianDataset.suggestedChartType as 'bar' | 'line' | 'table',
              title: datasetTitle,
              dataset_id: datasetId,
            }}
          />
        )
      }
    }

    // Otherwise, try loading from external data.gov.rs API
    try {
      const { dataset, previewResource } = await getDatasetDetailData(datasetId)
      let usedResourceId = resourceId
      let preselectedResourceUrl: string | undefined
      let preselectedResourceFormat: string | undefined
      let preselectedResourceSize: number | undefined

      const resourceToUse = previewResource
      if (resourceToUse && isPreviewableFormat(resourceToUse.format)) {
        const previewUrl = new URL(resourceToUse.url)

        if (isAllowedPreviewHost(previewUrl.hostname)) {
          usedResourceId = resourceToUse.id
          preselectedResourceUrl = resourceToUse.url
          preselectedResourceFormat = resourceToUse.format
          preselectedResourceSize = resourceToUse.filesize ?? undefined
        }
      }

      return (
        <ConfiguratorShell
          locale={locale}
          labels={{
            steps: messages.charts.configurator.steps,
            stepIndicator: messages.charts.configurator.stepIndicator,
            backToBrowse: messages.charts.configurator.backToBrowse,
            next: messages.charts.configurator.next || messages.common.next,
            previous: messages.charts.configurator.previous || messages.common.previous,
            finish: messages.charts.configurator.finish || messages.common.save,
            preview: messages.charts.configurator.preview,
            previewBreakpoints: messages.charts.configurator.previewBreakpoints,
            loadingDataset:
              messages.charts.configurator.loading_dataset || messages.common.loading,
            loadError: messages.charts.configurator.load_error || messages.common.error,
          }}
          preselectedDatasetId={dataset.id}
          preselectedResourceId={usedResourceId}
          preselectedResourceUrl={preselectedResourceUrl}
          preselectedResourceFormat={preselectedResourceFormat}
          preselectedResourceSize={preselectedResourceSize}
          preselectedDatasetTitle={dataset.title}
          preselectedOrganizationName={dataset.organization?.name}
          initialConfig={{
            type: 'table',
            title: dataset.title,
            dataset_id: dataset.id,
          }}
        />
      )
    } catch {
      // Fall through to empty state
    }
  }

  // Empty configurator - start from dataset selection
  return (
    <ConfiguratorShell
      locale={locale}
      labels={{
        steps: messages.charts.configurator.steps,
        stepIndicator: messages.charts.configurator.stepIndicator,
        backToBrowse: messages.charts.configurator.backToBrowse,
        next: messages.charts.configurator.next || messages.common.next,
        previous: messages.charts.configurator.previous || messages.common.previous,
        finish: messages.charts.configurator.finish || messages.common.save,
        preview: messages.charts.configurator.preview,
        previewBreakpoints: messages.charts.configurator.previewBreakpoints,
        loadingDataset:
          messages.charts.configurator.loading_dataset || messages.common.loading,
        loadError: messages.charts.configurator.load_error || messages.common.error,
      }}
    />
  )
}
