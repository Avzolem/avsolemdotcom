'use client';

import { forwardRef, HTMLAttributes, ElementType } from 'react';
import { cn } from '@/lib/utils';

type HeadingVariant =
  | 'display-strong-xl' | 'display-strong-l' | 'display-strong-m' | 'display-strong-s' | 'display-strong-xs'
  | 'heading-strong-xl' | 'heading-strong-l' | 'heading-strong-m' | 'heading-strong-s' | 'heading-strong-xs'
  | 'heading-default-xl' | 'heading-default-l' | 'heading-default-m' | 'heading-default-s' | 'heading-default-xs';

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  variant?: HeadingVariant;
  wrap?: 'balance' | 'pretty' | 'normal';
}

const variantClasses: Record<string, string> = {
  // Display
  'display-strong-xl': 'text-6xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white',
  'display-strong-l': 'text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white',
  'display-strong-m': 'text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white',
  'display-strong-s': 'text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white',
  'display-strong-xs': 'text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white',
  // Heading Strong
  'heading-strong-xl': 'text-3xl font-semibold text-gray-900 dark:text-white',
  'heading-strong-l': 'text-2xl font-semibold text-gray-900 dark:text-white',
  'heading-strong-m': 'text-xl font-semibold text-gray-900 dark:text-white',
  'heading-strong-s': 'text-lg font-semibold text-gray-900 dark:text-white',
  'heading-strong-xs': 'text-base font-semibold text-gray-900 dark:text-white',
  // Heading Default
  'heading-default-xl': 'text-3xl font-normal text-gray-900 dark:text-white',
  'heading-default-l': 'text-2xl font-normal text-gray-900 dark:text-white',
  'heading-default-m': 'text-xl font-normal text-gray-900 dark:text-white',
  'heading-default-s': 'text-lg font-normal text-gray-900 dark:text-white',
  'heading-default-xs': 'text-base font-normal text-gray-900 dark:text-white',
};

const wrapClasses: Record<string, string> = {
  'balance': 'text-balance',
  'pretty': 'text-pretty',
  'normal': '',
};

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(({
  as: Component = 'h2',
  variant = 'heading-strong-l',
  wrap,
  className,
  children,
  ...props
}, ref) => {
  return (
    <Component
      ref={ref}
      className={cn(
        variantClasses[variant],
        wrap && wrapClasses[wrap],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
});

Heading.displayName = 'Heading';

export default Heading;
