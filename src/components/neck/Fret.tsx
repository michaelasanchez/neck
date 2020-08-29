import * as React from 'react';
import { Note } from '../../models/Note';
import { useState, useEffect } from 'react';

export enum FretDisplayMode {
  Note,
  Degree,
  Marker,
}

export interface FretProps {
  fretMode: FretDisplayMode;
  open?: boolean;
  note?: Note;
}

const fretLabel = (note: Note, fretMode: FretDisplayMode) => {
  if (note) {
    switch (fretMode) {
      case FretDisplayMode.Note:
        return <label>{note.Label}</label>;
      case FretDisplayMode.Degree:
        return <label>{note.Degree}</label>;
      case FretDisplayMode.Marker:
        return <div className="fret-symbol"></div>;
    }
  }
};

export const Fret: React.FunctionComponent<FretProps> = ({
  fretMode,
  open,
  note,
}) => {
  const [prevNote, setPrevNote] = useState<Note>();
  const [currentNote, setCurrentNote] = useState<Note>(note);

  const [animate, setAnimate] = useState<boolean>(false);

  useEffect(() => {
    if (note?.Label != currentNote?.Label) {
      setPrevNote(currentNote);
      setCurrentNote(note);

      setAnimate(true);
      setTimeout(() => setAnimate(false), 1000);
    }
  }, [note]);

  const renderLabel = (className: string, note: Note) => (
    <div className={`label ${className}`}>{fretLabel(note, fretMode)}</div>
  );

  return (
    <>
      <div className={`fret${open ? ' open' : ''}${animate ? ' animate' : ''}`}>
        {renderLabel('prev', prevNote)}
        {renderLabel('current', currentNote)}
      </div>
    </>
  );
};
