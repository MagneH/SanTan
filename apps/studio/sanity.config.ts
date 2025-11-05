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
  // In production, use environment variable
  const productionUrl = process.env.SANITY_STUDIO_FRONTEND_URL;
  if (productionUrl) {
    return productionUrl;
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
