import { each, isUndefined, last } from 'lodash';

import { Note, NoteValue } from "./note";
import { Mode } from './mode';

export class Scale {

  private rootNote: Note;

  private mode: Mode

  private notes: Note[];
  private type: ScaleType;

  constructor(
    root: Note,
    mode: Mode
  ) {
    this.rootNote = root;
    this.mode = mode;
  }

  private calcNotes() {
    let notes = [this.rootNote];

    each(this.mode.Steps, (step: string) => {
      let prevNote = last(notes);
      let nextNote = step == 'w' ? prevNote.WholeStepUp() : prevNote.HalfStepUp();
      nextNote.Degree = notes.length;
      notes.push(nextNote);
    });

    // TODO: better
    notes.pop();

    return notes;
  }

  get Notes() {
    if (isUndefined(this.notes)) this.notes = this.calcNotes();
    return this.notes;
  }

  get Root(): Note {
    return this.rootNote;
  }

  set Root(value: Note) {
    this.rootNote = value;
    this.notes = this.calcNotes();
  }

  get Type(): ScaleType {
    return this.type;
  }

  get Mode(): Mode {
    return this.mode;
  }

  set Mode(value: Mode) {
    this.mode = value;
    this.notes = this.calcNotes();
  }
}

//  C           D           E     F           G           A           B   
//        C#/Db       D#/Eb             F#/Gb       G#/Ab       A#/Bb
//  B#                      Fb    E#                                  Cb
//  0     1     2     3     4     5     6     7     8     9     10    11    

export enum ScaleMode {
  Ionian = 'wwhwwwh', // major
  Dorian = 'whwwwhw',
  Phrygian = 'hwwwhww',
  Lydian = 'wwwhwwh',
  Mixolydian = 'wwhwwhw',
  Aeolian = 'whwwhww', // natural minor
  Locrian = 'hwwhwww'
}

enum ScaleType {
  Chromatic = 12,
  Octatonic = 8,
  Heptatonic = 7,
  Hexatonic = 6,
  Pentatonic = 5,
  Tetratonic = 4,
  Tritonic = 3,
  Ditonic = 2,
  Monotonic = 1,
}