import { ClientOnly, HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import { TanStackDevtools } from '@tanstack/react-devtools';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { Suspense, lazy, useEffect, useState } from 'react';
import { useStore } from '@tanstack/react-store';
import TanStackQueryDevtools from '@/integrations/tanstack-query/devtools.tsx';
import Header from '@/components/Header/Header.tsx';
import { Footer } from '@/components/Footer/Footer.tsx';
import { Route } from '@/routes/__root.tsx';
import { FavIcons } from '@/components/GlobalLayout/FavIcons.tsx';
import { previewStore, setPreviewMode, setPreviewPerspective } from '@/stores/previewStore.ts';
import { ErrorBoundary } from '@/components/ErrorBoundary.tsx';
import { PREVIEW_SESSION_NAME } from '@/sessions.ts';
import { darkTheme, lightTheme } from '@/styles/theme.css.ts';
import './GlobalLayout.css.ts';

const VisualEditing = lazy(() => import('@/sanity/VisualEditing.tsx'));

export const GlobalLayout = () => {
  const { sanity } = Route.useLoaderData();
  const { isPreview, isDraftsPerspective } = useStore(previewStore);
  const [isEmbeddedStudio, setIsEmbeddedStudio] = useState(false);

  useEffect(() => { setPreviewMode(sanity.isPreview); }, [sanity.isPreview]);

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

  useEffect(() => {
    // Mark UI as ready after mount to enable transitions
    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('ui-ready');
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Sjekk om vi kjører i et iframe (Sanity Studio preview-pane)
      const embedded = window.self !== window.top;
      setIsEmbeddedStudio(embedded);
    }
  }, []);

  return (
    <html lang="no" suppressHydrationWarning>
      <head>
        <title>SanTan Starter</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {/* Set ui-ready class as soon as possible after stylesheets load */}
        <script dangerouslySetInnerHTML={{__html:`(function(){var check=function(){if(document.styleSheets.length>0){document.documentElement.classList.add('ui-ready');}else{setTimeout(check,50);}};if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',check);}else{check();}})();`}} />
        {/* Early theme bootstrap - runs before any paint */}
        <script dangerouslySetInnerHTML={{__html:`(function(){try{var s=localStorage.getItem('theme');var m=window.matchMedia('(prefers-color-scheme:dark)').matches;var t=s||(m?'dark':'light');if(t==='dark'){document.documentElement.setAttribute('data-theme','dark');document.documentElement.classList.add('${darkTheme}');}else{document.documentElement.classList.add('${lightTheme}');}}catch(e){document.documentElement.classList.add('${lightTheme}');}})();`}} />
        {/* Router-managed head (injects global stylesheet, meta, etc.) */}
        <HeadContent />
        {/* Preconnect to Google Fonts for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Preload key assets */}
        <link rel="preload" as="image" href="/tanstack-word-logo-white.svg" />
        <link rel="preload" as="image" href="/sanity_logo_light.png" />
        <FavIcons />
      </head>
      <body suppressHydrationWarning>
        <a href="#app-root" aria-label="Hopp til hovedinnhold" style={{position:'absolute',left:'-999px',top:'-999px',background:'#000',color:'#fff',padding:'8px 12px',borderRadius:4,transform:'translateY(-8px)'}} onFocus={(e)=>{e.currentTarget.style.left='12px';e.currentTarget.style.top='12px';}} onBlur={(e)=>{e.currentTarget.style.left='-999px';e.currentTarget.style.top='-999px';}}>Hopp til innhold</a>
        <ErrorBoundary>
          <Header />
          <main id="app-root">
            <Outlet />
          </main>
          <Footer />
          <TanStackDevtools
            config={{ position: 'bottom-right' }}
            plugins={[
              { name: 'Tanstack Router', render: <TanStackRouterDevtoolsPanel /> },
              TanStackQueryDevtools,
            ]}
          />
          <Scripts />
          <ClientOnly>
            {isPreview && isEmbeddedStudio && (
              <>
                {isDraftsPerspective ? (
                  <div role="status" aria-live="polite" style={{position:'fixed',bottom:'10px',left:'10px',background:'rgba(255,165,0,0.65)',color:'#111',padding:'8px 12px',borderRadius:'6px',fontSize:'12px',fontWeight:'600',zIndex:999999,boxShadow:'0 2px 8px rgba(0,0,0,0.25)',backdropFilter:'blur(6px)',border:'1px solid rgba(255,255,255,0.3)',letterSpacing:'0.5px',pointerEvents:'none',display:'flex',alignItems:'center',gap:'6px'}}>
                    <span aria-hidden style={{width:8,height:8,borderRadius:'50%',background:'#ff8c00',boxShadow:'0 0 0 2px rgba(255,255,255,0.4)'}} />
                    PREVIEW MODE (Drafts)
                  </div>
                ) : (
                  <div role="status" aria-live="polite" style={{position:'fixed',bottom:'10px',left:'10px',background:'rgba(80,220,120,0.55)',color:'#07240f',padding:'8px 12px',borderRadius:'6px',fontSize:'12px',fontWeight:'600',zIndex:999999,boxShadow:'0 2px 8px rgba(0,0,0,0.25)',backdropFilter:'blur(6px)',border:'1px solid rgba(255,255,255,0.3)',letterSpacing:'0.5px',pointerEvents:'none',display:'flex',alignItems:'center',gap:'6px'}}>
                    <span aria-hidden style={{width:8,height:8,borderRadius:'50%',background:'#2bbf65',boxShadow:'0 0 0 2px rgba(255,255,255,0.4)'}} />
                    PREVIEW MODE (Published)
                  </div>
                )}
                <Suspense fallback={null}>
                  <VisualEditing />
                </Suspense>
              </>
            )}
          </ClientOnly>
      </ErrorBoundary>
    </body>
  </html>
);
};
