import { pageMeta } from '../../lib/seo';

export const metadata = pageMeta({
  title: 'Leadership Pressure Diagnostic | Free Self-Assessment for Principals',
  description: 'Find out how pressure changes your leadership. A free diagnostic for school leaders that maps your growth edges across the 8 H.E.L.P. factors.',
  path: '/human-equation-suite/diagnostic',
  image: '/images/og/help.png',
});

export default function Layout({ children }) {
  return children;
}
