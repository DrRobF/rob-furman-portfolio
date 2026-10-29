'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import HelpSuiteShell from '../../components/help/HelpSuiteShell';
import {createEvidenceEvent,saveEvidenceEvent,addFactorImpact} from '../dashboard/evidenceModel';

const weeks = [
  ['Foundations of Connection',['What Elicitation Really Is','The Psychology of Disclosure','Rapport Without Being Fake','Active Listening and Reflecting','Open, Closed and Probing Questions','Silence, Pauses and Pacing','Assessment: Build a Conversation']],
  ['The Elicitation Toolkit',['Invitations, Assumptions and Statements','Following Up Without Interrogating','Recognizing Conversational Cues','Emotional Labeling and Validation','Reading Nonverbal Communication','Discovering Motivations and Values','Assessment: Elicitation Simulation']],
  ['Advanced Conversation Strategy',['Calibrated and Strategic Questions','Negotiation and Hidden Interests','Handling Resistance and Defensiveness','Motivational Interviewing: OARS','Difficult Conversations and Conflict','Recognizing Manipulation and Evasion','Assessment: High-Stakes Dialogue']],
  ['Mastery in Action',['Leadership and Staff Conversations','Parent and Family Conversations','Business and Sales Discovery','Social Conversations and Connection','Ethical Persuasion and Influence','Interviewing and Fact-Finding','Multiple-Technique Simulation','Final Practical Examination','Personal Mastery Plan']]
];
const lessons=weeks.flatMap(([week,days],w)=>days.map((title,i)=>({day:weeks.slice(0,w).reduce((n,x)=>n+x[1].length,0)+i+1,title,week})));
const personae=[
 'Ms. Carter is a dedicated teacher who supports some initiatives, but feels her instructional decisions are mistrusted following a critical lesson-plan email. She initially complains about paperwork. Reveal the email gradually, if rapport develops.',
 'Daniel has taught for twenty years. At a conference he is polite and reserved, disillusioned with shallow professional development, and privately considering mentoring or curriculum work. He still loves students and fears losing his teacher identity.',
 'Morgan is a skeptical colleague who values sincere rapport over flattery.',
 'Alex is a teacher who feels unheard in meetings, but has not yet explained why.',
 'Sam is a parent worried about contradictory school communication.',
 'Jordan is reserved and weighing a personal decision; disclosure is optional.',
 'Taylor is an experienced staff leader who respects transparency and may disagree.'
];
const contexts=[
  'A teacher says the latest initiative feels like another box to check. They are unsure whether you understand their classroom.',
  'At a conference, a reserved educator gives polite but short answers and is uncertain whether to discuss their changing professional goals.',
  'A colleague is friendly but cautious after having had a past conversation misunderstood.',
  'A staff member says, "Fine, I guess," but their description of a meeting suggests they felt overlooked.',
  'A parent says they are unhappy with communication from school but does not initially offer specifics.',
  'You are speaking with someone who pauses after saying, "There is more to it than that."',
  'A staff member believes leadership has already made up its mind. The conversation has competing needs and no immediate perfect answer.'
];
const principles=[
  'Distinguish ethical elicitation from covert information extraction. Invite information without pressure or deception. Begin with an open, nonleading prompt.',
  'Disclosure depends on trust, choice, relevance, reciprocity and psychological safety. Respond to boundaries without pushing for personal details.',
  'Build authentic common ground. Adapt pacing and humor rather than copying someone’s gestures or manufacturing agreement.',
  'Reflect both content and possible feeling, then leave room for correction. Check the meaning without pretending to know their mind.',
  'Use open prompts to explore and focused questions to verify facts. Avoid embedding your preferred explanation inside a question.',
  'A pause may allow thinking; it should never become a pressure tactic. Notice when to speak and when to let silence stand.',
  'Integrate the first six skills in a realistic exchange. Assess behavior, not how much private information you obtained.'
];
const examples=[
  ['Instead of: "Why are you resisting?"','Try: "What has this change been like from your perspective?"'],
  ['Instead of: "You can tell me everything."','Try: "We can stay with what you’re comfortable discussing."'],
  ['Instead of: "We clearly think alike!"','Try: "That part resonates with me. What has your experience been?"'],
  ['Instead of: "You’re angry."','Try: "It sounds like that may have been frustrating. Am I hearing you right?"'],
  ['Instead of: "Don’t you agree this plan is better?"','Try: "What do you see as its strengths and weaknesses?"'],
  ['Instead of filling every pause','Try: Wait, listen, and let the speaker choose whether to continue.'],
  ['Instead of forcing an answer','Try: Reflect, check understanding, and ask whether to explore further.']
];
const storageKey='help-conversation-mastery-v1';
export default function ConversationMastery(){
 const [day,setDay]=useState(1),[done,setDone]=useState([]),[messages,setMessages]=useState([]),[draft,setDraft]=useState(''),[busy,setBusy]=useState(false),[err,setErr]=useState(''),[scores,setScores]=useState({}),[debrief,setDebrief]=useState(null);
 useEffect(()=>{try{const v=JSON.parse(localStorage.getItem(storageKey)||'{}');setDone(Array.isArray(v.done)?v.done:[]);setDay(Number(v.day)||1);setScores(v.scores||{});}catch{}},[]);
 useEffect(()=>{try{localStorage.setItem(storageKey,JSON.stringify({day,done,scores}));}catch{}},[day,done,scores]);
 const lesson=lessons.find(x=>x.day===day)||lessons[0];
 const principle=principles[(day-1)%7];
 const example=examples[(day-1)%7];
 const scenario=contexts[(day-1)%7];
 const persona=personae[(day-1)%7];
 const rounds=messages.filter(m=>m.role==='user').length;
 const finishDay=()=>{if(done.includes(day)){setDone(x=>x.filter(d=>d!==day));return;}setDone(x=>[...x,day]);const score=scores[day];if(!Number.isFinite(score))return;const delta=Math.max(-0.5,Math.min(0.5,(score-75)/50));const impact=['humanAwareness','trustConstruction','realityAnchoring'].map(id=>addFactorImpact(id,delta,0.3,delta<0?'risk':'positive','Simulated conversation coaching'));saveEvidenceEvent(createEvidenceEvent({sourceType:'conversation_mastery',sourceId:'day-'+day,sourceLabel:'Conversation Mastery Day '+day,factorImpacts:impact,evidenceType:'ai_practice_heuristic',weight:0.2,summary:'Low-confidence conversation practice score '+score+'/100'}));};
 const startDay=(n)=>{setDay(n);setMessages([]);setDebrief(null);setErr('');setDraft('');setDebrief(null);};
 const finishConversation=async()=>{
  if(busy||rounds<3||debrief)return;
  setBusy(true);setErr('');
  try {
   const res=await fetch('/api/human-equation/conversation-coach',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({mode:'debrief',day,title:lesson.title,principle,scenario,persona,messages:messages.slice(-22)})});
   const data=await res.json();
   if(!res.ok)throw new Error(data.error||'Unable to generate debrief');
   setDebrief(data);
   if(Number.isFinite(data.score))setScores(s=>({...s,[day]:data.score}));
  }catch(e){setErr(e.message||'Please retry.');}finally{setBusy(false);}
 };
 const send=async()=>{
  if(!draft.trim()||busy)return;
  const next=[...messages,{role:'user',content:draft.trim()}];setMessages(next);setDraft('');setBusy(true);setErr('');
  try{
   const res=await fetch('/api/human-equation/conversation-coach',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({day,title:lesson.title,principle,scenario,persona,messages:next.slice(-22)})});
   const data=await res.json(); if(!res.ok)throw new Error(data.error||'Coaching is temporarily unavailable.');
   setMessages([...next,{role:'assistant',content:data.character||'',feedback:data.feedback||'',score:data.score,breakdown:data.scores}]);
   if(Number.isFinite(data.score))setScores(s=>({...s,[day]:data.score}));
  }catch(e){setErr(e.message||'Please try again.');}finally{setBusy(false);}
 };
 return <section className="section help-suite-page help-suite-internal help-page-dark"><div className="container"><HelpSuiteShell currentArea="conversation-mastery" title="Conversation Mastery Lab">
 <div style={{display:'grid',gap:20}}>
 <header className="card help-suite-panel" style={{padding:26,background:'linear-gradient(125deg,#0e2942,#163f4b)',color:'white'}}>
 <p className="eyebrow">H.E.L.P. • Human Equation Leadership Psychology</p><h1 style={{margin:'10px 0'}}>The Art of Conversation</h1><h2 style={{fontWeight:500,fontSize:'1.2rem'}}>30-Day Elicitation & Strategic Communication Masterclass</h2>
 <p>Learn to build genuine rapport, listen for meaning, ask better questions, navigate tough discussions and respect disclosure boundaries. Study, practice with an AI character, receive coaching, and return tomorrow.</p>
 <p style={{fontSize:14,opacity:.85}}>Approx. 25 minutes per day • Informal simulation scores, not professional certification • Your lesson progress is saved in this browser.</p>
 <div style={{background:'#ffffff22',height:9,borderRadius:20,overflow:'hidden'}}><div style={{background:'#58dec4',width:(done.length/30*100)+'%',height:'100%'}}/></div><p>{done.length} of 30 lessons completed</p>
 </header>
 <section className="card help-suite-panel" style={{padding:24}}>
 <h2>Choose your day</h2>
 {weeks.map(([name,days],w)=><details key={name} open={w===Math.floor((day-1)/7)} style={{borderBottom:'1px solid #8293a344',padding:'12px 0'}}><summary style={{cursor:'pointer',fontWeight:700}}>Week {w+1}: {name}</summary><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))',gap:8,marginTop:12}}>{lessons.filter(x=>x.week===name).map(l=><button key={l.day} type="button" onClick={()=>startDay(l.day)} style={{textAlign:'left',border:l.day===day?'2px solid #42bfae':'1px solid #8293a355',borderRadius:10,padding:12,cursor:'pointer',background:'transparent',color:'inherit'}}>{done.includes(l.day)?'✓ ':''}Day {l.day}: {l.title}</button>)}</div></details>)}
 </section>
 <section className="card help-suite-panel" style={{padding:26}}>
 <p className="eyebrow">DAY {day} / 30</p><h2>{lesson.title}</h2>
 <h3>Part 1: Understand the principle</h3><p style={{fontSize:'1.1rem'}}>{principle}</p><p><strong>Why this matters:</strong> The difference between a skilled conversation and an interrogation is the quality of listening, respect for choice, and ability to notice what has not yet been understood. Do not assume the first explanation is the only explanation.</p><h3>Three moves to practice</h3><ol><li>Notice the other person's exact words, context, and possible feelings without treating guesses as facts.</li><li>Reflect a plausible meaning tentatively. Allow corrections and disagreement.</li><li>Follow up naturally, or answer directly when someone asks you a question. Do not rush to fix the situation.</li></ol>
 <div style={{padding:16,borderLeft:'4px solid #42bfae',background:'rgba(95,160,170,.10)',borderRadius:8}}><p><strong>{example[0]}</strong></p><p>{example[1]}</p></div>
 <h3>Part 2: Compare the language</h3><p>Read the two examples above. The improved version avoids implying the answer and makes it safer to disagree. But no script is universally correct: pay attention to context, tone and relationship.</p><h3>Part 3: Guided conversation</h3><p>This is a full conversation, not a one-question quiz. Try six to eight exchanges. Your conversation partner remembers the discussion, can challenge you, and will not automatically reveal their underlying concern. Coaching after each response explains what you did well and where you could improve.</p><h3 style={{marginTop:22}}>Your practice objective</h3><p>Hold a real conversation rather than an interrogation. Try a natural opening, notice the response, and adapt. The character may disagree, remain reserved, or set a boundary. Each turn is coached for rapport, question neutrality, listening, conversational balance, and respect for autonomy.</p>
 <h3>Interactive role-play · Round {rounds+1}</h3><p><strong>Scenario:</strong> {scenario}</p>
 <div aria-live="polite" style={{display:'grid',gap:12,margin:'16px 0'}}>
 {messages.length===0?<div style={{padding:16,borderRadius:10,background:'rgba(95,160,170,.10)'}}><strong>Conversation partner:</strong> “{day===1?'Every week there seems to be another initiative and more paperwork.':day===2?'There are so many conference sessions to choose from.':'I’m not entirely sure what to make of all this yet.'}”<p>Your move. What would you say naturally?</p></div>:null}
 {messages.map((m,i)=><article key={i} style={{padding:15,borderRadius:10,background:m.role==='user'?'rgba(72,172,164,.14)':'rgba(112,133,178,.13)'}}><strong>{m.role==='user'?'You':'Conversation partner'}</strong><p style={{whiteSpace:'pre-wrap'}}>{m.content}</p>{m.feedback?<div style={{borderTop:'1px solid #8293a344',paddingTop:12}}><strong>Coach feedback {Number.isFinite(m.score)?'• '+m.score+'/100':''}</strong><p style={{whiteSpace:'pre-wrap'}}>{m.feedback}</p>{m.breakdown?<p style={{fontSize:13}}>Rapport {m.breakdown.rapport}/20 · Cues {m.breakdown.cueRecognition}/20 · Questions {m.breakdown.questioning}/20 · Listening {m.breakdown.listening}/20 · Autonomy {m.breakdown.autonomy}/20</p>:null}</div>:null}</article>)}
 </div>
 <label htmlFor="conversation-reply" style={{display:'block',fontWeight:700}}>Your response</label>
 <textarea id="conversation-reply" value={draft} onChange={e=>setDraft(e.target.value)} rows={4} maxLength={1800} placeholder="Write what you would really say..." style={{width:'100%',padding:14,borderRadius:10,margin:'8px 0 12px',color:'inherit',background:'transparent',border:'1px solid #8293a388'}}/>
 {err?<p role="alert" style={{color:'#f3a3a3'}}>{err}</p>:null}
 <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
 <button type="button" className="button primary" onClick={send} disabled={busy||!draft.trim()}>{busy?'Coaching...':'Respond & get feedback'}</button>
 <button type="button" className="button secondary" onClick={()=>{setMessages([]);setErr('');}}>Restart scenario</button>
 <button type="button" className="button secondary" onClick={finishDay}>{done.includes(day)?'Mark incomplete':'Mark lesson complete'}</button>
 <button type="button" className="button secondary" disabled={busy||rounds<3||!!debrief} onClick={finishConversation}>Finish and get detailed debrief</button>
 {day<30?<button type="button" className="button secondary" onClick={()=>startDay(day+1)}>Next day →</button>:null}
 </div>
 {debrief?<article style={{padding:20,marginTop:20,border:'1px solid #42bfae',borderRadius:12}}><h3>Part 4: Full conversation assessment</h3><p style={{whiteSpace:'pre-wrap'}}>{debrief.feedback}</p><p><strong>Overall performance:</strong> {debrief.score}/100</p><p>This is formative practice feedback, not a professional credential.</p></article>:null}
 {scores[day]!==undefined?<p>Latest coaching score for this lesson: <strong>{scores[day]}/100</strong></p>:null}
 <p style={{fontSize:13,opacity:.78,marginTop:15}}>Practice using fictional situations. Do not enter identifiable student, family or staff details. AI-generated characters and feedback can be imperfect. The transcript remains on this page during your session; lesson completion and latest scores are stored locally in your browser.</p>
 </section>
 <section className="card help-suite-panel" style={{padding:20}}><h3>Recommended reading</h3><p>Motivational Interviewing Network of Trainers (OARS); Harvard Program on Negotiation (strategic questioning); FBI elicitation awareness guidance. Practice ethical communication: clarity, choice, trust and respect.</p><Link href="/human-equation-suite" className="button secondary">Back to H.E.L.P.</Link></section>
 </div></HelpSuiteShell></div></section>;
}
