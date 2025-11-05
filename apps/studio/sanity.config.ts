import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { presentationTool } from 'sanity/presentation';
import { structureTool } from 'sanity/structure';

import { projectDetails } from './projectDetails';
import { fullSlugPublishAction } from './src/actions/fullSlugPublishAction';
import { resolve } from './src/presentation/resolve';
import { schemaTypes } from './src/schemaTypes';
import { defaultDocumentNode, structure } from './src/structure';

const slugAwareTypes = ['category', 'post'];

// Get frontend URL from environment
const getFrontendUrl = () => {
  const normalizeUrl = (url: string) => {
    if (!url) return url;
    // If protocol missing, default to http://
    if (!/^https?:\/\//i.test(url)) {
      return `http://${url}`;
    }
    return url;
  };

  // Try to get runtime value from window (for future extensibility)
  if (typeof window !== 'undefined' && (window as any).__FRONTEND_URL__) {
    return normalizeUrl((window as any).__FRONTEND_URL__);
  }

  // Production: Check for explicit environment variable first
  // This should be set for real production deployments with custom domains
  const envVar = (typeof import.meta !== 'undefined' && import.meta.env?.SANITY_STUDIO_FRONTEND_URL)
    ? import.meta.env.SANITY_STUDIO_FRONTEND_URL
    : (typeof process !== 'undefined' ? process.env?.SANITY_STUDIO_FRONTEND_URL : undefined);
  if (envVar) {
    return normalizeUrl(envVar);
  }

  // Preview deployments (Cloud Run PR previews): Infer Frontend URL from Studio URL pattern
  // This only works for our PR preview pattern: santan-studio-pr-X vs santan-frontend-pr-X
  if (typeof window !== 'undefined' && window.location.hostname.includes('run.app')) {
    const studioHostname = window.location.hostname;

    // Only infer if it matches our preview pattern
    if (studioHostname.includes('santan-studio-pr-')) {
      const frontendHostname = studioHostname.replace('santan-studio-pr-', 'santan-frontend-pr-');
      return normalizeUrl(`${window.location.protocol}//${frontendHostname}`);
    }

    // If it's on run.app but not preview pattern, it's likely a different deployment
    // Fall through to use explicit config (should be set via env var)
    console.warn(
      'Studio running on Cloud Run without SANITY_STUDIO_FRONTEND_URL set and no preview pattern detected. ' +
        'Please set SANITY_STUDIO_FRONTEND_URL environment variable.',
    );
  }

  // Default to localhost for development
  return 'http://localhost:3000';
};

const frontendUrl = getFrontendUrl();

// Allowed origins for CORS
const allowedOrigins = [
  'http://localhost:*', // Development
  frontendUrl, // Production frontend
];

export default defineConfig({
  name: 'default',
  title: 'Santan Studio',

  projectId: projectDetails().projectId,
  dataset: projectDetails().dataset,
  apiVersion: projectDetails().apiVersion,
  document: {
    actions: (prev: any, context: any) =>
      slugAwareTypes.includes(context.schemaType)
        ? prev.map((a: any) => (a.action === 'publish' ? fullSlugPublishAction(a) : a))
        : prev,
  },

  plugins: [
    structureTool({ structure, defaultDocumentNode }),
    visionTool(),
    presentationTool({
      resolve,
      previewUrl: {
        initial: frontendUrl,
        previewMode: {
          enable: `${frontendUrl}/api/preview`,
        },
      },
      allowOrigins: allowedOrigins,
    }),
  ],

  schema: {
    types: schemaTypes,
  },
});
