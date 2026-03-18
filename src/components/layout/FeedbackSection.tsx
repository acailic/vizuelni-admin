// src/components/layout/FeedbackSection.tsx
import { Bug, Lightbulb } from 'lucide-react';
import type { Locale } from '@/lib/i18n/config';
import type { FeedbackLabels } from '@/lib/feedback/types';
import { generateMailtoLink } from '@/lib/feedback/types';
import {
  generateBugReportEmail,
  generateFeatureRequestEmail,
} from '@/lib/feedback/email-templates';

interface FeedbackSectionProps {
  locale: Locale;
  labels: FeedbackLabels;
}

export function FeedbackSection({ locale, labels }: FeedbackSectionProps) {
  const bugEmail = generateBugReportEmail(locale);
  const featureEmail = generateFeatureRequestEmail(locale);

  return (
    <div className='grid gap-4 sm:grid-cols-2'>
      {/* Bug Report Card */}
      <div className='rounded-xl border border-gray-200 bg-white p-6'>
        <div className='mb-4 flex items-center gap-3'>
          <div className='rounded-full bg-red-100 p-2'>
            <Bug className='h-5 w-5 text-red-600' />
          </div>
          <h3 className='font-semibold text-[#0C1E42]'>{labels.foundBug}</h3>
        </div>
        <p className='mb-4 text-sm text-gray-600'>
          {labels.reportBugDescription}
        </p>
        <a
          href={generateMailtoLink(bugEmail)}
          className='inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700'
        >
          {labels.reportBug}
        </a>
      </div>

      {/* Feature Request Card */}
      <div className='rounded-xl border border-gray-200 bg-white p-6'>
        <div className='mb-4 flex items-center gap-3'>
          <div className='rounded-full bg-amber-100 p-2'>
            <Lightbulb className='h-5 w-5 text-amber-600' />
          </div>
          <h3 className='font-semibold text-[#0C1E42]'>{labels.newFeature}</h3>
        </div>
        <p className='mb-4 text-sm text-gray-600'>
          {labels.featureDescription}
        </p>
        <a
          href={generateMailtoLink(featureEmail)}
          className='inline-flex items-center rounded-lg bg-gov-secondary px-4 py-2 text-sm font-medium text-white transition hover:bg-gov-accent'
        >
          {labels.submit}
        </a>
      </div>
    </div>
  );
}
