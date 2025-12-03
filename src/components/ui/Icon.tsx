'use client';

import { forwardRef, HTMLAttributes } from 'react';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';

type IconSize = 'xs' | 's' | 'm' | 'l' | 'xl';

interface IconProps extends HTMLAttributes<HTMLElement> {
  name: string;
  size?: IconSize;
  onBackground?: string;
}

const sizeClasses: Record<IconSize, string> = {
  xs: 'w-3 h-3',
  s: 'w-4 h-4',
  m: 'w-5 h-5',
  l: 'w-6 h-6',
  xl: 'w-8 h-8',
};

// Icon name mappings
const iconMappings: Record<string, string> = {
  'arrow-right': 'ArrowRight',
  'arrow-left': 'ArrowLeft',
  'arrow-up': 'ArrowUp',
  'arrow-down': 'ArrowDown',
  'chevron-right': 'ChevronRight',
  'chevron-left': 'ChevronLeft',
  'chevron-up': 'ChevronUp',
  'chevron-down': 'ChevronDown',
  'check': 'Check',
  'x': 'X',
  'close': 'X',
  'menu': 'Menu',
  'search': 'Search',
  'home': 'Home',
  'user': 'User',
  'person': 'User',
  'settings': 'Settings',
  'mail': 'Mail',
  'email': 'Mail',
  'phone': 'Phone',
  'calendar': 'Calendar',
  'clock': 'Clock',
  'link': 'Link',
  'external-link': 'ExternalLink',
  'copy': 'Copy',
  'edit': 'Edit',
  'trash': 'Trash',
  'plus': 'Plus',
  'minus': 'Minus',
  'github': 'Github',
  'linkedin': 'Linkedin',
  'twitter': 'Twitter',
  'instagram': 'Instagram',
  'youtube': 'Youtube',
  'facebook': 'Facebook',
};

export const Icon = forwardRef<HTMLSpanElement, IconProps>(({
  name,
  size = 'm',
  onBackground,
  className,
  ...props
}, ref) => {
  // Convert icon name to Lucide format
  const mappedName = iconMappings[name.toLowerCase()] || name;

  // Convert to PascalCase if not already
  const pascalCase = mappedName
    .split(/[-_\s]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');

  const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[pascalCase];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <span ref={ref} className={cn('inline-flex', className)} {...props}>
      <IconComponent className={sizeClasses[size]} />
    </span>
  );
});

Icon.displayName = 'Icon';

export default Icon;
