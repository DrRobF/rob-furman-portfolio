import Image from 'next/image';
import Link from 'next/link';
import styles from '../resources.module.css';

const title = 'Teacher Directed AI Prompts Across Subjects';
const url = 'https://www.drrobfurman.com/resources/teacher-directed-ai-prompts';
export const metadata = {
  title: `${title} | Dr. Rob Furman`,
  description: 'Six teacher-directed AI prompts, 36 adaptations across six subjects, student handouts, and a review rubric for grades 6–12. Preview the pack and try a free sample.',
  alternates: { canonical: url },
  openGraph: { title, url, images: [{ url: 'https://www.drrobfurman.com/products/teacher-prompts-cover.svg', width: 1280, height: 720, alt: title }] },
};
const prompts = ['Challenge my argument', 'Question my evidence', 'Find the flaw', 'Compare approaches', 'Ask like an expert', 'Help me reflect'];
const sample = 'I am a student in [grade and subject]. My assignment is [task], and my argument is [paste my own draft or explanation]. Help me examine it without rewriting it. Offer one reasonable counterargument and ask one question about my evidence. Wait for my response before continuing. Do not invent facts, sources, or quotations. If I disagree, ask me to explain why. After three exchanges, ask me to write my own decision about what I will keep or change.';
export default function TeacherPromptsPage() {
  return <>
    <section className={styles.detailHero}><div className="container">
      <nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/resources">Resources</Link><span aria-hidden="true">/</span><span>Teacher directed AI prompts</span></nav>
      <div className={styles.detailLayout}>
        <div className={styles.detailImageWrap}><Image src="/products/teacher-prompts-cover.svg" alt="Teacher Directed AI Prompts Across Subjects: six prompts and 36 subject adaptations" width={1280} height={720} className={styles.detailImage} priority /></div>
        <div className={styles.detailInfo}>
          <p className={styles.eyebrow}>AI for teaching and student thinking</p><h1>{title}</h1>
          <p className={styles.detailLead}>Give AI a useful job in your assignment while students practice explaining, questioning, and revising their own thinking.</p>
          <p className={styles.audience}>Designed primarily for grades 6–12 · ELA, mathematics, science, social studies, music, and visual art</p>
          <div className={styles.purchaseBox}>
            <div><span>Editable teaching resource</span></div>
            <a className={styles.primaryButton} href="mailto:Rob@FurmanR.com?subject=Teacher%20Directed%20AI%20Prompts%20inquiry">Ask about the prompt pack</a>
            <small>Online checkout is coming soon. Ask about individual classroom or school access, or try the free sample below.</small>
          </div>
        </div>
      </div>
    </div></section>
    <section className={styles.detailContent}><div className="container"><div className={styles.detailColumns}>
      <div className={styles.detailStory}>
        <p className={styles.eyebrow}>The idea</p><h2>Start with a student's own thinking</h2>
        <p>Choose a familiar assignment and a clear learning goal. Students make their first attempt, use a teacher-provided prompt to examine it, check the challenge, and explain what they changed or defended. A student who rejects an AI suggestion with good reasons may be doing excellent work.</p>
        <h2>Six prompts with a purpose</h2><ul>{prompts.map((prompt) => <li key={prompt}>{prompt}</li>)}</ul>
        <h2>What is inside the pack</h2><ul>
          <li>An 18-page printable PDF, editable Word master, and copyable text version</li>
          <li>A teacher quick start and shared setup to pair with each complete prompt</li>
          <li>Six complete prompts with learning goals, teacher checks, and evidence students share</li>
          <li>36 adaptations: six for each of ELA, mathematics, science, social studies, music, and visual art</li>
          <li>A student assignment handout and reflection and decision record</li>
          <li>An illustrative worked mathematics example and editable teacher review rubric</li>
        </ul>
        <div className={styles.pilotFeature} id="free-sample">
          <p className={styles.eyebrow}>Try a free sample</p><h2>Challenge an argument</h2>
          <p>Replace the brackets, use a school-approved tool, and preview the interaction yourself before assigning it.</p>
          <blockquote><p>{sample}</p></blockquote>
          <p><strong>Look for:</strong> a supported response to a counterargument and a student's explanation of what they kept or changed.</p>
          <Link className={styles.featureLink} href="/articles/ai-teaching-change">Read the article and try two more free prompts →</Link>
        </div>
        <h2>One assignment is enough to begin</h2><p>Keep the initial work, relevant conversation, final response, and a brief student-written reflection. Use them to discuss the learning process. A prompt or transcript alone does not prove authorship.</p>
      </div>
      <aside className={styles.detailAside}>
        <h3>Classroom use</h3><p>A single educator may edit the materials and share the assignment and reflection sheets with their own students. Contact Dr. Rob for school or district use.</p>
        <p>Use school-approved tools and follow their account and age requirements. Keep names and private records out of pasted work. Prompts guide the interaction; preview the tool and check its claims.</p>
        <Link className={styles.relatedLink} href="/ai-for-teachers">Explore the free AI for Teachers guide →</Link>
        <p className={styles.contactLine}>Want your staff to practice together? <Link href="/speaking">Explore workshops and keynotes</Link>.</p>
      </aside>
    </div></div></section>
  </>;
}
