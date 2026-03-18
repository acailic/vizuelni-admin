import { BarChart3, Globe, Map, ShieldCheck } from 'lucide-react';

interface QuickProofStripProps {
  examples: string;
  officialSources: string;
  cyrillicLatin: string;
  serbianMaps: string;
}

export function QuickProofStrip({
  examples,
  officialSources,
  cyrillicLatin,
  serbianMaps,
}: QuickProofStripProps) {
  const items = [
    { icon: BarChart3, label: examples },
    { icon: ShieldCheck, label: officialSources },
    { icon: Globe, label: cyrillicLatin },
    { icon: Map, label: serbianMaps },
  ];

  return (
    <section
      className='py-8 bg-gray-50 border-y border-gray-100'
      aria-label='Quick proof'
    >
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-wrap items-center justify-center gap-x-12 gap-y-4'>
          {items.map((item, index) => (
            <div
              key={index}
              className='flex items-center gap-2.5 text-gray-600'
            >
              <item.icon
                className='h-5 w-5 text-gov-primary shrink-0'
                aria-hidden='true'
              />
              <span className='text-sm font-medium'>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
