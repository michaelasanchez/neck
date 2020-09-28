import { each, every, filter, indexOf, last, map } from 'lodash';
import { Chord } from '.';
import { NoteUtils } from '../shared';
import { Mode } from './mode';
import { Note } from "./note";

export enum ScaleStep {
  Whole = 'w',
  Half = 'h',
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

// Returns array of notes, starting with the root note
//  then following each step in a given mode
const calcNotes = (root: Note, mode: Mode): Note[] => {
  let notes = [root];

  each(mode.Steps, (step: string) => {
    let prevNote = last(notes);
    let nextNote = step == ScaleStep.Whole ? prevNote.WholeStepUp() : prevNote.HalfStepUp();
    nextNote.Degree = notes.length;
    notes.push(nextNote);
  });

  // TODO: why do we have to remove the last one here?
  notes.pop();

  return notes;
}

export class Scale {

  private _root: Note;

  private _mode: Mode

  private _notes: Note[];
  // private _type: ScaleType;

  constructor(
    root: Note,
    mode: Mode
  ) {
    this._root = root;
    this._root.Degree = 0;

    this._mode = mode;

    this._notes = calcNotes(this._root, this._mode);
  }

  get Notes() {
    return this._notes;
  }

  get Root(): Note {
    return this._root;
  }

  set Root(updated: Note) {
    this._root = updated;
    this._notes = calcNotes(this._root, this._mode);
  }

  // get Type(): ScaleType {
  //   return this._type;
  // }

  get Mode(): Mode {
    return this._mode;
  }

  set Mode(updated: Mode) {
    this._mode = updated;
    this._notes = calcNotes(this._root, this._mode);
  }

  public containsNote = (note: Note): boolean => {
    const scaleNotes = NoteUtils.toString(this._notes);
    return indexOf(scaleNotes, note.Label) >= 0;
  }

  public containsChord = (chord: Chord): boolean => {
    const chordNotes = NoteUtils.toString(chord.Pitches);
    const keyNotes = NoteUtils.toString(this._notes);

    const found = map(chordNotes, n => indexOf(keyNotes, n) >= 0);
    return every(found);
  }

  public getNoteIndex = (note: Note): number => {
    const scaleNotes = map(this._notes, n => n.Label);
    return indexOf(scaleNotes, note.Label);
  }

  public getTranslatedNote = (note: Note): Note => {
    const result = filter(this._notes, n => n.Base === note.Base);
    return result.length === 1 ? result[0] : null;
  }
}