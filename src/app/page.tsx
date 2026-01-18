import React from 'react';
import { Metadata } from 'next';

import { home, about, person, newsletter, baseURL, routes } from '@/resources';
import { Mailchimp } from '@/components';
import { Projects } from '@/components/work/Projects';
import { Posts } from '@/components/blog/Posts';
import { SchemaScript } from '@/lib/seo';
import { HomeHero, HomeBlogTitle } from '@/components/home/HomeContent';

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

      {/* Hero Section - Client Component */}
      <HomeHero
        featuredDisplay={home.featured?.display}
        featuredHref={home.featured?.href}
      />

      {/* Featured Project - Server Component */}
      <div className="w-full animate-fade-in" style={{ animationDelay: '0.6s' }}>
        <Projects range={[1, 1]} />
      </div>

      {/* Blog Posts */}
      {routes['/blog'] && (
        <div className="w-full flex flex-col gap-6">
          <HomeBlogTitle />
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
