import Link from 'next/link';

export const metadata = {
  title: 'AI for Teachers: Classroom Uses, Prompts, and a Lesson Example | Dr. Rob Furman',
  description: 'A practical K–12 guide to using AI for lesson planning, differentiation, feedback, and student thinking, with copyable prompts and a classroom example.',
  alternates: { canonical: 'https://www.drrobfurman.com/ai-for-teachers' },
};

const workflows = [
  {
    title: 'Plan three approaches to one objective',
    prompt: 'I teach [grade/subject]. My objective is [objective]. Suggest three different ways to teach it in [time] minutes using [available materials]. For each, show what students will do, how I will check understanding, and one likely misconception. Do not invent standards or cite sources you have not checked.',
    check: 'Choose the approach that fits your actual students; confirm any standard and test the examples yourself.',
  },
  {
    title: 'Make a practice set worth discussing',
    prompt: 'Create four short practice items for [skill] at [grade level]: one straightforward, two with common misconceptions, and one transfer task. Include a separate answer key explaining the reasoning. Avoid personal student information.',
    check: 'Solve every item before students see it. Revise difficulty and wording for your class.',
  },
  {
    title: 'Prepare supports without lowering the goal',
    prompt: 'For this learning goal [goal], suggest a vocabulary preview, a worked example, and three guiding questions. Keep the same core thinking task for all students. Explain what each support helps a learner do.',
    check: 'Check accessibility, reading load, and whether the support preserves the intended thinking.',
  },
  {
    title: 'Turn feedback into a next step',
    prompt: 'Here is a fictional sample response to [assignment]: [invented response]. Identify one strength, one misconception, and two questions that would help the student revise. Do not write the revised answer for the student.',
    check: 'Use a fictional or de-identified example. Read the student’s real work yourself before giving feedback.',
  },
];

export default function AIForTeachersPage() {
  return <>
    <section className="section section-dark"><div className="container">
      <p className="eyebrow">Free classroom guide</p>
      <h1>AI for Teachers: Save Preparation Time, Keep the Thinking Human</h1>
      <p className="lead">The best classroom use of AI begins with a learning goal, not a tool. Below are four workflows you can try, copyable starting prompts, and a complete example you can adapt tomorrow.</p>
      <div className="button-row"><Link className="button primary" href="#prompts">Try the prompts</Link><Link className="button tertiary" href="#lesson">See a lesson example</Link></div>
    </div></section>

    <section className="section section-light"><div className="container ai-guide-reading">
      <p className="eyebrow">First principles</p><h2>What should a teacher use AI for?</h2>
      <p>Use it to generate options you can inspect: lesson structures, examples, practice questions, explanations, and feedback questions. Do not treat a fluent answer as a correct one. You know the curriculum, the children, and the purpose of the task; the tool does not.</p>
      <p>Before using any student-facing tool, follow your school’s approval and privacy rules. Keep identifiable student information out of general-purpose prompts unless your school has specifically approved that use. Check facts, representations, reading level, and accessibility before sharing an output.</p>
    </div></section>

    <section className="section section-soft" id="prompts"><div className="container">
      <div className="section-intro"><p className="eyebrow">Copy and adapt</p><h2>Four AI prompts for teachers</h2><p>Replace the bracketed details. These prompts request drafts and questions, leaving the instructional decision with you.</p></div>
      <div className="ai-guide-stack">{workflows.map((item, index) => <article className="card ai-guide-card" key={item.title}>
        <p className="eyebrow">Workflow {index + 1}</p><h3>{item.title}</h3><p className="ai-prompt">{item.prompt}</p><p><strong>Your check:</strong> {item.check}</p>
      </article>)}</div>
    </div></section>

    <section className="section section-light" id="lesson"><div className="container ai-guide-reading">
      <p className="eyebrow">A classroom example</p><h2>A 30-minute lesson: critique an AI answer</h2>
      <p><strong>Learning goal:</strong> Students support a claim with accurate evidence and explain the link between the two. This example can work in science, history, or reading with a teacher-selected source.</p>
      <ol className="ai-guide-list">
        <li><strong>Before class:</strong> Choose a short source students can read. Create or generate a sample claim and explanation that contains one unsupported statement. Verify the source and plant the flaw deliberately.</li>
        <li><strong>Minutes 0–5:</strong> Students read the source and underline two pieces of evidence. They make an initial judgment before seeing the AI sample.</li>
        <li><strong>Minutes 5–15:</strong> Show the sample. In pairs, students label each claim as supported, unsupported, or unclear and point to the source.</li>
        <li><strong>Minutes 15–25:</strong> Students revise the explanation in their own words. Ask what evidence changed their mind.</li>
        <li><strong>Minutes 25–30:</strong> Collect a brief exit response: “What did the answer sound sure about that the source did not prove?”</li>
      </ol>
      <p>Students do not need their own AI accounts for this lesson. The assessment is their evidence-based explanation, not the polished text the model produced.</p>
    </div></section>

    <section className="section section-soft"><div className="container ai-guide-reading">
      <p className="eyebrow">Quick decision</p><h2>When should you skip AI?</h2>
      <p>Skip it when the task is meant to reveal a student’s independent thinking, when a direct conversation would serve a child better, or when you cannot verify the material in time. A blank page, a productive struggle, and a teacher’s observation can all be more valuable than a generated answer.</p>
      <h3>Further reading</h3>
      <p>UNESCO’s <a href="https://www.unesco.org/en/articles/ai-competency-framework-teachers" target="_blank" rel="noopener noreferrer">AI competency framework for teachers</a> organizes the knowledge, skills, and values educators need. The <a href="https://files.eric.ed.gov/fulltext/ED661924.pdf" target="_blank" rel="noopener noreferrer">U.S. Department of Education’s leadership toolkit</a> offers a broader school planning framework.</p>
    </div></section>

    <section className="section section-light"><div className="container ai-guide-reading">
      <h2>Keep learning</h2><p>Help children build literacy and a reading life with <Link href="/ai-for-reading">AI for Reading</Link>. Teach students to question AI output with the <Link href="/ai-literacy-for-students">AI literacy lesson</Link>, or return to the <Link href="/ai-in-education">AI in Education guide</Link>. School leaders can use the <Link href="/school-ai-guidance">school AI guidance starter</Link> to set clear boundaries for staff and students.</p>
      <p>If your team wants to practice these decisions together, see <Link href="/speaking">keynotes and scheduled workshops</Link>.</p>
    </div></section>
  </>;
}
