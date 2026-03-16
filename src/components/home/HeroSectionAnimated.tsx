'use client';

import Link from 'next/link';
import { ArrowRight, Search, ExternalLink } from 'lucide-react';

import { ChartRenderer } from '@/components/charts/ChartRenderer';
import type { Locale } from '@/lib/i18n/config';
import { gdpTimeSeriesConfig } from '@/lib/examples/configs/gdp-time-series';
import { getLocalizedText } from '@/lib/examples/types';
import { HeroAnimatedChart } from './HeroAnimatedChart';
import { SocialProof } from './SocialProof';

interface SocialProofLabels {
  openSource: string;
  accessibility: string;
  multilingual: string;
  examples: string;
}

interface HeroSectionAnimatedProps {
  locale: Locale;
  title: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
  socialProofLabels: SocialProofLabels;
  previewAlt: string;
}

export function HeroSectionAnimated({
  locale,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  socialProofLabels,
  previewAlt,
}: HeroSectionAnimatedProps) {
  const previewExample = gdpTimeSeriesConfig;
  const previewTitle = getLocalizedText(previewExample.title, locale);
  const previewDescription = getLocalizedText(
    previewExample.description,
    locale
  );

  return (
    <section
      className='relative overflow-hidden rounded-[2rem] text-white shadow-2xl'
      style={{ minHeight: '480px' }}
      aria-labelledby='hero-title'
    >
      {/* Refined gradient background - using inline styles for reliability */}
      <div
        className='absolute inset-0'
        style={{
          background:
            'linear-gradient(to bottom right, #0D4077, #1a5290, #0C1E42)',
        }}
      />

      {/* Animated chart background */}
      <div className='absolute inset-0 opacity-30'>
        <HeroAnimatedChart />
      </div>

      {/* Decorative accent elements */}
      <div
        className='absolute top-0 right-0 w-96 h-96 bg-serbia-red/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2'
        aria-hidden='true'
      />
      <div
        className='absolute bottom-0 left-0 w-64 h-64 bg-gov-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2'
        aria-hidden='true'
      />

      {/* Subtle grid pattern overlay */}
      <div
        className='absolute inset-0 opacity-[0.03]'
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
        aria-hidden='true'
      />

      {/* Main content */}
      <div className='relative z-10 px-8 py-12 md:py-16'>
        {/* Social Proof at top */}
        <div className='mb-8'>
          <SocialProof labels={socialProofLabels} />
        </div>

        <div className='grid lg:grid-cols-2 gap-12 items-center'>
          {/* Left column - Text content */}
          <div>
            <p
              className='inline-flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.2em] text-white/80'
              style={{ fontFamily: 'var(--font-family-body)' }}
            >
              <span
                className='h-2 w-2 rounded-full bg-serbia-red shadow-lg shadow-red-500/30 animate-pulse'
                aria-hidden='true'
              />
              data.gov.rs
            </p>

            <h1
              id='hero-title'
              className='mt-5 text-3xl font-extrabold leading-[1.1] tracking-tight text-white md:text-4xl lg:text-5xl'
              style={{
                fontFamily: 'var(--font-family-display)',
                letterSpacing: '-0.02em',
              }}
            >
              {title}
            </h1>

            <p
              className='mt-6 text-base leading-[1.75] text-white md:text-lg'
              style={{ fontFamily: 'var(--font-family-body)' }}
            >
              {subtitle}
            </p>

            <div className='mt-8 flex flex-wrap gap-4'>
              <Link
                className='group inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-semibold text-gov-primary shadow-lg transition-all duration-200 hover:bg-gray-50 hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gov-primary'
                href={`/${locale}/demo-gallery`}
              >
                <Search className='h-4 w-4 transition-transform group-hover:scale-110' />
                {primaryCta}
              </Link>

              <Link
                className='group inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/15 hover:border-white/40 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gov-primary'
                href='https://github.com/acailic/vizualni-admin'
                target='_blank'
                rel='noopener noreferrer'
              >
                {secondaryCta}
                <ExternalLink className='h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
              </Link>
            </div>
          </div>

          {/* Right column - Chart preview card */}
          <div className='relative'>
            <div className='bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold text-white'>
                  {previewTitle}
                </h3>
                <div className='flex items-center gap-1'>
                  <span className='w-2 h-2 rounded-full bg-green-400 animate-pulse' />
                  <span className='text-xs text-white/60'>
                    {locale === 'sr-Cyrl'
                      ? 'Стварни подаци'
                      : locale === 'sr-Latn'
                        ? 'Stvarni podaci'
                        : 'Real Data'}
                  </span>
                </div>
              </div>

              {/* Mini chart preview */}
              <div
                className='h-56 overflow-hidden rounded-lg bg-white/5'
                role='img'
                aria-label={previewAlt}
              >
                {previewExample.inlineData && (
                  <ChartRenderer
                    config={previewExample.chartConfig}
                    data={previewExample.inlineData.observations}
                    height={224}
                    locale={locale}
                    previewMode={true}
                    preselectedFilters={previewExample.preselectedFilters}
                  />
                )}
              </div>

              <div className='mt-4 flex items-center justify-between text-sm'>
                <span className='text-white/60'>{previewDescription}</span>
                <Link
                  href={`/${locale}/demo-gallery`}
                  className='text-white hover:text-white/80 flex items-center gap-1'
                >
                  {locale === 'sr-Cyrl'
                    ? 'Више примера'
                    : locale === 'sr-Latn'
                      ? 'Više primera'
                      : 'More examples'}
                  <ArrowRight className='w-3 h-3' />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
