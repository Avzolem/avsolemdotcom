'use client';

import { forwardRef, HTMLAttributes } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface TagProps extends HTMLAttributes<HTMLElement> {
  href?: string;
  variant?: 'default' | 'outline';
}

export const Tag = forwardRef<HTMLElement, TagProps>(({
  href,
  variant = 'default',
  className,
  children,
  ...props
}, ref) => {
  const baseClasses = cn(
    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors',
    variant === 'default'
      ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
      : 'border border-gray-300 text-gray-600 dark:border-gray-700 dark:text-gray-400',
    href && 'hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer',
    className
  );

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {children}
      </Link>
    );
  }

  return (
    <span ref={ref as React.Ref<HTMLSpanElement>} className={baseClasses} {...props}>
      {children}
    </span>
  );
});

Tag.displayName = 'Tag';

export default Tag;
