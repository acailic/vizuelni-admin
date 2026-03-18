/**
 * @file MobileDashboardEditor.tsx
 * @description Touch-optimized dashboard editor
 */

'use client';

import React, { useState } from 'react';
import { PlusIcon, CogIcon, ShareIcon } from '@heroicons/react/24/outline';
import { BottomSheetConfig } from './BottomSheetConfig';

interface ChartItem {
  id: string;
  title: string;
}

export function MobileDashboardEditor({
  dashboardId: _dashboardId,
  onSave: _onSave,
  onShare: _onShare,
}: {
  dashboardId?: string;
  onSave?: (_dashboard: unknown) => void;
  onShare?: (_dashboard: unknown) => void;
}) {
  const [charts, _setCharts] = useState<ChartItem[]>([]);
  const [selectedChart, setSelectedChart] = useState<string | null>(null);

  return (
    <div className='h-screen bg-gray-50'>
      <div className='bg-white px-4 py-3 flex justify-between items-center border-b border-gray-200'>
        <span className='text-lg font-bold'>Dashboard Editor</span>
        <div className='flex gap-2'>
          <button
            className='p-2 bg-blue-600 text-white rounded-lg'
            aria-label='Add'
          >
            <PlusIcon className='w-5 h-5' />
          </button>
          <button className='p-2 rounded-lg' aria-label='Settings'>
            <CogIcon className='w-5 h-5' />
          </button>
          <button className='p-2 rounded-lg' aria-label='Share'>
            <ShareIcon className='w-5 h-5' />
          </button>
        </div>
      </div>

      <div className='p-4 space-y-4 overflow-y-auto h-[calc(100vh-60px)]'>
        {charts.length === 0 ? (
          <div className='text-center py-20 text-gray-500'>
            <p className='text-lg mb-2'>Tap + to add your first chart</p>
          </div>
        ) : (
          charts.map((chart) => (
            <div
              key={chart.id}
              className='w-full min-h-[200px] bg-white rounded-lg shadow-md p-4'
            >
              <span className='font-bold'>{chart.title}</span>
            </div>
          ))
        )}
      </div>

      {selectedChart && (
        <BottomSheetConfig
          chartId={selectedChart}
          onClose={() => setSelectedChart(null)}
          onSave={() => {}}
        />
      )}
    </div>
  );
}
