import { PokemonCard, PokemonCardSummary, PokemonSet, transformTcgdexCard } from '@/types/pokemon';

const API_BASE_URL = 'https://api.tcgdex.net/v2/en';
const POKEMONTCG_CDN = 'https://images.pokemontcg.io';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// In-memory cache
interface CacheEntry {
  data: unknown;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();

function isCacheValid(entry: CacheEntry): boolean {
  return Date.now() - entry.timestamp < CACHE_DURATION;
}

async function fetchWithCache<T>(url: string, cacheKey: string): Promise<T | null> {
  const cached = cache.get(cacheKey);
  if (cached && isCacheValid(cached)) {
    return cached.data as T;
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 400 || response.status === 404) {
        return null;
      }
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });

    return data as T;
  } catch (error) {
    console.error('[TCGdex API] Fetch error:', error);
    return null;
  }
}

/**
 * Search cards by name - returns summaries
 */
export async function searchCardsByName(name: string): Promise<PokemonCardSummary[]> {
  if (!name || name.trim().length < 2) return [];

  const url = `${API_BASE_URL}/cards?name=${encodeURIComponent(name.trim())}`;
  const cacheKey = `search:${name.toLowerCase()}`;

  const results = await fetchWithCache<PokemonCardSummary[]>(url, cacheKey);
  return results || [];
}

/**
 * Search cards with filters - returns summaries
 */
export async function searchCardsWithFilters(params: {
  name?: string;
  category?: string;
  type?: string;
  hp?: number;
  rarity?: string;
}): Promise<PokemonCardSummary[]> {
  const queryParts: string[] = [];

  if (params.name) queryParts.push(`name=${encodeURIComponent(params.name)}`);
  if (params.category) queryParts.push(`category=${encodeURIComponent(params.category)}`);
  if (params.type) queryParts.push(`type=${encodeURIComponent(params.type)}`);
  if (params.hp) queryParts.push(`hp=${params.hp}`);
  if (params.rarity) queryParts.push(`rarity=${encodeURIComponent(params.rarity)}`);

  if (queryParts.length === 0) return [];

  const url = `${API_BASE_URL}/cards?${queryParts.join('&')}`;
  const cacheKey = `filter:${queryParts.join(':')}`;

  const results = await fetchWithCache<PokemonCardSummary[]>(url, cacheKey);
  return results || [];
}

/**
 * Get full card details by ID
 */
export async function getCardById(id: string): Promise<PokemonCard | null> {
  const url = `${API_BASE_URL}/cards/${encodeURIComponent(id)}`;
  const cacheKey = `card:${id}`;

  const raw = await fetchWithCache<any>(url, cacheKey);
  if (!raw) return null;

  return transformTcgdexCard(raw);
}

/**
 * Get multiple cards by IDs (parallel fetch)
 */
export async function getCardsByIds(ids: string[]): Promise<PokemonCard[]> {
  if (ids.length === 0) return [];

  const promises = ids.map(id => getCardById(id));
  const results = await Promise.all(promises);
  return results.filter((card): card is PokemonCard => card !== null);
}

/**
 * Search and fetch full card details
 */
export async function searchCardsFullDetails(params: {
  name?: string;
  category?: string;
  type?: string;
  hp?: number;
  rarity?: string;
  limit?: number;
}): Promise<PokemonCard[]> {
  let summaries: PokemonCardSummary[];

  if (params.name && !params.category && !params.type && !params.hp && !params.rarity) {
    summaries = await searchCardsByName(params.name);
  } else {
    summaries = await searchCardsWithFilters(params);
  }

  // Limit results to avoid too many parallel requests
  const limit = params.limit || 50;
  const limited = summaries.slice(0, limit);

  if (limited.length === 0) return [];

  // Fetch full details in parallel
  const cards = await getCardsByIds(limited.map(s => s.id));
  return cards;
}

/**
 * Search sets
 */
export async function searchSets(): Promise<PokemonSet[]> {
  const url = `${API_BASE_URL}/sets`;
  const cacheKey = 'sets:all';

  const results = await fetchWithCache<any[]>(url, cacheKey);
  return (results || []).map(s => ({
    id: s.id,
    name: s.name,
    logo: s.logo,
    symbol: s.symbol,
    cardCount: s.cardCount,
    images: {
      symbol: s.symbol || '',
      logo: s.logo || '',
    },
  }));
}

/**
 * Get card price in USD from pricing data
 */
export function getCardPrice(card: PokemonCard): number {
  // Try tcgplayer first
  if (card.tcgplayer?.prices) {
    const prices = card.tcgplayer.prices;
    return prices.holofoil?.marketPrice ||
           prices.holofoil?.midPrice ||
           prices.normal?.marketPrice ||
           prices.normal?.midPrice ||
           prices.reverseHolofoil?.marketPrice ||
           prices['1stEditionHolofoil']?.marketPrice ||
           prices['1stEditionNormal']?.marketPrice ||
           0;
  }

  // Try pricing.tcgplayer
  if (card.pricing?.tcgplayer) {
    const tp = card.pricing.tcgplayer;
    return (tp.holofoil as any)?.marketPrice ||
           (tp.holofoil as any)?.midPrice ||
           (tp.normal as any)?.marketPrice ||
           0;
  }

  // Fallback to cardmarket (EUR)
  if (card.cardmarket?.prices) {
    return card.cardmarket.prices.averageSellPrice ||
           card.cardmarket.prices.trendPrice ||
           card.cardmarket.prices.avg1 ||
           0;
  }

  if (card.pricing?.cardmarket) {
    return card.pricing.cardmarket.avg ||
           card.pricing.cardmarket.trend ||
           0;
  }

  return 0;
}

/**
 * Format price for display
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

/**
 * Clear cache
 */
export function clearCache(): void {
  cache.clear();
}
