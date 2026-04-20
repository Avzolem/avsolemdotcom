'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import '@/styles/hero-logo.css';

const TAGLINE_KEYS = [
  'hero.tagline.1',
  'hero.tagline.2',
  'hero.tagline.3',
  'hero.tagline.4',
  'hero.tagline.5',
  'hero.tagline.6',
  'hero.tagline.7',
  'hero.tagline.8',
  'hero.tagline.9',
  'hero.tagline.10',
];

const ROTATION_MS = 3500;

export function HeroCard() {
  const { t } = useLanguage();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % TAGLINE_KEYS.length);
    }, ROTATION_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative flex flex-col gap-4 px-6 md:px-8 py-5 md:py-6 col-span-full">
      {/* Logo + tagline: stacked on mobile, side-by-side on md+ */}
      <div className="flex flex-col md:flex-row md:items-center md:gap-8 gap-3">
        <div className="relative h-12 md:h-16 w-auto shrink-0">
          <Image
            src="/images/logo/avsolem-dark.webp"
            alt="avsolem."
            width={385}
            height={68}
            className="hero-logo--dark h-12 md:h-16 w-auto"
            priority
          />
          <Image
            src="/images/logo/avsolem-light.webp"
            alt="avsolem."
            width={385}
            height={68}
            className="hero-logo--light h-12 md:h-16 w-auto"
            priority
          />
        </div>

        {/* Rotating tagline */}
        <div className="relative h-7 md:h-10 overflow-hidden flex-1 min-w-0">
          <p
            key={idx}
            className="text-lg md:text-2xl text-gray-700 dark:text-gray-300 font-medium tracking-tight animate-fade-in truncate"
          >
            {t(TAGLINE_KEYS[idx])}
          </p>
        </div>
      </div>

      {/* Compact CTAs — text links */}
      <div className="flex items-center gap-5 text-sm">
        <Link
          href="/work"
          className="inline-flex items-center gap-1 text-gray-900 dark:text-white font-medium hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
        >
          {t('home.cta.work')}
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          href="/about"
          className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          {t('home.cta.about')}
        </Link>
      </div>
    </div>
  );
}
