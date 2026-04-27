import Image from 'next/image';

const speakingAreas = [
  {
    title: 'Keynote Speaking',
    detail:
      'Keynotes for conferences, districts, and leadership teams focused on instructional leadership, innovation, and the future of learning.',
  },
  {
    title: 'Leadership and Instructional Systems',
    detail:
      'Sessions focused on building effective school systems, improving instructional practice, and leading under real-world conditions.',
  },
  {
    title: 'AI in Education',
    detail:
      'Practical sessions on AI integration in schools, including instructional use, system design, and responsible implementation.',
  },
  {
    title: 'Professional Learning and Workshops',
    detail:
      'Action-oriented sessions designed to support teachers and leaders in applying strategies immediately in classrooms and schools.',
  },
];

export default function SpeakingPage() {
  return (
    <section className="section section-light">
      <div className="container">
        <h1>Speaking</h1>
        <p className="lead">
          Dr. Rob Furman is a national speaker and keynote presenter with experience across major
          education conferences including ISTE, ASCD, NAESP, and AMLE. His work focuses on
          instructional leadership, AI in education, and practical systems that schools can actually
          implement.
        </p>
        <p className="top-space-sm">
          Delivered presentations and keynotes across national and regional conferences, districts,
          and leadership organizations throughout the United States.
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
