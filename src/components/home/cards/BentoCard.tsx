import { ReactNode } from 'react';

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  accent?: 'default' | 'cyan' | 'orange' | 'violet' | 'green';
}

const accentRing: Record<NonNullable<BentoCardProps['accent']>, string> = {
  default: 'hover:border-gray-400/60 dark:hover:border-white/20',
  cyan: 'hover:border-cyan-500/60 dark:hover:border-cyan-400/50',
  orange: 'hover:border-orange-500/60 dark:hover:border-orange-400/50',
  violet: 'hover:border-violet-500/60 dark:hover:border-violet-400/50',
  green: 'hover:border-emerald-500/60 dark:hover:border-emerald-400/50',
};

export function BentoCard({ children, className = '', accent = 'default' }: BentoCardProps) {
  return (
    <div
      className={`bento-card relative flex flex-col gap-3 p-5 rounded-2xl
        bg-white/50 dark:bg-white/[0.03]
        border border-white/60 dark:border-white/[0.08]
        backdrop-blur-xl backdrop-saturate-150
        shadow-[0_8px_32px_-4px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.8)]
        dark:shadow-[0_8px_32px_-4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)]
        transition-all duration-300
        ${accentRing[accent]}
        ${className}`}
    >
      {children}
    </div>
  );
}
