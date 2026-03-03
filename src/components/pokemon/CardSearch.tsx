'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { usePokemonLanguage } from '@/contexts/PokemonLanguageContext';
import { PokemonCard } from '@/types/pokemon';
import { getCardPrice } from '@/lib/services/pokemontcg';
import CardDisplay from '@/components/pokemon/CardDisplay';
import CardSkeleton from '@/components/pokemon/CardSkeleton';
import AdvancedFilters, { FilterOptions } from '@/components/pokemon/AdvancedFilters';
import styles from './CardSearch.module.scss';

// Sort options type
type SortOption = 'default' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'hp-desc' | 'hp-asc';

// Dynamic import CardScanner to avoid SSR issues with Tesseract.js
const CardScanner = dynamic(() => import('@/components/pokemon/CardScanner'), {
  ssr: false,
  loading: () => <div style={{ padding: '2rem', textAlign: 'center' }}>Loading scanner...</div>
});

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Search cards via server-side API proxy (TCGdex)
async function searchCards(params: {
  name?: string;
  supertype?: string;
  types?: string;
  subtypes?: string;
  hpMin?: number;
  hpMax?: number;
  rarity?: string;
  set?: string;
}): Promise<PokemonCard[]> {
  const queryParts: string[] = [];

  if (params.name) queryParts.push(`name=${encodeURIComponent(params.name)}`);
  if (params.supertype) queryParts.push(`category=${encodeURIComponent(params.supertype)}`);
  if (params.types) queryParts.push(`type=${encodeURIComponent(params.types)}`);
  if (params.rarity) queryParts.push(`rarity=${encodeURIComponent(params.rarity)}`);
  if (params.hpMin) queryParts.push(`hp=${params.hpMin}`);

  if (queryParts.length === 0) return [];

  const url = `/api/pokemon/search?${queryParts.join('&')}&limit=50`;
  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 400 || response.status === 404) {
      return [];
    }
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.data || [];
}

export default function CardSearch() {
  const { t } = usePokemonLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [cards, setCards] = useState<PokemonCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({});
  const [showScanner, setShowScanner] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('default');

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Sort cards based on selected option
  const sortedCards = useMemo(() => {
    if (sortOption === 'default' || cards.length === 0) return cards;

    const sorted = [...cards];

    switch (sortOption) {
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'price-asc':
        return sorted.sort((a, b) => getCardPrice(a) - getCardPrice(b));
      case 'price-desc':
        return sorted.sort((a, b) => getCardPrice(b) - getCardPrice(a));
      case 'hp-desc':
        return sorted.sort((a, b) => (b.hp || 0) - (a.hp || 0));
      case 'hp-asc':
        return sorted.sort((a, b) => (a.hp || 0) - (b.hp || 0));
      default:
        return sorted;
    }
  }, [cards, sortOption]);

  const performSearch = useCallback(async (query: string, filters: FilterOptions = {}) => {
    const hasQuery = query && query.trim().length >= 2;
    const hasFilters = Object.keys(filters).length > 0;

    if (!hasQuery && !hasFilters) {
      setCards([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const searchParams = {
        name: hasQuery ? query : undefined,
        ...filters,
      };
      const results = await searchCards(searchParams);

      if (results.length === 0) {
        setError(t('search.noResults'));
      }

      setCards(results);
    } catch (err) {
      console.error('Search error:', err);
      setError(t('search.error.generic'));
      setCards([]);
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    performSearch(debouncedSearchTerm, activeFilters);
  }, [debouncedSearchTerm, activeFilters, performSearch]);

  const handleApplyFilters = (filters: FilterOptions) => {
    setActiveFilters(filters);
  };

  const handleClearFilters = () => {
    setActiveFilters({});
    setSearchTerm('');
    setCards([]);
    setError('');
    setHasSearched(false);
  };

  const handleClear = () => {
    setSearchTerm('');
    if (Object.keys(activeFilters).length === 0) {
      setCards([]);
      setError('');
      setHasSearched(false);
    }
  };

  const handleScanComplete = (cardName: string) => {
    setSearchTerm(cardName);
    setShowScanner(false);
  };

  return (
    <div className={styles.container} suppressHydrationWarning>
        {/* Search Input */}
      <div className={styles.searchSection}>
        <div className={styles.searchBar}>
          <input
            type="text"
            id="card-search"
            placeholder={t('search.placeholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          {searchTerm && (
            <button onClick={handleClear} className={styles.clearButton}>
              &#x2715;
            </button>
          )}
          <button
            onClick={() => setShowScanner(!showScanner)}
            className={styles.scanButton}
            title={t('search.scanButton')}
          >
            {showScanner ? '\u2715' : '\uD83D\uDCF8'}
          </button>
        </div>
        <p className={styles.searchHint}>
          {t('search.hint')}
        </p>
      </div>

      {/* Card Scanner */}
      {showScanner && (
        <div className={styles.scannerSection}>
          <CardScanner onScanComplete={handleScanComplete} />
        </div>
      )}

      {/* Advanced Filters */}
      <AdvancedFilters
        onApplyFilters={handleApplyFilters}
        onClear={handleClearFilters}
      />

      {/* Loading State with Skeleton */}
      {isLoading && (
        <div className={styles.results}>
          <div className={styles.resultsHeader}>
            <h2 className={styles.resultsTitle}>{t('search.loading')}</h2>
          </div>
          <div className={styles.resultsGrid}>
            {[...Array(6)].map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className={styles.errorBox}>
          <span className={styles.errorIcon}>&#x26A0;&#xFE0F;</span>
          <p>{error}</p>
        </div>
      )}

      {/* Results */}
      {!isLoading && cards.length > 0 && (
        <div className={styles.results}>
          <div className={styles.resultsHeader}>
            <h2 className={styles.resultsTitle}>
              {t('search.resultsCount', { count: cards.length })}
            </h2>

            {/* Sort Dropdown */}
            <div className={styles.sortSection}>
              <label htmlFor="sort-select" className={styles.sortLabel}>
                {t('sort.label')}:
              </label>
              <select
                id="sort-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className={styles.sortSelect}
              >
                <option value="default">{t('sort.default')}</option>
                <option value="name-asc">{t('sort.name.asc')}</option>
                <option value="name-desc">{t('sort.name.desc')}</option>
                <option value="price-desc">{t('sort.price.desc')}</option>
                <option value="price-asc">{t('sort.price.asc')}</option>
                <option value="hp-desc">{t('sort.hp.desc')}</option>
                <option value="hp-asc">{t('sort.hp.asc')}</option>
              </select>
            </div>
          </div>

          <div className={styles.resultsGrid}>
            {sortedCards.map((card) => (
              <CardDisplay key={card.id} card={card} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !hasSearched && cards.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            {/* Pokeball SVG icon */}
            <svg
              className={styles.emptyIconSvg}
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="50" cy="50" r="48" fill="none" stroke="#CC0000" strokeWidth="3" opacity="0.6" />
              <path d="M2 50 H98" stroke="#CC0000" strokeWidth="3" opacity="0.6" />
              <circle cx="50" cy="50" r="14" fill="none" stroke="#CC0000" strokeWidth="3" opacity="0.6" />
              <circle cx="50" cy="50" r="8" fill="#CC0000" opacity="0.3" />
              <path d="M2 50 A48 48 0 0 0 98 50" fill="#CC0000" opacity="0.1" />
            </svg>
          </div>
          <h3>{t('search.emptyState.title')}</h3>
          <p>
            {t('search.emptyState.description')}
          </p>
        </div>
      )}
    </div>
  );
}
