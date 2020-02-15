import * as React from 'react'
import { filter, times } from 'lodash'

import { Fret } from './Fret';
import { Scale } from '../../models/Scale';
import { Note } from '../../models/Note';

export interface StringProps {
  frets: number;
  offset: number;
  scale: Scale;
}

export class String extends React.Component<StringProps, {}> {

    // Note Value = root offset + string offset, then repeat for global notes
  calcNote(f: number): Note {
    let offsetNoteValue = (f + this.props.offset) % Note.NUM_NOTES;

    // Check if Note exists for current fret number,
    //   otherwise return null
    let test = filter(this.props.scale.Notes, (note: Note) => note.Value == offsetNoteValue);
    return test.length ? test[0] : null;
  }

  render() {

    return (
      <div className="string">
        <Fret note={this.calcNote(0)} open={true}/>
        {times(this.props.frets, (f) => <Fret note={this.calcNote(f + 1)} />)}
      </div>
    );
  }

}