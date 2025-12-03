'use client';

import { forwardRef, ImgHTMLAttributes } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface MediaProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  alt: string;
  aspectRatio?: string;
  radius?: 'none' | 's' | 'm' | 'l' | 'xl' | 'full';
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
}

const radiusClasses: Record<string, string> = {
  none: 'rounded-none',
  s: 'rounded',
  m: 'rounded-lg',
  l: 'rounded-xl',
  xl: 'rounded-2xl',
  full: 'rounded-full',
};

export const Media = forwardRef<HTMLDivElement, MediaProps>(({
  src,
  alt,
  aspectRatio,
  radius = 'm',
  fill,
  sizes = '100vw',
  priority,
  objectFit = 'cover',
  className,
  style,
  ...props
}, ref) => {
  const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(src);

  if (isVideo) {
    return (
      <div
        ref={ref}
        className={cn('relative overflow-hidden', radiusClasses[radius], className)}
        style={{ aspectRatio, ...style }}
      >
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
      <div
        ref={ref}
        className={cn('relative w-full h-full overflow-hidden', radiusClasses[radius], className)}
        style={style}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn('object-cover', objectFit === 'contain' && 'object-contain')}
        />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn('relative overflow-hidden', radiusClasses[radius], className)}
      style={{ aspectRatio, ...style }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn('object-cover', objectFit === 'contain' && 'object-contain')}
      />
    </div>
  );
});

Media.displayName = 'Media';

export default Media;
