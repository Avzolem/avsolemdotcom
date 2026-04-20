'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Briefcase } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function HeroCard() {
  const { t } = useLanguage();

  return (
    <div className="relative flex flex-col items-start gap-5 p-6 md:p-8 col-span-full">
      {/* Logo — dark variant on light bg, light variant on dark bg */}
      <div className="relative h-10 md:h-12 w-auto">
        <Image
          src="/images/logo/avsolem-dark.webp"
          alt="avsolem."
          width={385}
          height={68}
          className="h-10 md:h-12 w-auto dark:hidden"
          priority
        />
        <Image
          src="/images/logo/avsolem-light.webp"
          alt="avsolem."
          width={385}
          height={68}
          className="h-10 md:h-12 w-auto hidden dark:block"
          priority
        />
      </div>

      <div className="max-w-2xl">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white text-balance leading-tight">
          {t('home.headline')}
        </h1>
        <p className="mt-3 text-base md:text-lg text-gray-500 dark:text-gray-400 text-balance">
          {t('home.subline')}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium transition-colors"
        >
          <Briefcase className="w-4 h-4" />
          {t('home.cta.work')}
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          href="/about"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white text-sm font-medium transition-colors"
        >
          {t('home.cta.about')}
        </Link>
      </div>
    </div>
  );
}
