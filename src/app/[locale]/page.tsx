import { Metadata } from 'next';

import {
  AudienceSegmentation,
  CodeExamplePanel,
  ComparisonCards,
  FeaturedExamplesCurated,
  FinalCta,
  HeroSectionAnimated,
  HowItWorksMinimal,
  QuickProofStrip,
} from '@/components/home';
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

  return (
    <main className='container-custom py-8'>
      {/* 1. Hero Section */}
      <HeroSectionAnimated
        locale={locale}
        title={messages.homepage.hero.title}
        subtitle={messages.homepage.hero.subtitle}
        primaryCta={messages.homepage.hero.tryDemoCta}
        secondaryCta={messages.homepage.hero.examplesLink}
        socialProofLabels={{
          openSource: messages.homepage.socialProof.badge.openSource,
          accessibility: messages.homepage.socialProof.badge.accessibility,
          multilingual: messages.homepage.socialProof.badge.multilingual,
          examples: messages.homepage.socialProof.badge.examples,
        }}
        previewAlt={messages.homepage.hero.previewAlt}
      />

      {/* 2. Quick Proof Strip */}
      <QuickProofStrip
        examples={messages.homepage.quickProof.examples}
        officialSources={messages.homepage.quickProof.officialSources}
        cyrillicLatin={messages.homepage.quickProof.cyrillicLatin}
        serbianMaps={messages.homepage.quickProof.serbianMaps}
      />

      {/* 3. Featured Examples Curated */}
      <FeaturedExamplesCurated locale={locale} />

      {/* 4. Comparison Cards */}
      <ComparisonCards
        title={messages.homepage.comparison.title}
        subtitle={messages.homepage.comparison.subtitle}
        columnOur={messages.homepage.comparison.columnOur}
        columnGeneric={messages.homepage.comparison.columnGeneric}
        rowGeography={messages.homepage.comparison.rowGeography}
        rowLocalization={messages.homepage.comparison.rowLocalization}
        rowData={messages.homepage.comparison.rowData}
        rowAccessibility={messages.homepage.comparison.rowAccessibility}
        rowContext={messages.homepage.comparison.rowContext}
      />

      {/* 5. Audience Segmentation */}
      <AudienceSegmentation
        locale={locale}
        labels={{
          title: messages.homepage.useCases.title,
          citizens: {
            title: messages.homepage.useCases.citizens.title,
            subtitle: '',
            description: messages.homepage.useCases.citizens.description,
          },
          developers: {
            title: messages.homepage.useCases.developers.title,
            subtitle: '',
            description: messages.homepage.useCases.developers.description,
          },
        }}
      />

      {/* 6. How It Works */}
      <HowItWorksMinimal
        title={messages.homepage.gettingStarted.title}
        step1={messages.homepage.gettingStarted.step1Title}
        step2={messages.homepage.gettingStarted.step2Title}
        step3={messages.homepage.gettingStarted.step3Title}
        stepLabel={locale === 'sr-Cyrl' ? 'Корак' : locale === 'sr-Latn' ? 'Korak' : 'Step'}
      />

      {/* 7. Developer Section */}
      <CodeExamplePanel
        title={messages.homepage.codeExample.title}
        subtitle={messages.homepage.codeExample.subtitle}
        description={messages.homepage.codeExample.description}
        viewOnGithub={messages.homepage.codeExample.viewOnGithub}
        readDocs={messages.homepage.codeExample.readDocs}
        docsUrl={docsUrl}
      />

      {/* 8. Final CTA */}
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
