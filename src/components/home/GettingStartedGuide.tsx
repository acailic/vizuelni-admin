import { ArrowRight, BarChart2, Search, Share2 } from 'lucide-react'

interface Step {
  icon: React.ReactNode
  title: string
  description: string
}

interface GettingStartedGuideProps {
  step1Title: string
  step1Description: string
  step2Title: string
  step2Description: string
  step3Title: string
  step3Description: string
  sectionTitle: string
}

export function GettingStartedGuide({
  step1Title,
  step1Description,
  step2Title,
  step2Description,
  step3Title,
  step3Description,
  sectionTitle,
}: GettingStartedGuideProps) {
  const steps: Step[] = [
    {
      icon: <Search className="h-8 w-8" />,
      title: step1Title,
      description: step1Description,
    },
    {
      icon: <BarChart2 className="h-8 w-8" />,
      title: step2Title,
      description: step2Description,
    },
    {
      icon: <Share2 className="h-8 w-8" />,
      title: step3Title,
      description: step3Description,
    },
  ]

  return (
    <section className="py-12" aria-labelledby="getting-started-title">
      <h2
        id="getting-started-title"
        className="mb-8 text-center text-2xl font-bold text-gray-900"
      >
        {sectionTitle}
      </h2>
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div className="flex items-center gap-4">
              {/* Step number and content */}
              <div className="flex flex-col items-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gov-primary to-gov-accent text-white shadow-lg">
                  {step.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-2 max-w-xs text-sm text-gray-600">{step.description}</p>
              </div>
              {/* Arrow between steps */}
              {index < steps.length - 1 && (
                <ArrowRight className="hidden h-6 w-6 text-gray-300 md:block lg:block" />
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
