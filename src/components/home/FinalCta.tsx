import Link from 'next/link';
import { ArrowRight, Github, FileText, Play } from 'lucide-react';

import type { Locale } from '@/lib/i18n/config';

interface FinalCtaProps {
  locale: Locale;
  title: string;
  subtitle: string;
  tryDemo: string;
  starGithub: string;
  viewDocs: string;
  githubUrl?: string;
  docsUrl?: string;
}

export function FinalCta({
  locale,
  title,
  subtitle,
  tryDemo,
  starGithub,
  viewDocs,
  githubUrl = 'https://github.com/acailic/vizualni-admin',
  docsUrl,
}: FinalCtaProps) {
  return (
    <section
      className='py-20 bg-gradient-to-b from-white to-gray-50'
      aria-labelledby='final-cta-title'
    >
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='relative overflow-hidden rounded-2xl bg-gov-primary px-6 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20'>
          {/* Background decorative elements */}
          <div className='absolute inset-0 overflow-hidden'>
            <div className='absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl' />
            <div className='absolute -bottom-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl' />
          </div>

          <div className='relative z-10 text-center'>
            <h2
              id='final-cta-title'
              className='text-3xl font-bold text-white sm:text-4xl'
            >
              {title}
            </h2>
            <p className='mt-4 text-lg text-white/90 max-w-2xl mx-auto'>
              {subtitle}
            </p>

            <div className='mt-10 flex flex-col sm:flex-row items-center justify-center gap-4'>
              {/* Primary CTA - Try Demo */}
              <Link
                href={`/${locale}/demo-gallery`}
                className='group inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-white text-gov-primary font-semibold transition-all hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gov-primary shadow-lg hover:shadow-xl'
              >
                <Play className='h-5 w-5' />
                {tryDemo}
                <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
              </Link>

              {/* Secondary CTA - Star on GitHub */}
              <a
                href={githubUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 border-white/30 text-white font-medium transition-all hover:bg-white/10 hover:border-white/50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gov-primary'
              >
                <Github className='h-5 w-5' />
                {starGithub}
              </a>

              {/* Tertiary CTA - View Docs (optional) */}
              {docsUrl && (
                <a
                  href={docsUrl}
                  className='group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white/80 font-medium transition-all hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gov-primary'
                >
                  <FileText className='h-5 w-5' />
                  {viewDocs}
                </a>
              )}
            </div>

            {/* Trust indicators */}
            <div className='mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-white/70'>
              <span className='inline-flex items-center gap-1.5'>
                <svg
                  className='h-4 w-4'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M5 13l4 4L19 7'
                  />
                </svg>
                Open Source
              </span>
              <span className='inline-flex items-center gap-1.5'>
                <svg
                  className='h-4 w-4'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M5 13l4 4L19 7'
                  />
                </svg>
                No account required
              </span>
              <span className='inline-flex items-center gap-1.5'>
                <svg
                  className='h-4 w-4'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M5 13l4 4L19 7'
                  />
                </svg>
                WCAG 2.1 AA
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
