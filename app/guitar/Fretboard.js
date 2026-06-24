'use client';

import { useMemo, useState } from 'react';

const chromaticNotes = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
const standardTuning = [
  { label: 'E', octaveName: 'High E', startNote: 'E' },
  { label: 'B', octaveName: 'B', startNote: 'B' },
  { label: 'G', octaveName: 'G', startNote: 'G' },
  { label: 'D', octaveName: 'D', startNote: 'D' },
  { label: 'A', octaveName: 'A', startNote: 'A' },
  { label: 'E', octaveName: 'Low E', startNote: 'E' },
];
const frets = Array.from({ length: 13 }, (_, fret) => fret);

export function getNoteAtFret(startNote, fret) {
  const startIndex = chromaticNotes.indexOf(startNote);
  return chromaticNotes[(startIndex + fret) % chromaticNotes.length];
}

export function getFretboardStrings() {
  return standardTuning.map((string) => ({
    ...string,
    notes: frets.map((fret) => ({ fret, note: getNoteAtFret(string.startNote, fret) })),
  }));
}

export function Fretboard({
  mode = 'learn',
  title = 'Tap the neck. Learn the notes.',
  instructions = 'Tap any note on the neck to learn its name.',
  selectedNoteLabel = 'Selected note',
  selectedNoteValue,
  selectedNoteDetail,
  foundPositionKeys,
  incorrectPositionKey,
  onNoteSelect,
} = {}) {
  const [displayMode, setDisplayMode] = useState('selected');
  const [selectedNote, setSelectedNote] = useState(null);

  const strings = useMemo(
    () =>
      getFretboardStrings(),
    [],
  );

  const shouldShowNote = (octaveName, fret) => {
    if (mode === 'game') return false;
    if (displayMode === 'all') return true;
    if (displayMode === 'hidden') return false;
    return selectedNote?.octaveName === octaveName && selectedNote?.fret === fret;
  };

  return (
    <div className={`fretboard-card${mode === 'game' ? ' game-fretboard' : ''}`} aria-label="Interactive standard tuning guitar fretboard">
      <div className="fretboard-header">
        <div>
          <p className="guitar-kicker">Interactive Fretboard</p>
          <h2>{title}</h2>
        </div>
        <div className="fretboard-selected-note" aria-live="polite">
          <span>{selectedNoteLabel}</span>
          <strong>{selectedNoteValue ?? (selectedNote ? selectedNote.note : '—')}</strong>
          <small>{selectedNoteDetail ?? (selectedNote ? `${selectedNote.octaveName} string · fret ${selectedNote.fret}` : 'Tap any position')}</small>
        </div>
      </div>

      <div className="fretboard-instructions">{instructions}</div>

      {mode === 'learn' ? <fieldset className="fretboard-controls">
        <legend>Note display</legend>
        <label>
          <input
            type="radio"
            name="noteDisplay"
            value="all"
            checked={displayMode === 'all'}
            onChange={() => setDisplayMode('all')}
          />
          Show all note names
        </label>
        <label>
          <input
            type="radio"
            name="noteDisplay"
            value="hidden"
            checked={displayMode === 'hidden'}
            onChange={() => setDisplayMode('hidden')}
          />
          Hide note names
        </label>
        <label>
          <input
            type="radio"
            name="noteDisplay"
            value="selected"
            checked={displayMode === 'selected'}
            onChange={() => setDisplayMode('selected')}
          />
          Show only selected note
        </label>
      </fieldset> : null}

      <div className="fretboard-scroll" role="region" aria-label="Scrollable fretboard with frets zero through twelve">
        <div className="fretboard-grid">
          <div className="fretboard-corner" aria-hidden="true">String</div>
          {frets.map((fret) => (
            <div className="fret-number" key={fret}>Fret {fret}</div>
          ))}

          {strings.map((string) => [
            <div className="string-label" key={`${string.octaveName}-label`}>
              <span>{string.label}</span>
            </div>,
            ...string.notes.map(({ fret, note }) => {
              const positionKey = `${string.octaveName}-${fret}`;
              const isSelected = selectedNote?.octaveName === string.octaveName && selectedNote?.fret === fret;
              const isFound = foundPositionKeys?.has(positionKey);
              const isIncorrect = incorrectPositionKey === positionKey;
              const showName = shouldShowNote(string.octaveName, fret) || isSelected || isFound || isIncorrect;

              return (
                <button
                  className={`fret-position${isSelected ? ' selected' : ''}${isFound ? ' correct' : ''}${isIncorrect ? ' incorrect' : ''}`}
                  key={`${string.octaveName}-${fret}`}
                  type="button"
                  onClick={() => {
                    const position = { ...string, stringLabel: string.label, fret, note };
                    setSelectedNote(position);
                    onNoteSelect?.(position);
                  }}
                  aria-label={`${note} note on the ${string.octaveName} string, fret ${fret}`}
                >
                  <span className="string-line" aria-hidden="true" />
                  <span className="note-marker">{showName ? note : ''}</span>
                </button>
              );
            }),
          ])}
        </div>
      </div>
    </div>
  );
}
