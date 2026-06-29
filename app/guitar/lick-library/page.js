'use client';

import { useMemo, useState } from 'react';
import { GuitarNav } from '../GuitarNav';
import { difficulties, keys, lickLibrary, styles } from '../SoloGenerator';

const allOption = 'All';
const unique = (items) => [allOption, ...Array.from(new Set(items.filter(Boolean)))];

export default function LickLibraryPage() {
  const [filters, setFilters] = useState({ style: allOption, difficulty: allOption, key: allOption, technique: allOption, cagedPosition: allOption, chord: allOption, mood: allOption });
  const [transposeKey, setTransposeKey] = useState('A');
  const [loopingId, setLoopingId] = useState('');
  const [openWhyId, setOpenWhyId] = useState(lickLibrary[0]?.id ?? '');

  const filterOptions = useMemo(() => ({
    style: [allOption, ...styles],
    difficulty: [allOption, ...difficulties],
    key: [allOption, ...keys],
    technique: unique(lickLibrary.flatMap((lick) => lick.techniques)),
    cagedPosition: unique(lickLibrary.map((lick) => lick.cagedPosition)),
    chord: unique(lickLibrary.map((lick) => lick.chord)),
    mood: unique(lickLibrary.map((lick) => lick.mood)),
  }), []);

  const filteredLicks = lickLibrary.filter((lick) => {
    const matches = (name, value) => filters[name] === allOption || value === filters[name];
    return matches('style', lick.style)
      && matches('difficulty', lick.difficulty)
      && matches('cagedPosition', lick.cagedPosition)
      && matches('chord', lick.chord)
      && matches('mood', lick.mood)
      && (filters.technique === allOption || lick.techniques.includes(filters.technique));
  });

  return (
    <div className="guitar-app-shell">
      <section className="guitar-lesson-section">
        <div className="container guitar-stage">
          <GuitarNav currentHref="/guitar/lick-library" />
          <div className="guitar-lesson-intro">
            <p className="guitar-kicker">LICK LIBRARY</p>
            <h1>Lick Library</h1>
            <p className="guitar-tagline">Learn the language of guitar improvisation one musical phrase at a time.</p>
          </div>

          <section className="solo-generator-controls" aria-label="Lick library filters">
            {Object.entries(filterOptions).map(([name, options]) => (
              <fieldset key={name}>
                <legend>{name === 'cagedPosition' ? 'CAGED position' : name[0].toUpperCase() + name.slice(1)}</legend>
                {options.map((option) => (
                  <button className={filters[name] === option ? 'active' : ''} key={option} type="button" onClick={() => setFilters((current) => ({ ...current, [name]: option }))}>{option}</button>
                ))}
              </fieldset>
            ))}
          </section>

          <section className="solo-output-card" aria-label="Build a Solo placeholder">
            <div className="solo-output-header">
              <div>
                <p className="guitar-kicker">Future feature placeholder</p>
                <h2>Build a Solo</h2>
              </div>
              <div className="solo-meta"><span>Opening lick</span><span>Middle lick</span><span>Ending lick</span><span>8-bar stitcher</span></div>
            </div>
            <p>Coming next: choose an opening lick, middle lick, and ending lick, then stitch them into a coherent 8-bar practice solo.</p>
          </section>

          <div className="solo-learning-grid">
            {filteredLicks.map((lick) => (
              <article className="practice-box" key={lick.id}>
                <h2>{lick.name}</h2>
                <div className="solo-meta"><span>{lick.style}</span><span>{lick.difficulty}</span><span>{lick.cagedPosition}</span><span>{lick.mood}</span></div>
                <pre className="solo-tab">{lick.tab}</pre>
                <div className="solo-buttons" aria-label={`${lick.name} controls`}>
                  <button type="button">Play</button>
                  <button type="button">Slow</button>
                  <button className={loopingId === lick.id ? 'active' : ''} type="button" onClick={() => setLoopingId((current) => (current === lick.id ? '' : lick.id))}>Loop</button>
                  <button type="button" onClick={() => setTransposeKey(keys[(keys.indexOf(transposeKey) + 1) % keys.length])}>Transpose: {transposeKey}</button>
                  <button className={openWhyId === lick.id ? 'active' : ''} type="button" onClick={() => setOpenWhyId((current) => (current === lick.id ? '' : lick.id))}>Show why it works</button>
                </div>
                {openWhyId === lick.id ? (
                  <div>
                    <p><strong>Why it works:</strong> {lick.whyItWorks}</p>
                    <p><strong>Target notes:</strong> {lick.targetNotes.join(', ')}</p>
                    <p><strong>Pentatonic:</strong> {lick.pentatonic}</p>
                    <p><strong>CAGED position:</strong> {lick.cagedPosition}</p>
                    <p><strong>Resolves to:</strong> {lick.resolvesTo}</p>
                    <p><strong>Interval pattern:</strong> {lick.keyNeutralIntervalPattern.join(' → ')}</p>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
