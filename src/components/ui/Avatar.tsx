'use client';

import { forwardRef, ImgHTMLAttributes } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

type AvatarSize = 'xs' | 's' | 'm' | 'l' | 'xl';

interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'size'> {
  src: string;
  alt?: string;
  size?: AvatarSize;
  marginLeft?: string;
  marginRight?: string;
}

const sizeMap: Record<AvatarSize, number> = {
  xs: 24,
  s: 32,
  m: 40,
  l: 56,
  xl: 80,
};

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(({
  src,
  alt = 'Avatar',
  size = 'm',
  marginLeft,
  marginRight,
  className,
  style,
  ...props
}, ref) => {
  const dimension = sizeMap[size];

  return (
    <div
      ref={ref}
      className={cn(
        'relative rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0',
        className
      )}
      style={{
        width: dimension,
        height: dimension,
        marginLeft,
        marginRight,
        ...style,
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes={`${dimension}px`}
      />
    </div>
  );
});

Avatar.displayName = 'Avatar';

export default Avatar;
