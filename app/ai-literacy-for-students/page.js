import Link from 'next/link';

export const metadata = {
  title: 'AI Literacy for Students: A Classroom Lesson and Use Agreement | Dr. Rob Furman',
  description: 'Teach students to question AI output, verify evidence, disclose assistance, and keep their own thinking visible. Includes a 40-minute lesson and adaptable class agreement.',
  alternates: { canonical: 'https://www.drrobfurman.com/ai-literacy-for-students' },
};

const habits = [
  ['Ask what it knows', 'An AI response may sound certain even when it is wrong or missing context. What source would let you check it?'],
  ['Find the missing voices', 'Whose experience or perspective is absent? Who might be affected by the answer?'],
  ['Show your process', 'Name where AI helped and show the thinking, sources, drafts, or revisions you did yourself.'],
  ['Protect people', 'Do not put a classmate’s private information, images, or work into a tool without permission and school approval.'],
];

export default function AILiteracyPage() {
  return <>
    <section className="section section-dark"><div className="container">
      <p className="eyebrow">Free classroom resource</p><h1>AI Literacy for Students: Teach Them to Question the Answer</h1>
      <p className="lead">Students need more than a list of forbidden tools. They need practice spotting errors, checking sources, and explaining what work is their own. Here is a short lesson and an agreement you can adapt to your school’s rules.</p>
      <div className="button-row"><Link className="button primary" href="#lesson">Use the lesson</Link><Link className="button tertiary" href="#agreement">Adapt the agreement</Link></div>
    </div></section>

    <section className="section section-light"><div className="container ai-guide-reading">
      <p className="eyebrow">Four habits</p><h2>What does AI literacy look like in class?</h2>
      <p>A student can ask a useful question, test an output against evidence, notice whose needs it overlooks, and explain what assistance they used. These habits matter whether the answer comes from a chatbot, a search summary, or an AI feature inside another product.</p>
      <ul className="ai-guide-list">{habits.map(([title, description]) => <li key={title}><strong>{title}:</strong> {description}</li>)}</ul>
      <p>For younger students, a teacher can demonstrate with a projected example and no student accounts. Older students can compare outputs under the school’s approved tool and age rules.</p>
    </div></section>

    <section className="section section-soft" id="lesson"><div className="container ai-guide-reading">
      <p className="eyebrow">Ready to teach</p><h2>A 40-minute AI literacy lesson: “Sounds right” is not evidence</h2>
      <p><strong>Objective:</strong> Students evaluate a generated answer using a trustworthy classroom source and explain one correction. The teacher prepares the sample; students do not need AI accounts.</p>
      <ol className="ai-guide-list">
        <li><strong>Prepare:</strong> Select a familiar topic and a short source, such as a science text or primary document. Write a plausible AI-style paragraph with two true statements, one unsupported statement, and one invented citation. Label it as a practice example you created.</li>
        <li><strong>0–5 minutes:</strong> Ask, “Which sentence sounds most convincing? What would prove it?” Gather answers without confirming them.</li>
        <li><strong>5–15 minutes:</strong> Students annotate the paragraph in pairs: verified, contradicted, or not established by the source. They mark the citation for checking too.</li>
        <li><strong>15–25 minutes:</strong> Give students the source. They locate evidence and rewrite one sentence accurately, or state that the source cannot settle it.</li>
        <li><strong>25–35 minutes:</strong> Discuss how an invented citation can look real. Ask who would be harmed if the unverified claim were repeated.</li>
        <li><strong>35–40 minutes:</strong> Exit ticket: “I would check ___ before using this answer because ___.”</li>
      </ol>
      <p><strong>Assess:</strong> Look for a specific source-based correction and a clear explanation. The goal is a checking habit, not memorizing a list of AI failures.</p>
    </div></section>

    <section className="section section-light" id="agreement"><div className="container ai-guide-reading">
      <p className="eyebrow">Adaptable classroom text</p><h2>A simple student AI use agreement</h2>
      <p>Use these statements as a discussion draft. Match the final version to your school’s policy, approved tools, and the age of your students.</p>
      <div className="card ai-guide-card"><ol className="ai-guide-list">
        <li>I will follow my teacher’s directions about when AI is allowed for each assignment.</li>
        <li>I will do the thinking and skill practice the assignment is meant to assess.</li>
        <li>I will check important facts, quotations, and citations against real sources.</li>
        <li>I will describe how I used AI when my teacher asks, including what I changed or rejected.</li>
        <li>I will protect my own and other people’s private information.</li>
        <li>When I am unsure, I will ask before using a tool.</li>
      </ol></div>
      <p><strong>Teacher note:</strong> Define “allowed” for each task. “You may brainstorm questions” is clearer than a blanket “AI is okay.” Let students demonstrate learning in ways that make their process visible.</p>
    </div></section>

    <section className="section section-soft"><div className="container ai-guide-reading">
      <h2>Go deeper</h2>
      <p>UNESCO’s <a href="https://www.unesco.org/en/articles/ai-competency-framework-students" target="_blank" rel="noopener noreferrer">AI competency framework for students</a> provides a broader view of student knowledge, skills, and values. See also the <Link href="/ai-for-teachers">teacher workflows</Link>, the <Link href="/school-ai-guidance">school guidance starter</Link>, and the <Link href="/ai-in-education">main AI in Education guide</Link>.</p>
    </div></section>
  </>;
}
