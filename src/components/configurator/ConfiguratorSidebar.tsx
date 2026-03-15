'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import {
  useConfiguratorStore,
  stepOrder,
  canProceedFromStep,
} from '@/stores/configurator';
import type { ConfiguratorStep } from '@/types';
import type { FeaturedExampleConfig } from '@/lib/examples/types';
import type { Locale } from '@/lib/i18n/config';
import { TemplatesPanel } from '@/components/showcase';
import { showcaseExamples } from '@/lib/examples/showcase-examples';

interface ConfiguratorSidebarProps {
  labels: {
    steps: {
      dataset: string;
      chartType: string;
      mapping: string;
      customize: string;
      review: string;
    };
    stepIndicator: string;
    backToBrowse: string;
    next: string;
    previous: string;
    finish: string;
    preview: {
      title: string;
      description: string;
      no_config: string;
    };
  };
  locale?: Locale;
}

const stepIcons: Record<ConfiguratorStep, string> = {
  dataset: '📊',
  chartType: '📈',
  mapping: '🔗',
  customize: '🎨',
  review: '✅',
};

export function ConfiguratorSidebar({
  labels,
  locale = 'en',
}: ConfiguratorSidebarProps) {
  const {
    step,
    config,
    parsedDataset,
    setStep,
    updateConfig,
    setParsedDataset,
  } = useConfiguratorStore();
  const [showTemplates, setShowTemplates] = useState(false);
  const normalizedCurrentStep = step === 'dataset' ? 'chartType' : step;
  const currentIndex = stepOrder.indexOf(normalizedCurrentStep);

  const handleStepClick = (targetStep: ConfiguratorStep) => {
    if (targetStep === 'dataset') {
      setStep(targetStep);
      return;
    }

    const targetIndex = stepOrder.indexOf(targetStep);

    // Allow going back to any previous step
    if (targetIndex < currentIndex) {
      setStep(targetStep);
    }
    // Allow going forward only if current step is valid
    else if (
      targetIndex === currentIndex + 1 &&
      canProceedFromStep(step, config, parsedDataset)
    ) {
      setStep(targetStep);
    }
  };

  const handleSelectTemplate = (example: FeaturedExampleConfig) => {
    // Load the template configuration
    if (example.chartConfig) {
      updateConfig(example.chartConfig);
    }
    if (example.inlineData) {
      setParsedDataset(example.inlineData);
    }
    // Move to chart type step
    setStep('chartType');
  };

  const templatesButtonLabels: Record<Locale, string> = {
    'sr-Cyrl': 'Прегледај шаблоне',
    'sr-Latn': 'Pregledaj šablone',
    en: 'Browse Templates',
  };

  return (
    <>
      <nav
        aria-label='Configurator steps'
        className='rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm'
      >
        {/* Browse Templates Button */}
        <button
          type='button'
          onClick={() => setShowTemplates(true)}
          className='w-full mb-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0D4077] to-[#4B90F5] text-white font-medium text-sm hover:from-[#0D4077] hover:to-[#3558A2] transition-all shadow-sm'
        >
          <svg
            className='w-4 h-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z'
            />
          </svg>
          {templatesButtonLabels[locale]}
        </button>

        <ol className='relative'>
          {/* Background connecting line */}
          <div
            className='absolute left-[26px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-slate-200 via-slate-200 to-slate-200'
            style={{ height: 'calc(100% - 48px)' }}
            aria-hidden='true'
          />

          {/* Progress line overlay */}
          <div
            className='absolute left-[26px] top-6 w-0.5 bg-gradient-to-b from-[#C6363C] to-gov-primary transition-all duration-500'
            style={{ height: `${Math.max(0, currentIndex * 56)}px` }}
            aria-hidden='true'
          />

          {stepOrder.map((stepKey, index) => {
            const isActive = step === stepKey;
            const isCompleted = currentIndex > index;
            const isAccessible = index <= currentIndex || isCompleted;
            const isLast = index === stepOrder.length - 1;

            return (
              <li key={stepKey} className={cn('relative', !isLast && 'pb-4')}>
                <button
                  type='button'
                  onClick={() => handleStepClick(stepKey)}
                  disabled={!isAccessible}
                  className={cn(
                    'group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-200',
                    isActive &&
                      'bg-gradient-to-r from-blue-50 to-blue-100/50 text-gov-primary shadow-sm',
                    isCompleted &&
                      !isActive &&
                      'text-slate-600 hover:bg-slate-50 hover:text-slate-800',
                    !isAccessible &&
                      'cursor-not-allowed text-slate-400 opacity-60'
                  )}
                >
                  {/* Step number circle with enhanced states */}
                  <span
                    className={cn(
                      'relative z-10 flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300',
                      isActive &&
                        'bg-[#C6363C] text-white shadow-md scale-110 ring-4 ring-red-200',
                      isCompleted &&
                        !isActive &&
                        'bg-gradient-to-br from-green-400 to-green-500 text-white shadow-sm',
                      !isActive &&
                        !isCompleted &&
                        'bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-500'
                    )}
                  >
                    {isCompleted && !isActive ? (
                      <svg
                        className='h-4 w-4 animate-scale-in'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M5 13l4 4L19 7'
                        />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </span>

                  {/* Step content */}
                  <div className='flex items-center gap-2.5'>
                    <span
                      className={cn(
                        'text-lg transition-transform duration-200',
                        isActive && 'scale-110',
                        isCompleted && !isActive && 'opacity-70'
                      )}
                    >
                      {stepIcons[stepKey]}
                    </span>
                    <span
                      className={cn(
                        'text-sm font-medium transition-all duration-200',
                        isActive && 'text-gov-primary font-semibold',
                        isCompleted && !isActive && 'text-slate-600',
                        !isAccessible && 'text-slate-400'
                      )}
                    >
                      {labels.steps[stepKey]}
                    </span>
                  </div>

                  {/* Active indicator dot */}
                  {isActive && (
                    <span className='absolute right-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-[#C6363C] animate-pulse' />
                  )}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Templates Panel Modal */}
      {showTemplates && (
        <TemplatesPanel
          examples={showcaseExamples}
          onSelectTemplate={handleSelectTemplate}
          locale={locale}
          onClose={() => setShowTemplates(false)}
        />
      )}
    </>
  );
}
