import Link from 'next/link';

export const metadata = {
  title: 'School AI Guidance: A Practical Starting Plan for Principals | Dr. Rob Furman',
  description: 'A principal’s starter plan for school AI guidance: classroom rules, tool review questions, family communication, staff practice, and a 30-day rollout.',
  alternates: { canonical: 'https://www.drrobfurman.com/school-ai-guidance' },
};

const decisions = [
  ['Purpose', 'Which learning or operational problem will this use solve? What would improvement look like?'],
  ['People', 'Who can use it, at what age, and with whose supervision? Who remains responsible for the result?'],
  ['Data', 'What information enters the tool, who can access it, how is it retained, and what do our agreements allow?'],
  ['Learning', 'What thinking must students show independently? How will teachers know the tool helped learning?'],
  ['Equity', 'Can all students participate without needing a paid account, a personal device, or home internet?'],
  ['Review', 'Who approves a pilot, hears concerns, and decides whether to revise or stop it?'],
];

export default function SchoolAIGuidancePage() {
  return <>
    <section className="section section-dark"><div className="container">
      <p className="eyebrow">Free school leadership guide</p><h1>School AI Guidance: Start With Decisions, Then Write the Rules</h1>
      <p className="lead">A school does not need a perfect 50-page policy to start a responsible conversation. It needs clear decisions about learning, privacy, access, human review, and what teachers and students may do today.</p>
      <div className="button-row"><Link className="button primary" href="#first-month">Plan the first month</Link><Link className="button tertiary" href="#questions">Review a tool</Link></div>
    </div></section>

    <section className="section section-light"><div className="container ai-guide-reading">
      <p className="eyebrow">A principal’s starting point</p><h2>Give staff usable guidance, not just a warning</h2>
      <p>Teachers need to know which tools are approved, what information they may enter, how student work may use AI, and who to ask when an edge case appears. Families need to know how the school protects learning and student information. Students need assignment-level clarity.</p>
      <p>Local rules, contracts, and laws vary. Have the appropriate district, school, privacy, and legal leaders review formal policy and vendor terms. The framework below is a planning aid, not a ready-to-adopt policy.</p>
    </div></section>

    <section className="section section-soft" id="questions"><div className="container">
      <div className="section-intro"><p className="eyebrow">Before any rollout</p><h2>Six questions to answer about an AI use</h2></div>
      <div className="card-grid three-up">{decisions.map(([title, question]) => <article className="card" key={title}><h3>{title}</h3><p>{question}</p></article>)}</div>
      <div className="ai-guide-reading top-space"><p>Write down the answers for each proposed use. A tool that saves preparation time may still be unsuitable for student accounts or sensitive records. A promising pilot can stay teacher-led until the school has evaluated its student-facing use.</p></div>
    </div></section>

    <section className="section section-light" id="first-month"><div className="container ai-guide-reading">
      <p className="eyebrow">A manageable sequence</p><h2>A 30-day start for a school team</h2>
      <ol className="ai-guide-list">
        <li><strong>Week 1 — listen and inventory:</strong> Ask teachers how AI already appears in planning and student work. List current tools and agreements. Collect the questions families and students are asking.</li>
        <li><strong>Week 2 — set interim boundaries:</strong> Name approved tools and uses, prohibited data, adult review expectations, and whom staff should contact. Give teachers language for what is allowed on each assignment.</li>
        <li><strong>Week 3 — practice together:</strong> Have staff test one real classroom task, check the output, and discuss where student thinking could be lost. Try the <Link href="/ai-for-teachers">teacher prompts</Link> or the <Link href="/ai-literacy-for-students">student literacy lesson</Link>.</li>
        <li><strong>Week 4 — pilot and revise:</strong> Choose one limited use with a clear learning measure. Gather student work, staff feedback, access concerns, and family questions. Revise the guidance before expanding.</li>
      </ol>
      <p><strong>Useful measure:</strong> Did the use improve the quality of student explanation or free teacher time for feedback? Count more than logins and generated pages.</p>
    </div></section>

    <section className="section section-soft"><div className="container ai-guide-reading">
      <p className="eyebrow">Language to adapt</p><h2>A short message to families</h2>
      <div className="card ai-guide-card"><p>“Our school is reviewing how AI tools can support teaching and learning. Teachers remain responsible for instructional decisions, and students will be asked to show their own thinking. We will tell families which student tools are approved, how information is protected, and how to raise a concern. We will pilot carefully, listen, and adjust.”</p></div>
      <p>Fill in the actual approved-tool list and contact route before sending. Do not claim a tool is safe or approved until your team has checked it.</p>
    </div></section>

    <section className="section section-light"><div className="container ai-guide-reading">
      <h2>Sources and next steps</h2>
      <p>The U.S. Department of Education’s <a href="https://files.eric.ed.gov/fulltext/ED661924.pdf" target="_blank" rel="noopener noreferrer">education leaders’ AI toolkit</a> examines privacy, access, evidence, and other planning issues in depth. NIST’s <a href="https://www.nist.gov/itl/ai-risk-management-framework" target="_blank" rel="noopener noreferrer">AI Risk Management Framework</a> is a broader voluntary framework for thinking about risk. These sources inform the questions here; this page is Dr. Furman’s practical starting sequence.</p>
      <p>Return to the <Link href="/ai-in-education">AI in Education guide</Link>. For a staff conversation or scheduled workshop, explore <Link href="/speaking">speaking opportunities</Link>.</p>
    </div></section>
  </>;
}
