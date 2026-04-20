'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
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
    <div className="relative flex flex-col gap-4 px-6 md:px-8 pt-2 pb-0 md:pt-2 md:pb-0 col-span-full">
      {/* Logo + tagline: stacked on mobile, side-by-side on md+ (tagline baseline-aligned with logo base) */}
      <div className="flex flex-col md:flex-row md:items-end md:gap-6 gap-3">
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

        {/* Rotating tagline — aligned to the logo's baseline */}
        <div className="relative h-7 md:h-9 overflow-hidden flex-1 min-w-0 md:-mb-2">
          <p
            key={idx}
            className="text-lg md:text-2xl text-gray-700 dark:text-gray-300 font-medium tracking-tight animate-fade-in truncate"
          >
            {t(TAGLINE_KEYS[idx])}
          </p>
        </div>
      </div>
    </div>
  );
}
