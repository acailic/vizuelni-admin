import { Check, X } from 'lucide-react';

interface ComparisonCardsProps {
  title: string;
  subtitle: string;
  columnOur: string;
  columnGeneric: string;
  rowGeography: { label: string; our: string; generic: string };
  rowLocalization: { label: string; our: string; generic: string };
  rowData: { label: string; our: string; generic: string };
  rowAccessibility: { label: string; our: string; generic: string };
  rowContext: { label: string; our: string; generic: string };
}

export function ComparisonCards({
  title,
  subtitle,
  columnOur,
  columnGeneric,
  rowGeography,
  rowLocalization,
  rowData,
  rowAccessibility,
  rowContext,
}: ComparisonCardsProps) {
  const rows = [
    rowGeography,
    rowLocalization,
    rowData,
    rowAccessibility,
    rowContext,
  ];

  return (
    <section className='py-16' aria-labelledby='comparison-title'>
      <div className='mx-auto max-w-5xl px-4 sm:px-6 lg:px-8'>
        <header className='mb-12 text-center'>
          <h2
            id='comparison-title'
            className='text-3xl font-bold text-gray-900 font-serif'
          >
            {title}
          </h2>
          <p className='mt-4 text-lg text-gray-600 max-w-2xl mx-auto'>
            {subtitle}
          </p>
        </header>

        <div className='grid md:grid-cols-2 gap-6'>
          {/* Our Platform Card */}
          <div className='rounded-xl border-2 border-gov-primary bg-white p-6 shadow-sm'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-gov-primary text-white'>
                <Check className='h-5 w-5' />
              </div>
              <h3 className='text-xl font-semibold text-gray-900'>
                {columnOur}
              </h3>
            </div>
            <ul className='space-y-4'>
              {rows.map((row, index) => (
                <li key={index} className='flex items-start gap-3'>
                  <Check
                    className='h-5 w-5 text-green-500 shrink-0 mt-0.5'
                    aria-hidden='true'
                  />
                  <div>
                    <span className='font-medium text-gray-900'>
                      {row.label}:
                    </span>{' '}
                    <span className='text-gray-600'>{row.our}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Generic Libraries Card */}
          <div className='rounded-xl border border-gray-200 bg-gray-50 p-6'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200 text-gray-600'>
                <X className='h-5 w-5' />
              </div>
              <h3 className='text-xl font-semibold text-gray-900'>
                {columnGeneric}
              </h3>
            </div>
            <ul className='space-y-4'>
              {rows.map((row, index) => (
                <li key={index} className='flex items-start gap-3'>
                  <X
                    className='h-5 w-5 text-gray-400 shrink-0 mt-0.5'
                    aria-hidden='true'
                  />
                  <div>
                    <span className='font-medium text-gray-900'>
                      {row.label}:
                    </span>{' '}
                    <span className='text-gray-500'>{row.generic}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
