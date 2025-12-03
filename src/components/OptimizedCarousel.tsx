'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface OptimizedCarouselProps {
  images: string[];
  title: string;
  priority?: boolean;
  sizes?: string;
}

// Check if a file is a video based on extension
const isVideo = (src: string) => {
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
  return videoExtensions.some(ext => src.toLowerCase().endsWith(ext));
};

export function OptimizedCarousel({
  images = [],
  title,
  priority = false,
  sizes = '(max-width: 960px) 100vw, 960px'
}: OptimizedCarouselProps) {
  const [loadedImages, setLoadedImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

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

  // Handle video play/pause when slide changes
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentIndex) {
          video.play().catch(() => {});
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  }, [currentIndex]);

  if (!images || images.length === 0) {
    return null;
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? loadedImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === loadedImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div data-carousel-id={title} className="relative w-full aspect-video rounded-xl overflow-hidden group">
      {/* Images and Videos */}
      {loadedImages.map((media, index) => (
        <div
          key={media}
          className={`absolute inset-0 transition-opacity duration-300 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {isVideo(media) ? (
            <video
              ref={(el) => { videoRefs.current[index] = el; }}
              src={media}
              className="w-full h-full object-cover"
              muted
              loop
              playsInline
              autoPlay={index === currentIndex}
            />
          ) : (
            <Image
              src={media}
              alt={`${title} - Image ${index + 1}`}
              fill
              sizes={sizes}
              className="object-cover"
              priority={priority && index === 0}
            />
          )}
        </div>
      ))}

      {/* Navigation Arrows */}
      {loadedImages.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="
              absolute left-2 top-1/2 -translate-y-1/2
              p-2 rounded-full bg-black/50 text-white
              opacity-0 group-hover:opacity-100 transition-opacity
              hover:bg-black/70
            "
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNext}
            className="
              absolute right-2 top-1/2 -translate-y-1/2
              p-2 rounded-full bg-black/50 text-white
              opacity-0 group-hover:opacity-100 transition-opacity
              hover:bg-black/70
            "
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {loadedImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`
                  w-2 h-2 rounded-full transition-all
                  ${index === currentIndex
                    ? 'bg-white w-4'
                    : 'bg-white/50 hover:bg-white/75'
                  }
                `}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
