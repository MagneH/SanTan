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

import { container, divider, featureCard, featureDescription, featureGrid, featureIcon, featureTitle, heroContent, heroDescription, heroSection, heroSubtitle, heroTitle, homeContainer, loadMoreButton, logo, logoContainer, section, sectionTitle, subtleHeading, highlightsGrid, highlightCard, highlightIcon, highlightTitle, highlightText, wideSection, twoCol, paragraph, miniBadgeRow, miniBadge, callout, codeBlock } from '@/pages/Home/Home.css.ts';
import { CTA } from '@/components/CTA/CTA.tsx';

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
  const posts = isPreview ? (data?.postsData ?? []) : listData.pages.flat();
  const categories = data?.categoriesData ?? [];

  return (
    <div className={homeContainer}>
      {/* Hero Section */}
      <section className={heroSection}>
        <div className={heroContent}>
          <h1 className={heroTitle}>Santan Starter</h1>
          <p className={heroSubtitle}>A Modern Full-Stack Content Platform</p>
          <p className={heroDescription}>
            Built with the power of React 19, TanStack Start, and Sanity CMS.
            Experience lightning-fast performance, real-time content preview, and a delightful developer experience.
          </p>

          <div className={logoContainer}>
            <img
              src="/tanstack-word-logo-white.svg"
              alt="TanStack"
              className={logo}
            />
            <span style={{ color: 'rgba(0, 0, 0, 0.2)', fontSize: '2.5rem', fontWeight: '100' }}>×</span>
            <img
              src="/sanity_logo_light.png"
              alt="Sanity"
              className={logo}
              style={{ height: '40px' }}
            />
          </div>

          {/* Feature Cards */}
          <div className={featureGrid}>
            <div className={featureCard}>
              <div className={featureIcon}>⚡</div>
              <h3 className={featureTitle}>Lightning Fast</h3>
              <p className={featureDescription}>Server-side rendering with instant client-side navigation</p>
            </div>
            <div className={featureCard}>
              <div className={featureIcon}>👁️</div>
              <h3 className={featureTitle}>Live Preview</h3>
              <p className={featureDescription}>Real-time content updates with Sanity's visual editing</p>
            </div>
            <div className={featureCard}>
              <div className={featureIcon}>🎨</div>
              <h3 className={featureTitle}>Beautiful UI</h3>
              <p className={featureDescription}>Clean, modern design inspired by Apple's aesthetics</p>
            </div>
            <div className={featureCard}>
              <div className={featureIcon}>📱</div>
              <h3 className={featureTitle}>Fully Responsive</h3>
              <p className={featureDescription}>Perfect experience on any device, any screen size</p>
            </div>
          </div>
        </div>
      </section>

      <div className={divider} />

      {/* Categories Section */}
      <section className={section}>
        <h2 className={sectionTitle}>Explore Categories</h2>
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

      <div className={divider} />

      {/* Posts Section */}
      <section className={section}>
        <h2 className={sectionTitle}>Latest Posts</h2>
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
                {isFetchingNextPage ? 'Loading...' : 'Load More'}
              </button>
            )}
          </ClientOnly>
        </div>
      </section>

      <div className={divider} />

      {/* Highlights Section */}
      <section className={section} aria-labelledby="highlights-heading">
        <div className={subtleHeading} id="highlights-heading">Highlights</div>
        <div className={highlightsGrid}>
          <div className={highlightCard}>
            <span className={highlightIcon}>🧩</span>
            <h4 className={highlightTitle}>Composable</h4>
            <p className={highlightText}>A modular approach lets you swap or extend data layers & UI without friction.</p>
          </div>
          <div className={highlightCard}>
            <span className={highlightIcon}>🛰️</span>
            <h4 className={highlightTitle}>Edge Ready</h4>
            <p className={highlightText}>Built on modern primitives that thrive in distributed & edge environments.</p>
          </div>
          <div className={highlightCard}>
            <span className={highlightIcon}>🔄</span>
            <h4 className={highlightTitle}>Reactive Preview</h4>
            <p className={highlightText}>Instant visual updates while you edit structured content in Sanity.</p>
          </div>
          <div className={highlightCard}>
            <span className={highlightIcon}>🛡️</span>
            <h4 className={highlightTitle}>Type Safe</h4>
            <p className={highlightText}>End‑to‑end TypeScript models keep refactors safe & confident.</p>
          </div>
        </div>
      </section>

      <div className={divider} />

      {/* Architecture Section */}
      <section className={wideSection} aria-labelledby="architecture-heading">
        <div className={subtleHeading} id="architecture-heading">Architecture</div>
        <div className={twoCol}>
          <div>
            <p className={paragraph}>
              Santan Starter combines <strong>TanStack Start</strong> for routing & data synchronization, <strong>React 19</strong> for
              modern rendering semantics, and <strong>Sanity</strong> for structured, real‑time content authoring. The result is a
              fluid authoring→publishing loop with minimal glue code.
            </p>
            <p className={paragraph}>
              Content queries are organized, cached, and invalidated intelligently. Preview mode uses a reactive store to switch
              data sources without a full page reload.
            </p>
            <div className={miniBadgeRow}>
              <span className={miniBadge}>React 19</span>
              <span className={miniBadge}>TanStack Start</span>
              <span className={miniBadge}>TypeScript</span>
              <span className={miniBadge}>Sanity</span>
              <span className={miniBadge}>Edge Friendly</span>
            </div>
          </div>
          <div className={callout}>
            <div style={{fontWeight:600, fontSize:'0.85rem', letterSpacing:'0.08em', textTransform:'uppercase', color:'#005bb5'}}>Data Flow</div>
            <pre className={codeBlock} aria-label="Data flow example"><code>{`Client Request
   │
   ├─ Route Loader (decides preview vs published)
   │    ├─ Preview: reactive store + live query
   │    └─ Published: cached query via TanStack Query
   │
   └─ Component hydrates with adaptive source`}</code></pre>
            <p className={paragraph} style={{fontSize:'0.85rem'}}>
              Clear separation of preview vs published pathways keeps production lean while enabling instant editorial feedback.
            </p>
          </div>
        </div>
      </section>

      <div className={divider} />

      {/* Developer Experience Section */}
      <section className={wideSection} aria-labelledby="devexp-heading">
        <div className={subtleHeading} id="devexp-heading">Developer Experience</div>
        <div className={twoCol}>
          <div>
            <p className={paragraph}>
              The stack emphasizes fast iteration: portable query helpers, reusable layout primitives, and co-located types reduce
              friction. Vanilla Extract ensures design tokens stay type safe and themeable.
            </p>
            <p className={paragraph}>
              You can extend this starter with auth, comments, multi‑tenant spaces or edge personalization without reworking the
              fundamentals.
            </p>
          </div>
          <div className={callout}>
            <div style={{fontWeight:600, fontSize:'0.85rem', letterSpacing:'0.08em', textTransform:'uppercase', color:'#005bb5'}}>Why It Feels Fast</div>
            <ul style={{margin:0, padding:'0 0 0 1.1rem', fontSize:'0.85rem', lineHeight:1.6, color:'rgba(0,0,0,0.7)'}}>
              <li>Granular route loaders</li>
              <li>Selective live preview hydration</li>
              <li>Edge‑friendly query patterns</li>
              <li>Progressive image loading</li>
              <li>Minimal global JS</li>
            </ul>
          </div>
        </div>
      </section>

      <div className={divider} />

      {/* CTA Section */}
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
