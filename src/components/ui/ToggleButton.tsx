'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Home, User, Grid3X3, BookOpen, Images, Sun, Moon } from 'lucide-react';

type IconName = 'home' | 'person' | 'grid' | 'book' | 'gallery' | 'light' | 'dark';

interface ToggleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  prefixIcon?: IconName;
  suffixIcon?: IconName;
  label?: string;
  selected?: boolean;
  href?: string;
}

const iconMap: Record<IconName, React.ComponentType<{ className?: string }>> = {
  home: Home,
  person: User,
  grid: Grid3X3,
  book: BookOpen,
  gallery: Images,
  light: Sun,
  dark: Moon,
};

export const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(({
  prefixIcon,
  suffixIcon,
  label,
  selected,
  href,
  className,
  children,
  ...props
}, ref) => {
  const PrefixIcon = prefixIcon ? iconMap[prefixIcon] : null;
  const SuffixIcon = suffixIcon ? iconMap[suffixIcon] : null;

  const baseClasses = cn(
    'inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
    'hover:bg-gray-100 dark:hover:bg-gray-800',
    'focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
    selected
      ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
      : 'text-gray-600 dark:text-gray-400',
    className
  );

  const content = (
    <>
      {PrefixIcon && <PrefixIcon className="w-4 h-4" />}
      {label && <span className="hidden sm:inline">{label}</span>}
      {children}
      {SuffixIcon && <SuffixIcon className="w-4 h-4" />}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button ref={ref} className={baseClasses} {...props}>
      {content}
    </button>
  );
});

ToggleButton.displayName = 'ToggleButton';

export default ToggleButton;
