import { getPosts } from '@/utils/utils';
import '@/styles/ambient-orbs.css';
import { AmbientOrbs } from './AmbientOrbs';
import { HeroCard } from './cards/HeroCard';
import { StatsCard } from './cards/StatsCard';
import { FeaturedProjectCard } from './cards/FeaturedProjectCard';
import { BlogCard } from './cards/BlogCard';
import { GitHubCard } from './cards/GitHubCard';
import { SoundtrackCard } from './cards/SoundtrackCard';
import { ContactFormCard } from './cards/ContactFormCard';
import { AIChatCard } from './cards/AIChatCard';
import { KonamiCRT } from './KonamiCRT';
import { HomeFooter } from './HomeFooter';

const GH_USER = 'Avzolem';

export function BentoHome() {
  const projects = getPosts(['src', 'app', 'work', 'projects']);
  const posts = getPosts(['src', 'app', 'blog', 'posts']);

  const sortedProjects = projects.sort(
    (a, b) =>
      new Date(b.metadata.publishedAt).getTime() -
      new Date(a.metadata.publishedAt).getTime()
  );
  const sortedPosts = posts.sort(
    (a, b) =>
      new Date(b.metadata.publishedAt).getTime() -
      new Date(a.metadata.publishedAt).getTime()
  );

  const featured = sortedProjects[0];
  const latestPost = sortedPosts[0];

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 pt-3 pb-8 md:pt-4 md:pb-12">
      <AmbientOrbs />
      <KonamiCRT />

      <div className="mb-10 md:mb-12">
        <HeroCard />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 auto-rows-[minmax(140px,auto)]">
        <StatsCard projects={projects.length} posts={posts.length} />
        <FeaturedProjectCard
          slug={featured?.slug}
          title={featured?.metadata.title}
          title_es={featured?.metadata.title_es}
          summary={featured?.metadata.summary}
          summary_es={featured?.metadata.summary_es}
          image={featured?.metadata.images?.[0]}
        />
        <ContactFormCard />

        <SoundtrackCard />
        <GitHubCard user={GH_USER} />
        <BlogCard
          slug={latestPost?.slug}
          title={latestPost?.metadata.title}
          title_es={latestPost?.metadata.title_es}
          publishedAt={latestPost?.metadata.publishedAt}
        />

        <AIChatCard
          projectSlugs={projects.map((p) => p.slug)}
          postSlugs={posts.map((p) => p.slug)}
        />
      </div>

      <HomeFooter />
    </div>
  );
}
