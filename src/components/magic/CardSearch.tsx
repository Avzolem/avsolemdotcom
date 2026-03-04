'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useMagicLanguage } from '@/contexts/MagicLanguageContext';
import { MagicCard } from '@/types/magic';
import { getCardPrice } from '@/lib/services/scryfall';
import CardDisplay from '@/components/magic/CardDisplay';
import CardSkeleton from '@/components/magic/CardSkeleton';
import AdvancedFilters, { MagicFilterOptions } from '@/components/magic/AdvancedFilters';
import styles from './CardSearch.module.scss';

// Sort options type
type SortOption = 'default' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'cmc-asc' | 'cmc-desc' | 'color';

// Dynamic import CardScanner to avoid SSR issues with Tesseract.js
const CardScanner = dynamic(() => import('@/components/magic/CardScanner'), {
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

// Search cards via server-side API proxy (Scryfall)
async function searchCards(query: string): Promise<MagicCard[]> {
  if (!query || query.trim().length < 2) return [];

  const url = `/api/magic/search?query=${encodeURIComponent(query.trim())}`;
  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 400 || response.status === 404) {
      return [];
    }
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.cards || data.data || [];
}

export default function CardSearch() {
  const { t } = useMagicLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [cards, setCards] = useState<MagicCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [activeFilterQuery, setActiveFilterQuery] = useState('');
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
      case 'cmc-asc':
        return sorted.sort((a, b) => (a.cmc || 0) - (b.cmc || 0));
      case 'cmc-desc':
        return sorted.sort((a, b) => (b.cmc || 0) - (a.cmc || 0));
      case 'color':
        return sorted.sort((a, b) => (a.colors?.join('') || '').localeCompare(b.colors?.join('') || ''));
      default:
        return sorted;
    }
  }, [cards, sortOption]);

  const performSearch = useCallback(async (query: string, filterQuery: string = '') => {
    const fullQuery = [query, filterQuery].filter(Boolean).join(' ');
    const hasQuery = fullQuery.trim().length >= 2;

    if (!hasQuery) {
      setCards([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const results = await searchCards(fullQuery);

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
    performSearch(debouncedSearchTerm, activeFilterQuery);
  }, [debouncedSearchTerm, activeFilterQuery, performSearch]);

  const handleFiltersChange = (query: string, _filters: MagicFilterOptions) => {
    setActiveFilterQuery(query);
  };

  const handleClearFilters = () => {
    setActiveFilterQuery('');
    setSearchTerm('');
    setCards([]);
    setError('');
    setHasSearched(false);
  };

  const handleClear = () => {
    setSearchTerm('');
    if (!activeFilterQuery) {
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
        onFiltersChange={handleFiltersChange}
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
                <option value="cmc-desc">CMC (High to Low)</option>
                <option value="cmc-asc">CMC (Low to High)</option>
                <option value="color">Color</option>
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/tcg/magic-empty-icon.svg"
              alt="Magic: The Gathering"
              className={styles.emptyIconSvg}
              width={100}
              height={100}
            />
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
