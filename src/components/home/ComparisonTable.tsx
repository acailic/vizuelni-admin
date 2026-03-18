import {
  Check,
  X,
  MapPin,
  Globe2,
  Database,
  Accessibility,
  Building2,
} from 'lucide-react';

interface ComparisonRow {
  icon: React.ReactNode;
  label: string;
  ourValue: string;
  genericValue: string;
}

interface ComparisonTableProps {
  title: string;
  subtitle: string;
  columnOur: string;
  columnGeneric: string;
  rowGeographyLabel: string;
  rowGeographyOur: string;
  rowGeographyGeneric: string;
  rowLocalizationLabel: string;
  rowLocalizationOur: string;
  rowLocalizationGeneric: string;
  rowDataLabel: string;
  rowDataOur: string;
  rowDataGeneric: string;
  rowAccessibilityLabel: string;
  rowAccessibilityOur: string;
  rowAccessibilityGeneric: string;
  rowContextLabel: string;
  rowContextOur: string;
  rowContextGeneric: string;
}

export function ComparisonTable({
  title,
  subtitle,
  columnOur,
  columnGeneric,
  rowGeographyLabel,
  rowGeographyOur,
  rowGeographyGeneric,
  rowLocalizationLabel,
  rowLocalizationOur,
  rowLocalizationGeneric,
  rowDataLabel,
  rowDataOur,
  rowDataGeneric,
  rowAccessibilityLabel,
  rowAccessibilityOur,
  rowAccessibilityGeneric,
  rowContextLabel,
  rowContextOur,
  rowContextGeneric,
}: ComparisonTableProps) {
  const rows: ComparisonRow[] = [
    {
      icon: <MapPin className='h-5 w-5' />,
      label: rowGeographyLabel,
      ourValue: rowGeographyOur,
      genericValue: rowGeographyGeneric,
    },
    {
      icon: <Globe2 className='h-5 w-5' />,
      label: rowLocalizationLabel,
      ourValue: rowLocalizationOur,
      genericValue: rowLocalizationGeneric,
    },
    {
      icon: <Database className='h-5 w-5' />,
      label: rowDataLabel,
      ourValue: rowDataOur,
      genericValue: rowDataGeneric,
    },
    {
      icon: <Accessibility className='h-5 w-5' />,
      label: rowAccessibilityLabel,
      ourValue: rowAccessibilityOur,
      genericValue: rowAccessibilityGeneric,
    },
    {
      icon: <Building2 className='h-5 w-5' />,
      label: rowContextLabel,
      ourValue: rowContextOur,
      genericValue: rowContextGeneric,
    },
  ];

  return (
    <section className='py-16 bg-white' aria-labelledby='comparison-title'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <header className='mb-12 text-center'>
          <h2
            id='comparison-title'
            className='text-3xl font-bold text-gray-900'
          >
            {title}
          </h2>
          <p className='mt-4 text-lg text-gray-600 max-w-2xl mx-auto'>
            {subtitle}
          </p>
        </header>

        {/* Desktop table view */}
        <div className='hidden md:block overflow-hidden rounded-xl border border-gray-200 shadow-sm'>
          <table className='w-full'>
            <thead>
              <tr className='bg-gray-50 border-b border-gray-200'>
                <th className='px-6 py-4 text-left text-sm font-semibold text-gray-900 w-1/3'>
                  {''}
                </th>
                <th className='px-6 py-4 text-left text-sm font-semibold text-gray-900 w-1/3'>
                  <span className='flex items-center gap-2'>
                    <span className='w-3 h-3 rounded-full bg-gov-primary' />
                    {columnOur}
                  </span>
                </th>
                <th className='px-6 py-4 text-left text-sm font-semibold text-gray-900 w-1/3'>
                  <span className='flex items-center gap-2'>
                    <span className='w-3 h-3 rounded-full bg-gray-400' />
                    {columnGeneric}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={index}
                  className={
                    index < rows.length - 1 ? 'border-b border-gray-100' : ''
                  }
                >
                  <td className='px-6 py-4'>
                    <span className='flex items-center gap-3'>
                      <span className='text-gray-400'>{row.icon}</span>
                      <span className='text-sm font-medium text-gray-900'>
                        {row.label}
                      </span>
                    </span>
                  </td>
                  <td className='px-6 py-4'>
                    <span className='flex items-start gap-2 text-sm text-gray-700'>
                      <Check className='h-4 w-4 text-green-600 mt-0.5 shrink-0' />
                      {row.ourValue}
                    </span>
                  </td>
                  <td className='px-6 py-4'>
                    <span className='flex items-start gap-2 text-sm text-gray-500'>
                      <X className='h-4 w-4 text-red-400 mt-0.5 shrink-0' />
                      {row.genericValue}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile card view */}
        <div className='md:hidden space-y-4'>
          {rows.map((row, index) => (
            <div
              key={index}
              className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm'
            >
              <div className='flex items-center gap-3 mb-4'>
                <span className='text-gray-400'>{row.icon}</span>
                <span className='text-sm font-semibold text-gray-900'>
                  {row.label}
                </span>
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div className='rounded-lg bg-gov-primary/5 p-3'>
                  <div className='flex items-center gap-1 mb-1'>
                    <span className='w-2 h-2 rounded-full bg-gov-primary' />
                    <span className='text-xs font-medium text-gray-600'>
                      {columnOur}
                    </span>
                  </div>
                  <span className='flex items-start gap-1 text-xs text-gray-700'>
                    <Check className='h-3 w-3 text-green-600 mt-0.5 shrink-0' />
                    {row.ourValue}
                  </span>
                </div>
                <div className='rounded-lg bg-gray-50 p-3'>
                  <div className='flex items-center gap-1 mb-1'>
                    <span className='w-2 h-2 rounded-full bg-gray-400' />
                    <span className='text-xs font-medium text-gray-600'>
                      {columnGeneric}
                    </span>
                  </div>
                  <span className='flex items-start gap-1 text-xs text-gray-500'>
                    <X className='h-3 w-3 text-red-400 mt-0.5 shrink-0' />
                    {row.genericValue}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
