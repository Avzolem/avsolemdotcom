'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

import { about, person } from '@/resources';
import { useLanguage } from '@/contexts/LanguageContext';

function RevealFx({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={`animate-fade-in ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

interface HomeHeroProps {
  featuredDisplay?: boolean;
  featuredHref?: string;
}

export function HomeHero({ featuredDisplay, featuredHref }: HomeHeroProps) {
  const { t } = useLanguage();

  return (
    <div className="w-full py-6">
      <div className="max-w-lg">
        {/* Featured Badge */}
        {featuredDisplay && featuredHref && (
          <RevealFx className="pt-4 pb-8 pl-3">
            <Link
              href={featuredHref}
              className="
                inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium
                bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300
                hover:bg-cyan-200 dark:hover:bg-cyan-900/50 transition-colors
              "
            >
              {t('home.featured.title')} <strong className="ml-2">Yu-Gi-Oh! Manager</strong>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </RevealFx>
        )}

        {/* Headline */}
        <RevealFx delay={0.1} className="pb-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white text-balance">
            {t('home.headline')}
          </h1>
        </RevealFx>

        {/* Subline */}
        <RevealFx delay={0.2} className="pb-8">
          <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 text-balance">
            {t('home.subline')}
          </p>
        </RevealFx>

        {/* CTA Button */}
        <RevealFx delay={0.4} className="pt-3 pl-3">
          <Link
            href={about.path}
            className="
              inline-flex items-center gap-2 px-4 py-2 rounded-lg
              bg-gray-900 hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700
              text-white dark:text-white font-medium
              border border-gray-900 dark:border-gray-700
              shadow-sm dark:shadow-none
              transition-colors duration-200
            "
          >
            {about.avatar?.display && (
              <div className="relative w-8 h-8 rounded-full overflow-hidden -ml-1">
                <Image
                  src={person.avatar}
                  alt={person.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            {t('home.aboutButton')}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </RevealFx>
      </div>
    </div>
  );
}

export function HomeBlogTitle() {
  const { t } = useLanguage();

  return (
    <div className="pl-4 pt-6">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
        {t('home.latestBlog')}
      </h2>
    </div>
  );
}

export default HomeHero;
