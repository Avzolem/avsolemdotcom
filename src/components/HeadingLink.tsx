'use client';

import React, { JSX } from 'react';
import { Link2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import styles from '@/components/HeadingLink.module.scss';

interface HeadingLinkProps {
  id: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export const HeadingLink: React.FC<HeadingLinkProps> = ({ id, level, as, children, style, className }) => {
  // Support both `level` and `as` props
  const headingLevel = level || (as ? parseInt(as.replace('h', '')) as 1 | 2 | 3 | 4 | 5 | 6 : 2);
  const { addToast } = useToast();

  const copyURL = (id: string): void => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url).then(
      () => {
        addToast('Link copied to clipboard.', 'success');
      },
      () => {
        addToast('Failed to copy link.', 'error');
      },
    );
  };

  const variantClasses = {
    1: 'text-3xl md:text-4xl font-bold',
    2: 'text-2xl md:text-3xl font-semibold',
    3: 'text-xl md:text-2xl font-semibold',
    4: 'text-lg md:text-xl font-semibold',
    5: 'text-base md:text-lg font-semibold',
    6: 'text-sm md:text-base font-semibold',
  } as const;

  const HeadingTag = `h${headingLevel}` as keyof JSX.IntrinsicElements;

  return (
    <div
      style={style}
      onClick={() => copyURL(id)}
      className={`${styles.control} flex items-center gap-1 cursor-pointer ${className || ''}`}
    >
      <HeadingTag
        id={id}
        className={`${styles.text} ${variantClasses[headingLevel]} text-gray-900 dark:text-white`}
      >
        {children}
      </HeadingTag>
      <button
        className={`${styles.visibility} p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}
        title="Copy link"
      >
        <Link2 className="w-4 h-4" />
      </button>
    </div>
  );
};
