import Image from 'next/image';

const speakingAreas = [
  {
    title: 'Keynote Speaking',
    detail:
      'Keynotes designed to challenge thinking and drive action — focused on leadership, performance, and the future of learning in complex environments.',
  },
  {
    title: 'Leadership and Instructional Systems',
    detail:
      'Sessions focused on improving how schools operate — including decision-making, communication, instructional systems, and leadership under pressure.',
  },
  {
    title: 'AI in Education',
    detail:
      'Practical sessions on using AI to support instruction, improve efficiency, and expand learning capacity in real classroom environments.',
  },
  {
    title: 'Professional Learning and Workshops',
    detail:
      'Hands-on sessions that move beyond ideas into implementation — giving educators and leaders tools they can apply immediately.',
  },
];

export default function SpeakingPage() {
  return (
    <section className="section section-light">
      <div className="container">
        <h1>Speaking</h1>
        <p className="lead">
          Dr. Rob Furman delivers keynotes and professional learning experiences focused on
          improving performance in real-world educational environments.
        </p>
        <p className="top-space-sm">
          With a background as a principal, organizational leader, and systems builder, his
          sessions go beyond theory — helping leaders and educators make better decisions,
          strengthen communication, and apply ideas immediately in their work.
        </p>
        <p className="top-space-sm">
          Delivered presentations across national conferences including ISTE, ASCD, NAESP, and
          AMLE, as well as districts and leadership organizations throughout the United States.
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
        <p className="top-space-sm">
          Available for keynotes, district professional learning, leadership development, and
          consulting engagements.
        </p>
      </div>
    </section>
  );
}
