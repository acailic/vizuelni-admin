import {
  Accessibility,
  Globe2,
  MapPin,
  Rocket,
  Unlock,
  Database,
} from 'lucide-react';

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FeaturesGridProps {
  title: string;
  subtitle: string;
  serbianFirstTitle: string;
  serbianFirstDescription: string;
  realDataTitle: string;
  realDataDescription: string;
  accessibilityTitle: string;
  accessibilityDescription: string;
  geographyTitle: string;
  geographyDescription: string;
  openSourceTitle: string;
  openSourceDescription: string;
  lowFrictionTitle: string;
  lowFrictionDescription: string;
}

export function FeaturesGrid({
  title,
  subtitle,
  serbianFirstTitle,
  serbianFirstDescription,
  realDataTitle,
  realDataDescription,
  accessibilityTitle,
  accessibilityDescription,
  geographyTitle,
  geographyDescription,
  openSourceTitle,
  openSourceDescription,
  lowFrictionTitle,
  lowFrictionDescription,
}: FeaturesGridProps) {
  const features: FeatureItem[] = [
    {
      icon: <Globe2 className='h-6 w-6' />,
      title: serbianFirstTitle,
      description: serbianFirstDescription,
    },
    {
      icon: <Database className='h-6 w-6' />,
      title: realDataTitle,
      description: realDataDescription,
    },
    {
      icon: <Accessibility className='h-6 w-6' />,
      title: accessibilityTitle,
      description: accessibilityDescription,
    },
    {
      icon: <MapPin className='h-6 w-6' />,
      title: geographyTitle,
      description: geographyDescription,
    },
    {
      icon: <Unlock className='h-6 w-6' />,
      title: openSourceTitle,
      description: openSourceDescription,
    },
    {
      icon: <Rocket className='h-6 w-6' />,
      title: lowFrictionTitle,
      description: lowFrictionDescription,
    },
  ];

  return (
    <section className='py-20' aria-labelledby='features-grid-title'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <header className='mb-16 text-center'>
          <h2
            id='features-grid-title'
            className='text-4xl font-bold text-gray-900 font-serif'
          >
            {title}
          </h2>
          <p className='mt-4 text-lg text-gray-600'>{subtitle}</p>
        </header>

        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {features.map((feature, index) => (
            <article
              key={index}
              className='flex gap-4 rounded-xl border border-gray-200 bg-white p-7 transition-all hover:shadow-md hover:border-gov-primary/30'
            >
              <div className='flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gov-primary text-white'>
                {feature.icon}
              </div>
              <div>
                <h3 className='font-bold text-base text-gray-900'>
                  {feature.title}
                </h3>
                <p className='mt-1 text-sm text-gray-600'>
                  {feature.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
