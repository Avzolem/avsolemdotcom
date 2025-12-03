'use client';

import { forwardRef, HTMLAttributes, CSSProperties } from 'react';
import { cn } from '@/lib/utils';

interface BackgroundProps extends HTMLAttributes<HTMLDivElement> {
  position?: 'fixed' | 'absolute' | 'relative' | 'sticky';
  mask?: {
    cursor?: boolean;
    x?: number;
    y?: number;
    radius?: number;
  };
  gradient?: {
    display?: boolean;
    opacity?: number;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    tilt?: number;
    colorStart?: string;
    colorEnd?: string;
  };
  dots?: {
    display?: boolean;
    opacity?: number;
    size?: string;
    color?: string;
  };
  grid?: {
    display?: boolean;
    opacity?: number;
    color?: string;
    width?: string;
    height?: string;
  };
  lines?: {
    display?: boolean;
    opacity?: number;
    color?: string;
    size?: string;
    thickness?: number;
    angle?: number;
  };
}

export const Background = forwardRef<HTMLDivElement, BackgroundProps>(({
  position = 'absolute',
  mask,
  gradient,
  dots,
  grid,
  lines,
  className,
  style,
  ...props
}, ref) => {
  // Build background styles
  const backgrounds: string[] = [];

  // Gradient effect
  if (gradient?.display) {
    backgrounds.push(
      `radial-gradient(ellipse ${gradient.width || 50}% ${gradient.height || 50}% at ${gradient.x || 50}% ${gradient.y || 0}%, rgba(59, 130, 246, ${(gradient.opacity || 30) / 100}) 0%, transparent 70%)`
    );
  }

  // Dots effect
  if (dots?.display) {
    const dotSize = dots.size ? parseFloat(dots.size) * 0.25 : 0.5;
    backgrounds.push(
      `radial-gradient(circle, rgba(255, 255, 255, ${(dots.opacity || 20) / 100}) ${dotSize}rem, transparent ${dotSize}rem)`
    );
  }

  // Grid effect
  if (grid?.display) {
    const gridW = grid.width || '1rem';
    const gridH = grid.height || '1rem';
    backgrounds.push(
      `linear-gradient(rgba(255, 255, 255, ${(grid.opacity || 10) / 100}) 1px, transparent 1px),
       linear-gradient(90deg, rgba(255, 255, 255, ${(grid.opacity || 10) / 100}) 1px, transparent 1px)`
    );
  }

  // Lines effect
  if (lines?.display) {
    const angle = lines.angle || 45;
    backgrounds.push(
      `repeating-linear-gradient(${angle}deg, rgba(255, 255, 255, ${(lines.opacity || 10) / 100}) 0px, rgba(255, 255, 255, ${(lines.opacity || 10) / 100}) ${lines.thickness || 1}px, transparent ${lines.thickness || 1}px, transparent ${parseFloat(lines.size || '16') * 4}px)`
    );
  }

  const computedStyle: CSSProperties = {
    position,
    inset: 0,
    pointerEvents: 'none',
    background: backgrounds.length > 0 ? backgrounds.join(', ') : undefined,
    ...style,
  };

  return (
    <div
      ref={ref}
      className={cn('z-0', className)}
      style={computedStyle}
      {...props}
    />
  );
});

Background.displayName = 'Background';

export default Background;
