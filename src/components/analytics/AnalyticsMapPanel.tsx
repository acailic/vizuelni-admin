'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import type { FeatureCollection, Feature, Geometry } from 'geojson';
import type { YearDataset } from '@/lib/analytics/types';
import type { Locale } from '@/lib/i18n/config';

interface DistrictProperties {
  id: string;
  code: string;
  name_en: string;
  name_sr_cyrl: string;
  name_sr_latn: string;
}

type DistrictFeature = Feature<Geometry, DistrictProperties>;
type DistrictCollection = FeatureCollection<Geometry, DistrictProperties>;

interface AnalyticsMapPanelProps {
  dataset: YearDataset;
  metricLabel: string;
  unit: string;
  locale: Locale;
  title: string;
}

function getLocalizedName(props: DistrictProperties, locale: Locale): string {
  if (locale === 'sr-Cyrl') return props.name_sr_cyrl;
  if (locale === 'sr-Latn') return props.name_sr_latn;
  return props.name_en;
}

function lerpColor(from: string, to: string, t: number): string {
  const h = (s: string) => parseInt(s, 16);
  const fr = h(from.slice(1, 3)),
    fg = h(from.slice(3, 5)),
    fb = h(from.slice(5, 7));
  const tr = h(to.slice(1, 3)),
    tg = h(to.slice(3, 5)),
    tb = h(to.slice(5, 7));
  return `rgb(${Math.round(fr + (tr - fr) * t)},${Math.round(fg + (tg - fg) * t)},${Math.round(fb + (tb - fb) * t)})`;
}

export function AnalyticsMapPanel({
  dataset,
  metricLabel,
  unit,
  locale,
  title,
}: AnalyticsMapPanelProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [geoData, setGeoData] = useState<DistrictCollection | null>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    name: string;
    value: number;
  } | null>(null);
  const [paths, setPaths] = useState<{ id: string; d: string }[]>([]);

  useEffect(() => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    fetch(`${basePath}/geo/serbia-districts.geojson`)
      .then((r) => r.json())
      .then((data: DistrictCollection) => setGeoData(data))
      .catch(() => null);
  }, []);

  const valueMap = useMemo(() => {
    const m = new Map<string, number>();
    for (const pt of dataset.points) {
      m.set(pt.code, pt.value);
    }
    return m;
  }, [dataset]);

  const { minVal, maxVal } = useMemo(() => {
    const vals = [...valueMap.values()];
    return { minVal: Math.min(...vals), maxVal: Math.max(...vals) };
  }, [valueMap]);

  useEffect(() => {
    if (!geoData || !svgRef.current) return;

    import('d3').then(({ geoMercator, geoPath }) => {
      const svg = svgRef.current;
      if (!svg) return;
      const W = svg.clientWidth || 400;
      const H = svg.clientHeight || 340;

      const mainDistricts: DistrictCollection = {
        type: 'FeatureCollection',
        features: geoData.features.filter(
          (f) => f.properties.id <= '25'
        ) as DistrictFeature[],
      };

      const projection = geoMercator().fitSize([W, H], mainDistricts);
      const pathGen = geoPath(projection);

      const newPaths = mainDistricts.features.map((f) => ({
        id: f.properties.id,
        d: pathGen(f) ?? '',
      }));

      setPaths(newPaths);
    });
  }, [geoData]);

  function getColor(id: string): string {
    const val = valueMap.get(id);
    if (val === undefined) return '#e2e8f0';
    const t = maxVal === minVal ? 0.5 : (val - minVal) / (maxVal - minVal);
    return lerpColor('#dbeafe', '#0D4077', t);
  }

  const fmt = (v: number) => v.toLocaleString('en', { maximumFractionDigits: 1 });

  return (
    <div className='flex h-full flex-col'>
      <h3 className='mb-2 text-sm font-semibold text-slate-700'>{title}</h3>
      <p className='mb-1 text-xs text-slate-400'>{metricLabel}</p>
      <div className='relative min-h-0 flex-1' style={{ minHeight: 260 }}>
        {!geoData && (
          <div className='flex h-full items-center justify-center text-sm text-slate-400'>
            {locale === 'sr-Cyrl'
              ? 'Учитавање карте...'
              : locale === 'sr-Latn'
                ? 'Učitavanje karte...'
                : 'Loading map...'}
          </div>
        )}
        <svg
          ref={svgRef}
          className='h-full w-full'
          aria-label={`${title}: choropleth map of Serbia by district`}
          role='img'
        >
          {paths.map(({ id, d }) => {
            const feature = geoData?.features.find(
              (f) => f.properties.id === id
            ) as DistrictFeature | undefined;
            const name = feature
              ? getLocalizedName(feature.properties, locale)
              : id;
            const val = valueMap.get(id) ?? 0;
            return (
              <path
                key={id}
                d={d}
                fill={getColor(id)}
                stroke='#fff'
                strokeWidth={0.8}
                className='cursor-pointer transition-opacity hover:opacity-80'
                onMouseMove={(e) => {
                  const rect = svgRef.current?.getBoundingClientRect();
                  if (!rect) return;
                  setTooltip({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                    name,
                    value: val,
                  });
                }}
                onMouseLeave={() => setTooltip(null)}
                aria-label={`${name}: ${fmt(val)} ${unit}`}
              />
            );
          })}
        </svg>

        {tooltip && (
          <div
            className='pointer-events-none absolute z-10 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg'
            style={{ left: tooltip.x + 10, top: Math.max(0, tooltip.y - 44) }}
          >
            <p className='text-xs font-semibold text-slate-800'>{tooltip.name}</p>
            <p className='text-xs text-slate-500'>
              {fmt(tooltip.value)} {unit}
            </p>
          </div>
        )}

        <div className='absolute bottom-0 right-0 flex items-center gap-1.5 text-xs text-slate-500'>
          <span>{fmt(minVal)}</span>
          <div
            className='h-2.5 w-16 rounded-sm'
            style={{ background: 'linear-gradient(to right, #dbeafe, #0D4077)' }}
            aria-hidden='true'
          />
          <span>{fmt(maxVal)}</span>
          <span className='ml-1 text-slate-400'>{unit}</span>
        </div>
      </div>
    </div>
  );
}
