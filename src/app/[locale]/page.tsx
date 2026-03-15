import {
  FeaturedExamples,
  GettingStartedGuide,
  HeroSectionAnimated,
  QuickStats,
} from '@/components/home';
import { ShowcaseGrid } from '@/components/showcase';
import { getFeaturedExamples } from '@/lib/examples/showcase-examples';
import { getMessages, resolveLocale } from '@/lib/i18n/messages';

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const messages = getMessages(locale);
  const showcaseExamples = getFeaturedExamples();

  return (
    <main className='container-custom py-16'>
      {/* Animated Hero Section */}
      <HeroSectionAnimated
        locale={locale}
        title={messages.homepage.hero.title}
        subtitle={messages.homepage.hero.subtitle}
        primaryCta={messages.homepage.hero.browseCta}
        secondaryCta={messages.homepage.hero.createCta}
      />

      {/* Quick Stats Section */}
      <QuickStats
        datasetsLabel={messages.homepage.stats.datasets}
        chartsLabel={messages.homepage.stats.charts}
        usersLabel={messages.homepage.stats.users}
      />

      {/* Featured Examples Section */}
      <FeaturedExamples locale={locale} />

      {/* Chart Showcase Gallery */}
      <section className='py-12'>
        <div className='mb-8'>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
            {locale === 'sr-Cyrl'
              ? 'Истражите податке'
              : locale === 'sr-Latn'
                ? 'Istražite podatke'
                : 'Explore Data'}
          </h2>
          <p className='text-gray-600 dark:text-gray-400'>
            {locale === 'sr-Cyrl'
              ? 'Визуелизације из званичних извора Србије'
              : locale === 'sr-Latn'
                ? 'Vizuelizacije iz zvaničnih izvora Srbije'
                : 'Visualizations from Serbian government data'}
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

      {/* Getting Started Guide */}
      <GettingStartedGuide
        sectionTitle={messages.homepage.gettingStarted.title}
        step1Title={messages.homepage.gettingStarted.step1Title}
        step1Description={messages.homepage.gettingStarted.step1Description}
        step2Title={messages.homepage.gettingStarted.step2Title}
        step2Description={messages.homepage.gettingStarted.step2Description}
        step3Title={messages.homepage.gettingStarted.step3Title}
        step3Description={messages.homepage.gettingStarted.step3Description}
      />
    </main>
  );
}
