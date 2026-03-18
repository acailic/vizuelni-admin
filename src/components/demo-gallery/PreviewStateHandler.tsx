'use client';

import { Component, type ReactNode } from 'react';
import { AlertCircle, BarChart3, ImageOff } from 'lucide-react';
import { SkeletonPreview } from './SkeletonPreview';

type PreviewState = 'loading' | 'unavailable' | 'error';

export function PreviewStateHandler({
  state,
  labels,
  chartType,
  onRetry,
}: {
  state: PreviewState;
  labels: {
    previewLoading: string;
    previewUnavailable: string;
    previewFailed: string;
  };
  chartType: string;
  onRetry?: () => void;
}) {
  const copy =
    state === 'loading'
      ? labels.previewLoading
      : state === 'error'
        ? labels.previewFailed
        : labels.previewUnavailable;

  const Icon =
    state === 'error'
      ? AlertCircle
      : state === 'unavailable'
        ? ImageOff
        : BarChart3;

  if (state === 'error') {
    return (
      <div className='flex h-full flex-col items-center justify-center gap-3 rounded-[1.75rem] bg-slate-100 p-4 text-center'>
        <AlertCircle className='h-8 w-8 text-red-400' />
        <p className='text-sm text-slate-600'>{copy}</p>
        {onRetry && (
          <button
            type='button'
            onClick={onRetry}
            className='rounded-full bg-gov-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gov-primary/90'
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className='flex h-full flex-col justify-between rounded-[1.5rem] border border-dashed border-slate-300 bg-[linear-gradient(145deg,rgba(255,255,255,0.95),rgba(226,232,240,0.9))] p-4 text-slate-600'
      title={copy}
    >
      <div className='flex items-center justify-between'>
        <span className='rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500'>
          {chartType}
        </span>
        <Icon className='h-4 w-4 text-slate-400' aria-hidden='true' />
      </div>
      {state === 'loading' ? (
        <div className='h-full w-full'>
          <SkeletonPreview />
        </div>
      ) : (
        <div className='space-y-2'>
          <div className='rounded-2xl bg-white/90 p-4 shadow-sm'>
            <div className='h-20 rounded-xl border border-slate-200 bg-[radial-gradient(circle_at_top_left,rgba(13,64,119,0.14),transparent_50%),linear-gradient(180deg,rgba(241,245,249,0.85),rgba(255,255,255,0.95))]' />
          </div>
          <p className='text-sm font-medium leading-5 text-slate-600'>{copy}</p>
        </div>
      )}
    </div>
  );
}

interface PreviewErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
  resetKey: string;
}

interface PreviewErrorBoundaryState {
  hasError: boolean;
}

export class PreviewErrorBoundary extends Component<
  PreviewErrorBoundaryProps,
  PreviewErrorBoundaryState
> {
  constructor(props: PreviewErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidUpdate(prevProps: PreviewErrorBoundaryProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}
