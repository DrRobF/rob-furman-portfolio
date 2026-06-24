'use client';

import { useMemo, useRef, useState } from 'react';
import { Fretboard, getFretboardStrings } from './Fretboard';

const targetNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

function getPositionKey(position) {
  return `${position.octaveName}-${position.fret}`;
}

export function NoteFinderGame() {
  const [targetNote, setTargetNote] = useState('G');
  const [foundNotes, setFoundNotes] = useState([]);
  const [incorrectNote, setIncorrectNote] = useState(null);
  const incorrectTimeout = useRef(null);

  const targetPositions = useMemo(
    () =>
      getFretboardStrings().flatMap((string) =>
        string.notes
          .filter(({ note }) => note === targetNote)
          .map(({ fret, note }) => ({ ...string, fret, note, key: `${string.octaveName}-${fret}` })),
      ),
    [targetNote],
  );

  const foundSet = useMemo(() => new Set(foundNotes), [foundNotes]);
  const foundCount = foundNotes.length;
  const totalCount = targetPositions.length;
  const isComplete = foundCount === totalCount;

  const resetGame = (nextTarget = targetNote) => {
    setTargetNote(nextTarget);
    setFoundNotes([]);
    setIncorrectNote(null);
    if (incorrectTimeout.current) {
      clearTimeout(incorrectTimeout.current);
    }
  };

  const handleNoteSelect = (position) => {
    const key = getPositionKey(position);

    if (position.note === targetNote) {
      setFoundNotes((current) => (current.includes(key) ? current : [...current, key]));
      setIncorrectNote(null);
      return;
    }

    setIncorrectNote(key);
    if (incorrectTimeout.current) {
      clearTimeout(incorrectTimeout.current);
    }
    incorrectTimeout.current = setTimeout(() => setIncorrectNote(null), 650);
  };

  return (
    <section className="note-finder-game" aria-labelledby="note-finder-title">
      <div className="note-finder-panel">
        <div>
          <p className="guitar-kicker">Note Finder Game</p>
          <h2 id="note-finder-title">Find all the {targetNote} notes</h2>
          <p>Tap every {targetNote} on the fretboard. Correct notes stay lit. Misses flash briefly.</p>
        </div>
        <div className="note-finder-score" aria-live="polite">
          <span>Found</span>
          <strong>{foundCount} / {totalCount}</strong>
          <small>{targetNote} notes</small>
        </div>
      </div>

      <div className="note-finder-actions" aria-label="Note Finder controls">
        <fieldset className="note-target-controls">
          <legend>Target note</legend>
          {targetNotes.map((note) => (
            <button
              className={note === targetNote ? 'active' : ''}
              key={note}
              type="button"
              onClick={() => resetGame(note)}
              aria-pressed={note === targetNote}
            >
              {note}
            </button>
          ))}
        </fieldset>
        <button className="note-finder-reset" type="button" onClick={() => resetGame()}>
          Reset
        </button>
      </div>

      {isComplete ? <div className="note-finder-success">Nice. You found every {targetNote} on the neck.</div> : null}

      <Fretboard
        mode="game"
        title={`Find all the ${targetNote} notes`}
        instructions={`Tap every ${targetNote} note on the neck.`}
        selectedNoteLabel="Target note"
        selectedNoteValue={targetNote}
        selectedNoteDetail={`Found ${foundCount} of ${totalCount}`}
        foundPositionKeys={foundSet}
        incorrectPositionKey={incorrectNote}
        onNoteSelect={handleNoteSelect}
      />
    </section>
  );
}
