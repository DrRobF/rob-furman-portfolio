import Link from 'next/link';
import Image from 'next/image';
import styles from '../articles.module.css';

const title = "How to Use AI for Differentiated Instruction Without Losing the Learning Goal";
const url = "https://www.drrobfurman.com/articles/ai-differentiated-instruction";
const cover = "https://www.drrobfurman.com/images/articles/ai-differentiated-instruction.webp";
export const metadata = {
  title: "AI for Differentiated Instruction: A Practical Teacher Guide | Dr. Rob Furman",
  description: "Use AI to adapt a lesson with different supports while preserving the learning goal. Includes a fraction example and a copyable teacher prompt.",
  alternates: { canonical: url },
  openGraph: { type: 'article', title, description: "Use AI to adapt a lesson with different supports while preserving the learning goal. Includes a fraction example and a copyable teacher prompt.", url, publishedTime: '2026-10-21', images: [{ url: cover, width: 1729, height: 910, alt: "Magazine illustration of a teacher and students comparing visual supports, with the headline One Goal More Ways In" }] },
  twitter: { card: 'summary_large_image', title, description: "Use AI to adapt a lesson with different supports while preserving the learning goal. Includes a fraction example and a copyable teacher prompt.", images: [cover] },
};

export default function ArticlePage() {
  const structuredData = {
    '@context': 'https://schema.org', '@type': 'BlogPosting', headline: title,
    description: metadata.description, datePublished: '2026-10-21', dateModified: '2026-10-21', image: cover,
    author: { '@type': 'Person', name: 'Dr. Rob Furman', url: 'https://www.drrobfurman.com/about' },
    mainEntityOfPage: url,
  };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
    <header className={styles.hero}><div className={`container ${styles.article}`}>
      <Link className={styles.back} href="/articles">← All articles</Link>
      <p className="eyebrow">AI &amp; differentiated instruction</p><h1>{title}</h1>
      <p className={styles.meta}>By Dr. Rob Furman · <time dateTime="2026-10-21">October 21, 2026</time></p>
      <div className={styles.coverWrap}><Image className={styles.coverImage} src="/images/articles/ai-differentiated-instruction.webp" alt="Magazine illustration of a teacher and students comparing visual supports, with the headline One Goal More Ways In" width={1729} height={910} sizes="(max-width: 800px) 100vw, 800px" priority /></div>
    </div></header>
    <article className="section section-light"><div className={`container ${styles.article} ${styles.body}`}>
<p>A worksheet often aims at the middle of the class. Some students can begin immediately. Others need help getting into the task. A few are ready for something that asks more of them.</p>
<p>Teachers know this. Preparing several useful versions is where the time goes.</p>
<p>That is one of the jobs I would give AI. Let it help prepare the alternatives while the teacher decides what students need to learn and what support will help them get there.</p>
<p>The important part is to watch what changes. An easier-looking page is not automatically a better fit for a child. If the new version removes the thinking you wanted students to practice, you may have changed the lesson&#x27;s purpose without meaning to.</p>
<h2>Start with the learning you want to see</h2>
<p>Before asking for different versions, write the objective plainly. What should students be able to explain, demonstrate, or do?</p>
<p>Suppose the objective is to compare fractions and justify the comparison. The job is more than choosing the larger number. Students need to show why their comparison makes sense.</p>
<p>Now there is something specific to preserve as AI helps you change the materials.</p>
<p>Include the verified standard, the original task, the time available, and the materials you have. Describe learning needs without including student names or private records. Use a tool approved for your school and your purpose.</p>
<h2>Change the way students enter the task</h2>
<p>Imagine two identical trays. One has three-fourths of its cornbread left. The other has two-thirds left. Which has more?</p>
<p>One student might need equal-size rectangle outlines already divided into twelve parts. Another can draw a model independently. A student ready for an extension might compare a second pair and explain why the size of the whole matters.</p>
<p>Those students can work toward the same core idea using different supports. You can still finish with a common check that asks each student to compare fractions and explain the reasoning.</p>
<p>The supported version should not quietly become &quot;color these pieces while everyone else explains.&quot; Students who need help also need a chance to do the important thinking.</p>
<p>Sometimes a student does need a different objective as part of an individual instructional plan. That is a decision for the educator and the appropriate school team. It should not happen accidentally because a chatbot generated an easier worksheet.</p>
<h2>Give AI a more useful request</h2>
<p>Here is a prompt to adapt:</p>
<blockquote className={styles.prompt}><p>Use this objective and task: [paste]. Create a supported version, a core version, and an extension. Keep the same core learning goal and success criteria. Change the scaffolds, access, or depth of reasoning. Supply the actual student directions and questions, a teacher answer guide, and one common independent check. Explain any assumption. If a version changes the objective, flag that change instead of presenting it as equivalent. Grade, subject, time, and materials: [add details].</p></blockquote>
<p>Then read the output as the teacher. Solve the questions. Check the facts. Ask whether the support helps a student think or simply does the thinking for them.</p>
<p>A good instruction can guide the tool, but it cannot guarantee the result.</p>
<h2>Keep the groups flexible</h2>
<p>I would be careful about turning AI&#x27;s versions into permanent labels for children. A student may need a model for this task and be ready for a different challenge tomorrow.</p>
<p>Offer support based on what you observe. Watch for the point when it can be reduced. Listen to explanations rather than assuming a polished page tells you what a child understands.</p>
<p>The same principle works beyond math. A reading task might include a chunked passage and a sentence starter while still asking for an inference supported by evidence. A science task might offer a recording grid while still asking students to interpret their own observations.</p>
<h2>Use the time to teach</h2>
<p>AI can produce several pages quickly. The opportunity is what that preparation gives the teacher room to do: talk with a small group, notice a misconception, or find an example that connects with a student&#x27;s interests.</p>
<p>Start with one task. Prepare the alternatives, check them, and see how students respond. Keep what helps and change what does not.</p>
<p>The teacher knows the learning goal. AI can help prepare more ways for students to reach it.</p>
      <div className={styles.callout}>
        <h2>Put the idea to work</h2>
        <p>Want help creating or refreshing your own lesson? <a href="https://www.askvic.ai/lessonplan" target="_blank" rel="noopener noreferrer">Open the Ask VIC Lesson Designer</a>, then review and edit the draft for your classroom.</p>
        <p>For a separate student-thinking activity, my <Link href="/resources/teacher-directed-ai-prompts">Teacher Directed AI Prompts Across Subjects</Link> helps students challenge ideas, examine evidence, and explain their decisions. <a href="https://drrobfurman.gumroad.com/l/dwlxcx?utm_source=drrobfurman&utm_medium=article&utm_campaign=lesson_makeover&utm_content=ai-differentiated-instruction" target="_blank" rel="noopener noreferrer">View the prompt pack on Gumroad</a>.</p>
      </div>
      <div className={styles.related}>
        <h2>Keep exploring</h2>
        <p>Read <Link href="/articles/ai-inquiry-lesson-makeover">How to Turn an Existing Lesson Into Inquiry Learning With AI</Link>, use the <Link href="/ai-for-teachers">free AI for Teachers guide</Link>, or return to the <Link href="/ai-in-education">AI in Education hub</Link>.</p>
        <p>To practice these approaches with your staff, explore <Link href="/speaking">keynotes and scheduled workshops</Link>.</p>
      </div>
    </div></article>
  </>;
}
