import { Code2, Globe, Shield, Sparkles } from 'lucide-react';

interface SocialProofBadge {
  icon: React.ReactNode;
  label: string;
}

interface SocialProofProps {
  labels: {
    openSource: string;
    accessibility: string;
    multilingual: string;
    examples: string;
  };
}

export function SocialProof({ labels }: SocialProofProps) {
  const badges: SocialProofBadge[] = [
    {
      icon: <Code2 className='h-4 w-4' />,
      label: labels.openSource,
    },
    {
      icon: <Shield className='h-4 w-4' />,
      label: labels.accessibility,
    },
    {
      icon: <Globe className='h-4 w-4' />,
      label: labels.multilingual,
    },
    {
      icon: <Sparkles className='h-4 w-4' />,
      label: labels.examples,
    },
  ];

  return (
    <div
      className='flex flex-wrap items-center justify-center gap-3 md:gap-4'
      role='list'
      aria-label='Platform highlights'
    >
      {badges.map((badge, index) => (
        <div
          key={index}
          className='inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1.5 text-sm text-white/90'
          role='listitem'
        >
          <span className='text-white/70'>{badge.icon}</span>
          <span className='font-medium'>{badge.label}</span>
        </div>
      ))}
    </div>
  );
}
