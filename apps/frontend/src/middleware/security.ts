// Security middleware for TanStack Start

export const securityHeaders = async ({ next }: { request: Request; next: () => Promise<Response> }) => {
  const response = await next();

  // Allow embedding in Sanity Studio for preview mode
  const studioUrl = process.env.VITE_SANITY_STUDIO_URL || 'http://localhost:3333';
  const studioOrigin = new URL(studioUrl).origin;

  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:", // unsafe-eval needed for React dev, blob: for workers
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: https://cdn.sanity.io blob:",
      "font-src 'self' data: https://fonts.gstatic.com",
      "connect-src 'self' https://*.sanity.io wss://*.sanity.io ws://localhost:*",
      "worker-src 'self' blob:", // Allow web workers from blob URLs
      `frame-ancestors 'self' ${studioOrigin}`, // Allow Sanity Studio to embed the app
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  );

  // Don't set X-Frame-Options when we want to allow specific origins
  // X-Frame-Options: ALLOW-FROM is deprecated and not supported in modern browsers
  // We rely on CSP frame-ancestors instead
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // XSS Protection (legacy browsers)
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions Policy
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), payment=()');

  return response;
};
