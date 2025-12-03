'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

type IconButtonSize = 'xs' | 's' | 'm' | 'l';
type IconButtonVariant = 'primary' | 'secondary' | 'ghost';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  size?: IconButtonSize;
  variant?: IconButtonVariant;
  tooltip?: string;
  href?: string;
}

const sizeClasses: Record<IconButtonSize, string> = {
  xs: 'p-1',
  s: 'p-1.5',
  m: 'p-2',
  l: 'p-3',
};

const iconSizeClasses: Record<IconButtonSize, string> = {
  xs: 'w-3 h-3',
  s: 'w-4 h-4',
  m: 'w-5 h-5',
  l: 'w-6 h-6',
};

const variantClasses: Record<IconButtonVariant, string> = {
  primary: 'bg-cyan-600 hover:bg-cyan-700 text-white dark:bg-cyan-500 dark:hover:bg-cyan-600',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-600 dark:text-gray-400 dark:hover:bg-gray-800',
};

// Convert icon name to PascalCase for Lucide
const getIconComponent = (iconName: string): React.ComponentType<{ className?: string }> | null => {
  // Handle common icon name mappings
  const iconMappings: Record<string, string> = {
    'github': 'Github',
    'linkedin': 'Linkedin',
    'twitter': 'Twitter',
    'x': 'Twitter',
    'email': 'Mail',
    'mail': 'Mail',
    'discord': 'MessageCircle',
    'instagram': 'Instagram',
    'youtube': 'Youtube',
    'facebook': 'Facebook',
    'link': 'Link',
    'external': 'ExternalLink',
    'gamepad': 'Gamepad2',
    'cards': 'Layers',
  };

  const mappedName = iconMappings[iconName.toLowerCase()] || iconName;

  // Convert to PascalCase
  const pascalCase = mappedName
    .split(/[-_\s]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');

  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[pascalCase];
  return Icon || null;
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(({
  icon,
  size = 'm',
  variant = 'ghost',
  tooltip,
  href,
  className,
  ...props
}, ref) => {
  const IconComponent = getIconComponent(icon);

  const baseClasses = cn(
    'inline-flex items-center justify-center rounded-lg transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
    sizeClasses[size],
    variantClasses[variant],
    className
  );

  const iconElement = IconComponent ? (
    <IconComponent className={iconSizeClasses[size]} />
  ) : (
    <span className={cn('flex items-center justify-center', iconSizeClasses[size])}>?</span>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={baseClasses}
        title={tooltip}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {iconElement}
      </Link>
    );
  }

  return (
    <button ref={ref} className={baseClasses} title={tooltip} {...props}>
      {iconElement}
    </button>
  );
});

IconButton.displayName = 'IconButton';

export default IconButton;
