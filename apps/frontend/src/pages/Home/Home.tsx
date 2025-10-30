import { useInfiniteQuery } from '@tanstack/react-query';
import { useStore } from '@tanstack/react-store';
import { ClientOnly } from '@tanstack/react-router';
import type { PageProps } from '@/types/PageProps.ts';
import type { HomeDocument } from '@/types/home.ts';
import type { CategoryStub } from '@/types/category.ts';
import type { PostStub } from '@/types/post.ts';
import { Route } from '@/routes/index.tsx';
import { withPreviewData, withPublishedData } from '@/components/withDocument.tsx';
import { homeQuery } from '@/sanity/queries/homeQuery.ts';
import { getPostsQuery } from '@/sanity/queries/postQuery.ts';
import { client } from '@/sanity/client.ts';
import { STUDIO_BASEPATH } from '@/sanity/constants.ts';
import { PostCard } from '@/components/PostCard/PostCard.tsx';
import { POSTS_PER_PAGE } from '@/constants/config.ts';
import { previewStore } from '@/stores/previewStore.ts';

import { container, homeContainer, loadMoreButton, section, sectionTitle } from '@/pages/Home/Home.css.ts';

const Home = ({
  data,
}: PageProps<{ categoriesData: Array<CategoryStub>; postsData: Array<PostStub>; homeData: HomeDocument }>) => {
  // Read isPreview from the reactive store instead of props
  // This ensures it updates when GlobalLayout detects preview mode
  const { isPreview } = useStore(previewStore);

  const {
    data: listData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts', isPreview ? 'preview' : 'published'],
    enabled: !isPreview, // Only use infinite query when NOT in preview mode
    initialPageParam: {
      pageNumber: 0,
      lastId: data?.postsData[data.postsData.length - 1]?._id,
      lastPublishedAt: data?.postsData[data.postsData.length - 1]?.publishedAt,
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage && lastPage.length < POSTS_PER_PAGE
        ? undefined
        : {
            pageNumber: allPages.length,
            lastPublishedAt: lastPage?.[lastPage.length - 1]?.publishedAt,
            lastId: lastPage?.[lastPage.length - 1]?._id,
          },
    queryFn: async ({ pageParam }) => {
      // This should only run when NOT in preview mode
      if (isPreview) {
        throw new Error('Infinite query should not run in preview mode');
      }

      const { lastId, lastPublishedAt } = pageParam;
      const result = await client
        .withConfig({
          stega: { enabled: false, studioUrl: STUDIO_BASEPATH },
          resultSourceMap: false,
          // Never use perspective in infinite query - always published
          perspective: 'published',
        })
        .fetch(getPostsQuery(POSTS_PER_PAGE), {
          lastPublishedAt: lastPublishedAt || null,
          lastId: lastId || null,
        });
      return result;
    },
    initialData: !isPreview
      ? {
          pages: [data?.postsData],
          pageParams: [{ pageNumber: 0, lastPublishedAt: null, lastId: null }],
        }
      : undefined,
    // Ensure query doesn't refetch when isPreview changes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // In preview mode, use data from server (which has live updates)
  // In production, use infinite query data (which has pagination)
  const posts = isPreview ? (data?.postsData ?? []) : listData.pages.flat();
  const categories = data?.categoriesData ?? [];

  return (
    <div className={homeContainer}>
      <section className={section}>
        <h2 className={sectionTitle}>Kategorier</h2>
        <div className={container}>
          {categories.map((category) => (
            <PostCard
              key={category.fullSlug ?? category._createdAt}
              fullSlug={category.fullSlug}
              title={category.title}
              description={category.description}
              mainImage={category.mainImage}
            />
          ))}
        </div>
      </section>
      <section className={section}>
        <h2 className={sectionTitle}>Bloggposter</h2>
        <div className={container}>
          {posts.map((post) => (
            <PostCard
              key={post?.fullSlug ?? post?._id}
              fullSlug={post?.fullSlug}
              title={post?.title}
              description={post?.ingress}
              mainImage={post?.mainImage}
            />
          ))}
          <ClientOnly>
            {!isPreview && hasNextPage && (
              <button className={loadMoreButton} onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                {isFetchingNextPage ? 'Laster...' : 'Last inn fler'}
              </button>
            )}
          </ClientOnly>
        </div>
      </section>
    </div>
  );
};

const HomePreview = withPreviewData(Home);
const HomePublished = withPublishedData(Home);

export function HomePage() {
  const loaderData = Route.useLoaderData();

  // Use the reactive preview store instead of only the loader's isPreview
  // This allows the component to switch when preview mode is detected client-side
  const { isPreview: isPreviewFromStore } = useStore(previewStore);

  const {
    initial,
    options,
    query,
    params,
    sanity: { isPreview: isPreviewFromLoader },
  } = loaderData;

  // Use the store value (client-side reactive) with loader as fallback (SSR)
  const isPreview = isPreviewFromStore || isPreviewFromLoader;

  // Note: We pass loader's isPreview to determine which wrapper to use,
  // but the Home component itself reads from the store for reactive updates
  return isPreview ? (
    <HomePreview initial={initial} query={query} params={params} />
  ) : (
    <HomePublished initial={initial?.data} tanstackQuery={homeQuery(options)} />
  );
}
