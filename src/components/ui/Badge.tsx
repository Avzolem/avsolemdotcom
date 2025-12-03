'use client';

import { forwardRef, HTMLAttributes } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface BadgeProps extends HTMLAttributes<HTMLElement> {
  background?: string;
  onBackground?: string;
  textVariant?: string;
  paddingX?: string;
  paddingY?: string;
  arrow?: boolean;
  href?: string;
}

export const Badge = forwardRef<HTMLElement, BadgeProps>(({
  background,
  onBackground,
  textVariant,
  paddingX = '8',
  paddingY = '2',
  arrow = true,
  href,
  className,
  style,
  children,
  ...props
}, ref) => {
  const baseClasses = cn(
    'inline-flex items-center gap-1 rounded-full text-sm font-medium transition-colors',
    'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
    href && 'hover:bg-cyan-200 dark:hover:bg-cyan-900/50 cursor-pointer',
    className
  );

  const computedStyle: React.CSSProperties = {
    paddingLeft: `${parseFloat(paddingX) * 0.25}rem`,
    paddingRight: `${parseFloat(paddingX) * 0.25}rem`,
    paddingTop: `${parseFloat(paddingY) * 0.25}rem`,
    paddingBottom: `${parseFloat(paddingY) * 0.25}rem`,
    ...style,
  };

  const content = (
    <>
      {children}
      {arrow && href && <ChevronRight className="w-3 h-3" />}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={baseClasses}
        style={computedStyle}
      >
        {content}
      </Link>
    );
  }

  return (
    <span
      ref={ref as React.Ref<HTMLSpanElement>}
      className={baseClasses}
      style={computedStyle}
      {...props}
    >
      {content}
    </span>
  );
});

Badge.displayName = 'Badge';

export default Badge;
