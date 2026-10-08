// Builds complete per-page metadata so every page gets its own search title,
// description, canonical URL, and link-preview card (Facebook, LinkedIn, texts, X).
const SITE_URL = 'https://www.drrobfurman.com';
const SITE_NAME = 'Dr. Rob Furman';
const DEFAULT_IMAGE = '/images/og/home.png';

export function pageMeta({ title, description, path, image = DEFAULT_IMAGE, noindex = false }) {
  const url = `${SITE_URL}${path}`;
  const images = [{ url: image, width: 1200, height: 630, alt: title }];
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: SITE_NAME, type: 'website', images },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
