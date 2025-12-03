'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { OptimizedMedia } from './OptimizedMedia';
import styles from './MediaCarousel.module.scss';

interface MediaCarouselProps {
  media: string[];
}

export function MediaCarousel({ media }: MediaCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!media || media.length === 0) {
    return null;
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  };

  if (media.length === 1) {
    return (
      <OptimizedMedia
        src={media[0]}
        alt="Project media"
        fill
        sizes="(max-width: 768px) 100vw, 80vw"
        radius="l"
        priority
      />
    );
  }

  return (
    <div className={styles.carousel}>
      <OptimizedMedia
        src={media[currentIndex]}
        alt={`Project media ${currentIndex + 1}`}
        fill
        sizes="(max-width: 768px) 100vw, 80vw"
        radius="l"
        priority
      />
      <div className={`${styles.controls} flex items-center justify-between w-full`}>
        <button
          onClick={handlePrevious}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        <div className="flex gap-1 justify-center">
          {media.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${index === currentIndex ? styles.active : ''}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        <button
          onClick={handleNext}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
      </div>
    </div>
  );
}
