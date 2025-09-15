'use client';

import { Media } from '@once-ui-system/core';
import { useState, useEffect } from 'react';

interface OptimizedMediaProps {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  radius?: any;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
}

export function OptimizedMedia({
  src,
  alt,
  fill = false,
  sizes,
  radius,
  loading = 'lazy',
  priority = false
}: OptimizedMediaProps) {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (priority || loading === 'eager') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { rootMargin: '50px' }
    );

    const element = document.querySelector(`[data-media-src="${src}"]`);
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [src, priority, loading]);

  if (!isInView && !priority) {
    return (
      <div
        data-media-src={src}
        style={{
          backgroundColor: 'var(--background-neutral-weak)',
          aspectRatio: fill ? 'auto' : '16/9',
          width: '100%',
          borderRadius: radius ? `var(--border-radius-${radius})` : undefined
        }}
      />
    );
  }

  return (
    <Media
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      radius={radius}
    />
  );
}