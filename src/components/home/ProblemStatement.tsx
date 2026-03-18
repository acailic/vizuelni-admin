import { AlertTriangle, Code, Languages } from 'lucide-react';

interface ProblemColumn {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface ProblemStatementProps {
  title: string;
  subtitle: string;
  gap1Title: string;
  gap1Description: string;
  gap2Title: string;
  gap2Description: string;
  gap3Title: string;
  gap3Description: string;
}

export function ProblemStatement({
  title,
  subtitle,
  gap1Title,
  gap1Description,
  gap2Title,
  gap2Description,
  gap3Title,
  gap3Description,
}: ProblemStatementProps) {
  const columns: ProblemColumn[] = [
    {
      icon: <AlertTriangle className='h-8 w-8' />,
      title: gap1Title,
      description: gap1Description,
    },
    {
      icon: <Code className='h-8 w-8' />,
      title: gap2Title,
      description: gap2Description,
    },
    {
      icon: <Languages className='h-8 w-8' />,
      title: gap3Title,
      description: gap3Description,
    },
  ];

  return (
    <section
      className='bg-gray-50 py-16'
      aria-labelledby='problem-statement-title'
    >
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <header className='mb-12 text-center'>
          <h2
            id='problem-statement-title'
            className='text-3xl font-bold text-gray-900'
          >
            {title}
          </h2>
          <p className='mt-4 text-lg text-gray-600'>{subtitle}</p>
        </header>

        <div className='grid gap-8 md:grid-cols-3'>
          {columns.map((column, index) => (
            <article
              key={index}
              className='flex flex-col items-center rounded-xl bg-white p-6 text-center shadow-sm'
            >
              <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gov-primary/10 text-gov-primary'>
                {column.icon}
              </div>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                {column.title}
              </h3>
              <p className='text-sm text-gray-600'>{column.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
