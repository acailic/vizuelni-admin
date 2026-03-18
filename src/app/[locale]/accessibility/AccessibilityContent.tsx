'use client';

import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';

interface AccessibilityContentProps {
  locale: Locale;
}

export function AccessibilityContent({ locale }: AccessibilityContentProps) {
  const isSr = locale === 'sr-Cyrl' || locale === 'sr-Latn';

  return (
    <main className='container-custom py-12' id='main-content'>
      <article className='mx-auto max-w-3xl space-y-8'>
        <header>
          <h1 className='text-4xl font-bold tracking-tight text-slate-900 dark:text-white'>
            {isSr ? 'Изјава о приступачности' : 'Accessibility Statement'}
          </h1>
          <p className='mt-4 text-lg text-slate-600 dark:text-slate-400'>
            {isSr
              ? 'Наша посвећеност дигиталној приступачности за грађане Србије'
              : 'Our commitment to digital accessibility for citizens of Serbia'}
          </p>
          <p className='mt-2 text-sm text-slate-500 dark:text-slate-500'>
            <Link
              href={`/${locale}/guide/chart-types`}
              className='text-gov-primary hover:underline'
            >
              {isSr
                ? 'Погледајте такође: Водич за типове графикона'
                : 'See also: Chart Types Guide'}
            </Link>
          </p>
        </header>

        {/* Nivo усаглашености */}
        <section aria-labelledby='compliance-level'>
          <h2
            id='compliance-level'
            className='text-2xl font-semibold text-slate-900 dark:text-white'
          >
            {isSr ? 'Ниво усаглашености' : 'Compliance Level'}
          </h2>
          <p className='mt-3 text-slate-700 leading-relaxed dark:text-slate-300'>
            {isSr
              ? 'Ова платформа тежи усаглашености са стандардом WCAG 2.1 Level AA (Web Content Accessibility Guidelines). Континуирано радимо на томе да осигурамо да наше визуелизације и подаци буду приступачни свим грађанима Србије.'
              : 'This platform aims to conform to WCAG 2.1 Level AA (Web Content Accessibility Guidelines). We continuously work to ensure our visualizations and data are accessible to all citizens of Serbia.'}
          </p>
        </section>

        {/* Шта је подржано */}
        <section aria-labelledby='supported-features'>
          <h2
            id='supported-features'
            className='text-2xl font-semibold text-slate-900 dark:text-white'
          >
            {isSr ? 'Подржане функције' : 'Supported Features'}
          </h2>
          <ul className='mt-4 space-y-3 text-slate-700 dark:text-slate-300'>
            <li className='flex items-start gap-3 rounded-lg bg-green-50 p-3 dark:bg-green-900/30'>
              <span className='text-green-600 dark:text-green-400 text-lg'>
                ✓
              </span>
              <div>
                <strong>
                  {isSr ? 'Навигација тастатуром' : 'Keyboard Navigation'}
                </strong>
                <p className='mt-1 text-sm'>
                  {isSr
                    ? 'Сви интерактивни елементи су доступни преко тастатуре (Tab, Shift+Tab, Enter, Space, Escape, стрелице).'
                    : 'All interactive elements are accessible via keyboard (Tab, Shift+Tab, Enter, Space, Escape, arrow keys).'}
                </p>
              </div>
            </li>
            <li className='flex items-start gap-3 rounded-lg bg-green-50 p-3 dark:bg-green-900/30'>
              <span className='text-green-600 dark:text-green-400 text-lg'>
                ✓
              </span>
              <div>
                <strong>
                  {isSr
                    ? 'Табела алтернатива за графиконе'
                    : 'Chart Table Alternative'}
                </strong>
                <p className='mt-1 text-sm'>
                  {isSr
                    ? 'Сваки графикон има дугме „Прикажи као табелу" које приказује податке у формату оптимизованом за читаче екрана.'
                    : 'Every chart has a "Show as table" button that displays data in a format optimized for screen readers.'}
                </p>
              </div>
            </li>
            <li className='flex items-start gap-3 rounded-lg bg-green-50 p-3 dark:bg-green-900/30'>
              <span className='text-green-600 dark:text-green-400 text-lg'>
                ✓
              </span>
              <div>
                <strong>{isSr ? 'ARIA ознаке' : 'ARIA Labels'}</strong>
                <p className='mt-1 text-sm'>
                  {isSr
                    ? 'Графикони имају aria-label и aria-describedby атрибуте са описом типа графика и садржаја.'
                    : 'Charts have aria-label and aria-describedby attributes describing chart type and content.'}
                </p>
              </div>
            </li>
            <li className='flex items-start gap-3 rounded-lg bg-green-50 p-3 dark:bg-green-900/30'>
              <span className='text-green-600 dark:text-green-400 text-lg'>
                ✓
              </span>
              <div>
                <strong>{isSr ? 'Контраст боја' : 'Color Contrast'}</strong>
                <p className='mt-1 text-sm'>
                  {isSr
                    ? 'Све боје испуњавају WCAG AA стандард (однос контраста ≥4.5:1 за текст, ≥3:1 за графичке елементе).'
                    : 'All colors meet WCAG AA standard (contrast ratio ≥4.5:1 for text, ≥3:1 for graphical elements).'}
                </p>
              </div>
            </li>
            <li className='flex items-start gap-3 rounded-lg bg-green-50 p-3 dark:bg-green-900/30'>
              <span className='text-green-600 dark:text-green-400 text-lg'>
                ✓
              </span>
              <div>
                <strong>
                  {isSr
                    ? 'Поштовање подешавања покрета'
                    : 'Reduced Motion Support'}
                </strong>
                <p className='mt-1 text-sm'>
                  {isSr
                    ? 'Платформа поштује системско подешавање prefers-reduced-motion. Анимације су онемогућене када је ова опција активна.'
                    : 'Platform respects prefers-reduced-motion system setting. Animations are disabled when this option is active.'}
                </p>
              </div>
            </li>
            <li className='flex items-start gap-3 rounded-lg bg-green-50 p-3 dark:bg-green-900/30'>
              <span className='text-green-600 dark:text-green-400 text-lg'>
                ✓
              </span>
              <div>
                <strong>
                  {isSr ? 'Палете за далтонисте' : 'Colorblind-Safe Palettes'}
                </strong>
                <p className='mt-1 text-sm'>
                  {isSr
                    ? 'Доступне палете Okabe-Ito, Viridis, Plasma и Inferno, оптимизоване за deuteranopia, protanopia и tritanopia.'
                    : 'Available palettes: Okabe-Ito, Viridis, Plasma, and Inferno, optimized for deuteranopia, protanopia, and tritanopia.'}
                </p>
              </div>
            </li>
            <li className='flex items-start gap-3 rounded-lg bg-green-50 p-3 dark:bg-green-900/30'>
              <span className='text-green-600 dark:text-green-400 text-lg'>
                ✓
              </span>
              <div>
                <strong>
                  {isSr ? 'Шаблони за категорије' : 'Pattern Overlays'}
                </strong>
                <p className='mt-1 text-sm'>
                  {isSr
                    ? 'Графикони могу користити шаблоне (линије, тачке, косе линије) поред боја за разликовање категорија.'
                    : 'Charts can use patterns (lines, dots, diagonals) in addition to colors for distinguishing categories.'}
                </p>
              </div>
            </li>
          </ul>
        </section>

        {/* Навигација тастатуром */}
        <section aria-labelledby='keyboard-nav'>
          <h2
            id='keyboard-nav'
            className='text-2xl font-semibold text-slate-900 dark:text-white'
          >
            {isSr ? 'Навигација тастатуром' : 'Keyboard Navigation'}
          </h2>
          <p className='mt-3 text-slate-700 leading-relaxed dark:text-slate-300'>
            {isSr
              ? 'Сви интерактивни елементи могу се приступити помоћу тастатуре. Користите Tab за кретање између елемената, Enter или Space за активацију дугмади, и Escape за затварање дијалога.'
              : 'All interactive elements can be accessed using a keyboard. Use Tab to navigate between elements, Enter or Space to activate buttons, and Escape to close dialogs.'}
          </p>
          <table className='mt-4 w-full border-collapse'>
            <thead>
              <tr className='border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800'>
                <th
                  scope='col'
                  className='px-4 py-2 text-left font-semibold text-slate-700 dark:text-slate-300'
                >
                  {isSr ? 'Тастер' : 'Key'}
                </th>
                <th
                  scope='col'
                  className='px-4 py-2 text-left font-semibold text-slate-700 dark:text-slate-300'
                >
                  {isSr ? 'Акција' : 'Action'}
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-200 dark:divide-slate-700'>
              <tr>
                <td className='px-4 py-2'>
                  <kbd className='rounded bg-slate-100 px-2 py-1 font-mono text-sm dark:bg-slate-700'>
                    Tab
                  </kbd>
                </td>
                <td className='px-4 py-2 text-slate-700 dark:text-slate-300'>
                  {isSr
                    ? 'Прелазак на следећи интерактивни елемент'
                    : 'Move to next interactive element'}
                </td>
              </tr>
              <tr>
                <td className='px-4 py-2'>
                  <kbd className='rounded bg-slate-100 px-2 py-1 font-mono text-sm dark:bg-slate-700'>
                    Shift + Tab
                  </kbd>
                </td>
                <td className='px-4 py-2 text-slate-700 dark:text-slate-300'>
                  {isSr
                    ? 'Повратак на претходни елемент'
                    : 'Move to previous element'}
                </td>
              </tr>
              <tr>
                <td className='px-4 py-2'>
                  <kbd className='rounded bg-slate-100 px-2 py-1 font-mono text-sm dark:bg-slate-700'>
                    Enter / Space
                  </kbd>
                </td>
                <td className='px-4 py-2 text-slate-700 dark:text-slate-300'>
                  {isSr
                    ? 'Активирање дугмади и линкова'
                    : 'Activate buttons and links'}
                </td>
              </tr>
              <tr>
                <td className='px-4 py-2'>
                  <kbd className='rounded bg-slate-100 px-2 py-1 font-mono text-sm dark:bg-slate-700'>
                    ← → ↑ ↓
                  </kbd>
                </td>
                <td className='px-4 py-2 text-slate-700 dark:text-slate-300'>
                  {isSr
                    ? 'Навигација између тачака података на графикону'
                    : 'Navigate between chart data points'}
                </td>
              </tr>
              <tr>
                <td className='px-4 py-2'>
                  <kbd className='rounded bg-slate-100 px-2 py-1 font-mono text-sm dark:bg-slate-700'>
                    Home
                  </kbd>
                </td>
                <td className='px-4 py-2 text-slate-700 dark:text-slate-300'>
                  {isSr ? 'Прва тачка података' : 'First data point'}
                </td>
              </tr>
              <tr>
                <td className='px-4 py-2'>
                  <kbd className='rounded bg-slate-100 px-2 py-1 font-mono text-sm dark:bg-slate-700'>
                    End
                  </kbd>
                </td>
                <td className='px-4 py-2 text-slate-700 dark:text-slate-300'>
                  {isSr ? 'Последња тачка података' : 'Last data point'}
                </td>
              </tr>
              <tr>
                <td className='px-4 py-2'>
                  <kbd className='rounded bg-slate-100 px-2 py-1 font-mono text-sm dark:bg-slate-700'>
                    Escape
                  </kbd>
                </td>
                <td className='px-4 py-2 text-slate-700 dark:text-slate-300'>
                  {isSr
                    ? 'Затварање дијалога и tooltip-ова'
                    : 'Close dialogs and tooltips'}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Приступачни графикони */}
        <section aria-labelledby='accessible-charts'>
          <h2
            id='accessible-charts'
            className='text-2xl font-semibold text-slate-900 dark:text-white'
          >
            {isSr ? 'Приступачни графикони' : 'Accessible Charts'}
          </h2>
          <p className='mt-3 text-slate-700 leading-relaxed dark:text-slate-300'>
            {isSr
              ? 'Сваки графикон на овој платформи укључује приступачну табелу података. Кликните на дугме „Прикажи као табелу" да бисте видели податке у формату оптимизованом за читаче екрана.'
              : 'Every chart on this platform includes an accessible data table. Click the "Show as table" button to view data in a format optimized for screen readers.'}
          </p>
          <div className='mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/30'>
            <h3 className='font-semibold text-blue-900 dark:text-blue-200'>
              {isSr
                ? 'Шта садржи приступачни графикон'
                : 'What accessible charts include'}
            </h3>
            <ul className='mt-2 space-y-2 text-sm text-blue-800 dark:text-blue-300'>
              <li>
                •{' '}
                {isSr
                  ? 'ARIA ознаке описују тип графика и садржај'
                  : 'ARIA labels describe chart type and content'}
              </li>
              <li>
                •{' '}
                {isSr
                  ? 'Резиме података укључује највишу, најнижу и просечну вредност'
                  : 'Data summary includes highest, lowest, and average values'}
              </li>
              <li>
                •{' '}
                {isSr
                  ? 'Информације о тренду када је применљиво (растући/опадајући)'
                  : 'Trend information where applicable (increasing/decreasing)'}
              </li>
              <li>
                •{' '}
                {isSr
                  ? 'Skip link за директан прелазак на табелу'
                  : 'Skip link for direct navigation to table'}
              </li>
            </ul>
          </div>
        </section>

        {/* Приступачност боја */}
        <section aria-labelledby='color-palettes'>
          <h2
            id='color-palettes'
            className='text-2xl font-semibold text-slate-900 dark:text-white'
          >
            {isSr ? 'Приступачност боја' : 'Color Accessibility'}
          </h2>
          <p className='mt-3 text-slate-700 leading-relaxed dark:text-slate-300'>
            {isSr
              ? 'Обезбеђујемо вишеструке опције палета боја дизајниране за различите типове недостатка вида у боји. Промените палету у конфигурацији графика да бисте пронашли ону која вам највише одговара.'
              : 'We provide multiple color palette options designed for different types of color vision deficiency. Switch palettes in chart configuration to find one that works best for you.'}
          </p>
          <div className='mt-4 grid gap-4 sm:grid-cols-2'>
            <div className='rounded-lg border border-slate-200 p-4 dark:border-slate-700'>
              <h3 className='font-semibold text-slate-900 dark:text-white'>
                {isSr ? 'Палете за далтонисте' : 'Colorblind-Safe Palettes'}
              </h3>
              <ul className='mt-2 text-sm text-slate-600 dark:text-slate-400 space-y-1'>
                <li>
                  • <strong>Okabe-Ito</strong> —{' '}
                  {isSr
                    ? 'оптимизована за све типове'
                    : 'optimized for all types'}
                </li>
                <li>
                  • <strong>Viridis</strong> —{' '}
                  {isSr ? 'перцептивно униформна' : 'perceptually uniform'}
                </li>
                <li>
                  • <strong>Plasma</strong> —{' '}
                  {isSr ? 'за секвенцијалне податке' : 'for sequential data'}
                </li>
              </ul>
            </div>
            <div className='rounded-lg border border-slate-200 p-4 dark:border-slate-700'>
              <h3 className='font-semibold text-slate-900 dark:text-white'>
                {isSr ? 'Шаблони као алтернатива' : 'Pattern Alternatives'}
              </h3>
              <p className='mt-2 text-sm text-slate-600 dark:text-slate-400'>
                {isSr
                  ? 'Графикони могу користити шаблоне (линије, тачке, косе линије) поред боја за категорије и регионе.'
                  : 'Charts can use patterns (lines, dots, diagonals) in addition to colors for categories and regions.'}
              </p>
            </div>
          </div>
        </section>

        {/* Смањени покрет */}
        <section aria-labelledby='motion-preferences'>
          <h2
            id='motion-preferences'
            className='text-2xl font-semibold text-slate-900 dark:text-white'
          >
            {isSr ? 'Смањени покрет' : 'Reduced Motion'}
          </h2>
          <p className='mt-3 text-slate-700 leading-relaxed dark:text-slate-300'>
            {isSr
              ? 'Ако преферирате смањене анимације, ова платформа поштује ваша системска подешавања. Омогућите „Смањи покрет" у подешавањима оперативног система, и све анимације графика ће бити онемогућене.'
              : 'If you prefer reduced motion, this platform respects your system preferences. Enable "Reduce motion" in your operating system settings, and all chart animations will be disabled.'}
          </p>
          <p className='mt-2 text-sm text-slate-500 dark:text-slate-500'>
            {isSr
              ? 'Подржано путем CSS media query-а prefers-reduced-motion.'
              : 'Supported via CSS media query prefers-reduced-motion.'}
          </p>
        </section>

        {/* Позната ограничења */}
        <section aria-labelledby='known-limitations'>
          <h2
            id='known-limitations'
            className='text-2xl font-semibold text-slate-900 dark:text-white'
          >
            {isSr ? 'Позната ограничења' : 'Known Limitations'}
          </h2>
          <ul className='mt-3 space-y-2 text-slate-700 dark:text-slate-300'>
            <li className='flex items-start gap-2'>
              <span className='text-amber-500'>⚠</span>
              {isSr
                ? 'Неке карте трећих страна могу имати проблема са контрастом боја'
                : 'Some third-party map tiles may have color contrast issues'}
            </li>
            <li className='flex items-start gap-2'>
              <span className='text-amber-500'>⚠</span>
              {isSr
                ? 'Сложени графикони са више серија могу бити тешки за навигацију без читача екрана'
                : 'Complex multi-series charts may be difficult to navigate without a screen reader'}
            </li>
            <li className='flex items-start gap-2'>
              <span className='text-amber-500'>⚠</span>
              {isSr
                ? 'Историјске табеле података могу садржати скраћенице без проширења'
                : 'Historical data tables may contain abbreviations without expansions'}
            </li>
            <li className='flex items-start gap-2'>
              <span className='text-amber-500'>⚠</span>
              {isSr
                ? 'Графикони расејања и мехурићи имају ограничену подршку за читаче екрана — користите табелу алтернативу'
                : 'Scatter and bubble charts have limited screen reader support — use table alternative'}
            </li>
          </ul>
        </section>

        {/* Обим тестирања */}
        <section aria-labelledby='testing-scope'>
          <h2
            id='testing-scope'
            className='text-2xl font-semibold text-slate-900 dark:text-white'
          >
            {isSr ? 'Обим тестирања' : 'Testing Scope'}
          </h2>
          <p className='mt-3 text-slate-700 leading-relaxed dark:text-slate-300'>
            {isSr
              ? 'Приступачност се тестира на следећим комбинацијама прегледача и помоћних технологија:'
              : 'Accessibility is tested on the following browser and assistive technology combinations:'}
          </p>
          <div className='mt-4 grid gap-4 sm:grid-cols-2'>
            <div className='rounded-lg border border-slate-200 p-4 dark:border-slate-700'>
              <h3 className='font-semibold text-slate-900 dark:text-white'>
                {isSr ? 'Прегледачи' : 'Browsers'}
              </h3>
              <ul className='mt-2 text-sm text-slate-600 dark:text-slate-400 space-y-1'>
                <li>• Chrome (последње 2 верзије)</li>
                <li>• Firefox (последње 2 верзије)</li>
                <li>• Safari (последње 2 верзије)</li>
                <li>• Edge (последње 2 верзије)</li>
              </ul>
            </div>
            <div className='rounded-lg border border-slate-200 p-4 dark:border-slate-700'>
              <h3 className='font-semibold text-slate-900 dark:text-white'>
                {isSr ? 'Помоћне технологије' : 'Assistive Technologies'}
              </h3>
              <ul className='mt-2 text-sm text-slate-600 dark:text-slate-400 space-y-1'>
                <li>• NVDA (Windows)</li>
                <li>• JAWS (Windows)</li>
                <li>• VoiceOver (macOS, iOS)</li>
                <li>• TalkBack (Android)</li>
              </ul>
            </div>
          </div>
          <p className='mt-4 text-sm text-slate-500 dark:text-slate-500'>
            {isSr
              ? 'Аутоматско тестирање: axe-core, Lighthouse. Ручно тестирање: тастатурна навигација, читачи екрана.'
              : 'Automated testing: axe-core, Lighthouse. Manual testing: keyboard navigation, screen readers.'}
          </p>
        </section>

        {/* Пријава проблема */}
        <section aria-labelledby='feedback'>
          <h2
            id='feedback'
            className='text-2xl font-semibold text-slate-900 dark:text-white'
          >
            {isSr
              ? 'Пријавите проблем приступачности'
              : 'Report an Accessibility Issue'}
          </h2>
          <p className='mt-3 text-slate-700 leading-relaxed dark:text-slate-300'>
            {isSr
              ? 'Посвећени смо пружању приступачног искуства за све кориснике. Ако наиђете на баријере или имате предлоге за побољшање, контактирајте нас.'
              : 'We are committed to providing an accessible experience for all users. If you encounter barriers or have suggestions for improvement, please contact us.'}
          </p>
          <div className='mt-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-800'>
            <p className='font-semibold text-slate-900 dark:text-white'>
              {isSr ? 'Начини контакта:' : 'Contact Methods:'}
            </p>
            <ul className='mt-2 space-y-1 text-slate-700 dark:text-slate-300'>
              <li>
                {isSr ? 'GitHub Issues' : 'GitHub Issues'}:{' '}
                <a
                  href='https://github.com/acailic/vizuelni-admin/issues'
                  className='text-gov-primary hover:underline'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  github.com/acailic/vizuelni-admin/issues
                </a>
              </li>
            </ul>
            <p className='mt-3 text-xs text-slate-500 dark:text-slate-500'>
              {isSr
                ? 'Напомена: Горњи контакт подаци су примери. За стварне контакнете погледајте страницу „О нама".'
                : 'Note: The contact information above are examples. For actual contacts, see the About page.'}
            </p>
          </div>
        </section>

        <footer className='mt-8 border-t border-slate-200 pt-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400'>
          <p>{isSr ? 'Последње ажурирање' : 'Last updated'}: 2026-03-17</p>
          <p className='mt-1'>
            {isSr
              ? 'Ова изјава ће бити периодично ажурирана како се функционалност платформе развија.'
              : 'This statement will be periodically updated as platform functionality evolves.'}
          </p>
        </footer>
      </article>
    </main>
  );
}
