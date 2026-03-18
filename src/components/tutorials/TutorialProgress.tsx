'use client';

import React from 'react';

interface TutorialProgressProps {
  current: number;
  total: number;
  className?: string;
}

/**
 * Tutorial Progress Component
 * Visual indicator of progress through tutorial steps
 */
export function TutorialProgress({
  current,
  total,
  className = '',
}: TutorialProgressProps) {
  const percentage = Math.round((current / total) * 100);
  const steps = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <div className={`mt-2 ${className}`}>
      {/* Progress bar */}
      <div className='w-full bg-white/20 rounded-full h-1.5 overflow-hidden'>
        <div
          className='bg-white h-full transition-all duration-300 ease-out'
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Step dots */}
      <div className='flex justify-between mt-1.5 gap-1'>
        {steps.map((step) => (
          <div
            key={step}
            className={`flex-1 h-1 rounded-full transition-colors ${
              step < current
                ? 'bg-white'
                : step === current
                  ? 'bg-white'
                  : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Tutorial Progress Dots Variant
 * Simple dot-based progress indicator
 */
export function TutorialProgressDots({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const steps = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <div className='flex items-center justify-center gap-1.5'>
      {steps.map((step) => (
        <div
          key={step}
          className={`w-2 h-2 rounded-full transition-all ${
            step < current
              ? 'bg-blue-600'
              : step === current
                ? 'bg-blue-600 scale-125'
                : 'bg-gray-300 dark:bg-gray-600'
          }`}
        />
      ))}
    </div>
  );
}

/**
 * Tutorial Progress Text Variant
 * Text-based progress indicator
 */
export function TutorialProgressText({
  current,
  total,
  locale = 'srLat',
}: {
  current: number;
  total: number;
  locale?: 'en' | 'sr' | 'srLat';
}) {
  const labels = {
    en: `${current} of ${total}`,
    sr: `${current} од ${total}`,
    srLat: `${current} od ${total}`,
  };

  return (
    <span className='text-sm text-gray-500 dark:text-gray-400'>
      {labels[locale]}
    </span>
  );
}

export default TutorialProgress;
