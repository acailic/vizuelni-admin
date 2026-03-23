import type { Metadata } from 'next';
import { resolveLocale } from '@/lib/i18n/messages';
import type { Locale } from '@/lib/i18n/config';
import LiveDataDemoClient from './page.client';

export async function generateStaticParams() {
  return [{ locale: 'sr-Cyrl' }, { locale: 'sr-Latn' }, { locale: 'en' }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const copy = getPageCopy(locale);

  return {
    title: `${copy.title} | Vizuelni Admin Srbije`,
    description: copy.subtitle,
  };
}

export default async function LiveDataDemoPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const copy = getPageCopy(locale);

  return (
    <LiveDataDemoClient
      locale={locale}
      translations={{
        title: copy.title,
        subtitle: copy.subtitle,
        // Panel titles
        panelDatasetPicker: copy.panelDatasetPicker,
        panelMetadata: copy.panelMetadata,
        panelRawPreview: copy.panelRawPreview,
        panelSchema: copy.panelSchema,
        panelChartOutput: copy.panelChartOutput,
        panelCode: copy.panelCode,
        // Placeholder content
        placeholderDatasetPicker: copy.placeholderDatasetPicker,
        placeholderMetadata: copy.placeholderMetadata,
        placeholderRawPreview: copy.placeholderRawPreview,
        placeholderSchema: copy.placeholderSchema,
        placeholderChartOutput: copy.placeholderChartOutput,
        placeholderCode: copy.placeholderCode,
      }}
    />
  );
}

function getPageCopy(locale: Locale) {
  switch (locale) {
    case 'sr-Cyrl':
      return {
        title: 'Жива веза са data.gov.rs',
        subtitle:
          'Погледајте како претворити скуп података са data.gov.rs у интерактивну визуелизацију',
        panelDatasetPicker: 'Изаберите скуп података',
        panelMetadata: 'Метаподаци скупа података',
        panelRawPreview: 'Сирови приказ података',
        panelSchema: 'Парсирани опис података',
        panelChartOutput: 'Излаз графикона',
        panelCode: 'Копирај код',
        placeholderDatasetPicker:
          'Овде ће се појавити 3 картице са избором скупова података.',
        placeholderMetadata:
          'Метаподаци изабраног скупа података ће се овде приказати.',
        placeholderRawPreview:
          'Првих неколико редова CSV/JSON података ће бити приказано овде.',
        placeholderSchema:
          'Аутоматски откривене колоне и типови података ће бити приказани овде.',
        placeholderChartOutput:
          'Графикон генерисан из података ће бити приказан овде.',
        placeholderCode:
          'Код за репликовање ове визуелизације ће бити доступан овде.',
      };
    case 'sr-Latn':
      return {
        title: 'Živa veza sa data.gov.rs',
        subtitle:
          'Pogledajte kako pretvoriti skup podataka sa data.gov.rs u interaktivnu vizuelizaciju',
        panelDatasetPicker: 'Izaberite skup podataka',
        panelMetadata: 'Metapodaci skupa podataka',
        panelRawPreview: 'Sirovi prikaz podataka',
        panelSchema: 'Parsirani opis podataka',
        panelChartOutput: 'Izlaz grafikona',
        panelCode: 'Kopiraj kod',
        placeholderDatasetPicker:
          'Ovde će se pojaviti 3 kartice sa izborom skupova podataka.',
        placeholderMetadata:
          'Metapodaci izabranog skupa podataka će se ovde prikazati.',
        placeholderRawPreview:
          'Prvih nekoliko redova CSV/JSON podataka će biti prikazano ovde.',
        placeholderSchema:
          'Automatski otkrivene kolone i tipovi podataka će biti prikazani ovde.',
        placeholderChartOutput:
          'Grafikon generisan iz podataka će biti prikazan ovde.',
        placeholderCode:
          'Kod za replikovanje ove vizuelizacije će biti dostupan ovde.',
      };
    default:
      return {
        title: 'Live Data.gov.rs Demo',
        subtitle:
          'See how to transform a dataset from data.gov.rs into an interactive visualization',
        panelDatasetPicker: 'Select Dataset',
        panelMetadata: 'Dataset Metadata',
        panelRawPreview: 'Raw Data Preview',
        panelSchema: 'Parsed Data Schema',
        panelChartOutput: 'Chart Output',
        panelCode: 'Copy Code',
        placeholderDatasetPicker:
          'Three dataset selection cards will appear here.',
        placeholderMetadata: 'Metadata for the selected dataset will be shown here.',
        placeholderRawPreview:
          'The first few rows of CSV/JSON data will be displayed here.',
        placeholderSchema:
          'Automatically detected columns and data types will be shown here.',
        placeholderChartOutput:
          'A chart generated from the data will be rendered here.',
        placeholderCode:
          'Code to replicate this visualization will be available here.',
      };
  }
}
