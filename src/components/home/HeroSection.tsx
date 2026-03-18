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
      className="relative overflow-hidden rounded-[2rem] px-8 py-12 text-white shadow-2xl md:py-16"
      aria-labelledby="hero-title"
    >
      {/* Refined gradient background with subtle texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-gov-primary via-serbia-blue to-[#0C1E42]" />

      {/* Decorative accent elements - Serbian red used sparingly */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-serbia-red/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gov-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" aria-hidden="true" />

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      {/* Content with enhanced typography */}
      <div className="relative z-10">
        <p className="inline-flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.2em] text-white/80"
           style={{ fontFamily: "var(--font-family-body)" }}>
          <span className="h-2 w-2 rounded-full bg-serbia-red shadow-lg shadow-red-500/30" aria-hidden="true" />
          data.gov.rs
        </p>

        <h1
          id="hero-title"
          className="mt-5 max-w-3xl text-3xl font-extrabold leading-[1.1] tracking-tight text-white md:text-4xl lg:text-5xl"
          style={{
            fontFamily: "var(--font-family-display)",
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-[1.75] text-white md:text-lg"
           style={{ fontFamily: "var(--font-family-body)" }}>
          {subtitle}
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            className="group inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-semibold text-gov-primary shadow-lg transition-all duration-200 hover:bg-gray-50 hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gov-primary"
            href={getBrowsePath(locale)}
          >
            <Search className="h-4 w-4 transition-transform group-hover:scale-110" />
            {primaryCta}
          </Link>

          <Link
            className="group inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/15 hover:border-white/40 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gov-primary"
            href={`/${locale}/create`}
          >
            {secondaryCta}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
