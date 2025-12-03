'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

interface OptimizedMediaProps {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  radius?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  className?: string;
}

const radiusMap: Record<string, string> = {
  's': 'rounded',
  'm': 'rounded-lg',
  'l': 'rounded-xl',
  'xl': 'rounded-2xl',
  'full': 'rounded-full',
};

export function OptimizedMedia({
  src,
  alt,
  fill = false,
  sizes,
  radius,
  loading = 'lazy',
  priority = false,
  className
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

  const radiusClass = radius ? radiusMap[radius] || '' : '';

  if (!isInView && !priority) {
    return (
      <div
        data-media-src={src}
        className={`bg-gray-200 dark:bg-gray-800 ${radiusClass} ${className || ''}`}
        style={{
          aspectRatio: fill ? 'auto' : '16/9',
          width: '100%',
        }}
      />
    );
  }

  const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(src);

  if (isVideo) {
    return (
      <div className={`relative overflow-hidden ${radiusClass} ${className || ''}`}>
        <video
          src={src}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
      </div>
    );
  }

  if (fill) {
    return (
      <div className={`relative w-full h-full overflow-hidden ${radiusClass} ${className || ''}`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes || '100vw'}
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${radiusClass} ${className || ''}`} style={{ aspectRatio: '16/9' }}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes || '100vw'}
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}
