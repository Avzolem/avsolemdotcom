'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Github } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { BentoCard } from './BentoCard';

interface Commit {
  message: string;
  repo: string;
  sha: string;
  date: string;
  url: string;
}

interface GitHubCardProps {
  user: string;
  commits?: Commit[]; // initial SSR value (may be empty)
}

export function GitHubCard({ user, commits: initialCommits = [] }: GitHubCardProps) {
  const { t } = useLanguage();
  const [commits, setCommits] = useState<Commit[]>(initialCommits);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/github/commits');
        if (!res.ok) return;
        const body = await res.json();
        if (!cancelled && Array.isArray(body.commits)) {
          setCommits(body.commits);
        }
      } catch {
        /* silent */
      }
    })();
    return () => { cancelled = true; };
  }, []);

  function timeAgo(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const h = Math.floor(diff / 3_600_000);
    if (h < 1) return t('home.github.now');
    if (h < 24) return `${h}h`;
    const d = Math.floor(h / 24);
    if (d < 7) return `${d}d`;
    return `${Math.floor(d / 7)}sem`;
  }

  return (
    <BentoCard accent="green">
      <Link
        href={`https://github.com/${user}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 hover:opacity-80"
      >
        <Github className="w-3.5 h-3.5" />
        {t('home.github.label')}
      </Link>
      {commits.length === 0 ? (
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {t('home.github.empty')}
        </div>
      ) : (
        <ul className="flex flex-col gap-2 mt-1">
          {commits.map((c) => (
            <li key={c.sha} className="flex flex-col gap-0.5">
              <Link
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-800 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 line-clamp-1"
              >
                {c.message}
              </Link>
              <div className="flex gap-2 text-[0.65rem] text-gray-500 dark:text-gray-500 font-mono">
                <span>{c.repo.split('/')[1]}</span>
                <span>·</span>
                <span>{timeAgo(c.date)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </BentoCard>
  );
}
