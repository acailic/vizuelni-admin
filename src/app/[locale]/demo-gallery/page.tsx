import type { Metadata } from 'next';
import { getMessages, resolveLocale } from '@/lib/i18n/messages';
import { demoGalleryExamples } from '@/lib/examples/demo-gallery-examples';
import { DemoGalleryClient } from '@/components/demo-gallery';
import type { Locale } from '@/lib/i18n/config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam) as Locale;

  const titles: Record<Locale, string> = {
    'sr-Cyrl': 'Галерија података Србије – Интерактивне визуализације',
    'sr-Latn': 'Galerija podataka Srbije – Interaktivne vizualizacije',
    en: 'Serbia Data Gallery – Interactive Visualizations',
  };
  const descriptions: Record<Locale, string> = {
    'sr-Cyrl':
      'Откријте 43 интерактивне визуализације из званичних јавних података Србије. Демографија, здравство, економија и више.',
    'sr-Latn':
      'Otkrijte 43 interaktivne vizualizacije iz zvaničnih javnih podataka Srbije. Demografija, zdravstvo, ekonomija i više.',
    en: 'Discover 43 interactive visualizations from official Serbian public data. Demographics, healthcare, economics, and more.',
  };

  return {
    title: titles[locale],
    description: descriptions[locale],
    openGraph: {
      title: titles[locale],
      description: descriptions[locale],
      type: 'website',
    },
  };
}

export default async function DemoGalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const messages = getMessages(locale);

  const text = {
    subtitle:
      locale === 'sr-Cyrl'
        ? 'Откријте визуализације званичних јавних података са јасним изворима, типовима графика и контекстом.'
        : locale === 'sr-Latn'
          ? 'Otkrijte vizualizacije zvaničnih javnih podataka sa jasnim izvorima, tipovima grafika i kontekstom.'
          : 'Discover official public-data visualizations with clear sources, chart types, and context.',
    featuredTitle:
      locale === 'sr-Cyrl'
        ? 'Истакнуте визуализације'
        : locale === 'sr-Latn'
          ? 'Istaknute vizualizacije'
          : 'Featured visualizations',
    featuredDescription:
      locale === 'sr-Cyrl'
        ? 'Препоручени полазни скуп за брзо разумевање Србије кроз јавне податке'
        : locale === 'sr-Latn'
          ? 'Preporučeni početni skup za brzo razumevanje Srbije kroz javne podatke'
          : 'A curated starting set for understanding Serbia through public data',
    preview:
      locale === 'sr-Cyrl'
        ? 'Преглед'
        : locale === 'sr-Latn'
          ? 'Pregled'
          : 'Preview',
    open:
      locale === 'sr-Cyrl'
        ? 'Отвори'
        : locale === 'sr-Latn'
          ? 'Otvori'
          : 'Open',
    embed:
      locale === 'sr-Cyrl'
        ? 'Угради'
        : locale === 'sr-Latn'
          ? 'Ugradi'
          : 'Embed',
    embedCopied:
      locale === 'sr-Cyrl'
        ? 'Копирано'
        : locale === 'sr-Latn'
          ? 'Kopirano'
          : 'Copied',
    previewFailed:
      locale === 'sr-Cyrl'
        ? 'Преглед није могао да се прикаже'
        : locale === 'sr-Latn'
          ? 'Pregled nije mogao da se prikaže'
          : 'Preview could not be rendered',
    statsTotal:
      locale === 'sr-Cyrl'
        ? 'Визуализације укупно'
        : locale === 'sr-Latn'
          ? 'Vizualizacije ukupno'
          : 'Total visualizations',
    statsShown:
      locale === 'sr-Cyrl'
        ? 'Приказане'
        : locale === 'sr-Latn'
          ? 'Prikazane'
          : 'Shown',
    statsCategory:
      locale === 'sr-Cyrl'
        ? 'Категорија'
        : locale === 'sr-Latn'
          ? 'Kategorija'
          : 'Category',
    statsTrust:
      locale === 'sr-Cyrl'
        ? 'Поверење'
        : locale === 'sr-Latn'
          ? 'Poverenje'
          : 'Trust',
    statsTrustValue:
      locale === 'sr-Cyrl'
        ? 'Званични јавни извори'
        : locale === 'sr-Latn'
          ? 'Zvanični javni izvori'
          : 'Official public sources',
    controlsTitle:
      locale === 'sr-Cyrl'
        ? 'Претраживање и филтери'
        : locale === 'sr-Latn'
          ? 'Pretraga i filteri'
          : 'Search and filters',
    categoryHeading:
      locale === 'sr-Cyrl'
        ? 'Категорије'
        : locale === 'sr-Latn'
          ? 'Kategorije'
          : 'Categories',
    sortByLabel:
      locale === 'sr-Cyrl'
        ? 'Сортирај по:'
        : locale === 'sr-Latn'
          ? 'Sortiraj po:'
          : 'Sort by:',
    sortRecommended:
      locale === 'sr-Cyrl'
        ? 'Препоручено'
        : locale === 'sr-Latn'
          ? 'Preporučeno'
          : 'Recommended',
    sortNewest:
      locale === 'sr-Cyrl'
        ? 'Најновије'
        : locale === 'sr-Latn'
          ? 'Najnovije'
          : 'Newest',
    sortPopular:
      locale === 'sr-Cyrl'
        ? 'Популарно'
        : locale === 'sr-Latn'
          ? 'Popularno'
          : 'Popular',
    sortAlphabetical:
      locale === 'sr-Cyrl'
        ? 'По називу'
        : locale === 'sr-Latn'
          ? 'Po nazivu'
          : 'By name',
    searchPlaceholder:
      locale === 'sr-Cyrl'
        ? 'Претражите по наслову, теми, извору или кључној речи'
        : locale === 'sr-Latn'
          ? 'Pretražite po naslovu, temi, izvoru ili ključnoj reči'
          : 'Search by title, topic, source, or keyword',
    metadataLabel:
      locale === 'sr-Cyrl'
        ? 'Метаподаци визуализације'
        : locale === 'sr-Latn'
          ? 'Metapodaci vizualizacije'
          : 'Visualization metadata',
    officialLabel:
      locale === 'sr-Cyrl'
        ? 'Званично'
        : locale === 'sr-Latn'
          ? 'Zvanično'
          : 'Official',
    trustedSourceLabel:
      locale === 'sr-Cyrl'
        ? 'Проверен извор'
        : locale === 'sr-Latn'
          ? 'Proveren izvor'
          : 'Trusted source',
    updatedLabel:
      locale === 'sr-Cyrl'
        ? 'Ажурирано'
        : locale === 'sr-Latn'
          ? 'Ažurirano'
          : 'Updated',
    initialViewData:
      locale === 'sr-Cyrl'
        ? 'Отвори податке'
        : locale === 'sr-Latn'
          ? 'Otvori podatke'
          : 'Open data',
    initialViewCode:
      locale === 'sr-Cyrl'
        ? 'Отвори код'
        : locale === 'sr-Latn'
          ? 'Otvori kod'
          : 'Open code',
  };

  return (
    <main className='container-custom py-8'>
      <DemoGalleryClient
        examples={demoGalleryExamples}
        locale={locale}
        labels={{
          title: messages.demoGallery?.title ?? 'Serbia Data Gallery',
          subtitle: text.subtitle,
          resultsSectionTitle:
            messages.demoGallery?.resultsSectionTitle ??
            'Available visualizations',
          resultsSummaryAll:
            messages.demoGallery?.resultsSummaryAll ??
            '{{count}} visualizations available',
          resultsSummaryFiltered:
            messages.demoGallery?.resultsSummaryFiltered ??
            '{{count}} visualizations in {{category}}',
          empty: messages.demoGallery?.empty ?? 'No examples in this category',
          openExample: messages.demoGallery?.openExample ?? 'Open example',
          preview: text.preview,
          open: text.open,
          embed: text.embed,
          embedCopied: text.embedCopied,
          previewLoading:
            messages.demoGallery?.previewLoading ?? 'Loading preview…',
          previewUnavailable:
            messages.demoGallery?.previewUnavailable ?? 'Preview unavailable',
          previewFailed: text.previewFailed,
          categories: messages.demoGallery?.categories ?? {},
          featuredTitle: text.featuredTitle,
          featuredDescription: text.featuredDescription,
          statsTotal: text.statsTotal,
          statsShown: text.statsShown,
          statsCategory: text.statsCategory,
          statsTrust: text.statsTrust,
          statsTrustValue: text.statsTrustValue,
          controlsTitle: text.controlsTitle,
          categoryHeading: text.categoryHeading,
          sortByLabel: text.sortByLabel,
          sortRecommended: text.sortRecommended,
          searchPlaceholder: text.searchPlaceholder,
          sortNewest: text.sortNewest,
          sortPopular: text.sortPopular,
          sortAlphabetical: text.sortAlphabetical,
          metadataLabel: text.metadataLabel,
          officialLabel: text.officialLabel,
          trustedSourceLabel: text.trustedSourceLabel,
          updatedLabel: text.updatedLabel,
          modal: {
            close: messages.demoGallery?.modal?.close ?? 'Close',
            viewData: messages.demoGallery?.modal?.viewData ?? 'View Data',
            hideData: messages.demoGallery?.modal?.hideData ?? 'Hide Data',
            showingRows:
              messages.demoGallery?.modal?.showingRows ??
              'Showing first {{shown}} of {{total}} rows',
            tableCaption:
              messages.demoGallery?.modal?.tableCaption ??
              'Sample data preview for {{title}}',
            initialViewData: text.initialViewData,
            initialViewCode: text.initialViewCode,
          },
        }}
      />
    </main>
  );
}
