'use client';

import { useState } from 'react';
import { Media, Flex, Button } from '@once-ui-system/core';

interface MediaCarouselProps {
  media: string[];
}

export function MediaCarousel({ media }: MediaCarouselProps) {
  // Filter out duplicate video formats (keep only mp4 or first video for each)
  const uniqueMedia = media.filter((item, index) => {
    // Keep all non-webm files
    if (!item.endsWith('.webm')) return true;
    // For webm files, only keep if there's no corresponding mp4
    const baseName = item.replace('.webm', '');
    return !media.some(m => m === baseName + '.mp4');
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? uniqueMedia.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === uniqueMedia.length - 1 ? 0 : prevIndex + 1
    );
  };

  const currentMedia = uniqueMedia[currentIndex];
  const isVideo = currentMedia?.endsWith('.mp4') || currentMedia?.endsWith('.webm');

  if (!media || media.length === 0) return null;

  return (
    <Flex direction="column" gap="m" style={{ position: 'relative' }}>
      {isVideo ? (
        <video
          key={currentMedia}
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: '100%',
            aspectRatio: '16 / 9',
            borderRadius: 'var(--radius-m)',
            objectFit: 'cover'
          }}
        >
          {/* Get the base name of the current video */}
          {(() => {
            const baseName = currentMedia.replace(/\.(mp4|webm)$/, '');
            const webmVersion = media.find(m => m === baseName + '.webm');
            const mp4Version = media.find(m => m === baseName + '.mp4');
            
            return (
              <>
                {webmVersion && <source key={webmVersion} src={webmVersion} type="video/webm" />}
                {mp4Version && <source key={mp4Version} src={mp4Version} type="video/mp4" />}
              </>
            );
          })()}
        </video>
      ) : (
        <Media
          priority
          aspectRatio="16 / 9"
          radius="m"
          alt={`Project image ${currentIndex + 1}`}
          src={currentMedia}
        />
      )}
      
      {uniqueMedia.length > 1 && (
        <>
          <Flex 
            style={{ 
              position: 'absolute', 
              top: '50%', 
              transform: 'translateY(-50%)',
              width: '100%',
              justifyContent: 'space-between',
              padding: '0 var(--space-m)',
              pointerEvents: 'none'
            }}
          >
            <Button
              onClick={handlePrevious}
              variant="secondary"
              size="s"
              prefixIcon="chevronLeft"
              style={{ pointerEvents: 'auto' }}
              aria-label="Previous image"
            />
            <Button
              onClick={handleNext}
              variant="secondary"
              size="s"
              suffixIcon="chevronRight"
              style={{ pointerEvents: 'auto' }}
              aria-label="Next image"
            />
          </Flex>
          
          <Flex gap="4" align="center" justify="center">
            {uniqueMedia.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  border: 'none',
                  background: index === currentIndex 
                    ? 'var(--accent-solid-medium)' 
                    : 'var(--neutral-alpha-weak)',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease'
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </Flex>
        </>
      )}
    </Flex>
  );
}