'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface GridProps extends HTMLAttributes<HTMLDivElement> {
  columns?: number | string;
  gap?: string;
  padding?: string;
  fillWidth?: boolean;
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(({
  columns = 1,
  gap = '4',
  padding,
  fillWidth,
  className,
  style,
  children,
  ...props
}, ref) => {
  const gridTemplateColumns = typeof columns === 'number'
    ? `repeat(${columns}, minmax(0, 1fr))`
    : columns;

  return (
    <div
      ref={ref}
      className={cn(
        'grid',
        fillWidth && 'w-full',
        className
      )}
      style={{
        gridTemplateColumns,
        gap: `${parseFloat(gap) * 0.25}rem`,
        padding: padding ? `${parseFloat(padding) * 0.25}rem` : undefined,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
});

Grid.displayName = 'Grid';

export default Grid;
