import Link from 'next/link';
import Image from 'next/image';
import styles from '../articles.module.css';

const title = 'AI and Independent Reading: Start With What Kids Love';
const url = 'https://www.drrobfurman.com/articles/ai-independent-reading';
const cover = 'https://www.drrobfurman.com/images/articles/ai-independent-reading.webp';
export const metadata = {
  title: `${title} | Dr. Rob Furman`,
  description: 'Use AI to help children discover books and stories they enjoy. Dr. Rob Furman shares a practical approach to reading interests, graphic novels, and protecting reading for pleasure.',
  alternates: { canonical: url },
  openGraph: { type: 'article', title, url, publishedTime: '2026-10-03T12:10:00-04:00', images: [{ url: cover, width: 1734, height: 907, alt: title }] },
  twitter: { card: 'summary_large_image', title, images: [cover] },
};
export default function IndependentReadingArticle() {
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
      <p className="eyebrow">AI &amp; literacy</p><h1>{title}</h1>
      <p className={styles.meta}>By Dr. Rob Furman · October 3, 2026</p>
      <div className={styles.coverWrap}><Image className={styles.coverImage} src="/images/articles/ai-independent-reading.webp" alt="Magazine-style cover of a child enjoying an illustrated basketball story, with the article headline" width={1734} height={907} sizes="(max-width: 800px) 100vw, 800px" priority /></div>
    </div></header>
    <article className="section section-light"><div className={`container ${styles.article} ${styles.body}`}>
<p>When a child tells me, “I hate reading,” my first thought is that we need to help that child find something worth reading to them.</p>
<p>Kids see commercials for movies. They see commercials for video games. Books rarely get that kind of attention in their world. I talk about this in my presentations because we sometimes expect children to love reading without helping them discover what is out there.</p>
<p>If a child can read independently, finding something that connects with their interests is a great place to start. That is also where I see a useful role for AI.</p>
<h2>Let the interest lead</h2>
<p>Imagine a child who loves basketball but avoids books. Start with basketball. You do not have to convince that child to care about something completely different before the reading can begin.</p>
<p>Give AI an approximate reading level and ask it for possibilities: fiction about a basketball team, nonfiction about a player, magazine articles, or graphic novels. Then let the child see the choices. AI can help narrow the search, but the child should have a say in what they pick up.</p>
<p>A prompt could look like this:</p>
<blockquote className={styles.prompt}><p>Suggest five real books or short articles for a child who loves basketball and reads independently at approximately a third-grade level. Include fiction, nonfiction, and an illustrated option. Give the title, author or publisher, and a short explanation of why each might interest the child. Identify anything you are uncertain about.</p></blockquote>
<p>Check that the titles exist, look at the actual text, and work with a librarian or teacher to find a good fit. A label from AI does not tell you everything about how a particular child will experience a book.</p>
<p>And then comes the part we cannot skip: get the reading into the child's hands. A great recommendation is not much help if the child cannot access it.</p>
<h2>The page matters, too</h2>
<p>Reading is reading. A basketball magazine counts. A comic counts. A graphic novel counts. I do not want a child who has finally found something enjoyable to hear that it is not “real reading.”</p>
<p>Look at <em>Diary of a Wimpy Kid</em>. Jeff Kinney's illustrated series has reached an enormous audience. Its official site reports more than 300 million copies sold worldwide. <a href="https://wimpykid.com/about/" target="_blank" rel="noopener noreferrer">About Diary of a Wimpy Kid</a></p>
<p>What I notice is how approachable those pages can feel: some words, an illustration, more words, and room on the page to breathe. An illustration does not have to fill the whole page to make a difference. Short stretches of text can make getting started feel possible.</p>
<p>For some children, opening a book and seeing a wall of words is intimidating. We should pay attention to that. Five words on a page are still words being read. The goal here is to help a child want to turn the next page.</p>
<p>AI gives us another possibility: create an original story around the child's interests. Ask for a short basketball story at an appropriate reading level, with short paragraphs and space for illustrations. Or ask for a comic script with brief dialogue and a clear story. An AI tool that supports images can help with the illustrations, too.</p>
<p>An adult should read the result first. The point is to offer something enjoyable and approachable, not simply to generate more pages.</p>
<h2>Protect the pleasure</h2>
<p>Independent reading for pleasure is different from reading a textbook to study, memorize, and prepare for a test. When I am talking about pleasure reading, I am looking for a child who enjoys the experience and chooses to keep going.</p>
<p>We can take that enjoyment away surprisingly quickly. Test a child after everything they read, and we turn the book into another assignment. Now it is work. Now it is school again.</p>
<p>Have a conversation instead. People enjoy talking about what they read. Let children talk with each other about a funny moment, a surprising ending, or a character they liked. You can celebrate time spent reading. You can have a group discussion. None of that needs to become a scored response.</p>
<p>Scholastic encourages daily reading and highlights how much text children can encounter through a regular reading habit. The familiar “20 minutes” message is about making room for reading. I would not turn it into a promise of a particular test score—or another reason to attach a test to the book. <a href="https://www.scholastic.com/newtoclubs/pdfs/SBC_PartnerWithUs_0726.pdf" target="_blank" rel="noopener noreferrer">Scholastic's guidance for families</a></p>
<p>Children who still need help learning to read deserve that instruction. For children who can read independently, we also need to protect the opportunity to read because they want to.</p>
<p>That is the job I would give AI here: help us discover or create something a child is interested in, make it approachable, and help the adult offer better choices.</p>
<p>Let the child choose. Get it into their hands. Give them time to enjoy it.</p>
<p>Reading is reading.</p>
      <div className={styles.related}><h2>Keep exploring</h2><p>Try the free <Link href="/ai-for-reading">AI for Reading guide</Link>, browse <Link href="/articles">more articles</Link>, or <Link href="/speaking">bring the conversation to your school or conference</Link>.</p></div>
    </div></article>
  </>;
}
