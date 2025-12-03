'use client';

import { forwardRef, AnchorHTMLAttributes } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SmartLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  unstyled?: boolean;
}

export const SmartLink = forwardRef<HTMLAnchorElement, SmartLinkProps>(({
  href,
  unstyled,
  className,
  children,
  ...props
}, ref) => {
  const isExternal = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:');

  const baseClasses = cn(
    !unstyled && 'text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 underline-offset-2 hover:underline',
    className
  );

  if (isExternal) {
    return (
      <a
        ref={ref}
        href={href}
        className={baseClasses}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link ref={ref} href={href} className={baseClasses} {...props}>
      {children}
    </Link>
  );
});

SmartLink.displayName = 'SmartLink';

export default SmartLink;
