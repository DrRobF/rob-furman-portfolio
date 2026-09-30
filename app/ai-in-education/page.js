import Link from 'next/link';

export const metadata = {
  title: 'AI in Education: A Practical Guide for Teachers and School Leaders | Dr. Rob Furman',
  description:
    'Explore practical AI uses in K–12 education, questions to ask before adopting a tool, and ways teachers and principals can protect student thinking and human judgment.',
  alternates: { canonical: 'https://www.drrobfurman.com/ai-in-education' },
};

const teacherUses = [
  {
    title: 'Plan with a better first draft',
    text: 'Ask AI for several ways to teach a specific objective, then check each idea against your students, materials, time, and standards. The teacher chooses the lesson.',
  },
  {
    title: 'Prepare different supports',
    text: 'Draft examples, vocabulary explanations, or practice at different levels without entering identifiable student information. Review every version for accuracy and dignity.',
  },
  {
    title: 'Give feedback that leads to thinking',
    text: 'Use AI to suggest questions or next steps for a sample response. Students still need to explain, revise, and show what they understand.',
  },
];

const leaderUses = [
  {
    title: 'Prepare, then decide',
    text: 'Use AI to organize questions before a difficult conversation or surface options you may have missed. Verify facts and make the judgment yourself.',
  },
  {
    title: 'Make professional learning useful',
    text: 'Give staff a real instructional problem, time to test an AI-assisted workflow, and a way to critique the result together.',
  },
  {
    title: 'Evaluate a tool before rollout',
    text: 'Ask what learning problem it solves, what data it needs, how teachers stay in control, and how the school will know whether it helped.',
  },
];

export default function AIInEducationPage() {
  return (
    <>
      <section className="section section-dark">
        <div className="container">
          <p className="eyebrow">A guide from a practicing school leader</p>
          <h1>AI in Education: Start With Learning, Then Choose the Tool</h1>
          <p className="lead">
            Artificial intelligence can help teachers prepare and students practice. It can also
            produce convincing mistakes, invite shortcuts, and make a weak assignment faster.
            The useful question is not simply, “Can AI do this?” It is, “Does this use help an
            educator teach or a student think?”
          </p>
          <div className="button-row">
            <Link className="button primary" href="#teachers">For teachers</Link>
            <Link className="button tertiary" href="#leaders">For school leaders</Link>
            <Link className="button tertiary" href="#human-test">Use the Human Test</Link>
          </div>
        </div>
      </section>

      <section className="section section-light" aria-labelledby="what-is-ai">
        <div className="container ai-guide-reading">
          <p className="eyebrow">The starting point</p>
          <h2 id="what-is-ai">What does AI in education actually mean?</h2>
          <p>
            In schools, AI may help generate text, explanations, questions, summaries, or
            recommendations. Those outputs are suggestions to examine, not evidence that a
            student has learned or that a school decision is sound. A teacher might use AI to
            brainstorm a lesson. A principal might use it to prepare for a staff discussion.
            A student might use a guided tool to practice a concept. Each use needs a different
            level of oversight.
          </p>
          <p>
            I work where these choices become real: in classrooms, conversations with families,
            and school leadership. My approach is to use AI to strengthen professional judgment
            and student thinking, while keeping people responsible for the decisions.
          </p>
        </div>
      </section>

      <section className="section section-soft" id="teachers" aria-labelledby="teacher-heading">
        <div className="container">
          <div className="section-intro">
            <p className="eyebrow">Classroom practice</p>
            <h2 id="teacher-heading">How can teachers use AI well?</h2>
            <p>Begin with a teaching task you already understand. Ask AI to offer possibilities, then apply your knowledge of the learners and the goal.</p>
          </div>
          <div className="card-grid three-up">
            {teacherUses.map((use) => (
              <article className="card" key={use.title}>
                <h3>{use.title}</h3>
                <p>{use.text}</p>
              </article>
            ))}
          </div>
          <div className="ai-guide-reading top-space">
            <h3>A classroom example</h3>
            <p>
              Suppose students are learning to explain a claim with evidence. Instead of asking AI
              to write their answers, a teacher can create three sample explanations—one strong,
              one incomplete, one misleading. Students identify what each does well, check the
              evidence, and improve one response. The learning remains in the students’ hands.
            </p>
          </div>
        </div>
      </section>

      <section className="section section-light" id="leaders" aria-labelledby="leader-heading">
        <div className="container">
          <div className="section-intro">
            <p className="eyebrow">School leadership</p>
            <h2 id="leader-heading">How can principals use AI responsibly?</h2>
            <p>Use it to prepare, question, and organize. Keep decisions about people with the people accountable for them.</p>
          </div>
          <div className="card-grid three-up">
            {leaderUses.map((use) => (
              <article className="card" key={use.title}>
                <h3>{use.title}</h3>
                <p>{use.text}</p>
              </article>
            ))}
          </div>
          <div className="ai-guide-reading top-space">
            <h3>Before a difficult decision</h3>
            <p>
              If a teacher asks to move a student because behavior has become difficult, AI could
              help a principal list questions and possible supports. It cannot know the child,
              diagnose the cause, or decide whose classroom should carry the problem. First gather
              the facts, hear the people involved, and build a plan that helps the student and the
              class. The tool can improve preparation; it cannot take responsibility.
            </p>
            <p>
              The <Link href="/human-equation-suite">H.E.L.P. leadership suite</Link> gives
              educators ways to rehearse human decisions under pressure. If you want a practical
              starting resource, explore the{' '}
              <a href="https://drrobfurman.gumroad.com/l/principal_ai_kit?layout=profile" target="_blank" rel="noopener noreferrer">
                Principal AI Starter Kit
              </a>.
            </p>
          </div>
        </div>
      </section>

      <section className="section section-soft" id="human-test" aria-labelledby="test-heading">
        <div className="container ai-guide-reading">
          <p className="eyebrow">A decision filter</p>
          <h2 id="test-heading">The Human Test for AI in schools</h2>
          <p>Before adopting a tool, assignment, or policy, ask four questions:</p>
          <ol className="ai-guide-list">
            <li><strong>Does it deepen learning?</strong> Can students explain and transfer what they learned without the tool?</li>
            <li><strong>Does it strengthen educators?</strong> Does it give teachers useful time or insight while preserving their judgment?</li>
            <li><strong>Does it protect dignity?</strong> Are privacy, access, bias, and the student’s experience taken seriously?</li>
            <li><strong>Does it solve a real human problem?</strong> What improves for a learner, teacher, or family?</li>
          </ol>
          <p>
            A faster output is not automatically a better learning experience. Pilot a use with a
            clear goal, review the results with educators, and stop or revise it if it fails these
            questions.
          </p>
        </div>
      </section>

      <section className="section section-light" aria-labelledby="questions-heading">
        <div className="container ai-guide-reading">
          <p className="eyebrow">Common questions</p>
          <h2 id="questions-heading">Questions educators ask about AI</h2>
          <h3>Can AI replace a teacher?</h3>
          <p>
            It can produce materials and respond to prompts. It cannot carry a teacher’s
            responsibility for relationships, noticing a learner’s needs, choosing a response,
            and judging whether learning happened. The goal is better teaching, not simply more output.
          </p>
          <h3>Should students use AI for assignments?</h3>
          <p>
            That depends on the purpose of the assignment and the school’s rules. Be explicit
            about which parts students must do themselves, which AI supports are allowed, and how
            they will show their thinking. A task meant to assess independent writing needs a
            different rule from a task that asks students to critique AI-generated claims.
          </p>
          <h3>What should a school check before buying an AI tool?</h3>
          <p>
            Start with the learning problem, then examine privacy terms, age suitability,
            accessibility, accuracy, teacher controls, cost, and how success will be measured.
            The U.S. Department of Education’s{' '}
            <a href="https://files.eric.ed.gov/fulltext/ED661924.pdf" target="_blank" rel="noopener noreferrer">
              guidance for education leaders
            </a>{' '}
            provides a deeper planning framework.
          </p>
        </div>
      </section>

      <section className="section cta executive-cta compact-section">
        <div className="container">
          <p className="eyebrow">Put the ideas to work</p>
          <h2>Bring human judgment into your school’s AI conversation.</h2>
          <p>Explore an instructional example, get a starting resource, or plan professional learning for your team.</p>
          <div className="button-row center top-space-sm">
            <Link className="button primary" href="/vic">Explore VIC: Virtual Co-Teacher</Link>
            <Link className="button secondary" href="/speaking">Keynotes and workshops</Link>
            <a className="button secondary" href="https://drrobfurman.gumroad.com/l/principal_ai_kit?layout=profile" target="_blank" rel="noopener noreferrer">Principal AI Starter Kit</a>
          </div>
        </div>
      </section>
    </>
  );
}
