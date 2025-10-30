import { createQueryStore } from '@sanity/react-loader';

// Use these in withPreviewData to fetch data in preview mode (client side)
const {
  // Used only server side
  setServerClient,
  // Used only client side
  useLiveMode,
  useQuery,
} = createQueryStore({ client: false, ssr: true });

export { setServerClient, useLiveMode, useQuery };
