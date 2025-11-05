import { handler as netlifyHandler } from '../netlify/functions/ssr.mjs';
import serverMod from '../apps/frontend/.output/server/index.mjs';

function listServerKeys() {
  try {
    console.log('[inspect] typeof default export:', typeof serverMod);
    if (serverMod && typeof serverMod === 'object') {
      console.log('[inspect] keys:', Object.keys(serverMod));
    }
  } catch (e) {
    console.log('[inspect] error listing keys', e);
  }
}

function buildEvent(path = '/') {
  return {
    httpMethod: 'GET',
    headers: { host: 'localhost' },
    path,
    rawUrl: `http://localhost${path}`,
    body: null,
    isBase64Encoded: false,
    queryStringParameters: {},
  };
}

async function testNetlifyFunction() {
  const event = buildEvent('/');
  const res = await netlifyHandler(event);
  console.log('[netlify-fn] status:', res.statusCode);
  console.log('[netlify-fn] content-type:', res.headers?.['content-type']);
  console.log('[netlify-fn] body length:', res.body?.length);
  const preview = res.isBase64Encoded ? Buffer.from(res.body, 'base64').toString('utf8').slice(0,400) : res.body?.slice(0,400);
  console.log('[netlify-fn] preview:\n', preview);
  if (!/<!doctype html|<html/i.test(preview || '')) {
    console.warn('[netlify-fn] HTML signature not detected');
  }
}

async function testDirectServer() {
  const candidates = [];
  if (serverMod) {
    if (typeof serverMod.fetch === 'function') candidates.push({ name: 'fetch', fn: serverMod.fetch });
    if (typeof serverMod.localFetch === 'function') candidates.push({ name: 'localFetch', fn: serverMod.localFetch });
    if (typeof serverMod.handler === 'function') candidates.push({ name: 'handler', fn: serverMod.handler });
    if (typeof serverMod === 'function') candidates.push({ name: 'defaultFunction', fn: serverMod });
  }
  if (!candidates.length) {
    console.log('[direct] No candidates found');
    return;
  }
  for (const c of candidates) {
    try {
      const req = new Request('http://localhost/');
      const res = await c.fn(req);
      if (!(res instanceof Response)) {
        console.log(`[direct] ${c.name} did not return a Response`);
        continue;
      }
      const text = await res.text();
      console.log(`[direct] ${c.name} status:`, res.status, 'len:', text.length);
      console.log('[direct] preview:\n', text.slice(0,300));
    } catch (e) {
      console.log(`[direct] error calling ${c.name}`, e);
    }
  }
}

(async () => {
  listServerKeys();
  await testDirectServer();
  await testNetlifyFunction();
})();
