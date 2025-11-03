// src/server.ts
import handler from '@tanstack/react-start/server-entry';
import { config } from 'dotenv'; //
import { sanityLoaderServer } from '@/functions/sanity.loader.server.ts';
import { securityHeaders } from '@/middleware/security.ts';

type MyRequestContext = {
  request: Request;
};

declare module '@tanstack/react-start' {
  interface Register {
    server: {
      requestContext: MyRequestContext;
    };
  }
}

config();

export default {
  async fetch(request: Request) {
    sanityLoaderServer();

    // Apply security headers middleware
    return await securityHeaders({
      request,
      next: async () => await handler.fetch(request, { context: { request } }),
    });
  },
};
