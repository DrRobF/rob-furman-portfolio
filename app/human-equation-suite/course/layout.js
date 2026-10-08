import { pageMeta } from '../../lib/seo';

export const metadata = pageMeta({
  title: 'The 8 Factors of Leadership Under Pressure | Free Course for School Leaders',
  description: 'A free course for principals and teachers on the 8 factors that shape leadership under pressure, from regulation and trust to gray-area decisions.',
  path: '/human-equation-suite/course',
  image: '/images/og/help.png',
});

export default function Layout({ children }) {
  return children;
}
