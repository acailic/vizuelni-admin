'use client';

import Link from 'next/link';
import { Check, Code2, ExternalLink, Eye } from 'lucide-react';

interface QuickActionButtonsProps {
  href: string;
  labels: {
    preview: string;
    open: string;
    embed: string;
    embedCopied: string;
  };
  onPreview: () => void;
  onEmbed: () => Promise<void> | void;
  embedCopied: boolean;
}

export function QuickActionButtons({
  href,
  labels,
  onPreview,
  onEmbed,
  embedCopied,
}: QuickActionButtonsProps) {
  return (
    <div className='flex flex-wrap gap-2'>
      <button
        type='button'
        onClick={onPreview}
        className='inline-flex min-h-10 items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-gov-primary/40 hover:text-gov-primary focus:outline-none focus:ring-2 focus:ring-gov-primary/20 focus:ring-offset-2'
      >
        <Eye className='h-4 w-4' />
        {labels.preview}
      </button>
      <Link
        href={href}
        className='inline-flex min-h-10 items-center gap-1.5 rounded-full border border-slate-300 bg-slate-950 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950/20 focus:ring-offset-2'
      >
        <ExternalLink className='h-4 w-4' />
        {labels.open}
      </Link>
      <button
        type='button'
        onClick={() => void onEmbed()}
        className='inline-flex min-h-10 items-center gap-1.5 rounded-full border border-slate-300 bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-gov-primary/20 focus:ring-offset-2'
      >
        {embedCopied ? (
          <Check className='h-4 w-4' />
        ) : (
          <Code2 className='h-4 w-4' />
        )}
        {embedCopied ? labels.embedCopied : labels.embed}
      </button>
    </div>
  );
}
