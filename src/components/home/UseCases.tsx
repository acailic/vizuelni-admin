import Link from 'next/link';
import { ArrowRight, Code2, FileText, Microscope, Users } from 'lucide-react';

import type { Locale } from '@/lib/i18n/config';

interface UseCaseCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  cta: string;
  href: string;
  external?: boolean;
}

interface UseCasesProps {
  locale: Locale;
  title: string;
  subtitle: string;
  journalistsTitle: string;
  journalistsDescription: string;
  journalistsCta: string;
  researchersTitle: string;
  researchersDescription: string;
  researchersCta: string;
  developersTitle: string;
  developersDescription: string;
  developersCta: string;
  citizensTitle: string;
  citizensDescription: string;
  citizensCta: string;
}

export function UseCases({
  locale,
  title,
  subtitle,
  journalistsTitle,
  journalistsDescription,
  journalistsCta,
  researchersTitle,
  researchersDescription,
  researchersCta,
  developersTitle,
  developersDescription,
  developersCta,
  citizensTitle,
  citizensDescription,
  citizensCta,
}: UseCasesProps) {
  const useCases: UseCaseCard[] = [
    {
      icon: <FileText className='h-6 w-6' />,
      title: journalistsTitle,
      description: journalistsDescription,
      cta: journalistsCta,
      href: `/${locale}/demo-gallery?category=demographics`,
    },
    {
      icon: <Microscope className='h-6 w-6' />,
      title: researchersTitle,
      description: researchersDescription,
      cta: researchersCta,
      href: `/${locale}/demo-gallery?category=healthcare`,
    },
    {
      icon: <Code2 className='h-6 w-6' />,
      title: developersTitle,
      description: developersDescription,
      cta: developersCta,
      href: 'https://github.com/acailic/vizualni-admin',
      external: true,
    },
    {
      icon: <Users className='h-6 w-6' />,
      title: citizensTitle,
      description: citizensDescription,
      cta: citizensCta,
      href: `/${locale}/demo-gallery`,
    },
  ];

  return (
    <section className='bg-gray-50 py-16' aria-labelledby='use-cases-title'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <header className='mb-12 text-center'>
          <h2 id='use-cases-title' className='text-3xl font-bold text-gray-900'>
            {title}
          </h2>
          <p className='mt-4 text-lg text-gray-600'>{subtitle}</p>
        </header>

        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {useCases.map((useCase, index) => {
            const content = (
              <article className='flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md'>
                <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gov-primary/10 text-gov-primary'>
                  {useCase.icon}
                </div>
                <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                  {useCase.title}
                </h3>
                <p className='mb-4 flex-1 text-sm text-gray-600'>
                  {useCase.description}
                </p>
                <span className='inline-flex items-center gap-1 text-sm font-medium text-gov-primary'>
                  {useCase.cta}
                  <ArrowRight className='h-4 w-4' />
                </span>
              </article>
            );

            if (useCase.external) {
              return (
                <a
                  key={index}
                  href={useCase.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='block'
                >
                  {content}
                </a>
              );
            }

            return (
              <Link key={index} href={useCase.href} className='block'>
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
