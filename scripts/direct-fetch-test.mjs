import handler from '@tanstack/react-start/server-entry';

(async () => {
  const req = new Request('http://localhost/');
  try {
    const res = await handler.fetch(req, { context: { request: req } });
    const text = await res.text();
    console.log('[direct-fetch] status:', res.status, 'length:', text.length);
    console.log(text.slice(0,400));
  } catch (e) {
    console.error('[direct-fetch] error:', e);
  }
})();

