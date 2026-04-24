import Image from 'next/image';

const focusAreas = [
  {
    title: 'Instructional leadership',
    detail:
      'Leads systems-level instructional improvement anchored in coherence, equity, and measurable student impact.',
  },
  {
    title: 'School administration',
    detail:
      'Former principal and school administrator with experience in operations, culture, staffing, and data-informed decision structures.',
  },
  {
    title: 'Professional learning',
    detail:
      'Designs and facilitates professional development that supports implementation, coaching, and sustained practice change.',
  },
  {
    title: 'AI + learning systems',
    detail:
      'Builds practical AI tools, simulations, and instructional supports that fit real school workflows and priorities.',
  },
];

export default function AboutPage() {
  return (
    <section className="section section-light">
      <div className="container">
        <h1>About Dr. Rob Furman</h1>
        <p className="lead">
          Dr. Rob Furman holds an Ed.D. in Instructional Leadership and brings more than 20 years in
          education as a principal, school administrator, instructional leader, author, and speaker.
        </p>
        <div className="split-grid top-space about-layout">
          <div>
            <p>
              Across his career, he has led instructional systems, school improvement strategy,
              professional development, and technology adoption initiatives that strengthen teaching
              quality and student outcomes.
            </p>
            <p className="top-space-sm">
              He is an ISTE published author and TEDx speaker known for translating future-ready ideas
              into practical action for schools, districts, and leadership teams.
            </p>
            <p className="top-space-sm">
              His current work blends school leadership expertise with instructional design, AI-enabled
              learning tools, interactive simulations, and scalable learning systems that help
              educators implement innovation with confidence.
            </p>
          </div>
          <div className="media-card">
            <Image
              src="/images/headshot-gray.jpg"
              alt="Dr. Rob Furman professional biography portrait"
              width={900}
              height={1100}
              className="section-image about-image"
            />
          </div>
        </div>
        <div className="card-grid top-space">
          {focusAreas.map((area) => (
            <article className="card" key={area.title}>
              <h3>{area.title}</h3>
              <p>{area.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
