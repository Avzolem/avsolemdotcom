import { getPosts } from "@/utils/utils";
import { Column } from "@once-ui-system/core";
import { LazyProjectCard } from "@/components/LazyProjectCard";

interface ProjectsProps {
  range?: [number, number?];
}

export function Projects({ range }: ProjectsProps) {
  // Direct call without caching to avoid production issues
  let allProjects = getPosts(["src", "app", "work", "projects"]);

  console.log('[Projects] Loaded projects count:', allProjects.length);

  const sortedProjects = allProjects.sort((a, b) => {
    return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
  });

  const displayedProjects = range
    ? sortedProjects.slice(range[0] - 1, range[1] ?? sortedProjects.length)
    : sortedProjects;

  console.log('[Projects] Displaying projects count:', displayedProjects.length);

  return (
    <Column fillWidth gap="xl" marginBottom="40" paddingX="l">
      {displayedProjects.map((post, index) => (
        <LazyProjectCard
          priority={index === 0}
          key={post.slug}
          href={`work/${post.slug}`}
          images={post.metadata.images}
          title={post.metadata.title}
          description={post.metadata.summary}
          content={post.content}
          avatars={post.metadata.team?.map((member: any) => ({ src: member.avatar })) || []}
          link={post.metadata.link || ""}
        />
      ))}
    </Column>
  );
}
