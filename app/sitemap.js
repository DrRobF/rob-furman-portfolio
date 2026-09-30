const baseUrl = 'https://www.drrobfurman.com';

const publicPages = [
  '/',
  '/ai-in-education',
  '/speaking',
  '/projects',
  '/publications',
  '/about',
  '/contact',
  '/vic',
  '/human-equation-suite',
  '/human-equation-suite/leadership-sim',
  '/human-equation-suite/urban-student-sim',
];

export default function sitemap() {
  return publicPages.map((path) => ({ url: `${baseUrl}${path}` }));
}
