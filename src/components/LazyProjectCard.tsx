"use client";

import dynamic from 'next/dynamic';
import { Column, Flex, Skeleton } from "@once-ui-system/core";

// Loading skeleton for project card
export const ProjectCardSkeleton = () => (
  <Column fillWidth gap="m">
    <Skeleton
      shape="line"
      style={{
        width: '100%',
        aspectRatio: '16/9',
        borderRadius: 'var(--border-radius-l)'
      }}
    />
    <Flex
      direction="column"
      fillWidth
      paddingX="s"
      paddingTop="12"
      paddingBottom="24"
      gap="l"
    >
      <Skeleton shape="line" height="l" width="l" />
      <Column gap="16">
        <Skeleton shape="line" height="m" width="xl" />
        <Skeleton shape="line" height="m" width="l" />
        <Flex gap="24">
          <Skeleton shape="line" height="m" width="s" />
          <Skeleton shape="line" height="m" width="m" />
        </Flex>
      </Column>
    </Flex>
  </Column>
);

// Dynamic import with loading skeleton
export const LazyProjectCard = dynamic(
  () => import('./ProjectCard').then(mod => ({ default: mod.ProjectCard })),
  {
    loading: () => <ProjectCardSkeleton />,
    ssr: true
  }
);