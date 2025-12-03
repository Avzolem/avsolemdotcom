import { notFound } from "next/navigation";
import { getPosts } from "@/utils/utils";
import { baseURL, about, person, work } from "@/resources";
import { formatDate } from "@/utils/formatDate";
import { ScrollToHash, CustomMDX } from "@/components";
import { MediaCarousel } from "@/components/MediaCarousel";
import { Metadata } from "next";
import { Meta, SchemaScript } from '@/lib/seo';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft } from 'lucide-react';

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = getPosts(["src", "app", "work", "projects"]);
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

  const posts = getPosts(["src", "app", "work", "projects"])
  let post = posts.find((post) => post.slug === slugPath);

  if (!post) return {};

  return Meta.generate({
    title: post.metadata.title,
    description: post.metadata.summary,
    baseURL: baseURL,
    image: post.metadata.image || `/api/og/generate?title=${post.metadata.title}`,
    path: `${work.path}/${post.slug}`,
  });
}

// Avatar Group Component
function AvatarGroup({ avatars, reverse = false, size = 'm' }: { avatars: { src: string }[]; reverse?: boolean; size?: 's' | 'm' | 'l' }) {
  const sizeClasses = {
    s: 'w-8 h-8',
    m: 'w-10 h-10',
    l: 'w-12 h-12',
  };

  const orderedAvatars = reverse ? [...avatars].reverse() : avatars;

  return (
    <div className="flex -space-x-2">
      {orderedAvatars.map((avatar, index) => (
        <div
          key={index}
          className={`relative ${sizeClasses[size]} rounded-full overflow-hidden border-2 border-white dark:border-gray-900`}
        >
          <Image
            src={avatar.src}
            alt={`Team member ${index + 1}`}
            fill
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}

export default async function Project({
  params
}: { params: Promise<{ slug: string | string[] }> }) {
  const routeParams = await params;
  const slugPath = Array.isArray(routeParams.slug) ? routeParams.slug.join('/') : routeParams.slug || '';

  let post = getPosts(["src", "app", "work", "projects"]).find((post) => post.slug === slugPath);

  if (!post) {
    notFound();
  }

  const avatars =
    post.metadata.team?.map((person: { avatar: string }) => ({
      src: person.avatar,
    })) || [];

  return (
    <section className="flex flex-col max-w-3xl w-full mx-auto items-center gap-6">
      <SchemaScript
        as="blogPosting"
        baseURL={baseURL}
        path={`${work.path}/${post.slug}`}
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
      <div className="flex flex-col max-w-md w-full gap-4">
        <Link
          href="/work"
          className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-full"
        >
          <ChevronLeft className="w-4 h-4" />
          Projects
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          {post.metadata.title}
        </h1>
      </div>
      {post.metadata.images.length > 0 && (
        <div className="w-full aspect-video relative">
          <MediaCarousel media={post.metadata.images} />
        </div>
      )}
      <article className="flex flex-col max-w-md w-full mx-auto">
        <div className="flex gap-3 mb-6 items-center">
          {post.metadata.team && <AvatarGroup reverse avatars={avatars} size="m" />}
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {post.metadata.publishedAt && formatDate(post.metadata.publishedAt)}
          </span>
        </div>
        <CustomMDX source={post.content} />
      </article>
      <ScrollToHash />
    </section>
  );
}
