
import { Chord, ChordModifier, ChordType } from "./chord";
import { ChordVariation } from "./ChordVariation";
import { Tuning } from "./Tuning";

export enum ChordFormType {
  MajorForm1,
  MajorForm2,
  MajorForm3,
  MajorForm4,
  MajorForm5,
  MinorForm1,
  MinorForm2,
  Dominant7Form1,
  Dominant7Form2,
  Minor7Form1,
  Minor7Form2
} 

// TODO: this is specific to 6 strings and standard tuning...
export const mapTypeToPositions = (type: ChordFormType): number[] => {
  switch (type) {
    case ChordFormType.MajorForm1:
      // C Shape
      return [null, 3, 2, 0, 1, 0];
    case ChordFormType.MajorForm2:
      // A Shape
      return [null, 0, 2, 2, 2, 0];
    case ChordFormType.MajorForm3:
      // G Shape
      return [3, 2, 0, 0, 0, 3];
    case ChordFormType.MajorForm4:
      // E Shape
      return [0, 2, 2, 1, 0, 0];
    case ChordFormType.MajorForm5:
      // D Shape
      return [null, null, 0, 2, 3, 2];
    case ChordFormType.MinorForm1:
      return [0, 2, 2, 0, 0, 0];
    case ChordFormType.MinorForm2:
      return [null, 0, 2, 2, 1, 0];
    default:
      return [null, null, null, null, null, null];
  }
}



export class ChordForm {

  private _chordType: ChordType;
  private _chordModifier: ChordModifier;

  // constructor(chord: Chord) {
  constructor(type: ChordType, modifier: ChordModifier) {
    this._chordType = type;
    this._chordModifier = modifier;
  }

  public static fromVariation = (chord: Chord, variation: ChordVariation): ChordForm=> {

    

    return null;
  }



  public static AllChordFormTypes() {
    return [
      ChordFormType.MajorForm1,
      ChordFormType.MajorForm2,
      ChordFormType.MajorForm3,
      ChordFormType.MajorForm4,
      ChordFormType.MajorForm5,
      ChordFormType.MinorForm1,
      ChordFormType.MinorForm2,
    ];
  }
}