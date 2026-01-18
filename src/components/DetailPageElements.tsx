'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatDate } from '@/utils/formatDate';

// Back to Posts link
export function BackToPosts() {
  const { t } = useLanguage();

  return (
    <Link
      href="/blog"
      className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-full"
    >
      <ChevronLeft className="w-4 h-4" />
      {t('detail.backToPosts')}
    </Link>
  );
}

// Back to Projects link
export function BackToProjects() {
  const { t } = useLanguage();

  return (
    <Link
      href="/work"
      className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-full"
    >
      <ChevronLeft className="w-4 h-4" />
      {t('detail.backToProjects')}
    </Link>
  );
}

// On this page sidebar
export function OnThisPage() {
  const { t } = useLanguage();

  return (
    <div className="flex gap-3 pl-0.5 items-center text-gray-500 dark:text-gray-400 text-xs">
      <FileText className="w-3 h-3" />
      {t('detail.onThisPage')}
    </div>
  );
}

// Formatted date with language
export function FormattedDate({ date, includeRelative = false }: { date: string; includeRelative?: boolean }) {
  const { language } = useLanguage();

  return (
    <span className="text-sm text-gray-500 dark:text-gray-400">
      {formatDate(date, includeRelative, language)}
    </span>
  );
}

// Translated page title for projects
interface TranslatedTitleProps {
  title: string;
  title_es?: string;
  className?: string;
}

export function TranslatedTitle({ title, title_es, className = "text-2xl md:text-3xl font-bold text-gray-900 dark:text-white" }: TranslatedTitleProps) {
  const { language } = useLanguage();
  const displayTitle = language === 'es' && title_es ? title_es : title;

  return (
    <h1 className={className}>
      {displayTitle}
    </h1>
  );
}

// Avatar group with translated alt text
interface AvatarGroupProps {
  avatars: { src: string }[];
  size?: 's' | 'm' | 'l';
  reverse?: boolean;
  type?: 'author' | 'team';
}

export function AvatarGroup({ avatars, size = 'm', reverse = false, type = 'team' }: AvatarGroupProps) {
  const { t } = useLanguage();

  const sizeClasses = {
    s: 'w-8 h-8',
    m: 'w-10 h-10',
    l: 'w-12 h-12',
  };

  const orderedAvatars = reverse ? [...avatars].reverse() : avatars;
  const altTextKey = type === 'author' ? 'detail.author' : 'detail.teamMember';

  return (
    <div className="flex -space-x-2">
      {orderedAvatars.map((avatar, index) => (
        <div
          key={index}
          className={`relative ${sizeClasses[size]} rounded-full overflow-hidden border-2 border-white dark:border-gray-900`}
        >
          <Image
            src={avatar.src}
            alt={`${t(altTextKey)} ${index + 1}`}
            fill
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
