import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
const LIMIT = 22;
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
export async function POST(request) {
 try {
  const body = await request.json();
  const mode = body.mode === 'debrief' ? 'debrief' : 'turn';
  const messages = Array.isArray(body.messages) ? body.messages.slice(-LIMIT) : [];
  if (!messages.length || messages.some(m => !['user','assistant'].includes(m.role) || typeof m.content !== 'string' || m.content.length > 2200)) return NextResponse.json({error:'Invalid conversation.'},{status:400});
  if (!process.env.OPENAI_API_KEY) return NextResponse.json({error:'AI coaching is not configured.'},{status:503});
  const day=clamp(Number(body.day)||1,1,30);
  const title=String(body.title||'Conversation mastery').slice(0,130);
  const principle=String(body.principle||'').slice(0,1000);
  const scenario=String(body.scenario||'').slice(0,1400);
  const persona=String(body.persona||'').slice(0,1600);
  const rounds=messages.filter(m=>m.role==='user').length;
  const history=Array.isArray(body.learningHistory)?body.learningHistory.slice(-6).map(x=>({day:Number(x.day)||0,score:Number(x.score)||0,feedback:String(x.feedback||'').slice(0,500)})):[];
  const system = `You are Coach, an exceptionally skilled but candid conversation instructor. You also portray ONE fictional human in a long-form role-play. This is Day ${day} of 30: ${title}. Core teaching point: ${principle}. Scenario: ${scenario}. Character background and hidden motivations (do not reveal unless earned naturally): ${persona}.
Previous coaching from other days (use this only when relevant; never invent improvement): ${JSON.stringify(history)}. If a specific earlier mistake recurs, name that pattern and give actionable instruction. If it has improved, explain exactly what changed. On low scores, demonstrate an improved response and invite a retry rather than giving only a number. The ongoing conversation matters. Preserve all previously disclosed facts, emotional trajectory, setting and character details; never reset character every turn. Respond to the user's most recent words naturally IN CHARACTER, 2-4 substantial paragraphs and some physical / emotional reactions. Don't automatically agree; realistic reserved people may be brief, correct misleading assumptions, disagree, reciprocate, ask a question, or set boundaries. Information should emerge over 5-8 realistic rounds, not immediately after a clever prompt. Keep personal boundaries voluntary. The goal is understanding, not extracting secrets.
After the character response, coach the user's exact wording for 90-170 words with an honest strength, a specific missed opportunity or leading assumption, and one practical improvement. Scores are formative heuristics, not scientific measurement. Evaluate five categories 0-20: rapport, cueRecognition, questioning, listening, autonomy. Not every turn needs a question. A great answer to a direct question may score full points for questioning even with no question. Write balanced scores, not reflexive 90s. Include specific evidence from user's utterance, without spoilers.
If mode=debrief, stop roleplay and produce a detailed 200-350 word skill debrief explaining turning points, missed clues, a revised sample response, next practice targets, and remaining growth areas. Score the overall conversation, not just final turn. Otherwise character keeps the dialogue moving. 
OUTPUT ONLY JSON: {"character":"...","feedback":"...","scores":{"rapport":0,"cueRecognition":0,"questioning":0,"listening":0,"autonomy":0},"score":0,"complete":false}. For debrief set character="" and complete=true. Total score must equal sum of five categories. No code fence.`;
  const conversationMessages = messages.map(m=>({role:m.role,content:m.content.slice(0,2000)}));
  const response=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{Authorization:'Bearer '+process.env.OPENAI_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({model:process.env.CONVERSATION_COACH_MODEL||process.env.OPENAI_MODEL||'gpt-4o-mini',temperature:0.7,response_format:{type:'json_object'},messages:[{role:'system',content:system},...conversationMessages]})});
  if(!response.ok) return NextResponse.json({error:'Coaching service unavailable right now.'},{status:502});
  const json=await response.json(); const parsed=JSON.parse(json.choices?.[0]?.message?.content||'{}');
  const categories=['rapport','cueRecognition','questioning','listening','autonomy'];
  const scores=Object.fromEntries(categories.map(k=>[k,clamp(Math.round(Number(parsed.scores?.[k])||0),0,20)]));
  return NextResponse.json({character:String(parsed.character||'').slice(0,3500),feedback:String(parsed.feedback||'').slice(0,3500),scores,score:categories.reduce((a,k)=>a+scores[k],0),complete:mode==='debrief',rounds});
 } catch {return NextResponse.json({error:'Unable to complete this practice. Please retry.'},{status:500});}
}
