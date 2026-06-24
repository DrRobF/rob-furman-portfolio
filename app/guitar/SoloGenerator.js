'use client';

import { useMemo, useState } from 'react';

const keys = ['A', 'C', 'D', 'E', 'G'];
const styles = ['Blues', 'Rock', 'Soulful Major', 'Country-ish'];
const difficulties = ['Beginner', 'Easy-Plus'];

const learningPrompts = [
  'Find the root notes first.',
  'Circle the notes that repeat.',
  'Play it once slowly.',
  'Play it again and change the ending.',
  'Notice which notes land on the chord changes.',
];

const progressions = {
  'A-Blues': ['A7', 'D7', 'A7', 'A7', 'D7', 'D7', 'A7', 'E7'],
  'E-Rock': ['E5', 'G', 'A', 'E5', 'E5', 'G', 'A', 'B'],
  'G-Soulful Major': ['G', 'C', 'G', 'D', 'Em', 'C', 'G', 'D'],
};

const fallbackProgressions = {
  C: ['C', 'F', 'C', 'G', 'Am', 'F', 'C', 'G'],
  D: ['D', 'G', 'D', 'A', 'Bm', 'G', 'D', 'A'],
};

const phraseLibrary = {
  A: {
    Blues: [
      'e|----------------|\nB|-----5----------|\nG|-5h6---6-5------|\nD|-----------7----|\nA|----------------|\nE|----------------|',
      'e|---------5------|\nB|-5---8-5---8-5--|\nG|---6------------|\nD|----------------|\nA|----------------|\nE|----------------|',
      'e|----------------|\nB|-----5----------|\nG|-7b9---7-5------|\nD|-----------7----|\nA|----------------|\nE|----------------|',
      'e|----------------|\nB|-5-----5--------|\nG|---7-5---6------|\nD|-----------7----|\nA|----------------|\nE|----------------|',
    ],
  },
  E: {
    Rock: [
      'e|----------------|\nB|----------------|\nG|-----2-4-2------|\nD|-2-4-------4-2--|\nA|----------------|\nE|----------------|',
      'e|----------------|\nB|-----3----------|\nG|-2h4---4-2------|\nD|-----------4----|\nA|----------------|\nE|----------------|',
      'e|----------------|\nB|----------------|\nG|-4-2------------|\nD|-----4-2--------|\nA|---------2------|\nE|----------------|',
      'e|-----3-0--------|\nB|-3-0-----3-0----|\nG|-------------2--|\nD|----------------|\nA|----------------|\nE|----------------|',
    ],
  },
  G: {
    'Soulful Major': [
      'e|----------------|\nB|-----3-5-3------|\nG|-2h4-------4-2--|\nD|----------------|\nA|----------------|\nE|----------------|',
      'e|-------3--------|\nB|-3-5-----5-3----|\nG|-----4-------4--|\nD|----------------|\nA|----------------|\nE|----------------|',
      'e|----------------|\nB|-3-----3--------|\nG|---4-2---4-2----|\nD|-------------5--|\nA|----------------|\nE|----------------|',
      'e|-----3----------|\nB|-3-5---5-3------|\nG|-----------4----|\nD|----------------|\nA|----------------|\nE|----------------|',
    ],
  },
  D: {
    'Country-ish': [
      'e|-2-3-2----------|\nB|-------3--------|\nG|---------2------|\nD|----------------|\nA|----------------|\nE|----------------|',
      'e|-----2-5-2------|\nB|-3-5-------5-3--|\nG|----------------|\nD|----------------|\nA|----------------|\nE|----------------|',
      'e|-2-----2--------|\nB|---3-5---3------|\nG|-----------2----|\nD|----------------|\nA|----------------|\nE|----------------|',
    ],
  },
  C: {
    'Soulful Major': [
      'e|----------------|\nB|-----5-6-5------|\nG|-5h7-------7-5--|\nD|----------------|\nA|----------------|\nE|----------------|',
      'e|-----5----------|\nB|-5-6---6-5------|\nG|-----------5----|\nD|----------------|\nA|----------------|\nE|----------------|',
      'e|----------------|\nB|-5-----5--------|\nG|---7-5---5------|\nD|-----------7----|\nA|----------------|\nE|----------------|',
    ],
  },
};

const styleBackups = {
  Blues: phraseLibrary.A.Blues,
  Rock: phraseLibrary.E.Rock,
  'Soulful Major': phraseLibrary.G['Soulful Major'],
  'Country-ish': phraseLibrary.D['Country-ish'],
};

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function getProgression(key, style) {
  if (key === 'A' && style === 'Blues') return progressions['A-Blues'];
  if (key === 'E' && style === 'Rock') return progressions['E-Rock'];
  if (key === 'G' && style === 'Soulful Major') return progressions['G-Soulful Major'];
  return fallbackProgressions[key] || progressions['G-Soulful Major'];
}

function buildSolo(key, style, difficulty, emphasis = '') {
  const bank = phraseLibrary[key]?.[style] || styleBackups[style] || styleBackups.Blues;
  const motif = pick(bank);
  const bars = Array.from({ length: 8 }, (_, index) => (index === 2 || index === 6 ? motif : pick(bank)));
  const tempoBase = difficulty === 'Beginner' ? 72 : 88;
  const tempoBoost = style === 'Rock' ? 8 : style === 'Country-ish' ? 4 : 0;

  return {
    title: `${key} ${emphasis || style} TV Practice Solo`,
    key,
    style,
    difficulty,
    suggestedTempo: `${tempoBase + tempoBoost}–${tempoBase + tempoBoost + 12} bpm`,
    chordProgression: getProgression(key, style).join(' | '),
    tab: bars.map((bar, index) => `Bar ${index + 1}\n${bar}`).join('\n\n'),
    practiceNotes: [
      `Stay near frets 2–8 and keep your first finger relaxed before each phrase.`,
      `Bars 3 and 7 repeat a motif so the solo sounds intentional, not random.`,
      difficulty === 'Beginner' ? 'Use downstrokes first, then add hammer-ons only after the rhythm feels steady.' : 'Add small bends or slides only on notes you can already play in time.',
    ],
    whyItWorks: `${key} ${style} uses mostly pentatonic shapes, repeats a short idea, and lands phrases on roots or chord tones when the harmony changes. The rests leave space so a beginner can reset their hand and still sound musical.`,
  };
}

export function SoloGenerator() {
  const [keyName, setKeyName] = useState('A');
  const [style, setStyle] = useState('Blues');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [emphasis, setEmphasis] = useState('');
  const [soloSeed, setSoloSeed] = useState(0);
  const [showWhy, setShowWhy] = useState(true);
  const [showSteps, setShowSteps] = useState(true);

  const solo = useMemo(() => buildSolo(keyName, style, difficulty, emphasis), [keyName, style, difficulty, emphasis, soloSeed]);

  const regenerate = (nextEmphasis = emphasis) => {
    setEmphasis(nextEmphasis);
    setSoloSeed((value) => value + 1);
  };

  return (
    <div className="solo-generator">
      {/* TODO: audio playback */}
      {/* TODO: backing tracks */}
      {/* TODO: animated note-by-note fretboard playback */}
      {/* TODO: save favorite solos */}
      {/* TODO: AI-generated solos */}
      {/* TODO: print/export tab */}
      <section className="solo-generator-controls" aria-label="Solo generator controls">
        <fieldset><legend>Key</legend>{keys.map((item) => <button className={keyName === item ? 'active' : ''} key={item} type="button" onClick={() => setKeyName(item)}>{item}</button>)}</fieldset>
        <fieldset><legend>Style</legend>{styles.map((item) => <button className={style === item ? 'active' : ''} key={item} type="button" onClick={() => setStyle(item)}>{item}</button>)}</fieldset>
        <fieldset><legend>Difficulty</legend>{difficulties.map((item) => <button className={difficulty === item ? 'active' : ''} key={item} type="button" onClick={() => setDifficulty(item)}>{item}</button>)}</fieldset>
        <button className="solo-generate-button" type="button" onClick={() => regenerate('')}>Generate New Solo</button>
      </section>

      <section className="solo-output-card" aria-labelledby="generated-solo-title">
        <div className="solo-output-header">
          <div><p className="guitar-kicker">Generated 8-bar solo</p><h2 id="generated-solo-title">{solo.title}</h2></div>
          <div className="solo-meta"><span>Key: {solo.key}</span><span>Style: {solo.style}</span><span>Tempo: {solo.suggestedTempo}</span></div>
        </div>
        <p className="solo-progression"><strong>Chord progression:</strong> {solo.chordProgression}</p>
        <pre className="solo-tab">{solo.tab}</pre>
        <div className="solo-buttons" aria-label="Solo action buttons">
          <button type="button" onClick={() => regenerate('')}>Generate New Solo</button>
          <button type="button" onClick={() => { setDifficulty('Beginner'); regenerate('Easier'); }}>Easier</button>
          <button type="button" onClick={() => { setStyle('Blues'); regenerate('More Bluesy'); }}>More Bluesy</button>
          <button type="button" onClick={() => { setStyle('Rock'); regenerate('More Rock'); }}>More Rock</button>
          <button className={showWhy ? 'active' : ''} type="button" onClick={() => setShowWhy((value) => !value)}>Show Why It Works</button>
          <button className={showSteps ? 'active' : ''} type="button" onClick={() => setShowSteps((value) => !value)}>Show Practice Steps</button>
        </div>
        <div className="solo-learning-grid">
          <div className="practice-box"><h3>Practice notes</h3><ul>{solo.practiceNotes.map((note) => <li key={note}>{note}</li>)}</ul></div>
          {showWhy && <div className="solo-explainer"><h3>Why it works</h3><p>{solo.whyItWorks}</p></div>}
          {showSteps && <div className="practice-box"><h3>Learning prompts</h3><ol>{learningPrompts.map((prompt) => <li key={prompt}>{prompt}</li>)}</ol></div>}
        </div>
      </section>
    </div>
  );
}
