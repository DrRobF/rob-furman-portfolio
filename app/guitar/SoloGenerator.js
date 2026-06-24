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

const rhythmTemplates = [
  { name: 'quarter note sustain', starts: [0, 1, 2, 3], durations: [1, 1, 1, 1] },
  { name: 'two eighth-note pickup', starts: [0.5, 1, 2, 3], durations: [0.5, 1, 0.5, 1] },
  { name: 'rest on beat 1, answer on beat 2', starts: [1, 1.5, 2.5, 3], durations: [0.5, 0.5, 0.5, 1] },
  { name: 'syncopated pickup into beat 3', starts: [0.5, 1.5, 2, 3], durations: [0.5, 0.5, 1, 0.5] },
  { name: 'held bend over two beats', starts: [0, 2, 3], durations: [2, 0.5, 1] },
  { name: 'short phrase ending on beat 4', starts: [0, 1, 2.5, 3], durations: [0.5, 0.5, 0.5, 1] },
];

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

function barsToNoteEvents(bars) {
  return bars.flatMap((bar, barIndex) => {
    const sourceNotes = extractTabNotes(bar);
    const template = rhythmTemplates[barIndex % rhythmTemplates.length];
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

const cleanTab = ({ e = '--------------------', B = '--------------------', G = '--------------------', D = '--------------------', A = '--------------------', E = '--------------------' }) => `e|${e}|\nB|${B}|\nG|${G}|\nD|${D}|\nA|${A}|\nE|${E}|`;

function makeBars(style, noteEvents, chordProgression = styleFallbackProgressions[style]) {
  return Array.from({ length: 8 }, (_, index) => {
    const events = noteEvents.filter((event) => event.bar === index + 1);
    return {
      number: index + 1,
      chord: chordProgression[index],
      tab: eventsToTab(events),
      rhythmMap: makeRhythmMap(events),
      rhythmName: events[0]?.rhythmName ?? 'intentional rest',
      events,
    };
  });
}

function makeSolo({ title, key, style, difficulty = 'Beginner', tempo, rhythmLabel = 'varied 2-bar phrasing', musicalityLevel = 'standard', notes, steps, bars }) {
  return {
    title,
    sourceTitle: title,
    key,
    style,
    difficulty,
    tempo,
    rhythmLabel,
    musicalityLevel,
    sourceBars: bars,
    sourceProgression: styleFallbackProgressions[style],
    chordProgression: keyProgressions[key] ?? styleFallbackProgressions[style],
    noteEvents: barsToNoteEvents(bars),
    bars: makeBars(style, barsToNoteEvents(bars), keyProgressions[key] ?? styleFallbackProgressions[style]),
    totalBeats: 32,
    musicalityNotes: notes,
    practiceSteps: steps,
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
    title: `${targetKey} ${solo.style} Solo`,
    key: targetKey,
    chordProgression,
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
  if (lastIndex < 0) return [{ ...root, bar: 8, beat: 4, startBeat: 31, durationBeats: 1, technique: '', rhythmName: 'short phrase ending on beat 4' }];
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

function validateSolo(solo, selectedKey) {
  const messages = [];
  const expectedProgression = keyProgressions[selectedKey] ?? [];
  const finalEvent = solo.noteEvents.at(-1);
  const root = rootEventForKey(selectedKey);
  const hasRootEnding = finalEvent?.string === root.string && finalEvent?.fret === root.fret;
  const progressionMatches = expectedProgression.join('|') === solo.chordProgression.join('|');
  const barLabelsMatch = solo.bars.every((bar, index) => bar.chord === solo.chordProgression[index]);
  const populatedBars = new Set(solo.noteEvents.map((event) => event.bar));
  const titleMatchesKey = solo.title.includes(selectedKey);
  const metadataMatchesKey = solo.key === selectedKey;
  const gridAligned = solo.noteEvents.every((event) => event.bar >= 1 && event.bar <= 8 && event.beat >= 1 && event.beat <= 4 && Number.isInteger((event.beat - 1) * 2) && event.durationBeats > 0 && event.startBeat >= 0 && event.startBeat < 32);
  const audioMatchesTab = solo.bars.every((bar) => bar.events.every((event) => solo.noteEvents.includes(event)));

  if (solo.totalBeats === 32 && gridAligned) messages.push('Timeline confirmed: 8 bars × 4 beats = 32 beats on the 1 & 2 & 3 & 4 & grid.');
  if (metadataMatchesKey && titleMatchesKey) messages.push(`Title and metadata confirmed for key of ${selectedKey}.`);
  if (barLabelsMatch && progressionMatches) messages.push(`Bar labels and progression confirmed for key of ${selectedKey}.`);
  if (hasRootEnding) messages.push(`Final note confirmed: resolves to ${selectedKey}.`);
  if (populatedBars.size === 8 && audioMatchesTab) messages.push('Display tab, rhythm map, and audio all use the same note events.');

  return { isValid: solo.totalBeats === 32 && metadataMatchesKey && titleMatchesKey && hasRootEnding && progressionMatches && barLabelsMatch && populatedBars.size === 8 && gridAligned && audioMatchesTab, messages };
}

const curatedSolos = [
  makeSolo({ title: 'Front Porch A Blues', key: 'A', style: 'Blues', tempo: 72, rhythmLabel: 'shuffle feel with space', musicalityLevel: 'more', notes: ['Bars 1–2 state a compact A blues-box motif and answer it.', 'Bars 3–4 repeat the bend-and-resolution idea with more space.', 'Bars 7–8 land on A/C# chord tones before the E7 turnaround.'], steps: ['Clap the rests before adding notes.', 'Practice the 7b9 bend slowly and keep it vocal.', 'Loop bars 7–8 until the ending feels settled.'], bars: [{ B: '------------5h8-5---', G: '--------5h6-------6--' }, { e: '-----------5--------', B: '-------5h8---8-5----', G: '-----6-----------6--' }, { B: '-----5--------------', G: '-7b9---7-5----------', D: '-----------7--------' }, { B: '-----5---5----------', G: '---5h6---6-5--------', D: '-7-----------7------' }, { e: '---------5----------', B: '-----5h8---8-5------', G: '---6-----------6----' }, { B: '-8-5----------------', G: '-----7-5------------', D: '---------7-5h7------' }, { B: '-----5--------------', G: '-5h6---6-5----------', D: '-----------7--------' }, { e: '-----5--------------', B: '-8-5---8-5----------', G: '-----------6--------' }] }),
  makeSolo({ title: 'Slow Bend A Blues', key: 'A', style: 'Blues', difficulty: 'Easy-Plus', tempo: 68, rhythmLabel: 'slow soulful phrasing', musicalityLevel: 'more', notes: ['The same bend sound returns so the solo has a hook.', 'Open spaces after each answer keep it from sounding like an exercise.', 'The final bar resolves to the A major third for a clear blues ending.'], steps: ['Sing each bend before playing it.', 'Mute unused strings during the rests.', 'Play the last note longer than written.'], bars: [{ B: '-----5--------------', G: '-7b9---7-5----------', D: '-----------7--------' }, { e: '---------5----------', B: '-----5h8---8-5------', G: '---6-----------6----' }, { B: '-5-----5------------', G: '---7-5---6----------', D: '-----------7--------' }, { G: '---5-6--------------', D: '-7-----7------------' }, { B: '-------5-8-5--------', G: '---5h6-------6------' }, { e: '-5------------------', B: '---8-5--------------', G: '-------7-5----------', D: '-----------7--------' }, { G: '-5-7b8-5------------', D: '---------7----------' }, { B: '-5------------------', G: '---6-5--------------', D: '-------7------------' }] }),
  makeSolo({ title: 'Answer Back Blues', key: 'A', style: 'Blues', tempo: 76, rhythmLabel: 'call-and-response shuffle', musicalityLevel: 'more', notes: ['Bars 1–4 ask a small question and bars 5–8 answer it.', 'Hammer-ons are used as vocal pickups, not as fast filler.', 'The ending outlines A7 against the E7 bar for a loopable turnaround.'], steps: ['Learn bars 1–2 as one sentence.', 'Copy that timing in bars 5–6.', 'Make the last two bars quieter and more relaxed.'], bars: [{ G: '---5-6--------------', D: '-7-----7------------' }, { B: '-----5--------------', G: '---5h6---6----------', D: '-7----------7-------' }, { B: '-5-----5------------', G: '---7-5---6----------', D: '-----------7--------' }, { e: '-----5--------------', B: '-8-5---8-5----------', G: '-----------6--------' }, { B: '-------5-8-5--------', G: '---5h6-------6------' }, { e: '-5------------------', B: '---8-5--------------', G: '-------7-5----------', D: '-----------7--------' }, { B: '-----5---5----------', G: '-7b9---7---5--------', D: '-------------7------' }, { G: '-5h6----------------', D: '-----7--------------' }] }),
  makeSolo({ title: 'Garage E Rock', key: 'E', style: 'Rock', tempo: 92, rhythmLabel: 'straight eighth rock', musicalityLevel: 'standard', notes: ['A repeated E minor-pentatonic riff anchors the solo.', 'The high-string answer in bar 4 gives the phrase a chorus-like lift.', 'The final E note makes the line resolve instead of drift.'], steps: ['Palm-mute the lower string notes lightly.', 'Keep the bar-4 answer short and punchy.', 'Loop with a steady down-up picking pattern.'], bars: [{ G: '-----2-4-2----------', D: '-2-4-------4-2------' }, { B: '-----3--------------', G: '-2h4---4-2----------', D: '-----------4--------' }, { G: '-2-2-4-2------------', D: '---------4-2--------' }, { e: '-----3-0------------', B: '-3-0-----3-0--------', G: '-------------2------' }, { D: '-2-4-5-4-2----------', A: '-----------2--------' }, { G: '-4b5-4-2------------', D: '---------4----------' }, { B: '-3-5-3--------------', G: '-------4-2----------' }, { G: '-4-2----------------', D: '-----2--------------' }] }),
  makeSolo({ title: 'Power Chord Answer', key: 'E', style: 'Rock', difficulty: 'Easy-Plus', tempo: 96, rhythmLabel: 'driving rock pickups', musicalityLevel: 'more', notes: ['Lower-string riffs are answered by upper-string hooks.', 'Slides and a small bend add attitude without adding clutter.', 'The last bar resolves directly to E.'], steps: ['Practice the first two bars with a metronome.', 'Let the slide in bar 4 connect smoothly.', 'Accent the first note of every two-bar phrase.'], bars: [{ D: '-2-4-5-4-2----------', A: '-----------2--------' }, { G: '-----2--------------', D: '-2-4---4-2----------' }, { B: '---3---3------------', G: '-4---4---2----------' }, { G: '-2/4-2--------------', D: '-------4-2----------' }, { G: '-2---2---4----------', D: '---4---4------------' }, { e: '-3-0----------------', B: '-----3-0------------', G: '---------2----------' }, { B: '---3-5b6-3----------', G: '-4---------4--------' }, { D: '-4-2----------------', A: '-----2--------------' }] }),
  makeSolo({ title: 'Open Road Rock', key: 'E', style: 'Rock', tempo: 88, rhythmLabel: 'straight eighth rock', musicalityLevel: 'more', notes: ['The rhythm repeats enough to feel like a real riff.', 'Bars 5–6 climb into a simple melodic peak.', 'The ending comes back to the low E center.'], steps: ['Count four beats in every bar before playing.', 'Keep bends small and controlled.', 'Record yourself and check that the motif is recognizable.'], bars: [{ G: '-2-4-2-4------------', D: '---------2----------' }, { B: '-----3--------------', G: '-4-2---4-2----------' }, { G: '-------2-4----------', D: '-2-4-5--------------' }, { G: '-4-2----------------', D: '-----4-2------------', A: '---------2----------' }, { B: '-3------------------', G: '---4-2--------------', D: '-------4-2----------' }, { e: '---------3----------', B: '-----3-5---5-3------' }, { G: '-2/4-2--------------', D: '-------4-2----------' }, { B: '-----3--------------', G: '-4-2----------------', D: '-----2--------------' }] }),
  makeSolo({ title: 'Sweet G Major', key: 'G', style: 'Soulful Major', tempo: 76, rhythmLabel: 'call-and-response shuffle', musicalityLevel: 'more', notes: ['Major-pentatonic notes create a warm, vocal sound.', 'The opening motif returns in smaller pieces later in the solo.', 'The final G/B sound resolves sweetly over the D bar.'], steps: ['Play every phrase legato and relaxed.', 'Hold the first note after each rest.', 'Name the G, B, and D chord tones as you play.'], bars: [{ B: '-----3-5-3----------', G: '-2h4-------4-2------' }, { e: '-------3------------', B: '-3-5-----5-3--------', G: '-----4-------4------' }, { B: '-3-----3------------', G: '---4-2---4-2--------', D: '-------------5------' }, { e: '-----3--------------', B: '-3-5---5-3----------', G: '-----------4--------' }, { B: '---3-5--------------', G: '-4-----4------------' }, { e: '-3------------------', B: '---5-3--------------', G: '-------4-2----------' }, { B: '-3h5-3--------------', G: '-------4-2----------' }, { B: '-5-3----------------', G: '-----4--------------' }] }),
  makeSolo({ title: 'Churchy G Answer', key: 'G', style: 'Soulful Major', difficulty: 'Easy-Plus', tempo: 72, rhythmLabel: 'shuffle feel with space', musicalityLevel: 'more', notes: ['Call-and-response phrasing makes the melody sing.', 'Small hammer-ons add expression while staying beginner-friendly.', 'The last phrase relaxes into a G major color.'], steps: ['Use light vibrato on held notes.', 'Do not rush the pickups.', 'Practice bars 7–8 as the ending first.'], bars: [{ G: '-2-4-2--------------', D: '-------5------------' }, { B: '-----3--------------', G: '-2h4---4-2----------' }, { e: '-3-5-3--------------', B: '-------5-3----------' }, { B: '-3---3---5----------', G: '---4---4------------' }, { e: '-----3--------------', B: '-6-5---3------------', G: '---------4----------' }, { B: '---3----------------', G: '-4---2--------------' }, { B: '---3-5-3------------', G: '-4-------4-2--------' }, { e: '-3------------------', B: '---5-3--------------' }] }),
  makeSolo({ title: 'Porch Soul Major', key: 'G', style: 'Soulful Major', tempo: 70, rhythmLabel: 'slow soulful phrasing', musicalityLevel: 'more', notes: ['Fewer notes leave more room for tone.', 'The slide in bar 3 sounds like a singer leaning into a note.', 'The final bar lands on G for a complete ending.'], steps: ['Play it at speaking speed first.', 'Make the slide audible but gentle.', 'Add your own vibrato only on the final note.'], bars: [{ B: '---3-5--------------', G: '-4-----4------------' }, { e: '---------3----------', B: '-----3-5---5--------', G: '-2h4----------------' }, { B: '-3/5-3--------------', G: '-------4-2----------' }, { B: '---3-5-3------------', G: '-4-------4-2--------' }, { e: '-5-3----------------', B: '-----5-3------------', G: '---------4----------' }, { B: '-----3-5------------', G: '-2-4-----4----------' }, { B: '-3h5-3--------------', G: '-------4-2----------' }, { G: '-2h4----------------', D: '-----5--------------' }] }),
  makeSolo({ title: 'Bright D Country', key: 'D', style: 'Country-ish', tempo: 84, rhythmLabel: 'country pickup feel', musicalityLevel: 'standard', notes: ['Open-position D major shapes give the solo twang.', 'Hammer-ons and quick answers create a country feel without speed.', 'The final D/F# shape resolves cleanly.'], steps: ['Use a bright pick attack.', 'Keep the hammer-ons even.', 'Let the final D ring.'], bars: [{ e: '-2-3-2--------------', B: '-------3------------', G: '---------2----------' }, { e: '-----2-5-2----------', B: '-3-5-------5-3------' }, { e: '-2-----2------------', B: '---3-5---3----------', G: '-----------2--------' }, { e: '---2-3-5------------', B: '-3------------------' }, { B: '-3-5-3--------------', G: '-------4-2----------' }, { e: '-5-3-2--------------', B: '-------5-3----------' }, { e: '-----2--------------', B: '-3h5---5-3----------' }, { e: '-2------------------', B: '---3----------------' }] }),
  makeSolo({ title: 'Chicken Pickin Easy', key: 'D', style: 'Country-ish', difficulty: 'Easy-Plus', tempo: 88, rhythmLabel: 'country pickup feel', musicalityLevel: 'more', notes: ['Short snappy answers create the chicken-pickin character.', 'The slide gives one flashy moment without making the solo hard.', 'The ending targets D chord tones.'], steps: ['Play staccato in bars 1–2.', 'Slide slowly at first, then tighten the timing.', 'Practice muting after each short phrase.'], bars: [{ B: '-3---3--------------', G: '---2---2------------' }, { e: '-2/5-2--------------', B: '-------3------------' }, { e: '---2----------------', B: '-5---3--------------', G: '-------2------------' }, { B: '-----3-5------------', G: '-2-4-----2----------' }, { e: '-2-2----------------', B: '-----3-5------------' }, { e: '-------2-5----------', B: '-3-5-3--------------' }, { e: '-5-2----------------', B: '-----5-3------------' }, { B: '-3h5-3--------------', G: '-------2------------' }] }),
  makeSolo({ title: 'Front Porch Country', key: 'D', style: 'Country-ish', tempo: 80, rhythmLabel: 'relaxed country pickup feel', musicalityLevel: 'more', notes: ['Long spaces make the melody feel relaxed and playable.', 'The bend in bar 4 is the expressive peak.', 'Bars 7–8 close like a complete sentence.'], steps: ['Leave silence after each two-bar idea.', 'Bend bar 4 only slightly and return in tune.', 'Play the ending three times in a row without stopping.'], bars: [{ e: '---2-3-2------------', B: '-3-------3----------' }, { G: '-2-4-2--------------', D: '-------4------------' }, { e: '-2-3-5-3-2----------', B: '-----------3--------' }, { B: '-5b6-5-3------------', G: '---------2----------' }, { e: '-----2--------------', B: '-3-5---3------------', G: '---------2----------' }, { e: '-5-3-2--------------', B: '-------3------------' }, { B: '-3h5-3--------------', G: '-------2------------' }, { e: '-2------------------', B: '---3----------------' }] }),
];

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function selectCuratedSolo(style, difficulty, key, previousTitle = '', preferMoreMusical = false) {
  const styleSolos = curatedSolos.filter((entry) => entry.style === style);
  const difficultyMatches = styleSolos.filter((entry) => entry.difficulty === difficulty);
  const musicalMatches = preferMoreMusical ? difficultyMatches.filter((entry) => entry.musicalityLevel === 'more') : [];
  const pool = musicalMatches.length ? musicalMatches : (difficultyMatches.length ? difficultyMatches : styleSolos);
  const freshPool = pool.length > 1 ? pool.filter((entry) => entry.sourceTitle !== previousTitle && entry.title !== previousTitle) : pool;
  return transposeSoloToKey(pick(freshPool.length ? freshPool : pool), key);
}

export function SoloGenerator() {
  const [style, setStyle] = useState('Blues');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [selectedKey, setSelectedKey] = useState('A');
  const [preferMoreMusical, setPreferMoreMusical] = useState(false);
  const [soloSeed, setSoloSeed] = useState(0);
  const [showWhy, setShowWhy] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [isPracticeFullscreen, setIsPracticeFullscreen] = useState(false);
  const [playbackTempo, setPlaybackTempo] = useState('Medium');
  const [isPlaying, setIsPlaying] = useState(false);
  const [countInEnabled, setCountInEnabled] = useState(true);
  const [playbackPosition, setPlaybackPosition] = useState({ bar: 1, beat: 1 });
  const [selectedSolo, setSelectedSolo] = useState(() => selectCuratedSolo('Blues', 'Beginner', 'A', '', false));
  const audioContextRef = useRef(null);
  const stopTimerRef = useRef(null);
  const beatTimerRef = useRef(null);
  const previousTitleRef = useRef('');

  useEffect(() => {
    setSelectedSolo(selectCuratedSolo(style, difficulty, selectedKey, previousTitleRef.current, preferMoreMusical));
  }, [style, difficulty, selectedKey, preferMoreMusical, soloSeed]);

  const soloValidation = useMemo(() => validateSolo(selectedSolo, selectedKey), [selectedSolo, selectedKey]);
  const selectedSoloIsValid = soloValidation.isValid;
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
      setSelectedSolo(selectCuratedSolo(style, difficulty, selectedKey, previousTitleRef.current, preferMoreMusical));
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

  useEffect(() => {
    previousTitleRef.current = selectedSolo.sourceTitle ?? selectedSolo.title;
  }, [selectedSolo.title]);

  useEffect(() => () => stopPlayback(), [stopPlayback]);

  const regenerate = () => {
    stopPlayback();
    setSoloSeed((value) => value + 1);
  };

  return (
    <div className={`solo-generator${isPracticeFullscreen ? ' solo-generator-fullscreen' : ''}`}>
      <section className="solo-generator-controls" aria-label="Solo generator controls" hidden={isPracticeFullscreen}>
        <fieldset><legend>Style</legend>{styles.map((item) => <button className={style === item ? 'active' : ''} key={item} type="button" onClick={() => setStyle(item)}>{item}</button>)}</fieldset>
        <fieldset><legend>Key</legend>{keys.map((item) => <button className={selectedKey === item ? 'active' : ''} key={item} type="button" onClick={() => setSelectedKey(item)}>{item}</button>)}</fieldset>
        <fieldset><legend>Difficulty</legend>{difficulties.map((item) => <button className={difficulty === item ? 'active' : ''} key={item} type="button" onClick={() => setDifficulty(item)}>{item}</button>)}</fieldset>
        <button className="solo-generate-button" type="button" onClick={regenerate}>Generate New Solo</button>
        <button className={preferMoreMusical ? 'active' : ''} type="button" onClick={() => { setPreferMoreMusical(true); setDifficulty('Easy-Plus'); regenerate(); }}>Too Basic / More Musical</button>
      </section>

      <section className="solo-output-card" aria-labelledby="generated-solo-title">
        <div className="solo-output-header">
          <div><p className="guitar-kicker">Curated 8-bar solo</p><h2 id="generated-solo-title">{selectedSolo.title}</h2></div>
          <div className="solo-meta"><span>Key {selectedSolo.key}</span><span>{selectedSolo.style}</span><span>{selectedSolo.rhythmLabel}</span><span>{selectedSolo.difficulty}</span><span>{selectedSolo.tempo} bpm</span></div>
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
        <div className="solo-progression" aria-label="Chord progression">
          <strong>Chord progression:</strong>
          <div className="solo-progression-grid">
            {selectedSolo.chordProgression.map((chord, index) => <span key={`${chord}-${index}`}>{chord}</span>)}
          </div>
        </div>
        <div className="solo-tab-grid" aria-label="8-bar curated tablature">
          {selectedSolo.bars.map((bar) => (
            <article className="solo-bar" key={`bar-${bar.number}`}>
              <div className="solo-bar-heading">Bar {bar.number} - {bar.chord}</div>
              <pre className="solo-tab">{bar.tab}</pre>
              <div className="solo-rhythm-map" aria-label={`Bar ${bar.number} rhythm map`}>
                <span>{bar.rhythmMap.labels}</span>
                <strong>{bar.rhythmMap.hits}</strong>
                <em>{bar.rhythmName}</em>
              </div>
            </article>
          ))}
        </div>
        <div className="solo-buttons" aria-label="Solo action buttons">
          <button type="button" onClick={regenerate}>Generate New Solo</button>
          <button className={preferMoreMusical ? 'active' : ''} type="button" onClick={() => { setPreferMoreMusical(true); setDifficulty('Easy-Plus'); regenerate(); }}>Too Basic / More Musical</button>
          {isPracticeFullscreen ? (
            <button type="button" onClick={() => setIsPracticeFullscreen(false)}>Exit Full Screen</button>
          ) : (
            <button type="button" onClick={() => setIsPracticeFullscreen(true)}>Full Screen Practice</button>
          )}
          {!isPracticeFullscreen && (<>
            <button type="button" onClick={() => { setDifficulty('Beginner'); regenerate(); }}>Easier</button>
            <button type="button" onClick={() => { setStyle('Blues'); regenerate(); }}>More Bluesy</button>
            <button type="button" onClick={() => { setStyle('Rock'); regenerate(); }}>More Rock</button>
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
