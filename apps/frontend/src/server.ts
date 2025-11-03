// src/server.ts
import { createStart } from '@tanstack/react-start';
import { getRouter } from './router';

console.log('[server.ts] init TanStack Start SSR');

const app = createStart({ getRouter });

// Export default with fetch property for Netlify Functions
export default {
  fetch: async (request: Request): Promise<Response> => {
    // TanStack Start app is the handler itself
    if (typeof app === 'function') {
      return app(request);
    }

    // If app has a fetch method, use it
    if (app && typeof app === 'object' && 'fetch' in app && typeof app.fetch === 'function') {
      return app.fetch(request);
    }

    // Fallback error
    throw new Error('TanStack Start handler not callable');
  }
};
