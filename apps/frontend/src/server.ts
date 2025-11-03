// src/server.ts
import { createStart } from '@tanstack/react-start';
import { getRouter } from './router';

console.log('[server.ts] init TanStack Start SSR');

const app = createStart({ getRouter });

export default app;

// Export fetch handler for Netlify Functions
// TanStack Start's createStart returns a handler that can be called directly
export async function fetch(request: Request): Promise<Response> {
  // The app itself is the handler
  if (typeof app === 'function') {
    return app(request);
  }

  // Fallback: try to find fetch method
  if (app && typeof app === 'object' && 'handler' in app && typeof app.handler === 'function') {
    return app.handler(request);
  }

  throw new Error('TanStack Start handler not found or not callable');
}
