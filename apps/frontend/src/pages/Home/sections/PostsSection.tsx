import { ClientOnly } from '@tanstack/react-router';
import { container, loadMoreButton, section, sectionTitle } from '../Home.css.ts';
import type { PostStub } from '@/types/post.ts';
import { PostCard } from '@/components/PostCard/PostCard.tsx';

interface PostsSectionProps {
  posts: Array<PostStub>;
  isPreview: boolean;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}
export function PostsSection({ posts, isPreview, hasNextPage, isFetchingNextPage, fetchNextPage }: PostsSectionProps) {
  return (
    <section className={section}>
      <h2 className={sectionTitle}>Latest Posts</h2>
      <div className={container}>
        {posts.map(post => (
          <PostCard
            key={post.fullSlug ?? post._id}
            fullSlug={post.fullSlug}
            title={post.title}
            description={post.ingress}
            mainImage={post.mainImage}
          />
        ))}
        <ClientOnly>
          {!isPreview && hasNextPage && (
            <button className={loadMoreButton} onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
              {isFetchingNextPage ? 'Loading...' : 'Load More'}
            </button>
          )}
        </ClientOnly>
      </div>
    </section>
  );
}
