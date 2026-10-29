import { NextResponse } from 'next/server';
export const runtime='nodejs';
const DAY_LIMIT=14;
export async function POST(request){
 try{
  const body=await request.json();
  const messages=Array.isArray(body.messages)?body.messages.slice(-DAY_LIMIT):[];
  if(!messages.length||messages.some(m=>!['user','assistant'].includes(m.role)||typeof m.content!=='string'||m.content.length>2200))return NextResponse.json({error:'Invalid conversation.'},{status:400});
  const key=process.env.OPENAI_API_KEY;
  if(!key)return NextResponse.json({error:'AI coaching is not configured yet.'},{status:503});
  const instructions=`You run a fictional, ethical interpersonal communication training simulation. Lesson: ${String(body.title||'Conversation mastery').slice(0,120)} (Day ${Number(body.day)||1}). Principle: ${String(body.principle||'').slice(0,900)}. Scenario: ${String(body.scenario||'').slice(0,900)}.
Maintain a consistent fictional character and context. The assistant output MUST respond to the user's MOST RECENT utterance IN CHARACTER first, then coach. Avoid automatically praising or disclosing hidden concerns; let the character correct assumptions, decline to answer or shift topics naturally. Never imply that elicitation should force disclosure, invent expertise scores as clinical diagnoses, or recommend manipulative/deceptive pressure. Score last user response 0-100 as an informal teaching heuristic based on five equally weighted categories: rapport, cue recognition, nonleading questioning, responsiveness/listening, autonomy/boundaries. Asking no question may be ideal. Avoid disclosing any hidden character backstory as coaching spoilers. Return only valid JSON with fields character (string, 50-180 words), feedback (string, candid 70-130 words with specific actionable critique and next move), score (integer 0-100). No markdown fences.`;
  const input=messages.map(m=>({role:m.role,content:m.role==='assistant'?m.content.slice(0,1800):m.content.slice(0,1800)}));
  const result=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify({model:process.env.OPENAI_MODEL||'gpt-4o-mini',temperature:0.65,response_format:{type:'json_object'},messages:[{role:'system',content:instructions},...input]})});
  if(!result.ok)throw new Error('AI service unavailable');
  const json=await result.json();const parsed=JSON.parse(json.choices?.[0]?.message?.content||'{}');
  return NextResponse.json({character:String(parsed.character||'').slice(0,2000),feedback:String(parsed.feedback||'').slice(0,2200),score:Math.max(0,Math.min(100,Math.round(Number(parsed.score)||0)))});
 }catch{return NextResponse.json({error:'Could not complete the practice turn. Please retry.'},{status:500});}
}
