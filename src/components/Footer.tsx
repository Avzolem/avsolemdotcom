'use client';

import Link from 'next/link';
import { LayoutDashboard } from 'lucide-react';
import { person, social } from '@/resources';
import { useLanguage } from '@/contexts/LanguageContext';
import { getIcon } from '@/lib/icons';
import styles from './Footer.module.scss';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="w-full p-2 flex flex-col items-center">
      <div
        className={`
          ${styles.mobile}
          max-w-3xl w-full py-2 px-4
          flex flex-wrap items-center justify-between gap-4
        `}
      >
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <span className="text-gray-400 dark:text-gray-500">© {currentYear} /</span>
          <span className="px-1 text-gray-700 dark:text-gray-300">{person.name}</span>
          <span className="text-gray-400 dark:text-gray-500">/ {t('footer.builtWith')} ☕ & 🩶</span>
        </p>

        <div className="flex items-center gap-4">
          {social.map((item) => {
            if (!item.link) return null;

            const Icon = getIcon(item.icon);
            const isExternal = item.link.startsWith('http');
            const isSpecialRoute = item.link.includes('/yugioh') || item.link.includes('/roms') || item.link.includes('/diablo');

            if (isSpecialRoute) {
              return (
                <a
                  key={item.name}
                  href={item.link}
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = item.link;
                  }}
                  className="
                    p-1.5 rounded-lg text-gray-500 dark:text-gray-400
                    hover:bg-gray-100 dark:hover:bg-gray-800
                    hover:text-cyan-600 dark:hover:text-cyan-400
                    transition-colors duration-200
                  "
                  title={item.name}
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            }

            if (isExternal) {
              return (
                <a
                  key={item.name}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    p-1.5 rounded-lg text-gray-500 dark:text-gray-400
                    hover:bg-gray-100 dark:hover:bg-gray-800
                    hover:text-cyan-600 dark:hover:text-cyan-400
                    transition-colors duration-200
                  "
                  title={item.name}
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.link}
                className="
                  p-1.5 rounded-lg text-gray-500 dark:text-gray-400
                  hover:bg-gray-100 dark:hover:bg-gray-800
                  hover:text-cyan-600 dark:hover:text-cyan-400
                  transition-colors duration-200
                "
                title={item.name}
              >
                <Icon className="w-4 h-4" />
              </Link>
            );
          })}

          {/* Dashboard Link */}
          <a
            href="/dashboard"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = '/dashboard';
            }}
            className="
              p-1.5 rounded-lg text-gray-500 dark:text-gray-400
              hover:bg-gray-100 dark:hover:bg-gray-800
              hover:text-cyan-600 dark:hover:text-cyan-400
              transition-colors duration-200
            "
            title="Dashboard"
          >
            <LayoutDashboard className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Spacer for mobile fixed nav */}
      <div className={`h-20 ${styles.showOnMobile}`} />
    </footer>
  );
};

export default Footer;
