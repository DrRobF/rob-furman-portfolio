export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/beyondthefoodreview/cards'] },
    sitemap: 'https://www.drrobfurman.com/sitemap.xml',
  };
}
