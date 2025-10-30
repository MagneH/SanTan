import { sealData, unsealData } from 'iron-session';
import { env } from '@/lib/env';

export const PREVIEW_SESSION_NAME = '__preview';

// Session data type
type SessionData = {
  projectId?: string;
};

// Iron session options
const sessionOptions = {
  password: env.SANITY_SESSION_SECRET,
  ttl: 60 * 60 * 24 * 7, // 1 week
};

export async function getSession(request: Request): Promise<SessionData> {
  const cookies = request.headers.get('cookie');

  if (!cookies) return {};

  const cookieParts = cookies
    .split(';')
    .find((c) => c.trim().startsWith(`${PREVIEW_SESSION_NAME}=`))
    ?.split('=');

  if (!cookieParts || cookieParts.length < 2) {
    return {};
  }

  // Join back in case the value contains '=' characters
  const cookieValue = cookieParts.slice(1).join('=');
  if (!cookieValue) return {};

  try {
    const sessionData = await unsealData<SessionData>(decodeURIComponent(cookieValue), sessionOptions);
    return sessionData;
  } catch (error) {
    console.error('[Session] Failed to unseal session:', error);
    return {};
  }
}

export async function commitSession(value: SessionData): Promise<string> {
  const sealed = await sealData(value, sessionOptions);
  // Note: HttpOnly is removed to allow client-side preview mode detection
  // This is safe because the cookie only contains an encrypted session token for preview mode
  // SameSite=None with Secure allows the cookie to work in cross-origin iframes (Sanity Studio)
  const cookieString = `${PREVIEW_SESSION_NAME}=${encodeURIComponent(sealed)}; SameSite=None; Secure; Path=/; Max-Age=${sessionOptions.ttl}`;

  return cookieString;
}

export function destroySession(): string {
  return `${PREVIEW_SESSION_NAME}=; HttpOnly; SameSite=None; Secure; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}
