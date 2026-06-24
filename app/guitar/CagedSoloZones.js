'use client';

import { useMemo, useState } from 'react';
import { Fretboard } from './Fretboard';

const views = [
  { id: 'shape', label: 'Show chord shape' },
  { id: 'roots', label: 'Show root notes' },
  { id: 'chordTones', label: 'Show chord tones' },
  { id: 'pentatonic', label: 'Show pentatonic notes' },
  { id: 'safe', label: 'Show all safe solo notes' },
];

const chordShape = [
  { string: 'High E', fret: 3, note: 'G', role: 'root' },
  { string: 'B', fret: 3, note: 'D', role: '5' },
  { string: 'G', fret: 4, note: 'B', role: '3' },
  { string: 'D', fret: 5, note: 'G', role: 'root' },
  { string: 'A', fret: 5, note: 'D', role: '5' },
  { string: 'Low E', fret: 3, note: 'G', role: 'root' },
];

const soloZone = [
  { string: 'High E', frets: [3, 5] },
  { string: 'B', frets: [3, 5] },
  { string: 'G', frets: [2, 4] },
  { string: 'D', frets: [2, 5] },
  { string: 'A', frets: [2, 5] },
  { string: 'Low E', frets: [3, 5] },
];

const simpleSoloTab = `e|----------------3-5-3-------------|
B|------------3-5-------5-3---------|
G|------2-4-----------------4-2-----|
D|--2-5-------------------------5---|
A|----------------------------------|
E|----------------------------------|`;

function keyFor(string, fret) {
  return `${string}-${fret}`;
}

function makeHighlights(view) {
  const highlights = new Map();
  const add = ({ string, fret, note, role }, toneType = 'safe') => {
    highlights.set(keyFor(string, fret), {
      label: view === 'shape' && role ? role : note,
      type: note === 'G' ? 'root' : toneType,
    });
  };

  if (view === 'shape') {
    chordShape.forEach((position) => add(position, position.note === 'G' ? 'root' : 'chord'));
    return highlights;
  }

  const notesByKey = new Map(chordShape.map((position) => [keyFor(position.string, position.fret), position]));
  soloZone.forEach(({ string, frets }) => {
    frets.forEach((fret) => {
      const chordPosition = notesByKey.get(keyFor(string, fret));
      const position = chordPosition ?? { string, fret };
      if (view === 'roots' && chordPosition?.note !== 'G') return;
      if (view === 'chordTones' && !['G', 'B', 'D'].includes(chordPosition?.note)) return;
      const note = chordPosition?.note ?? getPentatonicNote(string, fret);
      if (!note) return;
      add({ ...position, note, role: chordPosition?.role }, ['G', 'B', 'D'].includes(note) ? 'chord' : 'pentatonic');
    });
  });

  return highlights;
}

function getPentatonicNote(string, fret) {
  const notes = {
    'High E-3': 'G', 'High E-5': 'A',
    'B-3': 'D', 'B-5': 'E',
    'G-2': 'A', 'G-4': 'B',
    'D-2': 'E', 'D-5': 'G',
    'A-2': 'B', 'A-5': 'D',
    'Low E-3': 'G', 'Low E-5': 'A',
  };
  return notes[keyFor(string, fret)];
}

export function CagedSoloZones() {
  const [activeView, setActiveView] = useState('shape');
  const [soloPanel, setSoloPanel] = useState('tab');
  const highlights = useMemo(() => makeHighlights(activeView), [activeView]);

  return (
    <div className="caged-zones">
      <section className="caged-zone-panel" aria-labelledby="lesson-one-title">
        <div className="caged-zone-copy">
          <p className="guitar-kicker">Lesson 1</p>
          <h2 id="lesson-one-title">E-shape G chord solo zone</h2>
          <p>
            The E-shape G chord comes from moving the open E shape to the 3rd fret. Its root is on the
            6th string, 3rd fret. Around that chord shape, use G major pentatonic and G major chord tones.
          </p>
          <p>
            The goal is not just memorizing a scale box. The goal is seeing G, B, and D chord tones under
            your fingers and building simple phrases from them.
          </p>
        </div>
        <div className="practice-box">
          <h3>How to practice this</h3>
          <ol>
            <li>Hold the G E-shape chord.</li>
            <li>Find the root notes.</li>
            <li>Pick only 2 or 3 notes near the chord.</li>
            <li>Make a short phrase.</li>
            <li>End on G, B, or D.</li>
          </ol>
        </div>
      </section>

      <div className="zone-controls" aria-label="CAGED solo zone controls">
        {views.map((view) => (
          <button key={view.id} className={activeView === view.id ? 'active' : ''} type="button" onClick={() => setActiveView(view.id)}>
            {view.label}
          </button>
        ))}
      </div>

      <Fretboard
        mode="zone"
        title="G E-shape solo zone"
        instructions="Use the controls to reveal the chord shape, roots, chord tones, pentatonic notes, and safe solo notes around the 3rd fret."
        selectedNoteLabel="Current view"
        selectedNoteValue="G"
        selectedNoteDetail={views.find((view) => view.id === activeView)?.label}
        highlightedPositions={highlights}
      />

      <section className="simple-solo-card" aria-labelledby="simple-solo-title">
        <div>
          <p className="guitar-kicker">Simple Solo #1</p>
          <h2 id="simple-solo-title">Sweet G Major Phrase</h2>
          <p>
            This phrase uses notes from G major pentatonic. It sounds musical because it starts near the
            chord shape and resolves back toward safe chord tones.
          </p>
        </div>
        <div className="solo-buttons" aria-label="Simple solo controls">
          {['tab', 'notes', 'why', 'slowly'].map((panel) => (
            <button key={panel} className={soloPanel === panel ? 'active' : ''} type="button" onClick={() => setSoloPanel(panel)}>
              {panel === 'tab' ? 'Show tab' : panel === 'notes' ? 'Show notes' : panel === 'why' ? 'Show why it works' : 'Practice slowly'}
            </button>
          ))}
        </div>
        <pre className="solo-tab">{simpleSoloTab}</pre>
        <div className="solo-explainer">
          {soloPanel === 'notes' && 'Notes used: G, A, B, D, and E from G major pentatonic.'}
          {soloPanel === 'why' && 'It works because the phrase lives around the E-shape G chord and lands back on safe G chord tones: G, B, or D.'}
          {soloPanel === 'slowly' && 'Practice at a talking-speed tempo. Say the note names out loud, pause after each string, and make the last note feel finished.'}
          {soloPanel === 'tab' && 'Read the tab slowly from left to right. Keep your hand near frets 2 through 5.'}
        </div>
      </section>
    </div>
  );
}
