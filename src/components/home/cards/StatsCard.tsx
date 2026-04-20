'use client';

import { BarChart3 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { BentoCard } from './BentoCard';

interface StatsCardProps {
  stats: {
    projects: number;
    posts: number;
    stacks: number;
    repos: number;
  };
}

export function StatsCard({ stats }: StatsCardProps) {
  const { t } = useLanguage();
  const items = [
    { value: stats.projects, label: t('home.stats.projects') },
    { value: stats.posts, label: t('home.stats.posts') },
    { value: stats.stacks, label: t('home.stats.stacks') },
    { value: stats.repos, label: t('home.stats.repos') },
  ];

  return (
    <BentoCard accent="cyan">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
        <BarChart3 className="w-3.5 h-3.5" />
        {t('home.stats.label')}
      </div>
      <div className="grid grid-cols-2 gap-3 flex-1 content-center">
        {items.map((s) => (
          <div key={s.label} className="flex flex-col">
            <span className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-none">
              {s.value}
            </span>
            <span className="text-[0.7rem] text-gray-500 dark:text-gray-400 mt-1">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </BentoCard>
  );
}
