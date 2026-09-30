import Link from 'next/link';

export const metadata = {
  title: 'AI for Reading: Build Literacy and Independent Readers | Dr. Rob Furman',
  description: 'Practical ways teachers and families can use AI to support book choice, vocabulary, comprehension, and independent reading while children do the reading themselves.',
  alternates: { canonical: 'https://www.drrobfurman.com/ai-for-reading' },
};

const agePaths = [
  {
    title: 'Pre-K: build a future reader',
    text: 'Read aloud, sing, tell stories, notice print, and talk back and forth. Let a child choose the funny book again. AI can give an adult fresh conversation ideas, but independent word reading is not the goal yet.',
    move: 'Ask AI for three playful questions about a book you already know. Use one if it feels natural; follow the child’s lead.',
  },
  {
    title: 'K–3: connect skills to real text',
    text: 'Keep explicit teaching of sounds, letters, decoding, and word recognition with the educator. Give children connected text they can actually read, along with richer books read aloud by adults.',
    move: 'Ask AI to suggest discussion questions for a teacher-selected text. Check every question against the actual pages. Do not let generated “decodable” text replace a verified sequence.',
  },
  {
    title: 'Grades 4 and up: grow choice and meaning',
    text: 'Help students find books they want to finish. Keep teaching vocabulary, fluency, and comprehension when needed. Invite students to ask questions, find the gist, and notice when meaning breaks down.',
    move: 'After a student reads a section, use AI to prepare a spoiler-free conference question. Ask for evidence from the student’s copy, not an AI summary.',
  },
];

const prompts = [
  {
    title: 'Find the next book, then let the reader choose',
    prompt: 'I am helping a reader in [grade band] who enjoys [interests] and recently liked [book or topic]. Suggest five kinds of books or search terms to try in a public or school library catalog. Include fiction and nonfiction. Do not invent titles or claim a book is available. Give me two questions to ask the reader before we choose.',
    human: 'Check the catalog and sample the actual books. The student picks; a librarian is an excellent next stop.',
  },
  {
    title: 'Prepare one word worth keeping',
    prompt: 'I am reading [teacher-selected title or short excerpt] with [age group]. Suggest three useful vocabulary words from the excerpt I provide, a child-friendly explanation for each, and one everyday question that uses each word. Use only words present in my excerpt: [paste a short permitted excerpt].',
    human: 'Confirm the words in the text and teach them in context. Respect copyright and school rules when sharing excerpts.',
  },
  {
    title: 'Talk after the child has read',
    prompt: 'A student has just read through [chapter or section] of [book]. Write three open questions that ask about character, evidence, or a surprising idea. Do not reveal anything beyond that section. If you do not know the book reliably, give general question stems instead of inventing plot details.',
    human: 'Ask one question, then listen. Let the reader show you the page that shaped their answer.',
  },
  {
    title: 'Plan a reading conference',
    prompt: 'Help me prepare a five-minute reading conference. The student is reading [book or type of text], and I want to learn about [choice, understanding, stamina, or a specific taught skill]. Suggest three questions, one observation to record, and one small next step. Do not diagnose a reading difficulty or write an evaluation.',
    human: 'The teacher observes the actual reading and chooses the next instructional move.',
  },
];

const challenge = [
  ['1', 'Choose together', 'Browse a shelf, library catalog, or book basket. Let the reader choose one to try.'],
  ['2', 'Talk about a word', 'Notice one interesting word in the real book. Use it in a new sentence together.'],
  ['3', 'Read and retell', 'After reading, ask: “What happened, and what makes you say that?”'],
  ['4', 'Invite another reader', 'Share a page with a sibling, caregiver, or grandparent, in person or by video call.'],
  ['5', 'Return to a favorite', 'Reread a beloved page or passage. Notice one detail missed the first time.'],
  ['6', 'Follow a curiosity', 'Use a library book or trusted source to investigate a question the story raised.'],
  ['7', 'Choose what comes next', 'Ask the reader what they want more of: humor, mystery, facts, pictures, or a new voice.'],
];

export default function AIForReadingPage() {
  return <>
    <section className="section section-dark"><div className="container">
      <p className="eyebrow">A free guide for educators and families</p>
      <h1>AI for Reading: Help Children Become Readers, Not Just Answerers</h1>
      <p className="lead">AI can help an adult discover books, prepare a question, or plan a conversation. The child still needs to hear stories, learn reading skills, read real text, and find the joy of choosing another book. Here is a practical way to use both.</p>
      <div className="button-row"><Link className="button primary" href="#age-paths">Start by age</Link><Link className="button tertiary" href="#prompts">Use the prompts</Link><Link className="button tertiary" href="#seven-days">Try seven days</Link></div>
    </div></section>

    <section className="section section-light"><div className="container ai-guide-reading">
      <p className="eyebrow">The core idea</p><h2>What can AI actually do for reading?</h2>
      <p>Think of AI as a preparation partner for adults. It can suggest options quickly, but it cannot see whether a child decoded a word, made sense of a passage, or fell in love with a story unless a person observes and talks with that child. Generated text and questions also need checking.</p>
      <p>Reading research already gives us useful anchors: teach foundational skills directly, provide time with connected text, and build comprehension through knowledge, questions, and discussion. Research on the added impact of generative AI for reading is still underway. This guide adapts established reading practices; it does not claim that AI alone raises scores.</p>
      <p><strong>Dr. Rob’s rule:</strong> AI may help set the table. The child does the reading, and a human pays attention.</p>
    </div></section>

    <section className="section section-soft" id="age-paths"><div className="container">
      <div className="section-intro"><p className="eyebrow">Meet readers where they are</p><h2>Three different starting points</h2><p>A joyful Pre-K read-aloud, a beginning reader’s decoding practice, and a middle-schooler’s independent book life are different jobs.</p></div>
      <div className="card-grid three-up">{agePaths.map((item) => <article className="card" key={item.title}><h3>{item.title}</h3><p>{item.text}</p><p className="top-space-sm"><strong>Where AI can help:</strong> {item.move}</p></article>)}</div>
    </div></section>

    <section className="section section-light" id="prompts"><div className="container">
      <div className="section-intro"><p className="eyebrow">Copy, adapt, verify</p><h2>Four prompts that support real reading</h2><p>These are prompts for an adult using a school-approved tool. Keep student names, reading records, and private details out of a general-purpose chatbot.</p></div>
      <div className="ai-guide-stack">{prompts.map((item) => <article className="card ai-guide-card" key={item.title}><h3>{item.title}</h3><p className="ai-prompt">{item.prompt}</p><p><strong>The human move:</strong> {item.human}</p></article>)}</div>
    </div></section>

    <section className="section section-soft"><div className="container ai-guide-reading">
      <p className="eyebrow">A repeatable routine</p><h2>Try a short read, then a real conversation</h2>
      <ol className="ai-guide-list">
        <li><strong>Choose:</strong> Offer a few real books or texts and let the reader have a voice. A child may abandon one and try another.</li>
        <li><strong>Read:</strong> Protect a calm stretch for the child to read appropriate text, or read aloud together when that is the right developmental step. Give help with a taught skill when needed.</li>
        <li><strong>Talk:</strong> Ask one open question. “What surprised you?” or “Show me the part that made you think that.” Listen longer than you speak.</li>
        <li><strong>Return:</strong> Save a word, question, or next-book idea. Come back tomorrow without turning every reading moment into a quiz.</li>
      </ol>
      <p>Adjust the length to the child and the setting. The goal is a reading life that can continue, not a contest over minutes or pages.</p>
    </div></section>

    <section className="section section-light" id="seven-days"><div className="container ai-guide-reading">
      <p className="eyebrow">Free family and classroom menu</p><h2>Seven days to make reading inviting</h2>
      <p>Pick one small action each day. Repeat the ones that work. No account, purchase, or AI tool is required; an adult may use the prompts above to prepare.</p>
      <div className="ai-reading-days">{challenge.map(([day, title, action]) => <div className="ai-reading-day" key={day}><span aria-label={`Day ${day}`}>{day}</span><div><strong>{title}</strong><p>{action}</p></div></div>)}</div>
      <p className="top-space"><strong>For families:</strong> A video-call story with Grandma, an older sibling’s recommendation, a library trip, or a story in the family’s home language all belong in a reading life. Connection matters more than an app.</p>
    </div></section>

    <section className="section section-soft"><div className="container ai-guide-reading">
      <p className="eyebrow">Check the learning</p><h2>What should a teacher notice?</h2>
      <p>Look beyond minutes logged or questions answered by a chatbot. Is the student choosing and returning to books? Can the student read the assigned text with growing accuracy or fluency? Can they explain an idea and point to the page? What support or explicit instruction is still needed?</p>
      <p>If a student struggles to decode or understand text, a pleasant AI conversation is not a substitute for assessment and instruction. Use the school’s reading team and intervention process. Do not paste a child’s private assessment data into an unapproved tool.</p>
      <h3>Keep AI in its place</h3>
      <ul className="ai-guide-list"><li>Do not let a summary replace the book or let a bot answer the comprehension question for the student.</li><li>Do not assume an AI-generated passage matches a phonics sequence or reading level; inspect it yourself.</li><li>Do not require a family to buy a device or AI subscription to participate.</li><li>Do not allow an unsupervised student chatbot when the school has not approved the tool, account, and use.</li></ul>
    </div></section>

    <section className="section section-light"><div className="container ai-guide-reading">
      <p className="eyebrow">Evidence and context</p><h2>Where the reading guidance comes from</h2>
      <p>The What Works Clearinghouse guides cover <a href="https://ies.ed.gov/ncee/wwc/PracticeGuide/21" target="_blank" rel="noopener noreferrer">foundational skills in K–3</a>, <a href="https://ies.ed.gov/ncee/wwc/practiceguide/14" target="_blank" rel="noopener noreferrer">early comprehension</a>, and <a href="https://ies.ed.gov/ncee/wwc/practiceguide/29" target="_blank" rel="noopener noreferrer">interventions in grades 4–9</a>. The Institute of Education Sciences is also <a href="https://ies.ed.gov/use-work/awards/using-generative-ai-reading-rd-center" target="_blank" rel="noopener noreferrer">studying AI for reading</a>; those projects are research in progress, not proof of a particular product’s effectiveness.</p>
      <p>This guide extends the joyful reading habits Dr. Furman shares with families: choice, conversation, rereading, and people who love the child. Explore more <Link href="/ai-for-teachers">AI workflows for teachers</Link> or return to the <Link href="/ai-in-education">AI in Education hub</Link>.</p>
    </div></section>
  </>;
}
