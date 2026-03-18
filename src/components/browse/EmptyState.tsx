import { Inbox, AlertCircle, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export type EmptyStateVariant = 'empty' | 'error' | 'offline';

export interface EmptyStateAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

interface EmptyStateProps {
  title: string;
  description: string;
  /** Visual variant - affects icon and styling */
  variant?: EmptyStateVariant;
  /** Optional action buttons */
  actions?: EmptyStateAction[];
  /** Optional additional className */
  className?: string;
}

/**
 * EmptyState - Display empty, error, or offline states with optional actions
 *
 * Variants:
 * - empty: Default state with inbox icon
 * - error: Error state with alert icon and red accent
 * - offline: Offline state with wifi-off icon and amber accent
 *
 * Usage:
 * ```tsx
 * // Basic empty state
 * <EmptyState title="No datasets" description="No datasets found matching your criteria." />
 *
 * // Error state with retry action
 * <EmptyState
 *   variant="error"
 *   title="Failed to load"
 *   description="We couldn't load the datasets."
 *   actions={[{ label: "Retry", onClick: handleRetry }]}
 * />
 *
 * // Offline state with actions
 * <EmptyState
 *   variant="offline"
 *   title="You're offline"
 *   description="Check your internet connection."
 *   actions={[
 *     { label: "Retry", onClick: handleRetry, variant: "primary" },
 *     { label: "Use demo data", onClick: handleUseDemo, variant: "secondary" },
 *   ]}
 * />
 * ```
 */
export function EmptyState({
  title,
  description,
  variant = 'empty',
  actions,
  className,
}: EmptyStateProps) {
  // Icon and color configuration per variant
  const variantConfig = {
    empty: {
      icon: Inbox,
      iconColor: 'text-slate-400',
      borderColor: 'border-slate-300',
      bgColor: 'bg-white',
    },
    error: {
      icon: AlertCircle,
      iconColor: 'text-red-500',
      borderColor: 'border-red-300',
      bgColor: 'bg-red-50',
    },
    offline: {
      icon: WifiOff,
      iconColor: 'text-amber-500',
      borderColor: 'border-amber-300',
      bgColor: 'bg-amber-50',
    },
  };

  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'rounded-3xl border border-dashed px-6 py-12 text-center shadow-sm',
        config.borderColor,
        config.bgColor,
        className
      )}
      role='status'
      aria-live='polite'
    >
      {/* Icon */}
      <div className='flex justify-center mb-4'>
        <Icon
          className={cn('w-12 h-12', config.iconColor)}
          aria-hidden='true'
        />
      </div>

      {/* Title */}
      <h3 className='text-xl font-semibold text-slate-900 mb-2'>{title}</h3>

      {/* Description */}
      <p className='mx-auto max-w-xl text-sm leading-6 text-slate-600 mb-4'>
        {description}
      </p>

      {/* Action buttons */}
      {actions && actions.length > 0 && (
        <div className='flex flex-col gap-2 sm:flex-row sm:justify-center sm:gap-3 mt-4'>
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={cn(
                'inline-flex items-center justify-center',
                'px-4 py-2 rounded-lg text-sm font-medium',
                'transition-colors duration-150',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                action.variant === 'primary' || action.variant === undefined
                  ? cn(
                      'bg-blue-600 text-white',
                      'hover:bg-blue-700 active:bg-blue-800',
                      'focus-visible:ring-blue-500'
                    )
                  : cn(
                      'bg-white text-slate-700 border border-slate-300',
                      'hover:bg-slate-100 active:bg-slate-200',
                      'focus-visible:ring-slate-500'
                    )
              )}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default EmptyState;
