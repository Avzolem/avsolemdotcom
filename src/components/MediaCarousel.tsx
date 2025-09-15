'use client';

import { useState } from 'react';
import { Flex, IconButton } from '@once-ui-system/core';
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
      <Flex
        className={styles.controls}
        horizontal="between"
        vertical="center"
        fillWidth
      >
        <IconButton
          icon="chevronLeft"
          onClick={handlePrevious}
          variant="secondary"
          size="m"
        />
        <Flex gap="4" horizontal="center">
          {media.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${index === currentIndex ? styles.active : ''}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </Flex>
        <IconButton
          icon="chevronRight"
          onClick={handleNext}
          variant="secondary"
          size="m"
        />
      </Flex>
    </div>
  );
}