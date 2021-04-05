import { each, every, filter, indexOf, last, map } from 'lodash';
import { Chord, Note } from '.';
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

export class Scale extends ApiEntity {

  public Type: ScaleType;

  public Tonic: Note;

  public Notes: Note[];

  // public containsNote = (note: Note): boolean => {
  //   const scaleNotes = NoteUtils.NoteArrayToString(this._notes);
  //   return indexOf(scaleNotes, note.Label) >= 0;
  // }

  // public containsChord = (chord: Chord): boolean => {
  //   const chordNotes = NoteUtils.NoteArrayToString(chord.Tones);
  //   const keyNotes = NoteUtils.NoteArrayToString(this._notes);

  //   const found = map(chordNotes, n => indexOf(keyNotes, n) >= 0);
  //   return every(found);
  // }

  // public getNoteIndex = (note: Note): number => {
  //   const scaleNotes = map(this._notes, n => n.Label);
  //   return indexOf(scaleNotes, note.Label);
  // }

  // public getNoteFromBaseNote = (note: Note): Note => {
  //   const result = filter(this._notes, n => n.Base === note.Base);
  //   return result.length === 1 ? result[0] : null;
  // }
}