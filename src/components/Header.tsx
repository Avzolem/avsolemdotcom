'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, User, Grid3X3, BookOpen, Images } from 'lucide-react';

import { routes, display, person } from '@/resources';
import { ThemeToggle } from './ThemeToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './Header.module.scss';

type TimeDisplayProps = {
  timeZone: string;
  locale?: string;
};

const TimeDisplay: React.FC<TimeDisplayProps> = ({ timeZone, locale = 'en-GB' }) => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      };
      const timeString = new Intl.DateTimeFormat(locale, options).format(now);
      setCurrentTime(timeString);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 60000);

    return () => clearInterval(intervalId);
  }, [timeZone, locale]);

  return <>{currentTime}</>;
};

export default TimeDisplay;

interface NavButtonProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label?: string;
  selected: boolean;
}

const NavButton = ({ href, icon: Icon, label, selected }: NavButtonProps) => (
  <Link
    href={href}
    className={`
      inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200
      hover:bg-black/5 dark:hover:bg-white/10
      focus:outline-none
      ${selected
        ? 'bg-black/10 text-gray-900 dark:bg-white/15 dark:text-white'
        : 'text-gray-600 dark:text-gray-300'
      }
    `}
  >
    <Icon className="w-4 h-4" />
    {label && <span className="hidden sm:inline">{label}</span>}
  </Link>
);

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="
        flex items-center gap-1 px-3 py-1.5 rounded-2xl text-sm font-medium
        bg-white/70 dark:bg-white/[0.08]
        backdrop-blur-xl backdrop-saturate-150
        border border-white/50 dark:border-white/[0.12]
        shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.5)]
        dark:shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]
        transition-all duration-200 hover:scale-105
      "
      title={language === 'en' ? 'Cambiar a Espanol' : 'Switch to English'}
    >
      <span className={`transition-opacity ${language === 'en' ? 'opacity-100 font-bold' : 'opacity-50'}`}>
        EN
      </span>
      <span className="text-gray-400 dark:text-gray-500">|</span>
      <span className={`transition-opacity ${language === 'es' ? 'opacity-100 font-bold' : 'opacity-50'}`}>
        ES
      </span>
    </button>
  );
};

export const Header = () => {
  const pathname = usePathname() ?? '';
  const { t } = useLanguage();

  return (
    <header
      className={`
        ${styles.position}
        z-[9] w-full py-3 px-4 flex items-center justify-center
      `}
    >
      {/* Left section - Language Toggle */}
      <div className="flex-1 pl-3 flex items-center">
        <span className={styles.hideOnMobile}>
          <LanguageToggle />
        </span>
      </div>

      {/* Center - Navigation with Liquid Glass effect */}
      <nav
        className="
          flex items-center gap-1 px-2 py-1.5 rounded-2xl
          bg-white/70 dark:bg-white/[0.08]
          backdrop-blur-xl backdrop-saturate-150
          border border-white/50 dark:border-white/[0.12]
          shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.5)]
          dark:shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]
          transition-all duration-300
        "
      >
        <div className="flex items-center gap-0.5 text-sm" suppressHydrationWarning>
          {routes['/'] && (
            <NavButton href="/" icon={Home} selected={pathname === '/'} />
          )}

          <div className="w-px h-5 bg-gray-300/50 dark:bg-white/10 mx-1" />

          {routes['/about'] && (
            <NavButton
              href="/about"
              icon={User}
              label={t('nav.about')}
              selected={pathname === '/about'}
            />
          )}
          {routes['/work'] && (
            <NavButton
              href="/work"
              icon={Grid3X3}
              label={t('nav.work')}
              selected={pathname.startsWith('/work')}
            />
          )}
          {routes['/blog'] && (
            <NavButton
              href="/blog"
              icon={BookOpen}
              label={t('nav.blog')}
              selected={pathname.startsWith('/blog')}
            />
          )}
          {routes['/gallery'] && (
            <NavButton
              href="/gallery"
              icon={Images}
              label={t('nav.gallery')}
              selected={pathname.startsWith('/gallery')}
            />
          )}

          {display.themeSwitcher && (
            <>
              <div className="w-px h-5 bg-gray-300/50 dark:bg-white/10 mx-1" />
              <ThemeToggle />
            </>
          )}
        </div>
      </nav>

      {/* Right section - Location + Time with Liquid Glass */}
      <div className="flex-1 pr-3 flex justify-end items-center">
        <span className={styles.hideOnMobile}>
          {(display.location || display.time) && (
            <div
              className="
                flex items-center gap-2 px-3 py-1.5 rounded-2xl text-sm text-gray-600 dark:text-gray-300
                bg-white/70 dark:bg-white/[0.08]
                backdrop-blur-xl backdrop-saturate-150
                border border-white/50 dark:border-white/[0.12]
                shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.5)]
                dark:shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]
              "
            >
              {display.location && (
                <span className="text-gray-500 dark:text-gray-400">
                  {person.location.split('/')[1] || person.location}
                </span>
              )}
              {display.location && display.time && (
                <span className="text-gray-400 dark:text-gray-500">|</span>
              )}
              {display.time && <TimeDisplay timeZone={person.location} />}
            </div>
          )}
        </span>
      </div>
    </header>
  );
};
