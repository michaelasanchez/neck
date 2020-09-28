import { filter, map } from "lodash";
import { Key, Mode } from ".";
import { Note } from "./note";
import { Scale } from "./scale";

export enum ChordType {
  Major = '',
  Minor = 'm',
}

export enum ChordModifer {
  None = '',
  Seven = '7',
}

const getTypeLabel = (type: ChordType): any => {
  switch (type) {
    case ChordType.Major:
      return 'Major';
    case ChordType.Minor:
      return 'Minor';
  }
}

// I        tonic
// ii       upertonic
// iii      ediant
// IV       ubdominant
// V        ominant
// vi	      submediant
// viio     leading tone / subtonic
//  / ♭VII

//  I   ii  iii IV  V   vi  viio
//  ----------------------------
//  C   Dm  Em  F   G   Am  Bdim

const getPitches = (type: ChordModifer): number[] => {
  switch (type) {
    case ChordModifer.None:
      return [0, 2, 4];
    case ChordModifer.Seven:
      return [0, 2, 4, 7];
  }
}

const calculatePitches = (scale: Scale, type: ChordType, mod: ChordModifer): Note[] => {
  return map(getPitches(mod), p => {
    const degree = p % scale.Notes.length;
    const noteResult = filter(scale.Notes, n => n.Degree == degree);
    return noteResult[0];
  });
}

export class Chord {

  private _root: Note;
  private _type: ChordType;
  private _modifier: ChordModifer;

  private _keys: Key[];

  private _degree: number;

  private _pitches: Note[];

  constructor(root: Note, type?: ChordType, mod?: ChordModifer) {
    this._root = root;
    this._type = type || ChordType.Major;
    this._modifier = mod || ChordModifer.None;

    const scale = this._type === ChordType.Major
      ? new Scale(root, Mode.Ionian())
      : new Scale(root, Mode.Aeolian());

    this._keys = this._type === ChordType.Minor ? [new Key(this._root).RelativeMajor] : [new Key(this._root)];

    this._pitches = calculatePitches(scale, this._type, this._modifier);
  }

  get Label(): string {
    return `${this._root.Label} ${getTypeLabel(this._type)} ${this._modifier}`
  }

  get Abbreviated(): string {
    return `${this._root.Label}${this._type}${this._modifier}`;
  }

  get Root(): Note {
    return this._root;
  }

  get Type(): ChordType {
    return this._type;
  }

  get Keys(): Key[] {
    return this._keys;
  }

  get Pitches(): Note[] {
    return this._pitches;
  }
}