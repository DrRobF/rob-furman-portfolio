import { pageMeta } from '../lib/seo';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = pageMeta({
  title: 'VIC: Free AI Lesson Planner, Parent Messages & Co-Teacher for Teachers',
  description: 'VIC builds standards-aligned lessons with worksheets and answer keys, drafts notes to parents, and gives students a guided co-teacher. Free for educators, built by a principal.',
  path: '/vic',
  image: '/images/og/vic.png',
});

const VIC_URL = 'https://www.askvic.ai';
const SIGNUP_URL = 'https://www.askvic.ai/signup';

const teacherWins = [
  {
    title: 'Tomorrow’s lesson, done tonight',
    text: 'Pick your grade, subject, and standards. VIC drafts the full lesson: objectives, activities, differentiation for up to five groups, a worksheet, an answer key, and an exit ticket. Download it to Word or print it.',
  },
  {
    title: 'The note home, without the stress',
    text: 'Describe the situation and the tone you want. VIC drafts a clear, warm message to parents, a colleague, or your principal. You review and edit before anything is sent.',
  },
  {
    title: 'Refresh an old lesson',
    text: 'Upload a lesson you already have (Word, PDF, or text). Ask VIC to make it more hands-on, Socratic, or project-based, or rewrite just one section.',
  },
  {
    title: 'A co-teacher for one group while you teach another',
    text: 'Students work through guided practice with VIC asking questions instead of handing out answers. Teachers manage the classroom and see what students worked on.',
  },
  {
    title: 'Plan your week and prep your meetings',
    text: 'A personal assistant for the work around teaching: a weekly plan, a private task list, meeting prep sheets, and short professional learning ideas.',
  },
  {
    title: 'Your judgment stays in charge',
    text: 'Everything VIC makes is a draft for you to review. Official standards wording is protected, and no student names are needed to plan a lesson.',
  },
];

export default function VicPage() {
  return (
    <>
      <section className="section section-light">
        <div className="container">
          <p className="eyebrow">Free for educators · No credit card</p>
          <h1>Get your evenings back. Let VIC draft the lesson plan and the note home.</h1>
          <p className="lead">
            VIC is an AI planning partner and virtual co-teacher built by a working principal. It
            writes standards-aligned lessons with worksheets and answer keys, drafts messages to
            parents, and gives students guided practice, so you can spend your time teaching.
          </p>
          <div className="split-grid top-space">
            <div>
              <p>
                I built VIC as a principal who watches great teachers lose their nights and weekends to
                planning and paperwork. VIC is not a chatbot that does students’ work for them. It
                is a co-teacher that supports your instruction and leaves every decision with you.
              </p>
              <div className="button-row">
                <Link href={SIGNUP_URL} className="button primary" target="_blank" rel="noreferrer">
                  Start free: build a lesson
                </Link>
                <Link href={VIC_URL} className="button secondary" target="_blank" rel="noreferrer">
                  Tour VIC
                </Link>
              </div>
              <p className="top-space-sm">
                Built-in Florida B.E.S.T. and Pennsylvania K–8 reading and math standards, or paste
                your own state’s standards for any grade and subject.
              </p>
            </div>
            <div className="media-card">
              <Image
                src="/images/headshot-blue.jpg"
                alt="Dr. Rob Furman, principal and creator of VIC"
                width={900}
                height={1100}
                className="section-image about-image"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <p className="eyebrow">What VIC does for you</p>
          <h2>Six jobs off your plate</h2>
          <div className="card-grid top-space">
            {teacherWins.map((item) => (
              <article className="card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <h2>Try it on one real lesson this week.</h2>
          <p className="lead">
            Sign up with your email, plan one lesson you actually have to teach, and see if it saves
            you time. It is free for educators. If it helps, share it with your team.
          </p>
          <div className="button-row">
            <Link href={SIGNUP_URL} className="button primary" target="_blank" rel="noreferrer">
              Create my free account
            </Link>
            <Link href="/contact" className="button secondary">
              Bring VIC to my school
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
