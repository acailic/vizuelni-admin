'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, Clock, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import { useDebounce } from '@/lib/hooks/useDebounce'

interface SearchSuggestion {
  id: string
  title: string
  type: 'dataset' | 'organization' | 'topic'
}

interface SearchAutocompleteProps {
  locale: string
  placeholder: string
  recentSearchesLabel: string
  suggestionsLabel: string
  noResultsLabel: string
}

const MAX_RECENT_SEARCHES = 5

export function SearchAutocomplete({
  locale,
  placeholder,
  recentSearchesLabel,
  suggestionsLabel,
  noResultsLabel,
}: SearchAutocompleteProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const debouncedQuery = useDebounce(query, 300)

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recent-searches')
    if (stored) {
      setRecentSearches(JSON.parse(stored))
    }
  }, [])

  // Fetch suggestions
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSuggestions([])
      return
    }

    const fetchSuggestions = async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `/api/browse?q=${encodeURIComponent(debouncedQuery)}&pageSize=5`
        )
        if (res.ok) {
          const data = await res.json()
          setSuggestions(
            (data.data || []).map((item: { id: string; title: string }) => ({
              id: item.id,
              title: item.title,
              type: 'dataset' as const,
            }))
          )
        }
      } catch {
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }

    fetchSuggestions()
  }, [debouncedQuery])

  const saveRecentSearch = useCallback((searchQuery: string) => {
    const updated = [
      searchQuery,
      ...recentSearches.filter((s) => s !== searchQuery),
    ].slice(0, MAX_RECENT_SEARCHES)
    setRecentSearches(updated)
    localStorage.setItem('recent-searches', JSON.stringify(updated))
  }, [recentSearches])

  const handleSearch = useCallback((searchQuery: string) => {
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery.trim())
      router.push(`/${locale}/browse?q=${encodeURIComponent(searchQuery.trim())}`)
      setQuery('')
      setIsFocused(false)
    }
  }, [locale, router, saveRecentSearch])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(query)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = query.trim() ? suggestions : recentSearches
    const itemCount = items.length

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < itemCount - 1 ? prev + 1 : prev))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      const item = items[selectedIndex]
      handleSearch(typeof item === 'string' ? item : item.title)
    } else if (e.key === 'Escape') {
      setIsFocused(false)
      inputRef.current?.blur()
    }
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('recent-searches')
  }

  const showDropdown = isFocused && (query.trim() || recentSearches.length > 0)

  return (
    <div className="relative w-full max-w-md">
      <form onSubmit={handleSubmit}>
        <div
          className={cn(
            'flex items-center rounded-lg border bg-white transition-colors',
            isFocused ? 'border-gov-accent ring-1 ring-gov-accent' : 'border-slate-200'
          )}
        >
          <Search className="ml-3 h-4 w-4 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(-1)
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full border-none bg-transparent px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="mr-2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-lg border border-slate-200 bg-white shadow-lg">
          {query.trim() ? (
            <>
              <div className="border-b border-slate-100 px-3 py-2 text-xs font-medium text-slate-500">
                {suggestionsLabel}
              </div>
              {loading ? (
                <div className="px-3 py-4 text-center text-sm text-slate-500">
                  ...
                </div>
              ) : suggestions.length > 0 ? (
                <ul>
                  {suggestions.map((suggestion, index) => (
                    <li key={suggestion.id}>
                      <button
                        onClick={() => handleSearch(suggestion.title)}
                        className={cn(
                          'w-full px-3 py-2 text-left text-sm hover:bg-slate-50',
                          selectedIndex === index && 'bg-slate-50'
                        )}
                      >
                        {suggestion.title}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-3 py-4 text-center text-sm text-slate-500">
                  {noResultsLabel}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2">
                <span className="text-xs font-medium text-slate-500">
                  {recentSearchesLabel}
                </span>
                {recentSearches.length > 0 && (
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-gov-primary hover:underline"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
              {recentSearches.length > 0 ? (
                <ul>
                  {recentSearches.map((search, index) => (
                    <li key={search}>
                      <button
                        onClick={() => handleSearch(search)}
                        className={cn(
                          'flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-slate-50',
                          selectedIndex === index && 'bg-slate-50'
                        )}
                      >
                        <Clock className="h-3 w-3 text-slate-400" />
                        {search}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-3 py-4 text-center text-sm text-slate-500">
                  {noResultsLabel}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
