import * as React from 'react';
import { useEffect, useState } from 'react';
import { Note } from '../../models';
import { ENABLE_NECK_ANIMATION } from './Neck';


export enum FretDisplayMode {
  Note,
  Degree,
  Marker,
}

export interface FretProps {
  fretMode: FretDisplayMode;
  note?: Note;
  open?: boolean;
  root?: boolean;
}

const fretLabel = (note: Note, fretMode: FretDisplayMode) => {
  if (note) {
    switch (fretMode) {
      case FretDisplayMode.Note:
        return <label>{note.Label}</label>;
      case FretDisplayMode.Degree:
        return <label>{note.Degree}</label>;
      case FretDisplayMode.Marker:
        return <div className="fret-marker"></div>;
    }
  }
};

export const Fret: React.FunctionComponent<FretProps> = ({
  fretMode,
  note,
  open,
  root,
}) => {
  const [prevNote, setPrevNote] = useState<Note>();
  const [currentNote, setCurrentNote] = useState<Note>(note);

  const [animate, setAnimate] = useState<boolean>(false);

  useEffect(() => {
    if (note?.Label != currentNote?.Label) {
      setPrevNote(currentNote);
      setCurrentNote(note);

      if (ENABLE_NECK_ANIMATION) {
        setAnimate(true);
        setTimeout(() => setAnimate(false), 300);
      }
    }
  }, [note]);

  return (
    <>
      <div className={`fret${open ? ' open' : ''}${animate ? ' animate' : ''}`}>
        <div className={`label prev`}>{fretLabel(prevNote, fretMode)}</div>
        <div className={`label current ${root ? 'root' : ''}`}>
          {fretLabel(currentNote, fretMode)}
        </div>
      </div>
    </>
  );
};
