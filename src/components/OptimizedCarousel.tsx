"use client";

import { useState, useEffect } from 'react';
import { Carousel } from "@once-ui-system/core";

interface OptimizedCarouselProps {
  images: string[];
  title: string;
  priority?: boolean;
  sizes?: string;
}

export function OptimizedCarousel({
  images = [],
  title,
  priority = false,
  sizes = "(max-width: 960px) 100vw, 960px"
}: OptimizedCarouselProps) {
  const [loadedImages, setLoadedImages] = useState<string[]>([]);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (priority || images.length === 0) {
      setLoadedImages(images);
      return;
    }

    // Load first image immediately, rest on intersection
    setLoadedImages([images[0]]);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          setLoadedImages(images);
        }
      },
      { rootMargin: '100px' }
    );

    const element = document.querySelector(`[data-carousel-id="${title}"]`);
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [images, title, priority]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div data-carousel-id={title}>
      <Carousel
        sizes={sizes}
        items={loadedImages.map((image, index) => ({
          slide: image,
          alt: `${title} - Image ${index + 1}`,
        }))}
      />
    </div>
  );
}