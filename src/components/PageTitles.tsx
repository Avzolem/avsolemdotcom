'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export function BlogTitle() {
  const { t } = useLanguage();

  return (
    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
      {t('blog.title')}
    </h1>
  );
}

export function WorkTitle() {
  const { t } = useLanguage();

  return (
    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
      {t('work.title')}
    </h1>
  );
}

export function GalleryTitle() {
  const { t } = useLanguage();

  return (
    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
      {t('gallery.title')}
    </h1>
  );
}
