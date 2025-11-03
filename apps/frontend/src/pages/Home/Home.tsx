import { useInfiniteQuery } from '@tanstack/react-query';
import { useStore } from '@tanstack/react-store';
// Stiler
import { divider, homeContainer } from './Home.css.ts';
// Typer
import { HeroSection } from './sections/HeroSection.tsx';
import { ArchitectureSection } from './sections/ArchitectureSection.tsx';
import { DevExpSection } from './sections/DevExpSection.tsx';
import { CategoriesSection } from './sections/CategoriesSection.tsx';
import { PostsSection } from './sections/PostsSection.tsx';
import { HighlightsSection } from './sections/HighlightsSection.tsx';
import type { PageProps } from '@/types/PageProps.ts';
import type { HomeDocument } from '@/types/home.ts';
import type { CategoryStub } from '@/types/category.ts';
import type { PostStub } from '@/types/post.ts';
// Interne utilities
import { Route } from '@/routes/index.tsx';
import { withPreviewData, withPublishedData } from '@/components/withDocument.tsx';
import { homeQuery } from '@/sanity/queries/homeQuery.ts';
import { getPostsQuery } from '@/sanity/queries/postQuery.ts';
import { client } from '@/sanity/client.ts';
import { STUDIO_BASEPATH } from '@/sanity/constants.ts';
import { POSTS_PER_PAGE } from '@/constants/config.ts';
import { previewStore } from '@/stores/previewStore.ts';
import { CTA } from '@/components/CTA/CTA.tsx';

type HomePagePayload = {
  categoriesData: Array<CategoryStub>;
  postsData: Array<PostStub>;
  homeData: HomeDocument;
};

const Home = ({ data }: PageProps<HomePagePayload>) => {
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
      return await client
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
  const posts: Array<PostStub> = isPreview ? (data?.postsData ?? []) : (listData.pages.flat() as Array<PostStub>);
  const categories: Array<CategoryStub> = data?.categoriesData ?? [];
  const homeData = data?.homeData ?? { title: null, subTitle: null, description: null };

  return (
    <div className={homeContainer}>
      <HeroSection
        title={homeData.title}
        subTitle={homeData.subTitle}
        description={homeData.description || undefined}
      />
      <div className={divider} />
      <CategoriesSection categories={categories} />
      <div className={divider} />
      <PostsSection
        posts={posts}
        isPreview={isPreview}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
      <div className={divider} />
      <HighlightsSection />
      <div className={divider} />
      <ArchitectureSection badges={[ 'React 19', 'TanStack Start', 'TypeScript', 'Sanity', 'Edge Friendly' ]} />
      <div className={divider} />
      <DevExpSection />
      <div className={divider} />
      <CTA />
      <div className={divider} />
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
