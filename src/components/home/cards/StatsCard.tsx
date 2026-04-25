'use client';

import { useEffect, useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { BentoCard } from './BentoCard';

interface StatsCardProps {
  projects: number;
  posts: number;
}

export function StatsCard({ projects, posts }: StatsCardProps) {
  const { t } = useLanguage();
  const [repos, setRepos] = useState<number | null>(null);
  const [commits, setCommits] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/github/stats');
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        if (typeof data.repos === 'number') setRepos(data.repos);
        if (typeof data.commits === 'number') setCommits(data.commits);
      } catch {
        /* silent */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const items = [
    { value: projects, label: t('home.stats.projects') },
    { value: posts, label: t('home.stats.posts') },
    { value: commits, label: t('home.stats.commits') },
    { value: repos, label: t('home.stats.repos') },
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
              {s.value === null ? '—' : s.value}
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
