'use client';

import { memo, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { appFeatures } from '@/lib/app-mode';

interface UserMenuProps {
  locale: string;
  messages: {
    profile: string;
    settings: string;
    signOut: string;
    signIn: string;
  };
}

function UserMenuComponent({ locale, messages }: UserMenuProps) {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!appFeatures.auth) {
    return null;
  }

  if (status === 'loading') {
    return <div className='h-8 w-8 animate-pulse rounded-full bg-slate-200' />;
  }

  if (!session) {
    return (
      <Link
        href={`/${locale}/login`}
        className='flex items-center gap-2 rounded-lg bg-[#C6363C] px-4 py-2 text-sm font-medium text-white hover:bg-[#a82d32]'
      >
        {messages.signIn}
      </Link>
    );
  }

  return (
    <div ref={menuRef} className='relative'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50'
      >
        <div className='flex h-6 w-6 items-center justify-center rounded-full bg-[#0C1E42] text-xs text-white'>
          {session.user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <span className='hidden sm:block'>{session.user?.name}</span>
        <ChevronDown className='h-4 w-4' />
      </button>

      {isOpen && (
        <div className='absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border border-slate-200 bg-white py-1 shadow-lg'>
          <Link
            href={`/${locale}/profile`}
            onClick={() => setIsOpen(false)}
            className='flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50'
          >
            <User className='h-4 w-4' />
            {messages.profile}
          </Link>
          <Link
            href={`/${locale}/dashboard`}
            onClick={() => setIsOpen(false)}
            className='flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50'
          >
            <Settings className='h-4 w-4' />
            {messages.settings}
          </Link>
          <hr className='my-1 border-slate-200' />
          <button
            onClick={() => signOut({ callbackUrl: `/${locale}` })}
            className='flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50'
          >
            <LogOut className='h-4 w-4' />
            {messages.signOut}
          </button>
        </div>
      )}
    </div>
  );
}

export const UserMenu = memo(UserMenuComponent);
