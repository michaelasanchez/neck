import { filter, map } from "lodash";

import { Key, Mode, Note, Scale } from ".";
import { ApiEntity } from "../network/ApiEntity";

export enum ChordModifier {
  Major,
  Minor,
  Diminished,
  MajorSeventh,
  MinorSeventh,
  DominantSevent,
  Suspended,
  Augmented,
  // Extended,
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

// const getPitches = (mod: ChordModifier): number[] => {
//   switch (mod) {
//     case ChordModifier.Major:
//       return [0, 2, 4];
//     // case ChordModifier.DominantSeventh:
//     //   return [0, 2, 4, 7];
//   }

//   return [];
// }

// const calculatePitches = (scale: Scale, mod: ChordModifier): Note[] => {
//   return map(getPitches(mod), p => {
//     const degree = p % scale.Notes.length;
//     const noteResult = filter(scale.Notes, n => n.Degree == degree);
//     return noteResult[0];
//   });
// }

export class Chord extends ApiEntity {

  public Root: Note;
  public Modifier: ChordModifier;

  public Keys: Key[];

  public Degree: number;

  public Tones: Note[];

  constructor(root: Note, mod: ChordModifier) {
    super();
    
    this.Root = root;
    this.Modifier = mod || ChordModifier.Major;

    // this.Keys = this.Modifier === ChordModifier.Minor
    //   ? [new Key(this.Root).RelativeMajor]
    //   : [new Key(this.Root)];
  }

  get Label(): string {
    return `${this.Root.Label} ${Chord.getModifierLabel(this.Modifier)}`
  }

  get Abbreviated(): string {
    return `${this.Root.Label}${this.Modifier}`;
  }

  get ModifierLabel(): string {
    return Chord.getModifierLabel(this.Modifier);
  }

  // TODO: Figure out where these should go
  static getModifierLabel = (type: ChordModifier): any => {
    switch (type) {
      case ChordModifier.Major:
        return 'Major';
      case ChordModifier.Minor:
        return 'Minor';
    }
  }

  static getModifierAbbreviation = (type: ChordModifier): any => {
    switch (type) {
      case ChordModifier.Major:
        return '';
      case ChordModifier.Minor:
        return 'm';
    }
  }
}