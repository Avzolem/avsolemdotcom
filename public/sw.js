// OPTIMIZED SERVICE WORKER for Performance
// Cache strategies for different resource types

const CACHE_NAME = 'avsolem-portfolio-v1';
const STATIC_CACHE_NAME = 'avsolem-static-v1';
const IMAGE_CACHE_NAME = 'avsolem-images-v1';
const API_CACHE_NAME = 'avsolem-api-v1';

// Resources to cache immediately
const STATIC_RESOURCES = [
  '/',
  '/about',
  '/work',
  '/blog',
  '/gallery',
  '/_next/static/css/',
  '/_next/static/chunks/',
  '/manifest.json',
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
  console.log('Service worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Caching static resources');
        return cache.addAll(STATIC_RESOURCES.filter(url => !url.endsWith('/')));
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== STATIC_CACHE_NAME && 
                     cacheName !== IMAGE_CACHE_NAME && 
                     cacheName !== API_CACHE_NAME;
            })
            .map((cacheName) => {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Fetch event - cache strategies by resource type
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (!url.origin.includes(self.location.origin)) {
    return;
  }

  event.respondWith(handleRequest(request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  try {
    // Strategy 1: Images - Cache First with fallback
    if (pathname.startsWith('/images/') || 
        pathname.includes('.jpg') || 
        pathname.includes('.jpeg') || 
        pathname.includes('.png') || 
        pathname.includes('.webp') || 
        pathname.includes('.avif')) {
      return await cacheFirst(request, IMAGE_CACHE_NAME);
    }

    // Strategy 2: Static assets - Cache First
    if (pathname.startsWith('/_next/static/') || 
        pathname.includes('.css') || 
        pathname.includes('.js')) {
      return await cacheFirst(request, STATIC_CACHE_NAME);
    }

    // Strategy 3: API routes - Network First with cache fallback
    if (pathname.startsWith('/api/')) {
      return await networkFirst(request, API_CACHE_NAME);
    }

    // Strategy 4: Pages - Stale While Revalidate
    if (pathname === '/' || 
        pathname.startsWith('/about') || 
        pathname.startsWith('/work') || 
        pathname.startsWith('/blog') || 
        pathname.startsWith('/gallery')) {
      return await staleWhileRevalidate(request, CACHE_NAME);
    }

    // Default: Network only
    return await fetch(request);

  } catch (error) {
    console.log('Fetch failed:', error);
    
    // Return offline fallback for navigation requests
    if (request.destination === 'document') {
      const cachedResponse = await caches.match('/');
      return cachedResponse || new Response('Offline', { status: 503 });
    }
    
    throw error;
  }
}

// Cache First Strategy (for images, static assets)
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  const networkResponse = await fetch(request);
  
  if (networkResponse.status === 200) {
    cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

// Network First Strategy (for API calls)
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Stale While Revalidate Strategy (for pages)
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.status === 200) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(() => cachedResponse);
  
  // Return cached version immediately, update in background
  return cachedResponse || fetchPromise;
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(handleBackgroundSync());
  }
});

async function handleBackgroundSync() {
  // Handle any offline actions when back online
  console.log('Background sync triggered');
}

// Push notifications (if needed later)
self.addEventListener('push', (event) => {
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: '/images/icon-192x192.png',
      badge: '/images/badge-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        primaryKey: 1
      }
    };
    
    event.waitUntil(
      self.registration.showNotification('Portfolio Update', options)
    );
  }
});