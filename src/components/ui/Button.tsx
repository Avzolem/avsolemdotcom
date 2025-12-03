'use client';

import { forwardRef, ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger';
type ButtonSize = 's' | 'm' | 'l';
type ButtonWeight = 'default' | 'strong';

interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  weight?: ButtonWeight;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  arrowIcon?: boolean;
  loading?: boolean;
  fillWidth?: boolean;
}

interface ButtonAsButton extends BaseButtonProps, ButtonHTMLAttributes<HTMLButtonElement> {
  href?: never;
}

interface ButtonAsLink extends BaseButtonProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-cyan-600 hover:bg-cyan-700 text-white border-transparent dark:bg-cyan-500 dark:hover:bg-cyan-600',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white dark:border-gray-700',
  tertiary: 'bg-transparent hover:bg-gray-100 text-gray-700 border-gray-200 dark:text-gray-300 dark:hover:bg-gray-800 dark:border-gray-700',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 border-transparent dark:text-gray-300 dark:hover:bg-gray-800',
  danger: 'bg-red-600 hover:bg-red-700 text-white border-transparent',
};

const sizeClasses: Record<ButtonSize, string> = {
  s: 'px-3 py-1.5 text-sm gap-1.5',
  m: 'px-4 py-2 text-base gap-2',
  l: 'px-6 py-3 text-lg gap-2.5',
};

const weightClasses: Record<ButtonWeight, string> = {
  default: 'font-medium',
  strong: 'font-semibold',
};

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(({
  variant = 'primary',
  size = 'm',
  weight = 'default',
  prefixIcon,
  suffixIcon,
  arrowIcon,
  loading,
  fillWidth,
  className,
  children,
  ...props
}, ref) => {
  const baseClasses = cn(
    'inline-flex items-center justify-center rounded-lg border transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    variantClasses[variant],
    sizeClasses[size],
    weightClasses[weight],
    fillWidth && 'w-full',
    className
  );

  const content = (
    <>
      {loading && (
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {prefixIcon && !loading && <span className="flex-shrink-0">{prefixIcon}</span>}
      {children}
      {suffixIcon && <span className="flex-shrink-0">{suffixIcon}</span>}
      {arrowIcon && <ChevronRight className="w-4 h-4 flex-shrink-0" />}
    </>
  );

  if ('href' in props && props.href) {
    const { href, ...linkProps } = props as ButtonAsLink;
    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={baseClasses}
        {...linkProps}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={baseClasses}
      disabled={loading || (props as ButtonAsButton).disabled}
      {...(props as ButtonAsButton)}
    >
      {content}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
