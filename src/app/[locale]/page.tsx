import { Metadata } from 'next';

import {
  CodeExamplePanel,
  ComparisonTable,
  FeaturedExamples,
  FeaturesGrid,
  FinalCta,
  GettingStartedGuide,
  HeroSectionAnimated,
  ProblemStatement,
  UseCases,
} from '@/components/home';
import { ShowcaseGrid } from '@/components/showcase';
import { getFeaturedExamples } from '@/lib/examples/showcase-examples';
import type { Locale } from '@/lib/i18n/config';
import { getMessages, resolveLocale } from '@/lib/i18n/messages';

interface PageProps {
  params: Promise<{ locale: string }>;
}

const docsUrl =
  'https://github.com/acailic/vizualni-admin/blob/main/docs/GETTING-STARTED.md';

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);

  const titles: Record<Locale, string> = {
    'sr-Cyrl': 'Визуелни Админ Србије - Владини подаци, визуализовани',
    'sr-Latn': 'Vizuelni Admin Srbije - Vladini podaci, vizualizovani',
    en: 'Vizuelni Admin Srbije - Government Data, Visualized',
  };

  const descriptions: Record<Locale, string> = {
    'sr-Cyrl':
      'Трансформишите српске јавне податке у јасне, интерактивне визуализације. Направљено за новинаре, истраживаче и грађане који требају поуздане увиде.',
    'sr-Latn':
      'Transformišite srpske javne podatke u jasne, interaktivne vizualizacije. Napravljeno za novinare, istraživače i građane koji trebaju pouzdane uvide.',
    en: 'Transform Serbian public data into clear, interactive visualizations. Built for journalists, researchers, and citizens who need trustworthy insights.',
  };

  return {
    title: titles[locale],
    description: descriptions[locale],
    openGraph: {
      title: titles[locale],
      description: descriptions[locale],
      type: 'website',
      locale:
        locale === 'sr-Cyrl'
          ? 'sr_RS'
          : locale === 'sr-Latn'
            ? 'sr_RS'
            : 'en_US',
    },
  };
}

export default async function LocaleHomePage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const messages = getMessages(locale);
  const showcaseExamples = getFeaturedExamples();

  return (
    <main className='container-custom py-16'>
      {/* 1. Hero Section */}
      <HeroSectionAnimated
        locale={locale}
        title={messages.homepage.hero.title}
        subtitle={messages.homepage.hero.subtitle}
        primaryCta={messages.homepage.hero.tryDemoCta}
        secondaryCta={messages.homepage.hero.starGithubCta}
        socialProofLabels={{
          openSource: messages.homepage.socialProof.badge.openSource,
          accessibility: messages.homepage.socialProof.badge.accessibility,
          multilingual: messages.homepage.socialProof.badge.multilingual,
          examples: messages.homepage.socialProof.badge.examples,
        }}
        previewAlt={messages.homepage.hero.previewAlt}
      />

      {/* 2. Problem Statement */}
      <ProblemStatement
        title={messages.homepage.problem.title}
        subtitle={messages.homepage.problem.subtitle}
        gap1Title={messages.homepage.problem.gap1Title}
        gap1Description={messages.homepage.problem.gap1Description}
        gap2Title={messages.homepage.problem.gap2Title}
        gap2Description={messages.homepage.problem.gap2Description}
        gap3Title={messages.homepage.problem.gap3Title}
        gap3Description={messages.homepage.problem.gap3Description}
      />

      {/* 3. Solution Showcase */}
      <FeaturedExamples locale={locale} />

      {/* 4. Features Grid */}
      <FeaturesGrid
        title={messages.homepage.features.title}
        subtitle={messages.homepage.features.subtitle}
        serbianFirstTitle={messages.homepage.features.serbianFirst.title}
        serbianFirstDescription={
          messages.homepage.features.serbianFirst.description
        }
        realDataTitle={messages.homepage.features.realData.title}
        realDataDescription={messages.homepage.features.realData.description}
        accessibilityTitle={messages.homepage.features.accessibility.title}
        accessibilityDescription={
          messages.homepage.features.accessibility.description
        }
        geographyTitle={messages.homepage.features.geography.title}
        geographyDescription={messages.homepage.features.geography.description}
        openSourceTitle={messages.homepage.features.openSource.title}
        openSourceDescription={
          messages.homepage.features.openSource.description
        }
        lowFrictionTitle={messages.homepage.features.lowFriction.title}
        lowFrictionDescription={
          messages.homepage.features.lowFriction.description
        }
      />

      {/* 5. How It Works */}
      <GettingStartedGuide
        sectionTitle={messages.homepage.gettingStarted.title}
        step1Title={messages.homepage.gettingStarted.step1Title}
        step1Description={messages.homepage.gettingStarted.step1Description}
        step2Title={messages.homepage.gettingStarted.step2Title}
        step2Description={messages.homepage.gettingStarted.step2Description}
        step3Title={messages.homepage.gettingStarted.step3Title}
        step3Description={messages.homepage.gettingStarted.step3Description}
        ctaLabel={messages.homepage.finalCta.tryDemo}
        ctaHref='/demo-gallery'
        locale={locale}
      />

      {/* 6. Use Cases */}
      <UseCases
        locale={locale}
        title={messages.homepage.useCases.title}
        subtitle={messages.homepage.useCases.subtitle}
        journalistsTitle={messages.homepage.useCases.journalists.title}
        journalistsDescription={
          messages.homepage.useCases.journalists.description
        }
        journalistsCta={messages.homepage.useCases.journalists.cta}
        researchersTitle={messages.homepage.useCases.researchers.title}
        researchersDescription={
          messages.homepage.useCases.researchers.description
        }
        researchersCta={messages.homepage.useCases.researchers.cta}
        developersTitle={messages.homepage.useCases.developers.title}
        developersDescription={
          messages.homepage.useCases.developers.description
        }
        developersCta={messages.homepage.useCases.developers.cta}
        citizensTitle={messages.homepage.useCases.citizens.title}
        citizensDescription={messages.homepage.useCases.citizens.description}
        citizensCta={messages.homepage.useCases.citizens.cta}
      />

      {/* 7. Live Examples Gallery */}
      <section className='py-12'>
        <div className='mb-8'>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
            {messages.homepage.liveExamples.title}
          </h2>
          <p className='text-gray-600 dark:text-gray-400 max-w-2xl'>
            {messages.homepage.liveExamples.subtitle}
          </p>
        </div>
        <ShowcaseGrid
          examples={showcaseExamples}
          locale={locale}
          columns={3}
          showEditButton
          showCategoryFilter
        />
      </section>

      {/* 8. Code Example */}
      <CodeExamplePanel
        title={messages.homepage.codeExample.title}
        subtitle={messages.homepage.codeExample.subtitle}
        description={messages.homepage.codeExample.description}
        viewOnGithub={messages.homepage.codeExample.viewOnGithub}
        readDocs={messages.homepage.codeExample.readDocs}
        docsUrl={docsUrl}
      />

      {/* 9. Comparison Table */}
      <ComparisonTable
        title={messages.homepage.comparison.title}
        subtitle={messages.homepage.comparison.subtitle}
        columnOur={messages.homepage.comparison.columnOur}
        columnGeneric={messages.homepage.comparison.columnGeneric}
        rowGeographyLabel={messages.homepage.comparison.rowGeography.label}
        rowGeographyOur={messages.homepage.comparison.rowGeography.our}
        rowGeographyGeneric={messages.homepage.comparison.rowGeography.generic}
        rowLocalizationLabel={
          messages.homepage.comparison.rowLocalization.label
        }
        rowLocalizationOur={messages.homepage.comparison.rowLocalization.our}
        rowLocalizationGeneric={
          messages.homepage.comparison.rowLocalization.generic
        }
        rowDataLabel={messages.homepage.comparison.rowData.label}
        rowDataOur={messages.homepage.comparison.rowData.our}
        rowDataGeneric={messages.homepage.comparison.rowData.generic}
        rowAccessibilityLabel={
          messages.homepage.comparison.rowAccessibility.label
        }
        rowAccessibilityOur={messages.homepage.comparison.rowAccessibility.our}
        rowAccessibilityGeneric={
          messages.homepage.comparison.rowAccessibility.generic
        }
        rowContextLabel={messages.homepage.comparison.rowContext.label}
        rowContextOur={messages.homepage.comparison.rowContext.our}
        rowContextGeneric={messages.homepage.comparison.rowContext.generic}
      />

      {/* 10. Final CTA */}
      <FinalCta
        locale={locale}
        title={messages.homepage.finalCta.title}
        subtitle={messages.homepage.finalCta.subtitle}
        tryDemo={messages.homepage.finalCta.tryDemo}
        starGithub={messages.homepage.finalCta.starGithub}
        viewDocs={messages.homepage.finalCta.viewDocs}
        docsUrl={docsUrl}
      />
    </main>
  );
}
