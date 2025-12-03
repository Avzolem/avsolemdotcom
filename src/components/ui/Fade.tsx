'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type FadeDirection = 'top' | 'bottom' | 'left' | 'right';

interface FadeProps extends HTMLAttributes<HTMLDivElement> {
  fillWidth?: boolean;
  position?: 'fixed' | 'absolute' | 'relative' | 'sticky';
  height?: string;
  zIndex?: number;
  to?: FadeDirection;
  bottom?: string;
}

export const Fade = forwardRef<HTMLDivElement, FadeProps>(({
  fillWidth,
  position = 'relative',
  height = '80',
  zIndex,
  to = 'bottom',
  bottom,
  className,
  style,
  ...props
}, ref) => {
  const gradientDirection = {
    top: 'to-t',
    bottom: 'to-b',
    left: 'to-l',
    right: 'to-r',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'pointer-events-none',
        fillWidth && 'w-full',
        `bg-gradient-${gradientDirection[to]}`,
        'from-transparent',
        'to-[var(--background)]',
        className
      )}
      style={{
        position,
        height: `${parseFloat(height) * 0.25}rem`,
        zIndex,
        bottom: bottom === '0' ? 0 : bottom,
        ...style,
      }}
      {...props}
    />
  );
});

Fade.displayName = 'Fade';

export default Fade;
