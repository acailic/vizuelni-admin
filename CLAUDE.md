# Vizuelni Admin Srbije - Project Instructions

## Design Context

### Users

- **Primary**: Serbian citizens accessing government data for personal/professional use
- **Secondary**: Journalists and researchers analyzing administrative data trends
- **Tertiary**: Government officials presenting or exploring data insights
- **Context**: Users are often task-focused, making data-driven decisions in professional environments. They need clarity and trustworthiness over novelty.

### Brand Personality

- **Trustworthy** - Institutional reliability, data accuracy, government legitimacy
- **Modern** - Contemporary UX patterns, clean interfaces, not old-fashioned
- **Accessible** - WCAG 2.1 AA baseline, works for all citizens regardless of ability

### Aesthetic Direction

- **Swiss-inspired government design** - Reference visualize.admin.ch for functional elegance
- **Serbian national identity** - Blue (#0D4077, #1a5290), Red (#C6363C), White as accent palette
- **Light mode primary** - Focus design effort on light theme; dark mode is secondary
- **Data as hero** - Charts, maps, and tables are the core experience
- **Functional minimalism** - Every element must earn its place; avoid decoration

### Anti-References (Avoid)

- Overly ornate or decorative elements that feel old-fashioned
- Playful/startup aesthetics (bright gradients, quirky illustrations, casual tone)
- Generic corporate blue that lacks character

### Design Principles

1. **Clarity over cleverness** - Users should understand data immediately; avoid clever visualizations that require explanation
2. **Serbian identity with restraint** - National colors as accents, not overwhelming; professional, not patriotic displays
3. **Accessibility is baseline** - WCAG 2.1 AA is the minimum; consider colorblindness, reduced motion, screen readers in every component
4. **Professional and trustworthy** - Every interaction should reinforce government legitimacy; avoid casual microcopy or trendy animations
5. **Functional elegance** - Swiss-inspired minimalism where every pixel serves a purpose; white space is intentional

### Typography Stack

- **Body**: IBM Plex Sans - Swiss-inspired, excellent Cyrillic support, distinctive
- **Headings**: IBM Plex Sans (bold) or Noto Serif - authoritative, distinctive for government feel
- **Code/Data**: JetBrains Mono or IBM Plex Mono - monospace for precision in data display

### Color System

- **Primary**: Serbian Blue (`#0D4077`) - main brand color, trust, authority
- **Secondary**: Lighter Blue (`#1a5290`, `#4B90F5`) - interactive elements, links
- **Accent**: Serbian Red (`#C6363C`) - sparingly for emphasis, alerts, important markers
- **Neutrals**: Slate scale for backgrounds, text, borders - professional and calm
- **Data Visualization**: Distinct palettes with colorblind-safe options (Viridis, Okabe-Ito)

### Spacing & Layout

- **8px base unit** - All spacing is multiples of 8px
- **Generous white space** - Let data breathe; avoid cramped interfaces
- **Consistent container widths** - max-w-7xl for content areas
- **Sidebar + main layout** - Persistent navigation with flexible content area
