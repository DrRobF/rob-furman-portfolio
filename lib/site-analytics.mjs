export const productionHosts = ['www.drrobfurman.com', 'drrobfurman.com'];

export function pageEvent(path) {
  if (path === '/resources') return 'store_view';
  if (path.startsWith('/resources/')) return 'product_view';
  if (path.startsWith('/articles/')) return 'article_view';
  if (path === '/speaking') return 'speaking_view';
  if (path === '/contact') return 'contact_view';
  return null;
}

export function linkEvent(href, currentUrl) {
  let destination;
  try { destination = new URL(href, currentUrl); } catch { return null; }
  const current = new URL(currentUrl);
  if (destination.hostname === 'drrobfurman.gumroad.com' && destination.pathname.startsWith('/l/')) {
    return 'gumroad_checkout_click';
  }
  if (destination.protocol === 'mailto:' && destination.pathname.toLowerCase() === 'rob@furmanr.com') {
    return current.pathname === '/speaking' ? 'speaking_email_click' : 'contact_email_click';
  }
  if (!productionHosts.includes(destination.hostname)) return null;
  if (destination.pathname === '/contact' && current.pathname === '/speaking') return 'speaking_contact_click';
  return null;
}

export function trafficSource(search, referrer) {
  const source = new URLSearchParams(search).get('utm_source')?.toLowerCase();
  const known = ['linkedin', 'facebook', 'instagram', 'youtube', 'tiktok', 'x', 'twitter', 'buffer', 'metricool'];
  if (known.includes(source)) return source === 'twitter' ? 'x' : source;
  if (!referrer) return 'direct_or_unattributed';
  let host;
  try { host = new URL(referrer).hostname; } catch { return 'direct_or_unattributed'; }
  if (productionHosts.includes(host)) return 'internal';
  for (const name of ['linkedin', 'facebook', 'instagram', 'youtube', 'tiktok', 'google', 'bing']) {
    if (host === `${name}.com` || host.endsWith(`.${name}.com`)) return name;
  }
  if (['t.co', 'x.com', 'twitter.com'].includes(host)) return 'x';
  return 'other_referral';
}
