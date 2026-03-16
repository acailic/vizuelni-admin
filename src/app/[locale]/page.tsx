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

      {/* Quick Stats Section */}
      <QuickStats
        datasetsLabel={messages.homepage.stats.datasets}
        chartsLabel={messages.homepage.stats.charts}
        usersLabel={messages.homepage.stats.users}
      />

      {/* Solution Showcase Section */}
      <FeaturedExamples locale={locale} />

      {/* Live Examples Gallery */}
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

      {/* Getting Started Guide */}
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
    </main>
  );
}
