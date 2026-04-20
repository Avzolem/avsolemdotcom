'use client';

import Link from 'next/link';
import { FileText, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { BentoCard } from './BentoCard';

interface BlogCardProps {
  slug?: string;
  title?: string;
  title_es?: string;
  publishedAt?: string;
}

export function BlogCard({ slug, title, title_es, publishedAt }: BlogCardProps) {
  const { t, language } = useLanguage();
  if (!slug || !title) return null;

  const displayTitle = language === 'es' && title_es ? title_es : title;

  const date = publishedAt
    ? new Date(publishedAt).toLocaleDateString(language === 'es' ? 'es-MX' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '';

  return (
    <BentoCard accent="violet">
      <Link href={`/blog/${slug}`} className="flex flex-col h-full group">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-violet-600 dark:text-violet-400">
          <FileText className="w-3.5 h-3.5" />
          {t('home.blog.label')}
        </div>
        <div className="flex items-start justify-between gap-2 mt-2 flex-1">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-3 leading-snug">
            {displayTitle}
          </h3>
          <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-violet-500 transition-colors flex-shrink-0" />
        </div>
        {date && <div className="text-xs text-gray-500 dark:text-gray-400 mt-auto pt-2">{date}</div>}
      </Link>
    </BentoCard>
  );
}
