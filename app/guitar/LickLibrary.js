'use client';

import { useMemo, useState } from 'react';

const allOption = 'All';

const licks = [
  {
    title: 'Porch Light Turnaround', key: 'A', style: 'Blues', difficulty: 'Beginner', tempo: '78 bpm', chord: 'A7', mood: 'Gritty', targetNotes: ['C# (3rd)', 'E (5th)', 'G (b7)'],
    tab: `e|------------------------|\nB|------5-8b9r8-5---------|\nG|--5/6-----------6-5-----|\nD|--------------------7---|\nA|------------------------|\nE|------------------------|`,
    why: 'The slide lands on the major 3rd, then the small bend touches the bluesy flat 7 color before resolving to the A7 root area.',
    steps: ['Say the chord out loud: A7.', 'Slide into fret 6 on the G string cleanly.', 'Make the 8th-fret bend small and vocal, not wide.', 'Loop the last three notes until the 7th fret on D feels like home.'],
  },
  {
    title: 'Midnight Shuffle Answer', key: 'E', style: 'Blues', difficulty: 'Beginner', tempo: '86 bpm', chord: 'E7', mood: 'Laid-back', targetNotes: ['G# (3rd)', 'D (b7)', 'E (root)'],
    tab: `e|----------------0-------|\nB|----------3-0-----------|\nG|------1/2-----2-0h1-----|\nD|--2-2----------------2--|\nA|------------------------|\nE|------------------------|`,
    why: 'It mixes open-string snap with the E7 third, giving a classic call-and-response phrase that sounds finished on low E.',
    steps: ['Keep the two D-string notes short like a shuffle pickup.', 'Let the open high E ring briefly.', 'Hammer 0h1 on G slowly so the G# speaks clearly.', 'Play it over one bar of E7 and leave space after it.'],
  },
  {
    title: 'Blue Door Rake', key: 'G', style: 'Blues', difficulty: 'Intermediate', tempo: '72 bpm', chord: 'G7', mood: 'Greasy', targetNotes: ['B (3rd)', 'F (b7)', 'G (root)'],
    tab: `e|------------------------|\nB|--6r5-3-----------------|\nG|--------5-3h4-----------|\nD|--------------5-3-------|\nA|------------------5-----|\nE|------------------------|`,
    why: 'The lick starts with a greasy release, then turns the minor third into the major third before dropping into the root.',
    steps: ['Pre-bend or slightly push the 6th fret before releasing.', 'Do not rush the 3h4 move; that is the blues-to-dominant sound.', 'Mute unused strings with both hands.', 'End firmly on the 5th fret of the A string.'],
  },
  {
    title: 'Garage Door Climb', key: 'E', style: 'Rock', difficulty: 'Beginner', tempo: '104 bpm', chord: 'E5', mood: 'Punchy', targetNotes: ['E (root)', 'G (b3)', 'B (5th)'],
    tab: `e|------------------------|\nB|------------------------|\nG|----------0-2-0---------|\nD|------0h2-------2-0-----|\nA|--0h2---------------2---|\nE|------------------------|`,
    why: 'Minor-pentatonic hammer-ons create momentum while the fifth and root keep it strong over a power chord.',
    steps: ['Use downstrokes on the first note of each string.', 'Keep hammer-ons even in volume.', 'Accent the 2nd fret on D as the high point.', 'Practice at half tempo before adding gain.'],
  },
  {
    title: 'Amp Glow Hook', key: 'D', style: 'Rock', difficulty: 'Intermediate', tempo: '118 bpm', chord: 'D5', mood: 'Anthemic', targetNotes: ['D (root)', 'F (b3)', 'A (5th)'],
    tab: `e|------------------------|\nB|--10-8------------------|\nG|-------9-7---7----------|\nD|-----------9---9-7------|\nA|-------------------10---|\nE|------------------------|`,
    why: 'A descending D minor pentatonic shape sounds like a hook because it repeats the 7th-fret G-string anchor before resolving low.',
    steps: ['Pick the first two notes with authority.', 'Let the 7th fret on G feel like a checkpoint.', 'Keep the descent tight and evenly spaced.', 'Try it after a D5 chord stab.'],
  },
  {
    title: 'Redline Bend', key: 'A', style: 'Rock', difficulty: 'Advanced', tempo: '128 bpm', chord: 'A5', mood: 'Aggressive', targetNotes: ['C (b3)', 'D (4th)', 'E (5th)'],
    tab: `e|------------------------|\nB|--8b10-8-5--------------|\nG|-----------7p5---5------|\nD|---------------7---7-5--|\nA|------------------------|\nE|------------------------|`,
    why: 'The big bend supplies the peak, and the pull-off run drops back into A minor pentatonic with a tough rock resolution.',
    steps: ['Check the bend pitch against fret 10 before looping.', 'Relax the hand after the bend release.', 'Pull off toward the floor for a clean 7p5.', 'Play it with a metronome on beats 2 and 4.'],
  },
  {
    title: 'Sunday Morning Thirds', key: 'C', style: 'Soulful Major', difficulty: 'Beginner', tempo: '76 bpm', chord: 'Cmaj7', mood: 'Warm', targetNotes: ['E (3rd)', 'G (5th)', 'B (7th)'],
    tab: `e|----------7-8-----------|\nB|------8-------8---------|\nG|--7/9---9-------9-7-----|\nD|--------------------10--|\nA|------------------------|\nE|------------------------|`,
    why: 'Major-scale notes outline the sweet 3rd and 7th of Cmaj7 without sounding like an exercise.',
    steps: ['Use a light touch and let notes breathe.', 'Slide into the 9th fret smoothly.', 'Make the high 8th fret sing rather than spike.', 'End on C at the 10th fret of D.'],
  },
  {
    title: 'Window Seat Melody', key: 'G', style: 'Soulful Major', difficulty: 'Intermediate', tempo: '82 bpm', chord: 'G6', mood: 'Reflective', targetNotes: ['B (3rd)', 'E (6th)', 'G (root)'],
    tab: `e|------------------------|\nB|--8-10-8----------------|\nG|---------9-7h9-7--------|\nD|-----------------9-7-5--|\nA|------------------------|\nE|------------------------|`,
    why: 'The 6th gives the phrase a warm R&B lift while the final descent settles back into the G chord family.',
    steps: ['Play legato first, then add picked accents.', 'Hear the 10th fret on B as the emotional peak.', 'Keep the 7h9 hammer-on relaxed.', 'Resolve gently, not aggressively.'],
  },
  {
    title: 'Gold Thread Resolve', key: 'F', style: 'Soulful Major', difficulty: 'Advanced', tempo: '70 bpm', chord: 'Fmaj9', mood: 'Shimmering', targetNotes: ['A (3rd)', 'G (9th)', 'C (5th)'],
    tab: `e|--8-10-12-10-8----------|\nB|--------------10-8------|\nG|-------------------10-9-|\nD|------------------------|\nA|------------------------|\nE|------------------------|`,
    why: 'The melody touches the 9th for shimmer, then resolves through chord tones instead of ending on a plain scale fragment.',
    steps: ['Use a warm clean tone or neck pickup.', 'Connect the top-string notes smoothly.', 'Let the 10th fret on B ring into the descent.', 'Practice with a slow Fmaj9 backing drone.'],
  },
  {
    title: 'Fence Post Pickup', key: 'G', style: 'Country-ish', difficulty: 'Beginner', tempo: '96 bpm', chord: 'G', mood: 'Bright', targetNotes: ['B (3rd)', 'D (5th)', 'G (root)'],
    tab: `e|----------3-------------|\nB|------3h5---5p3---------|\nG|--2/4-----------4-2-0---|\nD|------------------------|\nA|------------------------|\nE|------------------------|`,
    why: 'The major pentatonic slide and open-string-friendly ending give it a bright country vocabulary without needing speed.',
    steps: ['Use hybrid picking if comfortable, pick otherwise.', 'Snap the 3h5 lightly.', 'Let the open G finish the sentence.', 'Try it after a simple G-C-G rhythm figure.'],
  },
  {
    title: 'Dusty Double-Stop', key: 'D', style: 'Country-ish', difficulty: 'Intermediate', tempo: '108 bpm', chord: 'D', mood: 'Bouncy', targetNotes: ['F# (3rd)', 'A (5th)', 'D (root)'],
    tab: `e|--5-5---3-2-------------|\nB|--7-7---5-3-------------|\nG|--------------4-2-------|\nD|------------------4-0---|\nA|------------------------|\nE|------------------------|`,
    why: 'Double-stops state the D chord clearly, then the single-note tag walks down to an open-root landing.',
    steps: ['Pinch the first two string pairs together.', 'Keep the double-stops short and bouncy.', 'Do not overbend the country flavor; this one is clean.', 'Land the open D in time.'],
  },
  {
    title: 'Pickup Truck Chime', key: 'A', style: 'Country-ish', difficulty: 'Advanced', tempo: '116 bpm', chord: 'A', mood: 'Snappy', targetNotes: ['C# (3rd)', 'E (5th)', 'A (root)'],
    tab: `e|--9-5-------------------|\nB|------7-5---------------|\nG|----------6-4h6-4-------|\nD|------------------7-4---|\nA|----------------------7-|\nE|------------------------|`,
    why: 'The wide top-string skip sounds like a country chime, then the line spells A major pentatonic back to a sturdy root.',
    steps: ['Practice the first string skip alone.', 'Use pick-and-fingers for extra snap if possible.', 'Keep the 4h6 hammer-on bright and in time.', 'Loop slowly until every string change is clean.'],
  },
];

const getOptions = (field) => [allOption, ...Array.from(new Set(licks.map((lick) => lick[field])))];

export function LickLibrary() {
  const [filters, setFilters] = useState({ style: allOption, difficulty: allOption, key: allOption, mood: allOption });
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredLicks = useMemo(() => licks.filter((lick) => (
    (filters.style === allOption || lick.style === filters.style)
    && (filters.difficulty === allOption || lick.difficulty === filters.difficulty)
    && (filters.key === allOption || lick.key === filters.key)
    && (filters.mood === allOption || lick.mood === filters.mood)
  )), [filters]);

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
          <label key={name}>{label}<select value={filters[name]} onChange={(event) => updateFilter(name, event.target.value)}>{getOptions(name).map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
        ))}
      </section>

      {lick ? <article className="lick-practice-card" aria-live="polite">
        <div className="lick-practice-topline"><p className="guitar-kicker">Original practice lick</p><p>{activeIndex + 1} / {filteredLicks.length}</p></div>
        <header className="lick-practice-header"><div><h2>{lick.title}</h2><p className="lick-subtitle">{lick.style} · Key {lick.key} · {lick.difficulty} · {lick.tempo} · {lick.mood}</p></div><div className="lick-chord">Works over <strong>{lick.chord}</strong></div></header>
        <pre className="lick-tab" aria-label={`${lick.title} guitar tablature`}>{lick.tab}</pre>
        <div className="lick-action-row"><button type="button" onClick={() => move(-1)}>Previous Lick</button><button type="button" onClick={() => move(1)}>Next Lick</button><button type="button" onClick={randomize}>Random Lick</button></div>
        <p className="lick-audio-note">Audio coming soon — practice from the tab for now.</p>
        <div className="lick-detail-grid"><section><h3>Target notes</h3><ul>{lick.targetNotes.map((note) => <li key={note}>{note}</li>)}</ul></section><section><h3>Mood</h3><p>{lick.mood}</p><h3>Why it works</h3><p>{lick.why}</p></section><section className="lick-steps"><h3>Practice steps</h3><ol>{lick.steps.map((step) => <li key={step}>{step}</li>)}</ol></section></div>
      </article> : <p className="lick-audio-note">No licks match those filters yet.</p>}
    <section className="lick-build-solo-placeholder" aria-label="Build a Solo coming soon"><p className="guitar-kicker">BUILD A SOLO</p><h2>Build a Solo workspace coming soon</h2><p>For now, learn one lick deeply, then move it into your own solo vocabulary.</p></section>
    </>
  );
}
