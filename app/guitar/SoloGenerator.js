'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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

const progressions = {
  Blues: ['A7', 'D7', 'A7', 'A7', 'D7', 'D7', 'A7', 'E7'],
  Rock: ['E5', 'G', 'A', 'E5', 'E5', 'G', 'A', 'B'],
  'Soulful Major': ['G', 'C', 'G', 'D', 'Em', 'C', 'G', 'D'],
  'Country-ish': ['D', 'G', 'D', 'A', 'D', 'G', 'A', 'D'],
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

const cleanTab = ({ e = '--------------------', B = '--------------------', G = '--------------------', D = '--------------------', A = '--------------------', E = '--------------------' }) => `e|${e}|\nB|${B}|\nG|${G}|\nD|${D}|\nA|${A}|\nE|${E}|`;

const makeBars = (style, bars) => bars.map((tab, index) => ({
  number: index + 1,
  chord: progressions[style][index],
  tab: cleanTab(tab),
}));

function makeSolo({ title, key, style, difficulty = 'Beginner', tempo, notes, steps, bars }) {
  return {
    title,
    key,
    style,
    difficulty,
    tempo,
    chordProgression: progressions[style],
    bars: makeBars(style, bars),
    musicalityNotes: notes,
    practiceSteps: steps,
  };
}

const curatedSolos = [
  makeSolo({ title: 'Front Porch A Blues', key: 'A', style: 'Blues', tempo: 72, notes: ['Bars 1–2 state a compact A blues-box motif and answer it.', 'Bars 3–4 repeat the bend-and-resolution idea with more space.', 'Bars 7–8 land on A/C# chord tones before the E7 turnaround.'], steps: ['Clap the rests before adding notes.', 'Practice the 7b9 bend slowly and keep it vocal.', 'Loop bars 7–8 until the ending feels settled.'], bars: [{ B: '------------5h8-5---', G: '--------5h6-------6--' }, { e: '-----------5--------', B: '-------5h8---8-5----', G: '-----6-----------6--' }, { B: '-----5--------------', G: '-7b9---7-5----------', D: '-----------7--------' }, { B: '-----5---5----------', G: '---5h6---6-5--------', D: '-7-----------7------' }, { e: '---------5----------', B: '-----5h8---8-5------', G: '---6-----------6----' }, { B: '-8-5----------------', G: '-----7-5------------', D: '---------7-5h7------' }, { B: '-----5--------------', G: '-5h6---6-5----------', D: '-----------7--------' }, { e: '-----5--------------', B: '-8-5---8-5----------', G: '-----------6--------' }] }),
  makeSolo({ title: 'Slow Bend A Blues', key: 'A', style: 'Blues', difficulty: 'Easy-Plus', tempo: 68, notes: ['The same bend sound returns so the solo has a hook.', 'Open spaces after each answer keep it from sounding like an exercise.', 'The final bar resolves to the A major third for a clear blues ending.'], steps: ['Sing each bend before playing it.', 'Mute unused strings during the rests.', 'Play the last note longer than written.'], bars: [{ B: '-----5--------------', G: '-7b9---7-5----------', D: '-----------7--------' }, { e: '---------5----------', B: '-----5h8---8-5------', G: '---6-----------6----' }, { B: '-5-----5------------', G: '---7-5---6----------', D: '-----------7--------' }, { G: '---5-6--------------', D: '-7-----7------------' }, { B: '-------5-8-5--------', G: '---5h6-------6------' }, { e: '-5------------------', B: '---8-5--------------', G: '-------7-5----------', D: '-----------7--------' }, { G: '-5-7b8-5------------', D: '---------7----------' }, { B: '-5------------------', G: '---6-5--------------', D: '-------7------------' }] }),
  makeSolo({ title: 'Answer Back Blues', key: 'A', style: 'Blues', tempo: 76, notes: ['Bars 1–4 ask a small question and bars 5–8 answer it.', 'Hammer-ons are used as vocal pickups, not as fast filler.', 'The ending outlines A7 against the E7 bar for a loopable turnaround.'], steps: ['Learn bars 1–2 as one sentence.', 'Copy that timing in bars 5–6.', 'Make the last two bars quieter and more relaxed.'], bars: [{ G: '---5-6--------------', D: '-7-----7------------' }, { B: '-----5--------------', G: '---5h6---6----------', D: '-7----------7-------' }, { B: '-5-----5------------', G: '---7-5---6----------', D: '-----------7--------' }, { e: '-----5--------------', B: '-8-5---8-5----------', G: '-----------6--------' }, { B: '-------5-8-5--------', G: '---5h6-------6------' }, { e: '-5------------------', B: '---8-5--------------', G: '-------7-5----------', D: '-----------7--------' }, { B: '-----5---5----------', G: '-7b9---7---5--------', D: '-------------7------' }, { G: '-5h6----------------', D: '-----7--------------' }] }),
  makeSolo({ title: 'Garage E Rock', key: 'E', style: 'Rock', tempo: 92, notes: ['A repeated E minor-pentatonic riff anchors the solo.', 'The high-string answer in bar 4 gives the phrase a chorus-like lift.', 'The final E note makes the line resolve instead of drift.'], steps: ['Palm-mute the lower string notes lightly.', 'Keep the bar-4 answer short and punchy.', 'Loop with a steady down-up picking pattern.'], bars: [{ G: '-----2-4-2----------', D: '-2-4-------4-2------' }, { B: '-----3--------------', G: '-2h4---4-2----------', D: '-----------4--------' }, { G: '-2-2-4-2------------', D: '---------4-2--------' }, { e: '-----3-0------------', B: '-3-0-----3-0--------', G: '-------------2------' }, { D: '-2-4-5-4-2----------', A: '-----------2--------' }, { G: '-4b5-4-2------------', D: '---------4----------' }, { B: '-3-5-3--------------', G: '-------4-2----------' }, { G: '-4-2----------------', D: '-----2--------------' }] }),
  makeSolo({ title: 'Power Chord Answer', key: 'E', style: 'Rock', difficulty: 'Easy-Plus', tempo: 96, notes: ['Lower-string riffs are answered by upper-string hooks.', 'Slides and a small bend add attitude without adding clutter.', 'The last bar resolves directly to E.'], steps: ['Practice the first two bars with a metronome.', 'Let the slide in bar 4 connect smoothly.', 'Accent the first note of every two-bar phrase.'], bars: [{ D: '-2-4-5-4-2----------', A: '-----------2--------' }, { G: '-----2--------------', D: '-2-4---4-2----------' }, { B: '---3---3------------', G: '-4---4---2----------' }, { G: '-2/4-2--------------', D: '-------4-2----------' }, { G: '-2---2---4----------', D: '---4---4------------' }, { e: '-3-0----------------', B: '-----3-0------------', G: '---------2----------' }, { B: '---3-5b6-3----------', G: '-4---------4--------' }, { D: '-4-2----------------', A: '-----2--------------' }] }),
  makeSolo({ title: 'Open Road Rock', key: 'E', style: 'Rock', tempo: 88, notes: ['The rhythm repeats enough to feel like a real riff.', 'Bars 5–6 climb into a simple melodic peak.', 'The ending comes back to the low E center.'], steps: ['Count four beats in every bar before playing.', 'Keep bends small and controlled.', 'Record yourself and check that the motif is recognizable.'], bars: [{ G: '-2-4-2-4------------', D: '---------2----------' }, { B: '-----3--------------', G: '-4-2---4-2----------' }, { G: '-------2-4----------', D: '-2-4-5--------------' }, { G: '-4-2----------------', D: '-----4-2------------', A: '---------2----------' }, { B: '-3------------------', G: '---4-2--------------', D: '-------4-2----------' }, { e: '---------3----------', B: '-----3-5---5-3------' }, { G: '-2/4-2--------------', D: '-------4-2----------' }, { B: '-----3--------------', G: '-4-2----------------', D: '-----2--------------' }] }),
  makeSolo({ title: 'Sweet G Major', key: 'G', style: 'Soulful Major', tempo: 76, notes: ['Major-pentatonic notes create a warm, vocal sound.', 'The opening motif returns in smaller pieces later in the solo.', 'The final G/B sound resolves sweetly over the D bar.'], steps: ['Play every phrase legato and relaxed.', 'Hold the first note after each rest.', 'Name the G, B, and D chord tones as you play.'], bars: [{ B: '-----3-5-3----------', G: '-2h4-------4-2------' }, { e: '-------3------------', B: '-3-5-----5-3--------', G: '-----4-------4------' }, { B: '-3-----3------------', G: '---4-2---4-2--------', D: '-------------5------' }, { e: '-----3--------------', B: '-3-5---5-3----------', G: '-----------4--------' }, { B: '---3-5--------------', G: '-4-----4------------' }, { e: '-3------------------', B: '---5-3--------------', G: '-------4-2----------' }, { B: '-3h5-3--------------', G: '-------4-2----------' }, { B: '-5-3----------------', G: '-----4--------------' }] }),
  makeSolo({ title: 'Churchy G Answer', key: 'G', style: 'Soulful Major', difficulty: 'Easy-Plus', tempo: 72, notes: ['Call-and-response phrasing makes the melody sing.', 'Small hammer-ons add expression while staying beginner-friendly.', 'The last phrase relaxes into a G major color.'], steps: ['Use light vibrato on held notes.', 'Do not rush the pickups.', 'Practice bars 7–8 as the ending first.'], bars: [{ G: '-2-4-2--------------', D: '-------5------------' }, { B: '-----3--------------', G: '-2h4---4-2----------' }, { e: '-3-5-3--------------', B: '-------5-3----------' }, { B: '-3---3---5----------', G: '---4---4------------' }, { e: '-----3--------------', B: '-6-5---3------------', G: '---------4----------' }, { B: '---3----------------', G: '-4---2--------------' }, { B: '---3-5-3------------', G: '-4-------4-2--------' }, { e: '-3------------------', B: '---5-3--------------' }] }),
  makeSolo({ title: 'Porch Soul Major', key: 'G', style: 'Soulful Major', tempo: 70, notes: ['Fewer notes leave more room for tone.', 'The slide in bar 3 sounds like a singer leaning into a note.', 'The final bar lands on G for a complete ending.'], steps: ['Play it at speaking speed first.', 'Make the slide audible but gentle.', 'Add your own vibrato only on the final note.'], bars: [{ B: '---3-5--------------', G: '-4-----4------------' }, { e: '---------3----------', B: '-----3-5---5--------', G: '-2h4----------------' }, { B: '-3/5-3--------------', G: '-------4-2----------' }, { B: '---3-5-3------------', G: '-4-------4-2--------' }, { e: '-5-3----------------', B: '-----5-3------------', G: '---------4----------' }, { B: '-----3-5------------', G: '-2-4-----4----------' }, { B: '-3h5-3--------------', G: '-------4-2----------' }, { G: '-2h4----------------', D: '-----5--------------' }] }),
  makeSolo({ title: 'Bright D Country', key: 'D', style: 'Country-ish', tempo: 84, notes: ['Open-position D major shapes give the solo twang.', 'Hammer-ons and quick answers create a country feel without speed.', 'The final D/F# shape resolves cleanly.'], steps: ['Use a bright pick attack.', 'Keep the hammer-ons even.', 'Let the final D ring.'], bars: [{ e: '-2-3-2--------------', B: '-------3------------', G: '---------2----------' }, { e: '-----2-5-2----------', B: '-3-5-------5-3------' }, { e: '-2-----2------------', B: '---3-5---3----------', G: '-----------2--------' }, { e: '---2-3-5------------', B: '-3------------------' }, { B: '-3-5-3--------------', G: '-------4-2----------' }, { e: '-5-3-2--------------', B: '-------5-3----------' }, { e: '-----2--------------', B: '-3h5---5-3----------' }, { e: '-2------------------', B: '---3----------------' }] }),
  makeSolo({ title: 'Chicken Pickin Easy', key: 'D', style: 'Country-ish', difficulty: 'Easy-Plus', tempo: 88, notes: ['Short snappy answers create the chicken-pickin character.', 'The slide gives one flashy moment without making the solo hard.', 'The ending targets D chord tones.'], steps: ['Play staccato in bars 1–2.', 'Slide slowly at first, then tighten the timing.', 'Practice muting after each short phrase.'], bars: [{ B: '-3---3--------------', G: '---2---2------------' }, { e: '-2/5-2--------------', B: '-------3------------' }, { e: '---2----------------', B: '-5---3--------------', G: '-------2------------' }, { B: '-----3-5------------', G: '-2-4-----2----------' }, { e: '-2-2----------------', B: '-----3-5------------' }, { e: '-------2-5----------', B: '-3-5-3--------------' }, { e: '-5-2----------------', B: '-----5-3------------' }, { B: '-3h5-3--------------', G: '-------2------------' }] }),
  makeSolo({ title: 'Front Porch Country', key: 'D', style: 'Country-ish', tempo: 80, notes: ['Long spaces make the melody feel relaxed and playable.', 'The bend in bar 4 is the expressive peak.', 'Bars 7–8 close like a complete sentence.'], steps: ['Leave silence after each two-bar idea.', 'Bend bar 4 only slightly and return in tune.', 'Play the ending three times in a row without stopping.'], bars: [{ e: '---2-3-2------------', B: '-3-------3----------' }, { G: '-2-4-2--------------', D: '-------4------------' }, { e: '-2-3-5-3-2----------', B: '-----------3--------' }, { B: '-5b6-5-3------------', G: '---------2----------' }, { e: '-----2--------------', B: '-3-5---3------------', G: '---------2----------' }, { e: '-5-3-2--------------', B: '-------3------------' }, { B: '-3h5-3--------------', G: '-------2------------' }, { e: '-2------------------', B: '---3----------------' }] }),
];

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function selectCuratedSolo(style, difficulty, previousTitle = '') {
  const styleSolos = curatedSolos.filter((entry) => entry.style === style);
  const difficultyMatches = styleSolos.filter((entry) => entry.difficulty === difficulty);
  const pool = difficultyMatches.length ? difficultyMatches : styleSolos;
  const freshPool = pool.length > 1 ? pool.filter((entry) => entry.title !== previousTitle) : pool;
  return pick(freshPool.length ? freshPool : pool);
}

export function SoloGenerator() {
  const [style, setStyle] = useState('Blues');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [soloSeed, setSoloSeed] = useState(0);
  const [showWhy, setShowWhy] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [isPracticeFullscreen, setIsPracticeFullscreen] = useState(false);
  const [playbackTempo, setPlaybackTempo] = useState('Medium');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef(null);
  const stopTimerRef = useRef(null);
  const previousTitleRef = useRef('');

  const solo = useMemo(() => selectCuratedSolo(style, difficulty, previousTitleRef.current), [style, difficulty, soloSeed]);
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
    previousTitleRef.current = solo.title;
  }, [solo.title]);

  useEffect(() => () => stopPlayback(), [stopPlayback]);

  const regenerate = () => {
    stopPlayback();
    setSoloSeed((value) => value + 1);
  };

  return (
    <div className={`solo-generator${isPracticeFullscreen ? ' solo-generator-fullscreen' : ''}`}>
      <section className="solo-generator-controls" aria-label="Solo generator controls" hidden={isPracticeFullscreen}>
        <fieldset><legend>Style</legend>{styles.map((item) => <button className={style === item ? 'active' : ''} key={item} type="button" onClick={() => setStyle(item)}>{item}</button>)}</fieldset>
        <fieldset><legend>Difficulty</legend>{difficulties.map((item) => <button className={difficulty === item ? 'active' : ''} key={item} type="button" onClick={() => setDifficulty(item)}>{item}</button>)}</fieldset>
        <button className="solo-generate-button" type="button" onClick={regenerate}>Generate New Solo</button>
      </section>

      <section className="solo-output-card" aria-labelledby="generated-solo-title">
        <div className="solo-output-header">
          <div><p className="guitar-kicker">Curated 8-bar solo</p><h2 id="generated-solo-title">{solo.title}</h2></div>
          <div className="solo-meta"><span>{solo.key}</span><span>{solo.style}</span><span>{solo.difficulty}</span><span>{solo.tempo} bpm</span></div>
        </div>
        <div className="solo-playback-panel" aria-label="Solo playback controls">
          <button className="solo-play-button" type="button" onClick={playSolo}>{isPlaying ? 'Restart Solo' : 'Play Solo'}</button>
          <button className="solo-stop-button" type="button" onClick={stopPlayback} disabled={!isPlaying}>Stop</button>
          <fieldset className="solo-tempo-control"><legend>Playback speed</legend>{Object.keys(playbackTempos).map((tempo) => <button className={playbackTempo === tempo ? 'active' : ''} key={tempo} type="button" onClick={() => setPlaybackTempo(tempo)}>{tempo}</button>)}</fieldset>
        </div>
        <div className="solo-progression" aria-label="Chord progression">
          <strong>Chord progression:</strong>
          <div className="solo-progression-grid">
            {solo.chordProgression.map((chord, index) => <span key={`${chord}-${index}`}>{chord}</span>)}
          </div>
        </div>
        <div className="solo-tab-grid" aria-label="8-bar curated tablature">
          {solo.bars.map((bar) => (
            <article className="solo-bar" key={`bar-${bar.number}`}>
              <div className="solo-bar-heading">Bar {bar.number} - {bar.chord}</div>
              <pre className="solo-tab">{bar.tab}</pre>
            </article>
          ))}
        </div>
        <div className="solo-buttons" aria-label="Solo action buttons">
          <button type="button" onClick={regenerate}>Generate New Solo</button>
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
          {!isPracticeFullscreen && showWhy && <div className="practice-box"><h3>Musicality Notes</h3><ul>{solo.musicalityNotes.map((note) => <li key={note}>{note}</li>)}</ul></div>}
          {!isPracticeFullscreen && showSteps && <div className="practice-box"><h3>Practice Steps</h3><ol>{solo.practiceSteps.map((step) => <li key={step}>{step}</li>)}</ol></div>}
        </div>
      </section>
    </div>
  );
}
