import { notFound } from "next/navigation";
import { getPosts } from "@/utils/utils";
import { baseURL, about, person, work } from "@/resources";
import { ScrollToHash, CustomMDX } from "@/components";
import { MediaCarousel } from "@/components/MediaCarousel";
import { Metadata } from "next";
import { Meta, SchemaScript } from '@/lib/seo';
import { BackToProjects, FormattedDate, AvatarGroup, TranslatedTitle } from '@/components/DetailPageElements';

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
        <BackToProjects />
        <TranslatedTitle
          title={post.metadata.title}
          title_es={post.metadata.title_es}
        />
      </div>
      {post.metadata.images.length > 0 && (
        <div className="w-full aspect-video relative">
          <MediaCarousel media={post.metadata.images} />
        </div>
      )}
      <article className="flex flex-col max-w-md w-full mx-auto">
        <div className="flex gap-3 mb-6 items-center">
          {post.metadata.team && <AvatarGroup reverse avatars={avatars} size="m" type="team" />}
          {post.metadata.publishedAt && <FormattedDate date={post.metadata.publishedAt} />}
        </div>
        <CustomMDX source={post.content} />
      </article>
      <ScrollToHash />
    </section>
  );
}
