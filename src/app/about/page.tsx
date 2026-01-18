import { Metadata } from 'next';
import { baseURL, about, person } from "@/resources";
import { Meta, SchemaScript } from '@/lib/seo';
import { AboutContent } from '@/components/about/AboutContent';

export async function generateMetadata(): Promise<Metadata> {
  return Meta.generate({
    title: about.title,
    description: about.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(about.title)}`,
    path: about.path,
  });
}

export default function About() {
  return (
    <>
      <SchemaScript
        as="webPage"
        baseURL={baseURL}
        title={about.title}
        description={about.description}
        path={about.path}
        image={`/api/og/generate?title=${encodeURIComponent(about.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <AboutContent />
    </>
  );
}
