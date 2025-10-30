import { ClientOnly, HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import { TanStackDevtools } from '@tanstack/react-devtools';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { Suspense, lazy, useEffect } from 'react';
import { useStore } from '@tanstack/react-store';
import TanStackQueryDevtools from '@/integrations/tanstack-query/devtools.tsx';
import Header from '@/components/Header/Header.tsx';
import { Route } from '@/routes/__root.tsx';
import { FavIcons } from '@/components/GlobalLayout/FavIcons.tsx';
import { previewStore, setPreviewMode, setPreviewPerspective } from '@/stores/previewStore.ts';
import { ErrorBoundary } from '@/components/ErrorBoundary.tsx';
import { PREVIEW_SESSION_NAME } from '@/sessions.ts';
import './GlobalLayout.css.ts';

const ExitPreview = lazy(() => import('@/components/ExitPreview.tsx'));

const VisualEditing = lazy(() => import('@/sanity/VisualEditing.tsx'));

export const GlobalLayout = () => {
  const { sanity } = Route.useLoaderData();
  const { isPreview, isDraftsPerspective } = useStore(previewStore);

  // Initialize store with server-side preview state
  useEffect(() => {
    setPreviewMode(sanity.isPreview);
  }, [sanity.isPreview]);

  // Re-check preview mode on client mount
  // (handles case where request context is unavailable after redirects)
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const hasCookie = document.cookie.includes(`${PREVIEW_SESSION_NAME}=`);

      // Also check URL parameters for perspective (Sanity Studio sends this)
      const urlParams = new URLSearchParams(window.location.search);
      const perspectiveParam = urlParams.get('perspective');
      const hasPerspectiveParam = perspectiveParam === 'previewDrafts' || perspectiveParam === 'drafts';

      const shouldBeInPreview = hasCookie || hasPerspectiveParam;

      if (shouldBeInPreview !== isPreview) {
        setPreviewMode(shouldBeInPreview);
      }
    }
  }, [isPreview]);

  // Check URL params for perspective and listen for Studio messages
  useEffect(() => {
    if (!isPreview) return;

    const checkPerspective = () => {
      const params = new URLSearchParams(window.location.search);
      const perspective = params.get('perspective');

      // Sanity Studio sends perspective in URL params
      if (perspective) {
        const isDrafts = perspective === 'previewDrafts' || perspective === 'drafts';
        setPreviewPerspective(isDrafts);
      }
    };

    // Check on mount
    checkPerspective();

    // Listen for messages from Sanity Studio (for perspective changes)
    const handleMessage = (event: MessageEvent) => {
      if (event.data && typeof event.data === 'object') {
        // Check for perspective change messages from Sanity Presentation Tool
        if (event.data.type === 'presentation/perspective' && event.data.data?.perspective) {
          const perspective = event.data.data.perspective;
          const isDrafts = perspective === 'previewDrafts' || perspective === 'drafts';
          setPreviewPerspective(isDrafts);
        }
      }
    };

    // Listen for URL changes (when Studio navigates)
    const handlePopState = () => {
      checkPerspective();
    };

    window.addEventListener('message', handleMessage);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isPreview]);

  return (
    <html lang="no">
      <head>
        <HeadContent />
        <FavIcons />
      </head>
      <body>
        <ErrorBoundary>
          <Header />
          <Outlet />
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
              TanStackQueryDevtools,
            ]}
          />
          <Scripts />
          <ClientOnly>
            {isPreview ? (
              <>
                {/* Visual debug indicator - changes based on Studio perspective */}
                {isDraftsPerspective ? (
                  <div
                    style={{
                      position: 'fixed',
                      top: '10px',
                      right: '10px',
                      background: 'orange',
                      color: 'black',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      zIndex: 999999,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    }}
                  >
                    🟠 PREVIEW MODE (Drafts)
                  </div>
                ) : (
                  <div
                    style={{
                      position: 'fixed',
                      top: '10px',
                      right: '10px',
                      background: 'lime',
                      color: 'black',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      zIndex: 999999,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    }}
                  >
                    🟢 PREVIEW MODE (Published)
                  </div>
                )}
                <Suspense fallback={null}>
                  <ExitPreview />
                  <VisualEditing />
                </Suspense>
              </>
            ) : (
              <>
                {/* Visual debug indicator - visible in iframe */}
                <div
                  style={{
                    position: 'fixed',
                    top: '10px',
                    right: '10px',
                    background: 'gray',
                    color: 'white',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    zIndex: 999999,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  }}
                >
                  ⚪ PUBLISHED MODE
                </div>
              </>
            )}
          </ClientOnly>
        </ErrorBoundary>
      </body>
    </html>
  );
};
