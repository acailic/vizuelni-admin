import Link from 'next/link'

import { ArrowRight, Search } from 'lucide-react'

import type { Locale } from '@/lib/i18n/config'
import { getBrowsePath } from '@/lib/api/browse'

interface HeroSectionProps {
  locale: Locale
  title: string
  subtitle: string
  primaryCta: string
  secondaryCta: string
}

export function HeroSection({
  locale,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
}: HeroSectionProps) {
  return (
    <section
      className="rounded-[2rem] bg-gradient-to-br from-gov-primary via-gov-accent to-[#0C1E42] px-8 py-12 text-white shadow-2xl md:py-16"
      aria-labelledby="hero-title"
    >
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
        data.gov.rs
      </p>
      <h1
        id="hero-title"
        className="mt-4 max-w-3xl text-3xl font-bold leading-tight md:text-4xl lg:text-5xl"
      >
        {title}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-white/80 md:text-lg">
        {subtitle}
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-gov-primary transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gov-primary"
          href={getBrowsePath(locale)}
        >
          <Search className="h-4 w-4" />
          {primaryCta}
        </Link>
        <Link
          className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gov-primary"
          href={`/${locale}/create`}
        >
          {secondaryCta}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}
