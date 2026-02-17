'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useYugiohLanguage } from '@/contexts/YugiohLanguageContext';
import { YugiohCard } from '@/types/yugioh';
import { searchCardsByName, searchCardsAdvanced, getCardPrice } from '@/lib/services/ygoprodeck';
import CardDisplay from './CardDisplay';
import CardSkeleton from './CardSkeleton';
import AdvancedFilters, { FilterOptions } from './AdvancedFilters';
import styles from './CardSearch.module.scss';

// Sort options type
type SortOption = 'default' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'atk-desc' | 'atk-asc' | 'def-desc' | 'def-asc' | 'level-desc' | 'level-asc';

// Dynamic import CardScanner to avoid SSR issues with Tesseract.js
const CardScanner = dynamic(() => import('./CardScanner'), {
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

// Detect if input is a Set Code (e.g., LOB-EN001, SDK-001, CT13-EN008, MVP1-ENSV4)
function isSetCode(input: string): boolean {
  const trimmed = input.trim().toUpperCase();
  // Pattern: 2-6 alphanumeric chars, dash, 3-7 alphanumeric chars
  // Examples: LOB-001, SDK-E001, LOB-EN001, CT13-EN008, MVP1-ENSV4, DP03-EN001
  const setCodePattern = /^[A-Z0-9]{2,6}-[A-Z0-9]{3,7}$/;
  return setCodePattern.test(trimmed);
}

// Search by Set Code using internal API route (avoids CORS issues)
async function searchBySetCode(setCode: string): Promise<{
  card: YugiohCard | null;
  fallbackInfo?: { originalCode: string; fallbackCode: string };
}> {
  const cleanSetCode = setCode.trim().toUpperCase();

  try {
    // Call internal API route to search by set code
    const response = await fetch(
      `/api/yugioh/search-setcode?code=${encodeURIComponent(cleanSetCode)}`
    );

    if (!response.ok) {
      return { card: null };
    }

    const data = await response.json();

    if (data.success && data.cardName) {
      // Get full card details from YGOPRODeck
      const cards = await searchCardsByName(data.cardName);
      if (cards.length > 0) {
        // Attach specific set info from the set code search
        const cardWithSetInfo = {
          ...cards[0],
          specificSetInfo: {
            setCode: data.setCode,
            setName: data.setName,
            setRarity: data.setRarity,
            setPrice: data.setPrice,
          },
        };

        // Return card with fallback info if used
        return {
          card: cardWithSetInfo,
          fallbackInfo: data.usedFallback
            ? { originalCode: data.originalCode, fallbackCode: data.fallbackCode }
            : undefined,
        };
      }
    }

    return { card: null };
  } catch (error) {
    console.error('❌ Error searching by set code:', error);
    return { card: null };
  }
}

export default function CardSearch() {
  const { t } = useYugiohLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [cards, setCards] = useState<YugiohCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({});
  const [showScanner, setShowScanner] = useState(false);
  const [fallbackWarning, setFallbackWarning] = useState<string | null>(null);
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
      case 'atk-desc':
        return sorted.sort((a, b) => (b.atk ?? -1) - (a.atk ?? -1));
      case 'atk-asc':
        return sorted.sort((a, b) => (a.atk ?? Infinity) - (b.atk ?? Infinity));
      case 'def-desc':
        return sorted.sort((a, b) => (b.def ?? -1) - (a.def ?? -1));
      case 'def-asc':
        return sorted.sort((a, b) => (a.def ?? Infinity) - (b.def ?? Infinity));
      case 'level-desc':
        return sorted.sort((a, b) => (b.level ?? -1) - (a.level ?? -1));
      case 'level-asc':
        return sorted.sort((a, b) => (a.level ?? Infinity) - (b.level ?? Infinity));
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
      setFallbackWarning(null);
      return;
    }

    setIsLoading(true);
    setError('');
    setFallbackWarning(null);
    setHasSearched(true);

    try {
      let results: YugiohCard[] = [];

      // Check if the query is a Set Code (e.g., LOB-EN001)
      if (hasQuery && isSetCode(query) && !hasFilters) {
        const { card, fallbackInfo } = await searchBySetCode(query);
        if (card) {
          results = [card];
          // Set fallback warning if fallback was used
          if (fallbackInfo) {
            setFallbackWarning(
              t('search.fallbackWarning', {
                originalCode: fallbackInfo.originalCode,
                fallbackCode: fallbackInfo.fallbackCode,
              })
            );
          }
        } else {
          setError(t('search.error.notFound', { code: query.trim().toUpperCase() }));
        }
      } else if (hasFilters || hasQuery) {
        // Use advanced search with filters or name search
        const searchParams = {
          name: hasQuery ? query : undefined,
          ...filters,
        };
        results = await searchCardsAdvanced(searchParams);

        // Client-side filtering for ATK/DEF ranges (API doesn't support ranges)
        if (filters.atkMin !== undefined || filters.atkMax !== undefined) {
          results = results.filter(card => {
            if (card.atk === undefined) return false;
            if (filters.atkMin !== undefined && card.atk < filters.atkMin) return false;
            if (filters.atkMax !== undefined && card.atk > filters.atkMax) return false;
            return true;
          });
        }

        if (filters.defMin !== undefined || filters.defMax !== undefined) {
          results = results.filter(card => {
            if (card.def === undefined) return false;
            if (filters.defMin !== undefined && card.def < filters.defMin) return false;
            if (filters.defMax !== undefined && card.def > filters.defMax) return false;
            return true;
          });
        }

        if (results.length === 0) {
          setError(t('search.noResults'));
        }
      } else {
        results = await searchCardsByName(query);
        if (results.length === 0) {
          setError(t('search.noResults'));
        }
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
              ✕
            </button>
          )}
          <button
            onClick={() => setShowScanner(!showScanner)}
            className={styles.scanButton}
            title={t('search.scanButton')}
          >
            {showScanner ? '✕' : '📸'}
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
            <h2 className={styles.resultsTitle}>🎴 {t('search.loading')}</h2>
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
          <span className={styles.errorIcon}>⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {/* Fallback Warning */}
      {fallbackWarning && !isLoading && (
        <div className={styles.warningBox}>
          <p>{fallbackWarning}</p>
        </div>
      )}

      {/* Results */}
      {!isLoading && cards.length > 0 && (
        <div className={styles.results}>
          <div className={styles.resultsHeader}>
            <h2 className={styles.resultsTitle}>
              🎴 {t('search.resultsCount', { count: cards.length })}
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
                <option value="atk-desc">{t('sort.atk.desc')}</option>
                <option value="atk-asc">{t('sort.atk.asc')}</option>
                <option value="def-desc">{t('sort.def.desc')}</option>
                <option value="def-asc">{t('sort.def.asc')}</option>
                <option value="level-desc">{t('sort.level.desc')}</option>
                <option value="level-asc">{t('sort.level.asc')}</option>
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
            <Image
              src="/images/yugioh-bg-icon.png"
              alt="Yu-Gi-Oh!"
              width={150}
              height={150}
              priority
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
