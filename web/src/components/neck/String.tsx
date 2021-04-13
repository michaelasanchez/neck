import { filter, times } from 'lodash';
import * as React from 'react';

import { Note, Scale } from '../../models';
import { Fret, FretDisplayMode } from './Fret';

export interface StringProps {
  fretmode: FretDisplayMode;
  frets: number;
  offset: Note;
  scale: Scale;
}

// Note Value = root offset + string offset, then repeat for global notes
const calcNote = (f: number, offset: Note, scale: Scale) => {
  if (!offset) return null;
  let offsetNoteValue = (f + offset.Pitch) % Note.NUM_NOTES;

  // Check if Note exists for current fret number
  let note = filter(scale.Notes, (note: Note) => note.Pitch == offsetNoteValue);
  return note.length ? note[0] : null;
};

export const StringComponent: React.FunctionComponent<StringProps> = (
  props
) => {
  const { fretmode, frets, offset, scale } = props;

  return (
    <div className="string">
      <Fret fretMode={fretmode} note={calcNote(0, offset, scale)} open={true} />
      {times(frets, (f) => {
        const note = calcNote(f + 1, offset, scale);

        return (
          <Fret
            key={f}
            fretMode={fretmode}
            note={note}
            root={note?.Pitch == scale.Tonic.Pitch}
          />
        );
      })}
    </div>
  );
};
