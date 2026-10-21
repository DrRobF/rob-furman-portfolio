import Link from 'next/link';
import Image from 'next/image';
import styles from '../articles.module.css';

const title = "How to Turn an Existing Lesson Into Inquiry Learning With AI";
const url = "https://www.drrobfurman.com/articles/ai-inquiry-lesson-makeover";
const cover = "https://www.drrobfurman.com/images/articles/ai-inquiry-lesson-makeover.webp";
export const metadata = {
  title: "Turn an Existing Lesson Into Inquiry Learning With AI | Dr. Rob Furman",
  description: "Refresh an existing lesson with AI while keeping its standard and objectives. Build a question, student investigation, discussion, and meaningful check.",
  alternates: { canonical: url },
  openGraph: { type: 'article', title, description: "Refresh an existing lesson with AI while keeping its standard and objectives. Build a question, student investigation, discussion, and meaningful check.", url, publishedTime: '2026-10-21', images: [{ url: cover, width: 1729, height: 910, alt: "Magazine illustration of students investigating with cups and a thermometer, with the headline Give the Lesson a New Job" }] },
  twitter: { card: 'summary_large_image', title, description: "Refresh an existing lesson with AI while keeping its standard and objectives. Build a question, student investigation, discussion, and meaningful check.", images: [cover] },
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
      <p className="eyebrow">AI &amp; inquiry learning</p><h1>{title}</h1>
      <p className={styles.meta}>By Dr. Rob Furman · <time dateTime="2026-10-21">October 21, 2026</time></p>
      <div className={styles.coverWrap}><Image className={styles.coverImage} src="/images/articles/ai-inquiry-lesson-makeover.webp" alt="Magazine illustration of students investigating with cups and a thermometer, with the headline Give the Lesson a New Job" width={1729} height={910} sizes="(max-width: 800px) 100vw, 800px" priority /></div>
    </div></header>
    <article className="section section-light"><div className={`container ${styles.article} ${styles.body}`}>
<p>Teachers do not need to throw away everything they know because AI can generate a new lesson in seconds. An existing lesson may have a sound objective, useful content, and years of professional experience behind it.</p>
<p>What it may need is a different experience for the students.</p>
<p>That is where I see a useful role for AI: take the goal we already understand and help us consider another way to teach it. Keep the standard and learning objectives clear. Then give students a question worth investigating.</p>
<h2>Ask what the students will actually do</h2>
<p>A lesson has not become inquiry simply because a heading says &quot;Explore.&quot;</p>
<p>If students receive the same explanation, answer the same questions, and copy the same conclusion, changing the label has not changed much.</p>
<p>Look at the student&#x27;s job. Will they make a prediction? Examine something? Compare evidence? Explain a conclusion and reconsider it when the evidence raises a question?</p>
<p>Those are the details I want to see in a revised plan. I also want to know what the teacher will teach directly. Students should not have to guess their way through knowledge or procedures they need before an investigation can begin.</p>
<h2>Keep the goal and rebuild the sequence</h2>
<p>Start by giving AI the verified standard and objectives from the old lesson. Tell it which facts, texts, or materials are essential. Include the available time and the practical limits of your room.</p>
<p>Then describe the change you want. &quot;Make it more exciting&quot; is understandable, but it leaves a lot for the tool to guess. &quot;Create an investigation that asks students to compare evidence before explaining their conclusion&quot; gives it a more useful direction.</p>
<p>Ask for the actual student task, teacher questions, and materials. A plan that says &quot;give students an engaging problem&quot; has handed the planning back to the teacher.</p>
<h2>A question students can investigate</h2>
<p>Consider a lesson about keeping water warm. A conventional version might explain insulation and ask students to complete a worksheet.</p>
<p>A different version could ask: Which of two available sleeve materials helps a cup of warm water stay warm during our test?</p>
<p>Students make a prediction, plan a fair comparison, collect temperature readings, and use those readings to recommend a material. The teacher supplies safe procedures, helps establish the controls, and teaches the concepts students need to make sense of what they observe.</p>
<p>The AI&#x27;s preparation job might include directions, a blank recording grid, discussion questions, and a check for understanding. It should not invent temperature readings and present them as the students&#x27; results.</p>
<p>The learning comes from what students investigate and explain. The activity still needs a clear purpose.</p>
<h2>Use a prompt that requires the missing details</h2>
<p>Try this with a school-approved tool:</p>
<blockquote className={styles.prompt}><p>Here is my existing lesson: [paste permitted text]. Preserve this verified standard and these objectives: [paste]. Rebuild the lesson as an age-appropriate inquiry sequence for [grade and subject]. We have [time and materials]. Provide an investigable question, prerequisite teaching, prediction task, evidence-gathering directions, teacher questions, likely misconceptions, and an independent closing check. Include the actual student text, problem, or blank data sheet needed. Identify physical materials I must supply. Explain what students will do differently from the original lesson. Label assumptions and do not invent sources or experimental results.</p></blockquote>
<p>Review the revision against the objective. Does the investigation actually help students learn it, or has the tool created an entertaining detour?</p>
<h2>Change one section when one section needs help</h2>
<p>You may like most of the lesson. Perhaps the investigation works, but the closing assessment is weak. There is no reason to rebuild every section.</p>
<p>Name the section you want changed, explain the problem, and tell AI to return only the replacement. Ask it to flag any conflict with the rest of the lesson.</p>
<p>For example, &quot;Replace the closing assessment with an individual question that asks students to explain the evidence behind their recommendation. Keep the objective and the rest of the lesson.&quot;</p>
<p>That keeps the teacher&#x27;s decisions intact and makes the change easier to review.</p>
<h2>Watch what happens when you teach it</h2>
<p>Approximate timings help you prepare, but a classroom does not run like a stopwatch. Leave room to respond when students need more explanation or a useful question takes the learning further.</p>
<p>Afterward, look at the students&#x27; work and explanations. What did they understand? Where did the task confuse them? What will you keep next time?</p>
<p>Use AI as a planning partner. Bring your own knowledge of the content and the children. The aim is a lesson students can think their way through, with a teacher who knows why they are doing it.</p>
      <div className={styles.callout}>
        <h2>Put the idea to work</h2>
        <p>Want help creating or refreshing your own lesson? <a href="https://www.askvic.ai/lessonplan" target="_blank" rel="noopener noreferrer">Open the Ask VIC Lesson Designer</a>, then review and edit the draft for your classroom.</p>
        <p>For a separate student-thinking activity, my <Link href="/resources/teacher-directed-ai-prompts">Teacher Directed AI Prompts Across Subjects</Link> helps students challenge ideas, examine evidence, and explain their decisions. <a href="https://drrobfurman.gumroad.com/l/dwlxcx?utm_source=drrobfurman&utm_medium=article&utm_campaign=lesson_makeover&utm_content=ai-inquiry-lesson-makeover" target="_blank" rel="noopener noreferrer">View the prompt pack on Gumroad</a>.</p>
      </div>
      <div className={styles.related}>
        <h2>Keep exploring</h2>
        <p>Read <Link href="/articles/ai-differentiated-instruction">How to Use AI for Differentiated Instruction Without Losing the Learning Goal</Link>, use the <Link href="/ai-for-teachers">free AI for Teachers guide</Link>, or return to the <Link href="/ai-in-education">AI in Education hub</Link>.</p>
        <p>To practice these approaches with your staff, explore <Link href="/speaking">keynotes and scheduled workshops</Link>.</p>
      </div>
    </div></article>
  </>;
}
