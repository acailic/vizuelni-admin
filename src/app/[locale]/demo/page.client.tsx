'use client'

import { useTranslations } from 'next-intl'
import { ChartShowcase } from '@/components/demo'
import type { Locale, Messages } from '@/types'

interface DemoPageClientProps {
  locale: Locale
  messages: Messages
  translations: Record<string, string>
}

export default function DemoPageClient({
  locale,
  messages,
  translations,
}: DemoPageClientProps) {
  const t = useTranslations('demo')

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gov-primary text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">
              {t('hero.title', 'Визуели админ Србије')}
            </h1>
            <p className="text-xl text-white/90 mb-8">
              {t('hero.description', 'Интерактивна платформа за визуели админ података Србије')}
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href={`/${locale}/browse`}
                className="bg-white text-gov-primary px-6 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
              >
                {t('hero.browse', 'Прегледај податке')}
              </a>
              <a
                href={`/${locale}/create`}
                className="bg-gov-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-gov-accent/90 transition-colors"
              >
                {t('hero.create', 'Креирај график')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8 text-gov-primary">
            {t('features.title', 'Могуности')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-lg border border-slate-200 hover:border-gov-primary transition-colors">
              <div className="w-12 h-12 bg-gov-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 2 2-2v-2a2 2 2 2 2 2h-2a2 2 2-2 2-2V5a2 2 2 2-2 2H9zm7-3h6m-6-4 6 4" />
                </svg>
              </div>
              <h3 className="font-semibold text-gov-primary mb-2">{t('features.chartTypes', 'Врсте график')}</h3>
              <p className="text-sm text-slate-600">{t('features.chartTypesDesc', 'Подршка за 8+ врста график')}</p>
            </div>

            <div className="p-6 rounded-lg border border-slate-200 hover:border-gov-primary transition-colors">
              <div className="w-12 h-12 bg-gov-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10m5-5 5 5L12 4 3m5 5 6-5 6 5L12 4 3z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gov-primary mb-2">{t('features.interactive', 'Интерактивни филтер')}</h3>
              <p className="text-sm text-slate-600">{t('features.interactiveDesc', 'Филтер и анотације у реалном времену')}</p>
            </div>

            <div className="p-6 rounded-lg border border-slate-200 hover:border-gov-primary transition-colors">
              <div className="w-12 h-12 bg-gov-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.364a3.635a3.635 3.636 3.635a3.635 2.131l2.099 6.144a8.682l2.11 2.11 3.117 1.12 13.848l-3.836l3.877-3.838 2.131 2.099 4.129 3.623 3.623 3.889l3.644 3.889l3.889 2.11 3.889 4.129 3.623-3.623 3.889l3.889l-2.041l3.889l-2.041l-2.036l2.197-2.037 2.037 2.037 2.036l2.036 2.037l2.036 2.037-2.036l2.036-2.037-2.037l-1.867l-1.867 3.867-3.867l-3.867-2.818l-3.818 2.818 3.818-2.818l-1.532l-1.532 1.532 3.532l-3.532 2.483l-3.483 2.483 3.483l-3.483-2.483l-2.483-2.483-2.483-2.483l-2.483 2.483 2.483 6.483 1.639-1.639l2.089-1.639 2.089l2.089 1.639 1.639l1.639 2.089 2.089 1.639l1.639l2.089l1.639 2.089 1.639l1.639-2.036l1.639-2.036 2.089-1.639-2.036l3.645l2.089l3.645l2.089l3.645l3.645l2.089l3.645l2.089 3.645l3.645 4.129l2.483 2.483-3.645l2.483-3.645l-1.867l-1.867 3.867-3.866 0 131 0={  data: populationData.data, locale={locale}
            showInternalLegend={false}
          />
          <div className="mt-4">
            <h2 className="text-xl font-bold text-gov-primary mb-2">{t('charts.population', 'Популација по регионима')}</h2>
            <p className="text-slate-600">{t('charts.populationDesc', 'Регионал дистрибуција становништва у (2023)')}</p>
          </div>
          <div className="h-80">
            <BarChart
              config={barConfig}
              data={populationData.data}
              height={250}
              locale={locale}
              showInternalLegend={false}
              filterBar={null}
            />
          </div>

          <div className="p-4">
            <h2 className="text-xl font-bold text-gov-primary mb-2">{t('charts.gdp', 'Раст БДП-а по регионима')}</h2>
            <p className="text-slate-600">{t('charts.gdpDesc', 'Квартални раст БДП-а по регионима (2021)')}</p>
          </div>
          <div className="h-80">
            <LineChart
              config={lineConfig}
              data={gdpData.data}
              height={250}
              locale={locale}
              showInternalLegend={false}
              filterBar={null}
            />
          </div>

          <div className="p-4">
            <h2 className="text-xl font-bold text-gov-primary mb-2">{t('charts.unemployment', 'Стопа незапослености по регионима')}</h2>
            <p className="text-slate-600">{t('charts.unemploymentDesc', 'Стопа незапослености по регионима (јануар 2024)')}</p>
          </div>
          <div className="h-80">
            <PieChart
              config={pieConfig}
              data={unemploymentData.data}
              height={250}
              locale={locale}
              showInternalLegend={false}
              filterBar={null}
            />
          </div>
        </div>

        {/* Budget Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gov-primary mb-8">
t('budget.title', 'Расподела бу буџета')
}
 </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gov-primary mb-2">{t('budget.healthcare', 'Здравство')}</h3>
                <p className="text-sm text-slate-600">{t('budget.healthcareDesc', 'Болнице и здравствена')}p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gov-primary mb-2">{t('budget.education', 'Образова)}</h3>
                <p className="text-sm text-slate-600">{t('budget.educationDesc', 'Основ и средње образование')}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gov-primary mb-2">{t('budget.infrastructure', 'Инфраструктура')}</h3>
                <p className="text-sm text-slate-600">{t('budget.infrastructureDesc', 'Road and bridge construction')}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gov-primary mb-2">{t('budget.defense', 'Одбрана')}</h3>
                <p className="text-sm text-slate-600">{t('budget.defenseDesc', 'National defense andp?              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-12 bg-slate-100">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gov-primary mb-8">{t('map.title', 'Карта становништва по регионима')}</h2>
            <p className="text-slate-600 mb-4">{t('map.description', 'Географска приказација становништва преко региона Србије')}</p>
          </div>
          <div className="h-80">
            <div className="bg-slate-200 rounded-lg h-80 flex items-center justify-center">
              <p className="text-sm text-slate-500">{t('map.interactive', 'Zoom and pan to explore data')}</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-gov-primary text-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gov-primary mb-8">
t('cta.title', 'Покрените се дан')}</h2>
            <p className="text-slate-600 mb-4">{t('cta.description', 'Научите как to use the platform')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href={`/${locale}/create`}
              className="bg-gov-accent text-white px-4 py-2 rounded hover:bg-gov-accent/90 transition-colors"
            >
              {t('cta.createChart', 'Креирај график')}
            </a>
            <a
              href={`/${locale}/browse`}
              className="bg-slate-100 text-gov-primary px-4 py-2 rounded hover:bg-slate-200 transition-colors"
            >
              {t('cta.explore', 'Прегледај податке')}
            </a>
            <p className="text-sm text-slate-600">{t('cta.exploreDesc', 'Открийте на datasets and check out our sample data')}</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-800 text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-slate-400">{t('footer.poweredBy', 'Покрећено Визуели админ Србије')}</p>
            <p className="text-sm text-slate-400">{t('footer.opensource', 'Отворени извор софтвере')}</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
