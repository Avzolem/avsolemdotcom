'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type SpinnerSize = 'xs' | 's' | 'm' | 'l' | 'xl';

interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize;
}

const sizeClasses: Record<SpinnerSize, string> = {
  xs: 'w-3 h-3 border',
  s: 'w-4 h-4 border-2',
  m: 'w-6 h-6 border-2',
  l: 'w-8 h-8 border-2',
  xl: 'w-12 h-12 border-3',
};

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(({
  size = 'm',
  className,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-full border-gray-200 border-t-cyan-600 animate-spin dark:border-gray-700 dark:border-t-cyan-400',
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
});

Spinner.displayName = 'Spinner';

export default Spinner;
