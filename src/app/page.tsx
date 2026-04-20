import { Metadata } from 'next';

import { home, about, person, baseURL } from '@/resources';
import { SchemaScript } from '@/lib/seo';
import { BentoHome } from '@/components/home/BentoHome';

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

export default async function Home() {
  return (
    <>
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
      <BentoHome />
    </>
  );
}
