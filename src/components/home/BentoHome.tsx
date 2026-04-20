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

interface GitHubUser {
  public_repos?: number;
}

interface PushEvent {
  type: string;
  repo: { name: string };
  payload?: { commits?: Array<{ message: string; sha: string }> };
  created_at: string;
}

export interface Commit {
  message: string;
  repo: string;
  sha: string;
  date: string;
  url: string;
}

async function fetchGitHubRepos(): Promise<number> {
  try {
    const res = await fetch(`https://api.github.com/users/${GH_USER}`, {
      headers: { Accept: 'application/vnd.github+json' },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return 0;
    const data: GitHubUser = await res.json();
    return data.public_repos ?? 0;
  } catch {
    return 0;
  }
}

async function fetchRecentCommits(): Promise<Commit[]> {
  try {
    const res = await fetch(`https://api.github.com/users/${GH_USER}/events/public`, {
      headers: { Accept: 'application/vnd.github+json' },
      next: { revalidate: 600 },
    });
    console.log('[GH] fetch status:', res.status);
    if (!res.ok) return [];
    const events: PushEvent[] = await res.json();
    console.log('[GH] events count:', Array.isArray(events) ? events.length : 'NOT_ARRAY');
    const commits: Commit[] = [];
    for (const ev of events) {
      if (ev.type !== 'PushEvent' || !ev.payload?.commits) continue;
      for (const c of ev.payload.commits.reverse()) {
        commits.push({
          message: c.message.split('\n')[0],
          repo: ev.repo.name,
          sha: c.sha.slice(0, 7),
          date: ev.created_at,
          url: `https://github.com/${ev.repo.name}/commit/${c.sha}`,
        });
        if (commits.length >= 3) return commits;
      }
    }
    console.log('[GH] final commits:', commits.length);
    return commits;
  } catch (err) {
    console.error('[GH] fetchRecentCommits error:', err);
    return [];
  }
}

export async function BentoHome() {
  // Load all server-side data once, pass as props to client cards.
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

  const allTags = new Set<string>();
  for (const p of projects) {
    const raw = p.metadata as unknown as { tag?: unknown; tags?: unknown };
    const candidate = raw.tags ?? raw.tag;
    const arr = Array.isArray(candidate) ? candidate : candidate ? [candidate] : [];
    for (const t of arr) allTags.add(String(t).toLowerCase());
  }

  const [repos, commits] = await Promise.all([
    fetchGitHubRepos(),
    fetchRecentCommits(),
  ]);

  const stats = {
    projects: projects.length,
    posts: posts.length,
    stacks: allTags.size,
    repos,
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 pt-3 pb-8 md:pt-4 md:pb-12">
      <AmbientOrbs />
      <KonamiCRT />

      <div className="mb-10 md:mb-12">
        <HeroCard />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 auto-rows-[minmax(140px,auto)]">
        <StatsCard stats={stats} />
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
        <GitHubCard user={GH_USER} commits={commits} />
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
