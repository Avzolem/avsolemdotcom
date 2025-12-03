'use client';

import { forwardRef, HTMLAttributes, ElementType } from 'react';
import { cn } from '@/lib/utils';

type TextVariant =
  | 'display-strong-xl' | 'display-strong-l' | 'display-strong-m' | 'display-strong-s' | 'display-strong-xs'
  | 'heading-strong-xl' | 'heading-strong-l' | 'heading-strong-m' | 'heading-strong-s' | 'heading-strong-xs'
  | 'heading-default-xl' | 'heading-default-l' | 'heading-default-m' | 'heading-default-s' | 'heading-default-xs'
  | 'body-strong-xl' | 'body-strong-l' | 'body-strong-m' | 'body-strong-s' | 'body-strong-xs'
  | 'body-default-xl' | 'body-default-l' | 'body-default-m' | 'body-default-s' | 'body-default-xs'
  | 'label-strong-xl' | 'label-strong-l' | 'label-strong-m' | 'label-strong-s' | 'label-strong-xs'
  | 'label-default-xl' | 'label-default-l' | 'label-default-m' | 'label-default-s' | 'label-default-xs';

type TextColor =
  | 'neutral-strong' | 'neutral-weak'
  | 'brand-strong' | 'brand-weak'
  | 'accent-strong' | 'accent-weak'
  | 'danger-strong' | 'danger-weak'
  | 'warning-strong' | 'warning-weak'
  | 'success-strong' | 'success-weak';

interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  variant?: TextVariant;
  onBackground?: TextColor;
  wrap?: 'balance' | 'pretty' | 'normal';
  paddingX?: string;
  paddingY?: string;
}

const variantClasses: Record<string, string> = {
  // Display
  'display-strong-xl': 'text-6xl font-bold tracking-tight',
  'display-strong-l': 'text-5xl font-bold tracking-tight',
  'display-strong-m': 'text-4xl font-bold tracking-tight',
  'display-strong-s': 'text-3xl font-bold tracking-tight',
  'display-strong-xs': 'text-2xl font-bold tracking-tight',
  // Heading Strong
  'heading-strong-xl': 'text-3xl font-semibold',
  'heading-strong-l': 'text-2xl font-semibold',
  'heading-strong-m': 'text-xl font-semibold',
  'heading-strong-s': 'text-lg font-semibold',
  'heading-strong-xs': 'text-base font-semibold',
  // Heading Default
  'heading-default-xl': 'text-3xl font-normal',
  'heading-default-l': 'text-2xl font-normal',
  'heading-default-m': 'text-xl font-normal',
  'heading-default-s': 'text-lg font-normal',
  'heading-default-xs': 'text-base font-normal',
  // Body Strong
  'body-strong-xl': 'text-xl font-medium',
  'body-strong-l': 'text-lg font-medium',
  'body-strong-m': 'text-base font-medium',
  'body-strong-s': 'text-sm font-medium',
  'body-strong-xs': 'text-xs font-medium',
  // Body Default
  'body-default-xl': 'text-xl font-normal',
  'body-default-l': 'text-lg font-normal',
  'body-default-m': 'text-base font-normal',
  'body-default-s': 'text-sm font-normal',
  'body-default-xs': 'text-xs font-normal',
  // Label Strong
  'label-strong-xl': 'text-xl font-semibold uppercase tracking-wider',
  'label-strong-l': 'text-lg font-semibold uppercase tracking-wider',
  'label-strong-m': 'text-base font-semibold uppercase tracking-wider',
  'label-strong-s': 'text-sm font-semibold uppercase tracking-wider',
  'label-strong-xs': 'text-xs font-semibold uppercase tracking-wider',
  // Label Default
  'label-default-xl': 'text-xl uppercase tracking-wider',
  'label-default-l': 'text-lg uppercase tracking-wider',
  'label-default-m': 'text-base uppercase tracking-wider',
  'label-default-s': 'text-sm uppercase tracking-wider',
  'label-default-xs': 'text-xs uppercase tracking-wider',
};

const colorClasses: Record<string, string> = {
  'neutral-strong': 'text-gray-900 dark:text-gray-100',
  'neutral-weak': 'text-gray-500 dark:text-gray-400',
  'brand-strong': 'text-cyan-600 dark:text-cyan-400',
  'brand-weak': 'text-cyan-400 dark:text-cyan-600',
  'accent-strong': 'text-blue-600 dark:text-blue-400',
  'accent-weak': 'text-blue-400 dark:text-blue-600',
  'danger-strong': 'text-red-600 dark:text-red-400',
  'danger-weak': 'text-red-400 dark:text-red-600',
  'warning-strong': 'text-yellow-600 dark:text-yellow-400',
  'warning-weak': 'text-yellow-400 dark:text-yellow-600',
  'success-strong': 'text-green-600 dark:text-green-400',
  'success-weak': 'text-green-400 dark:text-green-600',
};

const wrapClasses: Record<string, string> = {
  'balance': 'text-balance',
  'pretty': 'text-pretty',
  'normal': '',
};

export const Text = forwardRef<HTMLElement, TextProps>(({
  as: Component = 'span',
  variant = 'body-default-m',
  onBackground,
  wrap,
  paddingX,
  paddingY,
  className,
  style,
  children,
  ...props
}, ref) => {
  const paddingStyle: React.CSSProperties = {
    paddingLeft: paddingX ? `${parseFloat(paddingX) * 0.25}rem` : undefined,
    paddingRight: paddingX ? `${parseFloat(paddingX) * 0.25}rem` : undefined,
    paddingTop: paddingY ? `${parseFloat(paddingY) * 0.25}rem` : undefined,
    paddingBottom: paddingY ? `${parseFloat(paddingY) * 0.25}rem` : undefined,
    ...style,
  };

  return (
    <Component
      ref={ref}
      className={cn(
        variantClasses[variant],
        onBackground && colorClasses[onBackground],
        wrap && wrapClasses[wrap],
        className
      )}
      style={paddingStyle}
      {...props}
    >
      {children}
    </Component>
  );
});

Text.displayName = 'Text';

export default Text;
