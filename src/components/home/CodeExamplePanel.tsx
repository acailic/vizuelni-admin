import { Code2, ExternalLink, FileText } from 'lucide-react';

interface CodeExamplePanelProps {
  title: string;
  subtitle: string;
  description: string;
  viewOnGithub: string;
  readDocs: string;
  githubUrl?: string;
  docsUrl?: string;
}

const codeExample = `// Create a chart with Serbian data
import { ChartConfigurator } from '@/components/charts';

export function PopulationChart() {
  const config = {
    dataset: 'population-by-municipality',
    chartType: 'bar',
    xAxis: 'municipality',
    yAxis: 'population',
    locale: 'sr-Cyrl'
  };

  return <ChartConfigurator {...config} />;
}`;

export function CodeExamplePanel({
  title,
  subtitle,
  description,
  viewOnGithub,
  readDocs,
  githubUrl = 'https://github.com/acailic/vizualni-admin',
  docsUrl = '#',
}: CodeExamplePanelProps) {
  return (
    <section
      className='py-16 bg-gradient-to-b from-gray-50 to-white'
      aria-labelledby='code-example-title'
    >
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <header className='mb-12 text-center'>
          <div className='inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gov-primary/10 text-gov-primary mb-4'>
            <Code2 className='h-7 w-7' />
          </div>
          <h2
            id='code-example-title'
            className='text-3xl font-bold text-gray-900'
          >
            {title}
          </h2>
          <p className='mt-4 text-lg text-gray-600 max-w-2xl mx-auto'>
            {subtitle}
          </p>
        </header>

        <div className='grid lg:grid-cols-2 gap-8 items-center'>
          {/* Code Block */}
          <div className='relative'>
            <div className='rounded-xl border border-gray-200 bg-slate-900 overflow-hidden shadow-lg'>
              {/* Window chrome */}
              <div className='flex items-center gap-2 px-4 py-3 bg-slate-800 border-b border-slate-700'>
                <div className='w-3 h-3 rounded-full bg-red-500/80' />
                <div className='w-3 h-3 rounded-full bg-yellow-500/80' />
                <div className='w-3 h-3 rounded-full bg-green-500/80' />
                <span className='ml-3 text-xs text-slate-400 font-mono'>
                  population-chart.tsx
                </span>
              </div>
              {/* Code content */}
              <pre className='p-4 overflow-x-auto text-sm leading-relaxed'>
                <code className='text-slate-300 font-mono whitespace-pre'>
                  {codeExample}
                </code>
              </pre>
            </div>
            {/* Decorative element */}
            <div className='absolute -z-10 -bottom-4 -right-4 w-full h-full rounded-xl bg-gov-primary/5' />
          </div>

          {/* Description and CTAs */}
          <div className='lg:pl-4'>
            <p className='text-gray-600 leading-relaxed mb-6'>{description}</p>

            <div className='flex flex-col sm:flex-row gap-4'>
              <a
                href={githubUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gov-primary text-white font-medium transition-colors hover:bg-gov-primary/90 focus:outline-none focus:ring-2 focus:ring-gov-primary focus:ring-offset-2'
              >
                <ExternalLink className='h-4 w-4' />
                {viewOnGithub}
              </a>
              <a
                href={docsUrl}
                className='inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
              >
                <FileText className='h-4 w-4' />
                {readDocs}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
