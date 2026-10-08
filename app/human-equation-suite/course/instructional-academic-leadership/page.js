import { pageMeta } from '../../../lib/seo';
import FactorModulePage from '../FactorModulePage';
import { factorModules } from '../courseModel';

export const metadata = pageMeta({
  title: 'Instructional & Academic Leadership: Leading Under Pressure | Free H.E.L.P. Course Module',
  description: 'A free module for principals and teachers on instructional & academic leadership: what pressure changes, real school scenarios, reflection prompts, and recovery moves.',
  path: '/human-equation-suite/course/instructional-academic-leadership',
  image: '/images/og/help.png',
});

export default function Page() {
  return <FactorModulePage module={factorModules.instructionalAcademicLeadership} />;
}
