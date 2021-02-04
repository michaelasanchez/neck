import { filter, map } from "lodash";

import { Key, Mode, Note, Scale } from ".";
import { ApiEntity } from "../network/ApiEntity";

export enum ChordModifier {
  Major,
  Minor,
  Diminished,
  Augmented,
  SuspendedSecond,
  SuspendedFourth,
  MajorSeventh,
  MinorSeventh,
  DominantSeventh,
  DiminishedSeventh,
  AugmentedSeventh,
  // MajorSixth,
  // MinorSixth,
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
  static getModifierLabel = (mod: ChordModifier): any => {
    switch (mod) {
      case ChordModifier.Major:
        return 'Major';
      case ChordModifier.Minor:
        return 'Minor';
      case ChordModifier.Diminished:
        return 'Dim';
      case ChordModifier.Augmented:
        return 'Aug';
      case ChordModifier.SuspendedSecond:
        return 'Sus2';
      case ChordModifier.SuspendedFourth:
        return 'Sus4';
      case ChordModifier.MajorSeventh:
        return 'Maj7';
      case ChordModifier.MinorSeventh:
        return 'Min7';
      case ChordModifier.DominantSeventh:
        return '7';
      case ChordModifier.DiminishedSeventh:
        return 'Dim7';
      case ChordModifier.AugmentedSeventh:
        return 'Aug7';
    }
  }

  static getModifierAbbreviation = (mod: ChordModifier): any => {
    switch (mod) {
      case ChordModifier.Major:
        return 'maj';
      case ChordModifier.Minor:
        return 'min';
      case ChordModifier.Diminished:
        return 'dim';
      case ChordModifier.Augmented:
        return 'aug';
      case ChordModifier.SuspendedSecond:
        return 'sus2';
      case ChordModifier.SuspendedFourth:
        return 'sus4';
      case ChordModifier.MajorSeventh:
        return 'maj7';
      case ChordModifier.MinorSeventh:
        return 'min7';
      case ChordModifier.DominantSeventh:
        return '7';
      case ChordModifier.DiminishedSeventh:
        return 'dim7';
      case ChordModifier.AugmentedSeventh:
        return 'aug7';
    }
  }
}