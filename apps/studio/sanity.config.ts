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
        initial: 'http://localhost:3000',
        previewMode: {
          enable: 'http://localhost:3000/api/preview',
        },
      },
      allowOrigins: ['http://localhost:*'],
    }),
  ],

  schema: {
    types: schemaTypes,
  },
});
