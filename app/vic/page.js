import Image from 'next/image';
import Link from 'next/link';

const VIC_URL = 'https://askvic.ai';

export default function VicPage() {
  return (
    <section className="section section-light">
      <div className="container">
        <h1>VIC: Virtual Co-Teacher</h1>
        <p className="lead">
          VIC is an AI-supported instructional system designed to work alongside educators and school
          leaders, extending instructional capacity while staying aligned to learning goals.
        </p>
        <div className="split-grid top-space">
          <div>
            <p>
              Built by a former principal with deep instructional leadership experience, VIC reflects
              real school priorities: quality instruction, clear supports, useful data, and practical
              adoption by teachers.
            </p>
            <p className="top-space-sm">
              It is intentionally designed as a co-teacher framework rather than a standalone
              chatbot, supporting classroom practice, intervention planning, and professional
              learning.
            </p>
            <Link href={VIC_URL} className="button primary top-space-sm" target="_blank" rel="noreferrer">
              Try VIC
            </Link>
          </div>
          <div className="media-card">
            <Image
              src="/images/headshot-blue.jpg"
              alt="Dr. Rob Furman discussing VIC, an AI-supported virtual co-teacher"
              width={900}
              height={1100}
              className="section-image about-image"
            />
          </div>
        </div>
        <div className="card-grid top-space">
          <article className="card">
            <h3>Guided instruction</h3>
            <p>Step-by-step support that reinforces lesson goals, pacing, and instructional sequencing.</p>
          </article>
          <article className="card">
            <h3>Student support</h3>
            <p>On-demand explanations, prompts, and scaffolds that strengthen persistence and confidence.</p>
          </article>
          <article className="card">
            <h3>Teacher reports</h3>
            <p>Actionable snapshots of student progress, misconceptions, and response patterns.</p>
          </article>
          <article className="card">
            <h3>Differentiated help</h3>
            <p>Adaptive pathways for varied readiness levels, language needs, and learning profiles.</p>
          </article>
          <article className="card">
            <h3>School-system alignment</h3>
            <p>Supports technology adoption and professional development goals led by instructional leaders.</p>
          </article>
        </div>
      </div>
    </section>
  );
}
