// Canonical hostname: www.<domein> → <domein>, met behoud van pad en query.
// Domein-agnostisch, zodat dit blijft werken als de definitieve naam nog
// wijzigt (zie fase 0 / P1 van het uitvoeringsplan).

export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.hostname.startsWith('www.')) {
    url.hostname = url.hostname.slice(4);
    url.protocol = 'https:';
    return Response.redirect(url.toString(), 301);
  }
  return context.next();
}
