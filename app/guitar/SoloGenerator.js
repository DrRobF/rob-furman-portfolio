'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const styles = ['Blues', 'Rock', 'Soulful Major', 'Country-ish'];
const keys = ['A', 'C', 'D', 'E', 'G'];
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

const keyProgressions = {
  A: ['A7', 'D7', 'A7', 'A7', 'D7', 'D7', 'A7', 'E7'],
  E: ['E5', 'G', 'A', 'E5', 'E5', 'G', 'A', 'B7'],
  G: ['G', 'C', 'D', 'G', 'Em', 'C', 'D', 'G'],
  C: ['C', 'F', 'G', 'C', 'Am', 'F', 'G', 'C'],
  D: ['D', 'G', 'D', 'A', 'G', 'D', 'A', 'D'],
};

const styleFallbackProgressions = {
  Blues: keyProgressions.A,
  Rock: keyProgressions.E,
  'Soulful Major': keyProgressions.G,
  'Country-ish': keyProgressions.C,
};

const keyRootIndex = { C: 0, D: 2, E: 4, G: 7, A: 9 };


function transposeTabValue(value, semitones) {
  return value.replace(/\d+/g, (fret) => String(Math.max(0, Number(fret) + semitones)));
}

function transposeBarInput(bar, semitones) {
  return Object.fromEntries(Object.entries(bar).map(([stringName, value]) => [stringName, transposeTabValue(value, semitones)]));
}

function fretRangeForBars(bars, semitones) {
  const frets = bars.flatMap((bar) => Object.values(bar).flatMap((value) => [...value.matchAll(/\d+/g)].map((match) => Number(match[0]) + semitones)));
  return { min: Math.min(...frets), max: Math.max(...frets) };
}

function transpositionFrom(sourceKey, targetKey) {
  return keyRootIndex[targetKey] - keyRootIndex[sourceKey];
}


function midiToFrequency(midi) {
  return 440 * (2 ** ((midi - 69) / 12));
}

const rhythmSlots = ['1', '&', '2', '&', '3', '&', '4', '&'];

const rhythmFamilies = [
  {
    name: 'Sparse soulful',
    templates: [
      { name: 'held note then soft answer', starts: [0, 2.5], durations: [1.75, 1] },
      { name: 'space before beat 3 reply', starts: [1.5, 3], durations: [1, 0.75] },
    ],
  },
  {
    name: 'Straight eighth rock',
    templates: [
      { name: 'four straight eighth hits', starts: [0, 0.5, 1, 1.5, 2, 2.5], durations: [0.5, 0.5, 0.5, 0.5, 0.5, 0.75] },
      { name: 'downbeat eighth-note drive', starts: [0, 0.5, 1.5, 2, 2.5, 3], durations: [0.5, 0.5, 0.5, 0.5, 0.5, 0.75] },
    ],
  },
  {
    name: 'Blues shuffle',
    templates: [
      { name: 'shuffle skip on the middle triplet', starts: [0, 0.5, 1.5, 2.5, 3], durations: [0.5, 0.5, 0.5, 0.5, 0.75] },
      { name: 'laid-back shuffle answer', starts: [0.5, 1.5, 2.5, 3], durations: [0.5, 0.5, 0.5, 0.75] },
    ],
  },
  {
    name: 'Syncopated pickup',
    templates: [
      { name: 'and-of-one pickup into beat 3', starts: [0.5, 1.5, 2, 3], durations: [0.5, 0.5, 1, 0.5] },
      { name: 'offbeat pickup and late answer', starts: [0.5, 1, 2.5, 3.5], durations: [0.5, 0.75, 0.5, 0.5] },
    ],
  },
  {
    name: 'Long-note bends',
    templates: [
      { name: 'held bend over two beats', starts: [0, 2, 3], durations: [2, 0.5, 1] },
      { name: 'slow bend then clipped answer', starts: [0, 2.5, 3], durations: [2.25, 0.5, 0.75] },
    ],
  },
  {
    name: 'Call and response',
    templates: [
      { name: 'short call then bar-end response', starts: [0, 1, 2.5, 3], durations: [0.5, 0.75, 0.5, 1] },
      { name: 'answer starts after beat 2', starts: [0, 0.5, 2, 3], durations: [0.5, 0.5, 0.75, 0.75] },
    ],
  },
  {
    name: 'Motif variation',
    templates: [
      { name: 'repeated motif with changed ending', starts: [0, 1, 2, 3], durations: [0.75, 0.75, 0.5, 0.75] },
      { name: 'motif starts one eighth later', starts: [0.5, 1.5, 2.5, 3], durations: [0.5, 0.5, 0.5, 0.75] },
    ],
  },
  {
    name: 'Busy ending run',
    templates: [
      { name: 'front-half space back-half run', starts: [0, 1.5, 2, 2.5, 3, 3.5], durations: [0.75, 0.5, 0.5, 0.5, 0.5, 0.5] },
      { name: 'six-note eighth run', starts: [0.5, 1, 1.5, 2, 2.5, 3], durations: [0.5, 0.5, 0.5, 0.5, 0.5, 0.75] },
    ],
  },
];

const rhythmFamilyByName = Object.fromEntries(rhythmFamilies.map((family) => [family.name, family]));

function extractTabNotes(bar) {
  const notes = [];
  Object.entries(bar).forEach(([string, value]) => {
    const baseMidi = stringMidi[string];
    if (baseMidi === undefined) return;

    for (let index = 0; index < value.length; index += 1) {
      if (!/\d/.test(value[index])) continue;
      const fretStart = index;
      let fretText = '';
      while (index < value.length && /\d/.test(value[index])) {
        fretText += value[index];
        index += 1;
      }
      const before = value[fretStart - 1] || '';
      const after = value[index] || '';
      const technique = after === 'b' ? 'bend' : after === 'h' || before === 'h' ? 'hammer' : after === '/' || after === '\\' || before === '/' || before === '\\' ? 'slide' : '';
      notes.push({ string, fret: Number(fretText), order: fretStart, midi: baseMidi + Number(fretText), technique });
      index -= 1;
    }
  });

  return notes.sort((a, b) => a.order - b.order || b.midi - a.midi);
}

function eventsToTab(events) {
  const tab = { e: '----------------', B: '----------------', G: '----------------', D: '----------------', A: '----------------', E: '----------------' };
  events.forEach((event) => {
    const slot = Math.round((event.beat - 1) * 2);
    const marker = event.technique === 'bend' ? 'b' : event.technique === 'hammer' ? 'h' : event.technique === 'slide' ? '/' : '';
    const token = `${event.fret}${marker}`;
    const chars = tab[event.string].split('');
    [...token].forEach((char, offset) => {
      if (slot + offset < chars.length) chars[slot + offset] = char;
    });
    tab[event.string] = chars.join('');
  });
  return cleanTab(tab);
}

function makeRhythmMap(events) {
  const hits = Array(8).fill('-');
  events.forEach((event) => {
    const slot = Math.round((event.beat - 1) * 2);
    if (slot >= 0 && slot < hits.length) hits[slot] = 'X';
  });
  return { labels: rhythmSlots.join(' '), hits: hits.join(' ') };
}

function barsToNoteEvents(bars, rhythmFamilyName = rhythmFamilies[0].name) {
  const family = rhythmFamilyByName[rhythmFamilyName] ?? rhythmFamilies[0];
  return bars.flatMap((bar, barIndex) => {
    const sourceNotes = extractTabNotes(bar);
    const template = family.templates[barIndex % family.templates.length];
    const count = Math.min(sourceNotes.length, template.starts.length);
    return sourceNotes.slice(0, count).map((note, index) => ({
      bar: barIndex + 1,
      beat: template.starts[index] + 1,
      startBeat: (barIndex * 4) + template.starts[index],
      durationBeats: template.durations[index],
      string: note.string,
      fret: note.fret,
      technique: template.name === 'held bend over two beats' && index === 0 ? 'bend' : note.technique,
      rhythmName: template.name,
    }));
  });
}

function preparePlaybackEvents(noteEvents) {
  return noteEvents.map((event) => ({
    ...event,
    midi: stringMidi[event.string] + event.fret,
    marking: event.technique,
  }));
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

  if (event.technique === 'bend' || event.marking === 'bend') {
    oscillator.frequency.linearRampToValueAtTime(frequency * 1.06, startTime + Math.min(0.24, duration * 0.65));
    overtone.frequency.linearRampToValueAtTime(frequency * 2.13, startTime + Math.min(0.24, duration * 0.65));
  }

  if (event.technique === 'slide' || event.marking === 'slide') {
    oscillator.frequency.setValueAtTime(frequency * 0.94, startTime);
    oscillator.frequency.linearRampToValueAtTime(frequency, startTime + Math.min(0.16, duration * 0.45));
    overtone.frequency.setValueAtTime(frequency * 1.88, startTime);
    overtone.frequency.linearRampToValueAtTime(frequency * 2.01, startTime + Math.min(0.16, duration * 0.45));
  }

  if (event.technique === 'hammer' || event.marking === 'hammer') {
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

const tabStrings = ['e', 'B', 'G', 'D', 'A', 'E'];
const emptyTabSegment = '----------------';

const cleanTab = ({ e = emptyTabSegment, B = emptyTabSegment, G = emptyTabSegment, D = emptyTabSegment, A = emptyTabSegment, E = emptyTabSegment }) => `e|${e}|\nB|${B}|\nG|${G}|\nD|${D}|\nA|${A}|\nE|${E}|`;

function extractTabSegments(tab) {
  return Object.fromEntries(tab.split('\n').map((line) => {
    const [stringName, content = ''] = line.split('|');
    return [stringName, content];
  }));
}

function centerTabLabel(label, width) {
  const text = String(label);
  if (text.length >= width) return text.slice(0, width);
  const left = Math.floor((width - text.length) / 2);
  return `${' '.repeat(left)}${text}${' '.repeat(width - text.length - left)}`;
}

function buildTabSystem(bars) {
  const barSegments = bars.map((bar) => ({ ...bar, segments: extractTabSegments(bar.tab) }));
  const barWidth = Math.max(emptyTabSegment.length, ...barSegments.flatMap((bar) => tabStrings.map((stringName) => bar.segments[stringName]?.length ?? 0)));
  const barLabels = barSegments.map((bar) => centerTabLabel(bar.number, barWidth)).join(' ');
  const chords = barSegments.map((bar) => centerTabLabel(bar.chord, barWidth)).join(' ');
  const staff = tabStrings.map((stringName) => {
    const line = barSegments.map((bar) => (bar.segments[stringName] ?? emptyTabSegment).padEnd(barWidth, '-')).join('|');
    return `${stringName}|${line}|`;
  }).join('\n');

  return { barLabels, chords, staff, bars: barSegments };
}

function makeBars(style, noteEvents, barChords = styleFallbackProgressions[style]) {
  return Array.from({ length: 8 }, (_, index) => {
    const events = noteEvents.filter((event) => event.bar === index + 1);
    return {
      number: index + 1,
      chord: barChords[index],
      tab: eventsToTab(events),
      rhythmMap: makeRhythmMap(events),
      rhythmName: events[0]?.rhythmName ?? 'intentional rest',
      events,
    };
  });
}

function makeSolo({ title, key, style, difficulty = 'Beginner', tempo, rhythmFamily = 'Sparse soulful', musicalityLevel = 'standard', notes, steps, bars }) {
  return {
    id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    title,
    sourceTitle: title,
    sourceId: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    key,
    style,
    difficulty,
    tempo,
    rhythmFeel: rhythmFamily,
    rhythmLabel: rhythmFamily,
    musicalityLevel,
    sourceBars: bars,
    sourceProgression: styleFallbackProgressions[style],
    chordProgression: keyProgressions[key] ?? styleFallbackProgressions[style],
    barChords: keyProgressions[key] ?? styleFallbackProgressions[style],
    noteEvents: barsToNoteEvents(bars, rhythmFamily),
    bars: makeBars(style, barsToNoteEvents(bars, rhythmFamily), keyProgressions[key] ?? styleFallbackProgressions[style]),
    totalBeats: 32,
    musicalityNotes: notes,
    practiceSteps: steps,
  };
}

function getFinalNote(noteEvents) {
  const finalEvent = noteEvents.at(-1);
  return finalEvent ? {
    bar: finalEvent.bar,
    beat: finalEvent.beat,
    string: finalEvent.string,
    fret: finalEvent.fret,
    technique: finalEvent.technique,
  } : null;
}

function completeSelectedSolo(solo) {
  return {
    id: solo.id,
    title: solo.title,
    key: solo.key,
    style: solo.style,
    difficulty: solo.difficulty,
    tempo: solo.tempo,
    rhythmFeel: solo.rhythmFeel,
    chordProgression: solo.chordProgression,
    barChords: solo.barChords,
    bars: solo.bars,
    noteEvents: solo.noteEvents,
    finalNote: getFinalNote(solo.noteEvents),
    sourceId: solo.sourceId,
    sourceTitle: solo.sourceTitle,
    sourceBars: solo.sourceBars,
    sourceProgression: solo.sourceProgression,
    totalBeats: solo.totalBeats,
    musicalityLevel: solo.musicalityLevel,
    musicalityNotes: solo.musicalityNotes,
    practiceSteps: solo.practiceSteps,
  };
}

function transposeSoloToKey(solo, targetKey) {
  const rawSemitones = transpositionFrom(solo.key, targetKey);
  const semitones = rawSemitones < 0 ? rawSemitones + 12 : rawSemitones;
  const range = fretRangeForBars(solo.sourceBars, semitones);
  const tabSemitones = range.max <= 15 ? semitones : rawSemitones;
  const noteEvents = resolveEventsToRoot(transposeNoteEvents(solo.noteEvents, tabSemitones), targetKey);
  const chordProgression = keyProgressions[targetKey];

  return {
    ...solo,
    id: `${solo.sourceId}-${targetKey.toLowerCase()}`,
    title: `${targetKey} ${solo.sourceTitle.replace(/^[A-G]\s+|\s+[A-G]\s+/g, ' ')}`,
    key: targetKey,
    chordProgression,
    barChords: chordProgression,
    bars: makeBars(solo.style, noteEvents, chordProgression),
    noteEvents,
    totalBeats: 32,
    musicalityNotes: [
      ...solo.musicalityNotes,
      `Final note rule: this version resolves directly to ${targetKey}, the root, so the last phrase sounds finished.`,
    ],
  };
}

function transposeNoteEvents(noteEvents, semitones) {
  return noteEvents.map((event) => ({
    ...event,
    fret: Math.max(0, Math.min(15, event.fret + semitones)),
  }));
}

function rootEventForKey(key) {
  const roots = {
    A: { string: 'G', fret: 2 },
    C: { string: 'B', fret: 1 },
    D: { string: 'B', fret: 3 },
    E: { string: 'D', fret: 2 },
    G: { string: 'D', fret: 5 },
  };
  return roots[key] ?? roots.A;
}

function resolveEventsToRoot(noteEvents, key) {
  const events = [...noteEvents];
  const root = rootEventForKey(key);
  const lastIndex = events.length - 1;
  if (lastIndex < 0) return [{ ...root, bar: 8, beat: 4, startBeat: 31, durationBeats: 1, technique: '', rhythmName: 'root-note ending' }];
  events[lastIndex] = {
    ...events[lastIndex],
    ...root,
    bar: 8,
    beat: 4,
    startBeat: 31,
    durationBeats: 1,
    technique: '',
  };
  return events;
}

function validateSolo(solo) {
  const messages = [];
  const expectedProgression = keyProgressions[solo.key] ?? [];
  const finalEvent = solo.noteEvents.at(-1);
  const root = rootEventForKey(solo.key);
  const hasRootEnding = finalEvent?.string === root.string && finalEvent?.fret === root.fret;
  const progressionMatches = expectedProgression.join('|') === solo.chordProgression.join('|');
  const barLabelsMatch = solo.bars.every((bar, index) => bar.chord === solo.barChords[index] && solo.barChords[index] === solo.chordProgression[index]);
  const populatedBars = new Set(solo.noteEvents.map((event) => event.bar));
  const titleMatchesKey = solo.title.includes(solo.key);
  const metadataMatchesKey = Boolean(solo.key);
  const gridAligned = solo.noteEvents.every((event) => event.bar >= 1 && event.bar <= 8 && event.beat >= 1 && event.beat <= 4 && Number.isInteger((event.beat - 1) * 2) && event.durationBeats > 0 && event.startBeat >= 0 && event.startBeat < 32);
  const audioMatchesTab = solo.bars.every((bar) => bar.events.every((event) => solo.noteEvents.includes(event)));

  if (solo.totalBeats === 32 && gridAligned) messages.push('Timeline confirmed: 8 bars × 4 beats = 32 beats on the 1 & 2 & 3 & 4 & grid.');
  if (metadataMatchesKey && titleMatchesKey) messages.push(`Title and metadata confirmed for key of ${solo.key}.`);
  if (barLabelsMatch && progressionMatches) messages.push(`Bar labels and progression confirmed for key of ${solo.key}.`);
  if (hasRootEnding) messages.push(`Final note confirmed: resolves to ${solo.key}.`);
  if (populatedBars.size === 8 && audioMatchesTab) messages.push('Display tab, rhythm map, and audio all use the same note events.');

  return { isValid: solo.totalBeats === 32 && metadataMatchesKey && titleMatchesKey && hasRootEnding && progressionMatches && barLabelsMatch && populatedBars.size === 8 && gridAligned && audioMatchesTab, messages };
}

const curatedSolos = [
  makeSolo({ title: 'Front Porch Blues', key: 'A', style: 'Blues', tempo: 72, rhythmFamily: 'Blues shuffle', musicalityLevel: 'more', notes: ['Bars 1–2 state a compact blues-box motif and answer it.', 'Bars 3–4 repeat the bend-and-resolution idea with more space.', 'Bars 7–8 land on root-position chord tones before the turnaround.'], steps: ['Clap the rests before adding notes.', 'Practice the 7b9 bend slowly and keep it vocal.', 'Loop bars 7–8 until the ending feels settled.'], bars: [{ B: '------------5h8-5---', G: '--------5h6-------6--' }, { e: '-----------5--------', B: '-------5h8---8-5----', G: '-----6-----------6--' }, { B: '-----5--------------', G: '-7b9---7-5----------', D: '-----------7--------' }, { B: '-----5---5----------', G: '---5h6---6-5--------', D: '-7-----------7------' }, { e: '---------5----------', B: '-----5h8---8-5------', G: '---6-----------6----' }, { B: '-8-5----------------', G: '-----7-5------------', D: '---------7-5h7------' }, { B: '-----5--------------', G: '-5h6---6-5----------', D: '-----------7--------' }, { e: '-----5--------------', B: '-8-5---8-5----------', G: '-----------6--------' }] }),
  makeSolo({ title: 'Slow Bend Blues', key: 'A', style: 'Blues', difficulty: 'Easy-Plus', tempo: 68, rhythmFamily: 'Long-note bends', musicalityLevel: 'more', notes: ['The same bend sound returns so the solo has a hook.', 'Open spaces after each answer keep it from sounding like an exercise.', 'The final bar resolves to the major third for a clear blues ending.'], steps: ['Sing each bend before playing it.', 'Mute unused strings during the rests.', 'Play the last note longer than written.'], bars: [{ B: '-----5--------------', G: '-7b9---7-5----------', D: '-----------7--------' }, { e: '---------5----------', B: '-----5h8---8-5------', G: '---6-----------6----' }, { B: '-5-----5------------', G: '---7-5---6----------', D: '-----------7--------' }, { G: '---5-6--------------', D: '-7-----7------------' }, { B: '-------5-8-5--------', G: '---5h6-------6------' }, { e: '-5------------------', B: '---8-5--------------', G: '-------7-5----------', D: '-----------7--------' }, { G: '-5-7b8-5------------', D: '---------7----------' }, { B: '-5------------------', G: '---6-5--------------', D: '-------7------------' }] }),
  makeSolo({ title: 'Answer Back Blues', key: 'A', style: 'Blues', tempo: 76, rhythmFamily: 'Call and response', musicalityLevel: 'more', notes: ['Bars 1–4 ask a small question and bars 5–8 answer it.', 'Hammer-ons are used as vocal pickups, not as fast filler.', 'The ending outlines the home chord against the turnaround bar for a loopable turnaround.'], steps: ['Learn bars 1–2 as one sentence.', 'Copy that timing in bars 5–6.', 'Make the last two bars quieter and more relaxed.'], bars: [{ G: '---5-6--------------', D: '-7-----7------------' }, { B: '-----5--------------', G: '---5h6---6----------', D: '-7----------7-------' }, { B: '-5-----5------------', G: '---7-5---6----------', D: '-----------7--------' }, { e: '-----5--------------', B: '-8-5---8-5----------', G: '-----------6--------' }, { B: '-------5-8-5--------', G: '---5h6-------6------' }, { e: '-5------------------', B: '---8-5--------------', G: '-------7-5----------', D: '-----------7--------' }, { B: '-----5---5----------', G: '-7b9---7---5--------', D: '-------------7------' }, { G: '-5h6----------------', D: '-----7--------------' }] }),
  makeSolo({ title: 'Garage E Rock', key: 'E', style: 'Rock', tempo: 92, rhythmFamily: 'Straight eighth rock', musicalityLevel: 'standard', notes: ['A repeating minor-pentatonic riff anchors the solo.', 'The high-string answer in bar 4 gives the phrase a chorus-like lift.', 'The final root note makes the line resolve instead of drift.'], steps: ['Palm-mute the lower string notes lightly.', 'Keep the bar-4 answer short and punchy.', 'Loop with a steady down-up picking pattern.'], bars: [{ G: '-----2-4-2----------', D: '-2-4-------4-2------' }, { B: '-----3--------------', G: '-2h4---4-2----------', D: '-----------4--------' }, { G: '-2-2-4-2------------', D: '---------4-2--------' }, { e: '-----3-0------------', B: '-3-0-----3-0--------', G: '-------------2------' }, { D: '-2-4-5-4-2----------', A: '-----------2--------' }, { G: '-4b5-4-2------------', D: '---------4----------' }, { B: '-3-5-3--------------', G: '-------4-2----------' }, { G: '-4-2----------------', D: '-----2--------------' }] }),
  makeSolo({ title: 'Power Chord Answer', key: 'E', style: 'Rock', difficulty: 'Easy-Plus', tempo: 96, rhythmFamily: 'Syncopated pickup', musicalityLevel: 'more', notes: ['Lower-string riffs are answered by upper-string hooks.', 'Slides and a small bend add attitude without adding clutter.', 'The last bar resolves directly to the root.'], steps: ['Practice the first two bars with a metronome.', 'Let the slide in bar 4 connect smoothly.', 'Accent the first note of every two-bar phrase.'], bars: [{ D: '-2-4-5-4-2----------', A: '-----------2--------' }, { G: '-----2--------------', D: '-2-4---4-2----------' }, { B: '---3---3------------', G: '-4---4---2----------' }, { G: '-2/4-2--------------', D: '-------4-2----------' }, { G: '-2---2---4----------', D: '---4---4------------' }, { e: '-3-0----------------', B: '-----3-0------------', G: '---------2----------' }, { B: '---3-5b6-3----------', G: '-4---------4--------' }, { D: '-4-2----------------', A: '-----2--------------' }] }),
  makeSolo({ title: 'Open Road Rock', key: 'E', style: 'Rock', tempo: 88, rhythmFamily: 'Motif variation', musicalityLevel: 'more', notes: ['The rhythm repeats enough to feel like a real riff.', 'Bars 5–6 climb into a simple melodic peak.', 'The ending comes back to the low root center.'], steps: ['Count four beats in every bar before playing.', 'Keep bends small and controlled.', 'Record yourself and check that the motif is recognizable.'], bars: [{ G: '-2-4-2-4------------', D: '---------2----------' }, { B: '-----3--------------', G: '-4-2---4-2----------' }, { G: '-------2-4----------', D: '-2-4-5--------------' }, { G: '-4-2----------------', D: '-----4-2------------', A: '---------2----------' }, { B: '-3------------------', G: '---4-2--------------', D: '-------4-2----------' }, { e: '---------3----------', B: '-----3-5---5-3------' }, { G: '-2/4-2--------------', D: '-------4-2----------' }, { B: '-----3--------------', G: '-4-2----------------', D: '-----2--------------' }] }),
  makeSolo({ title: 'Sweet G Major', key: 'G', style: 'Soulful Major', tempo: 76, rhythmFamily: 'Call and response', musicalityLevel: 'more', notes: ['Major-pentatonic notes create a warm, vocal sound.', 'The opening motif returns in smaller pieces later in the solo.', 'The final major-chord sound resolves sweetly over the D bar.'], steps: ['Play every phrase legato and relaxed.', 'Hold the first note after each rest.', 'Name the root, third, and fifth chord tones as you play.'], bars: [{ B: '-----3-5-3----------', G: '-2h4-------4-2------' }, { e: '-------3------------', B: '-3-5-----5-3--------', G: '-----4-------4------' }, { B: '-3-----3------------', G: '---4-2---4-2--------', D: '-------------5------' }, { e: '-----3--------------', B: '-3-5---5-3----------', G: '-----------4--------' }, { B: '---3-5--------------', G: '-4-----4------------' }, { e: '-3------------------', B: '---5-3--------------', G: '-------4-2----------' }, { B: '-3h5-3--------------', G: '-------4-2----------' }, { B: '-5-3----------------', G: '-----4--------------' }] }),
  makeSolo({ title: 'Churchy G Answer', key: 'G', style: 'Soulful Major', difficulty: 'Easy-Plus', tempo: 72, rhythmFamily: 'Sparse soulful', musicalityLevel: 'more', notes: ['Call-and-response phrasing makes the melody sing.', 'Small hammer-ons add expression while staying beginner-friendly.', 'The last phrase relaxes into a major color.'], steps: ['Use light vibrato on held notes.', 'Do not rush the pickups.', 'Practice bars 7–8 as the ending first.'], bars: [{ G: '-2-4-2--------------', D: '-------5------------' }, { B: '-----3--------------', G: '-2h4---4-2----------' }, { e: '-3-5-3--------------', B: '-------5-3----------' }, { B: '-3---3---5----------', G: '---4---4------------' }, { e: '-----3--------------', B: '-6-5---3------------', G: '---------4----------' }, { B: '---3----------------', G: '-4---2--------------' }, { B: '---3-5-3------------', G: '-4-------4-2--------' }, { e: '-3------------------', B: '---5-3--------------' }] }),
  makeSolo({ title: 'Porch Soul Major', key: 'G', style: 'Soulful Major', tempo: 70, rhythmFamily: 'Sparse soulful', musicalityLevel: 'more', notes: ['Fewer notes leave more room for tone.', 'The slide in bar 3 sounds like a singer leaning into a note.', 'The final bar lands on the root for a complete ending.'], steps: ['Play it at speaking speed first.', 'Make the slide audible but gentle.', 'Add your own vibrato only on the final note.'], bars: [{ B: '---3-5--------------', G: '-4-----4------------' }, { e: '---------3----------', B: '-----3-5---5--------', G: '-2h4----------------' }, { B: '-3/5-3--------------', G: '-------4-2----------' }, { B: '---3-5-3------------', G: '-4-------4-2--------' }, { e: '-5-3----------------', B: '-----5-3------------', G: '---------4----------' }, { B: '-----3-5------------', G: '-2-4-----4----------' }, { B: '-3h5-3--------------', G: '-------4-2----------' }, { G: '-2h4----------------', D: '-----5--------------' }] }),
  makeSolo({ title: 'Bright D Country', key: 'D', style: 'Country-ish', tempo: 84, rhythmFamily: 'Syncopated pickup', musicalityLevel: 'standard', notes: ['Open-position major shapes give the solo twang.', 'Hammer-ons and quick answers create a country feel without speed.', 'The final root-position shape resolves cleanly.'], steps: ['Use a bright pick attack.', 'Keep the hammer-ons even.', 'Let the final root note ring.'], bars: [{ e: '-2-3-2--------------', B: '-------3------------', G: '---------2----------' }, { e: '-----2-5-2----------', B: '-3-5-------5-3------' }, { e: '-2-----2------------', B: '---3-5---3----------', G: '-----------2--------' }, { e: '---2-3-5------------', B: '-3------------------' }, { B: '-3-5-3--------------', G: '-------4-2----------' }, { e: '-5-3-2--------------', B: '-------5-3----------' }, { e: '-----2--------------', B: '-3h5---5-3----------' }, { e: '-2------------------', B: '---3----------------' }] }),
  makeSolo({ title: 'Chicken Pickin Easy', key: 'D', style: 'Country-ish', difficulty: 'Easy-Plus', tempo: 88, rhythmFamily: 'Busy ending run', musicalityLevel: 'more', notes: ['Short snappy answers create the chicken-pickin character.', 'The slide gives one flashy moment without making the solo hard.', 'The ending targets root-position chord tones.'], steps: ['Play staccato in bars 1–2.', 'Slide slowly at first, then tighten the timing.', 'Practice muting after each short phrase.'], bars: [{ B: '-3---3--------------', G: '---2---2------------' }, { e: '-2/5-2--------------', B: '-------3------------' }, { e: '---2----------------', B: '-5---3--------------', G: '-------2------------' }, { B: '-----3-5------------', G: '-2-4-----2----------' }, { e: '-2-2----------------', B: '-----3-5------------' }, { e: '-------2-5----------', B: '-3-5-3--------------' }, { e: '-5-2----------------', B: '-----5-3------------' }, { B: '-3h5-3--------------', G: '-------2------------' }] }),
  makeSolo({ title: 'Front Porch Country', key: 'D', style: 'Country-ish', tempo: 80, rhythmFamily: 'Long-note bends', musicalityLevel: 'more', notes: ['Long spaces make the melody feel relaxed and playable.', 'The bend in bar 4 is the expressive peak.', 'Bars 7–8 close like a complete sentence.'], steps: ['Leave silence after each two-bar idea.', 'Bend bar 4 only slightly and return in tune.', 'Play the ending three times in a row without stopping.'], bars: [{ e: '---2-3-2------------', B: '-3-------3----------' }, { G: '-2-4-2--------------', D: '-------4------------' }, { e: '-2-3-5-3-2----------', B: '-----------3--------' }, { B: '-5b6-5-3------------', G: '---------2----------' }, { e: '-----2--------------', B: '-3-5---3------------', G: '---------2----------' }, { e: '-5-3-2--------------', B: '-------3------------' }, { B: '-3h5-3--------------', G: '-------2------------' }, { e: '-2------------------', B: '---3----------------' }] }),
];

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function selectCuratedSolo(style, difficulty, key, previousSoloId = '') {
  const styleSolos = curatedSolos.filter((entry) => entry.style === style);
  const difficultyMatches = styleSolos.filter((entry) => entry.difficulty === difficulty);
  const pool = difficultyMatches.length ? difficultyMatches : styleSolos;
  const freshSoloPool = pool.length > 1 ? pool.filter((entry) => entry.id !== previousSoloId) : pool;
  const selected = transposeSoloToKey(pick(freshSoloPool.length ? freshSoloPool : pool), key);
  return { ...selected, difficulty };
}

function buildSelectedSolo({ key, style, difficulty, soloId = '' }) {
  return completeSelectedSolo(selectCuratedSolo(style, difficulty, key, soloId));
}

function hasSoloDataMismatch(selectedSolo) {
  const progression = selectedSolo.chordProgression.join('|');
  const barChords = selectedSolo.barChords.join('|');
  const barLabels = selectedSolo.bars.map((bar) => bar.chord).join('|');

  return progression !== barChords || progression !== barLabels;
}

export function SoloGenerator() {
  const [style, setStyle] = useState('Blues');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [preferMoreMusical, setPreferMoreMusical] = useState(false);
  const [showWhy, setShowWhy] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [isPracticeFullscreen, setIsPracticeFullscreen] = useState(false);
  const [playbackTempo, setPlaybackTempo] = useState('Medium');
  const [isPlaying, setIsPlaying] = useState(false);
  const [countInEnabled, setCountInEnabled] = useState(true);
  const [playbackPosition, setPlaybackPosition] = useState({ bar: 1, beat: 1 });
  const [selectedSolo, setSelectedSolo] = useState(() => buildSelectedSolo({ key: 'A', style: 'Blues', difficulty: 'Beginner' }));
  const audioContextRef = useRef(null);
  const stopTimerRef = useRef(null);
  const beatTimerRef = useRef(null);
  const previousSoloIdRef = useRef('');

  const soloValidation = useMemo(() => validateSolo(selectedSolo), [selectedSolo]);
  const soloDataMismatch = useMemo(() => hasSoloDataMismatch(selectedSolo), [selectedSolo]);
  const selectedSoloIsValid = soloValidation.isValid;
  const tabSystems = useMemo(() => [
    buildTabSystem(selectedSolo.bars.slice(0, 4)),
    buildTabSystem(selectedSolo.bars.slice(4, 8)),
  ], [selectedSolo.bars]);
  const playbackEvents = useMemo(() => (selectedSoloIsValid ? preparePlaybackEvents(selectedSolo.noteEvents) : []), [selectedSolo.noteEvents, selectedSoloIsValid]);

  const stopPlayback = useCallback(() => {
    if (stopTimerRef.current) {
      window.clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
    }

    if (beatTimerRef.current) {
      window.clearInterval(beatTimerRef.current);
      beatTimerRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    setIsPlaying(false);
    setPlaybackPosition({ bar: 1, beat: 1 });
  }, []);

  const playMetronomeClick = (audioContext, destination, startTime, strong = false) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(strong ? 1320 : 880, startTime);
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(strong ? 0.22 : 0.14, startTime + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.06);
    oscillator.connect(gain);
    gain.connect(destination);
    oscillator.start(startTime);
    oscillator.stop(startTime + 0.08);
  };

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
    if (!selectedSoloIsValid) {
      const nextSolo = buildSelectedSolo({ key: selectedSolo.key, style: selectedSolo.style, difficulty: selectedSolo.difficulty, soloId: selectedSolo.sourceId ?? previousSoloIdRef.current });
      previousSoloIdRef.current = nextSolo.sourceId;
      setSelectedSolo(nextSolo);
      return;
    }

    const countInBeats = countInEnabled ? 4 : 0;
    const startTime = audioContext.currentTime + 0.08;
    const soloStartTime = startTime + (countInBeats * secondsPerBeat);

    if (countInEnabled) {
      for (let beat = 0; beat < countInBeats; beat += 1) {
        playMetronomeClick(audioContext, masterGain, startTime + (beat * secondsPerBeat), beat === 0);
      }
    }

    for (let beat = 0; beat < selectedSolo.totalBeats; beat += 1) {
      playMetronomeClick(audioContext, masterGain, soloStartTime + (beat * secondsPerBeat), beat % 4 === 0);
    }

    playbackEvents.forEach((event) => {
      playPluckedNote(audioContext, masterGain, event, soloStartTime + (event.startBeat * secondsPerBeat), secondsPerBeat);
    });

    const totalMs = ((countInBeats + selectedSolo.totalBeats) * secondsPerBeat * 1000) + 450;
    setIsPlaying(true);
    beatTimerRef.current = window.setInterval(() => {
      const elapsedBeats = (audioContext.currentTime - soloStartTime) / secondsPerBeat;
      const clampedBeat = Math.max(0, Math.min(selectedSolo.totalBeats - 0.001, elapsedBeats));
      setPlaybackPosition({ bar: Math.floor(clampedBeat / 4) + 1, beat: Math.floor(clampedBeat % 4) + 1 });
    }, 90);
    stopTimerRef.current = window.setTimeout(stopPlayback, totalMs);
  };

  useEffect(() => () => stopPlayback(), [stopPlayback]);

  const rebuildSolo = useCallback((nextOptions = {}) => {
    const nextStyle = nextOptions.style ?? style;
    const nextDifficulty = nextOptions.difficulty ?? difficulty;
    const nextKey = nextOptions.key ?? selectedSolo.key;
    const previousSoloId = nextOptions.previousSoloId ?? previousSoloIdRef.current;
    const nextSolo = buildSelectedSolo({ key: nextKey, style: nextStyle, difficulty: nextDifficulty, soloId: previousSoloId });
    previousSoloIdRef.current = nextSolo.sourceId;
    setSelectedSolo(nextSolo);
  }, [difficulty, selectedSolo.key, style]);

  const handleStyleChange = (nextStyle) => {
    stopPlayback();
    setStyle(nextStyle);
    rebuildSolo({ style: nextStyle });
  };

  const handleKeyChange = (nextKey) => {
    stopPlayback();
    rebuildSolo({ key: nextKey, previousSoloId: selectedSolo.sourceId });
  };

  const handleDifficultyChange = (nextDifficulty) => {
    stopPlayback();
    setDifficulty(nextDifficulty);
    rebuildSolo({ difficulty: nextDifficulty });
  };

  const regenerate = () => {
    stopPlayback();
    rebuildSolo({ previousSoloId: selectedSolo.sourceId });
  };

  return (
    <div className={`solo-generator${isPracticeFullscreen ? ' solo-generator-fullscreen' : ''}`}>
      <section className="solo-generator-controls" aria-label="Solo generator controls" hidden={isPracticeFullscreen}>
        <fieldset><legend>Style</legend>{styles.map((item) => <button className={selectedSolo.style === item ? 'active' : ''} key={item} type="button" onClick={() => handleStyleChange(item)}>{item}</button>)}</fieldset>
        <fieldset><legend>Key</legend>{keys.map((item) => <button className={selectedSolo.key === item ? 'active' : ''} key={item} type="button" onClick={() => handleKeyChange(item)}>{item}</button>)}</fieldset>
        <fieldset><legend>Difficulty</legend>{difficulties.map((item) => <button className={selectedSolo.difficulty === item ? 'active' : ''} key={item} type="button" onClick={() => handleDifficultyChange(item)}>{item}</button>)}</fieldset>
        <button className="solo-generate-button" type="button" onClick={regenerate}>Generate New Solo</button>
        <button className={preferMoreMusical ? 'active' : ''} type="button" onClick={() => { stopPlayback(); setPreferMoreMusical(true); setDifficulty('Easy-Plus'); rebuildSolo({ difficulty: 'Easy-Plus', previousSoloId: selectedSolo.sourceId }); }}>Too Basic / More Musical</button>
      </section>

      <section className="solo-output-card" aria-labelledby="generated-solo-title">
        <div className="solo-output-header">
          <div><p className="guitar-kicker">Curated 8-bar solo</p><h2 id="generated-solo-title">{selectedSolo.title}</h2></div>
          <div className="solo-meta"><span>Key {selectedSolo.key}</span><span>{selectedSolo.style}</span><span>{selectedSolo.rhythmFeel}</span><span>{selectedSolo.difficulty}</span><span>{selectedSolo.tempo} bpm</span></div>
        </div>
        <div className="solo-detail-panel" aria-label="Solo details">
          <span>Key: {selectedSolo.key}</span>
          <span>Style: {selectedSolo.style}</span>
          <span>Rhythm feel: {selectedSolo.rhythmFeel}</span>
          <span>Difficulty: {selectedSolo.difficulty}</span>
          <span>Tempo: {selectedSolo.tempo} bpm</span>
        </div>
        <div className="solo-playback-panel" aria-label="Solo playback controls">
          <button className="solo-play-button" type="button" onClick={playSolo}>{isPlaying ? 'Restart Solo' : 'Play Solo'}</button>
          <button className="solo-stop-button" type="button" onClick={stopPlayback} disabled={!isPlaying}>Stop</button>
          <button className={countInEnabled ? 'active' : ''} type="button" onClick={() => setCountInEnabled((value) => !value)}>Count In {countInEnabled ? 'On' : 'Off'}</button>
          <div className="solo-beat-display" aria-live="polite">Bar {playbackPosition.bar} / Beat {playbackPosition.beat}</div>
          <fieldset className="solo-tempo-control"><legend>Playback speed</legend>{Object.keys(playbackTempos).map((tempo) => <button className={playbackTempo === tempo ? 'active' : ''} key={tempo} type="button" onClick={() => setPlaybackTempo(tempo)}>{tempo}</button>)}</fieldset>
        </div>
        <div className="solo-validation" aria-label="Solo validation">
          <strong>{soloValidation.isValid ? 'Ready to play:' : 'Check solo:'}</strong>
          <ul>{soloValidation.messages.map((message) => <li key={message}>{message}</li>)}</ul>
        </div>
        <div className="solo-debug-panel" aria-label="Selected solo debug data">
          {soloDataMismatch && <strong className="solo-data-mismatch">SOLO DATA MISMATCH</strong>}
          <dl>
            <dt>selectedSolo.id</dt><dd>{selectedSolo.id}</dd>
            <dt>selectedSolo.title</dt><dd>{selectedSolo.title}</dd>
            <dt>selectedSolo.key</dt><dd>{selectedSolo.key}</dd>
            <dt>selectedSolo.chordProgression</dt><dd>{JSON.stringify(selectedSolo.chordProgression)}</dd>
            <dt>selectedSolo.barChords</dt><dd>{JSON.stringify(selectedSolo.barChords)}</dd>
            <dt>selectedSolo.bars.map(b =&gt; b.chord)</dt><dd>{JSON.stringify(selectedSolo.bars.map((bar) => bar.chord))}</dd>
          </dl>
        </div>
        <div className="solo-progression" aria-label="Chord progression">
          <strong>Chord progression:</strong>
          <div className="solo-progression-grid">
            {selectedSolo.chordProgression.map((chord, index) => <span key={`${chord}-${index}`}>{chord}</span>)}
          </div>
        </div>
        <div className="solo-tab-staff" aria-label="8-bar continuous tablature">
          {tabSystems.map((system, systemIndex) => (
            <section className="solo-tab-system" key={`system-${systemIndex + 1}`} aria-label={`System ${systemIndex + 1}: bars ${system.bars[0].number}-${system.bars.at(-1).number}`}>
              <pre className="solo-system-labels solo-system-bars" aria-hidden="true">  {system.barLabels}</pre>
              <pre className="solo-system-labels solo-system-chords" aria-label={`Chord symbols for bars ${system.bars[0].number}-${system.bars.at(-1).number}`}>  {system.chords}</pre>
              <pre className="solo-tab">{system.staff}</pre>
              <div className="solo-system-rhythm-map" aria-label={`Rhythm map for bars ${system.bars[0].number}-${system.bars.at(-1).number}`}>
                {system.bars.map((bar) => (
                  <div className="solo-rhythm-map" key={`rhythm-${bar.number}`} aria-label={`Bar ${bar.number} rhythm map`}>
                    <span>Bar {bar.number}: {bar.rhythmMap.labels}</span>
                    <strong>{bar.rhythmMap.hits}</strong>
                    <em>{bar.rhythmName}</em>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
        <div className="solo-buttons" aria-label="Solo action buttons">
          <button type="button" onClick={regenerate}>Generate New Solo</button>
          <button className={preferMoreMusical ? 'active' : ''} type="button" onClick={() => { stopPlayback(); setPreferMoreMusical(true); setDifficulty('Easy-Plus'); rebuildSolo({ difficulty: 'Easy-Plus', previousSoloId: selectedSolo.sourceId }); }}>Too Basic / More Musical</button>
          {isPracticeFullscreen ? (
            <button type="button" onClick={() => setIsPracticeFullscreen(false)}>Exit Full Screen</button>
          ) : (
            <button type="button" onClick={() => setIsPracticeFullscreen(true)}>Full Screen Practice</button>
          )}
          {!isPracticeFullscreen && (<>
            <button type="button" onClick={() => { setDifficulty('Beginner'); rebuildSolo({ difficulty: 'Beginner', previousSoloId: selectedSolo.sourceId }); }}>Easier</button>
            <button type="button" onClick={() => { setStyle('Blues'); rebuildSolo({ style: 'Blues', previousSoloId: selectedSolo.sourceId }); }}>More Bluesy</button>
            <button type="button" onClick={() => { setStyle('Rock'); rebuildSolo({ style: 'Rock', previousSoloId: selectedSolo.sourceId }); }}>More Rock</button>
            <button className={showWhy ? 'active' : ''} type="button" onClick={() => setShowWhy((value) => !value)}>Show Musicality Notes</button>
            <button className={showSteps ? 'active' : ''} type="button" onClick={() => setShowSteps((value) => !value)}>Show Practice Steps</button>
          </>)}
        </div>
        <div className="solo-learning-grid">
          {!isPracticeFullscreen && showWhy && <div className="practice-box"><h3>Musicality Notes</h3><ul>{selectedSolo.musicalityNotes.map((note) => <li key={note}>{note}</li>)}</ul></div>}
          {!isPracticeFullscreen && showSteps && <div className="practice-box"><h3>Practice Steps</h3><ol>{selectedSolo.practiceSteps.map((step) => <li key={step}>{step}</li>)}</ol></div>}
        </div>
      </section>
    </div>
  );
}
