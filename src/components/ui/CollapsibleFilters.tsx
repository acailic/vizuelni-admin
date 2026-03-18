'use client';

import { useState, useRef, useCallback, useId } from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface CollapsibleFiltersProps {
  /** Filter controls to be collapsed */
  children: React.ReactNode;
  /** Number of active filters for badge display */
  activeFilterCount: number;
  /** Localized labels for the component */
  labels: {
    filters: string;
    showFilters: string;
    hideFilters: string;
  };
  /** Whether to show filters expanded by default */
  defaultExpanded?: boolean;
  /** Optional additional className for the container */
  className?: string;
}

/**
 * CollapsibleFilters - Collapsible filter section for gallery pages
 *
 * Reduces visual clutter by hiding filters behind a toggle button.
 * Shows a badge with active filter count when filters are applied.
 *
 * Accessibility features:
 * - aria-expanded on toggle button
 * - aria-hidden on collapsed content
 * - Focus management when collapsing
 * - Keyboard navigation support
 * - Reduced motion support via Tailwind motion-safe
 */
export function CollapsibleFilters({
  children,
  activeFilterCount,
  labels,
  defaultExpanded = false,
  className = '',
}: CollapsibleFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const contentId = useId();
  void contentId; // suppress unused warning - used in aria-controls

  const buttonLabel = isExpanded ? labels.hideFilters : labels.showFilters;
  void buttonLabel; // suppress unused warning - available for future use

  const toggle = useCallback(() => {
    setIsExpanded((prev) => {
      const newState = !prev;

      // When collapsing, return focus to toggle button
      if (!newState && document.activeElement instanceof HTMLElement) {
        // Check if focus is inside the content being collapsed
        const contentElement = contentRef.current;
        if (contentElement && contentElement.contains(document.activeElement)) {
          toggleButtonRef.current?.focus();
        }
      }

      return newState;
    });
  }, []);

  return (
    <div className={cn('w-full', className)}>
      {/* Toggle Button */}
      <button
        ref={toggleButtonRef}
        onClick={toggle}
        aria-expanded={isExpanded}
        aria-controls={contentId}
        className={cn(
          // Base styles
          'inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium',
          'border-2 transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-gov-secondary focus:ring-offset-2',
          'active:scale-[0.98]',
          // Secondary button style (outline)
          'bg-white text-gov-primary border-gov-primary',
          'hover:bg-gov-primary hover:text-white',
          // Motion-safe for reduced motion support
          'motion-safe:transition-all motion-safe:duration-200'
        )}
      >
        <Filter className='w-4 h-4' aria-hidden='true' />
        <span>{labels.filters}</span>
        <ChevronDown
          className={cn(
            'w-4 h-4 transition-transform duration-200',
            isExpanded && 'rotate-180',
            'motion-safe:transition-transform motion-safe:duration-200'
          )}
          aria-hidden='true'
        />

        {/* Active Filter Badge */}
        {activeFilterCount > 0 && (
          <span
            className={cn(
              'ml-1 inline-flex items-center justify-center',
              'min-w-[1.25rem] h-5 px-1.5 rounded-full',
              'text-xs font-semibold text-white',
              // Serbian red badge
              'bg-serbia-red',
              'motion-safe:transition-all motion-safe:duration-200'
            )}
            aria-label={`${activeFilterCount} ${labels.filters.toLowerCase()} active`}
          >
            <span className='sr-only'>
              {activeFilterCount} {labels.filters.toLowerCase()} active
            </span>
            <span aria-hidden='true'>{activeFilterCount}</span>
          </span>
        )}
      </button>

      {/* Collapsible Content */}
      <div
        ref={contentRef}
        id={contentId}
        data-testid='collapsible-filters-content'
        aria-hidden={!isExpanded}
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          'motion-safe:transition-all motion-safe:duration-300',
          // Smooth max-height transition
          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0',
          !isExpanded && 'invisible'
        )}
      >
        <div
          className={cn(
            'mt-4 pt-4',
            // Subtle top border for visual separation
            'border-t border-slate-200'
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default CollapsibleFilters;
