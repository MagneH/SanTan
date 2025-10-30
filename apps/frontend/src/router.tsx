import { ErrorComponent, createRouter } from '@tanstack/react-router';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';
import * as TanstackQuery from './integrations/tanstack-query/root-provider';

// Import the generated route tree
import { routeTree } from './routeTree.gen';

// Create a new router instance
export const getRouter = () => {
  const rqContext = TanstackQuery.getContext();

  const router = createRouter({
    routeTree,
    context: { ...rqContext, request: null },
    defaultPreload: 'intent',
    defaultPendingMs: 0, // Show pending state immediately during navigation
    defaultPendingMinMs: 100, // Keep pending state for at least 100ms to avoid flashing
    defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
    scrollRestoration: true,
    defaultViewTransition: {
      types: ({ fromLocation, toLocation }) => {
        let direction = 'none';

        if (fromLocation) {
          const fromIndex = fromLocation.state.__TSR_index;
          const toIndex = toLocation.state.__TSR_index;

          direction = fromIndex > toIndex ? 'right' : 'left';
        }

        return [`slide-${direction}`];
      },
    },
    Wrap: (props: { children: React.ReactNode }) => {
      return <TanstackQuery.Provider {...rqContext}>{props.children}</TanstackQuery.Provider>;
    },
  });

  setupRouterSsrQueryIntegration({ router, queryClient: rqContext.queryClient });

  return router;
};
