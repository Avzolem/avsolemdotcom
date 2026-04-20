'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Zap, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { BentoCard } from './BentoCard';

interface FeaturedProjectCardProps {
  slug?: string;
  title?: string;
  title_es?: string;
  summary?: string;
  summary_es?: string;
  image?: string;
}

export function FeaturedProjectCard({
  slug,
  title,
  title_es,
  summary,
  summary_es,
  image,
}: FeaturedProjectCardProps) {
  const { t, language } = useLanguage();
  if (!slug || !title) return null;

  const displayTitle = language === 'es' && title_es ? title_es : title;
  const displaySummary = language === 'es' && summary_es ? summary_es : summary;

  return (
    <BentoCard accent="orange" className="md:col-span-2 md:row-span-2 overflow-hidden p-0">
      <Link
        href={`/work/${slug}`}
        className="relative flex flex-col h-full min-h-[280px] group"
      >
        {image && (
          <div className="relative flex-1 min-h-[180px] overflow-hidden">
            <Image
              src={image}
              alt={displayTitle}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>
        )}
        <div className="relative p-5 pt-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-2">
            <Zap className="w-3.5 h-3.5" />
            {t('home.featured.label')}
          </div>
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
              {displayTitle}
            </h3>
            <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors flex-shrink-0 mt-1" />
          </div>
          {displaySummary && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {displaySummary}
            </p>
          )}
        </div>
      </Link>
    </BentoCard>
  );
}
