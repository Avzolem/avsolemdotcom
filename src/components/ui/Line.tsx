'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface LineProps extends HTMLAttributes<HTMLDivElement> {
  vert?: boolean;
  background?: string;
  maxHeight?: string;
  maxWidth?: string;
}

export const Line = forwardRef<HTMLDivElement, LineProps>(({
  vert,
  background,
  maxHeight,
  maxWidth,
  className,
  style,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'bg-gray-200 dark:bg-gray-700',
        vert ? 'w-px' : 'h-px w-full',
        className
      )}
      style={{
        maxHeight: maxHeight ? `${parseFloat(maxHeight) * 0.25}rem` : undefined,
        maxWidth: maxWidth ? `${parseFloat(maxWidth) * 0.25}rem` : undefined,
        ...style,
      }}
      {...props}
    />
  );
});

Line.displayName = 'Line';

export default Line;
