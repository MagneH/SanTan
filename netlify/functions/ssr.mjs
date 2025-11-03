import * as serverMod from '../../apps/frontend/dist/server/entry.mjs';

const fetchFn =
  (serverMod && typeof serverMod.fetch === 'function')
    ? serverMod.fetch
    : (serverMod.default && typeof serverMod.default.fetch === 'function')
      ? serverMod.default.fetch
      : null;

if (!fetchFn) {
  console.warn('[netlify ssr] fetch handler not found in dist/server/entry.mjs');
}

export async function handler(event) {
  if (!fetchFn) {
    return { statusCode: 500, body: 'SSR handler missing' };
  }
  try {
    const req = buildRequest(event);
    const res = await fetchFn(req);
    return await mapResponse(res);
  } catch (e) {
    console.error('[netlify ssr] runtime error', e);
    return { statusCode: 500, headers: { 'content-type': 'text/plain' }, body: 'Internal Server Error' };
  }
}

function buildRequest(event) {
  const { httpMethod, headers = {}, body, isBase64Encoded, path, rawUrl, queryStringParameters } = event;
  const origin = headers.host ? `https://${headers.host}` : 'http://localhost';
  const url = new URL(rawUrl || `${origin}${path}`);
  if (queryStringParameters) {
    for (const [k, v] of Object.entries(queryStringParameters)) {
      if (typeof v === 'string') url.searchParams.set(k, v);
    }
  }
  let requestBody;
  if (body && ['POST','PUT','PATCH','DELETE'].includes(httpMethod.toUpperCase())) {
    requestBody = isBase64Encoded ? Buffer.from(body, 'base64') : body;
  }
  const filtered = { ...headers };
  delete filtered.connection;
  delete filtered['accept-encoding'];
  return new Request(url.toString(), { method: httpMethod, headers: filtered, body: requestBody });
}

async function mapResponse(response) {
  if (!response) {
    return { statusCode: 500, headers: { 'content-type': 'text/plain' }, body: 'No response from SSR' };
  }
  const contentType = response.headers.get('content-type') || '';
  const isBinary = /^(image\/|application\/octet-stream|font\/|audio\/|video\/)/.test(contentType);
  let body;
  let isBase64Encoded = false;
  if (isBinary) {
    body = Buffer.from(await response.arrayBuffer()).toString('base64');
    isBase64Encoded = true;
  } else {
    body = await response.text();
  }
  const headersObj = {};
  for (const [k, v] of response.headers.entries()) headersObj[k] = v;
  if (/text\/html/.test(contentType)) {
    headersObj['cache-control'] = 'public, max-age=0, must-revalidate';
  }
  return { statusCode: response.status, headers: headersObj, body, isBase64Encoded };
}
