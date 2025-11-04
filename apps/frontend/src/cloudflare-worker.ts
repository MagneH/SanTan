// Cloudflare Workers adapter for TanStack Start SSR
// This wraps the Netlify function to work with Cloudflare Workers runtime

import * as netlifyHandler from './.netlify/v1/functions/server.mjs';

export default {
  async fetch(request, env, ctx) {
    // Netlify functions expect { request, context }
    // Cloudflare Workers provide { request, env, ctx }

    // Create Netlify-compatible context
    const context = {
      request,
      env, // Pass env variables to handler
      waitUntil: ctx.waitUntil.bind(ctx),
    };

    // Call Netlify handler
    const response = await netlifyHandler.default(request, context);

    return response;
  },
};

