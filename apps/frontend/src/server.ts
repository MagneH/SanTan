// src/server.ts
import { createStart } from '@tanstack/react-start';
import { getRouter } from './router';

console.log('[server.ts] init TanStack Start SSR');

const app = createStart({ getRouter });

export default app;

// Export fetch handler for Netlify Functions
export async function fetch(request: Request): Promise<Response> {
  return app.fetch(request);
}
