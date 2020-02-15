import * as React from 'react'
import { filter, times } from 'lodash'

import { Fret, FretMode } from './Fret';
import { Scale } from '../../models/Scale';
import { Note } from '../../models/Note';

export interface StringProps {
  mode: FretMode
  frets: number;
  offset: number;
  scale: Scale;
}

export const StringComponent: React.FunctionComponent<StringProps> = ({ mode, frets, offset, scale }) => {
  // Note Value = root offset + string offset, then repeat for global notes
  const calcNote = (f: number) => {
    let offsetNoteValue = (f + offset) % Note.NUM_NOTES;

    // Check if Note exists for current fret number
    let test = filter(scale.Notes, (note: Note) => note.Value == offsetNoteValue);
    return test.length ? test[0] : null;
  }
  return (
    <div className="string">
      <Fret mode={mode} note={calcNote(0)} open={true}/>
      {times(frets, (f) =><Fret mode={mode} note={calcNote(f + 1)} />)}
    </div>
  )
}