# Public Launch Landing Page - Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the landing page into a marketing-focused page for journalists and researchers with social proof, clear CTAs, and audience-specific sections.

**Architecture:** Add three new marketing components (SocialProof, HowItWorks, UseCases), modify the hero section to include them, update locale files with new copy in all 3 languages.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS, Lucide icons

---

## File Structure

```
Files to CREATE:
├── src/components/home/SocialProof.tsx      # Badge bar with GitHub stars (threshold: 50)
├── src/components/home/HowItWorks.tsx       # 3-step visual guide
└── src/components/home/UseCases.tsx         # 4 audience cards

Files to MODIFY:
├── src/components/home/index.ts             # Export new components
├── src/components/home/HeroSectionAnimated.tsx  # Add SocialProof, refine CTAs
├── src/app/[locale]/page.tsx                # Add HowItWorks, UseCases sections
├── src/lib/i18n/locales/sr/common.json      # Serbian Cyrillic copy
├── src/lib/i18n/locales/lat/common.json     # Serbian Latin copy
└── src/lib/i18n/locales/en/common.json      # English copy
```

---

## Chunk 1: SocialProof Component

### Task 1: Create SocialProof Component

**Files:**

- Create: `src/components/home/SocialProof.tsx`

- [ ] **Step 1: Create SocialProof component with badges and GitHub stars**

```typescript
'use client';

import { useEffect, useState } from 'react';
import { Star, BarChart3, Globe, Accessibility, Github } from 'lucide-react';

import type { Locale } from '@/lib/i18n/config';

interface SocialProofProps {
  locale: Locale;
  chartTypesLabel: string;
  serbianDataLabel: string;
  accessibilityLabel: string;
  openSourceLabel: string;
  githubStarsLabel: string;
}

interface GitHubRepoInfo {
  stargazers_count: number;
}

// Minimum stars threshold to display GitHub stars badge
const MIN_STARS_THRESHOLD = 50;

export function SocialProof({
  locale,
  chartTypesLabel,
  serbianDataLabel,
  accessibilityLabel,
  openSourceLabel,
  githubStarsLabel,
}: SocialProofProps) {
  const [stars, setStars] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStars() {
      try {
        const response = await fetch(
          'https://api.github.com/repos/acailic/vizualni-admin'
        );
        if (response.ok) {
          const data: GitHubRepoInfo = await response.json();
          setStars(data.stargazers_count);
        }
      } catch {
        // Silently fail - stars badge will be hidden
        setStars(null);
      } finally {
        setLoading(false);
      }
    }

    fetchStars();
  }, []);

  const showStarsBadge = !loading && stars !== null && stars >= MIN_STARS_THRESHOLD;

  const badges = [
    { icon: BarChart3, label: chartTypesLabel, value: '28+' },
    { icon: Globe, label: serbianDataLabel, value: null },
    { icon: Accessibility, label: accessibilityLabel, value: null },
    { icon: Github, label: openSourceLabel, value: null },
  ];

  return (
    <div
      className='flex flex-wrap items-center justify-center gap-4 md:gap-6 text-white/90'
      role='list'
      aria-label='Platform features and statistics'
    >
      {badges.map((badge, index) => (
        <div
          key={index}
          className='flex items-center gap-2 text-sm'
          role='listitem'
        >
          <badge.icon className='w-4 h-4 text-white/70' aria-hidden='true' />
          <span>
            {badge.value && (
              <span className='font-semibold mr-1'>{badge.value}</span>
            )}
            {badge.label}
          </span>
          {index < badges.length - 1 && (
            <span className='hidden md:inline text-white/30 ml-2'>•</span>
          )}
        </div>
      ))}

      {showStarsBadge && (
        <>
          <span className='hidden md:inline text-white/30'>•</span>
          <a
            href='https://github.com/acailic/vizualni-admin'
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-2 text-sm hover:text-white transition-colors'
            aria-label={`${githubStarsLabel}: ${stars} stars on GitHub`}
          >
            <Star className='w-4 h-4 text-yellow-400 fill-yellow-400' aria-hidden='true' />
            <span className='font-semibold'>{stars}</span>
            <span>{githubStarsLabel}</span>
          </a>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Add export to index.ts**

Add to `src/components/home/index.ts`:

```typescript
export { SocialProof } from './SocialProof';
```

- [ ] **Step 3: Verify component compiles**

Run: `npx tsc --noEmit src/components/home/SocialProof.tsx`
Expected: No errors

---

## Chunk 2: HowItWorks Component

### Task 2: Create HowItWorks Component

**Files:**

- Create: `src/components/home/HowItWorks.tsx`

- [ ] **Step 1: Create HowItWorks component with 3 steps**

```typescript
import { Database, Settings2, Share2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

import type { Locale } from '@/lib/i18n/config';

interface HowItWorksStep {
  icon: typeof Database;
  title: string;
  description: string;
}

interface HowItWorksProps {
  locale: Locale;
  sectionTitle: string;
  step1Title: string;
  step1Description: string;
  step2Title: string;
  step2Description: string;
  step3Title: string;
  step3Description: string;
  tryItLabel: string;
}

export function HowItWorks({
  locale,
  sectionTitle,
  step1Title,
  step1Description,
  step2Title,
  step2Description,
  step3Title,
  step3Description,
  tryItLabel,
}: HowItWorksProps) {
  const steps: HowItWorksStep[] = [
    { icon: Database, title: step1Title, description: step1Description },
    { icon: Settings2, title: step2Title, description: step2Description },
    { icon: Share2, title: step3Title, description: step3Description },
  ];

  return (
    <section className='py-16' aria-labelledby='how-it-works-title'>
      <div className='text-center mb-12'>
        <h2
          id='how-it-works-title'
          className='text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4'
        >
          {sectionTitle}
        </h2>
      </div>

      <div className='grid md:grid-cols-3 gap-8'>
        {steps.map((step, index) => (
          <div
            key={index}
            className='relative flex flex-col items-center text-center p-6'
          >
            {/* Step number */}
            <div className='absolute -top-2 -left-2 w-8 h-8 rounded-full bg-gov-primary text-white flex items-center justify-center text-sm font-bold'>
              {index + 1}
            </div>

            {/* Icon */}
            <div className='w-16 h-16 rounded-2xl bg-gov-primary/10 flex items-center justify-center mb-4'>
              <step.icon className='w-8 h-8 text-gov-primary' aria-hidden='true' />
            </div>

            {/* Content */}
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
              {step.title}
            </h3>
            <p className='text-gray-600 dark:text-gray-400 text-sm leading-relaxed'>
              {step.description}
            </p>

            {/* Arrow between steps (not on last) */}
            {index < steps.length - 1 && (
              <ArrowRight
                className='hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 text-gray-300 dark:text-gray-600'
                aria-hidden='true'
              />
            )}
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className='text-center mt-12'>
        <Link
          href={`/${locale}/demo-gallery`}
          className='inline-flex items-center gap-2 rounded-xl bg-gov-primary px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-gov-primary/90 hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gov-primary focus:ring-offset-2'
        >
          {tryItLabel}
          <ArrowRight className='w-4 h-4' />
        </Link>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add export to index.ts**

Add to `src/components/home/index.ts`:

```typescript
export { HowItWorks } from './HowItWorks';
```

- [ ] **Step 3: Verify component compiles**

Run: `npx tsc --noEmit src/components/home/HowItWorks.tsx`
Expected: No errors

---

## Chunk 3: UseCases Component

### Task 3: Create UseCases Component

**Files:**

- Create: `src/components/home/UseCases.tsx`

- [ ] **Step 1: Create UseCases component with 4 audience cards**

```typescript
import { Newspaper, Microscope, Building2, Code2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

import type { Locale } from '@/lib/i18n/config';

interface UseCase {
  icon: typeof Newspaper;
  title: string;
  description: string;
  cta: string;
  href: string;
}

interface UseCasesProps {
  locale: Locale;
  sectionTitle: string;
  journalistsTitle: string;
  journalistsDescription: string;
  journalistsCta: string;
  researchersTitle: string;
  researchersDescription: string;
  researchersCta: string;
  governmentTitle: string;
  governmentDescription: string;
  governmentCta: string;
  developersTitle: string;
  developersDescription: string;
  developersCta: string;
}

export function UseCases({
  locale,
  sectionTitle,
  journalistsTitle,
  journalistsDescription,
  journalistsCta,
  researchersTitle,
  researchersDescription,
  researchersCta,
  governmentTitle,
  governmentDescription,
  governmentCta,
  developersTitle,
  developersDescription,
  developersCta,
}: UseCasesProps) {
  const useCases: UseCase[] = [
    {
      icon: Newspaper,
      title: journalistsTitle,
      description: journalistsDescription,
      cta: journalistsCta,
      href: `/${locale}/demo-gallery?category=demographics`,
    },
    {
      icon: Microscope,
      title: researchersTitle,
      description: researchersDescription,
      cta: researchersCta,
      href: `/${locale}/demo-gallery?category=healthcare`,
    },
    {
      icon: Building2,
      title: governmentTitle,
      description: governmentDescription,
      cta: governmentCta,
      href: `/${locale}/demo-gallery?category=economy`,
    },
    {
      icon: Code2,
      title: developersTitle,
      description: developersDescription,
      cta: developersCta,
      href: 'https://github.com/acailic/vizualni-admin',
    },
  ];

  return (
    <section className='py-16 bg-gray-50 dark:bg-gray-900/50' aria-labelledby='use-cases-title'>
      <div className='text-center mb-12'>
        <h2
          id='use-cases-title'
          className='text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4'
        >
          {sectionTitle}
        </h2>
      </div>

      <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        {useCases.map((useCase, index) => {
          const isExternal = useCase.href.startsWith('http');

          return (
            <div
              key={index}
              className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow'
            >
              {/* Icon */}
              <div className='w-12 h-12 rounded-xl bg-gov-primary/10 flex items-center justify-center mb-4'>
                <useCase.icon className='w-6 h-6 text-gov-primary' aria-hidden='true' />
              </div>

              {/* Content */}
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                {useCase.title}
              </h3>
              <p className='text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4'>
                {useCase.description}
              </p>

              {/* CTA */}
              {isExternal ? (
                <a
                  href={useCase.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-1 text-sm font-medium text-gov-primary hover:text-gov-primary/80 transition-colors'
                >
                  {useCase.cta}
                  <ArrowRight className='w-4 h-4' />
                </a>
              ) : (
                <Link
                  href={useCase.href}
                  className='inline-flex items-center gap-1 text-sm font-medium text-gov-primary hover:text-gov-primary/80 transition-colors'
                >
                  {useCase.cta}
                  <ArrowRight className='w-4 h-4' />
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add export to index.ts**

Add to `src/components/home/index.ts`:

```typescript
export { UseCases } from './UseCases';
```

- [ ] **Step 3: Verify component compiles**

Run: `npx tsc --noEmit src/components/home/UseCases.tsx`
Expected: No errors

---

## Chunk 4: Update Locale Files

### Task 4: Add New Copy to Locale Files

**Files:**

- Modify: `src/lib/i18n/locales/en/common.json`
- Modify: `src/lib/i18n/locales/sr/common.json`
- Modify: `src/lib/i18n/locales/lat/common.json`

- [ ] **Step 1: Add English copy to en/common.json**

Add to the `homepage` object in `src/lib/i18n/locales/en/common.json`:

```json
{
  "homepage": {
    "...existing keys...",
    "socialProof": {
      "chartTypes": "Chart Types",
      "serbianData": "Serbian Data",
      "accessibility": "WCAG 2.1 AA",
      "openSource": "Open Source",
      "githubStars": "GitHub Stars"
    },
    "howItWorks": {
      "title": "How It Works",
      "step1Title": "Choose a Dataset",
      "step1Description": "Browse 3,400+ Serbian government datasets covering demographics, economy, healthcare, and more.",
      "step2Title": "Customize Your Chart",
      "step2Description": "Select chart type, colors, filters, and annotations to tell your data story.",
      "step3Title": "Share or Embed",
      "step3Description": "Export as image, share via URL, or embed interactive charts on your website.",
      "tryIt": "Try It Now"
    },
    "useCases": {
      "title": "Built for Different Needs",
      "journalistsTitle": "For Journalists",
      "journalistsDescription": "Create data-driven stories with interactive charts that engage readers.",
      "journalistsCta": "Explore Demographics",
      "researchersTitle": "For Researchers",
      "researchersDescription": "Analyze trends in demographics, economy, health, and social indicators.",
      "researchersCta": "View Health Data",
      "governmentTitle": "For Government",
      "governmentDescription": "Present data professionally to citizens with trusted, official visualizations.",
      "governmentCta": "See Economy Charts",
      "developersTitle": "For Developers",
      "developersDescription": "Clone the repo, customize components, and deploy your own instance.",
      "developersCta": "View on GitHub"
    },
    "hero": {
      "title": "Transform Serbian Government Data into Clear Visualizations",
      "subtitle": "No coding required. Explore budgets, demographics, and public data in minutes.",
      "tryDemo": "Try Demo",
      "viewGithub": "View on GitHub"
    }
  }
}
```

- [ ] **Step 2: Add Serbian Cyrillic copy to sr/common.json**

Add to the `homepage` object in `src/lib/i18n/locales/sr/common.json`:

```json
{
  "homepage": {
    "...existing keys...",
    "socialProof": {
      "chartTypes": "Типова графикона",
      "serbianData": "Српски подаци",
      "accessibility": "WCAG 2.1 AA",
      "openSource": "Отворени код",
      "githubStars": "GitHub звездица"
    },
    "howItWorks": {
      "title": "Како функционише",
      "step1Title": "Изаберите скуп података",
      "step1Description": "Прегледајте преко 3.400 скупова података српске владе из области демографије, економије, здравства и других.",
      "step2Title": "Прилагодите графикон",
      "step2Description": "Изаберите тип графикона, боје, филтере и анотације да испричате своју причу података.",
      "step3Title": "Поделите или уградите",
      "step3Description": "Извезите као слику, поделите преко URL-а или уградите интерактивне графиконе на свој сајт.",
      "tryIt": "Испробајте сада"
    },
    "useCases": {
      "title": "Направљено за различите потребе",
      "journalistsTitle": "За новинаре",
      "journalistsDescription": "Креирајте приче засноване на подацима са интерактивним графиконима који ангажују читаоце.",
      "journalistsCta": "Истражите демографију",
      "researchersTitle": "За истраживаче",
      "researchersDescription": "Анализирајте трендове у демографији, економији, здрављу и социјалним индикаторима.",
      "researchersCta": "Погледајте здравствене податке",
      "governmentTitle": "За владу",
      "governmentDescription": "Презентујте податке професионално грађанима са поузданим, званичним визуелизацијама.",
      "governmentCta": "Погледајте економске графиконе",
      "developersTitle": "За програмере",
      "developersDescription": "Клонирајте репозиторијум, прилагодите компоненте и поставите своју инстанцу.",
      "developersCta": "Погледајте на GitHub-у"
    },
    "hero": {
      "title": "Трансформишите податке српске владе у јасне визуелизације",
      "subtitle": "Без програмирања. Истражите буџете, демографију и јавне податке за минуте.",
      "tryDemo": "Испробајте демо",
      "viewGithub": "Погледајте на GitHub-у"
    }
  }
}
```

- [ ] **Step 3: Add Serbian Latin copy to lat/common.json**

Add to the `homepage` object in `src/lib/i18n/locales/lat/common.json`:

```json
{
  "homepage": {
    "...existing keys...",
    "socialProof": {
      "chartTypes": "Tipova grafikona",
      "serbianData": "Srpski podaci",
      "accessibility": "WCAG 2.1 AA",
      "openSource": "Otvoreni kod",
      "githubStars": "GitHub zvezdica"
    },
    "howItWorks": {
      "title": "Kako funkcioniše",
      "step1Title": "Izaberite skup podataka",
      "step1Description": "Pregledajte preko 3.400 skupova podataka srpske vlade iz oblasti demografije, ekonomije, zdravstva i drugih.",
      "step2Title": "Prilagodite grafikon",
      "step2Description": "Izaberite tip grafikona, boje, filtere i anotacije da ispričate svoju priču podataka.",
      "step3Title": "Podelite ili ugradite",
      "step3Description": "Izvezite kao sliku, podelite preko URL-a ili ugradite interaktivne grafikone na svoj sajt.",
      "tryIt": "Isprobajte sada"
    },
    "useCases": {
      "title": "Napravljeno za različite potrebe",
      "journalistsTitle": "Za novinare",
      "journalistsDescription": "Kreirajte priče zasnovane na podacima sa interaktivnim grafikonima koji angažuju čitaoce.",
      "journalistsCta": "Istražite demografiju",
      "researchersTitle": "Za istraživače",
      "researchersDescription": "Analizirajte trendove u demografiji, ekonomiji, zdravlju i socijalnim indikatorima.",
      "researchersCta": "Pogledajte zdravstvene podatke",
      "governmentTitle": "Za vladu",
      "governmentDescription": "Prezentujte podatke profesionalno građanima sa pouzdanim, zvaničnim vizuelizacijama.",
      "governmentCta": "Pogledajte ekonomske grafikone",
      "developersTitle": "Za programere",
      "developersDescription": "Klonirajte repozitorijum, prilagodite komponente i postavite svoju instancu.",
      "developersCta": "Pogledajte na GitHub-u"
    },
    "hero": {
      "title": "Transformišite podatke srpske vlade u jasne vizuelizacije",
      "subtitle": "Bez programiranja. Istražite budžete, demografiju i javne podatke za minute.",
      "tryDemo": "Isprobajte demo",
      "viewGithub": "Pogledajte na GitHub-u"
    }
  }
}
```

- [ ] **Step 4: Verify JSON is valid**

Run: `node -e "JSON.parse(require('fs').readFileSync('src/lib/i18n/locales/en/common.json'))"` for each locale
Expected: No errors

---

## Chunk 5: Modify Hero Section

### Task 5: Update HeroSectionAnimated with SocialProof and New CTAs

**Files:**

- Modify: `src/components/home/HeroSectionAnimated.tsx`

- [ ] **Step 1: Import SocialProof component**

Add to imports in `src/components/home/HeroSectionAnimated.tsx`:

```typescript
import { SocialProof } from './SocialProof';
```

- [ ] **Step 2: Update props interface to include new labels**

Update `HeroSectionAnimatedProps` interface:

```typescript
interface HeroSectionAnimatedProps {
  locale: Locale;
  title: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
  socialProof: {
    chartTypes: string;
    serbianData: string;
    accessibility: string;
    openSource: string;
    githubStars: string;
  };
}
```

- [ ] **Step 3: Add SocialProof above headline**

Insert after the opening `<section>` tag and before `<div className='relative z-10 px-8 py-12 md:py-16'>`:

```typescript
{/* Social Proof Bar */}
<div className='relative z-10 px-8 pt-8'>
  <SocialProof
    locale={locale}
    chartTypesLabel={socialProof.chartTypes}
    serbianDataLabel={socialProof.serbianData}
    accessibilityLabel={socialProof.accessibility}
    openSourceLabel={socialProof.openSource}
    githubStarsLabel={socialProof.githubStars}
  />
</div>
```

- [ ] **Step 4: Update CTA buttons to link to demo-gallery and GitHub**

Replace the existing CTA buttons section with:

```typescript
<div className='mt-8 flex flex-wrap gap-4'>
  <Link
    className='group inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-semibold text-gov-primary shadow-lg transition-all duration-200 hover:bg-gray-50 hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gov-primary'
    href={`/${locale}/demo-gallery`}
  >
    <Play className='h-4 w-4 transition-transform group-hover:scale-110' />
    {primaryCta}
  </Link>

  <a
    className='group inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/15 hover:border-white/40 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gov-primary'
    href='https://github.com/acailic/vizualni-admin'
    target='_blank'
    rel='noopener noreferrer'
  >
    <Github className='h-4 w-4' />
    {secondaryCta}
    <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
  </a>
</div>
```

- [ ] **Step 5: Import Github and Play icons**

Add to lucide-react import:

```typescript
import { ArrowRight, Play, Github, Code2 } from 'lucide-react';
```

(Remove `Search` if no longer used)

- [ ] **Step 6: Remove View Code button (keep it simple for journalists)**

Remove the "View Code" button that toggles code example - simplify for journalist audience.

- [ ] **Step 7: Verify component compiles**

Run: `npx tsc --noEmit src/components/home/HeroSectionAnimated.tsx`
Expected: No errors

---

## Chunk 6: Update Main Page

### Task 6: Update page.tsx with New Sections

**Files:**

- Modify: `src/app/[locale]/page.tsx`

- [ ] **Step 1: Import new components**

Update imports:

```typescript
import {
  FeaturedExamples,
  GettingStartedGuide,
  HeroSectionAnimated,
  HowItWorks,
  QuickStats,
  UseCases,
} from '@/components/home';
```

- [ ] **Step 2: Update HeroSectionAnimated props**

Update the HeroSectionAnimated component call to include socialProof:

```typescript
<HeroSectionAnimated
  locale={locale}
  title={messages.homepage.hero.title}
  subtitle={messages.homepage.hero.subtitle}
  primaryCta={messages.homepage.hero.tryDemo}
  secondaryCta={messages.homepage.hero.viewGithub}
  socialProof={{
    chartTypes: messages.homepage.socialProof.chartTypes,
    serbianData: messages.homepage.socialProof.serbianData,
    accessibility: messages.homepage.socialProof.accessibility,
    openSource: messages.homepage.socialProof.openSource,
    githubStars: messages.homepage.socialProof.githubStars,
  }}
/>
```

- [ ] **Step 3: Add HowItWorks section after QuickStats**

Insert after QuickStats:

```typescript
{/* How It Works Section */}
<HowItWorks
  locale={locale}
  sectionTitle={messages.homepage.howItWorks.title}
  step1Title={messages.homepage.howItWorks.step1Title}
  step1Description={messages.homepage.howItWorks.step1Description}
  step2Title={messages.homepage.howItWorks.step2Title}
  step2Description={messages.homepage.howItWorks.step2Description}
  step3Title={messages.homepage.howItWorks.step3Title}
  step3Description={messages.homepage.howItWorks.step3Description}
  tryItLabel={messages.homepage.howItWorks.tryIt}
/>
```

- [ ] **Step 4: Add UseCases section before GettingStartedGuide**

Insert before GettingStartedGuide:

```typescript
{/* Use Cases Section */}
<UseCases
  locale={locale}
  sectionTitle={messages.homepage.useCases.title}
  journalistsTitle={messages.homepage.useCases.journalistsTitle}
  journalistsDescription={messages.homepage.useCases.journalistsDescription}
  journalistsCta={messages.homepage.useCases.journalistsCta}
  researchersTitle={messages.homepage.useCases.researchersTitle}
  researchersDescription={messages.homepage.useCases.researchersDescription}
  researchersCta={messages.homepage.useCases.researchersCta}
  governmentTitle={messages.homepage.useCases.governmentTitle}
  governmentDescription={messages.homepage.useCases.governmentDescription}
  governmentCta={messages.homepage.useCases.governmentCta}
  developersTitle={messages.homepage.useCases.developersTitle}
  developersDescription={messages.homepage.useCases.developersDescription}
  developersCta={messages.homepage.useCases.developersCta}
/>
```

- [ ] **Step 5: Verify page compiles**

Run: `npx tsc --noEmit src/app/\\[locale\\]/page.tsx`
Expected: No errors

---

## Chunk 7: Final Verification

### Task 7: Build and Test

- [ ] **Step 1: Run full TypeScript check**

Run: `npm run type-check` or `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 2: Run linter**

Run: `npm run lint`
Expected: No errors

- [ ] **Step 3: Build the application**

Run: `npm run build`
Expected: Build completes successfully

- [ ] **Step 4: Test locally**

Run: `npm run dev`
Open: http://localhost:3000/sr-Cyrl, http://localhost:3000/sr-Latn, http://localhost:3000/en
Verify:

- Social proof bar displays correctly
- HowItWorks section shows 3 steps
- UseCases section shows 4 cards
- CTAs link to correct destinations
- All text is in correct language

- [ ] **Step 5: Commit changes**

```bash
git add .
git commit -m "feat: add marketing landing page components"
```

---

## Verification Checklist

- [ ] Landing page clearly communicates value to journalists
- [ ] Primary CTA ("Try Demo") links to `/[locale]/demo-gallery`
- [ ] Secondary CTA ("View on GitHub") links to GitHub repo
- [ ] Social proof badges display correctly
- [ ] GitHub stars badge only shows if ≥ 50 stars
- [ ] HowItWorks shows 3 clear steps with icons
- [ ] UseCases shows 4 audience cards with working links
- [ ] All copy available in Serbian (Cyrillic and Latin) and English
- [ ] Page builds without errors
- [ ] WCAG 2.1 AA compliance maintained (semantic HTML, ARIA labels)
