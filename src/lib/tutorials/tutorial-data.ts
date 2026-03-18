/**
 * Tutorial Data and Registry
 * All tutorial content for the Visual Admin Serbia platform
 */

import { Tutorial, TutorialPath, TutorialPathInfo } from './types';

// ============================================================
// LEARNING PATHS
// ============================================================

export const TUTORIAL_PATHS: TutorialPathInfo[] = [
  {
    id: 'citizen',
    name: {
      en: 'Citizen Explorer',
      sr: 'Грађанин истраживач',
      srLat: 'Građanin istraživač',
    },
    description: {
      en: 'Learn how to explore and understand government data as a citizen',
      sr: 'Научите како да истражујете и разумете податке владе као грађанин',
      srLat:
        'Naučite kako da istražujete i razumete podatke vlade kao građanin',
    },
    icon: '👤',
    estimatedTime: 20,
    skillLevel: 'beginner',
  },
  {
    id: 'developer',
    name: {
      en: 'Developer',
      sr: 'Програмер',
      srLat: 'Programer',
    },
    description: {
      en: 'Learn to build applications using the Visual Admin API and embed charts',
      sr: 'Научите да правите апликације користећи Визуелни Админ API и уграђујете графиконе',
      srLat:
        'Naučite da pravite aplikacije koristeći Vizuelni Admin API i ugrađujete grafikone',
    },
    icon: '💻',
    estimatedTime: 45,
    skillLevel: 'intermediate',
  },
  {
    id: 'government',
    name: {
      en: 'Government Official',
      sr: 'Владин званичник',
      srLat: 'Vladin zvaničnik',
    },
    description: {
      en: 'Learn to create professional reports and presentations from government data',
      sr: 'Научите да правите професионалне извештаје и презентације од владиних података',
      srLat:
        'Naučite da pravite profesionalne izveštaje i prezentacije od vladinih podataka',
    },
    icon: '🏛️',
    estimatedTime: 30,
    skillLevel: 'intermediate',
  },
  {
    id: 'journalist',
    name: {
      en: 'Journalist',
      sr: 'Новинар',
      srLat: 'Novinar',
    },
    description: {
      en: 'Learn to find stories in data and create visualizations for publication',
      sr: 'Научите да проналазите приче у подацима и креирате визуализације за објављивање',
      srLat:
        'Naučite da pronalazite priče u podacima i kreirate vizualizacije za objavljivanje',
    },
    icon: '📰',
    estimatedTime: 35,
    skillLevel: 'intermediate',
  },
];

// ============================================================
// CITIZEN TUTORIALS
// ============================================================

const citizenTutorials: Tutorial[] = [
  {
    id: 'citizen-welcome',
    path: 'citizen',
    order: 1,
    title: {
      en: 'Welcome to Visual Admin Serbia',
      sr: 'Добродошли у Визуелни Админ Србије',
      srLat: 'Dobrodošli u Vizuelni Admin Srbije',
    },
    description: {
      en: 'Get started with exploring Serbian government data',
      sr: 'Започните истраживање података владе Србије',
      srLat: 'Započnite istraživanje podataka vlade Srbije',
    },
    steps: [
      {
        id: 'welcome-1',
        order: 1,
        target: {
          selector: '[data-tutorial="main-nav"]',
          position: 'bottom',
        },
        content: {
          title: {
            en: 'Main Navigation',
            sr: 'Главна навигација',
            srLat: 'Glavna navigacija',
          },
          description: {
            en: 'Use the main navigation to browse different sections of the platform.',
            sr: 'Користите главну навигацију да прегледате различите секције платформе.',
            srLat:
              'Koristite glavnu navigaciju da pregledate različite sekcije platforme.',
          },
        },
      },
      {
        id: 'welcome-2',
        order: 2,
        target: {
          selector: '[data-tutorial="language-switcher"]',
          position: 'bottom',
        },
        content: {
          title: {
            en: 'Language Selection',
            sr: 'Избор језика',
            srLat: 'Izbor jezika',
          },
          description: {
            en: 'Switch between Serbian Cyrillic, Serbian Latin, and English at any time.',
            sr: 'Пребаците се између српске ћирилице, латинице и енглеског.',
            srLat: 'Prebacite se između srpske ćirilice, latinice i engleskog.',
          },
        },
      },
    ],
    duration: 5,
    triggers: { firstVisit: true, manual: true },
    isActive: true,
    isFeatured: true,
  },
  {
    id: 'citizen-browse-data',
    path: 'citizen',
    order: 2,
    title: {
      en: 'Browsing Public Data',
      sr: 'Преглед јавних података',
      srLat: 'Pregled javnih podataka',
    },
    description: {
      en: 'Learn how to find and explore datasets from Serbian government sources',
      sr: 'Научите како да пронађете скупове података из извора владе Србије',
      srLat:
        'Naučite kako da pronađete skupove podataka iz izvora vlade Srbije',
    },
    steps: [
      {
        id: 'browse-1',
        order: 1,
        content: {
          title: {
            en: 'Data Browser',
            sr: 'Прегледач података',
            srLat: 'Pregledač podataka',
          },
          description: {
            en: 'The data browser shows all available datasets from data.gov.rs.',
            sr: 'Прегледач података приказује све скупове података са data.gov.rs.',
            srLat:
              'Pregledač podataka prikazuje sve skupove podataka sa data.gov.rs.',
          },
        },
      },
    ],
    duration: 7,
    prerequisites: ['citizen-welcome'],
    triggers: { route: '/browse', manual: true },
    isActive: true,
  },
];

// ============================================================
// DEVELOPER TUTORIALS
// ============================================================

const developerTutorials: Tutorial[] = [
  {
    id: 'dev-embed-charts',
    path: 'developer',
    order: 1,
    title: {
      en: 'Embedding Charts',
      sr: 'Уграђивање графикона',
      srLat: 'Ugrađivanje grafikona',
    },
    description: {
      en: 'Learn how to embed Visual Admin charts in your websites',
      sr: 'Научите како да уградите графиконе у ваше веб сајтове',
      srLat: 'Naučite kako da ugradite grafikone u vaše veb sajtove',
    },
    steps: [
      {
        id: 'embed-1',
        order: 1,
        content: {
          title: {
            en: 'Embed Code',
            sr: 'Код за уградњу',
            srLat: 'Kod za ugradnju',
          },
          description: {
            en: 'Any chart can be embedded using an iframe or API.',
            sr: 'Сваки графикон може бити уграђен користећи iframe или API.',
            srLat: 'Svaki grafikon može biti ugrađen koristeći iframe ili API.',
          },
          codeExample: {
            language: 'html',
            code: '<iframe src="/embed/chart/abc123" width="100%" height="500"></iframe>',
          },
        },
      },
    ],
    duration: 15,
    badges: ['api-basics'],
    triggers: { manual: true },
    isActive: true,
    isFeatured: true,
  },
];

// ============================================================
// GOVERNMENT TUTORIALS
// ============================================================

const governmentTutorials: Tutorial[] = [
  {
    id: 'gov-dashboards',
    path: 'government',
    order: 1,
    title: {
      en: 'Creating Dashboards',
      sr: 'Креирање контролне табле',
      srLat: 'Kreiranje kontrolne table',
    },
    description: {
      en: 'Learn to create professional dashboards from government data',
      sr: 'Научите да правите професионалне контролне табеле од владиних података',
      srLat:
        'Naučite da pravite profesionalne kontrolne table od vladinih podataka',
    },
    steps: [
      {
        id: 'dash-1',
        order: 1,
        content: {
          title: {
            en: 'Dashboard Builder',
            sr: 'Креатор табле',
            srLat: 'Kreator table',
          },
          description: {
            en: 'Combine multiple charts into an interactive dashboard.',
            sr: 'Комбинујте више графикона у интерактивну контролну таблу.',
            srLat: 'Kombinujte više grafikona u interaktivnu kontrolnu tablu.',
          },
        },
      },
    ],
    duration: 20,
    triggers: { manual: true },
    isActive: true,
    isFeatured: true,
  },
];

// ============================================================
// JOURNALIST TUTORIALS
// ============================================================

const journalistTutorials: Tutorial[] = [
  {
    id: 'journalist-data-stories',
    path: 'journalist',
    order: 1,
    title: {
      en: 'Finding Data Stories',
      sr: 'Проналажење прича у подацима',
      srLat: 'Pronalaženje priča u podacima',
    },
    description: {
      en: 'Learn to identify newsworthy trends and patterns in government data',
      sr: 'Научите да препознате вредне трендове и обрасце у владиним подацима',
      srLat:
        'Naučite da prepoznate vredne trendove i obrasce u vladinim podacima',
    },
    steps: [
      {
        id: 'story-1',
        order: 1,
        content: {
          title: {
            en: 'Data Exploration',
            sr: 'Истраживање података',
            srLat: 'Istraživanje podataka',
          },
          description: {
            en: 'Use filters and visualizations to find interesting patterns.',
            sr: 'Користите филтере и визуализације да пронађете занимљиве обрасце.',
            srLat:
              'Koristite filtere i vizualizacije da pronađete zanimljive obrasce.',
          },
        },
      },
    ],
    duration: 15,
    triggers: { manual: true },
    isActive: true,
    isFeatured: true,
  },
];

// ============================================================
// ALL TUTORIALS COMBINED
// ============================================================

const ALL_TUTORIALS: Tutorial[] = [
  ...citizenTutorials,
  ...developerTutorials,
  ...governmentTutorials,
  ...journalistTutorials,
];

// ============================================================
// EXPORT FUNCTIONS
// ============================================================

export function getAllTutorials(): Tutorial[] {
  return ALL_TUTORIALS;
}

export function getTutorialsByPath(path: TutorialPath): Tutorial[] {
  return ALL_TUTORIALS.filter((t) => t.path === path).sort(
    (a, b) => a.order - b.order
  );
}

export function getTutorialById(id: string): Tutorial | undefined {
  return ALL_TUTORIALS.find((t) => t.id === id);
}

export function getFeaturedTutorials(): Tutorial[] {
  return ALL_TUTORIALS.filter((t) => t.isFeatured && t.isActive);
}

export function getPathInfo(path: TutorialPath): TutorialPathInfo | undefined {
  return TUTORIAL_PATHS.find((p) => p.id === path);
}

export function getAllPaths(): TutorialPathInfo[] {
  return TUTORIAL_PATHS;
}
