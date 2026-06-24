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
  'A-Blues': ['A7', 'D7', 'A7', 'A7', 'D7', 'D7', 'A7', 'E7'],
  'E-Rock': ['E5', 'G', 'A', 'E5', 'E5', 'G', 'A', 'B'],
  'G-Soulful Major': ['G', 'C', 'G', 'D', 'Em', 'C', 'G', 'D'],
};

const fallbackProgressions = {
  C: ['C', 'F', 'C', 'G', 'Am', 'F', 'C', 'G'],
  D: ['D', 'G', 'D', 'A', 'Bm', 'G', 'D', 'A'],
};


const makeTab = ({ e = '----------------', B = '----------------', G = '----------------', D = '----------------', A = '----------------', E = '----------------' }) => `e|${e}|
B|${B}|
G|${G}|
D|${D}|
A|${A}|
E|${E}|`;

const lick = (tab, tags, role = 'middle') => ({ tab, tags, role });

const bluesLicks = [
  lick(makeTab({ B: '-----5----------', G: '-5h6---6-5------', D: '-----------7----' }), ['ascending', 'hammer']),
  lick(makeTab({ e: '---------5------', B: '-5---8-5---8-5--', G: '---6------------' }), ['repeated motif', 'busy']),
  lick(makeTab({ B: '-----5----------', G: '-7b9---7-5------', D: '-----------7----' }), ['bend', 'descending']),
  lick(makeTab({ B: '-5-----5--------', G: '---7-5---6------', D: '-----------7----' }), ['repeated motif', 'resolution']),
  lick(makeTab({ B: '-------5-8-5----', G: '---5h6-------6--' }), ['ascending', 'busy']),
  lick(makeTab({ e: '-5--------------', B: '---8-5----------', G: '-------7-5------', D: '-----------7----' }), ['descending', 'longer run']),
  lick(makeTab({ B: '-----5---5------', G: '-7b9---7---5----', D: '-------------7--' }), ['bend', 'repeated motif']),
  lick(makeTab({ G: '---5-6----------', D: '-7-----7--------' }), ['spacious', 'two-note phrase']),
  lick(makeTab({ B: '-5---5----------', G: '---7---5--------', D: '---------7------' }), ['spacious', 'descending']),
  lick(makeTab({ e: '-----5----------', B: '-5h8---8-5------', G: '-----------6----' }), ['ascending', 'hammer']),
  lick(makeTab({ G: '-5-7b8-5--------', D: '---------7------' }), ['bend', 'spacious']),
  lick(makeTab({ B: '---5------------', G: '-6---6-5--------', D: '---------7------' }), ['descending', 'resolution']),
  lick(makeTab({ e: '-------5--------', B: '---5-8---8-5----', G: '-6-----------6--' }), ['busy', 'ascending']),
  lick(makeTab({ B: '-8-5------------', G: '-----7-5--------', D: '---------7-5----' }), ['descending', 'longer run']),
  lick(makeTab({ B: '-----5----------', G: '-------5-6------', D: '-7-7-------7----' }), ['repeated motif', 'ascending']),
  lick(makeTab({ G: '-5--------------', D: '---7---5-7------' }), ['spacious', 'call']),
  lick(makeTab({ B: '---------5------', G: '-----5h6---6----', D: '-5h7------------' }), ['answer', 'ascending']),
  lick(makeTab({ e: '---5------------', B: '-8---8-5--------', G: '---------7b8-5--' }), ['bend', 'descending']),
  lick(makeTab({ B: '-5-5------------', G: '-----7-5--------', D: '---------7------' }), ['repeated motif', 'spacious']),
  lick(makeTab({ B: '-------5--------', G: '-5-6-7---7-5----', D: '-------------7--' }), ['busy', 'longer run']),
];

const rockLicks = [
  lick(makeTab({ G: '-----2-4-2------', D: '-2-4-------4-2--' }), ['ascending', 'descending']),
  lick(makeTab({ B: '-----3----------', G: '-2h4---4-2------', D: '-----------4----' }), ['hammer', 'ascending']),
  lick(makeTab({ G: '-4-2------------', D: '-----4-2--------', A: '---------2------' }), ['descending', 'resolution']),
  lick(makeTab({ e: '-----3-0--------', B: '-3-0-----3-0----', G: '-------------2--' }), ['busy', 'descending']),
  lick(makeTab({ G: '-2-2-4-2--------', D: '---------4-2----' }), ['repeated motif', 'punchy']),
  lick(makeTab({ D: '-2-4-5-4-2------', A: '-----------2----' }), ['ascending', 'descending']),
  lick(makeTab({ B: '---3---3--------', G: '-4---4---2------' }), ['repeated motif', 'spacious']),
  lick(makeTab({ G: '-2/4-2----------', D: '-------4-2------' }), ['slide', 'descending']),
  lick(makeTab({ e: '---------3------', B: '-----3-5---5-3--' }), ['ascending', 'busy']),
  lick(makeTab({ G: '-4b5-4-2--------', D: '---------4------' }), ['bend', 'punchy']),
  lick(makeTab({ B: '-3--------------', G: '---4-2----------', D: '-------4-2------' }), ['descending', 'spacious']),
  lick(makeTab({ G: '-----2----------', D: '-2-4---4-2------' }), ['answer', 'ascending']),
  lick(makeTab({ e: '-3-0------------', B: '-----3-0--------', G: '---------2------' }), ['descending', 'longer run']),
  lick(makeTab({ G: '-2---2---4------', D: '---4---4--------' }), ['repeated motif', 'climbing']),
  lick(makeTab({ D: '-2-2------------', A: '-----5-2--------' }), ['two-note phrase', 'punchy']),
  lick(makeTab({ G: '-------2-4------', D: '-2-4-5----------' }), ['climbing', 'busy']),
  lick(makeTab({ B: '-----3----------', G: '-4-2---4-2------' }), ['call', 'repeated motif']),
  lick(makeTab({ B: '-3-5-3----------', G: '-------4-2------' }), ['answer', 'descending']),
  lick(makeTab({ G: '-2-4-2-4--------', D: '---------2------' }), ['repeated motif', 'busy']),
  lick(makeTab({ B: '---3-5b6-3------', G: '-4---------4----' }), ['bend', 'climbing']),
];

const soulfulMajorLicks = [
  lick(makeTab({ B: '-----3-5-3------', G: '-2h4-------4-2--' }), ['ascending', 'hammer']),
  lick(makeTab({ e: '-------3--------', B: '-3-5-----5-3----', G: '-----4-------4--' }), ['busy', 'smooth']),
  lick(makeTab({ B: '-3-----3--------', G: '---4-2---4-2----', D: '-------------5--' }), ['repeated motif', 'descending']),
  lick(makeTab({ e: '-----3----------', B: '-3-5---5-3------', G: '-----------4----' }), ['ascending', 'resolution']),
  lick(makeTab({ B: '---3-5----------', G: '-4-----4--------' }), ['two-note phrase', 'smooth']),
  lick(makeTab({ e: '-3--------------', B: '---5-3----------', G: '-------4-2------' }), ['descending', 'spacious']),
  lick(makeTab({ B: '-3h5-3----------', G: '-------4-2------' }), ['hammer', 'answer']),
  lick(makeTab({ e: '-------3-5------', B: '-3-5-6----------' }), ['climbing', 'busy']),
  lick(makeTab({ B: '-5-3------------', G: '-----4-2--------', D: '---------5------' }), ['descending', 'resolution']),
  lick(makeTab({ G: '-2-4-2----------', D: '-------5--------' }), ['spacious', 'call']),
  lick(makeTab({ B: '-----3----------', G: '-2h4---4-2------' }), ['answer', 'hammer']),
  lick(makeTab({ e: '-3-5-3----------', B: '-------5-3------' }), ['smooth', 'descending']),
  lick(makeTab({ B: '-3---3---5------', G: '---4---4--------' }), ['repeated motif', 'climbing']),
  lick(makeTab({ e: '-----3----------', B: '-6-5---3--------', G: '---------4------' }), ['descending', 'soulful']),
  lick(makeTab({ B: '---3------------', G: '-4---2----------' }), ['two-note phrase', 'spacious']),
  lick(makeTab({ e: '---------3------', B: '-----3-5---5----', G: '-2h4------------' }), ['longer run', 'ascending']),
  lick(makeTab({ B: '-3/5-3----------', G: '-------4-2------' }), ['slide', 'smooth']),
  lick(makeTab({ B: '---3-5-3--------', G: '-4-------4-2----' }), ['call', 'answer']),
  lick(makeTab({ e: '-5-3------------', B: '-----5-3--------', G: '---------4------' }), ['descending', 'longer run']),
  lick(makeTab({ B: '-----3-5--------', G: '-2-4-----4------' }), ['climbing', 'smooth']),
];

const countryLicks = [
  lick(makeTab({ e: '-2-3-2----------', B: '-------3--------', G: '---------2------' }), ['descending', 'open']),
  lick(makeTab({ e: '-----2-5-2------', B: '-3-5-------5-3--' }), ['busy', 'ascending']),
  lick(makeTab({ e: '-2-----2--------', B: '---3-5---3------', G: '-----------2----' }), ['repeated motif', 'resolution']),
  lick(makeTab({ e: '---2-3-5--------', B: '-3--------------' }), ['climbing', 'spacious']),
  lick(makeTab({ B: '-3-5-3----------', G: '-------4-2------' }), ['descending', 'answer']),
  lick(makeTab({ e: '-5-3-2----------', B: '-------5-3------' }), ['descending', 'longer run']),
  lick(makeTab({ e: '-----2----------', B: '-3h5---5-3------' }), ['hammer', 'country']),
  lick(makeTab({ B: '-3---3----------', G: '---2---2--------' }), ['two-note phrase', 'spacious']),
  lick(makeTab({ e: '-2/5-2----------', B: '-------3--------' }), ['slide', 'spacious']),
  lick(makeTab({ e: '---2------------', B: '-5---3----------', G: '-------2--------' }), ['descending', 'smooth']),
  lick(makeTab({ B: '-----3-5--------', G: '-2-4-----2------' }), ['climbing', 'busy']),
  lick(makeTab({ e: '-2-2------------', B: '-----3-5--------' }), ['repeated motif', 'punchy']),
  lick(makeTab({ e: '-------2-5------', B: '-3-5-3----------' }), ['call', 'climbing']),
  lick(makeTab({ e: '-5-2------------', B: '-----5-3--------' }), ['answer', 'descending']),
  lick(makeTab({ B: '-3h5-3----------', G: '-------2--------' }), ['hammer', 'resolution']),
  lick(makeTab({ e: '---2-3-2--------', B: '-3-------3------' }), ['repeated motif', 'smooth']),
  lick(makeTab({ G: '-2-4-2----------', D: '-------4--------' }), ['spacious', 'two-note phrase']),
  lick(makeTab({ e: '-2-3-5-3-2------', B: '-----------3----' }), ['longer run', 'busy']),
  lick(makeTab({ B: '-5b6-5-3--------', G: '---------2------' }), ['bend', 'country']),
  lick(makeTab({ e: '-----2----------', B: '-3-5---3--------', G: '---------2------' }), ['ending', 'resolution']),
];

const phraseLibrary = {
  A: { Blues: bluesLicks },
  E: { Rock: rockLicks },
  G: { 'Soulful Major': soulfulMajorLicks },
  D: { 'Country-ish': countryLicks },
  C: { 'Soulful Major': soulfulMajorLicks },
};

const styleBackups = {
  Blues: bluesLicks,
  Rock: rockLicks,
  'Soulful Major': soulfulMajorLicks,
  'Country-ish': countryLicks,
};

const endingLicks = {
  Blues: [
    lick(makeTab({ B: '-----5----------', G: '-6-5------------', D: '-----7----------' }), ['ending', 'resolution'], 'ending'),
    lick(makeTab({ e: '-----5----------', B: '-8-5------------', G: '-----6----------' }), ['ending', 'root'], 'ending'),
    lick(makeTab({ G: '-5h6------------', D: '-----7----------' }), ['ending', 'third'], 'ending'),
    lick(makeTab({ B: '-5--------------', G: '---6-5----------', D: '-------7--------' }), ['ending', 'resolution'], 'ending'),
  ],
  Rock: [
    lick(makeTab({ G: '-4-2------------', D: '-----2----------' }), ['ending', 'root'], 'ending'),
    lick(makeTab({ B: '-----3----------', G: '-4-2------------', D: '-----2----------' }), ['ending', 'resolution'], 'ending'),
    lick(makeTab({ D: '-4-2------------', A: '-----2----------' }), ['ending', 'root'], 'ending'),
    lick(makeTab({ G: '-2--------------', D: '---4-2----------' }), ['ending', 'third'], 'ending'),
  ],
  'Soulful Major': [
    lick(makeTab({ B: '-5-3------------', G: '-----4----------' }), ['ending', 'third'], 'ending'),
    lick(makeTab({ B: '-----3----------', G: '-4-2------------', D: '-----5----------' }), ['ending', 'root'], 'ending'),
    lick(makeTab({ e: '-3--------------', B: '---5-3----------' }), ['ending', 'resolution'], 'ending'),
    lick(makeTab({ G: '-2h4------------', D: '-----5----------' }), ['ending', 'root'], 'ending'),
  ],
  'Country-ish': [
    lick(makeTab({ e: '-2--------------', B: '---3------------' }), ['ending', 'root'], 'ending'),
    lick(makeTab({ e: '-5-3-2----------', B: '-------3--------' }), ['ending', 'resolution'], 'ending'),
    lick(makeTab({ B: '-3h5-3----------', G: '-------2--------' }), ['ending', 'third'], 'ending'),
    lick(makeTab({ e: '-----2----------', B: '-3-5---3--------' }), ['ending', 'root'], 'ending'),
  ],
};

const personalities = ['Smooth', 'Bluesy', 'Punchy', 'Repeating motif', 'Climbing', 'Answering phrase'];

const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const openStringPitches = { e: 64, B: 59, G: 55, D: 50, A: 45, E: 40 };

const rhythmTemplates = [
  { name: 'long note + short answer', beats: [0, 2.5, 3], sustain: true, space: true },
  { name: 'two-note pickup', beats: [1.5, 2, 3], pickup: true },
  { name: 'rest then phrase', beats: [1, 1.5, 2.5, 3.25], space: true },
  { name: 'repeated eighth notes', beats: [0, 0.5, 1, 1.5, 2, 2.5], repeated: true },
  { name: 'quarter-note bends', beats: [0, 1, 2.5], technique: 'bend', space: true },
  { name: 'triplet feel', beats: [0, 0.66, 1.33, 2, 3], triplet: true },
  { name: 'syncopated rock rhythm', beats: [0, 0.75, 1.5, 2.5, 3.25], syncopated: true },
  { name: 'blues shuffle feel', beats: [0, 0.66, 1.33, 2, 2.66, 3.33], shuffle: true },
  { name: 'spacious soulful phrase', beats: [0.5, 2, 3], space: true, sustain: true },
  { name: 'fast ending run', beats: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5], run: true },
  { name: 'call with held first note', beats: [0, 1.5, 2.25, 3], sustain: true },
  { name: 'answer after a breath', beats: [1.25, 2, 2.5, 3.25], space: true },
  { name: 'short stab then rest', beats: [0, 0.5, 2.5], space: true },
  { name: 'three-note motif', beats: [0, 0.75, 1.5, 3], motif: true },
  { name: 'lazy backbeat answer', beats: [1, 2, 3], space: true },
  { name: 'front porch shuffle', beats: [0, 0.66, 1.33, 3], shuffle: true, space: true },
  { name: 'rock push on the and', beats: [0.5, 1, 1.5, 2.5, 3], syncopated: true },
  { name: 'held bend release', beats: [0, 2, 3], technique: 'bend', sustain: true, space: true },
  { name: 'major pentatonic skip', beats: [0, 1, 1.5, 2.5], space: true },
  { name: 'country snap', beats: [0, 0.5, 1, 2.5, 3], technique: 'hammer' },
  { name: 'slide into answer', beats: [0.5, 1, 2, 3], technique: 'slide', space: true },
  { name: 'two long tones', beats: [0, 2], space: true, sustain: true },
  { name: 'question mark ending', beats: [0, 1, 2.75], space: true },
  { name: 'falling eighths', beats: [0, 0.5, 1, 1.5, 3], fall: true },
  { name: 'climbing pickup run', beats: [1, 1.5, 2, 2.5, 3], climb: true },
  { name: 'soul pause and reply', beats: [0, 2.25, 3], space: true, sustain: true },
  { name: 'blues rake idea', beats: [0, 0.5, 1.5, 2.5], technique: 'bend' },
  { name: 'punchy root repeat', beats: [0, 0.5, 1, 2, 2.5], repeated: true },
  { name: 'turnaround breath', beats: [0, 1.5, 2.5, 3.5], space: true },
  { name: 'final held resolve', beats: [0, 1, 2.5], space: true, sustain: true },
  { name: 'quick hammer answer', beats: [0.5, 1, 1.5, 3], technique: 'hammer' },
  { name: 'syncopated two-bar lift', beats: [0, 0.75, 2, 2.75, 3.5], syncopated: true },
];

const styleSettings = {
  Blues: { scale: [0, 3, 5, 6, 7, 10], targets: [0, 4, 7, 10], techniques: ['bend', 'hammer'], notes: 'bends, flat-3 to major-3 flavor, dominant-7 targets, and repeated call-and-response ideas' },
  Rock: { scale: [0, 3, 5, 7, 10], targets: [0, 7], techniques: ['slide', 'bend'], notes: 'punchy repeated notes, slides, short aggressive phrases, and strong root endings' },
  'Soulful Major': { scale: [0, 2, 4, 7, 9], targets: [0, 4, 7, 9], techniques: ['slide', 'hammer'], notes: 'fewer notes, more space, and sweet 3rd/6th resolutions' },
  'Country-ish': { scale: [0, 2, 4, 7, 9], targets: [0, 4, 7], techniques: ['hammer', 'slide'], notes: 'major-pentatonic hammer-on/pull-off style movement with bright chord-tone endings' },
};

function pick(list) { return list[Math.floor(Math.random() * list.length)]; }
function noteIndex(name) { return noteNames.indexOf(name.replace('b', '#')); }
function pitchClass(midi) { return ((midi % 12) + 12) % 12; }
function chordRoot(chord) { return chord.match(/[A-G]#?/)[0]; }
function chordTones(chord, style) {
  const root = noteIndex(chordRoot(chord));
  const dominant = chord.includes('7') || style === 'Blues';
  const minor = chord.includes('m') && !chord.includes('maj');
  return [0, minor ? 3 : 4, 7, ...(dominant ? [10] : [])].map((interval) => (root + interval) % 12);
}
function scaleFor(key, style) { const root = noteIndex(key); return styleSettings[style].scale.map((interval) => (root + interval) % 12); }
function findPosition(pc, preferredMidi = 62) {
  const choices = Object.entries(openStringPitches).flatMap(([string, open]) => Array.from({ length: 7 }, (_, i) => i + 2).filter((fret) => pitchClass(open + fret) === pc).map((fret) => ({ string, fret, midi: open + fret })));
  return choices.sort((a, b) => Math.abs(a.midi - preferredMidi) - Math.abs(b.midi - preferredMidi))[0] || { string: 'G', fret: 5, midi: 60 };
}
function templateFor(type, style) {
  const wanted = {
    question: ['long note + short answer', 'two-note pickup', 'question mark ending'], answer: ['answer after a breath', 'lazy backbeat answer'],
    'repeat motif': ['three-note motif', 'repeated eighth notes', 'punchy root repeat'], variation: ['syncopated rock rhythm', 'slide into answer', 'major pentatonic skip'],
    climb: ['climbing pickup run', 'syncopated two-bar lift'], fall: ['falling eighths'], 'bend-and-resolve': ['quarter-note bends', 'held bend release', 'blues rake idea'],
    'space/rest': ['two long tones', 'spacious soulful phrase', 'soul pause and reply'], 'turnaround ending': ['fast ending run', 'turnaround breath', 'final held resolve'],
  }[type];
  const styleExtra = style === 'Blues' ? ['blues shuffle feel', 'front porch shuffle'] : style === 'Country-ish' ? ['country snap', 'quick hammer answer'] : [];
  return pick(rhythmTemplates.filter((t) => [...wanted, ...styleExtra].includes(t.name)));
}
function contourNotes(type, count, motif, scale, chordTargets, finalTarget, style) {
  if (type === 'space/rest') return Array(count).fill(finalTarget ?? pick(chordTargets));
  let pcs = type === 'repeat motif' ? motif.slice(0, count) : type === 'variation' ? motif.map((pc, i) => i === motif.length - 1 ? pick(chordTargets) : pc) : [];
  while (pcs.length < count) pcs.push(pick(type === 'answer' || type === 'bend-and-resolve' ? chordTargets.concat(scale) : scale));
  if (type === 'climb') pcs = pcs.sort((a, b) => a - b);
  if (type === 'fall') pcs = pcs.sort((a, b) => b - a);
  pcs[count - 1] = finalTarget ?? (Math.random() < 0.7 ? pick(chordTargets) : pcs[count - 1]);
  if (style === 'Blues' && count > 2 && Math.random() < 0.55) pcs[0] = (noteIndex('A') + 3) % 12;
  return pcs.slice(0, count);
}
function renderTab(events) {
  const width = 16;
  const rows = { e: Array(width).fill('-'), B: Array(width).fill('-'), G: Array(width).fill('-'), D: Array(width).fill('-'), A: Array(width).fill('-'), E: Array(width).fill('-') };
  events.forEach((event) => {
    const col = Math.min(width - 2, Math.round(event.beat * 4));
    const text = `${event.fret}${event.technique === 'bend' ? 'b' : event.technique === 'hammer' ? 'h' : event.technique === 'slide' ? '/' : ''}`;
    text.split('').forEach((char, i) => { if (col + i < width) rows[event.string][col + i] = char; });
  });
  return makeTab(rows);
}
function makeBar({ number, chord, type, style, scale, motif, finalTarget }) {
  const targets = chordTones(chord, style).filter((pc) => scale.includes(pc) || styleSettings[style].targets.includes((pc - noteIndex(chordRoot(chord)) + 12) % 12));
  const rhythm = templateFor(type, style);
  const target = finalTarget ?? pick(targets.length ? targets : scale);
  const pcs = contourNotes(type, rhythm.beats.length, motif, scale, targets.length ? targets : scale, target, style);
  const events = pcs.map((pc, index) => {
    const pos = findPosition(pc, 59 + number + index);
    const strongBeat = Number.isInteger(rhythm.beats[index]);
    const resolves = index === pcs.length - 1 || strongBeat;
    return { ...pos, beat: rhythm.beats[index], technique: resolves ? '' : (rhythm.technique || (Math.random() < 0.18 ? pick(styleSettings[style].techniques) : '')) };
  });
  return { number, chord, phraseType: type, rhythm: rhythm.name, targetNote: noteNames[target], ending: noteNames[pcs.at(-1)], tab: renderTab(events), hasSpace: rhythm.space || events.length <= 3, tags: [type, rhythm.name] };
}

function getProgression(key, style) {
  if (key === 'A' && style === 'Blues') return progressions['A-Blues'];
  if (key === 'E' && style === 'Rock') return progressions['E-Rock'];
  if (key === 'G' && style === 'Soulful Major') return progressions['G-Soulful Major'];
  return fallbackProgressions[key] || progressions['G-Soulful Major'];
}

function buildSolo(key, style, difficulty, emphasis = '', previousOpening = '') {
  const personality = emphasis || pick(personalities);
  const progression = getProgression(key, style);
  const scale = scaleFor(key, style);
  const finalTargets = chordTones(progression[7], style).filter((pc) => [0, 4, 7].map((i) => (noteIndex(chordRoot(progression[7])) + i) % 12).includes(pc));
  const motif = Array.from({ length: 3 + Math.floor(Math.random() * 3) }, (_, i) => scale[(i + Math.floor(Math.random() * 3)) % scale.length]);
  const phrasePlan = ['question', pick(['answer', 'space/rest']), pick(['repeat motif', 'variation']), 'variation', pick(['answer', 'climb']), pick(['climb', 'bend-and-resolve', 'fall']), pick(['fall', 'bend-and-resolve', 'space/rest']), 'turnaround ending'];
  if (phrasePlan.filter((type) => type === 'space/rest').length < 1) phrasePlan[1] = 'space/rest';
  const bars = phrasePlan.map((type, index) => makeBar({ number: index + 1, chord: progression[index], type, style, scale, motif, finalTarget: index === 7 ? pick(finalTargets.length ? finalTargets : chordTones(progression[7], style)) : undefined }));
  if (bars.filter((bar) => bar.hasSpace).length < 2) bars[5] = makeBar({ number: 6, chord: progression[5], type: 'space/rest', style, scale, motif });
  const tempoBase = difficulty === 'Beginner' ? 72 : 88;
  const tempoBoost = style === 'Rock' ? 8 : style === 'Country-ish' ? 4 : 0;
  const flavor = `${personality}${personality.toLowerCase().includes(style.toLowerCase().split('-')[0]) ? '' : ` ${style.toLowerCase()}`}`;
  const openingTab = bars[0].tab === previousOpening ? bars[1].tab : bars[0].tab;
  return {
    title: `${key} ${personality} Musical Phrase Solo`, key, style, difficulty, flavor, openingTab,
    suggestedTempo: `${tempoBase + tempoBoost}–${tempoBase + tempoBoost + 12} bpm`, chordProgression: progression, bars,
    practiceNotes: [`Flavor: ${flavor}. This version separates rhythm, contour, target notes, and phrase endings instead of stitching together fixed tab patterns.`, `Motif memory: the opening ${motif.length}-note idea returns later as a repeat, variation, or simpler answer.`, difficulty === 'Beginner' ? 'Let the rests ring; the silence is part of the phrase.' : 'Keep bends, slides, and hammer-ons small so the line remains easy-plus and TV-friendly.'],
    musicalityNotes: ['Bars 1-2 ask a short question, then leave space so it feels like a real phrase.', 'Bars 3-4 repeat or vary the opening motif with a different rhythm or ending.', 'Bars 5-6 answer the idea and lift the energy toward the final phrase.', `Bars 7-8 create a clear ending and resolve bar 8 to ${bars[7].ending}, a strong chord tone.`],
    whyItWorks: `${key} ${style} uses ${styleSettings[style].notes}. Strong beats usually target chord tones from the current chord, passing notes connect them, at least two bars breathe with rests or longer notes, and the final bar resolves deliberately instead of landing on a random scale note.`,
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
          <div className="solo-meta"><span>Key: {solo.key}</span><span>Style: {solo.style}</span><span>Flavor: {solo.flavor}</span><span>Tempo: {solo.suggestedTempo}</span></div>
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
              <div className="solo-bar-heading"><span>Bar {bar.number}</span><strong>{bar.chord}</strong></div>
              <p className="solo-bar-role">{bar.phraseType} · {bar.rhythm} · targets {bar.targetNote}</p>
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
