import Link from 'next/link';
import Image from 'next/image';
import styles from '../articles.module.css';

const title = 'AI Is Here. How Should Teaching Change?';
const url = 'https://www.drrobfurman.com/articles/ai-teaching-change';
const cover = 'https://www.drrobfurman.com/images/articles/ai-teaching-change.webp';
export const metadata = {
  title: `${title} | Dr. Rob Furman`,
  description: 'How should teachers use AI in education? Dr. Rob Furman shares teacher-directed prompts that challenge student arguments, examine evidence, and make thinking visible.',
  alternates: { canonical: url },
  openGraph: { type: 'article', title, url, publishedTime: '2026-10-03T17:40:00-04:00', images: [{ url: cover, width: 1734, height: 907, alt: title }] },
  twitter: { card: 'summary_large_image', title, images: [cover] },
};
export default function AITeachingChangeArticle() {
  const structuredData = {
    '@context': 'https://schema.org', '@type': 'BlogPosting', headline: title,
    description: metadata.description, datePublished: '2026-10-03', image: cover,
    author: { '@type': 'Person', name: 'Dr. Rob Furman', url: 'https://www.drrobfurman.com/about' },
    mainEntityOfPage: url,
  };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
    <header className={styles.hero}><div className={`container ${styles.article}`}>
      <Link className={styles.back} href="/articles">← All articles</Link>
      <p className="eyebrow">AI in education</p><h1>{title}</h1>
      <p className={styles.meta}>By Dr. Rob Furman · October 3, 2026</p>
      <div className={styles.coverWrap}><Image className={styles.coverImage} src="/images/articles/ai-teaching-change.webp" alt="AI Is Here. How Should Teaching Change? Magazine cover showing a teacher and students discussing a draft" width={1734} height={907} sizes="(max-width: 800px) 100vw, 800px" priority /></div>
    </div></header>
    <article className="section section-light"><div className={`container ${styles.article} ${styles.body}`}>
<p>I remember the concerns teachers raised when the internet began finding its way into schools. Would it replace us? Then Google search was going to ruin research. Copy and paste gave students another way to turn someone else&#x27;s words into a paper.</p>
<p>Now AI can produce the whole paper, and we are having familiar conversations again.</p>
<p>I understand the concern. But we also have to ride the horse in the direction it is heading. AI is available, students can use it, and I do not see it disappearing. Teachers need practical ways to give it a useful job in the learning process.</p>
<h2>Decide what students should learn first</h2>
<p>A textbook is a resource. A search engine is a resource. AI is a resource, too. Its usefulness depends on what we ask students to do with it.</p>
<p>If an assignment is meant to show that a student can independently compose an argument, asking AI to write it defeats that purpose. But we can design a different assignment around the same technology.</p>
<p>For example, have AI produce an argument and ask students to investigate it. Which statements are accurate? Which need evidence? Can they find reliable sources? Does the argument survive what they discover?</p>
<p>That can be a worthwhile research task. Students should be able to correct or reject the argument, rather than search only for information that makes it look right. The teacher needs to be clear that this assignment assesses investigation and source evaluation, not independent composition.</p>
<h2>Let AI challenge an idea the student already owns</h2>
<p>The approach that interests me most begins with the student&#x27;s own thinking.</p>
<p>In an upper-grade social studies or science class, a student could write an initial argument using something they have learned, observed, or researched. Then a teacher-provided prompt asks AI to challenge that argument.</p>
<p>What would someone who disagrees say? Which claim needs more evidence? What would an expert ask that the student has not considered?</p>
<p>The student responds, checks the evidence, and revises. They might also write a separate response explaining how they defended their position. It does not always require a second full paper. What matters is the thinking that happens between the first draft and the next one.</p>
<p>I would consider an assignment remarkably successful if a student examined AI&#x27;s suggestions, disagreed with most of them, and could explain why. That is a debate. The student has considered another position and taken responsibility for a response.</p>
<p>UNESCO&#x27;s guidance on generative AI in education emphasizes protecting human agency. For me, that becomes a practical classroom question: who is making the decisions about the work? <a href="https://www.unesco.org/en/articles/guidance-generative-ai-education-and-research?hub=67098" target="_blank" rel="noopener noreferrer">UNESCO guidance</a></p>
<h2>Give students a prompt with a purpose</h2>
<p>Teachers can help shape this experience by providing quality prompts. “Use AI to improve your paper” leaves a lot open. A prompt that asks for one challenge, waits for an answer, and avoids rewriting the paper gives the student a more useful starting point.</p>
<p>Here are three examples a teacher can adapt. Replace the brackets with the assignment details and use a school-approved tool.</p>
<h3>Challenge an argument</h3>
<blockquote className={styles.prompt}><p>I am a student in [grade and subject]. My assignment is [task], and my argument is [paste my own draft or explanation]. Help me examine it without rewriting it. Offer one reasonable counterargument and ask one question about my evidence. Wait for my response before continuing. Do not invent facts, sources, or quotations. If I disagree, ask me to explain why. After three exchanges, ask me to write my own decision about what I will keep or change.</p></blockquote>
<h3>Question the evidence</h3>
<blockquote className={styles.prompt}><p>Help me review my own work for [assignment]. Use only the draft and source material I provide: [paste permitted material]. Identify one claim that needs stronger support. Ask what evidence I have and wait for my answer. Do not supply an invented citation or assume that a plausible claim is true. Help me decide what I need to verify. I will find the source and write the revision myself.</p></blockquote>
<h3>Reflect on a decision</h3>
<blockquote className={styles.prompt}><p>Ask me about a change I made after our discussion of [assignment]. Ask one question at a time: What did I change? What evidence or reasoning led me to change it? Which suggestion did I reject, and why? Do not write my reflection. At the end, list the questions you asked and point me to my responses. If something is missing, mark it as missing rather than filling it in.</p></blockquote>
<p>These instructions guide the interaction. A teacher still needs to preview the tool and review what happens; a prompt cannot guarantee its behavior.</p>
<h2>Make the student&#x27;s thinking visible</h2>
<p>A teacher-controlled prompt helps define the assignment, but it does not prove who wrote the work. An AI-generated summary of the conversation is not proof, either.</p>
<p>Ask students to keep their original draft, the relevant AI conversation, and the revision. Add a short explanation of the choices they made. A brief discussion with the teacher can help the student explain a decision in their own words.</p>
<p>The question is not whether the student agreed with the computer. It is whether the student can explain the argument, examine the challenge, and support the decision they made.</p>
<h2>Try one assignment</h2>
<p>Begin with one task you already understand. Have students state an initial position, use a shared prompt to examine it, check a challenge against credible evidence, and explain their next draft.</p>
<p>Teachers in other subjects can adapt the same idea. A math student can explain a method and examine an error. A music student can defend a compositional choice. An art student can evaluate whether a suggestion serves the purpose of the work.</p>
<p>AI gives us another resource. The teacher decides what students need to learn and designs an experience that requires them to think.</p>
<p>That is how I would start riding the horse in the direction it is heading.</p>
<div className={styles.callout}><h2>Put the idea to work</h2><p>The companion <Link href="/resources/teacher-directed-ai-prompts">Teacher Directed AI Prompts Across Subjects</Link> expands this approach with six complete prompts, 36 subject adaptations, and assignment and reflection sheets.</p></div><div className={styles.related}><h2>Keep exploring</h2><p>Try the <Link href="/ai-for-teachers">free AI for Teachers guide</Link>, explore <Link href="/vic">Ask VIC</Link>, or <Link href="/speaking">bring this conversation to your school or conference</Link>.</p></div>
    </div></article>
  </>;
}
