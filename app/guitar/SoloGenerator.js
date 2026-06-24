'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const keys = ['A', 'C', 'D', 'E', 'G'];
const styles = ['Blues', 'Rock', 'Soulful Major', 'Country-ish'];
const difficulties = ['Beginner', 'Easy-Plus'];


const playbackTempos = {
  Slow: 60,
  Medium: 82,
  'Full Speed': 104,
};

const stringMidi = {
  e: 64,
  B: 59,
  G: 55,
  D: 50,
  A: 45,
  E: 40,
};

function midiToFrequency(midi) {
  return 440 * (2 ** ((midi - 69) / 12));
}

function parseTabBar(tab) {
  const lines = tab.split('\n').map((line) => {
    const match = line.match(/^([eBGDAE])\|([^|]*)\|/);
    return match ? { string: match[1], notes: match[2] } : null;
  }).filter(Boolean);
  const events = [];

  lines.forEach((line) => {
    const baseMidi = stringMidi[line.string];
    if (baseMidi === undefined) return;

    for (let index = 0; index < line.notes.length; index += 1) {
      if (!/\d/.test(line.notes[index])) continue;

      const fretStart = index;
      let fretText = '';
      while (index < line.notes.length && /\d/.test(line.notes[index])) {
        fretText += line.notes[index];
        index += 1;
      }

      const before = line.notes[fretStart - 1] || '';
      const after = line.notes[index] || '';
      const marking = after === 'b' ? 'bend' : after === 'h' || before === 'h' ? 'hammer' : after === '/' || after === '\\' || before === '/' || before === '\\' ? 'slide' : '';

      events.push({
        offset: fretStart / Math.max(line.notes.length, 1),
        midi: baseMidi + Number(fretText),
        marking,
      });

      index -= 1;
    }
  });

  return events.sort((a, b) => a.offset - b.offset || b.midi - a.midi);
}

function tabToPlaybackEvents(bars) {
  const barBeats = 4;
  const notes = bars.flatMap((bar, barIndex) => parseTabBar(bar.tab).map((note) => ({
    ...note,
    beat: (barIndex * barBeats) + (note.offset * barBeats),
  })));

  return notes.map((note, index) => {
    const nextBeat = notes[index + 1]?.beat ?? ((bars.length + 0.15) * barBeats);
    return {
      ...note,
      durationBeats: Math.max(0.22, Math.min(0.9, nextBeat - note.beat)),
    };
  });
}

function playPluckedNote(audioContext, destination, event, startTime, secondsPerBeat) {
  const oscillator = audioContext.createOscillator();
  const overtone = audioContext.createOscillator();
  const filter = audioContext.createBiquadFilter();
  const gain = audioContext.createGain();
  const frequency = midiToFrequency(event.midi);
  const duration = Math.max(0.12, event.durationBeats * secondsPerBeat * 0.9);

  oscillator.type = 'triangle';
  overtone.type = 'sawtooth';
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(2200, startTime);
  filter.frequency.exponentialRampToValueAtTime(520, startTime + duration);
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(0.26, startTime + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  oscillator.frequency.setValueAtTime(frequency, startTime);
  overtone.frequency.setValueAtTime(frequency * 2.01, startTime);

  if (event.marking === 'bend') {
    oscillator.frequency.linearRampToValueAtTime(frequency * 1.06, startTime + Math.min(0.24, duration * 0.65));
    overtone.frequency.linearRampToValueAtTime(frequency * 2.13, startTime + Math.min(0.24, duration * 0.65));
  }

  if (event.marking === 'slide') {
    oscillator.frequency.setValueAtTime(frequency * 0.94, startTime);
    oscillator.frequency.linearRampToValueAtTime(frequency, startTime + Math.min(0.16, duration * 0.45));
    overtone.frequency.setValueAtTime(frequency * 1.88, startTime);
    overtone.frequency.linearRampToValueAtTime(frequency * 2.01, startTime + Math.min(0.16, duration * 0.45));
  }

  if (event.marking === 'hammer') {
    gain.gain.setValueAtTime(0.13, startTime + Math.min(0.1, duration * 0.35));
    gain.gain.exponentialRampToValueAtTime(0.22, startTime + Math.min(0.16, duration * 0.55));
  }

  oscillator.connect(filter);
  overtone.connect(filter);
  filter.connect(gain);
  gain.connect(destination);
  oscillator.start(startTime);
  overtone.start(startTime);
  oscillator.stop(startTime + duration + 0.04);
  overtone.stop(startTime + duration + 0.04);
}

const learningPrompts = [
  'Find the root notes first.',
  'Circle the notes that repeat.',
  'Play it once slowly.',
  'Play it again and change the ending.',
  'Notice which notes land on the chord changes.',
];

const progressions = {
  Blues: ['A7', 'D7', 'A7', 'A7', 'D7', 'D7', 'A7', 'E7'],
  Rock: ['E5', 'G', 'A', 'E5', 'E5', 'G', 'A', 'B'],
  'Soulful Major': ['G', 'C', 'G', 'D', 'Em', 'C', 'G', 'D'],
  'Country-ish': ['D', 'G', 'D', 'A', 'D', 'G', 'A', 'D'],
};

const cleanTab = ({ e = '--------------------', B = '--------------------', G = '--------------------', D = '--------------------', A = '--------------------', E = '--------------------' }) => `e|${e}|
B|${B}|
G|${G}|
D|${D}|
A|${A}|
E|${E}|`;

const makeBars = (style, bars) => bars.map((tab, index) => ({
  number: index + 1,
  chord: progressions[style][index],
  tab: cleanTab(tab),
}));

const solo = (title, vibe, why, bars) => ({ title, vibe, why, bars });

const curatedSolos = {
  Blues: [
    solo('Front Porch A Blues', 'Shuffle call-and-response', 'Short A minor pentatonic ideas answer each other, with the C to C# blues move resolving against A7.', [
      { B: '------------5h8-5---', G: '--------5h6-------6--' }, { e: '-----------5--------', B: '-------5h8---8-5----', G: '-----6-----------6--' }, { B: '-----5--------------', G: '-7b9---7-5----------', D: '-----------7--------' }, { B: '-----5---5----------', G: '---5h6---6-5--------', D: '-7-----------7------' }, { e: '---------5----------', B: '-----5h8---8-5------', G: '---6-----------6----' }, { B: '-8-5----------------', G: '-----7-5------------', D: '---------7-5h7------' }, { B: '-----5--------------', G: '-5h6---6-5----------', D: '-----------7--------' }, { e: '-----5--------------', B: '-8-5---8-5----------', G: '-----------6--------' },
    ]),
    solo('Slow Bend A Blues', 'Big bends with space', 'The solo leaves room after each answer so the bend notes can sound vocal instead of crowded.', [
      { B: '-----5--------------', G: '-7b9---7-5----------', D: '-----------7--------' }, { e: '---------5----------', B: '-----5h8---8-5------', G: '---6-----------6----' }, { B: '-5-----5------------', G: '---7-5---6----------', D: '-----------7--------' }, { G: '---5-6--------------', D: '-7-----7------------' }, { B: '-------5-8-5--------', G: '---5h6-------6------' }, { e: '-5------------------', B: '---8-5--------------', G: '-------7-5----------', D: '-----------7--------' }, { G: '-5-7b8-5------------', D: '---------7----------' }, { B: '-5------------------', G: '---6-5--------------', D: '-------7------------' },
    ]),
    solo('Box One Shuffle', 'Classic box-one movement', 'Everything stays in a comfortable A blues box so the phrase is easy to memorize and repeat.', [
      { B: '-------5------------', G: '-5h6-----6-5--------', D: '-------------7------' }, { e: '-----5--------------', B: '-5h8---8-5----------', G: '-----------6--------' }, { B: '-5---8-5------------', G: '---6-----7-5--------', D: '-------------7------' }, { G: '-5h6-5--------------', D: '-------7------------' }, { B: '-----5---8-5--------', G: '-5h6---6-----6------' }, { B: '-8-5----------------', G: '-----7-5------------', D: '---------7----------' }, { B: '-----5--------------', G: '-6-5----------------', D: '-----7--------------' }, { e: '---------5----------', B: '-----5h8---5--------', G: '---6---------6------' },
    ]),
    solo('Answer Back Blues', 'Question then answer', 'Bars 1–4 ask a simple idea, and bars 5–8 answer with the same rhythm landing more strongly.', [
      { G: '---5-6--------------', D: '-7-----7------------' }, { B: '-----5--------------', G: '---5h6---6----------', D: '-7----------7-------' }, { B: '-5-----5------------', G: '---7-5---6----------', D: '-----------7--------' }, { e: '-----5--------------', B: '-8-5---8-5----------', G: '-----------6--------' }, { B: '-------5-8-5--------', G: '---5h6-------6------' }, { e: '-5------------------', B: '---8-5--------------', G: '-------7-5----------', D: '-----------7--------' }, { B: '-----5---5----------', G: '-7b9---7---5--------', D: '-------------7------' }, { G: '-5h6----------------', D: '-----7--------------' },
    ]),
    solo('Easy Turnaround Blues', 'Beginner turnaround', 'The line keeps the final E7 bar clear and resolved for looped 8-bar practice.', [
      { B: '-----5--------------', G: '-5h6---6-5----------', D: '-----------7--------' }, { e: '-------5------------', B: '---5h8---8-5--------', G: '-6-----------6------' }, { B: '-5-5----------------', G: '-----7-5------------', D: '---------7----------' }, { G: '-5--------------', D: '---7---5-7----------' }, { B: '-----5-8-5----------', G: '-5h6-------6--------' }, { e: '---5----------------', B: '-8---8-5------------', G: '---------7b8-5------' }, { B: '-5---5--------------', G: '---7---5------------', D: '---------7----------' }, { e: '-----5--------------', B: '-8-5----------------', G: '-----6--------------' },
    ]),
  ],
  Rock: [
    solo('Garage E Rock', 'Punchy minor pentatonic', 'Repeated E minor pentatonic shapes make the line feel like a riff, not a scale exercise.', [
      { G: '-----2-4-2----------', D: '-2-4-------4-2------' }, { B: '-----3--------------', G: '-2h4---4-2----------', D: '-----------4--------' }, { G: '-2-2-4-2------------', D: '---------4-2--------' }, { e: '-----3-0------------', B: '-3-0-----3-0--------', G: '-------------2------' }, { D: '-2-4-5-4-2----------', A: '-----------2--------' }, { G: '-4b5-4-2------------', D: '---------4----------' }, { B: '-3-5-3--------------', G: '-------4-2----------' }, { G: '-4-2----------------', D: '-----2--------------' },
    ]),
    solo('Power Chord Answer', 'Rock call-and-answer', 'The upper strings answer the lower-string riff so each two-bar phrase has a clear hook.', [
      { D: '-2-4-5-4-2----------', A: '-----------2--------' }, { G: '-----2--------------', D: '-2-4---4-2----------' }, { B: '---3---3------------', G: '-4---4---2----------' }, { G: '-2/4-2--------------', D: '-------4-2----------' }, { G: '-2---2---4----------', D: '---4---4------------' }, { e: '-3-0----------------', B: '-----3-0------------', G: '---------2----------' }, { B: '---3-5b6-3----------', G: '-4---------4--------' }, { D: '-4-2----------------', A: '-----2--------------' },
    ]),
    solo('Open Road Rock', 'Driving eighth-note feel', 'Simple repeated rhythm keeps the solo locked to the groove and readable at TV distance.', [
      { G: '-2-4-2-4------------', D: '---------2----------' }, { B: '-----3--------------', G: '-4-2---4-2----------' }, { G: '-------2-4----------', D: '-2-4-5--------------' }, { G: '-4-2----------------', D: '-----4-2------------', A: '---------2----------' }, { B: '-3------------------', G: '---4-2--------------', D: '-------4-2----------' }, { e: '---------3----------', B: '-----3-5---5-3------' }, { G: '-2/4-2--------------', D: '-------4-2----------' }, { B: '-----3--------------', G: '-4-2----------------', D: '-----2--------------' },
    ]),
    solo('Arena Rock Mini', 'Bigger held notes', 'Held target notes and short slides create a bigger rock sound without making the tab dense.', [
      { B: '-----3--------------', G: '-2h4---4-2----------' }, { G: '-4-2----------------', D: '-----4-2------------', A: '---------2----------' }, { e: '---------3----------', B: '-----3-5---5-3------' }, { D: '-2-2----------------', A: '-----5-2------------' }, { G: '-----2-4-2----------', D: '-2-4-------4-2------' }, { B: '-3-5-3--------------', G: '-------4-2----------' }, { G: '-4b5-4-2------------', D: '---------4----------' }, { G: '-2------------------', D: '---4-2--------------' },
    ]),
    solo('Simple E Rock Loop', 'Loopable practice solo', 'The final bar resolves to E so the phrase can loop cleanly while practicing timing.', [
      { G: '-----2--------------', D: '-2-4---4-2----------' }, { G: '-2-2-4-2------------', D: '---------4-2--------' }, { B: '---3---3------------', G: '-4---4---2----------' }, { e: '-3-0----------------', B: '-----3-0------------', G: '---------2----------' }, { D: '-2-4-5-4-2----------' }, { G: '-2/4-2--------------', D: '-------4-2----------' }, { B: '-----3--------------', G: '-4-2---4-2----------' }, { G: '-4-2----------------', D: '-----2--------------' },
    ]),
  ],
};

curatedSolos['Soulful Major'] = [
  solo('Sweet G Major', 'Major pentatonic melody', 'The solo favors the sweet 3rd and 6th sounds and leaves space between answers.', makeBars('Soulful Major', [
    { B: '-----3-5-3----------', G: '-2h4-------4-2------' }, { e: '-------3------------', B: '-3-5-----5-3--------', G: '-----4-------4------' }, { B: '-3-----3------------', G: '---4-2---4-2--------', D: '-------------5------' }, { e: '-----3--------------', B: '-3-5---5-3----------', G: '-----------4--------' }, { B: '---3-5--------------', G: '-4-----4------------' }, { e: '-3------------------', B: '---5-3--------------', G: '-------4-2----------' }, { B: '-3h5-3--------------', G: '-------4-2----------' }, { B: '-5-3----------------', G: '-----4--------------' },
  ])),
  solo('Churchy G Answer', 'Warm call-and-response', 'Small slides and repeated answers make the major sound sing instead of run.', makeBars('Soulful Major', [
    { G: '-2-4-2--------------', D: '-------5------------' }, { B: '-----3--------------', G: '-2h4---4-2----------' }, { e: '-3-5-3--------------', B: '-------5-3----------' }, { B: '-3---3---5----------', G: '---4---4------------' }, { e: '-----3--------------', B: '-6-5---3------------', G: '---------4----------' }, { B: '---3----------------', G: '-4---2--------------' }, { B: '---3-5-3------------', G: '-4-------4-2--------' }, { e: '-3------------------', B: '---5-3--------------' },
  ])),
  solo('Porch Soul Major', 'Relaxed melodic phrase', 'The line uses fewer notes so the player can focus on tone and timing.', makeBars('Soulful Major', [
    { B: '---3-5--------------', G: '-4-----4------------' }, { e: '---------3----------', B: '-----3-5---5--------', G: '-2h4----------------' }, { B: '-3/5-3--------------', G: '-------4-2----------' }, { B: '---3-5-3------------', G: '-4-------4-2--------' }, { e: '-5-3----------------', B: '-----5-3------------', G: '---------4----------' }, { B: '-----3-5------------', G: '-2-4-----4----------' }, { B: '-3h5-3--------------', G: '-------4-2----------' }, { G: '-2h4----------------', D: '-----5--------------' },
  ])),
  solo('Major Lift', 'Climbing then resolving', 'Bars 5–6 lift the energy, then bars 7–8 settle back to a strong G chord tone.', makeBars('Soulful Major', [
    { e: '-----3--------------', B: '-3-5---5-3----------' }, { B: '-5-3----------------', G: '-----4-2------------', D: '---------5----------' }, { B: '-----3-5-3----------', G: '-2h4-------4-2------' }, { e: '-------3-5----------', B: '-3-5-6--------------' }, { B: '-3---3---5----------', G: '---4---4------------' }, { e: '---------3----------', B: '-----3-5---5--------' }, { e: '-5-3----------------', B: '-----5-3------------' }, { B: '-----3--------------', G: '-4-2----------------', D: '-----5--------------' },
  ])),
  solo('Simple Soul Loop', 'Easy TV-readable melody', 'Clear two-bar statements keep the solo easy to read and easy to loop.', makeBars('Soulful Major', [
    { B: '-----3--------------', G: '-2h4---4-2----------' }, { e: '-3-5-3--------------', B: '-------5-3----------' }, { B: '-3-----3------------', G: '---4-2---4-2--------' }, { e: '-----3--------------', B: '-3-5---5-3----------' }, { G: '-2-4-2--------------', D: '-------5------------' }, { B: '---3-5--------------', G: '-4-----4------------' }, { B: '-5-3----------------', G: '-----4-2------------' }, { e: '-3------------------', B: '---5-3--------------' },
  ])),
];

curatedSolos['Country-ish'] = [
  solo('Bright D Country', 'Major pentatonic snap', 'Hammer-ons and open-position shapes create a country feel while staying easy to read.', makeBars('Country-ish', [
    { e: '-2-3-2--------------', B: '-------3------------', G: '---------2----------' }, { e: '-----2-5-2----------', B: '-3-5-------5-3------' }, { e: '-2-----2------------', B: '---3-5---3----------', G: '-----------2--------' }, { e: '---2-3-5------------', B: '-3------------------' }, { B: '-3-5-3--------------', G: '-------4-2----------' }, { e: '-5-3-2--------------', B: '-------5-3----------' }, { e: '-----2--------------', B: '-3h5---5-3----------' }, { e: '-2------------------', B: '---3----------------' },
  ])),
  solo('Chicken Pickin Easy', 'Snappy answers', 'The solo alternates short high-string ideas with simple lower-string resolutions.', makeBars('Country-ish', [
    { B: '-3---3--------------', G: '---2---2------------' }, { e: '-2/5-2--------------', B: '-------3------------' }, { e: '---2----------------', B: '-5---3--------------', G: '-------2------------' }, { B: '-----3-5------------', G: '-2-4-----2----------' }, { e: '-2-2----------------', B: '-----3-5------------' }, { e: '-------2-5----------', B: '-3-5-3--------------' }, { e: '-5-2----------------', B: '-----5-3------------' }, { B: '-3h5-3--------------', G: '-------2------------' },
  ])),
  solo('Front Porch Country', 'Melodic and open', 'Longer spaces keep the phrase playable and give the notes room to twang.', makeBars('Country-ish', [
    { e: '---2-3-2------------', B: '-3-------3----------' }, { G: '-2-4-2--------------', D: '-------4------------' }, { e: '-2-3-5-3-2----------', B: '-----------3--------' }, { B: '-5b6-5-3------------', G: '---------2----------' }, { e: '-----2--------------', B: '-3-5---3------------', G: '---------2----------' }, { e: '-5-3-2--------------', B: '-------3------------' }, { B: '-3h5-3--------------', G: '-------2------------' }, { e: '-2------------------', B: '---3----------------' },
  ])),
  solo('D Major Roadhouse', 'Upbeat major line', 'The two-bar phrases climb and answer in a way that fits over a simple D progression.', makeBars('Country-ish', [
    { e: '-----2--------------', B: '-3h5---5-3----------' }, { e: '-2-----2------------', B: '---3-5---3----------' }, { e: '---2-3-5------------', B: '-3------------------' }, { e: '-5-3-2--------------', B: '-------5-3----------' }, { B: '-----3-5------------', G: '-2-4-----2----------' }, { e: '-------2-5----------', B: '-3-5-3--------------' }, { B: '-5b6-5-3------------', G: '---------2----------' }, { e: '-----2--------------', B: '-3-5---3------------' },
  ])),
  solo('Simple Country Loop', 'Beginner-friendly loop', 'The ending lands clearly so the whole 8 bars can repeat without feeling unfinished.', makeBars('Country-ish', [
    { e: '-2-3-2--------------', B: '-------3------------' }, { B: '-3-5-3--------------', G: '-------4-2----------' }, { e: '-----2-5-2----------', B: '-3-5-------5-3------' }, { e: '-2/5-2--------------', B: '-------3------------' }, { e: '-5-2----------------', B: '-----5-3------------' }, { e: '---2-3-2------------', B: '-3-------3----------' }, { e: '-2-3-5-3-2----------', B: '-----------3--------' }, { e: '-2------------------', B: '---3----------------' },
  ])),
];

const curatedPhraseLibrary = Object.fromEntries(Object.entries(curatedSolos).map(([styleName, solos]) => [
  styleName,
  solos.flatMap((entry) => [0, 2, 4, 6].map((start, phraseIndex) => ({
    title: `${entry.title} bars ${start + 1}-${start + 2}`,
    phraseIndex,
    vibe: entry.vibe,
    why: entry.why,
    bars: entry.bars.slice(start, start + 2),
  }))),
]));

function pick(list) { return list[Math.floor(Math.random() * list.length)]; }

function cloneBars(styleName, bars) {
  return bars.map((bar, index) => ({
    ...bar,
    number: index + 1,
    chord: progressions[styleName][index],
    tab: bar.tab || cleanTab(bar),
  }));
}

function buildSolo(key, style, difficulty, emphasis = '') {
  const styleSolos = curatedSolos[style] || curatedSolos.Blues;
  const useFullSolo = !emphasis || Math.random() < 0.65;
  const chosen = useFullSolo ? pick(styleSolos) : null;
  const phrases = curatedPhraseLibrary[style] || curatedPhraseLibrary.Blues;
  const selectedPhrases = chosen ? [] : [0, 1, 2, 3].map((phraseIndex) => pick(phrases.filter((phrase) => phrase.phraseIndex === phraseIndex)));
  const bars = chosen ? cloneBars(style, chosen.bars) : cloneBars(style, selectedPhrases.flatMap((phrase) => phrase.bars));
  const title = chosen ? chosen.title : `${style} Phrase Mix`;
  const vibe = emphasis || chosen?.vibe || 'Curated two-bar phrase mix';
  const why = chosen?.why || `This solo combines four compatible two-bar ${style.toLowerCase()} phrases, keeping each idea playable and readable before moving to the next answer.`;
  const tempoBase = difficulty === 'Beginner' ? 72 : 88;
  const tempoBoost = style === 'Rock' ? 8 : style === 'Country-ish' ? 4 : 0;

  return {
    title: `${title} Practice Sheet`, key, style, difficulty, flavor: vibe, openingTab: bars[0].tab,
    suggestedTempo: `${tempoBase + tempoBoost}–${tempoBase + tempoBoost + 12} bpm`, chordProgression: bars.map((bar) => bar.chord), bars,
    practiceNotes: ['Read one two-bar phrase at a time before trying the full solo.', 'Keep the rhythm relaxed; these are practice-sheet phrases, not tiny generated fragments.', difficulty === 'Beginner' ? 'Loop bars 1–2 until they feel automatic, then add the next pair.' : 'After learning the tab, change only the final note of each two-bar phrase.'],
    musicalityNotes: ['Bars 1–2 introduce a clear lick.', 'Bars 3–4 answer or repeat the idea.', 'Bars 5–6 lift the energy without crowding the tab.', 'Bars 7–8 resolve clearly so the solo can loop.'],
    whyItWorks: `${why} The long labels are kept here instead of inside the tab grid so the TV view stays clean.`,
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
  const [isPracticeFullscreen, setIsPracticeFullscreen] = useState(false);
  const [playbackTempo, setPlaybackTempo] = useState('Medium');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef(null);
  const stopTimerRef = useRef(null);
  const previousOpeningRef = useRef('');

  const solo = useMemo(() => buildSolo(keyName, style, difficulty, emphasis, previousOpeningRef.current), [keyName, style, difficulty, emphasis, soloSeed]);
  const playbackEvents = useMemo(() => tabToPlaybackEvents(solo.bars), [solo]);

  const stopPlayback = useCallback(() => {
    if (stopTimerRef.current) {
      window.clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    setIsPlaying(false);
  }, []);

  const playSolo = async () => {
    stopPlayback();

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    const audioContext = new AudioContextClass();
    audioContextRef.current = audioContext;

    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    const masterGain = audioContext.createGain();
    masterGain.gain.value = 0.78;
    masterGain.connect(audioContext.destination);

    const secondsPerBeat = 60 / playbackTempos[playbackTempo];
    const startTime = audioContext.currentTime + 0.08;

    playbackEvents.forEach((event) => {
      playPluckedNote(audioContext, masterGain, event, startTime + (event.beat * secondsPerBeat), secondsPerBeat);
    });

    const finalBeat = playbackEvents.at(-1)?.beat ?? 0;
    const finalDuration = playbackEvents.at(-1)?.durationBeats ?? 0;
    const totalMs = ((finalBeat + finalDuration) * secondsPerBeat * 1000) + 450;
    setIsPlaying(true);
    stopTimerRef.current = window.setTimeout(stopPlayback, totalMs);
  };

  useEffect(() => {
    previousOpeningRef.current = solo.openingTab;
  }, [solo.openingTab]);

  useEffect(() => () => stopPlayback(), [stopPlayback]);

  const regenerate = (nextEmphasis = emphasis) => {
    stopPlayback();
    setEmphasis(nextEmphasis);
    setSoloSeed((value) => value + 1);
  };

  return (
    <div className={`solo-generator${isPracticeFullscreen ? ' solo-generator-fullscreen' : ''}`}>
      {/* TODO: realistic guitar samples */}
      {/* TODO: export audio file */}
      {/* TODO: backing track playback */}
      {/* TODO: metronome count-in */}
      {/* TODO: animated fretboard playback */}
      {/* TODO: save favorite solos */}
      {/* TODO: AI-generated solos */}
      {/* TODO: print/export tab */}
      <section className="solo-generator-controls" aria-label="Solo generator controls" hidden={isPracticeFullscreen}>
        <fieldset><legend>Key</legend>{keys.map((item) => <button className={keyName === item ? 'active' : ''} key={item} type="button" onClick={() => setKeyName(item)}>{item}</button>)}</fieldset>
        <fieldset><legend>Style</legend>{styles.map((item) => <button className={style === item ? 'active' : ''} key={item} type="button" onClick={() => setStyle(item)}>{item}</button>)}</fieldset>
        <fieldset><legend>Difficulty</legend>{difficulties.map((item) => <button className={difficulty === item ? 'active' : ''} key={item} type="button" onClick={() => setDifficulty(item)}>{item}</button>)}</fieldset>
        <button className="solo-generate-button" type="button" onClick={() => regenerate('')}>Generate New Solo</button>
      </section>

      <section className="solo-output-card" aria-labelledby="generated-solo-title">
        <div className="solo-output-header">
          <div><p className="guitar-kicker">Generated 8-bar solo</p><h2 id="generated-solo-title">{solo.title}</h2></div>
          <div className="solo-meta"><span>{solo.style}</span><span>{solo.suggestedTempo}</span></div>
        </div>
        <div className="solo-playback-panel" aria-label="Solo playback controls">
          <button className="solo-play-button" type="button" onClick={playSolo}>{isPlaying ? 'Restart Solo' : 'Play Solo'}</button>
          <button className="solo-stop-button" type="button" onClick={stopPlayback} disabled={!isPlaying}>Stop</button>
          <fieldset className="solo-tempo-control"><legend>Tempo</legend>{Object.keys(playbackTempos).map((tempo) => <button className={playbackTempo === tempo ? 'active' : ''} key={tempo} type="button" onClick={() => setPlaybackTempo(tempo)}>{tempo}</button>)}</fieldset>
        </div>
        <div className="solo-progression" aria-label="Chord progression">
          <strong>Chord progression:</strong>
          <div className="solo-progression-grid">
            {solo.chordProgression.map((chord, index) => <span key={`${chord}-${index}`}>{chord}</span>)}
          </div>
        </div>
        <div className="solo-tab-grid" aria-label="8-bar generated tablature">
          {solo.bars.map((bar) => (
            <article className="solo-bar" key={`bar-${bar.number}`}>
              <div className="solo-bar-heading">Bar {bar.number} - {bar.chord}</div>
              <pre className="solo-tab">{bar.tab}</pre>
            </article>
          ))}
        </div>
        <div className="solo-buttons" aria-label="Solo action buttons">
          <button type="button" onClick={() => regenerate('')}>Generate New Solo</button>
          {isPracticeFullscreen ? (
            <button type="button" onClick={() => setIsPracticeFullscreen(false)}>Exit Full Screen</button>
          ) : (
            <button type="button" onClick={() => setIsPracticeFullscreen(true)}>Full Screen Practice</button>
          )}
          {!isPracticeFullscreen && (<>
            <button type="button" onClick={() => { setDifficulty('Beginner'); regenerate('Smooth'); }}>Easier</button>
            <button type="button" onClick={() => { setStyle('Blues'); regenerate('Bluesy'); }}>More Bluesy</button>
            <button type="button" onClick={() => { setStyle('Rock'); regenerate('Punchy'); }}>More Rock</button>
            <button className={showWhy ? 'active' : ''} type="button" onClick={() => setShowWhy((value) => !value)}>Show Why It Works</button>
            <button className={showSteps ? 'active' : ''} type="button" onClick={() => setShowSteps((value) => !value)}>Show Practice Steps</button>
          </>)}
        </div>
        <div className="solo-learning-grid">
          <div className="practice-box"><h3>Practice notes</h3><ul>{solo.practiceNotes.map((note) => <li key={note}>{note}</li>)}</ul></div>
          {!isPracticeFullscreen && showWhy && <div className="solo-explainer"><h3>Why it works</h3><p>{solo.whyItWorks}</p></div>}
          {!isPracticeFullscreen && <div className="practice-box"><h3>Musicality Notes</h3><ul>{solo.musicalityNotes.map((note) => <li key={note}>{note}</li>)}</ul></div>}
          {!isPracticeFullscreen && showSteps && <div className="practice-box"><h3>Learning prompts</h3><ol>{learningPrompts.map((prompt) => <li key={prompt}>{prompt}</li>)}</ol></div>}
        </div>
      </section>
    </div>
  );
}
