'use client';

import { useState } from 'react';
import { KPICard } from '@/components/analytics/KPICard';
import { YearSelector } from '@/components/analytics/YearSelector';
import { DomainTabs } from '@/components/analytics/DomainTabs';
import { YearComparisonPanel } from '@/components/analytics/YearComparisonPanel';
import { AnalyticsMapPanel } from '@/components/analytics/AnalyticsMapPanel';
import { MetricRankingTable } from '@/components/analytics/MetricRankingTable';
import {
  ANALYTICS_DOMAINS,
  AVAILABLE_YEARS,
  KPI_METRICS,
  getDatasetForYear,
} from '@/lib/analytics/curated-data';
import type { DomainId } from '@/lib/analytics/types';
import type { Locale } from '@/lib/i18n/config';

interface AnalyticsMessages {
  title: string;
  subtitle: string;
  yearA: string;
  yearB: string;
  domains: Record<DomainId, string>;
  kpi: Record<string, string>;
  chart: { title: string; mapTitle: string };
  table: { rank: string; region: string; delta: string };
}

interface AnalyticsDashboardProps {
  locale: Locale;
  messages: AnalyticsMessages;
}

export function AnalyticsDashboard({ locale, messages }: AnalyticsDashboardProps) {
  const [yearA, setYearA] = useState(2022);
  const [yearB, setYearB] = useState(2023);
  const [activeDomain, setActiveDomain] = useState<DomainId>('demographics');

  const domain = ANALYTICS_DOMAINS.find((d) => d.id === activeDomain)!;
  const datasetA = getDatasetForYear(domain, yearA)!;
  const datasetB = getDatasetForYear(domain, yearB)!;

  return (
    <div className='container-custom space-y-6 py-6'>
      {/* Page header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
        <div>
          <h1 className='font-display text-2xl font-bold text-slate-900'>
            {messages.title}
          </h1>
          <p className='mt-1 text-sm text-slate-500'>{messages.subtitle}</p>
        </div>
        <YearSelector
          labelA={messages.yearA}
          labelB={messages.yearB}
          yearA={yearA}
          yearB={yearB}
          years={AVAILABLE_YEARS}
          onYearAChange={setYearA}
          onYearBChange={setYearB}
        />
      </div>

      {/* KPI strip */}
      <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
        {KPI_METRICS.map((kpi) => (
          <KPICard
            key={kpi.key}
            label={messages.kpi[kpi.key] ?? kpi.label}
            value={kpi.value}
            previousValue={kpi.previousValue}
            unit={kpi.unit}
            currentYear={kpi.currentYear}
            previousYear={kpi.previousYear}
          />
        ))}
      </div>

      {/* Domain tabs */}
      <DomainTabs
        active={activeDomain}
        labels={messages.domains}
        onChange={setActiveDomain}
      />

      {/* Split panel: chart + map */}
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-5'>
        <div
          className='rounded-xl border border-slate-200 bg-white p-4 lg:col-span-3'
          style={{ minHeight: 380 }}
        >
          <YearComparisonPanel
            datasetA={datasetA}
            datasetB={datasetB}
            metricLabel={domain.metricLabel}
            unit={domain.unit}
            locale={locale}
            title={messages.chart.title}
          />
        </div>

        <div
          className='rounded-xl border border-slate-200 bg-white p-4 lg:col-span-2'
          style={{ minHeight: 380 }}
        >
          <AnalyticsMapPanel
            dataset={datasetB}
            metricLabel={domain.metricLabel}
            unit={domain.unit}
            locale={locale}
            title={messages.chart.mapTitle}
          />
        </div>
      </div>

      {/* Ranking table */}
      <MetricRankingTable
        datasetA={datasetA}
        datasetB={datasetB}
        unit={domain.unit}
        locale={locale}
        labels={{
          rank: messages.table.rank,
          region: messages.table.region,
          delta: messages.table.delta,
        }}
      />
    </div>
  );
}
