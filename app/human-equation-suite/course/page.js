'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import HumanEquationNav from '../../components/HumanEquationNav';
import { factorCatalog, readCourseEvidence } from './courseModel';

export default function CourseLanding() {
  const [course, setCourse] = useState(null);
  useEffect(()=>{ setCourse(readCourseEvidence()); },[]);
  const completed = course?.completedFactors || 0;
  return <section className='section section-light'><div className='container'><HumanEquationNav />
    <article className='hes-awareness-hero top-space-sm'><p className='eyebrow'>The 8 Factors Course</p><h1>The 8 Factors Course</h1><h2>A guided leadership psychology course that teaches how pressure changes interpretation, trust, judgment, and follow-through.</h2><p>Premium executive learning pathway: short lessons, live calibration, and evidence synced to your dashboard.</p></article>
    <section className='top-space-sm card'><h2>Recommended order</h2><ol><li>Dashboard</li><li>Leadership Diagnostic</li><li>8 Factors Course</li><li>Parent Call Rehearsal</li><li>School Leadership Simulation</li><li>Urban Student Perspective Simulation</li><li>Cumulative Human Equation Profile</li></ol><p>Course can be taken before or after diagnostic. Recommended full path: Diagnostic → 8 Factors Course → Simulations → Dashboard Review.</p></section>
    <section className='top-space-sm card'><h2>Factor progress</h2><p><strong>Completion status:</strong> {completed}/8 completed.</p><div className='hes-factor-grid compact'>{factorCatalog.map((f,idx)=><article key={f.key} className='hes-factor-panel compact'><h3>{idx+1}. {f.label}</h3><p>Status: {course?.factorEvidence?.[f.key]?.completed?'Completed':course ? 'In progress':'Not started'}</p><Link className='button secondary' href={`/human-equation-suite/course/${f.slug}`}>{course?.factorEvidence?.[f.key]?.completed?'Review Module':'Begin Module'}</Link></article>)}</div></section>
    <section className='top-space-sm card'><h2>Course calibration evidence</h2><p>Every module contributes learning/calibration evidence, not simulation evidence. Your reflection, interaction patterns, and recovery moves feed factor development in the dashboard.</p><div className='button-row'><Link className='button primary' href={completed?`/human-equation-suite/course/${factorCatalog.find((f)=>!course?.factorEvidence?.[f.key]?.completed)?.slug || 'human-awareness'}`:'/human-equation-suite/course/human-awareness'}>{completed?'Resume Course':'Begin Course'}</Link><Link className='button secondary' href='/human-equation-suite/dashboard'>Back to Dashboard</Link></div></section>
  </div></section>;
}
