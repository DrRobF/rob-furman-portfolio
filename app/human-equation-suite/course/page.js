'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import HumanEquationNav from '../../components/HumanEquationNav';
import { factorCatalog, factorModules, readCourseEvidence } from './courseModel';
import HelpJourneyNav from '../../components/HelpJourneyNav';

export default function CourseLanding() {
  const [course, setCourse] = useState(null);
  useEffect(()=>{ setCourse(readCourseEvidence()); },[]);
  const completed = course?.completedFactors || 0;

  return <section className='section help-suite-page help-suite-internal help-page-dark'><div className='container'><div className='help-suite-nav-wrap'><HumanEquationNav /></div>
    <article className='hes-awareness-hero help-suite-hero top-space-sm'><p className='eyebrow'>The 8 Factors Course</p><h1>The 8 Factors Course</h1><h2>Premium leadership practice: pressure psychology, reflection calibration, and recovery rehearsal.</h2></article><HelpJourneyNav currentStep='factors' explanation='This is where you build the shared language behind your dashboard evidence before applying it in live pressure.' primaryAction={{ label: 'Apply This in a Simulation', href: '/simulation-overview' }} secondaryAction={{ label: 'Return to Dashboard', href: '/human-equation-suite/dashboard' }} showDashboardReturn />
    <section className='top-space-sm card help-suite-panel'><h2>Factor progress</h2><p><strong>Completion status:</strong> {completed}/8 completed.</p><div className='hes-factor-grid compact'>{factorCatalog.map((f,idx)=>{const m=factorModules[f.key]; const isDone=course?.factorEvidence?.[f.key]?.completed; const accentMap={regulation:'#4da9ff',humanAwareness:'#2ad4c8',trustConstruction:'#ffc165',realityAnchoring:'#ff8a72',grayAreaLeadership:'#a78bfa',teamSystemsLeadership:'#22d3a6',instructionalLeadership:'#f59e0b',visionChangeLeadership:'#fb7185'}; return <article key={f.key} className='hes-factor-panel compact' style={{'--factor-accent':accentMap[f.key]||'#4da9ff'}}><h3>{idx+1}. {f.label}</h3><p><em>{m.quote}</em></p><p><strong>Pressure effect:</strong> {m.pressureShift}</p><p><strong>Trains:</strong> {m.moduleTrains}</p><p><strong>Status:</strong> {isDone?'Completed':'In progress'}</p><Link className='button secondary' href={`/human-equation-suite/course/${f.slug}`}>{isDone?'Review':'Launch / Continue'}</Link></article>;})}</div></section>
  </div></section>;
}
