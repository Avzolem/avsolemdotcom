"use client";

import { useEffect } from 'react';
import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals';

// Web Vitals thresholds (Google recommendations)
const VITALS_THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 },
  INP: { good: 200, needsImprovement: 500 },
  CLS: { good: 0.1, needsImprovement: 0.25 },
  FCP: { good: 1800, needsImprovement: 3000 },
  TTFB: { good: 800, needsImprovement: 1800 },
};

interface VitalsData {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType?: string;
}

// Function to determine rating based on thresholds
function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = VITALS_THRESHOLDS[name as keyof typeof VITALS_THRESHOLDS];
  if (!threshold) return 'good';
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.needsImprovement) return 'needs-improvement';
  return 'poor';
}

// Send vitals data to analytics
function sendToAnalytics(data: VitalsData) {
  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.group(`🚀 Web Vital: ${data.name}`);
    console.log(`Value: ${data.value}ms`);
    console.log(`Rating: ${data.rating}`);
    console.log(`Delta: ${data.delta}ms`);
    console.log(`ID: ${data.id}`);
    console.groupEnd();
  }

  // Send to your analytics service (Google Analytics, etc.)
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', data.name, {
      event_category: 'Web Vitals',
      event_label: data.rating,
      value: Math.round(data.value),
      custom_map: {
        metric_id: data.id,
        metric_value: data.value,
        metric_delta: data.delta,
        metric_rating: data.rating,
      },
    });
  }

  // Send to custom analytics endpoint
  if (process.env.NODE_ENV === 'production') {
    fetch('/api/analytics/vitals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        value: data.value,
        rating: data.rating,
        delta: data.delta,
        id: data.id,
        url: window.location.href,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
      }),
    }).catch((error) => {
      console.error('Failed to send vitals data:', error);
    });
  }
}

// Performance observer for additional metrics
function observePerformance() {
  if (typeof window === 'undefined' || !window.PerformanceObserver) return;

  // Observe resource loading
  const resourceObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      // Log slow resources in development
      if (process.env.NODE_ENV === 'development' && entry.duration > 1000) {
        console.warn(`🐌 Slow resource: ${entry.name} took ${Math.round(entry.duration)}ms`);
      }
    });
  });

  try {
    resourceObserver.observe({ entryTypes: ['resource'] });
  } catch (e) {
    // Browser doesn't support this observer
  }

  // Observe navigation timing
  const navigationObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry: any) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`📊 Navigation: ${entry.type} - ${Math.round(entry.duration)}ms`);
      }
    });
  });

  try {
    navigationObserver.observe({ entryTypes: ['navigation'] });
  } catch (e) {
    // Browser doesn't support this observer
  }

  // Observe long tasks (blocking main thread)
  const longTaskObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`⚠️ Long task detected: ${Math.round(entry.duration)}ms`);
      }
      
      // Send to analytics if task is very long
      if (entry.duration > 50) {
        sendToAnalytics({
          name: 'LongTask',
          value: entry.duration,
          rating: entry.duration > 100 ? 'poor' : 'needs-improvement',
          delta: entry.duration,
          id: 'long-task-' + Date.now(),
        });
      }
    });
  });

  try {
    longTaskObserver.observe({ entryTypes: ['longtask'] });
  } catch (e) {
    // Browser doesn't support this observer
  }
}

// Main Web Vitals tracking component
export function WebVitals() {
  useEffect(() => {
    // Track Core Web Vitals
    onLCP((metric) => {
      sendToAnalytics({
        name: 'LCP',
        value: metric.value,
        rating: getRating('LCP', metric.value),
        delta: metric.delta,
        id: metric.id,
      });
    });

    onINP((metric) => {
      sendToAnalytics({
        name: 'INP',
        value: metric.value,
        rating: getRating('INP', metric.value),
        delta: metric.delta,
        id: metric.id,
      });
    });

    onCLS((metric) => {
      sendToAnalytics({
        name: 'CLS',
        value: metric.value,
        rating: getRating('CLS', metric.value),
        delta: metric.delta,
        id: metric.id,
      });
    });

    // Track additional metrics
    onFCP((metric) => {
      sendToAnalytics({
        name: 'FCP',
        value: metric.value,
        rating: getRating('FCP', metric.value),
        delta: metric.delta,
        id: metric.id,
      });
    });

    onTTFB((metric) => {
      sendToAnalytics({
        name: 'TTFB',
        value: metric.value,
        rating: getRating('TTFB', metric.value),
        delta: metric.delta,
        id: metric.id,
      });
    });

    // Start performance observation
    observePerformance();

    // Track page visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Page is being hidden - metrics are already being tracked by the onXXX functions
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Show performance panel in development
  if (process.env.NODE_ENV === 'development') {
    return (
      <div 
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          fontSize: '12px',
          fontFamily: 'monospace',
          zIndex: 9999,
          maxWidth: '200px',
        }}
        id="web-vitals-panel"
      >
        <div>📊 Web Vitals Active</div>
        <div style={{ fontSize: '10px', marginTop: '5px', opacity: 0.7 }}>
          Check console for metrics
        </div>
      </div>
    );
  }

  return null;
}

// Export the vitals tracking functions
export { onCLS, onINP, onFCP, onLCP, onTTFB };