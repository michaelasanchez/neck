import { each, every, filter, indexOf, map } from "lodash";
import { Key, KeyType, Mode } from ".";
import { notesToString } from "../components/Indicators";
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

const notePositionInScale = (note: Note, scale: Scale): number => {
  const scaleNotes = map(scale.Notes, n => n.Label);
  return indexOf(scaleNotes, note.Label);
}

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

    // let scale;
    // if (this._type === ChordType.Minor) {
    //   const key = new Key(this._root, KeyType.Minor);
    //   console.log('relative major', key.RelativeMajor)
    //   scale = new Scale(key.RelativeMajor, Mode.Ionian());
    //   // scale = new Scale(key.RelativeMajor, Mode.Ionian());
    // } else {
    //   scale = new Scale(root, Mode.Ionian());
    // }
    const scale = this._type === ChordType.Major
      ? new Scale(root, Mode.Ionian())
      : new Scale(root, Mode.Dorian());
    this._keys = [new Key(this._root)];

    this._pitches = calculatePitches(scale, this._type, this._modifier);


    // console.log('ROOT', root.Label)
    // console.log('KEY', this._keys[0])
    // console.log('SCALE', notesToString(scale.Notes))
    console.log('PITCHES', this._pitches, notesToString(this._pitches))
  }

  public get Label(): string {
    return `${this._root.Label} ${this._type}${this._modifier}`
  }

  public get Root(): Note {
    return this._root;
  }

  public get Type(): ChordType {
    return this._type;
  }

  public get Pitches(): Note[] {
    return this._pitches;
  }

}