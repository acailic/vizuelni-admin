'use client';

import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
} from 'recharts';

// Serbian population data by district (in Cyrillic)
const populationData = [
  { region: 'Београд', population: 1688000 },
  { region: 'Јужнобачки', population: 615000 },
  { region: 'Нишавски', population: 376000 },
  { region: 'Сремски', population: 312000 },
  { region: 'Моравички', population: 215000 },
  { region: 'Златиборски', population: 186000 },
];

// GDP growth data (real Serbian data)
const gdpData = [
  { year: '2019', gdp: 4.2 },
  { year: '2020', gdp: -0.9 },
  { year: '2021', gdp: 7.7 },
  { year: '2022', gdp: 2.5 },
  { year: '2023', gdp: 2.1 },
  { year: '2024', gdp: 3.5 },
];

// Budget allocation by category
const budgetData = [
  { name: 'Образовање', value: 35, color: '#0d4077' },
  { name: 'Здравство', value: 28, color: '#c6363c' },
  { name: 'Инфраструктура', value: 20, color: '#2563eb' },
  { name: 'Култура', value: 10, color: '#7c3aed' },
  { name: 'Остало', value: 7, color: '#6b7280' },
];

const COLORS = ['#0d4077', '#c6363c', '#2563eb', '#7c3aed', '#6b7280'];

export default function Home() {
  const [activeTab, setActiveTab] = useState<'charts' | 'playground'>('charts');

  return (
    <main className='min-h-screen p-8'>
      <div className='max-w-6xl mx-auto'>
        <header className='text-center mb-8'>
          <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-2'>
            🇷🇸 Визуелни Админ Србије
          </h1>
          <p className='text-lg text-gray-600 dark:text-gray-400'>
            Визуализација података српске владе
          </p>
          <p className='text-sm text-gray-500 dark:text-gray-500 mt-1'>
            Serbian Government Data Visualization
          </p>
        </header>

        {/* Tab Navigation */}
        <div className='flex justify-center mb-8'>
          <div className='inline-flex rounded-lg border border-gray-200 dark:border-gray-700'>
            <button
              onClick={() => setActiveTab('charts')}
              className={`px-6 py-2 text-sm font-medium rounded-l-lg ${
                activeTab === 'charts'
                  ? 'bg-blue-900 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              📊 Примери / Examples
            </button>
            <button
              onClick={() => setActiveTab('playground')}
              className={`px-6 py-2 text-sm font-medium rounded-r-lg ${
                activeTab === 'playground'
                  ? 'bg-blue-900 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              🎮 Игралиште / Playground
            </button>
          </div>
        </div>

        {activeTab === 'charts' ? <ChartsSection /> : <PlaygroundSection />}

        <footer className='mt-12 text-center text-sm text-gray-500 dark:text-gray-400'>
          <p>
            Извор података: Републички завод за статистику
            <br />
            Data source: Statistical Office of the Republic of Serbia
          </p>
        </footer>
      </div>
    </main>
  );
}

function ChartsSection() {
  return (
    <div className='space-y-8'>
      {/* Population by Region */}
      <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
        <h2 className='text-xl font-semibold mb-4 text-gray-900 dark:text-white'>
          Популација по окрузима / Population by District
        </h2>
        <div className='h-80'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              data={populationData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid
                strokeDasharray='3 3'
                stroke='#374151'
                opacity={0.3}
              />
              <XAxis
                dataKey='region'
                angle={-45}
                textAnchor='end'
                height={60}
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <YAxis
                tick={{ fill: '#6b7280' }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                formatter={(value: number) => [
                  value.toLocaleString('sr-RS'),
                  'Популација',
                ]}
              />
              <Bar dataKey='population' fill='#0d4077' radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className='grid gap-8 lg:grid-cols-2'>
        {/* GDP Growth Trend */}
        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
          <h2 className='text-xl font-semibold mb-4 text-gray-900 dark:text-white'>
            Раст БДП-а / GDP Growth (%)
          </h2>
          <div className='h-64'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart
                data={gdpData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray='3 3'
                  stroke='#374151'
                  opacity={0.3}
                />
                <XAxis dataKey='year' tick={{ fill: '#6b7280' }} />
                <YAxis tick={{ fill: '#6b7280' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  formatter={(value: number) => [`${value}%`, 'БДП раст']}
                />
                <Line
                  type='monotone'
                  dataKey='gdp'
                  stroke='#c6363c'
                  strokeWidth={3}
                  dot={{ fill: '#c6363c', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Budget Allocation */}
        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
          <h2 className='text-xl font-semibold mb-4 text-gray-900 dark:text-white'>
            Расподела буџета / Budget Allocation
          </h2>
          <div className='h-64'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie
                  data={budgetData}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill='#8884d8'
                  dataKey='value'
                >
                  {budgetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlaygroundSection() {
  const [csvInput, setCsvInput] = useState(`region,value
Београд,1688000
Нови Сад,260000
Ниш,185000
Крагујевац,150000
Приштина,200000`);
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

  const parseCSV = () => {
    const lines = csvInput.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map((h) => h.trim());
    return lines.slice(1).map((line) => {
      const values = line.split(',').map((v) => v.trim());
      const obj: Record<string, string | number> = {};
      headers.forEach((header, i) => {
        const val = values[i];
        obj[header] = isNaN(Number(val)) ? val : Number(val);
      });
      return obj;
    });
  };

  const data = parseCSV();
  const valueKey =
    data.length > 0
      ? Object.keys(data[0]).find((k) => typeof data[0][k] === 'number')
      : 'value';
  const nameKey =
    data.length > 0
      ? Object.keys(data[0]).find((k) => typeof data[0][k] === 'string')
      : 'name';

  return (
    <div className='grid gap-8 lg:grid-cols-2'>
      {/* Input Section */}
      <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
        <h2 className='text-xl font-semibold mb-4 text-gray-900 dark:text-white'>
          Унесите податке / Enter Data (CSV)
        </h2>
        <textarea
          value={csvInput}
          onChange={(e) => setCsvInput(e.target.value)}
          className='w-full h-64 font-mono text-sm p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          placeholder='region,value&#10;Београд,1688000&#10;Нови Сад,260000'
        />

        <div className='mt-4'>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Тип графика / Chart Type
          </label>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value as 'bar' | 'line')}
            className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
          >
            <option value='bar'>Тракасти / Bar Chart</option>
            <option value='line'>Линијски / Line Chart</option>
          </select>
        </div>
      </div>

      {/* Preview Section */}
      <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
        <h2 className='text-xl font-semibold mb-4 text-gray-900 dark:text-white'>
          Преглед / Preview
        </h2>
        <div className='h-80'>
          {data.length > 0 && valueKey && nameKey ? (
            <ResponsiveContainer width='100%' height='100%'>
              {chartType === 'bar' ? (
                <BarChart
                  data={data}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid
                    strokeDasharray='3 3'
                    stroke='#374151'
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey={nameKey}
                    angle={-45}
                    textAnchor='end'
                    height={60}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <YAxis tick={{ fill: '#6b7280' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Bar
                    dataKey={valueKey}
                    fill='#0d4077'
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              ) : (
                <LineChart
                  data={data}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray='3 3'
                    stroke='#374151'
                    opacity={0.3}
                  />
                  <XAxis dataKey={nameKey} tick={{ fill: '#6b7280' }} />
                  <YAxis tick={{ fill: '#6b7280' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Line
                    type='monotone'
                    dataKey={valueKey}
                    stroke='#c6363c'
                    strokeWidth={3}
                    dot={{ fill: '#c6363c', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          ) : (
            <div className='h-full flex items-center justify-center text-gray-500 dark:text-gray-400'>
              Унесите важеће CSV податке / Enter valid CSV data
            </div>
          )}
        </div>

        <div className='mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg'>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            <strong>Подаци:</strong> {data.length} редова
          </p>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            <strong>Колоне:</strong>{' '}
            {data.length > 0 ? Object.keys(data[0]).join(', ') : '-'}
          </p>
        </div>
      </div>
    </div>
  );
}
