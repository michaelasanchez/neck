import { filter, map } from "lodash";
import { Key, Mode } from ".";
import { Note } from "./note";
import { Scale } from "./scale";

export enum ChordModifier {
  Major = '',
  Minor = 'm',
}

const getModifierLabel = (type: ChordModifier): any => {
  switch (type) {
    case ChordModifier.Major:
      return 'Major';
    case ChordModifier.Minor:
      return 'Minor';
  }
}

// I        tonic
// ii       supertonic
// iii      mediant
// IV       subdominant
// V        dominant
// vi	      submediant
// viio     leading tone (#)
//            / subtonic (b)
//  / ♭VII

//  I   ii  iii IV  V   vi  viio
//  ----------------------------
//  C   Dm  Em  F   G   Am  Bdim

const getPitches = (mod: ChordModifier): number[] => {
  switch (mod) {
    case ChordModifier.Major:
      return [0, 2, 4];
    // case ChordModifier.DominantSeventh:
    //   return [0, 2, 4, 7];
  }

  return [];
}

const calculatePitches = (scale: Scale, mod: ChordModifier): Note[] => {
  return map(getPitches(mod), p => {
    const degree = p % scale.Notes.length;
    const noteResult = filter(scale.Notes, n => n.Degree == degree);
    return noteResult[0];
  });
}

export class Chord {

  private _root: Note;
  private _modifier: ChordModifier;

  private _keys: Key[];

  private _degree: number;

  private _pitches: Note[];

  constructor(root: Note, mod?: ChordModifier) {
    this._root = root;
    this._modifier = mod || ChordModifier.Major;

    const scale = this._modifier === ChordModifier.Major
      ? new Scale(root, Mode.Ionian())
      : new Scale(root, Mode.Aeolian());

    this._keys = this._modifier === ChordModifier.Minor
      ? [new Key(this._root).RelativeMajor]
      : [new Key(this._root)];

    this._pitches = calculatePitches(scale, this._modifier);
  }

  get Label(): string {
    return `${this._root.Label} ${getModifierLabel(this._modifier)}`
  }

  get Abbreviated(): string {
    return `${this._root.Label}${this._modifier}`;
  }

  get Root(): Note {
    return this._root;
  }

  get Keys(): Key[] {
    return this._keys;
  }

  get Pitches(): Note[] {
    return this._pitches;
  }
}