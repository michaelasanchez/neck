import * as React from 'react'
import { filter, times } from 'lodash'

import { Fret, FretMode } from './Fret';
import { Scale } from '../../models/Scale';
import { Note } from '../../models/Note';

export interface StringProps {
  fretmode: FretMode
  frets: number;
  offset: number;
  scale: Scale;
}

export const StringComponent: React.FunctionComponent<StringProps> = ({ fretmode, frets, offset, scale }) => {
  // Note Value = root offset + string offset, then repeat for global notes
  const calcNote = (f: number) => {
    let offsetNoteValue = (f + offset) % Note.NUM_NOTES;

    // Check if Note exists for current fret number
    let note = filter(scale.Notes, (note: Note) => note.Value == offsetNoteValue);
    return note.length ? note[0] : null;
  }
  return (
    <div className="string">
      <Fret fretmode={fretmode} note={calcNote(0)} open={true}/>
      {times(frets, (f) =><Fret key={f} fretmode={fretmode} note={calcNote(f + 1)} />)}
    </div>
  )
}