import { getPosts } from '@/utils/utils';
import { ProjectCard } from '@/components/ProjectCard';

interface ProjectsProps {
  range?: [number, number?];
}

export function Projects({ range }: ProjectsProps) {
  // Direct call without caching to avoid production issues
  let allProjects = getPosts(['src', 'app', 'work', 'projects']);

  console.log('[Projects] Loaded projects count:', allProjects.length);

  const sortedProjects = allProjects.sort((a, b) => {
    return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
  });

  const displayedProjects = range
    ? sortedProjects.slice(range[0] - 1, range[1] ?? sortedProjects.length)
    : sortedProjects;

  console.log('[Projects] Displaying projects count:', displayedProjects.length);

  return (
    <div className="flex flex-col w-full gap-8 mb-10 px-4">
      {displayedProjects.map((post, index) => (
        <ProjectCard
          priority={index === 0}
          key={post.slug}
          href={`work/${post.slug}`}
          images={post.metadata.images}
          title={post.metadata.title}
          title_es={post.metadata.title_es}
          description={post.metadata.summary}
          description_es={post.metadata.summary_es}
          content={post.content}
          avatars={post.metadata.team?.map((member: any) => ({ src: member.avatar })) || []}
          link={post.metadata.link || ''}
        />
      ))}
    </div>
  );
}
