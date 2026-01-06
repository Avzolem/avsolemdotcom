import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

import { home, about, person, newsletter, baseURL, routes } from '@/resources';
import { Mailchimp } from '@/components';
import { Projects } from '@/components/work/Projects';
import { Posts } from '@/components/blog/Posts';
import { SchemaScript } from '@/lib/seo';

// Force static generation at build time
export const dynamic = 'force-static';
export const revalidate = false;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: home.title,
    description: home.description,
    metadataBase: new URL(baseURL),
    openGraph: {
      title: home.title,
      description: home.description,
      url: baseURL,
      images: [{ url: home.image || `/api/og/generate?title=${encodeURIComponent(home.title)}` }],
    },
    alternates: {
      canonical: baseURL,
    },
  };
}

// RevealFx component for animations
function RevealFx({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={`animate-fade-in ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-12 max-w-3xl w-full">
      <SchemaScript
        as="webPage"
        baseURL={baseURL}
        path={home.path}
        title={home.title}
        description={home.description}
        image={`/api/og/generate?title=${encodeURIComponent(home.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      {/* Hero Section */}
      <div className="w-full py-6">
        <div className="max-w-lg">
          {/* Featured Badge */}
          {home.featured?.display && (
            <RevealFx className="pt-4 pb-8 pl-3">
              <Link
                href={home.featured.href}
                className="
                  inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium
                  bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300
                  hover:bg-cyan-200 dark:hover:bg-cyan-900/50 transition-colors
                "
              >
                {home.featured.title}
                <ChevronRight className="w-3 h-3" />
              </Link>
            </RevealFx>
          )}

          {/* Headline */}
          <RevealFx delay={0.1} className="pb-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white text-balance">
              {home.headline}
            </h1>
          </RevealFx>

          {/* Subline */}
          <RevealFx delay={0.2} className="pb-8">
            <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 text-balance">
              {home.subline}
            </p>
          </RevealFx>

          {/* CTA Button */}
          <RevealFx delay={0.4} className="pt-3 pl-3">
            <Link
              href={about.path}
              className="
                inline-flex items-center gap-2 px-4 py-2 rounded-lg
                bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700
                text-gray-900 dark:text-white font-medium
                border border-gray-300 dark:border-gray-700
                shadow-sm dark:shadow-none
                transition-colors duration-200
              "
            >
              {about.avatar?.display && (
                <div className="relative w-8 h-8 rounded-full overflow-hidden -ml-1">
                  <Image
                    src={person.avatar}
                    alt={person.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              {about.title}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </RevealFx>
        </div>
      </div>

      {/* Featured Project */}
      <RevealFx delay={0.6} className="w-full">
        <Projects range={[1, 1]} />
      </RevealFx>

      {/* Blog Posts */}
      {routes['/blog'] && (
        <div className="w-full flex flex-col gap-6">
          <div className="pl-4 pt-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Latest from the blog
            </h2>
          </div>
          <div className="px-5">
            <Posts range={[1, 2]} columns="2" />
          </div>
        </div>
      )}

      {/* More Projects */}
      <Projects range={[2]} />

      {/* Newsletter */}
      {newsletter?.display && <Mailchimp newsletter={newsletter} />}
    </div>
  );
}
