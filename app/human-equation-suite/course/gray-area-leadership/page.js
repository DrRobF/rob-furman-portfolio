import { pageMeta } from '../../../lib/seo';
import FactorModulePage from '../FactorModulePage';
import { factorModules } from '../courseModel';

export const metadata = pageMeta({
  title: 'Gray Area Leadership: Leading Under Pressure | Free H.E.L.P. Course Module',
  description: 'A free module for principals and teachers on gray area leadership: what pressure changes, real school scenarios, reflection prompts, and recovery moves.',
  path: '/human-equation-suite/course/gray-area-leadership',
  image: '/images/og/help.png',
});

export default function Page() {
  return <FactorModulePage module={factorModules.grayAreaLeadership} />;
}
