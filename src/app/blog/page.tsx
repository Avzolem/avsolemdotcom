import { Metadata } from 'next';
import { Mailchimp } from '@/components';
import { Posts } from '@/components/blog/Posts';
import { baseURL, blog, person, newsletter } from '@/resources';
import { SchemaScript } from '@/lib/seo';

// Force static generation at build time
export const dynamic = 'force-static';
export const revalidate = false;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: blog.title,
    description: blog.description,
    metadataBase: new URL(baseURL),
    openGraph: {
      title: blog.title,
      description: blog.description,
      url: `${baseURL}${blog.path}`,
      images: [{ url: `/api/og/generate?title=${encodeURIComponent(blog.title)}` }],
    },
  };
}

export default function Blog() {
  return (
    <div className="flex flex-col max-w-lg w-full">
      <SchemaScript
        as="article"
        baseURL={baseURL}
        title={blog.title}
        description={blog.description}
        path={blog.path}
        image={`/api/og/generate?title=${encodeURIComponent(blog.title)}`}
        publishedAt={new Date().toISOString()}
        author={{
          name: person.name,
          url: `${baseURL}/blog`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
        {blog.title}
      </h1>
      <div className="flex flex-col w-full flex-1">
        <Posts range={[1, 1]} thumbnail direction="column" />
        <Posts range={[2, 3]} thumbnail />
        <Posts range={[4]} columns="2" />
      </div>
      {newsletter?.display && <Mailchimp newsletter={newsletter} />}
    </div>
  );
}
