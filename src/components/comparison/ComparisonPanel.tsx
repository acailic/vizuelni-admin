'use client';

import React, { useState } from 'react';
import { YearOverYearChart } from './YearOverYearChart';
import { MunicipalCompareChart } from './MunicipalCompareChart';
import { YearOverYearData, MunicipalCompareData } from '@/lib/comparison/types';

type ComparisonMode = 'year-over-year' | 'municipality';

interface ComparisonPanelProps {
  yearOverYearData?: YearOverYearData[];
  municipalData?: MunicipalCompareData[];
  baseYear?: number;
  compareYear?: number;
  locale?: 'en' | 'sr' | 'srLat';
  onModeChange?: (mode: ComparisonMode) => void;
}

/**
 * Main Comparison Panel
 * Switch between year-over-year and municipality comparison modes
 */
export function ComparisonPanel({
  yearOverYearData = [],
  municipalData = [],
  baseYear = 2020,
  compareYear = 2024,
  locale = 'srLat',
  onModeChange,
}: ComparisonPanelProps) {
  const [mode, setMode] = useState<ComparisonMode>('year-over-year');

  const handleModeChange = (newMode: ComparisonMode) => {
    setMode(newMode);
    onModeChange?.(newMode);
  };

  const labels = {
    en: {
      yearOverYear: 'Year-over-Year',
      municipality: 'Municipality Compare',
      selectMode: 'Select comparison mode',
    },
    sr: {
      yearOverYear: 'Годишње упоређење',
      municipality: 'Упоређење општина',
      selectMode: 'Изаберите режим упоређивања',
    },
    srLat: {
      yearOverYear: 'Godišnje upoređenje',
      municipality: 'Upoređenje opština',
      selectMode: 'Izaberite režim upoređivanja',
    },
  };

  const t = labels[locale];

  return (
    <div className='comparison-panel'>
      {/* Mode selector */}
      <div className='flex gap-2 mb-4'>
        <button
          onClick={() => handleModeChange('year-over-year')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'year-over-year'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {t.yearOverYear}
        </button>
        <button
          onClick={() => handleModeChange('municipality')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'municipality'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {t.municipality}
        </button>
      </div>

      {/* Content */}
      <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4'>
        {mode === 'year-over-year' && yearOverYearData.length > 0 && (
          <YearOverYearChart
            data={yearOverYearData}
            baseYear={baseYear}
            compareYear={compareYear}
            locale={locale}
          />
        )}

        {mode === 'municipality' && municipalData.length > 0 && (
          <MunicipalCompareChart data={municipalData} locale={locale} />
        )}

        {mode === 'year-over-year' && yearOverYearData.length === 0 && (
          <div className='text-center py-8 text-gray-500'>
            {locale === 'en'
              ? 'No year-over-year data available'
              : locale === 'sr'
                ? 'Нема података за годишње упоређење'
                : 'Nema podataka za godišnje upoređenje'}
          </div>
        )}

        {mode === 'municipality' && municipalData.length === 0 && (
          <div className='text-center py-8 text-gray-500'>
            {locale === 'en'
              ? 'No municipality data available'
              : locale === 'sr'
                ? 'Нема података за упоређење општина'
                : 'Nema podataka za upoređenje opština'}
          </div>
        )}
      </div>
    </div>
  );
}

export default ComparisonPanel;
