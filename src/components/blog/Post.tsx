'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './Posts.module.scss';
import { formatDate } from '@/utils/formatDate';

interface PostProps {
  post: any;
  thumbnail: boolean;
  direction?: 'row' | 'column';
}

export default function Post({ post, thumbnail, direction }: PostProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`
        block w-full rounded-xl transition-all duration-200
        ${styles.hover}
      `}
    >
      <div className="flex flex-col relative w-full rounded-xl">
        {post.metadata.image && thumbnail && (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
            <Image
              src={post.metadata.image}
              alt={'Thumbnail of ' + post.metadata.title}
              fill
              sizes="(max-width: 768px) 100vw, 640px"
              className={`object-cover ${styles.image}`}
              priority
            />
          </div>
        )}
        <div className="relative w-full flex flex-col gap-1 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white text-balance">
            {post.metadata.title}
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(post.metadata.publishedAt, false)}
          </span>
          {post.metadata.tag && (
            <span className="mt-3 inline-flex self-start px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              {post.metadata.tag}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
