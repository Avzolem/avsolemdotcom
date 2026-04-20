import { ScryfallCard, ScryfallSearchResponse, MagicCard, transformScryfallCard } from '@/types/magic';
import { API_CONFIG } from '@/lib/constants/magic';

const CACHE_DURATION = API_CONFIG.CACHE_DURATION;
const RATE_LIMIT_MS = API_CONFIG.RATE_LIMIT_MS;

// In-memory cache
interface CacheEntry {
  data: unknown;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
let lastRequestTime = 0;

function isCacheValid(entry: CacheEntry): boolean {
  return Date.now() - entry.timestamp < CACHE_DURATION;
}

// Rate limiter: ensure RATE_LIMIT_MS between requests.
// Reserves the next slot BEFORE awaiting so concurrent callers serialize
// correctly instead of all reading the same stale lastRequestTime.
async function rateLimitedFetch(url: string): Promise<Response> {
  const nextSlot = Math.max(Date.now(), lastRequestTime + RATE_LIMIT_MS);
  lastRequestTime = nextSlot;
  const delay = nextSlot - Date.now();
  if (delay > 0) {
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  return fetch(url, {
    headers: {
      'User-Agent': API_CONFIG.USER_AGENT,
      Accept: 'application/json',
    },
  });
}

async function fetchWithCache<T>(url: string, cacheKey: string): Promise<T | null> {
  const cached = cache.get(cacheKey);
  if (cached && isCacheValid(cached)) {
    return cached.data as T;
  }

  try {
    const response = await rateLimitedFetch(url);

    if (!response.ok) {
      if (response.status === 404) {
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
    console.error('[Scryfall API] Fetch error:', error);
    return null;
  }
}

/**
 * Search cards by name using Scryfall search
 */
export async function searchCards(query: string, page: number = 1): Promise<{
  cards: MagicCard[];
  totalCards: number;
  hasMore: boolean;
}> {
  if (!query || query.trim().length < 2) return { cards: [], totalCards: 0, hasMore: false };

  const url = `${API_CONFIG.BASE_URL}/cards/search?q=${encodeURIComponent(query.trim())}&page=${page}&unique=prints`;
  const cacheKey = `search:${query.toLowerCase()}:${page}`;

  const result = await fetchWithCache<ScryfallSearchResponse>(url, cacheKey);

  if (!result || !result.data) {
    return { cards: [], totalCards: 0, hasMore: false };
  }

  return {
    cards: result.data.map(transformScryfallCard),
    totalCards: result.total_cards,
    hasMore: result.has_more,
  };
}

/**
 * Search cards with advanced filters using Scryfall query syntax
 */
export async function searchCardsWithFilters(params: {
  name?: string;
  type?: string;
  colors?: string[];
  cmcMin?: number;
  cmcMax?: number;
  rarity?: string;
  set?: string;
  format?: string;
  page?: number;
}): Promise<{ cards: MagicCard[]; totalCards: number; hasMore: boolean }> {
  const queryParts: string[] = [];

  if (params.name) queryParts.push(params.name);
  if (params.type) queryParts.push(`t:${params.type}`);
  if (params.colors && params.colors.length > 0) {
    queryParts.push(`c:${params.colors.join('')}`);
  }
  if (params.cmcMin !== undefined) queryParts.push(`cmc>=${params.cmcMin}`);
  if (params.cmcMax !== undefined) queryParts.push(`cmc<=${params.cmcMax}`);
  if (params.rarity) queryParts.push(`r:${params.rarity}`);
  if (params.set) queryParts.push(`s:${params.set}`);
  if (params.format) queryParts.push(`f:${params.format}`);

  if (queryParts.length === 0) return { cards: [], totalCards: 0, hasMore: false };

  const query = queryParts.join(' ');
  return searchCards(query, params.page || 1);
}

/**
 * Fuzzy name search - finds the best match for a card name
 */
export async function fuzzySearch(name: string): Promise<MagicCard | null> {
  if (!name || name.trim().length < 2) return null;

  const url = `${API_CONFIG.BASE_URL}/cards/named?fuzzy=${encodeURIComponent(name.trim())}`;
  const cacheKey = `fuzzy:${name.toLowerCase()}`;

  const raw = await fetchWithCache<ScryfallCard>(url, cacheKey);
  if (!raw) return null;

  return transformScryfallCard(raw);
}

/**
 * Get autocomplete suggestions
 */
export async function autocomplete(query: string): Promise<string[]> {
  if (!query || query.trim().length < 2) return [];

  const url = `${API_CONFIG.BASE_URL}/cards/autocomplete?q=${encodeURIComponent(query.trim())}`;
  const cacheKey = `autocomplete:${query.toLowerCase()}`;

  const result = await fetchWithCache<{ data: string[] }>(url, cacheKey);
  return result?.data || [];
}

/**
 * Get full card details by Scryfall ID
 */
export async function getCardById(id: string): Promise<MagicCard | null> {
  const url = `${API_CONFIG.BASE_URL}/cards/${encodeURIComponent(id)}`;
  const cacheKey = `card:${id}`;

  const raw = await fetchWithCache<ScryfallCard>(url, cacheKey);
  if (!raw) return null;

  return transformScryfallCard(raw);
}

/**
 * Get multiple cards by IDs (sequential with rate limiting)
 */
export async function getCardsByIds(ids: string[]): Promise<MagicCard[]> {
  if (ids.length === 0) return [];

  const results: MagicCard[] = [];
  for (const id of ids) {
    const card = await getCardById(id);
    if (card) results.push(card);
  }
  return results;
}

/**
 * Get card price in USD
 */
export function getCardPrice(card: MagicCard): number {
  return card.prices.usd || card.prices.usdFoil || card.prices.eur || 0;
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
