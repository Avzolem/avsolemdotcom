"use client";

import { useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface PreloadOptions {
  onHover?: boolean;
  onVisible?: boolean;
  preloadImages?: boolean;
  priority?: 'high' | 'low';
}

// Smart preloading hook for performance optimization
export function useSmartPreloading(href: string, options: PreloadOptions = {}) {
  const router = useRouter();
  const preloadedRef = useRef(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const {
    onHover = true,
    onVisible = false,
    preloadImages = false,
    priority = 'low'
  } = options;

  // Preload function
  const preloadRoute = useCallback(async (route: string) => {
    if (preloadedRef.current) return;
    
    try {
      // Preload the route
      router.prefetch(route);
      preloadedRef.current = true;

      if (process.env.NODE_ENV === 'development') {
        console.log(`🚀 Preloaded route: ${route}`);
      }

      // Optionally preload images on that route
      if (preloadImages) {
        await preloadRouteImages(route);
      }

    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to preload route:', error);
      }
    }
  }, [router, preloadImages]);

  // Preload images for a route
  const preloadRouteImages = async (route: string) => {
    // This would typically fetch the page metadata or use a predefined map
    const routeImageMap: Record<string, string[]> = {
      '/work': [],
      '/gallery': [
        '/images/gallery/horizontal-1.jpg',
        '/images/gallery/vertical-1.jpg'
      ],
      '/about': ['/images/andres.jpeg'],
      '/blog': ['/images/og/home.jpg'],
    };

    const images = routeImageMap[route] || [];
    
    const preloadPromises = images.map((src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = src;
      });
    });

    try {
      await Promise.all(preloadPromises);
      if (process.env.NODE_ENV === 'development') {
        console.log(`🖼️ Preloaded ${images.length} images for ${route}`);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to preload images:', error);
      }
    }
  };

  // Mouse enter handler with delay to avoid accidental preloads
  const handleMouseEnter = useCallback(() => {
    if (!onHover) return;

    // Add small delay to avoid preloading on accidental hovers
    hoverTimeoutRef.current = setTimeout(() => {
      preloadRoute(href);
    }, 150);
  }, [href, onHover, preloadRoute]);

  // Mouse leave handler to cancel preload
  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  }, []);

  // Intersection observer for visible preloading
  useEffect(() => {
    if (!onVisible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            preloadRoute(href);
          }
        });
      },
      { 
        rootMargin: '200px', // Preload when 200px away from viewport
        threshold: 0.1 
      }
    );

    // This would typically observe the link element
    // For now, we'll trigger after a short delay
    const timeout = setTimeout(() => {
      preloadRoute(href);
    }, 2000);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, [href, onVisible, preloadRoute]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    preloadRoute: () => preloadRoute(href),
  };
}

// Hook for predictive preloading based on user behavior
export function usePredictivePreloading() {
  const router = useRouter();
  const userBehaviorRef = useRef({
    visitedPages: [] as string[],
    timeOnPages: {} as Record<string, number>,
    hoverPatterns: [] as string[],
  });

  // Track user behavior
  useEffect(() => {
    const currentPath = window.location.pathname;
    const behavior = userBehaviorRef.current;
    
    // Track page visit
    if (!behavior.visitedPages.includes(currentPath)) {
      behavior.visitedPages.push(currentPath);
    }

    // Track time on page
    const startTime = Date.now();
    
    return () => {
      const timeSpent = Date.now() - startTime;
      behavior.timeOnPages[currentPath] = (behavior.timeOnPages[currentPath] || 0) + timeSpent;
    };
  }, []);

  // Predict and preload likely next pages
  const predictAndPreload = useCallback(() => {
    const behavior = userBehaviorRef.current;
    const currentPath = window.location.pathname;
    
    // Simple prediction logic
    const predictions = [];
    
    // If on homepage, user likely goes to about or work
    if (currentPath === '/') {
      predictions.push('/about', '/work');
    }
    
    // If on about, user might go to work
    if (currentPath === '/about') {
      predictions.push('/work', '/blog');
    }
    
    // If on work, user might go to specific projects or blog
    if (currentPath === '/work') {
      predictions.push('/blog', '/gallery');
    }

    // If user spent a lot of time on blog, they might want to see more
    if (behavior.timeOnPages['/blog'] > 30000) { // 30 seconds
      predictions.push('/work', '/about');
    }

    // Preload top predictions
    predictions.slice(0, 2).forEach((route) => {
      router.prefetch(route);
    });

    if (process.env.NODE_ENV === 'development' && predictions.length > 0) {
      console.log(`🔮 Predictive preloading: ${predictions.join(', ')}`);
    }

  }, [router]);

  // Run prediction after user has been on page for a while
  useEffect(() => {
    const timeout = setTimeout(predictAndPreload, 5000); // 5 seconds
    return () => clearTimeout(timeout);
  }, [predictAndPreload]);

  return { predictAndPreload };
}

// Component wrapper for easy integration
export function SmartPreloadLink({ 
  href, 
  children, 
  className,
  options = {}
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  options?: PreloadOptions;
}) {
  const { onMouseEnter, onMouseLeave } = useSmartPreloading(href, options);

  return (
    <a
      href={href}
      className={className}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </a>
  );
}