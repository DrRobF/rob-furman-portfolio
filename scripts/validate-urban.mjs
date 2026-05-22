import fs from 'fs';

const file = 'app/day-in-the-life-urban-student/page.js';
const txt = fs.readFileSync(file, 'utf8');
const sceneRegex = /\{\s*id:\s*'(scene_[^']+)'([\s\S]*?)choices:\s*\[([\s\S]*?)\]\s*,?\n\s*\}/g;
const scenes = [];
let m;
while ((m = sceneRegex.exec(txt))) {
  const id = m[1];
  const body = m[2];
  const choicesBlock = m[3];
  const sceneNumber = Number((body.match(/sceneNumber:\s*(\d+)/) || [])[1]);
  const choices = [...choicesBlock.matchAll(/\{[\s\S]*?id:\s*'([^']+)'[\s\S]*?nextSceneId:\s*'([^']+)'[\s\S]*?\}/g)].map((c) => ({ choiceId: c[1], nextSceneId: c[2] }));
  scenes.push({ id, sceneNumber, choices });
}

const errors = [];
const ids = scenes.map((s) => s.id);
const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
if (dupes.length) errors.push(`Duplicate scene ids: ${[...new Set(dupes)].join(', ')}`);
const sceneMap = Object.fromEntries(scenes.map((s) => [s.id, s]));
const allowBackward = new Set(['restart_from_report', 'face_reflection_room', 'continue_only_option']);
for (const s of scenes) {
  for (const c of s.choices) {
    if (!sceneMap[c.nextSceneId]) errors.push(`Missing next scene: ${s.id} -> ${c.nextSceneId}`);
    if (c.nextSceneId === s.id) errors.push(`Self loop without replay label: ${s.id} via ${c.choiceId}`);
    const target = sceneMap[c.nextSceneId];
    if (target && Number.isFinite(s.sceneNumber) && Number.isFinite(target.sceneNumber) && target.sceneNumber < s.sceneNumber && !allowBackward.has(c.choiceId)) {
      errors.push(`Backward route without allowBackward: ${s.id} (${s.sceneNumber}) -> ${target.id} (${target.sceneNumber}) via ${c.choiceId}`);
    }
  }
}
const start = 'scene_2am_bedroom';
const queue = [start];
const seen = new Set();
while (queue.length) {
  const id = queue.shift();
  if (seen.has(id) || !sceneMap[id]) continue;
  seen.add(id);
  for (const c of sceneMap[id].choices) queue.push(c.nextSceneId);
}
const OPTIONAL_UNREACHABLE = new Set(['scene_cool_teacher']);
const unreachable = ids.filter((id) => !seen.has(id) && !OPTIONAL_UNREACHABLE.has(id));
if (unreachable.length) errors.push(`Unreachable scenes: ${unreachable.join(', ')}`);
if (!seen.has('scene_urban_report_complete')) errors.push('No valid path to completion scene_urban_report_complete');

if (errors.length) {
  console.error('Urban scene graph validation failed:\n- ' + errors.join('\n- '));
  process.exit(1);
}
console.log(`Urban scene graph validation passed (${scenes.length} scenes).`);
