// src/components/home/AudienceSegmentation.tsx
import Link from 'next/link';
import { ArrowRight, Users, Code2 } from 'lucide-react';

import type { Locale } from '@/lib/i18n/config';

interface AudienceCard {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  external?: boolean;
}

interface AudienceSegmentationProps {
  locale: Locale;
  labels: {
    title: string;
    citizens: { title: string; subtitle: string; description: string };
    developers: { title: string; subtitle: string; description: string };
  };
}

const GITHUB_URL = 'https://github.com/acailic/vizualni-admin';

export function AudienceSegmentation({
  locale,
  labels,
}: AudienceSegmentationProps) {
  const cards: AudienceCard[] = [
    {
      icon: Users,
      title: labels.citizens.title,
      subtitle: labels.citizens.subtitle,
      description: labels.citizens.description,
      href: `/${locale}/demo-gallery`,
    },
    {
      icon: Code2,
      title: labels.developers.title,
      subtitle: labels.developers.subtitle,
      description: labels.developers.description,
      href: GITHUB_URL,
      external: true,
    },
  ];

  return (
    <section className='bg-slate-50 py-16' aria-labelledby='audience-title'>
      <div className='container-custom'>
        <h2
          id='audience-title'
          className='mb-12 text-center text-3xl font-bold text-gray-900'
        >
          {labels.title}
        </h2>

        <div className='grid gap-6 sm:grid-cols-2 max-w-3xl mx-auto'>
          {cards.map((card, index) => {
            const content = (
              <article className='flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md'>
                <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gov-primary/10'>
                  <card.icon
                    className='h-6 w-6 text-gov-primary'
                    aria-hidden='true'
                  />
                </div>
                <h3 className='font-semibold text-gray-900'>{card.title}</h3>
                <p className='text-sm text-gray-500'>{card.subtitle}</p>
                <p className='mt-2 flex-1 text-sm text-gray-600'>
                  {card.description}
                </p>
                <div className='mt-4 flex items-center gap-1 text-sm font-medium text-gov-primary'>
                  {card.external ? (
                    <>
                      GitHub
                      <ArrowRight className='h-4 w-4' aria-hidden='true' />
                    </>
                  ) : (
                    <>
                      {locale === 'sr-Cyrl'
                        ? 'Истражи'
                        : locale === 'sr-Latn'
                          ? 'Istraži'
                          : 'Explore'}
                      <ArrowRight className='h-4 w-4' aria-hidden='true' />
                    </>
                  )}
                </div>
              </article>
            );

            if (card.external) {
              return (
                <a
                  key={index}
                  href={card.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='block'
                >
                  {content}
                </a>
              );
            }

            return (
              <Link key={index} href={card.href} className='block'>
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
