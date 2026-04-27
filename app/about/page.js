import Image from 'next/image';

const focusAreas = [
  {
    title: 'School Leadership',
    detail:
      'More than 20 years leading instructional systems, staff development, student support, and day-to-day operations in complex, high-pressure environments.',
  },
  {
    title: 'Educational Technology & AI',
    detail:
      'Builder of AI-supported tools, leadership simulations, and learning systems designed to improve performance in real instructional environments.',
  },
  {
    title: 'Publishing & Thought Leadership',
    detail:
      'Author of multiple books and national publications focused on literacy, instructional design, and applied innovation in education.',
  },
  {
    title: 'Professional Learning',
    detail:
      'Designs and delivers professional learning that moves beyond ideas into execution — helping teams apply strategies in real classrooms and organizations.',
  },
];

export default function AboutPage() {
  return (
    <section className="section section-light">
      <div className="container">
        <h1>About Dr. Rob Furman</h1>
        <p className="lead">
          Dr. Rob Furman is a leadership practitioner, author, and systems builder focused on
          improving how learning and performance operate in real-world environments.
        </p>
        <div className="split-grid top-space about-layout">
          <div>
            <p>
              Across more than two decades, he has led organizations as a principal, school
              administrator, and COO — building and managing systems that drive instruction,
              decision-making, and team performance under real conditions.
            </p>
            <p className="top-space-sm">
              His work sits at the intersection of leadership, instructional design, and
              AI-supported learning. Rather than focusing on theory alone, he designs tools,
              simulations, and professional learning experiences that help people make better
              decisions, communicate more effectively, and perform at a higher level.
            </p>
            <p className="top-space-sm">
              He is an ISTE-published author, national speaker, and developer of simulation-based
              and AI-supported systems used to strengthen teaching, leadership, and learning
              outcomes.
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
