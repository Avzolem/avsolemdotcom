import { YugiohCard } from '@/types/yugioh';

const API_BASE_URL = 'https://db.ygoprodeck.com/api/v7';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// YGOProDeck API Rate Limiting: 20 requests per second
// To be safe, we'll use 15 requests per second
const MAX_REQUESTS_PER_SECOND = 15;
const REQUEST_INTERVAL = 1000 / MAX_REQUESTS_PER_SECOND; // ~67ms between requests

// In-memory cache
interface CacheEntry {
  data: any;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();

// Rate limiting queue
let lastRequestTime = 0;
let requestQueue: Array<() => void> = [];
let isProcessingQueue = false;

// Rate limiting monitoring
interface RateLimitStats {
  totalRequests: number;
  queuedRequests: number;
  lastRequestTime: number;
  requestsPerMinute: number[];
}

let rateLimitStats: RateLimitStats = {
  totalRequests: 0,
  queuedRequests: 0,
  lastRequestTime: 0,
  requestsPerMinute: [],
};


// Helper function to check if cache is still valid
function isCacheValid(entry: CacheEntry): boolean {
  return Date.now() - entry.timestamp < CACHE_DURATION;
}

// Rate limiting helper - ensures we don't exceed API limits
async function throttleRequest<T>(requestFn: () => Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const executeRequest = async () => {
      const now = Date.now();
      const timeSinceLastRequest = now - lastRequestTime;

      if (timeSinceLastRequest < REQUEST_INTERVAL) {
        const delay = REQUEST_INTERVAL - timeSinceLastRequest;
        await new Promise((r) => setTimeout(r, delay));
      }

      lastRequestTime = Date.now();

      // Update rate limit stats
      rateLimitStats.totalRequests++;
      rateLimitStats.lastRequestTime = lastRequestTime;

      // Track requests per minute
      const currentMinute = Math.floor(Date.now() / 60000);
      if (rateLimitStats.requestsPerMinute.length === 0 ||
          rateLimitStats.requestsPerMinute.length < currentMinute) {
        rateLimitStats.requestsPerMinute.push(1);
      } else {
        rateLimitStats.requestsPerMinute[rateLimitStats.requestsPerMinute.length - 1]++;
      }

      // Keep only last 60 minutes of data
      if (rateLimitStats.requestsPerMinute.length > 60) {
        rateLimitStats.requestsPerMinute.shift();
      }

      try {
        const result = await requestFn();
        resolve(result);
      } catch (error) {
        console.error('[YGOProDeck API] Request failed:', error);
        reject(error);
      }

      // Update queue stats
      rateLimitStats.queuedRequests = requestQueue.length;

      // Process next item in queue
      if (requestQueue.length > 0) {
        const nextRequest = requestQueue.shift();
        if (nextRequest) {
          nextRequest();
        }
      } else {
        isProcessingQueue = false;
      }
    };

    if (!isProcessingQueue) {
      isProcessingQueue = true;
      executeRequest();
    } else {
      requestQueue.push(executeRequest);
      rateLimitStats.queuedRequests = requestQueue.length;

      // Log warning if queue is getting too long
      if (requestQueue.length > 20) {
        console.warn(
          `[YGOProDeck API] Large request queue detected: ${requestQueue.length} requests queued`
        );
      }
    }
  });
}

/**
 * Get current rate limiting statistics
 */
export function getRateLimitStats(): RateLimitStats {
  return { ...rateLimitStats };
}

// Helper function to get from cache or fetch
async function fetchWithCache<T>(
  url: string,
  cacheKey: string
): Promise<T | null> {
  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached && isCacheValid(cached)) {
    return cached.data as T;
  }

  // Fetch from API with rate limiting
  try {
    const data = await throttleRequest(async () => {
      const response = await fetch(url);

      if (!response.ok) {
        // For 400 errors (bad request), return null instead of throwing
        if (response.status === 400) {
          console.warn(`API returned 400 for: ${url}`);
          return null;
        }
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    });

    if (data === null) {
      return null;
    }

    // Store in cache
    cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });

    return data as T;
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}

export interface YGOProDeckResponse {
  data: YugiohCard[];
}

/**
 * Search cards by name (fuzzy search)
 */
export async function searchCardsByName(
  name: string
): Promise<YugiohCard[]> {
  if (!name || name.trim().length < 2) {
    return [];
  }

  const encodedName = encodeURIComponent(name.trim());
  const url = `${API_BASE_URL}/cardinfo.php?fname=${encodedName}`;
  const cacheKey = `search:${name.toLowerCase()}`;

  try {
    const response = await fetchWithCache<YGOProDeckResponse>(url, cacheKey);
    if (!response || !response.data) {
      return [];
    }
    return response.data;
  } catch (error) {
    console.error('Error searching cards:', error);
    return [];
  }
}

/**
 * Get card by exact ID
 */
export async function getCardById(id: number): Promise<YugiohCard | null> {
  const url = `${API_BASE_URL}/cardinfo.php?id=${id}`;
  const cacheKey = `card:${id}`;

  try {
    const response = await fetchWithCache<YGOProDeckResponse>(url, cacheKey);
    if (!response || !response.data) {
      return null;
    }
    return response.data[0] || null;
  } catch (error) {
    console.error('Error fetching card:', error);
    return null;
  }
}

/**
 * Get multiple cards by IDs
 */
export async function getCardsByIds(ids: number[]): Promise<YugiohCard[]> {
  if (ids.length === 0) return [];

  // Fetch all cards in parallel
  const promises = ids.map((id) => getCardById(id));
  const results = await Promise.all(promises);

  return results.filter((card): card is YugiohCard => card !== null);
}

/**
 * Get random cards for showcase
 */
export async function getRandomCards(count: number = 10): Promise<YugiohCard[]> {
  const url = `${API_BASE_URL}/randomcard.php?num=${count}`;
  const cacheKey = `random:${count}:${Date.now()}`;

  try {
    const response = await fetchWithCache<YGOProDeckResponse>(url, cacheKey);
    if (!response || !response.data) {
      return [];
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching random cards:', error);
    return [];
  }
}

/**
 * Search cards with advanced filters
 */
export async function searchCardsAdvanced(params: {
  name?: string;
  type?: string;
  race?: string;
  attribute?: string;
  level?: number;
  atk?: number;
  def?: number;
}): Promise<YugiohCard[]> {
  const queryParams = new URLSearchParams();

  if (params.name) queryParams.append('fname', params.name);
  if (params.type) queryParams.append('type', params.type);
  if (params.race) queryParams.append('race', params.race);
  if (params.attribute) queryParams.append('attribute', params.attribute);
  if (params.level) queryParams.append('level', params.level.toString());
  if (params.atk !== undefined) queryParams.append('atk', params.atk.toString());
  if (params.def !== undefined) queryParams.append('def', params.def.toString());

  const url = `${API_BASE_URL}/cardinfo.php?${queryParams.toString()}`;
  const cacheKey = `advanced:${queryParams.toString()}`;

  try {
    const response = await fetchWithCache<YGOProDeckResponse>(url, cacheKey);
    if (!response || !response.data) {
      return [];
    }
    return response.data;
  } catch (error) {
    console.error('Error searching cards:', error);
    return [];
  }
}

/**
 * Get card price in USD (prioritizes TCGPlayer)
 */
export function getCardPrice(card: YugiohCard): number {
  if (!card.card_prices || card.card_prices.length === 0) {
    return 0;
  }

  const prices = card.card_prices[0];

  // Priority: TCGPlayer > CardMarket > eBay > Amazon > CoolStuffInc
  const priceString =
    prices.tcgplayer_price ||
    prices.cardmarket_price ||
    prices.ebay_price ||
    prices.amazon_price ||
    prices.coolstuffinc_price ||
    '0';

  return parseFloat(priceString);
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
 * Clear cache (useful for testing)
 */
export function clearCache(): void {
  cache.clear();
}
