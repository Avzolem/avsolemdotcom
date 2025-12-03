'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { OptimizedCarousel } from './OptimizedCarousel';

interface ProjectCardProps {
  href: string;
  priority?: boolean;
  images: string[];
  title: string;
  content: string;
  description: string;
  avatars: { src: string }[];
  link: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  href,
  priority,
  images = [],
  title,
  content,
  description,
  avatars,
  link,
}) => {
  return (
    <div className="flex flex-col w-full gap-4">
      <OptimizedCarousel
        images={images}
        title={title}
        priority={priority}
        sizes="(max-width: 960px) 100vw, 960px"
      />
      <div className="flex flex-col w-full px-2 pt-3 pb-6 gap-4">
        {title && (
          <div className="flex-[5]">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white text-balance">
              {title}
            </h2>
          </div>
        )}
        {(avatars?.length > 0 || description?.trim() || content?.trim()) && (
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
                      alt={`Team member ${index + 1}`}
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
            {description?.trim() && (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-balance">
                {description}
              </p>
            )}

            {/* Links */}
            <div className="flex gap-6 flex-wrap">
              {content?.trim() && (
                <Link
                  href={href}
                  className="inline-flex items-center gap-1 text-sm text-cyan-600 dark:text-cyan-400 hover:underline"
                >
                  More Info
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
                  View project
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
