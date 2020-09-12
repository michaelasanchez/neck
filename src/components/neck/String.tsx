import { filter, times } from 'lodash';
import * as React from 'react';
import { Note } from '../../models/Note';
import { Scale } from '../../models/Scale';
import { Fret, FretDisplayMode } from './Fret';

export interface StringProps {
  fretmode: FretDisplayMode;
  frets: number;
  offset: number;
  scale: Scale;
}

// Note Value = root offset + string offset, then repeat for global notes
const calcNote = (f: number, offset: number, scale: Scale) => {
  let offsetNoteValue = (f + offset) % Note.NUM_NOTES;

  // Check if Note exists for current fret number
  let note = filter(
    scale.Notes,
    (note: Note) => note.Modified == offsetNoteValue
  );
  return note.length ? note[0] : null;
};

export const StringComponent: React.FunctionComponent<StringProps> = ({
  fretmode,
  frets,
  offset,
  scale,
}) => {
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
            root={note?.Value == scale.Root.Value}
          />
        );
      })}
    </div>
  );
};
