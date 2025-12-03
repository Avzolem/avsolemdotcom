'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, User, Grid3X3, BookOpen, Images } from 'lucide-react';

import { routes, display, person, about, blog, work, gallery } from '@/resources';
import { ThemeToggle } from './ThemeToggle';
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
      inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
      hover:bg-gray-100 dark:hover:bg-gray-800
      focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900
      ${selected
        ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
        : 'text-gray-600 dark:text-gray-400'
      }
    `}
  >
    <Icon className="w-4 h-4" />
    {label && <span className="hidden sm:inline">{label}</span>}
  </Link>
);

export const Header = () => {
  const pathname = usePathname() ?? '';

  return (
    <>
      {/* Top fade for desktop */}
      <div
        className={`fixed top-0 left-0 right-0 h-20 z-[9] pointer-events-none bg-gradient-to-b from-[var(--background)] to-transparent ${styles.hideOnMobile}`}
      />
      {/* Bottom fade for mobile */}
      <div
        className={`fixed bottom-0 left-0 right-0 h-20 z-[9] pointer-events-none bg-gradient-to-t from-[var(--background)] to-transparent ${styles.showOnMobile}`}
      />

      {/* Header */}
      <header
        className={`
          ${styles.position}
          z-[9] w-full p-2 flex items-center justify-center
        `}
        data-border="rounded"
      >
        {/* Left section - Location */}
        <div className="flex-1 pl-3 flex items-center text-sm text-gray-600 dark:text-gray-400">
          <span className={styles.hideOnMobile}>
            {display.location && person.location}
          </span>
        </div>

        {/* Center - Navigation */}
        <div className="flex justify-center">
          <nav
            className="
              flex items-center gap-1 p-1 rounded-xl
              bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm
              border border-gray-200 dark:border-gray-800
              shadow-lg
            "
          >
            <div className="flex items-center gap-1 text-sm" suppressHydrationWarning>
              {routes['/'] && (
                <NavButton href="/" icon={Home} selected={pathname === '/'} />
              )}

              <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

              {routes['/about'] && (
                <NavButton
                  href="/about"
                  icon={User}
                  label={about.label}
                  selected={pathname === '/about'}
                />
              )}
              {routes['/work'] && (
                <NavButton
                  href="/work"
                  icon={Grid3X3}
                  label={work.label}
                  selected={pathname.startsWith('/work')}
                />
              )}
              {routes['/blog'] && (
                <NavButton
                  href="/blog"
                  icon={BookOpen}
                  label={blog.label}
                  selected={pathname.startsWith('/blog')}
                />
              )}
              {routes['/gallery'] && (
                <NavButton
                  href="/gallery"
                  icon={Images}
                  label={gallery.label}
                  selected={pathname.startsWith('/gallery')}
                />
              )}

              {display.themeSwitcher && (
                <>
                  <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
                  <ThemeToggle />
                </>
              )}
            </div>
          </nav>
        </div>

        {/* Right section - Time */}
        <div className="flex-1 pr-3 flex justify-end items-center text-sm text-gray-600 dark:text-gray-400">
          <span className={styles.hideOnMobile}>
            {display.time && <TimeDisplay timeZone={person.location} />}
          </span>
        </div>
      </header>
    </>
  );
};
