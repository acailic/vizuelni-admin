'use client';

import Link from 'next/link';
import { ArrowRight, Play, Search, Code2 } from 'lucide-react';
import { useState } from 'react';

import type { Locale } from '@/lib/i18n/config';
import { getBrowsePath } from '@/lib/api/browse';
import { HeroAnimatedChart } from './HeroAnimatedChart';

interface HeroSectionAnimatedProps {
  locale: Locale;
  title: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
}

export function HeroSectionAnimated({
  locale,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
}: HeroSectionAnimatedProps) {
  const [showCodeExample, setShowCodeExample] = useState(false);

  const codeExample = `import { BarChart } from '@vizualni/charts';
import { populationByRegion } from '@vizualni/sample-data';

export default function PopulationChart() {
  return (
    <BarChart
      data={populationByRegion}
      xField="region"
      yField="population"
      title="Population by Region"
    />
  );
}`;

  return (
    <section
      className='relative overflow-hidden rounded-[2rem] text-white shadow-2xl'
      style={{ minHeight: '480px' }}
      aria-labelledby='hero-title'
    >
      {/* Refined gradient background */}
      <div className='absolute inset-0 bg-gradient-to-br from-gov-primary via-serbia-blue to-[#0C1E42]' />

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
                href={getBrowsePath(locale)}
              >
                <Search className='h-4 w-4 transition-transform group-hover:scale-110' />
                {primaryCta}
              </Link>

              <Link
                className='group inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/15 hover:border-white/40 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gov-primary'
                href={`/${locale}/create`}
              >
                {secondaryCta}
                <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
              </Link>

              <button
                onClick={() => setShowCodeExample(!showCodeExample)}
                className='group inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-transparent px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/10 hover:border-white/40 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gov-primary'
              >
                <Code2 className='h-4 w-4' />
                {locale === 'sr-Cyrl'
                  ? 'Види код'
                  : locale === 'sr-Latn'
                    ? 'Vidi kod'
                    : 'View Code'}
              </button>
            </div>
          </div>

          {/* Right column - Code example or chart preview */}
          <div className='relative'>
            {showCodeExample ? (
              <div className='bg-gray-900/80 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden'>
                <div className='flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-black/20'>
                  <div className='flex gap-1.5'>
                    <div className='w-3 h-3 rounded-full bg-red-500/80' />
                    <div className='w-3 h-3 rounded-full bg-yellow-500/80' />
                    <div className='w-3 h-3 rounded-full bg-green-500/80' />
                  </div>
                  <span className='text-xs text-white/50 ml-2'>
                    PopulationChart.tsx
                  </span>
                </div>
                <pre className='p-4 text-sm overflow-x-auto'>
                  <code className='text-white/90'>{codeExample}</code>
                </pre>
                <div className='px-4 py-3 border-t border-white/10 bg-black/20 flex items-center justify-between'>
                  <span className='text-xs text-white/50'>
                    {locale === 'sr-Cyrl'
                      ? 'Копирајте и покрените'
                      : locale === 'sr-Latn'
                        ? 'Kopirajte i pokrenite'
                        : 'Copy and run'}
                  </span>
                  <button
                    onClick={() => navigator.clipboard.writeText(codeExample)}
                    className='text-xs text-white/70 hover:text-white flex items-center gap-1'
                  >
                    <Code2 className='w-3 h-3' />
                    {locale === 'sr-Cyrl'
                      ? 'Копирај'
                      : locale === 'sr-Latn'
                        ? 'Kopiraj'
                        : 'Copy'}
                  </button>
                </div>
              </div>
            ) : (
              <div className='bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6'>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-lg font-semibold text-white'>
                    {locale === 'sr-Cyrl'
                      ? 'Брз почетак'
                      : locale === 'sr-Latn'
                        ? 'Brz početak'
                        : 'Quick Start'}
                  </h3>
                  <div className='flex items-center gap-1'>
                    <span className='w-2 h-2 rounded-full bg-green-400 animate-pulse' />
                    <span className='text-xs text-white/60'>
                      {locale === 'sr-Cyrl'
                        ? 'Учитава се...'
                        : locale === 'sr-Latn'
                          ? 'Učitava se...'
                          : 'Loading...'}
                    </span>
                  </div>
                </div>

                {/* Mini chart preview */}
                <div className='h-48 flex items-end gap-2'>
                  {[35, 65, 45, 80, 55, 70, 90, 60, 75, 85].map((height, i) => (
                    <div
                      key={i}
                      className='flex-1 bg-white/30 rounded-t transition-all duration-500'
                      style={{
                        height: `${height * (showCodeExample ? 0 : 1)}%`,
                        transitionDelay: `${i * 50}ms`,
                      }}
                    />
                  ))}
                </div>

                <div className='mt-4 flex items-center justify-between text-sm'>
                  <span className='text-white/60'>GDP Growth 2015-2024</span>
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
            )}
          </div>
        </div>
      </div>

      {/* Bottom stats bar */}
      <div className='relative z-10 border-t border-white/10 bg-black/10 backdrop-blur-sm'>
        <div className='px-8 py-4 flex flex-wrap items-center justify-center gap-8 md:gap-16'>
          <div className='text-center'>
            <div className='text-2xl font-bold text-white'>28+</div>
            <div className='text-xs text-white/60'>
              {locale === 'sr-Cyrl'
                ? 'Графикона'
                : locale === 'sr-Latn'
                  ? 'Grafikona'
                  : 'Charts'}
            </div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-white'>3</div>
            <div className='text-xs text-white/60'>
              {locale === 'sr-Cyrl'
                ? 'Језика'
                : locale === 'sr-Latn'
                  ? 'Jezika'
                  : 'Languages'}
            </div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-white'>100%</div>
            <div className='text-xs text-white/60'>
              {locale === 'sr-Cyrl'
                ? 'Отворен код'
                : locale === 'sr-Latn'
                  ? 'Otvoren kod'
                  : 'Open Source'}
            </div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-white flex items-center gap-1'>
              <Play className='w-4 h-4' />
              npm
            </div>
            <div className='text-xs text-white/60'>
              {locale === 'sr-Cyrl'
                ? 'Инсталирај'
                : locale === 'sr-Latn'
                  ? 'Instaliraj'
                  : 'Install'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
