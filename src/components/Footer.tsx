'use client';

import Link from 'next/link';
import { Github, Linkedin, Twitter, Mail, Gamepad2, Layers, Save, Cloud } from 'lucide-react';
import { person, social } from '@/resources';
import styles from './Footer.module.scss';

// Custom Dragon icon (Yu-Gi-Oh style)
const DragonIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2c-2 0-4 1-5 3-1-1-3-1-4 0s-1 3 0 4c-2 1-3 3-3 5 0 3 2 5 5 6l2 2c1 1 2 2 5 2s4-1 5-2l2-2c3-1 5-3 5-6 0-2-1-4-3-5 1-1 1-3 0-4s-3-1-4 0c-1-2-3-3-5-3z"/>
    <circle cx="9" cy="10" r="1"/>
    <circle cx="15" cy="10" r="1"/>
    <path d="M9 14c.5.5 1.5 1 3 1s2.5-.5 3-1"/>
  </svg>
);

// Icon mapping for social links
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  x: Twitter,
  email: Mail,
  mail: Mail,
  gamepad: Gamepad2,
  cards: Layers,
  dragon: DragonIcon,
  save: Save,
};

const getIcon = (iconName: string) => {
  return iconMap[iconName.toLowerCase()] || Mail;
};

export const Footer = () => {
  const currentYear = new Date().getFullYear();

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
          <span className="text-gray-400 dark:text-gray-500">/ Build with ☕ & 🩶</span>
        </p>

        <div className="flex items-center gap-4">
          {social.map((item) => {
            if (!item.link) return null;

            const Icon = getIcon(item.icon);
            const isExternal = item.link.startsWith('http');
            const isSpecialRoute = item.link.includes('/yugioh') || item.link.includes('/roms');

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
                    hover:text-gray-700 dark:hover:text-gray-200
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
                    hover:text-gray-700 dark:hover:text-gray-200
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
                  hover:text-gray-700 dark:hover:text-gray-200
                  transition-colors duration-200
                "
                title={item.name}
              >
                <Icon className="w-4 h-4" />
              </Link>
            );
          })}

          {/* Cloud Storage Link */}
          <a
            href="/cloud"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = '/cloud';
            }}
            className="
              p-1.5 rounded-lg text-gray-500 dark:text-gray-400
              hover:bg-gray-100 dark:hover:bg-gray-800
              hover:text-cyan-600 dark:hover:text-cyan-400
              transition-colors duration-200
            "
            title="Cloudsolem"
          >
            <Cloud className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Spacer for mobile fixed nav */}
      <div className={`h-20 ${styles.showOnMobile}`} />
    </footer>
  );
};

export default Footer;
