'use client'

import { create } from 'zustand'
import {
  canProceedFromStep,
  isConfigReady,
  stepOrder,
} from '@vizualni/charts'

import type { ChartConfig, ConfiguratorStep, ParsedDataset, SupportedChartType, DatasetReference, JoinSuggestion } from '@/types'
import type { PreviewBreakpoint } from '@/components/configurator/PreviewBreakpointToggle'

export interface ConfiguratorStoreState {
  step: ConfiguratorStep
  datasetId: string | null
  resourceId: string | null
  datasetTitle: string | null
  organizationName: string | null
  parsedDataset: ParsedDataset | null
  chartType: SupportedChartType | null
  config: Partial<ChartConfig>
  initialized: boolean
  // Multi-dataset state
  datasets: DatasetReference[]
  secondaryDatasets: Record<string, ParsedDataset>
  joinSuggestions: Record<string, JoinSuggestion[]>
  activeJoinConfig: Record<string, { primaryKey: string; secondaryKey: string }>
  // Persistence state
  savedChartId: string | null
  isDirty: boolean
  lastSavedAt: Date | null
  // Preview breakpoint state
  previewBreakpoint: PreviewBreakpoint
}

export interface ConfiguratorStoreActions {
  initialize: (params: {
    datasetId?: string
    resourceId?: string
    datasetTitle?: string
    organizationName?: string
    parsedDataset?: ParsedDataset
    initialConfig?: Partial<ChartConfig>
    initialStep?: ConfiguratorStep
    initialChartType?: SupportedChartType | null
  }) => void
  setStep: (step: ConfiguratorStep) => void
  setChartType: (type: SupportedChartType) => void
  updateConfig: (partial: Partial<ChartConfig>) => void
  setDatasetId: (id: string) => void
  setResourceId: (id: string) => void
  setDatasetTitle: (title: string) => void
  setOrganizationName: (name: string) => void
  setParsedDataset: (dataset: ParsedDataset) => void
  setDataset: (params: {
    datasetId: string
    resourceId: string
    datasetTitle: string
    organizationName?: string
    parsedDataset: ParsedDataset
  }) => void
  nextStep: () => void
  prevStep: () => void
  reset: () => void
  // Multi-dataset actions
  addDataset: (ref: DatasetReference, dataset: ParsedDataset) => void
  removeDataset: (datasetId: string) => void
  setJoinConfig: (datasetId: string, primaryKey: string, secondaryKey: string) => void
  getJoinedDataset: () => ParsedDataset | null
  // Persistence actions
  setSavedChartId: (id: string | null) => void
  setIsDirty: (dirty: boolean) => void
  setLastSavedAt: (date: Date | null) => void
  // Preview breakpoint actions
  setPreviewBreakpoint: (breakpoint: PreviewBreakpoint) => void
}

const getInitialState = (): ConfiguratorStoreState => ({
  step: 'dataset',
  datasetId: null,
  resourceId: null,
  datasetTitle: null,
  organizationName: null,
  parsedDataset: null,
  chartType: null,
  config: {},
  initialized: false,
  // Multi-dataset state
  datasets: [],
  secondaryDatasets: {},
  joinSuggestions: {},
  activeJoinConfig: {},
  // Persistence state
  savedChartId: null,
  isDirty: false,
  lastSavedAt: null,
  // Preview breakpoint state
  previewBreakpoint: null,
})

export const useConfiguratorStore = create<ConfiguratorStoreState & ConfiguratorStoreActions>(
  (set, get) => ({
    ...getInitialState(),

    initialize: params =>
      set(state => {
        // Always update if parsedDataset is provided (async data load)
        const shouldSkip = state.initialized &&
          state.datasetId === params.datasetId &&
          !params.parsedDataset // Don't skip if we have new data

        if (shouldSkip) {
          return {}
        }

        return {
          datasetId: params.datasetId ?? state.datasetId ?? null,
          resourceId: params.resourceId ?? state.resourceId ?? null,
          datasetTitle: params.datasetTitle ?? state.datasetTitle ?? null,
          organizationName: params.organizationName ?? state.organizationName ?? null,
          parsedDataset: params.parsedDataset ?? state.parsedDataset ?? null,
          chartType: params.initialChartType ?? state.chartType ?? null,
          config: params.initialConfig ?? state.config ?? {},
          step: params.initialStep ?? state.step ?? 'chartType',
          initialized: true,
        }
      }),

    setStep: step => set({ step }),

    setChartType: type => {
      const { config } = get()
      set({
        chartType: type,
        config: {
          ...config,
          type,
        },
      })
    },

    updateConfig: partial =>
      set(state => ({
        config: {
          ...state.config,
          ...partial,
          options: {
            ...state.config.options,
            ...partial.options,
          },
        },
        chartType: partial.type ?? state.chartType,
        isDirty: true, // Mark as dirty when config changes
      })),

    setDatasetId: id => set({ datasetId: id }),

    setResourceId: id => set({ resourceId: id }),

    setDatasetTitle: title => set({ datasetTitle: title }),

    setOrganizationName: name => set({ organizationName: name }),

    setParsedDataset: dataset => set({ parsedDataset: dataset }),

    setDataset: params =>
      set({
        datasetId: params.datasetId,
        resourceId: params.resourceId,
        datasetTitle: params.datasetTitle,
        organizationName: params.organizationName ?? null,
        parsedDataset: params.parsedDataset,
        step: 'chartType', // Move to chart type selection after dataset is set
      }),

    nextStep: () => {
      const { step } = get()
      const normalizedStep = step === 'dataset' ? 'chartType' : step
          const currentIndex = stepOrder.indexOf(normalizedStep)
      if (currentIndex < stepOrder.length - 1) {
        set({ step: stepOrder[currentIndex + 1] })
      }
    },

    prevStep: () => {
      const { step } = get()
      const normalizedStep = step === 'dataset' ? 'chartType' : step
      const currentIndex = stepOrder.indexOf(normalizedStep)
      if (currentIndex > 0) {
        set({ step: stepOrder[currentIndex - 1] })
      }
    },

    reset: () => set(getInitialState()),

    // Multi-dataset actions
    addDataset: (ref, dataset) =>
      set(state => {
        if (state.datasets.length >= 3) {
          return {} // Max 3 datasets
        }
        return {
          datasets: [...state.datasets, ref],
          secondaryDatasets: { ...state.secondaryDatasets, [ref.datasetId]: dataset },
        }
      }),

    removeDataset: datasetId =>
      set(state => {
        const { [datasetId]: _sd, ...restSecondary } = state.secondaryDatasets
        const { [datasetId]: _js, ...restJoin } = state.joinSuggestions
        const { [datasetId]: _jc, ...restConfig } = state.activeJoinConfig
        return {
          datasets: state.datasets.filter(d => d.datasetId !== datasetId),
          secondaryDatasets: restSecondary,
          joinSuggestions: restJoin,
          activeJoinConfig: restConfig,
        }
      }),

    setJoinConfig: (datasetId, primaryKey, secondaryKey) =>
      set(state => ({
        activeJoinConfig: { ...state.activeJoinConfig, [datasetId]: { primaryKey, secondaryKey } },
      })),

    getJoinedDataset: () => {
      const state = get()
      if (!state.parsedDataset || state.datasets.length === 0) {
        return state.parsedDataset
      }

      // Import join function dynamically to avoid circular deps
      // For now, return the primary dataset (actual join happens in component)
      return state.parsedDataset
    },

    // Persistence actions
    setSavedChartId: id => set({ savedChartId: id }),
    setIsDirty: dirty => set({ isDirty: dirty }),
    setLastSavedAt: date => set({ lastSavedAt: date }),

    // Preview breakpoint actions
    setPreviewBreakpoint: breakpoint => set({ previewBreakpoint: breakpoint }),
  })
)

export { isConfigReady, canProceedFromStep, stepOrder }
