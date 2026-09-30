const baseUrl = 'https://www.drrobfurman.com';

const publicPages = [
  '/',
  '/ai-in-education',
  '/ai-for-teachers',
  '/ai-for-reading',
  '/ai-literacy-for-students',
  '/school-ai-guidance',
  '/speaking',
  '/projects',
  '/publications',
  '/about',
  '/contact',
  '/vic',
  '/human-equation-suite',
  '/human-equation-suite/leadership-sim',
  '/human-equation-suite/urban-student-sim',
  '/simulations',
  '/guitar',
  '/guitar/learn-the-notes',
  '/guitar/caged-shapes',
  '/guitar/caged-solo-zones',
  '/guitar/simple-solos',
  '/guitar/lick-library',
  '/guitar/practice-mode',
  '/guitar/solo-generator',
];

export default function sitemap() {
  return publicPages.map((path) => ({ url: `${baseUrl}${path}` }));
}
