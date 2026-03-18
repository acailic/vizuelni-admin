'use client';

import React, { useEffect, useState } from 'react';
import { useTutorial, useCurrentStepContent } from '@/lib/tutorials';
import { TutorialStepDisplay } from './TutorialStepDisplay';
import { TutorialProgress } from './TutorialProgress';

/**
 * Tutorial Overlay Component
 * Displays the active tutorial as an overlay on the page
 */
export function TutorialOverlay() {
  const {
    isActive,
    activeTutorial,
    currentStep: _currentStep,
    nextStep,
    previousStep,
    skipTutorial,
    completeTutorial,
    exitTutorial,
    userState,
  } = useTutorial();

  const stepContent = useCurrentStepContent();
  const [highlightElement, setHighlightElement] = useState<HTMLElement | null>(
    null
  );
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const locale = userState.preferences.preferredLanguage;

  // Find and highlight the target element
  useEffect(() => {
    if (!isActive || !stepContent?.step.target) {
      setHighlightElement(null);
      return;
    }

    const selector = stepContent.step.target.selector;
    const element = document.querySelector(selector) as HTMLElement | null;

    if (element) {
      setHighlightElement(element);

      // Calculate tooltip position
      const rect = element.getBoundingClientRect();
      const position = stepContent.step.target.position;

      let top = 0;
      let left = 0;

      switch (position) {
        case 'top':
          top = rect.top - 10;
          left = rect.left + rect.width / 2;
          break;
        case 'bottom':
          top = rect.bottom + 10;
          left = rect.left + rect.width / 2;
          break;
        case 'left':
          top = rect.top + rect.height / 2;
          left = rect.left - 10;
          break;
        case 'right':
          top = rect.top + rect.height / 2;
          left = rect.right + 10;
          break;
        case 'center':
        default:
          top = window.innerHeight / 2;
          left = window.innerWidth / 2;
          break;
      }

      setTooltipPosition({ top, left });

      // Scroll element into view if needed
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      setHighlightElement(null);
    }
  }, [isActive, stepContent]);

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'Enter':
          nextStep();
          break;
        case 'ArrowLeft':
          previousStep();
          break;
        case 'Escape':
          exitTutorial();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, nextStep, previousStep, exitTutorial]);

  if (!isActive || !activeTutorial || !stepContent) {
    return null;
  }

  const { step, stepNumber, totalSteps, isFirst, isLast } = stepContent;
  const isCentered = !step.target;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className='fixed inset-0 z-[9998] bg-black/50 transition-opacity'
        onClick={exitTutorial}
        aria-hidden='true'
      />

      {/* Highlight cutout */}
      {highlightElement && <HighlightCutout element={highlightElement} />}

      {/* Tutorial content */}
      <div
        className={`fixed z-[9999] ${
          isCentered ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' : ''
        }`}
        style={
          isCentered
            ? {}
            : {
                top: tooltipPosition.top,
                left: tooltipPosition.left,
              }
        }
        role='dialog'
        aria-labelledby='tutorial-title'
        aria-describedby='tutorial-description'
      >
        <div className='bg-white dark:bg-gray-900 rounded-lg shadow-2xl max-w-md w-[400px] overflow-hidden border border-gray-200 dark:border-gray-700'>
          {/* Header */}
          <div className='bg-blue-600 dark:bg-blue-700 px-4 py-3 text-white'>
            <div className='flex items-center justify-between'>
              <h2 id='tutorial-title' className='text-lg font-semibold'>
                {activeTutorial.title[locale]}
              </h2>
              <button
                onClick={exitTutorial}
                className='text-white/80 hover:text-white transition-colors'
                aria-label='Close tutorial'
              >
                <svg
                  className='w-5 h-5'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>
            <TutorialProgress current={stepNumber} total={totalSteps} />
          </div>

          {/* Step content */}
          <TutorialStepDisplay
            step={step}
            stepNumber={stepNumber}
            totalSteps={totalSteps}
            locale={locale}
            isFirst={isFirst}
            isLast={isLast}
            onNext={nextStep}
            onPrevious={previousStep}
            onSkip={skipTutorial}
          />

          {/* Footer buttons */}
          <div className='px-4 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-between'>
            <div className='flex gap-2'>
              {!isFirst && (
                <button
                  onClick={previousStep}
                  className='px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors'
                >
                  ←{' '}
                  {locale === 'sr'
                    ? 'Назад'
                    : locale === 'en'
                      ? 'Back'
                      : 'Nazad'}
                </button>
              )}
            </div>
            <div className='flex gap-2'>
              <button
                onClick={skipTutorial}
                className='px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors'
              >
                {locale === 'sr'
                  ? 'Прескочи'
                  : locale === 'en'
                    ? 'Skip'
                    : 'Preskoči'}
              </button>
              {isLast ? (
                <button
                  onClick={completeTutorial}
                  className='px-4 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors'
                >
                  {locale === 'sr'
                    ? 'Заврши'
                    : locale === 'en'
                      ? 'Finish'
                      : 'Završi'}
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  className='px-4 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors'
                >
                  {locale === 'sr'
                    ? 'Даље'
                    : locale === 'en'
                      ? 'Next'
                      : 'Dalje'}{' '}
                  →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * Highlight cutout component
 * Creates a visual highlight around the target element
 */
function HighlightCutout({ element }: { element: HTMLElement }) {
  const [rect, setRect] = useState(element.getBoundingClientRect());

  useEffect(() => {
    const updateRect = () => setRect(element.getBoundingClientRect());

    updateRect();
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);

    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [element]);

  return (
    <div
      className='fixed z-[9998] pointer-events-none ring-4 ring-blue-500 ring-offset-2 ring-offset-transparent rounded-md transition-all duration-200'
      style={{
        top: rect.top - 4,
        left: rect.left - 4,
        width: rect.width + 8,
        height: rect.height + 8,
      }}
    />
  );
}

export default TutorialOverlay;
