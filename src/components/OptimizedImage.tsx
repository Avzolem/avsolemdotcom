"use client";

import React, { useState, memo } from "react";
import Image from "next/image";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  sizes?: string;
  fill?: boolean;
  aspectRatio?: string;
  lazy?: boolean;
}

// OPTIMIZATION: Memoized optimized image component
export const OptimizedImage = memo<OptimizedImageProps>(({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  quality = 85,
  placeholder = "empty",
  blurDataURL,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  fill = false,
  aspectRatio,
  lazy = true,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Generate optimized sizes for different viewports
  const responsiveSizes = sizes || 
    "(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 60vw, 50vw";

  // Container styles for aspect ratio
  const containerStyles: React.CSSProperties = {
    position: fill ? "relative" : undefined,
    width: fill ? "100%" : width,
    height: fill ? "100%" : height,
    aspectRatio: aspectRatio,
    overflow: "hidden",
    backgroundColor: isLoaded ? "transparent" : "#f0f0f0",
    transition: "background-color 0.3s ease",
  };

  // Image styles
  const imageStyles: React.CSSProperties = {
    transition: "opacity 0.3s ease",
    opacity: isLoaded ? 1 : 0,
  };

  // Error fallback component
  if (hasError) {
    return (
      <div 
        className={`${className} image-error-fallback`}
        style={{
          ...containerStyles,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8f8f8",
          color: "#666",
          fontSize: "14px",
        }}
      >
        Failed to load image
      </div>
    );
  }

  return (
    <div className={`${className} optimized-image-container`} style={containerStyles}>
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        sizes={responsiveSizes}
        loading={lazy && !priority ? "lazy" : "eager"}
        style={imageStyles}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        // Performance optimizations
        decoding="async"
        draggable={false}
      />
      
      {/* Loading skeleton */}
      {!isLoaded && !hasError && (
        <div 
          className="loading-skeleton"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
            backgroundSize: "200% 100%",
            animation: "loading-shimmer 1.5s infinite",
          }}
        />
      )}
    </div>
  );
});

OptimizedImage.displayName = "OptimizedImage";

// OPTIMIZATION: Avatar component with automatic optimization
export const OptimizedAvatar = memo<{
  src: string;
  alt?: string;
  size?: "s" | "m" | "l" | "xl";
  className?: string;
}>(({ src, alt = "Avatar", size = "m", className = "" }) => {
  const sizeMap = {
    s: { width: 32, height: 32 },
    m: { width: 48, height: 48 },
    l: { width: 64, height: 64 },
    xl: { width: 96, height: 96 },
  };

  const { width, height } = sizeMap[size];

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`${className} avatar`}
      priority={false}
      quality={90}
      aspectRatio="1/1"
      sizes={`${width}px`}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
    />
  );
});

OptimizedAvatar.displayName = "OptimizedAvatar";

// OPTIMIZATION: Gallery image component
export const OptimizedGalleryImage = memo<{
  src: string;
  alt: string;
  orientation?: "horizontal" | "vertical";
  priority?: boolean;
  className?: string;
}>(({ src, alt, orientation = "horizontal", priority = false, className = "" }) => {
  const aspectRatio = orientation === "horizontal" ? "16/9" : "3/4";

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      priority={priority}
      quality={80}
      aspectRatio={aspectRatio}
      className={className}
      sizes="(max-width: 560px) 100vw, 50vw"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAACAAIDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
    />
  );
});

OptimizedGalleryImage.displayName = "OptimizedGalleryImage";