import Link from 'next/link';
import styles from '../articles.module.css';

const title = 'Teachers Are Using AI. Why Haven’t Schools Told Them How?';
const url = 'https://www.drrobfurman.com/articles/teachers-using-ai-school-guidance';

export const metadata = {
  title: `${title} | Dr. Rob Furman`,
  description: 'A principal explains how teachers can use AI to save time and personalize practice while keeping human teaching, student engagement, and school leadership at the center.',
  alternates: { canonical: url },
  openGraph: { type: 'article', title, url, publishedTime: '2026-10-03T00:00:00-04:00' },
};

export default function TeacherAIGuidanceArticle() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: metadata.description,
    author: { '@type': 'Person', name: 'Dr. Rob Furman', url: 'https://www.drrobfurman.com/about' },
    publisher: { '@type': 'Person', name: 'Dr. Rob Furman' },
    datePublished: '2026-10-03',
    mainEntityOfPage: url,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
      <header className={styles.hero}>
        <div className={`container ${styles.article}`}>
          <Link className={styles.back} href="/articles">← All articles</Link>
          <p className="eyebrow">AI in education · School leadership</p>
          <h1>{title}</h1>
          <p className={styles.meta}>By Dr. Rob Furman · October 3, 2026</p>
        </div>
      </header>
      <article className="section section-light">
        <div className={`container ${styles.article} ${styles.body}`}>
          <p>If a teacher came to me and asked, “What am I actually allowed to use AI for?” I would start simple: use it as a helper.</p>

          <p>Think of AI as a personal assistant, a graduate assistant, or a teacher’s aide. It can gather information, organize your thinking, and help you make materials faster. But you are still the teacher. You know the standards, you know the children in front of you, and you know what good teaching looks like in your classroom.</p>

          <p>That distinction matters because teachers are already using these tools. In a 2026 survey, Gallup found that six in ten U.S. public K–12 teachers use AI for work, yet only 18% reported receiving formal guidance from administrators about how to use it. That leaves an awful lot of teachers figuring it out on their own. <a href="https://news.gallup.com/poll/710534/teachers-receive-no-formal-guidance.aspx" target="_blank" rel="noopener noreferrer">Gallup, May 2026</a></p>

          <h2>Start with the work that eats up your time</h2>
          <p>Researching a topic, organizing materials, and getting a first draft of a lesson plan on the page are sensible places to begin. The hours you save typing and formatting are hours you can spend thinking about the students and the experience you want them to have.</p>

          <p>Take worksheets. I am not a huge worksheet fan. But if you are going to use one, AI can help you make it more useful. A worksheet aimed at the middle of the class will be too easy for some students and too difficult for others. Give AI your draft and ask it to create versions at several instructional levels. You might also ask for versions built around different student interests. Something that once took hours can now take minutes.</p>

          <p>Then you do the part AI cannot do for you: look at those versions and decide whether they fit your students, your standards, and the lesson you are trying to teach. AI can give a veteran teacher ideas. I would never ask that teacher to throw away years of experience because a computer produced an answer quickly.</p>

          <h2>Don’t mistake screen time for teaching</h2>
          <p>I remember when Study Island was the hot thing. You could put a child on a computer for a long stretch and the child would answer questions and work through material. In some schools, that became an entire class period. It was easy to call that instruction, but I worried about how isolated it could become.</p>

          <p>AI makes the same shortcut even more tempting. It can make an online tutorial, generate practice questions, and respond to a student. Those are useful abilities. They do not mean the best plan is to put every child in front of a screen and step away.</p>

          <p>Kids need to talk to each other, debate, move around, try experiments, and work on projects. They need a teacher who notices the confusion that does not show up in a computer response and knows when to change direction. The human part of the classroom is not a bonus feature.</p>

          <p>One way I would explore AI use is through small-group rotations. While a teacher works closely with one group, another group might use an appropriate AI-supported activity for drill and practice. Then the groups rotate. The teacher still chooses the activity, checks its quality, watches how students respond, and brings the learning back together. That is a very different picture from handing the whole classroom to a machine.</p>

          <h2>Principals have to show what good use looks like</h2>
          <p>Before setting expectations, an administrator needs to check the applicable district and state rules, including any requirements for student information and approved tools. Teachers deserve clear boundaries.</p>

          <p>After that, the principal should model the practice. I have always believed the principal is the instructional leader of the building, and the staff is your classroom. If you want teachers to try AI thoughtfully, let them see you use it in a staff meeting or professional development session. Show them how it helped you prepare. Show them what you changed or rejected and why. Give them a chance to experience the activity the way a student might.</p>

          <p>That makes the expectation visible and gives teachers room to learn without feeling that they are each inventing the rules alone.</p>

          <p>My advice to a teacher starting tomorrow is straightforward: use AI to gather, organize, and prepare. As you gain confidence, try a carefully planned small-group use that supports practice. In every case, ask yourself whether the tool is giving you more time and better options to teach the children in front of you. If it is taking you out of the relationship, step back and redesign the lesson.</p>

          <p><strong>AI can move fast. The teacher still decides where the class is going.</strong></p>

          <aside className={styles.callout} aria-label="Explore Ask VIC">
            <p><strong>See the small-group idea in practice:</strong> I built <a href="https://www.askvic.ai/">Ask VIC</a> as a virtual co-teacher that guides students step by step while the teacher stays in charge of instruction. Access is currently through approved school accounts. If you want to test it or explore using it at your school, visit the site and request access.</p>
          </aside>

          <div className={styles.related}>
            <h2>Keep exploring</h2>
            <p>Read the <Link href="/ai-for-teachers">practical AI guide for teachers</Link>, explore <Link href="/ai-in-education">AI in education</Link>, or <Link href="/speaking">bring this conversation to your school or conference</Link>.</p>
          </div>
        </div>
      </article>
    </>
  );
}
