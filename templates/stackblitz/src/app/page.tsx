import { BarChart, LineChart } from '@vizualni/charts';

// Sample Serbian population data
const populationData = [
  { region: 'Belgrade', population: 1688000 },
  { region: 'Vojvodina', population: 1895000 },
  { region: 'Šumadija', population: 514000 },
  { region: 'Southern Serbia', population: 482000 },
  { region: 'Eastern Serbia', population: 298000 },
];

// GDP growth data
const gdpData = [
  { year: 2019, gdp: 4.2 },
  { year: 2020, gdp: -0.9 },
  { year: 2021, gdp: 7.7 },
  { year: 2022, gdp: 2.5 },
  { year: 2023, gdp: 2.1 },
  { year: 2024, gdp: 3.5 },
];

export default function Home() {
  return (
    <main className='min-h-screen p-8'>
      <div className='max-w-6xl mx-auto'>
        <header className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-4'>
            🇷🇸 Vizualni Charts
          </h1>
          <p className='text-lg text-gray-600 dark:text-gray-400'>
            Beautiful visualizations for Serbian government data
          </p>
        </header>

        <div className='grid gap-8 lg:grid-cols-2'>
          {/* Population by Region */}
          <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
            <h2 className='text-xl font-semibold mb-4 text-gray-900 dark:text-white'>
              Population by Region
            </h2>
            <div className='h-64'>
              <BarChart
                data={populationData}
                xField='region'
                yField='population'
                title=''
                options={{
                  showGrid: true,
                  showLegend: false,
                  colors: ['#0D4077'],
                }}
              />
            </div>
          </div>

          {/* GDP Growth Trend */}
          <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
            <h2 className='text-xl font-semibold mb-4 text-gray-900 dark:text-white'>
              GDP Growth (%)
            </h2>
            <div className='h-64'>
              <LineChart
                data={gdpData}
                xField='year'
                yField='gdp'
                title=''
                options={{
                  showGrid: true,
                  showLegend: false,
                  showDots: true,
                  curveType: 'monotone',
                  colors: ['#C6363C'],
                }}
              />
            </div>
          </div>
        </div>

        <footer className='mt-12 text-center text-sm text-gray-500'>
          <p>
            Built with{' '}
            <a
              href='https://github.com/vizualni'
              className='text-blue-600 hover:underline'
            >
              @vizualni/charts
            </a>{' '}
            • Data from SORS
          </p>
        </footer>
      </div>
    </main>
  );
}
