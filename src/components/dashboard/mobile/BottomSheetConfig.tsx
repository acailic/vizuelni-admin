/**
 * @file BottomSheetConfig.tsx
 * @description Slide-up configuration panel
 */

'use client';

import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export function BottomSheetConfig({
  chartId: _chartId,
  onClose,
  onSave,
}: {
  chartId: string;
  onClose: () => void;
  onSave: (config: { title: string; dataSource: string; chartType: string }) => void;
}) {
  const [config, setConfig] = useState({
    title: '',
    dataSource: '',
    chartType: '',
  });

  return (
    <div className='fixed bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-2xl p-6 z-[1000]'>
      <div className='flex flex-col gap-4'>
        <div className='flex justify-between items-center'>
          <span className='text-lg font-bold'>Configure Chart</span>
          <button
            onClick={onClose}
            className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
            aria-label='Close'
          >
            <XMarkIcon className='w-5 h-5' />
          </button>
        </div>

        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Title
            </label>
            <input
              type='text'
              value={config.title}
              onChange={(e) => setConfig({ ...config, title: e.target.value })}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Chart Type
            </label>
            <select
              value={config.chartType}
              onChange={(e) => setConfig({ ...config, chartType: e.target.value })}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg bg-white'
            >
              <option value=''>Select type...</option>
              <option value='line'>Line</option>
              <option value='bar'>Bar</option>
              <option value='pie'>Pie</option>
            </select>
          </div>
        </div>

        <div className='flex gap-3 pt-4'>
          <button
            onClick={onClose}
            className='flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-lg'
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(config)}
            className='flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg'
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
