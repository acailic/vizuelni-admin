'use client';

import React from 'react';
import { TutorialStep } from '@/lib/tutorials/types';

interface TutorialStepDisplayProps {
  step: TutorialStep;
  stepNumber: number;
  totalSteps: number;
  locale: 'en' | 'sr' | 'srLat';
  isFirst: boolean;
  isLast: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
}

/**
 * Tutorial Step Display Component
 * Renders the content of a single tutorial step
 */
export function TutorialStepDisplay({
  step,
  stepNumber,
  totalSteps,
  locale,
  isFirst: _isFirst,
  isLast: _isLast,
  onNext: _onNext,
  onPrevious: _onPrevious,
  onSkip: _onSkip,
}: TutorialStepDisplayProps) {
  const { content } = step;

  return (
    <div className='p-4'>
      {/* Step title */}
      <h3
        id='tutorial-description'
        className='text-lg font-semibold text-gray-900 dark:text-white mb-2'
      >
        {content.title[locale]}
      </h3>

      {/* Step description */}
      <p className='text-gray-600 dark:text-gray-300 mb-4 leading-relaxed'>
        {content.description[locale]}
      </p>

      {/* Tips */}
      {content.tips && content.tips[locale].length > 0 && (
        <div className='mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800'>
          <div className='flex items-start gap-2'>
            <span className='text-blue-500 text-lg'>💡</span>
            <div>
              <p className='text-sm font-medium text-blue-700 dark:text-blue-300 mb-1'>
                {locale === 'sr'
                  ? 'Савети'
                  : locale === 'en'
                    ? 'Tips'
                    : 'Saveti'}
              </p>
              <ul className='text-sm text-blue-600 dark:text-blue-400 space-y-1'>
                {content.tips[locale].map((tip, index) => (
                  <li key={index}>• {tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Code example */}
      {content.codeExample && (
        <div className='mb-4'>
          <p className='text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide'>
            {locale === 'sr'
              ? 'Пример кода'
              : locale === 'en'
                ? 'Code Example'
                : 'Primer koda'}
          </p>
          <pre className='p-3 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto text-sm'>
            <code>{content.codeExample.code}</code>
          </pre>
        </div>
      )}

      {/* Image */}
      {content.image && (
        <div className='mb-4'>
          <img
            src={content.image.src}
            alt={content.image.alt[locale]}
            className='rounded-lg border border-gray-200 dark:border-gray-700 max-w-full'
          />
        </div>
      )}

      {/* Learn more link */}
      {content.learnMore && (
        <div className='mt-4'>
          <a
            href={content.learnMore.url}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline'
          >
            {content.learnMore.text[locale]}
            <svg
              className='w-4 h-4 ml-1'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
              />
            </svg>
          </a>
        </div>
      )}

      {/* Step indicator */}
      <div className='mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400'>
        <span>
          {locale === 'sr'
            ? `Корак ${stepNumber} од ${totalSteps}`
            : locale === 'en'
              ? `Step ${stepNumber} of ${totalSteps}`
              : `Korak ${stepNumber} od ${totalSteps}`}
        </span>
        <span className='flex items-center gap-1'>
          <kbd className='px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px]'>
            ←
          </kbd>
          <kbd className='px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px]'>
            →
          </kbd>
          <span className='ml-1'>
            {locale === 'sr'
              ? 'за навигацију'
              : locale === 'en'
                ? 'to navigate'
                : 'za navigaciju'}
          </span>
        </span>
      </div>
    </div>
  );
}

export default TutorialStepDisplay;
