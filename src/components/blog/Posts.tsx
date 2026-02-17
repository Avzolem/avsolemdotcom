import { getPosts } from '@/utils/utils';
import Post from './Post';

interface PostsProps {
  range?: [number] | [number, number];
  columns?: '1' | '2' | '3';
  thumbnail?: boolean;
  direction?: 'row' | 'column';
}

export function Posts({
  range,
  columns = '1',
  thumbnail = false,
  direction
}: PostsProps) {
  let allBlogs = getPosts(['src', 'app', 'blog', 'posts']);

  const sortedBlogs = allBlogs.sort((a, b) => {
    return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
  });

  const displayedBlogs = range
    ? sortedBlogs.slice(
        range[0] - 1,
        range.length === 2 ? range[1] : sortedBlogs.length
      )
    : sortedBlogs;

  const gridCols = {
    '1': 'grid-cols-1',
    '2': 'grid-cols-1 md:grid-cols-2',
    '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  };

  return (
    <>
      {displayedBlogs.length > 0 && (
        <div className={`grid ${gridCols[columns]} gap-3 w-full mb-10`}>
          {displayedBlogs.map((post) => (
            <Post
              key={post.slug}
              post={post}
              thumbnail={thumbnail}
              direction={direction}
            />
          ))}
        </div>
      )}
    </>
  );
}
