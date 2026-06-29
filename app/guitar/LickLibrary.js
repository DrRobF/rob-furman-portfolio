'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import importedLickData from '../../src/data/guitarLicks.json';

const allOption = 'All';
const speedMultipliers = { Slow: 0.6, Medium: 0.82, 'Full Speed': 1 };
const filterFields = [
  ['style', 'Style'],
  ['difficulty', 'Difficulty'],
  ['key', 'Key'],
];
const difficultyOrder = ['Beginner', 'Easy', 'Intermediate', 'Advanced'];
const defaultFilters = { style: allOption, difficulty: allOption, key: allOption };

const importedLicks = Array.isArray(importedLickData) ? importedLickData : importedLickData.licks ?? [];

const normalizeList = (value) => (Array.isArray(value) ? value.filter(Boolean) : []);
const normalizeLick = (lick, index) => ({
  id: lick.id || `${lick.title || 'imported-lick'}-${index}`,
  title: lick.title || 'Untitled lick',
  style: lick.style || 'Unspecified style',
  key: lick.key || 'Unspecified key',
  difficulty: lick.difficulty || 'Unspecified difficulty',
  tempo: lick.tempo || 'Unspecified tempo',
  chord: lick.chord || 'Unspecified chord',
  tab: lick.tab || '',
  audioUrl: lick.audioUrl || '',
  source: lick.source || 'Source not provided',
  license: lick.license || 'License not provided',
  attribution: lick.attribution || 'Attribution not provided',
  whyItWorks: lick.whyItWorks || '',
  practiceSteps: normalizeList(lick.practiceSteps),
});
const sortOptions = (field, options) => [...options].sort((a, b) => {
  if (field === 'difficulty') return (difficultyOrder.indexOf(a) === -1 ? 99 : difficultyOrder.indexOf(a)) - (difficultyOrder.indexOf(b) === -1 ? 99 : difficultyOrder.indexOf(b));
  return a.localeCompare(b);
});
const getOptions = (items, field) => [allOption, ...sortOptions(field, Array.from(new Set(items.map((lick) => lick[field]).filter(Boolean))))];
const matchesField = (lick, field, value) => value === allOption || lick[field] === value;
const exactMatch = (lick, filters) => filterFields.every(([field]) => matchesField(lick, field, filters[field]));

export function LickLibrary({ licks = importedLicks }) {
  const importedItems = useMemo(() => licks.map(normalizeLick).filter((lick) => lick.tab), [licks]);
  const [filters, setFilters] = useState(defaultFilters);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [speed, setSpeed] = useState('Medium');
  const [isLooping, setIsLooping] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const filterOptions = useMemo(() => Object.fromEntries(filterFields.map(([field]) => [field, getOptions(importedItems, field)])), [importedItems]);
  const displayedLicks = useMemo(() => importedItems.filter((lick) => exactMatch(lick, filters)), [filters, importedItems]);
  const activeIndex = displayedLicks.length ? currentIndex % displayedLicks.length : 0;
  const lick = displayedLicks[activeIndex];

  const stopPlayback = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setIsPlaying(false);
  };

  const playPlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = speedMultipliers[speed];
    audio.loop = isLooping;
    try {
      audio.currentTime = 0;
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  useEffect(() => stopPlayback, []);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = speedMultipliers[speed];
    audio.loop = isLooping;
  }, [speed, isLooping, lick?.audioUrl]);

  const updateFilter = (name, value) => { stopPlayback(); setFilters((current) => ({ ...current, [name]: value })); setCurrentIndex(0); };
  const clearFilters = () => { stopPlayback(); setFilters(defaultFilters); setCurrentIndex(0); };
  const move = (direction) => { stopPlayback(); setCurrentIndex(() => (displayedLicks.length + activeIndex + direction) % displayedLicks.length); };

  if (!importedItems.length) {
    return <p className="lick-empty-state" role="status">No licks imported yet.</p>;
  }

  if (!displayedLicks.length) {
    return (
      <>
        <section className="lick-library-controls" aria-label="Lick library controls">
          {filterFields.map(([name, label]) => (
            <label key={name}>{label}<select value={filters[name]} onChange={(event) => updateFilter(name, event.target.value)}>{filterOptions[name].map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
          ))}
          <div className="lick-filter-summary"><p>Showing 0 of {importedItems.length} licks</p><button type="button" onClick={clearFilters}>Clear Filters</button></div>
        </section>
        <p className="lick-empty-state" role="status">No licks match the selected filters.</p>
      </>
    );
  }

  return (
    <>
      <section className="lick-library-controls" aria-label="Lick library controls">
        {filterFields.map(([name, label]) => (
          <label key={name}>{label}<select value={filters[name]} onChange={(event) => updateFilter(name, event.target.value)}>{filterOptions[name].map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
        ))}
        <div className="lick-filter-summary"><p>Showing {displayedLicks.length} of {importedItems.length} licks</p><button type="button" onClick={clearFilters}>Clear Filters</button></div>
      </section>
      <article className="lick-practice-card" aria-live="polite">
        <div className="lick-practice-topline"><p className="guitar-kicker">Imported lick</p><p>{activeIndex + 1} / {displayedLicks.length}</p></div>
        <header className="lick-practice-header"><div><h2>{lick.title}</h2><p className="lick-subtitle">{lick.style} · Key {lick.key} · {lick.difficulty} · {lick.tempo} bpm</p></div><div className="lick-chord">Works over <strong>{lick.chord}</strong></div></header>
        <dl className="lick-meta-list"><div><dt>Key</dt><dd>{lick.key}</dd></div><div><dt>Style</dt><dd>{lick.style}</dd></div><div><dt>Difficulty</dt><dd>{lick.difficulty}</dd></div><div><dt>Tempo</dt><dd>{lick.tempo} bpm</dd></div></dl>
        <pre className="lick-tab" aria-label={`${lick.title} guitar tablature`}>{lick.tab}</pre>
        <div className="lick-action-row"><button type="button" onClick={() => move(-1)}>Previous Lick</button><button type="button" onClick={() => move(1)}>Next Lick</button></div>
        {lick.audioUrl ? (
          <div className="lick-action-row" aria-label="Lick audio controls">
            <audio ref={audioRef} src={lick.audioUrl} onEnded={() => setIsPlaying(false)} preload="none" />
            <button type="button" onClick={playPlayback}>{isPlaying ? 'Restart' : 'Play'}</button><button type="button" onClick={stopPlayback}>Stop</button><button type="button" className={isLooping ? 'active' : ''} onClick={() => setIsLooping((value) => !value)}>Loop {isLooping ? 'On' : 'Off'}</button>{Object.keys(speedMultipliers).map((option) => <button type="button" key={option} className={speed === option ? 'active' : ''} onClick={() => setSpeed(option)}>{option}</button>)}
          </div>
        ) : <p className="lick-audio-note">No audio file imported for this lick.</p>}
        <p className="lick-attribution"><strong>Source:</strong> {lick.source} · <strong>License:</strong> {lick.license} · <strong>Attribution:</strong> {lick.attribution}</p>
        <div className="lick-detail-grid"><section><h3>Why it works</h3><p>{lick.whyItWorks || 'No analysis imported yet.'}</p></section><section className="lick-steps"><h3>Practice steps</h3>{lick.practiceSteps.length ? <ol>{lick.practiceSteps.map((step) => <li key={step}>{step}</li>)}</ol> : <p>No practice steps imported yet.</p>}</section></div>
      </article>
    </>
  );
}
