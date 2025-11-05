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
  // Try to get runtime value from window (for future extensibility)
  if (typeof window !== 'undefined' && (window as any).__FRONTEND_URL__) {
    return (window as any).__FRONTEND_URL__;
  }

  // In production (Cloud Run), infer Frontend URL from Studio URL pattern
  if (typeof window !== 'undefined' && window.location.hostname.includes('run.app')) {
    // Studio URL pattern: santan-studio-pr-X-xxxxx.europe-west1.run.app
    // Frontend URL pattern: santan-frontend-pr-X-xxxxx.europe-west1.run.app
    const studioHostname = window.location.hostname;
    const frontendHostname = studioHostname.replace('santan-studio-pr-', 'santan-frontend-pr-');
    return `${window.location.protocol}//${frontendHostname}`;
  }

  // Studio runs in browser via Vite, so use import.meta.env for build-time config
  if (typeof import.meta !== 'undefined' && import.meta.env?.SANITY_STUDIO_FRONTEND_URL) {
    return import.meta.env.SANITY_STUDIO_FRONTEND_URL;
  }

  // Fallback to process.env (for build-time context)
  if (typeof process !== 'undefined' && process.env?.SANITY_STUDIO_FRONTEND_URL) {
    return process.env.SANITY_STUDIO_FRONTEND_URL;
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
    actions: (prev, context) =>
      slugAwareTypes.includes(context.schemaType)
        ? prev.map((a) => (a.action === 'publish' ? fullSlugPublishAction(a) : a))
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
