'use client';

import React, { useState, useMemo } from 'react';
import { MunicipalMap } from './MunicipalMap';
import {
  DISTRICTS,
  SAMPLE_MUNICIPALITIES,
  getDistrictsByProvince,
  MapDataPoint,
} from '@/lib/geo';

interface DistrictMapProps {
  provinceCode?: string;
  data: MapDataPoint[];
  title?: string;
  locale?: 'en' | 'sr' | 'srLat';
  height?: number;
  showMunicipalities?: boolean;
  onDrillDown?: (districtCode: string) => void;
}

/**
 * District Map Component
 * Shows a single province with its districts highlighted
 * Supports drill-down to municipality level
 */
export function DistrictMap({
  provinceCode,
  data,
  title,
  locale = 'srLat',
  height = 500,
  showMunicipalities = false,
  onDrillDown,
}: DistrictMapProps) {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  // Get districts for the province
  const districts = useMemo(() => {
    if (provinceCode) {
      return getDistrictsByProvince(provinceCode);
    }
    return DISTRICTS;
  }, [provinceCode]);

  // Filter data for visible districts
  const visibleData = useMemo(() => {
    if (selectedDistrict) {
      // Show municipalities within selected district
      return SAMPLE_MUNICIPALITIES.filter(
        (m) => m.districtCode === selectedDistrict
      ).map((m) => {
        const dataPoint = data.find((d) => d.code === m.code);
        return {
          code: m.code,
          value: dataPoint?.value ?? m.population ?? 0,
          label: dataPoint?.label,
        };
      });
    }
    // Show districts
    return districts.map((d) => {
      const dataPoint = data.find((dp) => dp.code === d.code);
      return {
        code: d.code,
        value: dataPoint?.value ?? 0,
        label: dataPoint?.label,
      };
    });
  }, [districts, data, selectedDistrict]);

  const handleRegionClick = (code: string, _name: string) => {
    if (showMunicipalities && !selectedDistrict) {
      setSelectedDistrict(code);
      onDrillDown?.(code);
    }
  };

  const handleBack = () => {
    setSelectedDistrict(null);
  };

  const selectedDistrictInfo = useMemo(() => {
    if (!selectedDistrict) return null;
    return DISTRICTS.find((d) => d.code === selectedDistrict);
  }, [selectedDistrict]);

  return (
    <div className='district-map'>
      {/* Breadcrumb navigation */}
      {selectedDistrict && selectedDistrictInfo && (
        <div className='mb-4 flex items-center gap-2'>
          <button
            onClick={handleBack}
            className='text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1'
          >
            <svg
              className='w-4 h-4'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 19l-7-7 7-7'
              />
            </svg>
            {locale === 'en'
              ? 'Back to districts'
              : locale === 'sr'
                ? 'Назад на округе'
                : 'Nazad na okruge'}
          </button>
          <span className='text-gray-400'>/</span>
          <span className='text-gray-700 dark:text-gray-300 font-medium'>
            {selectedDistrictInfo.name[locale]}
          </span>
        </div>
      )}

      <MunicipalMap
        level={selectedDistrict ? 'municipality' : 'district'}
        data={visibleData}
        title={title || selectedDistrictInfo?.name[locale]}
        locale={locale}
        height={height}
        showLegend={true}
        enableZoom={true}
        onRegionClick={handleRegionClick}
      />

      {/* District list (for accessibility and mobile) */}
      {!selectedDistrict && (
        <div className='mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'>
          {districts.slice(0, 12).map((district) => {
            const districtData = data.find((d) => d.code === district.code);
            return (
              <button
                key={district.code}
                onClick={() =>
                  showMunicipalities &&
                  handleRegionClick(district.code, district.name[locale])
                }
                className={`text-left p-2 rounded-lg border border-gray-200 dark:border-gray-700 ${
                  showMunicipalities
                    ? 'hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer'
                    : 'cursor-default'
                } transition-colors`}
              >
                <p className='text-sm font-medium text-gray-900 dark:text-white truncate'>
                  {district.name[locale]}
                </p>
                {districtData && (
                  <p className='text-xs text-gray-500'>
                    {districtData.label || districtData.value.toLocaleString()}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default DistrictMap;
