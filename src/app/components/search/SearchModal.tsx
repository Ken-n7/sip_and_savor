'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { MagnifyingGlassIcon, XMarkIcon, ClockIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { searchCocktailsByName, searchMealsByName } from '@/app/lib/api';
import { Cocktail, Meal } from '@/types/recipe';
import { useSearchHistory } from './SearchSuggestions';

type FilterType = 'all' | 'cocktails' | 'meals';

type ModalResult =
  | { type: 'cocktail'; data: Cocktail }
  | { type: 'meal'; data: Meal };

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [results, setResults] = useState<ModalResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const focusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();
  const { recentSearches, addSearchTerm, clearSearchHistory } = useSearchHistory();

  useEffect(() => {
    if (isOpen) {
      focusTimeoutRef.current = setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
      setFilter('all');
    }
    return () => {
      if (focusTimeoutRef.current) clearTimeout(focusTimeoutRef.current);
    };
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const search = useCallback(async (term: string, activeFilter: FilterType) => {
    if (!term.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const [cocktails, meals] = await Promise.all([
        activeFilter !== 'meals' ? searchCocktailsByName(term) : Promise.resolve([]),
        activeFilter !== 'cocktails' ? searchMealsByName(term) : Promise.resolve([]),
      ]);

      const c = (cocktails || []).slice(0, 5);
      const m = (meals || []).slice(0, 5);
      const merged: ModalResult[] = [];
      const max = Math.max(c.length, m.length);
      for (let i = 0; i < max; i++) {
        if (c[i]) merged.push({ type: 'cocktail', data: c[i] });
        if (m[i]) merged.push({ type: 'meal', data: m[i] });
      }
      setResults(merged.slice(0, 8));
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInput = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(value, filter), 300);
  };

  const handleFilterChange = (f: FilterType) => {
    setFilter(f);
    if (query.trim()) search(query, f);
  };

  const handleSelect = (result: ModalResult) => {
    if (query.trim()) addSearchTerm(query);
    const path =
      result.type === 'cocktail'
        ? `/cocktail/${result.data.idDrink}`
        : `/meal/${(result.data as Meal).idMeal}`;
    router.push(path);
    onClose();
  };

  const handleRecentSelect = (term: string) => {
    setQuery(term);
    search(term, filter);
  };

  const handleSeeAll = () => {
    if (!query.trim()) return;
    addSearchTerm(query);
    const params = new URLSearchParams({ q: query });
    if (filter !== 'all') params.set('filter', filter);
    router.push(`/search?${params.toString()}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-start md:justify-center md:pt-[10vh] md:px-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search recipes"
        className="relative w-full md:max-w-2xl bg-background border border-border rounded-t-2xl md:rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile drag handle */}
        <div className="md:hidden flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 rounded-full bg-foreground/20" />
        </div>

        {/* Input row */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <MagnifyingGlassIcon className="w-5 h-5 text-foreground/40 shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleInput(e.target.value)}
            placeholder="Search cocktails and meals..."
            className="flex-1 bg-transparent outline-none text-foreground placeholder:text-foreground/40 text-base"
            aria-label="Search recipes"
          />
          {query ? (
            <button
              onClick={() => { setQuery(''); setResults([]); }}
              className="p-2 -mr-2 text-foreground/40 hover:text-foreground/70 transition-colors"
              aria-label="Clear search"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs text-foreground/40 border border-border rounded">
              Esc
            </kbd>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 px-4 py-2 border-b border-border">
          {(['all', 'cocktails', 'meals'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => handleFilterChange(f)}
              className={`px-3 py-2 text-xs font-medium rounded-full transition-colors capitalize min-h-[36px] ${
                filter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground/60 hover:text-foreground hover:bg-accent/10'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="max-h-[55dvh] md:max-h-[50vh] overflow-y-auto">
          {isLoading && (
            <div className="flex items-center justify-center py-10">
              <div className="w-6 h-6 border-2 border-border border-t-primary rounded-full animate-spin" />
            </div>
          )}

          {!isLoading && !query && recentSearches.length > 0 && (
            <div className="py-2">
              <div className="flex items-center justify-between px-4 py-2">
                <span className="text-xs font-medium text-foreground/40 uppercase tracking-wider">Recent</span>
                <button
                  onClick={clearSearchHistory}
                  className="text-xs text-foreground/40 hover:text-foreground/70 transition-colors"
                >
                  Clear
                </button>
              </div>
              {recentSearches.slice(0, 5).map((term) => (
                <button
                  key={term}
                  onClick={() => handleRecentSelect(term)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent/10 transition-colors text-left"
                >
                  <ClockIcon className="w-4 h-4 text-foreground/30 shrink-0" />
                  <span className="text-sm text-foreground/80">{term}</span>
                </button>
              ))}
            </div>
          )}

          {!isLoading && !query && recentSearches.length === 0 && (
            <div className="py-10 text-center text-foreground/40 text-sm">
              Start typing to search for recipes
            </div>
          )}

          {!isLoading && query && results.length === 0 && (
            <div className="py-10 text-center">
              <p className="text-foreground/60 text-sm">No results for &quot;{query}&quot;</p>
              <p className="text-foreground/40 text-xs mt-1">Try different keywords</p>
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <div className="py-2">
              {results.map((result) => {
                const id = result.type === 'cocktail'
                  ? result.data.idDrink
                  : (result.data as Meal).idMeal;
                const name = result.type === 'cocktail'
                  ? result.data.strDrink
                  : (result.data as Meal).strMeal;
                const thumb = result.type === 'cocktail'
                  ? result.data.strDrinkThumb
                  : (result.data as Meal).strMealThumb;
                const category = result.data.strCategory;

                return (
                  <button
                    key={`${result.type}-${id}`}
                    onClick={() => handleSelect(result)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent/10 transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-md overflow-hidden shrink-0 bg-muted">
                      {thumb && (
                        <Image
                          src={thumb}
                          alt={name || ''}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{name}</p>
                      {category && (
                        <p className="text-xs text-foreground/50 truncate">{category}</p>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                      result.type === 'cocktail'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-secondary/10 text-secondary'
                    }`}>
                      {result.type === 'cocktail' ? 'Cocktail' : 'Meal'}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {query.trim() && !isLoading && (
          <div className="border-t border-border px-4 py-3">
            <button
              onClick={handleSeeAll}
              className="w-full flex items-center justify-between text-sm text-foreground/60 hover:text-foreground transition-colors"
            >
              <span>See all results for &quot;{query}&quot;</span>
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
