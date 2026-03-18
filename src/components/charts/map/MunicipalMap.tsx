'use client';

import React, { useState, useCallback, useMemo } from 'react';
import Plot from 'react-plotly.js';
import { Data, Layout, Config } from 'plotly.js';
import {
  GeoLevel,
  MapDataPoint,
  ColorScaleConfig,
  PROVINCES,
  DISTRICTS,
  SAMPLE_MUNICIPALITIES,
  getColorForValue,
  createColorScaleFromData,
} from '@/lib/geo';

interface MunicipalMapProps {
  level?: GeoLevel;
  data: MapDataPoint[];
  colorField?: string;
  title?: string;
  locale?: 'en' | 'sr' | 'srLat';
  height?: number;
  showLegend?: boolean;
  enableZoom?: boolean;
  onRegionClick?: (regionCode: string, regionName: string) => void;
  colorScale?: ColorScaleConfig;
}

/**
 * Municipal Map Component
 * Displays Serbian administrative regions with choropleth coloring
 */
export function MunicipalMap({
  level = 'district',
  data,
  title,
  locale = 'srLat',
  height = 600,
  showLegend = true,
  enableZoom = true,
  onRegionClick,
  colorScale: customColorScale,
}: MunicipalMapProps) {
  const [_hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  // Get regions based on level
  const regions = useMemo(() => {
    switch (level) {
      case 'province':
        return PROVINCES;
      case 'district':
        return DISTRICTS;
      case 'municipality':
        return SAMPLE_MUNICIPALITIES;
      default:
        return DISTRICTS;
    }
  }, [level]);

  // Create color scale from data
  const colorScale = useMemo(() => {
    if (customColorScale) return customColorScale;
    return createColorScaleFromData(data, 'sequential', 'blues');
  }, [data, customColorScale]);

  // Map data to regions
  const regionData = useMemo(() => {
    return regions.map((region) => {
      const dataPoint = data.find((d) => d.code === region.code);
      return {
        code: region.code,
        name: region.name[locale],
        value: dataPoint?.value ?? 0,
        label: dataPoint?.label,
        color: dataPoint
          ? getColorForValue(dataPoint.value, colorScale)
          : '#e5e7eb',
      };
    });
  }, [regions, data, locale, colorScale]);

  // Use scatter geo for region centers
  const scatterData: Partial<Data>[] = useMemo(() => {
    // Generate approximate coordinates for each region
    const coords = getRegionCoordinates(level);

    return [
      {
        type: 'scattergeo',
        mode: 'text+markers',
        lon: regionData.map((_r, i) => coords[i]?.lon || 20),
        lat: regionData.map((_r, i) => coords[i]?.lat || 44),
        text: regionData.map((r) => r.name),
        textposition: 'top center',
        textfont: {
          size: 10,
        },
        marker: {
          size: regionData.map((r) =>
            Math.max(15, Math.min(50, r.value / 10000))
          ),
          color: regionData.map((r) => r.color),
          line: {
            color: 'white',
            width: 1,
          },
          opacity: 0.8,
        },
        hoverinfo: 'text',
        hovertext: regionData.map(
          (r) => `<b>${r.name}</b><br>Value: ${r.label || r.value}`
        ),
      },
    ] as Partial<Data>[];
  }, [regionData, level]);

  const layout: Partial<Layout> = useMemo(
    () => ({
      title: title
        ? {
            text: title,
            font: { size: 18 },
          }
        : undefined,
      geo: {
        scope: 'europe',
        resolution: 50,
        showland: true,
        landcolor: '#f3f4f6',
        showcountries: true,
        countrycolor: '#9ca3af',
        countrywidth: 1,
        showcoastlines: true,
        coastlinecolor: '#6b7280',
        showlakes: false,
        center: { lat: 44, lon: 21 },
        projection: {
          type: 'mercator',
          scale: enableZoom ? 1 : 1.5,
        },
        fitbounds: 'locations',
      },
      margin: { l: 0, r: 0, t: title ? 40 : 0, b: 0 },
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
      height,
      showlegend: false,
    }),
    [title, height, enableZoom]
  );

  const config: Partial<Config> = useMemo(
    () => ({
      displayModeBar: true,
      modeBarButtonsToRemove: ['lasso2d', 'select2d'],
      responsive: true,
      displaylogo: false,
    }),
    []
  );

  const handleClick = useCallback(
    (event: { points?: Array<{ pointNumber: number }> }) => {
      if (onRegionClick && event.points?.[0]) {
        const pointIndex = event.points[0].pointNumber;
        const region = regionData[pointIndex];
        if (region) {
          onRegionClick(region.code, region.name);
        }
      }
    },
    [onRegionClick, regionData]
  );

  return (
    <div className='municipal-map w-full' style={{ height }}>
      <Plot
        data={scatterData}
        layout={layout}
        config={config}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        {...({
          onClick: handleClick,
          onHover: (e: { points?: { pointIndex: number }[] }) => {
            if (e.points?.[0]) {
              setHoveredRegion(regionData[e.points[0].pointIndex]?.code || null);
            }
          },
          onUnhover: () => setHoveredRegion(null),
        })}
        className='w-full h-full'
        useResizeHandler
      />

      {/* Legend */}
      {showLegend && <MapLegend colorScale={colorScale} locale={locale} />}
    </div>
  );
}

/**
 * Get approximate coordinates for regions
 * In production, this would come from GeoJSON centroids
 */
function getRegionCoordinates(
  level: GeoLevel
): Array<{ lat: number; lon: number }> {
  if (level === 'district') {
    // Approximate coordinates for district centers
    return [
      { lat: 44.8176, lon: 20.4568 }, // Belgrade
      { lat: 44.0715, lon: 22.0974 }, // Bor
      { lat: 44.6667, lon: 21.4167 }, // Braničevo
      { lat: 42.9833, lon: 21.9333 }, // Jablanica
      { lat: 44.2667, lon: 20.0667 }, // Kolubara
      { lat: 44.6167, lon: 19.5 }, // Mačva
      { lat: 43.9, lon: 20.35 }, // Morava
      { lat: 43.3167, lon: 21.9 }, // Nišava
      { lat: 42.4333, lon: 21.75 }, // Pčinja
      { lat: 43.15, lon: 22.5833 }, // Pirot
      { lat: 44.65, lon: 20.9333 }, // Podunavlje
      { lat: 43.9667, lon: 21.1667 }, // Pomoravlje
      { lat: 43.5833, lon: 21.3333 }, // Rasina
      { lat: 43.3, lon: 20.5 }, // Raška
      { lat: 44.0167, lon: 20.9 }, // Šumadija
      { lat: 43.1333, lon: 21.55 }, // Toplica
      { lat: 43.85, lon: 22.5667 }, // Zaječar
      { lat: 43.7167, lon: 19.7 }, // Zlatibor
      // Vojvodina
      { lat: 45.95, lon: 19.6 }, // North Bačka
      { lat: 45.75, lon: 19.1 }, // West Bačka
      { lat: 45.25, lon: 19.7 }, // South Bačka
      { lat: 45.95, lon: 20.45 }, // North Banat
      { lat: 45.55, lon: 20.4 }, // Central Banat
      { lat: 44.95, lon: 20.6 }, // South Banat
      { lat: 45.0, lon: 19.4 }, // Srem
    ];
  }

  // Default: Serbia center
  return [{ lat: 44, lon: 21 }];
}

/**
 * Map Legend Component
 */
function MapLegend({
  colorScale,
  locale,
}: {
  colorScale: ColorScaleConfig;
  locale: 'en' | 'sr' | 'srLat';
}) {
  const steps = 5;
  const [min = 0, max = 100] = colorScale.domain || [];

  const legendItems = [];
  for (let i = 0; i < steps; i++) {
    const value = min + (max - min) * (i / (steps - 1));
    const color = getColorForValue(value, colorScale);
    legendItems.push({ color, value });
  }

  return (
    <div className='mt-4 flex items-center justify-center gap-2'>
      <span className='text-xs text-gray-500'>
        {locale === 'en' ? 'Low' : locale === 'sr' ? 'Ниско' : 'Nisko'}
      </span>
      {legendItems.map((item, i) => (
        <div
          key={i}
          className='w-8 h-4 rounded-sm'
          style={{ backgroundColor: item.color }}
          title={`${item.value}`}
        />
      ))}
      <span className='text-xs text-gray-500'>
        {locale === 'en' ? 'High' : locale === 'sr' ? 'Високо' : 'Visoko'}
      </span>
    </div>
  );
}

export default MunicipalMap;
