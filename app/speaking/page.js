import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'AI in Education Keynote Speaker & Workshops | Dr. Rob Furman',
  description: 'Invite Dr. Rob Furman for an AI in education keynote or school workshop on human judgment, student learning, and practical AI use for educators.',
  alternates: { canonical: 'https://www.drrobfurman.com/speaking' },
};

const signatureKeynotes = [
  {
    title: 'The Human Test',
    subtitle: 'Leading Schools in the Age of AI',
    detail:
      'AI is entering schools faster than many organizations can think clearly about it. This keynote gives educators a practical test for every tool, policy, and promise: Does it deepen learning, strengthen educators, protect dignity, and solve a real human problem?',
  },
  {
    title: 'What Would You Do?',
    subtitle: 'Leadership Decisions When the Pressure Is Real',
    detail:
      'The audience enters realistic school dilemmas involving staff, students, families, trust, and incomplete information. Rob turns each decision into an unforgettable examination of judgment, communication, accountability, and humanity.',
  },
  {
    title: 'AI That Actually Helps Schools',
    subtitle: 'Strengthen the Learner—Not Just the Assignment',
    detail:
      'A practical, educator-centered examination of AI that guides thinking, preserves productive struggle, expands teacher capacity, and keeps students intellectually responsible for learning.',
  },
];

const audienceOutcomes = [
  'A memorable framework educators can use immediately',
  'Real school scenarios that generate conversation and reflection',
  'Practical language for leading through pressure and change',
  'A responsible, human-centered approach to AI implementation',
  'A keynote experience that can extend into workshops or leadership institutes',
];

export default function SpeakingPage() {
  return (
    <>
      <section className="section section-dark speaking-hero">
        <div className="container split-grid speaking-hero-grid">
          <div>
            <p className="eyebrow">Keynotes for the human side of educational change</p>
            <h1>Put Your Audience Inside the Decisions That Shape Schools</h1>
            <p className="lead">
              Dr. Rob Furman delivers AI in education keynotes and practical workshops for
              schools and conferences, grounded in real school leadership. Educators leave
              with a way to judge whether a tool strengthens learning, teaching, and human
              responsibility.
            </p>
            <div className="button-row">
              <a
                className="button primary"
                href="mailto:Rob@FurmanR.com?subject=Speaking%20Inquiry%20for%20Dr.%20Rob%20Furman"
              >
                Invite Dr. Rob to Speak
              </a>
              <Link className="button tertiary" href="#keynotes">
                View Signature Keynotes
              </Link>
            </div>
          </div>
          <div className="media-card">
            <Image
              src="/images/tedx-umd.jpg"
              alt="Dr. Rob Furman speaking on a TEDx stage"
              width={1600}
              height={900}
              className="section-image keynote-image"
              priority
            />
          </div>
        </div>
      </section>

      <section className="section section-light" id="keynotes">
        <div className="container">
          <div className="section-intro">
            <p className="eyebrow">Signature keynote experiences</p>
            <h2>Big Ideas Grounded in Real School Leadership</h2>
            <p>
              Each program can be tailored for administrators, teachers, school boards, education
              technology audiences, or mixed communities of educators and families.
            </p>
          </div>
          <div className="card-grid three-up top-space">
            {signatureKeynotes.map((keynote) => (
              <article className="card signature-keynote-card" key={keynote.title}>
                <p className="eyebrow">{keynote.subtitle}</p>
                <h3>{keynote.title}</h3>
                <p>{keynote.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-light" aria-labelledby="ai-workshops-heading">
        <div className="container ai-guide-reading">
          <p className="eyebrow">Beyond the keynote</p>
          <h2 id="ai-workshops-heading">AI in Education Workshops for Schools and Districts</h2>
          <p>
            A keynote can start the conversation. A scheduled workshop gives teachers and school
            leaders time to test the ideas against their own work. We can focus on a practical
            classroom task, a first school AI pilot, or the decisions leaders face when a tool
            sounds promising but its effect on learning is unclear.
          </p>
          <ul className="ai-guide-list">
            <li><strong>For teachers:</strong> Try a planning or feedback example, check the output, and keep student thinking visible.</li>
            <li><strong>For leaders:</strong> Use the Human Test to examine privacy, teacher judgment, access, and evidence of learning.</li>
            <li><strong>For teams:</strong> Leave with a small next step and a way to decide whether it helped.</li>
          </ul>
          <p>
            Tell me about your audience and the question your school needs to solve. I can suggest
            a keynote, workshop, or connected session that fits the event.
          </p>
          <Link className="button primary" href="/contact">Discuss an AI workshop or keynote</Link>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container split-grid">
          <div>
            <p className="eyebrow">Why Rob</p>
            <h2>Experience Audiences Can Trust</h2>
            <p className="lead">
              A principal, organizational leader, author, TEDx speaker, and builder of practical
              educational systems—not a commentator observing schools from the outside.
            </p>
            <p className="top-space-sm">
              Rob has presented at national conferences including ISTE, ASCD, NAESP, and AMLE, as
              well as for districts and leadership organizations throughout the United States.
            </p>
          </div>
          <article className="card audience-outcomes-card">
            <h3>What audiences take with them</h3>
            <ul className="clean-list">
              {audienceOutcomes.map((outcome) => (
                <li key={outcome}>{outcome}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="section section-light">
        <div className="container">
          <div className="section-intro">
            <p className="eyebrow">On stage</p>
            <h2>National Presenter and Two-Time TEDx Speaker</h2>
          </div>
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
        </div>
      </section>

      <section className="section cta executive-cta compact-section">
        <div className="container">
          <p className="eyebrow">Start the conversation</p>
          <h2>Give your educators a keynote they will still be discussing on Monday.</h2>
          <p>
            Available for national and regional conferences, district events, leadership
            institutes, professional learning, and education-technology gatherings.
          </p>
          <div className="button-row center top-space-sm">
            <a
              className="button primary"
              href="mailto:Rob@FurmanR.com?subject=Speaking%20Inquiry%20for%20Dr.%20Rob%20Furman"
            >
              Ask About Availability
            </a>
            <Link className="button secondary" href="/contact">
              Contact Dr. Rob
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
