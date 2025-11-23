'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { YugiohCard } from '@/types/yugioh';
import { searchCardsByName, searchCardsAdvanced } from '@/lib/services/ygoprodeck';
import CardDisplay from './CardDisplay';
import AdvancedFilters, { FilterOptions } from './AdvancedFilters';
import CardScanner from './CardScanner';
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

// Detect if input is a Set Code (e.g., LOB-EN001, SDK-001, CT13-EN008, MVP1-ENSV4)
function isSetCode(input: string): boolean {
  const trimmed = input.trim().toUpperCase();
  // Pattern: 2-6 alphanumeric chars, dash, 3-7 alphanumeric chars
  // Examples: LOB-001, SDK-E001, LOB-EN001, CT13-EN008, MVP1-ENSV4, DP03-EN001
  const setCodePattern = /^[A-Z0-9]{2,6}-[A-Z0-9]{3,7}$/;
  return setCodePattern.test(trimmed);
}

// Search by Set Code using internal API route (avoids CORS issues)
async function searchBySetCode(setCode: string): Promise<YugiohCard | null> {
  const cleanSetCode = setCode.trim().toUpperCase();
  console.log('🔍 Searching by set code:', cleanSetCode);

  try {
    // Call internal API route to search by set code
    const response = await fetch(
      `/api/yugioh/search-setcode?code=${encodeURIComponent(cleanSetCode)}`
    );

    if (!response.ok) {
      console.log('❌ API returned error:', response.status);
      return null;
    }

    const data = await response.json();

    if (data.success && data.cardName) {
      console.log('✅ Found via API:', data.cardName, `(source: ${data.source})`);

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
        return cardWithSetInfo;
      }
    }

    console.log('❌ No card found with set code:', cleanSetCode);
    return null;
  } catch (error) {
    console.error('❌ Error searching by set code:', error);
    return null;
  }
}

export default function CardSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cards, setCards] = useState<YugiohCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({});
  const [showScanner, setShowScanner] = useState(false);

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

      // Check if the query is a Set Code (e.g., LOB-EN001)
      if (hasQuery && isSetCode(query) && !hasFilters) {
        console.log('🏷️ Detected Set Code format, searching by set code...');
        const card = await searchBySetCode(query);
        if (card) {
          results = [card];
        } else {
          setError(`No se encontró ninguna carta con el Set Code: ${query.trim().toUpperCase()}`);
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
          setError('No se encontraron cartas con esos criterios');
        }
      } else {
        results = await searchCardsByName(query);
        if (results.length === 0) {
          setError('No se encontraron cartas con esos criterios');
        }
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
            placeholder="Busca por nombre o Set Code: Dark Magician, LOB-EN001..."
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
            title="Escanear carta con cámara"
          >
            {showScanner ? '✕' : '📸'}
          </button>
        </div>
        <p className={styles.searchHint}>
          💡 Busca por nombre, Set Code (ej: LOB-EN001), usa filtros avanzados, o escanea con la cámara
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
