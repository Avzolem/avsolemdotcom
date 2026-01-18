'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { OptimizedCarousel } from './OptimizedCarousel';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProjectCardProps {
  href: string;
  priority?: boolean;
  images: string[];
  title: string;
  title_es?: string;
  content: string;
  description: string;
  description_es?: string;
  avatars: { src: string }[];
  link: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  href,
  priority,
  images = [],
  title,
  title_es,
  content,
  description,
  description_es,
  avatars,
  link,
}) => {
  const { language, t } = useLanguage();

  // Use translated content based on language
  const displayTitle = language === 'es' && title_es ? title_es : title;
  const displayDescription = language === 'es' && description_es ? description_es : description;

  return (
    <div className="flex flex-col w-full gap-4">
      <OptimizedCarousel
        images={images}
        title={displayTitle}
        priority={priority}
        sizes="(max-width: 960px) 100vw, 960px"
      />
      <div className="flex flex-col w-full px-2 pt-3 pb-6 gap-4">
        {displayTitle && (
          <div className="flex-[5]">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white text-balance">
              {displayTitle}
            </h2>
          </div>
        )}
        {(avatars?.length > 0 || displayDescription?.trim() || content?.trim()) && (
          <div className="flex-[7] flex flex-col gap-4">
            {/* Avatar Group */}
            {avatars?.length > 0 && (
              <div className="flex -space-x-2">
                {avatars.slice(0, 4).map((avatar, index) => (
                  <div
                    key={index}
                    className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white dark:border-gray-900"
                  >
                    <Image
                      src={avatar.src}
                      alt={`${t('detail.teamMember')} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
                {avatars.length > 4 && (
                  <div className="relative w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-900 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                      +{avatars.length - 4}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            {displayDescription?.trim() && (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-balance">
                {displayDescription}
              </p>
            )}

            {/* Links */}
            <div className="flex gap-6 flex-wrap">
              {content?.trim() && (
                <Link
                  href={href}
                  className="inline-flex items-center gap-1 text-sm text-cyan-600 dark:text-cyan-400 hover:underline"
                >
                  {t('project.moreInfo')}
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
              {link && (
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-cyan-600 dark:text-cyan-400 hover:underline"
                >
                  {t('project.viewProject')}
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
