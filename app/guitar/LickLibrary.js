'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { guitarLicks } from './lickData';

const allOption = 'All';
const playableKeys = ['A', 'C', 'D', 'E', 'G'];
const keyOffsets = { A: 0, C: 3, D: 5, E: 7, G: -2 };
const keyPositions = { A: '5th fret area', C: '8th fret area', D: '10th fret area', E: '12th fret area', G: '3rd fret area' };
const stringMidi = { E: 40, A: 45, D: 50, G: 55, B: 59, e: 64 };
const noteNames = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const chordToneLabels = {
  '': ['3rd', '5th', 'root'],
  5: ['root', 'b3', '5th'],
  6: ['3rd', '6th', 'root'],
  7: ['3rd', '5th', 'b7'],
  9: ['3rd', 'b7', '9th'],
  maj7: ['3rd', '5th', '7th'],
  maj9: ['3rd', '7th', '9th'],
  sus4: ['root', '4th', '5th'],
};
const speedMultipliers = { Slow: 0.6, Medium: 0.82, 'Full Speed': 1 };
const filterFields = [
  ['style', 'Style'],
  ['difficulty', 'Difficulty'],
  ['key', 'Key'],
  ['mood', 'Mood'],
  ['technique', 'Technique'],
  ['caged', 'CAGED position'],
];
const difficultyOrder = ['Beginner', 'Easy', 'Intermediate', 'Advanced'];
const defaultFilters = { style: allOption, difficulty: allOption, key: allOption, mood: allOption, technique: allOption, caged: allOption };

const sortOptions = (field, options) => [...options].sort((a, b) => {
  if (field === 'difficulty') return difficultyOrder.indexOf(a) - difficultyOrder.indexOf(b);
  if (field === 'key') return playableKeys.indexOf(a) - playableKeys.indexOf(b);
  return a.localeCompare(b);
});
const getFieldValue = (lick, field) => (field === 'technique' ? lick.techniques : lick[field]);
const getOptions = (items, field) => {
  if (field === 'key') return [allOption, ...playableKeys];
  const values = items.flatMap((lick) => getFieldValue(lick, field)).filter(Boolean);
  return [allOption, ...sortOptions(field, Array.from(new Set(values)))];
};
const matchesField = (lick, field, value) => {
  if (value === allOption || field === 'key') return true;
  const lickValue = getFieldValue(lick, field);
  return Array.isArray(lickValue) ? lickValue.includes(value) : lickValue === value;
};
const exactMatch = (lick, filters) => filterFields.every(([field]) => matchesField(lick, field, filters[field]));
const matchScore = (lick, filters) => filterFields.reduce((score, [field], index) => (matchesField(lick, field, filters[field]) && filters[field] !== allOption ? score + (12 - index * 2) : score), 0);
const findClosestLick = (items, filters) => items.reduce((closest, lick) => (!closest || matchScore(lick, filters) > matchScore(closest, filters) ? lick : closest), null);
const midiToFreq = (midi) => 440 * (2 ** ((midi - 69) / 12));
const noteName = (midi) => noteNames[((midi % 12) + 12) % 12];
const displayFret = (fret, offset) => {
  let moved = fret + offset;
  while (moved < 0) moved += 12;
  while (moved > 17) moved -= 12;
  return moved;
};
const transposeLick = (lick, selectedKey) => {
  const key = selectedKey === allOption ? 'A' : selectedKey;
  const offset = keyOffsets[key] ?? 0;
  const events = lick.noteEvents.map((event) => {
    const fret = displayFret(event.fret, offset);
    const midi = stringMidi[event.string] + fret;
    return { ...event, fret, midi, note: noteName(midi) };
  });
  const targetNotes = (chordToneLabels[lick.chordType] || chordToneLabels['']).map((label, index) => `${events[index]?.note || key} (${label})`);
  return { ...lick, key, positionArea: keyPositions[key], chord: `${key}${lick.chordType}`, noteEvents: events, targetNotes };
};
const renderTab = (events) => ['e', 'B', 'G', 'D', 'A', 'E'].map((string) => {
  const notes = events.map((event) => (event.string === string ? String(event.fret).padEnd(3, '-') : '---')).join('');
  return `${string}|-${notes}|`;
}).join('\n');

export function LickLibrary({ licks = guitarLicks }) {
  const [filters, setFilters] = useState(defaultFilters);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [speed, setSpeed] = useState('Medium');
  const [isLooping, setIsLooping] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef({ context: null, timers: [], loopTimer: null });

  const filterOptions = useMemo(() => Object.fromEntries(filterFields.map(([field]) => [field, getOptions(licks, field)])), [licks]);
  const exactMatches = useMemo(() => licks.filter((lick) => exactMatch(lick, filters)), [filters, licks]);
  const closestLick = useMemo(() => (exactMatches.length ? null : findClosestLick(licks, filters)), [exactMatches.length, filters, licks]);
  const displayedLicks = exactMatches.length ? exactMatches : closestLick ? [closestLick] : [licks[0]].filter(Boolean);
  const isShowingClosest = !exactMatches.length && Boolean(closestLick);
  const activeIndex = displayedLicks.length ? currentIndex % displayedLicks.length : 0;
  const lick = transposeLick(displayedLicks[activeIndex], filters.key);
  const tab = renderTab(lick.noteEvents);

  const stopPlayback = () => {
    audioRef.current.timers.forEach(clearTimeout);
    clearTimeout(audioRef.current.loopTimer);
    audioRef.current = { ...audioRef.current, timers: [], loopTimer: null };
    setIsPlaying(false);
  };
  const playPlayback = () => {
    stopPlayback();
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const context = audioRef.current.context || new AudioContext();
    audioRef.current.context = context;
    const secondsPerBeat = 60 / (lick.tempo * speedMultipliers[speed]);
    let cursor = 0;
    lick.noteEvents.forEach((event) => {
      const timer = setTimeout(() => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = 'triangle';
        oscillator.frequency.value = midiToFreq(event.midi);
        gain.gain.setValueAtTime(0.0001, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.22, context.currentTime + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + Math.max(0.08, event.beats * secondsPerBeat * 0.86));
        oscillator.connect(gain).connect(context.destination);
        oscillator.start();
        oscillator.stop(context.currentTime + Math.max(0.1, event.beats * secondsPerBeat));
      }, cursor * 1000);
      audioRef.current.timers.push(timer);
      cursor += event.beats * secondsPerBeat;
    });
    audioRef.current.loopTimer = setTimeout(() => { setIsPlaying(false); if (isLooping) playPlayback(); }, cursor * 1000 + 120);
    setIsPlaying(true);
  };

  useEffect(() => stopPlayback, []);
  const updateFilter = (name, value) => { stopPlayback(); setFilters((current) => ({ ...current, [name]: value })); setCurrentIndex(0); };
  const clearFilters = () => { stopPlayback(); setFilters(defaultFilters); setCurrentIndex(0); };
  const move = (direction) => { stopPlayback(); setCurrentIndex(() => (displayedLicks.length + activeIndex + direction) % displayedLicks.length); };
  const randomize = () => { stopPlayback(); setCurrentIndex((index) => { if (displayedLicks.length < 2) return 0; const nextIndex = Math.floor(Math.random() * displayedLicks.length); return nextIndex === activeIndex ? (index + 1) % displayedLicks.length : nextIndex; }); };

  return (
    <>
      <section className="lick-library-controls" aria-label="Lick library controls">
        {filterFields.map(([name, label]) => (
          <label key={name}>{label}<select value={filters[name]} onChange={(event) => updateFilter(name, event.target.value)}>{filterOptions[name].map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
        ))}
        <div className="lick-filter-summary"><p>Showing {displayedLicks.length} of {licks.length} licks</p><button type="button" onClick={clearFilters}>Clear Filters</button></div>
      </section>
      {isShowingClosest && <p className="lick-match-note" role="status">No exact match yet — showing a nearby lick.</p>}
      <article className="lick-practice-card" aria-live="polite">
        <div className="lick-practice-topline"><p className="guitar-kicker">Original practice lick</p><p>{activeIndex + 1} / {displayedLicks.length}</p></div>
        <header className="lick-practice-header"><div><h2>{lick.title}</h2><p className="lick-subtitle">{lick.style} · Key {lick.key} · {lick.positionArea} · {lick.difficulty} · {lick.tempo} bpm · {lick.mood}</p></div><div className="lick-chord">Works over <strong>{lick.chord}</strong></div></header>
        <dl className="lick-meta-list"><div><dt>Key</dt><dd>{lick.key}</dd></div><div><dt>Style</dt><dd>{lick.style}</dd></div><div><dt>Technique</dt><dd>{lick.techniques.join(', ')}</dd></div><div><dt>CAGED</dt><dd>{lick.caged}</dd></div></dl>
        <pre className="lick-tab" aria-label={`${lick.title} guitar tablature`}>{tab}</pre>
        <div className="lick-action-row"><button type="button" onClick={() => move(-1)}>Previous Lick</button><button type="button" onClick={() => move(1)}>Next Lick</button><button type="button" onClick={randomize}>Random Lick</button></div>
        <div className="lick-action-row" aria-label="Lick audio controls"><button type="button" onClick={playPlayback}>{isPlaying ? 'Restart Lick' : 'Play Lick'}</button><button type="button" onClick={stopPlayback}>Stop</button><button type="button" className={isLooping ? 'active' : ''} onClick={() => setIsLooping((value) => !value)}>Loop {isLooping ? 'On' : 'Off'}</button>{Object.keys(speedMultipliers).map((option) => <button type="button" key={option} className={speed === option ? 'active' : ''} onClick={() => setSpeed(option)}>{option}</button>)}</div>
        <p className="lick-audio-note">Browser synth audio uses this lick’s note events — no login, external API, or audio files required.</p>
        <div className="lick-detail-grid"><section><h3>Target notes</h3><ul>{lick.targetNotes.map((note) => <li key={note}>{note}</li>)}</ul></section><section><h3>Mood</h3><p>{lick.mood}</p><h3>Why it works</h3><p>{lick.why}</p></section><section className="lick-steps"><h3>Practice steps</h3><ol>{lick.steps.map((step) => <li key={step}>{step}</li>)}</ol></section></div>
      </article>
    </>
  );
}
