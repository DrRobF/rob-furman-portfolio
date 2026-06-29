'use client';

import { useMemo, useState } from 'react';
import { guitarLicks } from './lickData';

const allOption = 'All';

const defaultLicks = guitarLicks;

const getOptions = (items, field) => [allOption, ...Array.from(new Set(items.map((lick) => lick[field]).filter(Boolean)))];

export function LickLibrary({ licks = defaultLicks }) {
  const [filters, setFilters] = useState({ style: allOption, difficulty: allOption, key: allOption, mood: allOption });
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredLicks = useMemo(() => licks.filter((lick) => (
    (filters.style === allOption || lick.style === filters.style)
    && (filters.difficulty === allOption || lick.difficulty === filters.difficulty)
    && (filters.key === allOption || lick.key === filters.key)
    && (filters.mood === allOption || lick.mood === filters.mood)
  )), [filters, licks]);

  const activeIndex = filteredLicks.length ? currentIndex % filteredLicks.length : 0;
  const lick = filteredLicks[activeIndex];
  const updateFilter = (name, value) => { setFilters((current) => ({ ...current, [name]: value })); setCurrentIndex(0); };
  const move = (direction) => setCurrentIndex(() => (filteredLicks.length + activeIndex + direction) % filteredLicks.length);
  const randomize = () => setCurrentIndex((index) => {
    if (filteredLicks.length < 2) return 0;
    const nextIndex = Math.floor(Math.random() * filteredLicks.length);
    return nextIndex === activeIndex ? (index + 1) % filteredLicks.length : nextIndex;
  });

  return (
    <>
      <section className="lick-library-controls" aria-label="Lick library controls">
        {[['style', 'Style filter'], ['difficulty', 'Difficulty filter'], ['key', 'Key filter'], ['mood', 'Mood filter']].map(([name, label]) => (
          <label key={name}>{label}<select value={filters[name]} onChange={(event) => updateFilter(name, event.target.value)}>{getOptions(licks, name).map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
        ))}
      </section>

      {lick ? <article className="lick-practice-card" aria-live="polite">
        <div className="lick-practice-topline"><p className="guitar-kicker">Original practice lick</p><p>{activeIndex + 1} / {filteredLicks.length}</p></div>
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
