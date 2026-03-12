import { FeaturedExamples, GettingStartedGuide, HeroSection, QuickStats } from '@/components/home'
import { getMessages, resolveLocale } from '@/lib/i18n/messages'

export default function LocaleHomePage({ params }: { params: { locale: string } }) {
  const locale = resolveLocale(params.locale)
  const messages = getMessages(locale)

  return (
    <main className="container-custom py-16">
      {/* Hero Section */}
      <HeroSection
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
  )
}
