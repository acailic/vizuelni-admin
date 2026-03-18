import { BarChart3, ChevronRight, Search, Share2 } from 'lucide-react';

interface StepItem {
  number: string;
  icon: React.ReactNode;
  title: string;
}

interface HowItWorksMinimalProps {
  title: string;
  step1: string;
  step2: string;
  step3: string;
  stepLabel?: string;
}

export function HowItWorksMinimal({
  title,
  step1,
  step2,
  step3,
  stepLabel = 'Step',
}: HowItWorksMinimalProps) {
  const steps: StepItem[] = [
    { number: '1', icon: <Search className='h-6 w-6' />, title: step1 },
    { number: '2', icon: <BarChart3 className='h-6 w-6' />, title: step2 },
    { number: '3', icon: <Share2 className='h-6 w-6' />, title: step3 },
  ];

  return (
    <section className='py-16' aria-labelledby='how-it-works-title'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <header className='mb-12 text-center'>
          <h2
            id='how-it-works-title'
            className='text-3xl font-bold text-gray-900 font-serif'
          >
            {title}
          </h2>
        </header>

        <div className='flex flex-col items-center justify-center gap-4 md:flex-row md:gap-0'>
          {steps.map((step, index) => (
            <div key={index} className='flex items-center'>
              <div className='flex flex-col items-center text-center'>
                <div
                  className='flex h-16 w-16 items-center justify-center rounded-full bg-gov-primary text-white text-2xl font-bold'
                  aria-label={`${stepLabel} ${index + 1}`}
                >
                  {step.number}
                </div>
                <div className='mt-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-gov-primary'>
                  {step.icon}
                </div>
                <p className='mt-3 text-sm font-medium text-gray-700 max-w-[120px]'>
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <ChevronRight
                  className='mx-4 h-8 w-8 text-gray-300 hidden md:block'
                  aria-hidden='true'
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
