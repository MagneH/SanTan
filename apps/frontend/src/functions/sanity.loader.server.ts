import { createClient } from '@sanity/client';
import { loadQuery } from '@sanity/react-loader';
import { setServerClient } from '@/sanity/sanity.loader.ts';

export const sanityLoaderServer = () => {
  // On server-side, use non-VITE prefixed env vars (VITE_ prefix only works client-side)
  const client = createClient({
    projectId: process.env.SANITY_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET || process.env.VITE_SANITY_DATASET,
    useCdn: true,
    apiVersion: process.env.SANITY_API_VERSION || process.env.VITE_SANITY_API_VERSION,
    token: process.env.SANITY_READ_TOKEN,
    stega: {
      enabled: true,
      studioUrl: process.env.SANITY_STUDIO_URL || process.env.VITE_SANITY_STUDIO_URL || 'http://localhost:3333',
    },
  });
  setServerClient(client);
  return loadQuery;
};
