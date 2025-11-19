'use client';

import { useState, useCallback, useEffect } from 'react';
import { YugiohCard } from '@/types/yugioh';
import { searchCardsByName, searchCardsAdvanced } from '@/lib/services/ygoprodeck';
import CardDisplay from './CardDisplay';
import AdvancedFilters, { FilterOptions } from './AdvancedFilters';
import styles from './CardSearch.module.scss';

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

export default function CardSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cards, setCards] = useState<YugiohCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({});

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

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
      let results: YugiohCard[] = [];

      if (hasFilters || hasQuery) {
        // Use advanced search with filters
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
      } else {
        results = await searchCardsByName(query);
      }

      if (results.length === 0) {
        setError('No se encontraron cartas con esos criterios');
      }

      setCards(results);
    } catch (err) {
      console.error('Search error:', err);
      setError('Error al buscar cartas. Intenta de nuevo.');
      setCards([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

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

  return (
    <div className={styles.container} suppressHydrationWarning>
      {/* Search Input */}
      <div className={styles.searchSection}>
        <div className={styles.searchBar}>
          <input
            type="text"
            id="card-search"
            placeholder="Busca cartas: Dark Magician, Blue-Eyes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          {searchTerm && (
            <button onClick={handleClear} className={styles.clearButton}>
              ✕
            </button>
          )}
        </div>
        <p className={styles.searchHint}>
          💡 Escribe al menos 2 caracteres para buscar o usa los filtros avanzados
        </p>
      </div>

      {/* Advanced Filters */}
      <AdvancedFilters
        onApplyFilters={handleApplyFilters}
        onClear={handleClearFilters}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="yugioh-loading">
          <div className={styles.spinner}></div>
          <p>Buscando cartas...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className={styles.errorBox}>
          <span className={styles.errorIcon}>⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {/* Results */}
      {!isLoading && cards.length > 0 && (
        <div className={styles.results}>
          <h2 className={styles.resultsTitle}>
            🎴 {cards.length} {cards.length === 1 ? 'carta encontrada' : 'cartas encontradas'}
          </h2>

          <div className={styles.resultsGrid}>
            {cards.map((card) => (
              <CardDisplay key={card.id} card={card} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !hasSearched && cards.length === 0 && (
        <div className="yugioh-empty">
          <div className="icon">🃏</div>
          <h3>Buscador de Cartas Yu-Gi-Oh!</h3>
          <p>
            Busca cualquier carta de Yu-Gi-Oh! por su nombre. Obtén información
            completa incluyendo estadísticas, descripción y precios actualizados.
          </p>
        </div>
      )}
    </div>
  );
}
