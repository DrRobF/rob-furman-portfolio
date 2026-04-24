import Image from 'next/image';

const speakingAreas = [
  {
    title: 'TEDx speaking',
    detail:
      'Presentations focused on educational transformation, literacy, and future-ready learning systems.',
  },
  {
    title: 'Keynote presentations',
    detail:
      'Conference and district keynotes for principals, leadership teams, and educator audiences.',
  },
  {
    title: 'Professional development workshops',
    detail:
      'Action-oriented sessions on implementation planning, instructional systems, and technology integration.',
  },
  {
    title: 'AI and instructional innovation sessions',
    detail:
      'Practical frameworks for responsible AI adoption that support teachers, leaders, and learners.',
  },
  {
    title: 'Future-ready learning and technology adoption',
    detail:
      'Strategic support for schools building sustainable, people-centered innovation plans.',
  },
];

export default function SpeakingPage() {
  return (
    <section className="section section-light">
      <div className="container">
        <h1>Speaking</h1>
        <p className="lead">
          Dr. Rob Furman is a TEDx speaker and keynote presenter focused on instructional leadership,
          educational innovation, AI-enabled learning, and practical implementation for schools and
          organizations.
        </p>
        <div className="card-grid two-up top-space">
          <div className="media-card">
            <Image
              src="/images/tedx-umd.jpg"
              alt="Dr. Rob Furman speaking at TEDx University of Maryland"
              width={1600}
              height={900}
              className="section-image tedx-image"
            />
          </div>
          <div className="media-card">
            <Image
              src="/images/tedx-prime.jpg"
              alt="Dr. Rob Furman speaking at TEDx PRIME"
              width={1600}
              height={900}
              className="section-image tedx-image"
            />
          </div>
        </div>

        <div className="card-grid top-space">
          {speakingAreas.map((area) => (
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
