import server from '../apps/frontend/.output/server/index.mjs';

function collectCandidates(mod) {
  const funcs = [];
  if (mod) {
    if (typeof mod.fetch === 'function') funcs.push({ name: 'server.fetch', fn: mod.fetch });
    if (typeof mod.localFetch === 'function') funcs.push({ name: 'server.localFetch', fn: mod.localFetch });
    if (typeof mod.handler === 'function') funcs.push({ name: 'server.handler', fn: mod.handler });
    if (typeof mod === 'function') funcs.push({ name: 'defaultFunction', fn: mod });
  }
  return funcs;
}

console.log('Type of default export:', typeof server);
console.log('Known keys:', Object.keys(server || {}));

const candidates = collectCandidates(server);
if (!candidates.length) {
  console.log('Ingen mulige SSR handlers funnet.');
  process.exit(0);
}

(async () => {
  for (const { name, fn } of candidates) {
    try {
      const req = new Request('http://localhost/');
      const res = await fn(req);
      if (!(res instanceof Response)) {
        console.log(`[${name}] returnerte ikke en Response (type: ${typeof res}). Hopper.`);
        continue;
      }
      const ct = res.headers.get('content-type') || 'ukjent';
      const text = await res.text();
      console.log(`\n=== Handler: ${name} ===`);
      console.log('Status:', res.status);
      console.log('Content-Type:', ct);
      console.log('Length:', text.length);
      console.log('Preview:', text.slice(0, 400));
      // Stop etter første vellykkede HTML
      if (/text\/html/.test(ct) && text.length > 50) {
        console.log(`\nValgt SSR handler: ${name}`);
        break;
      }
    } catch (e) {
      console.log(`Feil ved kall av ${name}:`, e);
    }
  }
})();
