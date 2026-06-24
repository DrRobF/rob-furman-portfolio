'use client';

import { useEffect, useMemo, useState } from 'react';
import { Fretboard, getFretboardStrings, getNoteAtFret } from './Fretboard';

const chromaticNotes = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
const selectableChords = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const selectableShapes = ['C', 'A', 'G', 'E', 'D'];

const views = [
  { id: 'shape', label: 'Chord shape' },
  { id: 'roots', label: 'Roots' },
  { id: 'chordTones', label: 'Chord tones' },
  { id: 'pentatonic', label: 'Pentatonic' },
  { id: 'safe', label: 'Safe solo notes' },
];

const shapeTemplates = {
  C: { base: 'C', positions: [
    { string: 'A', fret: 3 }, { string: 'D', fret: 2 }, { string: 'G', fret: 0 }, { string: 'B', fret: 1 }, { string: 'High E', fret: 0 },
  ] },
  A: { base: 'A', positions: [
    { string: 'A', fret: 0 }, { string: 'D', fret: 2 }, { string: 'G', fret: 2 }, { string: 'B', fret: 2 }, { string: 'High E', fret: 0 },
  ] },
  G: { base: 'G', positions: [
    { string: 'Low E', fret: 3 }, { string: 'A', fret: 2 }, { string: 'D', fret: 0 }, { string: 'G', fret: 0 }, { string: 'B', fret: 0 }, { string: 'High E', fret: 3 },
  ] },
  E: { base: 'E', positions: [
    { string: 'Low E', fret: 0 }, { string: 'A', fret: 2 }, { string: 'D', fret: 2 }, { string: 'G', fret: 1 }, { string: 'B', fret: 0 }, { string: 'High E', fret: 0 },
  ] },
  D: { base: 'D', positions: [
    { string: 'D', fret: 0 }, { string: 'G', fret: 2 }, { string: 'B', fret: 3 }, { string: 'High E', fret: 2 },
  ] },
};

const practiceCards = [
  { title: 'Hold the G E-shape chord', steps: ['Barre the 3rd fret.', 'Form the E-shape major chord.', 'Strum once.', 'Find every G root inside the shape.', 'Pick only the roots.', 'Strum the chord again.'] },
  { title: 'Chord tones only', steps: ['Keep your hand near the G E-shape.', 'Pick only G, B, and D.', 'Make a 3-note phrase.', 'End on G.'] },
  { title: 'Add pentatonic notes', steps: ['Add A and E to the G, B, D notes.', 'Play slowly.', 'End each phrase on G, B, or D.'] },
  { title: 'Make it musical', steps: ['Play a short phrase.', 'Leave space.', 'Repeat the phrase.', 'Change the ending note.'] },
];

const prompts = ['Play only roots', 'Play only chord tones', 'Add one passing note', 'Repeat a phrase twice', 'End on the 3rd', 'End on the root', 'Play two notes, then strum'];

function keyFor(string, fret) {
  return `${string}-${fret}`;
}

function transposeDistance(fromNote, toNote) {
  return (chromaticNotes.indexOf(toNote) - chromaticNotes.indexOf(fromNote) + 12) % 12;
}

function scaleNotes(root, intervals) {
  const rootIndex = chromaticNotes.indexOf(root);
  return intervals.map((interval) => chromaticNotes[(rootIndex + interval) % 12]);
}

function buildChordShape(chord, shape) {
  const template = shapeTemplates[shape];
  const shift = transposeDistance(template.base, chord);
  return template.positions
    .map((position) => {
      const fret = position.fret + shift;
      const note = getNoteAtFret(getFretboardStrings().find((string) => string.octaveName === position.string).startNote, fret);
      const role = note === chord ? '1' : note === scaleNotes(chord, [4])[0] ? '3' : '5';
      return { ...position, fret, note, role };
    })
    .filter((position) => position.fret >= 0 && position.fret <= 12);
}

function makeHighlights(view, chord, shape) {
  const chordShape = buildChordShape(chord, shape);
  const chordTones = new Set(scaleNotes(chord, [0, 4, 7]));
  const pentatonic = new Set(scaleNotes(chord, [0, 2, 4, 7, 9]));
  const shapeKeys = new Set(chordShape.map((position) => keyFor(position.string, position.fret)));
  const shapeFrets = chordShape.map((position) => position.fret);
  const minFret = Math.max(0, Math.min(...shapeFrets) - 2);
  const maxFret = Math.min(12, Math.max(...shapeFrets) + 2);
  const highlights = new Map();

  const add = (position, type, label = position.note) => {
    highlights.set(keyFor(position.string, position.fret), { label, type });
  };

  chordShape.forEach((position) => {
    if (view === 'shape') add(position, position.note === chord ? 'root' : 'chord', position.role);
    if (view === 'roots' && position.note === chord) add(position, 'root');
    if (view === 'chordTones' && chordTones.has(position.note)) add(position, position.note === chord ? 'root' : 'chord');
  });

  if (['pentatonic', 'safe'].includes(view)) {
    getFretboardStrings().forEach((string) => {
      string.notes.forEach(({ fret, note }) => {
        if (fret < minFret || fret > maxFret || !pentatonic.has(note)) return;
        const isChordTone = chordTones.has(note);
        if (view === 'safe') add({ string: string.octaveName, fret, note }, isChordTone ? (note === chord ? 'root' : 'target') : 'passing');
        else add({ string: string.octaveName, fret, note }, isChordTone ? (note === chord ? 'root' : 'chord') : 'pentatonic');
      });
    });
    chordShape.forEach((position) => {
      if (shapeKeys.has(keyFor(position.string, position.fret))) add(position, position.note === chord ? 'root' : 'target');
    });
  }

  return highlights;
}

export function CagedSoloZones() {
  const [activeView, setActiveView] = useState('shape');
  const [chord, setChord] = useState('G');
  const [shape, setShape] = useState('E');
  const [cardIndex, setCardIndex] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [promptIndex, setPromptIndex] = useState(0);
  const highlights = useMemo(() => makeHighlights(activeView, chord, shape), [activeView, chord, shape]);
  const currentCard = practiceCards[cardIndex];

  useEffect(() => {
    if (seconds <= 0) return undefined;
    const timer = setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  const chordTones = scaleNotes(chord, [0, 4, 7]).join(', ');
  const pentatonic = scaleNotes(chord, [0, 2, 4, 7, 9]).join(', ');

  return (
    <div className="caged-zones">
      <section className="caged-zone-panel" aria-labelledby="lesson-one-title">
        <div className="caged-zone-copy">
          <p className="guitar-kicker">Practice-first CAGED</p>
          <h2 id="lesson-one-title">Choose a chord. Hold a shape. Play from it.</h2>
          <p>Cast this screen to a TV, hold your guitar, and use the fretboard as a room-readable practice map.</p>
          <p><strong>Chord tones:</strong> {chordTones}. <strong>Major pentatonic:</strong> {pentatonic}. Safe solo notes show chord tones as targets and pentatonic passing notes as lighter colors.</p>
        </div>
        <div className="practice-box"><h3>Practice rule</h3><ol><li>Hold the chord shape first.</li><li>Find roots.</li><li>Target chord tones.</li><li>Add passing notes only after the targets feel easy.</li></ol></div>
      </section>

      <div className="caged-picker" aria-label="Chord and CAGED shape controls">
        <fieldset><legend>Key / chord</legend>{selectableChords.map((item) => <button key={item} className={chord === item ? 'active' : ''} type="button" onClick={() => setChord(item)}>{item}</button>)}</fieldset>
        <fieldset><legend>Shape</legend>{selectableShapes.map((item) => <button key={item} className={shape === item ? 'active' : ''} type="button" onClick={() => setShape(item)}>{item} shape</button>)}</fieldset>
      </div>

      <div className="zone-controls" aria-label="CAGED solo zone controls">
        {views.map((view) => <button key={view.id} className={activeView === view.id ? 'active' : ''} type="button" onClick={() => setActiveView(view.id)}>{view.label}</button>)}
      </div>

      <Fretboard mode="zone" title={`${chord} ${shape}-shape practice map`} instructions="Chord tones are target notes. Pentatonic passing notes add motion, but should resolve back to a target note." selectedNoteLabel="Current map" selectedNoteValue={`${chord}`} selectedNoteDetail={`${shape} shape · ${views.find((view) => view.id === activeView)?.label}`} highlightedPositions={highlights} />

      <div className="note-legend" aria-label="Fretboard color legend"><span className="root">Root</span><span className="target">Target chord tone</span><span className="passing">Passing pentatonic note</span></div>

      <section className="tv-practice-mode" aria-labelledby="tv-practice-title">
        <div className="tv-practice-header"><p className="guitar-kicker">TV Practice Mode</p><h2 id="tv-practice-title">{currentCard.title}</h2><div className="timer-display">{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</div></div>
        <ol className="practice-card-steps">{currentCard.steps.map((step) => <li key={step}>{step}</li>)}</ol>
        <div className="practice-prompt"><span>What to play now</span><strong>{prompts[promptIndex]}</strong></div>
        <div className="practice-controls"><button type="button" onClick={() => setCardIndex((cardIndex + practiceCards.length - 1) % practiceCards.length)}>Previous</button><button type="button" onClick={() => { setCardIndex((cardIndex + 1) % practiceCards.length); setPromptIndex((promptIndex + 1) % prompts.length); }}>Next</button><button type="button" onClick={() => setSeconds(0)}>Reset</button><button type="button" onClick={() => setSeconds(30)}>30 sec</button><button type="button" onClick={() => setSeconds(60)}>60 sec</button><button type="button" onClick={() => setSeconds(120)}>2 min</button></div>
      </section>
    </div>
  );
}
