'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

interface LanguageSwitcherProps {
  currentLang: 'sr' | 'lat' | 'en'
  onLanguageChange: (lang: 'sr' | 'lat' | 'en') => void
}

const languages = [
  { code: 'sr' as const, label: 'Ћирилица', shortLabel: 'ЋИР', flag: 'SRB' },
  { code: 'lat' as const, label: 'Latinica', shortLabel: 'LAT', flag: 'SRB' },
  { code: 'en' as const, label: 'English', shortLabel: 'EN', flag: 'ENG' },
]

export function LanguageSwitcher({ currentLang, onLanguageChange }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLanguage = languages.find(l => l.code === currentLang) || languages[0]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (lang: 'sr' | 'lat' | 'en') => {
    onLanguageChange(lang)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 focus:border-gov-primary focus:outline-none focus:ring-2 focus:ring-gov-primary/20"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select language"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-100 text-[10px] font-bold text-slate-600">
          {currentLanguage.shortLabel}
        </span>
        <span className="hidden sm:inline text-slate-600">{currentLanguage.label}</span>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 z-50 mt-1 w-40 origin-top-right rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
          role="listbox"
          aria-label="Language options"
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors hover:bg-slate-50 ${
                currentLang === lang.code ? 'text-gov-primary' : 'text-slate-700'
              }`}
              role="option"
              aria-selected={currentLang === lang.code}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-100 text-[10px] font-bold text-slate-600">
                {lang.shortLabel}
              </span>
              <span className="flex-1">{lang.label}</span>
              {currentLang === lang.code && (
                <Check className="h-4 w-4 text-gov-primary" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
