import { ReactNode } from 'react';

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  href?: string;
  title?: string;
  accent?: 'default' | 'cyan' | 'orange' | 'violet' | 'green';
}

const accentRing: Record<NonNullable<BentoCardProps['accent']>, string> = {
  default: 'hover:border-gray-400 dark:hover:border-gray-600',
  cyan: 'hover:border-cyan-500 dark:hover:border-cyan-500/60',
  orange: 'hover:border-orange-500 dark:hover:border-orange-500/60',
  violet: 'hover:border-violet-500 dark:hover:border-violet-500/60',
  green: 'hover:border-emerald-500 dark:hover:border-emerald-500/60',
};

export function BentoCard({ children, className = '', accent = 'default' }: BentoCardProps) {
  return (
    <div
      className={`bento-card relative flex flex-col gap-3 p-5 rounded-2xl
        bg-white/60 dark:bg-gray-900/40
        border border-gray-200 dark:border-gray-800
        backdrop-blur-sm
        transition-all duration-200
        ${accentRing[accent]}
        ${className}`}
    >
      {children}
    </div>
  );
}
