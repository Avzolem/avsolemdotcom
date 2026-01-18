import { Metadata } from 'next';
import MasonryGrid from "@/components/gallery/MasonryGrid";
import { baseURL, gallery, person } from "@/resources";
import { SchemaScript, Meta } from '@/lib/seo';
import { GalleryTitle } from '@/components/PageTitles';

export async function generateMetadata(): Promise<Metadata> {
  return Meta.generate({
    title: gallery.title,
    description: gallery.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(gallery.title)}`,
    path: gallery.path,
  });
}

export default function Gallery() {
  return (
    <div className="flex flex-col w-full max-w-5xl">
      <SchemaScript
        as="webPage"
        baseURL={baseURL}
        title={gallery.title}
        description={gallery.description}
        path={gallery.path}
        image={`/api/og/generate?title=${encodeURIComponent(gallery.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${gallery.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <GalleryTitle />
      <MasonryGrid />
    </div>
  );
}
