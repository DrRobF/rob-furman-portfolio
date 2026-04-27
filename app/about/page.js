import Image from 'next/image';

const focusAreas = [
  {
    title: 'School Leadership',
    detail:
      'More than 20 years of experience leading instructional systems, school improvement, staff development, student support, and day-to-day school operations.',
  },
  {
    title: 'Educational Technology & AI',
    detail:
      'Builder of practical AI-supported tools, leadership simulations, and learning systems designed for real school workflows and classroom use.',
  },
  {
    title: 'Publishing & Thought Leadership',
    detail:
      'Author of multiple education books and national articles focused on literacy, technology integration, future-ready learning, and practical school innovation.',
  },
  {
    title: 'Professional Learning',
    detail:
      'Designs and delivers professional learning experiences that help educators move from big ideas to implementation, coaching, and sustained practice change.',
  },
];

export default function AboutPage() {
  return (
    <section className="section section-light">
      <div className="container">
        <h1>About Dr. Rob Furman</h1>
        <p className="lead">
          Dr. Rob Furman is an educational leader, author, speaker, and builder of practical learning
          systems for schools. Across more than two decades in education, he has served as a
          principal, school administrator, COO, adjunct faculty member, music educator, and
          instructional technology leader.
        </p>
        <div className="split-grid top-space about-layout">
          <div>
            <p>
              His work sits at the intersection of school leadership, instructional design,
              educational technology, and AI-supported learning. Rather than treating innovation as
              theory, Rob focuses on building tools, simulations, and professional learning
              experiences that help educators make better decisions in real school conditions.
            </p>
            <p className="top-space-sm">
              He has published multiple books with the International Society for Technology in
              Education, presented nationally across major education conferences, developed virtual
              and simulation-based learning environments, and now builds AI-supported systems
              designed to strengthen teaching, leadership, and student support.
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
