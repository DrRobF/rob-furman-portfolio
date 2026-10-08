import { pageMeta } from '../../../lib/seo';
import FactorModulePage from '../FactorModulePage';
import { factorModules } from '../courseModel';

export const metadata = pageMeta({
  title: 'Trust Construction: Leading Under Pressure | Free H.E.L.P. Course Module',
  description: 'A free module for principals and teachers on trust construction: what pressure changes, real school scenarios, reflection prompts, and recovery moves.',
  path: '/human-equation-suite/course/trust-construction',
  image: '/images/og/help.png',
});

export default function Page() {
  return <FactorModulePage module={factorModules.trustConstruction} />;
}
