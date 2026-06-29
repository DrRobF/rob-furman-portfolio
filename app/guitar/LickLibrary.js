'use client';

import { useMemo, useState } from 'react';
import { guitarLicks } from './lickData';

const allOption = 'All';

const defaultLicks = guitarLicks;

const filterFields = [
  ['style', 'Style'],
  ['difficulty', 'Difficulty'],
  ['key', 'Key'],
  ['mood', 'Mood'],
];

const difficultyOrder = ['Beginner', 'Easy', 'Intermediate', 'Advanced'];

const sortOptions = (field, options) => [...options].sort((a, b) => {
  if (field === 'difficulty') return difficultyOrder.indexOf(a) - difficultyOrder.indexOf(b);
  if (field === 'key') return a.localeCompare(b, undefined, { numeric: true });
  return a.localeCompare(b);
});

const getOptions = (items, field) => [allOption, ...sortOptions(field, Array.from(new Set(items.map((lick) => lick[field]).filter(Boolean))))];

const exactMatch = (lick, filters) => filterFields.every(([field]) => filters[field] === allOption || lick[field] === filters[field]);

const matchScore = (lick, filters) => (
  (filters.style !== allOption && lick.style === filters.style ? 8 : 0)
  + (filters.difficulty !== allOption && lick.difficulty === filters.difficulty ? 4 : 0)
  + (filters.key !== allOption && lick.key === filters.key ? 2 : 0)
  + (filters.mood !== allOption && lick.mood === filters.mood ? 1 : 0)
);

const findClosestLick = (items, filters) => items.reduce((closest, lick) => {
  if (!closest) return lick;
  return matchScore(lick, filters) > matchScore(closest, filters) ? lick : closest;
}, null);

export function LickLibrary({ licks = defaultLicks }) {
  const [filters, setFilters] = useState({ style: allOption, difficulty: allOption, key: allOption, mood: allOption });
  const [currentIndex, setCurrentIndex] = useState(0);

  const filterOptions = useMemo(() => Object.fromEntries(filterFields.map(([field]) => [field, getOptions(licks, field)])), [licks]);

  const exactMatches = useMemo(() => licks.filter((lick) => exactMatch(lick, filters)), [filters, licks]);
  const closestLick = useMemo(() => (exactMatches.length ? null : findClosestLick(licks, filters)), [exactMatches.length, filters, licks]);
  const displayedLicks = exactMatches.length ? exactMatches : closestLick ? [closestLick] : [];
  const isShowingClosest = !exactMatches.length && Boolean(closestLick);

  const activeIndex = displayedLicks.length ? currentIndex % displayedLicks.length : 0;
  const lick = displayedLicks[activeIndex];
  const updateFilter = (name, value) => { setFilters((current) => ({ ...current, [name]: value })); setCurrentIndex(0); };
  const clearFilters = () => { setFilters({ style: allOption, difficulty: allOption, key: allOption, mood: allOption }); setCurrentIndex(0); };
  const move = (direction) => setCurrentIndex(() => (displayedLicks.length + activeIndex + direction) % displayedLicks.length);
  const randomize = () => setCurrentIndex((index) => {
    if (displayedLicks.length < 2) return 0;
    const nextIndex = Math.floor(Math.random() * displayedLicks.length);
    return nextIndex === activeIndex ? (index + 1) % displayedLicks.length : nextIndex;
  });

  return (
    <>
      <section className="lick-library-controls" aria-label="Lick library controls">
        {filterFields.map(([name, label]) => (
          <label key={name}>{label}<select value={filters[name]} onChange={(event) => updateFilter(name, event.target.value)}>{filterOptions[name].map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
        ))}
        <div className="lick-filter-summary">
          <p>Showing {displayedLicks.length} of {licks.length} licks</p>
          <button type="button" onClick={clearFilters}>Clear Filters</button>
        </div>
      </section>

      {isShowingClosest && <p className="lick-match-note" role="status">No exact match yet — showing the closest available lick.</p>}

      {lick ? <article className="lick-practice-card" aria-live="polite">
        <div className="lick-practice-topline"><p className="guitar-kicker">Original practice lick</p><p>{activeIndex + 1} / {displayedLicks.length}</p></div>
        <header className="lick-practice-header"><div><h2>{lick.title}</h2><p className="lick-subtitle">{lick.style} · Key {lick.key} · {lick.difficulty} · {lick.tempo} · {lick.mood}</p></div><div className="lick-chord">Works over <strong>{lick.chord}</strong></div></header>
        <dl className="lick-meta-list"><div><dt>Key</dt><dd>{lick.key}</dd></div><div><dt>Style</dt><dd>{lick.style}</dd></div><div><dt>Difficulty</dt><dd>{lick.difficulty}</dd></div><div><dt>Tempo</dt><dd>{lick.tempo}</dd></div></dl>
        <pre className="lick-tab" aria-label={`${lick.title} guitar tablature`}>{lick.tab}</pre>
        <div className="lick-action-row"><button type="button" onClick={() => move(-1)}>Previous Lick</button><button type="button" onClick={() => move(1)}>Next Lick</button><button type="button" onClick={randomize}>Random Lick</button></div>
        <p className="lick-audio-note">Audio coming soon — practice from the tab for now.</p>
        <div className="lick-detail-grid"><section><h3>Target notes</h3><ul>{lick.targetNotes.map((note) => <li key={note}>{note}</li>)}</ul></section><section><h3>Mood</h3><p>{lick.mood}</p><h3>Why it works</h3><p>{lick.why}</p></section><section className="lick-steps"><h3>Practice steps</h3><ol>{lick.steps.map((step) => <li key={step}>{step}</li>)}</ol></section></div>
      </article> : <p className="lick-audio-note">No licks match those filters yet.</p>}
    </>
  );
}
