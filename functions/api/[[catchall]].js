// Cloudflare Pages Function — server-side proxy naar de OCD-API op Railway.
//
// Waarom een proxy en niet rechtstreeks vanuit de browser:
//   1. OCD_API_KEY_PUBLIC blijft server-side (staat nooit in de HTML)
//   2. Cloudflare-edge in het pad → DDoS-bescherming + WAF
//   3. Same-origin vanuit de browser, dus geen CORS-configuratie nodig
//
// Whitelist: alleen de paden die dit register gebruikt. Zonder whitelist is
// dit een open proxy op de hele OCD-API.
//
// Caching: uitsluitend via `Cache-Control` response-headers. Bewust GEEN
// `caches.default.put` en geen `cf: { cacheTtl }` — die twee lagen zijn niet
// via zone-Purge-Everything te legen, waardoor een foute response uren blijft
// hangen (geleerd op omgevingsvergunningenregister.nl, 2026-06-01).

const UPSTREAM = 'https://ocd-api-production.up.railway.app';

const ALLOWED_PREFIXES = [
  '/health',
  '/v1/gezagen',
  '/v1/register',
  '/v1/regelingen/zoek',
  '/v1/viewer/filter-options',
  '/v1/viewer/regeling',
  '/v1/viewer/wro',
];

export async function onRequest({ request, env, params }) {
  const segments = Array.isArray(params.catchall) ? params.catchall : [params.catchall];
  const upstreamPath = '/' + segments.join('/');

  const isAllowed = ALLOWED_PREFIXES.some(
    (p) => upstreamPath === p || upstreamPath.startsWith(p + '/')
  );
  if (!isAllowed) {
    return new Response('Not Found', { status: 404 });
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const url = new URL(request.url);
  const upstreamReq = new Request(UPSTREAM + upstreamPath + url.search, request);
  upstreamReq.headers.set('X-Api-Key', env.OCD_API_KEY_PUBLIC || '');
  upstreamReq.headers.delete('host');
  upstreamReq.headers.delete('cookie');

  const response = await fetch(upstreamReq);

  // Alleen geslaagde GET's cachen. Een fout antwoord mag niet blijven plakken.
  if (request.method === 'GET' && response.ok) {
    const headers = new Headers(response.headers);
    // browser 5 min · CDN 24 u — bij een data-update: Purge Everything.
    headers.set('Cache-Control', 'public, max-age=300, s-maxage=86400');
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  return response;
}
