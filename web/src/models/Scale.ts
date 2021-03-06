import { each, every, filter, indexOf, last, map } from 'lodash';
import { Chord, Mode, Note } from '.';
import { ApiEntity } from '../network';
import { NoteUtils } from '../shared';


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


export enum ScaleDegree {
  Tonic = 1,
  Supertonic = 2,
  Mediant = 3,
  Subdominant = 4,
  Dominant = 5,
  Submediant = 6,
  Subtonic = 7,		// in the natual minor scale
  LeadingTone = 7,	// in the major scale
}

export enum ScaleType {
  Diatonic,
  NaturalMinor,
  Chromatic,
  Pentatonic
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

export class Scale extends ApiEntity {

  private _tonic: Note;

  private _mode: Mode

  private _notes: Note[];

  public Type: ScaleType;

  constructor(
    root: Note,
    mode: Mode
  ) {
    super();

    this._tonic = root;
    this._tonic.Degree = 0;

    this._mode = mode;

    this._notes = calcNotes(this._tonic, this._mode);
  }

  get Notes() {
    return this._notes;
  }

  get Tonic(): Note {
    return this._tonic;
  }

  set Tonic(updated: Note) {
    this._tonic = updated;
    this._notes = calcNotes(this._tonic, this._mode);
  }

  get Mode(): Mode {
    return this._mode;
  }

  set Mode(updated: Mode) {
    this._mode = updated;
    this._notes = calcNotes(this._tonic, this._mode);
  }

  public containsNote = (note: Note): boolean => {
    const scaleNotes = NoteUtils.NoteArrayToString(this._notes);
    return indexOf(scaleNotes, note.Label) >= 0;
  }

  public containsChord = (chord: Chord): boolean => {
    const chordNotes = NoteUtils.NoteArrayToString(chord.Tones);
    const keyNotes = NoteUtils.NoteArrayToString(this._notes);

    const found = map(chordNotes, n => indexOf(keyNotes, n) >= 0);
    return every(found);
  }

  public getNoteIndex = (note: Note): number => {
    const scaleNotes = map(this._notes, n => n.Label);
    return indexOf(scaleNotes, note.Label);
  }

  public getNoteFromBaseNote = (note: Note): Note => {
    const result = filter(this._notes, n => n.Base === note.Base);
    return result.length === 1 ? result[0] : null;
  }
}