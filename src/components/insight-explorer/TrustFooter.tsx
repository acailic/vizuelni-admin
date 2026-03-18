'use client';

import { Shield, Lock, RefreshCw } from 'lucide-react';
import type { Locale } from '@/lib/i18n/config';

interface TrustFooterProps {
  locale: Locale;
}

const LABELS = {
  official: {
    'sr-Cyrl': 'Званични подаци',
    'sr-Latn': 'Zvanicni podaci',
    en: 'Official Data',
  },
  officialDesc: {
    'sr-Cyrl': 'Подаци су преузети из званичних владиних извора',
    'sr-Latn': 'Podaci su preuzeti iz zvanicnih vladinih izvora',
    en: 'Data sourced from official government sources',
  },
  secure: {
    'sr-Cyrl': 'Сигурносно проверено',
    'sr-Latn': 'Sigurnosno provereno',
    en: 'Secure & Verified',
  },
  secureDesc: {
    'sr-Cyrl': 'Сви подаци су проверени и сигурни за коришћење',
    'sr-Latn': 'Svi podaci su provereni i sigurni za koriscenje',
    en: 'All data is verified and safe to use',
  },
  updated: {
    'sr-Cyrl': 'Редовно ажурирано',
    'sr-Latn': 'Redovno azurirano',
    en: 'Regularly Updated',
  },
  updatedDesc: {
    'sr-Cyrl': 'Каталог се ажурира свакодневно са новим подацима',
    'sr-Latn': 'Katalog se azurira svakodnevno sa novim podacima',
    en: 'Catalog updated daily with new datasets',
  },
} as const;

export function TrustFooter({ locale }: TrustFooterProps) {
  return (
    <footer className='mt-16 rounded-2xl bg-slate-50 px-8 py-10'>
      <div className='grid gap-8 sm:grid-cols-3'>
        <div className='flex items-start gap-4'>
          <div className='rounded-xl bg-gov-primary/10 p-3'>
            <Shield className='h-6 w-6 text-gov-primary' />
          </div>
          <div>
            <h4 className='font-semibold text-slate-900'>
              {LABELS.official[locale]}
            </h4>
            <p className='mt-1 text-sm text-slate-500'>
              {LABELS.officialDesc[locale]}
            </p>
          </div>
        </div>

        <div className='flex items-start gap-4'>
          <div className='rounded-xl bg-gov-primary/10 p-3'>
            <Lock className='h-6 w-6 text-gov-primary' />
          </div>
          <div>
            <h4 className='font-semibold text-slate-900'>
              {LABELS.secure[locale]}
            </h4>
            <p className='mt-1 text-sm text-slate-500'>
              {LABELS.secureDesc[locale]}
            </p>
          </div>
        </div>

        <div className='flex items-start gap-4'>
          <div className='rounded-xl bg-gov-primary/10 p-3'>
            <RefreshCw className='h-6 w-6 text-gov-primary' />
          </div>
          <div>
            <h4 className='font-semibold text-slate-900'>
              {LABELS.updated[locale]}
            </h4>
            <p className='mt-1 text-sm text-slate-500'>
              {LABELS.updatedDesc[locale]}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
