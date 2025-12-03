import { notFound } from "next/navigation";
import { CustomMDX, ScrollToHash } from "@/components";
import styles from "./blog.module.scss";
import { baseURL, about, blog, person } from "@/resources";
import { formatDate } from "@/utils/formatDate";
import { getPosts } from "@/utils/utils";
import { Metadata } from 'next';
import { Meta, SchemaScript } from '@/lib/seo';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, FileText } from 'lucide-react';

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = getPosts(["src", "app", "blog", "posts"]);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}): Promise<Metadata> {
  const routeParams = await params;
  const slugPath = Array.isArray(routeParams.slug) ? routeParams.slug.join('/') : routeParams.slug || '';

  const posts = getPosts(["src", "app", "blog", "posts"])
  let post = posts.find((post) => post.slug === slugPath);

  if (!post) return {};

  return Meta.generate({
    title: post.metadata.title,
    description: post.metadata.summary,
    baseURL: baseURL,
    image: post.metadata.image || `/api/og/generate?title=${post.metadata.title}`,
    path: `${blog.path}/${post.slug}`,
  });
}

// Avatar Group Component
function AvatarGroup({ avatars, size = 's' }: { avatars: { src: string }[]; size?: 's' | 'm' | 'l' }) {
  const sizeClasses = {
    s: 'w-8 h-8',
    m: 'w-10 h-10',
    l: 'w-12 h-12',
  };

  return (
    <div className="flex -space-x-2">
      {avatars.map((avatar, index) => (
        <div
          key={index}
          className={`relative ${sizeClasses[size]} rounded-full overflow-hidden border-2 border-white dark:border-gray-900`}
        >
          <Image
            src={avatar.src}
            alt={`Author ${index + 1}`}
            fill
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}

export default async function Blog({
  params
}: { params: Promise<{ slug: string | string[] }> }) {
  const routeParams = await params;
  const slugPath = Array.isArray(routeParams.slug) ? routeParams.slug.join('/') : routeParams.slug || '';

  let post = getPosts(["src", "app", "blog", "posts"]).find((post) => post.slug === slugPath);

  if (!post) {
    notFound();
  }

  const avatars =
    post.metadata.team?.map((person: { avatar: string }) => ({
      src: person.avatar,
    })) || [];

  return (
    <div className="flex w-full">
      <div className={`w-48 ${styles.hideOnMedium}`} />
      <div className="flex-1 flex justify-center">
        <section className="flex flex-col max-w-md gap-6 w-full">
          <SchemaScript
            as="blogPosting"
            baseURL={baseURL}
            path={`${blog.path}/${post.slug}`}
            title={post.metadata.title}
            description={post.metadata.summary}
            publishedAt={post.metadata.publishedAt}
            image={post.metadata.image || `/api/og/generate?title=${encodeURIComponent(post.metadata.title)}`}
            author={{
              name: person.name,
              url: `${baseURL}${about.path}`,
              image: `${baseURL}${person.avatar}`,
            }}
          />
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-full"
          >
            <ChevronLeft className="w-4 h-4" />
            Posts
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {post.metadata.title}
          </h1>
          <div className="flex gap-3 items-center">
            {avatars.length > 0 && <AvatarGroup size="s" avatars={avatars} />}
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {post.metadata.publishedAt && formatDate(post.metadata.publishedAt)}
            </span>
          </div>
          <article className="flex flex-col w-full">
            <CustomMDX source={post.content} />
          </article>
          <ScrollToHash />
        </section>
      </div>
      <div className={`flex flex-col w-48 pl-10 sticky top-20 h-fit gap-4 ${styles.hideOnMedium}`}>
        <div className="flex gap-3 pl-0.5 items-center text-gray-500 dark:text-gray-400 text-xs">
          <FileText className="w-3 h-3" />
          On this page
        </div>
        {/* HeadingNav would go here - simplified for now */}
      </div>
    </div>
  );
}
