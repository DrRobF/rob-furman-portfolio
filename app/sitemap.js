const baseUrl = 'https://www.drrobfurman.com';

const publicPages = [
  '/',
  '/ai-in-education',
  '/articles',
  '/articles/ai-teaching-change',
  '/articles/ai-independent-reading',
  '/articles/teachers-using-ai-school-guidance',
  '/ai-for-teachers',
  '/ai-for-reading',
  '/ai-literacy-for-students',
  '/school-ai-guidance',
  '/resources',
  '/resources/teacher-directed-ai-prompts',
  '/resources/what-would-you-do',
  '/resources/principal-ai-starter-kit',
  '/resources/difficult-conversations-prep-kit',
  '/resources/music-ai-creativity-bundle',
  '/speaking',
  '/projects',
  '/publications',
  '/privacy-policy',
  '/about',
  '/contact',
  '/vic',
  '/human-equation-suite',
  '/human-equation-suite/leadership-sim',
  '/human-equation-suite/urban-student-sim',
  '/guitar',
  '/guitar/learn-the-notes',
  '/guitar/caged-solo-zones',
  '/guitar/lick-library',
];

export default function sitemap() {
  return publicPages.map((path) => ({ url: `${baseUrl}${path}` }));
}
