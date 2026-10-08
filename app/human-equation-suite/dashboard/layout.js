import { pageMeta } from '../../lib/seo';

export const metadata = pageMeta({
  title: 'Your H.E.L.P. Leadership Dashboard',
  description: 'Your personal H.E.L.P. evidence profile across the 8 leadership factors.',
  path: '/human-equation-suite/dashboard',
  image: '/images/og/help.png',
  noindex: true,
});

export default function Layout({ children }) {
  return children;
}
