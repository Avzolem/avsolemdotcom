import { getPosts } from "./utils";

// In-memory cache for MDX content
const mdxCache = new Map<string, any[]>();

// Cache TTL in milliseconds (5 minutes in development, 1 hour in production)
const CACHE_TTL = process.env.NODE_ENV === 'development' ? 5 * 60 * 1000 : 60 * 60 * 1000;

interface CacheEntry {
  data: any[];
  timestamp: number;
}

const cacheWithTimestamp = new Map<string, CacheEntry>();

/**
 * Get cached posts or fetch and cache them
 * @param customPath - Path segments to the MDX files
 * @returns Array of posts with metadata and content
 */
export function getCachedPosts(customPath: string[]): any[] {
  const cacheKey = customPath.join('/');
  const now = Date.now();

  // Check if cache exists and is still valid
  const cached = cacheWithTimestamp.get(cacheKey);
  if (cached && (now - cached.timestamp) < CACHE_TTL) {
    return cached.data;
  }

  // Fetch fresh data
  const posts = getPosts(customPath);

  // Update cache
  cacheWithTimestamp.set(cacheKey, {
    data: posts,
    timestamp: now
  });

  return posts;
}

/**
 * Clear all MDX cache
 */
export function clearMDXCache(): void {
  cacheWithTimestamp.clear();
}

/**
 * Clear specific cache entry
 * @param customPath - Path segments to clear from cache
 */
export function clearMDXCacheEntry(customPath: string[]): void {
  const cacheKey = customPath.join('/');
  cacheWithTimestamp.delete(cacheKey);
}