'use client';

import Link from 'next/link';
import {
  BarChart3,
  LineChart,
  PieChart,
  Filter,
  Map,
  Share2,
  Search,
  ArrowRight,
  Lock,
  Globe,
} from 'lucide-react';
import type { Locale } from '@/lib/i18n/config';

interface DemoPageClientProps {
  locale: Locale;
  translations: Record<string, string>;
}

export default function DemoPageClient({
  locale,
  translations,
}: DemoPageClientProps) {
  const t = (key: string, fallback: string) => translations[key] || fallback;

  return (
    <div className='min-h-screen bg-slate-50'>
      {/* Hero Section */}
      <section className='bg-gradient-to-br from-[#0C1E42] to-[#1a3a6e] text-white py-20'>
        <div className='container mx-auto px-4'>
          <div className='max-w-3xl mx-auto text-center'>
            <h1 className='text-4xl md:text-5xl font-bold mb-6'>
              {t('title', 'Vizuelni Admin Srbije')}
            </h1>
            <p className='text-xl text-white/90 mb-8'>
              {t(
                'subtitle',
                'Interactive visualizations of Serbian government data'
              )}
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link
                href={`/${locale}/browse`}
                className='inline-flex items-center justify-center gap-2 bg-white text-[#0C1E42] px-6 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-colors'
              >
                <Search className='h-5 w-5' />
                {t('hero.browse', 'Прегледај податке')}
              </Link>
              <Link
                href={`/${locale}/create`}
                className='inline-flex items-center justify-center gap-2 bg-[#C6363C] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#a62d32] transition-colors'
              >
                <BarChart3 className='h-5 w-5' />
                {t('hero.create', 'Креирај график')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-16 bg-white'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center mb-12 text-[#0C1E42]'>
            {t('features.title', 'Могућности платформе')}
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            <FeatureCard
              icon={<BarChart3 className='h-6 w-6' />}
              title={t('features.chartTypes', 'Разне врсте графикона')}
              description={t(
                'features.chartTypesDesc',
                'Подршка за преко 8 врста графикона: линијски, стубасти, питасте, мапе и више'
              )}
            />
            <FeatureCard
              icon={<Filter className='h-6 w-6' />}
              title={t('features.interactive', 'Интерактивни филтери')}
              description={t(
                'features.interactiveDesc',
                'Филтрирање и анотације у реалном времену'
              )}
            />
            <FeatureCard
              icon={<Map className='h-6 w-6' />}
              title={t('features.maps', 'Географске мапе')}
              description={t(
                'features.mapsDesc',
                'Визуелизација података на мапама Србије'
              )}
            />
            <FeatureCard
              icon={<Share2 className='h-6 w-6' />}
              title={t('features.share', 'Дељење и уградња')}
              description={t(
                'features.shareDesc',
                'Делите графиконе или их уградите на друге сајтове'
              )}
            />
            <FeatureCard
              icon={<Lock className='h-6 w-6' />}
              title={t('features.secure', 'Сигурност')}
              description={t(
                'features.secureDesc',
                'Безбедна аутентификација и управљање подацима'
              )}
            />
            <FeatureCard
              icon={<Globe className='h-6 w-6' />}
              title={t('features.i18n', 'Вишејезичност')}
              description={t(
                'features.i18nDesc',
                'Подршка за српски ћирилицу, латиницу и енглески'
              )}
            />
          </div>
        </div>
      </section>

      {/* Chart Types Preview */}
      <section className='py-16 bg-slate-100'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center mb-4 text-[#0C1E42]'>
            {t('charts.title', 'Преглед типова графикона')}
          </h2>
          <p className='text-center text-slate-600 mb-12 max-w-2xl mx-auto'>
            {t(
              'charts.subtitle',
              'Истражите разне начине визуелизације ваших података'
            )}
          </p>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <ChartPreviewCard
              icon={<LineChart className='h-8 w-8' />}
              title={t('charts.line', 'Линијски графикони')}
              description={t(
                'charts.lineDesc',
                'Идеални за временске серије и трендове'
              )}
              locale={locale}
            />
            <ChartPreviewCard
              icon={<BarChart3 className='h-8 w-8' />}
              title={t('charts.bar', 'Стубасти графикони')}
              description={t(
                'charts.barDesc',
                'Перфектни за поређење категорија'
              )}
              locale={locale}
            />
            <ChartPreviewCard
              icon={<PieChart className='h-8 w-8' />}
              title={t('charts.pie', 'Питасти графикони')}
              description={t('charts.pieDesc', 'Приказ пропорција и удела')}
              locale={locale}
            />
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section className='py-16 bg-white'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center mb-12 text-[#0C1E42]'>
            {t('gettingStarted.title', 'Како почети?')}
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto'>
            <StepCard
              number='1'
              title={t('gettingStarted.step1', 'Изаберите податке')}
              description={t(
                'gettingStarted.step1Desc',
                'Прегледајте доступне скупове података или отпремите сопствене'
              )}
            />
            <StepCard
              number='2'
              title={t('gettingStarted.step2', 'Конфигуришите график')}
              description={t(
                'gettingStarted.step2Desc',
                'Изаберите тип графикона и подесите параметре'
              )}
            />
            <StepCard
              number='3'
              title={t('gettingStarted.step3', 'Поделите')}
              description={t(
                'gettingStarted.step3Desc',
                'Сачувајте и поделите своју визуелизацију'
              )}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-16 bg-gradient-to-r from-[#C6363C] to-[#a62d32] text-white'>
        <div className='container mx-auto px-4 text-center'>
          <h2 className='text-3xl font-bold mb-4'>
            {t('cta.title', 'Спремни сте да почнете?')}
          </h2>
          <p className='text-xl text-white/90 mb-8 max-w-2xl mx-auto'>
            {t(
              'cta.description',
              'Креирајте своју прву визуелизацију за мање од 5 минута'
            )}
          </p>
          <Link
            href={`/${locale}/create`}
            className='inline-flex items-center gap-2 bg-white text-[#C6363C] px-8 py-4 rounded-lg font-semibold hover:bg-slate-100 transition-colors text-lg'
          >
            {t('cta.button', 'Креирај график')}
            <ArrowRight className='h-5 w-5' />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-[#0C1E42] text-white py-8'>
        <div className='container mx-auto px-4 text-center'>
          <p className='text-sm text-slate-400'>
            {t(
              'footer.poweredBy',
              'Покреће Визуелни Административни Подаци Србије'
            )}
          </p>
          <p className='text-xs text-slate-500 mt-2'>
            {t('footer.opensource', 'Отворени изворни код')}
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className='p-6 rounded-xl border border-slate-200 bg-white hover:border-[#0C1E42] hover:shadow-lg transition-all group'>
      <div className='w-12 h-12 bg-[#0C1E42]/10 rounded-lg flex items-center justify-center mb-4 text-[#0C1E42] group-hover:bg-[#0C1E42] group-hover:text-white transition-colors'>
        {icon}
      </div>
      <h3 className='font-semibold text-lg text-[#0C1E42] mb-2'>{title}</h3>
      <p className='text-slate-600'>{description}</p>
    </div>
  );
}

function ChartPreviewCard({
  icon,
  title,
  description,
  locale,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  locale: string;
}) {
  return (
    <div className='p-6 rounded-xl bg-white shadow-md hover:shadow-xl transition-shadow'>
      <div className='w-16 h-16 bg-[#C6363C]/10 rounded-full flex items-center justify-center mb-4 text-[#C6363C] mx-auto'>
        {icon}
      </div>
      <h3 className='font-semibold text-lg text-[#0C1E42] mb-2 text-center'>
        {title}
      </h3>
      <p className='text-slate-600 text-center mb-4'>{description}</p>
      <Link
        href={`/${locale}/create`}
        className='block text-center text-[#C6363C] hover:text-[#a62d32] font-medium'
      >
        {locale === 'en' ? 'Try it →' : 'Испробај →'}
      </Link>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className='text-center'>
      <div className='w-12 h-12 bg-[#C6363C] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4'>
        {number}
      </div>
      <h3 className='font-semibold text-lg text-[#0C1E42] mb-2'>{title}</h3>
      <p className='text-slate-600'>{description}</p>
    </div>
  );
}
