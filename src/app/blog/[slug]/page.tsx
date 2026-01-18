import { notFound } from "next/navigation";
import { CustomMDX, ScrollToHash } from "@/components";
import styles from "./blog.module.scss";
import { baseURL, about, blog, person } from "@/resources";
import { getPosts } from "@/utils/utils";
import { Metadata } from 'next';
import { Meta, SchemaScript } from '@/lib/seo';
import { BackToPosts, OnThisPage, FormattedDate, AvatarGroup, TranslatedTitle } from '@/components/DetailPageElements';

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
          <BackToPosts />
          <TranslatedTitle
            title={post.metadata.title}
            title_es={post.metadata.title_es}
          />
          <div className="flex gap-3 items-center">
            {avatars.length > 0 && <AvatarGroup size="s" avatars={avatars} type="author" />}
            {post.metadata.publishedAt && <FormattedDate date={post.metadata.publishedAt} />}
          </div>
          <article className="flex flex-col w-full">
            <CustomMDX source={post.content} />
          </article>
          <ScrollToHash />
        </section>
      </div>
      <div className={`flex flex-col w-48 pl-10 sticky top-20 h-fit gap-4 ${styles.hideOnMedium}`}>
        <OnThisPage />
      </div>
    </div>
  );
}
